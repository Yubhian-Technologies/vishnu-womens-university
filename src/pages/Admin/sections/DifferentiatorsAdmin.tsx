import { useMemo, useState, type ComponentType } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import CustomSectionEditor from './CustomSectionEditor';
import CustomTabsEditor from './CustomTabsEditor';
import { replaceAtPath, getAtPath, hasCustomSectionContent, type CustomSection } from '../../../lib/customSections';
import { type CustomTab } from '../../../lib/customTabs';
import { diffChangedFields } from '../../../lib/formDiff';
import AicteIdeaLabTeamAdmin from './AicteIdeaLabTeamAdmin';
import AicteIdeaLabAmbassadorsAdmin from './AicteIdeaLabAmbassadorsAdmin';
import AicteIdeaLabFacilityPhotosAdmin from './AicteIdeaLabFacilityPhotosAdmin';
import IicCouncilMembersAdmin from './IicCouncilMembersAdmin';
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
    { key: 'council-members', label: 'Council Members', Component: IicCouncilMembersAdmin },
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
  // Optional — set only on a differentiator that maps to one teaching
  // department (e.g. "Vehicle Design Lab" → ME). When set, DifferentiatorDetail
  // shows that department's faculty automatically (same `faculty` collection
  // + filter as ProgramDetail), so rosters never need re-entering here.
  department: string;
  desc: string;
  summary?: string;
  external: boolean;
  url: string;
  // The page's headingless top description block — text, a bullet list, or
  // either plus a photo (admin's choice of contentType). Replaces the old
  // separate `intro`/`about` paragraph fields below.
  description?: CustomSection;
  // Vision / Mission / Objectives — pre-existing named slots every item has
  // in the admin form (so they're never ad-hoc-typed Custom Sections with an
  // inconsistent name), each the same text/checklist/photo shape as
  // `description`. Shown on the public page — compactly, inline near the
  // description — only when it actually has content (see
  // hasCustomSectionContent), same as every other optional section here.
  vision?: CustomSection;
  mission?: CustomSection;
  objectives?: CustomSection;
  /** @deprecated superseded by `description` above — kept only so existing
   * items' old paragraphs can still be read as a fallback (see
   * legacyDescriptionFrom below and DifferentiatorDetail.tsx) until each
   * item is re-saved from the new admin field. No longer written to. */
  intro?: string;
  /** @deprecated see `intro` above. */
  about?: string;
  /** @deprecated Key Highlights/Facilities/Outcomes/Partners are no longer
   * fixed fields — they're just Custom Sections now, like Vision/Mission/
   * Contacts/anything else (see legacySectionsFrom below and
   * DifferentiatorDetail.tsx). Kept only so old items' content is still read
   * as a fallback until each item is re-saved. No longer written to. */
  highlights?: string[];
  /** @deprecated see `highlights` above. */
  facilities?: string[];
  /** @deprecated see `highlights` above. */
  outcomes?: string[];
  /** @deprecated see `highlights` above. */
  partners?: string[];
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

// The single-block fields (Description, Vision, Mission, Objectives) share
// this shape — text, a checklist, or either plus a photo — and this same
// empty starting point, keyed by their own fixed id/label.
export type BlockKey = 'description' | 'vision' | 'mission' | 'objectives';
export const BLOCK_LABELS: Record<BlockKey, string> = {
  description: 'Description', vision: 'Vision', mission: 'Mission', objectives: 'Objectives',
};
function emptyBlock(key: BlockKey): CustomSection {
  return { id: key, label: BLOCK_LABELS[key], contentType: 'text', textContent: '' };
}

const EMPTY: Omit<DifferentiatorItemDoc, 'id'> = {
  slug: '', title: '', category: 'innovation', department: '', desc: '', external: false, url: '',
  description: emptyBlock('description'), vision: emptyBlock('vision'), mission: emptyBlock('mission'), objectives: emptyBlock('objectives'),
  customSections: [], tabs: [],
  heroImage: '', heroStoragePath: '', order: 0,
};

