import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Check, ChevronDown } from 'lucide-react';
import './VisionMission.css';
import '../About/About.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { resolveContentIcon } from '../../lib/contentIcons';

const defaultInspirationPhotos = [
  // Slots 0-4: "Our Values in Action" PhotoGrid gallery
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Students collaborating', caption: 'Collaboration' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Research and innovation', caption: 'Research & Innovation' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Green campus environment', caption: 'Green Campus' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Sports and wellness', caption: 'Sports & Wellness' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Smart classrooms', caption: 'Smart Classrooms' },
  // Slot 5: standalone "Quality Policy" section image below
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'VWU quality education', caption: '' },
];

const MISSION_PREVIEW_LEN = 100;

const QUALITY_COMMITMENT_ITEMS = [
  { title: 'Academic Quality', desc: 'Maintain high standards across teaching, learning and research.' },
  { title: 'Student Development', desc: 'Support meaningful learning experiences and the overall development of students.' },
  { title: 'Continuous Improvement', desc: 'Respond to evolving educational needs, technologies and academic practices.' },
  { title: 'Integrity & Responsibility', desc: 'Uphold integrity, consistency and responsible practices across the University.' },
];

const defaultCoreValuesPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Empowering Women in Tech', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Tech Innovation', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Global Standards', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Research Excellence', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Social Responsibility', caption: '' },
];

export default function VisionMission() {
  const missionPoints = useContentBlocks('vision-mission', 'missionPoints');
  const values = useContentBlocks('vision-mission', 'values');
  const visionMissionPhotos = useSitePhotos('vision-mission', 'main', defaultInspirationPhotos);
  const inspirationPhotos = visionMissionPhotos.slice(0, 5);
  const qualityPolicyImg = visionMissionPhotos[5];
  const coreValuesPhotos = useSitePhotos('vision-mission', 'core-values', defaultCoreValuesPhotos);
  const hasCoreValuesPhotos = useSectionHasPhotos('vision-mission', 'core-values');

  useEffect(() => {
    document.title = 'Vision & Mission | VWU';
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
        defaultTitle="Vision & Mission"
        defaultSubtitle="The principles, purpose, and commitments that inform every decision and action at Vishnu Womens University."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'Vision & Mission' }]}
        hideCta={true}
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
                  To emerge as a globally benchmarked, women-centric university that advances the
                  Sustainable Development Goals (SDGs) through academic excellence, ethical leadership, and
                  transformative innovation—empowering women to shape an equitable, sustainable, and
                  resilient world.
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
              <p className="vm-mission-intro">
                To advance knowledge and women’s education through academic excellence, research, innovation and
                responsible engagement with society. We are committed to equity, sustainability, global
                collaboration and the development of graduates who are prepared to contribute with competence and
                integrity.
              </p>
              <ul className="vm-mission-list">
                {missionPoints.map((point, i) => {
                  const num = String(i + 1).padStart(2, '0');
                  const isLong = point.title.length > MISSION_PREVIEW_LEN;
                  if (!isLong) {
                    return (
                      <li key={point.id} className="vm-mission-item">
                        <span className="vm-mission-num">{num}</span>
                        <p>{point.title}</p>
                      </li>
                    );
                  }
                  return (
                    <li key={point.id} className="vm-mission-item vm-mission-item--collapsible">
                      <details>
                        <summary>
                          <span className="vm-mission-num">{num}</span>
                          <span className="vm-mission-preview">{point.title.slice(0, MISSION_PREVIEW_LEN).trimEnd()}…</span>
                          <ChevronDown size={18} className="vm-mission-chevron" />
                        </summary>
                        <p className="vm-mission-full">{point.title}</p>
                      </details>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              The values that guide our teaching, research and engagement.
            </p>
          </div>
          <div className="vm-values-grid">
            {values.map((v) => {
              const Icon = resolveContentIcon(v.icon) || Trophy;
              return (
                <div key={v.id} className="vm-value-card">
                  <div className="vm-value-icon"><Icon size={24} strokeWidth={1.8} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={inspirationPhotos}
            label="Our Values in Action"
            title="Where Purpose Meets Practice"
            subtitle="Every corner of VWU reflects the values we stand for — in classrooms, on the field, and in the community."
            highlights={[
              'Excellence in teaching, research & outcomes',
              'Innovation through TBI & AICTE IDEA Lab',
              'Community service via NSS & Dr. B.V. Raju Foundation',
              'Environmental stewardship — green campus initiative',
            ]}
            columns={2}
            layout="side-text"
            showGalleryLink={false}
          />
        </div>
      </section>

      {/* Our Core Values — hidden until real photos are added */}
      {hasCoreValuesPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={coreValuesPhotos}
              label="Our Core Values"
              title="What VWU Stands For"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Quality Policy */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>
                QUALITY COMMITMENT
              </span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Quality Policy</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-base)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                We are committed to maintaining high standards in teaching, learning, research and institutional
                practice, with a continued focus on student development and academic improvement.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {QUALITY_COMMITMENT_ITEMS.map((item) => (
                  <li key={item.title} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <Check size={17} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 4 }} />
                    <div>
                      <p style={{ color: 'var(--color-white)', fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0 }}>{item.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', lineHeight: 1.65, margin: '2px 0 0' }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {qualityPolicyImg && (
              <div className="sves-image-wrapper reveal-right">
                <img
                  src={qualityPolicyImg.src}
                  alt={qualityPolicyImg.alt}
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: 'var(--space-4)' }}>
              Empowering Women Through Excellence
            </h2>
            <div style={{ maxWidth: 720, margin: '0 auto var(--space-8)' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                Discover our academic programs, state-of-the-art campus infrastructure, and vibrant student community.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-accent btn-lg">About VWU</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
