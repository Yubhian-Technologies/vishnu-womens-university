import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import type { CoreExecutiveMember } from '../../About/About';

type CoreExecutiveDoc = CoreExecutiveMember & { storagePath?: string };

const EMPTY: Omit<CoreExecutiveDoc, 'id'> = {
  name: '', role: '', photoUrl: '', storagePath: '', order: 0, level: 1,
  qualification: '', experience: '', email: '', bio: '',
};

export default function CoreExecutivesAdmin() {
  const { docs: executives, loading } = useOrderedCollection<CoreExecutiveDoc>('coreExecutives', 'order');
  const [form, setForm] = useState<Omit<CoreExecutiveDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, photoUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.name) return alert('Name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'coreExecutives', editing), { ...form });
      } else {
        await addDoc(collection(db, 'coreExecutives'), {
          ...form,
          order: form.order || executives.length + 1,
          level: form.level || 1,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (m: CoreExecutiveDoc) => {
    setEditing(m.id);
    setForm({
      name: m.name, role: m.role, photoUrl: m.photoUrl || '', storagePath: m.storagePath || '', order: m.order, level: m.level || 1,
      qualification: m.qualification || '', experience: m.experience || '', email: m.email || '', bio: m.bio || '',
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this executive?')) return;
    try {
      await deleteDoc(doc(db, 'coreExecutives', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const clearAll = async () => {
    if (executives.length === 0) return;
    if (!confirm(`Delete all ${executives.length} executives? This cannot be undone.`)) return;
    setClearing(true);
    try {
      for (let i = 0; i < executives.length; i += 450) {
        const batch = writeBatch(db);
        executives.slice(i, i + 450).forEach((m) => batch.delete(doc(db, 'coreExecutives', m.id)));
        await batch.commit();
      }
    } catch (e) {
      alert(`Couldn't delete all: ${(e as Error).message}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Executive' : 'Add Core Executive'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Photo (optional — initials shown if omitted)</label>
            <ImageUploader folder="vwu/core-executives" currentUrl={form.photoUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-full-name">Full Name *</label>
            <input id="field-full-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. G. Srinivasa Rao" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-role-title">Role / Title</label>
            <input id="field-role-title" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Principal" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-level-org-chart-tier">Level (org-chart tier)</label>
            <select id="field-level-org-chart-tier" value={form.level || 1} onChange={(e) => set('level', Number(e.target.value))}>
              <option value={1}>Level 1</option>
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-qualification">Qualification (shown on hover)</label>
            <input id="field-qualification" value={form.qualification || ''} onChange={(e) => set('qualification', e.target.value)} placeholder="Ph.D. in Computer Science" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-experience">Experience (shown on hover)</label>
            <input id="field-experience" value={form.experience || ''} onChange={(e) => set('experience', e.target.value)} placeholder="20+ years in academia" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-email">Email (shown on hover)</label>
            <input id="field-email" type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} placeholder="name@vwu.edu.in" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="field-bio">Short Bio (shown on hover)</label>
            <textarea id="field-bio" rows={3} value={form.bio || ''} onChange={(e) => set('bio', e.target.value)} placeholder="A brief note about this executive's role and contribution." />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Executive'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Core Executive Body ({executives.length})</h2>
          {executives.length > 0 && (
            <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={clearAll} disabled={clearing}>
              {clearing ? 'Clearing…' : 'Clear All'}
            </button>
          )}
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Role</th><th>Order</th><th>Level</th><th>Actions</th></tr></thead>
              <tbody>
                {executives.map((m) => (
                  <tr key={m.id}>
                    <td>{m.photoUrl ? <img src={m.photoUrl} alt="" className="admin-table__avatar" /> : '👤'}</td>
                    <td>{m.name}</td>
                    <td>{m.role}</td>
                    <td>{m.order}</td>
                    <td>{m.level || 1}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(m)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(m.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {executives.length === 0 && <tr><td colSpan={6} className="admin-empty">No executives yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
