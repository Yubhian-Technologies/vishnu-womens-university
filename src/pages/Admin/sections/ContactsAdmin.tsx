import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface ContactDoc {
  id: string;
  dept: string;
  hod: string;
  phone: string;
  email: string;
  order: number;
}

const EMPTY: Omit<ContactDoc, 'id'> = { dept: '', hod: '', phone: '', email: '', order: 0 };

export default function ContactsAdmin() {
  const { docs: contacts, loading } = useOrderedCollection<ContactDoc>('contacts', 'order');
  const [form, setForm] = useState<Omit<ContactDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.dept) return alert('Department is required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'contacts', editing), { ...form });
      } else {
        await addDoc(collection(db, 'contacts'), { ...form, order: form.order || contacts.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (c: ContactDoc) => { setEditing(c.id); setForm({ dept: c.dept, hod: c.hod, phone: c.phone, email: c.email, order: c.order }); };

  const remove = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await deleteDoc(doc(db, 'contacts', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Contact' : 'Add Department Contact'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Department *</label>
            <input value={form.dept} onChange={(e) => set('dept', e.target.value)} placeholder="CSE" />
          </div>
          <div className="admin-field">
            <label>Head of Department</label>
            <input value={form.hod} onChange={(e) => set('hod', e.target.value)} placeholder="Dr. P. Kiran Sree" />
          </div>
          <div className="admin-field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="08816-250864" />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="hod.cse@svecw.edu.in" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Contact'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Department Contacts ({contacts.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Department</th><th>HOD</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.dept}</td>
                    <td>{c.hod}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(c)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {contacts.length === 0 && <tr><td colSpan={5} className="admin-empty">No contacts yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
