import { useState } from 'react';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDoc, deleteDoc, updateDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';

export type BlockKey = 'description' | 'vision' | 'mission' | 'objectives';
export const BLOCK_LABELS: Record<BlockKey, string> = {
  description: 'Description', vision: 'Vision', mission: 'Mission', objectives: 'Objectives',
};
function emptyBlock(key: BlockKey): CustomSection {
  return { id: key, label: BLOCK_LABELS[key], contentType: 'text', textContent: '' };
}

export interface GovernanceItemDoc {
  id: string;
  slug: string;
  title: string;
  category: 'governance' | 'committees' | 'iqac';
  icon: string;
  desc: string;
  intro: string;
  about: string;
  highlights: string[];
  outcomes: string[];
  tableText: string;
  heroImage: string;
  heroStoragePath: string;
  order: number;
  description?: CustomSection;
  vision?: CustomSection;
  mission?: CustomSection;
  objectives?: CustomSection;
  customSections?: CustomSection[];
}

const EMPTY: Omit<GovernanceItemDoc, 'id'> = {
  slug: '', title: '', category: 'governance', icon: 'Landmark', desc: '', intro: '', about: '',
  highlights: [], outcomes: [], tableText: '', heroImage: '', heroStoragePath: '', order: 0,
  description: emptyBlock('description'), vision: emptyBlock('vision'), mission: emptyBlock('mission'), objectives: emptyBlock('objectives'),
  customSections: [],
};

const CATEGORIES: { value: GovernanceItemDoc['category']; label: string }[] = [
  { value: 'governance', label: 'Governance' },
  { value: 'committees', label: 'Committees' },
  { value: 'iqac', label: 'IQAC' },
];

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim());
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

function BlockEditor({ blockKey, label, hint, value, onChange, onPhotoUploaded, onPhotoRemoved }: {
  blockKey: BlockKey;
  label: string;
  hint?: string;
  value: CustomSection;
  onChange: (next: CustomSection) => void;
  onPhotoUploaded: (r: UploadResult) => void;
  onPhotoRemoved: () => void;
}) {
  return (
    <div className="admin-field admin-field--full">
      <label>{label}</label>
      {hint && <p className="admin-field__hint" style={{ marginTop: '-0.25rem' }}>{hint}</p>}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <select
          value={value.contentType === 'list' ? 'list' : 'text'}
          onChange={(e) => onChange({ ...value, contentType: e.target.value as 'text' | 'list' })}
          style={{ maxWidth: 220 }}
        >
          <option value="text">Plain text</option>
          <option value="list">Checklist (bullet points)</option>
        </select>
      </div>
      {value.contentType === 'list' ? (
        <textarea
          rows={4}
          value={value.listText || ''}
          onChange={(e) => onChange({ ...value, listText: e.target.value })}
          placeholder="One point per line…"
        />
      ) : (
        <textarea
          rows={4}
          value={value.textContent || ''}
          onChange={(e) => onChange({ ...value, textContent: e.target.value })}
          placeholder={`${label}…`}
        />
      )}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
        <div style={{ width: 140 }}>
          <ImageUploader
            folder={`vwu/governance/${blockKey}`}
            currentUrl={value.photo?.imageUrl}
            aspect={1}
            label="+ Add Photo"
            onUploaded={onPhotoUploaded}
          />
        </div>
        {value.photo?.imageUrl && (
          <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={onPhotoRemoved}>
            Remove Photo
          </button>
        )}
      </div>
    </div>
  );
}

