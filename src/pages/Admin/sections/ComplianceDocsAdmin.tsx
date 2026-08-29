import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

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

// The footer's original hardcoded links — used both as the "empty
// collection" fallback (so the footer never looks broken) and as the
// one-click starting point for admins moving these into Firestore.
export const DEFAULT_COMPLIANCE_DOCS: Omit<ComplianceDocDoc, 'id'>[] = [
  { group: 'Approvals & Accreditations', label: 'AICTE Approvals', fileUrl: '/downloads/AICTEApprovals.pdf', storagePath: '', external: false, download: false, key: 'aicte-approvals', order: 1 },
  { group: 'Approvals & Accreditations', label: 'UGC Autonomous Approvals', fileUrl: '/downloads/UGCAutonomousApprovals.pdf', storagePath: '', external: false, download: false, key: 'ugc-autonomous-approvals', order: 2 },
  { group: 'Approvals & Accreditations', label: 'UGC - 12B 2f Letter', fileUrl: '/downloads/UGC12B2FLetter.pdf', storagePath: '', external: false, download: false, key: 'ugc-12b-2f', order: 3 },
  { group: 'Approvals & Accreditations', label: 'JNTUK Affiliation Approvals', fileUrl: '/downloads/JNTUKAffiliationApprovals.pdf', storagePath: '', external: false, download: false, key: 'jntuk-affiliation-approvals', order: 4 },
  { group: 'Approvals & Accreditations', label: 'JNTUK Autonomous Approvals', fileUrl: '/downloads/JNTUKAutonomousApprovals.pdf', storagePath: '', external: false, download: false, key: 'jntuk-autonomous-approvals', order: 5 },
  { group: 'Approvals & Accreditations', label: 'NAAC Approvals', fileUrl: '/downloads/NAACApprovals.pdf', storagePath: '', external: false, download: false, key: 'naac-approvals', order: 6 },
  { group: 'Approvals & Accreditations', label: 'NBA Approvals', fileUrl: '/downloads/NBAApprovals.pdf', storagePath: '', external: false, download: false, key: 'nba-approvals', order: 7 },
  { group: 'Mandatory Disclosures', label: 'AICTE Mandatory Disclosures', fileUrl: '/downloads/AICTEMandatoryDisclosures.pdf', storagePath: '', external: false, download: false, key: 'aicte-mandatory-disclosures', order: 1 },
  { group: 'Mandatory Disclosures', label: 'UGC Public Self Disclosure', fileUrl: '/downloads/UGCPublicSelfDisclosure.pdf', storagePath: '', external: false, download: false, key: 'ugc-public-self-disclosure', order: 2 },
  { group: 'Mandatory Disclosures', label: 'JNTUK Mandatory Disclosure', fileUrl: '/downloads/JNTUKMandatoryDisclosure.pdf', storagePath: '', external: false, download: false, key: 'jntuk-mandatory-disclosure', order: 3 },
  { group: 'Mandatory Disclosures', label: 'RTI-Undertaking', fileUrl: '/downloads/RTIUndertaking.pdf', storagePath: '', external: false, download: false, key: 'rti-undertaking', order: 4 },
  { group: 'Mandatory Disclosures', label: 'Anti Ragging Policies', fileUrl: '/anti-ragging', storagePath: '', external: true, download: false, key: 'anti-ragging-policies', order: 5 },
  { group: 'Mandatory Disclosures', label: 'Policies & Procedures', fileUrl: '/policies-procedures', storagePath: '', external: true, download: false, key: 'policies-procedures', order: 6 },
  { group: 'Infrastructure & Facilities', label: 'College Fee Payment', fileUrl: '/downloads/SVECWCollegeFeePayment.pdf', storagePath: '', external: false, download: false, key: 'college-fee-payment', order: 1 },
  { group: 'Infrastructure & Facilities', label: 'Hostel Fee Payment', fileUrl: '/downloads/SVECWHostelFeePayment.pdf', storagePath: '', external: false, download: false, key: 'hostel-fee-payment', order: 2 },
  { group: 'Infrastructure & Facilities', label: 'Building Plans', fileUrl: '/downloads/SVECWBuildingPlans.pdf', storagePath: '', external: false, download: false, key: 'building-plans', order: 3 },
  { group: 'Infrastructure & Facilities', label: 'Structural Stability', fileUrl: '/downloads/SVECWStructuralStability.pdf', storagePath: '', external: false, download: false, key: 'structural-stability', order: 4 },
  { group: 'Infrastructure & Facilities', label: 'Land Use Certificate', fileUrl: '/downloads/SVECWLandUseCertificate.pdf', storagePath: '', external: false, download: false, key: 'land-use-certificate', order: 5 },
  { group: 'Infrastructure & Facilities', label: 'Land Conversion Certificate', fileUrl: 'https://svecw.edu.in/wp-content/uploads/2024/07/SVECWLandConversion.pdf', storagePath: '', external: true, download: false, key: 'land-conversion-certificate', order: 6 },
  { group: 'Infrastructure & Facilities', label: 'Fire NOC', fileUrl: '/downloads/SVECWFireSafety2026.pdf', storagePath: '', external: false, download: false, key: 'fire-noc', order: 7 },
  { group: 'Infrastructure & Facilities', label: 'Online Verification System', fileUrl: '/downloads/SVECWOnlineVerification.pdf', storagePath: '', external: false, download: false, key: 'online-verification-system', order: 8 },
  { group: 'Institutional Data', label: 'Audited Statements', fileUrl: '/downloads/SVECWAuditStatements.pdf', storagePath: '', external: false, download: false, key: 'audited-statements', order: 1 },
  { group: 'Institutional Data', label: 'Student Details', fileUrl: '/downloads/SVECWStudentDetails.pdf', storagePath: '', external: false, download: false, key: 'student-details', order: 2 },
  { group: 'Institutional Data', label: 'Faculty Details', fileUrl: '/downloads/SVECWFacultyDetails.pdf', storagePath: '', external: false, download: false, key: 'faculty-details', order: 3 },
  { group: 'Institutional Data', label: 'Faculty Qualification Details', fileUrl: 'https://svecw.edu.in/wp-content/uploads/2026/02/SVECWFacultyQualifications.pdf', storagePath: '', external: true, download: false, key: 'faculty-qualification-details', order: 4 },
  { group: 'Institutional Data', label: 'Faculty Ratification Details', fileUrl: '/downloads/SVECWRatifiedFaculty.pdf', storagePath: '', external: false, download: false, key: 'faculty-ratification-details', order: 5 },
  { group: 'Institutional Data', label: 'Faculty Handbook', fileUrl: 'https://svecw.edu.in/wp-content/uploads/2026/04/FacultyHandbookSVECW.pdf', storagePath: '', external: true, download: false, key: 'faculty-handbook', order: 6 },
  { group: 'Institutional Data', label: 'Students Handbook', fileUrl: 'https://svecw.edu.in/wp-content/uploads/2025/11/SVECWStudentHandbook.pdf', storagePath: '', external: true, download: false, key: 'students-handbook', order: 7 },
  { group: 'Institutional Data', label: 'Facilities for Physically Challenged', fileUrl: '/downloads/SVECWPhysicallyChallengedFacilities.pdf', storagePath: '', external: false, download: false, key: 'facilities-physically-challenged', order: 8 },
];

export default function ComplianceDocsAdmin() {
  const { docs, loading } = useOrderedCollection<ComplianceDocDoc>('complianceDocs', 'order');
  const [form, setForm] = useState<Omit<ComplianceDocDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterGroup, setFilterGroup] = useState('All');
  const [seeding, setSeeding] = useState(false);

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

  const filtered = filterGroup === 'All' ? docs : docs.filter((d) => d.group === filterGroup);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Document' : 'Add Document'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Compliance &amp; Disclosures" section in the site footer — upload a PDF here and its
          footer button will download that file. A few of these (NAAC, NBA, UGC 12B/2f, Audited Statements,
          RTI, Facilities for Physically Challenged) are also linked from the UGC Public Self-Disclosure
          page — keep their <strong>Reference Key</strong> unchanged so that page stays in sync automatically.
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
