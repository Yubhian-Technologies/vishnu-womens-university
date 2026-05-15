import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

interface Announcement {
  id: string;
  text: string;
  link: string;
  active: boolean;
  order: number;
}

const EMPTY: Omit<Announcement, 'id'> = { text: '', link: '', active: true, order: 0 };

export default function AnnouncementsAdmin() {
  const { docs: items, loading } = useOrderedCollection<Announcement>('announcements', 'order');
  const [form, setForm] = useState<Omit<Announcement, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | boolean | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.text) return alert('Announcement text is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'announcements', editing), { ...form });
      } else {
        await addDoc(collection(db, 'announcements'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } finally { setSaving(false); }
  };

  const startEdit = (a: Announcement) => {
    setEditing(a.id);
    setForm({ text: a.text, link: a.link, active: a.active, order: a.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    await deleteDoc(doc(db, 'announcements', id));
  };

  const toggle = async (a: Announcement) => {
    await updateDoc(doc(db, 'announcements', a.id), { active: !a.active });
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Announcement' : 'Add Announcement'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Announcements scroll in the top bar of the website.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Text *</label>
            <input value={form.text} onChange={(e) => set('text', e.target.value)} placeholder="e.g. Admissions open for 2025-26 — Apply Now!" />
          </div>
          <div className="admin-field">
            <label>Link (optional)</label>
            <input value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="/admissions or https://…" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>Active</label>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
              <span>Visible on site</span>
            </label>
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Announcements ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>#</th><th>Text</th><th>Link</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.order}</td>
                    <td>{a.text}</td>
                    <td>{a.link ? <a href={a.link} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>{a.link}</a> : '—'}</td>
                    <td>
                      <button
                        className={`admin-badge admin-badge--clickable ${a.active ? 'admin-badge--green' : 'admin-badge--gray'}`}
                        onClick={() => toggle(a)}
                      >
                        {a.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(a)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="admin-empty">No announcements yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
