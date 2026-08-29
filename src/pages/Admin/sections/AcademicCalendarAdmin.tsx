import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface CalendarEntry {
  id: string;
  event: string;
  date: string;
  order: number;
}

const EMPTY: Omit<CalendarEntry, 'id'> = { event: '', date: '', order: 0 };

export default function AcademicCalendarAdmin() {
  const { docs: entries, loading } = useOrderedCollection<CalendarEntry>('academicCalendar', 'order');
  const [form, setForm] = useState<Omit<CalendarEntry, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.event || !form.date) return alert('Event and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'academicCalendar', editing), { ...form });
      } else {
        await addDoc(collection(db, 'academicCalendar'), { ...form, order: form.order || entries.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (e: CalendarEntry) => { setEditing(e.id); setForm({ event: e.event, date: e.date, order: e.order }); };

  const remove = async (id: string) => {
    if (!confirm('Delete this calendar entry?')) return;
    try {
      await deleteDoc(doc(db, 'academicCalendar', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Entry' : 'Add Calendar Entry'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-event-activity">Event / Activity *</label>
            <input id="field-event-activity" value={form.event} onChange={(e) => set('event', e.target.value)} placeholder="Odd Semester Commencement" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-date">Date *</label>
            <input id="field-date" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="July 15, 2026" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Entry'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Academic Calendar ({entries.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Event</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.order}</td>
                    <td>{e.event}</td>
                    <td>{e.date}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(e)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && <tr><td colSpan={4} className="admin-empty">No calendar entries yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
