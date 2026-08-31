import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SUB_DEPTS, SubDeptSection, FreshmanSidebarNav } from './FreshmanEngineering';
import '../detail-layout.css';

// Standalone page per Freshman Engineering subject (Mathematics / Physics /
// Chemistry / English) at /academics/<slug> — same URL shape as every other
// department (e.g. /academics/ece). Rendered from within ProgramDetail.tsx's
// /academics/:slug route (the same catch-all that special-cases the grouped
// AI/CSE/ECE departments), which is why `slug` comes in as a prop rather
// than this component reading its own route param. Content is the same
// SUB_DEPTS data + SubDeptSection component FreshmanEngineering.tsx's
// combined page already uses.
export default function FreshmanSubDepartment({ slug }: { slug: string }) {
  const dept = SUB_DEPTS.find((d) => d.slug === slug);

  useEffect(() => {
    document.title = `${dept ? dept.title : 'Freshman Engineering'} | Vishnu Women's University`;
  }, [dept]);

  if (!dept) {
    return (
      <main className="page-wrapper">
        <section className="section bg-white">
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-light)' }}>
              Department not found. <Link to="/academics/freshman-engineering">Back to Freshman Engineering</Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-wrapper">
      {/* Header — matches FreshmanEngineering.tsx's own plain content-header treatment. */}
      <section className="section bg-white" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            <Link to="/academics" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>Academics</Link>
            <span style={{ margin: '0 0.4rem', color: 'var(--color-text-light)' }}>›</span>
            <Link to="/academics" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>Departments</Link>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>
            Freshman Engineering
          </div>
          <h1 style={{ marginBottom: 'var(--space-8)' }}>{dept.title}</h1>
        </div>
      </section>

      <section className="section bg-white" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="detail-grid">
            <div>
              <SubDeptSection key={dept.key} dept={dept} />
            </div>
            <FreshmanSidebarNav activeHref={`/academics/${dept.slug}`} />
          </div>
        </div>
      </section>
    </main>
  );
}
