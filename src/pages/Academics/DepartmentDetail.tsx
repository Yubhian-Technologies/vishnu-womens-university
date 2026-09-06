import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Check, Microscope, Sparkles, FileText, ArrowLeft, ArrowRight, BookOpen, GraduationCap, Award, Calendar, Users } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import ProgrammeStructure from '../../components/ProgrammeStructure/ProgrammeStructure';
import NewsEventsTabs, { type NewsEventsCategory } from '../../components/NewsEventsTabs/NewsEventsTabs';
import SEO from '../../components/SEO/SEO';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import TestimonialMarquee, { type PlacementItem } from '../../components/ui/marquee-01';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useEapcetCode } from '../../hooks/useContentBlocks';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { getProgramSchema, getBreadcrumbSchema } from '../../lib/seo/schemas';
import type { DepartmentGroup } from '../../lib/departmentGroups';
import { normalizeLab, normalizeMindMapImages, type ProgramDoc, type NewsEventsYear } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { FacultyDoc } from './Faculty';
import { parseFlexibleTable, parseProjectAccordion } from '../../lib/structuredTable';
import { resolveRndYears, rndYearHasContent } from '../../components/RndSection/RndSection';
import { sortPlacementRows, computePlacementStats, findPackageColumnIndex, findCompanyColumnIndex, formatPackageCell } from '../../lib/placementRecords';
import { computeInternshipStats, findPeriodColumnIndex } from '../../lib/internshipRecords';
import { getDeptBatchStats, findDeptBatchStatsForYearLabel } from '../../lib/departmentPlacementBridge';
import { usePlacementYears } from '../Placements/usePlacementYears';
import { hasCustomSectionContent } from '../../lib/customSections';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { resolveProgramIcon } from '../../lib/programIcons';
import { getDepartmentTagline } from '../../lib/departmentTaglines';
import '../detail-layout.css';
import '../Campus/tabbed-section.css';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

// Every section id the quick-nav scroll-spy might need to observe — a
// superset of whatever `quickLinks` ends up rendering for a given
// department (see the scroll-spy effect below for why this is a static
// list rather than reading `quickLinks` directly).
const ALL_QUICK_NAV_SECTION_IDS = ['about', 'vision-mission', 'programmes', 'placements', 'hod', 'faculty', 'labs', 'program-toggle', 'rnd', 'news-events'];

interface Props {
  group: DepartmentGroup;
  /** The currently-selected program slug (drives the toggle). */
  activeSlug: string;
}

