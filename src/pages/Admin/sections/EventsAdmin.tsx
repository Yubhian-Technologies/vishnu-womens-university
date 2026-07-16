import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface EventDoc {
  id: string;
  title: string;
  month: string;
  day: string;
  year: string;
  time: string;
  location: string;
  category: string;
  desc: string;
  featured: boolean;
  order: number;
}

const EMPTY: Omit<EventDoc, 'id'> = {
  title: '', month: '', day: '', year: '', time: '', location: '', category: 'Academic Events', desc: '', featured: false, order: 0,
};

const CATEGORIES = ['Special Events', 'Academic Events', 'Placements', 'Admissions', 'Alumni Events', 'Sports'];

export default function EventsAdmin() {
  const { docs: events, loading } = useOrderedCollection<EventDoc>('events', 'order');
  const [form, setForm] = useState<Omit<EventDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title || !form.month || !form.day) return alert('Title, month, and day are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'events', editing), { ...form });
      } else {
        await addDoc(collection(db, 'events'), { ...form, order: form.order || events.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (e: EventDoc) => {
    setEditing(e.id);
    setForm({ title: e.title, month: e.month, day: e.day, year: e.year, time: e.time, location: e.location, category: e.category, desc: e.desc, featured: e.featured, order: e.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Event' : 'Add Event'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>Featured events also show in the "Upcoming at VWU" strip on the Home page.</p>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Technova2026 National Technical Symposium" />
          </div>
          <div className="admin-field">
            <label>Month *</label>
            <input value={form.month} onChange={(e) => set('month', e.target.value.toUpperCase())} placeholder="MAY" maxLength={3} />
          </div>
          <div className="admin-field">
            <label>Day *</label>
            <input value={form.day} onChange={(e) => set('day', e.target.value)} placeholder="20" />
          </div>
          <div className="admin-field">
            <label>Year</label>
            <input value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2026" />
          </div>
          <div className="admin-field">
            <label>Time</label>
            <input value={form.time} onChange={(e) => set('time', e.target.value)} placeholder="9:00 AM IST" />
          </div>
          <div className="admin-field">
            <label>Location</label>
            <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="VWU Main Auditorium, Bhimavaram" />
          </div>
          <div className="admin-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>Featured</label>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span>Show on Home page</span>
            </label>
          </div>
          <div className="admin-field admin-field--full">
            <label>Description</label>
            <textarea rows={3} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Event description…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Event'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Events ({events.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td>{e.month} {e.day}, {e.year}</td>
                    <td>{e.title}</td>
                    <td><span className="admin-badge">{e.category}</span></td>
                    <td>{e.featured ? '✅' : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(e)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && <tr><td colSpan={5} className="admin-empty">No events yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
