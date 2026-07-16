import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface JobOpeningDoc {
  id: string;
  department: string;
  title: string;
  type: string;
  qualification: string;
  order: number;
}

const EMPTY: Omit<JobOpeningDoc, 'id'> = { department: '', title: '', type: 'Teaching', qualification: '', order: 0 };

const TYPES = ['Teaching', 'Technical', 'Administrative'];

export default function JobOpeningsAdmin() {
  const { docs: openings, loading } = useOrderedCollection<JobOpeningDoc>('jobOpenings', 'order');
  const [form, setForm] = useState<Omit<JobOpeningDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.department || !form.title) return alert('Department and title are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'jobOpenings', editing), { ...form });
      } else {
        await addDoc(collection(db, 'jobOpenings'), { ...form, order: form.order || openings.length + 1, createdAt: serverTimestamp() });
      }
      setForm({ ...EMPTY, department: form.department }); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (o: JobOpeningDoc) => { setEditing(o.id); setForm({ department: o.department, title: o.title, type: o.type, qualification: o.qualification, order: o.order }); };

  const remove = async (id: string) => {
    if (!confirm('Delete this opening?')) return;
    try {
      await deleteDoc(doc(db, 'jobOpenings', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Opening' : 'Add Job Opening'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Department *</label>
            <input value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Computer Science & Engineering" />
          </div>
          <div className="admin-field">
            <label>Role Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Assistant Professor" />
          </div>
          <div className="admin-field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Qualification</label>
            <input value={form.qualification} onChange={(e) => set('qualification', e.target.value)} placeholder="M.Tech. in CSE / IT / AI (Ph.D. pursuing preferred)" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Opening'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Openings ({openings.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Department</th><th>Role</th><th>Type</th><th>Actions</th></tr></thead>
              <tbody>
                {openings.map((o) => (
                  <tr key={o.id}>
                    <td>{o.department}</td>
                    <td>{o.title}</td>
                    <td><span className="admin-badge admin-badge--sm">{o.type}</span></td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(o)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(o.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {openings.length === 0 && <tr><td colSpan={4} className="admin-empty">No openings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