// Every programme-hub tab now shows for every programme regardless of
// whether that programme has content for it (consistent tab set across all
// programmes); this is what a content-less tab's body shows when opened.
const HUB_TAB_EMPTY = (
  <p className="section-desc" style={{ margin: 0 }}>
    Details for this section will be published soon.
  </p>
);

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
  // Laboratories carousel — one lab slide visible at a time, auto-advancing
  // (same auto-scroll + pause-on-interact pattern as FacultyCarousel), with
  // arrow buttons and dot indicators that also work manually.
  const labScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLabsLeft, setCanScrollLabsLeft] = useState(false);
  const [canScrollLabsRight, setCanScrollLabsRight] = useState(true);
  const [activeLabIndex, setActiveLabIndex] = useState(0);
  const [labAutoPaused, setLabAutoPaused] = useState(false);
  const labResumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkLabScroll = () => {
    const el = labScrollRef.current;
    if (!el) return;
    setCanScrollLabsLeft(el.scrollLeft > 10);
    setCanScrollLabsRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    if (el.clientWidth > 0) {
      setActiveLabIndex(Math.round(el.scrollLeft / el.clientWidth));
    }
  };
  useEffect(() => {
    const el = labScrollRef.current;
    if (!el) return;
    checkLabScroll();
    el.addEventListener('scroll', checkLabScroll, { passive: true });
    window.addEventListener('resize', checkLabScroll);
    return () => {
      el.removeEventListener('scroll', checkLabScroll);
      window.removeEventListener('resize', checkLabScroll);
    };
  }, []);
  // Auto-advance every 4.5s, looping back to the start at the end — pauses
  // while the user is hovering/touching/using the arrows or dots, then
  // resumes a few seconds after they let go (identical shape to
  // FacultyCarousel's autoscroll so both feel consistent). Harmlessly a
  // no-op when there's nothing to scroll (single lab, or none yet).
  useEffect(() => {
    const timer = setInterval(() => {
      const el = labScrollRef.current;
      if (labAutoPaused || !el || el.scrollWidth <= el.clientWidth) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [labAutoPaused]);
  const pauseLabAutoTemporarily = () => {
    setLabAutoPaused(true);
    if (labResumeTimeoutRef.current) clearTimeout(labResumeTimeoutRef.current);
    labResumeTimeoutRef.current = setTimeout(() => setLabAutoPaused(false), 6000);
  };
  const scrollLabsBy = (direction: 1 | -1) => {
    const el = labScrollRef.current;
    if (!el) return;
    pauseLabAutoTemporarily();
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  };
  const scrollToLabIndex = (index: number) => {
    const el = labScrollRef.current;
    if (!el) return;
    pauseLabAutoTemporarily();
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  };
  const [activeHubTab, setActiveHubTab] = useState<'overview' | 'curriculum' | 'outcomes' | 'news' | 'newsletter' | 'rnd'>('overview');
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

  const { docs: allPrograms, loading: progLoading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const subPrograms = group.programSlugs
    .map((s) => allPrograms.find((p) => p.slug === s))
    .filter((p): p is ProgramDoc => !!p);
  const activeProgram = subPrograms.find((p) => p.slug === activeSlug);

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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
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
  if (!progLoading && !activeProgram) return <Navigate to="/academics" replace />;
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
    heroImage: dept?.heroImage || primary?.heroImage || activeProgram.heroImage || '',
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
  const placementStatsFull = placementYearStats?.averageSalary != null;
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
  // The institution-wide published figure is the authoritative one when it
  // exists for this Academic Year — the department's own uploaded sheet
  // (placementYearStats.totalOffers) is often a partial/in-progress count,
  // not the final published total, so this replaces the tile's number
  // outright rather than showing both side by side.
  const displayedTotalOffers = activeStaticBatch?.offers ?? placementYearStats?.totalOffers ?? 0;
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
      years: (sec.subSections || []).filter(hasCustomSectionContent).length > 0
        ? (sec.subSections || []).filter(hasCustomSectionContent).map((sub) => {
            const yearLabel = sub.label.replace(/^Academic Year\s*(::|:|-)?\s*/i, '').trim();
            const parsedTables = parseFlexibleTable(sub.tableText || '');
            const firstTable = parsedTables[0] || { headers: [], rows: [] };
            const mode: 'table' | 'cards' | 'text' | 'both' =
              firstTable.headers.length > 0 && (sub.imageCards?.length ?? 0) > 0
                ? 'both'
                : firstTable.headers.length > 0
                ? 'table'
                : (sub.imageCards?.length ?? 0) > 0
                ? 'cards'
                : 'text';
            return {
              year: yearLabel || sub.label,
              mode,
              columns: firstTable.headers,
              rows: firstTable.rows.map((cells) => ({ cells })),
              cards: sub.imageCards,
              text: sub.textContent,
            };
          })
        : [
            {
              year: sec.label.replace(/^Academic Year\s*(::|:|-)?\s*/i, '').trim() || sec.label,
              mode: 'table' as const,
              columns: parseFlexibleTable(sec.tableText || '')[0]?.headers || [],
              rows: (parseFlexibleTable(sec.tableText || '')[0]?.rows || []).map((cells) => ({ cells })),
              cards: sec.imageCards,
              text: sec.textContent,
            },
          ],
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

  // Quick Links sidebar — deliberately trimmed to one anchor per major
  // section rather than every sub-section (e.g. "Choose a Programme" covers
  // About the Programme / Highlights / PEOs,POs&PSOs / Mind Map / Curriculum,
  // which still render below the toggle for whichever programme is active —
  // they just don't each get their own sidebar entry).
  const quickLinks = [
    hasAbout && { id: 'about', label: 'Department Overview' },
    hasCoreValues && { id: 'vision-mission', label: 'Core Values' },
    subPrograms.length > 0 && { id: 'programmes', label: 'Degree Programmes' },
    (hasPlacements || hasInternships) && { id: 'placements', label: placementsLinkLabel },
    hasHod && { id: 'hod', label: 'Brief Profile' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    hasLabs && { id: 'labs', label: 'Laboratories' },
    subPrograms.length > 0 && { id: 'program-toggle', label: 'Programmes & Course Structure' },
  ].filter(Boolean) as { id: string; label: string }[];

  const heroImage = shared.heroImage;
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
      <SEO title={`${deptName} | Vishnu Women's University`} description={pageDesc} canonicalPath={pageUrl} ogImage={heroImage} jsonLd={jsonLd} />

      {/* Hero — same rounded image-card treatment for every department */}
      <section className="dept-hero-section">
        <div className="container">
          <div className="dept-hero-card">
            {heroImage && (
              <SmoothImage
                src={heroImage}
                alt={deptName}
                className="dept-hero-bg-img"
                loading="eager"
                decoding="sync"
                {...fetchPriorityAttr('high')}
              />
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

      {/* Key Facts Grid — Dynamically shows only cards with valid data */}
      {(() => {
        const deptEst = clean(dept?.established);
        const validEst = subPrograms.filter((p) => clean(p.established));
        const hasEstCard = !!deptEst || validEst.length > 0;

        const deptAcc = clean(dept?.accreditation);
        const validAcc = subPrograms.filter((p) => clean(p.accreditation));
        const hasAccCard = !!deptAcc || validAcc.length > 0;

        const validIntake = subPrograms.filter((p) => p.intake && p.intake > 0);
        const hasIntakeCard = validIntake.length > 0;

        const hasHodCard = !!shared.hod && shared.hod.trim() !== '—';

        const visibleCount = [hasEstCard, hasAccCard, hasIntakeCard, hasHodCard].filter(Boolean).length;
        if (visibleCount === 0) return null;

        return (
          <section className="dept-facts-section" aria-label={`${deptName} key facts`}>
            <div className="container">
              <div className={`dept-facts-grid cols-${visibleCount}`}>
                {/* 1. Established */}
                {hasEstCard && (
                  <div className="dept-fact-card">
                    <div className="dept-fact-header">
                      <div className="dept-fact-icon-badge">
                        <Calendar size={14} strokeWidth={2.4} />
                      </div>
                      <span className="dept-fact-col-title">Established</span>
                      {validEst.length > 1 && (
                        <span className="dept-fact-count-badge">{validEst.length}</span>
                      )}
                    </div>
                    <div className={`dept-fact-items-window${validEst.length > 2 ? ' is-scrolling' : ''}`}>
                      {validEst.length > 2 ? (
                        <div className="dept-fact-ticker-track" style={{ animationDuration: `${Math.max(6, validEst.length * 3.5)}s` }}>
                          {validEst.map((p) => (
                            <div key={`a-${p.id}`} className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                              <span className="dept-fact-chip-val">{clean(p.established)}</span>
                            </div>
                          ))}
                          {validEst.map((p) => (
                            <div key={`b-${p.id}`} className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                              <span className="dept-fact-chip-val">{clean(p.established)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="dept-fact-static-list">
                          {deptEst ? (
                            <div className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">{deptName}</span>
                              <span className="dept-fact-chip-val">{deptEst}</span>
                            </div>
                          ) : (
                            validEst.map((p) => (
                              <div key={p.id} className="dept-fact-chip-entry">
                                <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                                <span className="dept-fact-chip-val">{clean(p.established)}</span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Accreditations */}
                {hasAccCard && (
                  <div className="dept-fact-card">
                    <div className="dept-fact-header">
                      <div className="dept-fact-icon-badge">
                        <Award size={14} strokeWidth={2.4} />
                      </div>
                      <span className="dept-fact-col-title">Accreditations</span>
                      {validAcc.length > 1 && (
                        <span className="dept-fact-count-badge">{validAcc.length}</span>
                      )}
                    </div>
                    <div className={`dept-fact-items-window${validAcc.length > 2 ? ' is-scrolling' : ''}`}>
                      {validAcc.length > 2 ? (
                        <div className="dept-fact-ticker-track" style={{ animationDuration: `${Math.max(6, validAcc.length * 3.5)}s` }}>
                          {validAcc.map((p) => (
                            <div key={`a-${p.id}`} className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                              <span className="dept-fact-chip-val">{clean(p.accreditation)}</span>
                            </div>
                          ))}
                          {validAcc.map((p) => (
                            <div key={`b-${p.id}`} className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                              <span className="dept-fact-chip-val">{clean(p.accreditation)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="dept-fact-static-list">
                          {deptAcc ? (
                            <div className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">Department Accreditation</span>
                              <span className="dept-fact-chip-val">{deptAcc}</span>
                            </div>
                          ) : (
                            validAcc.map((p) => (
                              <div key={p.id} className="dept-fact-chip-entry">
                                <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                                <span className="dept-fact-chip-val">{clean(p.accreditation)}</span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Programme Intake */}
                {hasIntakeCard && (
                  <div className="dept-fact-card">
                    <div className="dept-fact-header">
                      <div className="dept-fact-icon-badge">
                        <Users size={14} strokeWidth={2.4} />
                      </div>
                      <span className="dept-fact-col-title">Programme Intake</span>
                      {validIntake.length > 1 && (
                        <span className="dept-fact-count-badge">{validIntake.length}</span>
                      )}
                    </div>
                    <div className={`dept-fact-items-window${validIntake.length > 2 ? ' is-scrolling' : ''}`}>
                      {validIntake.length > 2 ? (
                        <div className="dept-fact-ticker-track" style={{ animationDuration: `${Math.max(6, validIntake.length * 3.5)}s` }}>
                          {validIntake.map((p) => (
                            <div key={`a-${p.id}`} className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                              <span className="dept-fact-chip-val">{p.intake} Seats</span>
                            </div>
                          ))}
                          {validIntake.map((p) => (
                            <div key={`b-${p.id}`} className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                              <span className="dept-fact-chip-val">{p.intake} Seats</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="dept-fact-static-list">
                          {validIntake.map((p) => (
                            <div key={p.id} className="dept-fact-chip-entry">
                              <span className="dept-fact-chip-sub">{p.shortName || p.name}</span>
                              <span className="dept-fact-chip-val">{p.intake} Seats</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Head of Department */}
                {hasHodCard && (
                  <div className="dept-fact-card is-hod-card">
                    <div className="dept-fact-header">
                      <div className="dept-fact-icon-badge">
                        <GraduationCap size={14} strokeWidth={2.4} />
                      </div>
                      <span className="dept-fact-col-title">Head of the Department</span>
                    </div>
                    <div className="dept-fact-items-window">
                      <div className="dept-fact-static-list">
                        <a href="#hod" className="dept-fact-chip-link" aria-label={`View ${shared.hod} details`}>
                          <div className="dept-fact-chip-entry">
                            <span className="dept-fact-chip-sub">Professor &amp; HOD</span>
                            <span className="dept-fact-chip-val">{shared.hod}</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}
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
                      // "R & D" and "News & Events" now live as tabs inside
                      // the Programme Hub card rather than their own section
                      // — jump to the hub and switch to that tab instead.
                      if (l.id === 'rnd') setActiveHubTab('rnd');
                      else if (l.id === 'news-events') setActiveHubTab('news');
                      const scrollId = (l.id === 'rnd' || l.id === 'news-events') ? 'program-toggle' : l.id;
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
                  <span className="section-label dept-section-label">Department Overview</span>
                  <h2 className="section-title">
                    <span style={{ fontWeight: 400 }}>Welcome to </span>
                    <span style={{ fontWeight: 800 }}>{deptName}</span>
                  </h2>
                </div>

                <div className="dept-about-card">
                  <p className="dept-about-lead-text">
                    {shared.about}
                  </p>
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
        <section id="vision-mission" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span className="section-label dept-section-label">Our Guiding Pillars</span>
              <h2 className="section-title">Core Values</h2>
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

      {/* B.Tech & M.Tech Degree Programmes Offered (Compact Version) */}
      {subPrograms.length > 0 && (
        <section id="programmes" className="section bg-white dept-compact-programmes-section" style={{ scrollMarginTop: NAV_OFFSET, padding: '2.5rem 0' }}>
          <div className="container">
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span className="section-label dept-section-label" style={{ marginBottom: '0.2rem' }}>Academic Degrees</span>
                <h2 className="section-title" style={{ fontSize: '1.6rem', margin: 0 }}>Programmes Offered</h2>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-light)' }}>
                {subPrograms.length} Degree {subPrograms.length === 1 ? 'Programme' : 'Programmes'} Available
              </span>
            </div>

            <div className="dept-compact-program-grid">
              {subPrograms.map((program) => {
                const Icon = resolveProgramIcon(program.icon);
                const isBtech = program.category === 'btech';
                const isMtech = program.category === 'mtech';
                const catLabel = isBtech ? 'B.Tech' : isMtech ? 'M.Tech' : program.category?.toUpperCase() || 'Degree';

                return (
                  <div
                    key={program.id || program.slug}
                    className="dept-compact-program-card"
                    onClick={() => {
                      navigate(`/academics/${program.slug}#program-toggle`, { preventScrollReset: true });
                      setActiveHubTab('overview');
                    }}
                  >
                    <div className="dept-compact-card-header">
                      <div className="dept-compact-card-icon">
                        <Icon size={20} strokeWidth={2} />
                      </div>
                      <span className={`dept-compact-cat-badge ${isMtech ? 'is-mtech' : 'is-btech'}`}>
                        {catLabel}
                      </span>
                    </div>

                    <div className="dept-compact-card-body">
                      <h3 className="dept-compact-card-title">{program.name}</h3>
                      <div className="dept-compact-card-chips">
                        {program.intake && (
                          <span className="dept-compact-chip">
                            {program.intake} Seats
                          </span>
                        )}
                        {program.accreditation && program.accreditation !== '—' && (
                          <span className="dept-compact-chip is-accredited">
                            {program.accreditation}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="dept-compact-card-footer">
                      <span>Explore Programme</span>
                      <ArrowRight size={14} strokeWidth={2.4} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Placements & Internships — one "Careers" section; a tab bar only
          appears when a programme actually has both. Placed right after
          the department overview since it's the highest-intent content on
          this page. */}
      {(hasPlacements || hasInternships) && (
        <section id="placements" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span className="section-label dept-section-label">Careers</span>
              <h2 className="section-title">
                {hasPlacements && hasInternships ? 'Placements & Internships' : hasInternships ? 'Internships' : 'Placements'}
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', marginBottom: shared.placementRecruiters.length > 0 ? 'var(--space-8)' : 0 }}>
                {shared.placementStats.map((s, si) => (
                  <div key={si} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            {shared.placementRecruiters.length > 0 && (
              <div style={{ marginBottom: placementRows.length > 0 ? 'var(--space-8)' : 0 }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>
                  Our Recruiters
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {shared.placementRecruiters.map((r, ri) => (
                    <span key={ri} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-full)', padding: '0.35rem 0.9rem' }}>
                      {r}
                    </span>
                  ))}
                </div>
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
                      AY. {y.year}
                    </button>
                  ))}
                </div>
                {activePlacementYear && placementYearStats && (
                  <>
                    <p className="placement-stat-summary">
                      {activePlacementYear.year} Placements as on date: <strong>{displayedTotalOffers.toLocaleString()}</strong>
                    </p>
                    <div className={`dept-stat-grid${placementStatsFull ? ' dept-stat-grid--fill' : ''}`}>
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.companiesVisited}</span></div>
                        <div className="dept-stat-tile__label">No. of Companies Visited</div>
                      </div>
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{displayedTotalOffers}</span></div>
                        <div className="dept-stat-tile__label">Total No. of Offers</div>
                      </div>
                      <div className="dept-stat-tile">
                        <button
                          type="button"
                          className="dept-stat-tile__circle dept-stat-tile__circle--link"
                          onClick={() => document.getElementById('placement-records-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        >
                          <span className="dept-stat-tile__value">Package wise</span>
                        </button>
                        <div className="dept-stat-tile__label">Top 10 Companies List</div>
                      </div>
                      {/* computePlacementStats returns these as null when the
                          imported rows have no column that looks like a
                          package/CTC figure — hide the tile entirely rather
                          than showing a placeholder "—", since that read as a
                          broken/missing stat instead of "not applicable for
                          this year's data". */}
                      {placementYearStats.averageSalary != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.averageSalary}</span></div>
                          <div className="dept-stat-tile__label">Average Salary</div>
                        </div>
                      )}
                      {placementYearStats.medianSalary != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.medianSalary}</span></div>
                          <div className="dept-stat-tile__label">Median Salary</div>
                        </div>
                      )}
                      {placementYearStats.highestPackage != null && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.highestPackage}</span></div>
                          <div className="dept-stat-tile__label">Highest Package</div>
                        </div>
                      )}
                      {placementYearStats.above50Lpa > 0 && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.above50Lpa} offers</span></div>
                          <div className="dept-stat-tile__label">Above 50 LPA+</div>
                        </div>
                      )}
                      {placementYearStats.above30Lpa > 0 && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.above30Lpa} offers</span></div>
                          <div className="dept-stat-tile__label">Above 30 LPA+</div>
                        </div>
                      )}
                      {placementYearStats.above10Lpa > 0 && (
                        <div className="dept-stat-tile">
                          <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.above10Lpa} offers</span></div>
                          <div className="dept-stat-tile__label">Above 10 LPA+</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div id="placement-records-table" style={{ marginTop: 'var(--space-8)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <span className="section-label dept-section-label">Student Success</span>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0.2rem 0 0 0' }}>
                        Career Offers &amp; Recruiters ({activePlacementYear?.year})
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-accent)', background: 'rgba(201, 168, 76, 0.12)', border: '1px solid rgba(201, 168, 76, 0.3)', borderRadius: '9999px', padding: '0.3rem 0.85rem' }}>
                      {filteredPlacementRows.length} Verified Offers
                    </span>
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
              </div>
            )}
            {placementYears.length === 0 && staticDeptBatches.length > 0 && (
              <div>
                <div className="placement-year-pills" role="group" aria-label="Select academic year">
                  {staticDeptBatches.map((b) => (
                    <span key={b.batch} className="placement-year-pill">AY. {b.batch}</span>
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
                    <span className="section-label dept-section-label">Student Success</span>
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

      {/* About HOD — photo + name below it, plain message, Vision/Mission/
          Core Values folded in as individual accordion rows. */}
      {hasHod && (
        <section id="hod" className="dept-hod-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
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
            title="Learn from our impactful faculty"
            viewMoreLink="/faculty"
          />
        </div>
      )}

      {/* Laboratories — premium unified-card carousel, 40:60 text/image
          split, one slide visible at a time, auto-advancing. */}
      {hasLabs && (
        <section id="labs" className="dept-labs-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className="dept-labs-header">
              <div className="dept-labs-title-wrap">
                <span className="section-label dept-section-label">State-of-the-Art Infrastructure</span>
                <h2 className="section-title">Specialized Laboratories</h2>
                <p className="section-desc" style={{ margin: '0.5rem 0 0 0' }}>
                  Industry-aligned experimental facilities engineered for hands-on technical immersion, advanced computing, and multidisciplinary project incubation.
                </p>
              </div>
            </div>

            <div
              className="dept-lab-carousel"
              onMouseEnter={() => setLabAutoPaused(true)}
              onMouseLeave={() => setLabAutoPaused(false)}
              onTouchStart={() => setLabAutoPaused(true)}
              onTouchEnd={() => pauseLabAutoTemporarily()}
            >
              <div className="dept-lab-rows" ref={labScrollRef}>
                {shared.labs.map((lab, li) => (
                  <div key={li} className="dept-lab-slide">
                    <div className="dept-lab-slide-text">
                      <span className="dept-lab-slide-number">
                        {String(li + 1).padStart(2, '0')} / {String(shared.labs.length).padStart(2, '0')}
                      </span>
                      <Microscope size={26} strokeWidth={2} className="dept-lab-slide-icon" />
                      <h3 className="dept-lab-slide-title">{lab.name}</h3>
                      {lab.description && (
                        <p className="dept-lab-slide-desc">{lab.description}</p>
                      )}
                      {lab.pdfUrl && (
                        <a href={lab.pdfUrl} target="_blank" rel="noopener noreferrer" className="dept-lab-slide-cta">
                          <span>Explore Lab</span>
                          <ArrowRight size={15} strokeWidth={2.5} />
                        </a>
                      )}
                    </div>
                    <div className="dept-lab-slide-media">
                      <SmoothImage
                        src={lab.imageUrl || shared.heroImage}
                        alt={lab.name}
                        className="dept-lab-slide-img"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {shared.labs.length > 1 && (
                <div className="dept-lab-carousel-controls">
                  <div className="dept-lab-carousel-dots" role="tablist" aria-label="Laboratory slides">
                    {shared.labs.map((lab, li) => (
                      <button
                        key={lab.name + li}
                        type="button"
                        role="tab"
                        aria-selected={activeLabIndex === li}
                        aria-label={`Show ${lab.name}`}
                        className={`dept-lab-dot${activeLabIndex === li ? ' active' : ''}`}
                        onClick={() => scrollToLabIndex(li)}
                      />
                    ))}
                  </div>
                  <div className="dept-lab-carousel-arrows" role="group" aria-label="Laboratories carousel navigation">
                    <button
                      type="button"
                      className="dept-lab-carousel-arrow-btn"
                      onClick={() => scrollLabsBy(-1)}
                      disabled={!canScrollLabsLeft}
                      aria-label="Previous laboratory"
                    >
                      <ArrowLeft size={17} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      className="dept-lab-carousel-arrow-btn"
                      onClick={() => scrollLabsBy(1)}
                      disabled={!canScrollLabsRight}
                      aria-label="Next laboratory"
                    >
                      <ArrowRight size={17} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== Unified Programme Hub ===== */}
      <section id="program-toggle" className="programme-hub-section" style={{ scrollMarginTop: NAV_OFFSET }}>
        <div className="container">
          <div className="programme-hub-header">
            <span className="section-label dept-section-label" style={{ color: 'var(--color-accent)' }}>
              Choose a Programme
            </span>
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
              Academic Programmes &amp; Course Structure
            </h2>
            <p className="section-desc" style={{ maxWidth: '680px', margin: '0 auto 1.5rem' }}>
              Select a degree program below to explore its overview, curriculum structure, and outcome-based learning objectives.
            </p>

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
                <span>Overview &amp; Highlights</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeHubTab === 'curriculum'}
                className={`programme-hub-tab-btn${activeHubTab === 'curriculum' ? ' active' : ''}`}
                onClick={() => setActiveHubTab('curriculum')}
              >
                <GraduationCap size={17} strokeWidth={2.2} />
                <span>Curriculum &amp; Structure</span>
              </button>

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

              <button
                type="button"
                role="tab"
                aria-selected={activeHubTab === 'news'}
                className={`programme-hub-tab-btn${activeHubTab === 'news' ? ' active' : ''}`}
                onClick={() => setActiveHubTab('news')}
              >
                <Calendar size={17} strokeWidth={2.2} />
                <span>News &amp; Events</span>
              </button>

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

              <button
                type="button"
                role="tab"
                aria-selected={activeHubTab === 'rnd'}
                className={`programme-hub-tab-btn${activeHubTab === 'rnd' ? ' active' : ''}`}
                onClick={() => setActiveHubTab('rnd')}
              >
                <Microscope size={17} strokeWidth={2.2} />
                <span>Research &amp; Development</span>
              </button>
            </div>

            {/* Hub Body Content */}
            <div className="programme-hub-body">
              {activeHubTab === 'overview' && (
                <div className="programme-hub-grid">
                  {/* Left Column: About */}
                  <div className="programme-hub-about-col">
                    <span className="section-label dept-section-label">{activeProgram.shortName || activeProgram.name}</span>
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
                      <span className="section-label dept-section-label">Key Pillars</span>
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
                    <span className="section-label dept-section-label">Curriculum</span>
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

              {activeHubTab === 'outcomes' && !hasOutcomeStatements && HUB_TAB_EMPTY}
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

              {/* News & Events — moved into the hub so it shares this card's
                  tab bar instead of its own standalone section below. */}
              {activeHubTab === 'news' && !hasNewsEvents && HUB_TAB_EMPTY}
              {activeHubTab === 'news' && hasNewsEvents && (
                <NewsEventsTabs categories={newsEventsCategories} eyebrow={deptName} navOffset={NAV_OFFSET} embedded />
              )}

              {/* Department Newsletter & Publications — same move; the
                  standalone version's own collapsible header is redundant
                  once this is already gated behind a tab click. */}
              {activeHubTab === 'newsletter' && !hasNewsletter && HUB_TAB_EMPTY}
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
              {activeHubTab === 'rnd' && !hasRnd && HUB_TAB_EMPTY}
              {activeHubTab === 'rnd' && hasRnd && (
                <div>
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <span className="section-label dept-section-label">Research</span>
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
                                  <span className="dept-rnd-outcomes-title">Outcome</span>
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

      <CustomSectionsRenderer sections={visibleCustomSections} navOffset={NAV_OFFSET} />

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label dept-section-label" style={{ color: 'var(--color-accent)' }}>Apply Today</span>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Begin Your Journey in {deptName}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto var(--space-8)', lineHeight: 1.7 }}>
            Join a thriving academic community. Apply through AP EAPCET (Code: {eapcetCode}), explore our fee structure, or schedule a campus visit today.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admissions" className="btn btn-accent btn-lg">Apply via AP EAPCET</Link>
            <Link to="/programmes-fee-structure" className="btn btn-secondary btn-lg">Fee Structure</Link>
            <Link to="/academics" className="btn btn-secondary btn-lg">All Programmes</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
