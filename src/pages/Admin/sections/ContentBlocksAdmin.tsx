import { useState, useMemo } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { useAdminSession } from '../AdminSessionContext';
import ReadOnlyGate from '../ReadOnlyGate';
import { canEdit, RESOURCES } from '../../../lib/rbac';

// A single flexible content type used across many pages for their small
// repeating text blocks (stat bars, icon+title+desc feature lists, highlight
// cards, simple bullet lists). "value" / "title" / "desc" are deliberately
// generic — each page's own rendering code decides what to do with them for
// a given `section` (e.g. render as a big-number stat, or an icon card).
// page + section together identify exactly one list on one page. "icon" and
// "slug" are optional — only some sections use them (icon for feature-card
// lists, slug for items with an in-page anchor link).
// "storagePath" is optional and only populated for sections whose "slug"
// holds an uploaded (rather than pasted) image, e.g. Home Testimonials —
// lets us clean up the old Firebase Storage file when it's replaced.
export interface ContentBlockDoc {
  id: string;
  page: string;
  section: string;
  value: string;
  title: string;
  desc: string;
  icon: string;
  slug: string;
  storagePath?: string;
  order: number;
}

const EMPTY: Omit<ContentBlockDoc, 'id'> = { page: '', section: '', value: '', title: '', desc: '', icon: '', slug: '', storagePath: '', order: 0 };

// Sections whose "slug" field is an uploaded avatar/photo rather than a
// pasted URL or anchor link — shows an ImageUploader instead of a text input.
const IMAGE_SLUG_SECTIONS = new Set(['home::testimonials']);

