import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface SvesCampusDoc {
  id: string;
  name: string;
  location: string;
  institutions: string[];
  order: number;
}

const EMPTY: Omit<SvesCampusDoc, 'id'> = { name: '', location: '', institutions: [], order: 0 };

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

export default function SvesCampusesAdmin() {
  const { docs: campuses, loading } = useOrderedCollection<SvesCampusDoc>('svesCampuses', 'order');
  const [form, setForm] = useState<Omit<SvesCampusDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | string[]) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name) return alert('Campus name is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'svesCampuses', editing), { ...form });
      } else {
        await addDoc(collection(db, 'svesCampuses'), { ...form, order: form.order || campuses.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (c: SvesCampusDoc) => { setEditing(c.id); setForm({ name: c.name, location: c.location, institutions: c.institutions || [], order: c.order }); };

  const remove = async (id: string) => {
    if (!confirm('Delete this campus?')) return;
    try {
      await deleteDoc(doc(db, 'svesCampuses', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Campus' : 'Add Campus'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Campus Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Green Meadows Campus" />
          </div>
          <div className="admin-field">
            <label>Location</label>
            <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Bhimavaram, West Godavari" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Institutions (one per line)</label>
            <textarea rows={5} value={arrayToLines(form.institutions)} onChange={(e) => set('institutions', linesToArray(e.target.value))} placeholder="Shri Vishnu Engineering College for Women (VWU)" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Campus'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">SVES Campuses ({campuses.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Location</th><th>Institutions</th><th>Actions</th></tr></thead>
              <tbody>
                {campuses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.location}</td>
                    <td>{(c.institutions || []).length}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(c)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {campuses.length === 0 && <tr><td colSpan={4} className="admin-empty">No campuses yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
