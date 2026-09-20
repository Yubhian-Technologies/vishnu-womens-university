import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { HappeningsShowcaseDoc } from '../Admin/sections/NewsAwardsDataAdmin';
import './HappeningsPosterSlider.css';

interface ShowcaseSlide {
  id: string;
  title: string;
  caption?: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  badge?: string;
}

const DEFAULT_SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'amazon-selects-2026',
    title: 'Amazon 2026 Selects',
    caption: '16 Students Placed with ₹46.38 Lakhs per annum',
    description: 'Congratulations to our 16 students on securing Full-Time roles at Amazon with ₹46.38 LPA package. Shri Vishnu Engineering College for Women continues its tradition of exceptional career placements and engineering excellence.',
    imageUrl: '/images/placements/1.png',
    badge: 'Placement Record',
    linkUrl: '/placements',
  },
  {
    id: 'campus-placements-2026',
    title: 'Campus Recruitment Star Achievers',
    caption: 'Elite Career Milestones Across Global Technology Leaders',
    description: 'VWU engineers consistently secure premier roles in software engineering, AI/ML, VLSI, and cloud computing across Fortune 500 enterprises and global tech giants.',
    imageUrl: '/images/placements/2.png',
    badge: 'Campus Selections',
    linkUrl: '/placements',
  },
  {
    id: 'student-achievements-vwu',
    title: 'Student Innovations & Engineering Excellence',
    caption: 'National Hackathon Champions & Technical Milestones',
    description: 'Celebrating groundbreaking projects, national championship victories, and technical research developed by VWU student innovators.',
    imageUrl: '/images/placements/3.png',
    badge: 'Student Achievements',
    linkUrl: '/news-awards/gallery',
  },
];

export default function HappeningsPosterSlider() {
  const { docs: dbShowcase } = useOrderedCollection<HappeningsShowcaseDoc>('happeningsShowcase', 'order');

  // If Super Admin added showcase posters in Admin -> News & Awards, use them dynamically!
  const slides: ShowcaseSlide[] = dbShowcase.length > 0 && dbShowcase.some((s) => !!s.imageUrl)
    ? dbShowcase
        .filter((s) => !!s.imageUrl)
        .map((s) => ({
          id: s.id,
          title: s.title,
          caption: s.caption || s.title,
          description: s.description || '',
          imageUrl: s.imageUrl,
          linkUrl: s.linkUrl || undefined,
          badge: s.badge || undefined,
        }))
    : DEFAULT_SHOWCASE_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Auto-slide every 6 seconds unless user is hovering
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, slides.length]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section className="happenings-showcase-section">
      <div className="happenings-showcase-container">
        {/* Breadcrumbs */}
        <nav className="happenings-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="happenings-breadcrumb__sep">/</span>
          <Link to="/news-awards">News & Awards</Link>
          <span className="happenings-breadcrumb__sep">/</span>
          <span className="happenings-breadcrumb__current">Happenings</span>
        </nav>

        {/* Poster Card Showcase */}
        <div
          className="happenings-poster-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Poster Viewport */}
          <div className="happenings-poster-viewport">
            {slides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              const content = (
                <img
                  src={slide.imageUrl}
                  alt={slide.caption || slide.title}
                  className="happenings-poster-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              );

              return (
                <div
                  key={slide.id}
                  className={`happenings-poster-slide ${isActive ? 'happenings-poster-slide--active' : ''}`}
                  aria-hidden={!isActive}
                >
                  {slide.linkUrl ? (
                    <a
                      href={slide.linkUrl}
                      target={slide.linkUrl.startsWith('http') ? '_blank' : '_self'}
                      rel={slide.linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={{ display: 'block', width: '100%', height: '100%' }}
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </div>
              );
            })}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="happenings-poster-nav-btn happenings-poster-nav-btn--prev"
                  aria-label="Previous Poster"
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="happenings-poster-nav-btn happenings-poster-nav-btn--next"
                  aria-label="Next Poster"
                >
                  <ChevronRight size={24} strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>

          {/* Footer: Details, Description, Link & Dot Indicators */}
          <div className="happenings-poster-footer">
            <div className="happenings-poster-info">
              {currentSlide.badge && (
                <span className="happenings-poster-badge">{currentSlide.badge}</span>
              )}
              <h2 className="happenings-poster-title">
                {currentSlide.caption || currentSlide.title}
              </h2>
              {currentSlide.description && (
                <p className="happenings-poster-desc">{currentSlide.description}</p>
              )}
              {currentSlide.linkUrl && (
                <div className="happenings-poster-action">
                  {currentSlide.linkUrl.startsWith('http') ? (
                    <a
                      href={currentSlide.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="happenings-poster-link-btn"
                    >
                      View Details <ArrowRight size={15} />
                    </a>
                  ) : (
                    <Link to={currentSlide.linkUrl} className="happenings-poster-link-btn">
                      View Details <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {slides.length > 1 && (
              <div className="happenings-poster-dots" role="tablist">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`happenings-poster-dot ${idx === currentIndex ? 'happenings-poster-dot--active' : ''}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-selected={idx === currentIndex}
                    role="tab"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
