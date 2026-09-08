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
  if (people.length === 0) return null;

  const loop = [...people, ...people];

  return (
    <section className="eminent-section" aria-label="Eminent Personalities at VWU">
      <div className="container">
        <h2 className="eminent-title">Eminent Personalities at VWU</h2>
      </div>
      <div className="eminent-marquee">
        <div className="eminent-track">
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
