import { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface AdmissionInquiryDoc {
  id: string;
  firstName: string;
  phone: string;
  program: string;
  purpose: string;
  phoneVerified?: boolean;
  status: 'new' | 'read';
  createdAt?: { toDate: () => Date };
}

function formatTimestamp(ts?: { toDate: () => Date }): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdmissionInquiriesAdmin() {
  const { docs: inquiries, loading } = useOrderedCollection<AdmissionInquiryDoc>('admissionInquiries', 'createdAt', 'desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = inquiries.find((i) => i.id === selectedId) || null;

  const openInquiry = async (i: AdmissionInquiryDoc) => {
    setSelectedId(i.id);
    if (i.status !== 'read') {
      try {
        await updateDoc(doc(db, 'admissionInquiries', i.id), { status: 'read' });
      } catch {
        // Non-fatal — the inquiry is still viewable even if the status flag didn't save.
      }
    }
  };

  const toggleStatus = async (i: AdmissionInquiryDoc) => {
    try {
      await updateDoc(doc(db, 'admissionInquiries', i.id), { status: i.status === 'read' ? 'new' : 'read' });
    } catch (e) {
      alert(`Couldn't update: ${(e as Error).message}`);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'admissionInquiries', id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const newCount = inquiries.filter((i) => i.status !== 'read').length;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">
          Admission Inquiries ({inquiries.length}){newCount > 0 && <span className="admin-badge admin-badge--sm" style={{ marginLeft: '0.5rem' }}>{newCount} new</span>}
        </h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Status</th><th>Received</th><th>Name</th><th>Phone</th><th>Program</th><th>Purpose</th><th>Actions</th></tr></thead>
              <tbody>
                {inquiries.map((i) => (
                  <tr key={i.id} style={{ cursor: 'pointer' }} onClick={() => openInquiry(i)}>
                    <td>
                      <button
                        className={`admin-badge admin-badge--clickable admin-badge--sm ${i.status === 'read' ? 'admin-badge--gray' : 'admin-badge--green'}`}
                        onClick={(e) => { e.stopPropagation(); toggleStatus(i); }}
                      >
                        {i.status === 'read' ? 'Read' : 'New'}
                      </button>
                    </td>
                    <td>{formatTimestamp(i.createdAt)}</td>
                    <td>{i.firstName}</td>
                    <td>{i.phone}</td>
                    <td>{i.program}</td>
                    <td>{i.purpose}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={(e) => { e.stopPropagation(); openInquiry(i); }}>View</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={(e) => { e.stopPropagation(); remove(i.id); }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && <tr><td colSpan={7} className="admin-empty">No inquiries yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="admin-card admin-detail-card">
          <div className="admin-detail-card__header">
            <h2 className="admin-card__title">{selected.firstName}</h2>
            <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setSelectedId(null)}>Close</button>
          </div>
          <div className="admin-detail-row"><strong>Phone:</strong> <a href={`tel:${selected.phone}`}>{selected.phone}</a> {selected.phoneVerified && <span className="admin-badge admin-badge--sm admin-badge--green">OTP Verified</span>}</div>
          <div className="admin-detail-row"><strong>Program Interest:</strong> {selected.program}</div>
          <div className="admin-detail-row"><strong>Purpose:</strong> {selected.purpose}</div>
          <div className="admin-detail-row"><strong>Received:</strong> {formatTimestamp(selected.createdAt)}</div>
        </div>
      )}
    </div>
  );
}
