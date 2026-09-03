import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import CustomSectionEditor from './CustomSectionEditor';
import CustomTabsEditor from './CustomTabsEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import { type CustomTab } from '../../../lib/customTabs';
import { diffChangedFields } from '../../../lib/formDiff';
import { CAMPUS_LIFE_LEGACY_SEEDS } from '../../CampusLife/campusLifeLegacySeeds';

// Backs every "Campus Life" page (the 16 facility pages under /campus/*,
// Vishnu TV Academy, Arts & Culture, Sports & Games, Social Services,
// Campus Magazines) — one doc per page, same Custom Sections / Custom Tabs
// system already used for Programs/Differentiators/Faculty. Rendered by
// src/pages/CampusLife/CampusLifeDetail.tsx.
//
// Student Clubs and Radio Vishnu are NOT here — Student Clubs already has
// its own dedicated, fully-working admin (see 'student-clubs' section);
// Radio Vishnu is a Differentiators item. Both are just linked from below
// so this is still the one place to find everything Campus Life, without
// duplicating data that's already properly homed elsewhere.
export interface CampusLifeItemDoc {
  id: string;
  slug: string;
  title: string;
  // Admin-organization only (which list it shows under below) — not shown
  // to visitors.
  group: 'facility' | 'activity';
  order: number;
  // Plain sections (most pages) — same shape as Programs/Differentiators.
  customSections?: CustomSection[];
  // Sidebar-tab layout (Central Library, Campus Hostels, Other Facilities —
  // the pages that already had multiple tabs before this) — same shape as
  // WISE/IIC/VDL/Idea Lab in Differentiators.
  tabs?: CustomTab[];
}

const EMPTY: Omit<CampusLifeItemDoc, 'id'> = {
  slug: '', title: '', group: 'facility', order: 0, customSections: [], tabs: [],
};

// Pages that keep their existing multi-tab layout — everything else is a
// single scrolling page of custom sections. Matches exactly which pages
// had a tabbed UI before this (Central Library, Campus Hostels, Other
// Facilities), so nothing changes shape unexpectedly.
const TABS_SLUGS = new Set(['central-library', 'campus-hostels', 'other-facilities']);

const GROUP_LABELS: Record<CampusLifeItemDoc['group'], string> = {
  facility: 'Campus Facility',
  activity: 'Student Activity',
};

// Every page this admin section was built to cover, with the exact slug
// its live route expects — lets "Quick Add" below create a correctly-
// slugged item and load its starter content in one click, instead of an
// admin re-typing 20 slugs by hand (and risking a typo that leaves a page
// pointing at nothing).
const KNOWN_PAGES: { slug: string; title: string; group: CampusLifeItemDoc['group'] }[] = [
  { slug: 'smart-classrooms', title: 'Smart Class Rooms', group: 'facility' },
  { slug: 'state-of-the-art-labs', title: 'State-of-the-art Labs', group: 'facility' },
  { slug: 'central-library', title: 'Central Library', group: 'facility' },
  { slug: 'auditoriums', title: 'Auditoriums', group: 'facility' },
  { slug: 'campus-book-stores', title: 'Campus Book Stores', group: 'facility' },
  { slug: 'wifi-campus', title: 'Wi-Fi Campus', group: 'facility' },
  { slug: 'campus-hostels', title: 'Campus Hostels', group: 'facility' },
  { slug: 'food-courts', title: 'Food Courts', group: 'facility' },
  { slug: 'fitness-centre', title: 'VISHNU Fitness Centre', group: 'facility' },
  { slug: 'staff-quarters', title: 'Staff Quarters', group: 'facility' },
  { slug: 'travel-desk', title: 'Travel Desk', group: 'facility' },
  { slug: 'temples', title: 'Temples', group: 'facility' },
  { slug: 'health-care', title: 'Health Care', group: 'facility' },
  { slug: 'swimming-pool', title: 'Swimming Pool', group: 'facility' },
  { slug: 'campus-security', title: 'Campus Security', group: 'facility' },
  { slug: 'other-facilities', title: 'Other Facilities', group: 'facility' },
  { slug: 'vishnu-tv-academy', title: 'Vishnu TV Academy', group: 'activity' },
  { slug: 'arts-culture', title: 'Arts & Culture', group: 'activity' },
  { slug: 'sports-games', title: 'Sports & Games', group: 'activity' },
  { slug: 'social-services', title: 'Social Services', group: 'activity' },
  { slug: 'campus-magazines', title: 'Campus Magazines', group: 'activity' },
];