// Every (page, section) pair currently wired up to read from this
// collection. Add a new entry here first when wiring a new list.
export const CONTENT_BLOCK_SECTIONS: { page: string; section: string; label: string }[] = [
  { page: 'about', section: 'quickStats', label: 'About — Quick Stats' },
  { page: 'about', section: 'academicSnapshotStats', label: 'About — Academic Snapshot Stats' },
  { page: 'about', section: 'differentiators', label: 'About — Differentiators (use Value field for category name)' },
  { page: 'about', section: 'discoverCards', label: 'About — Discover Sub-pages' },
  { page: 'academics', section: 'quickStats', label: 'Academics — Quick Stats' },
  { page: 'academics', section: 'studentActivities', label: 'Academics — Student Activities Nav' },
  { page: 'academics', section: 'careerOutcomeStats', label: 'Academics — Career Outcome Stats' },
  { page: 'campus', section: 'stats', label: 'Campus — Stats Bar' },
  { page: 'information', section: 'ictPlatforms', label: 'Information — ICT Platforms' },
  { page: 'information', section: 'counsellingScheme', label: 'Information — Counselling Scheme' },
  { page: 'information', section: 'otherPractices', label: 'Information — Other Practices' },
  { page: 'campus', section: 'facilities', label: 'Campus — Facilities' },
  { page: 'governance', section: 'stats', label: 'Governance — Stats Bar' },
  { page: 'result-analysis', section: 'factors', label: 'Results Analysis — Success Factors' },
  { page: 'student-clubs', section: 'stats', label: 'Student Clubs — Stats Bar' },
  { page: 'student-life', section: 'clubs', label: 'Student Life — Clubs & Orgs' },
  { page: 'student-life', section: 'housing', label: 'Student Life — Housing' },
  { page: 'student-life', section: 'services', label: 'Student Life — Support Services' },
  { page: 'student-life', section: 'athletics', label: 'Student Life — Athletics/Sports' },
  { page: 'student-life', section: 'diningFeatures', label: 'Student Life — Dining Features' },
  { page: 'news-awards', section: 'highlights', label: 'News & Awards — Highlights' },
  { page: 'about-sves', section: 'stats', label: 'About SVES — Stats' },
  { page: 'about-sves', section: 'milestones', label: 'About SVES — Milestones' },
  { page: 'about-sves', section: 'legacy-vision', label: 'About SVES — Legacy Rooted in Vision (Value=Label, Title=Heading, Desc=Paragraph)' },
  { page: 'about-sves', section: 'leadership-culture', label: 'About SVES — Leadership & Culture (Value=Label, Title=Heading, Desc=Paragraph)' },
  { page: 'home', section: 'counters', label: 'Home — Key Statistics (animated counters)' },
  { page: 'home', section: 'recognitions', label: 'Home — Recognitions' },
  { page: 'home', section: 'campusFeatures', label: 'Home — Campus Features' },
  { page: 'home', section: 'testimonials', label: 'Home — Testimonials' },
  { page: 'home', section: 'studyCards', label: 'Home — Study at VWU Cards' },
  { page: 'home', section: 'whyChoose', label: 'Home — Why Choose VWU Cards (Slug field = link)' },
  // Home — Popular Programs Tags intentionally isn't here any more: that
  // strip now derives directly from /admin → Programs (each B.Tech/MBA
  // program becomes a tag automatically), so a separate manually-curated
  // list here would just silently go stale again. Add/edit programs
  // instead — see buildPopularProgramsFromPrograms in Home.tsx.
  { page: 'vision-mission', section: 'missionPoints', label: 'Vision & Mission — Mission Points' },
  { page: 'vision-mission', section: 'values', label: 'Vision & Mission — Core Values' },
  { page: 'vision-mission', section: 'qualityPolicy', label: 'Vision & Mission — Quality Policy' },
  { page: 'careers', section: 'perks', label: 'Careers — Perks' },
  { page: 'contact', section: 'infoCards', label: 'Contact — Info Cards (Campus/Email/HQ/Admissions)' },
  { page: 'contact', section: 'socialLinks', label: 'Contact — Social Media Links' },
  { page: 'admissions', section: 'tuitionData', label: 'Admissions — Tuition Summary Table' },
  { page: 'admissions', section: 'steps', label: 'Admissions — How to Apply Steps' },
  { page: 'admissions', section: 'admissionHub', label: 'Admissions — Hub Cards' },
  { page: 'admissions', section: 'visitOptions', label: 'Admissions — Campus Visit Options' },
  { page: 'campus-visit', section: 'video', label: 'Campus Visit — Virtual Tour Video (Value field = video embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID)' },
  { page: 'admission-procedure', section: 'stats', label: 'Admission Procedure — Stats' },
  { page: 'admission-procedure', section: 'btechSteps', label: 'Admission Procedure — B.Tech Steps' },
  { page: 'admission-procedure', section: 'mtechSteps', label: 'Admission Procedure — M.Tech Steps' },
  { page: 'admission-procedure', section: 'mbaSteps', label: 'Admission Procedure — MBA Steps' },
  { page: 'admission-procedure', section: 'documents', label: 'Admission Procedure — Documents Checklist' },
  { page: 'arts-culture', section: 'initiatives', label: 'Arts & Culture — Initiatives' },
  { page: 'arts-culture', section: 'events', label: 'Arts & Culture — Signature Events' },
  { page: 'social-services', section: 'communities', label: 'Social Services — Communities' },
  { page: 'social-services', section: 'values', label: 'Social Services — NSS Values' },
  { page: 'sports-games', section: 'facilities', label: 'Sports & Games — Facilities' },
  { page: 'sports-games', section: 'program', label: 'Sports & Games — Program Highlights' },
  { page: 'sports-games', section: 'achievements', label: 'Sports & Games — Achievements' },
  { page: 'vishnu-tv', section: 'focusAreas', label: 'Vishnu TV — Focus Areas' },
  { page: 'vishnu-tv', section: 'docTopics', label: 'Vishnu TV — Documentary Topics' },
  { page: 'vishnu-tv', section: 'productions', label: 'Vishnu TV — Productions' },
  { page: 'central-library', section: 'digitalLibrary', label: 'Central Library — Digital Library Links (Slug field = URL)' },
  { page: 'central-library', section: 'eDatabasesEbooks', label: 'Central Library — e-Databases: E-Books (Slug field = optional URL)' },
  { page: 'central-library', section: 'eDatabasesOpenAccessJournals', label: 'Central Library — e-Databases: Open Access Online Journals/Magazines (Slug field = optional URL)' },
  { page: 'central-library', section: 'eDatabasesVideoOnDemand', label: 'Central Library — e-Databases: Video On Demand (Slug field = optional URL)' },
  { page: 'central-library', section: 'eDatabasesOpenCourseware', label: 'Central Library — e-Databases: Open Courseware (Slug field = optional URL)' },
  { page: 'placements', section: 'stats', label: 'Placements — Stats Bar' },
];

