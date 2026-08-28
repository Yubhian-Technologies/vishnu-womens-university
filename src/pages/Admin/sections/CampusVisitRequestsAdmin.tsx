import { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface CampusVisitRequestDoc {
  id: string;
  type: 'group' | 'individual' | 'virtual' | 'openday';
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  numberOfPersons?: string;
  department?: string;
  program?: string;
  message?: string;
  status: 'new' | 'read';
  createdAt?: { toDate: () => Date };
}

const TYPE_LABELS: Record<CampusVisitRequestDoc['type'], string> = {
  group: 'Group Campus Tour',
  individual: 'Individual Visit Day',
  virtual: 'Virtual Campus Tour',
  openday: 'Open Day (Admitted Students)',
};

function formatTimestamp(ts?: { toDate: () => Date }): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDate(d: string): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CampusVisitRequestsAdmin() {
  const { docs: requests, loading } = useOrderedCollection<CampusVisitRequestDoc>('campusVisitRequests', 'createdAt', 'desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = requests.find((r) => r.id === selectedId) || null;

  const openRequest = async (r: CampusVisitRequestDoc) => {
    setSelectedId(r.id);
    if (r.status !== 'read') {
      try {
        await updateDoc(doc(db, 'campusVisitRequests', r.id), { status: 'read' });
      } catch {
        // Non-fatal — the request is still viewable even if the status flag didn't save.
      }
    }
  };

  const toggleStatus = async (r: CampusVisitRequestDoc) => {
    try {
      await updateDoc(doc(db, 'campusVisitRequests', r.id), { status: r.status === 'read' ? 'new' : 'read' });
    } catch (e) {
      alert(`Couldn't update: ${(e as Error).message}`);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this request? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'campusVisitRequests', id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const newCount = requests.filter((r) => r.status !== 'read').length;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">
          Campus Visit Requests ({requests.length}){newCount > 0 && <span className="admin-badge admin-badge--sm" style={{ marginLeft: '0.5rem' }}>{newCount} new</span>}
        </h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Status</th><th>Received</th><th>Type</th><th>Name</th><th>Email</th><th>Phone</th><th>Preferred Date</th><th>Actions</th></tr></thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => openRequest(r)}>
                    <td>
                      <button
                        className={`admin-badge admin-badge--clickable admin-badge--sm ${r.status === 'read' ? 'admin-badge--gray' : 'admin-badge--green'}`}
                        onClick={(e) => { e.stopPropagation(); toggleStatus(r); }}
                      >
                        {r.status === 'read' ? 'Read' : 'New'}
                      </button>
                    </td>
                    <td>{formatTimestamp(r.createdAt)}</td>
                    <td>{TYPE_LABELS[r.type] ?? r.type}</td>
                    <td>{r.fullName}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>{formatDate(r.preferredDate)}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={(e) => { e.stopPropagation(); openRequest(r); }}>View</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={(e) => { e.stopPropagation(); remove(r.id); }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && <tr><td colSpan={8} className="admin-empty">No campus visit requests yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="admin-card admin-detail-card">
          <div className="admin-detail-card__header">
            <h2 className="admin-card__title">{selected.fullName}</h2>
            <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setSelectedId(null)}>Close</button>
          </div>
          <div className="admin-detail-row"><strong>Visit Type:</strong> {TYPE_LABELS[selected.type] ?? selected.type}</div>
          <div className="admin-detail-row"><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></div>
          <div className="admin-detail-row"><strong>Phone:</strong> <a href={`tel:${selected.phone}`}>{selected.phone}</a></div>
          <div className="admin-detail-row"><strong>Preferred Date:</strong> {formatDate(selected.preferredDate)}</div>
          {selected.numberOfPersons && <div className="admin-detail-row"><strong>Number of Visitors:</strong> {selected.numberOfPersons}</div>}
          {selected.department && <div className="admin-detail-row"><strong>Department:</strong> {selected.department}</div>}
          {selected.program && <div className="admin-detail-row"><strong>Program:</strong> {selected.program}</div>}
          {selected.message && <div className="admin-detail-row"><strong>Notes:</strong> {selected.message}</div>}
          <div className="admin-detail-row"><strong>Received:</strong> {formatTimestamp(selected.createdAt)}</div>
        </div>
      )}
    </div>
  );
}
