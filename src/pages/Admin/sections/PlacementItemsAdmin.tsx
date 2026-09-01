import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import TableImportButton from '../../../components/TableImportButton/TableImportButton';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';
import { PLACEMENT_HIGHLIGHTS_CAROUSEL_RATIO } from '../../../lib/placementHighlightsCarousel';

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
  /** Only used on the "placement-highlights" page — its single-line column
   *  headers, e.g. "S.No | Regd No | Branch | Name | Company | LPA | Batch",
   *  kept fully separate from Data Table (which holds only data rows there)
   *  so an Excel/CSV re-import can never accidentally turn a real data row
   *  into the header, or vice versa. Typed once, not part of the import. */
  dataTableHeadersText: string;
  rosterGroupsText: string;
  /** One "Name | Department" per line — shown on the public site as a
   *  single "Department Coordinators" row inside each Team Group tile
   *  (rows sliced across groups by deptCoordinatorGroupsText, same
   *  mechanism as rosterGroupsText slices Data Table). Import a raw list
   *  here via the Excel/CSV button below, then set the counts. */
  deptCoordinatorsText: string;
  /** One "Group Label | Count" per line, same format/labels as
   *  rosterGroupsText — assigns that many of deptCoordinatorsText's rows
   *  (in order) to each Team Group. */
  deptCoordinatorGroupsText: string;
  emails: string[];
  linkedins: string[];
  heroImage: string;
  heroStoragePath: string;
  order: number;
  /** Only used on the "placement-highlights" page — rotating promotional
   *  banner photos shown via PhotoCarousel in place of the Overview text
   *  once at least one is uploaded. Optional: most items never set this. */
  galleryImages?: { url: string; path: string }[];
}

const EMPTY: Omit<PlacementItemDoc, 'id'> = {
  slug: '', title: '', icon: 'BarChart3', desc: '', external: false, url: '',
  intro: '', about: '', highlights: [], outcomes: [], partners: [], tableText: '', dataTableHeadersText: '', rosterGroupsText: '',
  deptCoordinatorsText: '', deptCoordinatorGroupsText: '', emails: [], linkedins: [], heroImage: '', heroStoragePath: '', galleryImages: [], order: 0,
};

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim());
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

