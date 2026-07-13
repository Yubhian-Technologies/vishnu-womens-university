import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryAlbums, galleryYears } from './news-awards.data';
import { useOrderedCollection } from '../../hooks/useCollection';
import PageHero from '../../components/PageHero/PageHero';
import './Gallery.css';

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  order: number;
}

const PHOTO_CATEGORIES = ['Campus', 'Events', 'Academics', 'Sports', 'Cultural', 'Placements', 'Infrastructure'];

const yearColors: Record<number, string> = {
  2026: '#003087',
  2025: '#0057B8',
  2024: '#1565C0',
  2023: '#2E7D32',
  2022: '#1B5E20',
  2021: '#4A148C',
  2020: '#880E4F',
  2019: '#BF360C',
  2018: '#E65100',
  2017: '#C9A84C',
};

export default function Gallery() {
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');
  const { docs: photos, loading: photosLoading } = useOrderedCollection<GalleryPhoto>('gallery', 'order');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Gallery | Vishnu Womens University';
  }, []);

  useEffect(() => {
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
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeYear, activeCategory, photos]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxIndex(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = activeYear === 'all' ? galleryAlbums : galleryAlbums.filter(a => a.year === activeYear);
  const filteredPhotos = activeCategory === 'all' ? photos : photos.filter((p) => p.category === activeCategory);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="news-awards-gallery"
        defaultImage="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80"
        defaultTitle="Gallery"
  defaultSubtitle="A visual archive of campus life at VWU — from national competitions and graduation days to cultural festivals and industry events."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Gallery' }]}
      />

      {/* Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{galleryAlbums.length}+</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Gallery Albums</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{galleryYears.length}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Years of Memories</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{galleryYears[0]}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Most Recent Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery — live from admin uploads */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-6)' }}>
            <span className="section-label">Fresh from Campus</span>
            <h2 className="section-title">Photo Gallery</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 600, lineHeight: 1.7 }}>
              Photos uploaded by the VWU team, updated in real time.
            </p>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                background: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-white)',
                borderColor: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-light-gray)',
                color: activeCategory === 'all' ? 'var(--color-white)' : 'var(--color-text)',
              }}
            >
              All Photos
            </button>
            {PHOTO_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  background: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-white)',
                  borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-light-gray)',
                  color: activeCategory === cat ? 'var(--color-white)' : 'var(--color-text)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {photosLoading ? (
            <p style={{ color: 'var(--color-text-light)' }}>Loading photos…</p>
          ) : filteredPhotos.length > 0 ? (
            <div className="pg-grid">
              {filteredPhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="pg-tile reveal"
                  data-delay={`${(i % 4) * 60}`}
                  onClick={() => setLightboxIndex(i)}
                >
                  <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
                  <div className="pg-tile__overlay">
                    <span className="pg-tile__caption">{photo.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-light)' }}>No photos in this category yet — check back soon.</p>
          )}
        </div>
      </section>

      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div className="pg-lightbox" onClick={(e) => e.target === e.currentTarget && setLightboxIndex(null)}>
          <div className="pg-lightbox__inner">
            <button className="pg-lightbox__close" onClick={() => setLightboxIndex(null)} aria-label="Close">✕</button>
            <img src={filteredPhotos[lightboxIndex].imageUrl} alt={filteredPhotos[lightboxIndex].title} />
            <div className="pg-lightbox__caption">
              <strong>{filteredPhotos[lightboxIndex].title}</strong>
              <span>{filteredPhotos[lightboxIndex].category}</span>
            </div>
          </div>
        </div>
      )}

      {/* Year Filter + Albums */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-6)' }}>
            <span className="section-label">Since 2017</span>
            <h2 className="section-title">Milestones by Year</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 600, lineHeight: 1.7 }}>
              A written index of major campus events and milestones across the years.
            </p>
          </div>
          {/* Year pills */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveYear('all')}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                background: activeYear === 'all' ? 'var(--color-primary)' : 'var(--color-white)',
                borderColor: activeYear === 'all' ? 'var(--color-primary)' : 'var(--color-light-gray)',
                color: activeYear === 'all' ? 'var(--color-white)' : 'var(--color-text)',
              }}
            >
              All Years
            </button>
            {galleryYears.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  background: activeYear === year ? (yearColors[year] || 'var(--color-primary)') : 'var(--color-white)',
                  borderColor: activeYear === year ? (yearColors[year] || 'var(--color-primary)') : 'var(--color-light-gray)',
                  color: activeYear === year ? 'var(--color-white)' : 'var(--color-text)',
                }}
              >
                {year}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
            Showing {filtered.length} album{filtered.length !== 1 ? 's' : ''}
            {activeYear !== 'all' && ` from ${activeYear}`}
          </div>

          {/* Albums grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            {filtered.map((album, i) => {
              const color = yearColors[album.year] || 'var(--color-primary)';
              return (
                <div
                  key={i}
                  className="reveal"
                  data-delay={`${(i % 4) * 60}`}
                  style={{
                    background: 'var(--color-white)',
                    border: '1.5px solid var(--color-light-gray)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                >
                  {/* Color bar top */}
                  <div style={{ height: 6, background: color }} />
                  <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {album.year}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.45, flex: 1 }}>
                      {album.title}
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{album.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More at VWU</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/news-awards/happenings" className="btn btn-accent">Happenings at VWU</Link>
              <Link to="/news-awards/accreditations-awards" className="btn btn-secondary">Accreditations & Awards</Link>
              <Link to="/news-awards" className="btn btn-secondary">Back to News & Awards</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
