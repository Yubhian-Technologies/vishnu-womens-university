import { useState } from 'react';
import { doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { Phone, CheckCircle, Search, Edit3, UserCheck, Clock, XCircle, AlertCircle } from 'lucide-react';

export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'admitted' | 'closed';

export interface CrmLeadDoc {
  id: string;
  firstName: string;
  lastName?: string;
  phone: string;
  program: string;
  purpose: string;
  phoneVerified?: boolean;
  status?: LeadStatus | 'read';
  notes?: string;
  assignedTo?: string;
  createdAt?: { toDate: () => Date };
}

function formatTimestamp(ts?: { toDate: () => Date }): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; icon: typeof CheckCircle }> = {
  new: { label: 'New Lead', badgeClass: 'admin-badge--green', icon: AlertCircle },
  read: { label: 'Contacted', badgeClass: 'admin-badge--blue', icon: Clock },
  contacted: { label: 'Contacted', badgeClass: 'admin-badge--blue', icon: Clock },
  in_progress: { label: 'In Progress', badgeClass: 'admin-badge--yellow', icon: Edit3 },
  admitted: { label: 'Admitted', badgeClass: 'admin-badge--purple', icon: UserCheck },
  closed: { label: 'Closed', badgeClass: 'admin-badge--gray', icon: XCircle },
};

