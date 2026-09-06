import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, ExternalLink, GraduationCap, Check, Building2,
  Users, Award, BookOpen, Sparkles, Globe
} from 'lucide-react';
import './AboutSVES.css';
import '../About/About.css';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import type { SvesCampusDoc } from '../Admin/sections/SvesCampusesAdmin';

const STAT_ICONS = [Building2, GraduationCap, Users, Award, BookOpen, Sparkles, MapPin, Globe];

const defaultSvesPhotos = [
  // Slots 0-4: "Our Campuses" PhotoGrid gallery
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Green Meadows campus Bhimavaram', caption: 'Green Meadows — Bhimavaram' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'University buildings', caption: 'Academic Blocks' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Students at campus event', caption: 'Student Events' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Graduation ceremony', caption: 'Convocation' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Academic conference', caption: 'Conferences & Seminars' },
  // Slot 5: standalone SVES intro section image below
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'SVES campus', caption: '' },
];

const defaultSvesHeritagePhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Society Central Office', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Sister Institutions', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Founder Chairman Vision', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Joint Campus Events', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Community Development Outreach', caption: '' },
];

const defaultLegacyVisionPhotos = [
  { src: '/sves-legacy-vision.jpg', alt: 'Legacy Rooted in Vision — Late Dr. B. V. Raju', caption: '' },
];

const defaultLeadershipCulturePhotos = [
  { src: '/sves-leadership-culture.jpg', alt: 'Leadership & Culture — Sri K. V. Vishnu Raju', caption: '' },
];

