import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Trophy, Landmark } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { resolveContentIcon } from '../../lib/contentIcons';
import { parseStructuredTable } from '../../lib/structuredTable';
import type { GovernanceItemDoc } from '../Admin/sections/GovernanceItemsAdmin';
import '../detail-layout.css';

interface FacultyDoc {
  id: string;
  name: string;
  designation: string;
  department: string;
}

// Maps a Board of Studies table title to the matching FacultyAdmin department value,
// so faculty added in /admin show up under the right department's BoS table.
const BOS_DEPARTMENT_MAP: Record<string, string> = {
  'Computer Science & Engineering': 'CSE',
  'CSE [Cyber Security]': 'Cyber Security',
  'CSE [Artificial Intelligence & Data Science]': 'AI&DS',
  'CSE [Artificial Intelligence & Machine Learning]': 'AI&ML',
  'Information Technology': 'IT',
  'Electronics & Communication Engineering': 'ECE',
  'Electrical & Electronics Engineering': 'EEE',
  'Civil Engineering': 'Civil',
  'Mechanical Engineering': 'Mechanical',
  'Master of Business Administration (MBA)': 'MBA',
};

export default function GovernanceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: govDocs, loading: govLoading } = useOrderedCollection<GovernanceItemDoc>('governanceItems', 'order');
  const item = govDocs.find((i) => i.slug === slug) ?? null;
  const { docs: faculty } = useOrderedCollection<FacultyDoc>('faculty', 'name');
  // Each item can have its own hero image (set in the Governance/Committees/
  // IQAC admin); falls back to the shared "Governance Detail Pages" banner.
  // No hardcoded stock-photo fallback — the hero just shows its solid
  // background color if neither is set yet.
  const { slides: heroSlides } = usePageBanners('governance-detail');
  const heroImage = item?.heroImage || heroSlides[0]?.imageUrl;

  // No scroll-reveal here — this whole page's content (including the hero
  // title) only renders once the Firestore-backed `item` has loaded, so any
  // .reveal/IntersectionObserver setup would be racing async data on every
  // navigation (see the gotcha documented in CLAUDE.md).
  useEffect(() => {
    if (item) document.title = `${item.title} | Vishnu Womens University`;
  }, [item]);

  if (!item) {
    if (govLoading) {
      return (
        <main className="route-fallback">
          <div className="route-fallback__spinner" />
        </main>
      );
    }
    return <Navigate to="/governance" replace />;
  }

  const parsedTable = parseStructuredTable(item.tableText);
  const tableSections = item.slug === 'board-of-studies'
    ? parsedTable.map((section) => {
        const dept = BOS_DEPARTMENT_MAP[section.title];
        const deptFaculty = dept ? faculty.filter((f) => f.department === dept) : [];
        if (deptFaculty.length === 0) return section;

        const staticRows = section.rows.filter((r) => !r.name.toLowerCase().startsWith('faculty member'));
        const facultyRows = deptFaculty.map((f) => ({ name: f.name, role: f.designation, notes: '' }));
        return { ...section, rows: [...staticRows, ...facultyRows] };
      })
    : parsedTable;

  const categoryLabel =
    item.category === 'governance' ? 'Governance'
    : item.category === 'committees' ? 'Committees'
    : 'IQAC';

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 340 }}>
        {heroImage && (
          <img
            src={heroImage}
            alt={item.title}
            className="page-hero-image"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/governance" className="breadcrumb-item">Governance</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            {(() => { const Icon = resolveContentIcon(item.icon) || Landmark; return <Icon size={14} />; })()} {categoryLabel}
          </div>
          <h1 className="animate-fade-in-up">{item.title}</h1>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-white">
        <div className="container">
          <div className={item.highlights && item.highlights.length > 0 ? 'detail-grid' : ''}>
            <div>
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {item.title}</h2>
              {item.intro && (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                  {item.intro}
                </p>
              )}
              {item.about && (
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}>
                  {item.about}
                </p>
              )}
              {!item.intro && !item.about && (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              )}
            </div>

            {item.highlights && item.highlights.length > 0 && (
              <div className="detail-sidebar">
                <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'sticky', top: '110px' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                    Key Highlights
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {item.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Members Table(s) */}
      {tableSections.length > 0 && tableSections.some((s) => s.rows.length > 0) && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Members</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                {tableSections.length > 1 ? 'Department Boards of Studies'
                  : item.slug === 'iqac-committee' ? 'Committee Composition' : 'Members & Composition'}
              </h2>
            </div>
            {tableSections.map((section, si) => (
              <div key={section.title || si} style={{ marginBottom: 'var(--space-10)' }}>
                {section.title && (
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {section.title}
                  </h3>
                )}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-primary)' }}>
                        <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Name</th>
                        <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Role</th>
                        {section.rows.some((r) => r.notes) && (
                          <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Notes</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.name}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.role}</td>
                          {section.rows.some((r) => r.notes) && (
                            <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.notes}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outcomes */}
      {item.outcomes && item.outcomes.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Impact</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {item.outcomes.map((o) => (
                <div key={o}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <Trophy size={20} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Explore More Governance Resources
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/governance" className="btn btn-accent">Back to Governance</Link>
              <Link to="/about" className="btn btn-secondary">About VWU</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
