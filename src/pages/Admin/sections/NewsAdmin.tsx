import { useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import CloudinaryUploader from '../../../components/CloudinaryUploader/CloudinaryUploader';
import type { CloudinaryResult } from '../../../lib/cloudinary';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  body: string;
  imageUrl: string;
  publicId: string;
  featured: boolean;
}

const EMPTY: Omit<NewsItem, 'id'> = {
  title: '', category: 'News', date: new Date().toISOString().slice(0, 10),
  summary: '', body: '', imageUrl: '', publicId: '', featured: false,
};

const CATEGORIES = ['News', 'Event', 'Achievement', 'Award', 'Announcement', 'Research'];

export default function NewsAdmin() {
  const { docs: items, loading } = useOrderedCollection<NewsItem>('news', 'date', 'desc');
  const [form, setForm] = useState<Omit<NewsItem, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: CloudinaryResult) => setForm((p) => ({ ...p, imageUrl: r.secure_url, publicId: r.public_id }));

  const save = async () => {
    if (!form.title || !form.date) return alert('Title and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'news', editing), { ...form });
      } else {
        await addDoc(collection(db, 'news'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } finally { setSaving(false); }
  };

  const startEdit = (item: NewsItem) => {
    setEditing(item.id);
    setForm({ title: item.title, category: item.category, date: item.date,
               summary: item.summary, body: item.body, imageUrl: item.imageUrl,
               publicId: item.publicId, featured: item.featured });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await deleteDoc(doc(db, 'news', id));
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Item' : 'Add News / Event'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Image</label>
            <CloudinaryUploader folder="vwu/news" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload News Image" />
          </div>
          <div className="admin-field">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Article title" />
          </div>
          <div className="admin-field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Date *</label>
            <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Featured</label>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span>Show on homepage</span>
            </label>
          </div>
          <div className="admin-field admin-field--full">
            <label>Summary</label>
            <input value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Short description (shown in cards)" />
          </div>
          <div className="admin-field admin-field--full">
            <label>Full Body</label>
            <textarea rows={5} value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Full article content…" />
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
        <h2 className="admin-card__title">All Items ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Date</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.imageUrl ? <img src={item.imageUrl} alt="" className="admin-table__thumb" /> : '—'}</td>
                    <td>{item.title}</td>
                    <td><span className="admin-badge">{item.category}</span></td>
                    <td>{item.date}</td>
                    <td>{item.featured ? '✅' : '—'}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(item)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={6} className="admin-empty">No items yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
