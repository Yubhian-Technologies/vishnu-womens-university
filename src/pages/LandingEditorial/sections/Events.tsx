import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { useOrderedCollection } from '../../../hooks/useCollection';
import Reveal from '../Reveal';

interface EventDoc {
  id: string;
  title: string;
  month: string;
  day: string;
  year: string;
  time: string;
  location: string;
  category: string;
  desc: string;
  link: string;
}

export default function Events() {
  const { docs } = useOrderedCollection<EventDoc>('events', 'order');
  const upcoming = docs.slice(0, 4);

  if (upcoming.length === 0) return null;

  return (
    <section className="lpe-section lpe-section--paper" id="events" aria-label="Upcoming events">
      <div className="lpe-container">
        <div className="lpe-section-head">
          <Reveal index={0}>
            <span className="lpe-eyebrow">Upcoming at VWU</span>
            <h2 className="lpe-h2">Mark your<br /><span className="lpe-italic">calendar.</span></h2>
          </Reveal>
          <Reveal index={1}>
            <Link to="/events" className="lpe-btn lpe-btn--outline-dark">All Events</Link>
          </Reveal>
        </div>

        <div className="lpe-events-list">
          {upcoming.map((e, i) => (
            <Reveal key={e.id} index={i} className="lpe-event-row">
              <div className="lpe-event-row__date">
                <span className="lpe-event-row__day">{e.day}</span>
                <span className="lpe-event-row__month">{e.month}</span>
              </div>
              <div className="lpe-event-row__body">
                <span className="lpe-card__meta">{e.category}</span>
                <h3 className="lpe-h3">{e.title}</h3>
                <div className="lpe-event-row__meta">
                  {e.time && <span><Clock size={14} /> {e.time}</span>}
                  {e.location && <span><MapPin size={14} /> {e.location}</span>}
                </div>
              </div>
              {e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="lpe-btn lpe-btn--text">Details →</a>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