export default function ContentBlocksAdmin() {
  const session = useAdminSession();
  const { docs: blocks, loading } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const [form, setForm] = useState<Omit<ContentBlockDoc, 'id'>>({ ...EMPTY, page: CONTENT_BLOCK_SECTIONS[0].page, section: CONTENT_BLOCK_SECTIONS[0].section });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterKey, setFilterKey] = useState(`${CONTENT_BLOCK_SECTIONS[0].page}::${CONTENT_BLOCK_SECTIONS[0].section}`);
  // This screen covers page-content blocks for the whole site, not just
  // Placements, so — like Hero Banners — permission is scoped per item
  // rather than to the section as a whole.
  const formEditable = canEdit(session, RESOURCES.PLACEMENTS_PAGE_CONTENT, form.page === 'placements')
    || canEdit(session, RESOURCES.PLACEMENTS_BLOCKS, form.page === 'placements');

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));
  const handleAvatarUpload = (r: UploadResult) => setForm((p) => ({ ...p, slug: r.url, storagePath: r.path }));
  const filtered = useMemo(() => {
    const [page, section] = filterKey.split('::');
    return blocks.filter((b) => b.page === page && b.section === section);
  }, [blocks, filterKey]);

  const save = async () => {
    if (!form.page || !form.section || !form.title) return alert('Page, section, and title are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'contentBlocks', editing), { ...form });
      } else {
        await addDoc(collection(db, 'contentBlocks'), { ...form, order: form.order || filtered.length + 1, createdAt: serverTimestamp() });
      }
      setForm({ ...EMPTY, page: form.page, section: form.section }); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (b: ContentBlockDoc) => {
    setEditing(b.id);
    setForm({ page: b.page, section: b.section, value: b.value, title: b.title, desc: b.desc, icon: b.icon || '', slug: b.slug || '', storagePath: b.storagePath || '', order: b.order });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Item' : 'Add Item'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Used for small repeating content across many pages — stat bars, feature lists, highlights. Pick which
          page/section this item belongs to; fields not needed for that section (e.g. "Value") can be left blank.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="field-page-section">Page / Section *</label>
            <select id="field-page-section" value={`${form.page}::${form.section}`} onChange={(e) => {
              const [page, section] = e.target.value.split('::');
              setForm((p) => ({ ...p, page, section }));
            }}>
              {CONTENT_BLOCK_SECTIONS.map((s) => (
                <option key={`${s.page}::${s.section}`} value={`${s.page}::${s.section}`}>{s.label}</option>
              ))}
            </select>
          </div>
          {/* display:contents on ReadOnlyGate's fieldset means these fields
              stay direct children of this grid — wrapping them here doesn't
              change the grid layout at all, only whether they're disabled. */}
          <ReadOnlyGate readOnly={!formEditable}>
            <div className="admin-field">
              <label htmlFor="field-value-number-short-value-if">Value (number/short value if a stat; a URL for Social Links; a meta line like a phone number for Contact Info Cards)</label>
              <input id="field-value-number-short-value-if" value={form.value} onChange={(e) => set('value', e.target.value)} placeholder="100 Acres" />
            </div>
            <div className="admin-field">
              <label htmlFor="field-icon-if-this-section-uses">Icon (if this section uses icon cards)</label>
              <select id="field-icon-if-this-section-uses" value={form.icon} onChange={(e) => set('icon', e.target.value)}>
                <option value="">None</option>
                {CONTENT_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="admin-field">
              {IMAGE_SLUG_SECTIONS.has(`${form.page}::${form.section}`) ? (
                <>
                  <label>Avatar Photo</label>
                  <ImageUploader folder="vwu/testimonials" currentUrl={form.slug} onUploaded={handleAvatarUpload} label="Upload Avatar" aspect={1} />
                </>
              ) : (
                <>
                  <label>Anchor Slug / Extra field (only if this item needs a #link — a second meta line for Contact Info Cards, or the click-through link for Student Life Clubs — an external https:// URL or an internal /path)</label>
                  <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="smart-classrooms" />
                </>
              )}
            </div>
            <div className="admin-field">
              <label htmlFor="field-display-order">Display Order</label>
              <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="field-title">Title *</label>
              <input id="field-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Campus Area" />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="field-description-if-this-item-needs">Description (if this item needs one — for Contact Info Cards, put each address line on its own line)</label>
              <textarea id="field-description-if-this-item-needs" rows={3} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Optional longer text…" />
            </div>
          </ReadOnlyGate>
        </div>
        <ReadOnlyGate readOnly={!formEditable}>
          <div className="admin-form-actions">
            {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm({ ...EMPTY, page: form.page, section: form.section }); }}>Cancel</button>}
            <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Item'}</button>
          </div>
        </ReadOnlyGate>
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Items ({filtered.length})</h2>
          <select value={filterKey} onChange={(e) => setFilterKey(e.target.value)} className="admin-select-sm">
            {CONTENT_BLOCK_SECTIONS.map((s) => (
              <option key={`${s.page}::${s.section}`} value={`${s.page}::${s.section}`}>{s.label}</option>
            ))}
          </select>
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Value</th><th>Title</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>{b.order}</td>
                    <td>{b.value || '—'}</td>
                    <td>{b.title}</td>
                    <td>
                      <ReadOnlyGate readOnly={
                        !canEdit(session, RESOURCES.PLACEMENTS_PAGE_CONTENT, b.page === 'placements')
                        && !canEdit(session, RESOURCES.PLACEMENTS_BLOCKS, b.page === 'placements')
                      }>
                        <button className="admin-btn admin-btn--sm" onClick={() => startEdit(b)}>Edit</button>
                        <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(b.id)}>Delete</button>
                      </ReadOnlyGate>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={4} className="admin-empty">No items for this section yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
