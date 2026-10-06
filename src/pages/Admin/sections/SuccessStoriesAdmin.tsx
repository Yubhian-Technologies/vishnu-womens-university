import { useState } from 'react';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDoc, deleteDoc, updateDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface SuccessStoryDoc {
  id: string;
  studentName: string;
  department: string;
  batch: string;
  company: string;
  package: string;
  videoUrl: string;
  order: number;
}

const EMPTY: Omit<SuccessStoryDoc, 'id'> = {
  studentName: '', department: '', batch: '', company: '', package: '', videoUrl: '', order: 0,
};

// Mirrors the hardcoded successStories.data.ts list this page shipped
// with -- shown as the fallback until an admin adds real entries here.
export const DEFAULT_SUCCESS_STORIES: Omit<SuccessStoryDoc, 'id'>[] = [
  { studentName: 'Ms. D. Sri Lakshmi', department: 'Dept. of IT', batch: '2017–21', company: 'Palo Alto Networks', package: '41 LPA', videoUrl: 'https://youtube.com/watch?reload=9&v=C06twtZ0d94&t=4s', order: 1 },
  { studentName: 'Ms. P. Devika Sri', department: 'Dept. of ECE', batch: '2017–21', company: 'Palo Alto Networks', package: '41 LPA', videoUrl: 'https://www.youtube.com/watch?v=QYvtazC8PSc', order: 2 },
];

export const SUCCESS_STORIES_COLLECTION = 'successStories';

export default function SuccessStoriesAdmin() {
  const { docs, loading } = useOrderedCollection<SuccessStoryDoc>(SUCCESS_STORIES_COLLECTION, 'order');
  const [form, setForm] = useState<Omit<SuccessStoryDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.studentName || !form.company) return alert('Student name and company are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, SUCCESS_STORIES_COLLECTION, editing), { ...form });
      } else {
        await addDoc(collection(db, SUCCESS_STORIES_COLLECTION), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: SuccessStoryDoc) => {
    setEditing(d.id);
    setForm({ studentName: d.studentName, department: d.department, batch: d.batch, company: d.company, package: d.package, videoUrl: d.videoUrl, order: d.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this success story?')) return;
    try {
      await deleteDoc(doc(db, SUCCESS_STORIES_COLLECTION, id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm('Add the original 2 success stories to this (currently empty) list?')) return;
    setSeeding(true);
    try {
      await Promise.all(DEFAULT_SUCCESS_STORIES.map((s) => addDoc(collection(db, SUCCESS_STORIES_COLLECTION), { ...s, createdAt: serverTimestamp() })));
    } catch (e) {
      alert(`Couldn't seed defaults: ${(e as Error).message}`);
    } finally { setSeeding(false); }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Success Story' : 'Add Success Story'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Congratulations to Our Placed Students" video spotlights on the Success Stories
          placement page.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-student-name">Student Name *</label>
            <input id="field-student-name" value={form.studentName} onChange={(e) => set('studentName', e.target.value)} placeholder="Ms. D. Sri Lakshmi" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-department">Department</label>
            <input id="field-department" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Dept. of IT" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-batch">Batch</label>
            <input id="field-batch" value={form.batch} onChange={(e) => set('batch', e.target.value)} placeholder="2017–21" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-company">Company *</label>
            <input id="field-company" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Palo Alto Networks" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-package">Package</label>
            <input id="field-package" value={form.package} onChange={(e) => set('package', e.target.value)} placeholder="41 LPA" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-video-url">YouTube Video URL</label>
            <input id="field-video-url" value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Success Story'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Success Stories ({docs.length})</h2>
          {docs.length === 0 && (
            <button className="admin-btn admin-btn--sm admin-btn--secondary" onClick={seedDefaults} disabled={seeding}>
              {seeding ? 'Adding…' : 'Add Starter Stories'}
            </button>
          )}
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Student</th><th>Company</th><th>Package</th><th>Actions</th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.order}</td>
                    <td>{d.studentName}</td>
                    <td>{d.company}</td>
                    <td>{d.package}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && <tr><td colSpan={5} className="admin-empty">No success stories yet — the page currently falls back to the original 2 hardcoded stories. Click "Add Starter Stories" to make them editable, or add new ones above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
