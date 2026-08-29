import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import FileUploader from '../../../components/FileUploader/FileUploader';
import type { UploadResult } from '../../../lib/storage';
import { PROGRAM_ICON_NAMES } from '../../../lib/programIcons';

export interface ProgramSubject {
  title: string;
  code?: string;
  credits?: number;
}

export interface ProgramSemester {
  label: string;
  subjects: ProgramSubject[];
}

// Older programme docs stored subjects as plain strings — normalize either
// shape to the richer one at read time so existing data keeps working
// without a migration, both here and in <ProgrammeStructure>.
export function normalizeSubject(s: string | ProgramSubject): ProgramSubject {
  return typeof s === 'string' ? { title: s } : s;
}

export interface ProgramLink {
  label: string;
  url: string;
}

export interface LibraryItem {
  label: string;
  value: string;
}

export interface LibrarySection {
  heading: string;
  items: LibraryItem[];
}

// `cells` wraps each row in an object (not a bare string[]) because Firestore
// rejects arrays nested directly inside arrays — same reason FacultySection's
// table rows do this (see lib/facultySections.ts).
export interface NewsEventRow {
  cells: string[];
}

export interface NewsEventsYear {
  year: string;
  // Admin-defined, in display order — "S.No" is never stored here, it's
  // always generated on the public page.
  columns: string[];
  rows: NewsEventRow[];
}

export interface NewsletterIssue {
  pdfUrl?: string;
  pdfStoragePath?: string;
}

export interface NewsletterYear {
  year: string;
  // Ordered — an issue's "Issue – N" label is always its 1-based position,
  // never stored, so there's nothing to keep in sync when one is removed.
  issues: NewsletterIssue[];
}

export interface ProgramDoc {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  category: string;
  intake: number;
  established: string;
  accreditation: string;
  hod: string;
  department: string;
  fee: string;
  heroImage: string;
  storagePath: string;
  about: string;
  highlights: string[];
  labs: string[];
  outcomes: string[];
  semesters: ProgramSemester[];
  vision: string;
  mission: string[];
  coreValues: string[];
  peos: string[];
  pos: string[];
  psos: string[];
  hodMessage: string;
  hodImage: string;
  hodImageStoragePath: string;
  hodEmail: string;
  hodResearchProfiles: ProgramLink[];
  mindMapImage: string;
  mindMapImageStoragePath: string;
  // Optional — shown as a "Digital Library" section + Quick Links entry on
  // every programme's page (same shared template, not per-branch content,
  // and stored on this programme's own doc so each branch's library data is
  // completely independent of every other's).
  libraryIntro?: string;
  libraryInCharge?: string;
  // Fully admin-defined: any number of sections, each with any number of
  // items — nothing about headings or item names is fixed, so different
  // programmes can have entirely different Digital Library content. Each
  // section renders as its own table on the public page.
  librarySections?: LibrarySection[];
  // Optional — shown as a "News & Events" section + Quick Links entry on
  // every programme's page. Grouped by academic year, each year with its
  // own admin-defined columns and rows — completely independent per
  // programme, and per year within a programme.
  newsEventsYears?: NewsEventsYear[];
  // Optional — shown as a "Newsletter" section + Quick Links entry on every
  // programme's page. Grouped by academic year like News & Events, but each
  // year holds an ordered list of issues, each with its own uploaded PDF.
  newsletterYears?: NewsletterYear[];
  order: number;
}

const EMPTY: Omit<ProgramDoc, 'id'> = {
  slug: '', name: '', shortName: '', icon: 'GraduationCap', category: 'btech', intake: 60,
  established: '', accreditation: '', hod: '', department: '', fee: '', heroImage: '', storagePath: '', about: '',
  highlights: [], labs: [], outcomes: [], semesters: [],
  vision: '', mission: [], coreValues: [], peos: [], pos: [], psos: [],
  hodMessage: '', hodImage: '', hodImageStoragePath: '', hodEmail: '', hodResearchProfiles: [],
  mindMapImage: '', mindMapImageStoragePath: '',
  libraryIntro: '', libraryInCharge: '', librarySections: [],
  newsEventsYears: [],
  newsletterYears: [],
  order: 0,
};

