import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { findCampusFacilityBySlug } from './campusFacilities.data';

export default function CampusFacilityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const facility = slug ? findCampusFacilityBySlug(slug) : undefined;

  const defaultPhotos = facility
    ? Array.from({ length: 5 }, (_, i) => ({
        src: PHOTO_NEEDED_PLACEHOLDER,
        alt: `${facility.title} — Photo ${i + 1}`,
        caption: '',
      }))
    : [];
  // Safe even when `facility` is undefined below (Navigate redirects before
  // this value is ever read) — hooks must still run unconditionally.
  const photos = useSitePhotos('campus', slug ?? '', defaultPhotos);

  useEffect(() => {
    if (facility) document.title = `${facility.title} | Campus Life | VWU`;
  }, [facility]);

  if (!facility) return <Navigate to="/campus" replace />;

  return (
    <main className="page-wrapper">
      <PageHero
        page={`campus-${facility.slug}`}
        defaultImage="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=80"
        defaultTitle={facility.title}
        defaultSubtitle={facility.desc}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: facility.title },
        ]}
      />

      <section className="section bg-white">
        <div className="container">
          <span className="section-label">Campus Life</span>
          <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {facility.title}</h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, maxWidth: 760 }}>
            {facility.desc}
          </p>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={photos}
              label={facility.title}
              title={`${facility.title} in Pictures`}
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
            Explore More of Campus Life
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/campus" className="btn btn-accent">Back to Campus Life</Link>
            <Link to="/student-life" className="btn btn-secondary">Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
