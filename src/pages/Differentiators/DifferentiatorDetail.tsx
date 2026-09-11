import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Rocket, Factory, Microscope, Globe2, GraduationCap } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { CustomSectionsIntro, CustomSectionsGalleries, CustomSectionsAccordion, CustomSectionsPlain, CustomSectionsPills, SectionSubtree } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import CustomTabsPage, { type TabItem } from '../../components/CustomTabsPage/CustomTabsPage';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import { hasTabContent, type CustomTab } from '../../lib/customTabs';
import { DIFFERENTIATOR_CATEGORIES, type BlockKey } from '../Admin/sections/DifferentiatorsAdmin';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { FacultyDoc } from '../Academics/Faculty';
import { talentSprintWise } from './talentSprintWise.data';
import MedaPlmCoePage from './MedaPlmCoePage';
import VsacPage from './VsacPage';
import VehicleDesignLabPage from './VehicleDesignLabPage';
import DreamHouseLabPage from './DreamHouseLabPage';
import HpcLabPage from './HpcLabPage';
import IdeaLabPage from './IdeaLabPage';
import IicPage from './IicPage';
import '../detail-layout.css';





// All 9 tabs are fully admin-defined now. Team/Testimonial/ELITE-project/
// NSE-clipping photos used to be admin-uploaded per fixed hardcoded id
// (WiseTeamPhotosAdmin.tsx etc.) — those panels are retired along with this
// page's conversion; a "Photos" files section within the matching tab lets
// the admin re-add them, just without the old per-item fixed slot.
function WisePage({ tabs }: { tabs: CustomTab[] }) {
  const tabItems: TabItem[] = tabs.map((tab) => ({ id: tab.id, label: tab.label, content: tab.sectionsDisplay === 'pills' ? <CustomSectionsPills sections={tab.sections} /> : <CustomSectionsPlain sections={tab.sections} /> }));
  const defaultTabId = tabs.find(hasTabContent)?.id ?? tabItems[0]?.id;
  return <CustomTabsPage tabs={tabItems} defaultTabId={defaultTabId} />;
}







const CATEGORY_ICONS: Record<string, typeof Rocket> = {
  innovation: Rocket, industry: Factory, research: Microscope, global: Globe2, student: GraduationCap,
};

// Items saved before `description` existed still have their copy in the old
// `intro`/`about` fields (kept, deprecated, on DifferentiatorItemDoc) — build
// a throwaway CustomSection from those so the page never renders blank for
// an item that hasn't been re-saved from the new admin field yet.
function legacyDescriptionFromItem(item: DifferentiatorItemDoc): CustomSection {
  const text = (item.about || item.intro || item.desc || '').trim();
  return { id: 'description', label: 'Description', contentType: 'text', textContent: text };
}

// Same idea for the old fixed Key Highlights/Facilities/Outcomes/Partners
// fields — items not yet re-saved from the admin still have their content
// only there, not as Custom Sections, so synthesize the equivalent sections
// on every render (rather than requiring a migration step) and merge them in
// below whatever real Custom Sections the item already has.
function legacySectionsFromItem(item: DifferentiatorItemDoc): CustomSection[] {
  const specs: { id: string; label: string; values?: string[] }[] = [
    { id: 'highlights', label: 'Key Highlights', values: item.highlights },
    { id: 'facilities', label: 'Facilities & Equipment', values: item.facilities },
    { id: 'outcomes', label: 'Outcomes & Achievements', values: item.outcomes },
    { id: 'partners', label: 'Partners', values: item.partners },
  ];
  return specs
    .filter((s) => (s.values || []).filter(Boolean).length > 0)
    .map((s) => ({ id: s.id, label: s.label, contentType: 'list' as const, listText: (s.values || []).filter(Boolean).join('\n') }));
}

// Vision/Mission/Objectives are pre-existing named slots (their own field on
// DifferentiatorItemDoc, see DifferentiatorsAdmin.tsx) — only rendered when
// they actually have content, same as every other optional section here.
// Falls back to a same-id Custom Section for an item saved before these
// became fixed fields (when an admin had typed a "Vision" Custom Section by
// hand), so it still shows up here instead of looking blank.
function resolveBlock(item: DifferentiatorItemDoc, key: Exclude<BlockKey, 'description'>): CustomSection | null {
  const direct = item[key];
  if (direct && hasCustomSectionContent(direct)) return direct;
  const legacy = (item.customSections || []).find((s) => s.id === key);
  if (legacy && hasCustomSectionContent(legacy)) return legacy;
  return null;
}

