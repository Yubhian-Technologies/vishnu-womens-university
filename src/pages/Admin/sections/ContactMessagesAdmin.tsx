import { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface ContactSubmissionDoc {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read';
  createdAt?: { toDate: () => Date };
}

function formatTimestamp(ts?: { toDate: () => Date }): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ContactMessagesAdmin() {
  const { docs: messages, loading } = useOrderedCollection<ContactSubmissionDoc>('contactSubmissions', 'createdAt', 'desc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = messages.find((m) => m.id === selectedId) || null;

  const openMessage = async (m: ContactSubmissionDoc) => {
    setSelectedId(m.id);
    if (m.status !== 'read') {
      try {
        await updateDoc(doc(db, 'contactSubmissions', m.id), { status: 'read' });
      } catch {
        // Non-fatal — the message is still viewable even if the status flag didn't save.
      }
    }
  };

  const toggleStatus = async (m: ContactSubmissionDoc) => {
    try {
      await updateDoc(doc(db, 'contactSubmissions', m.id), { status: m.status === 'read' ? 'new' : 'read' });
    } catch (e) {
      alert(`Couldn't update: ${(e as Error).message}`);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'contactSubmissions', id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const newCount = messages.filter((m) => m.status !== 'read').length;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">
          Contact Us Messages ({messages.length}){newCount > 0 && <span className="admin-badge admin-badge--sm" style={{ marginLeft: '0.5rem' }}>{newCount} new</span>}
        </h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Status</th><th>Received</th><th>Name</th><th>Email</th><th>Subject</th><th>Actions</th></tr></thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => openMessage(m)}>
                    <td>
                      <button
                        className={`admin-badge admin-badge--clickable admin-badge--sm ${m.status === 'read' ? 'admin-badge--gray' : 'admin-badge--green'}`}
                        onClick={(e) => { e.stopPropagation(); toggleStatus(m); }}
                      >
                        {m.status === 'read' ? 'Read' : 'New'}
                      </button>
                    </td>
                    <td>{formatTimestamp(m.createdAt)}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.subject}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={(e) => { e.stopPropagation(); openMessage(m); }}>View</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={(e) => { e.stopPropagation(); remove(m.id); }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && <tr><td colSpan={6} className="admin-empty">No messages yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="admin-card admin-detail-card">
          <div className="admin-detail-card__header">
            <h2 className="admin-card__title">{selected.subject}</h2>
            <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setSelectedId(null)}>Close</button>
          </div>
          <div className="admin-detail-row"><strong>From:</strong> {selected.name} &lt;<a href={`mailto:${selected.email}`}>{selected.email}</a>&gt;</div>
          {selected.phone && <div className="admin-detail-row"><strong>Phone:</strong> {selected.phone}</div>}
          <div className="admin-detail-row"><strong>Received:</strong> {formatTimestamp(selected.createdAt)}</div>
          <div className="admin-detail-message">{selected.message}</div>
        </div>
      )}
    </div>
  );
}
