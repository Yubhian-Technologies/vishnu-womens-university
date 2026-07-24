import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import { deleteFile } from '../../../lib/storage';

export interface PlacementItemDoc {
  id: string;
  slug: string;
  title: string;
  icon: string;
  desc: string;
  external: boolean;
  url: string;
  intro: string;
  about: string;
  highlights: string[];
  outcomes: string[];
  partners: string[];
  tableText: string;
  heroImage: string;
  heroStoragePath: string;
  order: number;
}

const EMPTY: Omit<PlacementItemDoc, 'id'> = {
  slug: '', title: '', icon: 'BarChart3', desc: '', external: false, url: '',
  intro: '', about: '', highlights: [], outcomes: [], partners: [], tableText: '',
  heroImage: '', heroStoragePath: '', order: 0,
};

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

export default function PlacementItemsAdmin() {
  const { docs: items, loading } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  const [form, setForm] = useState<Omit<PlacementItemDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number | string[] | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'placementItems', editing), { ...form });
      } else {
        await addDoc(collection(db, 'placementItems'), { ...form, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: PlacementItemDoc) => {
    setEditing(it.id);
    setForm({
      slug: it.slug, title: it.title, icon: it.icon || 'BarChart3', desc: it.desc || '',
      external: !!it.external, url: it.url || '', intro: it.intro || '', about: it.about || '',
      highlights: it.highlights || [], outcomes: it.outcomes || [], partners: it.partners || [],
      tableText: it.tableText || '', heroImage: it.heroImage || '', heroStoragePath: it.heroStoragePath || '', order: it.order,
    });
  };

  const remove = async (id: string, heroStoragePath?: string) => {
    if (!confirm('Delete this placement page?')) return;
    try {
      if (heroStoragePath) await deleteFile(heroStoragePath);
      await deleteDoc(doc(db, 'placementItems', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Placement Page' : 'Add Placement Page'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the /placements sub-pages (Placement Details, TPO Cell, TPO Team, Industry Liaison Offices, etc.).
          For the Data table, put each row on its own line as <code>Column 1 | Column 2 | Column 3</code>.
          Not the same as the "Placements" section, which manages the recruiter logo list.
        </p>
        <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
          This page's hero image is now edited from <strong>Hero Banners → Placements</strong>, not here.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>URL Slug * (e.g. tpo-cell)</label>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="tpo-cell" />
          </div>
          <div className="admin-field">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="TPO Cell" />
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
          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.external} onChange={(e) => set('external', e.target.checked)} style={{ marginRight: 6 }} />
              Links to an external site (not a VWU detail page)
            </label>
          </div>
          <div className="admin-field">
            <label>External URL (only if the box above is checked)</label>
            <input value={form.url} onChange={(e) => set('url', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Short Description (shown on the listing card)</label>
            <textarea rows={2} value={form.desc} onChange={(e) => set('desc', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Intro (detail page)</label>
            <textarea rows={3} value={form.intro} onChange={(e) => set('intro', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>About (detail page — longer paragraph)</label>
            <textarea rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Key Highlights (one per line)</label>
            <textarea rows={4} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Outcomes & Achievements (one per line — optional)</label>
            <textarea rows={3} value={arrayToLines(form.outcomes)} onChange={(e) => set('outcomes', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Recruiting Partners (one per line — optional)</label>
            <textarea rows={3} value={arrayToLines(form.partners)} onChange={(e) => set('partners', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Data Table (optional — see format above)</label>
            <textarea rows={6} value={form.tableText} onChange={(e) => set('tableText', e.target.value)} placeholder={'2021–2025 | 1156 | 46 LPA | Amazon\n2020–2024 | 818 | 41.54 LPA | Intuit'} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Page'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Pages ({items.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Title</th><th>Slug</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.order}</td>
                    <td>{it.title}</td>
                    <td>{it.slug}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id, it.heroStoragePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={4} className="admin-empty">No placement pages yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
