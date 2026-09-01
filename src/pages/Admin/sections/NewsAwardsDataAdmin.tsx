import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';

export interface HappeningDoc {
  id: string;
  title: string;
  date: string;
  type: 'recent' | 'upcoming';
  dept: string;
  order: number;
  // Optional — power the Home page card/row this happening feeds (see
  // Home.tsx's "Latest from VWU" / "Upcoming at VWU"). A happening with
  // neither still renders fine there, just with a fallback image / no
  // excerpt.
  imageUrl?: string;
  storagePath?: string;
  description?: string;
}

export interface AwardDoc {
  id: string;
  name: string;
  issuedBy: string;
  year: string;
  details: string;
  category: 'ranking' | 'award' | 'accreditation';
  order: number;
}

const EMPTY_HAPPENING: Omit<HappeningDoc, 'id'> = { title: '', date: '', type: 'recent', dept: '', order: 0, imageUrl: '', storagePath: '', description: '' };
const EMPTY_AWARD: Omit<AwardDoc, 'id'> = { name: '', issuedBy: '', year: '', details: '', category: 'ranking', order: 0 };

export default function NewsAwardsDataAdmin() {
  const [tab, setTab] = useState<'happenings' | 'awards'>('happenings');

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button className={`admin-btn ${tab === 'happenings' ? 'admin-btn--primary' : 'admin-btn--ghost'}`} onClick={() => setTab('happenings')}>Happenings</button>
          <button className={`admin-btn ${tab === 'awards' ? 'admin-btn--primary' : 'admin-btn--ghost'}`} onClick={() => setTab('awards')}>Accreditations & Awards</button>
        </div>
      </div>
      {tab === 'happenings' ? <HappeningsPanel /> : <AwardsPanel />}
    </div>
  );
}

function HappeningsPanel() {
  const { docs: items, loading } = useOrderedCollection<HappeningDoc>('happenings', 'order');
  const [form, setForm] = useState<Omit<HappeningDoc, 'id'>>(EMPTY_HAPPENING);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title || !form.date) return alert('Title and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'happenings', editing), { ...form });
      } else {
        await addDoc(collection(db, 'happenings'), { ...form, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY_HAPPENING); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: HappeningDoc) => {
    setEditing(it.id);
    setForm({
      title: it.title, date: it.date, type: it.type, dept: it.dept || '', order: it.order,
      imageUrl: it.imageUrl || '', storagePath: it.storagePath || '', description: it.description || '',
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this happening?')) return;
    try { await deleteDoc(doc(db, 'happenings', id)); } catch (e) { alert(`Couldn't delete: ${(e as Error).message}`); }
  };

  return (
    <>
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Happening' : 'Add Happening'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>Also shown on the Home page — Recent under "Latest from VWU", Upcoming under "Upcoming at VWU".</p>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Cyber Shield 2.1" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-date-as-displayed-e-g">Date * (as displayed, e.g. January 31, 2026)</label>
            <input id="field-date-as-displayed-e-g" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="January 31, 2026" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-type">Type *</label>
            <select id="field-type" value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="recent">Recent</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-department-optional">Department (optional)</label>
            <input id="field-department-optional" value={form.dept} onChange={(e) => set('dept', e.target.value)} placeholder="CSE Department" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Image (optional)</label>
            <ImageUploader folder="vwu/happenings" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Happening Image" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description-optional">Description (optional)</label>
            <textarea id="field-description-optional" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What happened / what to expect…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY_HAPPENING); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add'}</button>
        </div>
      </div>
      <div className="admin-card">
        <h2 className="admin-card__title">Happenings ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Title</th><th>Date</th><th>Type</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td><td>{it.title}</td><td>{it.date}</td><td>{it.type}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="admin-empty">No happenings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function AwardsPanel() {
  const { docs: items, loading } = useOrderedCollection<AwardDoc>('awards', 'order');
  const [form, setForm] = useState<Omit<AwardDoc, 'id'>>(EMPTY_AWARD);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name || !form.issuedBy) return alert('Name and issuing body are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'awards', editing), { ...form });
      } else {
        await addDoc(collection(db, 'awards'), { ...form, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY_AWARD); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: AwardDoc) => {
    setEditing(it.id);
    setForm({ name: it.name, issuedBy: it.issuedBy, year: it.year || '', details: it.details || '', category: it.category, order: it.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this award?')) return;
    try { await deleteDoc(doc(db, 'awards', id)); } catch (e) { alert(`Couldn't delete: ${(e as Error).message}`); }
  };

  return (
    <>
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Award/Ranking/Accreditation' : 'Add Award/Ranking/Accreditation'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="field-name">Name *</label>
            <input id="field-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="NAAC Accreditation" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-issued-by">Issued By *</label>
            <input id="field-issued-by" value={form.issuedBy} onChange={(e) => set('issuedBy', e.target.value)} placeholder="National Assessment and Accreditation Council" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-year-optional">Year (optional)</label>
            <input id="field-year-optional" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2022" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-category">Category *</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="ranking">Ranking</option>
              <option value="award">Award</option>
              <option value="accreditation">Accreditation</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order-2">Display Order</label>
            <input id="field-display-order-2" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-details-optional">Details (optional)</label>
            <textarea id="field-details-optional" rows={2} value={form.details} onChange={(e) => set('details', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY_AWARD); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add'}</button>
        </div>
      </div>
      <div className="admin-card">
        <h2 className="admin-card__title">Awards & Rankings ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Name</th><th>Category</th><th>Year</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td><td>{it.name}</td><td>{it.category}</td><td>{it.year}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="admin-empty">No awards yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
