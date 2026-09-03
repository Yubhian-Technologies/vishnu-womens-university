import { useState, type ComponentType } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import CustomSectionEditor from './CustomSectionEditor';
import CustomTabsEditor from './CustomTabsEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import { type CustomTab } from '../../../lib/customTabs';
import { diffChangedFields } from '../../../lib/formDiff';
import AicteIdeaLabTeamAdmin from './AicteIdeaLabTeamAdmin';
import AicteIdeaLabAmbassadorsAdmin from './AicteIdeaLabAmbassadorsAdmin';
import AicteIdeaLabFacilityPhotosAdmin from './AicteIdeaLabFacilityPhotosAdmin';
import IicMemberPhotosAdmin from './IicMemberPhotosAdmin';
import IicDocumentsAdmin from './IicDocumentsAdmin';
import VdlAchievementsAdmin from './VdlAchievementsAdmin';
import RwtpReportsAdmin from './RwtpReportsAdmin';

// Some differentiator items have extra editable content beyond the base
// fields below (a team roster, photo galleries, placement cards, ...) —
// keyed by the item's slug, shown inline while editing that specific item
// (see the "Extra Content" card below) instead of as separate top-level
// sidebar sections.
const ITEM_SUB_SECTIONS: Record<string, { key: string; label: string; Component: ComponentType }[]> = {
  'aicte-idea-lab': [
    { key: 'team', label: 'Team', Component: AicteIdeaLabTeamAdmin },
    { key: 'ambassadors', label: 'Student Ambassadors', Component: AicteIdeaLabAmbassadorsAdmin },
    { key: 'facility-photos', label: 'Facility Photos', Component: AicteIdeaLabFacilityPhotosAdmin },
  ],
  'institution-innovation-cell': [
    { key: 'member-photos', label: 'Council Member Photos', Component: IicMemberPhotosAdmin },
    { key: 'documents', label: 'Documents', Component: IicDocumentsAdmin },
  ],
  // TEDxSVECW's Photos, TI-DSP CoE's Gallery Photos, Chips to Startup's
  // Activities/Outcomes photos, and VSAC's Gallery Photos all moved to
  // generic "files"-type Custom Sections — their old dedicated panels have
  // no live target to manage anymore.
  // Facility-phase/campus-vehicle/industry-collab photos moved to generic
  // "files"-type sections within the Tabs editor below —
  // VdlFacilitiesPhotosAdmin's old fixed-slot photo panel has no live
  // target to manage anymore. Achievement Reports stays: it's still
  // rendered as-is on the public page.
  'vehicle-design-lab': [
    { key: 'achievement-reports', label: 'Achievement Reports', Component: VdlAchievementsAdmin },
  ],
  'rural-women-tech-park': [{ key: 'report-links', label: 'Report Links', Component: RwtpReportsAdmin }],
  // ATL's Photos and Activity PDFs moved to generic "files"-type Custom
  // Sections — AssistiveTechLabPhotosAdmin/AtlActivityPdfsAdmin have no
  // live target to manage anymore. Concrete Canoe Lab's 5 fixed photo
  // groups were migrated into a "Photo Galleries" Custom Section the same
  // way — ConcreteCanoePhotosAdmin's one-time migration tool has no live
  // target to manage anymore either.
  // WISE's old per-item photo panels (team/elite-project/testimonial/NSE
  // clipping) had no live target anymore once every tab moved to generic
  // "files"-type sections in the Tabs editor below — removed rather than
  // left pointing at nothing. Nirvahana's Event Photos moved to generic
  // photo-carrying sections the same way — NirvahanaEventPhotosAdmin has no
  // live target to manage anymore either.
};

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
  // Admin-defined sections beyond the fixed fields above — any name, any
  // number of sub-sections, and a choice of plain text / checklist / table /
  // links / files per section (see lib/customSections.ts). Fully additive:
  // an item with no customSections renders exactly as it did before this
  // field existed.
  customSections?: CustomSection[];
  // Admin-managed sidebar tabs — only used by the 4 items that render a
  // persistent tab layout instead of the intro/accordion one (WISE, IIC,
  // Vehicle Design Lab, AICTE Idea Lab; see lib/customTabs.ts). Independent
  // of customSections above — a page never uses both.
  tabs?: CustomTab[];
  heroImage: string;
  heroStoragePath: string;
  order: number;
}

