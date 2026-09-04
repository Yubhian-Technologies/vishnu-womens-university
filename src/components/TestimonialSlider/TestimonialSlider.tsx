import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BadgeCheck, 
  Building2, 
  GraduationCap, 
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

  // Smooth animated linear progress bar timer
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

  // Preload avatar images
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

  // Highlight company/outcome if present (e.g. Google, Amazon, IIT Hyderabad)
  const roleParts = authorRole.split(/—|-|\|/);
  const deptPart = roleParts[0]?.trim() || "Engineering";
  const outcomePart = roleParts[1]?.trim() || "Alumna";

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 30 : -30,
      filter: 'blur(6px)',
    }),
    center: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -30 : 30,
      filter: 'blur(6px)',
      transition: { duration: 0.3, ease: 'easeIn' as const },
    }),
  };

  return (
    <section className="m3-testimonial-section" aria-label="Alumni Testimonials">
      {/* Dynamic Ambient Glows */}
      <div className="m3-testi-glow-left" aria-hidden="true" />
      <div className="m3-testi-glow-right" aria-hidden="true" />

      <div className="container">
        {/* Section Header with Google M3 Pill */}
        <div className="m3-testi-header">
          <div className="m3-testi-eyebrow">
            <Sparkles size={14} className="m3-testi-sparkle" />
            <span>Transformations &amp; Real Outcomes</span>
          </div>
          <h2 className="m3-testi-title">{title}</h2>
          <p className="m3-testi-subtitle">
            From premier campus placements to trailblazing startups and global academic research—hear how VWU shapes empowered women leaders.
          </p>
        </div>

        {/* Carousel Outer Stage */}
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
            {/* Auto-play Linear Progress Bar */}
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
                {/* Left Visual Avatar Showcase */}
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

                    {/* Verified Alumna Badge */}
                    <div className="m3-verified-badge">
                      <BadgeCheck size={16} className="m3-verified-icon" />
                      <span>Verified Alumna</span>
                    </div>
                  </div>

                  {/* Quick Highlight Metric */}
                  <div className="m3-testi-outcome-pill">
                    <Building2 size={13} />
                    <span>{outcomePart}</span>
                  </div>
                </div>

                {/* Right Content Column */}
                <div className="m3-testi-content-col">
                  <div className="m3-testi-top-bar">
                    <Quote size={42} className="m3-quote-symbol" />
                  </div>

                  {/* Main Quote */}
                  <blockquote className="m3-testi-quote-text">
                    "{item.desc}"
                  </blockquote>

                  {/* Author Meta Details */}
                  <div className="m3-testi-author-block">
                    <div className="m3-author-details">
                      <h3 className="m3-author-name">{authorName}</h3>
                      <div className="m3-author-role-row">
                        <span className="m3-dept-badge">
                          <GraduationCap size={13} />
                          <span>{deptPart}</span>
                        </span>
                        <span className="m3-inst-text">Vishnu Women's University</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Navigation & Controls Bar */}
          <div className="m3-testi-controls-bar">
            {/* Prev Button */}
            <button
              type="button"
              className="m3-testi-nav-arrow"
              onClick={prevSlide}
              aria-label="Previous story"
              title="Previous Story"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Thumbnail / Avatar Switcher Dots */}
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
                    {isActive && <div className="m3-thumb-active-ring" />}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              className="m3-testi-nav-arrow"
              onClick={nextSlide}
              aria-label="Next story"
              title="Next Story"
            >
              <ChevronRight size={20} />
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
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
