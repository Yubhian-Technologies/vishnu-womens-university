import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faArrowRight,
  faAward,
} from '@fortawesome/free-solid-svg-icons';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { PlacementHighlightDoc } from '../../pages/Admin/sections/PlacementHighlightsAdmin';
import './WomensEducationSection.css';

interface PlacementHighlight {
  src: string;
  alt: string;
  name?: string;
  package?: string;
  company?: string;
  logoUrl?: string;
}

const PLACEMENT_PHOTOS: PlacementHighlight[] = [
  {
    src: '/images/placements/1.png',
    alt: 'D. Renuka Ganga, VWU graduate placed at Google with a 59.29 LPA package',
    name: 'D. RENUKA GANGA',
    package: '59.29 LPA',
    company: 'Google',
  },
  { src: '/images/placements/2.png', alt: 'VWU graduate placement success story 2' },
  { src: '/images/placements/3.png', alt: 'VWU graduate placement success story 3' },
];

const CAROUSEL_INTERVAL = 4000;

function GoogleLogo() {
  return (
    <div className="we-google-logo-badge" title="Placed at Google">
      <span className="we-google-g">G</span>
      <span className="we-google-o1">o</span>
      <span className="we-google-o2">o</span>
      <span className="we-google-g2">g</span>
      <span className="we-google-l">l</span>
      <span className="we-google-e">e</span>
    </div>
  );
}

export default function WomensEducationSection() {
  const [activePhoto, setActivePhoto] = useState(0);

  const { docs: liveHighlights } = useOrderedCollection<PlacementHighlightDoc>('placementHighlights', 'order');
  
  const placementItems: PlacementHighlight[] = useMemo(() => (
    liveHighlights.length > 0
      ? liveHighlights.map((h) => ({
          src: h.photoUrl,
          alt: `${h.name}, VWU graduate${h.companyName ? ` placed at ${h.companyName}` : ''}${h.package ? ` with a ${h.package} package` : ''}`,
          name: h.name,
          package: h.package,
          company: h.companyName,
          logoUrl: h.logoUrl,
        }))
      : PLACEMENT_PHOTOS
  ), [liveHighlights]);

  useEffect(() => { setActivePhoto(0); }, [placementItems.length]);

  useEffect(() => {
    if (placementItems.length <= 1) return;
    const interval = setInterval(() => {
      setActivePhoto((i) => (i + 1) % placementItems.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, [placementItems.length]);

  useEffect(() => {
    placementItems.forEach((item) => {
      if (item.src) { const img = new Image(); img.src = item.src; }
      if (item.logoUrl) { const img = new Image(); img.src = item.logoUrl; }
    });
  }, [placementItems]);

  return (
    <section className="we-section" aria-label="Women's Education at VWU">
      {/* Background Decorative Ambient Glows */}
      <div className="we-glow we-glow--1" aria-hidden="true" />
      <div className="we-glow we-glow--2" aria-hidden="true" />

      <div className="container">
        <div className="we-grid">
          {/* Left Column: Mission, Headline & CTAs */}
          <div className="we-content">
            <h2 className="we-title">
              Educate a Woman,<br />
              <span className="gradient-text">Transform the World.</span>
            </h2>

            <p className="we-lead">
              At <strong>Vishnu Women's University</strong>, when women master advanced technology,
              they don't just participate in the future — they engineer it.
            </p>

            <p className="we-desc">
              We cultivate critical thinkers, bold leaders, and visionary innovators who lead top technology firms,
              publish ground-breaking research, and shape the digital world.
            </p>

            {/* Action Buttons */}
            <div className="we-actions">
              <Link to="/academics" className="we-btn-primary">
                <span>Explore Academic Programs</span>
                <FontAwesomeIcon icon={faArrowRight} className="we-btn-arrow" />
              </Link>
              <Link to="/about" className="we-btn-secondary">
                <span>Our Heritage &amp; Vision</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Polished Student Success Card */}
          <div className="we-visual-column">
            <div className="we-success-story-wrapper">
              {placementItems.map((item, i) => {
                const isActive = i === activePhoto;
                const isGoogle = (item.company || '').toLowerCase().includes('google') || !item.company;
                return (
                  <div
                    key={item.src + i}
                    className={`we-success-card${isActive ? ' is-active' : ''}`}
                  >
                    {/* Trophy Watermark */}
                    <FontAwesomeIcon icon={faTrophy} className="we-trophy-watermark" aria-hidden="true" />

                    {/* Circular Student Avatar */}
                    <div className="we-student-avatar-frame">
                      <img src={item.src} alt={item.alt} className="we-student-avatar" loading="lazy" />
                    </div>

                    {/* Student Success Content */}
                    <div className="we-success-content">
                      <div className="we-success-eyebrow">
                        <FontAwesomeIcon icon={faAward} className="we-success-award-icon" />
                        <span>STUDENT SUCCESS STORY</span>
                      </div>

                      <h3 className="we-student-name">{item.name || 'D. RENUKA GANGA'}</h3>

                      <div className="we-package-highlight">
                        <span className="we-package-num">{item.package ? item.package.replace(/LPA/i, '').trim() : '59.29'}</span>
                        <span className="we-package-unit">LPA</span>
                      </div>

                      <div className="we-company-badge">
                        {item.logoUrl ? (
                          <img src={item.logoUrl} alt={item.company || ''} className="we-company-logo" loading="lazy" />
                        ) : isGoogle ? (
                          <GoogleLogo />
                        ) : (
                          <span className="we-company-name-text">{item.company}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