// Only used to prefill the new single Description field when opening an item
// that predates it — never written back automatically. Prefers the longer
// `about` paragraph, falling back to `intro`, so admins re-saving an old item
// see their existing copy already in place instead of starting from blank.
function legacyDescriptionFrom(it: DifferentiatorItemDoc): CustomSection {
  const text = (it.about || it.intro || '').trim();
  return { id: 'description', label: 'Description', contentType: 'text', textContent: text };
}

// Vision/Mission/Objectives used to only exist as ad-hoc Custom Sections an
// admin typed in themselves (same name, no guarantee) — now they're their
// own fixed field, like `description`. Prefers the item's own `vision`/
// `mission`/`objectives` field if it already has content; otherwise looks
// for a Custom Section with that exact id (the slug `generateSectionId`
// would have produced from a section literally named "Vision" etc.) so any
// content already entered that way is picked up automatically instead of
// looking blank the first time an item is reopened after this change.
function blockOrPromotedSection(it: DifferentiatorItemDoc, key: Exclude<BlockKey, 'description'>): CustomSection {
  const direct = it[key];
  if (direct && hasCustomSectionContent(direct)) return direct;
  const legacy = (it.customSections || []).find((s) => s.id === key);
  if (legacy && hasCustomSectionContent(legacy)) return { ...legacy, id: key, label: legacy.label || BLOCK_LABELS[key] };
  return emptyBlock(key);
}

// Turns the old fixed Key Highlights/Facilities/Outcomes/Partners fields into
// equivalent Custom Sections, so opening an old item for edit shows that
// content already migrated into the generic system instead of gone. Only
// called for ids not already present in the item's customSections (see
// startEdit), so re-opening an already-migrated item never duplicates them.
function legacySectionsFrom(it: DifferentiatorItemDoc): CustomSection[] {
  const specs: { id: string; label: string; values?: string[] }[] = [
    { id: 'highlights', label: 'Key Highlights', values: it.highlights },
    { id: 'facilities', label: 'Facilities & Equipment', values: it.facilities },
    { id: 'outcomes', label: 'Outcomes & Achievements', values: it.outcomes },
    { id: 'partners', label: 'Partners', values: it.partners },
  ];
  return specs
    .filter((s) => (s.values || []).filter(Boolean).length > 0)
    .map((s) => ({ id: s.id, label: s.label, contentType: 'list', listText: (s.values || []).filter(Boolean).join('\n') }));
}

