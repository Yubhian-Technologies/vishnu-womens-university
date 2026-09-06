import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';
import { galleryAlbums as staticAlbums } from './news-awards.data';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { GalleryAlbumDoc } from '../Admin/sections/GalleryAdmin';
import { useHashScroll } from '../../hooks/useHashScroll';
import PageHero from '../../components/PageHero/PageHero';
import './Gallery.css';

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
  useHashScroll();
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');
  const { docs: liveAlbums } = useOrderedCollection<GalleryAlbumDoc>('galleryAlbums', 'order');

  // Live admin-managed albums in Firestore
  const albums = liveAlbums.map((a) => ({ title: a.title, date: a.date, year: a.year, link: a.link || '', imageUrl: a.imageUrl || '' }));
  const galleryYears = Array.from(new Set(albums.map((a) => a.year))).sort((a, b) => b - a);

  useEffect(() => {
    document.title = "Gallery | Vishnu Women's University";
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
  }, [activeYear]);

  const filtered = activeYear === 'all' ? albums : albums.filter(a => a.year === activeYear);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="news-awards-gallery"
        defaultTitle="Gallery"
        defaultSubtitle="A visual archive of campus life at VWU — from national competitions and graduation days to cultural festivals and industry events."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Gallery' }]}
        scrollCtaTargetId="gallery-content"
      />

      {/* Stats */}
      <section id="gallery-content" style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{albums.length}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Gallery Albums</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{galleryYears.length}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Years of Memories</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{galleryYears[0] || '—'}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Most Recent Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Year Filter + Albums */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-6)' }}>
            <span className="section-label">Campus Archive</span>
            <h2 className="section-title">Milestones by Year</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 600, lineHeight: 1.7 }}>
              A visual index of major campus events and milestones across the years.
            </p>
          </div>
          {/* Year pills */}
          {galleryYears.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveYear('all')}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: 0,
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
                    borderRadius: 0,
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
          )}

          <div style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
            Showing {filtered.length} album{filtered.length !== 1 ? 's' : ''}
            {activeYear !== 'all' && ` from ${activeYear}`}
          </div>

          {/* Albums grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', background: 'var(--color-white)', border: '1.5px dashed var(--color-light-gray)', margin: 'var(--space-4) 0' }}>
              <ImageIcon size={48} style={{ color: 'var(--color-text-light)', opacity: 0.4, marginBottom: 'var(--space-3)' }} />
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>No Gallery Albums Found</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', maxWidth: 460, margin: '0 auto' }}>
                Albums uploaded or bulk imported from the Admin Dashboard will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
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
                      borderRadius: 0,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget as HTMLElement;
                      card.style.boxShadow = 'var(--shadow-lg)';
                      card.style.transform = 'translateY(-4px)';
                      const img = card.querySelector('img');
                      if (img) img.style.transform = 'scale(1.06)';
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget as HTMLElement;
                      card.style.boxShadow = 'var(--shadow-sm)';
                      card.style.transform = 'none';
                      const img = card.querySelector('img');
                      if (img) img.style.transform = 'scale(1)';
                    }}
                  >
                    {album.imageUrl ? (
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', minHeight: '220px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                        <img
                          src={album.imageUrl}
                          alt={album.title}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            background: 'rgba(0, 0, 0, 0.65)',
                            backdropFilter: 'blur(4px)',
                            color: '#fff',
                            padding: '0.25rem 0.6rem',
                            borderRadius: 0,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <ImageIcon size={12} /> Photo Album
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '160px',
                          background: `linear-gradient(135deg, ${color}15 0%, ${color}35 100%)`,
                          borderBottom: `3px solid ${color}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <ImageIcon size={36} style={{ color: color, opacity: 0.4 }} />
                      </div>
                    )}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {album.year}
                        </span>
                        {album.date && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{album.date}</span>}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.45, flex: 1, margin: 0 }}>
                        {album.title}
                      </h3>
                      {album.link && (
                        <a
                          href={album.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-accent"
                          style={{
                            alignSelf: 'flex-start',
                            marginTop: '0.5rem',
                            padding: '0.45rem 1.1rem',
                            fontSize: 'var(--text-xs)',
                            borderRadius: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          <span>VIEW ALBUM</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More at VWU</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/news-awards/happenings" className="btn btn-accent" style={{ borderRadius: 0 }}>Happenings at VWU</Link>
              <Link to="/news-awards/accreditations-awards" className="btn btn-secondary" style={{ borderRadius: 0 }}>Accreditations & Awards</Link>
              <Link to="/news-awards" className="btn btn-secondary" style={{ borderRadius: 0 }}>Back to News & Awards</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
