import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Check, Sparkles, Mail, ExternalLink, BookOpen, ChevronRight } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import { useOrderedCollection } from '../../hooks/useCollection';
import { normalizeLab, type LabItem } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { FacultyDoc } from './Faculty';
import type { StandaloneDepartment } from '../../lib/departmentGroups';
import NewsEventsTabs, { type NewsEventsCategory } from '../../components/NewsEventsTabs/NewsEventsTabs';
import { parseFlexibleTable } from '../../lib/structuredTable';
import { hasCustomSectionContent, toQuickLinkItems } from '../../lib/customSections';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import LabDialog from '../../components/LabDialog/LabDialog';
import { getDepartmentTagline } from '../../lib/departmentTaglines';
import '../detail-layout.css';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

interface Props {
  dept: StandaloneDepartment;
}

export default function StandaloneDepartmentDetail({ dept: group }: Props) {
  const [activeLab, setActiveLab] = useState<LabItem | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const { docs: allDepartments, loading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const dept = allDepartments.find((d) => d.shortCode?.trim().toLowerCase() === group.deptShortCode.trim().toLowerCase());
  const facultyDeptNames = new Set(group.facultyDepartments);
  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const faculty = allFaculty.filter((f) => f.department && facultyDeptNames.has(f.department));

  useEffect(() => {
    if (dept) document.title = `${dept.title} | Vishnu Women's University`;
  }, [dept]);

  const deptName = dept?.title ?? '';
  const hasAbout = !!dept?.about;
  const hasCoreValues = (dept?.coreValues?.length ?? 0) > 0;
  const hasHod = !!(dept?.hodMessage || dept?.hodImage || dept?.hodEmail || dept?.hod);
  const labs = (dept?.labs || []).map(normalizeLab).filter((l) => l.name);
  const hasLabs = labs.length > 0;
  const visibleCustomSections = (dept?.customSections || []).filter(hasCustomSectionContent);
  const hasLibrary = !!(dept?.libraryIntro || dept?.libraryInCharge || dept?.librarySections?.length);
  // News & Events — same fixed-heading/dynamic-contents pattern as
  // DepartmentDetail.tsx/ProgramDetail.tsx: the "News & Events" heading
  // itself is fixed, what's under it is dept.newsEventsSections' fully
  // admin-defined list of named sections. No legacy fallback needed here —
  // a standalone department (Freshman Engineering's Mathematics/Physics/
  // Chemistry/English) never had a News & Events block before this.
  const newsEventsSubSections = (dept?.newsEventsSections || []).filter(hasCustomSectionContent);
  const newsEventsCategories: NewsEventsCategory[] = newsEventsSubSections.map((sec) => ({
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

  const hasNewsEvents = newsEventsCategories.length > 0;

  const quickLinks = [
    hasAbout && { id: 'about', label: 'Department Overview' },
    hasCoreValues && { id: 'vision-mission', label: 'Core Values' },
    hasHod && { id: 'hod', label: 'Brief Profile' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    hasLabs && { id: 'labs', label: 'Laboratories' },
    ...toQuickLinkItems(visibleCustomSections),
    hasNewsEvents && { id: 'news-events', label: 'Happenings' },
    hasLibrary && { id: 'library', label: 'Department Library' },
  ].filter(Boolean) as { id: string; label: string; children?: { id: string; label: string }[] }[];

  useEffect(() => {
    if (!quickLinks.length) return;
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

    quickLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [quickLinks]);

  if (!loading && !dept) return <Navigate to="/academics" replace />;
  if (!dept) return null;

  return (
    <main className="page-wrapper">
      {/* Hero — same department hero card design as DepartmentDetail.tsx */}
      <section className="dept-hero-section">
        <div className="container">
          <div className="dept-hero-card">
            {dept.heroImage && (
              <SmoothImage src={dept.heroImage} alt={deptName} className="dept-hero-bg-img" loading="eager" decoding="sync" />
            )}
            <div className="dept-hero-overlay" />
            <div className="dept-hero-content">
              <div className="breadcrumb animate-fade-in" style={{ marginBottom: '0.8rem' }}>
                <Link to="/" className="breadcrumb-item">Home</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to="/academics" className="breadcrumb-item">Academics</Link>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-item active">{deptName}</span>
              </div>
              <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#C9973A', color: '#0B1E42', fontSize: 'var(--text-xs)', fontWeight: 800, padding: '0.35rem 0.9rem', borderRadius: '9999px', marginBottom: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Freshman Engineering
              </div>
              <h1 className="dept-hero-title">{deptName}</h1>
              {(dept.tagline || getDepartmentTagline(dept.shortCode || group.deptShortCode || group.key) || dept.description) && (
                <p className="dept-hero-subtitle">{getDepartmentTagline(dept.shortCode || group.deptShortCode || group.key, dept.tagline) || dept.description}</p>
              )}
              <div className="dept-hero-cta">
                <Link to="/apply-now" className="btn-hero-gold">Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Quick Navigation Pill Bar */}
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
                      const el = document.getElementById(l.id);
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

      {/* About the Department */}
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
                <p className="dept-about-lead-text" style={{ whiteSpace: 'pre-line' }}>{dept.about}</p>
              </div>
              {(dept.highlights?.length ?? 0) > 0 && (
                <div style={{ marginTop: 'var(--space-8)' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
                    Department Highlights
                  </h3>
                  <div className="dept-highlights-grid">
                    {dept.highlights!.map((h, hi) => (
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

      {/* Core Values — Department Vision / Mission Statements cards were
          removed here; this section now only ever shows Core Values. */}
      {hasCoreValues && (
        <section id="vision-mission" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Our Guiding Pillars</span>
              <h2 className="section-title">Core Values</h2>
            </div>
            <div className="dept-vm-grid">
              {(dept.coreValues?.length ?? 0) > 0 && (
                <div className="dept-values-card">
                  <div className="dept-values-header">
                    <Sparkles size={22} strokeWidth={2} style={{ color: 'var(--color-accent)' }} />
                    <h3 className="dept-values-title">Institutional Core Values</h3>
                  </div>
                  <div className="dept-values-chips-wrap">
                    {dept.coreValues!.map((v) => (
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

      {/* About HOD — sourced from the department doc's own hod* fields
          (Admin → Academic Departments → Head of Department), exactly like
          the grouped CSE/AI/ECE/Mechanical pages, instead of matching a
          Faculty record by designation — that Faculty-derived approach
          meant the admin's HOD Photo/Name/Email/Message fields silently did
          nothing on these 4 pages. */}
      {hasHod && (
        <section id="hod" className="dept-hod-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Academic Leadership</span>
              <h2 className="section-title">Brief Profile</h2>
            </div>
            <div className="dept-hod-editorial-card">
              <div className="dept-hod-media-col">
                {dept.hodImage && (
                  <div className="dept-hod-media-frame">
                    <SmoothImage src={dept.hodImage} alt={dept.hod || 'Head of Department'} className="dept-hod-photo" />
                  </div>
                )}
                {dept.hod && (
                  <div className="dept-hod-media-caption">
                    <h3 className="dept-hod-name">{dept.hod}</h3>
                    <div className="dept-hod-meta">Head of the Department</div>
                  </div>
                )}
              </div>
              <div className="dept-hod-content">
                {dept.hodMessage && (
                  <div className="dept-hod-message-box">
                    <p className="dept-hod-message-text">{dept.hodMessage}</p>
                  </div>
                )}
                {dept.hodEmail && (
                  <div className="dept-hod-actions">
                    <a href={`mailto:${dept.hodEmail}`} className="dept-hod-mail-btn">
                      <Mail size={15} strokeWidth={2.2} />
                      <span>Contact HOD: {dept.hodEmail}</span>
                    </a>
                  </div>
                )}
              </div>
              {(dept.hodResearchProfiles?.length ?? 0) > 0 && (
                <div style={{ background: 'var(--color-primary)', padding: 'var(--space-4) var(--space-8)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-5)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Research Profiles</span>
                  {dept.hodResearchProfiles!.map((link) => (
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

      {/* Faculty Carousel — same component CSE/ECE/etc. use */}
      {faculty.length > 0 && (
        <div id="faculty" style={{ scrollMarginTop: NAV_OFFSET }}>
          <FacultyCarousel faculty={faculty} departmentName={deptName} title="Learn from our impactful faculty" viewMoreLink="/faculty" />
        </div>
      )}

      {/* Laboratories */}
      {hasLabs && (
        <section id="labs" className="dept-labs-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className="dept-labs-header">
              <div className="dept-labs-title-wrap">
                <span className="section-label dept-section-label">State-of-the-Art Infrastructure</span>
                <h2 className="section-title">Specialized Laboratories</h2>
                <p className="section-desc" style={{ margin: '0.5rem 0 0 0' }}>
                  Industry-aligned experimental facilities engineered for hands-on technical immersion and practical learning.
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
                      </div>
                      <div className="dept-lab-body">
                        <span className="dept-lab-overline">Practical & Research Facility</span>
                        <h3 className="dept-lab-title">{lab.name}</h3>
                        <p className="dept-lab-spec-desc">
                          {lab.description ? lab.description.slice(0, 110) : 'Equipped with high-performance workstations and dedicated experimental apparatus.'}
                        </p>
                      </div>
                    </div>
                    <div className="dept-lab-footer">
                      <span className="dept-lab-pdf-btn-label">
                        {lab.pdfUrl ? 'Lab Manual & Specs' : 'View Details'}
                      </span>
                      <span className="dept-btn-arrow-circle">
                        <ChevronRight size={12} strokeWidth={2.5} />
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

      <CustomSectionsRenderer sections={visibleCustomSections} navOffset={NAV_OFFSET} />

      {/* News & Events — Compact Collapsible Academic-Year List */}
      {hasNewsEvents && <NewsEventsTabs categories={newsEventsCategories} eyebrow={deptName} navOffset={NAV_OFFSET} />}

      {/* Department Library */}
      {hasLibrary && (
        <section id="library" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label dept-section-label">Academic Repository</span>
              <h2 className="section-title">Department Library</h2>
            </div>
            <div className="dept-library-container">
              {dept.libraryIntro && (
                <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: 'var(--text-base)', whiteSpace: 'pre-line', maxWidth: 840 }}>{dept.libraryIntro}</p>
              )}
              {dept.libraryInCharge && (
                <div className="dept-library-incharge-card">
                  <div className="dept-library-incharge-icon-wrap">
                    <BookOpen size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="dept-library-incharge-label">In-Charge of Department Library</div>
                    <h3 className="dept-library-incharge-name">{dept.libraryInCharge}</h3>
                  </div>
                </div>
              )}
              {(dept.librarySections?.length ?? 0) > 0 && dept.librarySections!.map((sec, si) => (
                <div key={si} className="dept-library-tables-group">
                  <div className="dept-library-group-header">
                    <h3 className="dept-library-group-title">{sec.heading}</h3>
                  </div>
                  <div className="dept-library-grid-3">
                    {sec.items.map((item, ii) => {
                      const numStr = String(ii + 1).padStart(2, '0');
                      return (
                        <div key={ii} className="dept-library-card">
                          <div className="dept-library-card-top">
                            <span className="dept-library-num-badge">{numStr}</span>
                            <div className="dept-library-icon-badge"><BookOpen size={18} strokeWidth={2.2} /></div>
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
    </main>
  );
}
