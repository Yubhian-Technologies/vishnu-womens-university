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

export interface HappeningsShowcaseDoc {
  id: string;
  title: string;
  caption?: string;
  description?: string;
  imageUrl: string;
  storagePath?: string;
  linkUrl?: string;
  badge?: string;
  order: number;
}

export type StudentAchievementDoc = HappeningsShowcaseDoc;

const EMPTY_HAPPENING: Omit<HappeningDoc, 'id'> = { title: '', date: '', type: 'recent', dept: '', order: 0, imageUrl: '', storagePath: '', description: '' };
const EMPTY_AWARD: Omit<AwardDoc, 'id'> = { name: '', issuedBy: '', year: '', details: '', category: 'ranking', order: 0 };
const EMPTY_SHOWCASE: Omit<HappeningsShowcaseDoc, 'id'> = {
  title: '',
  caption: '',
  description: '',
  imageUrl: '',
  storagePath: '',
  linkUrl: '',
  badge: '',
  order: 0,
};

export default function NewsAwardsDataAdmin() {
  const [tab, setTab] = useState<'happenings' | 'awards' | 'showcase'>('showcase');

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button className={`admin-btn ${tab === 'showcase' ? 'admin-btn--primary' : 'admin-btn--ghost'}`} onClick={() => setTab('showcase')}>
            🏆 Event & Achievement Posters (Hero Showcase)
          </button>
          <button className={`admin-btn ${tab === 'happenings' ? 'admin-btn--primary' : 'admin-btn--ghost'}`} onClick={() => setTab('happenings')}>
            Happenings
          </button>
          <button className={`admin-btn ${tab === 'awards' ? 'admin-btn--primary' : 'admin-btn--ghost'}`} onClick={() => setTab('awards')}>
            Accreditations & Awards
          </button>
        </div>
      </div>
      {tab === 'showcase' ? <HappeningsShowcasePanel /> : tab === 'happenings' ? <HappeningsPanel /> : <AwardsPanel />}
    </div>
  );
}

