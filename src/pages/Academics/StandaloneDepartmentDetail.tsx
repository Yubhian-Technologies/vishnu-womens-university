import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Check, Compass, Target, Sparkles, Mail, ExternalLink, BookOpen, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import { useOrderedCollection } from '../../hooks/useCollection';
import { normalizeLab, type LabItem } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { FacultyDoc } from './Faculty';
import type { StandaloneDepartment } from '../../lib/departmentGroups';
import { hasCustomSectionContent, toQuickLinkItems } from '../../lib/customSections';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import LabDialog from '../../components/LabDialog/LabDialog';
import '../detail-layout.css';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

interface Props {
  dept: StandaloneDepartment;
}

/**
 * The page for a department with NO linked programme (Freshman Engineering's
 * Mathematics/Physics/Chemistry/English — foundation subjects, not a degree
 * any one of them grants on its own). DepartmentDetail.tsx can't be reused
 * as-is here: it hard-requires an `activeProgram` (redirects away without
 * one), since Research & Development, Custom Sections, Placements, and
 * Newsletter all read from the department's linked programme doc. Rather
 * than thread optional-program handling through that already-large,
 * already-working page (real risk to CSE/AI/ECE/Mechanical for no benefit
 * to them), this is a separate, smaller sibling — but every section below
 * deliberately reuses DepartmentDetail.tsx's own markup/CSS classes
 * (dept-about-*, dept-vm-*, dept-hod-*, dept-labs-*, dept-library-*,
 * FacultyCarousel) rather than inventing a plainer look, so a visitor can't
 * tell these apart from CSE/ECE/etc. by polish — only by which sections
 * apply (no Program Toggle/Placements/Newsletter, since there's no linked
 * programme). If one of these 4 ever gets a real Program doc, moving its
 * short code from STANDALONE_DEPARTMENTS to DEPARTMENT_GROUPS
 * (departmentGroups.ts) hands it over to the full DepartmentDetail.tsx
 * automatically — same `departments` doc, same Custom Sections, no rebuild.
 */
