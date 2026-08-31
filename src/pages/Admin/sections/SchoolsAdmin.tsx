import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import type { DepartmentDoc } from './DepartmentsAdmin';

// Backs the "Schools" grid on the public /academics/schools page — each
// school groups a subset of the existing `departments` collection docs
// (referenced by id) under its own title/description, e.g. "School of
// Computing" grouping CSE / AI / Cyber Security's department cards.
export interface SchoolDoc {
  id: string;
  title: string;
  description: string;
  order: number;
  departmentIds: string[];
}

const EMPTY: Omit<SchoolDoc, 'id'> = { title: '', description: '', order: 0, departmentIds: [] };

export default function SchoolsAdmin() {
  const { docs: schools, loading } = useOrderedCollection<SchoolDoc>('schools', 'order');
  const { docs: departments } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const [form, setForm] = useState<Omit<SchoolDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | string[]) => setForm((p) => ({ ...p, [k]: v }));

  const toggleDepartment = (id: string) => {
    set('departmentIds', form.departmentIds.includes(id)
      ? form.departmentIds.filter((d) => d !== id)
      : [...form.departmentIds, id]);
  };

  const save = async () => {
    if (!form.title) return alert('Title is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'schools', editing), { ...form });
      } else {
        await addDoc(collection(db, 'schools'), { ...form, order: form.order || schools.length, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (s: SchoolDoc) => {
    setEditing(s.id);
    setForm({ title: s.title, description: s.description || '', order: s.order, departmentIds: s.departmentIds || [] });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this school?')) return;
    try {
      await deleteDoc(doc(db, 'schools', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit School' : 'Add School'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Controls the "Schools" grid on the public Academics → Schools page. Each school shows its title,
          description, and the department cards you select below (from Admin → Academic Departments).
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="School of Computing" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brings together the university's computing and data-focused departments…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Departments under this school</label>
            {departments.length === 0 ? (
              <p className="admin-field__hint">No departments exist yet — add them under Admin → Academic Departments first.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {departments.map((d) => (
                  <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 400 }}>
                    <input
                      type="checkbox"
                      checked={form.departmentIds.includes(d.id)}
                      onChange={() => toggleDepartment(d.id)}
                    />
                    {d.title} <span className="admin-badge" style={{ textTransform: 'none' }}>{d.shortCode}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add School'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Schools ({schools.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Departments</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {schools.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.title}</strong></td>
                    <td>{(s.departmentIds || []).length}</td>
                    <td>{s.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(s)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {schools.length === 0 && <tr><td colSpan={4} className="admin-empty">No schools yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