function HappeningsShowcasePanel() {
  const { docs: items, loading } = useOrderedCollection<HappeningsShowcaseDoc>('happeningsShowcase', 'order');
  const [form, setForm] = useState<Omit<HappeningsShowcaseDoc, 'id'>>(EMPTY_SHOWCASE);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title) {
      return alert('Title / Event Name is required.');
    }
    if (!form.imageUrl) {
      return alert('Please upload the Event / Achievement Poster Image.');
    }
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'happeningsShowcase', editing), { ...form });
      } else {
        await addDoc(collection(db, 'happeningsShowcase'), {
          ...form,
          order: form.order || items.length + 1,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY_SHOWCASE);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (it: HappeningsShowcaseDoc) => {
    setEditing(it.id);
    setForm({
      title: it.title,
      caption: it.caption || '',
      description: it.description || '',
      imageUrl: it.imageUrl || '',
      storagePath: it.storagePath || '',
      linkUrl: it.linkUrl || '',
      badge: it.badge || '',
      order: it.order || 0,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this showcase poster item?')) return;
    try {
      await deleteDoc(doc(db, 'happeningsShowcase', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <>
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Event / Achievement Poster' : 'Add Event / Achievement Poster'}</h2>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
          Manage dynamic event & achievement posters displayed in the Happenings page top Hero carousel showcase.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="sh-title">Title / Headline *</label>
            <input
              id="sh-title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Amazon 2026 Selects, Smart India Hackathon Winners"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="sh-caption">Subtitle / Caption (displayed below poster)</label>
            <input
              id="sh-caption"
              value={form.caption}
              onChange={(e) => set('caption', e.target.value)}
              placeholder="e.g. Amazon 2026 Selects — 16 Students Placed with ₹46.38 Lakhs per annum"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="sh-badge">Badge / Category Tag (optional)</label>
            <input
              id="sh-badge"
              value={form.badge}
              onChange={(e) => set('badge', e.target.value)}
              placeholder="e.g. Placements, Hackathon Champions, Sports, MoU"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="sh-link">Target Link URL (optional)</label>
            <input
              id="sh-link"
              value={form.linkUrl}
              onChange={(e) => set('linkUrl', e.target.value)}
              placeholder="e.g. /placements or https://..."
            />
          </div>
          <div className="admin-field">
            <label htmlFor="sh-order">Display Order</label>
            <input
              id="sh-order"
              type="number"
              value={form.order}
              onChange={(e) => set('order', +e.target.value)}
              min={0}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label>Poster / Banner Image *</label>
            <ImageUploader
              folder="vwu/happenings-showcase"
              currentUrl={form.imageUrl}
              onUploaded={handleImage}
              label="Upload Event / Achievement Poster"
              aspect={16 / 7.5}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="sh-desc">Description of Particular Achievement / Event</label>
            <textarea
              id="sh-desc"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe this particular achievement or event in detail (e.g. Congratulations to our 16 students on securing Full-Time roles at Amazon...)."
            />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && (
            <button
              className="admin-btn admin-btn--ghost"
              onClick={() => {
                setEditing(null);
                setForm(EMPTY_SHOWCASE);
              }}
            >
              Cancel
            </button>
          )}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update Poster' : 'Add Poster'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Showcase Posters ({items.length})</h2>
        {loading ? (
          <p className="admin-loading">Loading…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Poster</th>
                  <th>Title & Caption</th>
                  <th>Description</th>
                  <th>Badge & Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td>
                    <td>
                      {it.imageUrl ? (
                        <img
                          src={it.imageUrl}
                          alt={it.title}
                          style={{ width: 80, height: 44, borderRadius: 6, objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No image</span>
                      )}
                    </td>
                    <td>
                      <strong>{it.title}</strong>
                      {it.caption && (
                        <div style={{ fontSize: '0.78rem', color: '#6b7280', fontStyle: 'italic' }}>{it.caption}</div>
                      )}
                    </td>
                    <td style={{ maxWidth: 280 }}>
                      <div style={{ fontSize: '0.8rem', color: '#4b5563', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {it.description || <span style={{ color: '#9ca3af' }}>No description</span>}
                      </div>
                    </td>
                    <td>
                      {it.badge && (
                        <span style={{ display: 'inline-block', fontSize: '0.75rem', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, marginBottom: 2 }}>
                          {it.badge}
                        </span>
                      )}
                      {it.linkUrl && (
                        <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>{it.linkUrl}</div>
                      )}
                    </td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn--sm admin-btn--danger"
                        onClick={() => remove(it.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      No custom showcase posters added yet (curated default posters with descriptions are displayed on the site).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
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
    setForm({ title: it.title, date: it.date, type: it.type, dept: it.dept || '', order: it.order, imageUrl: it.imageUrl || '', storagePath: it.storagePath || '', description: it.description || '' });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this happening?')) return;
    try { await deleteDoc(doc(db, 'happenings', id)); } catch (e) { alert(`Couldn't delete: ${(e as Error).message}`); }
  };

  return (
    <>
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Happening' : 'Add Happening'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Workshop on AI & Robotics" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-date">Date / Date Range *</label>
            <input id="field-date" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="March 15, 2026 or March 15–17, 2026" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-type">Type *</label>
            <select id="field-type" value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="recent">Recent Event</option>
              <option value="upcoming">Upcoming Event</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-department-optional">Department (optional)</label>
            <input id="field-department-optional" value={form.dept} onChange={(e) => set('dept', e.target.value)} placeholder="Computer Science & Engineering" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Cover Photo (optional)</label>
            <ImageUploader
              folder="vwu/happenings"
              currentUrl={form.imageUrl}
              onUploaded={handleImage}
              label="Upload Cover Photo"
              aspect={16 / 9}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-description-optional">Description / Excerpt (optional)</label>
            <textarea id="field-description-optional" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY_HAPPENING); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add'}</button>
        </div>
      </div>
      <div className="admin-card">
        <h2 className="admin-card__title">All Happenings ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Photo</th><th>Title</th><th>Date</th><th>Type</th><th>Dept</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td>
                    <td>{it.imageUrl ? <img src={it.imageUrl} alt={it.title} style={{ width: 44, height: 28, objectFit: 'cover' }} /> : <span style={{ color: '#9ca3af' }}>None</span>}</td>
                    <td>{it.title}</td><td>{it.date}</td><td><span className={`admin-badge admin-badge--${it.type}`}>{it.type}</span></td><td>{it.dept || '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={7} className="admin-empty">No happenings yet.</td></tr>}
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
