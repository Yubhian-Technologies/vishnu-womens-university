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
import { useAdminSession } from '../AdminSessionContext';
import ReadOnlyGate from '../ReadOnlyGate';
import { canEdit, RESOURCES } from '../../../lib/rbac';

// Hero Banners covers every page on the site from one screen, so unlike a
// wholly-Placements section, permission here is scoped per banner: only
// banners for the Placements hub page and its sub-page fallback are a
// Placements resource — every other page's banner stays read-only for a
// department account.
const PLACEMENTS_BANNER_PAGES = new Set(['placements', 'placement-detail']);

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
  { value: 'campus',                  label: 'Campus Life (Overview)' },
  ...campusFacilities.map((f) => ({ value: `campus-${f.slug}`, label: `Campus Life: ${f.title}` })),
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
  { value: 'differentiators-detail',  label: 'Differentiators Detail Pages (fallback — used when a differentiator item has no image of its own)' },
  { value: 'research',                label: 'Research' },
  { value: 'research-detail',         label: 'Research Detail Pages (fallback — used when a research item has no image of its own)' },
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
  { label: 'Placements, Careers & Research', values: ['placement-detail', 'careers', 'differentiators', 'differentiators-detail', 'research', 'research-detail'] },
  { label: 'News & Awards', values: ['news', 'events', 'news-awards', 'news-awards-happenings', 'news-awards-accreditations', 'news-awards-gallery'] },
  { label: 'Campus Life', values: ['campus', ...campusFacilities.map((f) => `campus-${f.slug}`)] },
  { label: 'Compliance & Contact', values: ['disclosures-ugc', 'anti-ragging', 'policies-procedures', 'contact'] },
];

const FALLBACK_PAGES = new Set(['program-detail', 'governance-detail', 'placement-detail', 'differentiators-detail', 'research-detail']);

