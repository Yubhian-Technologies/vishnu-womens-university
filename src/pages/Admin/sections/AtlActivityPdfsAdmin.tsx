import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface AtlActivityPdfDoc extends WithId {
  label: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

export default function AtlActivityPdfsAdmin() {
  const { docs: entries, loading } = useOrderedCollection<AtlActivityPdfDoc>('atlActivityPdfs', 'order');
  const [newLabel, setNewLabel] = useState('');
  const [newFile, setNewFile] = useState<UploadResult | null>(null);
  const [adding, setAdding] = useState(false);

  const addEntry = async () => {
    if (!newLabel || !newFile) return alert('Enter a label and upload a PDF first.');
    setAdding(true);
    try {
      await addDoc(collection(db, 'atlActivityPdfs'), {
        label: newLabel, fileUrl: newFile.url, storagePath: newFile.path,
        order: entries.length + 1, createdAt: serverTimestamp(),
      });
      setNewLabel('');
      setNewFile(null);
    } catch (e) {
      alert(`Couldn't add: ${(e as Error).message}`);
    } finally {
      setAdding(false);
    }
  };

  const removeEntry = async (entry: AtlActivityPdfDoc) => {
    if (!confirm('Delete this entry?')) return;
    try {
      if (entry.storagePath) await deleteFile(entry.storagePath);
      await deleteDoc(doc(db, 'atlActivityPdfs', entry.id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading…</p>;
  }

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">ATL Activities Report PDFs</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1.5rem' }}>
        Powers the "Download {'{year}'} Report (PDF)" link on the Training/Research tab of the Assistive
        Technology Lab page. The label must match the year tab exactly, e.g. "ATL Activities 2025-26".
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Label</th><th>PDF</th><th>Actions</th></tr></thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>{e.order}</td>
                <td>{e.label}</td>
                <td>{e.fileUrl ? <a href={e.fileUrl} target="_blank" rel="noopener noreferrer">View PDF</a> : '—'}</td>
                <td>
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeEntry(e)}>Delete</button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && <tr><td colSpan={4} className="admin-empty">None yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '1rem', border: '1px solid var(--color-light-gray, #ddd)', borderRadius: 6, padding: '0.75rem' }}>
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="ATL Activities 2025-26"
          style={{ flex: 1 }}
        />
        <div style={{ flex: 1 }}>
          <FileUploader folder="vwu/atl/activities" currentUrl={newFile?.url} onUploaded={setNewFile} label="Upload PDF" />
        </div>
        <button type="button" className="admin-btn admin-btn--sm admin-btn--primary" onClick={addEntry} disabled={adding}>
          {adding ? 'Adding…' : '+ Add'}
        </button>
      </div>
    </div>
  );
}
