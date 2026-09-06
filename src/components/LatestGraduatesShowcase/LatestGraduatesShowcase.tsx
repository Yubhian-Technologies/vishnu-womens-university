import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Building2, IndianRupee, ArrowRight } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { PlacementHighlightDoc } from '../../pages/Admin/sections/PlacementHighlightsAdmin';
import './LatestGraduatesShowcase.css';

const AUTOPLAY_INTERVAL = 4500;

export default function LatestGraduatesShowcase() {
  const { docs: graduates } = useOrderedCollection<PlacementHighlightDoc>('placementHighlights', 'order');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = graduates.length;

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

  // Reset to slide 0 whenever the source data changes — a stale index from
  // a previous, longer list could otherwise point past the end.
  useEffect(() => { setCurrent(0); setProgress(0); }, [count]);

  // Preload every slide's photo/logo up front so a rotation never briefly
  // shows a blank frame (same fix as TestimonialSlider/WomensEducationSection).
  useEffect(() => {
    graduates.forEach((g) => {
      if (g.photoUrl) { const img = new Image(); img.src = g.photoUrl; }
      if (g.logoUrl) { const img = new Image(); img.src = g.logoUrl; }
    });
  }, [graduates]);

  useEffect(() => {
    if (isPaused || count <= 1) {
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }
    const stepMs = 50;
    const increment = (stepMs / AUTOPLAY_INTERVAL) * 100;
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [isPaused, count, nextSlide]);

  // Nothing to show yet — no fabricated placeholder stories, section simply
  // doesn't render until an admin adds at least one graduate.
  if (count === 0) return null;

  const grad = graduates[current];

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, scale: 0.97, transition: { duration: 0.3, ease: 'easeIn' as const } }),
  };

  return (
    <section className="grad-showcase-section" aria-label="Latest Graduate Placement Stories">
      <div className="grad-showcase-glow" aria-hidden="true" />

      <div className="container">
        <div className="grad-showcase-header">
          <div className="grad-showcase-eyebrow">
            <Sparkles size={14} />
            <span>Placement Success</span>
          </div>
          <h2 className="grad-showcase-title">Our Latest Graduates Conquering the World</h2>
          <p className="grad-showcase-subtitle">
            Real offers, real companies — meet the VWU engineers turning their degrees into global careers.
          </p>
        </div>

        <div
          className="grad-showcase-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
          }}
        >
          <button
            type="button"
            className="grad-nav-arrow grad-nav-arrow--prev"
            onClick={prevSlide}
            aria-label="Previous graduate"
            disabled={count <= 1}
          >
            <ChevronLeft size={22} />
          </button>

          <div className="grad-card-frame">
            <div className="grad-progress-track">
              <div className="grad-progress-bar" style={{ width: `${progress}%` }} />
            </div>

            <AnimatePresence custom={direction} mode="wait">
              <motion.article
                key={grad.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grad-card"
              >
                <div className="grad-card-media">
                  <img src={grad.photoUrl} alt={grad.name} className="grad-card-photo" loading="lazy" />
                  <div className="grad-card-media-scrim" />
                  <span className="grad-card-tag">
                    <Sparkles size={12} />
                    VWU Graduate
                  </span>
                </div>

                <div className="grad-card-body">
                  <div className="grad-card-logo-badge">
                    {grad.logoUrl ? (
                      <img src={grad.logoUrl} alt={grad.companyName || 'Recruiter'} className="grad-card-logo-img" loading="lazy" />
                    ) : (
                      <Building2 size={22} />
                    )}
                  </div>

                  <div className="grad-card-text">
                    <h3 className="grad-card-name">{grad.name}</h3>
                    {grad.companyName && <p className="grad-card-company">Placed at {grad.companyName}</p>}
                  </div>

                  <div className="grad-card-package-pill">
                    <IndianRupee size={14} />
                    <span>{grad.package}</span>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="grad-nav-arrow grad-nav-arrow--next"
            onClick={nextSlide}
            aria-label="Next graduate"
            disabled={count <= 1}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {count > 1 && (
          <div className="grad-showcase-dots" role="tablist">
            {graduates.map((g, idx) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={idx === current}
                aria-label={`View ${g.name}'s story`}
                className={`grad-dot${idx === current ? ' grad-dot--active' : ''}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        )}

        <div className="grad-showcase-cta">
          <Link to="/placements" className="grad-showcase-cta-link">
            <span>Explore All Placement Stories</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
