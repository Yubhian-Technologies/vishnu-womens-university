import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface HolidayEntry {
  id: string;
  name: string;
  date: string;
  order: number;
}

const EMPTY: Omit<HolidayEntry, 'id'> = { name: '', date: '', order: 0 };

export default function HolidaysAdmin() {
  const { docs: holidays, loading } = useOrderedCollection<HolidayEntry>('holidays', 'order');
  const [form, setForm] = useState<Omit<HolidayEntry, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name || !form.date) return alert('Name and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'holidays', editing), { ...form });
      } else {
        await addDoc(collection(db, 'holidays'), { ...form, order: form.order || holidays.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (h: HolidayEntry) => { setEditing(h.id); setForm({ name: h.name, date: h.date, order: h.order }); };

  const remove = async (id: string) => {
    if (!confirm('Delete this holiday?')) return;
    try {
      await deleteDoc(doc(db, 'holidays', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Holiday' : 'Add Holiday'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>Date must be in "Month Day, Year" format (e.g. "March 30, 2026") — the public page parses the month and day out of this string.</p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Holiday Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ugadi (Telugu New Year)" />
          </div>
          <div className="admin-field">
            <label>Date *</label>
            <input value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="March 30, 2026" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Holiday'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Holidays ({holidays.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Name</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h.id}>
                    <td>{h.order}</td>
                    <td>{h.name}</td>
                    <td>{h.date}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(h)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(h.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {holidays.length === 0 && <tr><td colSpan={4} className="admin-empty">No holidays yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
