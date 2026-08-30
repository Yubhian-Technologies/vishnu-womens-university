import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, uploadFile, type UploadResult } from '../../../lib/storage';

export interface AnnualReportDoc {
  id: string;
  category: string;
  label: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<AnnualReportDoc, 'id'> = {
  category: 'college-annual-reports', label: '', fileUrl: '', storagePath: '', order: 0,
};

export const ANNUAL_REPORT_CATEGORIES = [
  { key: 'college-annual-reports', label: 'College Annual Reports' },
  { key: 'annual-examination-reports', label: 'Annual Examination Reports' },
  { key: 'examination-reforms', label: 'Examination Reforms' },
  { key: 'financial-audit-statements', label: 'Financial Audit Statements' },
];

// The Annual Reports & Reforms page's original year archive — used both as
// the "empty collection" fallback (so the page never looks broken on a
// fresh Firestore) and as the one-click starting point for admins moving
// these into Firestore. Already pre-migrated to Firebase Storage URLs — the
// actual live annualReportsDocs collection is what the public page renders
// from once it has any docs, so this only ever matters for a brand-new
// environment.
export const DEFAULT_ANNUAL_REPORTS: Omit<AnnualReportDoc, 'id'>[] = [
  { category: 'college-annual-reports', label: '2024-25', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080314178-CollegeAnnualReport-2024-25.pdf?alt=media&token=fc35c027-7dab-4f15-b4b9-ce2764612ce0', storagePath: 'vwu/annual-reports/1788080314178-CollegeAnnualReport-2024-25.pdf', order: 1 },
  { category: 'college-annual-reports', label: '2023-24', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080339336-CollegeAnnualReport-2023-24.pdf?alt=media&token=d0dcb8dd-2746-435d-9646-998c458b89ea', storagePath: 'vwu/annual-reports/1788080339336-CollegeAnnualReport-2023-24.pdf', order: 2 },
  { category: 'college-annual-reports', label: '2022-23', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080346661-CollegeAnnualReport-2022-23.pdf?alt=media&token=36bdb1ba-7c9e-4d4d-920a-dd9a325ed6ef', storagePath: 'vwu/annual-reports/1788080346661-CollegeAnnualReport-2022-23.pdf', order: 3 },
  { category: 'college-annual-reports', label: '2021-22', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080364183-CollegeAnnualReport-2021-22.pdf?alt=media&token=33f45d6a-190f-419c-832e-82f84ac06dd9', storagePath: 'vwu/annual-reports/1788080364183-CollegeAnnualReport-2021-22.pdf', order: 4 },
  { category: 'college-annual-reports', label: '2020-21', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080381497-CollegeAnnualReport-2020-21.pdf?alt=media&token=69b048c6-e098-4571-8245-a777ebf97b12', storagePath: 'vwu/annual-reports/1788080381497-CollegeAnnualReport-2020-21.pdf', order: 5 },
  { category: 'college-annual-reports', label: '2019-20', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080384852-CollegeAnnualReport-2019-20.pdf?alt=media&token=20342af7-9627-4014-808e-b13a7d70d232', storagePath: 'vwu/annual-reports/1788080384852-CollegeAnnualReport-2019-20.pdf', order: 6 },
  { category: 'college-annual-reports', label: '2018-19', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080394324-CollegeAnnualReport-2018-19.pdf?alt=media&token=8e889b7b-3184-4303-9939-34bd377dc109', storagePath: 'vwu/annual-reports/1788080394324-CollegeAnnualReport-2018-19.pdf', order: 7 },
  { category: 'college-annual-reports', label: '2017-18', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080400978-CollegeAnnualReport-2017-18.pdf?alt=media&token=18cbd749-a06c-4f60-8eec-7c41182cefd4', storagePath: 'vwu/annual-reports/1788080400978-CollegeAnnualReport-2017-18.pdf', order: 8 },
  { category: 'college-annual-reports', label: '2016-17', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080410197-CollegeAnnualReport-2016-17.pdf?alt=media&token=1ca5e538-6e90-437c-acb1-a2eb79ea33a7', storagePath: 'vwu/annual-reports/1788080410197-CollegeAnnualReport-2016-17.pdf', order: 9 },
  { category: 'annual-examination-reports', label: '2024-25', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080322047-AnnualExaminationReport-2024-25.pdf?alt=media&token=69abd0fb-ccb0-4e28-a87a-48db84e5be6f', storagePath: 'vwu/annual-reports/1788080322047-AnnualExaminationReport-2024-25.pdf', order: 1 },
  { category: 'annual-examination-reports', label: '2023-24', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080332506-AnnualExaminationReport-2023-24.pdf?alt=media&token=b02101cd-e044-4fe7-bbf3-93395b1d205d', storagePath: 'vwu/annual-reports/1788080332506-AnnualExaminationReport-2023-24.pdf', order: 2 },
  { category: 'annual-examination-reports', label: '2022-23', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080350519-AnnualExaminationReport-2022-23.pdf?alt=media&token=89196001-f274-46d4-85d9-ad06c6ca4fea', storagePath: 'vwu/annual-reports/1788080350519-AnnualExaminationReport-2022-23.pdf', order: 3 },
  { category: 'annual-examination-reports', label: '2021-22', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080367793-AnnualExaminationReport-2021-22.pdf?alt=media&token=41a5181e-bf0d-4af3-b361-6bfec0bc3d6e', storagePath: 'vwu/annual-reports/1788080367793-AnnualExaminationReport-2021-22.pdf', order: 4 },
  { category: 'annual-examination-reports', label: '2020-21', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080374562-AnnualExaminationReport-2020-21.pdf?alt=media&token=be4ad604-961a-42f0-be8e-ce9be6c0737f', storagePath: 'vwu/annual-reports/1788080374562-AnnualExaminationReport-2020-21.pdf', order: 5 },
  { category: 'annual-examination-reports', label: '2019-20', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080388100-AnnualExaminationReport-2019-20.pdf?alt=media&token=a5eb42d4-bead-4e6b-9eb7-65860d8d89d0', storagePath: 'vwu/annual-reports/1788080388100-AnnualExaminationReport-2019-20.pdf', order: 6 },
  { category: 'annual-examination-reports', label: '2018-19', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080397328-AnnualExaminationReport-2018-19.pdf?alt=media&token=5c021e56-45f1-490a-9ba0-6aa0a414977d', storagePath: 'vwu/annual-reports/1788080397328-AnnualExaminationReport-2018-19.pdf', order: 7 },
  { category: 'annual-examination-reports', label: '2017-18', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080404280-AnnualExaminationReport-2017-18.pdf?alt=media&token=3f7676fa-53b3-4230-8e5b-0bea3c0be715', storagePath: 'vwu/annual-reports/1788080404280-AnnualExaminationReport-2017-18.pdf', order: 8 },
  { category: 'annual-examination-reports', label: '2016-17', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080407078-AnnualExaminationReport-2016-17.pdf?alt=media&token=07fa9e25-e95e-4e6a-b2be-935c5fad4f4e', storagePath: 'vwu/annual-reports/1788080407078-AnnualExaminationReport-2016-17.pdf', order: 9 },
  { category: 'examination-reforms', label: '2023-24', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080325408-ExaminationReforms-2023-24.pdf?alt=media&token=f8200e74-f171-4b08-91e7-f1f4ad05a669', storagePath: 'vwu/annual-reports/1788080325408-ExaminationReforms-2023-24.pdf', order: 1 },
  { category: 'examination-reforms', label: '2022-23', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080328926-ExaminationReforms-2022-23.pdf?alt=media&token=901bebba-4587-4306-9b0e-86e715f52bca', storagePath: 'vwu/annual-reports/1788080328926-ExaminationReforms-2022-23.pdf', order: 2 },
  { category: 'examination-reforms', label: '2020-21', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080354003-ExaminationReforms-2020-21.pdf?alt=media&token=d93fe29a-52a0-4ee5-8324-16fcd7333300', storagePath: 'vwu/annual-reports/1788080354003-ExaminationReforms-2020-21.pdf', order: 3 },
  { category: 'examination-reforms', label: '2018-19', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080357306-ExaminationReforms-2018-19.pdf?alt=media&token=09fd65f5-4f6c-45a2-91f1-f48908857c17', storagePath: 'vwu/annual-reports/1788080357306-ExaminationReforms-2018-19.pdf', order: 4 },
  { category: 'examination-reforms', label: '2017-18', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080371243-ExaminationReforms-2017-18.pdf?alt=media&token=bb5f2116-0be9-4325-94ae-e933f4518432', storagePath: 'vwu/annual-reports/1788080371243-ExaminationReforms-2017-18.pdf', order: 5 },
  { category: 'examination-reforms', label: '2016-17', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080391165-ExaminationReforms-2016-17.pdf?alt=media&token=c39df538-f240-499a-a10b-619ea62c95ac', storagePath: 'vwu/annual-reports/1788080391165-ExaminationReforms-2016-17.pdf', order: 6 },
  { category: 'financial-audit-statements', label: '2024-25', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080318385-FinancialAuditStatement-2024-25.pdf?alt=media&token=4669214a-3aa6-4730-a2b0-6a88e84af8c8', storagePath: 'vwu/annual-reports/1788080318385-FinancialAuditStatement-2024-25.pdf', order: 1 },
  { category: 'financial-audit-statements', label: '2023-24', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080335912-FinancialAuditStatement-2023-24.pdf?alt=media&token=085d53f7-a2b8-4f6a-bf06-b477d9337ef2', storagePath: 'vwu/annual-reports/1788080335912-FinancialAuditStatement-2023-24.pdf', order: 2 },
  { category: 'financial-audit-statements', label: '2022-23', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080343119-FinancialAuditStatement-2022-23.pdf?alt=media&token=6eb6fd81-83c9-49f1-9f04-0d22bfc85dac', storagePath: 'vwu/annual-reports/1788080343119-FinancialAuditStatement-2022-23.pdf', order: 3 },
  { category: 'financial-audit-statements', label: '2021-22', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080360708-FinancialAuditStatement-2021-22.pdf?alt=media&token=1d25e42b-86cf-4f01-8263-0796b0aa3fc1', storagePath: 'vwu/annual-reports/1788080360708-FinancialAuditStatement-2021-22.pdf', order: 4 },
  { category: 'financial-audit-statements', label: '2020-21', fileUrl: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/vwu%2Fannual-reports%2F1788080378343-FinancialAuditStatement-2020-21.pdf?alt=media&token=467b2d8c-cdcb-499d-8a8c-315d6c458e4f', storagePath: 'vwu/annual-reports/1788080378343-FinancialAuditStatement-2020-21.pdf', order: 5 },
];

export default function AnnualReportsAdmin() {
  const { docs, loading } = useOrderedCollection<AnnualReportDoc>('annualReportsDocs', 'order');
  const [form, setForm] = useState<Omit<AnnualReportDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [seeding, setSeeding] = useState(false);
  const [migratingId, setMigratingId] = useState<string | null>(null);
  const [migratingAll, setMigratingAll] = useState(false);
  // Only entries still pointing at a bundled /downloads/ file are
  // migratable — anything already uploaded via FileUploader has a storagePath.
  const unmigrated = docs.filter((d) => !d.storagePath);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleFile = (r: UploadResult) => setForm((p) => ({ ...p, fileUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.label || !form.fileUrl) return alert('Label and a PDF are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'annualReportsDocs', editing), { ...form });
      } else {
        await addDoc(collection(db, 'annualReportsDocs'), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: AnnualReportDoc) => {
    setEditing(d.id);
    setForm({ category: d.category, label: d.label, fileUrl: d.fileUrl, storagePath: d.storagePath || '', order: d.order });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'annualReportsDocs', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm(`Add all ${DEFAULT_ANNUAL_REPORTS.length} current report links as a starting point? You can edit or delete any of them afterwards.`)) return;
    setSeeding(true);
    try {
      for (const d of DEFAULT_ANNUAL_REPORTS) {
        await addDoc(collection(db, 'annualReportsDocs'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter reports: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  // Pulls a doc's bundled /downloads/ PDF and re-uploads it to Firebase
  // Storage, then repoints fileUrl/storagePath at that upload — same
  // migration used for Compliance Documents.
  const migrateDoc = async (d: AnnualReportDoc) => {
    setMigratingId(d.id);
    try {
      const res = await fetch(d.fileUrl);
      if (!res.ok) throw new Error(`Couldn't fetch the existing PDF (${res.status}).`);
      const blob = await res.blob();
      const fileName = d.fileUrl.split('/').pop() || `${d.label}.pdf`;
      const file = new File([blob], fileName, { type: 'application/pdf' });
      const result = await uploadFile(file, 'vwu/annual-reports');
      await updateDoc(doc(db, 'annualReportsDocs', d.id), { fileUrl: result.url, storagePath: result.path });
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

  const filtered = filterCat === 'All' ? docs : docs.filter((d) => d.category === filterCat);
  const categoryLabel = (key: string) => ANNUAL_REPORT_CATEGORIES.find((c) => c.key === key)?.label ?? key;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Report' : 'Add Report'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the "Annual Reports &amp; Reforms" year-by-year archive under Statutory → Governance.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-category">Category *</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {ANNUAL_REPORT_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-label">Label *</label>
            <input id="field-label" value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="2025-26" />
          </div>
          <div className="admin-field admin-field--full">
            <label>PDF File *</label>
            <FileUploader folder="vwu/annual-reports" currentUrl={form.fileUrl} onUploaded={handleFile} label="Upload PDF" />
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
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Reports ({filtered.length})</h2>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="admin-select-sm">
            <option value="All">All Categories</option>
            {ANNUAL_REPORT_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
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
              <thead><tr><th>Order</th><th>Category</th><th>Label</th><th>File</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td>{d.order}</td>
                    <td>{categoryLabel(d.category)}</td>
                    <td>{d.label}</td>
                    <td><a href={d.fileUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                    <td>
                      {!d.storagePath && (
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
