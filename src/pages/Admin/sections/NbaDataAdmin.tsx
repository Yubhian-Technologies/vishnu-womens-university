import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface NbaDataDoc {
  id: string;
  category: string;
  label: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<NbaDataDoc, 'id'> = {
  category: 'ug-programmes', label: '', fileUrl: '', storagePath: '', order: 0,
};

export const NBA_DATA_CATEGORIES = [
  { key: 'ug-programmes', label: 'UG Programmes' },
  { key: 'institutional', label: 'Institutional' },
];

export default function NbaDataAdmin() {
  const { docs, loading } = useOrderedCollection<NbaDataDoc>('nbaDataDocs', 'order');
  const [form, setForm] = useState<Omit<NbaDataDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.label || !form.fileUrl) return alert('Label and a PDF are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'nbaDataDocs', editing), { ...form });
      } else {
        await addDoc(collection(db, 'nbaDataDocs'), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: NbaDataDoc) => {
    setEditing(d.id);
    setForm({ category: d.category, label: d.label, fileUrl: d.fileUrl, storagePath: d.storagePath || '', order: d.order });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'nbaDataDocs', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const categoryLabel = (key: string) => NBA_DATA_CATEGORIES.find((c) => c.key === key)?.label ?? key;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Document' : 'Add Document'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the NBA – Data Capturing Points page's per-programme and institutional document list, under Statutory → Governance.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-category">Category *</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {NBA_DATA_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-label">Label *</label>
            <input id="field-label" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="UG – Computer Science & Engineering" />
          </div>
          <div className="admin-field admin-field--full">
            <label>PDF File *</label>
            <FileUploader folder="vwu/nba-data" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Document'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Documents ({docs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Category</th><th>Label</th><th>File</th><th>Actions</th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.order}</td>
                    <td>{categoryLabel(d.category)}</td>
                    <td>{d.label}</td>
                    <td><a href={d.fileUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id, d.storagePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && <tr><td colSpan={5} className="admin-empty">No documents yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
