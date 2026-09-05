import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Check, Microscope, Compass, Target, Sparkles, Mail, BookOpen, FileText, ChevronDown, GraduationCap, Calendar, Award, Users, ChevronRight, ArrowRight, BookMarked, Bookmark, Library, ExternalLink } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import ProgrammeStructure from '../../components/ProgrammeStructure/ProgrammeStructure';
import DepartmentNewsSection, { type DepartmentNewsDoc } from '../../components/DepartmentNews/DepartmentNewsSection';
import NewsEventsTabs from '../../components/NewsEventsTabs/NewsEventsTabs';
import BodyBlocks, { parseBodyContent } from '../../components/BodyBlocks/BodyBlocks';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import SEO from '../../components/SEO/SEO';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import TestimonialMarquee, { type PlacementItem } from '../../components/ui/marquee-01';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useEapcetCode } from '../../hooks/useContentBlocks';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { getProgramSchema, getBreadcrumbSchema } from '../../lib/seo/schemas';
import type { DepartmentGroup } from '../../lib/departmentGroups';
import { normalizeLab, normalizeMindMapImages, type ProgramDoc, type NewsEventsYear, type LabItem } from '../Admin/sections/ProgramsAdmin';
import LabDialog from '../../components/LabDialog/LabDialog';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { FacultyDoc } from './Faculty';
import { parseFlexibleTable, parseProjectAccordion } from '../../lib/structuredTable';
import { sortPlacementRows, computePlacementStats, findPackageColumnIndex, findCompanyColumnIndex, formatPackageCell } from '../../lib/placementRecords';
import { computeInternshipStats, findPeriodColumnIndex } from '../../lib/internshipRecords';
import { hasCustomSectionContent, toQuickLinkItems } from '../../lib/customSections';
import CustomSectionsRenderer, { SectionSubtree } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import '../detail-layout.css';
import '../Campus/tabbed-section.css';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

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
  // Programmes Offered (B.Tech./M.Tech.) cards — click/keyboard-toggled so
  // touch and keyboard users can reach the content; CSS also expands a card
  // on mouse hover as a progressive-enhancement affordance for desktop.
  const [openLevels, setOpenLevels] = useState<Set<string>>(new Set());
  const toggleLevel = (key: string) => {
    setOpenLevels((prev) => {
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
  const { docs: deptNewsDocs } = useOrderedCollection<DepartmentNewsDoc>('departmentNews', 'date', 'desc');

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

  // Company / minimum-package filters for the Placement records below —
  // admin uploads whatever columns a year's sheet has, so the company list
  // is derived live from that year's actual rows rather than any fixed
  // list, and resets itself whenever the Academic Year (and so the
  // available companies) changes since a stale selection wouldn't match
  // anything. Declared here (with every other hook), not further down next
  // to where it's used, so it isn't skipped by the early returns below —
  // React requires every hook to run on every render, in the same order.
  const [placementCompanyFilter, setPlacementCompanyFilter] = useState('');
  const [placementMinPackage, setPlacementMinPackage] = useState(0);
  useEffect(() => { setPlacementCompanyFilter(''); }, [placementYear]);

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
    // Department-only, no per-programme fallback — a new structural block
    // (B.Tech./M.Tech. headings + intake tables) shown right after "About
    // the Department".
    programLevels: dept?.programLevels || [],
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

  const hasVisionMission = !!(shared.vision || shared.mission.length || shared.coreValues.length);
  const hasHod = !!(shared.hodMessage || shared.hodImage || shared.hodEmail || shared.hod);
  const hasLabs = shared.labs.length > 0;
  const hasAbout = !!shared.about;
  const hasDeptHighlights = shared.highlights.length > 0;
  const programLevels = shared.programLevels.filter((l) => l.title && (l.intro || l.rows?.length > 0));
  const hasProgramLevels = programLevels.length > 0;
  const libraryTables = shared.librarySections.filter((sec) => sec.items && sec.items.length > 0);
  const hasLibrary = !!(shared.libraryIntro || shared.libraryInCharge || libraryTables.length > 0);
  // Individual student Placement Records — admin-imported from Excel/CSV per
  // Academic Year (see PlacementYearsEditor in ProgramCareerEditors.tsx),
  // shared across the whole department (see the matching `dept`), not
  // per-programme — switching the programme toggle above does not change
  // these. Falls back to the first available year whenever nothing's been
  // explicitly picked yet.
  // Falls back to whichever sub-programme still has this field until the
  // department doc is opened + saved in Admin (which copies it over) — see
  // the migration in DepartmentsAdmin.tsx's startEdit(). Without this, a
  // department not yet re-saved since the department-wide switchover would
  // show nothing here even though the data is safely sitting on its old
  // per-programme doc, untouched.
  const placementYears = (dept?.placementYears?.length ? dept.placementYears : subPrograms.find((p) => p.placementYears?.length)?.placementYears) || [];
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
  const placementCompIdx = findCompanyColumnIndex(placementColumns);
  const placementCompanyOptions = Array.from(new Set(
    placementRows.map((r) => (placementCompIdx >= 0 ? r.cells[placementCompIdx] : '')?.trim()).filter(Boolean)
  )).sort((a, b) => a.localeCompare(b));
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
    const rawComp = placementCompIdx >= 0 ? row.cells[placementCompIdx] : (row.cells[2] || 'Leading Recruiter');
    const rawPkg = placementPkgIdx >= 0 ? formatPackageCell(row.cells[placementPkgIdx] ?? '') : (row.cells[3] || '');
    return {
      name: rawName?.trim() || 'Student Scholar',
      company: rawComp?.trim() || 'Top Corporation',
      package: rawPkg ? (rawPkg.toLowerCase().includes('lpa') ? rawPkg : `${rawPkg} LPA`) : 'High Impact CTC',
    };
  });

  // Individual student Internship Records — same shape/pattern as the
  // Placement Records above (see InternshipYearsEditor in
  // ProgramCareerEditors.tsx), just for internships instead of placements.
  const internshipYears = (dept?.internshipYears?.length ? dept.internshipYears : subPrograms.find((p) => p.internshipYears?.length)?.internshipYears) || [];
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

  const hasProgrammeAbout = !!activeProgram.about;
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
  const newsEventsCategories = [
    { key: 'news', label: 'News & Events', years: validYears(dept?.newsEventsYears?.length ? dept.newsEventsYears : subPrograms.map((p) => p.newsEventsYears).find((arr) => arr && arr.length > 0)) },
    { key: 'awards', label: 'Student Awards', years: validYears(dept?.studentAwardsYears) },
    { key: 'others', label: 'Others', years: validYears(dept?.othersYears) },
  ];
  // Once a department has gone through the new Admin flow at least once
  // (dept.newsEventsMigrated), the old arrays are frozen leftovers, not the
  // live source of truth — an admin who then deletes everything in the new
  // editor must actually see it gone, not have this stale data resurface.
  const hasLegacyNewsEvents = !hasNewsEventsDynamic && !dept?.newsEventsMigrated && newsEventsCategories.some((c) => c.years.length > 0);
  const hasNewsEvents = hasNewsEventsDynamic || hasLegacyNewsEvents;
  const hasDeptNews = deptNewsDocs.some((n) => group.programSlugs.includes(n.program));
  // Awards & Recognition — same fixed-heading/dynamic-content pattern as
  // News & Events above, but brand new (no legacy fixed shape to fall back
  // to), department-wide, read from the department doc.
  const awardsSubSections = (dept?.awardsSections || []).filter(hasCustomSectionContent);
  const hasAwards = awardsSubSections.length > 0;
  const newsletterYears = ((dept?.newsletterYears?.length ? dept.newsletterYears : subPrograms.find((p) => p.newsletterYears?.length)?.newsletterYears) || []).filter((y) => y.year && y.issues && y.issues.length > 0);
  const hasNewsletter = newsletterYears.length > 0;
  const newsletterMaxIssues = Math.max(0, ...newsletterYears.map((y) => y.issues.length));
  // Research & Development (Funded Projects & Patents) — shared across the
  // whole department (ProgramCareerEditors.tsx's "Research & Development"
  // editor); a link only appears once it has both a name and an uploaded PDF.
  const rndIntroValue = dept?.rndIntro || subPrograms.find((p) => p.rndIntro)?.rndIntro || '';
  const rndLinks = (dept?.rndLinks?.length ? dept.rndLinks : subPrograms.find((p) => p.rndLinks?.length)?.rndLinks) || [];
  const rndTableTextValue = dept?.rndTableText || subPrograms.find((p) => p.rndTableText)?.rndTableText || '';
  const rndProjectsTextValue = dept?.rndProjectsText || subPrograms.find((p) => p.rndProjectsText)?.rndProjectsText || '';
  const rndStructuredTableValue = dept?.rndStructuredTable || subPrograms.find((p) => p.rndStructuredTable)?.rndStructuredTable;
  const rndTableSections = parseFlexibleTable(rndTableTextValue).filter((s) => s.headers.length > 0);
  const rndProjectCategories = parseProjectAccordion(rndProjectsTextValue).filter((c) => c.projects.length > 0);
  const rndStructuredColumns = rndStructuredTableValue?.columns || [];
  const rndStructuredRows = rndStructuredTableValue?.rows || [];
  const hasRndStructuredTable = rndStructuredColumns.length > 0 && rndStructuredRows.length > 0;
  const hasRnd = !!rndIntroValue || rndTableSections.length > 0 || rndProjectCategories.length > 0 || rndLinks.length > 0 || hasRndStructuredTable;
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
    hasVisionMission && { id: 'vision-mission', label: 'Vision & Mission' },
    hasHod && { id: 'hod', label: 'About HOD' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    { id: 'program-toggle', label: 'Choose a Programme' },
    hasLabs && { id: 'labs', label: 'Laboratories' },
    hasLibrary && { id: 'library', label: 'Department Library' },
    hasRnd && { id: 'rnd', label: 'R & D' },
    (hasPlacements || hasInternships) && { id: 'placements', label: placementsLinkLabel },
    hasNewsletter && { id: 'newsletter', label: 'Newsletter' },
    (hasNewsEvents || hasDeptNews) && { id: hasNewsEvents ? 'news-events' : 'news', label: 'News & Events' },
    hasAwards && { id: 'awards-recognition', label: 'Awards & Recognition' },
  ].filter(Boolean) as { id: string; label: string }[];
  // Nested under the "Choose a Programme" row above as a collapsible
  // sub-list — same admin-driven presence checks as before, just grouped.
  const programmeLinks = [
    hasProgrammeAbout && { id: 'programme-about', label: 'About the Programme' },
    hasHighlights && { id: 'highlights', label: 'Programme Highlights' },
    hasOutcomeStatements && { id: 'peos-pos-psos', label: outcomeHeading },
    hasMindMap && { id: 'mindmap', label: 'Mind Map' },
    { id: 'curriculum', label: 'Curriculum' },
    ...toQuickLinkItems(visibleCustomSections),
  ].filter(Boolean) as { id: string; label: string; children?: { id: string; label: string }[] }[];

  // Top stats bar, flowing as a single horizontal row (matching every other
  // detail page). Head of Department comes first, then Established/
  // Accreditation once when an admin has set them directly on the
  // department doc — but when that's empty, each program contributes its
  // own Established / Accreditation / Intake, prefixed with its short name
  // (since those routinely differ between programs, e.g. CSE is NBA
  // accredited while Cyber Security isn't yet). Intake always differs per
  // program, so in the shared-Established case each program still gets its
  // own Intake item.
  interface FactItem {
    program?: string;
    value: string;
    sublabel?: string;
    link?: string;
  }

  interface FactCategory {
    id: string;
    title: string;
    icon: typeof GraduationCap;
    items: FactItem[];
  }

  const factColumns: FactCategory[] = [
    {
      id: 'hod',
      title: 'Head of Department',
      icon: GraduationCap,
      items: shared.hod ? [{ value: shared.hod, sublabel: 'Professor & HOD', link: hasHod ? '#hod' : undefined }] : [],
    },
    {
      id: 'established',
      title: 'Established',
      icon: Calendar,
      items: clean(dept?.established)
        ? [{ value: clean(dept?.established), sublabel: 'Department' }]
        : subPrograms.filter((p) => clean(p.established)).map((p) => ({
            program: p.shortName || p.name,
            value: clean(p.established),
            sublabel: p.shortName || p.name,
          })),
    },
    {
      id: 'accreditation',
      title: 'Accreditations',
      icon: Award,
      items: clean(dept?.accreditation)
        ? [{ value: clean(dept?.accreditation), sublabel: 'Department' }]
        : subPrograms.filter((p) => clean(p.accreditation)).map((p) => ({
            program: p.shortName || p.name,
            value: clean(p.accreditation),
            sublabel: p.shortName || p.name,
          })),
    },
    {
      id: 'intake',
      title: 'Programme Intake',
      icon: Users,
      items: subPrograms.filter((p) => p.intake).map((p) => ({
        program: p.shortName || p.name,
        value: `${p.intake} Seats`,
        sublabel: p.shortName || p.name,
      })),
    },
  ].filter((col) => col.items.length > 0);

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
    <main className="page-wrapper">
      <SEO title={`${deptName} | Vishnu Women's University`} description={pageDesc} canonicalPath={pageUrl} ogImage={heroImage} jsonLd={jsonLd} />

      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 380 }}>
        {heroImage && (
          <SmoothImage src={heroImage} alt={deptName} className="page-hero-image" loading="eager" decoding="sync" {...fetchPriorityAttr('high')} />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/academics" className="breadcrumb-item">Academics</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{deptName}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-primary-dark)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Department
          </div>
          <h1 className="animate-fade-in-up">{deptName}</h1>
        </div>
      </section>

      {/* 4-Column Structured Facts Grid (HOD, Established, Accreditations, Intake) - 2-row fixed window with auto-scroll */}
      {factColumns.length > 0 && (
        <section className="dept-facts-section" aria-label={`${deptName} key information`}>
          <div className="container">
            <div className={`dept-facts-grid cols-${Math.min(factColumns.length, 4)}`}>
              {factColumns.map((col) => {
                const ColIcon = col.icon;
                const isHodCol = col.id === 'hod';
                const hasOverflow = col.items.length > 2;

                const renderItem = (item: FactItem, key: string | number) => {
                  const content = (
                    <div className="dept-fact-chip-entry">
                      {item.sublabel && item.sublabel !== 'Department' && (
                        <span className="dept-fact-chip-sub">{item.sublabel}</span>
                      )}
                      <span className="dept-fact-chip-val">{item.value}</span>
                    </div>
                  );

                  if (item.link) {
                    return (
                      <a
                        key={key}
                        href={item.link}
                        className="dept-fact-chip-link"
                        aria-label={`View ${item.value} details`}
                      >
                        {content}
                      </a>
                    );
                  }

                  return <div key={key}>{content}</div>;
                };

                return (
                  <div key={col.id} className={`dept-fact-card${isHodCol ? ' is-hod-card' : ''}`}>
                    <div className="dept-fact-header">
                      <div className="dept-fact-icon-badge">
                        <ColIcon size={14} strokeWidth={2.4} />
                      </div>
                      <span className="dept-fact-col-title">{col.title}</span>
                      {hasOverflow && (
                        <span className="dept-fact-count-badge" title={`${col.items.length} items (auto-scrolling)`}>
                          {col.items.length}
                        </span>
                      )}
                    </div>

                    <div className={`dept-fact-items-window${hasOverflow ? ' is-scrolling' : ''}`}>
                      {hasOverflow ? (
                        <div
                          className="dept-fact-ticker-track"
                          style={{
                            animationDuration: `${col.items.length * 3.5}s`,
                          }}
                        >
                          {/* Duplicate list for seamless infinite marquee loop */}
                          {[...col.items, ...col.items].map((item, idx) =>
                            renderItem(item, `ticker-${idx}`)
                          )}
                        </div>
                      ) : (
                        <div className="dept-fact-static-list">
                          {col.items.map((item, idx) => renderItem(item, `static-${idx}`))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
                              <span className="dept-btn-arrow-circle">
                                <ChevronDown
                                  size={13}
                                  strokeWidth={2.4}
                                  className={`dept-quick-nav-chevron${programmeLinksOpen ? ' is-open' : ''}`}
                                  aria-hidden="true"
                                />
                              </span>
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
                                          <span className="dept-btn-arrow-circle mini">
                                            <ChevronRight size={10} strokeWidth={2.8} className="dept-quick-sublink-bullet" />
                                          </span>
                                          <span>{c.label}</span>
                                        </a>
                                      )}
                                      {hasKids && (
                                        <SmoothCollapse open={isSubOpen}>
                                          <ul className="dept-quick-sublinks-list" role="list">
                                            {c.children!.map((gc) => (
                                              <li key={gc.id}>
                                                <a href={`#${gc.id}`} className="dept-quick-sublink">
                                                  <span className="dept-btn-arrow-circle mini">
                                                    <ChevronRight size={10} strokeWidth={2.8} className="dept-quick-sublink-bullet" />
                                                  </span>
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
                              <span className="dept-btn-arrow-circle">
                                <ChevronRight size={13} strokeWidth={2.4} className="dept-quick-nav-arrow" aria-hidden="true" />
                              </span>
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

      {/* Programmes Offered (shared) — B.Tech./M.Tech. headed blocks, each
          with an intro paragraph and an intake table. */}
      {hasProgramLevels && (
        <section id="program-levels" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className="dept-level-grid">
              {programLevels.map((level, li) => {
                const isOpen = openLevels.has(level.title);
                return (
                  <div key={li} className={`dept-level-card${isOpen ? ' open' : ''}`}>
                    <button
                      type="button"
                      className="dept-level-card-trigger"
                      onClick={() => toggleLevel(level.title)}
                      aria-expanded={isOpen}
                      aria-controls={`level-panel-${li}`}
                    >
                      <span className="dept-level-card-bar" aria-hidden="true" />
                      <span className="dept-level-card-title">{level.title}</span>
                      <ChevronDown size={20} strokeWidth={2.25} className="dept-level-card-chevron" aria-hidden="true" />
                    </button>
                    <div className="dept-level-card-panel" id={`level-panel-${li}`}>
                      <div className="dept-level-card-panel-inner">
                        <div className="dept-level-card-content">
                          {level.intro && (
                            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.85, fontSize: 'var(--text-base)', whiteSpace: 'pre-line', marginBottom: level.rows?.length > 0 ? 'var(--space-5)' : 0 }}>
                              {level.intro}
                            </p>
                          )}
                          {level.rows && level.rows.length > 0 && (
                            <div className="pb-activities-scroll" role="region" aria-label={`${level.title} intake table`} tabIndex={0}>
                              <table>
                                <thead>
                                  <tr>
                                    <th scope="col">{level.title}</th>
                                    <th scope="col">Intake</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {level.rows.map((row, ri) => (
                                    <tr key={ri}>
                                      <td>{row.program}</td>
                                      <td>{row.intake}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
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
        </section>
      )}

      {/* Vision, Mission & Values (Italian-Inspired Sleek Showcase) */}
      {hasVisionMission && (
        <section id="vision-mission" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Our Guiding Pillars</span>
              <h2 className="section-title">Vision, Mission &amp; Values</h2>
            </div>
            <div className="dept-vm-grid">
              {shared.vision && (
                <div className="dept-vm-card">
                  <div className="dept-vm-card-top">
                    <span className="dept-vm-num-badge">01 · VISION</span>
                    <div className="dept-vm-icon-badge">
                      <Compass size={20} strokeWidth={2.2} />
                    </div>
                  </div>
                  <h3 className="dept-vm-title">Department Vision</h3>
                  <p className="dept-vm-body-text">{shared.vision}</p>
                </div>
              )}

              {shared.mission && shared.mission.length > 0 && (
                <div className="dept-vm-card">
                  <div className="dept-vm-card-top">
                    <span className="dept-vm-num-badge">02 · MISSION</span>
                    <div className="dept-vm-icon-badge">
                      <Target size={20} strokeWidth={2.2} />
                    </div>
                  </div>
                  <h3 className="dept-vm-title">Mission Statements</h3>
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

              {shared.coreValues && shared.coreValues.length > 0 && (
                <div className="dept-values-card">
                  <div className="dept-values-header">
                    <Sparkles size={22} strokeWidth={2} style={{ color: 'var(--color-accent)' }} />
                    <h3 className="dept-values-title">Institutional Core Values</h3>
                  </div>
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
        </section>
      )}

      {/* About HOD (Executive Italian Editorial Layout) */}
      {hasHod && (
        <section id="hod" className="dept-hod-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
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
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{deptName}</span>
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
              </div>
              {shared.hodResearchProfiles.length > 0 && (
                <div style={{ background: 'var(--color-primary)', padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-5)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Research Profiles</span>
                  {shared.hodResearchProfiles.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--color-white)', fontWeight: 600, textDecoration: 'none' }}>
                      {link.label} <ExternalLink size={12} strokeWidth={2} />
                    </a>
                  ))}
                </div>
              )}
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
                <span>{shared.labs.length} Active Facilities</span>
              </div>
            </div>

            <div className="dept-labs-grid">
              {shared.labs.map((lab, li) => {
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

      {/* Placements (shared) */}
      {hasPlacements && (
        <section id="placements" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">Careers</span>
              <h2 className="section-title">Placements</h2>
            </div>
            {shared.placementIntro && (
              <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)', maxWidth: 760 }}>
                {shared.placementIntro}
              </p>
            )}
            {shared.placementStats.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', marginBottom: shared.placementRecruiters.length > 0 ? 'var(--space-8)' : 0 }}>
                {shared.placementStats.map((s) => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
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
                  {shared.placementRecruiters.map((r) => (
                    <span key={r} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-full)', padding: '0.35rem 0.9rem' }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Academic Year pill selector + computed stat tiles — Academic
                Years come entirely from dept?.placementYears
                (admin-managed via /admin → Academic Departments), and every tile value
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
                        <button
                          type="button"
                          className="dept-stat-tile__circle dept-stat-tile__circle--link"
                          onClick={() => document.getElementById('placement-records-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        >
                          <span className="dept-stat-tile__value">Package wise</span>
                        </button>
                        <div className="dept-stat-tile__label">Top 10 Companies List</div>
                      </div>
                      <div className="dept-stat-tile">
                        <div className="dept-stat-tile__circle"><span className="dept-stat-tile__value">{placementYearStats.averageSalary ?? '—'}</span></div>
                        <div className="dept-stat-tile__label">Average Salary</div>
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
          </div>
        </section>
      )}

      {/* Internships — same shape/pattern as Placements above, per programme,
          Academic Years come entirely from dept?.internshipYears
          (admin-managed via /admin → Academic Departments), including the
          scrolling-marquee records display. */}
      {hasInternships && (
        <section id="internships" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">Careers</span>
              <h2 className="section-title">Internships</h2>
            </div>
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
          </div>
        </section>
      )}

      {/* Department Library (Italian-Inspired 3-Column Grid Showcase) */}
      {hasLibrary && (
        <section id="library" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
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

      {/* ===== Program toggle ===== */}
      <section id="program-toggle" style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0', scrollMarginTop: NAV_OFFSET }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label dept-section-label" style={{ color: 'var(--color-accent)' }}>Choose a Programme</span>
          {/* maxWidth scales with the number of programmes so extra options
              (e.g. ECE's third, M.Tech VLSI) get equal, uncramped room
              rather than being squeezed into a width tuned for two. */}
          <div className="iqac-cell-tabs" style={{ maxWidth: Math.max(520, subPrograms.length * 200), margin: 'var(--space-4) auto 0', background: 'var(--color-white)' }}>
            {subPrograms.map((p) => (
              <button
                key={p.slug}
                type="button"
                className={`iqac-cell-tab${p.slug === activeSlug ? ' active' : ''}`}
                aria-pressed={p.slug === activeSlug}
                onClick={() => { if (p.slug !== activeSlug) navigate(`/academics/${p.slug}#program-toggle`); }}
              >
                {p.shortName || p.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About the Programme (per programme) */}
      {hasProgrammeAbout && (
        <section id="programme-about" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <span className="section-label dept-section-label">{activeProgram.shortName || activeProgram.name}</span>
            <h2 className="section-title">About the Programme</h2>
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.85, fontSize: 'var(--text-base)', whiteSpace: 'pre-line' }}>
              {activeProgram.about}
            </p>
          </div>
        </section>
      )}

      {/* Programme Highlights (per programme) */}
      {hasHighlights && (
        <section id="highlights" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">{activeProgram.shortName || activeProgram.name}</span>
              <h2 className="section-title">Programme Highlights</h2>
              <p className="section-desc" style={{ margin: '0.5rem 0 0 0' }}>
                Key differentiators and academic excellence pillars that distinguish our curriculum.
              </p>
            </div>
            <div className="dept-highlights-grid">
              {activeProgram.highlights.map((h, hi) => (
                <div key={hi} className="dept-highlight-item-card">
                  <div className="dept-highlight-check-circle">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <p className="dept-highlight-text">{h.includes(':') ? <><strong>{h.slice(0, h.indexOf(':') + 1)}</strong>{h.slice(h.indexOf(':') + 1)}</> : h}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PEOs, POs & PSOs (Outcome-Based Education Showcase) */}
      {hasOutcomeStatements && (
        <section id="peos-pos-psos" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
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

      {/* Mind Map (per programme) */}
      {hasMindMap && (
        <section id="mindmap" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Curriculum Overview</span>
              <h2 className="section-title">Mind Map</h2>
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
                    alt={`${activeProgram.shortName || activeProgram.name} curriculum mind map${mindMapImages.length > 1 ? ` (${i + 1} of ${mindMapImages.length})` : ''}`}
                    style={{ display: 'block', width: '100%', maxWidth: 700, height: 'auto', margin: '0 auto', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-light-gray)' }}
                  />
                ))}
              </div>
            )}
            {activeProgram.mindMapPdfUrl && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: mindMapImages.length > 0 ? 'var(--space-6)' : 0 }}>
                <a href={activeProgram.mindMapPdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Download Mind Map PDF
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Curriculum (per programme) */}
      <section id="curriculum" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label dept-section-label">Curriculum</span>
            <h2 className="section-title">{activeProgram.shortName || activeProgram.name} — Programme Structure</h2>
          </div>
          <ProgrammeStructure semesters={activeProgram.semesters} />
        </div>
      </section>

      {/* News & Events — the heading is fixed; what's under it is the
          admin-defined dynamic section list (see newsEventsSubSections
          above), or, for a department not yet opened in the new Admin, the
          old fixed News & Events / Student Awards / Others tabs. */}
      {hasNewsEventsDynamic && (
        <section id="news-events" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">{deptName}</span>
              <h2 className="section-title">News &amp; Events</h2>
            </div>
            <SectionSubtree
              section={{ id: 'news-events-root', label: 'News & Events', contentType: 'text', textContent: '', subSections: newsEventsSubSections }}
              navOffset={NAV_OFFSET}
            />
          </div>
        </section>
      )}
      {hasLegacyNewsEvents && <NewsEventsTabs categories={newsEventsCategories} eyebrow={deptName} navOffset={NAV_OFFSET} />}

      {/* Awards & Recognition — same fixed-heading/dynamic-content pattern
          as News & Events above. */}
      {hasAwards && (
        <section id="awards-recognition" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">{deptName}</span>
              <h2 className="section-title">Awards &amp; Recognition</h2>
            </div>
            <SectionSubtree
              section={{ id: 'awards-recognition-root', label: 'Awards & Recognition', contentType: 'text', textContent: '', subSections: awardsSubSections }}
              navOffset={NAV_OFFSET}
            />
          </div>
        </section>
      )}

      {/* News & Events — live from the departmentNews collection, tagged to
          this programme (Programs admin's "News & Events — This Programme").
          Both this and the admin-defined table above are available on this
          programme's side of the toggle; each only appears once an admin has
          actually filled it in, so having neither leaves no visible gap. */}
      <DepartmentNewsSection programSlug={group.programSlugs} background="var(--color-off-white)" />

      {/* Newsletter (per programme) */}
      {hasNewsletter && (
        <section id="newsletter" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">{activeProgram.shortName || activeProgram.name}</span>
              <h2 className="section-title">Newsletter</h2>
            </div>
            <div className="pb-activities-scroll" role="region" aria-label="Newsletter issues by academic year" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Academic Year</th>
                    {/* Per-issue "Issue – N" column headings intentionally removed visually — the
                        clickable issue links themselves still render below, unaffected. An sr-only
                        label keeps each column identifiable to screen reader users. */}
                    {Array.from({ length: newsletterMaxIssues }).map((_, ci) => (
                      <th key={ci} scope="col"><span className="sr-only">{`Issue ${ci + 1}`}</span></th>
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
            {rndIntroValue && (
              <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)', maxWidth: 760, whiteSpace: 'pre-line' }}>
                {rndIntroValue}
              </p>
            )}
            {rndTableSections.map((section, si) => (
              <div key={si} style={{ marginBottom: 'var(--space-8)' }}>
                {section.title && (
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {section.title}
                  </h3>
                )}
                <div role="region" aria-label={section.title || 'Research & Development table'} tabIndex={0} style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-primary)' }}>
                        {section.headers.map((col, ci) => (
                          <th key={ci} scope="col" style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>
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
                          aria-controls={`rnd-project-${key}`}
                        >
                          <span>{project.title}</span>
                          <span className="thrust-accordion-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                        </button>
                        <div id={`rnd-project-${key}`} className="thrust-accordion-collapse">
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
