import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

// Shared across the public VWU Insights pages (landing + the four section
// routes). One document per article.
export const INSIGHT_CATEGORIES = [
  { slug: 'university-news', label: 'University News' },
  { slug: 'research-innovation', label: 'Research & Innovation' },
  { slug: 'campus-life', label: 'Campus Life' },
  { slug: 'student-life', label: 'Student Life' },
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number]['slug'];

export interface InsightDoc {
  id: string;
  title: string;
  dek: string;
  category: InsightCategory;
  date: string;
  readMinutes: number;
  author: string;
  imageUrl: string;
  storagePath: string;
  // Reserved for the future article-detail page — safe to leave blank.
  slug: string;
  body: string;
}

const EMPTY: Omit<InsightDoc, 'id'> = {
  title: '', dek: '', category: 'university-news',
  date: new Date().toISOString().slice(0, 10),
  readMinutes: 5, author: '', imageUrl: '', storagePath: '', slug: '', body: '',
};

export default function InsightsAdmin() {
  const { docs: items, loading } = useOrderedCollection<InsightDoc>('insights', 'date', 'desc');
  const [form, setForm] = useState<Omit<InsightDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title || !form.date) return alert('Title and date are required.');
    setSaving(true);
    try {
      if (editing) {
        const prev = items.find((i) => i.id === editing);
        if (prev?.storagePath && prev.storagePath !== form.storagePath) {
          await deleteFile(prev.storagePath).catch(() => {});
        }
        await updateDoc(doc(db, 'insights', editing), { ...form });
      } else {
        await addDoc(collection(db, 'insights'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (item: InsightDoc) => {
    setEditing(item.id);
    setForm({
      title: item.title, dek: item.dek ?? '', category: item.category,
      date: item.date, readMinutes: item.readMinutes ?? 5, author: item.author ?? '',
      imageUrl: item.imageUrl ?? '', storagePath: item.storagePath ?? '',
      slug: item.slug ?? '', body: item.body ?? '',
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      const item = items.find((i) => i.id === id);
      await deleteDoc(doc(db, 'insights', id));
      if (item?.storagePath) await deleteFile(item.storagePath).catch(() => {});
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const labelFor = (slug: string) => INSIGHT_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Article' : 'Add VWU Insights Article'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Feeds the VWU Insights landing page and its four section pages (University News, Research &amp; Innovation,
          Campus Life, Student Life). Newest date shows first.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Cover Image</label>
            <ImageUploader folder="vwu/insights" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Cover Image" />
          </div>
          <div className="admin-field">
            <label htmlFor="ins-title">Title *</label>
            <input id="ins-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Article headline" />
          </div>
          <div className="admin-field">
            <label htmlFor="ins-category">Section</label>
            <select id="ins-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {INSIGHT_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="ins-date">Date *</label>
            <input id="ins-date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="ins-read">Read time (minutes)</label>
            <input id="ins-read" type="number" min={1} value={form.readMinutes}
              onChange={(e) => set('readMinutes', Number(e.target.value) || 1)} />
          </div>
          <div className="admin-field">
            <label htmlFor="ins-author">Author / Byline</label>
            <input id="ins-author" value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="e.g. VWU Editorial Team" />
          </div>
          <div className="admin-field">
            <label htmlFor="ins-slug">URL slug <span className="admin-field__hint">(optional, for the article page)</span></label>
            <input id="ins-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="why-hands-on-labs-matter" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="ins-dek">Summary / Dek</label>
            <input id="ins-dek" value={form.dek} onChange={(e) => set('dek', e.target.value)} placeholder="One-sentence summary shown on cards" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="ins-body">Body <span className="admin-field__hint">(optional, for the article page)</span></label>
            <textarea id="ins-body" rows={5} value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Full article content…" />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">All Articles ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Title</th><th>Section</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.imageUrl ? <img src={item.imageUrl} alt="" className="admin-table__thumb" /> : '—'}</td>
                    <td>{item.title}</td>
                    <td><span className="admin-badge">{labelFor(item.category)}</span></td>
                    <td>{item.date}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(item)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={5} className="admin-empty">No articles yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