export default function GovernanceItemsAdmin() {
  const { docs: items, loading } = useOrderedCollection<GovernanceItemDoc>('governanceItems', 'order');
  const [form, setForm] = useState<Omit<GovernanceItemDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('All');

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleCustomSectionFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };

  const handleCustomSectionFileRemoved = async (sectionPath: number[], fileIndex: number) => {
    const file = getAtPath(form.customSections || [], sectionPath)?.files?.[fileIndex];
    if (!file?.fileUrl) return;
    if (!confirm('Remove this file? This cannot be undone.')) return;
    try {
      if (file.storagePath) await deleteFile(file.storagePath);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).filter((_, i) => i !== fileIndex),
      })),
    }));
  };

  const handleCustomSectionPhotoUploaded = (sectionPath: number[], r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        photo: { imageUrl: r.url, storagePath: r.path },
      })),
    }));
  };

  const handleCustomSectionPhotoRemoved = async (sectionPath: number[]) => {
    const photo = getAtPath(form.customSections || [], sectionPath)?.photo;
    if (!photo?.imageUrl) return;
    if (!confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => {
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };

  const handleCustomSectionGalleryPhotoUploaded = (sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph)),
      })),
    }));
  };

  const handleCustomSectionGalleryPhotoRemoved = async (sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath(form.customSections || [], sectionPath)?.galleryPhotos?.[photoIndex];
    if (!photo) return;
    if (photo.imageUrl && !confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
      })),
    }));
  };

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      const payload = { ...form, highlights: form.highlights.filter(Boolean), outcomes: form.outcomes.filter(Boolean) };
      if (editing) {
        await updateDoc(doc(db, 'governanceItems', editing), { ...payload });
      } else {
        await addDoc(collection(db, 'governanceItems'), { ...payload, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: GovernanceItemDoc) => {
    setEditing(it.id);
    setForm({
      slug: it.slug, title: it.title, category: it.category, icon: it.icon || 'Landmark',
      desc: it.desc || '', intro: it.intro || '', about: it.about || '',
      highlights: it.highlights || [], outcomes: it.outcomes || [], tableText: it.tableText || '',
      heroImage: it.heroImage || '', heroStoragePath: it.heroStoragePath || '', order: it.order,
      description: it.description || emptyBlock('description'),
      vision: it.vision || emptyBlock('vision'),
      mission: it.mission || emptyBlock('mission'),
      objectives: it.objectives || emptyBlock('objectives'),
      customSections: it.customSections || [],
    });
  };

  const remove = async (id: string, heroStoragePath?: string) => {
    if (!confirm('Delete this governance item?')) return;
    try {
      if (heroStoragePath) await deleteFile(heroStoragePath);
      await deleteDoc(doc(db, 'governanceItems', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const filtered = filterCat === 'All' ? items : items.filter((i) => i.category === filterCat);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Governance / About Us Item' : 'Add Governance / About Us Item'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the About Us &amp; Statutory menu&apos;s Governance / Committees / IQAC sub-pages.
          Each page can be managed with standard fields as well as custom dynamic section blocks (text, checklist, table, links, files, photo gallery, accordion).
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-url-slug-used-in-the">URL Slug * (used in the page link, e.g. governing-body)</label>
            <input id="field-url-slug-used-in-the" value={form.slug} onChange={(e) => set('slug', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="governing-body" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Governing Body" />
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
            <label htmlFor="field-short-description-shown-on-the">Short Description (shown on the Governance listing card)</label>
            <textarea id="field-short-description-shown-on-the" rows={2} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="One or two sentences…" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-intro-first-paragraph-on-the">Intro (first paragraph on the detail page)</label>
            <textarea id="field-intro-first-paragraph-on-the" rows={3} value={form.intro} onChange={(e) => set('intro', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-about-longer-detail-content">About (longer detail content). Plain lines join into a paragraph. Start a line with{' '}
              <code>## </code> for a bold sub-heading, or <code>- </code> for a checklist bullet (use{' '}
              <code>- Label: rest</code> to bold just the label).</label>
            <textarea id="field-about-longer-detail-content" rows={6} value={form.about} onChange={(e) => set('about', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-key-highlights-one-per-line">Key Highlights (one per line)</label>
            <textarea id="field-key-highlights-one-per-line" rows={5} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-outcomes-achievements-one-per-line">Outcomes & Achievements (one per line — optional)</label>
            <textarea id="field-outcomes-achievements-one-per-line" rows={4} value={arrayToLines(form.outcomes)} onChange={(e) => set('outcomes', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-members-table-optional-see-format">Members Table (optional — see format above)</label>
            <textarea id="field-members-table-optional-see-format" rows={8} value={form.tableText} onChange={(e) => set('tableText', e.target.value)} placeholder={'Dr. G. Srinivasa Rao | Principal (Chairman)\nProf. P. Venkata Rama Raju | Vice-Principal'} />
          </div>
        </div>

        {/* Custom Section Editors - Differentiators pattern */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-light-gray)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Custom Sections &amp; Content Blocks
          </h3>
          <BlockEditor
            blockKey="description"
            label="Description (Main Block)"
            hint="Replaces/supplements the plain about text with styled text, checklist, or photo."
            value={form.description || emptyBlock('description')}
            onChange={(b) => set('description', b)}
            onPhotoUploaded={(r) => set('description', { ...(form.description || emptyBlock('description')), photo: { imageUrl: r.url, storagePath: r.path } })}
            onPhotoRemoved={() => set('description', { ...(form.description || emptyBlock('description')), photo: undefined })}
          />
          <BlockEditor
            blockKey="vision"
            label="Vision"
            value={form.vision || emptyBlock('vision')}
            onChange={(b) => set('vision', b)}
            onPhotoUploaded={(r) => set('vision', { ...(form.vision || emptyBlock('vision')), photo: { imageUrl: r.url, storagePath: r.path } })}
            onPhotoRemoved={() => set('vision', { ...(form.vision || emptyBlock('vision')), photo: undefined })}
          />
          <BlockEditor
            blockKey="mission"
            label="Mission"
            value={form.mission || emptyBlock('mission')}
            onChange={(b) => set('mission', b)}
            onPhotoUploaded={(r) => set('mission', { ...(form.mission || emptyBlock('mission')), photo: { imageUrl: r.url, storagePath: r.path } })}
            onPhotoRemoved={() => set('mission', { ...(form.mission || emptyBlock('mission')), photo: undefined })}
          />
          <BlockEditor
            blockKey="objectives"
            label="Objectives"
            value={form.objectives || emptyBlock('objectives')}
            onChange={(b) => set('objectives', b)}
            onPhotoUploaded={(r) => set('objectives', { ...(form.objectives || emptyBlock('objectives')), photo: { imageUrl: r.url, storagePath: r.path } })}
            onPhotoRemoved={() => set('objectives', { ...(form.objectives || emptyBlock('objectives')), photo: undefined })}
          />

          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Repeatable Custom Sections (Galleries, Accordions, Tables, Files, Links)
            </h4>
            <CustomSectionEditor
              sections={form.customSections || []}
              onChange={(next) => set('customSections', next)}
              rootSections={form.customSections || []}
              parentPath={[]}
              onFileUploaded={handleCustomSectionFileUploaded}
              onFileRemoved={handleCustomSectionFileRemoved}
              onPhotoUploaded={handleCustomSectionPhotoUploaded}
              onPhotoRemoved={handleCustomSectionPhotoRemoved}
              onGalleryPhotoUploaded={handleCustomSectionGalleryPhotoUploaded}
              onGalleryPhotoRemoved={handleCustomSectionGalleryPhotoRemoved}
              showPlacementToggle
            />
          </div>
        </div>

        <div className="admin-form-actions" style={{ marginTop: '2rem' }}>
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
                    <td>{it.category}</td>
                    <td>{it.slug}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id, it.heroStoragePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} className="admin-empty">No governance items yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
