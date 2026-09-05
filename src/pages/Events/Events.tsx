import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarX2, Clock, MapPin } from 'lucide-react';
import './Events.css';
import PageHero from '../../components/PageHero/PageHero';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { EventDoc } from '../Admin/sections/EventsAdmin';
import SEO from '../../components/SEO/SEO';
import { getEventSchema, getBreadcrumbSchema } from '../../lib/seo/schemas';

const categoryColors: Record<string, string> = {
  'Special Events': '#C9A84C',
  'Academic Events': '#0b1e42',
  'Placements': '#162f5d',
  'Admissions': '#1e3a8a',
  'Alumni Events': '#07142c',
  'Sports': '#0b1e42',
};

export default function Events() {
  const { docs: events } = useOrderedCollection<EventDoc>('events', 'order');
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const categories = ['All', ...Array.from(new Set(events.map(e => e.category)))];

  useHashScroll();

  useEffect(() => {
    document.title = "Events | Vishnu Women's University";
    // Only the static section headers use .reveal here — the event cards
    // themselves render from Firestore data and don't use the scroll-reveal
    // animation (see the gotcha documented in CLAUDE.md).
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory);

  const featured = events.filter(e => e.featured);

  const eventsJsonLd = [
    getBreadcrumbSchema([{ name: 'Events', url: '/events' }]),
    ...featured.map(e => getEventSchema({
      name: e.title,
      description: e.desc,
      startDate: `${e.year}-${e.month}-${e.day}`,
      location: e.location,
      url: '/events',
    }))
  ];

  return (
    <main className="page-wrapper">
      <SEO
        title="Campus Events & Academic Calendar | Vishnu Women's University"
        description="Explore upcoming technical symposia, sports tournaments, graduation ceremonies, workshops, and cultural events at Vishnu Women's University, Bhimavaram."
        canonicalPath="/events"
        jsonLd={eventsJsonLd}
      />
      {/* Hero */}
      <PageHero
        page="events"
        defaultTitle="Campus Events"
  defaultSubtitle="Technical symposia, sports tournaments, graduation ceremonies, and much more — the VWU calendar is always full."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Events' }]}
        scrollCtaTargetId="events-content"
      />

      {/* Featured Events */}
      <section id="events-content" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Don't Miss</span>
            <h2 className="section-title">Featured Events</h2>
          </div>
          <div className="ev-featured-grid">
            {featured.map((event) => (
              <div key={event.id} className="ev-featured-card">
                <div className="ev-featured-date">
                  <span className="ev-month">{event.month}</span>
                  <span className="ev-day">{event.day}</span>
                  <span className="ev-year">{event.year}</span>
                </div>
                <div className="ev-featured-body">
                  <span
                    className="ev-category-badge"
                    style={{ background: categoryColors[event.category] || 'var(--color-primary)' }}
                  >
                    {event.category}
                  </span>
                  <h3>{event.title}</h3>
                  <p>{event.desc}</p>
                  <div className="ev-meta">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {event.time}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {event.location}</span>
                  </div>
                  {event.link && (
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                      Register / Learn More
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {featured.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-10) 1rem', color: 'var(--color-text-light)' }}>
              <CalendarX2 size={28} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>No featured events have been added yet — check back soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* All Events */}
      <section className="section bg-white">
        <div className="container">
          <div className="ev-header reveal">
            <div>
              <span className="section-label">Calendar</span>
              <h2 className="section-title">All Upcoming Events</h2>
            </div>
            <div className="ev-controls">
              <div className="ev-view-toggle">
                <button className={`ev-view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')} aria-label="List view">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
                <button className={`ev-view-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')} aria-label="Grid view">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="ev-filter-bar reveal">
            {categories.map(cat => (
              <button
                key={cat}
                className={`ev-cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={activeCategory === cat && cat !== 'All' ? { background: categoryColors[cat] || 'var(--color-primary)', borderColor: 'transparent' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {view === 'list' ? (
            <div className="ev-list">
              {filtered.map((event) => (
                <div key={event.id} className="ev-list-item">
                  <div className="ev-list-date">
                    <span className="ev-month">{event.month}</span>
                    <span className="ev-day">{event.day}</span>
                  </div>
                  <div className="ev-list-body">
                    <span
                      className="ev-category-badge"
                      style={{ background: categoryColors[event.category] || 'var(--color-primary)' }}
                    >
                      {event.category}
                    </span>
                    <h3 className="ev-list-title">{event.title}</h3>
                    <p className="ev-list-desc">{event.desc}</p>
                    <div className="ev-meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {event.time}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {event.location}</span>
                    </div>
                  </div>
                  {event.link && (
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline ev-list-btn" style={{ fontSize: 'var(--text-xs)', padding: '0.5rem 1rem', flexShrink: 0 }}>
                      Details
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="ev-grid-view">
              {filtered.map((event) => (
                <div key={event.id} className="ev-grid-card">
                  <div className="ev-grid-date-bar" style={{ background: categoryColors[event.category] || 'var(--color-primary)' }}>
                    <span>{event.month} {event.day}, {event.year}</span>
                  </div>
                  <div className="ev-grid-body">
                    <span className="ev-category-badge" style={{ background: categoryColors[event.category] || 'var(--color-primary)' }}>
                      {event.category}
                    </span>
                    <h3>{event.title}</h3>
                    <div className="ev-meta" style={{ marginTop: 'var(--space-3)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {event.time}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {event.location}</span>
                    </div>
                    {event.link && (
                      <a href={event.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', width: '100%' }}>
                        View Event
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-10) 1rem', color: 'var(--color-text-light)' }}>
              <CalendarX2 size={28} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>
                {activeCategory === 'All' ? 'No events have been added yet — check back soon.' : `No ${activeCategory} events right now.`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Submit Event */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div className="ev-submit reveal" style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Have an Event to Share?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto var(--space-6)' }}>
              Faculty, staff, and student organisations can submit events for listing in the official VWU campus calendar.
            </p>
            <Link to="/contact" className="btn btn-accent">Submit Your Event</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
