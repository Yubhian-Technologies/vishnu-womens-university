import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface PatentCertificateDoc {
  id: string;
  label: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<PatentCertificateDoc, 'id'> = { label: '', fileUrl: '', storagePath: '', order: 0 };

// The Patents page's original certificate PDF links — used both as the
// "empty collection" fallback and as the one-click starting point for
// admins moving these into Firestore. Already hosted on Firebase Storage
// (uploaded via the teammate's public/downloads migration script), so
// seeding just copies the existing URL/path into a Firestore doc — no file
// re-upload needed. Label must exactly match the patent's "Application
// Number" text in Research → Research → edit "Patents" → Project Accordion
// for the link to attach to the right patent — see ResearchDetail.tsx.
export const DEFAULT_PATENT_CERTIFICATES: Omit<PatentCertificateDoc, 'id'>[] = [
  { label: '202205074', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FPatent-202205074.pdf?alt=media&token=17e45efd-7269-453e-97df-e3264a2b1303', storagePath: 'downloads/Patent-202205074.pdf', order: 1 },
  { label: '201941025873', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FPatent-201941025873.pdf?alt=media&token=32b9c936-a3ce-4cc9-8f7b-d2a814340d9b', storagePath: 'downloads/Patent-201941025873.pdf', order: 2 },
  { label: '367333-001', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FPatent-367333-001.pdf?alt=media&token=0f485711-753e-469e-be59-7dacb200dd80', storagePath: 'downloads/Patent-367333-001.pdf', order: 3 },
  { label: '202023105674.1', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FPatent-202023105674.pdf?alt=media&token=f254c649-8dc8-4113-9429-d73200134c36', storagePath: 'downloads/Patent-202023105674.pdf', order: 4 },
];

export default function PatentCertificatesAdmin() {
  const { docs, loading } = useOrderedCollection<PatentCertificateDoc>('patentCertificates', 'order');
  const [form, setForm] = useState<Omit<PatentCertificateDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.label || !form.fileUrl) return alert('Application Number and a PDF are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'patentCertificates', editing), { ...form });
      } else {
        await addDoc(collection(db, 'patentCertificates'), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: PatentCertificateDoc) => {
    setEditing(d.id);
    setForm({ label: d.label, fileUrl: d.fileUrl, storagePath: d.storagePath || '', order: d.order });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'patentCertificates', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm(`Add all ${DEFAULT_PATENT_CERTIFICATES.length} current certificate links as a starting point? You can edit or delete any of them afterwards.`)) return;
    setSeeding(true);
    try {
      for (const d of DEFAULT_PATENT_CERTIFICATES) {
        await addDoc(collection(db, 'patentCertificates'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter certificates: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Certificate' : 'Add Certificate'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Application Number" download link on the Patents page. The Application Number here
          must exactly match the one typed in that patent's entry under Research → Research → edit "Patents"
          → Project Accordion — that's how a certificate attaches to the right patent.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-label">Application Number *</label>
            <input id="field-label" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="202205074" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Certificate PDF *</label>
            <FileUploader folder="vwu/research-patents" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Certificate'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Certificates ({docs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Application Number</th><th>File</th><th>Actions</th></tr></thead>
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
                      No certificates yet — the page is showing its original hardcoded links.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults} disabled={seeding}>
                        {seeding ? 'Adding…' : 'Add starter certificates'}
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
