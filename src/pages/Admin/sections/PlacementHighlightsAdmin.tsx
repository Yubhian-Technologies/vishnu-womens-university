import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';

export interface PlacementHighlightDoc {
  id: string;
  name: string;
  package: string;
  companyName: string;
  photoUrl: string;
  photoStoragePath: string;
  logoUrl: string;
  logoStoragePath: string;
  order: number;
}

const EMPTY: Omit<PlacementHighlightDoc, 'id'> = {
  name: '', package: '', companyName: '',
  photoUrl: '', photoStoragePath: '',
  logoUrl: '', logoStoragePath: '',
  order: 0,
};

// Backs two Home sections from the same data: the small auto-rotating card
// in "Educate a Woman, Transform the World" (WomensEducationSection.tsx,
// falls back to its own hardcoded defaults until a highlight exists here),
// and the full "Our Latest Graduates Conquering the World" carousel
// (LatestGraduatesShowcase.tsx, which has no fallback — it stays hidden
// entirely until at least one highlight is added here).
export default function PlacementHighlightsAdmin() {
  const { docs: highlights, loading } = useOrderedCollection<PlacementHighlightDoc>('placementHighlights', 'order');
  const [form, setForm] = useState<Omit<PlacementHighlightDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handlePhoto = (r: UploadResult) => setForm((p) => ({ ...p, photoUrl: r.url, photoStoragePath: r.path }));
  const handleLogo = (r: UploadResult) => setForm((p) => ({ ...p, logoUrl: r.url, logoStoragePath: r.path }));

  const save = async () => {
    if (!form.name || !form.package || !form.photoUrl) {
      return alert('Name, package, and photo are required.');
    }
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'placementHighlights', editing), { ...form });
      } else {
        await addDoc(collection(db, 'placementHighlights'), {
          ...form,
          order: form.order || highlights.length,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (h: PlacementHighlightDoc) => {
    setEditing(h.id);
    setForm({
      name: h.name, package: h.package, companyName: h.companyName || '',
      photoUrl: h.photoUrl || '', photoStoragePath: h.photoStoragePath || '',
      logoUrl: h.logoUrl || '', logoStoragePath: h.logoStoragePath || '',
      order: h.order,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this placement highlight?')) return;
    try {
      await deleteDoc(doc(db, 'placementHighlights', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Placement Highlight' : 'Add Placement Highlight'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Student Photo *</label>
            <ImageUploader folder="vwu/placement-highlights/photos" currentUrl={form.photoUrl} onUploaded={handlePhoto} label="Upload Photo" aspect={1} />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1', maxWidth: 200 }}>
            <label>Company Logo</label>
            <ImageUploader folder="vwu/placement-highlights/logos" currentUrl={form.logoUrl} onUploaded={handleLogo} label="Upload Logo" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-ph-name">Student Name *</label>
            <input id="field-ph-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Reddi Sree Nithya" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-ph-package">Package *</label>
            <input id="field-ph-package" value={form.package} onChange={(e) => set('package', e.target.value)} placeholder="59.29 LPA" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-ph-company">Company Name (logo alt text)</label>
            <input id="field-ph-company" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="Amazon" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-ph-order">Display Order</label>
            <input id="field-ph-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Highlight'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Placement Highlights ({highlights.length})</h2>
        <p className="admin-field__hint">
          Shown on Home in two places: the "Educate a Woman, Transform the World" section (rotates every few
          seconds; shows its original hardcoded defaults until at least one highlight is added here), and the
          "Our Latest Graduates Conquering the World" carousel further down the page — which stays hidden
          entirely until at least one highlight exists here.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Photo</th><th>Logo</th><th>Name</th><th>Package</th><th>Company</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {highlights.map((h) => (
                  <tr key={h.id}>
                    <td>{h.photoUrl ? <img src={h.photoUrl} alt="" className="admin-table__avatar" /> : '👤'}</td>
                    <td>{h.logoUrl ? <img src={h.logoUrl} alt="" className="admin-table__avatar" /> : '—'}</td>
                    <td>{h.name}</td>
                    <td>{h.package}</td>
                    <td>{h.companyName}</td>
                    <td>{h.order}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(h)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(h.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {highlights.length === 0 && <tr><td colSpan={7} className="admin-empty">No highlights yet — add one using the form above.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
