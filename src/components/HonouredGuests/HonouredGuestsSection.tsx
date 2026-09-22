import { useState } from 'react';
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
 * Home page section — photo, name, and role for eminent personalities
 * VWU has hosted. Admin-managed via /admin → Home — Eminent Personalities.
 * Uses continuous marquee carousel scroll with seamless looping.
 */
export default function HonouredGuestsSection() {
  const { docs: people } = useOrderedCollection<HonouredGuestItem>('honouredGuests', 'order');
  const [isPaused, setIsPaused] = useState(false);

  if (people.length === 0) return null;

  // Duplicate items enough times to guarantee a seamless continuous loop
  const repeatedSet = people.length < 5
    ? [...people, ...people, ...people]
    : people;
  const loop = [...repeatedSet, ...repeatedSet];

  // Adjust duration based on count so velocity remains consistent and comfortable
  const duration = Math.max(30, repeatedSet.length * 6);

  return (
    <section
      className="eminent-section"
      aria-label="Eminent Personalities at VWU"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
    >
      <div className="container">
        <h2 className="eminent-title">Eminent Personalities at VWU</h2>
      </div>
      <div className="eminent-marquee">
        <div
          className={`eminent-track ${isPaused ? 'is-paused' : ''}`}
          style={{ '--eminent-duration': `${duration}s` } as React.CSSProperties}
          role="region"
          aria-label="Eminent personalities marquee"
        >
          {loop.map((p, i) => (
            <figure key={`${p.id}-${i}`} className="eminent-card" aria-hidden={i >= repeatedSet.length}>
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
