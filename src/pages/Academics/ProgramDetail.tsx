import { useEffect, useState } from 'react';
import { Link, useParams, useLocation, Navigate } from 'react-router-dom';
import { Check, Microscope, Compass, Mail, ExternalLink, BookOpen, FileText, ChevronRight, ChevronDown, GraduationCap, Calendar, Award, Users, ArrowRight, BookMarked, Bookmark, Library } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import ProgrammeStructure from '../../components/ProgrammeStructure/ProgrammeStructure';
import BodyBlocks, { parseBodyContent } from '../../components/BodyBlocks/BodyBlocks';
import DepartmentNewsSection, { type DepartmentNewsDoc } from '../../components/DepartmentNews/DepartmentNewsSection';
import NewsEventsTabs, { type NewsEventsCategory } from '../../components/NewsEventsTabs/NewsEventsTabs';
import DepartmentDetail from './DepartmentDetail';
import StandaloneDepartmentDetail from './StandaloneDepartmentDetail';
import { groupForProgramSlug, standaloneDepartmentForSlug } from '../../lib/departmentGroups';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import TestimonialMarquee, { type PlacementItem } from '../../components/ui/marquee-01';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanner } from '../../hooks/usePageBanner';
import { useEapcetCode } from '../../hooks/useContentBlocks';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { normalizeLab, normalizeMindMapImages, type ProgramDoc, type NewsEventsYear, type LabItem } from '../Admin/sections/ProgramsAdmin';
import LabDialog from '../../components/LabDialog/LabDialog';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { FacultyDoc } from './Faculty';
import { parseFlexibleTable, parseProjectAccordion } from '../../lib/structuredTable';
import { sortPlacementRows, computePlacementStats, findPackageColumnIndex, formatPackageCell } from '../../lib/placementRecords';
import { computeInternshipStats, findPeriodColumnIndex } from '../../lib/internshipRecords';
import { hasCustomSectionContent, toQuickLinkItems } from '../../lib/customSections';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import SEO from '../../components/SEO/SEO';
import { getProgramSchema, getBreadcrumbSchema } from '../../lib/seo/schemas';
import '../detail-layout.css';
import '../Campus/tabbed-section.css';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

const categoryLabel: Record<string, string> = {
  btech: 'B.Tech',
  mtech: 'M.Tech',
  mba: 'MBA',
  phd: 'Ph.D.',
};

export default function ProgramDetail() {
  // AI / CSE / ECE are "grouped" departments whose sub-program slugs render a
  // shared department page with a program toggle instead of this standalone
  // view (see src/lib/departmentGroups.ts). Every other slug falls through.
  const { slug } = useParams<{ slug: string }>();
  const group = groupForProgramSlug(slug);
  if (group) return <DepartmentDetail group={group} activeSlug={slug!} />;
  const standalone = standaloneDepartmentForSlug(slug);
  if (standalone) return <StandaloneDepartmentDetail dept={standalone} />;
  return <SingleProgramDetail />;
}

function SingleProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [outcomeTab, setOutcomeTab] = useState<string | null>(null);
  const [placementYear, setPlacementYear] = useState<string | null>(null);
  // Which Academic Year's internship records are shown — same pattern as
  // the Placements pair above.
  const [internshipYear, setInternshipYear] = useState<string | null>(null);
  const [activeLab, setActiveLab] = useState<LabItem | null>(null);
  const [openRndProjects, setOpenRndProjects] = useState<Set<string>>(new Set());
  const toggleRndProject = (key: string) => {
    setOpenRndProjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  // Quick Links entries with children (an admin section built from
  // sub-sections, e.g. Publications/Patents/Funded Projects under "Research
  // & Development") collapse the same way "Choose a Programme" does on the
  // Department page — starts open, toggled per id.
  const [collapsedQuickLinks, setCollapsedQuickLinks] = useState<Set<string>>(new Set());
  const toggleQuickLink = (id: string) => {
    setCollapsedQuickLinks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const { docs: allPrograms, loading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const program = allPrograms.find((p) => p.slug === slug);

  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const faculty = program?.department ? allFaculty.filter((f) => f.department === program.department) : [];
  const { docs: deptNews } = useOrderedCollection<DepartmentNewsDoc>('departmentNews', 'date', 'desc');
  const hasDeptNews = deptNews.some((n) => n.program === slug);
  // Resolves the program's short `department` code (e.g. "IT") to its full
  // Academic Departments admin record — used for the "About the Department"
  // heading below (reading the same way it does on the AI/CSE/ECE grouped
  // page) and, further down, as the source for Vision/Mission/Values,
  // Laboratories, and the Department Library (see `shared` below). A couple
  // of legacy programs spell their department out in prose ("Civil",
  // "Mechanical") rather than the admin's short code ("CE", "ME") — this
  // alias table is the only place that mismatch needs correcting.
  const DEPT_CODE_ALIASES: Record<string, string> = { Civil: 'CE', Mechanical: 'ME' };
  const { docs: allDepartments, loading: deptLoading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const deptCode = DEPT_CODE_ALIASES[program?.department || ''] || program?.department || '';
  const dept = allDepartments.find((d) => d.shortCode?.trim().toUpperCase() === deptCode.trim().toUpperCase());
  const deptTitle = dept?.title || program?.department;
  // Falls back to a shared "Program Pages" banner (Hero Banners admin) only
  // when this specific program hasn't had its own image uploaded yet via
  // the Programs admin section — that per-program image always wins.
  const fallbackBanner = usePageBanner('program-detail');
  const eapcetCode = useEapcetCode();

  useEffect(() => {
    if (program) {
      document.title = `${program.shortName || program.name} | Vishnu Women's University`;
    }
  }, [program]);

  // Content (and the #hod / #faculty / etc. anchors within it) only exists in the DOM
  // once `program` has loaded — a plain useHashScroll() keyed on location.hash alone
  // would fire before that and never re-run once the section actually mounts.
  useEffect(() => {
    if (!program || !location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) smoothScrollTo(el);
  }, [program, location.hash]);

  // Defaults the PEOs/POs/PSOs tab bar to whichever of the three actually
  // has admin-entered content, once the data has loaded — same "default to
  // first available, don't fight a deliberate selection" pattern as
  // FacultyProfile's Profile Sections tabs.
  useEffect(() => {
    const firstAvailable = program?.peos?.length ? 'peos' : program?.wks?.length ? 'wks' : program?.pos?.length ? 'pos' : program?.psos?.length ? 'psos' : null;
    if (firstAvailable) setOutcomeTab((prev) => prev ?? firstAvailable);
  }, [program?.peos?.length, program?.pos?.length, program?.psos?.length, program?.wks?.length]);

  // Also wait on the department lookup: rendering before it resolves would
  // show the raw department code and then flash to the full title once
  // `allDepartments` loads (e.g. "IT" -> "Information Technology").
  if (loading || deptLoading) {
    return (
      <RouteFallback />
    );
  }
  if (!program) return <Navigate to="/academics" replace />;

  // Vision/Mission/Values, Laboratories, and the Department Library describe
  // the whole department, not one specific programme — they're no longer
  // editable on the Programs admin, only on the matching Academic
  // Departments card (see DepartmentsAdmin.tsx). Falls back to this
  // programme's own (now admin-hidden, but still intact) field so nothing
  // goes blank for a department that hasn't had this copied over yet — see
  // DepartmentsAdmin's "Copy from Programs" action.
  const shared = {
    vision: dept?.vision || program.vision || '',
    mission: (dept?.mission?.length ? dept.mission : program.mission) || [],
    coreValues: (dept?.coreValues?.length ? dept.coreValues : program.coreValues) || [],
    labs: ((dept?.labs?.length ? dept.labs : program.labs) || []).map(normalizeLab),
    libraryIntro: dept?.libraryIntro || program.libraryIntro || '',
    libraryInCharge: dept?.libraryInCharge || program.libraryInCharge || '',
    librarySections: (dept?.librarySections?.length ? dept.librarySections : program.librarySections) || [],
    // A department has one Head of Department, not one per programme — same
    // department-first, programme-fallback rule as everything else above.
    hod: dept?.hod || program.hod || '',
    hodImage: dept?.hodImage || program.hodImage || '',
    hodEmail: dept?.hodEmail || program.hodEmail || '',
    hodMessage: dept?.hodMessage || program.hodMessage || '',
    hodResearchProfiles: (dept?.hodResearchProfiles?.length ? dept.hodResearchProfiles : program.hodResearchProfiles) || [],
  };

  const hasVisionMission = !!(shared.vision || shared.mission.length || shared.coreValues.length);
  // Tabbed PEOs / POs / PSOs — only whichever of the three an admin has
  // actually filled in (via /admin → Programs) becomes a tab; entirely
  // data-driven, nothing hardcoded here beyond the three possible labels.
  const outcomeGroups = [
    { key: 'peos', short: 'PEOs', title: 'Programme Educational Objectives (PEOs)', items: program.peos },
    { key: 'wks', short: 'WKs', title: 'Knowledge Profile (WKs)', items: program.wks },
    { key: 'pos', short: 'POs', title: 'Programme Outcomes (POs)', items: program.pos },
    { key: 'psos', short: 'PSOs', title: 'Programme Specific Outcomes (PSOs)', items: program.psos },
  ].filter((g) => g.items && g.items.length > 0);
  const hasOutcomeStatements = outcomeGroups.length > 0;
  const activeOutcome = outcomeGroups.find((g) => g.key === outcomeTab) ?? outcomeGroups[0];
  // Section heading + sidebar label list only whichever of PEOs/POs/PSOs/WKs
  // this programme actually has content for (e.g. "PEOs, POs & PSOs" when
  // there's no WKs data yet), instead of a fixed "...& WKs" that would claim
  // content the programme doesn't have.
  const outcomeShortLabels = outcomeGroups.map((g) => g.short);
  const outcomeHeading = outcomeShortLabels.length > 1
    ? `${outcomeShortLabels.slice(0, -1).join(', ')} & ${outcomeShortLabels[outcomeShortLabels.length - 1]}`
    : outcomeShortLabels[0] || '';
  const hasHod = !!(shared.hodMessage || shared.hodImage || shared.hodEmail || shared.hod);
  // Legacy docs may still store a single mindMapImage — normalizeMindMapImages()
  // upgrades either shape to the gallery array so this page never has to care.
  const mindMapImages = normalizeMindMapImages(program);
  const hasMindMap = mindMapImages.length > 0 || !!program.mindMapPdfUrl;
  const labs = shared.labs;
  const hasLabs = labs.length > 0;
  const hasCareerOutcomes = !!(program.outcomes && program.outcomes.length > 0);
  const hasCurriculum = !!(program.semesters && program.semesters.length > 0);
  // Every section is entirely admin-defined — heading and items alike — so
  // different departments can show completely different Digital Library
  // content. A section with no items yet just doesn't render a table for it.
  const libraryTables = shared.librarySections.filter((sec) => sec.items && sec.items.length > 0);
  const hasLibrary = !!(shared.libraryIntro || shared.libraryInCharge || libraryTables.length > 0);
  // A year counts once it has a label and at least one issue slot (even an
  // issue with no PDF yet still renders, just as "Unavailable" — this lets
  // an admin scaffold a year's issues ahead of uploading each PDF).
  // News & Events — department-wide like Vision/Labs/Library above, read
  // from the same matching `dept`. The "News & Events" heading itself is
  // fixed (see NewsEventsSubtree below); what's under it is a dynamic,
  // admin-defined list of named sections (dept.newsEventsSections — any
  // number, any content type — see DepartmentsAdmin.tsx), since a
  // programme like MBA has entirely different categories (Events, Budget
  // Sessions, …) than an engineering department's old fixed "News & Events
  // / Student Awards / Others". A department not yet opened in the new
  // Admin falls back to those old fixed arrays instead, rendered the same
  // way they always were, so nothing already published goes blank.
  // Independent of the simpler departmentNews-collection-based section
  // below — a programme only ends up with both showing if an admin fills
  // in both.
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
      { key: 'news', label: 'News & Events', years: validYears(dept?.newsEventsYears?.length ? dept.newsEventsYears : program.newsEventsYears) },
      { key: 'awards', label: 'Student Awards', years: validYears(dept?.studentAwardsYears) },
      { key: 'others', label: 'Others', years: validYears(dept?.othersYears) },
    ].filter((c) => c.years.length > 0);
  }

  const hasNewsEventsYears = newsEventsCategories.length > 0;
  const newsletterYears = (program.newsletterYears || []).filter((y) => y.year && y.issues && y.issues.length > 0);
  const hasNewsletter = newsletterYears.length > 0;
  const newsletterMaxIssues = Math.max(0, ...newsletterYears.map((y) => y.issues.length));
  // Only links with both a name and an uploaded PDF are shown — a link
  // an admin has started naming but not yet uploaded a PDF for stays
  // invisible rather than rendering a dead/empty link.
  const rndLinks = (program.rndLinks || []).filter((l) => l.label && l.pdfUrl);
  const rndTableSections = parseFlexibleTable(program.rndTableText || '').filter((s) => s.headers.length > 0);
  const rndProjectCategories = parseProjectAccordion(program.rndProjectsText || '').filter((c) => c.projects.length > 0);
  const rndStructuredColumns = program.rndStructuredTable?.columns || [];
  const rndStructuredRows = program.rndStructuredTable?.rows || [];
  const hasRndStructuredTable = rndStructuredColumns.length > 0 && rndStructuredRows.length > 0;
  const hasRnd = !!program.rndIntro || rndTableSections.length > 0 || rndProjectCategories.length > 0 || rndLinks.length > 0 || hasRndStructuredTable;
  // Individual student Placement Records — admin-imported from Excel/CSV per
  // Academic Year (see PlacementYearsEditor in ProgramsAdmin.tsx), stored
  // directly on this programme's own doc. Falls back to the first available
  // year whenever nothing's been explicitly picked yet.
  const placementYears = program.placementYears || [];
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
  const internshipYears = program.internshipYears || [];
  const activeInternshipYear = internshipYears.find((y) => y.year === internshipYear) ?? internshipYears[0];
  const internshipColumns = activeInternshipYear?.columns || [];
  const internshipRows = internshipColumns.length > 0 && activeInternshipYear ? activeInternshipYear.rows || [] : [];
  const internshipPeriodIdx = findPeriodColumnIndex(internshipColumns);
  const internshipYearStats = activeInternshipYear ? computeInternshipStats(internshipColumns, activeInternshipYear.rows || []) : null;

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
  const visibleCustomSections = (program.customSections || []).filter(hasCustomSectionContent);

  // "About the Department" and "About the Programme" are two separate
  // pieces of content, same as on the grouped CSE/AI/ECE department page —
  // department-wide text lives on the matching Academic Departments record
  // (dept.about, edited at Admin → Academic Departments → Overview), while
  // program.about (Admin → Programs → About) is specific to this one
  const hasDeptAbout = !!dept?.about;
  const hasDeptHighlights = !!(dept?.highlights && dept.highlights.length > 0);
  const hasProgrammeAbout = !!program.about;


  // "Placements" quick link doubles as the Internships entry (Internships
  // has no quick link of its own — it renders directly below Placements on
  // the page, see the Internships section further down) — its label reads
  // "Placements & Internships" once this programme has both, "Internships"
  // alone if only internship records exist yet, and plain "Placements"
  // otherwise, so the sidebar reflects exactly what's actually been
  // uploaded instead of always assuming both exist.
  const hasPlacementRecords = placementYears.length > 0;
  const hasInternshipRecords = internshipYears.length > 0;
  const placementsLinkLabel = hasPlacementRecords && hasInternshipRecords
    ? 'Placements & Internships'
    : hasInternshipRecords ? 'Internships' : 'Placements';

  const quickLinks = [
    hasDeptAbout && { id: 'about', label: 'About the Department' },
    hasVisionMission && { id: 'vision-mission', label: 'Vision, Mission & Values' },
    hasHod && { id: 'hod', label: 'About HOD' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    hasLabs && { id: 'labs', label: 'Laboratories' },
    hasLibrary && { id: 'library', label: 'Department Library' },
    hasRnd && { id: 'rnd', label: 'Research & Development (Funded Projects & Patents)' },
    (hasPlacementRecords || hasInternshipRecords) && { id: 'placements', label: placementsLinkLabel },
    hasNewsEventsYears && { id: 'news-events', label: 'News & Events' },
    hasDeptNews && { id: 'news', label: 'News & Events' },
    ...toQuickLinkItems(visibleCustomSections),
  ].filter(Boolean) as { id: string; label: string; children?: { id: string; label: string }[] }[];

  const hasSidebarContent = quickLinks.length > 1 || hasCareerOutcomes;
  // The Quick Navigation sidebar always pairs with whichever of these three
  // sections is physically first on the page — so it never sits next to an
  // empty "About the Department" column (leaving a blank gap) when a
  // department has no dept.about text (e.g. EEE): it just attaches to
  // Vision/Mission, or HOD, whichever actually has content. 'standalone' is
  // the rare fallback where none of the three have content at all.
  const sidebarHost: 'about' | 'hod' | 'standalone' | null = !hasSidebarContent
    ? null
    : hasDeptAbout
    ? 'about'
    : hasHod
    ? 'hod'
    : 'standalone';

  const programTitle = `${program.shortName || program.name} | Vishnu Women's University`;
  const programDesc = program.about ? (program.about.length > 155 ? `${program.about.slice(0, 155)}...` : program.about) : `Study ${program.name} at Vishnu Women's University, Bhimavaram. Learn about department vision, syllabus, faculty, and research facilities.`;
  const programUrl = `/academics/${program.slug}`;
  const programImage = program.heroImage || fallbackBanner?.imageUrl;

  const programJsonLd = [
    getProgramSchema({
      name: program.name,
      description: programDesc,
      department: program.department || program.shortName,
      url: programUrl,
      degreeName: categoryLabel[program.category] || 'Bachelor of Technology',
    }),
    getBreadcrumbSchema([
      { name: 'Academics', url: '/academics' },
      { name: program.shortName || program.name, url: programUrl },
    ]),
  ];

  // Rendered inside whichever section `sidebarHost` points at (see above) —
  // a single JSX definition reused across the three possible host sections
  // so the Quick Navigation / Career Outcomes markup isn't triplicated.
  const sidebarNode = hasSidebarContent && (
    <aside className="detail-sidebar" aria-label="Page Navigation Sidebar">
      <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Quick Links */}
        {quickLinks.length > 1 && (
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
              {quickLinks.map((l) => {
                const hasKids = !!l.children?.length;
                const isOpen = !collapsedQuickLinks.has(l.id);
                return (
                  <li key={l.id} className="dept-quick-nav-item">
                    {hasKids ? (
                      <button
                        type="button"
                        onClick={() => toggleQuickLink(l.id)}
                        aria-expanded={isOpen}
                        className="dept-quick-nav-toggle-btn"
                      >
                        <span className="dept-quick-nav-text">{l.label}</span>
                        <ChevronDown
                          size={12}
                          strokeWidth={2.4}
                          className={`dept-quick-nav-chevron${isOpen ? ' is-open' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <a href={`#${l.id}`} className="dept-quick-nav-link">
                        <span className="dept-quick-nav-text">{l.label}</span>
                        <span className="dept-btn-arrow-circle">
                          <ChevronRight size={13} strokeWidth={2.4} className="dept-quick-nav-arrow" aria-hidden="true" />
                        </span>
                      </a>
                    )}
                    {hasKids && (
                      <SmoothCollapse open={isOpen}>
                        <ul className="dept-quick-sublinks-list" role="list">
                          {l.children!.map((c) => (
                            <li key={c.id}>
                              <a href={`#${c.id}`} className="dept-quick-sublink">
                                <span className="dept-btn-arrow-circle mini">
                                  <ChevronRight size={10} strokeWidth={2.8} className="dept-quick-sublink-bullet" />
                                </span>
                                <span>{c.label}</span>
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
          </nav>
        )}

        {/* Career Outcomes */}
        {program.outcomes && program.outcomes.length > 0 && (
          <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
              Career Outcomes
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {program.outcomes.map((o) => (
                <li key={o} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-light-gray)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, display: 'inline-block' }} />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <main className="page-wrapper">
      <SEO
        title={programTitle}
        description={programDesc}
        canonicalPath={programUrl}
        ogImage={programImage}
        jsonLd={programJsonLd}
      />
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 380 }}>
        {(program.heroImage || fallbackBanner?.imageUrl) && (
          <SmoothImage
            src={program.heroImage || fallbackBanner?.imageUrl || ''}
            alt={program.name}
            className="page-hero-image"
            loading="eager"
            decoding="sync"
            {...fetchPriorityAttr('high')}
          />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/academics" className="breadcrumb-item">Academics</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{program.shortName || program.name}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-primary-dark)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {categoryLabel[program.category] || program.category}
          </div>
          <h1 className="animate-fade-in-up">{program.name}</h1>
        </div>
      </section>

      {/* Key Facts Grid */}
      {(program.intake || program.established || program.accreditation || shared.hod) && (
        <section className="dept-facts-section" aria-label={`${program.name} key facts`}>
          <div className="container">
            <div className="dept-facts-grid cols-4">
              {shared.hod && (
                <div className="dept-fact-card is-hod-card">
                  <div className="dept-fact-header">
                    <div className="dept-fact-icon-badge">
                      <GraduationCap size={14} strokeWidth={2.4} />
                    </div>
                    <span className="dept-fact-col-title">Head of Department</span>
                  </div>
                  <div className="dept-fact-items-window">
                    <div className="dept-fact-static-list">
                      {hasHod ? (
                        <a href="#hod" className="dept-fact-chip-link" aria-label={`View ${shared.hod} details`}>
                          <div className="dept-fact-chip-entry">
                            <span className="dept-fact-chip-sub">Professor & HOD</span>
                            <span className="dept-fact-chip-val">{shared.hod}</span>
                          </div>
                        </a>
                      ) : (
                        <div className="dept-fact-chip-entry">
                          <span className="dept-fact-chip-sub">Professor & HOD</span>
                          <span className="dept-fact-chip-val">{shared.hod}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {program.established && (
                <div className="dept-fact-card">
                  <div className="dept-fact-header">
                    <div className="dept-fact-icon-badge">
                      <Calendar size={14} strokeWidth={2.4} />
                    </div>
                    <span className="dept-fact-col-title">Established</span>
                  </div>
                  <div className="dept-fact-items-window">
                    <div className="dept-fact-static-list">
                      <div className="dept-fact-chip-entry">
                        <span className="dept-fact-chip-sub">Programme Established</span>
                        <span className="dept-fact-chip-val">{program.established}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {program.accreditation && (
                <div className="dept-fact-card">
                  <div className="dept-fact-header">
                    <div className="dept-fact-icon-badge">
                      <Award size={14} strokeWidth={2.4} />
                    </div>
                    <span className="dept-fact-col-title">Accreditations</span>
                  </div>
                  <div className="dept-fact-items-window">
                    <div className="dept-fact-static-list">
                      <div className="dept-fact-chip-entry">
                        <span className="dept-fact-chip-sub">Accreditation Status</span>
                        <span className="dept-fact-chip-val">{program.accreditation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {program.intake && (
                <div className="dept-fact-card">
                  <div className="dept-fact-header">
                    <div className="dept-fact-icon-badge">
                      <Users size={14} strokeWidth={2.4} />
                    </div>
                    <span className="dept-fact-col-title">Annual Intake</span>
                  </div>
                  <div className="dept-fact-items-window">
                    <div className="dept-fact-static-list">
                      <div className="dept-fact-chip-entry">
                        <span className="dept-fact-chip-sub">Approved Seats</span>
                        <span className="dept-fact-chip-val">{program.intake} Seats</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Jump Bar */}
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

      {/* About the Department */}
      {hasDeptAbout && (
      <section id="about" className="section bg-white dept-about-section" style={{ scrollMarginTop: NAV_OFFSET }}>
        <div className="container">
          <div className={sidebarHost === 'about' ? 'detail-grid' : ''}>
            {/* Main content */}
            <div className="dept-about-main">
              <div className="dept-about-header">
                <span className="section-label dept-section-label">Department Overview</span>
                <h2 className="section-title">{deptTitle || program.shortName || program.name}</h2>
              </div>

              <div className="dept-about-card">
                <p className="dept-about-lead-text">
                  {dept?.about}
                </p>
              </div>

              {/* Department Highlights — same layout as a programme's own
                  Highlights (see "Programme Highlights" further down). */}
              {hasDeptHighlights && (
                <div style={{ marginTop: 'var(--space-8)' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
                    Department Highlights
                  </h3>
                  <div className="dept-highlights-grid">
                    {dept!.highlights!.map((h, hi) => (
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

            {/* Sidebar */}
            {sidebarHost === 'about' && sidebarNode}
          </div>
        </div>
      </section>
      )}

      {/* About HOD (Executive Italian Editorial Layout) */}
      {hasHod && (
        <section id="hod" className="dept-hod-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
          <div className={sidebarHost === 'hod' ? 'detail-grid' : ''}>
          <div>
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Academic Leadership</span>
              <h2 className="section-title">Head of Department</h2>
            </div>
            <div className="dept-hod-editorial-card">
              {shared.hodImage && (
                <div className="dept-hod-media-frame">
                  <SmoothImage
                    src={shared.hodImage}
                    alt={shared.hod || 'Head of Department'}
                    className="dept-hod-photo"
                  />
                </div>
              )}

              <div className="dept-hod-content">
                <div className="dept-hod-badge-wrap">
                  <span className="dept-hod-role-badge">Department Leadership</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{program.shortName || program.name}</span>
                </div>

                {shared.hod && (
                  <h3 className="dept-hod-name">{shared.hod}</h3>
                )}

                <div className="dept-hod-meta">
                  <span>Head of the Department & Senior Faculty</span>
                </div>

                {shared.hodMessage && (
                  <div className="dept-hod-message-box">
                    <p className="dept-hod-message-text">{shared.hodMessage}</p>
                  </div>
                )}

                {shared.hodEmail && (
                  <div className="dept-hod-actions">
                    <a href={`mailto:${shared.hodEmail}`} className="dept-hod-mail-btn">
                      <Mail size={15} strokeWidth={2.2} />
                      <span>Contact HOD: {shared.hodEmail}</span>
                    </a>
                  </div>
                )}

                {shared.hodResearchProfiles.length > 0 && (
                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Research Profiles:</span>
                    {shared.hodResearchProfiles.map((link) => (
                      <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="dept-value-pill" style={{ color: 'var(--color-primary-dark)', background: '#f1f5f9', borderColor: '#e2e8f0' }}>
                        <span>{link.label}</span>
                        <ExternalLink size={11} strokeWidth={2.4} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {sidebarHost === 'hod' && sidebarNode}
          </div>
          </div>

          {hasVisionMission && (
            <div className="container" id="vision-mission" style={{ marginTop: 'var(--space-8)', scrollMarginTop: NAV_OFFSET }}>
              <div className="dept-vm-grid">
                {shared.vision && (
                  <div className="dept-vm-card">
                    <h3 className="dept-vm-title">Vision</h3>
                    <p className="dept-vm-body-text">{shared.vision}</p>
                  </div>
                )}

                {shared.mission.length > 0 && (
                  <div className="dept-vm-card">
                    <h3 className="dept-vm-title">Mission</h3>
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
                  </div>
                )}

                {shared.coreValues.length > 0 && (
                  <div className="dept-values-card">
                    <h3 className="dept-vm-title">Core Values</h3>
                    <div className="dept-values-chips-wrap">
                      {shared.coreValues.map((v) => (
                        <span key={v} className="dept-value-pill">
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                          <span>{v}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Quick Navigation — rare fallback for a department with no About/
          Vision-Mission/HOD content at all, so the sidebar still shows up
          somewhere instead of silently disappearing. */}
      {sidebarHost === 'standalone' && (
        <section className="section bg-white">
          <div className="container" style={{ maxWidth: 340, marginRight: 0 }}>
            {sidebarNode}
          </div>
        </section>
      )}

      {/* Faculty Carousel (matching Google UI reference design) */}
      {faculty.length > 0 && (
        <div id="faculty" style={{ scrollMarginTop: NAV_OFFSET }}>
          <FacultyCarousel
            faculty={faculty}
            departmentName={deptTitle || program.name}
            title="Meet Our Faculty"
            viewMoreLink="/faculty"
          />
        </div>
      )}

      {/* About the Programme */}
      {hasProgrammeAbout && (
        <section id="programme-about" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            {!hasDeptAbout && (
              <div className="dept-about-header">
                <span className="section-label dept-section-label">About the Programme</span>
                <h2 className="section-title">{deptTitle || program.shortName || program.name}</h2>
              </div>
            )}
            {hasDeptAbout && <span className="section-label dept-section-label">About the Programme</span>}
            <div className="dept-about-card">
              <p className="dept-about-lead-text">
                {program.about}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Programme Highlights */}
      {program.highlights && program.highlights.length > 0 && (
        <section id="highlights" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <span className="section-label dept-section-label">Key Strengths</span>
              <h3 className="section-title" style={{ fontSize: '1.4rem' }}>
                Programme Highlights
              </h3>
            </div>
            <div className="dept-highlights-grid">
              {program.highlights.map((h, i) => (
                <div key={i} className="dept-highlight-card">
                  <div className="dept-highlight-icon-wrap">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="dept-highlight-text">{h.includes(':') ? <><strong>{h.slice(0, h.indexOf(':') + 1)}</strong>{h.slice(h.indexOf(':') + 1)}</> : h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PEOs, POs & PSOs (Outcome-Based Education Showcase) */}
      {hasOutcomeStatements && (
        <section id="peos-pos-psos" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Outcome-Based Education</span>
              <h2 className="section-title">{outcomeHeading}</h2>
              <p className="section-desc" style={{ margin: '0.5rem 0 0 0' }}>
                Structured educational objectives and measurable competencies defined in accordance with NBA & Washington Accord frameworks.
              </p>
            </div>
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
                  <h3 className="dept-outcomes-header-title">
                    {activeOutcome.title}
                  </h3>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {activeOutcome.items!.length} Statements Defined
                  </span>
                </div>
                <ul className="dept-outcomes-list">
                  {activeOutcome.items!.map((item, i) => (
                    <li key={item} className="dept-outcome-row">
                      <span className="dept-outcome-code-badge">
                        {activeOutcome.key.slice(0, -1).toUpperCase()}{i + 1}
                      </span>
                      <p className="dept-outcome-desc">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Mind Map */}
      {hasMindMap && (
        <section id="mindmap" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Curriculum Overview</span>
              <h2 className="section-title">Mind Map</h2>
              <p className="section-desc">A visual overview of how the programme&apos;s courses and specialisations connect together.</p>
            </div>
            {/* Plain vertical stack, in upload order — every image full-width
                and on its own line, no carousel/slider/side-by-side, so the
                page just scrolls normally from Image 1 down to the last. */}
            {mindMapImages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {mindMapImages.map((img, i) => (
                  <SmoothImage
                    key={img.url}
                    src={img.url}
                    alt={`${program.shortName || program.name} curriculum mind map${mindMapImages.length > 1 ? ` (${i + 1} of ${mindMapImages.length})` : ''}`}
                    style={{ display: 'block', width: '100%', maxWidth: 700, height: 'auto', margin: '0 auto', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-light-gray)' }}
                  />
                ))}
              </div>
            )}
            {program.mindMapPdfUrl && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: mindMapImages.length > 0 ? 'var(--space-6)' : 0 }}>
                <a href={program.mindMapPdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Download Mind Map PDF
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Curriculum — hidden entirely until a programme actually has
          semesters added via Programs admin, same as Labs/Mind Map/etc. */}
      {hasCurriculum && (
        <section id="curriculum" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Curriculum</span>
              <h2 className="section-title">Programme Structure</h2>
              <p className="section-desc">A well-structured curriculum blending core foundations with advanced specialisations and practical projects.</p>
            </div>
            <ProgrammeStructure semesters={program.semesters} />
          </div>
        </section>
      )}

      {/* Laboratories (Italian-Inspired Sleek Showcase) */}
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
              <div className="dept-labs-count-pill">
                <span className="dept-labs-count-dot" />
                <span>{labs.length} Active Facilities</span>
              </div>
            </div>

            {/* Tile always stays visible even with no PDF yet — just marked
                unavailable in the dialog, same convention as the Newsletter
                issues above. Tapping opens LabDialog (description + PDF
                link) rather than jumping straight to the PDF, since a lab
                with a description but no PDF would otherwise have nothing
                to tap through to. */}
            <div className="dept-labs-grid">
              {labs.map((lab, li) => {
                const indexNum = String(li + 1).padStart(2, '0');

                return (
                  <button
                    key={li}
                    type="button"
                    onClick={() => setActiveLab(lab)}
                    className="dept-lab-card"
                    style={{ font: 'inherit', textAlign: 'left', cursor: 'pointer', width: '100%' }}
                    aria-label={`View ${lab.name} details`}
                  >
                    <div>
                      <div className="dept-lab-card-top">
                        <span className="dept-lab-index-tag">{indexNum}</span>
                        <div className="dept-lab-icon-wrap">
                          <Microscope size={18} strokeWidth={2.2} />
                        </div>
                      </div>

                      <div className="dept-lab-body">
                        <span className="dept-lab-overline">Practical & Research Facility</span>
                        <h3 className="dept-lab-title">{lab.name}</h3>
                        <p className="dept-lab-spec-desc">
                          Equipped with high-performance workstations, licensed toolsets, and dedicated experimental apparatus.
                        </p>
                      </div>
                    </div>

                    <div className="dept-lab-footer">
                      <span className="dept-lab-pdf-btn-label">
                        <FileText size={13} strokeWidth={2.4} />
                        <span>{lab.pdfUrl ? 'Lab Manual & Specs' : 'View Details'}</span>
                      </span>
                      <span className="dept-btn-arrow-circle">
                        <ArrowRight size={12} strokeWidth={2.5} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <LabDialog lab={activeLab} onClose={() => setActiveLab(null)} />

      {/* Placements — admin-imported from Excel/CSV per Academic Year (see
          PlacementYearsEditor in ProgramsAdmin.tsx), every column shown
          exactly as uploaded. Selecting a year shows only that year's
          records; within a year, the top 10 highest-package rows are pulled
          to the front (see sortPlacementRows), everyone else keeps their
          original imported order. */}
      {placementYears.length > 0 && (
        <section id="placements" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Careers</span>
              <h2 className="section-title">Placements</h2>
            </div>
            <div className="placement-year-pills">
              {placementYears.map((y) => (
                <button
                  key={y.year}
                  type="button"
                  onClick={() => setPlacementYear(y.year)}
                  className={`placement-year-pill${activePlacementYear?.year === y.year ? ' active' : ''}`}
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
                <TestimonialMarquee records={placementMarqueeItems} />
              ) : (
                <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', padding: '1.5rem 0' }}>
                  No placement records uploaded yet for {activePlacementYear?.year}.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Internships — same shape/pattern as Placements above (see
          InternshipYearsEditor in ProgramsAdmin.tsx), including the
          scrolling-marquee records display. */}
      {internshipYears.length > 0 && (
        <section id="internships" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Careers</span>
              <h2 className="section-title">Internships</h2>
            </div>
            <div className="placement-year-pills">
              {internshipYears.map((y) => (
                <button
                  key={y.year}
                  type="button"
                  onClick={() => setInternshipYear(y.year)}
                  className={`placement-year-pill${activeInternshipYear?.year === y.year ? ' active' : ''}`}
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
        </section>
      )}

      {/* Department Library (Italian-Inspired 3-Column Grid Showcase) */}
      {hasLibrary && (
        <section id="library" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">Academic Repository</span>
              <h2 className="section-title">Department Library</h2>
            </div>

            <div className="dept-library-container">
              {shared.libraryIntro && (
                <div style={{ maxWidth: 840 }}>
                  <BodyBlocks
                    blocks={parseBodyContent(shared.libraryIntro)}
                    paragraphStyle={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)' }}
                  />
                </div>
              )}

              {shared.libraryInCharge && (
                <div className="dept-library-incharge-card">
                  <div className="dept-library-incharge-icon-wrap">
                    <BookOpen size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="dept-library-incharge-label">In-Charge of Department Library</div>
                    <h3 className="dept-library-incharge-name">{shared.libraryInCharge}</h3>
                  </div>
                </div>
              )}

              {libraryTables.map((sec, si) => (
                <div key={si} className="dept-library-tables-group">
                  <div className="dept-library-group-header">
                    <h3 className="dept-library-group-title">
                      {sec.heading}
                    </h3>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-accent)', background: 'rgba(201, 168, 76, 0.12)', border: '1px solid rgba(201, 168, 76, 0.25)', borderRadius: '9999px', padding: '0.25rem 0.75rem' }}>
                      {sec.items.length} Resource Categories
                    </span>
                  </div>

                  <div className="dept-library-grid-3">
                    {sec.items.map((item, ii) => {
                      const icons = [BookMarked, Bookmark, Library, FileText, BookOpen];
                      const IconComp = icons[ii % icons.length];
                      const numStr = String(ii + 1).padStart(2, '0');
                      return (
                        <div key={ii} className="dept-library-card">
                          <div className="dept-library-card-top">
                            <span className="dept-library-num-badge">{numStr}</span>
                            <div className="dept-library-icon-badge">
                              <IconComp size={18} strokeWidth={2.2} />
                            </div>
                          </div>
                          <div>
                            <div className="dept-library-value">{item.value}</div>
                            <div className="dept-library-label">{item.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News & Events — Compact Collapsible Academic-Year List */}
      {hasNewsEventsYears && (
        <NewsEventsTabs categories={newsEventsCategories} eyebrow={deptTitle || program.shortName || program.name} navOffset={NAV_OFFSET} />
      )}

      {/* News & Events — live from the departmentNews collection, tagged to
          this programme. Both this and the admin-defined table above are
          available; each only appears once an admin has actually filled it
          in, so having neither leaves no visible gap. */}
      <DepartmentNewsSection programSlug={program.slug} background="var(--color-off-white)" />

      {/* Newsletter — issues grouped by academic year; columns are however
          many issues the "longest" year has, admin-uploaded PDFs open in a
          new tab, and an issue slot with no PDF yet shows as unavailable
          rather than a broken/empty-looking link. */}
      {hasNewsletter && (
        <section id="newsletter" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Publications</span>
              <h2 className="section-title">Newsletter</h2>
            </div>
            <div className="pb-activities-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Academic Year</th>
                    {/* Per-issue "Issue – N" column headings intentionally removed — the
                        clickable issue links themselves still render below, unaffected. */}
                    {Array.from({ length: newsletterMaxIssues }).map((_, ci) => (
                      <th key={ci} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {newsletterYears.map((yr, yi) => (
                    <tr key={yi}>
                      <td>{yr.year}</td>
                      {Array.from({ length: newsletterMaxIssues }).map((_, ci) => {
                        const issue = yr.issues[ci];
                        if (!issue) return <td key={ci} />;
                        return (
                          <td key={ci}>
                            {issue.pdfUrl ? (
                              <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                Issue – {ci + 1}
                              </a>
                            ) : (
                              <span style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                                Issue – {ci + 1} (Unavailable)
                              </span>
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
        </section>
      )}

      {/* Research & Development (Funded Projects & Patents) — real
          department R&D pages vary a lot in shape, so this renders whichever
          of the four admin fields are filled in: an overview paragraph,
          table(s), detailed project/patent cards, and/or a flat PDF link
          list — same three-format system as the site-wide Research pages
          (see ResearchDetail.tsx / ResearchItemsAdmin.tsx). */}
      {hasRnd && (
        <section id="rnd" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Research</span>
              <h2 className="section-title">Research &amp; Development (Funded Projects &amp; Patents)</h2>
            </div>
            {program.rndIntro && (
              <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)', maxWidth: 760, whiteSpace: 'pre-line' }}>
                {program.rndIntro}
              </p>
            )}
            {rndTableSections.map((section, si) => (
              <div key={si} style={{ marginBottom: 'var(--space-8)' }}>
                {section.title && (
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {section.title}
                  </h3>
                )}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-primary)' }}>
                        {section.headers.map((col, ci) => (
                          <th key={ci} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, ri) => (
                        <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                          {row.map((val, ci) => (
                            <td key={ci} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                              {/^https?:\/\//i.test(val) ? <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>View</a> : val}
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
              <div style={{ marginBottom: 'var(--space-8)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-primary)' }}>
                      {rndStructuredColumns.map((col, ci) => (
                        <th key={ci} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {col}
                        </th>
                      ))}
                      <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rndStructuredRows.map((row, ri) => (
                      <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                        {rndStructuredColumns.map((_, ci) => (
                          <td key={ci} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                            {row.cells[ci] ?? ''}
                          </td>
                        ))}
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          {row.pdfUrl ? (
                            <a href={row.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <FileText size={14} strokeWidth={2} /> View
                            </a>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {rndProjectCategories.map((cat, ci) => (
              <div key={ci} style={{ marginBottom: ci < rndProjectCategories.length - 1 ? 'var(--space-10)' : (rndLinks.length > 0 ? 'var(--space-8)' : 0) }}>
                {cat.title && (
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {cat.title}
                  </h3>
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
                        >
                          <span>{project.title}</span>
                          <span className="thrust-accordion-icon">{isOpen ? '−' : '+'}</span>
                        </button>
                        <div className="thrust-accordion-collapse">
                          <div className="thrust-accordion-collapse-inner">
                            <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
                              {project.fields.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-2) var(--space-5)', marginBottom: project.outcomes.length > 0 ? 'var(--space-4)' : 0 }}>
                                  {project.fields.map((f, fi) => (
                                    <div key={fi} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                                      <strong style={{ color: 'var(--color-primary)' }}>{f.label}:</strong>{' '}
                                      {f.href ? (
                                        <a href={f.href} download target="_blank" rel="noopener noreferrer" className="thrust-accordion-link">{f.value}</a>
                                      ) : (
                                        f.value
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {project.outcomes.length > 0 && (
                                <div>
                                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', display: 'block', marginBottom: 'var(--space-2)' }}>
                                    Outcome
                                  </strong>
                                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {project.outcomes.map((o, oi) => (
                                      <li key={oi} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                                        <Check size={13} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 3 }} />
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{o}</span>
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
          <div>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Apply Today</span>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Begin Your Journey in {program.shortName || program.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto var(--space-8)', lineHeight: 1.7 }}>
              Join a thriving academic community. Apply through EAPCET (Code: {eapcetCode}), explore our fee structure, or schedule a campus visit today.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg">Apply via EAPCET</Link>
              <Link to="/programmes-fee-structure" className="btn btn-secondary btn-lg">Fee Structure</Link>
              <Link to="/academics" className="btn btn-secondary btn-lg">All Programmes</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
