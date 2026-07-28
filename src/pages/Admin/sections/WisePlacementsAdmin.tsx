import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { deleteFile } from '../../../lib/storage';

interface WisePlacementDoc {
  id: string;
  name: string;
  regdNo: string;
  company: string;
  package: string;
  imageUrl: string;
  storagePath: string;
  order: number;
}

const EMPTY: Omit<WisePlacementDoc, 'id'> = {
  name: '', regdNo: '', company: '', package: '', imageUrl: '', storagePath: '', order: 0,
};

/**
 * Placement highlight cards on the TalentSprint – WISE differentiator page —
 * fully admin-managed (name, regd no, company, package, and photo), unlike
 * most other differentiator photo sections where only the photo is
 * admin-uploaded and the surrounding text is hardcoded. The public page only
 * renders entries that exist here with a photo attached, so nothing shows
 * until an admin actually adds one.
 */
export default function WisePlacementsAdmin() {
  const { docs: items, loading } = useOrderedCollection<WisePlacementDoc>('wisePlacements', 'order');
  const [form, setForm] = useState<Omit<WisePlacementDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.name || !form.company) return alert('Name and company are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'wisePlacements', editing), { ...form });
      } else {
        await addDoc(collection(db, 'wisePlacements'), { ...form, order: items.length, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p: WisePlacementDoc) => {
    setEditing(p.id);
    setForm({ name: p.name, regdNo: p.regdNo, company: p.company, package: p.package, imageUrl: p.imageUrl, storagePath: p.storagePath, order: p.order });
  };

  const remove = async (p: WisePlacementDoc) => {
    if (!confirm('Delete this placement card?')) return;
    try {
      await deleteDoc(doc(db, 'wisePlacements', p.id));
      if (p.storagePath) await deleteFile(p.storagePath);
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Placement Card' : 'Add Placement Card'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1.5rem' }}>
          These are the placement highlight cards shown on the TalentSprint – WISE differentiator page.
          A card only appears on the public site once it has a photo.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Photo</label>
            <ImageUploader folder="vwu/talentsprint-wise" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" aspect={1} />
          </div>
          <div className="admin-field">
            <label>Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Busi Hema Sri" />
          </div>
          <div className="admin-field">
            <label>Regd No</label>
            <input value={form.regdNo} onChange={(e) => set('regdNo', e.target.value)} placeholder="16B01A0531" />
          </div>
          <div className="admin-field">
            <label>Company *</label>
            <input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Amazon" />
          </div>
          <div className="admin-field">
            <label>Package</label>
            <input value={form.package} onChange={(e) => set('package', e.target.value)} placeholder="27 LPA" />
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Card'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Placement Cards ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Company</th><th>Package</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.imageUrl ? <img src={p.imageUrl} alt="" className="admin-table__avatar" /> : '📷'}</td>
                    <td>{p.name}<br /><small>{p.regdNo}</small></td>
                    <td>{p.company}</td>
                    <td>{p.package}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(p)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(p)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">No placement cards yet — add one above.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
