import { useRef, useState } from 'react';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { campusFacilities } from '../../Campus/campusFacilities.data';
import { DIFFERENTIATOR_CATEGORIES } from './DifferentiatorsAdmin';
import ItemHeroImagesAdmin from './ItemHeroImagesAdmin';
import { smoothScrollTo } from '../../../lib/smoothScroll';

const PROGRAM_CATEGORIES = [
  { value: 'btech', label: 'B.Tech' },
  { value: 'mtech', label: 'M.Tech' },
  { value: 'mba', label: 'MBA' },
  { value: 'phd', label: 'Ph.D.' },
];
const GOVERNANCE_CATEGORIES = [
  { value: 'governance', label: 'Governance' },
  { value: 'committees', label: 'Committees' },
  { value: 'iqac', label: 'IQAC' },
];
const RESEARCH_CATEGORIES = [
  { value: 'governance', label: 'R&D Governance' },
  { value: 'output', label: 'Research Output' },
  { value: 'engagement', label: 'Industry & Professional Engagement' },
];
const DIFFERENTIATOR_CATEGORY_OPTIONS = DIFFERENTIATOR_CATEGORIES.map((c) => ({ value: c.id, label: c.label }));

interface Banner {
  id: string;
  page: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  storagePath: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
}

const EMPTY: Omit<Banner, 'id'> = {
  page: 'home', title: '', subtitle: '', imageUrl: '', storagePath: '',
  ctaLabel: '', ctaLink: '', order: 0,
};

export const PAGES = [
  { value: 'home',                    label: 'Home' },
  { value: 'academics',               label: 'Academics' },
  { value: 'academics-curriculum',    label: 'Academics: Curriculum Matrix' },
  { value: 'academics-downloads',     label: 'Academics: Documents' },
  { value: 'faculty',                 label: 'Faculty' },
  { value: 'admissions',              label: 'Admissions' },
  { value: 'student-life',            label: 'Student Life' },
  { value: 'placements',              label: 'Placements' },
  { value: 'alumni-giving',           label: 'Alumni & Giving' },
  { value: 'about',                   label: 'About VWU' },
  { value: 'about-sves',              label: 'About SVES' },
  { value: 'campus',                  label: 'Campus' },
  ...campusFacilities.map((f) => ({ value: `campus-${f.slug}`, label: `Campus: ${f.title}` })),
  { value: 'information',             label: 'Information' },
  { value: 'governance',              label: 'Governance' },
  { value: 'governing-body',          label: 'Governing Body' },
  { value: 'governance-detail',       label: 'Governance Detail Pages (fallback — used when a Governance/Committees/IQAC item has no image of its own)' },
  { value: 'vision-mission',          label: 'Vision & Mission' },
  { value: 'news',                    label: 'News' },
  { value: 'events',                  label: 'Events' },
  { value: 'news-awards',             label: 'News & Awards' },
  { value: 'news-awards-happenings',  label: 'Happenings' },
  { value: 'news-awards-accreditations', label: 'Accreditations' },
  { value: 'news-awards-gallery',     label: 'Gallery' },
  { value: 'programmes-fee',          label: 'Programmes & Fee' },
  { value: 'admission-procedure',     label: 'Admission Procedure' },
  { value: 'result-analysis',         label: 'Result Analysis' },
  { value: 'differentiators',         label: 'Differentiators' },
  { value: 'research',                label: 'Research' },
  { value: 'student-clubs',           label: 'Student Clubs' },
  { value: 'arts-culture',            label: 'Arts & Culture' },
  { value: 'social-services',         label: 'Social Services' },
  { value: 'campus-magazines',        label: 'Campus Magazines' },
  { value: 'disclosures-ugc',         label: 'UGC Public Self-Disclosure' },
  { value: 'anti-ragging',            label: 'Anti Ragging' },
  { value: 'policies-procedures',     label: 'Policies & Procedures' },
  { value: 'sports-games',            label: 'Sports & Games' },
  { value: 'vishnu-tv',               label: 'Vishnu TV' },
  { value: 'careers',                 label: 'Careers' },
  { value: 'contact',                 label: 'Contact Us' },
  { value: 'program-detail',          label: 'Program Pages (fallback — only shows on programs with no image set in the Programs tab above)' },
  { value: 'placement-detail',        label: 'Placement Detail (fallback — used when a placement sub-page has no image of its own)' },
];

