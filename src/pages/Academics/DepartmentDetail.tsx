import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Check, Microscope, Compass, Target, Sparkles, Mail, BookOpen, FileText } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import ImageLightbox from '../../components/ImageLightbox/ImageLightbox';
import ProgrammeStructure from '../../components/ProgrammeStructure/ProgrammeStructure';
import BodyBlocks, { parseBodyContent } from '../../components/BodyBlocks/BodyBlocks';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import SEO from '../../components/SEO/SEO';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useDocument } from '../../hooks/useDocument';
import { useEapcetCode } from '../../hooks/useContentBlocks';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { getProgramSchema, getBreadcrumbSchema } from '../../lib/seo/schemas';
import type { DepartmentGroup } from '../../lib/departmentGroups';
import { normalizeLab, type ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { FacultyDoc } from './Faculty';
import { parseFlexibleTable, parseProjectAccordion } from '../../lib/structuredTable';
import { placementRecordsDocId, sortPlacementRows, type PlacementRecordSet } from '../../lib/placementRecords';
import { hasCustomSectionContent } from '../../lib/customSections';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
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
  const [mindMapOpen, setMindMapOpen] = useState(false);
  const [outcomeTab, setOutcomeTab] = useState<string | null>(null);
  // "Choose a Programme" Quick Links accordion — starts open so the sub-links
  // remain visible by default (unchanged from before this was collapsible).
  const [programmeLinksOpen, setProgrammeLinksOpen] = useState(true);
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

  // Individual student Placement Records — admin-imported from Excel/CSV
  // (see PlacementRecordsEditor in DepartmentsAdmin.tsx), one Firestore doc
  // per department keyed by its lowercased Short Code, so this only ever
  // shows this exact department's own records.
  const { data: placementRecords } = useDocument<PlacementRecordSet>('placementRecords', placementRecordsDocId(group.deptShortCode));

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
    const firstAvailable = activeProgram?.peos?.length ? 'peos' : activeProgram?.pos?.length ? 'pos' : activeProgram?.psos?.length ? 'psos' : activeProgram?.wks?.length ? 'wks' : null;
    if (firstAvailable) setOutcomeTab((prev) => prev ?? firstAvailable);
  }, [activeProgram?.peos?.length, activeProgram?.pos?.length, activeProgram?.psos?.length, activeProgram?.wks?.length]);

  if (progLoading && subPrograms.length === 0) {
    return (
      <main className="route-fallback">
        <div className="route-fallback__spinner" />
      </main>
    );
  }
  if (!progLoading && !activeProgram) return <Navigate to="/academics" replace />;
  // Also wait on the department lookup: rendering before it resolves would
  // show the short code (activeProgram.department / group.deptShortCode)
  // as the page title/H1 and then flash to the full department title once
  // `allDepartments` loads (e.g. "AI" -> "Artificial Intelligence").
  if (!activeProgram || deptLoading) {
    return (
      <main className="route-fallback">
        <div className="route-fallback__spinner" />
      </main>
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
    vision: dept?.vision || primary?.vision || '',
    mission: (dept?.mission?.length ? dept.mission : primary?.mission) || [],
    coreValues: (dept?.coreValues?.length ? dept.coreValues : primary?.coreValues) || [],
    // dept.labs (Academic Departments admin) is plain strings with no PDF
    // support; primary.labs (Programs admin) may hold richer { name, pdfUrl }
    // entries — normalizeLab() upgrades either shape so this page never cares
    // which source it came from.
    labs: ((dept?.labs?.length ? dept.labs : primary?.labs) || []).map(normalizeLab),
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
  const programLevels = shared.programLevels.filter((l) => l.title && (l.intro || l.rows?.length > 0));
  const hasProgramLevels = programLevels.length > 0;
  const libraryTables = shared.librarySections.filter((sec) => sec.items && sec.items.length > 0);
  const hasLibrary = !!(shared.libraryIntro || shared.libraryInCharge || libraryTables.length > 0);
  const placementColumns = placementRecords?.columns || [];
  const placementRows = placementColumns.length > 0 && placementRecords
    ? sortPlacementRows(placementColumns, placementRecords.rows || [])
    : [];
  const hasPlacements = !!(shared.placementIntro || shared.placementStats.length > 0 || shared.placementRecruiters.length > 0 || placementRows.length > 0);

  const hasProgrammeAbout = !!activeProgram.about;
  const hasHighlights = !!(activeProgram.highlights && activeProgram.highlights.length > 0);
  // Tabbed PEOs / POs / PSOs — only whichever of the three an admin has
  // actually filled in (via /admin → Programs) becomes a tab.
  const outcomeGroups = [
    { key: 'peos', short: 'PEOs', title: 'Programme Educational Objectives (PEOs)', items: activeProgram.peos },
    { key: 'pos', short: 'POs', title: 'Programme Outcomes (POs)', items: activeProgram.pos },
    { key: 'psos', short: 'PSOs', title: 'Programme Specific Outcomes (PSOs)', items: activeProgram.psos },
    { key: 'wks', short: 'WKs', title: 'Knowledge Profile (WKs)', items: activeProgram.wks },
  ].filter((g) => g.items && g.items.length > 0);
  const hasOutcomeStatements = outcomeGroups.length > 0;
  const activeOutcome = outcomeGroups.find((g) => g.key === outcomeTab) ?? outcomeGroups[0];
  const hasMindMap = !!activeProgram.mindMapImage;
  // News & Events + Newsletter here use the teammate's per-academic-year
  // fields on the programme doc (see ProgramsAdmin's "News & Events —
  // Department Page" / "Newsletter" editors) — the plain departmentNews
  // collection (<DepartmentNewsSection>) is only used on standalone program
  // pages (ProgramDetail.tsx), so the two systems never both show up.
  const newsEventsYears = (activeProgram.newsEventsYears || []).filter((y) => y.year && y.columns?.length > 0 && y.rows?.length > 0);
  const hasNewsEvents = newsEventsYears.length > 0;
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
  const hasRnd = !!activeProgram.rndIntro || rndTableSections.length > 0 || rndProjectCategories.length > 0 || rndLinks.length > 0;
  const visibleCustomSections = (activeProgram.customSections || []).filter(hasCustomSectionContent);

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
    hasLabs && { id: 'labs', label: 'Laboratories' },
    { id: 'program-toggle', label: 'Choose a Programme' },
    hasRnd && { id: 'rnd', label: 'R & D' },
    hasPlacements && { id: 'placements', label: 'Placements' },
    hasNewsEvents && { id: 'news-events', label: 'News & Events' },
  ].filter(Boolean) as { id: string; label: string }[];
  // Nested under the "Choose a Programme" row above as a collapsible
  // sub-list — same admin-driven presence checks as before, just grouped.
  const programmeLinks = [
    hasProgrammeAbout && { id: 'programme-about', label: 'About the Programme' },
    hasHighlights && { id: 'highlights', label: 'Programme Highlights' },
    hasOutcomeStatements && { id: 'peos-pos-psos', label: 'PEOs, POs, PSOs & WKs' },
    hasMindMap && { id: 'mindmap', label: 'Mind Map' },
    { id: 'curriculum', label: 'Curriculum' },
    ...visibleCustomSections.map((s) => ({ id: s.id, label: s.label })),
  ].filter(Boolean) as { id: string; label: string }[];

  // Top stats bar, laid out as stacked rows: Head of Department gets its own
  // line (one person for the whole department). Established/Accreditation
  // show once, on their own line, when an admin has set them directly on the
  // department doc — but when that's empty, each program gets its own line
  // with its own Established / Accreditation / Intake grouped together
  // (since those routinely differ between the two programs, e.g. CSE is NBA
  // accredited while Cyber Security isn't yet). Intake always differs per
  // program, so in the shared-Established case each program still gets its
  // own Intake line.
  const statRows: { label: string; value: string }[][] = [];
  if (shared.hod) statRows.push([{ label: 'Head of Department', value: shared.hod }]);
  const hasSharedEstAccred = clean(dept?.established) || clean(dept?.accreditation);
  if (hasSharedEstAccred) {
    const sharedRow: { label: string; value: string }[] = [];
    if (clean(dept?.established)) sharedRow.push({ label: 'Established', value: clean(dept?.established) });
    if (clean(dept?.accreditation)) sharedRow.push({ label: 'Accreditation', value: clean(dept?.accreditation) });
    if (sharedRow.length) statRows.push(sharedRow);
    subPrograms.forEach((p) => {
      if (p.intake) statRows.push([{ label: `${p.shortName || p.name} — Intake`, value: `${p.intake} Seats` }]);
    });
  } else {
    subPrograms.forEach((p) => {
      const label = p.shortName || p.name;
      const row: { label: string; value: string }[] = [];
      if (clean(p.established)) row.push({ label: `${label} — Established`, value: clean(p.established) });
      if (clean(p.accreditation)) row.push({ label: `${label} — Accreditation`, value: clean(p.accreditation) });
      if (p.intake) row.push({ label: `${label} — Intake`, value: `${p.intake} Seats` });
      if (row.length) statRows.push(row);
    });
  }

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

      {/* Stats bar — one row per group (HOD alone, then each program's own
          Established/Accreditation/Intake together on their own line) */}
      {statRows.length > 0 && (
        <section style={{ background: 'var(--color-primary)', padding: 'var(--space-4) 0' }}>
          <div className="container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              {statRows.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-10)', rowGap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {row.map((s) => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      {s.label === 'Head of Department' && hasHod ? (
                        <a href="#hod" style={{ fontFamily: 'var(--font-serif)', fontSize: '0.92rem', fontWeight: 900, color: 'var(--color-accent)', whiteSpace: 'nowrap', textDecoration: 'underline', textUnderlineOffset: 3 }}>{s.value}</a>
                      ) : (
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.92rem', fontWeight: 900, color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>{s.value}</div>
                      )}
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)', marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About the Department (shared) + Quick Links */}
      {hasAbout && (
        <section id="about" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className={quickLinks.length > 1 ? 'detail-grid' : ''}>
              <div>
                <span className="section-label">About the Department</span>
                <h2 className="section-title">{deptName}</h2>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.85, fontSize: 'var(--text-base)', whiteSpace: 'pre-line' }}>
                  {shared.about}
                </p>
              </div>

              {quickLinks.length > 1 && (
                <div className="detail-sidebar">
                  <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)', background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                    <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                      Quick Links
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      {quickLinks.map((l) => (
                        l.id === 'program-toggle' ? (
                          <li key={l.id}>
                            <button
                              type="button"
                              onClick={() => setProgrammeLinksOpen((v) => !v)}
                              aria-expanded={programmeLinksOpen}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                background: 'none', border: 'none', padding: 'var(--space-2) 0', color: 'rgba(255,255,255,0.85)',
                                fontSize: 'var(--text-sm)', fontWeight: 600, fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                              }}
                            >
                              {l.label}
                              <svg
                                width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                                style={{ flexShrink: 0, marginLeft: 'var(--space-2)', opacity: 0.75, transition: 'transform var(--transition-base)', transform: programmeLinksOpen ? 'rotate(180deg)' : 'none' }}
                              >
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <SmoothCollapse open={programmeLinksOpen}>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                                {programmeLinks.map((c) => (
                                  <li key={c.id}>
                                    <a href={`#${c.id}`} style={{ display: 'block', padding: 'var(--space-2) 0 var(--space-2) var(--space-4)', color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                      {c.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </SmoothCollapse>
                          </li>
                        ) : (
                          <li key={l.id}>
                            <a href={`#${l.id}`} style={{ display: 'block', padding: 'var(--space-2) 0', color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                              {l.label}
                            </a>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>
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
            {programLevels.map((level, li) => (
              <div key={li} style={{ marginBottom: li === programLevels.length - 1 ? 0 : 'var(--space-10)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: 'var(--space-3)' }}>
                  <span style={{ width: 4, height: '1.6em', background: 'var(--color-accent)', borderRadius: 2, flexShrink: 0 }} />
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>{level.title}</h3>
                </div>
                {level.intro && (
                  <p style={{ color: 'var(--color-text-light)', lineHeight: 1.85, fontSize: 'var(--text-base)', whiteSpace: 'pre-line', marginBottom: level.rows?.length > 0 ? 'var(--space-5)' : 0, maxWidth: 760 }}>
                    {level.intro}
                  </p>
                )}
                {level.rows && level.rows.length > 0 && (
                  <div className="pb-activities-scroll" style={{ maxWidth: 600 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>{level.title}</th>
                          <th>Intake</th>
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
            ))}
          </div>
        </section>
      )}

      {/* Vision, Mission & Values (shared) */}
      {hasVisionMission && (
        <section id="vision-mission" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Our Foundation</span>
              <h2 className="section-title">Vision, Mission &amp; Values</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {shared.vision && (
                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderTop: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <Compass size={20} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)' }}>Vision</h3>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.75 }}>{shared.vision}</p>
                </div>
              )}
              {shared.mission && shared.mission.length > 0 && (
                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderTop: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <Target size={20} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)' }}>Mission</h3>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {shared.mission.map((m) => (
                      <li key={m} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                        <Check size={14} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 3 }} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {shared.coreValues && shared.coreValues.length > 0 && (
                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderTop: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <Sparkles size={20} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)' }}>Core Values</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {shared.coreValues.map((v) => (
                      <span key={v} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-full)', padding: '0.35rem 0.9rem' }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* About HOD (shared) */}
      {hasHod && (
        <section id="hod" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Leadership</span>
              <h2 className="section-title">About HOD</h2>
            </div>
            <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-start', padding: 'var(--space-8)' }}>
                {shared.hodImage && (
                  <SmoothImage src={shared.hodImage} alt={shared.hod || 'Head of Department'} style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                )}
                <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                  {shared.hod && (
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>{shared.hod}</h3>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Head of Department, {deptName}
                    </span>
                    {shared.hodEmail && (
                      <a href={`mailto:${shared.hodEmail}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        <Mail size={14} strokeWidth={1.75} /> {shared.hodEmail}
                      </a>
                    )}
                  </div>
                  {shared.hodMessage && (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{shared.hodMessage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Faculty (shared — union across the department's programs) */}
      {faculty.length > 0 && (
        <section id="faculty" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Our Team</span>
              <h2 className="section-title">Faculty</h2>
              <p className="section-desc">{faculty.length} faculty members across the department.</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary)' }}>
                    {['S.No', 'Name', 'Designation', 'Qualification'].map((h) => (
                      <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-white)', fontWeight: 700, textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((f, i) => (
                    <tr key={f.id} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-light)', fontWeight: 600, width: 48 }}>{i + 1}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <Link to={`/faculty/${f.id}`} style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>{f.name}</Link>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{f.designation}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-light)' }}>{f.qualification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Laboratories (shared) */}
      {hasLabs && (
        <section id="labs" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Infrastructure</span>
              <h2 className="section-title">Laboratories</h2>
            </div>
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
              {shared.labs.map((lab, li) => {
                const tileStyle = { background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-accent)' };
                const content = (
                  <>
                    <Microscope size={22} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.4 }}>{lab.name}</span>
                      {!lab.pdfUrl && (
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                          PDF not available
                        </span>
                      )}
                    </span>
                  </>
                );
                return lab.pdfUrl ? (
                  <a key={li} href={lab.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ ...tileStyle, textDecoration: 'none' }}>
                    {content}
                  </a>
                ) : (
                  <div key={li} style={tileStyle}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Placements (shared) */}
      {hasPlacements && (
        <section id="placements" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Careers</span>
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
            {/* Individual student Placement Records — admin-imported from
                Excel/CSV, every column shown exactly as uploaded. The top 10
                highest-package rows are pulled to the front (see
                sortPlacementRows); everyone else keeps their original
                imported order. */}
            {placementRows.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>
                  Placement Records
                </h3>
                <div className="pb-activities-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th className="pb-activities-num">S.No</th>
                        {placementColumns.map((col, ci) => <th key={ci}>{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {placementRows.map((row, ri) => (
                        <tr key={ri}>
                          <td className="pb-activities-num">{ri + 1}</td>
                          {placementColumns.map((_, ci) => <td key={ci}>{row.cells[ci] ?? ''}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Department Library (shared) */}
      {hasLibrary && (
        <section id="library" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Resources</span>
              <h2 className="section-title">Department Library</h2>
            </div>
            {shared.libraryIntro && (
              <BodyBlocks
                blocks={parseBodyContent(shared.libraryIntro)}
                paragraphStyle={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)' }}
              />
            )}
            {shared.libraryInCharge && (
              <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', marginBottom: libraryTables.length > 0 ? 'var(--space-6)' : 0 }}>
                <BookOpen size={16} strokeWidth={1.75} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <strong style={{ color: 'var(--color-primary)' }}>In-charge of Department Library:</strong> {shared.libraryInCharge}
              </p>
            )}
            {libraryTables.map((sec, si) => (
              <div key={si} style={{ marginBottom: si === libraryTables.length - 1 ? 0 : 'var(--space-8)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                  {sec.heading}
                </h3>
                <div className="pb-activities-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th className="pb-activities-num">S. No</th>
                        <th>Item</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sec.items.map((item, ii) => (
                        <tr key={ii}>
                          <td className="pb-activities-num">{ii + 1}</td>
                          <td>{item.label}</td>
                          <td>{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Program toggle ===== */}
      <section id="program-toggle" style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0', scrollMarginTop: NAV_OFFSET }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Choose a Programme</span>
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
            <span className="section-label">{activeProgram.shortName || activeProgram.name}</span>
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
              <span className="section-label">{activeProgram.shortName || activeProgram.name}</span>
              <h2 className="section-title">Programme Highlights</h2>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
              {activeProgram.highlights.map((h) => (
                <li key={h} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', color: 'var(--color-text)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  <Check size={16} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* PEOs, POs & PSOs (per programme) */}
      {hasOutcomeStatements && (
        <section id="peos-pos-psos" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Outcome-Based Education</span>
              <h2 className="section-title">PEOs, POs, PSOs &amp; WKs</h2>
            </div>
            <div className="section-tabs">
              {outcomeGroups.map((g) => (
                <button
                  key={g.key}
                  onClick={() => setOutcomeTab(g.key)}
                  className={`section-tab-btn${activeOutcome?.key === g.key ? ' active' : ''}`}
                >
                  {g.short}
                </button>
              ))}
            </div>
            {activeOutcome && (
              <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
                  {activeOutcome.title}
                </h3>
                <ol style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', listStylePosition: 'inside' }}>
                  {activeOutcome.items!.map((item, i) => (
                    <li key={item} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.65 }}>
                      <strong style={{ color: 'var(--color-accent)' }}>{activeOutcome.key.slice(0, -1).toUpperCase()}{i + 1}:</strong> {item}
                    </li>
                  ))}
                </ol>
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
              <span className="section-label">Curriculum Overview</span>
              <h2 className="section-title">Mind Map</h2>
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
                  src={activeProgram.mindMapImage}
                  alt={`${activeProgram.shortName || activeProgram.name} curriculum mind map`}
                  style={{ display: 'block', maxWidth: '100%', maxHeight: '70vh', width: 'auto', height: 'auto', borderRadius: 'var(--radius-sm)' }}
                />
              </button>
            </div>
          </div>
        </section>
      )}
      {mindMapOpen && (
        <ImageLightbox
          src={activeProgram.mindMapImage}
          alt={`${activeProgram.shortName || activeProgram.name} curriculum mind map`}
          onClose={() => setMindMapOpen(false)}
        />
      )}

      {/* Curriculum (per programme) */}
      <section id="curriculum" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Curriculum</span>
            <h2 className="section-title">{activeProgram.shortName || activeProgram.name} — Programme Structure</h2>
          </div>
          <ProgrammeStructure semesters={activeProgram.semesters} />
        </div>
      </section>

      {/* News & Events (per programme, admin-defined academic-year tables) */}
      {hasNewsEvents && (
        <section id="news-events" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">{activeProgram.shortName || activeProgram.name}</span>
              <h2 className="section-title">News &amp; Events</h2>
            </div>
            {newsEventsYears.map((yr, yi) => (
              <div key={yi} style={{ marginBottom: yi === newsEventsYears.length - 1 ? 0 : 'var(--space-8)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                  Academic Year :: {yr.year}
                </h3>
                <div className="pb-activities-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th className="pb-activities-num">S.No</th>
                        {yr.columns.map((col, ci) => <th key={ci}>{col}</th>)}
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
            ))}
          </div>
        </section>
      )}

      {/* Newsletter (per programme) */}
      {hasNewsletter && (
        <section id="newsletter" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">{activeProgram.shortName || activeProgram.name}</span>
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
              <span className="section-label">Research</span>
              <h2 className="section-title">Research &amp; Development (Funded Projects &amp; Patents)</h2>
            </div>
            {activeProgram.rndIntro && (
              <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)', maxWidth: 760, whiteSpace: 'pre-line' }}>
                {activeProgram.rndIntro}
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
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Apply Today</span>
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
