import { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface CareerGuidanceInterestDoc {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  branch?: string;
  year?: string;
  track?: string;
  message?: string;
  status: 'new' | 'read';
  createdAt?: { toDate: () => Date };
}

function formatTimestamp(ts?: { toDate: () => Date }): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CareerGuidanceInterestAdmin() {
  const { docs: rows, loading } = useOrderedCollection<CareerGuidanceInterestDoc>('careerGuidanceInterest', 'createdAt', 'desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = rows.find((r) => r.id === selectedId) || null;

  const open = async (r: CareerGuidanceInterestDoc) => {
    setSelectedId(r.id);
    if (r.status !== 'read') {
      try {
        await updateDoc(doc(db, 'careerGuidanceInterest', r.id), { status: 'read' });
      } catch {
        // Non-fatal — the entry is still viewable even if the flag didn't save.
      }
    }
  };

  const toggleStatus = async (r: CareerGuidanceInterestDoc) => {
    try {
      await updateDoc(doc(db, 'careerGuidanceInterest', r.id), { status: r.status === 'read' ? 'new' : 'read' });
    } catch (e) {
      alert(`Couldn't update: ${(e as Error).message}`);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'careerGuidanceInterest', id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const newCount = rows.filter((r) => r.status !== 'read').length;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">
          Career Guidance Interest ({rows.length}){newCount > 0 && <span className="admin-badge admin-badge--sm" style={{ marginLeft: '0.5rem' }}>{newCount} new</span>}
        </h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Students who submitted the interest form on the Career Guidance Cell page (/placements/career-guidance-cell).
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Status</th><th>Received</th><th>Name</th><th>Email</th><th>Phone</th><th>Branch</th><th>Year</th><th>Track</th><th>Actions</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => open(r)}>
                    <td>
                      <button
                        className={`admin-badge admin-badge--clickable admin-badge--sm ${r.status === 'read' ? 'admin-badge--gray' : 'admin-badge--green'}`}
                        onClick={(e) => { e.stopPropagation(); toggleStatus(r); }}
                      >
                        {r.status === 'read' ? 'Read' : 'New'}
                      </button>
                    </td>
                    <td>{formatTimestamp(r.createdAt)}</td>
                    <td>{r.fullName}</td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>{r.branch || '—'}</td>
                    <td>{r.year || '—'}</td>
                    <td>{r.track || '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={(e) => { e.stopPropagation(); open(r); }}>View</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={(e) => { e.stopPropagation(); remove(r.id); }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={9} className="admin-empty">No submissions yet.</td></tr>}
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
          <div className="admin-detail-row"><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></div>
          <div className="admin-detail-row"><strong>Phone:</strong> <a href={`tel:${selected.phone}`}>{selected.phone}</a></div>
          {selected.branch && <div className="admin-detail-row"><strong>Branch / Department:</strong> {selected.branch}</div>}
          {selected.year && <div className="admin-detail-row"><strong>Year of Study:</strong> {selected.year}</div>}
          {selected.track && <div className="admin-detail-row"><strong>Interested Track:</strong> {selected.track}</div>}
          {selected.message && <div className="admin-detail-row"><strong>Message:</strong> {selected.message}</div>}
          <div className="admin-detail-row"><strong>Received:</strong> {formatTimestamp(selected.createdAt)}</div>
        </div>
      )}
    </div>
  );
}
