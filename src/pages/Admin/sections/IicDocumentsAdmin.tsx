import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

interface DocEntryDoc extends WithId {
  label: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

function DocumentListEditor({
  title,
  helpText,
  collectionName,
  storageFolder,
}: {
  title: string;
  helpText: string;
  collectionName: string;
  storageFolder: string;
}) {
  const { docs: entries, loading } = useOrderedCollection<DocEntryDoc>(collectionName, 'order');
  const [newLabel, setNewLabel] = useState('');
  const [newFile, setNewFile] = useState<UploadResult | null>(null);
  const [adding, setAdding] = useState(false);

  const addEntry = async () => {
    if (!newLabel || !newFile) return alert('Enter a label and upload a PDF first.');
    setAdding(true);
    try {
      await addDoc(collection(db, collectionName), {
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

  const removeEntry = async (entry: DocEntryDoc) => {
    if (!confirm('Delete this entry?')) return;
    try {
      if (entry.storagePath) await deleteFile(entry.storagePath);
      await deleteDoc(doc(db, collectionName, entry.id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading…</p>;
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{title} ({entries.length})</h3>
      <p className="admin-lead" style={{ marginBottom: '1rem' }}>{helpText}</p>
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
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="admin-empty">None yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '1rem', border: '1px solid var(--color-light-gray, #ddd)', borderRadius: 6, padding: '0.75rem' }}>
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="e.g. Rating Certificate_2025-26"
          style={{ flex: 1 }}
        />
        <div style={{ flex: 1 }}>
          <FileUploader folder={storageFolder} currentUrl={newFile?.url} onUploaded={setNewFile} label="Upload PDF" />
        </div>
        <button type="button" className="admin-btn admin-btn--sm admin-btn--primary" onClick={addEntry} disabled={adding}>
          {adding ? 'Adding…' : '+ Add'}
        </button>
      </div>
    </div>
  );
}

/**
 * Year/label + PDF lists for the Institution Innovation Cell differentiator
 * page — IIC Council Members, Innovation Ambassador links, IIC Activities,
 * Rating Certificates, IIC Annual Reports, SIH Internal Hackathon Reports,
 * and National Innovation Start-Up Policy links. Add a label, upload the
 * PDF, click Add — no code changes needed for a new year.
 */
export default function IicDocumentsAdmin() {
  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Institution Innovation Cell Documents</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1.5rem' }}>
        Powers the PDF links on the Institution Innovation Cell page's IIC – Constitution, Innovation
        Ambassadors, IIC Activities, Rating Certificates, IIC Annual Reports, SIH Internal Hackathon
        Reports, and National Innovation Start-Up Policy tabs.
      </p>
      <DocumentListEditor
        title="IIC Council Members PDF"
        helpText={'The "Click here to view" link at the bottom of the IIC – Constitution tab. Keep just one entry here.'}
        collectionName="iicCouncilMembersLinks"
        storageFolder="vwu/iic/council-members"
      />
      <DocumentListEditor
        title="Innovation Ambassador Links"
        helpText="The Faculty/Student Innovation Ambassador links shown on the Innovation Ambassadors tab."
        collectionName="iicInnovationAmbassadorLinks"
        storageFolder="vwu/iic/innovation-ambassadors"
      />
      <DocumentListEditor
        title="IIC Activities"
        helpText="One PDF per year, shown on the IIC Activities tab, in display order."
        collectionName="iicActivities"
        storageFolder="vwu/iic/activities"
      />
      <DocumentListEditor
        title="Rating Certificates"
        helpText="Certificates and appreciation letters shown on the Rating Certificates tab, in display order."
        collectionName="iicRatingCertificates"
        storageFolder="vwu/iic/rating-certificates"
      />
      <DocumentListEditor
        title="IIC Annual Reports"
        helpText="One PDF per academic year, in display order."
        collectionName="iicAnnualReports"
        storageFolder="vwu/iic/annual-reports"
      />
      <DocumentListEditor
        title="SIH Internal Hackathon Reports"
        helpText="One PDF per year, in display order."
        collectionName="iicSihHackathonReports"
        storageFolder="vwu/iic/sih-hackathon"
      />
      <DocumentListEditor
        title="National Innovation Start-Up Policy Links"
        helpText="Policy document links shown on the National Innovation Start-Up Policy tab."
        collectionName="iicNispPolicies"
        storageFolder="vwu/iic/nisp"
      />
    </div>
  );
}
