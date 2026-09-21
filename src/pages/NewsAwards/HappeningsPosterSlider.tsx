import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { HappeningsShowcaseDoc, HappeningDoc } from '../Admin/sections/NewsAwardsDataAdmin';
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

export default function HappeningsPosterSlider() {
  const { docs: dbShowcase, loading: loadingShowcase } = useOrderedCollection<HappeningsShowcaseDoc>('happeningsShowcase', 'order');
  const { docs: dbHappenings, loading: loadingHappenings } = useOrderedCollection<HappeningDoc>('happenings', 'order');

  const isLoading = loadingShowcase || loadingHappenings;

  // Filter strictly ONLY uploaded items with valid non-empty imageUrls
  const showcaseSlides: ShowcaseSlide[] = dbShowcase
    .filter((s) => !!s.imageUrl && typeof s.imageUrl === 'string' && s.imageUrl.trim() !== '')
    .map((s) => ({
      id: s.id,
      title: s.title,
      caption: s.caption || s.title,
      description: s.description || '',
      imageUrl: s.imageUrl,
      linkUrl: s.linkUrl || undefined,
      badge: s.badge || undefined,
    }));

  const happeningSlides: ShowcaseSlide[] = dbHappenings
    .filter((h) => !!h.imageUrl && typeof h.imageUrl === 'string' && h.imageUrl.trim() !== '')
    .map((h) => ({
      id: h.id,
      title: h.title,
      caption: h.title,
      description: h.description || '',
      imageUrl: h.imageUrl!,
      badge: h.type === 'upcoming' ? 'Upcoming Event' : 'Recent Event',
    }));

  // Use admin showcase slides first; fallback to uploaded happenings with images
  const slides: ShowcaseSlide[] = showcaseSlides.length > 0 ? showcaseSlides : happeningSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const touchStartX = useRef<number | null>(null);

  // Filter out any image that failed to load
  const validSlides = slides.filter((s) => !failedImages.has(s.id));

  // Reset index if bounds change
  useEffect(() => {
    if (currentIndex >= validSlides.length && validSlides.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, validSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? validSlides.length - 1 : prev - 1));
  }, [validSlides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === validSlides.length - 1 ? 0 : prev + 1));
  }, [validSlides.length]);

  // Auto-slide every 6 seconds unless user is hovering
  useEffect(() => {
    if (isHovered || validSlides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, validSlides.length]);

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

  const handleImageError = (id: string) => {
    setFailedImages((prev) => new Set(prev).add(id));
  };

  // While fetching from Firestore, show a clean skeleton (NO hardcoded placeholder images)
  if (isLoading) {
    return (
      <section className="happenings-showcase-section">
        <div className="happenings-showcase-container">
          <nav className="happenings-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="happenings-breadcrumb__sep">/</span>
            <Link to="/news-awards">News & Awards</Link>
            <span className="happenings-breadcrumb__sep">/</span>
            <span className="happenings-breadcrumb__current">Happenings</span>
          </nav>
          <div className="happenings-poster-card happenings-poster-skeleton">
            <div className="happenings-poster-viewport">
              <div className="happenings-skeleton-shimmer" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no uploaded posters/events exist in Firestore, do not render dummy slides
  if (validSlides.length === 0) {
    return (
      <div className="happenings-showcase-container" style={{ paddingTop: '1.25rem' }}>
        <nav className="happenings-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="happenings-breadcrumb__sep">/</span>
          <Link to="/news-awards">News & Awards</Link>
          <span className="happenings-breadcrumb__sep">/</span>
          <span className="happenings-breadcrumb__current">Happenings</span>
        </nav>
      </div>
    );
  }

  const currentSlide = validSlides[currentIndex] || validSlides[0];

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
            {validSlides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              const content = (
                <img
                  src={slide.imageUrl}
                  alt={slide.caption || slide.title}
                  className="happenings-poster-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={() => handleImageError(slide.id)}
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
            {validSlides.length > 1 && (
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

            {validSlides.length > 1 && (
              <div className="happenings-poster-dots" role="tablist">
                {validSlides.map((s, idx) => (
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
