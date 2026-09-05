import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  BadgeCheck, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContentBlockDoc } from '../../pages/Admin/sections/ContentBlocksAdmin';
import './TestimonialSlider.css';

interface TestimonialSliderProps {
  testimonials: ContentBlockDoc[];
  title?: string;
  autoPlayInterval?: number;
}

const FALLBACK_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
];

export default function TestimonialSlider({
  testimonials,
  title = "Alumni Voices & Stories",
  autoPlayInterval = 6500,
}: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const count = testimonials.length;
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = useCallback(() => {
    if (count === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % count);
    setProgress(0);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + count) % count);
    setProgress(0);
  }, [count]);

  const goToSlide = (idx: number) => {
    if (idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    setProgress(0);
  };

  useEffect(() => {
    if (isPaused || count <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / autoPlayInterval) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, count, autoPlayInterval, nextSlide]);

  useEffect(() => {
    testimonials.forEach((t, i) => {
      const src = (t.slug && t.slug.startsWith('http')) ? t.slug : FALLBACK_AVATARS[i % FALLBACK_AVATARS.length];
      if (src) {
        const preload = new Image();
        preload.src = src;
      }
    });
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  const item = testimonials[current];
  const authorName = item.title || "VWU Alumna";
  const authorRole = item.value || "Engineering Graduate";
  const avatarUrl = (item.slug && item.slug.startsWith('http')) ? item.slug : FALLBACK_AVATARS[current % FALLBACK_AVATARS.length];
  
  const initials = authorName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 25 : -25,
      filter: 'blur(4px)',
    }),
    center: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -25 : 25,
      filter: 'blur(4px)',
      transition: { duration: 0.25, ease: 'easeIn' as const },
    }),
  };

  return (
    <section className="m3-testimonial-section" aria-label="Alumni Testimonials">
      {/* Dynamic Ambient Glows */}
      <div className="m3-testi-glow-left" aria-hidden="true" />
      <div className="m3-testi-glow-right" aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <div className="m3-testi-header">
          <h2 className="m3-testi-title">{title}</h2>
        </div>

        {/* Carousel Stage */}
        <div 
          className="m3-testi-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
          }}
          aria-roledescription="carousel"
        >
          {/* Main Card Surface */}
          <div className="m3-testi-card">
            {/* Progress Bar */}
            <div className="m3-testi-progress-track">
              <div 
                className="m3-testi-progress-bar" 
                style={{ width: `${progress}%` }} 
              />
            </div>

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={item.id || current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="m3-testi-card-inner"
              >
                {/* Left Narrow Photo Column */}
                <div className="m3-testi-portrait-col">
                  <div className="m3-testi-img-frame">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={authorName}
                        className="m3-testi-avatar"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="m3-testi-initials-box">
                        <span>{initials}</span>
                      </div>
                    )}
                    <div className="m3-testi-img-overlay" />

                    {/* Simplified Verified Alumna Badge */}
                    <div className="m3-verified-badge">
                      <BadgeCheck size={13} className="m3-verified-icon" />
                      <span>Verified Alumna</span>
                    </div>
                  </div>
                </div>

                {/* Right Content Column */}
                <div className="m3-testi-content-col">
                  <div className="m3-testi-top-bar">
                    <Quote size={32} className="m3-quote-symbol" />
                  </div>

                  {/* Main Quote (Clamped 3-4 lines) */}
                  <blockquote className="m3-testi-quote-text">
                    "{item.desc}"
                  </blockquote>

                  {/* Prominent Author Name & Subtle Designation */}
                  <div className="m3-testi-author-block">
                    <div className="m3-author-details">
                      <h3 className="m3-author-name">{authorName}</h3>
                      <div className="m3-author-role-row">
                        <span className="m3-author-role">{authorRole}</span>
                        <span className="m3-inst-dot">•</span>
                        <span className="m3-inst-text">Vishnu Women's University</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Compact Navigation & Thumbnail Switcher */}
          <div className="m3-testi-controls-bar">
            <button
              type="button"
              className="m3-testi-nav-arrow"
              onClick={prevSlide}
              aria-label="Previous story"
              title="Previous Story"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Cleaner Thumbnail Switcher */}
            <div className="m3-testi-thumbs-bar" role="tablist">
              {testimonials.map((t, idx) => {
                const thumbImg = (t.slug && t.slug.startsWith('http')) ? t.slug : FALLBACK_AVATARS[idx % FALLBACK_AVATARS.length];
                const isActive = idx === current;
                return (
                  <button
                    key={t.id || idx}
                    type="button"
                    className={`m3-thumb-btn ${isActive ? 'm3-thumb-btn--active' : ''}`}
                    onClick={() => goToSlide(idx)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`View story of ${t.title || `Alumna ${idx + 1}`}`}
                  >
                    <img src={thumbImg} alt="" className="m3-thumb-img" />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="m3-testi-nav-arrow"
              onClick={nextSlide}
              aria-label="Next story"
              title="Next Story"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Footer Sub-Link */}
          <div className="m3-testi-footer-link-wrap">
            <a
              href="https://alumni.srivishnu.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="m3-testi-alumni-link"
            >
              <span>Explore More Alumni Journeys &amp; Giving</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