// The heading/subtitle each page currently shows by default (the
// `defaultTitle`/`defaultSubtitle` props passed to that page's <PageHero>,
// or the facility's own title/heroSubtitle for Campus Life pages) — used to
// prefill the form below so an admin adding a page's first banner starts
// from the text already live on the site instead of a blank field they'd
// otherwise have to retype from scratch. Once a page has a real banner,
// this default text stops showing on the site at all (PageHero swaps to
// the uploaded banner's own title/subtitle entirely) — so it only matters
// for that first banner. Pages with no single "current" text of their own
// (home's rotating marketing slides, and the "-detail" fallbacks shared by
// many different items with their own titles) are intentionally omitted.
const PAGE_TEXT_DEFAULTS: Record<string, { title: string; subtitle?: string }> = {
  'about': { title: "About Vishnu Women's University", subtitle: "Rooted in Bhimavaram since 2001, VWU has grown into Andhra Pradesh's foremost institution for women's technical education." },
  'anti-ragging': { title: 'Anti Ragging', subtitle: "Vishnu Women's University is committed to a safe, ragging-free campus for every student." },
  'alumni-giving': { title: 'Always a Vishnu Engineer', subtitle: 'Graduation is not the end of your VWU story. Stay engaged, give back, and help shape the next generation of women engineers.' },
  'admissions': { title: 'Your Journey Starts Here', subtitle: 'Choosing VWU sets you on a path to a fulfilling engineering career, a strong professional network, and a future built on real achievement.' },
  'disclosures-ugc': { title: 'UGC Public Self-Disclosure', subtitle: 'Shri Vishnu Engineering College for Women (Autonomous) — published as required by the University Grants Commission.' },
  'result-analysis': { title: 'Result Analysis', subtitle: 'VWU consistently ranks among the top 5 affiliated colleges of JNTU Kakinada with 90%+ annual pass rates.' },
  'about-sves': { title: 'Sri Vishnu Educational Society', subtitle: 'More than 25 years of educational commitment, spanning 11 institutions across Andhra Pradesh and Telangana.' },
  'admission-procedure': { title: 'Admission Procedure', subtitle: 'A clear, step-by-step guide to joining VWU — covering eligibility, entrance examinations, and the enrollment process for all programmes.' },
  'careers': { title: 'Careers at VWU', subtitle: 'Build your career alongside a community of educators and professionals who are genuinely invested in advancing women in engineering and technology.' },
  'vision-mission': { title: 'Vision, Mission & Values', subtitle: "The principles, purpose, and commitments that inform every decision and action at Vishnu Women's University." },
  'events': { title: 'Campus Events', subtitle: 'Technical symposia, sports tournaments, graduation ceremonies, and much more — the VWU calendar is always full.' },
  'academics': { title: 'You Will Excel.', subtitle: 'Rigorous, industry-aligned programs designed to build your technical expertise, sharpen your research instincts, and develop you as a professional.' },
  'faculty': { title: 'Our Faculty', subtitle: 'Experienced educators and researchers across every department, dedicated to academic excellence and student success.' },
  'academics-downloads': { title: 'Academic Documents', subtitle: 'Official academic documents — calendar and regulations — available for download.' },
  'programmes-fee': { title: 'Programmes & Fee Structure', subtitle: 'Complete list of programs, intake capacities, and annual fee structure for AY 2025–26.' },
  'student-life': { title: 'Discover Your Place at VWU', subtitle: 'VWU offers more than an engineering qualification. It is where you find your community, sharpen your purpose, and start building your future.' },
  'differentiators': { title: 'What Sets VWU Apart', subtitle: 'Distinctive initiatives in innovation, industry engagement, research, international outreach, and student development — all aimed at producing well-rounded women engineers.' },
  'governing-body': { title: 'Governing Body', subtitle: 'Dedicated leaders and distinguished members committed to academic excellence, institutional governance, innovation, and the continuous growth of Shri Vishnu Engineering College for Women.' },
  'academics-curriculum': { title: 'Course Curriculum', subtitle: 'Semester-wise curriculum documents for every programme and regulation.' },
  'governance': { title: 'Governance & Statutory Bodies', subtitle: 'Transparent, accountable governance driving academic excellence — from apex statutory bodies to quality assurance committees.' },
  'placements': { title: 'Placements & Careers', subtitle: 'Linking VWU graduates with the best opportunities in industry — through campus recruitment, career development, and pathways to global study.' },
  'campus-magazines': { title: 'Campus Magazines', subtitle: 'Three publications that document academic achievements, student creativity, and the story of campus life at VWU and across SVES.' },
  'arts-culture': { title: 'Arts & Culture', subtitle: 'Nurturing creativity, preserving heritage, and building a sense of belonging — developing responsible and culturally grounded leaders.' },
  'vishnu-tv': { title: 'Vishnu TV Academy', subtitle: 'Student-run and student-driven — the only dedicated campus TV Academy in Andhra Pradesh.' },
  'social-services': { title: 'Social Services', subtitle: 'The National Service Scheme at VWU shapes engineers who are equally committed to their craft and to the communities they serve.' },
  'student-clubs': { title: 'Student Clubs', subtitle: '23 active clubs across technology, social service, arts, and culture — VWU has a community for every interest.' },
  'sports-games': { title: 'Sports & Games', subtitle: 'Physical fitness is taken seriously at VWU — a sound body supports a sound mind, and both are essential to a complete education.' },
  'policies-procedures': { title: 'Policies & Procedures', subtitle: 'A structured framework for governance, academics, research, and campus sustainability at VWU.' },
  'research': { title: 'Research & Development', subtitle: 'From funded projects and patents to industry MoUs and professional bodies — a look at how VWU builds knowledge that matters.' },
  'news-awards-accreditations': { title: 'Accreditations & Awards', subtitle: "Endorsed by India's foremost regulatory and ranking bodies — a record of recognised quality and consistent academic achievement." },
  'information': { title: 'Information', subtitle: 'Academic calendar, holidays, how to reach us, counselling, ICT platforms, and more.' },
  'news-awards': { title: 'News & Awards', subtitle: "Celebrating VWU's achievements, events, and milestones — from national accreditations and rankings to campus happenings and visual memories." },
  'campus': { title: 'Campus Life at VWU', subtitle: 'A 100-acre campus in Bhimavaram where learning, wellness, and community life come together.' },
  'news-awards-happenings': { title: 'Happenings at VWU', subtitle: 'Workshops, MoUs, competitions, achievements, and institutional milestones — a running record of life at VWU.' },
  'news-awards-gallery': { title: 'Gallery', subtitle: 'A visual archive of campus life at VWU — from national competitions and graduation days to cultural festivals and industry events.' },
  'news': { title: 'VWU News & Stories', subtitle: 'Stay up-to-date with the latest happenings, achievements, and stories from the VWU community.' },
  'contact': { title: 'Contact Us', subtitle: "We're happy to assist. Contact us for admissions information, general enquiries, or anything else on your mind." },
  ...Object.fromEntries(
    campusFacilities.map((f) => [`campus-${f.slug}`, { title: f.title, subtitle: f.heroSubtitle ?? f.desc }])
  ),
};