// Same list as ProgramsAdmin.tsx's DEPARTMENTS — keep in sync.
const DEPARTMENTS = ['CSE', 'AI', 'Cyber Security', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA'];

export const DIFFERENTIATOR_CATEGORIES = [
  { id: 'innovation', label: 'Innovation & Entrepreneurship' },
  { id: 'industry', label: 'Industry Centres of Excellence' },
  { id: 'research', label: 'Research & Specialised Labs' },
  { id: 'global', label: 'International & Global Outreach' },
  { id: 'student', label: 'Student Development & Social Impact' },
];

// The 4 items with a sidebar-tab layout instead of the intro/accordion one —
// they render `tabs`, never `customSections`, on the public page, so
// migrating legacy Highlights/Facilities/Outcomes/Partners into
// `customSections` for them would just be dead data (see
// computeMigratedFields below).
const TABS_SLUGS = new Set(['talentsprint-wise', 'institution-innovation-cell', 'vehicle-design-lab', 'aicte-idea-lab']);

// The single source of truth for "what does this item look like under the
// new structure" — used both when opening one item for edit (startEdit) and
// by the bulk "Migrate to New Structure" action below, so a bulk-migrated
// item ends up byte-for-byte identical to one an admin opened and saved by
// hand. Pure and additive: never removes/overwrites real content, only fills
// in the new fields from whatever legacy content is present.
function computeMigratedFields(it: DifferentiatorItemDoc): Pick<DifferentiatorItemDoc, 'description' | 'vision' | 'mission' | 'objectives' | 'customSections'> {
  const existingSectionIds = new Set((it.customSections || []).map((s) => s.id));
  const migratedSections = TABS_SLUGS.has(it.slug) ? [] : legacySectionsFrom(it).filter((s) => !existingSectionIds.has(s.id));
  const promotedIds = new Set(['vision', 'mission', 'objectives']);
  return {
    description: it.description && hasCustomSectionContent(it.description) ? it.description : legacyDescriptionFrom(it),
    vision: blockOrPromotedSection(it, 'vision'),
    mission: blockOrPromotedSection(it, 'mission'),
    objectives: blockOrPromotedSection(it, 'objectives'),
    customSections: [...(it.customSections || []).filter((s) => !promotedIds.has(s.id)), ...migratedSections],
  };
}

// Shared editor for the single-block fields (Description, Vision, Mission,
// Objectives) — a content-type choice of Plain text / Checklist, the
// matching textarea, and an optional photo. Used four times below instead of
// once since each is its own fixed field, not a repeatable list.
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
            folder={`vwu/differentiators/${blockKey}`}
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

  const set = (k: string, v: string | number | boolean | CustomSection | CustomSection[] | CustomTab[]) => setForm((p) => ({ ...p, [k]: v }));

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

  // Description/Vision/Mission/Objectives' own optional photo — a plain
  // object on `form[key]`, not a path-addressed tree like Custom Sections
  // above, since there's only ever one of it per block.
  const handleBlockPhotoUploaded = (key: BlockKey, r: UploadResult) => {
    setForm((p) => ({
      ...p,
      [key]: { ...(p[key] || emptyBlock(key)), photo: { imageUrl: r.url, storagePath: r.path } },
    }));
  };
  const handleBlockPhotoRemoved = async (key: BlockKey) => {
    const photo = form[key]?.photo;
    if (!photo?.imageUrl) return;
    if (!confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setForm((p) => {
      const next = { ...(p[key] || emptyBlock(key)) };
      delete next.photo;
      return { ...p, [key]: next };
    });
  };

  // Custom Tabs — used only by the 4 TABS_SLUGS items with a sidebar-tab
  // layout instead of the intro/accordion one. Same shape as Custom Sections
  // above, one level deeper (tab -> its own section tree).
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
      const payload = { ...form };
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
      slug: it.slug, title: it.title, category: it.category, department: it.department || '', desc: it.desc || '',
      external: !!it.external, url: it.url || '',
      ...computeMigratedFields(it),
      tabs: it.tabs || [],
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

  // One-time (but safe to re-run) bulk migration: writes the new
  // description/vision/mission/objectives/customSections fields into every
  // existing item in Firestore, computed the exact same way startEdit does —
  // so this never has to be run by hand, item by item. Strictly additive:
  // updateDoc only ever touches these fields, so nothing existing (including
  // the deprecated intro/about/highlights/facilities/outcomes/partners) is
  // ever deleted — an item already migrated is simply skipped (diffed
  // against itself, nothing changes, nothing is written).
  // What each item's fields would change to vs. what they are now — used to
  // both size/label the button honestly (so it reads "0 to migrate" instead
  // of always showing the total item count, migrated or not) and, in
  // migrateAll below, to actually write only what's changed.
  const pendingMigrations = useMemo(() => items.map((it) => {
    const fields = computeMigratedFields(it);
    const before: typeof fields = {
      description: it.description as CustomSection, vision: it.vision as CustomSection,
      mission: it.mission as CustomSection, objectives: it.objectives as CustomSection,
      customSections: it.customSections || [],
    };
    return { it, changed: diffChangedFields(fields, before) };
  }).filter((m) => Object.keys(m.changed).length > 0), [items]);

  const [migrating, setMigrating] = useState(false);
  const migrateAll = async () => {
    if (pendingMigrations.length === 0) return;
    if (!confirm(`Migrate ${pendingMigrations.length} item(s) to the new Description/Vision/Mission/Objectives structure?\n\nThis only adds/updates those fields — nothing is deleted.`)) return;
    setMigrating(true);
    let migratedCount = 0;
    try {
      for (const { it, changed } of pendingMigrations) {
        await updateDoc(doc(db, 'differentiatorItems', it.id), changed);
        migratedCount++;
      }
      alert(`Done. Migrated ${migratedCount} item(s).`);
    } catch (e) {
      alert(`Migration stopped partway: ${(e as Error).message}\n\nAlready-migrated items were saved successfully — just run this again to pick up where it left off.`);
    } finally {
      setMigrating(false);
    }
  };

  const filtered = filterCat === 'All' ? items : items.filter((i) => i.category === filterCat);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Migrate to New Structure</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Moves every item's old Intro/About/Key Highlights/Facilities/Outcomes/Partners content into the new
          Description/Vision/Mission/Objectives fields and Custom Sections — the same thing that happens automatically
          when you open one item and click Update, just for all of them at once. Nothing is ever deleted (the old
          fields are simply left in place, unused).
        </p>
        {!loading && pendingMigrations.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)', fontWeight: 600, margin: 0 }}>
            ✓ All {items.length} item(s) already use the new structure — nothing to migrate.
          </p>
        ) : (
          <button className="admin-btn admin-btn--primary" onClick={migrateAll} disabled={migrating || loading}>
            {migrating ? 'Migrating…' : `Migrate ${pendingMigrations.length} Item(s)`}
          </button>
        )}
      </div>

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
            <label htmlFor="field-differentiator-department">Department (optional — auto-shows that department's faculty on the detail page)</label>
            <input id="field-differentiator-department" list="differentiator-departments" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="e.g. ECE — leave blank if not department-specific" />
            <datalist id="differentiator-departments">
              {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
            </datalist>
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
          <BlockEditor
            blockKey="description"
            label="Description"
            hint="Shown at the top of the detail page with no heading, only when not an external link."
            value={form.description || emptyBlock('description')}
            onChange={(next) => set('description', next)}
            onPhotoUploaded={(r) => handleBlockPhotoUploaded('description', r)}
            onPhotoRemoved={() => handleBlockPhotoRemoved('description')}
          />
          {!TABS_SLUGS.has(form.slug) && (
            <>
              <div className="admin-field admin-field--full"><hr /></div>
              <BlockEditor
                blockKey="vision"
                label="Vision"
                value={form.vision || emptyBlock('vision')}
                onChange={(next) => set('vision', next)}
                onPhotoUploaded={(r) => handleBlockPhotoUploaded('vision', r)}
                onPhotoRemoved={() => handleBlockPhotoRemoved('vision')}
              />
              <BlockEditor
                blockKey="mission"
                label="Mission"
                value={form.mission || emptyBlock('mission')}
                onChange={(next) => set('mission', next)}
                onPhotoUploaded={(r) => handleBlockPhotoUploaded('mission', r)}
                onPhotoRemoved={() => handleBlockPhotoRemoved('mission')}
              />
              <BlockEditor
                blockKey="objectives"
                label="Objectives"
                value={form.objectives || emptyBlock('objectives')}
                onChange={(next) => set('objectives', next)}
                onPhotoUploaded={(r) => handleBlockPhotoUploaded('objectives', r)}
                onPhotoRemoved={() => handleBlockPhotoRemoved('objectives')}
              />
            </>
          )}
          {!TABS_SLUGS.has(form.slug) && (
            <>
              <div className="admin-field admin-field--full"><hr /><h3>Custom Sections</h3></div>
              <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
                Add any section this item needs beyond Description/Vision/Mission/Objectives above — Key Highlights,
                Facilities, Outcomes, Partners, Contacts, or anything else — any name, any number of sub-sections, and
                a choice of plain text, a checklist, a table, a list of links, uploaded files, or contacts
                (role/name/phone/email) per section. Each one shows up on the public page once it has content. Use
                the Placement dropdown per section to choose "In the intro area above" (shown inline near the
                description, like Vision/Mission/Objectives) vs. "In the accordion below" (the default — everything
                else, shown as a click-to-expand panel).
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
