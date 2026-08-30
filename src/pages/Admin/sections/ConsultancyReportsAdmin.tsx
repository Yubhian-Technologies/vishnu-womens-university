import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface ConsultancyReportDoc {
  id: string;
  label: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<ConsultancyReportDoc, 'id'> = { label: '', fileUrl: '', storagePath: '', order: 0 };

// The Consultancy page's original year-by-year report links — used both as
// the "empty collection" fallback and as the one-click starting point for
// admins moving these into Firestore. Already hosted on Firebase Storage
// (uploaded via the teammate's public/downloads migration script), so
// seeding just copies the existing URL/path into a Firestore doc — no file
// re-upload needed.
export const DEFAULT_CONSULTANCY_REPORTS: Omit<ConsultancyReportDoc, 'id'>[] = [
  { label: '2023-24', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FConsultancy2023-24.pdf?alt=media&token=07c99ffe-2ec2-47d0-8b88-e764a978a6e4', storagePath: 'downloads/Consultancy2023-24.pdf', order: 1 },
  { label: '2022-23', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FConsultancy2022-23.pdf?alt=media&token=a869d6c1-44b6-49e7-ae75-8d7e4c94b28d', storagePath: 'downloads/Consultancy2022-23.pdf', order: 2 },
  { label: '2021-22', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FConsultancy2021-22.pdf?alt=media&token=f91dda70-94ad-4036-8417-e59d8455de58', storagePath: 'downloads/Consultancy2021-22.pdf', order: 3 },
  { label: '2020-21', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FConsultancy2020-21.pdf?alt=media&token=a62af289-4452-4c1a-b705-96da8899501e', storagePath: 'downloads/Consultancy2020-21.pdf', order: 4 },
];

export default function ConsultancyReportsAdmin() {
  const { docs, loading } = useOrderedCollection<ConsultancyReportDoc>('consultancyReports', 'order');
  const [form, setForm] = useState<Omit<ConsultancyReportDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.label || !form.fileUrl) return alert('Label and a PDF are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'consultancyReports', editing), { ...form });
      } else {
        await addDoc(collection(db, 'consultancyReports'), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: ConsultancyReportDoc) => {
    setEditing(d.id);
    setForm({ label: d.label, fileUrl: d.fileUrl, storagePath: d.storagePath || '', order: d.order });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'consultancyReports', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm(`Add all ${DEFAULT_CONSULTANCY_REPORTS.length} current report links as a starting point? You can edit or delete any of them afterwards.`)) return;
    setSeeding(true);
    try {
      for (const d of DEFAULT_CONSULTANCY_REPORTS) {
        await addDoc(collection(db, 'consultancyReports'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter reports: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Report' : 'Add Report'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the year-by-year report list on the Consultancy research page. Label is the year (e.g. 2025-26).
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-label">Label (Year) *</label>
            <input id="field-label" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="2025-26" />
          </div>
          <div className="admin-field admin-field--full">
            <label>PDF File *</label>
            <FileUploader folder="vwu/research-consultancy" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Report'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Reports ({docs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Label</th><th>File</th><th>Actions</th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.order}</td>
                    <td>{d.label}</td>
                    <td><a href={d.fileUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id, d.storagePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-empty">
                      No reports yet — the page is showing its original hardcoded links.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults} disabled={seeding}>
                        {seeding ? 'Adding…' : 'Add starter reports'}
                      </button>
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
