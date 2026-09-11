import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';

// Exported so the Home page's Alumni Events section (which reads this same
// `alumniEvents` collection — see AlumniEventsShowcase.tsx) shares one
// definition instead of a second, drifting copy of the shape.
export interface AlumniEvent {
  id: string;
  title: string;
  date: string;
  desc: string;
  order: number;
  photoUrl?: string;
  photoStoragePath?: string;
  // Alumni Connect section fields
  row?: 1 | 2;           // Which row (1 = photo left, 2 = photo right)
  displayType?: 'photo' | 'text'; // Photo card or text content
}

const EMPTY: Omit<AlumniEvent, 'id'> = { title: '', date: '', desc: '', order: 0, photoUrl: '', photoStoragePath: '', row: 1, displayType: 'photo' };

const DEFAULTS: Omit<AlumniEvent, 'id'>[] = [
  { title: 'Annual Alumni Meet', date: 'January 2027', desc: 'The annual reunion that brings graduates back to the VWU campus for networking, catching up with batchmates, and celebrating shared milestones.', order: 0 },
  { title: 'Alumni Career Talk Series', date: 'Ongoing 2026', desc: 'Share your career story with current students and offer the kind of perspective that only real-world experience provides.', order: 1 },
  { title: 'Regional Alumni Meetups', date: 'Ongoing', desc: 'Meet fellow VWU graduates at informal gatherings held in cities across India — including Hyderabad, Bangalore, and Chennai.', order: 2 },
  { title: 'Graduation Day Felicitation', date: 'December 2026', desc: 'Recognise and honour the achievements of outstanding alumni at the annual Graduation Day ceremony.', order: 3 },
];

export default function AlumniEventsAdmin() {
  const { docs: items, loading } = useOrderedCollection<AlumniEvent>('alumniEvents', 'order');
  const [form, setForm] = useState<Omit<AlumniEvent, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handlePhoto = (r: UploadResult) => setForm((p) => ({ ...p, photoUrl: r.url, photoStoragePath: r.path }));

  const save = async () => {
    if (!form.title || !form.date) return alert('Title and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'alumniEvents', editing), { ...form });
      } else {
        await addDoc(collection(db, 'alumniEvents'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (e: AlumniEvent) => {
    setEditing(e.id);
    setForm({ title: e.title, date: e.date, desc: e.desc, order: e.order, photoUrl: e.photoUrl || '', photoStoragePath: e.photoStoragePath || '', row: e.row || 1, displayType: e.displayType || 'photo' });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'alumniEvents', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm('Add the original set of alumni events as a starting point?')) return;
    try {
      for (const d of DEFAULTS) {
        await addDoc(collection(db, 'alumniEvents'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter events: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Event' : 'Add Alumni Event'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Events appear in both the Alumni Events showcase and the Alumni Connect section on the Home page.
          For Alumni Connect photos, set <strong>Display Type</strong> to "Photo" and choose the row position.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Annual Alumni Meet" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-date">Date *</label>
            <input id="field-date" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="January 2027" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-type">Display Type</label>
            <select id="field-display-type" value={form.displayType} onChange={(e) => set('displayType', e.target.value)}>
              <option value="photo">Photo (Alumni Connect scroll)</option>
              <option value="text">Text (used in Events showcase only)</option>
            </select>
          </div>
          {form.displayType === 'photo' && (
            <div className="admin-field">
              <label htmlFor="field-row">Row Position</label>
              <select id="field-row" value={form.row} onChange={(e) => set('row', +e.target.value)}>
                <option value={1}>Row 1 (Photo Left, Text Right)</option>
                <option value={2}>Row 2 (Text Left, Photo Right)</option>
              </select>
              <p className="admin-field__hint">Row 1 photos scroll on the left; Row 2 on the right.</p>
            </div>
          )}
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description">Description</label>
            <textarea id="field-description" rows={3} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Short description shown on the card…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Photo</label>
            <p className="admin-field__hint" style={{ marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
              {form.displayType === 'photo'
                ? 'Shown in the Alumni Connect horizontal scroll on the Home page — landscape/rectangular photos work best.'
                : 'Shown on the Home page\'s "Alumni Events" cards — a landscape/rectangular photo works best.'}
            </p>
            <ImageUploader folder="vwu/alumni-events" currentUrl={form.photoUrl} onUploaded={handlePhoto} label="Upload Event Photo" aspect={3 / 2} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Event'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Events ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Date</th><th>Type</th><th>Row</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id}>
                    <td>{e.title}</td>
                    <td>{e.date}</td>
                    <td><span className="admin-badge">{e.displayType === 'photo' ? 'Photo' : 'Text'}</span></td>
                    <td>{e.displayType === 'photo' ? `Row ${e.row || 1}` : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(e)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No events yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults}>Add starter events</button>
                    </td>
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
