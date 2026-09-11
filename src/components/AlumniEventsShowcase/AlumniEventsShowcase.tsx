import { useOrderedCollection } from '../../hooks/useCollection';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import SmoothImage from '../SmoothImage/SmoothImage';
import type { AlumniEvent } from '../../pages/Admin/sections/AlumniEventsAdmin';
import './AlumniEventsShowcase.css';

// Each card gets its own IntersectionObserver instance via useScrollReveal
// (one per mounted card, not a single page-level observer set up once at
// mount) — safe with Firestore-derived content per the gotcha in CLAUDE.md,
// since a card's own effect runs whenever THAT card actually mounts,
// regardless of when the `alumniEvents` snapshot delivers.
function AlumniEventCard({ event, index }: { event: AlumniEvent; index: number }) {
  const ref = useScrollReveal();
  return (
    <article
      ref={ref}
      className="alumni-event-card reveal"
      style={{ transitionDelay: `${Math.min(index, 6) * 90}ms` }}
    >
      <div className="alumni-event-card-photo">
        {event.photoUrl ? (
          <SmoothImage src={event.photoUrl} alt={event.title} loading="lazy" decoding="async" />
        ) : (
          <div className="alumni-event-card-photo-fallback" aria-hidden="true" />
        )}
      </div>
      <div className="alumni-event-card-body">
        {event.date && <span className="alumni-event-card-date">{event.date}</span>}
        <h3 className="alumni-event-card-title">{event.title}</h3>
        {event.desc && <p className="alumni-event-card-desc">{event.desc}</p>}
      </div>
    </article>
  );
}

/**
 * Home page section — reunions, meetups, and other alumni events. Reads the
 * `alumniEvents` Firestore collection (Admin → Alumni & Giving → Events) —
 * the same collection that section already wrote to, just without a public
 * page reading it until now. Renders nothing until an admin adds a real
 * event, same fallback pattern as every other Firestore-backed section on
 * this page.
 */
export default function AlumniEventsShowcase() {
  const { docs: events } = useOrderedCollection<AlumniEvent>('alumniEvents', 'order');
  if (events.length === 0) return null;

  return (
    <section className="alumni-events-section" aria-label="Alumni Events">
      <div className="container">
        <div className="alumni-events-header reveal">
          <p className="section-eyebrow">Stay Connected</p>
          <h2 className="section-title gradient-text">Alumni Events</h2>
          <p className="section-desc">Reunions, meetups, and moments that keep the VWU alumni community connected.</p>
        </div>
      </div>
      <div className="alumni-events-track-wrap">
        <div className="container">
          <div className="alumni-events-track">
            {events.map((e, i) => (
              <AlumniEventCard key={e.id} event={e} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
