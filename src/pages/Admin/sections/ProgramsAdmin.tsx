import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { PROGRAM_ICON_NAMES } from '../../../lib/programIcons';

export interface ProgramSemester {
  label: string;
  subjects: string[];
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
  heroImage: string;
  storagePath: string;
  about: string;
  highlights: string[];
  labs: string[];
  outcomes: string[];
  semesters: ProgramSemester[];
  order: number;
}

const EMPTY: Omit<ProgramDoc, 'id'> = {
  slug: '', name: '', shortName: '', icon: 'GraduationCap', category: 'btech', intake: 60,
  established: '', accreditation: '', hod: '', department: '', heroImage: '', storagePath: '', about: '',
  highlights: [], labs: [], outcomes: [], semesters: [], order: 0,
};

const CATEGORIES = ['btech', 'mtech', 'mba', 'phd'];
const DEPARTMENTS = ['CSE', 'AI&ML', 'AI&DS', 'Cyber Security', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA'];

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}
function semestersToText(semesters: ProgramSemester[] = []): string {
  return semesters.map((s) => `${s.label}: ${s.subjects.join(', ')}`).join('\n');
}
function textToSemesters(text: string): ProgramSemester[] {
  return linesToArray(text).map((line) => {
    const [label, rest] = line.split(':');
    return {
      label: (label || '').trim(),
      subjects: (rest || '').split(',').map((x) => x.trim()).filter(Boolean),
    };
  });
}

export default function ProgramsAdmin() {
  const { docs: programs, loading } = useOrderedCollection<ProgramDoc>('programs', 'name');
  const [form, setForm] = useState<Omit<ProgramDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | string[] | ProgramSemester[]) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, heroImage: r.url, storagePath: r.path }));

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
    } finally { setSaving(false); }
  };

  const startEdit = (p: ProgramDoc) => {
    setEditing(p.id);
    setForm({
      slug: p.slug, name: p.name, shortName: p.shortName, icon: p.icon || 'GraduationCap',
      category: p.category, intake: p.intake, established: p.established, accreditation: p.accreditation,
      hod: p.hod, department: p.department || '', heroImage: p.heroImage, storagePath: p.storagePath, about: p.about,
      highlights: p.highlights || [], labs: p.labs || [], outcomes: p.outcomes || [],
      semesters: p.semesters || [], order: p.order || 0,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    await deleteDoc(doc(db, 'programs', id));
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
          <div className="admin-field admin-field--full">
            <label>Semester-wise Syllabus (one per line: "Semester I: Subject A, Subject B")</label>
            <textarea rows={9} value={semestersToText(form.semesters)} onChange={(e) => set('semesters', textToSemesters(e.target.value))} placeholder="Semester I: Engineering Mathematics I, Engineering Physics" />
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