export default function StandaloneDepartmentDetail({ dept: group }: Props) {
  const [activeLab, setActiveLab] = useState<LabItem | null>(null);
  const [collapsedQuickLinks, setCollapsedQuickLinks] = useState<Set<string>>(new Set());
  const toggleQuickLink = (id: string) => {
    setCollapsedQuickLinks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const { docs: allDepartments, loading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const dept = allDepartments.find((d) => d.shortCode?.trim().toLowerCase() === group.deptShortCode.trim().toLowerCase());
  const facultyDeptNames = new Set(group.facultyDepartments);
  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const faculty = allFaculty.filter((f) => f.department && facultyDeptNames.has(f.department));

  useEffect(() => {
    if (dept) document.title = `${dept.title} | Vishnu Women's University`;
  }, [dept]);

  if (!loading && !dept) return <Navigate to="/academics" replace />;
  if (!dept) return null;

  const deptName = dept.title;
  const hasAbout = !!dept.about;
  const hasVisionMission = !!(dept.vision || dept.mission?.length || dept.coreValues?.length);
  const hasHod = !!(dept.hodMessage || dept.hodImage || dept.hodEmail || dept.hod);
  const labs = (dept.labs || []).map(normalizeLab).filter((l) => l.name);
  const hasLabs = labs.length > 0;
  const visibleCustomSections = (dept.customSections || []).filter(hasCustomSectionContent);
  const hasLibrary = !!(dept.libraryIntro || dept.libraryInCharge || dept.librarySections?.length);

  const quickLinks = [
    hasAbout && { id: 'about', label: 'About the Department' },
    hasVisionMission && { id: 'vision-mission', label: 'Vision & Mission' },
    hasHod && { id: 'hod', label: 'About HOD' },
    faculty.length > 0 && { id: 'faculty', label: 'Faculty' },
    hasLabs && { id: 'labs', label: 'Laboratories' },
    ...toQuickLinkItems(visibleCustomSections),
    hasLibrary && { id: 'library', label: 'Department Library' },
  ].filter(Boolean) as { id: string; label: string; children?: { id: string; label: string }[] }[];

  return (
    <main className="page-wrapper">
      {/* Hero — same shell as DepartmentDetail.tsx, blank until an admin uploads a Hero Image */}
      <section className="page-hero" style={{ minHeight: 380 }}>
        {dept.heroImage && (
          <SmoothImage src={dept.heroImage} alt={deptName} className="page-hero-image" loading="eager" decoding="sync" />
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
            Freshman Engineering
          </div>
          <h1 className="animate-fade-in-up">{deptName}</h1>
        </div>
      </section>

      {/* About the Department — kept independent of Quick Navigation below:
          gating on hasAbout alone used to hide the whole block (nav
          included) whenever About was empty, silently dropping Quick Links
          for every other section too. */}
      {(hasAbout || quickLinks.length > 1) && (
        <section id="about" className="section bg-white dept-about-section" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div className={quickLinks.length > 1 ? 'detail-grid' : ''}>
              {hasAbout && (
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
              )}

              {quickLinks.length > 1 && (
                <div className="detail-sidebar">
                  <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)' }}>
                    <nav className="dept-quick-nav-card" aria-label="Quick Links">
                      <div className="dept-quick-nav-header">
                        <div className="dept-quick-nav-icon">
                          <MapPin size={15} strokeWidth={2.4} />
                        </div>
                        <div className="dept-quick-nav-title-wrap">
                          <h4 className="dept-quick-nav-title">Quick Navigation</h4>
                          <span className="dept-quick-nav-subtitle">{quickLinks.length} Sections</span>
                        </div>
                      </div>
                      <ul className="dept-quick-nav-list" role="list">
                        {quickLinks.map((l) => {
                          const hasKids = !!l.children?.length;
                          const isOpen = !collapsedQuickLinks.has(l.id);
                          return (
                            <li key={l.id} className="dept-quick-nav-item">
                              {hasKids ? (
                                <button type="button" onClick={() => toggleQuickLink(l.id)} aria-expanded={isOpen} className="dept-quick-nav-toggle-btn">
                                  <span className="dept-quick-nav-text">{l.label}</span>
                                  <ChevronDown size={12} strokeWidth={2.4} className={`dept-quick-nav-chevron${isOpen ? ' is-open' : ''}`} aria-hidden="true" />
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Vision, Mission & Values */}
      {hasVisionMission && (
        <section id="vision-mission" className="section bg-off-white" style={{ scrollMarginTop: NAV_OFFSET }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label dept-section-label">Our Guiding Pillars</span>
              <h2 className="section-title">Vision, Mission &amp; Values</h2>
            </div>
            <div className="dept-vm-grid">
              {dept.vision && (
                <div className="dept-vm-card">
                  <div className="dept-vm-card-top">
                    <span className="dept-vm-num-badge">01 · VISION</span>
                    <div className="dept-vm-icon-badge"><Compass size={20} strokeWidth={2.2} /></div>
                  </div>
                  <h3 className="dept-vm-title">Department Vision</h3>
                  <p className="dept-vm-body-text">{dept.vision}</p>
                </div>
              )}
              {(dept.mission?.length ?? 0) > 0 && (
                <div className="dept-vm-card">
                  <div className="dept-vm-card-top">
                    <span className="dept-vm-num-badge">02 · MISSION</span>
                    <div className="dept-vm-icon-badge"><Target size={20} strokeWidth={2.2} /></div>
                  </div>
                  <h3 className="dept-vm-title">Mission Statements</h3>
                  <ul className="dept-vm-mission-list">
                    {dept.mission!.map((m, mi) => (
                      <li key={mi} className="dept-vm-mission-item">
                        <span className="dept-vm-bullet-circle"><Check size={12} strokeWidth={3} /></span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
              <h2 className="section-title">Head of Department</h2>
            </div>
            <div className="dept-hod-editorial-card">
              {dept.hodImage && (
                <div className="dept-hod-media-frame">
                  <SmoothImage src={dept.hodImage} alt={dept.hod || 'Head of Department'} className="dept-hod-photo" />
                </div>
              )}
              <div className="dept-hod-content">
                <div className="dept-hod-badge-wrap">
                  <span className="dept-hod-role-badge">Department Leadership</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{deptName}</span>
                </div>
                {dept.hod && (
                  <h3 className="dept-hod-name">{dept.hod}</h3>
                )}
                <div className="dept-hod-meta">
                  <span>Head of the Department &amp; Senior Faculty</span>
                </div>
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
