import { useState, type ComponentType } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { deleteFile } from '../../../lib/storage';
import AicteIdeaLabTeamAdmin from './AicteIdeaLabTeamAdmin';
import AicteIdeaLabAmbassadorsAdmin from './AicteIdeaLabAmbassadorsAdmin';
import AicteIdeaLabFacilityPhotosAdmin from './AicteIdeaLabFacilityPhotosAdmin';
import IicMemberPhotosAdmin from './IicMemberPhotosAdmin';
import IicDocumentsAdmin from './IicDocumentsAdmin';
import TedxPhotosAdmin from './TedxPhotosAdmin';
import TiDspGalleryPhotosAdmin from './TiDspGalleryPhotosAdmin';
import ChipsToStartupPhotosAdmin from './ChipsToStartupPhotosAdmin';
import VsacGalleryPhotosAdmin from './VsacGalleryPhotosAdmin';
import VdlFacilitiesPhotosAdmin from './VdlFacilitiesPhotosAdmin';
import VdlAchievementsAdmin from './VdlAchievementsAdmin';
import RwtpReportsAdmin from './RwtpReportsAdmin';
import AssistiveTechLabPhotosAdmin from './AssistiveTechLabPhotosAdmin';
import AtlActivityPdfsAdmin from './AtlActivityPdfsAdmin';
import ConcreteCanoePhotosAdmin from './ConcreteCanoePhotosAdmin';
import WiseTeamPhotosAdmin from './WiseTeamPhotosAdmin';
import WiseEliteProjectPhotosAdmin from './WiseEliteProjectPhotosAdmin';
import WiseTestimonialPhotosAdmin from './WiseTestimonialPhotosAdmin';
import WiseNseClippingsAdmin from './WiseNseClippingsAdmin';
import NirvahanaEventPhotosAdmin from './NirvahanaEventPhotosAdmin';

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
  'tedxsvecw': [{ key: 'photos', label: 'Photos', Component: TedxPhotosAdmin }],
  'ti-dsp-coe': [{ key: 'gallery-photos', label: 'Gallery Photos', Component: TiDspGalleryPhotosAdmin }],
  'chips-to-startup': [{ key: 'photos', label: 'Photos', Component: ChipsToStartupPhotosAdmin }],
  'vsac': [{ key: 'gallery-photos', label: 'Gallery Photos', Component: VsacGalleryPhotosAdmin }],
  'vehicle-design-lab': [
    { key: 'facilities-photos', label: 'Facilities Photos', Component: VdlFacilitiesPhotosAdmin },
    { key: 'achievement-reports', label: 'Achievement Reports', Component: VdlAchievementsAdmin },
  ],
  'rural-women-tech-park': [{ key: 'report-links', label: 'Report Links', Component: RwtpReportsAdmin }],
  'assistive-tech-lab': [
    { key: 'atl-photos', label: 'Photos', Component: AssistiveTechLabPhotosAdmin },
    { key: 'atl-activity-pdfs', label: 'Activity PDFs', Component: AtlActivityPdfsAdmin },
  ],
  'concrete-canoe-lab': [{ key: 'canoe-photos', label: 'Photos', Component: ConcreteCanoePhotosAdmin }],
  'talentsprint-wise': [
    { key: 'team-photos', label: 'Team Photos', Component: WiseTeamPhotosAdmin },
    { key: 'elite-photos', label: 'WISE-ELITE Project Photos', Component: WiseEliteProjectPhotosAdmin },
    { key: 'testimonial-photos', label: 'Testimonial Photos', Component: WiseTestimonialPhotosAdmin },
    { key: 'nse-clippings', label: 'NSE Clippings', Component: WiseNseClippingsAdmin },
  ],
  'nirvahana': [{ key: 'event-photos', label: 'Event Photos', Component: NirvahanaEventPhotosAdmin }],
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
  heroImage: string;
  heroStoragePath: string;
  order: number;
}

const EMPTY: Omit<DifferentiatorItemDoc, 'id'> = {
  slug: '', title: '', category: 'innovation', desc: '', external: false, url: '',
  highlights: [], intro: '', about: '', facilities: [], outcomes: [], partners: [],
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
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

export default function DifferentiatorsAdmin() {
  const { docs: items, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const [form, setForm] = useState<Omit<DifferentiatorItemDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [activeSubKey, setActiveSubKey] = useState<string | null>(null);

  const set = (k: string, v: string | number | string[] | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.slug || !form.title) return alert('Slug and title are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'differentiatorItems', editing), { ...form });
      } else {
        await addDoc(collection(db, 'differentiatorItems'), { ...form, order: form.order || items.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null); setActiveSubKey(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (it: DifferentiatorItemDoc) => {
    setEditing(it.id);
    setForm({
      slug: it.slug, title: it.title, category: it.category, desc: it.desc || '',
      external: !!it.external, url: it.url || '', highlights: it.highlights || [],
      intro: it.intro || '', about: it.about || '', facilities: it.facilities || [],
      outcomes: it.outcomes || [], partners: it.partners || [],
      heroImage: it.heroImage || '', heroStoragePath: it.heroStoragePath || '', order: it.order,
    });
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