export default function AdmissionsCrmAdmin() {
  const { docs: leads, loading } = useOrderedCollection<CrmLeadDoc>('admissionInquiries', 'createdAt', 'desc');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<string>('');

  const selected = leads.find((l) => l.id === selectedId) || null;

  const openLead = (l: CrmLeadDoc) => {
    setSelectedId(l.id);
    setEditingNotes(l.notes || '');
    if (l.status === 'new' || !l.status) {
      updateLeadStatus(l.id, 'contacted');
    }
  };

  const updateLeadStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      await updateDoc(doc(db, 'admissionInquiries', id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      alert(`Could not update lead status: ${(e as Error).message}`);
    }
  };

  const saveLeadNotes = async () => {
    if (!selectedId) return;
    try {
      await updateDoc(doc(db, 'admissionInquiries', selectedId), {
        notes: editingNotes,
        updatedAt: serverTimestamp(),
      });
      alert('Counselor notes saved successfully.');
    } catch (e) {
      alert(`Could not save notes: ${(e as Error).message}`);
    }
  };

  const removeLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'admissionInquiries', id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      alert(`Could not delete lead: ${(e as Error).message}`);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const normStatus = l.status === 'read' ? 'contacted' : (l.status || 'new');
    const matchesStatus = statusFilter === 'all' || normStatus === statusFilter;
    const matchesProgram = programFilter === 'all' || l.program === programFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      l.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.lastName && l.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.phone.includes(searchQuery);
    return matchesStatus && matchesProgram && matchesSearch;
  });

  // Metrics
  const totalLeads = leads.length;
  const newCount = leads.filter((l) => !l.status || l.status === 'new').length;
  const inProgressCount = leads.filter((l) => l.status === 'in_progress' || l.status === 'contacted' || l.status === 'read').length;
  const admittedCount = leads.filter((l) => l.status === 'admitted').length;

  return (
    <div className="admin-section">
      {/* CRM Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="admin-card" style={{ padding: '1.2rem', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>Total Leads</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>{totalLeads}</div>
        </div>
        <div className="admin-card" style={{ padding: '1.2rem', textAlign: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#166534', fontWeight: 700 }}>New Leads</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', marginTop: '0.2rem' }}>{newCount}</div>
        </div>
        <div className="admin-card" style={{ padding: '1.2rem', textAlign: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1e40af', fontWeight: 700 }}>Active Pipeline</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1d4ed8', marginTop: '0.2rem' }}>{inProgressCount}</div>
        </div>
        <div className="admin-card" style={{ padding: '1.2rem', textAlign: 'center', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b21a8', fontWeight: 700 }}>Admitted / Enrolled</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7e22ce', marginTop: '0.2rem' }}>{admittedCount}</div>
        </div>
      </div>

      {/* Main CRM Table Card */}
      <div className="admin-card">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <h2 className="admin-card__title" style={{ margin: 0 }}>
              Admissions CRM Leads
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0.2rem 0 0' }}>
              Track, manage, and process student application inquiries in real-time.
            </p>
          </div>

          {/* Filters & Search */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search name or phone…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.45rem 0.75rem 0.45rem 2.2rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#ffffff' }}
            >
              <option value="all">All Statuses</option>
              <option value="new">New Lead</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="admitted">Admitted</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#ffffff' }}
            >
              <option value="all">All Programs</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
              <option value="Ph.D.">Ph.D.</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="admin-loading">Loading CRM leads…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status Stage</th>
                  <th>Received Date</th>
                  <th>Student Name</th>
                  <th>Mobile Phone</th>
                  <th>Program</th>
                  <th>Purpose</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((l) => {
                  const normStatus = l.status === 'read' ? 'contacted' : (l.status || 'new');
                  const cfg = STATUS_CONFIG[normStatus] || STATUS_CONFIG.new;
                  const StatusIcon = cfg.icon;

                  return (
                    <tr key={l.id} style={{ cursor: 'pointer', background: selectedId === l.id ? '#f1f5f9' : undefined }} onClick={() => openLead(l)}>
                      <td>
                        <span className={`admin-badge ${cfg.badgeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <StatusIcon size={12} />
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.83rem', whiteSpace: 'nowrap' }}>{formatTimestamp(l.createdAt)}</td>
                      <td style={{ fontWeight: 700 }}>{[l.firstName, l.lastName].filter(Boolean).join(' ')}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {l.phone}{' '}
                        {l.phoneVerified && (
                          <span className="admin-badge admin-badge--sm admin-badge--green" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                            <CheckCircle size={10} style={{ marginRight: 2 }} /> OTP Verified
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{l.program}</td>
                      <td>{l.purpose}</td>
                      <td>
                        <button
                          className="admin-btn admin-btn--sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLead(l);
                          }}
                        >
                          Open CRM
                        </button>
                        <button
                          className="admin-btn admin-btn--sm admin-btn--danger"
                          style={{ marginLeft: '0.3rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLead(l.id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="admin-empty">
                      No matching CRM leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Lead CRM Detail Panel */}
      {selected && (
        <div className="admin-card admin-detail-card" style={{ background: '#ffffff', border: '1.5px solid #0b1e42', borderRadius: '12px', marginTop: '1.5rem', padding: '1.5rem' }}>
          <div className="admin-detail-card__header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C9A84C' }}>
                Lead CRM Record
              </span>
              <h2 className="admin-card__title" style={{ margin: 0, fontSize: '1.4rem' }}>
                {selected.firstName}
              </h2>
            </div>
            <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setSelectedId(null)}>
              Close Panel
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
            <div className="admin-detail-row">
              <strong>Student Name:</strong> {selected.firstName}
            </div>
            <div className="admin-detail-row">
              <strong>Mobile Phone:</strong>{' '}
              <a href={`tel:${selected.phone}`} style={{ fontWeight: 700, color: '#0b1e42' }}>
                <Phone size={13} style={{ display: 'inline', marginRight: 4 }} />
                {selected.phone}
              </a>{' '}
              {selected.phoneVerified && (
                <span className="admin-badge admin-badge--sm admin-badge--green" style={{ marginLeft: 4 }}>
                  OTP Verified
                </span>
              )}
            </div>
            <div className="admin-detail-row">
              <strong>Program Interest:</strong> {selected.program}
            </div>
            <div className="admin-detail-row">
              <strong>Inquiry Purpose:</strong> {selected.purpose}
            </div>
            <div className="admin-detail-row">
              <strong>Submission Date:</strong> {formatTimestamp(selected.createdAt)}
            </div>
            <div className="admin-detail-row">
              <strong>Funnel Stage:</strong>{' '}
              <select
                value={selected.status === 'read' ? 'contacted' : (selected.status || 'new')}
                onChange={(e) => updateLeadStatus(selected.id, e.target.value as LeadStatus)}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '6px' }}
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="admitted">Admitted / Enrolled</option>
                <option value="closed">Closed / Not Interested</option>
              </select>
            </div>
          </div>

          {/* Counselor Notes */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.4rem' }}>
              Admissions Counselor Notes
            </label>
            <textarea
              rows={3}
              placeholder="Enter follow-up notes, call history, or counseling status..."
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
            />
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="admin-btn admin-btn--sm" onClick={saveLeadNotes}>
                Save Counselor Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
