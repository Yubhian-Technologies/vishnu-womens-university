import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Users, FileText } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
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
        <RouteFallback />
      );
    }
    return <Navigate to="/student-clubs" replace />;
  }

  const Icon = CLUB_CATEGORY_ICONS[club.category] || Users;
  const images = club.images || [];
  const infoCards = [
    ...(club.vision ? [{ label: 'Vision', content: club.vision }] : []),
    ...(club.mission ? [{ label: 'Mission', content: club.mission }] : []),
    ...(club.customFields || []),
  ];

  return (
    <main className="page-wrapper">
      {/* Hero — plain solid-color background, same as other detail pages
          (governance, placements, differentiators): club photos live in the
          Overview section below instead, at their own natural size, rather
          than being cropped into a hero banner. */}
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

      {/* Overview. A single photo sits beside the description in a
          two-column row (grid-img-text) — that works fine because one image
          and a short paragraph are naturally close in height. But stacking
          2-3 photos in that same second column made the column far taller
          than the description, leaving a large empty gap in the text column
          (the exact same problem the otherClubsInCategory comment below
          already describes for a different pairing). So 2+ photos instead
          render full-width, in their own grid, below the description —
          sized by their own content, never forced to match another column's
          height. Every photo still keeps its natural aspect ratio (width
          100%, height auto) rather than being cropped or letterboxed. */}
      <section className="section bg-white">
        <div className="container">
          <span className="section-label">Overview</span>
          <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {club.name}</h2>
          {(() => {
            const descriptionBlock = (
              <>
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
              </>
            );

            if (images.length === 1) {
              return (
                <div className="grid-img-text" style={{ alignItems: 'start' }}>
                  <div>{descriptionBlock}</div>
                  <img
                    src={images[0].url}
                    alt={club.name}
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-light-gray)', boxShadow: 'var(--shadow-md)' }}
                  />
                </div>
              );
            }

            if (images.length > 1) {
              return (
                <>
                  <div>{descriptionBlock}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
                    {images.map((img, i) => (
                      <img
                        key={img.path || i}
                        src={img.url}
                        alt={`${club.name} ${i + 1}`}
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-light-gray)', boxShadow: 'var(--shadow-md)' }}
                      />
                    ))}
                  </div>
                </>
              );
            }

            return descriptionBlock;
          })()}

          {/* Kept outside the grid above so this pill row always takes its
              own natural height (grows/shrinks with the category's club
              count) instead of being stretched to match the description or
              photo column next to it. */}
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

      {/* Vision, Mission & any admin-added custom fields (e.g. "Objectives") —
          all rendered the same way, in the order Vision, Mission, then custom
          fields in the order added. Only shown once at least one is filled in. */}
      {infoCards.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {infoCards.map((card, i) => (
                <div key={i} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {card.label}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                    {card.content}
                  </p>
                </div>
              ))}
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

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              See {club.name} in Action
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/news-awards/gallery#photo-gallery" className="btn btn-accent">Photo Gallery</Link>
              <Link to="/student-clubs" className="btn btn-secondary">Back to Student Clubs</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
