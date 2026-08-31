import { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
                    const linkSlug = findDeptProgramSlug(dept, programs);
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
                      <Link key={dept.id} to={`/academics/${linkSlug}`} className="dept-card dept-card--link">
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