export default function CampusLifeAdmin() {
  const { docs: items, loading } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const [form, setForm] = useState<Omit<CampusLifeItemDoc, 'id'>>(EMPTY);
  const [originalForm, setOriginalForm] = useState<Omit<CampusLifeItemDoc, 'id'> | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterGroup, setFilterGroup] = useState<'All' | CampusLifeItemDoc['group']>('All');

  // Drag-to-reorder — grouped by `group` (Campus Facility / Student
  // Activity), since `order` only needs to be consistent within a group,
  // not across both combined (same pattern as ProgramsAdmin.tsx/
  // FacultyAdmin.tsx's category-grouped reordering). Displaying every item
  // in one flat table sorted by a single global `order` was the bug here —
  // two groups each starting their own order at 0 made the numbers look
  // duplicated/broken when merged into one list.
  const [groupedOrdered, setGroupedOrdered] = useState<Record<string, CampusLifeItemDoc[]>>({});
  const [drag, setDrag] = useState<{ group: string; index: number } | null>(null);
  useEffect(() => {
    const groups: Record<string, CampusLifeItemDoc[]> = {};
    items.forEach((it) => { (groups[it.group] ??= []).push(it); });
    setGroupedOrdered(groups);
  }, [items]);

  const handleDragOver = (group: string, i: number) => {
    if (!drag || drag.group !== group || drag.index === i) return;
    setGroupedOrdered((prev) => {
      const list = [...(prev[group] || [])];
      const [moved] = list.splice(drag.index, 1);
      list.splice(i, 0, moved);
      return { ...prev, [group]: list };
    });
    setDrag({ group, index: i });
  };
  const handleDrop = async (group: string) => {
    setDrag(null);
    const list = groupedOrdered[group] || [];
    const batch = writeBatch(db);
    let changed = false;
    list.forEach((it, i) => {
      if (it.order !== i) { batch.update(doc(db, 'campusLifeItems', it.id), { order: i }); changed = true; }
    });
    if (changed) {
      try {
        await batch.commit();
      } catch (e) {
        alert(`Couldn't save new order: ${(e as Error).message}`);
      }
    }
  };

  // Lets someone type an exact order number directly in the table instead
  // of dragging — same pattern as FacultyAdmin.tsx.
  const [orderEdits, setOrderEdits] = useState<Record<string, string>>({});
  const commitOrder = async (it: CampusLifeItemDoc, raw: string) => {
    setOrderEdits((prev) => { const next = { ...prev }; delete next[it.id]; return next; });
    const value = parseInt(raw, 10);
    if (Number.isNaN(value) || value === it.order) return;
    try {
      await updateDoc(doc(db, 'campusLifeItems', it.id), { order: value });
    } catch (e) {
      alert(`Couldn't update order: ${(e as Error).message}`);
    }
  };

  const set = (k: string, v: string | number | CustomSection[] | CustomTab[]) => setForm((p) => ({ ...p, [k]: v }));

  // Custom Sections file/photo/gallery handlers — identical wiring to
  // ProgramsAdmin.tsx/DifferentiatorsAdmin.tsx.
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

  // Custom Tabs file/photo/gallery handlers — identical wiring to
  // DifferentiatorsAdmin.tsx.
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

  // One-time starter content — every page here used to be hardcoded (or
  // split across the generic Page Content Blocks admin) with no single
  // place to edit it. This seeds that original content in as a starting
  // point so nothing is lost in the move; safe to click again later if the
  // converter itself is improved (overwrites this item's sections/tabs).
  const seedStarterContent = async () => {
    const seed = CAMPUS_LIFE_LEGACY_SEEDS[form.slug];
    if (!seed) return;
    if ((form.customSections?.length || form.tabs?.length) && !confirm('This REPLACES this item\'s current sections/tabs with a fresh copy of the original content. Continue?')) return;
    const result = seed();
    setForm((p) => ({ ...p, ...result }));
  };

  // Loads a known page's slug/title/group AND its starter content into the
  // Add form in one click — the admin still reviews and clicks "Add Page"
  // to actually save it.
  const quickAdd = (page: typeof KNOWN_PAGES[number]) => {
    setEditing(null);
    const seed = CAMPUS_LIFE_LEGACY_SEEDS[page.slug]?.() || {};
    setForm({ slug: page.slug, title: page.title, group: page.group, order: 0, customSections: [], tabs: [], ...seed });
  };
  const notYetCreated = KNOWN_PAGES.filter((p) => !items.some((it) => it.slug === p.slug));

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing) {
        const changed = originalForm ? diffChangedFields(payload, originalForm) : payload;
        if (Object.keys(changed).length > 0) {
          await updateDoc(doc(db, 'campusLifeItems', editing), changed);
        }
      } else {
        await addDoc(collection(db, 'campusLifeItems'), { ...payload, order: form.order || items.filter((i) => i.group === form.group).length, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null); setOriginalForm(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: CampusLifeItemDoc) => {
    setEditing(it.id);
    const next: Omit<CampusLifeItemDoc, 'id'> = {
      slug: it.slug, title: it.title, group: it.group, order: it.order,
      customSections: it.customSections || [], tabs: it.tabs || [],
    };
    setForm(next);
    setOriginalForm(next);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this Campus Life page?')) return;
    try {
      await deleteDoc(doc(db, 'campusLifeItems', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const visibleGroups = (filterGroup === 'All' ? (['facility', 'activity'] as const) : [filterGroup])
    .filter((g) => (groupedOrdered[g]?.length ?? 0) > 0);
  const usesTabs = TABS_SLUGS.has(form.slug);

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Elsewhere in Campus Life</h2>
        <p className="admin-field__hint">
          Student Clubs and Radio Vishnu are part of the Campus Life menu on the public site, but keep their own
          dedicated admin homes rather than living here — nothing about them changes.
        </p>
        <p className="admin-field__hint">
          Student Clubs → <strong>Admin → Student Clubs</strong>. Radio Vishnu → <strong>Admin → Differentiators</strong> (search "Radio Vishnu").
        </p>
      </div>

      {notYetCreated.length > 0 && (
        <div className="admin-card">
          <h2 className="admin-card__title">Quick Add ({notYetCreated.length} page{notYetCreated.length === 1 ? '' : 's'} not created yet)</h2>
          <p className="admin-field__hint">
            Click a page below to load its correct slug, title, and original starter content into the form —
            review it, then click "Add Page" to save.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {notYetCreated.map((p) => (
              <button key={p.slug} type="button" className="admin-btn admin-btn--sm" onClick={() => quickAdd(p)}>
                + {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Campus Life Page' : 'Add Campus Life Page'}</h2>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-cl-slug">URL Slug *</label>
            <input id="field-cl-slug" value={form.slug} onChange={(e) => set('slug', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="smart-classrooms" disabled={!!editing} />
            <p className="admin-field__hint">Must match the page's existing URL segment — see the routes list this was built against. Locked once created.</p>
          </div>
          <div className="admin-field">
            <label htmlFor="field-cl-title">Title *</label>
            <input id="field-cl-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Smart Class Rooms" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-cl-group">Group (organizes the list below only)</label>
            <select id="field-cl-group" value={form.group} onChange={(e) => set('group', e.target.value)}>
              <option value="facility">Campus Facility</option>
              <option value="activity">Student Activity</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-cl-order">Display Order</label>
            <input id="field-cl-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>

          {CAMPUS_LIFE_LEGACY_SEEDS[form.slug] && (
            <p className="admin-field__hint admin-field--full" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem' }}>
              This page's original content is available as a starting point.{' '}
              <button type="button" className="admin-btn admin-btn--sm" onClick={seedStarterContent}>
                {(form.customSections?.length || form.tabs?.length) ? 'Re-seed (overwrite)' : 'Add starter content'}
              </button>
            </p>
          )}

          {!usesTabs && (
            <>
              <div className="admin-field admin-field--full"><hr /><h3>Sections</h3></div>
              <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
                Any name, any number of sub-sections, and a choice of plain text, a table, a checklist, a list of
                links, uploaded files, a photo gallery, or panel view per section.
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
                />
              </div>
            </>
          )}

          {usesTabs && (
            <>
              <div className="admin-field admin-field--full"><hr /><h3>Tabs</h3></div>
              <p className="admin-field__hint" style={{ marginTop: '-0.5rem' }}>
                This page shows a sidebar of tabs on the public page. Add, rename, reorder, or remove tabs below —
                click "Edit Content" on a tab to add sections to it.
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
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); setOriginalForm(null); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Page'}</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Pages ({items.length})</h2>
          <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value as typeof filterGroup)} className="admin-select-sm">
            <option value="All">All</option>
            <option value="facility">Campus Facility</option>
            <option value="activity">Student Activity</option>
          </select>
        </div>
        <p className="admin-field__hint" style={{ margin: '0 0 0.75rem' }}>
          Drag rows by the ⠿ handle, or type an exact number in Order, to reorder. Order only needs to make sense
          within its own group below — Campus Facility and Student Activity are ordered independently, since they
          never appear together in one list on the public site.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : (
          visibleGroups.map((group) => {
            const list = groupedOrdered[group] || [];
            return (
              <div key={group} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{GROUP_LABELS[group]} ({list.length})</h3>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th></th><th>Order</th><th>Title</th><th>Slug</th><th>Layout</th><th>Actions</th></tr></thead>
                    <tbody>
                      {list.map((it, i) => (
                        <tr
                          key={it.id}
                          draggable
                          onDragStart={() => setDrag({ group, index: i })}
                          onDragOver={(e) => { e.preventDefault(); handleDragOver(group, i); }}
                          onDrop={() => handleDrop(group)}
                          onDragEnd={() => setDrag(null)}
                          style={{ opacity: drag?.group === group && drag.index === i ? 0.5 : 1, cursor: 'grab' }}
                        >
                          <td style={{ color: 'var(--color-text-light, #9ca3af)', fontSize: '1.1rem', userSelect: 'none' }}>⠿</td>
                          <td>
                            <input
                              type="number"
                              className="admin-order-input"
                              value={orderEdits[it.id] ?? it.order}
                              onChange={(e) => setOrderEdits((prev) => ({ ...prev, [it.id]: e.target.value }))}
                              onBlur={(e) => commitOrder(it, e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td>{it.title}</td>
                          <td>{it.slug}</td>
                          <td>{TABS_SLUGS.has(it.slug) ? 'Tabs' : 'Sections'}</td>
                          <td>
                            <button className="admin-btn admin-btn--sm" onClick={() => startEdit(it)}>Edit</button>
                            <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(it.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
        {!loading && visibleGroups.length === 0 && <p className="admin-empty">No Campus Life pages yet.</p>}
      </div>
    </div>
  );
}
