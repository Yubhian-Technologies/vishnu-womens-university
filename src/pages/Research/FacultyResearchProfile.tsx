import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, Sparkles } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { FacultyDoc } from '../Academics/Faculty';
import '../detail-layout.css';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=80';

function stripTitles(name: string) {
  return name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
}

function normalizeName(name: string) {
  return stripTitles(name).replace(/[.,]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function getInitials(name: string) {
  const parts = stripTitles(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// A faculty member's Thrust Areas entry is plain admin-typed text with no
// real link to the `faculty` Firestore collection (see structuredTable.ts),
// so any richer profile shown here is a best-effort name match — if none is
// found we still render a clean page using just the name/area/category
// carried in the link's query string.
export default function FacultyResearchProfile() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'Faculty Member';
  const area = searchParams.get('area') || '';
  const category = searchParams.get('category') || '';

  const { docs: faculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const matched = faculty.find((f) => normalizeName(f.name) === normalizeName(name));

  useEffect(() => {
    document.title = `${name} | Research Profile | Vishnu Womens University`;
  }, [name]);

  return (
    <main className="page-wrapper">
      <section className="page-hero" style={{ minHeight: 280 }}>
        <img src={DEFAULT_HERO_IMAGE} alt={name} className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/research" className="breadcrumb-item">Research & Development</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/research/thrust-areas-of-research" className="breadcrumb-item">Thrust Areas of Research</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{name}</span>
          </div>
          <h1>{name}</h1>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
            {matched?.imageUrl ? (
              <img
                src={matched.imageUrl}
                alt={name}
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 96, height: 96, borderRadius: '50%', background: 'var(--color-primary)',
                  color: 'var(--color-white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 700, flexShrink: 0,
                }}
              >
                {getInitials(name)}
              </div>
            )}
            <div>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                {name}
              </h2>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {matched?.department && (
                  <span style={{ background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.9rem', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {matched.department}
                  </span>
                )}
                {(matched?.designation || category) && (
                  <span style={{ background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.9rem', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-light)' }}>
                    {matched?.designation || category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {area && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', marginBottom: 'var(--space-6)' }}>
              Research Area: <strong style={{ color: 'var(--color-text)' }}>{area}</strong>{category ? ` — ${category}` : ''}
            </p>
          )}

          {matched?.qualification && (
            <p style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-primary)' }}>Qualification:</strong> {matched.qualification}
            </p>
          )}
          {matched?.specialization && (
            <p style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              <strong style={{ color: 'var(--color-primary)' }}>Specialization:</strong> {matched.specialization}
            </p>
          )}
          {matched?.email && (
            <p style={{ marginBottom: 'var(--space-3)' }}>
              <a href={`mailto:${matched.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                <Mail size={14} strokeWidth={1.75} /> {matched.email}
              </a>
            </p>
          )}

          {!matched && (
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>
              Detailed profile information for this faculty member will be added soon.
            </p>
          )}
        </div>
      </section>

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label" style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            <Sparkles size={14} /> Research at VWU
          </span>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More Research Resources</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/research/thrust-areas-of-research" className="btn btn-accent">Back to Thrust Areas</Link>
            <Link to="/faculty" className="btn btn-secondary">Browse Faculty</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
