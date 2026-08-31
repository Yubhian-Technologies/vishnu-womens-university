import { useEffect } from 'react';
import { Link, useParams, useLocation, Navigate } from 'react-router-dom';
import { Check, Microscope, Compass, Target, Sparkles, Mail, ExternalLink, BookOpen, FileText } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import ProgrammeStructure from '../../components/ProgrammeStructure/ProgrammeStructure';
import DepartmentNewsSection, { type DepartmentNewsDoc } from '../../components/DepartmentNews/DepartmentNewsSection';
import DepartmentDetail from './DepartmentDetail';
import { groupForProgramSlug } from '../../lib/departmentGroups';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanner } from '../../hooks/usePageBanner';
import { useEapcetCode } from '../../hooks/useContentBlocks';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { normalizeLab, type ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { FacultyDoc } from './Faculty';
import SEO from '../../components/SEO/SEO';
import { getProgramSchema, getBreadcrumbSchema } from '../../lib/seo/schemas';
import '../detail-layout.css';

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
  return <SingleProgramDetail />;
}

function SingleProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { docs: allPrograms, loading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const program = allPrograms.find((p) => p.slug === slug);

  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const faculty = program?.department ? allFaculty.filter((f) => f.department === program.department) : [];
  const { docs: deptNews } = useOrderedCollection<DepartmentNewsDoc>('departmentNews', 'date', 'desc');
  const hasDeptNews = deptNews.some((n) => n.program === slug);
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
  const hasOutcomeStatements = !!(program.peos?.length || program.pos?.length || program.psos?.length);
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
  const newsletterYears = (program.newsletterYears || []).filter((y) => y.year && y.issues && y.issues.length > 0);
  const hasNewsletter = newsletterYears.length > 0;
  const newsletterMaxIssues = Math.max(0, ...newsletterYears.map((y) => y.issues.length));
  // Only links with both a name and an uploaded PDF are shown — a link
  // an admin has started naming but not yet uploaded a PDF for stays
  // invisible rather than rendering a dead/empty link.
  const rndLinks = (program.rndLinks || []).filter((l) => l.label && l.pdfUrl);
  const hasRnd = rndLinks.length > 0;

  const quickLinks = [
    { id: 'about', label: 'About the Department' },
    hasVisionMission && { id: 'vision-mission', label: 'Vision, Mission & Values' },
    hasOutcomeStatements && { id: 'peos-pos-psos', label: 'PEOs, POs & PSOs' },
    hasHod && { id: 'hod', label: 'About HOD' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    hasMindMap && { id: 'mindmap', label: 'Mind Map' },
    hasCurriculum && { id: 'curriculum', label: 'Curriculum' },
    hasLabs && { id: 'labs', label: 'Laboratories' },
    hasLibrary && { id: 'library', label: 'Digital Library' },
    hasDeptNews && { id: 'news', label: 'News & Events' },
    hasNewsletter && { id: 'newsletter', label: 'Newsletter' },
    hasRnd && { id: 'rnd', label: 'Research & Development (Funded Projects & Patents)' },
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
            {...({ fetchpriority: 'high' } as any)}
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

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-5) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {[
              ...(program.intake ? [{ label: 'Annual Intake', value: `${program.intake} Seats` }] : []),
              ...(program.established ? [{ label: 'Established', value: program.established }] : []),
              ...(program.accreditation ? [{ label: 'Accreditation', value: program.accreditation }] : []),
              ...(program.hod ? [{ label: 'Head of Department', value: program.hod }] : []),
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                {s.label === 'Head of Department' && hasHod ? (
                  <a href="#hod" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-accent)', whiteSpace: 'nowrap', textDecoration: 'underline', textUnderlineOffset: 3 }}>{s.value}</a>
                ) : (
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>{s.value}</div>
                )}
                <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Highlights */}
      <section id="about" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
        <div className="container">
          <div className={hasSidebarContent ? 'detail-grid' : ''}>
            {/* Main content */}
            <div>
              <div>
                <span className="section-label">About the Department</span>
                <h2 className="section-title">{deptTitle || program.shortName || program.name}</h2>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)' }}>
                  {program.about}
                </p>
              </div>

              {/* Programme Highlights */}
              {program.highlights && program.highlights.length > 0 && (
                <div style={{ marginTop: 'var(--space-8)' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
                    Programme Highlights
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {program.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', color: 'var(--color-text)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                        <Check size={16} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            {hasSidebarContent && (
            <div className="detail-sidebar">
              <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {/* Quick Links */}
                {quickLinks.length > 1 && (
                  <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                    <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                      Quick Links
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      {quickLinks.map((l) => (
                        <li key={l.id}>
                          <a href={`#${l.id}`} style={{ display: 'block', padding: 'var(--space-2) 0', color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
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
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values */}
      {hasVisionMission && (
        <section id="vision-mission" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Our Foundation</span>
              <h2 className="section-title">Vision, Mission &amp; Values</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {program.vision && (
                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderTop: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <Compass size={20} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)' }}>Vision</h3>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.75 }}>{program.vision}</p>
                </div>
              )}
              {program.mission && program.mission.length > 0 && (
                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderTop: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <Target size={20} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)' }}>Mission</h3>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {program.mission.map((m) => (
                      <li key={m} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                        <Check size={14} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 3 }} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {program.coreValues && program.coreValues.length > 0 && (
                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderTop: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <Sparkles size={20} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)' }}>Core Values</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {program.coreValues.map((v) => (
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

      {/* PEOs, POs & PSOs */}
      {hasOutcomeStatements && (
        <section id="peos-pos-psos" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Outcome-Based Education</span>
              <h2 className="section-title">PEOs, POs &amp; PSOs</h2>
              <p className="section-desc">The programme&apos;s educational objectives and outcomes, aligned to national accreditation frameworks.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
              {[
                { key: 'peos', title: 'Programme Educational Objectives (PEOs)', items: program.peos },
                { key: 'pos', title: 'Programme Outcomes (POs)', items: program.pos },
                { key: 'psos', title: 'Programme Specific Outcomes (PSOs)', items: program.psos },
              ].filter((g) => g.items && g.items.length > 0).map((g) => (
                <div key={g.key} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
                    {g.title}
                  </h3>
                  <ol style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', listStylePosition: 'inside' }}>
                    {g.items!.map((item, i) => (
                      <li key={item} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.65 }}>
                        <strong style={{ color: 'var(--color-accent)' }}>{g.key.slice(0, -1).toUpperCase()}{i + 1}:</strong> {item}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About HOD */}
      {hasHod && (
        <section id="hod" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Leadership</span>
              <h2 className="section-title">About HOD</h2>
            </div>
            <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-start', padding: 'var(--space-8)' }}>
                {program.hodImage && (
                  <SmoothImage
                    src={program.hodImage}
                    alt={program.hod || 'Head of Department'}
                    style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                  />
                )}
                <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                  {program.hod && (
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>{program.hod}</h3>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Head of Department, {program.shortName || program.name}
                    </span>
                    {program.hodEmail && (
                      <a href={`mailto:${program.hodEmail}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        <Mail size={14} strokeWidth={1.75} /> {program.hodEmail}
                      </a>
                    )}
                  </div>
                  {program.hodMessage && (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{program.hodMessage}</p>
                  )}
                </div>
              </div>
              {program.hodResearchProfiles && program.hodResearchProfiles.length > 0 && (
                <div style={{ background: 'var(--color-primary)', padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-5)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Research Profiles</span>
                  {program.hodResearchProfiles.map((link) => (
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

      {/* Faculty — live from the faculty collection, filtered to this program's department */}
      {faculty.length > 0 && (
        <section id="faculty" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Our Team</span>
              <h2 className="section-title">Faculty</h2>
              <p className="section-desc">{faculty.length} dedicated faculty members bringing academic excellence and industry expertise to every classroom.</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary)' }}>
                    {['S.No', 'Name', 'Designation', 'Qualification'].map(h => (
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
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-full)',
                          whiteSpace: 'nowrap',
                          background: f.designation.includes('HOD') || f.designation === 'Professor'
                            ? 'rgba(10,35,81,0.1)'
                            : f.designation.includes('Associate')
                              ? 'rgba(201,168,76,0.15)'
                              : 'rgba(0,0,0,0.05)',
                          color: f.designation.includes('HOD') || f.designation === 'Professor'
                            ? 'var(--color-primary)'
                            : f.designation.includes('Associate')
                              ? 'var(--color-accent)'
                              : 'var(--color-text-light)',
                          border: `1px solid ${f.designation.includes('HOD') || f.designation === 'Professor'
                            ? 'rgba(10,35,81,0.2)'
                            : f.designation.includes('Associate')
                              ? 'rgba(201,168,76,0.3)'
                              : 'rgba(0,0,0,0.1)'}`,
                        }}>
                          {f.designation}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-light)' }}>{f.qualification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center' }}>
              <SmoothImage src={program.mindMapImage} alt={`${program.shortName || program.name} curriculum mind map`} style={{ maxWidth: '100%', height: 'auto', borderRadius: 'var(--radius-sm)' }} />
            </div>
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

      {/* Laboratories */}
      {hasLabs && (
        <section id="labs" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Infrastructure</span>
              <h2 className="section-title">Laboratories</h2>
              <p className="section-desc">State-of-the-art laboratory facilities that bring coursework to life with hands-on, industry-relevant experimentation.</p>
            </div>
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
              {labs.map((lab, li) => {
                const tileStyle = { background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-accent)' };
                const content = (
                  <>
                    <Microscope size={22} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.4 }}>{lab.name}</span>
                      {/* Tile always stays visible even with no PDF yet — just marked
                          unavailable, same convention as the Newsletter issues above. */}
                      {!lab.pdfUrl && (
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                          PDF not available
                        </span>
                      )}
                    </span>
                  </>
                );
                // Opens this lab's own PDF straight from Firebase Storage in a new
                // tab — only when one has been uploaded via /admin → Programs.
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

      {/* Digital Library */}
      {hasLibrary && (
        <section id="library" className="section bg-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Resources</span>
              <h2 className="section-title">Digital Library</h2>
            </div>
            {program.libraryIntro && (
              <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>
                {program.libraryIntro}
              </p>
            )}
            {program.libraryInCharge && (
              <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text)', fontSize: 'var(--text-sm)', marginBottom: libraryTables.length > 0 ? 'var(--space-6)' : 0 }}>
                <BookOpen size={16} strokeWidth={1.75} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <strong style={{ color: 'var(--color-primary)' }}>In-charge of Department Library:</strong> {program.libraryInCharge}
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

      {/* News & Events — live from the departmentNews collection, tagged to
          this program. (The AI/CSE/ECE grouped department page uses the
          teammate's per-academic-year newsEventsYears table instead — see
          DepartmentDetail.tsx — so the two systems don't both show up on the
          same page: this one is for standalone programs.) */}
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
                    {Array.from({ length: newsletterMaxIssues }).map((_, ci) => (
                      <th key={ci}>Issue – {ci + 1}</th>
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

      {/* Research & Development (Funded Projects & Patents) — a flat,
          admin-named list of links, each opening its own uploaded PDF in a
          new tab. A link only appears once it has both a name and a PDF. */}
      {hasRnd && (
        <section id="rnd" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Research</span>
              <h2 className="section-title">Research &amp; Development (Funded Projects &amp; Patents)</h2>
            </div>
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
          </div>
        </section>
      )}

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
