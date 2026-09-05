import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Check, Microscope, Compass, Target, Sparkles, FileText, ChevronDown, ChevronRight, ArrowLeft, ArrowRight, User, Building2, BookOpen, GraduationCap, Award } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import ProgrammeStructure from '../../components/ProgrammeStructure/ProgrammeStructure';
import NewsEventsTabs, { type NewsEventsCategory } from '../../components/NewsEventsTabs/NewsEventsTabs';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import SEO from '../../components/SEO/SEO';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import type { PlacementItem } from '../../components/ui/marquee-01';
import { Marquee } from '../../components/ui/marquee-01-utils/marquee';
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
import { sortPlacementRows, computePlacementStats, findPackageColumnIndex, formatPackageCell } from '../../lib/placementRecords';
import { computeInternshipStats, findPeriodColumnIndex } from '../../lib/internshipRecords';
import { hasCustomSectionContent, toQuickLinkItems } from '../../lib/customSections';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import '../detail-layout.css';
import '../Campus/tabbed-section.css';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

// Photo-forward placement/internship card for the continuous-scroll strip
// below. The underlying records are a plain admin-imported spreadsheet
// (name/company/package columns) with no photo or logo field, so every
// card uses the same generic avatar + company-icon fallback rather than
// pretending to show a real photo.
function PlacementProfileCard({ name, company, package: pkg }: PlacementItem) {
  return (
    <div className="dept-profile-card">
      <div className="dept-profile-card-photo">
        <User size={44} strokeWidth={1.5} aria-hidden="true" />
        <span className="dept-profile-card-logo-badge" aria-hidden="true">
          <Building2 size={15} strokeWidth={2.2} />
        </span>
      </div>
      <div className="dept-profile-card-body">
        <h4 className="dept-profile-card-name">{name}</h4>
        <p className="dept-profile-card-role">Placed at {company}</p>
        <span className="dept-profile-card-package">{pkg}</span>
      </div>
    </div>
  );
}

// Marquee pace: fixed duration made the scroll visibly speed up on any
// department with more records (same time, wider track) — a per-card pace
// keeps it readable regardless of count. Mirrors marquee-01.tsx's own logic.
const SECONDS_PER_CARD = 5;
const MIN_DURATION_S = 45;
const rowDuration = (cardCount: number) => `${Math.max(MIN_DURATION_S, cardCount * SECONDS_PER_CARD)}s`;

