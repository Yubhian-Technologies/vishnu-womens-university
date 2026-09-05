import { useState, type ComponentType } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import FileUploader from '../../../components/FileUploader/FileUploader';
import ConsultancyReportsAdmin from './ConsultancyReportsAdmin';
import PatentCertificatesAdmin from './PatentCertificatesAdmin';
import ProfessionalBodiesAdmin from './ProfessionalBodiesAdmin';
import MousPartnerLogosAdmin from './MousPartnerLogosAdmin';
import { parseFundedProjectsWorkbook } from '../../../lib/fundedProjectsImport';
import { parsePatentsWorkbook } from '../../../lib/patentsImport';
import { mergeProjectAccordion } from '../../../lib/structuredTable';

// Some research items have extra editable content beyond the base fields
// below (a year-by-year PDF list, patent certificate PDFs, ...) — keyed by
// the item's slug, shown inline while editing that specific item (see the
// "Extra Content" card below) instead of as separate top-level sidebar
// sections, mirroring DifferentiatorsAdmin's ITEM_SUB_SECTIONS.
const ITEM_SUB_SECTIONS: Record<string, { key: string; label: string; Component: ComponentType }[]> = {
  'consultancy': [{ key: 'reports', label: 'Consultancy Reports', Component: ConsultancyReportsAdmin }],
  'patents': [{ key: 'certificates', label: 'Patent Certificates', Component: PatentCertificatesAdmin }],
  'professional-bodies': [{ key: 'bodies', label: 'Professional Bodies', Component: ProfessionalBodiesAdmin }],
  'mous': [{ key: 'logos', label: 'Partner Logos', Component: MousPartnerLogosAdmin }],
};

export interface PublicationYearEntry {
  year: string;
  fileUrl: string;
  storagePath: string;
}

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
  publicationYears: PublicationYearEntry[];
  order: number;
}

const EMPTY: Omit<ResearchItemDoc, 'id'> = {
  slug: '', title: '', category: 'governance', icon: 'Microscope', desc: '', intro: '', about: '',
  highlights: [], tableText: '', accordionText: '', projectsText: '', heroImage: '', heroStoragePath: '',
  policyPdfUrl: '', policyPdfStoragePath: '', publicationYears: [], order: 0,
};

