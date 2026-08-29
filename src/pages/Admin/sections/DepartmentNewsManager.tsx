import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { NEWS_CATEGORIES } from '../../../lib/news';
import type { DepartmentNewsDoc } from '../../../components/DepartmentNews/DepartmentNewsSection';

const EMPTY_NEWS: Omit<DepartmentNewsDoc, 'id' | 'program'> = {
  title: '', category: 'News', date: new Date().toISOString().slice(0, 10),
  summary: '', body: '', imageUrl: '', storagePath: '',
};

interface Props {
  /** Every item this editor creates/edits is tagged with this program's slug — no picker needed. */
  programSlug: string;
}

/**
 * News & Events editor embedded directly in a program's own edit form (see
 * ProgramsAdmin) — the same place Mind Map / Vision & Mission / PEOs are
 * edited — instead of a separate top-level admin section. Items are
 * `departmentNews` docs tagged with this program's slug, read on the public
 * side by <DepartmentNewsSection>.
 */
export default function DepartmentNewsManager({ programSlug }: Props) {
  const { docs: allItems, loading } = useOrderedCollection<DepartmentNewsDoc>('departmentNews', 'date', 'desc');
  const items = allItems.filter((n) => n.program === programSlug);
  const [form, setForm] = useState(EMPTY_NEWS);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const handleImage = (r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));

  const save = async () => {
    if (!form.title || !form.date) return alert('Title and date are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'departmentNews', editing), { ...form, program: programSlug });
      } else {
        await addDoc(collection(db, 'departmentNews'), { ...form, program: programSlug, createdAt: serverTimestamp() });
      }
      setForm(EMPTY_NEWS); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (item: DepartmentNewsDoc) => {
    setEditing(item.id);
    setForm({
      title: item.title, category: item.category, date: item.date,
      summary: item.summary, body: item.body, imageUrl: item.imageUrl, storagePath: item.storagePath,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteDoc(doc(db, 'departmentNews', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '0.75rem' }}>
      <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
        Shown in the "News &amp; Events" section of this program's public page
        (for AI, CSE and ECE, that's under this program's side of the toggle).
      </p>
      <div className="admin-form-grid">
        <div className="admin-field admin-field--full">
          <label>Image</label>
          <ImageUploader folder="vwu/department-news" currentUrl={form.imageUrl} onUploaded={handleImage} label="Upload Image" />
        </div>
        <div className="admin-field">
          <label htmlFor="field-news-title">Title *</label>
          <input id="field-news-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Item title" />
        </div>
        <div className="admin-field">
          <label htmlFor="field-news-category">Category</label>
          <select id="field-news-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
            {NEWS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor="field-news-date">Date *</label>
          <input id="field-news-date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </div>
        <div className="admin-field admin-field--full">
          <label htmlFor="field-news-summary">Summary</label>
          <input id="field-news-summary" value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Short description (shown in cards)" />
        </div>
        <div className="admin-field admin-field--full">
          <label htmlFor="field-news-body">Full Body</label>
          <textarea id="field-news-body" rows={4} value={form.body} onChange={(e) => set('body', e.target.value)} placeholder="Full content (optional — shown when the reader expands the card)…" />
        </div>
      </div>
      <div className="admin-form-actions">
        {editing && <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY_NEWS); }}>Cancel</button>}
        <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Update' : 'Publish'}
        </button>
      </div>

      {loading ? <p className="admin-loading">Loading…</p> : (
        <div className="admin-table-wrap" style={{ marginTop: '0.75rem' }}>
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.imageUrl ? <img src={item.imageUrl} alt="" className="admin-table__thumb" /> : '—'}</td>
                  <td>{item.title}</td>
                  <td><span className="admin-badge">{item.category}</span></td>
                  <td>{item.date}</td>
                  <td>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => startEdit(item)}>Edit</button>
                    <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} className="admin-empty">No News &amp; Events yet for this program.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
