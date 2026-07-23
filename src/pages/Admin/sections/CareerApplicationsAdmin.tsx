import { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface CareerApplicationDoc {
  id: string;
  name: string;
  email: string;
  phone: string;
  dept: string;
  position: string;
  experience: string;
  message: string;
  resumeFileName?: string;
  status: 'new' | 'read';
  createdAt?: { toDate: () => Date };
}

function formatTimestamp(ts?: { toDate: () => Date }): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CareerApplicationsAdmin() {
  const { docs: applications, loading } = useOrderedCollection<CareerApplicationDoc>('careerApplications', 'createdAt', 'desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = applications.find((a) => a.id === selectedId) || null;

  const openApplication = async (a: CareerApplicationDoc) => {
    setSelectedId(a.id);
    if (a.status !== 'read') {
      try {
        await updateDoc(doc(db, 'careerApplications', a.id), { status: 'read' });
      } catch {
        // Non-fatal — the application is still viewable even if the status flag didn't save.
      }
    }
  };

  const toggleStatus = async (a: CareerApplicationDoc) => {
    try {
      await updateDoc(doc(db, 'careerApplications', a.id), { status: a.status === 'read' ? 'new' : 'read' });
    } catch (e) {
      alert(`Couldn't update: ${(e as Error).message}`);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this application? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'careerApplications', id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const newCount = applications.filter((a) => a.status !== 'read').length;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">
          Career Applications ({applications.length}){newCount > 0 && <span className="admin-badge admin-badge--sm" style={{ marginLeft: '0.5rem' }}>{newCount} new</span>}
        </h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Status</th><th>Applied</th><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th>Experience</th><th>Actions</th></tr></thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => openApplication(a)}>
                    <td>
                      <button
                        className={`admin-badge admin-badge--clickable admin-badge--sm ${a.status === 'read' ? 'admin-badge--gray' : 'admin-badge--green'}`}
                        onClick={(e) => { e.stopPropagation(); toggleStatus(a); }}
                      >
                        {a.status === 'read' ? 'Read' : 'New'}
                      </button>
                    </td>
                    <td>{formatTimestamp(a.createdAt)}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.dept}</td>
                    <td>{a.position}</td>
                    <td>{a.experience}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={(e) => { e.stopPropagation(); openApplication(a); }}>View</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={(e) => { e.stopPropagation(); remove(a.id); }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && <tr><td colSpan={8} className="admin-empty">No applications yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="admin-card admin-detail-card">
          <div className="admin-detail-card__header">
            <h2 className="admin-card__title">{selected.position} — {selected.dept}</h2>
            <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setSelectedId(null)}>Close</button>
          </div>
          <div className="admin-detail-row"><strong>Applicant:</strong> {selected.name} &lt;<a href={`mailto:${selected.email}`}>{selected.email}</a>&gt;</div>
          <div className="admin-detail-row"><strong>Phone:</strong> {selected.phone}</div>
          <div className="admin-detail-row"><strong>Experience:</strong> {selected.experience}</div>
          <div className="admin-detail-row"><strong>Applied:</strong> {formatTimestamp(selected.createdAt)}</div>
          {selected.resumeFileName && (
            <div className="admin-detail-row"><strong>Resume:</strong> {selected.resumeFileName} (sent by email at submission time — not stored here)</div>
          )}
          {selected.message && <div className="admin-detail-message">{selected.message}</div>}
        </div>
      )}
    </div>
  );
}
