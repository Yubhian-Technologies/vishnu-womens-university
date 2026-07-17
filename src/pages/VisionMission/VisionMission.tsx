import { useEffect } from 'react';
import { Trophy, Check } from 'lucide-react';
import './VisionMission.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';

const inspirationPhotos = [
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Students collaborating', caption: 'Collaboration' },
  { src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research and innovation', caption: 'Research & Innovation' },
  { src: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80', alt: 'Green campus environment', caption: 'Green Campus' },
  { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports and wellness', caption: 'Sports & Wellness' },
  { src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms', caption: 'Smart Classrooms' },
];

export default function VisionMission() {
  const missionPoints = useContentBlocks('vision-mission', 'missionPoints');
  const values = useContentBlocks('vision-mission', 'values');
  const qualityPolicy = useContentBlocks('vision-mission', 'qualityPolicy');

  useEffect(() => {
    document.title = 'Vision, Mission & Values | VWU';
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
        page="vision-mission"
        defaultImage="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
        defaultTitle="Vision, Mission & Values"
  defaultSubtitle="The principles, purpose, and commitments that inform every decision and action at Vishnu Womens University."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'Vision, Mission & Values' }]}
      />

      {/* Vision */}
      <section className="section bg-white">
        <div className="container">
          <div className="vm-section reveal">
            <div className="vm-label">
              <span className="vm-bar" />
              <h2>Vision</h2>
            </div>
            <div className="vm-content">
              <div className="vm-vision-box">
                <span className="vm-quote-icon">❝</span>
                <p>
                  Transform the society through excellence in Women's Education, Community empowerment
                  and sustained Environmental protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="vm-section reveal">
            <div className="vm-label">
              <span className="vm-bar" />
              <h2>Mission</h2>
            </div>
            <div className="vm-content">
              <ul className="vm-mission-list">
                {missionPoints.map((point, i) => (
                  <li key={point.id} className="vm-mission-item">
                    <span className="vm-mission-num">{String(i + 1).padStart(2, '0')}</span>
                    <p>{point.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Core Values</span>
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Six enduring values that shape how we teach, how we work, and how we engage with the world.
            </p>
          </div>
          <div className="vm-values-grid">
            {values.map((v) => {
              const Icon = resolveContentIcon(v.icon) || Trophy;
              return (
                <div key={v.id} className="vm-value-card">
                  <div className="vm-value-icon"><Icon size={40} strokeWidth={1.75} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Photos */}
      <section className="section bg-white">
        <div className="container">
          <PhotoGrid
            images={inspirationPhotos}
            label="Our Values in Action"
            title="Where Purpose Meets Practice"
            subtitle="Every corner of VWU reflects the values we stand for — in classrooms, on the field, and in the community."
            highlights={[
              'Excellence in teaching, research & outcomes',
              'Innovation through TBI, STI Hub & AICTE IDEA Lab',
              'Community service via NSS & Dr. B.V. Raju Foundation',
              'Environmental stewardship — green campus initiative',
            ]}
            columns={2}
            layout="side-text"
            showGalleryLink={false}
          />
        </div>
      </section>

      {/* Quality Policy */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Quality Commitment</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-6)' }}>Quality Policy</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {qualityPolicy.map((p) => (
                  <li key={p.id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <Check size={17} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{p.title}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80"
                alt="VWU quality education"
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
