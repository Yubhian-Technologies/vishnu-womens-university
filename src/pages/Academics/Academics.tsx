import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Academics.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { resolveProgramIcon } from '../../lib/programIcons';
import { useContentBlocks, useEapcetCode } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import { groupForDeptShortCode } from '../../lib/departmentGroups';
import { Radio } from 'lucide-react';

const defaultAcademicsPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Smart lecture halls', caption: 'Smart Lecture Halls' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Specialised research labs', caption: 'Research Labs' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Technical hackathons', caption: 'Hackathons & Projects' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Library resources', caption: 'Digital Library' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Group learning sessions', caption: 'Collaborative Learning' },
];

const defaultClassroomsLabsPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Smart Lecture Halls', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Advanced Computer Lab', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Electronics Lab', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Physics & Chemistry Labs', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Seminar & Discussion Rooms', caption: '' },
];

const defaultResearchInnovationPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'R&D Centers', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Student Innovation Hub', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Project Expo Day', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Patents & Publications', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Incubation Center', caption: '' },
];

const TABS = [
  { id: 'btech', label: 'B.Tech' },
  { id: 'mtech', label: 'M.Tech' },
  { id: 'mba', label: 'MBA' },
  { id: 'phd', label: 'Ph.D.' },
] as const;

function truncate(text: string, max: number) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

