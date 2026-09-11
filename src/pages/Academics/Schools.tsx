import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { resolveProgramIcon } from '../../lib/programIcons';
import type { SchoolDoc } from '../Admin/sections/SchoolsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import { findDeptProgramSlug } from './Academics';
import '../Academics/Academics.css';
import '../detail-layout.css';
import './Schools.css';

// Per-school highlight line shown under the title. Keyed by normalised
// school title (lowercased, trimmed). Not an admin field yet — add a
// `tagline` to SchoolDoc + SchoolsAdmin if these need editing without a deploy.
const SCHOOL_TAGLINES: Record<string, string> = {
  'school of computing': 'Empowering Women to Shape the Digital Future.',
  'school of engineering': 'Empowering Women to Engineer the Future.',
  'school of sciences': 'Empowering Women to Explore, Discover & Shape the Future.',
  'school of management': 'Empowering Women to Lead with Purpose and Vision.',
};

export default function Schools() {
  const { docs: schools, loading } = useOrderedCollection<SchoolDoc>('schools', 'order');
  const { docs: departments } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const { docs: programs } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const departmentById = new Map(departments.map((d) => [d.id, d]));

  useEffect(() => {
    document.title = "Schools | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper schools-page">
      <PageHero
        page="academics-schools"
        defaultTitle="VWU's Four Schools"
        defaultSubtitle="A Connected Academic Community"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Schools' }]}
      />



      {loading ? (
        <section className="section bg-white">
          <div className="container">
            <div className="card-skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card-skeleton" />)}
            </div>
          </div>
        </section>
      ) : schools.length === 0 ? (
        <section className="section bg-white">
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-light)' }}>Schools have not been added yet — check back soon.</p>
          </div>
        </section>
      ) : (
        schools.map((school, i) => (
          <section key={school.id} className={`section ${i % 2 === 0 ? 'bg-white' : 'bg-off-white'}`}>
            <div className="container">
              <div className="school-header" style={{ marginBottom: 'var(--space-10)' }}>
                <span className="school-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="section-title school-title">{school.title}</h2>
                {SCHOOL_TAGLINES[school.title.trim().toLowerCase()] && (
                  <p className="school-tagline">{SCHOOL_TAGLINES[school.title.trim().toLowerCase()]}</p>
                )}
                {school.description && (
                  <p className="section-desc">{school.description}</p>
                )}
                <div className="academics-stat-row">
                  <span className="chip-badge">
                    <Layers size={14} strokeWidth={2} />
                    {(school.departmentIds || []).length} Department{(school.departmentIds || []).length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
              <div className="dept-grid">
                {(school.departmentIds || [])
                  .map((id) => departmentById.get(id))
                  .filter((d): d is DepartmentDoc => Boolean(d))
                  .map((dept, idx) => {
                    const Icon = resolveProgramIcon(dept.icon);
                    const linkSlug = findDeptProgramSlug(dept, programs);
                    const cardStyle = { animationDelay: `${Math.min(idx, 8) * 60}ms` };
                    const body = (
                      <>
                        <div className="dept-card-top">
                          <span className="dept-icon"><Icon size={30} strokeWidth={1.75} /></span>
                          <span className="dept-code">{dept.shortCode}</span>
                        </div>
                        <h3 className="dept-name">{dept.title}</h3>
                        <p className="dept-desc">{dept.description}</p>
                      </>
                    );
                    return linkSlug ? (
                      <Link
                        key={dept.id}
                        to={`/academics/${linkSlug}`}
                        className="dept-card dept-card--link dept-card--roster animate-fade-in-up"
                        style={cardStyle}
                      >
                        {body}
                        <span className="dept-card-arrow" style={{ marginTop: 'auto' }}>Learn More →</span>
                      </Link>
                    ) : (
                      <div key={dept.id} className="dept-card dept-card--roster animate-fade-in-up" style={cardStyle}>{body}</div>
                    );
                  })}
                {(school.departmentIds || []).length === 0 && (
                  <p style={{ color: 'var(--color-text-light)', gridColumn: '1 / -1', textAlign: 'center' }}>
                    No departments added to this school yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        ))
      )}
    </main>
  );
}
