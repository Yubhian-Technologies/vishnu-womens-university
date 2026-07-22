import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface PolicyDoc {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<PolicyDoc, 'id'> = { title: '', description: '', fileUrl: '', storagePath: '', order: 0 };

// Powers /policies-procedures. No PDF uploaded yet for any of these — each
// "View" link on the public page only appears once a real PDF is attached
// here, so nothing links to a document that doesn't exist.
export const DEFAULT_POLICIES: Omit<PolicyDoc, 'id'>[] = [
  { title: 'Research & Development, Consultancy, IPR, Incentive Policy', description: 'Promotes a strong research culture by encouraging innovation, quality publications, consultancy activities, funded research projects, and providing incentives for faculty and students to enhance research productivity.', fileUrl: '', storagePath: '', order: 1 },
  { title: 'Recruitment Policy', description: '', fileUrl: '', storagePath: '', order: 2 },
  { title: 'Scholarship Policy', description: 'Provides financial support and incentives to meritorious and deserving students.', fileUrl: '', storagePath: '', order: 3 },
  { title: 'e-Governance Policy', description: 'Ensures efficient and transparent digital administration across academic and administrative processes.', fileUrl: '', storagePath: '', order: 4 },
  { title: 'IT Policy', description: 'Governs the use, security, and management of IT infrastructure and digital resources within the institution.', fileUrl: '', storagePath: '', order: 5 },
  { title: 'Environmental Policy – Green Campus Initiatives', description: 'Encourages sustainable practices such as waste management, water conservation, and eco-friendly campus development.', fileUrl: '', storagePath: '', order: 6 },
  { title: 'Disabled Friendly and Barrier-Free Environment Policy', description: 'Ensures accessibility, inclusivity, and support for differently-abled individuals within the campus.', fileUrl: '', storagePath: '', order: 7 },
  { title: 'Energy Usage Policy', description: 'Promotes efficient energy utilization and adoption of renewable energy sources.', fileUrl: '', storagePath: '', order: 8 },
  { title: 'Standard Operating Procedures', description: 'Defines clear and systematic guidelines for carrying out academic, administrative, and operational activities to ensure consistency, efficiency, and quality in institutional processes.', fileUrl: '', storagePath: '', order: 9 },
];

export default function PoliciesAdmin() {
  const { docs: policies, loading } = useOrderedCollection<PolicyDoc>('institutionalPolicies', 'order');
  const [form, setForm] = useState<Omit<PolicyDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title) return alert('Title is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'institutionalPolicies', editing), { ...form });
      } else {
        await addDoc(collection(db, 'institutionalPolicies'), { ...form, order: form.order || policies.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (p: PolicyDoc) => {
    setEditing(p.id);
    setForm({ title: p.title, description: p.description || '', fileUrl: p.fileUrl || '', storagePath: p.storagePath || '', order: p.order });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this policy?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'institutionalPolicies', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm(`Add all ${DEFAULT_POLICIES.length} policies as a starting point? You'll still need to upload a PDF for each one before its "View" link appears.`)) return;
    setSeeding(true);
    try {
      for (const p of DEFAULT_POLICIES) {
        await addDoc(collection(db, 'institutionalPolicies'), { ...p, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter policies: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Policy' : 'Add Policy'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the /policies-procedures page. A policy's "– View" link only appears on the public
          page once you've uploaded its PDF here.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="IT Policy" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Description (optional)</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} placeholder="One-sentence summary shown under the policy title." />
          </div>
          <div className="admin-field admin-field--full">
            <label>PDF File (leave empty to hide the "View" link until it's ready)</label>
            <FileUploader folder="vwu/policies" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Policy'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Policies ({policies.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Title</th><th>PDF</th><th>Actions</th></tr></thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.id}>
                    <td>{p.order}</td>
                    <td>{p.title}</td>
                    <td>{p.fileUrl ? <a href={p.fileUrl} target="_blank" rel="noopener noreferrer">View</a> : <span className="admin-badge admin-badge--gray admin-badge--sm">Not uploaded</span>}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(p.id, p.storagePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {policies.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-empty">
                      No policies yet — the public page is showing its default text.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults} disabled={seeding}>
                        {seeding ? 'Adding…' : 'Add starter policies'}
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