function groupOfPage(pageValue: string): string | undefined {
  return PAGE_GROUPS.find((g) => g.values.includes(pageValue))?.label;
}

function PageBannersAdmin() {
  const session = useAdminSession();
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

  // Switching the page selector keeps Heading/Subheading in sync with that
  // page's current live text — every click, not just the first — as long as
  // the field is still showing either nothing or the previously-selected
  // page's own default (i.e. the admin hasn't typed something custom yet).
  // The moment they edit away from that, further page clicks leave their
  // text alone instead of silently discarding it. Never fires while editing
  // an existing banner, which already has its own saved title/subtitle.
  const selectPage = (value: string) => {
    setForm((p) => {
      const prevDefaults = PAGE_TEXT_DEFAULTS[p.page];
      const defaults = PAGE_TEXT_DEFAULTS[value];
      const titleUntouched = p.title === EMPTY.title || p.title === prevDefaults?.title;
      const subtitleUntouched = p.subtitle === EMPTY.subtitle || p.subtitle === prevDefaults?.subtitle;
      return {
        ...p,
        page: value,
        title: !editing && titleUntouched ? (defaults?.title ?? EMPTY.title) : p.title,
        subtitle: !editing && subtitleUntouched ? (defaults?.subtitle ?? EMPTY.subtitle) : p.subtitle,
      };
    });
  };

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

  const formEditable = canEdit(session, RESOURCES.PLACEMENTS_HERO_BANNERS, PLACEMENTS_BANNER_PAGES.has(form.page));
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
              {!editing && form.page && PAGE_TEXT_DEFAULTS[form.page] && form.title === PAGE_TEXT_DEFAULTS[form.page].title && (
                <p className="admin-field__hint" style={{ background: '#eefbf0', border: '1px solid #bfe8c9', borderRadius: 6, padding: '0.55rem 0.85rem', marginBottom: '0.85rem' }}>
                  Heading/Subheading below are prefilled with the text currently live on this page — edit them, or leave as-is.
                </p>
              )}
              {!editing && form.page && FALLBACK_PAGES.has(form.page) && (
                <p className="admin-field__hint" style={{ background: '#fff8e6', border: '1px solid #f0dca0', borderRadius: 6, padding: '0.55rem 0.85rem', marginBottom: '0.85rem' }}>
                  This is a shared fallback image for sub-pages without their own photo — its Heading/Subheading text isn't shown on the site (each sub-page keeps its own title), so any short label works.
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
                      onClick={() => selectPage(p.value)}
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

        <ReadOnlyGate readOnly={!formEditable}>
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
        </ReadOnlyGate>
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
                  <ReadOnlyGate readOnly={!canEdit(session, RESOURCES.PLACEMENTS_HERO_BANNERS, PLACEMENTS_BANNER_PAGES.has(b.page ?? 'home'))}>
                    <div className="admin-image-card__actions">
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(b)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(b.id)}>Delete</button>
                    </div>
                  </ReadOnlyGate>
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
  const session = useAdminSession();
  const [tab, setTab] = useState<TabId>('pages');
  // Only the "Placements" tab (per-item hero images for placement sub-pages)
  // is a Placements resource — the other item-hero tabs (Programs,
  // Governance, Differentiators, Research) belong to no department yet.
  const placementsTabEditable = canEdit(session, RESOURCES.PLACEMENTS_HERO_BANNERS);
  const otherTabsEditable = !!session?.isAdmin;

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
        <ReadOnlyGate readOnly={!otherTabsEditable}>
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
        </ReadOnlyGate>
      )}
      {tab === 'governance' && (
        <ReadOnlyGate readOnly={!otherTabsEditable}>
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
        </ReadOnlyGate>
      )}
      {tab === 'placements' && (
        <ReadOnlyGate readOnly={!placementsTabEditable}>
        <ItemHeroImagesAdmin
          collectionName="placementItems"
          orderByField="order"
          imageField="heroImage"
          storagePathField="heroStoragePath"
          folder="vwu/placement-items"
          getLabel={(d) => d.title as string}
          emptyMessage="No placement sub-pages yet — add one in the Placement Sub-pages admin section."
        />
        </ReadOnlyGate>
      )}
      {tab === 'differentiators' && (
        <ReadOnlyGate readOnly={!otherTabsEditable}>
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
        </ReadOnlyGate>
      )}
      {tab === 'research' && (
        <ReadOnlyGate readOnly={!otherTabsEditable}>
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
        </ReadOnlyGate>
      )}
    </div>
  );
}
