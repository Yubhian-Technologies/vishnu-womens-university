import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import FileUploader from '../../../components/FileUploader/FileUploader';

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
  projectsText: string;
  heroImage: string;
  heroStoragePath: string;
  policyPdfUrl: string;
  policyPdfStoragePath: string;
  order: number;
}

const EMPTY: Omit<ResearchItemDoc, 'id'> = {
  slug: '', title: '', category: 'governance', icon: 'Microscope', desc: '', intro: '', about: '',
  highlights: [], tableText: '', accordionText: '', projectsText: '', heroImage: '', heroStoragePath: '',
  policyPdfUrl: '', policyPdfStoragePath: '', order: 0,
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
  const handlePolicyPdf = (r: UploadResult) => setForm((p) => ({ ...p, policyPdfUrl: r.url, policyPdfStoragePath: r.path }));

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
      projectsText: it.projectsText || '', heroImage: it.heroImage || '', heroStoragePath: it.heroStoragePath || '',
      policyPdfUrl: it.policyPdfUrl || '', policyPdfStoragePath: it.policyPdfStoragePath || '', order: it.order,
    });
  };

  const remove = async (id: string, heroStoragePath?: string, policyPdfStoragePath?: string) => {
    if (!confirm('Delete this research item?')) return;
    try {
      if (heroStoragePath) await deleteFile(heroStoragePath);
      if (policyPdfStoragePath) await deleteFile(policyPdfStoragePath);
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
        <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
          This item's detail-page hero image is now edited from <strong>Hero Banners → Research</strong>, not here.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-url-slug-used-in-the">URL Slug * (used in the page link, e.g. research-advisory-committee)</label>
            <input id="field-url-slug-used-in-the" value={form.slug} onChange={(e) => set('slug', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="research-advisory-committee" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Research Advisory Committee" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-category">Category *</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-icon">Icon</label>
            <select id="field-icon" value={form.icon} onChange={(e) => set('icon', e.target.value)}>
              {CONTENT_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-short-description-shown-on-the">Short Description (shown on the Research listing card)</label>
            <textarea id="field-short-description-shown-on-the" rows={2} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="One or two sentences…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-intro-first-paragraph-on-the">Intro (first paragraph on the detail page)</label>
            <textarea id="field-intro-first-paragraph-on-the" rows={3} value={form.intro} onChange={(e) => set('intro', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-about-longer-detail-content-optional">About (longer detail content — optional). Plain lines join into a paragraph. Start a
              line with <code>## </code> for a bold sub-heading, or <code>- </code> for a checklist bullet
              (use <code>- Label: rest</code> to bold just the label) — e.g. <code>## Key Objectives</code>{' '}
              then <code>- Advise on Policy: Guidance on formulation and implementation.</code></label>
            <textarea id="field-about-longer-detail-content-optional" rows={6} value={form.about} onChange={(e) => set('about', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Policy PDF (optional — e.g. the "*** R&D Policy ***" download link on About R&D)</label>
            <FileUploader folder="vwu/research-policies" currentUrl={form.policyPdfUrl} onUploaded={handlePolicyPdf} label="Upload PDF" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-key-highlights-one-per-line">Key Highlights (one per line — optional)</label>
            <textarea id="field-key-highlights-one-per-line" rows={4} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-data-table-optional-see-format">Data Table (optional — see format above)</label>
            <textarea id="field-data-table-optional-see-format" rows={8} value={form.tableText} onChange={(e) => set('tableText', e.target.value)} placeholder={'Name | Role\nDr. G. Srinivasa Rao | Chairman\nProf. P. Venkata Rama Raju | Member'} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Expandable Areas (optional — for pages like Thrust Areas of Research that group into
              categories of collapsible areas instead of a table). Start each category with{' '}
              <code>## Category</code>, each expandable area within it with <code>### Area Name</code>, then list
              one item per line underneath (e.g. faculty names) — they'll render as a click-to-expand accordion.
              Add <code>| https://some-url</code> after an item to make it a clickable link (e.g. to a faculty
              member's external IRINS profile) — leave it off for plain text.</label>
            <textarea
              rows={10}
              value={form.accordionText}
              onChange={(e) => set('accordionText', e.target.value)}
              placeholder={'## Computing & AI\n### Machine Learning\nK. Padma Vasavi | https://svecw.irins.org/profile/149610\nA. Sri Krishna\n### Deep Learning\nK. Padma Vasavi'}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label>Project Accordion (optional — for pages like Funded Projects that need a per-project
              expandable card instead of a table). Start each category with <code>## Category</code> (e.g.{' '}
              <code>## Ongoing Projects</code>), each project with <code>### Project Title</code>, then{' '}
              <code>Label: value</code> lines for its fields (PI, Department, Amount, Agency, ...), and{' '}
              <code>- bullet text</code> lines for its Outcome list.</label>
            <textarea
              rows={12}
              value={form.projectsText}
              onChange={(e) => set('projectsText', e.target.value)}
              placeholder={'## Ongoing Projects\n### Memory-Optimized Co-Processing Unit for Enhanced Edge AI\nPI: Dr. K Padma Vasavi\nDepartment: ECE\nAmount: Rs. 64,55,000\nAgency: Ministry of Electronics & IT\nOutcome:\n- Design and develop a specialized co-processing unit\n- Ensure seamless integration with existing systems'}
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
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id, it.heroStoragePath, it.policyPdfStoragePath)}>Delete</button>
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
