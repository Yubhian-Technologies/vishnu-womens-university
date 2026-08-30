import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, uploadFile, type UploadResult } from '../../../lib/storage';

export interface ComplianceDocDoc {
  id: string;
  group: string;
  label: string;
  fileUrl: string;
  storagePath: string;
  external: boolean;
  download: boolean;
  // Stable identifier some pages use to look up this exact document (e.g.
  // the UGC Public Self-Disclosure page links to the same NAAC/NBA/RTI
  // files shown here) — so replacing a PDF once updates it everywhere it's
  // referenced, instead of each page having its own copy of the link.
  key: string;
  order: number;
}

const EMPTY: Omit<ComplianceDocDoc, 'id'> = {
  group: 'Approvals & Accreditations', label: '', fileUrl: '', storagePath: '',
  external: false, download: false, key: '', order: 0,
};

export const COMPLIANCE_GROUPS = [
  'Approvals & Accreditations',
  'Mandatory Disclosures',
  'Infrastructure & Facilities',
  'Institutional Data',
];

export default function ComplianceDocsAdmin() {
  const { docs, loading } = useOrderedCollection<ComplianceDocDoc>('complianceDocs', 'order');
  const [form, setForm] = useState<Omit<ComplianceDocDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterGroup, setFilterGroup] = useState('All');
  const [migratingId, setMigratingId] = useState<string | null>(null);
  const [migratingAll, setMigratingAll] = useState(false);
  // Only non-external entries still pointing at a bundled /downloads/ file
  // are migratable — external links (svecw.edu.in, /anti-ragging, ...) are
  // deliberately not Firebase-hosted PDFs and can't be fetched cross-origin.
  const unmigrated = docs.filter((d) => !d.external && !d.storagePath);

  const set = (k: string, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.label || !form.fileUrl) return alert('Label and a PDF (or external URL) are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'complianceDocs', editing), { ...form });
      } else {
        await addDoc(collection(db, 'complianceDocs'), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: ComplianceDocDoc) => {
    setEditing(d.id);
    setForm({
      group: d.group, label: d.label, fileUrl: d.fileUrl, storagePath: d.storagePath || '',
      external: !!d.external, download: d.download !== false, key: d.key || '', order: d.order,
    });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this document link?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'complianceDocs', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  // Pulls a doc's bundled /downloads/ PDF and re-uploads it to Firebase
  // Storage, then repoints fileUrl/storagePath at that upload — same
  // migration used for the Institution Innovation Cell documents.
  const migrateDoc = async (d: ComplianceDocDoc) => {
    setMigratingId(d.id);
    try {
      const res = await fetch(d.fileUrl);
      if (!res.ok) throw new Error(`Couldn't fetch the existing PDF (${res.status}).`);
      const blob = await res.blob();
      const fileName = d.fileUrl.split('/').pop() || `${d.label}.pdf`;
      const file = new File([blob], fileName, { type: 'application/pdf' });
      const result = await uploadFile(file, 'vwu/compliance');
      await updateDoc(doc(db, 'complianceDocs', d.id), { fileUrl: result.url, storagePath: result.path });
    } catch (e) {
      alert(`Couldn't migrate "${d.label}": ${(e as Error).message}`);
    } finally {
      setMigratingId(null);
    }
  };

  const migrateAll = async () => {
    setMigratingAll(true);
    try {
      for (const d of unmigrated) await migrateDoc(d);
    } finally {
      setMigratingAll(false);
    }
  };

  const filtered = filterGroup === 'All' ? docs : docs.filter((d) => d.group === filterGroup);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Document' : 'Add Document'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Compliance &amp; Disclosures" section in the site footer — upload a PDF here and its
          footer button will download that file. A few of these (NAAC, NBA, UGC 12B/2f, Audited Statements,
          RTI, Facilities for Physically Challenged, and UGC Public Self Disclosure itself) are also linked
          from the UGC Public Self-Disclosure page — keep their <strong>Reference Key</strong> unchanged so
          that page stays in sync automatically.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-group">Group *</label>
            <select id="field-group" value={form.group} onChange={(e) => set('group', e.target.value)}>
              {COMPLIANCE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-label">Label *</label>
            <input id="field-label" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="NAAC Approvals" />
          </div>
          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.external} onChange={(e) => set('external', e.target.checked)} style={{ marginRight: 6 }} />
              Link to an external page instead of uploading a file
            </label>
          </div>
          {form.external ? (
            <div className="admin-field">
              <label htmlFor="field-external-url">External URL *</label>
              <input id="field-external-url" value={form.fileUrl} onChange={(e) => set('fileUrl', e.target.value)} placeholder="https://svecw.edu.in/policies-procedures/" />
            </div>
          ) : (
            <>
              <div className="admin-field admin-field--full">
                <label>PDF File *</label>
                <FileUploader folder="vwu/compliance" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
              </div>
              <div className="admin-field">
                <label>
                  <input type="checkbox" checked={form.download} onChange={(e) => set('download', e.target.checked)} style={{ marginRight: 6 }} />
                  Force download (unchecked opens the PDF in a new tab instead)
                </label>
              </div>
            </>
          )}
          <div className="admin-field">
            <label htmlFor="field-reference-key-optional-see-note">Reference Key (optional — see note above; leave blank for a one-off document)</label>
            <input id="field-reference-key-optional-see-note" value={form.key} onChange={(e) => set('key', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="naac-approvals" />
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
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Documents ({filtered.length})</h2>
          <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="admin-select-sm">
            <option value="All">All Groups</option>
            {COMPLIANCE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        {unmigrated.length > 0 && (
          <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
            {unmigrated.length} of these still point at a PDF bundled with the site rather than Firebase Storage.{' '}
            <button className="admin-btn admin-btn--sm" onClick={migrateAll} disabled={migratingAll || migratingId !== null}>
              {migratingAll ? 'Migrating…' : `Migrate all ${unmigrated.length} to Firebase Storage`}
            </button>
          </p>
        )}
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Group</th><th>Label</th><th>File</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td>{d.order}</td>
                    <td>{d.group}</td>
                    <td>{d.label}</td>
                    <td><a href={d.fileUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                    <td>
                      {!d.external && !d.storagePath && (
                        <button
                          className="admin-btn admin-btn--sm"
                          onClick={() => migrateDoc(d)}
                          disabled={migratingId === d.id || migratingAll}
                        >
                          {migratingId === d.id ? 'Migrating…' : 'Migrate to Storage'}
                        </button>
                      )}
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id, d.storagePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">No documents yet.</td>
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