export default function DifferentiatorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const { docs: rwtpReportLinkDocs } = useOrderedCollection<WithId & { label: string; fileUrl: string }>('rwtpReportLinks', 'order');
  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const item = allItems.find((i) => i.slug === slug) ?? null;
  const category = item ? DIFFERENTIATOR_CATEGORIES.find((c) => c.id === item.category) : null;

  useEffect(() => {
    if (item) {
      document.title = `${item.title} | Vishnu Women's University`;
    }
  }, [item]);

  // External items (TBI, VJOC, Vishnu Student Success Centre, Radio Vishnu,
  // School of Music, ...) have no internal detail page — the card grid and
  // nav dropdown already link straight to item.url, but if anyone still
  // lands on this internal route (a stale bookmark, an old indexed link, a
  // menu spot that wasn't updated to check `external`), send them on to the
  // actual external site rather than stranding them on the generic
  // Differentiators listing.
  useEffect(() => {
    if (item?.external && item.url) {
      window.location.replace(item.url);
    }
  }, [item]);

  if (!item || !category) {
    if (loading) {
      return (
        <RouteFallback />
      );
    }
    return <Navigate to="/differentiators" replace />;
  }

  if (item.external && item.url) {
    return <RouteFallback />;
  }

  const CategoryIcon = CATEGORY_ICONS[category.id] || Rocket;
  const faculty = item.department ? allFaculty.filter((f) => f.department === item.department) : [];
  // Real Custom Sections, plus (only for an item that has genuinely never
  // been through the new structure — `description` still unset) any legacy
  // Highlights/Facilities/Outcomes/Partners content synthesized from the
  // deprecated fields (see legacySectionsFromItem). That `alreadyMigrated`
  // check matters: those deprecated fields are deliberately never cleared,
  // so once an item HAS been migrated, re-merging them here on every render
  // would silently bring back a Custom Section an admin just deleted (its id
  // simply wouldn't be in `item.customSections` anymore, so the "already
  // present" de-dupe below wouldn't catch it). Vision/Mission/Objectives are
  // excluded here — they're their own fixed fields now (see introBlocks
  // below), rendered separately so they always lead, in a fixed order, ahead
  // of any other admin-added intro section.
  const alreadyMigrated = item.description !== undefined;
  const promotedBlockIds = new Set(['vision', 'mission', 'objectives']);
  const baseCustomSections = (item.customSections || []).filter((s) => !promotedBlockIds.has(s.id));
  const legacyMergedSections = alreadyMigrated ? [] : (() => {
    const existingIds = new Set(baseCustomSections.map((s) => s.id));
    return legacySectionsFromItem(item).filter((s) => !existingIds.has(s.id));
  })();
  const effectiveCustomSections = [...baseCustomSections, ...legacyMergedSections];
  // If the resolved description has no real content — never filled in, or
  // (a since-fixed bug) migrated from an item that had only a Short
  // Description and no old Intro/About text, leaving `description` written
  // as empty — fall back to the item's Short Description (`desc`) rather
  // than showing a blank page. Safe to do regardless of migration status,
  // unlike falling back to intro/about again: `desc` is still a live,
  // admin-editable field (the "Short Description" textarea), not a frozen
  // deprecated one, so this can never resurrect something an admin actually
  // deleted from Description.
  const resolvedDescription = alreadyMigrated ? item.description! : legacyDescriptionFromItem(item);
  const descriptionSection: CustomSection = hasCustomSectionContent(resolvedDescription)
    ? resolvedDescription
    : { id: 'description', label: 'Description', contentType: 'text', textContent: (item.desc || '').trim() };
  const introBlocks: CustomSection[] = (['vision', 'mission', 'objectives'] as const)
    .map((key) => resolveBlock(item, key))
    .filter((s): s is CustomSection => !!s)
    .map((s) => ({ ...s, placement: 'intro' as const }));
  const heroImage = item.heroImage || heroSlides[0]?.imageUrl;
  const wise = item.slug === 'talentsprint-wise' ? talentSprintWise : null;

  return (
    <main className="page-wrapper">
      {/* Hero — Department Hero Card Design */}
      <section className="dept-hero-section" style={(item.slug === 'meda-plm-coe' || item.slug === 'vsac' || item.slug === 'vehicle-design-lab' || item.slug === 'dream-house-lab' || item.slug === 'hpc-lab' || item.slug === 'aicte-idea-lab' || item.slug === 'institution-innovation-cell') ? { marginBottom: 0 } : undefined}>
        <div className="container">
          <div className="dept-hero-card">
            {heroImage && (
              <SmoothImage src={heroImage} alt={item.title} className="dept-hero-bg-img" loading="eager" decoding="sync" {...fetchPriorityAttr('high')} />
            )}
            <div className="dept-hero-overlay" />
            <div className="dept-hero-content">
              <div className="breadcrumb animate-fade-in" style={{ marginBottom: '0.8rem' }}>
                <Link to="/" className="breadcrumb-item">Home</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to="/differentiators" className="breadcrumb-item">Differentiators</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to={`/differentiators#${category.id}`} className="breadcrumb-item">{category.label}</Link>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-item active">{item.title}</span>
              </div>
              <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#C9973A', color: '#0B1E42', fontSize: 'var(--text-xs)', fontWeight: 800, padding: '0.35rem 0.9rem', borderRadius: '9999px', marginBottom: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <CategoryIcon size={14} /> {category.label}
              </div>
              <h1 className="dept-hero-title">{item.title}</h1>
              {/* Its own "Hero Subtitle" admin field — deliberately not the
                  same as the Short Description (hub-card blurb) or the
                  Description block further down the page. */}
              {item.summary && (
                <p className="dept-hero-subtitle">{item.summary}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview — Description/Vision/Mission/Objectives/Custom Sections,
          the same structure every non-external item has. Institution
          Innovation Cell, Vehicle Design Lab, TalentSprint – WISE, and AICTE
          Idea Lab (iic/vdl/wise/ideaLab) render this too, then ADDITIONALLY
          get their own dedicated tabbed page (IicPage/VdlPage/WisePage/
          IdeaLabPage) right below it — the two are no longer mutually
          exclusive. */}
      <section className={(item.slug === 'meda-plm-coe' || item.slug === 'vsac' || item.slug === 'vehicle-design-lab' || item.slug === 'dream-house-lab' || item.slug === 'hpc-lab' || item.slug === 'aicte-idea-lab' || item.slug === 'institution-innovation-cell') ? 'section-compact' : 'section bg-white'} style={(item.slug === 'meda-plm-coe' || item.slug === 'vsac' || item.slug === 'vehicle-design-lab' || item.slug === 'dream-house-lab' || item.slug === 'hpc-lab' || item.slug === 'aicte-idea-lab' || item.slug === 'institution-innovation-cell') ? { padding: 0 } : undefined}>
        <div className="container">
          {item.slug === 'meda-plm-coe' ? (
            <MedaPlmCoePage item={item} sections={effectiveCustomSections} />
          ) : item.slug === 'vsac' ? (
            <VsacPage item={item} sections={effectiveCustomSections} />
          ) : item.slug === 'vehicle-design-lab' ? (
            <VehicleDesignLabPage item={item} sections={effectiveCustomSections} />
          ) : item.slug === 'dream-house-lab' ? (
            <DreamHouseLabPage item={item} sections={effectiveCustomSections} />
          ) : item.slug === 'hpc-lab' ? (
            <HpcLabPage item={item} sections={effectiveCustomSections} />
          ) : item.slug === 'aicte-idea-lab' ? (
            <IdeaLabPage item={item} sections={effectiveCustomSections} />
          ) : item.slug === 'institution-innovation-cell' ? (
            <IicPage item={item} sections={effectiveCustomSections} />
          ) : (
            <div className="dept-about-main">
              <div className="dept-about-card">
                <SectionSubtree section={descriptionSection} />
              </div>

              <CustomSectionsIntro sections={[...introBlocks, ...effectiveCustomSections]} />
              <CustomSectionsGalleries sections={effectiveCustomSections} />
              <CustomSectionsAccordion sections={effectiveCustomSections} />
            </div>
          )}
        </div>
      </section>

      {/* Rural Women Tech Park's Report Links are admin-managed separately
          (Admin > Differentiators > Rural Women Tech Park > Report Links)
          — shown as their own labeled block here since a generic section
          has no way to know these specific entries are download links. */}
      {item.slug === 'rural-women-tech-park' && rwtpReportLinkDocs.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Report Links</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {rwtpReportLinkDocs.map((link) => (
                <a key={link.id} href={link.fileUrl} download style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Institution Innovation Cell now uses dedicated IicPage component above */}
      {/* {iic && <IicPage iic={iic} tabs={item.tabs || []} />} */}

      {/* Vehicle Design Lab now uses dedicated VehicleDesignLabPage component above */}
      {/* {vdl && <VdlPage tabs={item.tabs || []} />} */}

      {/* TalentSprint – WISE's own tabbed page (About WISE / Beneficiaries –
          Placements / and 7 more sections navigable from its sidebar). */}
      {wise && <WisePage tabs={item.tabs || []} />}

      {/* AICTE IDEA Lab now uses dedicated IdeaLabPage component above */}
      {/* {ideaLab && <IdeaLabPage tabs={item.tabs || []} />} */}

      {/* Faculty — shown only when this differentiator is linked to a
          teaching department (item.department). Reuses the Academics faculty
          grid + the shared `faculty` collection, so the roster is never
          re-entered here. No .reveal (Firestore-gated — see CLAUDE.md). */}
      {faculty.length > 0 && (
        <div id="faculty" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
          <FacultyCarousel faculty={faculty} title="Faculty" viewMoreLink="/faculty" />
        </div>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: (item.slug === 'meda-plm-coe' || item.slug === 'vsac' || item.slug === 'vehicle-design-lab' || item.slug === 'dream-house-lab' || item.slug === 'hpc-lab' || item.slug === 'aicte-idea-lab' || item.slug === 'institution-innovation-cell') ? 'var(--space-6) 0' : 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Explore More Differentiators
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto var(--space-6)' }}>
              Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/differentiators" className="btn btn-accent">All Differentiators</Link>
              <Link to="/apply-now" className="btn btn-secondary">Apply Now</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
