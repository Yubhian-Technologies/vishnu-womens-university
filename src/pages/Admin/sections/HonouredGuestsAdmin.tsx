import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import type { HonouredGuestDoc } from '../../../components/HonouredGuests/HonouredGuestsSection';

type FormState = HonouredGuestDoc;
type HonouredGuestItem = WithId & HonouredGuestDoc;

const EMPTY: FormState = { name: '', role: '', imageUrl: '', storagePath: '', order: 0 };

export default function HonouredGuestsAdmin() {
  const { docs: guests, loading } = useOrderedCollection<HonouredGuestItem>('honouredGuests', 'order');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.name.trim()) return alert('Name is required.');
    if (!form.imageUrl) return alert('Please upload a photo.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'honouredGuests', editing), { ...form });
      } else {
        await addDoc(collection(db, 'honouredGuests'), {
          ...form,
          order: form.order || guests.length + 1,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (g: HonouredGuestItem) => {
    setEditing(g.id);
    setForm({ name: g.name, role: g.role, imageUrl: g.imageUrl, storagePath: g.storagePath || '', order: g.order });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Remove this honoured guest?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'honouredGuests', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Honoured Guest' : 'Add Honoured Guest'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Shown in the "Honoured Guests at VWU" section on the Home page — photo, name, and role only.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Photo *</label>
            <ImageUploader folder="vwu/honoured-guests" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-guest-name">Name *</label>
            <input id="field-guest-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ms. Mary Elizabeth Truss" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-guest-role">Role</label>
            <input id="field-guest-role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Former Prime Minister of United Kingdom" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-guest-order">Display Order</label>
            <input id="field-guest-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Guest'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Honoured Guests ({guests.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Role</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {guests.map((g) => (
                  <tr key={g.id}>
                    <td>{g.imageUrl ? <img src={g.imageUrl} alt="" className="admin-table__avatar" /> : '👤'}</td>
                    <td>{g.name}</td>
                    <td>{g.role}</td>
                    <td>{g.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(g)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(g.id, g.storagePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && <tr><td colSpan={5} className="admin-empty">No honoured guests yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
