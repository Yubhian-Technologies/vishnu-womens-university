import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Faculty.css';
import PageHero from '../../components/PageHero/PageHero';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { FacultyFact, FacultySection } from '../../lib/facultySections';

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
}

const DEPARTMENTS = ['CSE', 'AI&ML', 'AI&DS', 'Cyber Security', 'IT', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA'];

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Faculty() {
  const { docs: faculty, loading } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const [activeDept, setActiveDept] = useState('All');

  useEffect(() => {
    document.title = 'Faculty | Vishnu Womens University';
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

  const availableDepts = useMemo(() => {
    const present = new Set(faculty.map((f) => f.department).filter(Boolean));
    return DEPARTMENTS.filter((d) => present.has(d));
  }, [faculty]);

  const filtered = activeDept === 'All' ? faculty : faculty.filter((f) => f.department === activeDept);

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
            <h2 className="section-title">{faculty.length > 0 ? `${faculty.length}+ Faculty Members` : 'Faculty'}</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Browse faculty by department, or view everyone across VWU.
            </p>
          </div>

          <div className="faculty-tabs">
            <button
              className={`faculty-tab${activeDept === 'All' ? ' active' : ''}`}
              onClick={() => setActiveDept('All')}
            >
              All Departments
            </button>
            {availableDepts.map((d) => (
              <button
                key={d}
                className={`faculty-tab${activeDept === d ? ' active' : ''}`}
                onClick={() => setActiveDept(d)}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="faculty-grid">
            {filtered.map((f) => (
              <Link key={f.id} to={`/faculty/${f.id}`} className="faculty-card">
                {f.imageUrl ? (
                  <SmoothImage src={f.imageUrl} alt={f.name} className="faculty-card__photo" />
                ) : (
                  <div className="faculty-card__avatar">{getInitials(f.name)}</div>
                )}
                <h3 className="faculty-card__name">{f.name}</h3>
                <p className="faculty-card__designation">{f.designation}</p>
                {f.qualification && <p className="faculty-card__qualification">{f.qualification}</p>}
                {f.department && <span className="faculty-card__dept">{f.department}</span>}
                <span className="faculty-card__view-profile">View Details →</span>
              </Link>
            ))}
            {!loading && filtered.length === 0 && (
              <p style={{ color: 'var(--color-text-light)', gridColumn: '1 / -1', textAlign: 'center' }}>
                No faculty members found for this department yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
