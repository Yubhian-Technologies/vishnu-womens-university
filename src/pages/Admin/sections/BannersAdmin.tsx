import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import CloudinaryUploader from '../../../components/CloudinaryUploader/CloudinaryUploader';
import type { CloudinaryResult } from '../../../lib/cloudinary';

interface Banner {
  id: string;
  page: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  publicId: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
}

const EMPTY: Omit<Banner, 'id'> = {
  page: 'home', title: '', subtitle: '', imageUrl: '', publicId: '',
  ctaLabel: '', ctaLink: '', order: 0,
};

const PAGES = [
  { value: 'home',           label: 'Home (Carousel)' },
  { value: 'academics',      label: 'Academics' },
  { value: 'admissions',     label: 'Admissions' },
  { value: 'student-life',   label: 'Student Life' },
  { value: 'placements',     label: 'Placements' },
  { value: 'alumni-giving',  label: 'Alumni & Giving' },
  { value: 'news-awards',    label: 'News & Awards' },
  { value: 'contact',        label: 'Contact Us' },
  { value: 'careers',        label: 'Careers' },
];

export default function BannersAdmin() {
  const { docs: banners, loading } = useOrderedCollection<Banner>('banners', 'order');
  const [form, setForm] = useState<Omit<Banner, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageUploaded = (r: CloudinaryResult) => {
    setForm((p) => ({ ...p, imageUrl: r.secure_url, publicId: r.public_id }));
  };

  const save = async () => {
    if (!form.title || !form.imageUrl) return alert('Title and image are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'banners', editing), { ...form });
      } else {
        await addDoc(collection(db, 'banners'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (b: Banner) => {
    setEditing(b.id);
    setForm({
      page: b.page ?? 'home',
      title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl,
      publicId: b.publicId, ctaLabel: b.ctaLabel, ctaLink: b.ctaLink, order: b.order,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    await deleteDoc(doc(db, 'banners', id));
  };

  const pageLabel = (val: string) => PAGES.find((p) => p.value === val)?.label ?? val;

  return (
    <div className="admin-section">
      {/* Form */}
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Banner' : 'Add New Banner'}</h2>

        {/* Page selector — most important field, at the top */}
        <div className="admin-page-selector">
          <p className="admin-page-selector__label">Which page is this banner for?</p>
          <div className="admin-page-selector__grid">
            {PAGES.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`admin-page-btn${form.page === p.value ? ' active' : ''}`}
                onClick={() => set('page', p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-form-grid" style={{ marginTop: '1.25rem' }}>
          <div className="admin-field admin-field--full">
            <label>Banner Image *</label>
            <CloudinaryUploader
              folder={`vwu/banners/${form.page}`}
              currentUrl={form.imageUrl}
              onUploaded={handleImageUploaded}
              label="Upload Hero Image (recommended: 1920×600px)"
            />
          </div>
          <div className="admin-field">
            <label>Heading *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. You Will Excel." />
          </div>
          <div className="admin-field">
            <label>Subheading</label>
            <input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)}
              placeholder="Supporting text shown below the heading" />
          </div>
          <div className="admin-field">
            <label>Button Label</label>
            <input value={form.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)}
              placeholder="e.g. Explore Programs" />
          </div>
          <div className="admin-field">
            <label>Button Link</label>
            <input value={form.ctaLink} onChange={(e) => set('ctaLink', e.target.value)}
              placeholder="/academics" />
          </div>
          <div className="admin-field">
            <label>Order (for carousel)</label>
            <input type="number" value={form.order}
              onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>

        <div className="admin-form-actions">
          {editing && (
            <button className="admin-btn admin-btn--ghost"
              onClick={() => { setEditing(null); setForm(EMPTY); }}>
              Cancel
            </button>
          )}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update Banner' : `Add to ${pageLabel(form.page)}`}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="admin-card">
        <h2 className="admin-card__title">All Banners ({banners.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-image-grid">
            {banners.map((b) => (
              <div key={b.id} className="admin-image-card">
                <img src={b.imageUrl} alt={b.title} />
                <div className="admin-image-card__info">
                  <strong>{b.title}</strong>
                  <span className="admin-badge" style={{ marginTop: 4 }}>
                    {pageLabel(b.page ?? 'home')}
                  </span>
                </div>
                <div className="admin-image-card__actions">
                  <button className="admin-btn admin-btn--sm" onClick={() => startEdit(b)}>Edit</button>
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(b.id)}>Delete</button>
                </div>
              </div>
            ))}
            {banners.length === 0 && <p className="admin-empty">No banners yet. Add one above.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
