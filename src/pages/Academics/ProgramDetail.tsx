import { useEffect, useState } from 'react';
import { Link, useParams, useLocation, Navigate } from 'react-router-dom';
import { Check, Microscope, Compass, Target, Sparkles, Mail, ExternalLink, BookOpen, FileText, ChevronRight, ChevronDown, GraduationCap, Calendar, Award, Users, ArrowRight, BookMarked, Bookmark, Library } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import ImageLightbox from '../../components/ImageLightbox/ImageLightbox';
import ProgrammeStructure from '../../components/ProgrammeStructure/ProgrammeStructure';
import BodyBlocks, { parseBodyContent } from '../../components/BodyBlocks/BodyBlocks';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import DepartmentDetail from './DepartmentDetail';
import FreshmanSubDepartment from './FreshmanSubDepartment';
import { SUB_DEPTS } from './FreshmanEngineering';
import { groupForProgramSlug } from '../../lib/departmentGroups';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import TestimonialMarquee, { type PlacementItem } from '../../components/ui/marquee-01';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanner } from '../../hooks/usePageBanner';
import { useEapcetCode } from '../../hooks/useContentBlocks';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { normalizeLab, type ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { FacultyDoc } from './Faculty';
import { parseFlexibleTable, parseProjectAccordion } from '../../lib/structuredTable';
import { sortPlacementRows, computePlacementStats, findPackageColumnIndex, formatPackageCell } from '../../lib/placementRecords';
import { hasCustomSectionContent } from '../../lib/customSections';
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
  if (SUB_DEPTS.some((d) => d.slug === slug)) return <FreshmanSubDepartment slug={slug!} />;
  return <SingleProgramDetail />;
}

function SingleProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [mindMapOpen, setMindMapOpen] = useState(false);
  const [outcomeTab, setOutcomeTab] = useState<string | null>(null);
  const [placementYear, setPlacementYear] = useState<string | null>(null);
  const [openNewsYears, setOpenNewsYears] = useState<Set<string>>(new Set());
  const toggleNewsYear = (year: string) => {
    setOpenNewsYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };
  const [openRndProjects, setOpenRndProjects] = useState<Set<string>>(new Set());
  const toggleRndProject = (key: string) => {
    setOpenRndProjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const { docs: allPrograms, loading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const program = allPrograms.find((p) => p.slug === slug);

  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const faculty = program?.department ? allFaculty.filter((f) => f.department === program.department) : [];
  // Resolves the program's short `department` code (e.g. "IT") to the full
  // department name from the Academic Departments admin, so the "About the
  // Department" heading below reads the same way it does on the AI/CSE/ECE
  // grouped department page — falling back to the raw code if no match.
  const { docs: allDepartments, loading: deptLoading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const deptTitle = allDepartments.find(
    (d) => d.shortCode?.trim().toUpperCase() === (program?.department || '').trim().toUpperCase()
  )?.title || program?.department;
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
    const firstAvailable = program?.peos?.length ? 'peos' : program?.pos?.length ? 'pos' : program?.psos?.length ? 'psos' : program?.wks?.length ? 'wks' : null;
    if (firstAvailable) setOutcomeTab((prev) => prev ?? firstAvailable);
  }, [program?.peos?.length, program?.pos?.length, program?.psos?.length, program?.wks?.length]);

  // Also wait on the department lookup: rendering before it resolves would
  // show the raw department code and then flash to the full title once
  // `allDepartments` loads (e.g. "IT" -> "Information Technology").
  if (loading || deptLoading) {
    return (
      <main className="route-fallback">
        <div className="route-fallback__spinner" />
      </main>
    );
  }
  if (!program) return <Navigate to="/academics" replace />;

  const hasVisionMission = !!(program.vision || program.mission?.length || program.coreValues?.length);
  // Tabbed PEOs / POs / PSOs — only whichever of the three an admin has
  // actually filled in (via /admin → Programs) becomes a tab; entirely
  // data-driven, nothing hardcoded here beyond the three possible labels.
  const outcomeGroups = [
    { key: 'peos', short: 'PEOs', title: 'Programme Educational Objectives (PEOs)', items: program.peos },
    { key: 'pos', short: 'POs', title: 'Programme Outcomes (POs)', items: program.pos },
    { key: 'psos', short: 'PSOs', title: 'Programme Specific Outcomes (PSOs)', items: program.psos },
    { key: 'wks', short: 'WKs', title: 'Knowledge Profile (WKs)', items: program.wks },
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
  const hasHod = !!(program.hodMessage || program.hodImage || program.hodEmail);
  const hasMindMap = !!program.mindMapImage;
  // Legacy docs may still store labs as plain strings (no PDF) —
  // normalizeLab() upgrades either shape so this page never has to care.
  const labs = (program.labs || []).map(normalizeLab);
  const hasLabs = labs.length > 0;
  const hasCareerOutcomes = !!(program.outcomes && program.outcomes.length > 0);
  const hasCurriculum = !!(program.semesters && program.semesters.length > 0);
  // Every section is entirely admin-defined — heading and items alike — so
  // different programmes can show completely different Digital Library
  // content. A section with no items yet just doesn't render a table for it.
  const libraryTables = (program.librarySections || []).filter((sec) => sec.items && sec.items.length > 0);
  const hasLibrary = !!(program.libraryIntro || program.libraryInCharge || libraryTables.length > 0);
  // A year counts once it has a label and at least one issue slot (even an
  // issue with no PDF yet still renders, just as "Unavailable" — this lets
  // an admin scaffold a year's issues ahead of uploading each PDF).
  // Admin-defined academic-year table (Programs admin's "News & Events —
  // Department Page") — originally AI/CSE/ECE-only (see DepartmentDetail.tsx),
  // now available to every programme too, alongside the simpler
  // departmentNews-collection-based section below. A programme only ends up
  // with both showing if an admin fills in both; in practice each programme
  // picks one.
  const newsEventsYears = (program.newsEventsYears || []).filter((y) => y.year && y.columns?.length > 0 && y.rows?.length > 0);
  const hasNewsEventsYears = newsEventsYears.length > 0;
  const newsletterYears = (program.newsletterYears || []).filter((y) => y.year && y.issues && y.issues.length > 0);
  const hasNewsletter = newsletterYears.length > 0;
  const newsletterMaxIssues = Math.max(0, ...newsletterYears.map((y) => y.issues.length));
  // Only links with both a name and an uploaded PDF are shown — a link
  // an admin has started naming but not yet uploaded a PDF for stays
  // invisible rather than rendering a dead/empty link.
  const rndLinks = (program.rndLinks || []).filter((l) => l.label && l.pdfUrl);
  const rndTableSections = parseFlexibleTable(program.rndTableText || '').filter((s) => s.headers.length > 0);
  const rndProjectCategories = parseProjectAccordion(program.rndProjectsText || '').filter((c) => c.projects.length > 0);
  const hasRnd = !!program.rndIntro || rndTableSections.length > 0 || rndProjectCategories.length > 0 || rndLinks.length > 0;
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
  const visibleCustomSections = (program.customSections || []).filter(hasCustomSectionContent);

  const quickLinks = [
    { id: 'about', label: 'About the Department' },
    hasVisionMission && { id: 'vision-mission', label: 'Vision, Mission & Values' },
    hasOutcomeStatements && { id: 'peos-pos-psos', label: outcomeHeading },
    hasHod && { id: 'hod', label: 'About HOD' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    hasMindMap && { id: 'mindmap', label: 'Mind Map' },
    hasCurriculum && { id: 'curriculum', label: 'Curriculum' },
    hasLabs && { id: 'labs', label: 'Laboratories' },
    hasLibrary && { id: 'library', label: 'Department Library' },
    hasRnd && { id: 'rnd', label: 'Research & Development (Funded Projects & Patents)' },
    placementYears.length > 0 && { id: 'placements', label: 'Placements' },
    hasNewsletter && { id: 'newsletter', label: 'Newsletter' },
    hasNewsEventsYears && { id: 'news-events', label: 'News & Events' },
    ...visibleCustomSections.map((s) => ({ id: s.id, label: s.label })),
  ].filter(Boolean) as { id: string; label: string }[];

  const hasSidebarContent = quickLinks.length > 1 || hasCareerOutcomes;

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
      {(program.intake || program.established || program.accreditation || program.hod) && (
        <section className="dept-facts-section" aria-label={`${program.name} key facts`}>
          <div className="container">
            <div className="dept-facts-grid cols-4">
              {program.hod && (
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
                        <a href="#hod" className="dept-fact-chip-link" aria-label={`View ${program.hod} details`}>
                          <div className="dept-fact-chip-entry">
                            <span className="dept-fact-chip-sub">Professor & HOD</span>
                            <span className="dept-fact-chip-val">{program.hod}</span>
                          </div>
                        </a>
                      ) : (
                        <div className="dept-fact-chip-entry">
                          <span className="dept-fact-chip-sub">Professor & HOD</span>
                          <span className="dept-fact-chip-val">{program.hod}</span>
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

      {/* About + Highlights */}
      <section id="about" className="section bg-white dept-about-section" style={{ scrollMarginTop: NAV_OFFSET }}>
        <div className="container">
          <div className={hasSidebarContent ? 'detail-grid' : ''}>
            {/* Main content */}
            <div className="dept-about-main">
              <div className="dept-about-header">
                <span className="section-label dept-section-label">Department Overview</span>
                <h2 className="section-title">{deptTitle || program.shortName || program.name}</h2>
              </div>

              <div className="dept-about-card">
                <p className="dept-about-lead-text">
                  {program.about}
                </p>
              </div>

              {/* Programme Highlights */}
              {program.highlights && program.highlights.length > 0 && (
                <div style={{ marginTop: 'var(--space-8)' }}>
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
                        <span className="dept-highlight-text">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            {hasSidebarContent && (
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
                          <span className="dept-quick-nav-subtitle">{quickLinks.length} Sections</span>
                        </div>
                      </div>

                      <ul className="dept-quick-nav-list" role="list">
                        {quickLinks.map((l) => (
                          <li key={l.id} className="dept-quick-nav-item">
                            <a href={`#${l.id}`} className="dept-quick-nav-link">
                              <span className="dept-quick-nav-text">{l.label}</span>
                              <span className="dept-btn-arrow-circle">
                                <ChevronRight size={13} strokeWidth={2.4} className="dept-quick-nav-arrow" aria-hidden="true" />
                              </span>
                            </a>
                          </li>
                        ))}
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
            )}
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values (Italian-Inspired Sleek Showcase) */}
      {hasVisionMission && (
        <section id="vision-mission" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Our Guiding Pillars</span>
              <h2 className="section-title">Vision, Mission &amp; Values</h2>
            </div>
            <div className="dept-vm-grid">
              {program.vision && (
                <div className="dept-vm-card">
                  <div className="dept-vm-card-top">
                    <span className="dept-vm-num-badge">01 · VISION</span>
                    <div className="dept-vm-icon-badge">
                      <Compass size={20} strokeWidth={2.2} />
                    </div>
                  </div>
                  <h3 className="dept-vm-title">Programme Vision</h3>
                  <p className="dept-vm-body-text">{program.vision}</p>
                </div>
              )}

              {program.mission && program.mission.length > 0 && (
                <div className="dept-vm-card">
                  <div className="dept-vm-card-top">
                    <span className="dept-vm-num-badge">02 · MISSION</span>
                    <div className="dept-vm-icon-badge">
                      <Target size={20} strokeWidth={2.2} />
                    </div>
                  </div>
                  <h3 className="dept-vm-title">Mission Statements</h3>
                  <ul className="dept-vm-mission-list">
                    {program.mission.map((m, mi) => (
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

              {program.coreValues && program.coreValues.length > 0 && (
                <div className="dept-values-card">
                  <div className="dept-values-header">
                    <Sparkles size={22} strokeWidth={2} style={{ color: 'var(--color-accent)' }} />
                    <h3 className="dept-values-title">Institutional Core Values</h3>
                  </div>
                  <div className="dept-values-chips-wrap">
                    {program.coreValues.map((v) => (
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

      {/* About HOD (Executive Italian Editorial Layout) */}
      {hasHod && (
        <section id="hod" className="dept-hod-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Academic Leadership</span>
              <h2 className="section-title">Head of Department</h2>
            </div>
            
            <div className="dept-hod-editorial-card">
              {program.hodImage && (
                <div className="dept-hod-media-frame">
                  <SmoothImage
                    src={program.hodImage}
                    alt={program.hod || 'Head of Department'}
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

                {program.hod && (
                  <h3 className="dept-hod-name">{program.hod}</h3>
                )}

                <div className="dept-hod-meta">
                  <span>Head of the Department & Senior Faculty</span>
                </div>

                {program.hodMessage && (
                  <div className="dept-hod-message-box">
                    <p className="dept-hod-message-text">{program.hodMessage}</p>
                  </div>
                )}

                {program.hodEmail && (
                  <div className="dept-hod-actions">
                    <a href={`mailto:${program.hodEmail}`} className="dept-hod-mail-btn">
                      <Mail size={15} strokeWidth={2.2} />
                      <span>Contact HOD: {program.hodEmail}</span>
                    </a>
                  </div>
                )}

                {program.hodResearchProfiles && program.hodResearchProfiles.length > 0 && (
                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Research Profiles:</span>
                    {program.hodResearchProfiles.map((link) => (
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
        </section>
      )}

      {/* Faculty Carousel (matching Google UI reference design) */}
      {faculty.length > 0 && (
        <div id="faculty" style={{ scrollMarginTop: NAV_OFFSET }}>
          <FacultyCarousel
            faculty={faculty}
            departmentName={deptTitle || program.name}
            title="Learn from our impactful faculty"
            viewMoreLink="/faculty"
          />
        </div>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setMindMapOpen(true)}
                aria-label="Open Mind Map in full size"
                style={{
                  display: 'inline-block', background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)',
                  borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', cursor: 'zoom-in', maxWidth: '100%',
                  transition: 'box-shadow var(--transition-base), border-color var(--transition-base)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--color-light-gray)'; }}
              >
                <SmoothImage
                  src={program.mindMapImage}
                  alt={`${program.shortName || program.name} curriculum mind map`}
                  style={{ display: 'block', maxWidth: '100%', maxHeight: '70vh', width: 'auto', height: 'auto', borderRadius: 'var(--radius-sm)' }}
                />
              </button>
            </div>
          </div>
        </section>
      )}
      {mindMapOpen && (
        <ImageLightbox
          src={program.mindMapImage}
          alt={`${program.shortName || program.name} curriculum mind map`}
          onClose={() => setMindMapOpen(false)}
        />
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

            <div className="dept-labs-grid">
              {labs.map((lab, li) => {
                const indexNum = String(li + 1).padStart(2, '0');

                return (
                  <div key={li} className="dept-lab-card">
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
                      {lab.pdfUrl ? (
                        <a
                          href={lab.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dept-lab-pdf-btn"
                          aria-label={`View ${lab.name} manual`}
                        >
                          <span className="dept-lab-pdf-btn-label">
                            <FileText size={13} strokeWidth={2.4} />
                            <span>Lab Manual & Specs</span>
                          </span>
                          <span className="dept-btn-arrow-circle">
                            <ArrowRight size={12} strokeWidth={2.5} />
                          </span>
                        </a>
                      ) : (
                        <span className="dept-lab-status-tag">
                          <span className="dept-lab-live-dot" />
                          <span>Active Department Lab</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
                <div className="placement-stat-grid">
                  <div className="placement-stat-tile">
                    <div className="placement-stat-tile__label">No. of Companies Visited</div>
                    <div className="placement-stat-tile__value">{placementYearStats.companiesVisited}</div>
                  </div>
                  <div className="placement-stat-tile">
                    <div className="placement-stat-tile__label">Total No. of Offers</div>
                    <div className="placement-stat-tile__value">{placementYearStats.totalOffers}</div>
                  </div>
                  <div className="placement-stat-tile">
                    <div className="placement-stat-tile__label">Top 10 Companies List</div>
                    <button
                      type="button"
                      className="placement-stat-tile__value--link"
                      onClick={() => document.getElementById('placement-records-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    >
                      Package wise
                    </button>
                  </div>
                  <div className="placement-stat-tile">
                    <div className="placement-stat-tile__label">Average Salary</div>
                    <div className="placement-stat-tile__value">{placementYearStats.averageSalary ?? '—'}</div>
                  </div>
                  <div className="placement-stat-tile">
                    <div className="placement-stat-tile__label">Median Salary</div>
                    <div className="placement-stat-tile__value">{placementYearStats.medianSalary ?? '—'}</div>
                  </div>
                  <div className="placement-stat-tile">
                    <div className="placement-stat-tile__label">Highest Package</div>
                    <div className="placement-stat-tile__value">{placementYearStats.highestPackage ?? '—'}</div>
                  </div>
                  {placementYearStats.above50Lpa > 0 && (
                    <div className="placement-stat-tile">
                      <div className="placement-stat-tile__label">Above 50 LPA+</div>
                      <div className="placement-stat-tile__value">{placementYearStats.above50Lpa} offers</div>
                    </div>
                  )}
                  {placementYearStats.above30Lpa > 0 && (
                    <div className="placement-stat-tile">
                      <div className="placement-stat-tile__label">Above 30 LPA+</div>
                      <div className="placement-stat-tile__value">{placementYearStats.above30Lpa} offers</div>
                    </div>
                  )}
                  <div className="placement-stat-tile">
                    <div className="placement-stat-tile__label">Above 10 LPA+</div>
                    <div className="placement-stat-tile__value">{placementYearStats.above10Lpa} offers</div>
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

      {/* Department Library (Italian-Inspired 3-Column Grid Showcase) */}
      {hasLibrary && (
        <section id="library" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">Academic Repository</span>
              <h2 className="section-title">Department Library</h2>
            </div>

            <div className="dept-library-container">
              {program.libraryIntro && (
                <div style={{ maxWidth: 840 }}>
                  <BodyBlocks
                    blocks={parseBodyContent(program.libraryIntro)}
                    paragraphStyle={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)' }}
                  />
                </div>
              )}

              {program.libraryInCharge && (
                <div className="dept-library-incharge-card">
                  <div className="dept-library-incharge-icon-wrap">
                    <BookOpen size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="dept-library-incharge-label">In-Charge of Department Library</div>
                    <h3 className="dept-library-incharge-name">{program.libraryInCharge}</h3>
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

      {/* News & Events — Collapsible / Expandable Academic Year Tables */}
      {hasNewsEventsYears && (
        <section id="news-events" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">{program.shortName || program.name}</span>
              <h2 className="section-title">News &amp; Events</h2>
            </div>

            <div className="dept-news-accordion">
              {newsEventsYears.map((yr, yi) => {
                const isOpen = openNewsYears.size === 0 && yi === 0 ? true : openNewsYears.has(yr.year);
                return (
                  <div key={yr.year || yi} className={`dept-news-accordion-item${isOpen ? ' open' : ''}`}>
                    <button
                      type="button"
                      className="dept-news-accordion-header"
                      onClick={() => toggleNewsYear(yr.year)}
                      aria-expanded={isOpen}
                      aria-controls={`news-table-${yi}`}
                    >
                      <div className="dept-news-accordion-header-left">
                        <div className="dept-news-year-pill">
                          <Calendar size={18} strokeWidth={2.2} style={{ color: 'var(--color-accent)' }} />
                          <span>Academic Year :: {yr.year}</span>
                        </div>
                        <span className="dept-news-count-badge">
                          {yr.rows.length} Activities &amp; Events
                        </span>
                      </div>
                      <div className="dept-news-chevron-circle" aria-hidden="true">
                        <ChevronDown size={18} strokeWidth={2.4} />
                      </div>
                    </button>

                    <SmoothCollapse open={isOpen}>
                      <div id={`news-table-${yi}`} className="dept-news-accordion-content">
                        <div className="pb-activities-scroll" role="region" aria-label={`News and events for academic year ${yr.year}`} tabIndex={0}>
                          <table>
                            <thead>
                              <tr>
                                <th className="pb-activities-num" scope="col">S.No</th>
                                {yr.columns.map((col, ci) => <th key={ci} scope="col">{col}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {yr.rows.map((row, ri) => (
                                <tr key={ri}>
                                  <td className="pb-activities-num">{ri + 1}</td>
                                  {yr.columns.map((_, ci) => <td key={ci}>{row.cells[ci] ?? ''}</td>)}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </SmoothCollapse>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
