import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { resolveProgramIcon } from '../../lib/programIcons';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import { truncate, findDeptProgramSlug } from './Academics';
import './Academics.css';
import '../detail-layout.css';

export default function Departments() {
  const { docs: programs } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const { docs: departments } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const toggleDept = (id: string) => setExpandedDepts((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const deptProgramSlug = useMemo(() => {
    const map: Record<string, string> = {};
    departments.forEach((d) => {
      const slug = findDeptProgramSlug(d, programs);
      if (slug) map[d.id] = slug;
    });
    return map;
  }, [departments, programs]);

  useEffect(() => {
    document.title = "Departments | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      <PageHero
        page="academics-departments"
        defaultTitle="Departments"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Departments' }]}
      />

      <section className="section bg-white">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
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
    </main>
  );
}
