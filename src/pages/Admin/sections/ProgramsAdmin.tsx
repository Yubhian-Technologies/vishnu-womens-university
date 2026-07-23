import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
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

  const set = (k: string, v: string | number | string[] | ProgramSemester[] | ProgramLink[]) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, heroImage: r.url, storagePath: r.path }));
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
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Program Image</label>
            <ImageUploader folder="vwu/programs" currentUrl={form.heroImage} onUploaded={handleImage} label="Upload Program Image" />
          </div>
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