const EMPTY: Omit<DifferentiatorItemDoc, 'id'> = {
  slug: '', title: '', category: 'innovation', desc: '', external: false, url: '',
  highlights: [], intro: '', about: '', facilities: [], outcomes: [], partners: [],
  customSections: [], tabs: [],
  heroImage: '', heroStoragePath: '', order: 0,
};

export const DIFFERENTIATOR_CATEGORIES = [
  { id: 'innovation', label: 'Innovation & Entrepreneurship' },
  { id: 'industry', label: 'Industry Centres of Excellence' },
  { id: 'research', label: 'Research & Specialised Labs' },
  { id: 'global', label: 'International & Global Outreach' },
  { id: 'student', label: 'Student Development & Social Impact' },
];

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim());
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

export default function DifferentiatorsAdmin() {
  const { docs: items, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const [form, setForm] = useState<Omit<DifferentiatorItemDoc, 'id'>>(EMPTY);
  // Snapshot of `form` taken when "Edit" was clicked (see startEdit) — save()
  // diffs against this so Update only writes fields actually changed in this
  // session, instead of blindly overwriting the whole doc with a possibly
  // stale copy (see lib/formDiff.ts). null while adding a new item.
  const [originalForm, setOriginalForm] = useState<Omit<DifferentiatorItemDoc, 'id'> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [activeSubKey, setActiveSubKey] = useState<string | null>(null);

  const set = (k: string, v: string | number | string[] | boolean | CustomSection[] | CustomTab[]) => setForm((p) => ({ ...p, [k]: v }));

  // Custom Sections — file uploads route through the functional `setForm(p
  // => ...)` form via replaceAtPath, recomputing from `p.customSections` at
  // call time (never a closed-over snapshot). Several file uploads across
  // different sections can resolve in quick succession, and each must land
  // on top of whatever the others already saved, not silently overwrite it
  // (same reasoning as ProgramsAdmin.tsx's handleLabPdf/handleCustomSectionFileUploaded).
  const handleCustomSectionFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };
  // Unlike the rest of this form (which only takes effect once "Update" is
  // clicked), removing a custom section's file acts immediately, so there's
  // no orphaned Storage file.
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
        // Firestore's updateDoc rejects an explicit `undefined` value
        // anywhere in the document, including nested — the key must be
        // dropped entirely, not set to undefined.
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };

  // contentType 'gallery' — same shape as the file handlers above, but each
  // photo is addressed by its index within that section's galleryPhotos.
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

  // Custom Tabs — used only by the 4 items with a sidebar-tab layout
  // instead of the intro/accordion one. Same shape as Custom Sections above,
  // one level deeper (tab -> its own section tree).
  const TABS_SLUGS = new Set(['talentsprint-wise', 'institution-innovation-cell', 'vehicle-design-lab', 'aicte-idea-lab']);
  const handleTabFileUploaded = (tabIndex: number, sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      tabs: (p.tabs || []).map((tab, ti) => (ti !== tabIndex ? tab : {
        ...tab,
        sections: replaceAtPath(tab.sections, sectionPath, (s) => ({
          ...s,
          files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
        })),
      })),
    }));
  };
  const handleTabFileRemoved = async (tabIndex: number, sectionPath: number[], fileIndex: number) => {
    const file = getAtPath((form.tabs || [])[tabIndex]?.sections || [], sectionPath)?.files?.[fileIndex];
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
      tabs: (p.tabs || []).map((tab, ti) => (ti !== tabIndex ? tab : {
        ...tab,
        sections: replaceAtPath(tab.sections, sectionPath, (s) => ({
          ...s,
          files: (s.files || []).filter((_, i) => i !== fileIndex),
        })),
      })),
    }));
  };
  const handleTabPhotoUploaded = (tabIndex: number, sectionPath: number[], r: UploadResult) => {
    setForm((p) => ({
      ...p,
      tabs: (p.tabs || []).map((tab, ti) => (ti !== tabIndex ? tab : {
        ...tab,
        sections: replaceAtPath(tab.sections, sectionPath, (s) => ({
          ...s,
          photo: { imageUrl: r.url, storagePath: r.path },
        })),
      })),
    }));
  };
  const handleTabPhotoRemoved = async (tabIndex: number, sectionPath: number[]) => {
    const photo = getAtPath((form.tabs || [])[tabIndex]?.sections || [], sectionPath)?.photo;
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
      tabs: (p.tabs || []).map((tab, ti) => (ti !== tabIndex ? tab : {
        ...tab,
        sections: replaceAtPath(tab.sections, sectionPath, (s) => {
          const next = { ...s };
          delete next.photo;
          return next;
        }),
      })),
    }));
  };
  const handleTabGalleryPhotoUploaded = (tabIndex: number, sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      tabs: (p.tabs || []).map((tab, ti) => (ti !== tabIndex ? tab : {
        ...tab,
        sections: replaceAtPath(tab.sections, sectionPath, (s) => ({
          ...s,
          galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph)),
        })),
      })),
    }));
  };
  const handleTabGalleryPhotoRemoved = async (tabIndex: number, sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath((form.tabs || [])[tabIndex]?.sections || [], sectionPath)?.galleryPhotos?.[photoIndex];
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
      tabs: (p.tabs || []).map((tab, ti) => (ti !== tabIndex ? tab : {
        ...tab,
        sections: replaceAtPath(tab.sections, sectionPath, (s) => ({
          ...s,
          galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
        })),
      })),
    }));
  };

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights.filter(Boolean),
        facilities: form.facilities.filter(Boolean),
        outcomes: form.outcomes.filter(Boolean),
        partners: form.partners.filter(Boolean),
      };
      if (editing) {
        // Only send fields that actually changed in this editing session —
        // see originalForm/diffChangedFields above.
        const changed = originalForm ? diffChangedFields(payload, originalForm) : payload;
        if (Object.keys(changed).length > 0) {
          await updateDoc(doc(db, 'differentiatorItems', editing), changed);
        }
      } else {
        await addDoc(collection(db, 'differentiatorItems'), { ...payload, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null); setActiveSubKey(null); setOriginalForm(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: DifferentiatorItemDoc) => {
    setEditing(it.id);
    const next: Omit<DifferentiatorItemDoc, 'id'> = {
      slug: it.slug, title: it.title, category: it.category, desc: it.desc || '',
      external: !!it.external, url: it.url || '', highlights: it.highlights || [],
      intro: it.intro || '', about: it.about || '', facilities: it.facilities || [],
      outcomes: it.outcomes || [], partners: it.partners || [],
      customSections: it.customSections || [], tabs: it.tabs || [],
      heroImage: it.heroImage || '', heroStoragePath: it.heroStoragePath || '', order: it.order,
    };
    setForm(next);
    setOriginalForm(next);
    setActiveSubKey(ITEM_SUB_SECTIONS[it.slug]?.[0]?.key ?? null);
  };

  const remove = async (id: string, heroStoragePath?: string) => {
    if (!confirm('Delete this differentiator item?')) return;
    try {
      if (heroStoragePath) await deleteFile(heroStoragePath);
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
        <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
          This item's detail-page hero image is now edited from <strong>Hero Banners → Differentiators</strong>, not here.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-url-slug-e-g-vishnu">URL Slug * (e.g. vishnu-tbi)</label>
            <input id="field-url-slug-e-g-vishnu" value={form.slug} onChange={(e) => set('slug', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="vishnu-tbi" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Vishnu Technology Business Incubator (TBI)" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-category">Category *</label>
            <select id="field-category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {DIFFERENTIATOR_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.external} onChange={(e) => set('external', e.target.checked)} style={{ marginRight: 6 }} />
              Links to an external site (not a VWU detail page)
            </label>
          </div>
          <div className="admin-field">
            <label htmlFor="field-external-url-only-if-the">External URL (only if the box above is checked)</label>
            <input id="field-external-url-only-if-the" value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://www.vishva.co/" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-short-description-shown-on-the">Short Description (shown on the listing card)</label>
            <textarea id="field-short-description-shown-on-the" rows={2} value={form.desc} onChange={(e) => set('desc', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-key-highlights-one-per-line">Key Highlights (one per line)</label>
            <textarea id="field-key-highlights-one-per-line" rows={4} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-intro-detail-page-only-used">Intro (detail page — only used when not an external link)</label>
            <textarea id="field-intro-detail-page-only-used" rows={3} value={form.intro} onChange={(e) => set('intro', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-about-detail-page-longer-paragraph">About (detail page — longer paragraph)</label>
            <textarea id="field-about-detail-page-longer-paragraph" rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-facilities-equipment-one-per-line">Facilities & Equipment (one per line — optional)</label>
            <textarea id="field-facilities-equipment-one-per-line" rows={3} value={arrayToLines(form.facilities)} onChange={(e) => set('facilities', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-outcomes-achievements-one-per-line">Outcomes & Achievements (one per line — optional)</label>
            <textarea id="field-outcomes-achievements-one-per-line" rows={3} value={arrayToLines(form.outcomes)} onChange={(e) => set('outcomes', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-partners-one-per-line-optional">Partners (one per line — optional)</label>
            <textarea id="field-partners-one-per-line-optional" rows={2} value={arrayToLines(form.partners)} onChange={(e) => set('partners', linesToArray(e.target.value))} />
          </div>

          {!TABS_SLUGS.has(form.slug) && (
            <>
              <div className="admin-field admin-field--full"><hr /><h3>Custom Sections</h3></div>
              <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
                Optional. Add any section this item needs beyond the fixed fields above — any name, any number of
                sub-sections, and a choice of plain text, a checklist, a table, a list of links, or uploaded files per
                section. Each one shows up on the public page once it has content. Use the Placement dropdown per
                section to choose "In the intro area above" (short items like Vision/Mission/Objectives, shown inline
                near About) vs. "In the accordion below" (the default — everything else, shown as a click-to-expand panel).
              </p>
              <div className="admin-field admin-field--full">
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
            </>
          )}

          {TABS_SLUGS.has(form.slug) && (
            <>
              <div className="admin-field admin-field--full"><hr /><h3>Tabs</h3></div>
              <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
                This item shows a sidebar of tabs on the public page instead of a single scrolling page. Add, rename,
                reorder, or remove tabs below — click "Edit Content" on a tab to add sections to it (same plain
                text / checklist / table / links / files editor as everywhere else).
              </p>
              <div className="admin-field admin-field--full">
                <CustomTabsEditor
                  tabs={form.tabs || []}
                  onChange={(next) => set('tabs', next)}
                  onFileUploaded={handleTabFileUploaded}
                  onFileRemoved={handleTabFileRemoved}
                  onPhotoUploaded={handleTabPhotoUploaded}
                  onPhotoRemoved={handleTabPhotoRemoved}
                  onGalleryPhotoUploaded={handleTabGalleryPhotoUploaded}
                  onGalleryPhotoRemoved={handleTabGalleryPhotoRemoved}
                />
              </div>
            </>
          )}
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); setActiveSubKey(null); setOriginalForm(null); }}>Cancel</button>}
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
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id, it.heroStoragePath)}>Delete</button>
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