const CATEGORIES: { value: ResearchItemDoc['category']; label: string }[] = [
  { value: 'governance', label: 'R&D Governance' },
  { value: 'output', label: 'Research Output' },
  { value: 'engagement', label: 'Industry & Professional Engagement' },
];

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim());
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
  const [activeSubKey, setActiveSubKey] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const set = (k: string, v: string | number | string[]) => setForm((p) => ({ ...p, [k]: v }));
  const handlePolicyPdf = (r: UploadResult) => setForm((p) => ({ ...p, policyPdfUrl: r.url, policyPdfStoragePath: r.path }));

  const handleImportFile = async (file: File) => {
    setImporting(true);
    try {
      const { text, sheetsUsed, projectCount } = await parseFundedProjectsWorkbook(file);
      if (projectCount === 0) {
        alert("Couldn't find any projects in that file — check it has a \"Name of the Project\" column and at least one filled-in row.");
        return;
      }
      set('projectsText', mergeProjectAccordion(form.projectsText, text));
      alert(`Added ${projectCount} project(s) across ${sheetsUsed.length} sheet(s) (${sheetsUsed.join(', ')}) to the text below.`);
    } catch (e) {
      alert(`Couldn't read that file: ${(e as Error).message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleImportPatentsFile = async (file: File) => {
    setImporting(true);
    try {
      const { text, sheetsUsed, patentCount } = await parsePatentsWorkbook(file);
      if (patentCount === 0) {
        alert("Couldn't find any patents in that file — check it has a \"Title of Invention\" column and at least one filled-in row.");
        return;
      }
      set('projectsText', mergeProjectAccordion(form.projectsText, text));
      alert(`Added ${patentCount} patent(s) across ${sheetsUsed.length} sheet(s) (${sheetsUsed.join(', ')}) to the text below.`);
    } catch (e) {
      alert(`Couldn't read that file: ${(e as Error).message}`);
    } finally {
      setImporting(false);
    }
  };

  const addPublicationYear = () => setForm((p) => ({ ...p, publicationYears: [...p.publicationYears, { year: '', fileUrl: '', storagePath: '' }] }));
  const updatePublicationYear = (index: number, patch: Partial<PublicationYearEntry>) =>
    setForm((p) => ({ ...p, publicationYears: p.publicationYears.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)) }));
  const removePublicationYear = async (index: number) => {
    const entry = form.publicationYears[index];
    if (entry.storagePath) await deleteFile(entry.storagePath);
    setForm((p) => ({ ...p, publicationYears: p.publicationYears.filter((_, i) => i !== index) }));
  };

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      const payload = { ...form, highlights: form.highlights.filter(Boolean) };
      if (editing) {
        await updateDoc(doc(db, 'researchItems', editing), { ...payload });
      } else {
        await addDoc(collection(db, 'researchItems'), { ...payload, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null); setActiveSubKey(null);
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
      policyPdfUrl: it.policyPdfUrl || '', policyPdfStoragePath: it.policyPdfStoragePath || '',
      publicationYears: it.publicationYears || [], order: it.order,
    });
    setActiveSubKey(ITEM_SUB_SECTIONS[it.slug]?.[0]?.key ?? null);
  };

  const remove = async (id: string, heroStoragePath?: string, policyPdfStoragePath?: string, publicationYears?: PublicationYearEntry[]) => {
    if (!confirm('Delete this research item?')) return;
    try {
      if (heroStoragePath) await deleteFile(heroStoragePath);
      if (policyPdfStoragePath) await deleteFile(policyPdfStoragePath);
      for (const entry of publicationYears || []) {
        if (entry.storagePath) await deleteFile(entry.storagePath);
      }
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
          {form.slug === 'mous' && (
            <p className="admin-field__hint admin-field--full" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem' }}>
              MoUs' content fields (Category, Description, Data Table, etc.) are hidden here — its partner list is
              now managed entirely from <strong>Extra Content → Partners</strong> below, which also supports a
              logo per partner. The fields below are frozen, not deleted; ask if you ever need one back.
            </p>
          )}
          {form.slug !== 'mous' && (
          <>
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
            <label>Publications by Year (optional — powers the Research Publications page's year-by-year
              PDF list). Add a year, then upload that year's PDF — no code changes needed to add a new year.</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {form.publicationYears.map((entry, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', border: '1px solid var(--color-light-gray, #ddd)', borderRadius: 6, padding: '0.75rem' }}>
                  <input
                    value={entry.year}
                    onChange={(e) => updatePublicationYear(i, { year: e.target.value })}
                    placeholder="2026"
                    style={{ maxWidth: 100 }}
                  />
                  <div style={{ flex: 1 }}>
                    <FileUploader
                      folder="vwu/research-publications"
                      currentUrl={entry.fileUrl}
                      onUploaded={(r) => updatePublicationYear(i, { fileUrl: r.url, storagePath: r.path })}
                      label="Upload PDF"
                    />
                  </div>
                  <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removePublicationYear(i)}>Remove</button>
                </div>
              ))}
              <button type="button" className="admin-btn admin-btn--sm" onClick={addPublicationYear}>+ Add Year</button>
            </div>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-key-highlights-one-per-line">Key Highlights (one per line — optional)</label>
            <textarea id="field-key-highlights-one-per-line" rows={4} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-data-table-optional-see-format">Data Table (optional — see format above)</label>
            <textarea id="field-data-table-optional-see-format" rows={8} value={form.tableText} onChange={(e) => set('tableText', e.target.value)} placeholder={'Name | Role\nDr. G. Srinivasa Rao | Chairman\nProf. P. Venkata Rama Raju | Member'} />
          </div>
          </>
          )}
          {form.slug !== 'consultancy' && form.slug !== 'mous' && (
            <div className="admin-field admin-field--full">
              <label>Expandable Areas (optional — for pages like Thrust Areas of Research that group into
                categories of collapsible areas instead of a table). Start each category with{' '}
                <code>## Category</code>, each expandable area within it with <code>### Area Name</code>, then list
                one item per line underneath (e.g. faculty names) — they'll render as a click-to-expand accordion.
                Add <code>| https://some-url</code> after an item to make it a clickable link (e.g. to a faculty
                member's external IRINS profile) — leave it off for plain text. For an area that's really a group of
                sub-departments (e.g. Basic Science containing Mathematics, Physics, ...), add{' '}
                <code>#### Sub-area Name</code> lines right under its <code>### Area Name</code> line — each starts
                its own nested expandable area of work with faculty listed underneath it, instead of listing faculty
                directly under the <code>### </code> line.</label>
              <textarea
                rows={10}
                value={form.accordionText}
                onChange={(e) => set('accordionText', e.target.value)}
                placeholder={'## Computing & AI\n### Machine Learning\nK. Padma Vasavi | https://svecw.irins.org/profile/149610\nA. Sri Krishna\n### Deep Learning\nK. Padma Vasavi'}
              />
            </div>
          )}
          {form.slug !== 'mous' && (
          <div className="admin-field admin-field--full">
            <label>Project Accordion (optional — for pages like Funded Projects that need a per-project
              expandable card instead of a table). Start each category with <code>## Category</code> (e.g.{' '}
              <code>## Ongoing Projects</code>), each project with <code>### Project Title</code>, then{' '}
              <code>Label: value</code> lines for its fields (PI, Department, Amount, Agency, ...), and{' '}
              <code>- bullet text</code> lines for its Outcome list.</label>
            {form.slug === 'patents' && (
              <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '0.5rem' }}>
                For a patent's certificate PDF, just type <code>Application Number: 202205074</code> here (no{' '}
                <code>| https://...</code> needed) — attach the actual PDF from the{' '}
                <strong>Extra Content</strong> card below using that exact same number.
                <br />
                Have an Excel/CSV sheet of patents (Category, Application, Applicant Name, Dept., Date of Filing,
                Title of Invention, Inventor Name, Status)? Import it below instead of typing all this by hand —
                a workbook with one tab per year (e.g. a tab named "2024") groups that tab's rows under "2024 –
                Granted" / "2024 – Published" headings automatically; a single-sheet file falls back to the file
                name for the year. Importing adds to whatever's already in the text below rather than replacing it,
                so you can import one year's file at a time and keep every year's patents.
                <br />
                <label className="admin-btn admin-btn--sm" style={{ display: 'inline-block', marginTop: '0.5rem', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
                  {importing ? 'Reading file…' : 'Import from Excel/CSV'}
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    hidden
                    disabled={importing}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImportPatentsFile(file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </p>
            )}
            {form.slug === 'funded-projects' && (
              <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '0.5rem' }}>
                Have an Excel/CSV sheet of projects (Sanction File No, Agencie, Name of the Project, Name of the
                Staff, Dept., Status, Start Date, Year of Sanctioned, Total Amount Sanctioned, Outcomes)? Import it
                below instead of typing all this by hand — separate "Ongoing"/"Completed" tabs in one workbook are
                both picked up automatically. Multiple outcomes in one cell: press Alt+Enter between them.
                Importing adds to whatever's already in the text below rather than replacing it.
                <br />
                <label className="admin-btn admin-btn--sm" style={{ display: 'inline-block', marginTop: '0.5rem', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
                  {importing ? 'Reading file…' : 'Import from Excel/CSV'}
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    hidden
                    disabled={importing}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImportFile(file);
                      e.target.value = '';
                    }}
                  />
                </label>
              </p>
            )}
            <textarea
              rows={12}
              value={form.projectsText}
              onChange={(e) => set('projectsText', e.target.value)}
              placeholder={'## Ongoing Projects\n### Memory-Optimized Co-Processing Unit for Enhanced Edge AI\nPI: Dr. K Padma Vasavi\nDepartment: ECE\nAmount: Rs. 64,55,000\nAgency: Ministry of Electronics & IT\nOutcome:\n- Design and develop a specialized co-processing unit\n- Ensure seamless integration with existing systems'}
            />
          </div>
          )}
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); setActiveSubKey(null); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Item'}</button>
        </div>
      </div>

      {editing && ITEM_SUB_SECTIONS[form.slug] && (() => {
        const subs = ITEM_SUB_SECTIONS[form.slug];
        const active = subs.find((s) => s.key === activeSubKey) ?? subs[0];
        const ActiveComponent = active.Component;
        return (
          <div className="admin-card">
            <h2 className="admin-card__title">Extra Content — {form.title}</h2>
            <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
              This item has its own extra editable content, shown here while you're editing it.
            </p>
            {subs.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {subs.map((s) => (
                  <button
                    key={s.key}
                    className={`admin-btn admin-btn--sm${active.key === s.key ? ' admin-btn--primary' : ''}`}
                    onClick={() => setActiveSubKey(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
            <ActiveComponent />
          </div>
        );
      })()}

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
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id, it.heroStoragePath, it.policyPdfStoragePath, it.publicationYears)}>Delete</button>
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
