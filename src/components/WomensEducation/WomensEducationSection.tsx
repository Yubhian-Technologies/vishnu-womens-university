import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faTrophy,
  faLightbulb,
  faArrowRight,
  faStar,
  faAward,
  faFlagCheckered,
  faGlobe,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { PlacementHighlightDoc } from '../../pages/Admin/sections/PlacementHighlightsAdmin';
import './WomensEducationSection.css';

const TAGS: { icon: IconDefinition; text: string }[] = [
  { icon: faAward, text: "First Private University for Women in Telugu States" },
  { icon: faFlagCheckered, text: "All-Women mBAJA Racing Champions" },
  { icon: faGlobe, text: "150+ Global Recruiting Partners" },
  { icon: faLightbulb, text: "100% Women-Led Campus Culture" },
  { icon: faShieldHalved, text: "Highest Safety & Mentorship" },
];

interface PlacementHighlight {
  src: string;
  alt: string;
  /** Name/package/company are optional — a slot with none of them set
   *  falls back to just the photo (see PlacementHighlightCard) instead of
   *  showing an empty/fabricated info panel. */
  name?: string;
  package?: string;
  company?: string;
  /** An uploaded recruiter logo (from /admin → Home — Placement Highlights)
   *  renders instead of the plain-text company name when present. */
  logoUrl?: string;
}

// Shown until an admin adds at least one real highlight via
// /admin → Home — Placement Highlights (see PlacementHighlightsAdmin.tsx) —
// same static-default-until-replaced pattern used throughout this codebase.
const PLACEMENT_PHOTOS: PlacementHighlight[] = [
  {
    src: '/images/placements/1.png',
    alt: 'Reddi Sree Nithya, VWU graduate placed at Amazon with a 59.29 LPA package',
    name: 'Reddi Sree Nithya',
    package: '59.29 LPA',
    company: 'amazon',
  },
  { src: '/images/placements/2.png', alt: 'VWU graduate placement success story 2' },
  { src: '/images/placements/3.png', alt: 'VWU graduate placement success story 3' },
];

const CAROUSEL_INTERVAL = 3500;

export default function WomensEducationSection() {
  const [activePhoto, setActivePhoto] = useState(0);

  const { docs: liveHighlights } = useOrderedCollection<PlacementHighlightDoc>('placementHighlights', 'order');
  // Memoized so this array's identity only changes when the underlying
  // Firestore data actually does — otherwise it's a fresh array every
  // render (including every 3.5s carousel tick), which would also refire
  // the image-preload effect below on every tick for no reason.
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

  // Reset to slide 0 whenever the source data changes (e.g. Firestore's
  // live highlights replace the static defaults) — a stale index from the
  // old array could otherwise point past the end of a shorter new one.
  useEffect(() => { setActivePhoto(0); }, [placementItems.length]);

  useEffect(() => {
    if (placementItems.length <= 1) return;
    const interval = setInterval(() => {
      setActivePhoto((i) => (i + 1) % placementItems.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, [placementItems.length]);

  // Each slide's photo/logo only starts fetching once it becomes active
  // (same root cause as the testimonial carousel's — see TestimonialSlider),
  // so without this every rotation briefly shows a blank circle instead of
  // the photo. Warm the cache for every slide up front instead.
  useEffect(() => {
    placementItems.forEach((item) => {
      if (item.src) { const img = new Image(); img.src = item.src; }
      if (item.logoUrl) { const img = new Image(); img.src = item.logoUrl; }
    });
  }, [placementItems]);

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

              {/* Auto-rotating placement highlight carousel — photo, name,
                  package, and recruiter, matching a real placement
                  announcement graphic instead of a bare headshot. */}
              <div className="we-placement-highlight" aria-label="VWU graduate placement highlights">
                {placementItems.map((item, i) => (
                  <div
                    key={item.src + i}
                    className={`we-placement-card${i === activePhoto ? ' is-active' : ''}`}
                  >
                    <div className="we-placement-photo-wrap">
                      <img src={item.src} alt={item.alt} className="we-placement-photo" loading="lazy" />
                    </div>
                    {item.name && item.package ? (
                      <div className="we-placement-info">
                        <FontAwesomeIcon icon={faTrophy} className="we-placement-badge-icon" aria-hidden="true" />
                        <div className="we-placement-text">
                          <h4 className="we-placement-name">{item.name}</h4>
                          <p className="we-placement-package">{item.package}</p>
                          {item.logoUrl ? (
                            <img src={item.logoUrl} alt={item.company || ''} className="we-placement-logo" loading="lazy" />
                          ) : item.company ? (
                            <p className="we-placement-company">{item.company}</p>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="we-placement-info we-placement-info--pending">
                        <p className="we-placement-pending-note">VWU Graduate</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
