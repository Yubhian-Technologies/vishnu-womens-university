import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageBanners, type BannerSlide } from '../../hooks/usePageBanners';
import './PageHero.css';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeroProps {
  page: string;
  defaultImage: string;
  defaultTitle: string;
  defaultSubtitle?: string;
  breadcrumb: BreadcrumbItem[];
  size?: 'large' | 'medium' | 'small';
}

const INTERVAL = 5000;

export default function PageHero({
  page,
  defaultImage,
  defaultTitle,
  defaultSubtitle,
  breadcrumb,
  size = 'medium',
}: PageHeroProps) {
  const { slides, loading } = usePageBanners(page);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Image: always show something immediately (default image while loading).
  // Text: only render once Firestore has responded — prevents flashing the
  //       hardcoded title before the uploaded title appears.
  const defaultSlide = { imageUrl: defaultImage, title: defaultTitle, subtitle: defaultSubtitle ?? '', ctaLabel: '', ctaLink: '' };
  const allSlides: Omit<BannerSlide, 'id' | 'order'>[] =
    slides.length > 0 ? slides : [defaultSlide];
  const showText = !loading;

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  };

  const next = () => goTo((current + 1) % allSlides.length);
  const prev = () => goTo((current - 1 + allSlides.length) % allSlides.length);

  const startTimer = () => {
    if (allSlides.length <= 1) return;
    timerRef.current = setInterval(next, INTERVAL);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startTimer();
    return stopTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSlides.length, current]);

  // Reset to slide 0 when slides change (e.g. Firestore update)
  useEffect(() => { setCurrent(0); }, [slides.length]);

  const slide = allSlides[current];

  return (
    <section
      className={`page-hero page-hero--${size}`}
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      {/* Slides */}
      {allSlides.map((s, i) => (
        <div
          key={i}
          className={`page-hero__slide ${i === current ? 'page-hero__slide--active' : ''}`}
        >
          <img src={s.imageUrl} alt={s.title} className="page-hero-image" />
        </div>
      ))}

      <div className="page-hero-overlay" />

      {/* Content */}
      <div className="container page-hero-content">
        <div className="breadcrumb animate-fade-in">
          <Breadcrumbs items={breadcrumb} />
        </div>

        {showText && (
          <>
            <h1 key={`title-${current}`} className="page-hero__title animate-fade-in-up">
              {slide.title}
            </h1>

            {slide.subtitle && (
              <p key={`sub-${current}`} className="page-hero__subtitle animate-fade-in-up">
                {slide.subtitle}
              </p>
            )}

            {slide.ctaLabel && slide.ctaLink && (
              <div key={`cta-${current}`} className="page-hero__cta animate-fade-in-up">
                {slide.ctaLink.startsWith('http') ? (
                  <a href={slide.ctaLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    {slide.ctaLabel}
                  </a>
                ) : (
                  <Link to={slide.ctaLink} className="btn btn-primary">
                    {slide.ctaLabel}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation — only shown if multiple slides */}
      {allSlides.length > 1 && (
        <>
          <button className="page-hero__arrow page-hero__arrow--prev" onClick={prev} aria-label="Previous slide">
            ‹
          </button>
          <button className="page-hero__arrow page-hero__arrow--next" onClick={next} aria-label="Next slide">
            ›
          </button>
          <div className="page-hero__dots">
            {allSlides.map((_, i) => (
              <button
                key={i}
                className={`page-hero__dot${i === current ? ' page-hero__dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="page-hero__counter">
            {current + 1} / {allSlides.length}
          </div>
        </>
      )}
    </section>
  );
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {item.to ? (
            <Link to={item.to} className="breadcrumb-item">{item.label}</Link>
          ) : (
            <span className={`breadcrumb-item${i === items.length - 1 ? ' active' : ''}`}>
              {item.label}
            </span>
          )}
          {i < items.length - 1 && <span className="breadcrumb-sep">›</span>}
        </span>
      ))}
    </>
  );
}