// Loose comparison key so "AI&ML", "AI & ML", "ai and ml" all collapse to the
// same thing when matching a department card to a program.
const matchKey = (s: string) =>
  (s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();

// Resolves a department card to the program page it links to. Grouped
// departments (AI / CSE / ECE) point at their first sub-program slug, which
// renders the shared department page with that program's toggle active (see
// src/lib/departmentGroups.ts). Freshman Engineering isn't a degree program
// (nothing in the `programs` collection to match against) but does have its
// own static page at /academics/freshman-engineering, so it's special-cased
// the same way. Everything else matches by name to its single program, or
// returns null when there's no clear match.
function findDeptProgramSlug(dept: DepartmentDoc, programs: ProgramDoc[]): string | null {
  const grouped = groupForDeptShortCode(dept.shortCode);
  if (grouped) return grouped.programSlugs[0];
  if (matchKey(dept.title) === matchKey('Freshman Engineering')) return 'freshman-engineering';
  const keys = [matchKey(dept.title), matchKey(dept.shortCode)].filter(Boolean);
  const matches = programs.filter((p) =>
    [p.department, p.name, p.shortName]
      .map(matchKey)
      .filter(Boolean)
      .some((c) => keys.includes(c))
  );
  if (matches.length === 0) return null;
  const preferred = matches.find((p) => p.category === 'btech') ?? matches[0];
  return preferred.slug || null;
}

export default function Academics() {
  // Lets links elsewhere in the site (e.g. the Home page's "PG Programs" study
  // card) open Academics with a specific tab pre-selected via ?tab=mtech,
  // instead of always landing on the default B.Tech tab.
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const initialTab = TABS.some((t) => t.id === requestedTab) ? requestedTab! : 'btech';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { docs: programs, loading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const { docs: departments } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const academicsPhotos = useSitePhotos('academics', 'main', defaultAcademicsPhotos);
  const classroomsLabsPhotos = useSitePhotos('academics', 'classrooms-labs', defaultClassroomsLabsPhotos);
  const hasClassroomsLabsPhotos = useSectionHasPhotos('academics', 'classrooms-labs');
  const researchInnovationPhotos = useSitePhotos('academics', 'research-innovation', defaultResearchInnovationPhotos);
  const hasResearchInnovationPhotos = useSectionHasPhotos('academics', 'research-innovation');
  const quickStats = useContentBlocks('academics', 'quickStats');
  const studentActivities = useContentBlocks('academics', 'studentActivities');
  const careerOutcomeStats = useContentBlocks('academics', 'careerOutcomeStats');
  const eapcetCode = useEapcetCode();

  useEffect(() => {
    document.title = "Academics | Vishnu Women's University";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => el.classList.add('revealed'), parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    // Only static, always-present elements use .reveal here — the
    // Firestore-derived program/department cards render without it (see
    // comment in ProgramDetail.tsx for why animating async content this way
    // is unreliable), so a plain mount-only observer is safe.
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const btechCount = programs.filter(p => p.category === 'btech').length;

  const activePrograms = useMemo(() => programs.filter(p => p.category === activeTab), [programs, activeTab]);

  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const toggleDept = (id: string) => setExpandedDepts((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  // Which department cards link straight to a program page (all except the
  // multi-program AI/CSE/ECE cards, and any that don't resolve to a program).
  const deptProgramSlug = useMemo(() => {
    const map: Record<string, string> = {};
    departments.forEach((d) => {
      const slug = findDeptProgramSlug(d, programs);
      if (slug) map[d.id] = slug;
    });
    return map;
  }, [departments, programs]);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="academics"
        defaultTitle="You Will Excel."
  defaultSubtitle="Rigorous, industry-aligned programs designed to build your technical expertise, sharpen your research instincts, and develop you as a professional."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics' }]}
        scrollCtaTargetId="academics-content"
      />

      {/* Quick Stats */}
      <section id="academics-content" style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{btechCount || '—'}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)' }}>B.Tech Programs</div>
            </div>
            {quickStats.map(s => (
              <div key={s.id} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)' }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="academics-programs-section">
        <div className="container">
          <div className="reveal">
            <span className="section-label">Academic Programs</span>
            <h2 className="section-title">Explore Your Options</h2>
            <p className="section-desc" style={{ marginBottom: 'var(--space-8)' }}>
              Whether you are beginning your B.Tech, advancing to M.Tech, or pursuing doctoral research — VWU offers a program matched to your goals.
            </p>
          </div>

          <div className="programs-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`prog-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="programs-grid">
            {activePrograms.map((program) => {
              const Icon = resolveProgramIcon(program.icon);
              return (
                <Link
                  key={program.id}
                  to={`/academics/${program.slug}`}
                  className="program-card"
                >
                  <div className="program-card-icon"><Icon size={29} strokeWidth={1.75} /></div>
                  <h3>{program.name}</h3>
                  <p>{truncate(program.about, 140)}</p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                      {program.intake} Seats
                    </span>
                    {program.accreditation && program.accreditation !== '—' && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                        {program.accreditation.split(' ').slice(0, 2).join(' ')}
                      </span>
                    )}
                  </div>
                  <div className="program-card-arrow" style={{ marginTop: 'auto' }}>
                    Learn More →
                  </div>
                </Link>
              );
            })}
            {!loading && activePrograms.length === 0 && (
              <p style={{ color: 'var(--color-text-light)', gridColumn: '1 / -1', textAlign: 'center' }}>
                No programs added for this category yet.
              </p>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/programmes-fee-structure" className="btn btn-primary">View Full Fee Structure →</Link>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Departments</span>
            <h2 className="section-title">Academic Departments</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Specialised departments — each bringing together experienced faculty, well-equipped laboratories, and curricula shaped by industry demands.
            </p>
          </div>
          <div className="dept-grid">
            {departments.map((dept) => {
              const Icon = resolveProgramIcon(dept.icon);
              const expanded = expandedDepts.has(dept.id);
              const isTruncated = (dept.description || '').length > 130;
              const linkSlug = deptProgramSlug[dept.id];
              const body = (
                <>
                  <div className="dept-card-top">
                    <span className="dept-icon"><Icon size={30} strokeWidth={1.75} /></span>
                    <span className="dept-code">{dept.shortCode}</span>
                  </div>
                  <h3 className="dept-name">{dept.title}</h3>
                  <p className="dept-desc">{expanded ? dept.description : truncate(dept.description, 130)}</p>
                  {isTruncated && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleDept(dept.id); }}
                      style={{ alignSelf: 'flex-start', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      {expanded ? '← Show less' : 'More →'}
                    </button>
                  )}
                </>
              );
              return linkSlug ? (
                <Link key={dept.id} to={`/academics/${linkSlug}`} className="dept-card dept-card--link">
                  {body}
                  <span className="dept-card-arrow" style={{ marginTop: 'auto' }}>Learn More →</span>
                </Link>
              ) : (
                <div key={dept.id} className="dept-card">{body}</div>
              );
            })}
            {departments.length === 0 && (
              <p style={{ color: 'var(--color-text-light)', gridColumn: '1 / -1', textAlign: 'center' }}>
                No departments added yet — add them from Admin → Academic Departments.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Student Activities — compact hub */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Student Life</span>
            <h2 className="section-title">Beyond the Classroom</h2>
            <p className="section-desc" style={{ margin: '0 auto var(--space-8)' }}>
              From managing a campus radio station to competing at inter-collegiate sports meets — there is a great deal more to life at VWU than lectures alone.
            </p>
          </div>
          <div className="activities-grid">
            {studentActivities.map((act) => {
              const Icon = resolveContentIcon(act.icon) || Radio;
              const path = act.slug || '/student-life';
              const external = /^https?:\/\//.test(path);
              return external ? (
                <a
                  key={act.id}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="activity-item-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="activity-item-icon"><Icon size={35} strokeWidth={1.75} /></div>
                  <h3 className="activity-item-title">{act.title}</h3>
                  <span style={{ marginTop: 'auto', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)' }}>Explore →</span>
                </a>
              ) : (
                <Link
                  key={act.id}
                  to={path}
                  className="activity-item-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="activity-item-icon"><Icon size={35} strokeWidth={1.75} /></div>
                  <h3 className="activity-item-title">{act.title}</h3>
                  <span style={{ marginTop: 'auto', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)' }}>Explore →</span>
                </Link>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/student-life" className="btn btn-primary">Full Student Life Experience →</Link>
          </div>
        </div>
      </section>

      {/* Placements — stats only, links to ResultAnalysis */}
      <section className="section bg-white">
        <div className="container">
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label">Career Outcomes</span>
              <h2 className="section-title">Where VWU Engineers Go</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                The Training & Placement Cell maintains year-round engagement with India's leading employers — including Amazon, TCS, Infosys, Wipro, HCL, Cognizant, and 150+ other companies.
              </p>
              <Link to="/placements/placement-details" className="btn btn-primary">Explore →</Link>
            </div>
            <div className="reveal-right">
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {careerOutcomeStats.map(s => (
                  <div key={s.id} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', borderLeft: '4px solid var(--color-accent)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 900, color: 'var(--color-primary)' }}>{s.value}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', marginTop: 4 }}>{s.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academics Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={academicsPhotos}
            label="Academic Life"
            title="Learning, Research & Innovation"
            subtitle="Inside VWU's labs, classrooms, and events — where students are trained to think, build, and lead."
            highlights={[
              '10 B.Tech specialisations with UGC Autonomous curriculum',
              '50+ specialised labs across all departments',
              '200+ smart classrooms with interactive boards',
              'IEEE, Springer & NPTEL digital library access',
              'Industry-sponsored research & funded projects',
            ]}
            columns={2}
            layout="side-text-reverse"
            showGalleryLink={false}
          />
        </div>
      </section>

      {/* Classrooms & Labs — hidden until real photos are added */}
      {hasClassroomsLabsPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={classroomsLabsPhotos}
              label="Classrooms & Labs"
              title="Where Theory Meets Practice"
              columns={3}
              layout="default"
              showGalleryLink={false}
            />
          </div>
        </section>
      )}

      {/* Research & Innovation — hidden until real photos are added */}
      {hasResearchInnovationPhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={researchInnovationPhotos}
              label="Research & Innovation"
              title="Advancing Knowledge, Building the Future"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Get Started</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Ready to Join VWU?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto var(--space-8)' }}>
              Arrange a campus visit, request further information, or apply through EAPCET (Code: {eapcetCode}) today.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg">Apply via EAPCET</Link>
              <Link to="/admission-procedure" className="btn btn-secondary btn-lg">Admission Procedure</Link>
              <Link to="/programmes-fee-structure" className="btn btn-secondary btn-lg">Fee Structure</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
