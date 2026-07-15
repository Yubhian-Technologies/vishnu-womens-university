import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import type { GoverningBodyMember } from '../../Governance/GoverningBody';

type GoverningBodyDoc = GoverningBodyMember & { storagePath?: string };

const EMPTY: Omit<GoverningBodyDoc, 'id'> = {
  name: '', position: '', category: 'Management', photoUrl: '', storagePath: '', order: 0,
};

const CATEGORIES = [
  'Management', 'Teachers', 'Educationalist / Industrialist',
  'UGC Nominee', 'State Government', 'University Nominee', 'Principal (Ex-Officio)',
];

export default function GoverningBodyAdmin() {
  const { docs: members, loading } = useOrderedCollection<GoverningBodyDoc>('governingBody', 'order');
  const [form, setForm] = useState<Omit<GoverningBodyDoc, 'id'>>(EMPTY);
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
        await updateDoc(doc(db, 'governingBody', editing), { ...form });
      } else {
        await addDoc(collection(db, 'governingBody'), {
          ...form,
          order: form.order || members.length + 1,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (m: GoverningBodyDoc) => {
    setEditing(m.id);
    setForm({ name: m.name, position: m.position, category: m.category,
               photoUrl: m.photoUrl || '', storagePath: m.storagePath || '', order: m.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this Governing Body member?')) return;
    try {
      await deleteDoc(doc(db, 'governingBody', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const clearAll = async () => {
    if (members.length === 0) return;
    if (!confirm(`Delete all ${members.length} Governing Body members? This cannot be undone.`)) return;
    setClearing(true);
    try {
      for (let i = 0; i < members.length; i += 450) {
        const batch = writeBatch(db);
        members.slice(i, i + 450).forEach((m) => batch.delete(doc(db, 'governingBody', m.id)));
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
        <h2 className="admin-card__title">{editing ? 'Edit Member' : 'Add Governing Body Member'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Photo (optional — initials shown if omitted)</label>
            <ImageUploader folder="vwu/governing-body" currentUrl={form.photoUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
          <div className="admin-field">
            <label>Full Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Sri K.V. Vishnu Raju" />
          </div>
          <div className="admin-field">
            <label>Position</label>
            <input value={form.position} onChange={(e) => set('position', e.target.value)} placeholder="Chairman, SVES" />
          </div>
          <div className="admin-field">
            <label>Category</label>
            <input list="gb-categories" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Management" />
            <datalist id="gb-categories">
              {CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Member'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Governing Body Members ({members.length})</h2>
          {members.length > 0 && (
            <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={clearAll} disabled={clearing}>
              {clearing ? 'Clearing…' : 'Clear All'}
            </button>
          )}
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Position</th><th>Category</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.photoUrl ? <img src={m.photoUrl} alt="" className="admin-table__avatar" /> : '👤'}</td>
                    <td>{m.name}</td>
                    <td>{m.position}</td>
                    <td><span className="admin-badge admin-badge--sm">{m.category}</span></td>
                    <td>{m.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(m)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(m.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && <tr><td colSpan={6} className="admin-empty">No Governing Body members yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
