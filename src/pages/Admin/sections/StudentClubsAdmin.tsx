import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface ClubDoc {
  id: string;
  name: string;
  desc: string;
  category: string;
  order: number;
}

const EMPTY: Omit<ClubDoc, 'id'> = { name: '', desc: '', category: 'Technical Clubs', order: 0 };

export const CLUB_CATEGORIES = ['Technical Clubs', 'Social & Service Clubs', 'Creative & Arts Clubs'];

export default function StudentClubsAdmin() {
  const { docs: clubs, loading } = useOrderedCollection<ClubDoc>('studentClubs', 'order');
  const [form, setForm] = useState<Omit<ClubDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name) return alert('Club name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'studentClubs', editing), { ...form });
      } else {
        await addDoc(collection(db, 'studentClubs'), { ...form, order: form.order || clubs.length + 1, createdAt: serverTimestamp() });
      }
      setForm({ ...EMPTY, category: form.category }); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (c: ClubDoc) => { setEditing(c.id); setForm({ name: c.name, desc: c.desc, category: c.category, order: c.order }); };

  const remove = async (id: string) => {
    if (!confirm('Delete this club?')) return;
    try {
      await deleteDoc(doc(db, 'studentClubs', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Club' : 'Add Club'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Club Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="CodeChef SVECW Chapter" />
          </div>
          <div className="admin-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CLUB_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Description</label>
            <textarea rows={3} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="What the club does…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Club'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Clubs ({clubs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Category</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {clubs.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td><span className="admin-badge admin-badge--sm">{c.category}</span></td>
                    <td>{c.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(c)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {clubs.length === 0 && <tr><td colSpan={4} className="admin-empty">No clubs yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
