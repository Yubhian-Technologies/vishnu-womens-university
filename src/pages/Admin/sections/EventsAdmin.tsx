import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface EventGalleryPhoto {
  url: string;
  storagePath: string;
  caption: string;
}

export interface EventDoc {
  id: string;
  title: string;
  month: string;
  day: string;
  year: string;
  time: string;
  location: string;
  category: string;
  desc: string;
  featured: boolean;
  link: string;
  order: number;
  /** Cover photo shown on the Featured/All Events cards — optional so
   *  existing events keep working with just the date-badge look until an
   *  admin adds one. */
  image?: string;
  imageStoragePath?: string;
  /** Who's running the event — shown on the event detail view; optional. */
  organizer?: string;
  /** Extra photos shown in this event's own gallery on the detail view —
   *  distinct from the single cover `image` above. */
  galleryPhotos?: EventGalleryPhoto[];
}

const EMPTY: Omit<EventDoc, 'id'> = {
  title: '', month: '', day: '', year: '', time: '', location: '', category: 'Academic Events', desc: '', featured: false, link: '', order: 0,
  image: '', imageStoragePath: '', organizer: '', galleryPhotos: [],
};

// Starting suggestions only — the category field is free text (a datalist,
// not a fixed dropdown), so an admin can type any new category here and it
// immediately becomes a real filter pill on the public Events page, with no
// separate "manage categories" step or code change needed.
const CATEGORY_SUGGESTIONS = ['Special Events', 'Academic Events', 'Placements', 'Admissions', 'Alumni Events', 'Sports', 'Cultural Events', 'Technical Events', 'Workshops', 'Seminars', 'Competitions'];

export default function EventsAdmin() {
  const { docs: events, loading } = useOrderedCollection<EventDoc>('events', 'order');
  const [form, setForm] = useState<Omit<EventDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const categoryOptions = Array.from(new Set([...CATEGORY_SUGGESTIONS, ...events.map((e) => e.category).filter(Boolean)]));

  const handleImageUploaded = async (r: UploadResult) => {
    if (form.imageStoragePath) await deleteFile(form.imageStoragePath);
    setForm((p) => ({ ...p, image: r.url, imageStoragePath: r.path }));
  };

  const addGalleryPhoto = (r: UploadResult) => {
    setForm((p) => ({ ...p, galleryPhotos: [...(p.galleryPhotos || []), { url: r.url, storagePath: r.path, caption: '' }] }));
  };
  const setGalleryCaption = (i: number, caption: string) => {
    setForm((p) => ({ ...p, galleryPhotos: (p.galleryPhotos || []).map((g, gi) => (gi === i ? { ...g, caption } : g)) }));
  };
  const removeGalleryPhoto = async (i: number) => {
    const photo = (form.galleryPhotos || [])[i];
    if (!photo) return;
    if (!confirm('Remove this gallery photo? This cannot be undone.')) return;
    if (photo.storagePath) await deleteFile(photo.storagePath);
    setForm((p) => ({ ...p, galleryPhotos: (p.galleryPhotos || []).filter((_, gi) => gi !== i) }));
  };

  const save = async () => {
    if (!form.title || !form.month || !form.day) return alert('Title, month, and day are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'events', editing), { ...form });
      } else {
        await addDoc(collection(db, 'events'), { ...form, order: form.order || events.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (e: EventDoc) => {
    setEditing(e.id);
    setForm({
      title: e.title, month: e.month, day: e.day, year: e.year, time: e.time, location: e.location, category: e.category,
      desc: e.desc, featured: e.featured, link: e.link || '', order: e.order,
      image: e.image || '', imageStoragePath: e.imageStoragePath || '', organizer: e.organizer || '', galleryPhotos: e.galleryPhotos || [],
    });
  };

  const remove = async (e: EventDoc) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'events', e.id));
      if (e.imageStoragePath) await deleteFile(e.imageStoragePath);
      for (const g of e.galleryPhotos || []) {
        if (g.storagePath) await deleteFile(g.storagePath);
      }
    } catch (err) {
      alert(`Couldn't delete: ${(err as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Event' : 'Add Event'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Only feeds the standalone Events page (/events) — the Home page's "Upcoming at VWU" strip is edited from
          "Happenings & Awards" → Happenings instead. The event stats bar shown at the top of /events is edited
          from Page Content Blocks → "Events — Stats Bar".
        </p>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Cover Photo (optional — shown on the event's card; falls back to a plain date badge without one)</label>
            <ImageUploader folder="vwu/events" currentUrl={form.image} onUploaded={handleImageUploaded} label="Upload Cover Photo" aspect={16 / 9} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Technova2026 National Technical Symposium" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-month">Month *</label>
            <input id="field-month" value={form.month} onChange={(e) => set('month', e.target.value.toUpperCase())} placeholder="MAY" maxLength={3} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-day">Day *</label>
            <input id="field-day" value={form.day} onChange={(e) => set('day', e.target.value)} placeholder="20" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-year">Year</label>
            <input id="field-year" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2026" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-time">Time</label>
            <input id="field-time" value={form.time} onChange={(e) => set('time', e.target.value)} placeholder="9:00 AM IST" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-location">Venue / Location</label>
            <input id="field-location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="VWU Main Auditorium, Bhimavaram" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-organizer">Organizer (optional)</label>
            <input id="field-organizer" value={form.organizer} onChange={(e) => set('organizer', e.target.value)} placeholder="Department of CSE / Student Council" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-category">Category — type any name; existing ones are suggested</label>
            <input id="field-category" list="event-category-options" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Cultural Events" />
            <datalist id="event-category-options">
              {categoryOptions.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>Featured</label>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span>Shown in the featured events grid on the Events page</span>
            </label>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={3} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Event description…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-registration-details-link-optional-leave">Registration / Details Link (optional — leave blank to hide the button on the public page)</label>
            <input id="field-registration-details-link-optional-leave" value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://forms.gle/… or https://svecw.edu.in/…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Event Gallery (optional — extra photos shown on this event's detail view, each with its own caption)</label>
            {(form.galleryPhotos || []).map((g, i) => (
              <div key={g.storagePath || i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem', border: '1px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem' }}>
                <img src={g.url} alt="" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                <input
                  value={g.caption}
                  onChange={(e) => setGalleryCaption(i, e.target.value)}
                  placeholder="Caption (optional)"
                  style={{ flex: 1 }}
                />
                <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeGalleryPhoto(i)}>Remove</button>
              </div>
            ))}
            <ImageUploader folder="vwu/events/gallery" onUploaded={addGalleryPhoto} label="Add Gallery Photo" aspect={4 / 3} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Event'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Events ({events.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td>{e.month} {e.day}, {e.year}</td>
                    <td>{e.title}</td>
                    <td><span className="admin-badge">{e.category}</span></td>
                    <td>{e.featured ? '✅' : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(e)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(e)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && <tr><td colSpan={5} className="admin-empty">No events yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
