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
  group: 'Mandatory Disclosures', label: '', fileUrl: '', storagePath: '',
  external: false, download: false, key: '', order: 0,
};

export const COMPLIANCE_GROUPS = [
  'Mandatory Disclosures',
  'Infrastructure & Facilities',
  'Institutional Data',
];

// The footer's original hardcoded links — used both as the "empty
// collection" fallback (so the footer never looks broken on a fresh
// Firestore) and as the one-click starting point for admins moving these
// into Firestore. Already pre-migrated to Firebase Storage URLs (see
// scripts/migrate-downloads-to-storage.mjs) — the actual live complianceDocs
// collection is what the footer/UGC Disclosure page render from once it has
// any docs, so this only ever matters for a brand-new environment.
export const DEFAULT_COMPLIANCE_DOCS: Omit<ComplianceDocDoc, 'id'>[] = [
  { group: 'Approvals & Accreditations', label: 'AICTE Approvals', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FAICTEApprovals.pdf?alt=media&token=7ed92945-cb93-4e5e-9ef2-05955dfdf22b', storagePath: '', external: false, download: false, key: 'aicte-approvals', order: 1 },
  { group: 'Approvals & Accreditations', label: 'UGC Autonomous Approvals', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FUGCAutonomousApprovals.pdf?alt=media&token=ff1f352c-1d7a-469a-a121-cab0bdd26582', storagePath: '', external: false, download: false, key: 'ugc-autonomous-approvals', order: 2 },
  { group: 'Approvals & Accreditations', label: 'UGC - 12B 2f Letter', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FUGC12B2FLetter.pdf?alt=media&token=1a8cb736-ddb9-46b6-a538-0d61085264ca', storagePath: '', external: false, download: false, key: 'ugc-12b-2f', order: 3 },
  { group: 'Approvals & Accreditations', label: 'JNTUK Affiliation Approvals', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FJNTUKAffiliationApprovals.pdf?alt=media&token=7b695b98-6892-4770-83d7-167e9bdd1079', storagePath: '', external: false, download: false, key: 'jntuk-affiliation-approvals', order: 4 },
  { group: 'Approvals & Accreditations', label: 'JNTUK Autonomous Approvals', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FJNTUKAutonomousApprovals.pdf?alt=media&token=cba1ed20-8f6f-4d19-b398-abe750886f56', storagePath: '', external: false, download: false, key: 'jntuk-autonomous-approvals', order: 5 },
  { group: 'Approvals & Accreditations', label: 'NAAC Approvals', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNAACApprovals.pdf?alt=media&token=74745fe4-2332-4338-9f13-b753372b42d7', storagePath: '', external: false, download: false, key: 'naac-approvals', order: 6 },
  { group: 'Approvals & Accreditations', label: 'NBA Approvals', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBAApprovals.pdf?alt=media&token=f25ad763-643d-4321-a36c-874029264996', storagePath: '', external: false, download: false, key: 'nba-approvals', order: 7 },
  { group: 'Mandatory Disclosures', label: 'AICTE Mandatory Disclosures', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FAICTEMandatoryDisclosures.pdf?alt=media&token=2129a15b-8c97-4526-8a75-c754f678a6f2', storagePath: '', external: false, download: false, key: 'aicte-mandatory-disclosures', order: 1 },
  { group: 'Mandatory Disclosures', label: 'UGC Public Self Disclosure', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FUGCPublicSelfDisclosure.pdf?alt=media&token=b47b4c4f-0b5c-4c3d-bc2d-813ef380d246', storagePath: '', external: false, download: false, key: 'ugc-public-self-disclosure', order: 2 },
  { group: 'Mandatory Disclosures', label: 'JNTUK Mandatory Disclosure', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FJNTUKMandatoryDisclosure.pdf?alt=media&token=821959f5-260b-45b6-b61e-0bbcfcf6c389', storagePath: '', external: false, download: false, key: 'jntuk-mandatory-disclosure', order: 3 },
  { group: 'Mandatory Disclosures', label: 'RTI-Undertaking', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FRTIUndertaking.pdf?alt=media&token=7751fc00-5c24-4bfd-a28c-cde52bd5a27f', storagePath: '', external: false, download: false, key: 'rti-undertaking', order: 4 },
  { group: 'Mandatory Disclosures', label: 'Anti Ragging Policies', fileUrl: '/anti-ragging', storagePath: '', external: true, download: false, key: 'anti-ragging-policies', order: 5 },
  { group: 'Mandatory Disclosures', label: 'Policies & Procedures', fileUrl: '/policies-procedures', storagePath: '', external: true, download: false, key: 'policies-procedures', order: 6 },
  { group: 'Infrastructure & Facilities', label: 'College Fee Payment', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWCollegeFeePayment.pdf?alt=media&token=196d3e64-8e1b-4d11-963e-7363c9be4000', storagePath: '', external: false, download: false, key: 'college-fee-payment', order: 1 },
  { group: 'Infrastructure & Facilities', label: 'Hostel Fee Payment', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWHostelFeePayment.pdf?alt=media&token=166d9223-5e4e-4a56-918e-45e9f32243c1', storagePath: '', external: false, download: false, key: 'hostel-fee-payment', order: 2 },
  { group: 'Infrastructure & Facilities', label: 'Building Plans', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWBuildingPlans.pdf?alt=media&token=6652dd95-c77b-4fe0-9535-326db47e485e', storagePath: '', external: false, download: false, key: 'building-plans', order: 3 },
  { group: 'Infrastructure & Facilities', label: 'Structural Stability', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWStructuralStability.pdf?alt=media&token=e88445e0-448e-4009-bb72-a3bde520bb2b', storagePath: '', external: false, download: false, key: 'structural-stability', order: 4 },
  { group: 'Infrastructure & Facilities', label: 'Land Use Certificate', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWLandUseCertificate.pdf?alt=media&token=351b20dd-fe3d-44ee-b382-f60ecb644dc0', storagePath: '', external: false, download: false, key: 'land-use-certificate', order: 5 },
  { group: 'Infrastructure & Facilities', label: 'Land Conversion Certificate', fileUrl: 'https://svecw.edu.in/wp-content/uploads/2024/07/SVECWLandConversion.pdf', storagePath: '', external: true, download: false, key: 'land-conversion-certificate', order: 6 },
  { group: 'Infrastructure & Facilities', label: 'Fire NOC', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWFireSafety2026.pdf?alt=media&token=e7ccfa89-f98c-4aa1-936d-2d69204eaf26', storagePath: '', external: false, download: false, key: 'fire-noc', order: 7 },
  { group: 'Infrastructure & Facilities', label: 'Online Verification System', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWOnlineVerification.pdf?alt=media&token=3aa66ae5-24bd-4665-ad7a-6549c3b59529', storagePath: '', external: false, download: false, key: 'online-verification-system', order: 8 },
  { group: 'Institutional Data', label: 'Audited Statements', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWAuditStatements.pdf?alt=media&token=949e45f9-c171-404a-8578-9c5b0114f92f', storagePath: '', external: false, download: false, key: 'audited-statements', order: 1 },
  { group: 'Institutional Data', label: 'Student Details', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWStudentDetails.pdf?alt=media&token=2e9408c9-18d6-4a4e-a016-26cf653a05cd', storagePath: '', external: false, download: false, key: 'student-details', order: 2 },
  { group: 'Institutional Data', label: 'Faculty Details', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWFacultyDetails.pdf?alt=media&token=90cc1942-1099-400c-a5dd-530881b7fcad', storagePath: '', external: false, download: false, key: 'faculty-details', order: 3 },
  { group: 'Institutional Data', label: 'Faculty Qualification Details', fileUrl: 'https://svecw.edu.in/wp-content/uploads/2026/02/SVECWFacultyQualifications.pdf', storagePath: '', external: true, download: false, key: 'faculty-qualification-details', order: 4 },
  { group: 'Institutional Data', label: 'Faculty Ratification Details', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWRatifiedFaculty.pdf?alt=media&token=db2bf68e-df25-4813-866c-19756c55f372', storagePath: '', external: false, download: false, key: 'faculty-ratification-details', order: 5 },
  { group: 'Institutional Data', label: 'Faculty Handbook', fileUrl: 'https://svecw.edu.in/wp-content/uploads/2026/04/FacultyHandbookSVECW.pdf', storagePath: '', external: true, download: false, key: 'faculty-handbook', order: 6 },
  { group: 'Institutional Data', label: 'Students Handbook', fileUrl: 'https://svecw.edu.in/wp-content/uploads/2025/11/SVECWStudentHandbook.pdf', storagePath: '', external: true, download: false, key: 'students-handbook', order: 7 },
  { group: 'Institutional Data', label: 'Facilities for Physically Challenged', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWPhysicallyChallengedFacilities.pdf?alt=media&token=168a11aa-9a64-4f19-94bc-8a022ce558bc', storagePath: '', external: false, download: false, key: 'facilities-physically-challenged', order: 8 },
];

export default function ComplianceDocsAdmin() {
  const { docs, loading } = useOrderedCollection<ComplianceDocDoc>('complianceDocs', 'order');
  const [form, setForm] = useState<Omit<ComplianceDocDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterGroup, setFilterGroup] = useState('All');
  const [seeding, setSeeding] = useState(false);
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

  const seedDefaults = async () => {
    if (!confirm(`Add all ${DEFAULT_COMPLIANCE_DOCS.length} current footer links as a starting point? You can edit or delete any of them afterwards.`)) return;
    setSeeding(true);
    try {
      for (const d of DEFAULT_COMPLIANCE_DOCS) {
        await addDoc(collection(db, 'complianceDocs'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter documents: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
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
                    <td colSpan={5} className="admin-empty">
                      No documents yet — the footer is showing its original hardcoded links.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults} disabled={seeding}>
                        {seeding ? 'Adding…' : 'Add starter documents'}
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
