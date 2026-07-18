import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';

export interface DifferentiatorItemDoc {
  id: string;
  slug: string;
  title: string;
  category: string;
  desc: string;
  external: boolean;
  url: string;
  highlights: string[];
  intro: string;
  about: string;
  facilities: string[];
  outcomes: string[];
  partners: string[];
  order: number;
}

const EMPTY: Omit<DifferentiatorItemDoc, 'id'> = {
  slug: '', title: '', category: 'innovation', desc: '', external: false, url: '',
  highlights: [], intro: '', about: '', facilities: [], outcomes: [], partners: [], order: 0,
};

export const DIFFERENTIATOR_CATEGORIES = [
  { id: 'innovation', label: 'Innovation & Entrepreneurship' },
  { id: 'industry', label: 'Industry Centres of Excellence' },
  { id: 'research', label: 'Research & Specialised Labs' },
  { id: 'global', label: 'International & Global Outreach' },
  { id: 'student', label: 'Student Development & Social Impact' },
];

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

export default function DifferentiatorsAdmin() {
  const { docs: items, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const [form, setForm] = useState<Omit<DifferentiatorItemDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const set = (k: string, v: string | number | string[] | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'differentiatorItems', editing), { ...form });
      } else {
        await addDoc(collection(db, 'differentiatorItems'), { ...form, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: DifferentiatorItemDoc) => {
    setEditing(it.id);
    setForm({
      slug: it.slug, title: it.title, category: it.category, desc: it.desc || '',
      external: !!it.external, url: it.url || '', highlights: it.highlights || [],
      intro: it.intro || '', about: it.about || '', facilities: it.facilities || [],
      outcomes: it.outcomes || [], partners: it.partners || [], order: it.order,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this differentiator item?')) return;
    try {
      await deleteDoc(doc(db, 'differentiatorItems', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const filtered = filterCat === 'All' ? items : items.filter((i) => i.category === filterCat);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Differentiator' : 'Add Differentiator'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>URL Slug * (e.g. vishnu-tbi)</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="vishnu-tbi" />
          </div>
          <div className="admin-field">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Vishnu Technology Business Incubator (TBI)" />
          </div>
          <div className="admin-field">
            <label>Category *</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {DIFFERENTIATOR_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.external} onChange={(e) => set('external', e.target.checked)} style={{ marginRight: 6 }} />
              Links to an external site (not a VWU detail page)
            </label>
          </div>
          <div className="admin-field">
            <label>External URL (only if the box above is checked)</label>
            <input value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://www.vishva.co/" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Short Description (shown on the listing card)</label>
            <textarea rows={2} value={form.desc} onChange={(e) => set('desc', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Key Highlights (one per line)</label>
            <textarea rows={4} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Intro (detail page — only used when not an external link)</label>
            <textarea rows={3} value={form.intro} onChange={(e) => set('intro', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>About (detail page — longer paragraph)</label>
            <textarea rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Facilities & Equipment (one per line — optional)</label>
            <textarea rows={3} value={arrayToLines(form.facilities)} onChange={(e) => set('facilities', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Outcomes & Achievements (one per line — optional)</label>
            <textarea rows={3} value={arrayToLines(form.outcomes)} onChange={(e) => set('outcomes', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Partners (one per line — optional)</label>
            <textarea rows={2} value={arrayToLines(form.partners)} onChange={(e) => set('partners', linesToArray(e.target.value))} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Item'}</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Items ({filtered.length})</h2>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="admin-select-sm">
            <option value="All">All Categories</option>
            {DIFFERENTIATOR_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Title</th><th>Category</th><th>Slug</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td>
                    <td>{it.title}</td>
                    <td>{DIFFERENTIATOR_CATEGORIES.find((c) => c.id === it.category)?.label ?? it.category}</td>
                    <td>{it.slug}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} className="admin-empty">No differentiator items yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
