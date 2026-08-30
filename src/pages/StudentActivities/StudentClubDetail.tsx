import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Users, FileText } from 'lucide-react';
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
  const images = club.images || [];
  const galleryImages = images.slice(1);

  return (
    <main className="page-wrapper">
      {/* Hero — falls back to the plain solid-color background, same as
          other detail pages, until an admin uploads a club image. */}
      <section className="page-hero" style={{ minHeight: 320 }}>
        {images[0] && (
          <img
            src={images[0].url}
            alt={club.name}
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

      {/* Overview — deliberately a single column, not the two-column
          detail-grid other detail pages use: that layout forces this row
          as tall as its sidebar, so a short description (as most club
          descriptions are) left a large fixed blank gap below the text
          before the next section, sized to whichever category had the most
          other clubs rather than to the description itself. A wrapping pill
          row for "other clubs in this category" takes its own natural
          height instead, so this section's height always tracks its own
          content — grows with a longer description, shrinks with a shorter
          one, never padded out to match a sibling. */}
      <section className="section bg-white">
        <div className="container">
          <span className="section-label">Overview</span>
          <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {club.name}</h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
            {club.desc || 'More details about this club are coming soon.'}
          </p>
          {club.pdfUrl && (
            <a
              href={club.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="annual-reports-link"
              style={{ marginTop: 'var(--space-5)' }}
            >
              <FileText size={16} className="annual-reports-icon" />
              View / Download Club Document
            </a>
          )}

          {otherClubsInCategory.length > 0 && (
            <div style={{ marginTop: 'var(--space-8)' }}>
              <span className="gov-sidenav-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>
                Other {club.category}
              </span>
              <div className="thrust-dept-tabs" style={{ marginBottom: 0 }}>
                <span className="thrust-dept-tab active">{club.name}</span>
                {otherClubsInCategory.map((c) => (
                  <Link key={c.id} to={`/student-clubs/${c.slug || slugify(c.name)}`} className="thrust-dept-tab">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Vision & Mission — only shown once an admin has filled at least one in */}
      {(club.vision || club.mission) && (
        <section className="section bg-off-white">
          <div className="container">
            <div
              className="mobile-stack-grid"
              style={{ display: 'grid', gridTemplateColumns: club.vision && club.mission ? '1fr 1fr' : '1fr', gap: 'var(--space-6)' }}
            >
              {club.vision && (
                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    Vision
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                    {club.vision}
                  </p>
                </div>
              )}
              {club.mission && (
                <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    Mission
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                    {club.mission}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Committee — only shown once an admin has added at least one member */}
      {club.committee && club.committee.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <span className="section-label">Committee</span>
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-6)' }}>
              The {club.name} Committee is constituted with the following members:
            </h2>
            <div className="pb-activities-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="pb-activities-num">S. No</th>
                    <th>Club Members</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Contact Details</th>
                  </tr>
                </thead>
                <tbody>
                  {club.committee.map((member, i) => (
                    <tr key={i}>
                      <td className="pb-activities-num">{i + 1}</td>
                      <td>{member.name}</td>
                      <td>{member.designation}</td>
                      <td>{member.department || '—'}</td>
                      <td>{member.contact || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Gallery — the hero already shows the first image, so only the rest
          (if any) render here. */}
      {galleryImages.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <span className="section-label">Gallery</span>
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-6)' }}>
              {club.name} in Pictures
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
              {galleryImages.map((img, i) => (
                <img
                  key={img.path || i}
                  src={img.url}
                  alt={`${club.name} ${i + 2}`}
                  style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
                />
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
