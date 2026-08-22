import { useEffect } from 'react';
import { Trophy, Check } from 'lucide-react';
import './VisionMission.css';
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

const valuesPolicyPoints = [
  'We strive for excellence in all that we do in order to model success for our students',
  'We focus on students’ success and satisfaction and meeting the needs of the community',
  'We take pride in the quality of our organization and work, and we value, originality, integrity, consistency, and attention to detail',
  'We stay abreast of ever-changing youth culture, emerging communication technologies and design trends',
  'We set benchmarks and model high quality standards for students, faculty, staff, and community partners',
  'We lay utmost importance on discipline, punctuality, personal values and healthy practices',
  'We create an innovative environment for students and staff to develop an integrated personality',
  'Inclusive community projects',
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
  const qualityPolicy = useContentBlocks('vision-mission', 'qualityPolicy');
  const visionMissionPhotos = useSitePhotos('vision-mission', 'main', defaultInspirationPhotos);
  const inspirationPhotos = visionMissionPhotos.slice(0, 5);
  const qualityPolicyImg = visionMissionPhotos[5];
  const coreValuesPhotos = useSitePhotos('vision-mission', 'core-values', defaultCoreValuesPhotos);
  const hasCoreValuesPhotos = useSectionHasPhotos('vision-mission', 'core-values');

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
        defaultTitle="Vision, Mission & Values"
  defaultSubtitle="The principles, purpose, and commitments that inform every decision and action at Vishnu Women's University."
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

      {/* Values (Quality Policy) */}
      <section className="section bg-white">
        <div className="container">
          <div className="vm-section reveal">
            <div className="vm-label">
              <span className="vm-bar" />
              <h2>Values</h2>
            </div>
            <div className="vm-content">
              <ul className="vm-values-list">
                {valuesPolicyPoints.map((point) => (
                  <li key={point} className="vm-values-item">
                    <Check size={17} strokeWidth={2.5} className="vm-values-icon" />
                    <p>{point}</p>
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

      {/* Our Core Values — hidden until real photos are added */}
      {hasCoreValuesPhotos && (
        <section className="section bg-off-white">
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
            {qualityPolicyImg && (
              <div>
                <img
                  src={qualityPolicyImg.src}
                  alt={qualityPolicyImg.alt}
                  style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
