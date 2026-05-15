import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import CloudinaryUploader from '../../../components/CloudinaryUploader/CloudinaryUploader';
import type { CloudinaryResult } from '../../../lib/cloudinary';

interface Program {
  id: string;
  name: string;
  shortName: string;
  category: string;
  intake: number;
  established: string;
  accreditation: string;
  hod: string;
  about: string;
  imageUrl: string;
  publicId: string;
}

const EMPTY: Omit<Program, 'id'> = {
  name: '', shortName: '', category: 'btech', intake: 60,
  established: '', accreditation: '', hod: '', about: '', imageUrl: '', publicId: '',
};

const CATEGORIES = ['btech', 'mtech', 'mba', 'phd'];

export default function ProgramsAdmin() {
  const { docs: programs, loading } = useOrderedCollection<Program>('programs', 'name');
  const [form, setForm] = useState<Omit<Program, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: CloudinaryResult) => setForm((p) => ({ ...p, imageUrl: r.secure_url, publicId: r.public_id }));

  const save = async () => {
    if (!form.name) return alert('Program name is required.');
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

  const startEdit = (p: Program) => {
    setEditing(p.id);
    setForm({ name: p.name, shortName: p.shortName, category: p.category, intake: p.intake,
               established: p.established, accreditation: p.accreditation, hod: p.hod,
               about: p.about, imageUrl: p.imageUrl, publicId: p.publicId });
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
            <CloudinaryUploader folder="vwu/programs" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Program Image" />
          </div>
          <div className="admin-field">
            <label>Full Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="B.Tech Computer Science and Engineering" />
          </div>
          <div className="admin-field">
            <label>Short Name</label>
            <input value={form.shortName} onChange={(e) => set('shortName', e.target.value)} placeholder="CSE" />
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
            <input value={form.accreditation} onChange={(e) => set('accreditation', e.target.value)} placeholder="NBA" />
          </div>
          <div className="admin-field">
            <label>Head of Department</label>
            <input value={form.hod} onChange={(e) => set('hod', e.target.value)} placeholder="Dr. Name" />
          </div>
          <div className="admin-field admin-field--full">
            <label>About</label>
            <textarea rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Department overview…" />
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
              <thead><tr><th>Name</th><th>Type</th><th>Intake</th><th>Accreditation</th><th>Actions</th></tr></thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.shortName || p.name}</strong><br /><small>{p.name}</small></td>
                    <td><span className="admin-badge">{p.category.toUpperCase()}</span></td>
                    <td>{p.intake}</td>
                    <td>{p.accreditation || '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {programs.length === 0 && <tr><td colSpan={5} className="admin-empty">No programs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
