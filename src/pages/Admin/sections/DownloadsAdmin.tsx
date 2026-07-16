import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import type { UploadResult } from '../../../lib/storage';

export interface DownloadDoc {
  id: string;
  title: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<DownloadDoc, 'id'> = { title: '', fileUrl: '', storagePath: '', order: 0 };

const DEFAULT_DOWNLOADS: Omit<DownloadDoc, 'id'>[] = [
  { title: 'Academic Calendar', fileUrl: '/downloads/academic-calendar-placeholder.pdf', storagePath: '', order: 1 },
  { title: 'Academic Regulations', fileUrl: '/downloads/academic-regulations-placeholder.pdf', storagePath: '', order: 2 },
];

export default function DownloadsAdmin() {
  const { docs: downloads, loading } = useOrderedCollection<DownloadDoc>('downloads', 'order');
  const [form, setForm] = useState<Omit<DownloadDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title || !form.fileUrl) return alert('Title and PDF file are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'downloads', editing), { ...form });
      } else {
        await addDoc(collection(db, 'downloads'), { ...form, order: form.order || downloads.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: DownloadDoc) => {
    setEditing(d.id);
    setForm({ title: d.title, fileUrl: d.fileUrl, storagePath: d.storagePath, order: d.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this download?')) return;
    try {
      await deleteDoc(doc(db, 'downloads', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm('Add the default download entries (Academic Calendar, Academic Regulations) as a starting point?')) return;
    try {
      for (const d of DEFAULT_DOWNLOADS) {
        await addDoc(collection(db, 'downloads'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter downloads: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Download' : 'Add Download'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>PDF File *</label>
            <FileUploader folder="vwu/downloads" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
          </div>
          <div className="admin-field">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Course Curriculum" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Download'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Downloads ({downloads.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>File</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {downloads.map((d) => (
                  <tr key={d.id}>
                    <td>{d.title}</td>
                    <td><a href={d.fileUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                    <td>{d.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {downloads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-empty">
                      No downloads yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults}>Add starter downloads</button>
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