function PlacementProfileMarquee({ records }: { records: PlacementItem[] }) {
  if (!records || records.length === 0) return null;
  const safeRecords = records.length < 8 ? [...records, ...records, ...records, ...records] : records;
  const half = Math.ceil(safeRecords.length / 2);
  const firstRow = safeRecords.slice(0, half);
  const secondRow = safeRecords.slice(half);

  return (
    <div className="marquee-container">
      <Marquee pauseOnHover style={{ ['--duration' as string]: rowDuration(firstRow.length) }}>
        {firstRow.map((rec, idx) => (
          <PlacementProfileCard key={`row1-${idx}-${rec.name}`} {...rec} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover style={{ ['--duration' as string]: rowDuration(secondRow.length) }}>
        {secondRow.map((rec, idx) => (
          <PlacementProfileCard key={`row2-${idx}-${rec.name}`} {...rec} />
        ))}
      </Marquee>
      <div className="marquee-fade-left" aria-hidden="true" />
      <div className="marquee-fade-right" aria-hidden="true" />
    </div>
  );
}

interface Props {
  group: DepartmentGroup;
  /** The currently-selected program slug (drives the toggle). */
  activeSlug: string;
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
  // Vision/Mission/Core Values — individual accordion rows inside the HOD
  // card (each starts closed; opening one doesn't close the others).
  const [openVMRows, setOpenVMRows] = useState<Set<string>>(new Set());
  const toggleVMRow = (key: string) => {
    setOpenVMRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  // "Choose a Programme" Quick Links accordion — starts open so the sub-links
  // remain visible by default (unchanged from before this was collapsible).
  const [programmeLinksOpen, setProgrammeLinksOpen] = useState(true);
  // Same collapsible treatment, one level deeper — a programmeLinks entry
  // with its own children (e.g. "Research & Development" built from
  // Publications/Patents/Funded Projects sub-sections) starts open, toggled
  // per id.
  const [collapsedQuickLinks, setCollapsedQuickLinks] = useState<Set<string>>(new Set());
  const toggleQuickLink = (id: string) => {
    setCollapsedQuickLinks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  // Which Academic Year's placement records are shown — falls back to the
  // active programme's first available year (see placementYears below).
  const [placementYear, setPlacementYear] = useState<string | null>(null);
  // Which Academic Year's internship records are shown — same pattern as
  // the Placements pair above.
  const [internshipYear, setInternshipYear] = useState<string | null>(null);
  // Placements/Internships now share one "Careers" section — this picks
  // which half shows when a programme has both (no tab bar at all when it
  // only has one).
  const [careerTab, setCareerTab] = useState<'placements' | 'internships'>('placements');
  // Laboratories carousel — one lab slide visible at a time, auto-advancing
  // (same auto-scroll + pause-on-interact pattern as FacultyCarousel), with
  // arrow buttons and dot indicators that also work manually.
  // Newsletter archive — collapsed by default, same pattern as other dense
  // reference sections on this page.
  const [newsletterExpanded, setNewsletterExpanded] = useState(false);
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
  const [activeHubTab, setActiveHubTab] = useState<'overview' | 'curriculum' | 'outcomes'>('overview');
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

  const deptName = dept?.title || activeProgram?.department || group.deptShortCode;

  useEffect(() => {
    document.title = `${deptName} | Vishnu Women's University`;
  }, [deptName]);

  // Re-scroll on every navigation that carries a hash (the program toggle
  // appends #program-toggle so switching sides lands you back at the toggle
  // instead of jumping to the top of the page via App's ScrollToTop).
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) smoothScrollTo(el);
  }, [location.key, location.hash, activeSlug, progLoading]);

  // Defaults the PEOs/POs/PSOs tab bar to whichever of the three actually
  // has admin-entered content for the active programme, once loaded.
  useEffect(() => {
    const firstAvailable = activeProgram?.peos?.length ? 'peos' : activeProgram?.wks?.length ? 'wks' : activeProgram?.pos?.length ? 'pos' : activeProgram?.psos?.length ? 'psos' : null;
    if (firstAvailable) setOutcomeTab((prev) => prev ?? firstAvailable);
  }, [activeProgram?.peos?.length, activeProgram?.pos?.length, activeProgram?.psos?.length, activeProgram?.wks?.length]);

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
  const hasVisionMission = !!(shared.vision || shared.mission.length || shared.coreValues.length);
  const hasLabs = shared.labs.length > 0;
  const hasAbout = !!shared.about;
  const hasDeptHighlights = shared.highlights.length > 0;
  // Individual student Placement Records — admin-imported from Excel/CSV per
  // Academic Year (see PlacementYearsEditor in ProgramsAdmin.tsx), stored
  // directly on this specific programme's own doc (`activeProgram`), so
  // switching the toggle above shows that programme's own years, never
  // another programme's or the whole department's. Falls back to the first
  // available year whenever nothing's been explicitly picked yet, or the
  // previously-picked year doesn't exist for whichever programme is active.
  const placementYears = activeProgram.placementYears || [];
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
  const hasPlacements = !!(shared.placementIntro || shared.placementStats.length > 0 || shared.placementRecruiters.length > 0 || placementYears.length > 0);

  const placementNameIdx = placementColumns.findIndex((c) => /name|student|candidate/i.test(c));
  const placementCompIdx = placementColumns.findIndex((c) => /company|organization|employer|recruiter/i.test(c));
  const placementMarqueeItems: PlacementItem[] = placementRows.map((row) => {
    const rawName = placementNameIdx >= 0 ? row.cells[placementNameIdx] : (row.cells[1] || row.cells[0]);
    const rawComp = placementCompIdx >= 0 ? row.cells[placementCompIdx] : (row.cells[2] || 'Leading Recruiter');
    const rawPkg = placementPkgIdx >= 0 ? formatPackageCell(row.cells[placementPkgIdx] ?? '') : (row.cells[3] || '');
    return {
      name: rawName?.trim() || 'Student Scholar',
      company: rawComp?.trim() || 'Top Corporation',
      package: rawPkg ? (rawPkg.toLowerCase().includes('lpa') ? rawPkg : `${rawPkg} LPA`) : 'High Impact CTC',
    };
  });

  // Individual student Internship Records — same shape/pattern as the
  // Placement Records above (see InternshipYearsEditor in ProgramsAdmin.tsx),
  // just for internships instead of placements.
  const internshipYears = activeProgram.internshipYears || [];
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
      { key: 'news', label: 'News & Events', years: validYears(dept?.newsEventsYears?.length ? dept.newsEventsYears : subPrograms.map((p) => p.newsEventsYears).find((arr) => arr && arr.length > 0)) },
      { key: 'awards', label: 'Student Awards', years: validYears(dept?.studentAwardsYears) },
      { key: 'others', label: 'Others', years: validYears(dept?.othersYears) },
    ].filter((c) => c.years.length > 0);
  }

  const hasNewsEvents = newsEventsCategories.length > 0;
  const newsletterYears = (activeProgram.newsletterYears || []).filter((y) => y.year && y.issues && y.issues.length > 0);
  const hasNewsletter = newsletterYears.length > 0;
  const newsletterMaxIssues = Math.max(0, ...newsletterYears.map((y) => y.issues.length));
  // Research & Development (Funded Projects & Patents) — same per-programme
  // field as the standalone ProgramDetail.tsx page (ProgramsAdmin's "Research
  // & Development" editor); a link only appears once it has both a name and
  // an uploaded PDF.
  const rndLinks = (activeProgram.rndLinks || []).filter((l) => l.label && l.pdfUrl);
  const rndTableSections = parseFlexibleTable(activeProgram.rndTableText || '').filter((s) => s.headers.length > 0);
  const rndProjectCategories = parseProjectAccordion(activeProgram.rndProjectsText || '').filter((c) => c.projects.length > 0);
  const rndStructuredColumns = activeProgram.rndStructuredTable?.columns || [];
  const rndStructuredRows = activeProgram.rndStructuredTable?.rows || [];
  const hasRndStructuredTable = rndStructuredColumns.length > 0 && rndStructuredRows.length > 0;
  const hasRnd = !!activeProgram.rndIntro || rndTableSections.length > 0 || rndProjectCategories.length > 0 || rndLinks.length > 0 || hasRndStructuredTable;
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
    hasAbout && { id: 'about', label: 'About the Department' },
    (hasPlacements || hasInternships) && { id: 'placements', label: placementsLinkLabel },
    hasHod && { id: 'hod', label: 'About HOD' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    hasLabs && { id: 'labs', label: 'Laboratories' },
    subPrograms.length > 0 && { id: 'program-toggle', label: 'Programmes & Structure' },
    hasRnd && { id: 'rnd', label: 'R & D' },
    hasNewsEvents && { id: 'news-events', label: 'News & Events' },
  ].filter(Boolean) as { id: string; label: string }[];

  const programmeLinks = [
    ...toQuickLinkItems(visibleCustomSections),
  ].filter(Boolean) as { id: string; label: string; children?: { id: string; label: string }[] }[];

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
                {activeSlug === 'cse' ? 'Program your future today to script the world of tomorrow!' : pageDesc}
              </p>
              <div className="dept-hero-cta">
                <Link to="/admissions" className="btn-hero-gold">Apply Now</Link>
                {activeSlug === 'cse' && (
                  <a
                    href="/downloads/CSE_Brochure.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hero-outline"
                  >
                    Download Brochure
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Jump Bar — accessible 1-touch section navigation on smaller screens */}
      {quickLinks.length > 1 && (
        <nav className="dept-mobile-jump-bar-root" aria-label="Section Quick Jump">
          <div className="container">
            <div className="dept-mobile-jump-bar" role="navigation">
              <span className="dept-mobile-jump-label">
                <Compass size={13} strokeWidth={2.4} />
                <span>Jump to:</span>
              </span>
              {quickLinks.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className="dept-mobile-jump-chip"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* About the Department (shared) + Quick Links */}
      {hasAbout && (
        <section id="about" className="section bg-white dept-about-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className={quickLinks.length > 1 ? 'detail-grid' : ''}>
              <div className="dept-about-main">
                <div className="dept-about-header">
                  <span className="section-label dept-section-label">Department Overview</span>
                  <h2 className="section-title">
                    <span style={{ fontWeight: 400 }}>Welcome to </span>
                    <span style={{ fontWeight: 800 }}>{deptName}</span>
                  </h2>
                </div>

                <div className="dept-about-card">
                  {(shared.established || shared.accreditation || shared.hod || subPrograms.length > 0) && (
                    <div className="dept-about-stats">
                      {shared.established && (
                        <div className="dept-about-stat">
                          <span className="dept-about-stat-value">{shared.established}</span>
                          <span className="dept-about-stat-label">Established</span>
                        </div>
                      )}
                      {shared.accreditation && (
                        <div className="dept-about-stat">
                          <span className="dept-about-stat-value">{shared.accreditation}</span>
                          <span className="dept-about-stat-label">Accreditation</span>
                        </div>
                      )}
                      {shared.hod && (
                        hasHod ? (
                          <a href="#hod" className="dept-about-stat dept-about-stat--link">
                            <span className="dept-about-stat-value">{shared.hod}</span>
                            <span className="dept-about-stat-label">Head of Department</span>
                          </a>
                        ) : (
                          <div className="dept-about-stat">
                            <span className="dept-about-stat-value">{shared.hod}</span>
                            <span className="dept-about-stat-label">Head of Department</span>
                          </div>
                        )
                      )}
                      {subPrograms.length > 0 && (
                        <div className="dept-about-stat">
                          <span className="dept-about-stat-value">{subPrograms.length}</span>
                          <span className="dept-about-stat-label">Programmes Offered</span>
                        </div>
                      )}
                    </div>
                  )}
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

              {quickLinks.length > 1 && (
                <aside className="detail-sidebar" aria-label="Page Navigation Sidebar">
                  <nav className="dept-quick-nav-card" aria-label="Quick Links">
                    <div className="dept-quick-nav-header">
                      <div className="dept-quick-nav-icon">
                        <Compass size={15} strokeWidth={2.4} />
                      </div>
                      <div className="dept-quick-nav-title-wrap">
                        <h4 className="dept-quick-nav-title">Quick Navigation</h4>
                      </div>
                    </div>

                    <ul className="dept-quick-nav-list" role="list">
                      {quickLinks.map((l) => (
                        l.id === 'program-toggle' ? (
                          <li key={l.id} className="dept-quick-nav-item is-parent">
                            <button
                              type="button"
                              onClick={() => setProgrammeLinksOpen((v) => !v)}
                              aria-expanded={programmeLinksOpen}
                              aria-controls="programme-quick-links"
                              className="dept-quick-nav-toggle-btn"
                            >
                              <span className="dept-quick-nav-text">{l.label}</span>
                              <ChevronDown
                                size={14}
                                strokeWidth={2.4}
                                className={`dept-quick-nav-chevron${programmeLinksOpen ? ' is-open' : ''}`}
                                aria-hidden="true"
                              />
                            </button>
                            <SmoothCollapse open={programmeLinksOpen}>
                              <ul id="programme-quick-links" className="dept-quick-sublinks-list" role="list">
                                {programmeLinks.map((c) => {
                                  const hasKids = !!c.children?.length;
                                  const isSubOpen = !collapsedQuickLinks.has(c.id);
                                  return (
                                    <li key={c.id}>
                                      {hasKids ? (
                                        <button
                                          type="button"
                                          onClick={() => toggleQuickLink(c.id)}
                                          aria-expanded={isSubOpen}
                                          className="dept-quick-nav-toggle-btn"
                                        >
                                          <span className="dept-quick-nav-text">{c.label}</span>
                                          <ChevronDown
                                            size={12}
                                            strokeWidth={2.4}
                                            className={`dept-quick-nav-chevron${isSubOpen ? ' is-open' : ''}`}
                                            aria-hidden="true"
                                          />
                                        </button>
                                      ) : (
                                        <a href={`#${c.id}`} className="dept-quick-sublink">
                                          <ChevronRight size={11} strokeWidth={2.8} className="dept-quick-sublink-bullet" aria-hidden="true" />
                                          <span>{c.label}</span>
                                        </a>
                                      )}
                                      {hasKids && (
                                        <SmoothCollapse open={isSubOpen}>
                                          <ul className="dept-quick-sublinks-list" role="list">
                                            {c.children!.map((gc) => (
                                              <li key={gc.id}>
                                                <a href={`#${gc.id}`} className="dept-quick-sublink">
                                                  <ChevronRight size={11} strokeWidth={2.8} className="dept-quick-sublink-bullet" aria-hidden="true" />
                                                  <span>{gc.label}</span>
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </SmoothCollapse>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </SmoothCollapse>
                          </li>
                        ) : (
                          <li key={l.id} className="dept-quick-nav-item">
                            <a href={`#${l.id}`} className="dept-quick-nav-link">
                              <span className="dept-quick-nav-text">{l.label}</span>
                              <ChevronRight size={14} strokeWidth={2.4} className="dept-quick-nav-arrow" aria-hidden="true" />
                            </a>
                          </li>
                        )
                      ))}
                    </ul>
                  </nav>
                </aside>
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
                      {activePlacementYear.year} Placements as on date: <strong>{placementYearStats.totalOffers.toLocaleString()}</strong>
                    </p>
                    <div className="dept-stat-grid">
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.companiesVisited}</span></div>
                        <div className="dept-stat-tile__label">No. of Companies Visited</div>
                      </div>
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.totalOffers}</span></div>
                        <div className="dept-stat-tile__label">Total No. of Offers</div>
                      </div>
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.medianSalary ?? '—'}</span></div>
                        <div className="dept-stat-tile__label">Median Salary</div>
                      </div>
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.highestPackage ?? '—'}</span></div>
                        <div className="dept-stat-tile__label">Highest Package</div>
                      </div>
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
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.above10Lpa} offers</span></div>
                        <div className="dept-stat-tile__label">Above 10 LPA+</div>
                      </div>
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
                      {placementRows.length} Verified Offers
                    </span>
                  </div>

                  {placementMarqueeItems.length > 0 ? (
                    <PlacementProfileMarquee records={placementMarqueeItems} />
                  ) : (
                    <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', padding: '1.5rem 0' }}>
                      No placement records uploaded yet for {activePlacementYear?.year}.
                    </p>
                  )}
                </div>
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
                  <PlacementProfileMarquee records={internshipMarqueeItems} />
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
                      <div className="dept-hod-meta">Head of the Department &amp; Senior Faculty</div>
                    </div>
                  )}
                </div>
              )}

              <div className="dept-hod-content">
                <h2 className="dept-hod-message-title">A Message from the HOD</h2>

                {shared.hodMessage && (
                  <p className="dept-hod-message-text-plain">{shared.hodMessage}</p>
                )}

                {hasVisionMission && (
                  <div className="dept-vm-accordion">
                    {shared.vision && (
                      <div className={`dept-vm-accordion-row${openVMRows.has('vision') ? ' open' : ''}`}>
                        <button
                          type="button"
                          className="dept-vm-accordion-trigger"
                          onClick={() => toggleVMRow('vision')}
                          aria-expanded={openVMRows.has('vision')}
                        >
                          <span className="dept-vm-accordion-icon"><Compass size={16} strokeWidth={2.2} /></span>
                          <span className="dept-vm-accordion-label">Vision</span>
                          <ChevronDown size={18} strokeWidth={2.2} className="dept-vm-accordion-chevron" aria-hidden="true" />
                        </button>
                        <SmoothCollapse open={openVMRows.has('vision')}>
                          <p className="dept-vm-accordion-body">{shared.vision}</p>
                        </SmoothCollapse>
                      </div>
                    )}

                    {shared.mission && shared.mission.length > 0 && (
                      <div className={`dept-vm-accordion-row${openVMRows.has('mission') ? ' open' : ''}`}>
                        <button
                          type="button"
                          className="dept-vm-accordion-trigger"
                          onClick={() => toggleVMRow('mission')}
                          aria-expanded={openVMRows.has('mission')}
                        >
                          <span className="dept-vm-accordion-icon"><Target size={16} strokeWidth={2.2} /></span>
                          <span className="dept-vm-accordion-label">Mission</span>
                          <ChevronDown size={18} strokeWidth={2.2} className="dept-vm-accordion-chevron" aria-hidden="true" />
                        </button>
                        <SmoothCollapse open={openVMRows.has('mission')}>
                          <ul className="dept-vm-mission-list">
                            {shared.mission.map((m, mi) => (
                              <li key={mi} className="dept-vm-mission-item">
                                <span className="dept-vm-bullet-circle">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </SmoothCollapse>
                      </div>
                    )}

                    {shared.coreValues && shared.coreValues.length > 0 && (
                      <div className={`dept-vm-accordion-row${openVMRows.has('values') ? ' open' : ''}`}>
                        <button
                          type="button"
                          className="dept-vm-accordion-trigger"
                          onClick={() => toggleVMRow('values')}
                          aria-expanded={openVMRows.has('values')}
                        >
                          <span className="dept-vm-accordion-icon"><Sparkles size={16} strokeWidth={2.2} /></span>
                          <span className="dept-vm-accordion-label">Core Values</span>
                          <ChevronDown size={18} strokeWidth={2.2} className="dept-vm-accordion-chevron" aria-hidden="true" />
                        </button>
                        <SmoothCollapse open={openVMRows.has('values')}>
                          <div className="dept-values-chips-wrap dept-vm-accordion-body">
                            {shared.coreValues.map((v, vi) => (
                              <span key={vi} className="dept-value-pill">
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                                <span>{v}</span>
                              </span>
                            ))}
                          </div>
                        </SmoothCollapse>
                      </div>
                    )}
                  </div>
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
              Academic Programmes &amp; Structure
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
                      navigate(`/academics/${p.slug}#program-toggle`);
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
            </div>
          </div>
        </div>
      </section>

      {/* News & Events — Compact Collapsible Academic-Year List */}
      {hasNewsEvents && <NewsEventsTabs categories={newsEventsCategories} eyebrow={deptName} navOffset={NAV_OFFSET} />}

      {/* Newsletter (per programme) — a compact table (Year × Issue), not
          cards: every issue is just a PDF link with no distinguishing
          content of its own, so a repeated-card grid only adds height
          without adding information — a dense table scales to many years
          without turning into a multi-thousand-pixel scroll. */}
      {hasNewsletter && (
        <section id="newsletter" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <button
              type="button"
              className="dept-outcomes-toggle"
              onClick={() => setNewsletterExpanded((v) => !v)}
              aria-expanded={newsletterExpanded}
              aria-controls="newsletter-panel-wrap"
            >
              <div>
                <span className="section-label dept-section-label">{activeProgram.shortName || activeProgram.name}</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Department Newsletter &amp; Publications</h2>
              </div>
              <ChevronDown
                size={22}
                strokeWidth={2.2}
                className={`dept-outcomes-toggle-chevron${newsletterExpanded ? ' is-open' : ''}`}
                aria-hidden="true"
              />
            </button>
            <SmoothCollapse open={newsletterExpanded}>
              <div id="newsletter-panel-wrap" style={{ paddingTop: 'var(--space-6)' }}>
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
            </SmoothCollapse>
          </div>
        </section>
      )}

      {/* Research & Development (Funded Projects & Patents) (per programme) —
          real department R&D pages vary a lot in shape, so this renders
          whichever of the four admin fields are filled in: an overview
          paragraph, table(s), detailed project/patent cards, and/or a flat
          PDF link list — same three-format system as the site-wide Research
          pages (see ResearchDetail.tsx / ResearchItemsAdmin.tsx). */}
      {hasRnd && (
        <section id="rnd" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">Research</span>
              <h2 className="section-title">Research &amp; Development (Funded Projects &amp; Patents)</h2>
            </div>
            {activeProgram.rndIntro && (
              <p className="dept-rnd-intro">{activeProgram.rndIntro}</p>
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
                    const key = `${ci}-${pi}`;
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
        </section>
      )}

      <CustomSectionsRenderer sections={visibleCustomSections} navOffset={NAV_OFFSET} />

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label dept-section-label" style={{ color: 'var(--color-accent)' }}>Apply Today</span>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Begin Your Journey in {activeProgram.shortName || activeProgram.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto var(--space-8)', lineHeight: 1.7 }}>
            Join a thriving academic community. Apply through EAPCET (Code: {eapcetCode}), explore our fee structure, or schedule a campus visit today.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admissions" className="btn btn-accent btn-lg">Apply via EAPCET</Link>
            <Link to="/programmes-fee-structure" className="btn btn-secondary btn-lg">Fee Structure</Link>
            <Link to="/academics" className="btn btn-secondary btn-lg">All Programmes</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
