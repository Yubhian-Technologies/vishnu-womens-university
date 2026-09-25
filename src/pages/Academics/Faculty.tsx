import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Award, Briefcase, ChevronRight } from 'lucide-react';
import './Faculty.css';
import '../../components/FacultyCarousel/FacultyCarousel.css';
import PageHero from '../../components/PageHero/PageHero';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { FacultyFact, FacultySection } from '../../lib/facultySections';
import type { CustomSection } from '../../lib/customSections';

// Fixed department tab order (per design decision, not derived from data) —
// each tab's `departments` lists every raw `department` field value (as
// entered via /admin → Faculty/Programs) that should count toward it, since
// real records use varying spellings (e.g. "Mechanical" not "ME"). A tab
// simply doesn't render if none of its departments currently have any
// faculty.
// Kept in sync with DEPARTMENT_GROUPS/STANDALONE_DEPARTMENTS' own
// facultyDepartments lists in lib/departmentGroups.ts — this page has its
// own copy (different shape: a fixed tab label, not a program-slug group)
// but the same underlying spelling variants apply, so a department missing
// an alias here that the canonical list already has (as CE was, missing
// "Civil Engineering") silently drops that department's faculty from this
// tab even though every other page that reads facultyDepartments shows them.
const DEPARTMENT_GROUPS: { label: string; departments: string[] }[] = [
  { label: 'CSE', departments: ['CSE'] },
  { label: 'AI', departments: ['AI'] },
  { label: 'IT', departments: ['IT', 'Information Technology'] },
  { label: 'ECE', departments: ['ECE'] },
  { label: 'EEE', departments: ['EEE', 'Electrical & Electronics Engineering'] },
  { label: 'CE', departments: ['Civil', 'CE', 'Civil Engineering'] },
  { label: 'ME', departments: ['Mechanical', 'ME'] },
  { label: 'Maths', departments: ['Mathematics'] },
  { label: 'Physics', departments: ['Physics'] },
  { label: 'Chemistry', departments: ['Chemistry'] },
  { label: 'English', departments: ['English'] },
  { label: 'MBA', departments: ['MBA', 'Management Studies'] },
];

// Designation rank of each faculty member, data-driven off their own
// `designation` text (via /admin → Faculty). Used only to decide where
// dividers go between cards — it never re-orders anyone (display order is
// always /admin → Faculty's order; see `filtered` below).
// HOD/Dean Academics/Dean Statutory share one rank (0).
function designationGroupRank(designation: string): number {
  const d = (designation || '').toLowerCase();
  // strip dots/spaces so "H.O.D." / "H O D" still register as HOD (some
  // records — CSE, MBA — were entered that way and fell through to the
  // Professors group instead of leadership).
  const compact = d.replace(/[.\s]/g, '');
  if (compact.includes('hod') || d.includes('head') || d.includes('dean academic') || d.includes('dean statutory')) return 0;
  if (d.includes('assistant') || d.includes('asst')) return 3;
  if (d.includes('associate') || d.includes('assoc')) return 2;
  if (d.includes('professor')) return 1;
  return 4;
}

export type { FacultyFact, FacultySection };

export interface FacultyDoc {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  specialization: string;
  email: string;
  imageUrl: string;
  storagePath: string;
  order: number;
  /** Optional per-person override of which designation group this person is
   *  listed under on the /faculty directory (0 leadership · 1 Professor ·
   *  2 Associate · 3 Assistant · 4 Other). Absent or < 0 = auto (derived
   *  from `designation` text). Position within the group is still the
   *  `order` field. Set via /admin → Faculty. */
  groupOverride?: number;
  /** Set via /admin → Faculty; shown on this person's own full profile
   *  page (FacultyProfile.tsx), not on this grid. */
  facts?: FacultyFact[];
  sections?: FacultySection[];
  customSections?: CustomSection[];
}

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getFacultySummary(f: FacultyDoc) {
  const expFact = f.facts?.find((x) => /experience/i.test(x.label))?.value;
  const specFact = f.facts?.find((x) => /specialization|interest|area/i.test(x.label))?.value;
  const pubFact = f.facts?.find((x) => /publication|paper/i.test(x.label))?.value;

  return {
    experience: expFact,
    specialization: f.specialization || specFact,
    qualification: f.qualification,
    publications: pubFact,
  };
}