export default function AboutSVES() {
  const svesStats = useContentBlocks('about-sves', 'stats');
  const milestones = useContentBlocks('about-sves', 'milestones');
  const legacyVisionBlocks = useContentBlocks('about-sves', 'legacy-vision');
  const leadershipCultureBlocks = useContentBlocks('about-sves', 'leadership-culture');

  const { docs: campuses } = useOrderedCollection<SvesCampusDoc>('svesCampuses', 'order');
  const svesMainPhotos = useSitePhotos('about-sves', 'main', defaultSvesPhotos);
  const svesPhotos = svesMainPhotos.slice(0, 5);
  const svesIntroImg = svesMainPhotos[5];
  const svesHeritagePhotos = useSitePhotos('about-sves', 'sves-heritage', defaultSvesHeritagePhotos);
  const hasSvesHeritagePhotos = useSectionHasPhotos('about-sves', 'sves-heritage');

  const legacyVisionPhotos = useSitePhotos('about-sves', 'legacy-vision', defaultLegacyVisionPhotos);
  const legacyVisionImg = legacyVisionPhotos[0] || defaultLegacyVisionPhotos[0];

  const leadershipCulturePhotos = useSitePhotos('about-sves', 'leadership-culture', defaultLeadershipCulturePhotos);
  const leadershipCultureImg = leadershipCulturePhotos[0] || defaultLeadershipCulturePhotos[0];

  useEffect(() => {
    document.title = 'About SVES | VWU';
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
        page="about-sves"
        defaultTitle="Sri Vishnu Educational Society"
        defaultSubtitle="A Legacy of Educational Excellence Since 1992 — Comprising over 25,000 students and 1,400+ faculty across Andhra Pradesh and Telangana."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'About SVES' }]}
      />

      {/* Quick Stats Bar — M3 Tonal Surface Cards */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.5rem, 3vw, 2.15rem)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              30+ Years of Educational Leadership &amp; Impact
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>
              Empowering over 25,000 students across Andhra Pradesh &amp; Telangana.
            </p>
          </div>
          <div className="about-facts-bar">
            {svesStats.map((s, idx) => {
              const IconComp = STAT_ICONS[idx % STAT_ICONS.length];
              return (
                <div key={s.id} className="about-fact">
                  <IconComp size={20} className="about-fact-icon" strokeWidth={2} />
                  <div className="about-fact-value">{s.value}</div>
                  <div className="about-fact-label">{s.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About SVES — M3 Surface Card Frame */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="about-mission-grid">
            <div className="reveal-left">
              <span className="section-label">ABOUT SVES</span>
              <h2 className="section-title">Sri Vishnu Educational Society</h2>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                A Legacy of Educational Excellence Since 1992
              </p>
              <div className="divider" />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Founded in 1992 by the late <strong>Dr. B. V. Raju</strong>, an eminent industrialist, philanthropist, and recipient of the <strong>Padma Shri and Padma Bhushan</strong>, the Sri Vishnu Educational Society (SVES) is a not-for-profit, self-funded educational organization committed to advancing quality higher education.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Over the decades, SVES has built a strong presence across Engineering, Dentistry, Pharmacy, Commerce &amp; Sciences, Management, and Polytechnic education, providing diverse opportunities for students to learn, innovate, and build meaningful careers.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Today, the SVES group of institutions comprises more than <strong>25,000 students</strong> and over <strong>1,400 faculty members</strong> across campuses in Andhra Pradesh and Telangana, with a strong reputation for academic excellence and student development.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-5)', color: 'var(--color-text-light)' }}>
                SVES has also been a pioneer in women’s engineering education, with two exclusive women’s engineering institutions recognized among the leading institutions in the region.
              </p>
              <a href="https://www.srivishnu.edu.in/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Know More <ExternalLink size={15} strokeWidth={2.4} style={{ marginLeft: '0.4rem' }} />
              </a>
            </div>
            {svesIntroImg && (
              <div className="about-who-img-card reveal-right">
                <SmoothImage
                  src={svesIntroImg.src}
                  alt={svesIntroImg.alt || 'Sri Vishnu Educational Society Campus'}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = PHOTO_NEEDED_PLACEHOLDER;
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 1: Legacy Rooted in Vision (Left Image, Right Content) */}
      <section className="section bg-white">
        <div className="container">
          <div className="about-mission-grid">
            {legacyVisionImg && (
              <div className="about-who-img-card reveal-left">
                <SmoothImage
                  src={legacyVisionImg.src}
                  alt={legacyVisionImg.alt || 'Legacy Rooted in Vision — Late Dr. B. V. Raju'}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = PHOTO_NEEDED_PLACEHOLDER;
                    }
                  }}
                />
              </div>
            )}
            <div className="reveal-right">
              <span className="section-label">
                {legacyVisionBlocks[0]?.value || 'Legacy Rooted in Vision'}
              </span>
              <h2 className="section-title">
                {legacyVisionBlocks[0]?.title || 'Inspiring Generations Since 1992'}
              </h2>
              <div className="divider" style={{ margin: '0 0 var(--space-4) 0' }} />
              {legacyVisionBlocks.length > 0 ? (
                legacyVisionBlocks.map((block) => (
                  <p key={block.id} style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                    {block.desc}
                  </p>
                ))
              ) : (
                <>
                  <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                    The story of SVES began with the vision of <strong>Late Dr. B. V. Raju</strong>, a pioneer of the Indian cement industry and a passionate advocate of education as a force for social transformation.
                  </p>
                  <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                    Driven by his belief that quality education should reach aspiring learners beyond major cities, he established institutions that brought opportunities for excellence to students in smaller towns and emerging communities. His vision continues to guide SVES in creating educational environments that nurture knowledge, character, confidence, and leadership.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Leadership & Culture (Left Content, Right Image) */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="about-mission-grid">
            <div className="reveal-left">
              <span className="section-label">
                {leadershipCultureBlocks[0]?.value || 'Leadership & Culture'}
              </span>
              <h2 className="section-title">
                {leadershipCultureBlocks[0]?.title || 'Built on Purpose. Driven by Passion.'}
              </h2>
              <div className="divider" style={{ margin: '0 0 var(--space-4) 0' }} />
              {leadershipCultureBlocks.length > 0 ? (
                leadershipCultureBlocks.map((block) => (
                  <p key={block.id} style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                    {block.desc}
                  </p>
                ))
              ) : (
                <>
                  <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                    The vision of the Founder Chairman, <strong>Late Dr. B. V. Raju</strong>, continues to inspire the leadership of <strong>Sri K. V. Vishnu Raju</strong>, Chairman and grandson of the Founder Chairman.
                  </p>
                  <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                    Together, this enduring legacy has shaped a culture of purpose, innovation, excellence, and student-centered learning. SVES remains committed to creating transformative educational experiences that empower students to realize their potential and contribute meaningfully to society across Andhra Pradesh and Telangana.
                  </p>
                </>
              )}
            </div>
            {leadershipCultureImg && (
              <div className="about-who-img-card reveal-right">
                <SmoothImage
                  src={leadershipCultureImg.src}
                  alt={leadershipCultureImg.alt || 'Leadership & Culture — Sri K. V. Vishnu Raju'}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = PHOTO_NEEDED_PLACEHOLDER;
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Four Distinct Campuses */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">SVES Network</span>
            <h2 className="section-title">Four Distinct Campuses</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: '650px', margin: '0.5rem auto 0', lineHeight: 1.7, fontSize: '1.02rem' }}>
              Spanning across strategic academic hubs in Andhra Pradesh and Telangana, providing world-class learning ecosystems.
            </p>
          </div>
          <div className="sves-campuses-grid">
            {campuses.map((campus, index) => (
              <div key={campus.id} className="sves-campus-card">
                <div className="sves-campus-header">
                  <div className="sves-campus-meta">
                    <span className="sves-campus-index">0{index + 1}</span>
                    <span className="sves-campus-location">
                      <MapPin size={12} strokeWidth={2.5} /> {campus.location}
                    </span>
                  </div>
                  <h3 className="sves-campus-name">{campus.name}</h3>
                  <div className="sves-campus-badge">
                    <GraduationCap size={13} /> {(campus.institutions || []).length} Institutions
                  </div>
                </div>
                <div className="sves-campus-body">
                  <ul className="sves-campus-list">
                    {(campus.institutions || []).map((inst) => (
                      <li key={inst}>
                        <span className="sves-list-bullet">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="sves-inst-text">{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={svesPhotos}
            label="Our Campuses"
            title="SVES Institutions"
            subtitle="Glimpses from the campuses, events, and milestones of the Sri Vishnu Educational Society."
            highlights={[
              '11 institutions across Andhra Pradesh & Telangana',
              '4 campuses — Bhimavaram, Narsapur, Hyderabad, Medak',
              '25,000+ students & 1,400+ faculty',
              '30+ years of educational leadership',
              'Engineering, Pharmacy, Dental, School & beyond',
            ]}
            columns={2}
            layout="side-text"
          />
        </div>
      </section>

      {/* SVES Campuses & Heritage — hidden until real photos are added */}
      {hasSvesHeritagePhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={svesHeritagePhotos}
              label="SVES Campuses & Heritage"
              title="The Legacy of Sri Vishnu Educational Society"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Milestones */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Journey</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>30+ Years of SVES Excellence</h2>
          </div>
          <div className="sves-milestones">
            {milestones.map((m) => (
              <div key={m.id} className="sves-milestone">
                <div className="sves-milestone-year">{m.title}</div>
                <div className="sves-milestone-dot" />
                <div className="sves-milestone-text">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Join SVES</span>
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: 'var(--space-4)' }}>
              Empowering Education Across Generations
            </h2>
            <div style={{ maxWidth: 720, margin: '0 auto var(--space-8)' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                Sri Vishnu Educational Society continues to shape future leaders, innovators, and professionals through world-class academic institutions.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 0 }}>
                Discover our flagship university — Vishnu Women's University.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-accent btn-lg">About VWU</Link>
              <Link to="/academics" className="btn btn-secondary btn-lg">Explore Academics</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