const CATEGORIES = ['btech', 'mtech', 'mba', 'phd'];
const DEPARTMENTS = ['CSE', 'AI&ML', 'AI&DS', 'Cyber Security', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA'];

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}
function linksToText(links: ProgramLink[] = []): string {
  return links.map((l) => `${l.label}: ${l.url}`).join('\n');
}
function textToLinks(text: string): ProgramLink[] {
  return linesToArray(text).map((line) => {
    const idx = line.indexOf(':');
    return {
      label: (idx === -1 ? line : line.slice(0, idx)).trim(),
      url: (idx === -1 ? '' : line.slice(idx + 1)).trim(),
    };
  }).filter((l) => l.label && l.url);
}

export default function ProgramsAdmin() {
  const { docs: programs, loading } = useOrderedCollection<ProgramDoc>('programs', 'name');
  const [form, setForm] = useState<Omit<ProgramDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | string[] | ProgramSemester[] | ProgramLink[] | LibrarySection[] | NewsEventsYear[] | NewsletterYear[]) => setForm((p) => ({ ...p, [k]: v }));
  const handleHodImage = (r: UploadResult) => setForm((p) => ({ ...p, hodImage: r.url, hodImageStoragePath: r.path }));
  const handleMindMapImage = (r: UploadResult) => setForm((p) => ({ ...p, mindMapImage: r.url, mindMapImageStoragePath: r.path }));

  // Digital Library (sections + items) editing — same structured add /
  // remove / reorder shape as Programme Structure above, just for an
  // arbitrary set of "heading + item rows" tables instead of semesters.
  const librarySections = form.librarySections || [];
  const addLibrarySection = () => {
    set('librarySections', [...librarySections, { heading: `Section ${librarySections.length + 1}`, items: [] }]);
  };
  const updateLibrarySectionHeading = (si: number, heading: string) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, heading } : s)));
  };
  const moveLibrarySection = (si: number, dir: -1 | 1) => {
    const next = [...librarySections];
    const target = si + dir;
    if (target < 0 || target >= next.length) return;
    [next[si], next[target]] = [next[target], next[si]];
    set('librarySections', next);
  };
  const removeLibrarySection = (si: number) => {
    if (!confirm('Remove this section and all its items?')) return;
    set('librarySections', librarySections.filter((_, i) => i !== si));
  };
  const addLibraryItem = (si: number) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, items: [...s.items, { label: '', value: '' }] } : s)));
  };
  const updateLibraryItem = (si: number, ji: number, patch: Partial<LibraryItem>) => {
    set('librarySections', librarySections.map((s, i) => (i !== si ? s : {
      ...s,
      items: s.items.map((it, j) => (j === ji ? { ...it, ...patch } : it)),
    })));
  };
  const moveLibraryItem = (si: number, ji: number, dir: -1 | 1) => {
    set('librarySections', librarySections.map((s, i) => {
      if (i !== si) return s;
      const items = [...s.items];
      const target = ji + dir;
      if (target < 0 || target >= items.length) return s;
      [items[ji], items[target]] = [items[target], items[ji]];
      return { ...s, items };
    }));
  };
  const removeLibraryItem = (si: number, ji: number) => {
    set('librarySections', librarySections.map((s, i) => (i === si ? { ...s, items: s.items.filter((_, j) => j !== ji) } : s)));
  };

  // News & Events (academic years, each with its own admin-defined columns
  // + event rows) editing. Columns and rows are kept in sync positionally:
  // adding/removing/reordering a column does the same to every row's cells
  // so a cell always lines up with its column.
  const newsEventsYears = form.newsEventsYears || [];
  const addNewsYear = () => {
    set('newsEventsYears', [...newsEventsYears, { year: '', columns: [], rows: [] }]);
  };
  const updateNewsYearLabel = (yi: number, year: string) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => (i === yi ? { ...y, year } : y)));
  };
  const moveNewsYear = (yi: number, dir: -1 | 1) => {
    const next = [...newsEventsYears];
    const target = yi + dir;
    if (target < 0 || target >= next.length) return;
    [next[yi], next[target]] = [next[target], next[yi]];
    set('newsEventsYears', next);
  };
  const removeNewsYear = (yi: number) => {
    if (!confirm('Remove this academic year and all its events?')) return;
    set('newsEventsYears', newsEventsYears.filter((_, i) => i !== yi));
  };
  const addNewsColumn = (yi: number) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => (i !== yi ? y : {
      ...y,
      columns: [...y.columns, `Column ${y.columns.length + 1}`],
      rows: y.rows.map((r) => ({ cells: [...r.cells, ''] })),
    })));
  };
  const updateNewsColumnLabel = (yi: number, ci: number, label: string) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => (i !== yi ? y : { ...y, columns: y.columns.map((c, j) => (j === ci ? label : c)) })));
  };
  const moveNewsColumn = (yi: number, ci: number, dir: -1 | 1) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => {
      if (i !== yi) return y;
      const target = ci + dir;
      if (target < 0 || target >= y.columns.length) return y;
      const columns = [...y.columns];
      [columns[ci], columns[target]] = [columns[target], columns[ci]];
      const rows = y.rows.map((r) => {
        const cells = [...r.cells];
        [cells[ci], cells[target]] = [cells[target], cells[ci]];
        return { cells };
      });
      return { ...y, columns, rows };
    }));
  };
  const removeNewsColumn = (yi: number, ci: number) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => (i !== yi ? y : {
      ...y,
      columns: y.columns.filter((_, j) => j !== ci),
      rows: y.rows.map((r) => ({ cells: r.cells.filter((_, j) => j !== ci) })),
    })));
  };
  const addNewsRow = (yi: number) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => (i !== yi ? y : { ...y, rows: [...y.rows, { cells: y.columns.map(() => '') }] })));
  };
  const updateNewsCell = (yi: number, ri: number, ci: number, value: string) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => (i !== yi ? y : {
      ...y,
      rows: y.rows.map((r, j) => (j !== ri ? r : { cells: r.cells.map((c, k) => (k === ci ? value : c)) })),
    })));
  };
  const moveNewsRow = (yi: number, ri: number, dir: -1 | 1) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => {
      if (i !== yi) return y;
      const target = ri + dir;
      if (target < 0 || target >= y.rows.length) return y;
      const rows = [...y.rows];
      [rows[ri], rows[target]] = [rows[target], rows[ri]];
      return { ...y, rows };
    }));
  };
  const removeNewsRow = (yi: number, ri: number) => {
    set('newsEventsYears', newsEventsYears.map((y, i) => (i !== yi ? y : { ...y, rows: y.rows.filter((_, j) => j !== ri) })));
  };

  // Newsletter (academic years, each with an ordered list of PDF-backed
  // issues) editing. An issue's "Issue – N" label is always its position,
  // so removing one just shifts the rest down — nothing to relabel.
  const newsletterYears = form.newsletterYears || [];
  const addNewsletterYear = () => {
    set('newsletterYears', [...newsletterYears, { year: '', issues: [] }]);
  };
  const updateNewsletterYearLabel = (yi: number, year: string) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i === yi ? { ...y, year } : y)));
  };
  const moveNewsletterYear = (yi: number, dir: -1 | 1) => {
    const next = [...newsletterYears];
    const target = yi + dir;
    if (target < 0 || target >= next.length) return;
    [next[yi], next[target]] = [next[target], next[yi]];
    set('newsletterYears', next);
  };
  const removeNewsletterYear = (yi: number) => {
    if (!confirm('Remove this academic year and all its issues?')) return;
    set('newsletterYears', newsletterYears.filter((_, i) => i !== yi));
  };
  const addNewsletterIssue = (yi: number) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i !== yi ? y : { ...y, issues: [...y.issues, {}] })));
  };
  const handleNewsletterIssuePdf = (yi: number, ii: number, r: UploadResult) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i !== yi ? y : {
      ...y,
      issues: y.issues.map((iss, j) => (j === ii ? { pdfUrl: r.url, pdfStoragePath: r.path } : iss)),
    })));
  };
  const removeNewsletterIssuePdf = (yi: number, ii: number) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i !== yi ? y : {
      ...y,
      issues: y.issues.map((iss, j) => (j === ii ? {} : iss)),
    })));
  };
  const moveNewsletterIssue = (yi: number, ii: number, dir: -1 | 1) => {
    set('newsletterYears', newsletterYears.map((y, i) => {
      if (i !== yi) return y;
      const target = ii + dir;
      if (target < 0 || target >= y.issues.length) return y;
      const issues = [...y.issues];
      [issues[ii], issues[target]] = [issues[target], issues[ii]];
      return { ...y, issues };
    }));
  };
  const removeNewsletterIssue = (yi: number, ii: number) => {
    set('newsletterYears', newsletterYears.map((y, i) => (i !== yi ? y : { ...y, issues: y.issues.filter((_, j) => j !== ii) })));
  };

  // Programme Structure (semesters + subjects) editing — structured add /
  // remove / reorder, replacing the old free-text "Semester I: A, B" parser.
  const addSemester = () => {
    set('semesters', [...form.semesters, { label: `Semester ${form.semesters.length + 1}`, subjects: [] }]);
  };
  const updateSemesterLabel = (si: number, label: string) => {
    set('semesters', form.semesters.map((s, i) => (i === si ? { ...s, label } : s)));
  };
  const moveSemester = (si: number, dir: -1 | 1) => {
    const next = [...form.semesters];
    const target = si + dir;
    if (target < 0 || target >= next.length) return;
    [next[si], next[target]] = [next[target], next[si]];
    set('semesters', next);
  };
  const removeSemester = (si: number) => {
    if (!confirm('Remove this semester and all its subjects?')) return;
    set('semesters', form.semesters.filter((_, i) => i !== si));
  };
  const addSubject = (si: number) => {
    set('semesters', form.semesters.map((s, i) => (i === si ? { ...s, subjects: [...s.subjects, { title: '' }] } : s)));
  };
  const updateSubject = (si: number, ji: number, patch: Partial<ProgramSubject>) => {
    set('semesters', form.semesters.map((s, i) => (i !== si ? s : {
      ...s,
      subjects: s.subjects.map((sub, j) => (j === ji ? { ...sub, ...patch } : sub)),
    })));
  };
  const moveSubject = (si: number, ji: number, dir: -1 | 1) => {
    set('semesters', form.semesters.map((s, i) => {
      if (i !== si) return s;
      const subs = [...s.subjects];
      const target = ji + dir;
      if (target < 0 || target >= subs.length) return s;
      [subs[ji], subs[target]] = [subs[target], subs[ji]];
      return { ...s, subjects: subs };
    }));
  };
  const removeSubject = (si: number, ji: number) => {
    set('semesters', form.semesters.map((s, i) => (i === si ? { ...s, subjects: s.subjects.filter((_, j) => j !== ji) } : s)));
  };

  const save = async () => {
    if (!form.name || !form.slug) return alert('Program name and slug are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'programs', editing), { ...form });
      } else {
        await addDoc(collection(db, 'programs'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (p: ProgramDoc) => {
    setEditing(p.id);
    setForm({
      slug: p.slug, name: p.name, shortName: p.shortName, icon: p.icon || 'GraduationCap',
      category: p.category, intake: p.intake, established: p.established, accreditation: p.accreditation,
      hod: p.hod, department: p.department || '', fee: p.fee || '', heroImage: p.heroImage, storagePath: p.storagePath, about: p.about,
      highlights: p.highlights || [], labs: p.labs || [], outcomes: p.outcomes || [],
      semesters: (p.semesters || []).map((s) => ({ label: s.label, subjects: (s.subjects || []).map(normalizeSubject) })),
      vision: p.vision || '', mission: p.mission || [], coreValues: p.coreValues || [],
      peos: p.peos || [], pos: p.pos || [], psos: p.psos || [],
      hodMessage: p.hodMessage || '', hodImage: p.hodImage || '', hodImageStoragePath: p.hodImageStoragePath || '',
      hodEmail: p.hodEmail || '', hodResearchProfiles: p.hodResearchProfiles || [],
      mindMapImage: p.mindMapImage || '', mindMapImageStoragePath: p.mindMapImageStoragePath || '',
      libraryIntro: p.libraryIntro || '', libraryInCharge: p.libraryInCharge || '',
      librarySections: (p.librarySections || []).map((s) => ({ heading: s.heading, items: s.items || [] })),
      newsEventsYears: (p.newsEventsYears || []).map((y) => ({
        year: y.year, columns: y.columns || [], rows: (y.rows || []).map((r) => ({ cells: r.cells || [] })),
      })),
      newsletterYears: (p.newsletterYears || []).map((y) => ({
        year: y.year,
        issues: (y.issues || []).map((iss) => ({ pdfUrl: iss.pdfUrl || '', pdfStoragePath: iss.pdfStoragePath || '' })),
      })),
      order: p.order || 0,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    try {
      await deleteDoc(doc(db, 'programs', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Program' : 'Add Program'}</h2>
        <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
          This program's hero image is now edited from <strong>Hero Banners → Programs</strong>, not here.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Full Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="B.Tech Computer Science and Engineering" />
          </div>
          <div className="admin-field">
            <label>Short Name</label>
            <input value={form.shortName} onChange={(e) => set('shortName', e.target.value)} placeholder="B.Tech CSE" />
          </div>
          <div className="admin-field">
            <label>Slug (used in URL) *</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="cse" />
          </div>
          <div className="admin-field">
            <label>Icon</label>
            <select value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {PROGRAM_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Intake (seats)</label>
            <input type="number" value={form.intake} onChange={(e) => set('intake', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>Established Year</label>
            <input value={form.established} onChange={(e) => set('established', e.target.value)} placeholder="2000" />
          </div>
          <div className="admin-field">
            <label>Accreditation</label>
            <input value={form.accreditation} onChange={(e) => set('accreditation', e.target.value)} placeholder="NBA Tier-I Accredited" />
          </div>
          <div className="admin-field">
            <label>Annual Fee</label>
            <input value={form.fee} onChange={(e) => set('fee', e.target.value)} placeholder="₹ 1,05,000" />
          </div>
          <div className="admin-field">
            <label>Head of Department</label>
            <input value={form.hod} onChange={(e) => set('hod', e.target.value)} placeholder="Dr. Name" />
          </div>
          <div className="admin-field">
            <label>Department (links this program to the Faculty page)</label>
            <input list="program-departments" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="CSE" />
            <datalist id="program-departments">
              {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
            </datalist>
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>About</label>
            <textarea rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Department overview…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Highlights (one per line)</label>
            <textarea rows={5} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} placeholder="NBA Tier-I Accredited undergraduate programme" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Labs (one per line)</label>
            <textarea rows={5} value={arrayToLines(form.labs)} onChange={(e) => set('labs', linesToArray(e.target.value))} placeholder="Advanced Computing Lab" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Career Outcomes (one per line)</label>
            <textarea rows={5} value={arrayToLines(form.outcomes)} onChange={(e) => set('outcomes', linesToArray(e.target.value))} placeholder="Software Engineer / Developer" />
          </div>
          <div className="admin-field admin-field--full"><hr /><h3>Programme Structure (Semester-wise Curriculum)</h3></div>
          <div className="admin-field admin-field--full">
            {form.semesters.map((sem, si) => (
              <div key={si} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    value={sem.label}
                    onChange={(e) => updateSemesterLabel(si, e.target.value)}
                    placeholder="Semester I"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSemester(si, -1)} disabled={si === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSemester(si, 1)} disabled={si === form.semesters.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeSemester(si)}>Remove Semester</button>
                </div>

                {sem.subjects.map((subj, ji) => (
                  <div key={ji} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      value={subj.title}
                      onChange={(e) => updateSubject(si, ji, { title: e.target.value })}
                      placeholder="Subject title"
                      style={{ flex: 2 }}
                    />
                    <input
                      value={subj.code ?? ''}
                      onChange={(e) => updateSubject(si, ji, { code: e.target.value || undefined })}
                      placeholder="Code (optional)"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="number"
                      value={subj.credits ?? ''}
                      onChange={(e) => updateSubject(si, ji, { credits: e.target.value === '' ? undefined : Number(e.target.value) })}
                      placeholder="Credits"
                      style={{ width: 80 }}
                      min={0}
                    />
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSubject(si, ji, -1)} disabled={ji === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveSubject(si, ji, 1)} disabled={ji === sem.subjects.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeSubject(si, ji)}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addSubject(si)}>+ Add Subject</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addSemester}>+ Add Semester</button>
            {form.semesters.length === 0 && (
              <p className="admin-field__hint">No semesters yet — click "Add Semester" to start building this programme's curriculum.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Vision, Mission & Values</h3></div>
          <div className="admin-field admin-field--full">
            <label>Vision</label>
            <textarea rows={3} value={form.vision} onChange={(e) => set('vision', e.target.value)} placeholder="To be a centre of excellence in…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Mission (one point per line)</label>
            <textarea rows={4} value={arrayToLines(form.mission)} onChange={(e) => set('mission', linesToArray(e.target.value))} placeholder="To impart quality technical education…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Core Values (one per line)</label>
            <textarea rows={3} value={arrayToLines(form.coreValues)} onChange={(e) => set('coreValues', linesToArray(e.target.value))} placeholder="Integrity" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>PEOs, POs & PSOs</h3></div>
          <div className="admin-field admin-field--full">
            <label>Programme Educational Objectives — PEOs (one per line)</label>
            <textarea rows={4} value={arrayToLines(form.peos)} onChange={(e) => set('peos', linesToArray(e.target.value))} placeholder="Graduates will excel in…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Programme Outcomes — POs (one per line)</label>
            <textarea rows={5} value={arrayToLines(form.pos)} onChange={(e) => set('pos', linesToArray(e.target.value))} placeholder="Engineering knowledge…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Programme Specific Outcomes — PSOs (one per line)</label>
            <textarea rows={4} value={arrayToLines(form.psos)} onChange={(e) => set('psos', linesToArray(e.target.value))} placeholder="Ability to apply…" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>About HOD</h3></div>
          <div className="admin-field admin-field--full">
            <label>HOD Photo</label>
            <ImageUploader folder="vwu/programs/hod" currentUrl={form.hodImage} onUploaded={handleHodImage} label="Upload HOD Photo" />
          </div>
          <div className="admin-field">
            <label>HOD Email</label>
            <input type="email" value={form.hodEmail} onChange={(e) => set('hodEmail', e.target.value)} placeholder="hodcse@vwu.ac.in" />
          </div>
          <div className="admin-field admin-field--full">
            <label>HOD Message / Profile</label>
            <textarea rows={5} value={form.hodMessage} onChange={(e) => set('hodMessage', e.target.value)} placeholder="A brief message or profile from the Head of Department…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>HOD Research Profiles (one per line: "Google Scholar: https://…")</label>
            <textarea rows={4} value={linksToText(form.hodResearchProfiles)} onChange={(e) => set('hodResearchProfiles', textToLinks(e.target.value))} placeholder="Google Scholar: https://scholar.google.com/citations?user=…" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Mind Map</h3></div>
          <div className="admin-field admin-field--full">
            <label>Curriculum Mind Map Image</label>
            <ImageUploader folder="vwu/programs/mindmap" currentUrl={form.mindMapImage} onUploaded={handleMindMapImage} label="Upload Mind Map Image" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Digital Library</h3></div>
          <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
            Optional. Shown as a "Digital Library" section (and Quick Links entry) on this programme's page, right
            after Laboratories. Each section below becomes its own table on the public page — headings and items
            are entirely up to you, so different programmes can have completely different Digital Library content.
          </p>
          <div className="admin-field admin-field--full">
            <label>Library Overview</label>
            <textarea rows={3} value={form.libraryIntro} onChange={(e) => set('libraryIntro', e.target.value)} placeholder="The Department Library occupies a unique place in academic and research activities of the Department…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>In-charge of Department Library</label>
            <input value={form.libraryInCharge} onChange={(e) => set('libraryInCharge', e.target.value)} placeholder="Dr. P. Ravi Kumar, Ph.D. Associate Professor" />
          </div>
          <div className="admin-field admin-field--full">
            {librarySections.map((sec, si) => (
              <div key={si} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    value={sec.heading}
                    onChange={(e) => updateLibrarySectionHeading(si, e.target.value)}
                    placeholder="Number of Books"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibrarySection(si, -1)} disabled={si === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibrarySection(si, 1)} disabled={si === librarySections.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLibrarySection(si)}>Remove Section</button>
                </div>

                {sec.items.map((item, ji) => (
                  <div key={ji} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <input
                      value={item.label}
                      onChange={(e) => updateLibraryItem(si, ji, { label: e.target.value })}
                      placeholder="Item name"
                      style={{ flex: 2 }}
                    />
                    <input
                      value={item.value}
                      onChange={(e) => updateLibraryItem(si, ji, { value: e.target.value })}
                      placeholder="Count"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibraryItem(si, ji, -1)} disabled={ji === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveLibraryItem(si, ji, 1)} disabled={ji === sec.items.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLibraryItem(si, ji)}>✕</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addLibraryItem(si)}>+ Add Item</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addLibrarySection}>+ Add Section</button>
            {librarySections.length === 0 && (
              <p className="admin-field__hint">No sections yet — click "Add Section" to start building this programme's Digital Library.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>News &amp; Events</h3></div>
          <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
            Optional. Shown as a "News &amp; Events" section (and Quick Links entry) on this programme's page,
            grouped by academic year. Each year has its own columns — define whatever this department needs
            (e.g. "Title", "Date"); "S.No" is added automatically on the public page.
          </p>
          <div className="admin-field admin-field--full">
            {newsEventsYears.map((yr, yi) => (
              <div key={yi} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <input
                    value={yr.year}
                    onChange={(e) => updateNewsYearLabel(yi, e.target.value)}
                    placeholder="2025-26"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsYear(yi, -1)} disabled={yi === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsYear(yi, 1)} disabled={yi === newsEventsYears.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsYear(yi)}>Remove Year</button>
                </div>

                <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Columns</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {yr.columns.map((col, ci) => (
                    <div key={ci} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      <input
                        value={col}
                        onChange={(e) => updateNewsColumnLabel(yi, ci, e.target.value)}
                        placeholder="Column name"
                        style={{ width: 140 }}
                      />
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsColumn(yi, ci, -1)} disabled={ci === 0} title="Move left">←</button>
                      <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsColumn(yi, ci, 1)} disabled={ci === yr.columns.length - 1} title="Move right">→</button>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsColumn(yi, ci)}>✕</button>
                    </div>
                  ))}
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => addNewsColumn(yi)}>+ Add Column</button>
                </div>

                {yr.columns.length === 0 ? (
                  <p className="admin-field__hint">Add at least one column before adding events.</p>
                ) : (
                  <>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Events</label>
                    {yr.rows.map((row, ri) => (
                      <div key={ri} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                        {yr.columns.map((col, ci) => (
                          <input
                            key={ci}
                            value={row.cells[ci] ?? ''}
                            onChange={(e) => updateNewsCell(yi, ri, ci, e.target.value)}
                            placeholder={col || `Column ${ci + 1}`}
                            style={{ flex: 1 }}
                          />
                        ))}
                        <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsRow(yi, ri, -1)} disabled={ri === 0} title="Move up">↑</button>
                        <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsRow(yi, ri, 1)} disabled={ri === yr.rows.length - 1} title="Move down">↓</button>
                        <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsRow(yi, ri)}>✕</button>
                      </div>
                    ))}
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => addNewsRow(yi)}>+ Add Event</button>
                  </>
                )}
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addNewsYear}>+ Add Academic Year</button>
            {newsEventsYears.length === 0 && (
              <p className="admin-field__hint">No academic years yet — click "Add Academic Year" to start building this programme's News &amp; Events.</p>
            )}
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Newsletter</h3></div>
          <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
            Optional. Shown as a "Newsletter" section (and Quick Links entry) on this programme's page. Add an
            academic year, then upload a PDF for each issue under it — "Issue – 1", "Issue – 2", etc. are
            numbered automatically by position, so removing one just shifts the rest down.
          </p>
          <div className="admin-field admin-field--full">
            {newsletterYears.map((yr, yi) => (
              <div key={yi} style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <input
                    value={yr.year}
                    onChange={(e) => updateNewsletterYearLabel(yi, e.target.value)}
                    placeholder="2025-26"
                    style={{ flex: 1, fontWeight: 700 }}
                  />
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterYear(yi, -1)} disabled={yi === 0} title="Move up">↑</button>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterYear(yi, 1)} disabled={yi === newsletterYears.length - 1} title="Move down">↓</button>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsletterYear(yi)}>Remove Year</button>
                </div>

                {yr.issues.map((issue, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    <strong style={{ minWidth: 70 }}>Issue – {ii + 1}</strong>
                    <div style={{ maxWidth: 260 }}>
                      <FileUploader
                        folder="vwu/programs/newsletter"
                        currentUrl={issue.pdfUrl}
                        onUploaded={(r) => handleNewsletterIssuePdf(yi, ii, r)}
                        label="Upload PDF"
                      />
                    </div>
                    {issue.pdfUrl && (
                      <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => removeNewsletterIssuePdf(yi, ii)}>
                        Remove PDF
                      </button>
                    )}
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterIssue(yi, ii, -1)} disabled={ii === 0} title="Move up">↑</button>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveNewsletterIssue(yi, ii, 1)} disabled={ii === yr.issues.length - 1} title="Move down">↓</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeNewsletterIssue(yi, ii)}>Remove Issue</button>
                  </div>
                ))}
                <button type="button" className="admin-btn admin-btn--sm" onClick={() => addNewsletterIssue(yi)}>+ Add Issue</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--primary" onClick={addNewsletterYear}>+ Add Academic Year</button>
            {newsletterYears.length === 0 && (
              <p className="admin-field__hint">No academic years yet — click "Add Academic Year" to start building this programme's Newsletter.</p>
            )}
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update Program' : 'Add Program'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Programs ({programs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Slug</th><th>Type</th><th>Intake</th><th>Accreditation</th><th>Actions</th></tr></thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.shortName || p.name}</strong><br /><small>{p.name}</small></td>
                    <td><code>{p.slug}</code></td>
                    <td><span className="admin-badge">{p.category.toUpperCase()}</span></td>
                    <td>{p.intake}</td>
                    <td>{p.accreditation || '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {programs.length === 0 && <tr><td colSpan={6} className="admin-empty">No programs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
