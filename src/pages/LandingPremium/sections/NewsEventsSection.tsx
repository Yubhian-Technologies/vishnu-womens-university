import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import NewsCard from '../../../components/NewsCard/NewsCard';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { newsDocToArticle, type NewsDoc } from '../../../lib/news';
import type { EventDoc } from '../../Admin/sections/EventsAdmin';

// Live news/events, same Firestore collections and hooks Home.tsx already
// reads — this section is genuinely dynamic (not part of LPU's structure,
// but a natural, real-content extension of its "Spotlight" band).
export default function NewsEventsSection() {
  const { docs: newsItems } = useOrderedCollection<NewsDoc>('news', 'date', 'desc');
  const featuredNews = newsItems.filter((n) => n.featured).slice(0, 3);
  const { docs: allEvents } = useOrderedCollection<EventDoc>('events', 'order');
  const featuredEvents = allEvents.filter((e) => e.featured).slice(0, 2);

  if (featuredNews.length === 0 && featuredEvents.length === 0) return null;

  return (
    <section className="lph-news section">
      <div className="container">
        <p className="lph-eyebrow-label">Happenings</p>
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>Latest at VWU</h2>
        <div className="lph-news__grid">
          {featuredNews.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
              <NewsCard article={newsDocToArticle(item)} />
            </motion.div>
          ))}
          {featuredEvents.map((event) => (
            <motion.div key={event.id} className="lph-news__event" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}>
              <div className="lph-news__event-date"><span>{event.month}</span><strong>{event.day}</strong></div>
              <div>
                <h4>{event.title}</h4>
                <p><Clock size={14} /> {event.time} &nbsp; <MapPin size={14} /> {event.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
