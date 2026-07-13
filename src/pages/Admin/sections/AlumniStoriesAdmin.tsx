import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';

interface AlumniStory {
  id: string;
  name: string;
  year: string;
  role: string;
  quote: string;
  imageUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<AlumniStory, 'id'> = {
  name: '', year: '', role: '', quote: '', imageUrl: '', storagePath: '', order: 0,
};

const DEFAULTS: Omit<AlumniStory, 'id'>[] = [
  {
    name: 'Priya Reddy', year: "Class of '18", role: 'Senior Software Engineer, Amazon Web Services',
    quote: 'The technical depth and self-assurance VWU built in me were what made a top-tier product company role possible. My faculty and the placement team deserve real credit for that.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', storagePath: '', order: 0,
  },
  {
    name: 'Sravani Devi', year: "Class of '20", role: 'VLSI Design Engineer, Intel Corporation',
    quote: 'VWU\'s ECE labs and research guidance gave me the grounding for an international career. The Vishnu Japan Outreach Centre, in particular, opened doors I had not anticipated.',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', storagePath: '', order: 1,
  },
  {
    name: 'Lakshmi Prasanna', year: "Class of '22", role: 'Data Scientist, Microsoft India',
    quote: 'The AI & Data Science curriculum at VWU is genuinely current. The project-based learning and the industry network we built here were decisive in landing my placement.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', storagePath: '', order: 2,
  },
];

export default function AlumniStoriesAdmin() {
  const { docs: items, loading } = useOrderedCollection<AlumniStory>('alumniStories', 'order');
  const [form, setForm] = useState<Omit<AlumniStory, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.name || !form.quote) return alert('Name and quote are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'alumniStories', editing), { ...form });
      } else {
        await addDoc(collection(db, 'alumniStories'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (s: AlumniStory) => {
    setEditing(s.id);
    setForm({ name: s.name, year: s.year, role: s.role, quote: s.quote, imageUrl: s.imageUrl, storagePath: s.storagePath, order: s.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    try {
      await deleteDoc(doc(db, 'alumniStories', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm('Add the original set of alumni stories as a starting point?')) return;
    try {
      for (const d of DEFAULTS) {
        await addDoc(collection(db, 'alumniStories'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter stories: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Story' : 'Add Alumni Story'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Photo</label>
            <ImageUploader folder="vwu/alumni" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
          <div className="admin-field">
            <label>Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Priya Reddy" />
          </div>
          <div className="admin-field">
            <label>Batch Year</label>
            <input value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="Class of '18" />
          </div>
          <div className="admin-field">
            <label>Role & Company</label>
            <input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Senior Software Engineer, Amazon" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Quote *</label>
            <textarea rows={3} value={form.quote} onChange={(e) => set('quote', e.target.value)} placeholder="What this alumna has to say about VWU…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Story'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Stories ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id}>
                    <td>{s.imageUrl ? <img src={s.imageUrl} alt="" className="admin-table__avatar" /> : '👤'}</td>
                    <td>{s.name}<br /><small>{s.year}</small></td>
                    <td>{s.role}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(s)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-empty">
                      No stories yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults}>Add starter stories</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
