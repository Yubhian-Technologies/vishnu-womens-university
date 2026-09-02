import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { ContentBlockDoc } from '../../pages/Admin/sections/ContentBlocksAdmin';
import './TestimonialSlider.css';

interface TestimonialSliderProps {
  testimonials: ContentBlockDoc[];
  subtitle?: string;
  title?: string;
  autoPlayInterval?: number;
}

export default function TestimonialSlider({
  testimonials,
  subtitle = "Alumni Voices",
  title = "What Our Graduates Say",
  autoPlayInterval = 6000,
}: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const count = testimonials.length;

  const nextSlide = useCallback(() => {
    if (count === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  const goToSlide = (idx: number) => {
    if (idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  useEffect(() => {
    if (isPaused || count <= 1) return;
    timerRef.current = setInterval(nextSlide, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, count, autoPlayInterval, nextSlide]);

  // A broken photo URL on one slide shouldn't blank out every slide after
  // it — reset the failure flag each time the visible testimonial changes.
  useEffect(() => {
    setImgFailed(false);
  }, [current]);

  if (!testimonials || testimonials.length === 0) return null;

  const item = testimonials[current];

  // Helper to extract clean name and class
  const authorName = item.title || "VWU Alumna";
  const authorRole = item.value || "Engineering Graduate";
  const avatarUrl = item.slug && item.slug.startsWith('http') ? item.slug : undefined;
  const initials = authorName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Skip the blur/travel motion for prefers-reduced-motion users — same
  // "plain crossfade" fallback the rest of the site already reaches for
  // (see .btn::after's reduced-motion guard in global.css).
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: prefersReducedMotion ? 0 : (dir > 0 ? 16 : -16),
      filter: prefersReducedMotion ? 'none' : 'blur(4px)',
    }),
    center: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: prefersReducedMotion ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: prefersReducedMotion ? 0 : (dir > 0 ? -16 : 16),
      filter: prefersReducedMotion ? 'none' : 'blur(4px)',
      transition: { duration: prefersReducedMotion ? 0.1 : 0.25, ease: 'easeIn' as const },
    }),
  };

  return (
    <section className="testimonial-light-section" aria-label="Testimonials">
      <div className="container">
        {/* Section Header */}
        <div className="testimonial-light-header">
          {subtitle && <span className="section-label">{subtitle}</span>}
          {title && <h2 className="testimonial-light-title">{title}</h2>}
        </div>

        {/* Carousel Wrapper */}
        <div
          className="testimonial-light-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Testimonial Card */}
          <div className="testimonial-light-card">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={item.id || current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="testimonial-light-split"
              >
                {/* Left Side: Padded Photo on a Grey Panel (50%). The
                    initials fallback renders underneath the photo, not
                    instead of it — a slow or dead image URL then never
                    leaves a blank gap: the photo only ever covers the
                    fallback once it has actually decoded, and stays absent
                    (not blank) if it never does. */}
                <div className="testimonial-light-image-panel">
                  <div className="testimonial-light-image-frame">
                    <div className="testimonial-panel-fallback">
                      <span className="testimonial-fallback-initials">{initials}</span>
                    </div>
                    {avatarUrl && !imgFailed && (
                      <img
                        src={avatarUrl}
                        alt={authorName}
                        className="testimonial-panel-img"
                        onError={() => setImgFailed(true)}
                      />
                    )}
                  </div>
                </div>

                {/* Right Side: Quote & Author (50%) */}
                <div className="testimonial-light-content">
                  <FontAwesomeIcon icon={faQuoteRight} className="testimonial-light-quote-icon" aria-hidden="true" />

                  <p className="testimonial-light-quote-text">{item.desc}</p>

                  <p className="testimonial-light-footer">
                    <span className="testimonial-light-author-name">{authorName}</span>
                    {' '}<span className="testimonial-light-author-role">- {authorRole}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Horizontal Navigation: Prev, Dots, Next */}
          <div className="testimonial-light-nav">
            <button
              type="button"
              className="testimonial-nav-btn"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              title="Previous"
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 16 }} />
            </button>

            <div className="testimonial-horizontal-dots" role="tablist">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`testimonial-hdot ${idx === current ? 'active' : ''}`}
                  onClick={() => goToSlide(idx)}
                  role="tab"
                  aria-selected={idx === current}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="testimonial-nav-btn"
              onClick={nextSlide}
              aria-label="Next testimonial"
              title="Next"
            >
              <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
