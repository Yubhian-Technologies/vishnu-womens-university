import { useEffect } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { resolveContentIcon } from '../../lib/contentIcons';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { resolveCampusFacility } from './campusFacilities.data';
import { Building } from 'lucide-react';

const defaultCampusGalleryPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Smart classrooms', caption: 'Smart Classrooms' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Research labs', caption: 'Research Labs' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Central library', caption: 'Central Library' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Campus hostel', caption: 'Student Hostels' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Sports facilities', caption: 'Sports Courts' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Campus dining', caption: 'Food Courts' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Campus life', caption: 'Green Campus' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Green environment', caption: 'Campus Gardens' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Events auditorium', caption: 'Main Auditorium' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Technical events', caption: 'Technova Symposium' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Students studying', caption: 'Collaborative Learning' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Campus events', caption: 'Cultural Programs' },
];

const defaultFacilitiesPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Main Entrance', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Academic Blocks', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Central Library Building', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Open Air Auditorium', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Green Spaces & Gardens', caption: '' },
];

const defaultHostelsLivingPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Hostel Blocks Exterior', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Standard Room Layout', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Dining Hall & Mess', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Indoor Recreation Room', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Security & Main Gate', caption: '' },
];

export default function Campus() {
  useHashScroll();
  const stats = useContentBlocks('campus', 'stats');
  const facilities = useContentBlocks('campus', 'facilities');
  const campusGalleryPhotos = useSitePhotos('campus', 'main', defaultCampusGalleryPhotos);
  const facilitiesPhotos = useSitePhotos('campus', 'facilities-infrastructure', defaultFacilitiesPhotos);
  const hasFacilitiesPhotos = useSectionHasPhotos('campus', 'facilities-infrastructure');
  const hostelsLivingPhotos = useSitePhotos('campus', 'hostels-living', defaultHostelsLivingPhotos);
  const hasHostelsLivingPhotos = useSectionHasPhotos('campus', 'hostels-living');

  useEffect(() => {
    document.title = 'Campus Life | VWU';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="campus"
        defaultTitle="Campus Life at VWU"
  defaultSubtitle="An 80-acre campus in Bhimavaram where learning, wellness, and community life come together."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Campus Life' }]}
      />

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.id} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)' }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Grid — Firestore-derived, so no scroll-reveal animation
          on the cards themselves (see the gotcha documented in CLAUDE.md). */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Infrastructure</span>
            <h2 className="section-title">World-Class Campus Facilities</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Each facility at VWU has been developed to support students academically, promote personal well-being, and enrich campus life.
            </p>
          </div>
          <div className="grid-4 campus-facilities-grid">
            {facilities.map((f) => {
              const Icon = resolveContentIcon(f.icon) || Building;
              const cardStyle: CSSProperties = { display: 'block', textDecoration: 'none', background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' };
              const onMouseEnter = (e: ReactMouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; };
              const onMouseLeave = (e: ReactMouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; };
              const matchedFacility = resolveCampusFacility(f.title, f.slug);
              const cardInner = (
                <>
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={35} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{matchedFacility?.title || f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{matchedFacility?.desc || f.desc}</p>
                </>
              );
              if (matchedFacility) {
                return (
                  <Link key={f.id} id={f.slug || undefined} to={`/campus/${matchedFacility.slug}`} style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    {cardInner}
                  </Link>
                );
              }
              return (
                <div key={f.id} id={f.slug || undefined} style={cardStyle} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                  {cardInner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Image Gallery */}
      <section className="section bg-white">
        <div className="container">
          <PhotoGrid
            images={campusGalleryPhotos}
            label="Gallery"
            title="A Glimpse of VWU Campus"
            subtitle="Explore the spaces and moments that define everyday life at Vishnu Women's University — from labs and classrooms to courts and canteens."
            highlights={[
              'Main auditorium seats 2,000+ students',
              '24×7 secured campus with CCTV monitoring',
              'Dedicated travel desk & transport network',
              'On-campus temples, ATM & photocopying services',
              'Fully accessible infrastructure for all students',
            ]}
            columns={4}
            layout="side-text"
          />
        </div>
      </section>

      {/* Facilities & Infrastructure — hidden until real photos are added */}
      {hasFacilitiesPhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={facilitiesPhotos}
              label="Facilities & Infrastructure"
              title="Built for Focused, High-Quality Learning"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Hostels & Living — hidden until real photos are added */}
      {hasHostelsLivingPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={hostelsLivingPhotos}
              label="Hostels & Living"
              title="Comfortable, Secure On-Campus Living"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-16) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Experience VWU</span>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Come See Our Campus</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto var(--space-8)' }}>
              Schedule a campus visit to tour the facilities in person, meet our faculty, and get a clear picture of life at VWU.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg">Schedule a Visit</Link>
              <Link to="/student-life" className="btn btn-secondary btn-lg">Student Life</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
