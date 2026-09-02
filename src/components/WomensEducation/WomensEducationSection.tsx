import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faShieldHalved,
  faTrophy,
  faLightbulb,
  faHandshakeAngle,
  faUsers,
  faArrowRight,
  faStar,
  faAward,
  faFlagCheckered,
  faGlobe,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import './WomensEducationSection.css';

const PILLARS = [
  {
    icon: faRocket,
    iconColor: '#2d6a4f',
    image: '/images/girl on graduation-rafiki.svg',
    title: "Fearless Innovation",
    desc: "Breaking glass ceilings in AI, VLSI, Cyber Security, and Automotive Engineering with purpose-built research labs.",
    tag: "Next-Gen Tech",
  },
  {
    icon: faShieldHalved,
    iconColor: '#1b4332',
    image: '/images/girl on graduation-pana.svg',
    title: "100% Safe & Inspiring Campus",
    desc: "A vibrant, world-class residential campus built entirely to nurture women's personal, academic, and professional growth.",
    tag: "Secure Campus",
  },
  {
    icon: faTrophy,
    iconColor: '#92400e',
    image: '/images/girl on graduation-cuate.svg',
    title: "Global Leadership Launchpad",
    desc: "1,100+ placements annually with top tech giants like Amazon, Microsoft, Adobe, Google, and Fortune 500 recruiters.",
    tag: "Career Ready",
  },
  {
    icon: faLightbulb,
    iconColor: '#7c3aed',
    image: '/images/girl on graduation-amico.svg',
    title: "Incubation & Entrepreneurship",
    desc: "Empowering student founders with seed funding, 150+ patents, and dedicated incubation at Sri Vishnu TBI.",
    tag: "Women Founders",
  },
];

const TAGS: { icon: IconDefinition; text: string }[] = [
  { icon: faAward, text: "First Private University for Women in Telugu States" },
  { icon: faFlagCheckered, text: "All-Women mBAJA Racing Champions" },
  { icon: faGlobe, text: "150+ Global Recruiting Partners" },
  { icon: faLightbulb, text: "100% Women-Led Campus Culture" },
  { icon: faShieldHalved, text: "Highest Safety & Mentorship" },
];

const PLACEMENT_PHOTOS = [
  { src: '/images/placements/1.png', alt: 'VWU graduate placement success story 1' },
  { src: '/images/placements/2.png', alt: 'VWU graduate placement success story 2' },
  { src: '/images/placements/3.png', alt: 'VWU graduate placement success story 3' },
];

const CAROUSEL_INTERVAL = 3500;

export default function WomensEducationSection() {
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhoto((i) => (i + 1) % PLACEMENT_PHOTOS.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="we-section" aria-label="Women's Education at VWU">
      {/* Background Decorative Mesh Glow */}
      <div className="we-glow we-glow--1" aria-hidden="true" />
      <div className="we-glow we-glow--2" aria-hidden="true" />

      <div className="container">
        {/* Top Split: Text Content & Illustration */}
        <div className="we-grid">
          {/* Left Column: Mission, Headlines, Tags & CTAs */}
          <div className="we-content reveal-left">
            <div className="we-badge-row">
              <span className="we-badge">
                <FontAwesomeIcon icon={faStar} className="we-badge-icon" />
                <span>Empowering Women in Technology</span>
              </span>
            </div>

            <h2 className="we-title">
              Educate a Woman,<br />
              <span className="gradient-text">Transform the World.</span>
            </h2>

            <p className="we-lead">
              At <strong>Vishnu Women's University</strong>, we believe when women are given the tools,
              freedom, and mentorship to master advanced technology, they don't just participate in the future — they engineer it.
            </p>

            <p className="we-desc">
              As the premier private university dedicated exclusively to women in the Telugu states,
              we cultivate critical thinkers, bold leaders, and visionary innovators who lead multinational corporations,
              publish cutting-edge research, and launch impactful startups.
            </p>

            {/* Quick Interactive Tags */}
            <div className="we-tags-wrap">
              {TAGS.map((tag, idx) => (
                <span key={idx} className="we-tag-chip">
                  <FontAwesomeIcon icon={tag.icon} className="we-tag-chip-icon" />
                  {tag.text}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="we-actions">
              <Link to="/academics" className="btn btn-primary btn-lg we-btn-primary">
                <span>Explore Academic Programs</span>
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.9rem' }} />
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg we-btn-secondary">
                <span>Our Heritage & Vision</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Placement Photo Carousel & Floating Stat Cards */}
          <div className="we-visual-column reveal-right">
            <div className="we-illustration-card">
              {/* Decorative Circular Halo */}
              <div className="we-halo-ring" aria-hidden="true" />

              {/* Circular auto-rotating placement photo carousel */}
              <div className="we-photo-carousel" aria-label="VWU graduate placement highlights">
                {PLACEMENT_PHOTOS.map((photo, i) => (
                  <img
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    className={`we-photo-carousel-img${i === activePhoto ? ' is-active' : ''}`}
                    loading="lazy"
                  />
                ))}
              </div>

              {/* Floating Badge 1: Top Left */}
              <div className="we-float-card we-float-card--top">
                <div className="we-float-icon">
                  <FontAwesomeIcon icon={faHandshakeAngle} style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)' }} />
                </div>
                <div>
                  <strong className="we-float-title">100% Women-Centric</strong>
                  <span className="we-float-subtitle">Empowered Sisterhood</span>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Right */}
              <div className="we-float-card we-float-card--bottom">
                <div className="we-float-icon we-float-icon--gold">
                  <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.1rem', color: '#78350f' }} />
                </div>
                <div>
                  <strong className="we-float-title">59.28 LPA Peak Offer</strong>
                  <span className="we-float-subtitle">Proven Career Success</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Four Impact Pillars — each with a girl illustration */}
        <div className="we-pillars-grid">
          {PILLARS.map((p, idx) => (
            <div key={idx} className="we-pillar-card reveal-bounce" data-delay={`${idx * 80}`}>
              {/* Card illustration */}
              <div className="we-pillar-illustration-wrap">
                <img
                  src={p.image}
                  alt={p.title}
                  className="we-pillar-illustration"
                  loading="lazy"
                />
              </div>

              <div className="we-pillar-header">
                <div className="we-pillar-icon-box" style={{ color: p.iconColor }}>
                  <FontAwesomeIcon icon={p.icon} style={{ fontSize: '1.15rem' }} />
                </div>
                <span className="we-pillar-tag">{p.tag}</span>
              </div>

              <h3 className="we-pillar-title">{p.title}</h3>
              <p className="we-pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