export default function PlacementItemsAdmin() {
  const { docs: items, loading } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  const [form, setForm] = useState<Omit<PlacementItemDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Photo Carousel — useImageCropModal directly (not the full ImageUploader
  // component), same as GsacPhotosAdmin/IloOfficePhotosAdmin: ImageUploader
  // keeps a "last uploaded" preview and swaps its button to "Change Image"
  // after the first photo, which reads as "replace this one" rather than
  // "add another" — the wrong affordance for a repeatable add-to-list field.
  const { openCrop: openGalleryCrop, cropModal: galleryCropModal } = useImageCropModal(PLACEMENT_HIGHLIGHTS_CAROUSEL_RATIO);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const set = (k: string, v: string | number | string[] | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights.filter(Boolean),
        outcomes: form.outcomes.filter(Boolean),
        partners: form.partners.filter(Boolean),
        emails: form.emails.filter(Boolean),
        linkedins: form.linkedins.filter(Boolean),
      };
      if (editing) {
        await updateDoc(doc(db, 'placementItems', editing), { ...payload });
      } else {
        await addDoc(collection(db, 'placementItems'), { ...payload, order: form.order || items.length + 1, createdAt: serverTimestamp() });
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
      tableText: it.tableText || '', dataTableHeadersText: it.dataTableHeadersText || '', rosterGroupsText: it.rosterGroupsText || '', deptCoordinatorsText: it.deptCoordinatorsText || '',
      deptCoordinatorGroupsText: it.deptCoordinatorGroupsText || '',
      emails: it.emails || [], linkedins: it.linkedins || [],
      heroImage: it.heroImage || '', heroStoragePath: it.heroStoragePath || '',
      galleryImages: it.galleryImages || [], order: it.order,
    });
  };

  // Gallery images — added one at a time via the crop modal, each
  // independently uploaded/removed (same pattern as ProgramsAdmin's Lab
  // PDFs): functional setForm reads p.galleryImages, never a stale outer
  // snapshot, so uploading several in quick succession can't clobber one
  // another. Order in the array is display order — move buttons reorder it.
  const galleryImages = form.galleryImages || [];
  const addGalleryImage = (file: File) => {
    setGalleryUploading(true);
    openGalleryCrop(file, 'vwu/placements/highlights-carousel', (r: UploadResult) => {
      setForm((p) => ({ ...p, galleryImages: [...(p.galleryImages || []), { url: r.url, path: r.path }] }));
      setGalleryUploading(false);
    });
  };
  const moveGalleryImage = (i: number, dir: -1 | 1) => {
    setForm((p) => {
      const next = [...(p.galleryImages || [])];
      const target = i + dir;
      if (target < 0 || target >= next.length) return p;
      [next[i], next[target]] = [next[target], next[i]];
      return { ...p, galleryImages: next };
    });
  };
  // Removes immediately (deletes from Storage + patches Firestore on the
  // spot if this item already exists), same reasoning as removeLabPdf in
  // ProgramsAdmin — no orphaned Storage file, no risk of losing the removal
  // if the admin navigates away before saving the rest of the form.
  const removeGalleryImage = async (i: number) => {
    const img = galleryImages[i];
    if (!img) return;
    if (!confirm('Remove this photo from the carousel? This cannot be undone.')) return;
    try {
      if (img.path) await deleteFile(img.path);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    let next: { url: string; path: string }[] = [];
    setForm((p) => {
      next = (p.galleryImages || []).filter((_, gi) => gi !== i);
      return { ...p, galleryImages: next };
    });
    if (editing) {
      try {
        await updateDoc(doc(db, 'placementItems', editing), { galleryImages: next });
      } catch (e) {
        alert(`The file was deleted from storage, but the saved record couldn't be updated: ${(e as Error).message}`);
      }
    }
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
          For the Data table, put each row on its own line as <code>Column 1 | Column 2 | Column 3</code>. On
          roster-style pages (TPO Cell, TPO Team) that's <code>Name | Role | Notes</code> — add a 4th{' '}
          <code>| Email</code> and/or 5th <code>| LinkedIn URL</code> to show that person's contact info right
          under their name on the public page, without needing a separate admin section. Industry Liaison
          Offices is just <code>City | Office Address</code> (2 columns, no Role) — each city's row expands to
          show that address under an "Office Address" heading. The slug{' '}
          <code>placement-highlights</code> is special: its Data Table shows whatever columns your spreadsheet
          has, in that exact order, instead of a fixed shape — its Excel/CSV import button fills both the Table
          Column Headers field and Data Table from the same file in one click (row 1 of the file always becomes
          the header), so re-importing a spreadsheet can never accidentally turn a real row of data into the
          header row.
          Not the same as the "Placements" section, which manages the recruiter logo list.
        </p>
        <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
          This page's hero image is now edited from <strong>Hero Banners → Placements</strong>, not here.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-url-slug-e-g-tpo">URL Slug * (e.g. tpo-cell)</label>
            <input id="field-url-slug-e-g-tpo" value={form.slug} onChange={(e) => set('slug', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="tpo-cell" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-title">Title *</label>
            <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="TPO Cell" />
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
          <div className="admin-field">
            <label>
              <input type="checkbox" checked={form.external} onChange={(e) => set('external', e.target.checked)} style={{ marginRight: 6 }} />
              Links to an external site (not a VWU detail page)
            </label>
          </div>
          <div className="admin-field">
            <label htmlFor="field-external-url-only-if-the">External URL (only if the box above is checked)</label>
            <input id="field-external-url-only-if-the" value={form.url} onChange={(e) => set('url', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-short-description-shown-on-the">Short Description (shown on the listing card)</label>
            <textarea id="field-short-description-shown-on-the" rows={2} value={form.desc} onChange={(e) => set('desc', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-intro-detail-page">Intro (detail page)</label>
            <textarea id="field-intro-detail-page" rows={3} value={form.intro} onChange={(e) => set('intro', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-about-detail-page-longer-paragraph">About (detail page — longer paragraph)</label>
            <textarea id="field-about-detail-page-longer-paragraph" rows={4} value={form.about} onChange={(e) => set('about', e.target.value)} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-key-highlights-one-per-line">Key Highlights (one per line)</label>
            <textarea id="field-key-highlights-one-per-line" rows={4} value={arrayToLines(form.highlights)} onChange={(e) => set('highlights', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-outcomes-achievements-one-per-line">Outcomes & Achievements (one per line — optional)</label>
            <textarea id="field-outcomes-achievements-one-per-line" rows={3} value={arrayToLines(form.outcomes)} onChange={(e) => set('outcomes', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-recruiting-partners-one-per-line">Recruiting Partners (one per line — optional)</label>
            <textarea id="field-recruiting-partners-one-per-line" rows={3} value={arrayToLines(form.partners)} onChange={(e) => set('partners', linesToArray(e.target.value))} />
          </div>
          {form.slug === 'placement-highlights' && (
            <div className="admin-field admin-field--full">
              <label htmlFor="field-data-table-headers">
                Table Column Headers (one line, pipe-separated) — sets the column names shown above Data Table.
                Auto-filled from row 1 of the file when you use the Excel/CSV import below; edit by hand only if
                you need to rename a column afterward.
              </label>
              <input
                id="field-data-table-headers"
                value={form.dataTableHeadersText}
                onChange={(e) => set('dataTableHeadersText', e.target.value)}
                placeholder="S.No | Regd No | Branch | Name | Company | LPA | Batch"
              />
            </div>
          )}
          <div className="admin-field admin-field--full">
            <label htmlFor="field-data-table-optional-see-format">
              Data Table (optional — see format above){form.slug === 'placement-highlights' ? ' — data rows only; headers come from the field above' : ''}
            </label>
            <textarea id="field-data-table-optional-see-format" rows={6} value={form.tableText} onChange={(e) => set('tableText', e.target.value)} placeholder={'Amazon | 110000 | 29\nFlipkart | 95000 | 12'} />
            <div style={{ marginTop: '0.4rem' }}>
              {form.slug === 'placement-highlights' ? (
                <TableImportButton
                  onImportSplit={(headerLine, dataText) => {
                    set('dataTableHeadersText', headerLine);
                    set('tableText', dataText);
                  }}
                  label="Import Data Table from Excel/CSV"
                />
              ) : (
                <TableImportButton onImport={(text) => set('tableText', text)} label="Import Data Table from Excel/CSV" />
              )}
            </div>
          </div>
          {form.slug === 'placement-highlights' && (
            <div className="admin-field admin-field--full">
              <label>Photo Carousel</label>
              <p className="admin-field__hint" style={{ marginTop: 0 }}>
                Replaces this page's Overview text and Key Highlights sidebar with an auto-advancing photo
                carousel — add each image below (any order; use ↑/↓ to reorder). Leave it empty to keep showing
                the plain Overview text/Key Highlights instead. Every photo is cropped to the same fixed shape on
                upload (matching the reference banner) so images don't vary in size from one another — the
                carousel would otherwise visibly resize on every swap. Drag the crop box to the part of your
                source image you want kept before clicking "Crop & Upload".
              </p>
              {galleryImages.length > 0 && (
                <div className="admin-image-grid" style={{ marginBottom: '0.75rem' }}>
                  {galleryImages.map((img, i) => (
                    <div key={img.path || i} className="admin-image-card">
                      <img src={img.url} alt={`Carousel photo ${i + 1}`} />
                      <div className="admin-image-card__actions">
                        <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveGalleryImage(i, -1)} disabled={i === 0} title="Move earlier">↑</button>
                        <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveGalleryImage(i, 1)} disabled={i === galleryImages.length - 1} title="Move later">↓</button>
                        <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeGalleryImage(i)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <label className="admin-btn admin-btn--ghost" style={{ display: 'inline-block', cursor: galleryUploading ? 'default' : 'pointer', opacity: galleryUploading ? 0.6 : 1 }}>
                {galleryUploading ? 'Uploading…' : '+ Add Photo'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={galleryUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addGalleryImage(file);
                    e.target.value = '';
                  }}
                />
              </label>
              {galleryCropModal}
            </div>
          )}
          <div className="admin-field admin-field--full">
            <label htmlFor="field-team-groups-one-per-line-optional">
              Team Groups (one per line, "Group Label | Count" — optional). When set, the Data Table above
              renders as clickable group tiles (e.g. "Central Placement Team") instead of a flat list — the
              first <code>Count</code> rows go in the first group, the next <code>Count</code> rows in the
              second group, and so on; any leftover rows land in the last group. Add as many lines as you need.
            </label>
            <textarea
              id="field-team-groups-one-per-line-optional"
              rows={3}
              value={form.rosterGroupsText}
              onChange={(e) => set('rosterGroupsText', e.target.value)}
              placeholder={'Central Placement Team | 4\nUniversity Team (SVECW) | 3\nIndustry Liaison Officers | 4'}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-dept-coordinators-staging-optional">
              Department Coordinators (one per line, "Name | Department" — optional). Shown on the public site
              as a single "Department Coordinators" row inside each Team Group tile below its regular members —
              clicking it lists everyone's name and department. Which coordinators land in which group is set
              by Department Coordinator Groups below.
            </label>
            <textarea
              id="field-dept-coordinators-staging-optional"
              rows={6}
              value={form.deptCoordinatorsText}
              onChange={(e) => set('deptCoordinatorsText', e.target.value)}
              placeholder={'Dr. Jane Doe | CSE\nMr. John Smith | ECE'}
            />
            <div style={{ marginTop: '0.4rem' }}>
              <TableImportButton onImport={(text) => set('deptCoordinatorsText', text)} label="Import Department Coordinators from Excel/CSV" />
            </div>
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-dept-coordinator-groups-one-per-line-optional">
              Department Coordinator Groups (one per line, "Group Label | Count" — optional). Same format and
              labels as Team Groups above — assigns that many of Department Coordinators' rows (in order) to
              each Team Group. A group with no line here (or count 0) shows no Department Coordinators row.
            </label>
            <textarea
              id="field-dept-coordinator-groups-one-per-line-optional"
              rows={3}
              value={form.deptCoordinatorGroupsText}
              onChange={(e) => set('deptCoordinatorGroupsText', e.target.value)}
              placeholder={'Central Placement Team | 5\nTraining and Placement Team | 8\nIndustry Liaison Officers | 2'}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-emails-one-per-line-optional">Emails (one per line — optional)</label>
            <textarea id="field-emails-one-per-line-optional" rows={2} value={arrayToLines(form.emails)} onChange={(e) => set('emails', linesToArray(e.target.value))} placeholder="placements@srivishnu.edu.in" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-linkedins-one-per-line-optional">LinkedIn URLs (one per line — optional)</label>
            <textarea id="field-linkedins-one-per-line-optional" rows={2} value={arrayToLines(form.linkedins)} onChange={(e) => set('linkedins', linesToArray(e.target.value))} placeholder="https://www.linkedin.com/in/..." />
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
