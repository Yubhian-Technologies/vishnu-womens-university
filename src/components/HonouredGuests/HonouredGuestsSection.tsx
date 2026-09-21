import { useEffect, useMemo, useRef, useState } from 'react';
import { useOrderedCollection } from '../../hooks/useCollection';
import SmoothImage from '../SmoothImage/SmoothImage';
import type { WithId } from '../../hooks/useCollection';
import './HonouredGuestsSection.css';

export interface HonouredGuestDoc {
  name: string;
  role: string;
  imageUrl: string;
  storagePath?: string;
  order: number;
}

type HonouredGuestItem = WithId & HonouredGuestDoc;

/**
 * Home page-only section — photo, name, and role for eminent personalities
 * VWU has hosted. Admin-managed via /admin → Home — Eminent Personalities;
 * renders nothing until at least one entry has been added, same fallback
 * pattern as every other Firestore-backed section on this page (see
 * CLAUDE.md's content model notes).
 *
 * ponytail: Firestore collection is still `honouredGuests` (its original
 * name) — kept as-is so existing entries and the admin section don't need
 * a data migration. Only the visible labels + layout changed.
 *
 * Marquee is pure CSS (duplicated list + translateX(-50%)), the same
 * approach as Home's `.activity-track` — no IntersectionObserver, so the
 * Firestore-vs-`.reveal` gotcha doesn't apply here.
 */
export default function HonouredGuestsSection() {
  const { docs: people } = useOrderedCollection<HonouredGuestItem>('honouredGuests', 'order');
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // One-by-one auto-scroll: advance exactly one card, then pause
  useEffect(() => {
    if (reducedMotion || people.length <= 1) return;
    const el = trackRef.current;
    if (!el) return;

    const timer = setInterval(() => {
      if (isPaused || !trackRef.current) return;
      const track = trackRef.current;
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 8;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getCardStep(), behavior: 'smooth' });
      }
    }, 1400);

    return () => clearInterval(timer);
  }, [people.length, isPaused, reducedMotion]);

  if (people.length === 0) return null;

  const loop = [...people, ...people];

  const getCardStep = () => {
    const el = trackRef.current;
    if (!el) return 320;
    const card = el.querySelector('.eminent-card') as HTMLElement | null;
    if (card) {
      const style = getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || '12') || 12;
      return card.offsetWidth + gap;
    }
    return 320;
  };

  return (
    <section
      className="eminent-section eminent-section--onebyone"
      aria-label="Eminent Personalities at VWU"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 4000)}
    >
      <div className="container">
        <h2 className="eminent-title">Eminent Personalities at VWU</h2>
      </div>
      <div className="eminent-marquee">
        <div
          ref={trackRef}
          className="eminent-track"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Eminent personalities carousel"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              trackRef.current?.scrollBy({ left: getCardStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              trackRef.current?.scrollBy({ left: -getCardStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
            }
          }}
        >
          {loop.map((p, i) => (
            <figure key={`${p.id}-${i}`} className="eminent-card" aria-hidden={i >= people.length}>
              <div className="eminent-photo-wrap">
                <SmoothImage
                  src={p.imageUrl}
                  alt={p.name}
                  className="eminent-photo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="eminent-name">{p.name}</span>
                {p.role && <span className="eminent-role">{p.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
