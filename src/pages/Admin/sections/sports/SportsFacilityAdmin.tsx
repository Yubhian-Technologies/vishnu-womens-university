import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../../hooks/useCollection';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../../lib/storage';
import type { SportsFacilityDoc } from '../../../../lib/sportsPage';

type FacilityItem = WithId & SportsFacilityDoc;

const EMPTY: SportsFacilityDoc = {
  title: '',
  imageUrl: '',
  storagePath: '',
  isFeatured: false,
  tagsString: '',
  order: 0,
};

export default function SportsFacilityAdmin() {
  const { docs: items, loading } = useOrderedCollection<FacilityItem>('sportsFacilities', 'order');
  const [form, setForm] = useState<SportsFacilityDoc>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const set = (k: string, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title.trim()) return alert('Facility name is required.');
    if (!form.imageUrl) return alert('Please upload a photo.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'sportsFacilities', editing), { ...form });
      } else {
        await addDoc(collection(db, 'sportsFacilities'), {
          ...form,
          order: form.order || items.length + 1,
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

  const startEdit = (item: FacilityItem) => {
    setEditing(item.id);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      storagePath: item.storagePath || '',
      isFeatured: !!item.isFeatured,
      tagsString: item.tagsString || '',
      order: item.order,
    });
  };

  // No native window.confirm() — this admin can run inside a sandboxed
  // webview where confirm()/alert() are blocked and throw instead of
  // showing anything, which made Delete look like it silently did nothing.
  // Confirmation is an in-page "Confirm? / Cancel" toggle instead.
  const remove = async (id: string, storagePath?: string) => {
    setConfirmId(null);
    try {
      await deleteDoc(doc(db, 'sportsFacilities', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
      return;
    }
    if (storagePath) {
      deleteFile(storagePath).catch(() => { /* best-effort */ });
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Facility' : 'Add Facility'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Shown in the Bento Grid "Infrastructure & Facilities" section — photo, facility name, feature tags, and featured layout flag.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 260 }}>
            <label>Photo *</label>
            <ImageUploader folder="vwu/sports-facilities" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Photo" aspect={4 / 3} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-facility-title">Facility Name *</label>
            <input id="field-facility-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Olympic Size Swimming Pool" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-facility-tags">Amenity Tags (comma separated)</label>
            <input id="field-facility-tags" value={form.tagsString || ''} onChange={(e) => set('tagsString', e.target.value)} placeholder="10 Lanes, Heated Water, Grandstand Seating" />
          </div>
          <div className="admin-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '1.5rem' }}>
            <input id="field-facility-featured" type="checkbox" checked={!!form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} />
            <label htmlFor="field-facility-featured" style={{ margin: 0, cursor: 'pointer' }}>Feature as Large Bento Spotlight Card</label>
          </div>
          <div className="admin-field">
            <label htmlFor="field-facility-order">Display Order</label>
            <input id="field-facility-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Facility'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Facilities ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Name</th><th>Bento Layout</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.imageUrl ? <img src={item.imageUrl} alt="" className="admin-table__avatar" /> : '🏟️'}</td>
                    <td>
                      <strong>{item.title}</strong>
                      {item.tagsString && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.tagsString}</div>}
                    </td>
                    <td>{item.isFeatured ? '🌟 Large Hero' : 'Standard Card'}</td>
                    <td>{item.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(item)}>Edit</button>
                      {confirmId === item.id ? (
                        <>
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(item.id, item.storagePath)}>Confirm?</button>
                          <button className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => setConfirmId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => setConfirmId(item.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="admin-empty">No facilities yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
