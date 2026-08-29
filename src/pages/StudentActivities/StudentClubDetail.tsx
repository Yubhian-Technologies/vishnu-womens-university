import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { slugify } from '../../lib/slugify';
import type { ClubDoc } from '../Admin/sections/StudentClubsAdmin';
import { CLUB_CATEGORY_ICONS } from '../Admin/sections/StudentClubsAdmin';
import '../detail-layout.css';

export default function StudentClubDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allClubs, loading } = useOrderedCollection<ClubDoc>('studentClubs', 'order');
  const club = allClubs.find((c) => (c.slug || slugify(c.name)) === slug) ?? null;

  const otherClubsInCategory = club
    ? allClubs.filter((c) => c.category === club.category && c.id !== club.id)
    : [];

  // No scroll-reveal here — the whole page only renders once the
  // Firestore-backed `club` has loaded (see the gotcha documented in CLAUDE.md).
  useEffect(() => {
    if (club) document.title = `${club.name} | Vishnu Women's University`;
  }, [club]);

  if (!club) {
    if (loading) {
      return (
        <main className="route-fallback">
          <div className="route-fallback__spinner" />
        </main>
      );
    }
    return <Navigate to="/student-clubs" replace />;
  }

  const Icon = CLUB_CATEGORY_ICONS[club.category] || Users;

  return (
    <main className="page-wrapper">
      {/* Hero — clubs have no per-item image field, so this shows the plain
          solid-color background, same as other detail pages before a photo
          is set. */}
      <section className="page-hero" style={{ minHeight: 320 }}>
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/student-life" className="breadcrumb-item">Student Life</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/student-clubs" className="breadcrumb-item">Student Clubs</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{club.name}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Icon size={14} /> {club.category}
          </div>
          <h1 className="animate-fade-in-up">{club.name}</h1>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-white">
        <div className="container">
          <div className={otherClubsInCategory.length > 0 ? 'detail-grid' : ''}>
            <div>
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {club.name}</h2>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                {club.desc || 'More details about this club are coming soon.'}
              </p>
            </div>

            {otherClubsInCategory.length > 0 && (
              <div className="detail-sidebar">
                <div style={{ position: 'sticky', top: '110px' }}>
                  <nav className="gov-sidenav" aria-label={`Other ${club.category}`}>
                    <span className="gov-sidenav-label">{club.category}</span>
                    <ul>
                      <li>
                        <span className="gov-sidenav-link active">{club.name}</span>
                      </li>
                      {otherClubsInCategory.map((c) => (
                        <li key={c.id}>
                          <Link to={`/student-clubs/${c.slug || slugify(c.name)}`} className="gov-sidenav-link">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              See {club.name} in Action
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/news-awards/gallery?category=Clubs#photo-gallery" className="btn btn-accent">Photo Gallery</Link>
              <Link to="/student-clubs" className="btn btn-secondary">Back to Student Clubs</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
