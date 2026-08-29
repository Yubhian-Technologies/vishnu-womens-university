import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { PROGRAM_ICON_NAMES } from '../../../lib/programIcons';

// Backs the "Academic Departments" card grid on Academics.tsx — independent
// of the `programs` collection, so a department's card copy doesn't have to
// borrow one specific program's name/about text (which broke down once a
// department groups more than one program, e.g. AI&ML + AI&DS under "AI").
export interface DepartmentDoc {
  id: string;
  title: string;
  shortCode: string;
  description: string;
  icon: string;
  order: number;
}

const EMPTY: Omit<DepartmentDoc, 'id'> = { title: '', shortCode: '', description: '', icon: 'GraduationCap', order: 0 };

export default function DepartmentsAdmin() {
  const { docs: departments, loading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const [form, setForm] = useState<Omit<DepartmentDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.title || !form.shortCode) return alert('Title and Short Code are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'departments', editing), { ...form });
      } else {
        await addDoc(collection(db, 'departments'), { ...form, order: form.order || departments.length, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: DepartmentDoc) => {
    setEditing(d.id);
    setForm({ title: d.title, shortCode: d.shortCode, description: d.description || '', icon: d.icon || 'GraduationCap', order: d.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this department card?')) return;
    try {
      await deleteDoc(doc(db, 'departments', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Department' : 'Add Department'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Controls the cards in the "Academic Departments" grid on the public Academics page — separate from the
          individual B.Tech/M.Tech programs listed above it.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Computer Science & Engineering" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-short-code">Short Code *</label>
            <input id="field-short-code" value={form.shortCode} onChange={(e) => set('shortCode', e.target.value)} placeholder="CSE" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-icon">Icon</label>
            <select id="field-icon" value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {PROGRAM_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="The Department of Computer Science & Engineering, established in…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Department'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Departments ({departments.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Short Code</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.title}</strong></td>
                    <td><span className="admin-badge" style={{ textTransform: 'none' }}>{d.shortCode}</span></td>
                    <td>{d.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && <tr><td colSpan={4} className="admin-empty">No departments yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
