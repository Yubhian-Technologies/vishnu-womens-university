import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryAlbums, galleryYears } from './news-awards.data';
import PageHero from '../../components/PageHero/PageHero';

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

  useEffect(() => {
    document.title = 'Gallery | Vishnu Womens University';
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

  const filtered = activeYear === 'all' ? galleryAlbums : galleryAlbums.filter(a => a.year === activeYear);

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

      {/* Year Filter + Albums */}
      <section className="section bg-off-white">
        <div className="container">
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
