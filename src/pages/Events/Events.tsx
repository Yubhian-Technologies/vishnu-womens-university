import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarX2, Clock, MapPin, Search, User } from 'lucide-react';
import './Events.css';
import PageHero from '../../components/PageHero/PageHero';
import EventDetailModal from './EventDetailModal';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
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

// A category an admin types in fresh (not one of the ones above) still gets
// a real, consistent colour instead of always falling back to plain navy —
// picked deterministically from its name so the same category always lands
// on the same colour across a session, without needing a "manage
// categories" admin step of its own.
const FALLBACK_PALETTE = ['#C9A84C', '#7c5cbf', '#1f8f5c', '#b3542a', '#0b6e7a', '#a8324f'];
function colorForCategory(category: string): string {
  if (categoryColors[category]) return categoryColors[category];
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}

const MONTH_INDEX: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

// Upcoming/Past is derived straight from the event's own month/day/year
// fields rather than a separately admin-maintained status flag — that way
// it's always correct the day after an event happens, with nothing for an
// admin to remember to go update.
function eventDate(e: EventDoc): Date | null {
  const monthIdx = MONTH_INDEX[(e.month || '').toUpperCase().slice(0, 3)];
  const day = parseInt(e.day, 10);
  const year = parseInt(e.year, 10) || new Date().getFullYear();
  if (monthIdx == null || Number.isNaN(day)) return null;
  return new Date(year, monthIdx, day);
}
function isPastEvent(e: EventDoc): boolean {
  const d = eventDate(e);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

type TimeFilter = 'all' | 'upcoming' | 'past';

export default function Events() {
  const { docs: events } = useOrderedCollection<EventDoc>('events', 'order');
  const stats = useContentBlocks('events', 'stats');
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [detailEvent, setDetailEvent] = useState<EventDoc | null>(null);
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (activeCategory !== 'All' && e.category !== activeCategory) return false;
      if (timeFilter !== 'all' && isPastEvent(e) !== (timeFilter === 'past')) return false;
      if (q && !e.title.toLowerCase().includes(q) && !e.desc.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [events, activeCategory, timeFilter, search]);

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
      {/* Hero — image/title/subtitle/CTA all admin-editable via Hero Banners */}
      <PageHero
        page="events"
        defaultTitle="Events That Bring Us Together"
        defaultSubtitle="Technical symposia, sports tournaments, graduation ceremonies, and much more — the VWU calendar is always full."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Events' }]}
        scrollCtaTargetId="events-content"
        size="large"
      />

      {/* Stats bar — Admin -> Page Content Blocks -> "Events — Stats Bar" */}
      {stats.length > 0 && (
        <section className="ev-statbar">
          <div className="container ev-statbar-row">
            {stats.map((s) => (
              <div key={s.id} className="ev-stat">
                <div className="ev-stat-value">{s.value}</div>
                <div className="ev-stat-label">{s.title}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Events */}
      <section id="events-content" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Don't Miss</span>
            <h2 className="section-title">Featured Events</h2>
          </div>
          <div className="ev-featured-grid">
            {featured.map((event) => {
              const color = colorForCategory(event.category);
              return (
                <div
                  key={event.id}
                  className={`ev-featured-card${event.image ? ' ev-featured-card--photo' : ''}`}
                  style={event.image ? { backgroundImage: `url(${event.image})` } : undefined}
                >
                  {!event.image && (
                    <div className="ev-featured-date" style={{ background: `linear-gradient(135deg, ${color}, var(--color-primary-light))` }}>
                      <span className="ev-month">{event.month}</span>
                      <span className="ev-day">{event.day}</span>
                      <span className="ev-year">{event.year}</span>
                    </div>
                  )}
                  <div className="ev-featured-body">
                    {event.image && (
                      <span className="ev-featured-date-badge">{event.month} {event.day}</span>
                    )}
                    <span className="ev-category-badge" style={{ background: color }}>{event.category}</span>
                    <h3>{event.title}</h3>
                    <p>{event.desc}</p>
                    <div className="ev-meta">
                      {event.time && <span><Clock size={14} /> {event.time}</span>}
                      {event.location && <span><MapPin size={14} /> {event.location}</span>}
                    </div>
                    <button type="button" className="btn btn-primary ev-details-btn" onClick={() => setDetailEvent(event)}>
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
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
              <h2 className="section-title">All Events</h2>
            </div>
            <div className="ev-controls">
              <div className="ev-search">
                <Search size={16} />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events…"
                  aria-label="Search events"
                />
              </div>
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

          <div className="ev-time-toggle reveal">
            {(['all', 'upcoming', 'past'] as TimeFilter[]).map((t) => (
              <button key={t} className={`ev-time-btn${timeFilter === t ? ' active' : ''}`} onClick={() => setTimeFilter(t)}>
                {t === 'all' ? 'All' : t === 'upcoming' ? 'Upcoming' : 'Past'}
              </button>
            ))}
          </div>

          <div className="ev-filter-bar reveal">
            {categories.map(cat => (
              <button
                key={cat}
                className={`ev-cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={activeCategory === cat && cat !== 'All' ? { background: colorForCategory(cat), borderColor: 'transparent' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {view === 'list' ? (
            <div className="ev-list">
              {filtered.map((event) => {
                const color = colorForCategory(event.category);
                return (
                  <div key={event.id} className="ev-list-item">
                    {event.image ? (
                      <div className="ev-list-thumb" style={{ backgroundImage: `url(${event.image})` }} />
                    ) : (
                      <div className="ev-list-date" style={{ background: color }}>
                        <span className="ev-month">{event.month}</span>
                        <span className="ev-day">{event.day}</span>
                      </div>
                    )}
                    <div className="ev-list-body">
                      <span className="ev-category-badge" style={{ background: color }}>{event.category}</span>
                      <h3 className="ev-list-title">{event.title}</h3>
                      <p className="ev-list-desc">{event.desc}</p>
                      <div className="ev-meta">
                        {event.time && <span><Clock size={14} /> {event.time}</span>}
                        {event.location && <span><MapPin size={14} /> {event.location}</span>}
                        {event.organizer && <span><User size={14} /> {event.organizer}</span>}
                      </div>
                    </div>
                    <button type="button" className="btn btn-outline ev-list-btn" onClick={() => setDetailEvent(event)}>
                      Details
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ev-grid-view">
              {filtered.map((event) => {
                const color = colorForCategory(event.category);
                return (
                  <div key={event.id} className="ev-grid-card">
                    {event.image ? (
                      <div className="ev-grid-photo" style={{ backgroundImage: `url(${event.image})` }}>
                        <span className="ev-grid-photo-date">{event.month} {event.day}, {event.year}</span>
                      </div>
                    ) : (
                      <div className="ev-grid-date-bar" style={{ background: color }}>
                        <span>{event.month} {event.day}, {event.year}</span>
                      </div>
                    )}
                    <div className="ev-grid-body">
                      <span className="ev-category-badge" style={{ background: color }}>{event.category}</span>
                      <h3>{event.title}</h3>
                      <div className="ev-meta" style={{ marginTop: 'var(--space-3)' }}>
                        {event.time && <span><Clock size={14} /> {event.time}</span>}
                        {event.location && <span><MapPin size={14} /> {event.location}</span>}
                      </div>
                      <button type="button" className="btn btn-outline" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', width: '100%' }} onClick={() => setDetailEvent(event)}>
                        View Event
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-10) 1rem', color: 'var(--color-text-light)' }}>
              <CalendarX2 size={28} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>
                {events.length === 0 ? 'No events have been added yet — check back soon.' : 'No events match your filters right now.'}
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

      {detailEvent && (
        <EventDetailModal event={detailEvent} categoryColor={colorForCategory(detailEvent.category)} onClose={() => setDetailEvent(null)} />
      )}
    </main>
  );
}
