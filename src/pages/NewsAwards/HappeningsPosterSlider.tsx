import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePageBanners } from '../../hooks/usePageBanners';
import './HappeningsPosterSlider.css';

interface PosterSlide {
  id: string;
  imageUrl: string;
  caption: string;
  linkUrl?: string;
}

const DEFAULT_POSTER_SLIDES: PosterSlide[] = [
  {
    id: 'amazon-selects-2026',
    imageUrl: '/images/placements/1.png',
    caption: 'Amazon 2026 Selects — 16 Students Placed with ₹46.38 Lakhs per annum',
  },
  {
    id: 'campus-placements-2026',
    imageUrl: '/images/placements/2.png',
    caption: 'Campus Placements 2026 — Elite Career Milestones at Premier Tech Leaders',
  },
  {
    id: 'student-achievements-vwu',
    imageUrl: '/images/placements/3.png',
    caption: 'Student Achievements & Innovations — Engineering Excellence at VWU',
  },
];

export default function HappeningsPosterSlider() {
  const { slides: firestoreSlides } = usePageBanners('news-awards-happenings');

  // Convert Firestore slides if any exist with images
  const slides: PosterSlide[] = firestoreSlides.length > 0 && firestoreSlides.some(s => s.imageUrl)
    ? firestoreSlides
        .filter(s => !!s.imageUrl)
        .map(s => ({
          id: s.id,
          imageUrl: s.imageUrl,
          caption: s.title || s.subtitle || 'VWU Happenings & Achievements',
          linkUrl: s.ctaLink || undefined,
        }))
    : DEFAULT_POSTER_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Auto-slide every 5.5 seconds unless user is hovering
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5500);
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
                  alt={slide.caption}
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

          {/* Footer: Caption & Dot Indicators */}
          <div className="happenings-poster-footer">
            <p className="happenings-poster-caption">
              {currentSlide.caption}
            </p>

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
