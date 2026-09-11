import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { resolveProgramIcon } from '../../lib/programIcons';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import type { SchoolDoc } from '../Admin/sections/SchoolsAdmin';
import { truncate, findDeptProgramSlug } from './Academics';
import './Academics.css';
import '../detail-layout.css';

export default function Departments() {
  const { docs: programs } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const { docs: departments, loading } = useOrderedCollection<DepartmentDoc>('departments', 'order');
  const { docs: schools } = useOrderedCollection<SchoolDoc>('schools', 'order');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [filterText, setFilterText] = useState('');
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

  // Text-filtered department list — feeds the school-grouping below so the
  // "N Departments" counts per group always reflect the active search.
  const filteredDepartments = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((d) =>
      d.title.toLowerCase().includes(q) ||
      d.shortCode.toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q)
    );
  }, [departments, filterText]);

  // Groups the flat department list under its parent School (same
  // departmentIds lookup Schools.tsx uses), so the directory reads as a real
  // university structure instead of one undifferentiated wall of cards.
  // Departments that don't belong to any school (e.g. standalone foundation
  // subjects) fall into a trailing "Other Departments" group.
  const groups = useMemo(() => {
    const assigned = new Set<string>();
    const bySchool = schools
      .map((school) => {
        const depts = (school.departmentIds || [])
          .map((id) => filteredDepartments.find((d) => d.id === id))
          .filter((d): d is DepartmentDoc => Boolean(d));
        depts.forEach((d) => assigned.add(d.id));
        return { label: school.title, departments: depts };
      })
      .filter((g) => g.departments.length > 0);
    const other = filteredDepartments.filter((d) => !assigned.has(d.id));
    return other.length > 0 ? [...bySchool, { label: 'Other Departments', departments: other }] : bySchool;
  }, [schools, filteredDepartments]);

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
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 className="section-title">Academic Departments</h2>
            <p className="section-desc" style={{ margin: '0 auto', maxWidth: 720 }}>
              Specialised departments bringing together experienced faculty, modern laboratories, and industry-aligned curricula for relevant and future-ready education.
            </p>
          </div>

          <input
            type="text"
            className="dept-filter-input"
            placeholder="Search departments…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            aria-label="Search departments"
          />

          {loading ? (
            <div className="card-skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card-skeleton" />)}
            </div>
          ) : groups.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)', textAlign: 'center' }}>
              {filterText
                ? `No departments found matching "${filterText}".`
                : 'No departments added yet — add them from Admin → Academic Departments.'}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="dept-group">
                <div className="dept-group-heading">
                  <h3>{group.label}</h3>
                  <span className="dept-group-count">
                    {group.departments.length} Department{group.departments.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="dept-grid">
                  {group.departments.map((dept, idx) => {
                    const Icon = resolveProgramIcon(dept.icon);
                    const expanded = expandedDepts.has(dept.id);
                    const isTruncated = (dept.description || '').length > 130;
                    const linkSlug = deptProgramSlug[dept.id];
                    const cardStyle = { animationDelay: `${Math.min(idx, 8) * 60}ms` };
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
                            className="dept-expand-toggle"
                          >
                            {expanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </>
                    );
                    return linkSlug ? (
                      <Link
                        key={dept.id}
                        to={`/academics/${linkSlug}`}
                        className="dept-card dept-card--link dept-card--directory animate-fade-in-up"
                        style={cardStyle}
                      >
                        {body}
                        <span className="dept-card-arrow" style={{ marginTop: 'auto' }}>Learn More →</span>
                      </Link>
                    ) : (
                      <div key={dept.id} className="dept-card dept-card--directory animate-fade-in-up" style={cardStyle}>
                        {body}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
