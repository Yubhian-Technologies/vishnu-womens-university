import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface ResearchItemDoc {
  id: string;
  slug: string;
  title: string;
  category: 'governance' | 'output' | 'engagement';
  icon: string;
  desc: string;
  intro: string;
  about: string;
  highlights: string[];
  tableText: string;
  accordionText: string;
  heroImage: string;
  heroStoragePath: string;
  order: number;
}

const EMPTY: Omit<ResearchItemDoc, 'id'> = {
  slug: '', title: '', category: 'governance', icon: 'Microscope', desc: '', intro: '', about: '',
  highlights: [], tableText: '', accordionText: '', heroImage: '', heroStoragePath: '', order: 0,
};

const CATEGORIES: { value: ResearchItemDoc['category']; label: string }[] = [
  { value: 'governance', label: 'R&D Governance' },
  { value: 'output', label: 'Research Output' },
  { value: 'engagement', label: 'Industry & Professional Engagement' },
];

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

export default function ResearchItemsAdmin() {
  const { docs: items, loading } = useOrderedCollection<ResearchItemDoc>('researchItems', 'order');
  const [form, setForm] = useState<Omit<ResearchItemDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('All');

  const set = (k: string, v: string | number | string[]) => setForm((p) => ({ ...p, [k]: v }));
  const handleHeroImage = (r: UploadResult) => setForm((p) => ({ ...p, heroImage: r.url, heroStoragePath: r.path }));

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'researchItems', editing), { ...form });
      } else {
        await addDoc(collection(db, 'researchItems'), { ...form, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: ResearchItemDoc) => {
    setEditing(it.id);
    setForm({
      slug: it.slug, title: it.title, category: it.category, icon: it.icon || 'Microscope',
      desc: it.desc || '', intro: it.intro || '', about: it.about || '',
      highlights: it.highlights || [], tableText: it.tableText || '', accordionText: it.accordionText || '',
      heroImage: it.heroImage || '', heroStoragePath: it.heroStoragePath || '', order: it.order,
    });
  };

  const remove = async (id: string, heroStoragePath?: string) => {
    if (!confirm('Delete this research item?')) return;
    try {
      if (heroStoragePath) await deleteFile(heroStoragePath);
      await deleteDoc(doc(db, 'researchItems', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const filtered = filterCat === 'All' ? items : items.filter((i) => i.category === filterCat);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Research Item' : 'Add Research Item'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the Research menu's R&D Governance / Research Output / Industry &amp; Professional Engagement
          sub-pages. The Data Table below is edited as plain text: the first line is the column headers, every
          line after it is one row of data, with cells separated by <code>|</code> — e.g. <code>Name | Role</code>{' '}
          then <code>Dr. G. Srinivasa Rao | Chairman</code>. For pages with multiple named tables (like Patents,
          grouped by year), start each one with a line like <code>## 2024</code>.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>URL Slug * (used in the page link, e.g. research-advisory-committee)</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="research-advisory-committee" />
          </div>
          <div className="admin-field">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Research Advisory Committee" />
          </div>
          <div className="admin-field">
            <label>Category *</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Icon</label>
            <select value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {CONTENT_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Detail Page Hero Image (optional — falls back to a shared default when not set)</label>
            <ImageUploader folder="vwu/research-items" currentUrl={form.heroImage} onUploaded={handleHeroImage} label="Upload Hero Image" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Short Description (shown on the Research listing card)</label>
            <textarea rows={2} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="One or two sentences…" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Intro (first paragraph on the detail page)</label>
            <textarea rows={3} value={form.intro} onChange={(e) => set('intro', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>About (longer detail paragraph — optional)</label>
            <textarea rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Key Highlights (one per line — optional)</label>
            <textarea rows={4} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Data Table (optional — see format above)</label>
            <textarea rows={8} value={form.tableText} onChange={(e) => set('tableText', e.target.value)} placeholder={'Name | Role\nDr. G. Srinivasa Rao | Chairman\nProf. P. Venkata Rama Raju | Member'} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Expandable Areas (optional — for pages like Thrust Areas of Research that group into
              categories of collapsible areas instead of a table). Start each category with{' '}
              <code>## Category</code>, each expandable area within it with <code>### Area Name</code>, then list
              one item per line underneath (e.g. faculty names) — they'll render as a click-to-expand accordion.</label>
            <textarea
              rows={10}
              value={form.accordionText}
              onChange={(e) => set('accordionText', e.target.value)}
              placeholder={'## Computing & AI\n### Machine Learning\nK. Padma Vasavi\nA. Sri Krishna\n### Deep Learning\nK. Padma Vasavi'}
            />
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
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
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
                    <td>{CATEGORIES.find((c) => c.value === it.category)?.label ?? it.category}</td>
                    <td>{it.slug}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id, it.heroStoragePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} className="admin-empty">No research items yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
