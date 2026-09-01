import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Faculty.css';
import PageHero from '../../components/PageHero/PageHero';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { FacultyFact, FacultySection } from '../../lib/facultySections';
import type { CustomSection } from '../../lib/customSections';

// Fixed department tab order (per design decision, not derived from data) —
// each tab's `departments` lists every raw `department` field value (as
// entered via /admin → Faculty/Programs) that should count toward it, since
// real records use varying spellings (e.g. "Mechanical" not "ME", "AI&ML"/
// "AI&DS" instead of a single "AI"). A tab simply doesn't render if none of
// its departments currently have any faculty.
const DEPARTMENT_GROUPS: { label: string; departments: string[] }[] = [
  { label: 'CSE', departments: ['CSE'] },
  { label: 'EEE', departments: ['EEE'] },
  { label: 'IT', departments: ['IT'] },
  { label: 'ECE', departments: ['ECE'] },
  { label: 'ME', departments: ['Mechanical', 'ME'] },
  { label: 'CE', departments: ['Civil', 'CE'] },
  { label: 'AI', departments: ['AI', 'AI&ML', 'AI&DS'] },
  { label: 'FRESHMAN ENGG.', departments: ['Mathematics', 'Physics', 'Chemistry', 'English'] },
  { label: 'MBA', departments: ['MBA'] },
];

// Exactly 4 visual designation groups a department's faculty are always
// sorted into, regardless of the order they were added in — data-driven off
// each person's own `designation` text (via /admin → Faculty), never a
// hardcoded per-person position. A new HOD, Dean, or Professor added later
// automatically lands in the right group without anyone re-ordering by hand.
// HOD/Dean Academics/Dean Statutory share one group (rank 0) — spacing is
// only ever added between these 4 ranks, never within one.
function designationGroupRank(designation: string): number {
  const d = (designation || '').toLowerCase();
  if (d.includes('hod') || d.includes('head') || d.includes('dean academic') || d.includes('dean statutory')) return 0;
  if (d.includes('assistant') || d.includes('asst')) return 3;
  if (d.includes('associate') || d.includes('assoc')) return 2;
  if (d.includes('professor')) return 1;
  return 4;
}

// Within the merged leadership group only, keeps HOD before Dean Academics
// before Dean Statutory — same visual group, still a defined internal order.
function leadershipSubRank(designation: string): number {
  const d = (designation || '').toLowerCase();
  if (d.includes('hod') || d.includes('head')) return 0;
  if (d.includes('dean academic')) return 1;
  if (d.includes('dean statutory')) return 2;
  return 3;
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

export default function Faculty() {
  const { docs: allFaculty, loading } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const [activeDept, setActiveDept] = useState<string | null>(null);

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
  const availableGroups = useMemo(
    () => DEPARTMENT_GROUPS.filter((g) => faculty.some((f) => g.departments.includes(f.department))),
    [faculty]
  );

  // Defaults to the first available tab once data loads, rather than
  // requiring the visitor to pick one — there's no "All" view anymore.
  const activeGroup = availableGroups.find((g) => g.label === activeDept) ?? availableGroups[0] ?? null;

  const filtered = useMemo(
    () => (activeGroup ? faculty.filter((f) => activeGroup.departments.includes(f.department)) : []),
    [faculty, activeGroup]
  );

  // Grouped into exactly 4 visual groups: (HOD/Dean Academics/Dean
  // Statutory) → Professors → Associate Professors → Assistant Professors.
  // A group with no one in it is simply omitted, never rendered as an empty
  // gap — spacing is only ever added between these 4, never within one.
  // Faculty within the same group keep their existing relative order
  // (Array.sort is stable), so /admin → Faculty's manual ordering still
  // applies there — except the leadership group, which is always
  // additionally sorted HOD → Dean Academics → Dean Statutory.
  const designationGroups = useMemo(() => {
    const buckets = new Map<number, FacultyDoc[]>();
    for (const f of filtered) {
      const rank = designationGroupRank(f.designation);
      if (!buckets.has(rank)) buckets.set(rank, []);
      buckets.get(rank)!.push(f);
    }
    const leadership = buckets.get(0);
    if (leadership) {
      buckets.set(0, [...leadership].sort((a, b) => leadershipSubRank(a.designation) - leadershipSubRank(b.designation)));
    }
    return [...buckets.entries()].sort(([a], [b]) => a - b).map(([, members]) => members);
  }, [filtered]);

  // A handful of people are legitimately listed under two departments (e.g.
  // AI&DS and AI&ML both credit the same faculty member) — that's fine for
  // per-department browsing, but the headline count should reflect distinct
  // people, not distinct department listings.
  const uniqueFacultyCount = useMemo(
    () => new Set(faculty.map((f) => f.name.trim().toLowerCase())).size,
    [faculty]
  );

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
            <span className="section-label">Meet the Team</span>
            <h2 className="section-title">{uniqueFacultyCount > 0 ? `${uniqueFacultyCount}+ Faculty Members` : 'Faculty'}</h2>
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
                {members.map((f) => (
                  <Link key={f.id} to={`/faculty/${f.id}`} className="faculty-card">
                    <div className="faculty-card__top">
                      <span className="faculty-card__arch" aria-hidden="true" />
                      {f.imageUrl ? (
                        <SmoothImage src={f.imageUrl} alt={f.name} className="faculty-card__photo" />
                      ) : (
                        <div className="faculty-card__avatar">{getInitials(f.name)}</div>
                      )}
                    </div>
                    <h3 className="faculty-card__name">{f.name}</h3>
                    <p className="faculty-card__designation">{f.designation}</p>
                    {f.qualification && <p className="faculty-card__qualification">{f.qualification}</p>}
                    <div className="faculty-card__actions">
                      <span className="faculty-card__btn faculty-card__btn--primary">View Profile</span>
                    </div>
                  </Link>
                ))}
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
