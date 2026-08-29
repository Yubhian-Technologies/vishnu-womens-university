import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

interface AlumniEvent {
  id: string;
  title: string;
  date: string;
  desc: string;
  order: number;
}

const EMPTY: Omit<AlumniEvent, 'id'> = { title: '', date: '', desc: '', order: 0 };

const DEFAULTS: Omit<AlumniEvent, 'id'>[] = [
  { title: 'Annual Alumni Meet', date: 'January 2027', desc: 'The annual reunion that brings graduates back to the VWU campus for networking, catching up with batchmates, and celebrating shared milestones.', order: 0 },
  { title: 'Alumni Career Talk Series', date: 'Ongoing 2026', desc: 'Share your career story with current students and offer the kind of perspective that only real-world experience provides.', order: 1 },
  { title: 'Regional Alumni Meetups', date: 'Ongoing', desc: 'Meet fellow VWU graduates at informal gatherings held in cities across India — including Hyderabad, Bangalore, and Chennai.', order: 2 },
  { title: 'Graduation Day Felicitation', date: 'December 2026', desc: 'Recognise and honour the achievements of outstanding alumni at the annual Graduation Day ceremony.', order: 3 },
];

export default function AlumniEventsAdmin() {
  const { docs: items, loading } = useOrderedCollection<AlumniEvent>('alumniEvents', 'order');
  const [form, setForm] = useState<Omit<AlumniEvent, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title || !form.date) return alert('Title and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'alumniEvents', editing), { ...form });
      } else {
        await addDoc(collection(db, 'alumniEvents'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (e: AlumniEvent) => {
    setEditing(e.id);
    setForm({ title: e.title, date: e.date, desc: e.desc, order: e.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'alumniEvents', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm('Add the original set of alumni events as a starting point?')) return;
    try {
      for (const d of DEFAULTS) {
        await addDoc(collection(db, 'alumniEvents'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter events: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Event' : 'Add Alumni Event'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Annual Alumni Meet" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-date">Date *</label>
            <input id="field-date" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="January 2027" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={3} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Short description shown on the card…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Event'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Events ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Date</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id}>
                    <td>{e.title}</td>
                    <td>{e.date}</td>
                    <td>{e.desc}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(e)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-empty">
                      No events yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults}>Add starter events</button>
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
