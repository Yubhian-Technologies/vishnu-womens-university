import { Fragment, useEffect, useMemo, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { AUDIT_COLLECTION, type AuditAction, type AuditChange } from '../../../lib/auditLog';
import { SECTIONS } from '../AdminLayout';
import './AuditLogAdmin.css';

interface AuditDoc {
  id: string;
  createdAtMs: number;
  actorEmail: string;
  actorRole: string;
  actorDepartment: string;
  action: AuditAction;
  section: string;
  collection: string;
  docId: string;
  docPath: string;
  docLabel: string;
  changes: AuditChange[];
  truncated?: boolean;
}

const PAGE_SIZE = 100;

const ACTION_LABEL: Record<AuditAction, string> = { create: 'Created', update: 'Edited', delete: 'Deleted' };
const ACTION_CLASS: Record<AuditAction, string> = {
  create: 'audit-badge--create',
  update: 'audit-badge--update',
  delete: 'audit-badge--delete',
};

function sectionLabel(id: string): string {
  return SECTIONS.find((s) => s.id === id)?.label ?? id;
}

/** Stored values are JSON text — show strings as plain text, everything else pretty-printed. */
function formatValue(json: string | null): string {
  if (json === null) return '';
  try {
    const v = JSON.parse(json);
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  } catch {
    return json;
  }
}

function formatWhen(ms: number): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function ChangeValue({ json, missing }: { json: string | null; missing: string }) {
  if (json === null) return <span className="audit-value audit-value--none">{missing}</span>;
  const text = formatValue(json);
  return <pre className="audit-value">{text === '' ? '(empty)' : text}</pre>;
}

export default function AuditLogAdmin() {
  const [count, setCount] = useState(PAGE_SIZE);
  const [entries, setEntries] = useState<AuditDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const q = query(collection(db, AUDIT_COLLECTION), orderBy('createdAtMs', 'desc'), limit(count));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AuditDoc, 'id'>) })));
        setError(null);
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );
    return unsub;
  }, [count]);

  const users = useMemo(() => [...new Set(entries.map((e) => e.actorEmail))].sort(), [entries]);
  const sections = useMemo(() => [...new Set(entries.map((e) => e.section))].sort((a, b) => sectionLabel(a).localeCompare(sectionLabel(b))), [entries]);

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (actionFilter && e.action !== actionFilter) return false;
      if (userFilter && e.actorEmail !== userFilter) return false;
      if (sectionFilter && e.section !== sectionFilter) return false;
      if (!term) return true;
      const hay = [e.actorEmail, e.docLabel, e.docPath, sectionLabel(e.section), ...(e.changes ?? []).map((c) => c.field)].join(' ').toLowerCase();
      return hay.includes(term);
    });
  }, [entries, search, actionFilter, userFilter, sectionFilter]);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Audit Log</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Every change made from this admin panel: who made it, where, what changed, and what it was before. Newest first.
        </p>

        <div className="audit-filters">
          <input
            type="search"
            className="audit-filters__search"
            placeholder="Search user, item, section or field…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search audit log"
          />
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} aria-label="Filter by action">
            <option value="">All actions</option>
            <option value="create">Created</option>
            <option value="update">Edited</option>
            <option value="delete">Deleted</option>
          </select>
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} aria-label="Filter by user">
            <option value="">All users</option>
            {users.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} aria-label="Filter by section">
            <option value="">All sections</option>
            {sections.map((s) => <option key={s} value={s}>{sectionLabel(s)}</option>)}
          </select>
        </div>

        {error && (
          <p className="admin-field__hint" role="alert">
            Couldn't load the audit log: {error}. Make sure your Firestore rules allow signed-in admins to read and create documents in <strong>{AUDIT_COLLECTION}</strong>.
          </p>
        )}

        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table audit-table">
              <thead>
                <tr><th>When</th><th>Who</th><th>Action</th><th>Where</th><th>Item</th><th>Changes</th></tr>
              </thead>
              <tbody>
                {shown.map((e) => {
                  const open = expanded === e.id;
                  const changes = e.changes ?? [];
                  return (
                    <Fragment key={e.id}>
                      <tr className={`audit-row${open ? ' audit-row--open' : ''}`}>
                        <td className="audit-nowrap">{formatWhen(e.createdAtMs)}</td>
                        <td>
                          <div>{e.actorEmail}</div>
                          {e.actorRole && <div className="audit-sub">{e.actorRole}{e.actorDepartment && e.actorDepartment !== 'Admin' ? ` · ${e.actorDepartment}` : ''}</div>}
                        </td>
                        <td><span className={`audit-badge ${ACTION_CLASS[e.action] ?? ''}`}>{ACTION_LABEL[e.action] ?? e.action}</span></td>
                        <td>
                          <div>{sectionLabel(e.section)}</div>
                          <div className="audit-sub">{e.collection}</div>
                        </td>
                        <td>
                          <div>{e.docLabel || <span className="audit-sub">(untitled)</span>}</div>
                          <div className="audit-sub">{e.docId}</div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm"
                            onClick={() => setExpanded(open ? null : e.id)}
                            aria-expanded={open}
                          >
                            {open ? 'Hide' : `View (${changes.length})`}
                          </button>
                        </td>
                      </tr>
                      {open && (
                        <tr className="audit-detail-row">
                          <td colSpan={6}>
                            <div className="audit-detail">
                              <p className="audit-detail__path">
                                <strong>{e.docPath}</strong>
                                {e.truncated && ' — some fields omitted (entry too large)'}
                              </p>
                              {changes.length === 0 ? (
                                <p className="audit-sub">No field-level details were recorded.</p>
                              ) : (
                                <table className="audit-changes">
                                  <thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead>
                                  <tbody>
                                    {changes.map((c, i) => (
                                      <tr key={`${c.field}-${i}`}>
                                        <td className="audit-changes__field">{c.field}</td>
                                        <td className="audit-changes__before"><ChangeValue json={c.before} missing="(not set)" /></td>
                                        <td className="audit-changes__after"><ChangeValue json={c.after} missing="(removed)" /></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
                {shown.length === 0 && (
                  <tr><td colSpan={6} className="admin-empty">{entries.length === 0 ? 'No changes have been recorded yet.' : 'No entries match these filters.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && entries.length >= count && (
          <div className="admin-form-actions">
            <button className="admin-btn" onClick={() => setCount((c) => c + PAGE_SIZE)}>Load older entries</button>
          </div>
        )}
      </div>
    </div>
  );
}
