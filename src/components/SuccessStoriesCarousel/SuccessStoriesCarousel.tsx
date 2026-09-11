import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SmoothImage from '../SmoothImage/SmoothImage';
import './SuccessStoriesCarousel.css';

export interface SuccessStoryCardData {
  id: string;
  name: string;
  programme?: string;
  description?: string;
  photoUrl?: string;
}

interface Props {
  stories: SuccessStoryCardData[];
  title?: string;
  subtitle?: string;
  /** ms between auto-advances; skipped entirely under prefers-reduced-motion. */
  autoScrollInterval?: number;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * A horizontally-scrolling, multi-card-peek carousel for student success
 * stories. Each story renders exactly once — no triplicated buffer — so a
 * small curated list (the common case, since these are admin-entered one at
 * a time) never shows the same card repeated across the row. Auto-advance
 * scrolls forward one card at a time and jumps back to the start once it
 * reaches the end, rather than looping seamlessly. Renders nothing when
 * there are no stories — no placeholder/mock content, matching every other
 * data-gated section on this site.
 */
export default function SuccessStoriesCarousel({
  stories,
  title = 'Success Stories',
  subtitle = 'Where our students are heading.',
  autoScrollInterval = 4000,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Rough scroll-progress readout for the thin indicator bar below.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || stories.length <= 1) return;
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const max = Math.max(1, scrollWidth - clientWidth);
      setProgress(Math.min(100, (scrollLeft / max) * 100));
    };
    handleScroll();
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [stories]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const getCardStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 300;
    const first = el.querySelector('.success-story-card-wrap') as HTMLElement | null;
    return first ? first.offsetWidth + 24 : el.clientWidth / 3;
  }, []);

  // Slow, subtle auto-advance — off entirely under prefers-reduced-motion,
  // and paused on hover/touch/hidden-tab per the same pattern as
  // FacultyCarousel/dept-lab-carousel elsewhere on this site. Jumps back to
  // the start once scrolled to the end instead of looping seamlessly (no
  // triplicated buffer to loop through — see component doc comment above).
  useEffect(() => {
    if (reducedMotion || stories.length <= 1) return;
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (isPaused || tabHidden || !el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 10;
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: getCardStep(), behavior: 'smooth' });
    }, autoScrollInterval);
    return () => clearInterval(timer);
  }, [stories.length, isPaused, tabHidden, reducedMotion, autoScrollInterval, getCardStep]);

  const pauseTemporarily = () => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 6000);
  };

  const scrollByCards = (direction: 1 | -1) => {
    if (!scrollRef.current) return;
    pauseTemporarily();
    scrollRef.current.scrollBy({ left: direction * getCardStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  if (!stories || stories.length === 0) return null;

  return (
    <section
      className="success-stories-section"
      aria-label={title}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => pauseTemporarily()}
    >
      <div className="container">
        <div className="success-stories-header">
          <div>
            <h2 className="success-stories-title">{title}</h2>
            {subtitle && <p className="success-stories-subtitle">{subtitle}</p>}
          </div>

          {stories.length > 1 && (
            <div className="success-stories-arrows" role="group" aria-label={`${title} navigation`}>
              <button
                type="button"
                className="success-stories-arrow-btn"
                onClick={() => scrollByCards(-1)}
                aria-label="Previous success stories"
              >
                <ArrowLeft size={18} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                className="success-stories-arrow-btn"
                onClick={() => scrollByCards(1)}
                aria-label="Next success stories"
              >
                <ArrowRight size={18} strokeWidth={2.4} />
              </button>
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          className="success-stories-track"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${title} carousel`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCards(1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCards(-1); }
          }}
        >
          {stories.map((s) => (
            <div className="success-story-card-wrap" key={s.id}>
              <article className="success-story-card">
                <div className="success-story-photo-frame">
                  {s.photoUrl ? (
                    <SmoothImage src={s.photoUrl} alt={s.name} className="success-story-photo" loading="lazy" />
                  ) : (
                    <div className="success-story-photo-fallback" aria-hidden="true">
                      <span>{getInitials(s.name)}</span>
                    </div>
                  )}
                </div>
                <div className="success-story-body">
                  {s.description && <p className="success-story-desc">{s.description}</p>}
                  <p className="success-story-name">{s.name}</p>
                  {s.programme && <p className="success-story-programme">{s.programme}</p>}
                </div>
              </article>
            </div>
          ))}
        </div>

        {stories.length > 1 && (
          <div className="success-stories-progress" aria-hidden="true">
            <div className="success-stories-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </section>
  );
}
