import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Check, Microscope, Sparkles, FileText, BookOpen, GraduationCap, Award, Calendar, Users, ChevronDown, ArrowRight } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import ProgrammeStructure from '../../components/ProgrammeStructure/ProgrammeStructure';
import NewsEventsTabs, { type NewsEventsCategory } from '../../components/NewsEventsTabs/NewsEventsTabs';
import SEO from '../../components/SEO/SEO';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import LabsCarousel from '../../components/LabsCarousel/LabsCarousel';
import { PARTNER_DOMAINS, PARTNER_LOGO_OVERRIDES } from '../../components/TieUpMoUS/TieUpMoUSSection';
import SuccessStoriesCarousel, { type SuccessStoryCardData } from '../../components/SuccessStoriesCarousel/SuccessStoriesCarousel';
import TestimonialMarquee, { type PlacementItem } from '../../components/ui/marquee-01';
import { useOrderedCollection, useCollection, type WithId } from '../../hooks/useCollection';
import { useEapcetCode } from '../../hooks/useContentBlocks';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { getProgramSchema, getBreadcrumbSchema } from '../../lib/seo/schemas';
import type { DepartmentGroup } from '../../lib/departmentGroups';
import { normalizeLab, normalizeMindMapImages, type ProgramDoc, type NewsEventsYear } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { ResearchStat, ResearchSlide } from '../Admin/sections/DepartmentsAdmin';
import type { MousPartnerLogoDoc } from '../Admin/sections/MousPartnerLogosAdmin';
import type { FacultyDoc } from './Faculty';
import { parseFlexibleTable, parseProjectAccordion } from '../../lib/structuredTable';
import { resolveRndYears, rndYearHasContent } from '../../components/RndSection/RndSection';
import { sortPlacementRows, computePlacementStats, findPackageColumnIndex, findCompanyColumnIndex, formatPackageCell } from '../../lib/placementRecords';
import { computeInternshipStats, findPeriodColumnIndex } from '../../lib/internshipRecords';
import { getDeptBatchStats, findDeptBatchStatsForYearLabel } from '../../lib/departmentPlacementBridge';
import { usePlacementYears } from '../Placements/usePlacementYears';
import { hasCustomSectionContent } from '../../lib/customSections';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { getDepartmentTagline } from '../../lib/departmentTaglines';
import '../detail-layout.css';
import '../Campus/tabbed-section.css';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

// Every section id the quick-nav scroll-spy might need to observe — a
// superset of whatever `quickLinks` ends up rendering for a given
// department (see the scroll-spy effect below for why this is a static
// list rather than reading `quickLinks` directly).
const ALL_QUICK_NAV_SECTION_IDS = ['about', 'vision-mission', 'placements', 'success-stories', 'rankings', 'labs', 'tieups-mous', 'program-toggle', 'rnd', 'hod', 'faculty', 'news-events', 'testimonials', 'faq'];

// Resolves a plain admin-entered company/institution name (e.g. from
// dept.placementRecruiters or dept.tieUpsMous) to a real logo. Priority:
// an admin-uploaded logo from Admin → Recruiter Logos (same global
// collection/keyed-by-name Home page's "Our Recruiters" marquee and
// Placements' "Recruiting Partners" already use — see RecruitersSection.tsx),
// then the known-domain favicon map, then a plain text tile.
function RecruiterTile({ name, uploadedUrl, showName }: { name: string; uploadedUrl?: string; showName?: boolean }) {
  const [failed, setFailed] = useState(false);
  const domain = PARTNER_DOMAINS[name];
  const imgSrc = uploadedUrl || PARTNER_LOGO_OVERRIDES[name] || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '');

  if (!imgSrc || failed) {
    return (
      <div className="dept-recruiter-tile dept-recruiter-tile--fallback">
        <span>{name}</span>
      </div>
    );
  }
  return (
    <div className={`dept-recruiter-tile${showName ? ' dept-recruiter-tile--named' : ''}`}>
      <img src={imgSrc} alt={name} loading="lazy" onError={() => setFailed(true)} />
      {showName && <span className="dept-recruiter-tile-name">{name}</span>}
    </div>
  );
}

interface Props {
  group: DepartmentGroup;
  /** The currently-selected program slug (drives the toggle). */
  activeSlug: string;
}

// A placement year label like "2022–2026" -> "2026" for the snapshot
// heading — the graduating year reads more naturally there than the full
// 4-year range. Already-bare years (or labels with no 4-digit year at all)
// pass through unchanged.
function endingYear(label: string): string {
  const years = label.match(/\d{4}/g);
  return years ? years[years.length - 1] : label;
}

interface ProfileListItem {
  id: string;
  label: string;
  value: string | number;
  image?: string;
}

// Shared by every list in the "Department Profile" section below
// (Establishments / Programme Intake / Accreditation) — each of those is an
// admin-entered per-programme array that can hold any number of entries, so
// none of them can assume a fixed count. The first `threshold` entries
// render directly; anything past that collapses behind a "View all" toggle
// (reusing SmoothCollapse, the same expand/collapse primitive Header/
// NewsEventsTabs already use) instead of a fixed-height card grid that
// would either overflow or need per-department layout tweaks as more
// programmes/accreditations get added.
function ExpandableGroup({ items, renderItem, threshold = 4 }: {
  items: ProfileListItem[];
  renderItem: (item: ProfileListItem) => ReactNode;
  threshold?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = items.slice(0, threshold);
  const rest = items.slice(threshold);
  return (
    <>
      {visible.map(renderItem)}
      {rest.length > 0 && (
        <SmoothCollapse open={expanded}>
          <>{rest.map(renderItem)}</>
        </SmoothCollapse>
      )}
      {rest.length > 0 && (
        <button
          type="button"
          className="dept-profile-viewmore"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `View all ${items.length}`}
          <ChevronDown size={14} strokeWidth={2.4} className={`dept-profile-viewmore-icon${expanded ? ' is-open' : ''}`} />
        </button>
      )}
    </>
  );
}


