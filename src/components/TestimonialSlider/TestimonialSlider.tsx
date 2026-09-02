import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContentBlockDoc } from '../../pages/Admin/sections/ContentBlocksAdmin';
import './TestimonialSlider.css';

interface TestimonialSliderProps {
  testimonials: ContentBlockDoc[];
  title?: string;
  autoPlayInterval?: number;
}

export default function TestimonialSlider({
  testimonials,
  title = "Alumni Voices",
  autoPlayInterval = 6000,
}: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Each slide's <img> only starts fetching once it becomes the active
  // slide (AnimatePresence unmounts/remounts it per slide), so every photo
  // was a cold fetch-and-decode the moment its slide appeared — visible as
  // a lag/flash of the fallback before the real photo popped in. Warming
  // the browser's cache for every photo up front means the <img> that
  // mounts later almost always just paints from cache instead of loading
  // cold.
  useEffect(() => {
    testimonials.forEach((t) => {
      if (t.slug && t.slug.startsWith('http')) {
        const preload = new Image();
        preload.src = t.slug;
      }
    });
  }, [testimonials]);

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

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 16 : -16,
      filter: 'blur(4px)',
    }),
    center: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -16 : 16,
      filter: 'blur(4px)',
      transition: { duration: 0.25, ease: 'easeIn' as const },
    }),
  };

  return (
    <section className="testimonial-modern-section" aria-label="Testimonials">
      <div className="testimonial-modern-glow" aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <div className="testimonial-modern-header">
          {title && <h2 className="testimonial-modern-title">{title}</h2>}
        </div>

        {/* Carousel Wrapper */}
        <div
          className="testimonial-modern-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Testimonial Card */}
          <div className="testimonial-modern-card">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={item.id || current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="testimonial-card-split"
              >
                {/* Left Side: Full-Height Image Panel */}
                <div className="testimonial-image-panel">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={authorName}
                      className="testimonial-panel-img"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="testimonial-panel-fallback">
                      <span className="testimonial-fallback-initials">{initials}</span>
                      <span className="testimonial-fallback-badge">Alumna</span>
                    </div>
                  )}
                  <div className="testimonial-image-overlay" />
                </div>

                {/* Right Side: Content Details */}
                <div className="testimonial-content-panel">
                  {/* Author Header */}
                  <div className="testimonial-author-row">
                    <div className="testimonial-author-meta">
                      <h4 className="testimonial-author-name">{authorName}</h4>
                      <p className="testimonial-author-role">{authorRole}</p>
                    </div>
                  </div>

                  {/* Divider Line */}
                  <div className="testimonial-card-divider" />

                  {/* Quote Content */}
                  <p className="testimonial-card-quote">
                    "{item.desc}"
                  </p>

                  {/* Bottom Footer Tag */}
                  <div className="testimonial-card-footer">
                    <span className="testimonial-verified-text">
                      Vishnu Women's University
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side Controls (Prev, Vertical Dots, Next) */}
          <div className="testimonial-side-controls">
            <button
              type="button"
              className="testimonial-nav-btn"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              title="Previous"
            >
              <FontAwesomeIcon icon={faChevronUp} style={{ fontSize: 18 }} />
            </button>

            <div className="testimonial-vertical-dots" role="tablist">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`testimonial-vdot ${idx === current ? 'active' : ''}`}
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
              <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
