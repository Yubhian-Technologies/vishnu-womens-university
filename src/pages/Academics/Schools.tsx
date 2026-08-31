import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { resolveProgramIcon } from '../../lib/programIcons';
import type { SchoolDoc } from '../Admin/sections/SchoolsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import '../Academics/Academics.css';
import '../detail-layout.css';
import './Schools.css';

// The 4 "foundation" departments (Freshman Engineering subjects — see
// FOUNDATION_DEPARTMENTS in FacultyAdmin.tsx) have no Program of their own,
// so there's no program page to redirect to. FreshmanEngineering.tsx's own
// tabs are titled "Department of <Name>" and support deep-linking via
// ?tab=, so hardcode these 4 straight to their tab instead of leaving them
// as dead cards.
const FOUNDATION_DEPARTMENT_LINKS: Record<string, string> = {
  mathematics: '/academics/freshman-engineering?tab=Department%20of%20Mathematics',
  physics: '/academics/freshman-engineering?tab=Department%20of%20Physics',
  chemistry: '/academics/freshman-engineering?tab=Department%20of%20Chemistry',
  english: '/academics/freshman-engineering?tab=Department%20of%20English',
};

export default function Schools() {
  const { docs: schools, loading } = useOrderedCollection<SchoolDoc>('schools', 'order');
  const { docs: departments } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const departmentById = new Map(departments.map((d) => [d.id, d]));

  useEffect(() => {
    document.title = "Schools | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper schools-page">
      <PageHero
        page="academics-schools"
        defaultTitle="Schools"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Schools' }]}
      />

      {loading ? (
        <section className="section bg-white">
          <div className="container" style={{ textAlign: 'center' }}>
            <p className="admin-loading">Loading…</p>
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
              <div style={{ textAlign: 'left', marginBottom: 'var(--space-10)' }}>
                <span className="section-label">Schools</span>
                <h2 className="section-title">{school.title}</h2>
                {school.description && (
                  <p className="section-desc">{school.description}</p>
                )}
              </div>
              <div className="dept-grid">
                {(school.departmentIds || [])
                  .map((id) => departmentById.get(id))
                  .filter((d): d is DepartmentDoc => Boolean(d))
                  .map((dept) => {
                    const Icon = resolveProgramIcon(dept.icon);
                    const foundationLink = FOUNDATION_DEPARTMENT_LINKS[dept.title.trim().toLowerCase()];
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
                    return foundationLink ? (
                      <Link key={dept.id} to={foundationLink} className="dept-card dept-card--link">
                        {body}
                        <span className="dept-card-arrow" style={{ marginTop: 'auto' }}>Learn More →</span>
                      </Link>
                    ) : (
                      <div key={dept.id} className="dept-card">{body}</div>
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