// ─── Research & Innovation Section ───────────────────────────────────────────
// Mirrors the LPU-style "Pioneers of research & innovation" template. Reads
// ONLY this department's own admin-entered `researchStats`/`researchSlides`
// (Admin → Academic Departments → Research & Innovation) — no mock/
// placeholder content; renders nothing at all when a department has neither,
// same as every other data-gated section on this page.
function ResearchSection({
  deptName,
  heroImage,
  stats = [],
  slides = [],
}: {
  deptName: string;
  heroImage: string;
  stats?: ResearchStat[];
  slides?: ResearchSlide[];
}) {
  const [slide, setSlide] = useState(0);
  const total = slides.length;
  const prev = () => setSlide((s) => (s - 1 + total) % total);
  const next = () => setSlide((s) => (s + 1) % total);

  // Reset active slide index when slide list changes (admin update)
  useEffect(() => { setSlide(0); }, [total]);

  // Auto-advance every 4.5 s — nothing to advance through with 0 or 1 slide.
  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  if (stats.length === 0 && slides.length === 0) return null;

  const current = total > 0 ? slides[Math.min(slide, total - 1)] : null;
  const slideImg = current?.imageUrl || heroImage;

  return (
    <section className="section dept-research-section" aria-labelledby="research-heading">
      <div className="container">
        {/* ── Header row ── */}
        <div className="dept-research-header-row">
          <h2 className="section-title dept-research-heading" id="research-heading">
            <span className="dept-research-heading-light">Pioneers of<br /></span>
            <span className="dept-research-heading-bold">Research &amp; Innovation</span>
          </h2>
          <a
            href="/research"
            className="dept-research-circle-btn"
            aria-label="Go to research page"
          >
            <span>Research</span>
          </a>
        </div>

        {/* ── Body: stats left + slider right ── */}
        <div className="dept-research-layout">

          {/* Left — 2×2 stat cards */}
          {stats.length > 0 && (
          <div className="dept-research-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="dept-research-stat-card">
                <div className="dept-research-stat-count">
                  <span className="dept-research-stat-value">{s.value.replace('+', '')}</span>
                  <span className="dept-research-stat-plus">+</span>
                </div>
                <p className="dept-research-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
          )}

          {/* Right — photo + dark caption carousel */}
          {current && (
          <div className="dept-research-slider-wrap">
            {/* Arrow buttons */}
            <div className="dept-research-arrows">
              <button
                type="button"
                onClick={prev}
                className="dept-research-arrow"
                aria-label="Previous research slide"
              >
                <ArrowRight size={18} strokeWidth={2.5} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <button
                type="button"
                onClick={next}
                className="dept-research-arrow"
                aria-label="Next research slide"
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Slide */}
            <div className="dept-research-slide" key={slide}>
              {/* Photo */}
              <div className="dept-research-slide-photo">
                {slideImg ? (
                  <img src={slideImg} alt={`${deptName} research — ${current.title}`} className="dept-research-slide-img" />
                ) : (
                  <div className="dept-research-slide-placeholder">
                    <Microscope size={64} strokeWidth={1} style={{ color: '#94a3b8' }} />
                  </div>
                )}
              </div>

              {/* Caption overlay */}
              <div className="dept-research-slide-caption">
                <h3 className="dept-research-slide-title">{current.title}</h3>
                <p className="dept-research-slide-desc">{current.desc}</p>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="dept-research-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlide(i)}
                  className={`dept-research-dot${i === slide ? ' active' : ''}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          )}

        </div>
      </div>
    </section>
  );
}

/**
 * The shared page for a "grouped" department (AI / CSE / ECE). The top half is
 * common content read from the department's `departments` doc (matched by
 * `shortCode`); below the program toggle, the per-program half is read from
 * the selected program's `programs` doc. The toggle just navigates between
 * /academics/<slugA> and /academics/<slugB> — the active side is derived
 * purely from the URL, so deep links and the back button work for free.
 */

export default function DepartmentDetail({ group, activeSlug }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [outcomeTab, setOutcomeTab] = useState<string | null>(null);
  // Which Academic Year's placement records are shown — falls back to the
  // active programme's first available year (see placementYears below).
  const [placementYear, setPlacementYear] = useState<string | null>(null);
  // Which Academic Year's internship records are shown — same pattern as
  // the Placements pair above.
  const [internshipYear, setInternshipYear] = useState<string | null>(null);
  // Which Academic Year's Research & Development content is shown — same
  // pattern as Placements/Internships above.
  const [rndYear, setRndYear] = useState<string | null>(null);
  // Company / minimum-package filters for the Placement records below —
  // admin uploads whatever columns a year's sheet has, so the company list
  // is derived live from that year's actual rows rather than any fixed
  // list, and resets itself whenever the Academic Year (and so the
  // available companies) changes since a stale selection wouldn't match
  // anything.
  const [placementCompanyFilter, setPlacementCompanyFilter] = useState('');
  const [placementMinPackage, setPlacementMinPackage] = useState(0);
  useEffect(() => { setPlacementCompanyFilter(''); }, [placementYear]);
  // Placements/Internships now share one "Careers" section — this picks
  // which half shows when a programme has both (no tab bar at all when it
  // only has one).
  const [careerTab, setCareerTab] = useState<'placements' | 'internships'>('placements');
  const [activeHubTab, setActiveHubTab] = useState<'overview' | 'curriculum' | 'outcomes' | 'newsletter' | 'rnd'>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  // Auto-advance timer for the Testimonials carousel below — declared here
  // (unconditionally, before the loading/redirect early-returns further
  // down) so the hook itself is always called on every render. The actual
  // testimonial count isn't known until testimonialItems is computed
  // later (after those early-returns), so it's threaded through via a ref
  // instead of a dependency array, updated by a plain assignment where the
  // real value is available — see testimonialCountRef.current below.
  const testimonialCountRef = useRef(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((i) => {
        const count = testimonialCountRef.current;
        return count > 1 ? (i + 1) % count : i;
      });
    }, 5500);
    return () => clearInterval(timer);
  }, []);
  const [openRndProjects, setOpenRndProjects] = useState<Set<string>>(new Set());
  const toggleRndProject = (key: string) => {
    setOpenRndProjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const { docs: allDepartments, loading: deptLoading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const dept = allDepartments.find(
    (d) => d.shortCode?.trim().toUpperCase() === group.deptShortCode.trim().toUpperCase()
  );
  const faqs = dept?.faqs || [];
  // Admin-uploaded recruiter/tie-up logos (Admin → Recruiter Logos), keyed
  // by exact name — see RecruiterTile above.
  const { docs: recruiterLogoDocs } = useCollection<WithId & { imageUrl: string }>('recruiterLogos', [], { silent: true });
  const recruiterLogoMap = new Map(recruiterLogoDocs.map((d) => [d.id.toLowerCase(), d.imageUrl]));
  // The same partner logos already uploaded on the Research > MoUs page
  // (Admin → Research Items → MoUs → Partner Logos, collection
  // `mousPartnerLogos`), matched by exact Partner Name — same convention
  // ResearchDetail.tsx uses to attach these logos to the MoUs table. Takes
  // priority over the generic Recruiter Logos map below so a name added as
  // an official MoU partner shows its real uploaded logo here too, instead
  // of falling through to a favicon guess.
  const { docs: mousPartnerLogoDocs } = useOrderedCollection<MousPartnerLogoDoc>('mousPartnerLogos', 'order');
  const mousPartnerLogoMap = new Map(mousPartnerLogoDocs.map((d) => [d.label.trim().toLowerCase(), d.imageUrl]));

  const { docs: allPrograms, loading: progLoading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const subPrograms = group.programSlugs
    .map((s) => allPrograms.find((p) => p.slug?.toLowerCase() === s.toLowerCase()))
    .filter((p): p is ProgramDoc => !!p);
  const activeProgram = subPrograms.find((p) => p.slug?.toLowerCase() === activeSlug.toLowerCase()) || subPrograms[0];

  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const deptKeys = new Set<string>(group.facultyDepartments);
  subPrograms.forEach((p) => { if (p.department) deptKeys.add(p.department); });
  if (dept) { deptKeys.add(dept.title); deptKeys.add(dept.shortCode); }
  const faculty = allFaculty.filter((f) => f.department && deptKeys.has(f.department));

  const eapcetCode = useEapcetCode();
  // Hoisted above the loading/redirect guards below (same reasoning as the
  // scroll-spy effect further down) — a hook must run on every render in
  // the same order, and progLoading/deptLoading resolving asynchronously
  // means some renders take an early return and some don't.
  const mainPlacementYears = usePlacementYears();

  const deptName = dept?.title || activeProgram?.department || group.deptShortCode;

  useEffect(() => {
    document.title = `${deptName} | Vishnu Women's University`;
  }, [deptName]);

  // Re-scroll on navigation that carries a hash, only if the section is not already visible.
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) {
      const rect = el.getBoundingClientRect();
      // If the target element is already visible within the top portion of the screen, avoid scroll jump
      if (rect.top >= -100 && rect.top <= window.innerHeight * 0.5) {
        return;
      }
      smoothScrollTo(el);
    }
  }, [location.key, location.hash, activeSlug, progLoading]);

  // Defaults the PEOs/POs/PSOs tab bar to whichever of the three actually
  // has admin-entered content for the active programme, once loaded.
  useEffect(() => {
    const firstAvailable = activeProgram?.peos?.length ? 'peos' : activeProgram?.wks?.length ? 'wks' : activeProgram?.pos?.length ? 'pos' : activeProgram?.psos?.length ? 'psos' : null;
    if (firstAvailable) setOutcomeTab((prev) => prev ?? firstAvailable);
  }, [activeProgram?.peos?.length, activeProgram?.pos?.length, activeProgram?.psos?.length, activeProgram?.wks?.length]);

  // Quick-nav scroll-spy. Declared here (before the loading/redirect guards
  // below) so this hook always runs in the same order on every render — it
  // used to live further down next to `quickLinks`, but `quickLinks` isn't
  // computed until after those guards, and a render that takes one of the
  // early returns skips every hook declared after it. Since `progLoading`/
  // `deptLoading` resolve asynchronously (Firestore listeners), some renders
  // took the guard and some didn't, so the hook count differed between
  // renders and React threw "Rendered more hooks than during the previous
  // render." Observing a fixed list of every possible section id (instead of
  // the dynamic, post-guard `quickLinks`) sidesteps that: sections that
  // don't apply to a given department simply aren't in the DOM, and
  // `document.getElementById` already no-ops for those below.
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        // When multiple sections briefly overlap the observation band at
        // once, pick whichever is closest to its top edge instead of just
        // whichever intersection event happened to fire last — otherwise
        // the pill bar can highlight a section that isn't actually the one
        // nearest the top of the screen.
        const nearest = visible.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b
        );
        setActiveSectionId(nearest.target.id);
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 }
    );

    ALL_QUICK_NAV_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [progLoading, deptLoading, activeProgram?.slug]);

  if (progLoading && subPrograms.length === 0) {
    return (
      <RouteFallback />
    );
  }
  if (!progLoading && !activeProgram && subPrograms.length === 0) return <Navigate to="/academics" replace />;
  // Also wait on the department lookup: rendering before it resolves would
  // show the short code (activeProgram.department / group.deptShortCode)
  // as the page title/H1 and then flash to the full department title once
  // `allDepartments` loads (e.g. "AI" -> "Artificial Intelligence").
  if (!activeProgram || deptLoading) {
    return (
      <RouteFallback />
    );
  }

  // Shared department content shown above the program toggle. The `departments`
  // doc wins whenever an admin has filled a field in (/admin -> Academic
  // Departments); every empty field falls back to the first sub-program's own
  // value, since the two programs in a group already share this content. That
  // way the shared sections appear out of the box, with no data re-entry.
  const primary = subPrograms[0];
  const clean = (v?: string) => (v && v !== '—' ? v : '');
  const shared = {
    overviewImage: dept?.heroImage || '',
    pageHeroImage: primary?.heroImage || activeProgram.heroImage || '',
    // Department-only — never falls back to a programme's own About, which
    // now shows per-programme in the toggle section instead (see
    // "About the Programme" below). `description` is the same card blurb
    // shown on the Academics page, reused here so this works with no extra
    // data entry; the "Overview" field on the department admin overrides it.
    about: dept?.about || dept?.description || '',
    // Department-only — no per-programme fallback (unlike most fields
    // above, a programme's own Highlights covers a different, more
    // specific thing — see "Programme Highlights" further down — so there's
    // nothing sensible to fall back to here).
    tagline: getDepartmentTagline(dept?.shortCode || group.deptShortCode || activeSlug, dept?.tagline),
    highlights: dept?.highlights || [],
    established: clean(dept?.established) || clean(primary?.established),
    accreditation: clean(dept?.accreditation) || clean(primary?.accreditation),
    hod: dept?.hod || primary?.hod || '',
    hodImage: dept?.hodImage || primary?.hodImage || '',
    hodEmail: dept?.hodEmail || primary?.hodEmail || '',
    hodMessage: dept?.hodMessage || primary?.hodMessage || '',
    hodResearchProfiles: (dept?.hodResearchProfiles?.length ? dept.hodResearchProfiles : primary?.hodResearchProfiles) || [],
    vision: dept?.vision || primary?.vision || '',
    mission: (dept?.mission?.length ? dept.mission : primary?.mission) || [],
    coreValues: (dept?.coreValues?.length ? dept.coreValues : primary?.coreValues) || [],
    // Laboratories are the department's, not any one programme's — AI&ML
    // and AI&DS share the same labs, so this is department-first, same as
    // Vision/Mission/Values/Library above (no per-programme editing exists
    // for this anymore; see ProgramsAdmin/DepartmentsAdmin). Falls back to
    // whichever sub-program still carries its own legacy labs data if the
    // department doc hasn't had it copied over yet (see DepartmentsAdmin's
    // "Copy from Programs" action). normalizeLab() upgrades either shape
    // (plain string or {name, pdfUrl}) so this page never cares which
    // source it came from.
    labs: (
      dept?.labs?.length ? dept.labs
        : subPrograms.map((p) => p.labs).find((arr) => arr && arr.length > 0) || []
    ).map(normalizeLab),
    libraryIntro: dept?.libraryIntro || primary?.libraryIntro || '',
    libraryInCharge: dept?.libraryInCharge || primary?.libraryInCharge || '',
    librarySections: (dept?.librarySections?.length ? dept.librarySections : primary?.librarySections) || [],
    // Placements — department-only, shared across all of its programmes.
    placementIntro: dept?.placementIntro || '',
    placementStats: dept?.placementStats || [],
    placementRecruiters: dept?.placementRecruiters || [],
    tieUpsMous: dept?.tieUpsMous || [],
  };

  const hasHod = !!(shared.hodMessage || shared.hodImage || shared.hodEmail || shared.hod);
  const hasCoreValues = shared.coreValues.length > 0;
  const hasLabs = shared.labs.length > 0;
  const hasAbout = !!shared.about;
  const hasDeptHighlights = shared.highlights.length > 0;
  // Individual student Placement Records — admin-imported from Excel/CSV per
  // Academic Year (see PlacementYearsEditor in ProgramsAdmin.tsx). That editor
  // saves to the department's own doc, so the department's dataset wins for
  // whichever programme the toggle above has active, with a per-program
  // fallback for older entries. Falls back to the first available year
  // whenever nothing's been explicitly picked yet, or the previously-picked
  // year doesn't exist for whichever programme is active.
  // Sorted latest-first regardless of the order admin entries were added in
  // (Firestore array order == insertion order, not chronological) — same
  // convention usePlacementYears.ts already uses for the master dataset.
  const placementYears = [...(dept?.placementYears?.length ? dept.placementYears : (activeProgram.placementYears || []))].sort((a, b) => (b.year || '').localeCompare(a.year || ''));
  const activePlacementYear = placementYears.find((y) => y.year === placementYear) ?? placementYears[0];
  const placementColumns = activePlacementYear?.columns || [];
  const placementRows = placementColumns.length > 0 && activePlacementYear
    ? sortPlacementRows(placementColumns, activePlacementYear.rows || [])
    : [];
  // Displays the package/CTC column as a plain LPA figure ("45" instead of
  // an imported raw rupee value like "45,00,000") — same column detection
  // computePlacementStats already uses for the stat tiles.
  const placementPkgIdx = findPackageColumnIndex(placementColumns);
  const placementYearStats = activePlacementYear ? computePlacementStats(placementColumns, activePlacementYear.rows || []) : null;
  const placementNameIdx = placementColumns.findIndex((c) => /name|student|candidate/i.test(c));
  const placementCompIdx = findCompanyColumnIndex(placementColumns);
  const placementCompanyOptions = Array.from(new Set(
    placementRows.map((r) => (placementCompIdx >= 0 ? r.cells[placementCompIdx] : '')?.trim()).filter(Boolean)
  )).sort();
  const filteredPlacementRows = placementRows.filter((row) => {
    if (placementCompanyFilter && row.cells[placementCompIdx]?.trim() !== placementCompanyFilter) return false;
    if (placementMinPackage > 0) {
      const pkgNum = parseFloat(formatPackageCell(placementPkgIdx >= 0 ? (row.cells[placementPkgIdx] || '') : ''));
      if (!(pkgNum >= placementMinPackage)) return false;
    }
    return true;
  });
  const placementMarqueeItems: PlacementItem[] = filteredPlacementRows.map((row) => {
    const rawName = placementNameIdx >= 0 ? row.cells[placementNameIdx] : (row.cells[1] || row.cells[0]);
    const rawComp = placementCompIdx >= 0 ? row.cells[placementCompIdx] : '';
    const rawPkg = placementPkgIdx >= 0 ? formatPackageCell(row.cells[placementPkgIdx] ?? '') : '';
    return {
      name: rawName?.trim() || 'Student Graduate',
      company: rawComp?.trim() || 'Top Recruiter',
      package: rawPkg?.trim() || 'Placed',
    };
  });
  // Success Stories carousel — reads ONLY this department's own
  // admin-entered `successStories` field (Admin → Academic Departments →
  // Success Stories) — no auto-generated placement-derived fallback and no
  // mock content. Renders nothing until an admin adds real entries.
  const successStoryItems: SuccessStoryCardData[] = (dept?.successStories || []).map((s, i) => ({
    id: `story-${i}`,
    name: s.name,
    programme: s.programme,
    description: s.description,
    photoUrl: s.photoUrl,
  }));
  // "What Our Students Say" testimonials — a SEPARATE admin-entered field
  // (`dept.testimonials`, Admin → Academic Departments → Testimonials),
  // deliberately not shared with Success Stories above so the two sections
  // never show identical content. One big card at a time, auto-advancing;
  // vertical dot rail lets a visitor jump to any testimonial directly. The
  // auto-advance hook itself lives earlier (before the loading/redirect
  // early-returns) — this just keeps its ref in sync with the real count
  // once it's known.
  const testimonialItems: SuccessStoryCardData[] = (dept?.testimonials || []).map((s, i) => ({
    id: `testimonial-${i}`,
    name: s.name,
    programme: s.programme,
    description: s.description,
    photoUrl: s.photoUrl,
  }));
  const testimonialCount = Math.min(testimonialItems.length, 6);
  testimonialCountRef.current = testimonialCount;
  // Institution-wide "Placements" module figures for this department (see
  // departmentPlacementBridge.ts) — an independent, separately-maintained
  // dataset from the department's own uploaded placementYears above, kept
  // visible here (rather than hidden) so a visitor never sees "no data" for
  // a batch the institution has actually published a figure for, and so
  // the two numbers can be cross-checked against each other.
  const deptShortCodeForPlacements = dept?.shortCode || group.deptShortCode;
  const staticDeptBatches = getDeptBatchStats(deptShortCodeForPlacements, mainPlacementYears);
  const activeStaticBatch = activePlacementYear
    ? findDeptBatchStatsForYearLabel(deptShortCodeForPlacements, activePlacementYear.year, mainPlacementYears)
    : null;
  // The department's own uploaded sheet (placementYearStats.totalOffers) is
  // the authoritative count for the "Total No. of Offers" tile whenever it
  // exists — it's the actual, complete row count of what an admin imported
  // for this Academic Year. The institution-wide module's figure only fills
  // in when the department hasn't uploaded its own records at all for this
  // year (placementYearStats is null), so a visitor still never sees "no
  // data" for a batch the institution has published a figure for.
  const displayedTotalOffers = placementYearStats?.totalOffers ?? activeStaticBatch?.offers ?? 0;
  const hasPlacements = !!(shared.placementIntro || shared.placementStats.length > 0 || shared.placementRecruiters.length > 0 || placementYears.length > 0 || staticDeptBatches.length > 0);

  // Individual student Internship Records — same shape/pattern as the
  // Placement Records above (see InternshipYearsEditor in ProgramsAdmin.tsx),
  // just for internships instead of placements.
  const internshipYears = dept?.internshipYears?.length ? dept.internshipYears : (activeProgram.internshipYears || []);
  const activeInternshipYear = internshipYears.find((y) => y.year === internshipYear) ?? internshipYears[0];
  const internshipColumns = activeInternshipYear?.columns || [];
  const internshipRows = internshipColumns.length > 0 && activeInternshipYear ? activeInternshipYear.rows || [] : [];
  const internshipPeriodIdx = findPeriodColumnIndex(internshipColumns);
  const internshipYearStats = activeInternshipYear ? computeInternshipStats(internshipColumns, activeInternshipYear.rows || []) : null;
  const hasInternships = internshipYears.length > 0;

  const internshipNameIdx = internshipColumns.findIndex((c) => /name|student|candidate/i.test(c));
  const internshipCompIdx = internshipColumns.findIndex((c) => /company|organization|employer|recruiter/i.test(c));
  const internshipMarqueeItems: PlacementItem[] = internshipRows.map((row) => {
    const rawName = internshipNameIdx >= 0 ? row.cells[internshipNameIdx] : (row.cells[1] || row.cells[0]);
    const rawComp = internshipCompIdx >= 0 ? row.cells[internshipCompIdx] : (row.cells[2] || 'Leading Organization');
    const rawPeriod = internshipPeriodIdx >= 0 ? row.cells[internshipPeriodIdx] : '';
    return {
      name: rawName?.trim() || 'Student Scholar',
      company: rawComp?.trim() || 'Top Organization',
      package: rawPeriod?.trim() || 'Internship',
    };
  });

  const hasHighlights = !!(activeProgram.highlights && activeProgram.highlights.length > 0);
  // Tabbed PEOs / POs / PSOs — only whichever of the three an admin has
  // actually filled in (via /admin → Programs) becomes a tab.
  const outcomeGroups = [
    { key: 'peos', short: 'PEOs', title: 'Programme Educational Objectives (PEOs)', items: activeProgram.peos },
    { key: 'wks', short: 'WKs', title: 'Knowledge Profile (WKs)', items: activeProgram.wks },
    { key: 'pos', short: 'POs', title: 'Programme Outcomes (POs)', items: activeProgram.pos },
    { key: 'psos', short: 'PSOs', title: 'Programme Specific Outcomes (PSOs)', items: activeProgram.psos },
  ].filter((g) => g.items && g.items.length > 0);
  const hasOutcomeStatements = outcomeGroups.length > 0;
  const activeOutcome = outcomeGroups.find((g) => g.key === outcomeTab) ?? outcomeGroups[0];
  // Legacy docs may still store a single mindMapImage — normalizeMindMapImages()
  // upgrades either shape to the gallery array so this page never has to care.
  const mindMapImages = normalizeMindMapImages(activeProgram);
  const hasMindMap = mindMapImages.length > 0 || !!activeProgram.mindMapPdfUrl;
  // Section heading + sidebar label list only whichever of PEOs/POs/PSOs/WKs
  // this programme actually has content for (e.g. "PEOs, POs & PSOs" when
  // there's no WKs data yet), instead of a fixed "...& WKs" that would claim
  // content the programme doesn't have.
  const outcomeShortLabels = outcomeGroups.map((g) => g.short);
  const outcomeHeading = outcomeShortLabels.length > 1
    ? `${outcomeShortLabels.slice(0, -1).join(', ')} & ${outcomeShortLabels[outcomeShortLabels.length - 1]}`
    : outcomeShortLabels[0] || '';
  // News & Events on the grouped department page is department-wide, not
  // per-toggle-side — read from the department doc, same as Vision/Labs/
  // Library. The "News & Events" heading itself is fixed (see
  // NewsEventsSubtree below); what's under it is a dynamic, admin-defined
  // list of named sections (dept.newsEventsSections — any number, any
  // content type, e.g. "Student Awards", "Others", or anything else — see
  // DepartmentsAdmin.tsx). A department that hasn't been opened in Admin
  // since that switchover falls back to the old fixed News & Events /
  // Student Awards / Others arrays instead, rendered the same way they
  // always were, so nothing already published goes blank. Independent of
  // the plain departmentNews collection cards ("News & Events — This
  // Programme", rendered by <DepartmentNewsSection> below) — either, both,
  // or neither can be present.
  const newsEventsSubSections = (dept?.newsEventsSections || []).filter(hasCustomSectionContent);
  const hasNewsEventsDynamic = newsEventsSubSections.length > 0;
  const validYears = (arr?: NewsEventsYear[]) =>
    (arr || []).filter((y) => y.year && ((y.columns?.length > 0 && y.rows?.length > 0) || (y.cards?.length ?? 0) > 0 || !!y.text));

  let newsEventsCategories: NewsEventsCategory[] = [];

  if (hasNewsEventsDynamic) {
    newsEventsCategories = newsEventsSubSections.map((sec) => ({
      key: sec.id,
      label: sec.label,
      // Every section/sub-section renders generically (SectionSubtree) below
      // regardless of its contentType — table, text, image cards, files,
      // checklist, links, photo gallery, person, contacts, or any mix of
      // those via further nesting. No content type is special-cased or
      // filtered out here.
      years: (() => {
          // A section can have its own content AND sub-sections at once —
          // both must show, not just one or the other.
          const ownOnly = { ...sec, subSections: undefined };
          const out: NewsEventsYear[] = [];
          if (hasCustomSectionContent(ownOnly)) {
            out.push({ year: sec.label.replace(/^Academic Year\s*(::|:|-)?\s*/i, '').trim() || sec.label, columns: [], rows: [], section: ownOnly });
          }
          (sec.subSections || []).filter(hasCustomSectionContent).forEach((sub) => {
            out.push({ year: sub.label.replace(/^Academic Year\s*(::|:|-)?\s*/i, '').trim() || sub.label, columns: [], rows: [], section: sub });
          });
          return out;
        })(),
    })).filter((c) => c.years.length > 0);
  } else {
    newsEventsCategories = [
      { key: 'news', label: 'Happenings', years: validYears(dept?.newsEventsYears?.length ? dept.newsEventsYears : subPrograms.map((p) => p.newsEventsYears).find((arr) => arr && arr.length > 0)) },
      { key: 'awards', label: 'Student Awards', years: validYears(dept?.studentAwardsYears) },
      { key: 'others', label: 'Others', years: validYears(dept?.othersYears) },
    ].filter((c) => c.years.length > 0);
  }

  const hasNewsEvents = newsEventsCategories.length > 0;
  const newsletterYears = (dept?.newsletterYears?.length ? dept.newsletterYears : (activeProgram.newsletterYears || [])).filter((y) => y.year && y.issues && y.issues.length > 0);
  const hasNewsletter = newsletterYears.length > 0;
  const newsletterMaxIssues = Math.max(0, ...newsletterYears.map((y) => y.issues.length));
  // Research & Development (Funded Projects & Patents) — organized by
  // Academic Year (same pattern as Placements/Internships/Newsletter
  // above); resolveRndYears() also covers a department/programme still on
  // the old flat (pre-Academic-Year) shape by wrapping it as a single
  // unlabeled year, so nothing already entered is lost.
  const rndFallbackProgram = subPrograms.find((p) => p.rndIntro || p.rndTableText || p.rndProjectsText || p.rndLinks?.length || p.rndStructuredTable);
  const rndYearsResolved = resolveRndYears(dept, rndFallbackProgram).filter(rndYearHasContent);
  const activeRndYear = rndYearsResolved.find((y) => y.year === rndYear) ?? rndYearsResolved[0];
  const rndLabeledYears = rndYearsResolved.filter((y) => y.year);
  const rndLinks = (activeRndYear?.links || []).filter((l) => l.label && l.pdfUrl);
  const rndTableSections = parseFlexibleTable(activeRndYear?.tableText || '').filter((s) => s.headers.length > 0);
  const rndProjectCategories = parseProjectAccordion(activeRndYear?.projectsText || '').filter((c) => c.projects.length > 0);
  const rndStructuredColumns = activeRndYear?.structuredTable?.columns || [];
  const rndStructuredRows = activeRndYear?.structuredTable?.rows || [];
  const hasRndStructuredTable = rndStructuredColumns.length > 0 && rndStructuredRows.length > 0;
  const hasRnd = rndYearsResolved.length > 0;
  // Deliberately program-level only, not dept.customSections — a grouped
  // department's Custom Sections editor is gated off in DepartmentsAdmin.tsx
  // (Custom Sections live on the linked programme(s) instead; only a
  // standalone department with no programme uses dept.customSections
  // directly — see StandaloneDepartmentDetail.tsx). News & Events is the
  // one dept-level exception — see newsEventsSubSections below.
  const visibleCustomSections = (activeProgram.customSections || []).filter(hasCustomSectionContent);

  // "Placements" quick link doubles as the Internships entry (Internships
  // has no quick link of its own — it renders directly below Placements on
  // the page) — its label reads "Placements & Internships" once this
  // programme has both, "Internships" alone if only internship records
  // exist yet, and plain "Placements" otherwise, so the sidebar reflects
  // exactly what's actually been uploaded rather than always assuming both.
  const placementsLinkLabel = placementYears.length > 0 && hasInternships
    ? 'Placements & Internships'
    : hasInternships && placementYears.length === 0 ? 'Internships' : 'Placements';

  // Quick Links — one anchor per major section rather than every
  // sub-section (e.g. "Choose a Programme" covers About the Programme /
  // Highlights / PEOs,POs&PSOs / Mind Map / Curriculum, which still render
  // below the toggle for whichever programme is active — they just don't
  // each get their own pill). The pill bar wraps to a second row on
  // narrower screens instead of clipping or hiding overflow (see
  // .dept-horizontal-quicknav-pill's flex-wrap), so adding more entries
  // here is always safe.
  const quickLinks = [
    hasAbout && { id: 'about', label: 'Overview' },
    hasCoreValues && { id: 'vision-mission', label: 'Core Values' },
    (hasPlacements || hasInternships) && { id: 'placements', label: placementsLinkLabel },
    { id: 'rankings', label: 'Department Profile' },
    hasLabs && { id: 'labs', label: 'Facilities' },
    shared.tieUpsMous.length > 0 && { id: 'tieups-mous', label: "Tie-Ups & MoU's" },
    subPrograms.length > 0 && { id: 'program-toggle', label: 'Programmes' },
    hasHod && { id: 'hod', label: 'HOD' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    hasNewsEvents && { id: 'news-events', label: 'Events' },
    faqs.length > 0 && { id: 'faq', label: 'FAQs' },
  ].filter(Boolean) as { id: string; label: string }[];

  const pageHeroImage = shared.pageHeroImage;
  const overviewImage = shared.overviewImage || pageHeroImage;
  const pageUrl = `/academics/${activeProgram.slug}`;
  const pageDesc = shared.about
    ? (shared.about.length > 155 ? `${shared.about.slice(0, 155)}...` : shared.about)
    : `The Department of ${deptName} at Vishnu Women's University, Bhimavaram.`;

  const jsonLd = [
    getProgramSchema({
      name: activeProgram.name,
      description: pageDesc,
      department: deptName,
      url: pageUrl,
      degreeName: 'Bachelor of Technology',
    }),
    getBreadcrumbSchema([
      { name: 'Academics', url: '/academics' },
      { name: deptName, url: pageUrl },
    ]),
  ];

  return (
    <main className="page-wrapper dept-detail-page">
      <SEO title={`${deptName} | Vishnu Women's University`} description={pageDesc} canonicalPath={pageUrl} ogImage={pageHeroImage} jsonLd={jsonLd} />

      {/* Hero — same rounded image-card treatment for every department */}
      <section className="dept-hero-section">
        <div className="container">
          <div className="dept-hero-card">
            {pageHeroImage && (
              <SmoothImage src={pageHeroImage} alt={deptName} className="dept-hero-bg-img" loading="eager" decoding="sync" />
            )}
            <div className="dept-hero-overlay" />
            <div className="dept-hero-content">
              <h1 className="dept-hero-title">{deptName}</h1>
              <p className="dept-hero-subtitle">
                {shared.tagline || pageDesc}
              </p>
              <div className="dept-hero-cta">
                <Link to="/apply-now" className="btn-hero-gold">Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Quick Navigation Pill Bar (Capsule attaching under floating navbar) */}
      {quickLinks.length > 0 && (
        <section className="dept-horizontal-quicknav-section" aria-label="Page section navigation">
          <div className="container dept-horizontal-quicknav-container">
            <div className="dept-horizontal-quicknav-pill">
              {quickLinks.map((l) => {
                const isActive = activeSectionId === l.id;
                return (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSectionId(l.id);
                      // "R & D" still lives as a tab inside the Programme Hub
                      // card rather than its own section — jump to the hub
                      // and switch to that tab instead.
                      if (l.id === 'rnd') setActiveHubTab('rnd');
                      const scrollId = l.id === 'rnd' ? 'program-toggle' : l.id;
                      const el = document.getElementById(scrollId);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`dept-quicknav-link${isActive ? ' is-active' : ''}`}
                  >
                    <span>{l.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About the Department (shared) */}
      {hasAbout && (
        <section id="about" className="section bg-white dept-about-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className="dept-about-main">
                <div className="dept-about-header">
                  <h2 className="section-title">
                    <span style={{ fontWeight: 400 }}>Welcome to </span>
                    <span style={{ fontWeight: 800 }}>{deptName}</span>
                  </h2>
                </div>

                <div className="dept-about-body">
                  <div className="dept-about-card">
                    <p className="dept-about-lead-text">
                      {shared.about}
                    </p>
                  </div>

                  {overviewImage && (
                    <div className="dept-about-media">
                      <SmoothImage src={overviewImage} alt={deptName} className="dept-about-media-img" loading="eager" fetchPriority="high" />
                    </div>
                  )}
                </div>

                {/* Department Highlights — same layout as a programme's own
                    Highlights (see "Programme Highlights" further down),
                    filling the space next to the Quick Links sidebar that
                    otherwise sat empty whenever "About" alone was short. */}
                {hasDeptHighlights && (
                  <div style={{ marginTop: 'var(--space-8)' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
                      Department Highlights
                    </h3>
                    <div className="dept-highlights-grid">
                      {shared.highlights.map((h, hi) => (
                        <div key={hi} className="dept-highlight-item-card">
                          <div className="dept-highlight-check-circle">
                            <Check size={13} strokeWidth={3} />
                          </div>
                          <p className="dept-highlight-text">{h}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          </div>
        </section>
      )}

      {/* Core Values — moved out from HOD section directly after Department Overview.
          Department Vision / Mission Statements cards were removed here; this
          section now only ever shows Institutional Core Values. */}
      {hasCoreValues && (
        <section id="vision-mission" className="section dept-section-navy" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2 className="section-title">Our Core Values</h2>
            </div>

            <div className="dept-vm-grid">
              {shared.coreValues && shared.coreValues.length > 0 && (
                <div className="dept-values-card">
                  <div className="dept-values-header">
                    <Sparkles size={22} strokeWidth={2} style={{ color: 'var(--color-accent)' }} />
                    <h3 className="dept-values-title">Institutional Core Values</h3>
                  </div>
                  <div className="dept-values-chips-wrap">
                    {shared.coreValues.map((v, vi) => (
                      <span key={vi} className="dept-value-pill">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                        <span>{v}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Placements & Internships — one "Careers" section; a tab bar only
          appears when a programme actually has both. Placed right after
          the department overview since it's the highest-intent content on
          this page. */}
      {(hasPlacements || hasInternships) && (

        <section id="placements" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className="dept-placement-title-row">
            
              <h2 className="section-title" style={{ margin: 0 }}>
                {hasPlacements && hasInternships ? (
                  <>
                    <span style={{ fontWeight: 400 }}>Placements </span>
                    <span style={{ fontWeight: 800 }}>&amp; Internships</span>
                  </>
                ) : hasInternships ? 'Internships' : 'Placements'}
              </h2>
            </div>

            {hasPlacements && hasInternships && (
              <div className="section-tabs" role="tablist" aria-label="Placements and Internships" style={{ marginBottom: 'var(--space-6)' }}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={careerTab === 'placements'}
                  className={`section-tab-btn${careerTab === 'placements' ? ' active' : ''}`}
                  onClick={() => setCareerTab('placements')}
                >
                  Placements
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={careerTab === 'internships'}
                  className={`section-tab-btn${careerTab === 'internships' ? ' active' : ''}`}
                  onClick={() => setCareerTab('internships')}
                >
                  Internships
                </button>
              </div>
            )}

            {hasPlacements && (!hasInternships || careerTab === 'placements') && (
            <div>
            {shared.placementIntro && (
              <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)', maxWidth: 760 }}>
                {shared.placementIntro}
              </p>
            )}
            {shared.placementStats.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
                {shared.placementStats.map((s, si) => (
                  <div key={si} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            {/* Academic Year pill selector + computed stat tiles — Academic
                Years come entirely from activeProgram.placementYears
                (admin-managed via /admin → Programs), and every tile value
                below is computed live from that year's imported rows (see
                computePlacementStats). The detailed records table further
                down still shows every column exactly as uploaded, with the
                top 10 highest-package rows pulled to the front. */}
            {placementYears.length > 0 && (
              <div>
                <div className="placement-year-pills" role="group" aria-label="Select academic year">
                  {placementYears.map((y) => (
                    <button
                      key={y.year}
                      type="button"
                      onClick={() => setPlacementYear(y.year)}
                      className={`placement-year-pill${activePlacementYear?.year === y.year ? ' active' : ''}`}
                      aria-pressed={activePlacementYear?.year === y.year}
                    >
                      {y.year}
                    </button>
                  ))}
                </div>
                {activePlacementYear && placementYearStats && (
                  <>
                    <p className="placement-stat-summary">
                      {endingYear(activePlacementYear.year)} Placement Snapshot
                    </p>
                    <div className="dept-placement-stats-wrap">
                      <div className="dept-placement-stats-circles">
                        <div className="dept-placement-stat-circle">
                          <div className="dept-placement-stat-circle__ring">
                            <span className="dept-placement-stat-circle__value">{placementYearStats.companiesVisited}</span>
                            <span className="dept-placement-stat-circle__label">No. of Companies Visited</span>
                          </div>
                        </div>
                        <div className="dept-placement-stat-circle">
                          <div className="dept-placement-stat-circle__ring">
                            <span className="dept-placement-stat-circle__value">{displayedTotalOffers}</span>
                            <span className="dept-placement-stat-circle__label">Total No. of Offers</span>
                          </div>
                        </div>
                        {placementYearStats.highestPackage != null && (
                          <div className="dept-placement-stat-circle">
                            <div className="dept-placement-stat-circle__ring">
                              <span className="dept-placement-stat-circle__value">{placementYearStats.highestPackage}</span>
                              <span className="dept-placement-stat-circle__label">Highest Package</span>
                            </div>
                          </div>
                        )}
                        {placementYearStats.averageSalary != null && (
                          <div className="dept-placement-stat-circle">
                            <div className="dept-placement-stat-circle__ring">
                              <span className="dept-placement-stat-circle__value">{placementYearStats.averageSalary}</span>
                              <span className="dept-placement-stat-circle__label">Average Salary</span>
                            </div>
                          </div>
                        )}
                      </div>
                      {(placementYearStats.medianSalary != null || placementYearStats.above50Lpa > 0 || placementYearStats.above30Lpa > 0 || placementYearStats.above10Lpa > 0) && (
                        <div className="dept-placement-stats-rects">
                          {placementYearStats.medianSalary != null && (
                            <div className="dept-placement-stat-rect">
                              <div className="dept-placement-stat-rect__value">{placementYearStats.medianSalary}</div>
                              <div className="dept-placement-stat-rect__label">Median Salary</div>
                            </div>
                          )}
                          {placementYearStats.above50Lpa > 0 && (
                            <div className="dept-placement-stat-rect">
                              <div className="dept-placement-stat-rect__value">{placementYearStats.above50Lpa} offers</div>
                              <div className="dept-placement-stat-rect__label">Above 50 LPA+</div>
                            </div>
                          )}
                          {placementYearStats.above30Lpa > 0 && (
                            <div className="dept-placement-stat-rect">
                              <div className="dept-placement-stat-rect__value">{placementYearStats.above30Lpa} offers</div>
                              <div className="dept-placement-stat-rect__label">Above 30 LPA+</div>
                            </div>
                          )}
                          {placementYearStats.above10Lpa > 0 && (
                            <div className="dept-placement-stat-rect">
                              <div className="dept-placement-stat-rect__value">{placementYearStats.above10Lpa} offers</div>
                              <div className="dept-placement-stat-rect__label">Above 10 LPA+</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div id="placement-records-table" style={{ marginTop: 'var(--space-8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0.2rem 0 0 0' }}>
                        Career Offers &amp; Recruiters ({activePlacementYear?.year})
                      </h3>
                    </div>
                  
                  </div>

                  {placementCompanyOptions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: 'var(--space-4)' }}>
                      <select
                        value={placementCompanyFilter}
                        onChange={(e) => setPlacementCompanyFilter(e.target.value)}
                        aria-label="Filter by company"
                        style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-light-gray)', fontSize: '0.85rem', background: 'var(--color-white)' }}
                      >
                        <option value="">All Companies</option>
                        {placementCompanyOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select
                        value={placementMinPackage}
                        onChange={(e) => setPlacementMinPackage(Number(e.target.value))}
                        aria-label="Filter by minimum package"
                        style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-light-gray)', fontSize: '0.85rem', background: 'var(--color-white)' }}
                      >
                        <option value={0}>Any Package</option>
                        <option value={5}>5 LPA & above</option>
                        <option value={10}>10 LPA & above</option>
                        <option value={20}>20 LPA & above</option>
                        <option value={30}>30 LPA & above</option>
                      </select>
                      {(placementCompanyFilter || placementMinPackage > 0) && (
                        <button
                          type="button"
                          onClick={() => { setPlacementCompanyFilter(''); setPlacementMinPackage(0); }}
                          style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid var(--color-light-gray)', fontSize: '0.85rem', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-light)' }}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}

                  {placementMarqueeItems.length > 0 ? (
                    <TestimonialMarquee records={placementMarqueeItems} />
                  ) : (
                    <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', padding: '1.5rem 0' }}>
                      {placementRows.length > 0
                        ? 'No offers match the selected filters.'
                        : `No placement records uploaded yet for ${activePlacementYear?.year}.`}
                    </p>
                  )}
                </div>

                {/* Top Recruiters — admin-entered company names
                    (dept.placementRecruiters), resolved to a real logo
                    where the name is a known company. */}
                {shared.placementRecruiters.length > 0 && (
                  <div className="dept-recruiters-section" style={{ marginTop: 'var(--space-8)' }}>
                    <h3 className="dept-recruiters-title">Top Recruiters</h3>
                    <div className="dept-recruiters-grid">
                      {shared.placementRecruiters.map((name, ri) => (
                        <RecruiterTile key={name + ri} name={name} uploadedUrl={recruiterLogoMap.get(name.toLowerCase())} />
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
                  <Link to="/placements/placement-details" className="btn btn-outline btn-lg">
                    Explore the Full University Placement Report
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            )}
            {placementYears.length === 0 && staticDeptBatches.length > 0 && (
              <div>
                <div className="placement-year-pills" role="group" aria-label="Select academic year">
                  {staticDeptBatches.map((b) => (
                    <span key={b.batch} className="placement-year-pill">{b.batch}</span>
                  ))}
                </div>
                <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', marginBottom: 'var(--space-4)', maxWidth: 640 }}>
                  Individual student records for this department haven't been uploaded here yet, but VWU's
                  institution-wide Placement Details page has published totals for these batches:
                </p>
                <div className="dept-stat-grid dept-stat-grid--fill">
                  {staticDeptBatches.map((b) => (
                    <div className="dept-stat-tile" key={b.batch}>
                      <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{b.offers}</span></div>
                      <div className="dept-stat-tile__label">{b.batch} Offers{b.highestLPA != null ? ` · Highest ${b.highestLPA} LPA` : ''}</div>
                    </div>
                  ))}
                </div>
                <Link to="/placements/placement-details" style={{ fontSize: '0.85rem' }}>See full Placement Details &rarr;</Link>
              </div>
            )}
            </div>
            )}

            {hasInternships && (!hasPlacements || careerTab === 'internships') && (
            <div>
              <div className="placement-year-pills" role="group" aria-label="Select academic year">
                {internshipYears.map((y) => (
                  <button
                    key={y.year}
                    type="button"
                    onClick={() => setInternshipYear(y.year)}
                    className={`placement-year-pill${activeInternshipYear?.year === y.year ? ' active' : ''}`}
                    aria-pressed={activeInternshipYear?.year === y.year}
                  >
                    AY. {y.year}
                  </button>
                ))}
              </div>
              {activeInternshipYear && internshipYearStats && (
                <>
                  <p className="placement-stat-summary">
                    {activeInternshipYear.year} Internships as on date: <strong>{internshipYearStats.totalInternships.toLocaleString()}</strong>
                  </p>
                  <div className="dept-stat-grid">
                    <div className="dept-stat-tile">
                      <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{internshipYearStats.companiesVisited}</span></div>
                      <div className="dept-stat-tile__label">No. of Companies</div>
                    </div>
                    <div className="dept-stat-tile">
                      <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{internshipYearStats.totalInternships}</span></div>
                      <div className="dept-stat-tile__label">Total No. of Internships</div>
                    </div>
                    <div className="dept-stat-tile">
                      <button
                        type="button"
                        className="dept-stat-tile__circle dept-stat-tile__circle--link"
                        onClick={() => document.getElementById('internship-records-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      >
                        <span className="dept-stat-tile__value">View All</span>
                      </button>
                      <div className="dept-stat-tile__label">Internship Records</div>
                    </div>
                  </div>
                </>
              )}

              <div id="internship-records-table" style={{ marginTop: 'var(--space-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0.2rem 0 0 0' }}>
                      Internship Offers &amp; Organizations ({activeInternshipYear?.year})
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-accent)', background: 'rgba(201, 168, 76, 0.12)', border: '1px solid rgba(201, 168, 76, 0.3)', borderRadius: '9999px', padding: '0.3rem 0.85rem' }}>
                    {internshipRows.length} Verified Internships
                  </span>
                </div>

                {internshipMarqueeItems.length > 0 ? (
                  <TestimonialMarquee records={internshipMarqueeItems} />
                ) : (
                  <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', padding: '1.5rem 0' }}>
                    No internship records uploaded yet for {activeInternshipYear?.year}.
                  </p>
                )}
              </div>
            </div>
            )}
          </div>
        </section>
      )}

      <div id="success-stories" style={{ scrollMarginTop: NAV_OFFSET }}>
        <SuccessStoriesCarousel stories={successStoryItems} />
      </div>

      {/* Department Profile — an editorial "at a glance" read of the
          department's identity/history/programmes/accreditation/leadership,
          replacing the earlier five-equal-cards grid. Establishments,
          Accreditations and Programme Intake are each admin-entered
          per-programme arrays (see ProgramsAdmin.tsx) that can hold any
          number of entries, so none of the three groups below assumes a
          fixed count — every list renders through ExpandableGroup, which
          shows the first few entries directly and collapses the rest behind
          a "View all" toggle, so the layout stays the same shape whether a
          department has one programme or several. A department-level
          override (dept.established / dept.accreditation) still wins as a
          single dept-wide entry, same fallback the previous grid used. */}
      {(() => {
        const deptEstList = dept?.academicJourneyList || [];
        const establishmentItems: ProfileListItem[] = deptEstList.map((aj, i) => ({ id: `dept-aj-${i}`, label: aj.label, value: aj.year }));

        const deptAcc = clean(dept?.accreditation);
        const deptAccImage = dept?.accreditationImage || '';
        const validAcc = subPrograms.filter((p) => clean(p.accreditation));
        const accreditationItems: ProfileListItem[] = deptAcc
          ? [{ id: 'dept-acc', label: deptName, value: deptAcc, image: deptAccImage }]
          : validAcc.map((p) => ({ id: p.id, label: p.shortName || p.name, value: clean(p.accreditation), image: p.accreditationImage || '' }));

        const deptIntakeList = dept?.programmeIntakeList || [];
        const intakeItems: ProfileListItem[] = deptIntakeList.map((pi, i) => ({ id: `dept-pi-${i}`, label: pi.program, value: pi.intake }));

        const hasJourneyRow = establishmentItems.length > 0 || intakeItems.length > 0;
        // AP EAPCET Code panel below always renders, so this row is never empty.
        const hasAccreditationRow = true;

        return (
          <section id="rankings" className="dept-profile-section" style={{ scrollMarginTop: NAV_OFFSET }}>
            <div className="container">
              <div className="dept-profile-header">
                <span className="dept-profile-eyebrow">Department Profile</span>
                <h2 className="section-title">{deptName} at a Glance</h2>
              </div>

              {hasJourneyRow && (
                <div className="dept-profile-grid">
                  {establishmentItems.length > 0 && (
                    <div className="dept-profile-panel">
                      <div className="dept-profile-panel-head">
                        <Calendar size={16} strokeWidth={2.2} />
                        <h3>Academic Journey</h3>
                      </div>
                      <div className="dept-timeline">
                        <ExpandableGroup
                          items={establishmentItems}
                          renderItem={(item) => (
                            <div className="dept-timeline-item" key={item.id}>
                              <span className="dept-timeline-year">{item.value}</span>
                              <span className="dept-timeline-label">{item.label}</span>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {intakeItems.length > 0 && (
                    <div className="dept-profile-panel">
                      <div className="dept-profile-panel-head">
                        <Users size={16} strokeWidth={2.2} />
                        <h3>Programmes &amp; Intake</h3>
                      </div>
                      <div className="dept-intake-list" role="table" aria-label="Programme intake">
                        <div className="dept-intake-row dept-intake-row--head" role="row">
                          <span role="columnheader">Programme</span>
                          <span role="columnheader">Intake</span>
                        </div>
                        <ExpandableGroup
                          items={intakeItems}
                          renderItem={(item) => (
                            <div className="dept-intake-row" role="row" key={item.id}>
                              <span role="cell">{item.label}</span>
                              <span role="cell" className="dept-intake-seats">{item.value}</span>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {hasAccreditationRow && (
                <div className="dept-profile-grid">
                  {accreditationItems.length > 0 && (
                    <div className="dept-profile-panel">
                      {accreditationItems.some((item) => item.image) ? (
                        // Image mode — occupy entire section
                        <div className="dept-accreditation-image-section">
                          {accreditationItems.filter((item) => item.image).map((item) => (
                            <div key={item.id} className="dept-accreditation-image-wrapper">
                              <img src={item.image} alt={`${item.label} accreditation`} />
                              <span className="dept-accreditation-image-label">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Text mode — original layout
                        <>
                          <div className="dept-profile-panel-head">
                            <Award size={16} strokeWidth={2.2} />
                            <h3>Accreditation</h3>
                          </div>
                          <div className="dept-accreditation-list">
                            <ExpandableGroup
                              items={accreditationItems}
                              renderItem={(item) => (
                                <div className="dept-accreditation-row" key={item.id}>
                                  <span className="dept-accreditation-badge" aria-hidden="true">
                                    <Award size={16} strokeWidth={2.2} />
                                  </span>
                                  <div>
                                    <span className="dept-accreditation-programme">{item.label}</span>
                                    <span className="dept-accreditation-status">{item.value}</span>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <Link to="/admissions" className="dept-profile-panel dept-profile-eapcet">
                    <div className="dept-profile-panel-head">
                      <h3>Applying via AP EAPCET?</h3>
                    </div>
                    <div className="dept-eapcet-body">
                      <span className="dept-eapcet-code">{eapcetCode}</span>
                      <span className="dept-eapcet-hint">Enter this code during counselling to choose {deptName}</span>
                      <span className="dept-eapcet-cta">
                        See the full admissions process
                        <ArrowRight size={13} strokeWidth={2.5} />
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {hasLabs && (
        <LabsCarousel
          labs={shared.labs}
          navOffset={NAV_OFFSET}
          fallbackImage={pageHeroImage}
          title="Academic Infrastructure & Learning Facilities"
          description={`Explore the laboratories, studios, and campus infrastructure that support hands-on learning in ${deptName} — from specialized equipment to dedicated project and research spaces.`}
        />
      )}

      {/* ── Research & Innovation ────────────────────────────────────────
          Template: "Pioneers of research & innovation" style.
          Left: 2×2 stat cards. Right: auto-advancing research slide carousel.
          Data comes from this department's own doc (Admin → Academic
          Departments → Research & Innovation) — see ResearchSection above. */}
      <ResearchSection deptName={deptName} heroImage={pageHeroImage} stats={dept?.researchStats} slides={dept?.researchSlides} />

      {/* Tie-Ups & MoUs — admin-entered partner/institution names
          (dept.tieUpsMous), same rectangular tile grid as Top Recruiters
          above, resolved to a real logo where the name is known. A light
          gold-accented surface (.dept-tieups-surface, detail-layout.css) —
          deliberately not .dept-section-navy, which Core Values above and
          Testimonials below already use; three sections in the same navy
          made them read as one repeated block. */}
      {shared.tieUpsMous.length > 0 && (
        <section id="tieups-mous" className="section dept-tieups-surface" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className="dept-recruiters-section">
              <h3 className="dept-recruiters-title">Tie-Ups &amp; MoUs</h3>
              <div className="dept-recruiters-grid dept-recruiters-grid--circular">
                {shared.tieUpsMous.map((name, ri) => (
                  <RecruiterTile
                    key={name + ri}
                    name={name}
                    uploadedUrl={mousPartnerLogoMap.get(name.trim().toLowerCase()) || recruiterLogoMap.get(name.toLowerCase())}
                    showName
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Unified Programme Hub ===== */}
      <section id="program-toggle" className="programme-hub-section" style={{ scrollMarginTop: NAV_OFFSET }}>
        <div className="container">
          <div className="programme-hub-header">
<h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
               Academic Programmes &amp; Course Structure
             </h2>

            {/* Programme Selector Pills */}
            <div className="programme-hub-pills" role="tablist" aria-label="Choose a Programme">
              {subPrograms.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  role="tab"
                  aria-selected={p.slug === activeSlug}
                  className={`programme-hub-pill-btn${p.slug === activeSlug ? ' active' : ''}`}
                  onClick={() => {
                    if (p.slug !== activeSlug) {
                      navigate(`/academics/${p.slug}#program-toggle`, { preventScrollReset: true });
                    }
                  }}
                >
                  {p.shortName || p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Hub Container Card */}
          <div className="programme-hub-card">
            {/* Hub Inner Tabs */}
            <div className="programme-hub-tabs-bar" role="tablist" aria-label="Programme details">
              <button
                type="button"
                role="tab"
                aria-selected={activeHubTab === 'overview'}
                className={`programme-hub-tab-btn${activeHubTab === 'overview' ? ' active' : ''}`}
                onClick={() => setActiveHubTab('overview')}
              >
                <BookOpen size={17} strokeWidth={2.2} />
                <span>Overview & Highlights</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeHubTab === 'curriculum'}
                className={`programme-hub-tab-btn${activeHubTab === 'curriculum' ? ' active' : ''}`}
                onClick={() => setActiveHubTab('curriculum')}
              >
                <GraduationCap size={17} strokeWidth={2.2} />
                <span>Curriculum & Structure</span>
              </button>

              {hasOutcomeStatements && (
              <button
                type="button"
                role="tab"
                aria-selected={activeHubTab === 'outcomes'}
                className={`programme-hub-tab-btn${activeHubTab === 'outcomes' ? ' active' : ''}`}
                onClick={() => setActiveHubTab('outcomes')}
              >
                <Award size={17} strokeWidth={2.2} />
                <span>{outcomeHeading}</span>
              </button>
              )}

              {hasNewsletter && (
              <button
                type="button"
                role="tab"
                aria-selected={activeHubTab === 'newsletter'}
                className={`programme-hub-tab-btn${activeHubTab === 'newsletter' ? ' active' : ''}`}
                onClick={() => setActiveHubTab('newsletter')}
              >
                <FileText size={17} strokeWidth={2.2} />
                <span>Department Newsletter</span>
              </button>
              )}

              {hasRnd && (
              <button
                type="button"
                role="tab"
                aria-selected={activeHubTab === 'rnd'}
                className={`programme-hub-tab-btn${activeHubTab === 'rnd' ? ' active' : ''}`}
                onClick={() => setActiveHubTab('rnd')}
              >
                <Microscope size={17} strokeWidth={2.2} />
                <span>Research & Development</span>
              </button>
              )}
            </div>

            {/* Hub Body Content */}
            <div className="programme-hub-body">
              {activeHubTab === 'overview' && (
                <div className="programme-hub-grid">
                  {/* Left Column: About */}
                  <div className="programme-hub-about-col">
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 1rem 0' }}>
                      About the Programme
                    </h3>
                    <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                      {activeProgram.about || `The ${activeProgram.name} programme at ${deptName} offers rigorous academic preparation and industry-aligned skills.`}
                    </p>
                  </div>

                  {/* Right Column: Highlights */}
                  {hasHighlights && (
                    <div className="programme-hub-highlights-col">
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 1rem 0' }}>
                        Programme Highlights
                      </h3>
                      <div className="dept-highlights-grid">
                        {activeProgram.highlights.map((h, hi) => (
                          <div key={hi} className="dept-highlight-card">
                            <div className="dept-highlight-icon-wrap">
                              <Check size={13} strokeWidth={3} />
                            </div>
                            <p className="dept-highlight-text">
                              {h.includes(':') ? (
                                <>
                                  <strong>{h.slice(0, h.indexOf(':') + 1)}</strong>
                                  {h.slice(h.indexOf(':') + 1)}
                                </>
                              ) : (
                                h
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeHubTab === 'curriculum' && (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0.5rem 0' }}>
                      {activeProgram.shortName || activeProgram.name} — Programme Structure
                    </h3>
                  </div>

                  {hasMindMap && (
                    <div className="dept-mindmap-row" style={{ marginBottom: '1.5rem' }}>
                      {mindMapImages.map((img, i) => (
                        <a
                          key={img.url}
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dept-mindmap-thumb"
                          aria-label={`View mind map image ${i + 1}`}
                        >
                          <img src={img.url} alt={`${activeProgram.shortName || activeProgram.name} mind map ${i + 1}`} />
                        </a>
                      ))}
                      {activeProgram.mindMapPdfUrl && (
                        <a href={activeProgram.mindMapPdfUrl} target="_blank" rel="noopener noreferrer" className="dept-mindmap-pdf-link">
                          <FileText size={14} strokeWidth={2.2} />
                          <span>Download Mind Map PDF</span>
                        </a>
                      )}
                    </div>
                  )}

                  <ProgrammeStructure semesters={activeProgram.semesters} />
                </div>
              )}

              {activeHubTab === 'outcomes' && hasOutcomeStatements && (
                <div>
                  <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
                    Structured educational objectives and measurable competencies defined in accordance with NBA &amp; Washington Accord frameworks.
                  </p>
                  <div className="section-tabs" role="tablist" aria-label={outcomeHeading}>
                    {outcomeGroups.map((g) => (
                      <button
                        key={g.key}
                        id={`outcome-tab-${g.key}`}
                        role="tab"
                        aria-selected={activeOutcome?.key === g.key}
                        aria-controls={`outcome-panel-${g.key}`}
                        tabIndex={activeOutcome?.key === g.key ? 0 : -1}
                        onClick={() => setOutcomeTab(g.key)}
                        className={`section-tab-btn${activeOutcome?.key === g.key ? ' active' : ''}`}
                      >
                        {g.short}
                      </button>
                    ))}
                  </div>
                  {activeOutcome && (
                    <div
                      id={`outcome-panel-${activeOutcome.key}`}
                      role="tabpanel"
                      aria-labelledby={`outcome-tab-${activeOutcome.key}`}
                      tabIndex={0}
                      className="dept-outcomes-container"
                    >
                      <div className="dept-outcomes-header-bar">
                        <h3 className="dept-outcomes-header-title">{activeOutcome.title}</h3>
                      </div>
                      <ul className="dept-outcomes-list">
                        {activeOutcome.items!.map((item, i) => (
                          <li key={`${activeOutcome.key}-${i}`} className="dept-outcome-row">
                            <span className="dept-outcome-code">
                              {activeOutcome.key.slice(0, -1).toUpperCase()}
                              {i + 1}
                            </span>
                            <p className="dept-outcome-desc">{item}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Department Newsletter & Publications — same move; the
                  standalone version's own collapsible header is redundant
                  once this is already gated behind a tab click. */}
              {activeHubTab === 'newsletter' && hasNewsletter && (
                <div>
                  <p className="section-desc" style={{ marginBottom: 'var(--space-5)' }}>
                    Archive of periodic department bulletins, student achievements, and academic highlights.
                  </p>
                  <div className="pb-activities-scroll" role="region" aria-label="Newsletter issues by academic year" tabIndex={0}>
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">Academic Year</th>
                          {Array.from({ length: newsletterMaxIssues }).map((_, ci) => (
                            <th key={ci} scope="col">Issue {ci + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterYears.map((yr) => (
                          <tr key={yr.year}>
                            <td>{yr.year}</td>
                            {Array.from({ length: newsletterMaxIssues }).map((_, ci) => {
                              const issue = yr.issues[ci];
                              if (!issue) return <td key={ci} />;
                              return (
                                <td key={ci}>
                                  {issue.pdfUrl ? (
                                    <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" className="dept-rnd-view-link">
                                      <FileText size={13} strokeWidth={2.2} /> View
                                    </a>
                                  ) : (
                                    <span style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>Unavailable</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Research & Development (Funded Projects & Patents) — same
                  move; renders whichever of the four admin fields are
                  filled in (overview paragraph, table(s), project/patent
                  cards, and/or a flat PDF link list). */}
              {activeHubTab === 'rnd' && hasRnd && (
                <div>
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0 0' }}>
                      Research &amp; Development (Funded Projects &amp; Patents)
                    </h3>
                  </div>
                  {rndLabeledYears.length > 0 && (
                    <div className="placement-year-pills" role="group" aria-label="Select academic year" style={{ marginBottom: 'var(--space-5)' }}>
                      {rndLabeledYears.map((y) => (
                        <button
                          key={y.year}
                          type="button"
                          onClick={() => setRndYear(y.year)}
                          className={`placement-year-pill${activeRndYear?.year === y.year ? ' active' : ''}`}
                          aria-pressed={activeRndYear?.year === y.year}
                        >
                          AY. {y.year}
                        </button>
                      ))}
                    </div>
                  )}
                  {activeRndYear?.intro && (
                    <p className="dept-rnd-intro">{activeRndYear.intro}</p>
                  )}
                  {rndTableSections.map((section, si) => (
              <div key={si} className="dept-rnd-table-group">
                {section.title && (
                  <h3 className="dept-rnd-table-title">{section.title}</h3>
                )}
                <div className="pb-activities-scroll" role="region" aria-label={section.title || 'Research & Development table'} tabIndex={0}>
                  <table>
                    <thead>
                      <tr>
                        {section.headers.map((col, ci) => (
                          <th key={ci} scope="col">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((val, ci) => (
                            <td key={ci}>
                              {/^https?:\/\//i.test(val) ? (
                                <a href={val} target="_blank" rel="noopener noreferrer" className="dept-rnd-view-link">View</a>
                              ) : val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {hasRndStructuredTable && (
              <div className="dept-rnd-table-group">
                <div className="pb-activities-scroll" role="region" aria-label="Funded Projects & Patents" tabIndex={0}>
                  <table>
                    <thead>
                      <tr>
                        {rndStructuredColumns.map((col, ci) => (
                          <th key={ci} scope="col">{col}</th>
                        ))}
                        <th scope="col">PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rndStructuredRows.map((row, ri) => (
                        <tr key={ri}>
                          {rndStructuredColumns.map((_, ci) => (
                            <td key={ci}>{row.cells[ci] ?? ''}</td>
                          ))}
                          <td>
                            {row.pdfUrl ? (
                              <a href={row.pdfUrl} target="_blank" rel="noopener noreferrer" className="dept-rnd-view-link">
                                <FileText size={13} strokeWidth={2.2} /> View
                              </a>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {rndProjectCategories.map((cat, ci) => (
              <div key={ci} className="dept-rnd-table-group">
                {cat.title && (
                  <h3 className="dept-rnd-table-title">{cat.title}</h3>
                )}
                <div className="thrust-accordion">
                  {cat.projects.map((project, pi) => {
                    const key = `${activeRndYear?.year}-${ci}-${pi}`;
                    const isOpen = openRndProjects.has(key);
                    return (
                      <div key={pi} className={`thrust-accordion-item${isOpen ? ' open' : ''}`}>
                        <button
                          type="button"
                          className="thrust-accordion-header"
                          onClick={() => toggleRndProject(key)}
                          aria-expanded={isOpen}
                          aria-controls={`rnd-project-${key}`}
                        >
                          <span>{project.title}</span>
                          <span className="thrust-accordion-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                        </button>
                        <div id={`rnd-project-${key}`} className="thrust-accordion-collapse">
                          <div className="thrust-accordion-collapse-inner">
                            <div className="dept-rnd-project-body">
                              {project.fields.length > 0 && (
                                <div className="dept-rnd-project-fields">
                                  {project.fields.map((f, fi) => (
                                    <div key={fi} className="dept-rnd-project-field">
                                      <span className="dept-rnd-project-field-label">{f.label}</span>
                                      <span className="dept-rnd-project-field-value">
                                        {f.href ? (
                                          <a href={f.href} download target="_blank" rel="noopener noreferrer" className="thrust-accordion-link">{f.value}</a>
                                        ) : (
                                          f.value
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {project.outcomes.length > 0 && (
                                <div className="dept-rnd-outcomes">
                                  <ul className="dept-rnd-outcomes-list">
                                    {project.outcomes.map((o, oi) => (
                                      <li key={oi} className="dept-rnd-outcome-item">
                                        <Check size={13} strokeWidth={2.5} />
                                        <span>{o}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
                  {rndLinks.length > 0 && (
                    <ul className="annual-reports-list">
                      {rndLinks.map((link, li) => (
                        <li key={li}>
                          <a href={link.pdfUrl} target="_blank" rel="noopener noreferrer" className="annual-reports-link">
                            <FileText size={14} strokeWidth={2} className="annual-reports-icon" />
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About HOD — photo + name below it, plain message, Vision/Mission/
          Core Values folded in as individual accordion rows. */}
      {hasHod && (
        <section id="hod" className="dept-hod-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-8)' }}>
              <h2 className="section-title">Head of the Department</h2>
            </div>
            <div className="dept-hod-editorial-card">
              {shared.hodImage && (
                <div className="dept-hod-media-col">
                  <div className="dept-hod-media-frame">
                    <SmoothImage
                      src={shared.hodImage}
                      alt={shared.hod || 'Head of Department'}
                      className="dept-hod-photo"
                    />
                  </div>
                  {shared.hod && (
                    <div className="dept-hod-media-caption">
                      <h3 className="dept-hod-name">{shared.hod}</h3>
                      <div className="dept-hod-meta">Head of the Department</div>
                    </div>
                  )}
                </div>
              )}

              <div className="dept-hod-content">
                <h2 className="dept-hod-message-title">Brief Profile</h2>

                {shared.hodMessage && (
                  <p className="dept-hod-message-text-plain">{shared.hodMessage}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Faculty Carousel (matching Google UI reference design) */}
      {faculty.length > 0 && (
        <div id="faculty" style={{ scrollMarginTop: NAV_OFFSET }}>
          <FacultyCarousel
            faculty={faculty}
            departmentName={deptName}
            title="The People Behind Expertise"
            viewMoreLink="/faculty"
          />
        </div>
      )}

      {/* Events & Happenings — extracted from the Programme Hub's tab bar
          into its own standalone section. NewsEventsTabs renders its own
          section/container + collapsible header when not embedded. */}
      {hasNewsEvents && (
        <NewsEventsTabs categories={newsEventsCategories} navOffset={NAV_OFFSET} departmentSlug={group.key} />
      )}

      {/* Testimonials — a bold navy "quote wall" (matching the Core Values
          card's gradient) for visual contrast against the lighter sections
          around it; cards float as translucent glass surfaces. Own data
          (dept.testimonials, Admin → Academic Departments → Testimonials) —
          not shared with the Success Stories carousel above. */}
      {testimonialItems.length > 0 && (
        <section id="testimonials" className="section dept-testimonials-navy" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-10)' }}>
              <h2 className="section-title">What Our Students Say</h2>
              <p className="section-desc" style={{ margin: '0 auto' }}>
                Testimonials from graduates and current students of {deptName}.
              </p>
            </div>
            <div className="dept-testimonial-single">
              <div className="dept-testimonial-single-dots" role="tablist" aria-label="Testimonials">
                {testimonialItems.slice(0, testimonialCount).map((story, i) => (
                  <button
                    key={story.id || i}
                    type="button"
                    role="tab"
                    aria-selected={activeTestimonial === i}
                    aria-label={`Show testimonial from ${story.name}`}
                    className={`dept-testimonial-dot${activeTestimonial === i ? ' active' : ''}`}
                    onClick={() => setActiveTestimonial(i)}
                  />
                ))}
              </div>

              {testimonialItems[activeTestimonial] && (
                <div key={activeTestimonial} className="dept-testimonial-single-card">
                  <div className="dept-testimonial-single-media">
                    {testimonialItems[activeTestimonial].photoUrl ? (
                      <SmoothImage
                        src={testimonialItems[activeTestimonial].photoUrl}
                        alt={testimonialItems[activeTestimonial].name}
                        className="dept-testimonial-single-photo"
                        loading="lazy"
                      />
                    ) : (
                      <div className="dept-testimonial-single-photo-fallback">
                        <span>
                          {testimonialItems[activeTestimonial].name
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="dept-testimonial-single-body">
                    <span className="dept-testimonial-single-quote-mark" aria-hidden="true">&ldquo;</span>
                    {testimonialItems[activeTestimonial].description && (
                      <p className="dept-testimonial-single-quote">{testimonialItems[activeTestimonial].description}</p>
                    )}
                    <div>
                      <span className="dept-testimonial-single-name">{testimonialItems[activeTestimonial].name}</span>
                      {testimonialItems[activeTestimonial].programme && (
                        <span className="dept-testimonial-single-role">{testimonialItems[activeTestimonial].programme}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <CustomSectionsRenderer sections={visibleCustomSections} navOffset={NAV_OFFSET} />

      {/* FAQ — last content section on the page, right before the closing
          CTA. Items render from this department's own `faqs` field (Admin →
          Academic Departments → Department Page — FAQs); the section is
          hidden entirely until an admin adds real entries, so no
          mock/placeholder questions ever show. No scroll-reveal animation
          here (see the Firestore gotcha in CLAUDE.md). */}
      {faqs.length > 0 && (
      <section id="faq" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <h2 className="section-title">
              Frequently Asked <span style={{ color: 'var(--color-accent)' }}>Questions</span>
            </h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Common questions about this department, answered. If you do not find what you are looking for, contact our admissions team directly.
            </p>
          </div>
          <div className="dept-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`dept-faq-card${openFaq === i ? ' open' : ''}`}>
                <button
                  type="button"
                  className="dept-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={18} strokeWidth={2.4} style={{ flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                <div className="dept-faq-collapse" aria-hidden={openFaq !== i}>
                  <div className="dept-faq-collapse-inner">
                    <div className="dept-faq-answer">{faq.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* CTA — navy-themed closing section for strong visual closure */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Begin Your Journey in {deptName}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 520, margin: '0 auto var(--space-8)', lineHeight: 1.7, fontSize: 'var(--text-lg)' }}>
            Join a thriving academic community. Apply through AP EAPCET (Code: {eapcetCode}) or schedule a campus visit today.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
            <Link to="/apply-now" className="btn btn-accent btn-lg">Apply Now</Link>
            <Link to="/campus-visit" className="btn btn-secondary btn-lg">Book a Campus Visit</Link>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-6)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/programmes-fee-structure" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Fee Structure</Link>
            <Link to="/academics" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>All Programmes</Link>
            <Link to="/admissions" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Admission Procedure</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
