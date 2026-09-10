import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../../hooks/useCollection';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../../lib/storage';
import type { SportsCategoryDoc, SportsGalleryImage } from '../../../../lib/sportsPage';

type CategoryItem = WithId & SportsCategoryDoc;

const EMPTY: SportsCategoryDoc = { title: '', subtitle: '', categoryTag: 'Outdoor', imageUrl: '', storagePath: '', order: 0, about: '', gallery: [] };

export default function SportsCategoryAdmin() {
  const { docs: items, loading } = useOrderedCollection<CategoryItem>('sportsCategories', 'order');
  const [form, setForm] = useState<SportsCategoryDoc>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const addGalleryImage = (r: UploadResult) =>
    setForm((p) => ({ ...p, gallery: [...(p.gallery || []), { url: r.url, storagePath: r.path }] }));

  const removeGalleryImage = (index: number) => {
    const img = form.gallery?.[index];
    if (img?.storagePath) deleteFile(img.storagePath).catch(() => { /* best-effort */ });
    setForm((p) => ({ ...p, gallery: (p.gallery || []).filter((_, i) => i !== index) }));
  };

  const save = async () => {
    if (!form.title.trim()) return alert('Sport name is required.');
    if (!form.imageUrl) return alert('Please upload an icon image.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'sportsCategories', editing), { ...form });
      } else {
        await addDoc(collection(db, 'sportsCategories'), {
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

  const startEdit = (item: CategoryItem) => {
    setEditing(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle || '',
      categoryTag: item.categoryTag || 'Outdoor',
      imageUrl: item.imageUrl,
      storagePath: item.storagePath || '',
      order: item.order,
      about: item.about || '',
      gallery: item.gallery || [],
    });
  };

  // No native window.confirm() — this admin can run inside a sandboxed
  // webview where confirm()/alert() are blocked and throw instead of
  // showing anything, which made Delete look like it silently did nothing.
  // Confirmation is an in-page "Confirm? / Cancel" toggle instead.
  const remove = async (id: string, storagePath?: string) => {
    setConfirmId(null);
    try {
      await deleteDoc(doc(db, 'sportsCategories', id));
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
        <h2 className="admin-card__title">{editing ? 'Edit Sport' : 'Add Sport'}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Shown as a circular badge in "Explore Our Sports" — photo, sport name, tagline, and category filter tag.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Icon / Photo *</label>
            <ImageUploader folder="vwu/sports" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Icon" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-sport-title">Sport Name *</label>
            <input id="field-sport-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Basketball" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-sport-subtitle">Tagline / Subtitle</label>
            <input id="field-sport-subtitle" value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} placeholder="Fast-Paced Action" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-sport-tag">Category Filter Tag</label>
            <select id="field-sport-tag" value={form.categoryTag || 'Outdoor'} onChange={(e) => set('categoryTag', e.target.value)}>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Track & Field">Track & Field</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-sport-order">Display Order</label>
            <input id="field-sport-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
        </div>

        <div className="admin-field" style={{ marginTop: '1.25rem' }}>
          <label htmlFor="field-sport-about">About This Sport (optional)</label>
          <p className="admin-field__hint" style={{ marginBottom: '0.5rem' }}>
            Shown on this sport&apos;s own detail page (opened by clicking its tile). One paragraph per line. Leave blank to hide the About section on that page.
          </p>
          <textarea
            id="field-sport-about"
            value={form.about || ''}
            onChange={(e) => set('about', e.target.value)}
            placeholder="Cricket is one of the most popular sports at VWU, with students competing at state and inter-collegiate level..."
            rows={5}
          />
        </div>

        <div className="admin-field" style={{ marginTop: '1.25rem' }}>
          <label>Gallery (optional)</label>
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            Extra photos shown on this sport&apos;s detail page. Add as many as you like.
          </p>
          {form.gallery && form.gallery.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {form.gallery.map((g: SportsGalleryImage, i: number) => (
                <div key={g.storagePath || i} style={{ position: 'relative' }}>
                  <img src={g.url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    title="Remove"
                    style={{
                      position: 'absolute', top: -8, right: -8, width: 22, height: 22, borderRadius: '50%',
                      border: 'none', background: 'var(--color-danger, #dc2626)', color: '#fff', cursor: 'pointer',
                      fontSize: '13px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div style={{ maxWidth: 200 }}>
            {/* Remounted after every add (key changes with the count) so it
                resets back to an empty "Add Gallery Photo" drop zone instead
                of showing the just-added photo with a "Change Image" button
                — that reads as "replace this one", not "add another", which
                made it look like there was no way to upload more than one. */}
            <ImageUploader key={form.gallery?.length ?? 0} folder="vwu/sports" onUploaded={addGalleryImage} label="Add Gallery Photo" />
          </div>
          <p className="admin-field__hint" style={{ marginTop: '0.5rem' }}>
            Don&apos;t forget to click {editing ? 'Update' : 'Add Sport'} below to save the gallery.
          </p>
        </div>

        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Sport'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Sports ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Icon</th><th>Sport</th><th>Category</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.imageUrl ? <img src={item.imageUrl} alt="" className="admin-table__avatar" /> : '🏆'}</td>
                    <td>
                      <strong>{item.title}</strong>
                      {item.subtitle && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.subtitle}</div>}
                    </td>
                    <td>{item.categoryTag || 'Outdoor'}</td>
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
                {items.length === 0 && <tr><td colSpan={5} className="admin-empty">No sports yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