// Groups the flat PAGES list under headers for the page-selector grid, so an
// admin can scan for a page by "where does this live on the site?" instead
// of hunting through one long undifferentiated button list. Every PAGES
// value must appear in exactly one group here.
const PAGE_GROUPS: { label: string; values: string[] }[] = [
  { label: 'Main Pages', values: ['home', 'academics', 'admissions', 'student-life', 'placements', 'alumni-giving', 'about', 'information'] },
  { label: 'About, Society & Governance', values: ['about-sves', 'vision-mission', 'governance', 'governing-body', 'governance-detail'] },
  { label: 'Academics', values: ['academics-curriculum', 'academics-downloads', 'faculty', 'program-detail', 'programmes-fee', 'admission-procedure', 'result-analysis'] },
  { label: 'Student Life', values: ['student-clubs', 'arts-culture', 'social-services', 'sports-games', 'vishnu-tv', 'campus-magazines'] },
  { label: 'Placements, Careers & Research', values: ['placement-detail', 'careers', 'differentiators', 'research'] },
  { label: 'News & Awards', values: ['news', 'events', 'news-awards', 'news-awards-happenings', 'news-awards-accreditations', 'news-awards-gallery'] },
  { label: 'Campus', values: ['campus', ...campusFacilities.map((f) => `campus-${f.slug}`)] },
  { label: 'Compliance & Contact', values: ['disclosures-ugc', 'anti-ragging', 'policies-procedures', 'contact'] },
];

const FALLBACK_PAGES = new Set(['program-detail', 'governance-detail', 'placement-detail']);

function groupOfPage(pageValue: string): string | undefined {
  return PAGE_GROUPS.find((g) => g.values.includes(pageValue))?.label;
}

