import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, ExternalLink, GraduationCap, Check, Building2,
  Users, Award, BookOpen, Sparkles, Globe, Tag
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
import { renderBold } from '../../lib/boldText';
import { useDocument } from '../../hooks/useDocument';
import { DEFAULT_ABOUT_SVES_CONTENT, ABOUT_SVES_CONTENT_COLLECTION, ABOUT_SVES_CONTENT_DOC_ID, type AboutSvesContentDoc } from '../Admin/sections/AboutSvesContentAdmin';

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
  const { data: remoteContent } = useDocument<AboutSvesContentDoc>(ABOUT_SVES_CONTENT_COLLECTION, ABOUT_SVES_CONTENT_DOC_ID);
  const content = { ...DEFAULT_ABOUT_SVES_CONTENT, ...remoteContent };
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
              {content.statsHeading}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>
              {content.statsSubtitle}
            </p>
          </div>
          <div className="about-facts-bar">
            {svesStats.map((s, idx) => {
              const IconComp = STAT_ICONS[idx % STAT_ICONS.length];
              return (
                <div key={s.id} className="about-fact">
                  <IconComp size={20} className="about-fact-icon" strokeWidth={2} />
                  <div className="about-fact-value">{renderBold(s.value)}</div>
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
              <h2 className="section-title">Sri Vishnu Educational Society</h2>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
               {content.introSubheading}
              </p>
              <div className="divider" />
              {content.introParagraphs.filter(Boolean).map((p, i) => (
                <p key={i} style={{ lineHeight: 1.8, marginBottom: i === content.introParagraphs.length - 1 ? 'var(--space-5)' : 'var(--space-4)', color: 'var(--color-text-light)' }}>{renderBold(p)}</p>
              ))}
              <a href="https://www.srivishnu.edu.in/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {content.introLinkLabel} <ExternalLink size={15} strokeWidth={2.4} style={{ marginLeft: '0.4rem' }} />
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
              <h2 className="section-title">
                {legacyVisionBlocks[0]?.title || content.legacyHeading || 'A Vision That Began in 1992'}
              </h2>
              <div className="divider" style={{ margin: '0 0 var(--space-4) 0' }} />
              {legacyVisionBlocks.length > 0 ? (
                legacyVisionBlocks.map((block) => (
                  <p key={block.id} style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                    {renderBold(block.desc)}
                  </p>
                ))
              ) : (
                (content.legacyParagraphs || []).filter(Boolean).map((p, i, arr) => (
                  <p key={i} style={{ lineHeight: 1.8, marginBottom: i === arr.length - 1 ? 0 : 'var(--space-4)', color: 'var(--color-text-light)' }}>
                    {renderBold(p)}
                  </p>
                ))
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
              <h2 className="section-title">
                {leadershipCultureBlocks[0]?.title || content.leadershipHeading || 'Carrying the Vision Forward'}
              </h2>
              <div className="divider" style={{ margin: '0 0 var(--space-4) 0' }} />
              {leadershipCultureBlocks.length > 0 ? (
                leadershipCultureBlocks.map((block) => (
                  <p key={block.id} style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                    {renderBold(block.desc)}
                  </p>
                ))
              ) : (
                (content.leadershipParagraphs || []).filter(Boolean).map((p, i, arr) => (
                  <p key={i} style={{ lineHeight: 1.8, marginBottom: i === arr.length - 1 ? 0 : 'var(--space-4)', color: 'var(--color-text-light)' }}>
                    {renderBold(p)}
                  </p>
                ))
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
            <h2 className="section-title">{content.campusesHeading}</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: '650px', margin: '0.5rem auto 0', lineHeight: 1.7, fontSize: '1.02rem' }}>
              {content.campusesParagraph}
            </p>
          </div>
          <div className="sves-campuses-grid">
            {campuses.map((campus, index) => {
              const nameLower = campus.name.toLowerCase();
              const rawInsts = campus.institutions || [];
              let sections: { tag?: string; items: string[] }[] = [];

              if (nameLower.includes('green meadows') || index === 0) {
                const mainItems = rawInsts.filter(
                  (inst) => !inst.toLowerCase().includes('seetha polytechnic')
                );
                const southItems = rawInsts.filter((inst) =>
                  inst.toLowerCase().includes('seetha polytechnic')
                );
                const polyItem = southItems.length > 0 ? southItems : ['Smt. B Seetha Polytechnic'];
                const filteredMain = mainItems.length > 0 ? mainItems : [
                  "Vishnu Women's University",
                  'Vishnu Institute of Technology',
                  'Vishnu Dental College & Hospital',
                  'Shri Vishnu College of Pharmacy',
                  'B. V. Raju College',
                  'Vishnu School, Bhimavaram',
                ];
                sections = [
                  { items: filteredMain },
                  { tag: 'South Campus', items: polyItem },
                ];
              } else if (nameLower.includes('lake view') || nameLower.includes('vedic') || index === 3) {
                const vedicName = rawInsts[0] || 'Vishnu Educational Development and Innovation Centre (VEDIC)';
                sections = [
                  { tag: 'Hyderabad', items: [vedicName] },
                  { tag: 'Bangalore', items: [vedicName] },
                ];
              } else {
                sections = [{ items: rawInsts }];
              }

              const totalCount = sections.reduce((acc, sec) => acc + sec.items.length, 0);
              const displayLocation = (nameLower.includes('lake view') || index === 3)
                ? 'Hyderabad & Bangalore'
                : campus.location;

              return (
                <div key={campus.id} className="sves-campus-card">
                  <div className="sves-campus-header">
                    <div className="sves-campus-meta">
                      <span className="sves-campus-index">0{index + 1}</span>
                      <span className="sves-campus-location">
                        <MapPin size={12} strokeWidth={2.5} /> {displayLocation}
                      </span>
                    </div>
                    <h3 className="sves-campus-name">{campus.name}</h3>
                    <div className="sves-campus-badge">
                      <GraduationCap size={13} /> {totalCount} {totalCount === 1 ? 'Institution' : 'Institutions'}
                    </div>
                  </div>
                  <div className="sves-campus-body">
                    {sections.map((section, sIdx) => (
                      <div key={section.tag || `sec-${sIdx}`} className="sves-campus-section">
                        {section.tag && (
                          <div className="sves-subtag-badge">
                            <Tag size={11} strokeWidth={2.5} /> {section.tag}
                          </div>
                        )}
                        <ul className="sves-campus-list">
                          {section.items.map((inst) => (
                            <li key={inst}>
                              <span className="sves-list-bullet">
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="sves-inst-text">{renderBold(inst)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
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
            images={svesPhotos}
            label={content.galleryLabel}
            title={content.galleryTitle}
            subtitle={content.gallerySubtitle}
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
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>{content.milestonesHeading}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0.5rem auto 0', lineHeight: 1.7, fontSize: '1.02rem' }}>
              {content.milestonesParagraph}
            </p>
          </div>
          <div className="sves-milestones">
            {milestones.map((m) => (
              <div key={m.id} className="sves-milestone">
                <div className="sves-milestone-year">{m.title}</div>
                <div className="sves-milestone-dot" />
                <div className="sves-milestone-text">{renderBold(m.desc)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span style={{ display: 'block', color: 'var(--color-accent)', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
              {content.ctaEyebrow}
            </span>
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: 'var(--space-4)' }}>
              {content.ctaHeading}
            </h2>
            <div style={{ maxWidth: 720, margin: '0 auto var(--space-8)' }}>
              {content.ctaParagraphs.filter(Boolean).map((p, i, arr) => (
                <p key={i} style={i === arr.length - 1 ? { color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 0 } : { color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>{p}</p>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-accent btn-lg">{content.ctaButtonLabel}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
