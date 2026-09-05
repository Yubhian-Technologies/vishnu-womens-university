import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageBanners, type BannerSlide } from '../../hooks/usePageBanners';
import SmoothImage from '../SmoothImage/SmoothImage';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import './PageHero.css';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeroProps {
  page: string;
  /** Optional — when omitted, the hero shows just its solid brand-colour
      background (no stock photo) until an admin uploads a real banner for
      this page via Hero Banners in /admin. */
  defaultImage?: string;
  defaultTitle: string;
  defaultSubtitle?: string;
  breadcrumb: BreadcrumbItem[];
  size?: 'large' | 'medium' | 'small';
  /** When set, the CTA button scrolls to this element id instead of following ctaLink. */
  scrollCtaTargetId?: string;
}

const INTERVAL = 5000;

export default function PageHero({
  page,
  defaultImage,
  defaultTitle,
  defaultSubtitle,
  breadcrumb,
  size = 'medium',
  scrollCtaTargetId,
}: PageHeroProps) {
  const { slides, loading } = usePageBanners(page);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  // Only the slides a visitor has actually reached get an <img> in the DOM —
  // otherwise every banner for a page (most have 2-4) downloads its full-size
  // image on load even though just one is ever shown at a time.
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Image: shows the given default (if any) immediately, then swaps to a
  // real uploaded banner once Firestore responds. With no defaultImage, the
  // hero just shows its solid background until a banner exists.
  // Text: only render once Firestore has responded — prevents flashing the
  //       hardcoded title before the uploaded title appears.
  const defaultSlide = { imageUrl: defaultImage ?? '', videoUrl: '', title: defaultTitle, subtitle: defaultSubtitle ?? '', ctaLabel: '', ctaLink: '' };
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
  useEffect(() => { setCurrent(0); setVisited(new Set([0])); }, [slides.length]);

  useEffect(() => {
    setVisited((prev) => (prev.has(current) ? prev : new Set(prev).add(current)));
  }, [current]);

  // Hints the browser to start fetching the hero image before React has even
  // committed the <img> to the DOM — defaultImage is known synchronously (a
  // prop, not something waiting on Firestore), so there's no reason to wait
  // for render to request it. Re-added per route change, removed on
  // unmount/re-run so navigating away doesn't leave a stale preload behind.
  useEffect(() => {
    if (!defaultImage) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = defaultImage;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [defaultImage]);

  const slide = allSlides[current];

  return (
    <section className={`page-hero page-hero--${size}`}>
      <div className="container">
        <div
          className="page-hero-card"
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
        >
          {/* Slides */}
          {allSlides.map((s, i) => (
            <div
              key={s.imageUrl}
              className={`page-hero__slide ${i === current ? 'page-hero__slide--active' : ''}`}
            >
              {visited.has(i) && s.imageUrl && (
                <SmoothImage
                  src={s.imageUrl}
                  alt={s.title}
                  className="page-hero-image"
                  loading="eager"
                  decoding={i === current ? 'sync' : 'async'}
                  {...fetchPriorityAttr(i === current ? 'high' : 'low')}
                />
              )}
            </div>
          ))}

          <div className="page-hero-overlay" />

          {/* Content */}
          <div className="page-hero-content">
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
                    {scrollCtaTargetId ? (
                      <button
                        type="button"
                        className="btn-hero-gold"
                        onClick={() => smoothScrollTo(`#${scrollCtaTargetId}`)}
                      >
                        {slide.ctaLabel}
                      </button>
                    ) : slide.ctaLink.startsWith('http') ? (
                      <a href={slide.ctaLink} target="_blank" rel="noopener noreferrer" className="btn-hero-gold">
                        {slide.ctaLabel}
                      </a>
                    ) : (
                      <Link to={slide.ctaLink} className="btn-hero-gold">
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
        </div>
      </div>
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
