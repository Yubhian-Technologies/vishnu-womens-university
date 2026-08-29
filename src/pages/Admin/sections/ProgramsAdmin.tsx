import { useEffect, useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { PROGRAM_ICON_NAMES } from '../../../lib/programIcons';
import DepartmentNewsManager from './DepartmentNewsManager';

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
  order: number;
}

const EMPTY: Omit<ProgramDoc, 'id'> = {
  slug: '', name: '', shortName: '', icon: 'GraduationCap', category: 'btech', intake: 60,
  established: '', accreditation: '', hod: '', department: '', fee: '', heroImage: '', storagePath: '', about: '',
  highlights: [], labs: [], outcomes: [], semesters: [],
  vision: '', mission: [], coreValues: [], peos: [], pos: [], psos: [],
  hodMessage: '', hodImage: '', hodImageStoragePath: '', hodEmail: '', hodResearchProfiles: [],
  mindMapImage: '', mindMapImageStoragePath: '',
  order: 0,
};

const CATEGORIES = ['btech', 'mtech', 'mba', 'phd'];
// Display-only labels — the stored `category` value stays lowercase since
// public pages (e.g. Academics.tsx) filter on it directly.
const CATEGORY_LABELS: Record<string, string> = { btech: 'B.Tech', mtech: 'M.Tech', mba: 'MBA', phd: 'Ph.D.' };
const DEPARTMENTS = ['CSE', 'AI', 'Cyber Security', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA'];

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
  const { docs: programs, loading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const [form, setForm] = useState<Omit<ProgramDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Drag-to-reorder for the programs table — grouped by category (B.Tech,
  // M.Tech, MBA, Ph.D. each get their own list) since that's how the public
  // Academics page's tabs filter and display them: `order` only needs to be
  // consistent within a category, not across all four.
  const [groupedOrdered, setGroupedOrdered] = useState<Record<string, ProgramDoc[]>>({});
  const [drag, setDrag] = useState<{ cat: string; index: number } | null>(null);
  useEffect(() => {
    const groups: Record<string, ProgramDoc[]> = {};
    CATEGORIES.forEach((c) => { groups[c] = []; });
    programs.forEach((p) => { (groups[p.category] ??= []).push(p); });
    setGroupedOrdered(groups);
  }, [programs]);

  const handleDragOver = (cat: string, i: number) => {
    if (!drag || drag.cat !== cat || drag.index === i) return;
    setGroupedOrdered((prev) => {
      const list = [...(prev[cat] || [])];
      const [moved] = list.splice(drag.index, 1);
      list.splice(i, 0, moved);
      return { ...prev, [cat]: list };
    });
    setDrag({ cat, index: i });
  };
  const handleDrop = async (cat: string) => {
    setDrag(null);
    const list = groupedOrdered[cat] || [];
    const batch = writeBatch(db);
    let changed = false;
    list.forEach((p, i) => {
      if (p.order !== i) { batch.update(doc(db, 'programs', p.id), { order: i }); changed = true; }
    });
    if (changed) {
      try {
        await batch.commit();
      } catch (e) {
        alert(`Couldn't save new order: ${(e as Error).message}`);
      }
    }
  };

  const set = (k: string, v: string | number | string[] | ProgramSemester[] | ProgramLink[]) => setForm((p) => ({ ...p, [k]: v }));
  const handleHodImage = (r: UploadResult) => setForm((p) => ({ ...p, hodImage: r.url, hodImageStoragePath: r.path }));
  const handleMindMapImage = (r: UploadResult) => setForm((p) => ({ ...p, mindMapImage: r.url, mindMapImageStoragePath: r.path }));

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
        await addDoc(collection(db, 'programs'), { ...form, order: form.order || programs.filter((p) => p.category === form.category).length, createdAt: serverTimestamp() });
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
            <label htmlFor="field-full-name">Full Name *</label>
            <input id="field-full-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="B.Tech Computer Science and Engineering" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-short-name">Short Name</label>
            <input id="field-short-name" value={form.shortName} onChange={(e) => set('shortName', e.target.value)} placeholder="B.Tech CSE" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-slug-used-in-url">Slug (used in URL) *</label>
            <input id="field-slug-used-in-url" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="cse" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-icon">Icon</label>
            <select id="field-icon" value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {PROGRAM_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-category">Category</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-intake-seats">Intake (seats)</label>
            <input id="field-intake-seats" type="number" value={form.intake} onChange={(e) => set('intake', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-established-year">Established Year</label>
            <input id="field-established-year" value={form.established} onChange={(e) => set('established', e.target.value)} placeholder="2000" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-accreditation">Accreditation</label>
            <input id="field-accreditation" value={form.accreditation} onChange={(e) => set('accreditation', e.target.value)} placeholder="NBA Tier-I Accredited" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-annual-fee">Annual Fee</label>
            <input id="field-annual-fee" value={form.fee} onChange={(e) => set('fee', e.target.value)} placeholder="₹ 1,05,000" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-head-of-department">Head of Department</label>
            <input id="field-head-of-department" value={form.hod} onChange={(e) => set('hod', e.target.value)} placeholder="Dr. Name" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-department-links-this-program-to">Department (links this program to the Faculty page)</label>
            <input id="field-department-links-this-program-to" list="program-departments" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="CSE" />
            <datalist id="program-departments">
              {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
            </datalist>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-about">About</label>
            <textarea id="field-about" rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Department overview…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-highlights-one-per-line">Highlights (one per line)</label>
            <textarea id="field-highlights-one-per-line" rows={5} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} placeholder="NBA Tier-I Accredited undergraduate programme" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-labs-one-per-line">Labs (one per line)</label>
            <textarea id="field-labs-one-per-line" rows={5} value={arrayToLines(form.labs)} onChange={(e) => set('labs', linesToArray(e.target.value))} placeholder="Advanced Computing Lab" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-career-outcomes-one-per-line">Career Outcomes (one per line)</label>
            <textarea id="field-career-outcomes-one-per-line" rows={5} value={arrayToLines(form.outcomes)} onChange={(e) => set('outcomes', linesToArray(e.target.value))} placeholder="Software Engineer / Developer" />
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
            <label htmlFor="field-vision">Vision</label>
            <textarea id="field-vision" rows={3} value={form.vision} onChange={(e) => set('vision', e.target.value)} placeholder="To be a centre of excellence in…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-mission-one-point-per-line">Mission (one point per line)</label>
            <textarea id="field-mission-one-point-per-line" rows={4} value={arrayToLines(form.mission)} onChange={(e) => set('mission', linesToArray(e.target.value))} placeholder="To impart quality technical education…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-core-values-one-per-line">Core Values (one per line)</label>
            <textarea id="field-core-values-one-per-line" rows={3} value={arrayToLines(form.coreValues)} onChange={(e) => set('coreValues', linesToArray(e.target.value))} placeholder="Integrity" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>PEOs, POs & PSOs</h3></div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-programme-educational-objectives-peos-one">Programme Educational Objectives — PEOs (one per line)</label>
            <textarea id="field-programme-educational-objectives-peos-one" rows={4} value={arrayToLines(form.peos)} onChange={(e) => set('peos', linesToArray(e.target.value))} placeholder="Graduates will excel in…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-programme-outcomes-pos-one-per">Programme Outcomes — POs (one per line)</label>
            <textarea id="field-programme-outcomes-pos-one-per" rows={5} value={arrayToLines(form.pos)} onChange={(e) => set('pos', linesToArray(e.target.value))} placeholder="Engineering knowledge…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-programme-specific-outcomes-psos-one">Programme Specific Outcomes — PSOs (one per line)</label>
            <textarea id="field-programme-specific-outcomes-psos-one" rows={4} value={arrayToLines(form.psos)} onChange={(e) => set('psos', linesToArray(e.target.value))} placeholder="Ability to apply…" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>About HOD</h3></div>
          <div className="admin-field admin-field--full">
            <label>HOD Photo</label>
            <ImageUploader folder="vwu/programs/hod" currentUrl={form.hodImage} onUploaded={handleHodImage} label="Upload HOD Photo" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-hod-email">HOD Email</label>
            <input id="field-hod-email" type="email" value={form.hodEmail} onChange={(e) => set('hodEmail', e.target.value)} placeholder="hodcse@vwu.ac.in" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-hod-message-profile">HOD Message / Profile</label>
            <textarea id="field-hod-message-profile" rows={5} value={form.hodMessage} onChange={(e) => set('hodMessage', e.target.value)} placeholder="A brief message or profile from the Head of Department…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-hod-research-profiles-one-per">HOD Research Profiles (one per line: "Google Scholar: https://…")</label>
            <textarea id="field-hod-research-profiles-one-per" rows={4} value={linksToText(form.hodResearchProfiles)} onChange={(e) => set('hodResearchProfiles', textToLinks(e.target.value))} placeholder="Google Scholar: https://scholar.google.com/citations?user=…" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>Mind Map</h3></div>
          <div className="admin-field admin-field--full">
            <label>Curriculum Mind Map Image</label>
            <ImageUploader folder="vwu/programs/mindmap" currentUrl={form.mindMapImage} onUploaded={handleMindMapImage} label="Upload Mind Map Image" />
          </div>

          <div className="admin-field admin-field--full"><hr /><h3>News & Events</h3></div>
          <div className="admin-field admin-field--full">
            {editing ? (
              <DepartmentNewsManager programSlug={form.slug} />
            ) : (
              <p className="admin-field__hint">Save this program first, then reopen it here to add News &amp; Events.</p>
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
        <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
          Programs are grouped by category, matching the tabs on the public Academics page. Drag rows by the ⠿ handle
          within a category to change the order they appear in on that tab.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : CATEGORIES.map((cat) => {
          const list = groupedOrdered[cat] || [];
          return (
            <div key={cat} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{CATEGORY_LABELS[cat]} ({list.length})</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th></th><th>Name</th><th>Slug</th><th>Intake</th><th>Accreditation</th><th>Actions</th></tr></thead>
                  <tbody>
                    {list.map((p, i) => (
                      <tr
                        key={p.id}
                        draggable
                        onDragStart={() => setDrag({ cat, index: i })}
                        onDragOver={(e) => { e.preventDefault(); handleDragOver(cat, i); }}
                        onDrop={() => handleDrop(cat)}
                        onDragEnd={() => setDrag(null)}
                        style={{ opacity: drag?.cat === cat && drag.index === i ? 0.5 : 1, cursor: 'grab' }}
                      >
                        <td style={{ color: 'var(--color-text-light, #9ca3af)', fontSize: '1.1rem', userSelect: 'none' }}>⠿</td>
                        <td><strong>{p.shortName || p.name}</strong><br /><small>{p.name}</small></td>
                        <td><code>{p.slug}</code></td>
                        <td>{p.intake}</td>
                        <td>{p.accreditation || '—'}</td>
                        <td>
                          <button className="admin-btn admin-btn--sm" onClick={() => startEdit(p)}>Edit</button>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {list.length === 0 && <tr><td colSpan={6} className="admin-empty">No {CATEGORY_LABELS[cat]} programs yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