function PageBannersAdmin() {
  const { docs: banners, loading } = useOrderedCollection<Banner>('banners', 'order');
  const [form, setForm] = useState<Omit<Banner, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Drill-down: null = show only the category names; once one is picked,
  // both the page-choice buttons AND the banner list below narrow to it —
  // the "all ~60 pages at once" flat list was the messiest part of this
  // admin section before.
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageUploaded = (r: UploadResult) => {
    setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }));
  };

  const save = async () => {
    if (!form.title || !form.imageUrl) return alert('Title and image are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'banners', editing), { ...form });
      } else {
        await addDoc(collection(db, 'banners'), { ...form, createdAt: serverTimestamp() });
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (b: Banner) => {
    setEditing(b.id);
    setForm({
      page: b.page ?? 'home',
      title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl,
      storagePath: b.storagePath, ctaLabel: b.ctaLabel, ctaLink: b.ctaLink, order: b.order,
    });
    setSelectedGroup(groupOfPage(b.page ?? 'home') ?? null);
    // The banner list (below the form) covers every page's banners, so the
    // clicked one is often scrolled well past the form — without this the
    // edit looks like it did nothing.
    if (formRef.current) smoothScrollTo(formRef.current);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const pageLabel = (val: string) => PAGES.find((p) => p.value === val)?.label ?? val;
  const bannersForPage = (val: string) => banners.filter((b) => (b.page ?? 'home') === val).length;
  const bannersInGroup = (label: string) => {
    const group = PAGE_GROUPS.find((g) => g.label === label);
    if (!group) return 0;
    return banners.filter((b) => group.values.includes(b.page ?? 'home')).length;
  };
  const activeGroup = PAGE_GROUPS.find((g) => g.label === selectedGroup);

  return (
    <div className="admin-section">
      {/* Form */}
      <div className="admin-card" ref={formRef}>
        <h2 className="admin-card__title">{editing ? 'Edit Banner' : 'Add New Banner'}</h2>

        {/* Page selector — most important field, at the top. Drill-down:
            category names only until one is picked, then just that
            category's pages — not all ~60 pages at once. */}
        <div className="admin-page-selector">
          <p className="admin-page-selector__label">Which page is this banner for?</p>
          {!activeGroup ? (
            <div className="admin-page-selector__grid">
              {PAGE_GROUPS.map((group) => (
                <button
                  key={group.label}
                  type="button"
                  className="admin-page-btn"
                  onClick={() => setSelectedGroup(group.label)}
                >
                  {group.label} ({bannersInGroup(group.label)})
                </button>
              ))}
            </div>
          ) : (
            <>
              <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" style={{ marginBottom: '0.85rem' }} onClick={() => setSelectedGroup(null)}>
                ← All Categories
              </button>
              {form.page && bannersForPage(form.page) > 0 && (
                <p className="admin-field__hint" style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.55rem 0.85rem', marginBottom: '0.85rem' }}>
                  <strong>{pageLabel(form.page)}</strong> already has {bannersForPage(form.page)} banner{bannersForPage(form.page) > 1 ? 's' : ''}.
                  {!editing && ' Adding another here adds a slide to that page\'s rotation — it doesn\'t replace the existing one(s). Scroll down to "Banners in this category" if you meant to edit an existing one instead.'}
                </p>
              )}
              <p className="admin-page-selector__group-label">{activeGroup.label}</p>
              <div className="admin-page-selector__grid">
                {activeGroup.values.map((val) => {
                  const p = PAGES.find((pg) => pg.value === val);
                  if (!p) return null;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      className={`admin-page-btn${form.page === p.value ? ' active' : ''}${FALLBACK_PAGES.has(p.value) ? ' admin-page-btn--fallback' : ''}`}
                      onClick={() => set('page', p.value)}
                      title={p.label}
                    >
                      {FALLBACK_PAGES.has(p.value) ? p.label.split(' (')[0] : p.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="admin-form-grid" style={{ marginTop: '1.25rem' }}>
          <div className="admin-field admin-field--full">
            <label>Banner Image *</label>
            <ImageUploader
              folder={`vwu/banners/${form.page}`}
              currentUrl={form.imageUrl}
              onUploaded={handleImageUploaded}
              label="Upload Hero Image (recommended: 1920×600px)"
            />
          </div>
          <div className="admin-field">
            <label>Heading *</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. You Will Excel." />
          </div>
          <div className="admin-field">
            <label>Subheading</label>
            <input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)}
              placeholder="Supporting text shown below the heading" />
          </div>
          <div className="admin-field">
            <label>Button Label</label>
            <input value={form.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)}
              placeholder="e.g. Explore Programs" />
          </div>
          <div className="admin-field">
            <label>Button Link</label>
            <input value={form.ctaLink} onChange={(e) => set('ctaLink', e.target.value)}
              placeholder="/academics" />
          </div>
          <div className="admin-field">
            <label>Order (for carousel)</label>
            <input type="number" value={form.order}
              onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
        </div>

        <div className="admin-form-actions">
          {editing && (
            <button className="admin-btn admin-btn--ghost"
              onClick={() => { setEditing(null); setForm(EMPTY); }}>
              Cancel
            </button>
          )}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update Banner' : `Add to ${pageLabel(form.page)}`}
          </button>
        </div>
      </div>

      {/* List — narrows to the selected category above, same drill-down */}
      <div className="admin-card">
        {!activeGroup ? (
          <>
            <h2 className="admin-card__title">Banners ({banners.length} total)</h2>
            <p className="admin-empty">Pick a category above to see and edit its banners.</p>
          </>
        ) : loading ? (
          <p className="admin-loading">Loading…</p>
        ) : (
          <>
            <h2 className="admin-card__title">Banners in {activeGroup.label} ({banners.filter((b) => activeGroup.values.includes(b.page ?? 'home')).length})</h2>
            <div className="admin-image-grid">
              {banners.filter((b) => activeGroup.values.includes(b.page ?? 'home')).map((b) => (
                <div key={b.id} className="admin-image-card">
                  <img src={b.imageUrl} alt={b.title} />
                  <div className="admin-image-card__info">
                    <strong>{b.title}</strong>
                    <span className="admin-badge admin-badge--sm" style={{ marginTop: 4, alignSelf: 'flex-start' }}>
                      {pageLabel(b.page ?? 'home').split(' (')[0]}
                    </span>
                  </div>
                  <div className="admin-image-card__actions">
                    <button className="admin-btn admin-btn--sm" onClick={() => startEdit(b)}>Edit</button>
                    <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(b.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {banners.filter((b) => activeGroup.values.includes(b.page ?? 'home')).length === 0 && (
                <p className="admin-empty">No banners in this category yet. Add one above.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const TABS = [
  { id: 'pages',          label: 'Page Banners' },
  { id: 'programs',       label: 'Programs' },
  { id: 'governance',     label: 'Governance / Committees / IQAC' },
  { id: 'placements',     label: 'Placements' },
  { id: 'differentiators', label: 'Differentiators' },
  { id: 'research',       label: 'Research' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function BannersAdmin() {
  const [tab, setTab] = useState<TabId>('pages');

  return (
    <div>
      <p className="admin-lead" style={{ marginBottom: '1rem' }}>
        Every hero image on the site is managed from here — shared page banners on the "Page Banners"
        tab, and per-item images (which always take priority over a page's shared banner) on the
        other tabs. Nothing else in the admin has a separate hero image field anymore.
      </p>
      <div className="admin-page-selector" style={{ marginBottom: '1.25rem' }}>
        <div className="admin-page-selector__grid">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-page-btn${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'pages' && <PageBannersAdmin />}
      {tab === 'programs' && (
        <ItemHeroImagesAdmin
          collectionName="programs"
          orderByField="name"
          imageField="heroImage"
          storagePathField="storagePath"
          folder="vwu/programs"
          getLabel={(d) => (d.shortName as string) || (d.name as string)}
          getCategoryValue={(d) => d.category as string}
          categories={PROGRAM_CATEGORIES}
          emptyMessage="No programs yet — add one in the Programs admin section."
        />
      )}
      {tab === 'governance' && (
        <ItemHeroImagesAdmin
          collectionName="governanceItems"
          orderByField="order"
          imageField="heroImage"
          storagePathField="heroStoragePath"
          folder="vwu/governance-items"
          getLabel={(d) => d.title as string}
          getCategoryValue={(d) => d.category as string}
          categories={GOVERNANCE_CATEGORIES}
          getBannerPageOverride={(d) => (d.slug === 'governing-body' ? 'governing-body' : null)}
          emptyMessage="No governance items yet — add one in the Governance / Committees / IQAC admin section."
        />
      )}
      {tab === 'placements' && (
        <ItemHeroImagesAdmin
          collectionName="placementItems"
          orderByField="order"
          imageField="heroImage"
          storagePathField="heroStoragePath"
          folder="vwu/placement-items"
          getLabel={(d) => d.title as string}
          emptyMessage="No placement sub-pages yet — add one in the Placement Sub-pages admin section."
        />
      )}
      {tab === 'differentiators' && (
        <ItemHeroImagesAdmin
          collectionName="differentiatorItems"
          orderByField="order"
          imageField="heroImage"
          storagePathField="heroStoragePath"
          folder="vwu/differentiators"
          getLabel={(d) => d.title as string}
          getCategoryValue={(d) => d.category as string}
          categories={DIFFERENTIATOR_CATEGORY_OPTIONS}
          emptyMessage="No differentiator items yet — add one in the Differentiators admin section."
        />
      )}
      {tab === 'research' && (
        <ItemHeroImagesAdmin
          collectionName="researchItems"
          orderByField="order"
          imageField="heroImage"
          storagePathField="heroStoragePath"
          folder="vwu/research-items"
          getLabel={(d) => d.title as string}
          getCategoryValue={(d) => d.category as string}
          categories={RESEARCH_CATEGORIES}
          emptyMessage="No research items yet — add one in the Research admin section."
        />
      )}
    </div>
  );
}
