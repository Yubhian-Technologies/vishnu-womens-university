
import { Link } from 'react-router-dom';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import SmoothImage from '../SmoothImage/SmoothImage';
import './CampusLifeShowcase.css';

const DEFAULT_CAMPUS_LIFE_IMAGE = '/images/vibrant-campus.png';

const defaultShowcasePhoto = [
  {
    src: DEFAULT_CAMPUS_LIFE_IMAGE,
    alt: 'Campus life, cultural performances, and vibrant student activities at Vishnu Women\'s University',
    caption: 'Campus Life at VWU'
  }
];

export default function CampusLifeShowcase() {
  const showcasePhoto = useSitePhotos('home', 'campus-life-showcase', defaultShowcasePhoto)[0];
  const photoSrc = showcasePhoto?.src || DEFAULT_CAMPUS_LIFE_IMAGE;

  return (
    <section className="campus-showcase-section" aria-label="Campus Life Showcase">
      {/* Background Image with Cinematic Scrim */}
      <div className="campus-showcase-bg-wrap">
        <SmoothImage
          src={photoSrc}
          alt={showcasePhoto?.alt || defaultShowcasePhoto[0].alt}
          className="campus-showcase-bg"
        />
        <div className="campus-showcase-scrim" />
      </div>

      <div className="container">
        <div className="campus-showcase-content">
          {/* Main Title */}
          <h2 className="campus-showcase-title">
            Where Every Day Becomes Part of Your Journey
          </h2>

          {/* Lead Paragraph */}
          <div className="campus-showcase-desc">
            <p>At Vishnu Women&rsquo;s University, campus life is an experience in becoming finding your voice, discovering your strengths, and building the confidence to shape what comes next.</p>
            <p>Here, classrooms extend into innovation labs, racing tracks, sports arenas, cultural stages, and student-led communities by celebrating culture, pursuing technology, excelling in sport, and creating lasting friendships, every experience opens a new possibility.</p>
            <p>It is a campus where curiosity becomes courage, ideas become action, and ambition finds its purpose.</p>
            <p>Discover. Create. Connect. Lead.<br />Your journey begins here.</p>
          </div>

          {/* 3 Pillars Clean Horizontal Underline Grid */}
          <div className="campus-showcase-pillars">
            {/* Pillar 1: Cultural & technical events */}
            <Link to="/arts-culture" className="campus-showcase-pillar-item" aria-label="Explore Cultural festivals and technical hackathons">
              <div className="campus-showcase-pillar-icon" aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 14H42" />
                  <path d="M10 14V24C10 26 11.8 27.5 14 27.5C16.2 27.5 18 26 18 24V14" />
                  <path d="M18 14V24C18 26 19.8 27.5 22 27.5C24.2 27.5 26 26 26 24V14" />
                  <path d="M26 14V24C26 26 27.8 27.5 30 27.5C32.2 27.5 34 26 34 24V14" />
                  <path d="M14 27.5V36M22 27.5V36M30 27.5V36" />
                  <circle cx="14" cy="38" r="1.5" fill="#ffffff" />
                  <circle cx="22" cy="38" r="1.5" fill="#ffffff" />
                  <circle cx="30" cy="38" r="1.5" fill="#ffffff" />
                </svg>
              </div>
              <div className="campus-showcase-pillar-bottom">
                <span className="campus-showcase-pillar-label">
                  Cultural fests &amp;<br />hackathons
                </span>
                <span className="campus-showcase-pillar-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Pillar 2: Student clubs & societies */}
            <Link to="/student-clubs" className="campus-showcase-pillar-item" aria-label="Explore Student clubs and leadership societies">
              <div className="campus-showcase-pillar-icon" aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="15" r="4" />
                  <path d="M18 36V28C18 25.5 20.5 23.5 24 23.5C27.5 23.5 30 25.5 30 28V36" />
                  <circle cx="12" cy="18" r="3.2" />
                  <path d="M6 36V30.5C6 28.5 8 26.5 11 26.5C12.5 26.5 13.8 27 15 27.8" />
                  <circle cx="36" cy="18" r="3.2" />
                  <path d="M42 36V30.5C42 28.5 40 26.5 37 26.5C35.5 26.5 34.2 27 33 27.8" />
                </svg>
              </div>
              <div className="campus-showcase-pillar-bottom">
                <span className="campus-showcase-pillar-label">
                  Student clubs &amp;<br />leadership bodies
                </span>
                <span className="campus-showcase-pillar-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Pillar 3: Sports & Fitness */}
            <Link to="/sports-games" className="campus-showcase-pillar-item" aria-label="Explore Sports, fitness and athletic arenas">
              <div className="campus-showcase-pillar-icon" aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="12" r="4" />
                  <path d="M24 18V28" />
                  <path d="M17 23L24 21L31 23" />
                  <path d="M17 23L13 28L18 31L24 28L30 31L35 28L31 23" />
                  <path d="M15 36C18 38 21 39 24 39C27 39 30 38 33 36" />
                </svg>
              </div>
              <div className="campus-showcase-pillar-bottom">
                <span className="campus-showcase-pillar-label">
                  Sports, fitness &amp;<br />wellness arenas
                </span>
                <span className="campus-showcase-pillar-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Sub-tagline statement */}
          <p className="campus-showcase-tagline">
            Learning, innovation, and leadership happen everywhere—in labs, clubs, sports, and community.
          </p>

          {/* Primary CTA */}
          <div className="campus-showcase-action">
            <Link to="/student-life" className="campus-showcase-cta">
              Explore Life at VWU
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