export default function Faculty() {
  const { docs: allFaculty, loading } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const faculty = allFaculty;

  useEffect(() => {
    document.title = "Faculty | Vishnu Women's University";
  }, []);

  // The intro heading above the department tabs uses .reveal (mount-only,
  // static content — not gated behind Firestore data, see the CLAUDE.md
  // gotcha) but nothing was ever observing it, so it sat at opacity:0
  // forever — looking like an oversized empty gap above the department
  // filter buttons rather than what it actually was: invisible text.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Only a tab whose departments actually have at least one faculty member
  // renders — an empty tab (e.g. a department with no one added yet) would
  // just be a dead end. The order here is always DEPARTMENT_GROUPS' order.
  // Any department not covered by DEPARTMENT_GROUPS (e.g. one newly added
  // via /admin → Faculty) gets its own tab after the fixed ones, labelled
  // with its exact `department` text, alphabetically — so its faculty are
  // never silently missing from this page.
  const availableGroups = useMemo(() => {
    const fixed = DEPARTMENT_GROUPS.filter((g) => faculty.some((f) => g.departments.includes(f.department)));
    const known = new Set(DEPARTMENT_GROUPS.flatMap((g) => g.departments));
    const extra = [...new Set(faculty.map((f) => f.department).filter((d) => d && d.trim() && !known.has(d)))]
      .sort((a, b) => a.localeCompare(b))
      .map((d) => ({ label: d, departments: [d] }));
    return [...fixed, ...extra];
  }, [faculty]);

  // Defaults to the first available tab once data loads, rather than
  // requiring the visitor to pick one — there's no "All" view anymore.
  // "View more" on a department/program page links here as ?dept=<that
  // department's faculty `department` value>, so that tab opens by default;
  // a tab the visitor clicks afterwards still wins.
  const deptParam = searchParams.get('dept');
  const activeGroup = availableGroups.find((g) => g.label === activeDept)
    ?? (deptParam ? availableGroups.find((g) => g.departments.includes(deptParam)) : undefined)
    ?? availableGroups[0] ?? null;

  // NOTE: display order here is exactly /admin → Faculty's drag-to-reorder
  // order (the `order` field) — nothing on this page re-sorts it. `faculty`
  // already arrives sorted by `order`; since admin orders per raw
  // `department` value, a tab that merges several spellings (e.g. IT +
  // "Information Technology") keeps each department's run together, in the
  // tab's `departments` order, rather than interleaving by order number.
  const filtered = useMemo(() => {
    if (!activeGroup) return [];
    const deptIndex = (f: FacultyDoc) => activeGroup.departments.indexOf(f.department);
    return faculty
      .filter((f) => activeGroup.departments.includes(f.department))
      .sort((a, b) => deptIndex(a) - deptIndex(b));
  }, [faculty, activeGroup]);

  // Visual designation groups (HOD/Dean → Professors → Associate →
  // Assistant) are only used to place dividers: consecutive faculty (in
  // admin order) with the same rank share one grid, and a divider is added
  // wherever the rank changes. Faculty are never moved to match their rank —
  // arrange them by designation in /admin to get one divider per group.
  const designationGroups = useMemo(() => {
    const runs: FacultyDoc[][] = [];
    let prevRank: number | null = null;
    for (const f of filtered) {
      // A per-person groupOverride (set in /admin → Faculty) wins over the
      // designation-text guess; anything absent or < 0 falls back to auto.
      const rank = typeof f.groupOverride === 'number' && f.groupOverride >= 0
        ? f.groupOverride
        : designationGroupRank(f.designation);
      if (rank !== prevRank) runs.push([]);
      runs[runs.length - 1].push(f);
      prevRank = rank;
    }
    return runs;
  }, [filtered]);

  return (
    <main className="page-wrapper">
      <PageHero
        page="faculty"
        defaultTitle="Our Faculty"
        defaultSubtitle="Experienced educators and researchers across every department, dedicated to academic excellence and student success."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Faculty' }]}
      />

      <section className="section faculty-intro-section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 className="section-title">Faculty</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Browse faculty by department.
            </p>
          </div>

          <div className="faculty-tabs">
            {availableGroups.map((g) => (
              <button
                key={g.label}
                className={`faculty-tab${activeGroup?.label === g.label ? ' active' : ''}`}
                onClick={() => setActiveDept(g.label)}
              >
                {g.label}
              </button>
            ))}
          </div>

          {designationGroups.map((members, gi) => (
            <div key={gi}>
              {gi > 0 && (
                <div className="faculty-group-divider" aria-hidden="true">
                  <span className="divider" />
                </div>
              )}
              <div className="faculty-grid">
                {members.map((f) => {
                  const summary = getFacultySummary(f);
                  return (
                    <div key={f.id} className="faculty-impact-card">
                      {/* Portrait Photo Frame */}
                      <Link to={`/faculty/${f.id}`} className="faculty-impact-photo-frame" aria-label={`View ${f.name} profile`}>
                        {f.imageUrl ? (
                          <SmoothImage
                            src={f.imageUrl}
                            alt={f.name || f.id}
                            className="faculty-impact-photo"
                          />
                        ) : (
                          <div className="faculty-impact-avatar-fallback">
                            <span className="faculty-impact-initials">{getInitials(f.name || '')}</span>
                          </div>
                        )}
                      </Link>

                      {/* Info inside Card */}
                      <div className="faculty-impact-info">
                        <div className="faculty-impact-heading-group">
                          <h3 className="faculty-impact-name">
                            <Link to={`/faculty/${f.id}`} className="faculty-impact-name-link">
                              {f.name}
                            </Link>
                          </h3>
                          <p className="faculty-impact-meta">{f.designation}</p>
                        </div>

                        {/* Professional Badges */}
                        <div className="faculty-impact-badges">
                          {summary.qualification && (
                            <span className="faculty-impact-badge qual-badge">
                              <Award size={11} strokeWidth={2.5} />
                              <span>{summary.qualification}</span>
                            </span>
                          )}
                          {summary.experience && (
                            <span className="faculty-impact-badge exp-badge">
                              <Briefcase size={11} strokeWidth={2.5} />
                              <span>{summary.experience}</span>
                            </span>
                          )}
                        </div>

                        {/* View Full Profile Action Button */}
                        <div className="faculty-impact-footer">
                          <Link to={`/faculty/${f.id}`} className="faculty-card-profile-btn">
                            <span>View Full Profile</span>
                            <span className="faculty-btn-arrow-circle">
                              <ChevronRight size={13} strokeWidth={2.4} />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <p style={{ color: 'var(--color-text-light)', textAlign: 'center' }}>
              {availableGroups.length === 0
                ? 'No faculty members found yet.'
                : 'No faculty members found for this department yet.'}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
