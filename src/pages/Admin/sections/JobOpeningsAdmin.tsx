import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { uploadFile } from '../../../lib/storage';

export interface JobOpeningDoc {
  id: string;
  department: string;
  title: string;
  type: string;
  qualification: string;
  description?: string;
  templateUrl?: string;
  templateName?: string;
  order: number;
}

const EMPTY: Omit<JobOpeningDoc, 'id'> = { department: '', title: '', type: 'Teaching', qualification: '', description: '', templateUrl: '', templateName: '', order: 0 };

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

  const startEdit = (o: JobOpeningDoc) => { setEditing(o.id); setForm({ ...EMPTY, department: o.department, title: o.title, type: o.type, qualification: o.qualification, description: o.description || '', templateUrl: o.templateUrl || '', templateName: o.templateName || '', order: o.order }); };

  const uploadTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.docx')) return alert('Template must be a .docx file.');
    try {
      const { url } = await uploadFile(f, 'vwu/career-templates');
      setForm((p) => ({ ...p, templateUrl: url, templateName: f.name }));
    } catch (err) {
      alert(`Couldn't upload: ${(err as Error).message}`);
    }
  };

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
            <label htmlFor="field-department">Department *</label>
            <input id="field-department" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Computer Science & Engineering" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-role-title">Role Title *</label>
            <input id="field-role-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Assistant Professor" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-type">Type</label>
            <select id="field-type" value={form.type} onChange={(e) => set('type', e.target.value)}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-qualification">Qualification</label>
            <input id="field-qualification" value={form.qualification} onChange={(e) => set('qualification', e.target.value)} placeholder="M.Tech. in CSE / IT / AI (Ph.D. pursuing preferred)" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Responsibilities, requirements, how to apply…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-template">Data format template (.docx)</label>
            <input id="field-template" type="file" accept=".docx" onChange={uploadTemplate} />
            {form.templateUrl && <small>Current: <a href={form.templateUrl} target="_blank" rel="noopener noreferrer">{form.templateName || 'template.docx'}</a></small>}
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
