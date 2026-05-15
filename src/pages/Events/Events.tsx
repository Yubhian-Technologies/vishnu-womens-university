import { useEffect, useState } from 'react';
import './Events.css';
import PageHero from '../../components/PageHero/PageHero';

interface Event {
  id: number;
  title: string;
  month: string;
  day: string;
  year: string;
  time: string;
  location: string;
  category: string;
  desc: string;
  featured?: boolean;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Technova2026 National Technical Symposium',
    month: 'MAY', day: '20', year: '2026',
    time: '9:00 AM IST',
    location: 'VWU Main Auditorium, Bhimavaram',
    category: 'Academic Events',
    desc: 'VWU\'s flagship annual national symposium featuring paper presentations, workshops, hackathons, and technical competitions from students across India.',
    featured: true,
  },
  {
    id: 2,
    title: 'mBAJA SAEINDIA 2026 Award Celebration',
    month: 'JUN', day: '5', year: '2026',
    time: '10:00 AM',
    location: 'Seminar Hall, VWU Campus',
    category: 'Special Events',
    desc: 'Felicitation ceremony for Team Ziba Racers, honoring the team\'s achievement at the mBAJA SAEINDIA 2026 national competition. Open to all students and faculty.',
    featured: true,
  },
  {
    id: 3,
    title: 'Amazon AFE Internship Orientation',
    month: 'JUN', day: '18', year: '2026',
    time: '9:00 AM – 12:00 PM',
    location: 'Seminar Hall, VWU',
    category: 'Placements',
    desc: 'Orientation session for VWU students selected for the Amazon AFE internship program. Mentors from Amazon will guide students on the internship process.',
  },
  {
    id: 4,
    title: 'Freshers\' Orientation & Welcome Day',
    month: 'JUL', day: '10', year: '2026',
    time: '9:00 AM – 4:00 PM',
    location: 'VWU Auditorium, Bhimavaram',
    category: 'Admissions',
    desc: 'A full-day welcome program for new VWU students. Meet faculty, advisors, and senior students. Explore clubs, facilities, and your academic journey.',
    featured: true,
  },
  {
    id: 5,
    title: 'Scholarship & Financial Aid Information Session',
    month: 'JUL', day: '22', year: '2026',
    time: '3:00 PM IST',
    location: 'Conference Hall, VWU',
    category: 'Admissions',
    desc: 'Learn about SC/ST/BC scholarships, merit scholarships, and government fee reimbursement schemes. Open to students and parents.',
  },
  {
    id: 6,
    title: 'Annual Alumni Meet 2026',
    month: 'SEP', day: '15', year: '2026',
    time: 'All Day',
    location: 'VWU Campus, Bhimavaram',
    category: 'Alumni Events',
    desc: 'VWU\'s annual alumni reunion. Reconnect with batchmates, meet current students, and celebrate two decades of engineering excellence.',
    featured: true,
  },
  {
    id: 7,
    title: 'Alumni Career Talk Series',
    month: 'OCT', day: '8', year: '2026',
    time: '6:00 PM – 8:00 PM',
    location: 'Virtual (Online)',
    category: 'Alumni Events',
    desc: 'VWU alumni from top companies share their career journeys and advice with current students in this inspiring online networking and mentoring session.',
  },
  {
    id: 8,
    title: 'Academic Excellence Awards Ceremony',
    month: 'OCT', day: '18', year: '2026',
    time: '6:30 PM',
    location: 'VWU Auditorium, Bhimavaram',
    category: 'Academic Events',
    desc: 'Annual celebration honoring VWU students, faculty, and staff for outstanding academic achievement, research contributions, and institutional service.',
  },
  {
    id: 9,
    title: 'Inter-College Sports Tournament 2026',
    month: 'NOV', day: '5', year: '2026',
    time: '8:00 AM',
    location: 'VWU Sports Complex, Bhimavaram',
    category: 'Sports',
    desc: 'VWU hosts the annual inter-college sports tournament featuring cricket, volleyball, badminton, kabaddi, and athletics. Open to all engineering colleges in AP.',
  },
  {
    id: 10,
    title: '9th Annual Graduation Day Ceremony',
    month: 'DEC', day: '15', year: '2026',
    time: '10:00 AM',
    location: 'VWU Main Auditorium, Bhimavaram',
    category: 'Special Events',
    desc: 'VWU proudly celebrates its 9th Graduation Day — honouring the graduating batch of engineers who are set to make their mark in the world.',
  },
];

const categoryColors: Record<string, string> = {
  'Special Events': '#C9A84C',
  'Academic Events': '#003087',
  'Placements': '#0057B8',
  'Admissions': '#2E7D32',
  'Alumni Events': '#C8102E',
  'Sports': '#E65100',
};

const categories = ['All', ...Array.from(new Set(events.map(e => e.category)))];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    document.title = 'Events | Vishnu Womens University';
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

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="events"
        defaultImage="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
        defaultTitle="Campus Events"
  defaultSubtitle="From technical symposia to sports tournaments and graduation celebrations — there's always something happening at VWU."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Events' }]}
      />

      {/* Featured Events */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Don't Miss</span>
            <h2 className="section-title">Featured Events</h2>
          </div>
          <div className="ev-featured-grid">
            {featured.map((event, i) => (
              <div key={event.id} className="ev-featured-card reveal" data-delay={`${i * 100}`}>
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
                    <span>🕐 {event.time}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <a href="#" className="btn btn-primary" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Register / Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
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
              {filtered.map((event, i) => (
                <div key={event.id} className="ev-list-item reveal" data-delay={`${i * 60}`}>
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
                      <span>🕐 {event.time}</span>
                      <span>📍 {event.location}</span>
                    </div>
                  </div>
                  <a href="#" className="btn btn-outline ev-list-btn" style={{ fontSize: 'var(--text-xs)', padding: '0.5rem 1rem', flexShrink: 0 }}>
                    Details
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="ev-grid-view">
              {filtered.map((event, i) => (
                <div key={event.id} className="ev-grid-card reveal" data-delay={`${i * 60}`}>
                  <div className="ev-grid-date-bar" style={{ background: categoryColors[event.category] || 'var(--color-primary)' }}>
                    <span>{event.month} {event.day}, {event.year}</span>
                  </div>
                  <div className="ev-grid-body">
                    <span className="ev-category-badge" style={{ background: categoryColors[event.category] || 'var(--color-primary)' }}>
                      {event.category}
                    </span>
                    <h3>{event.title}</h3>
                    <div className="ev-meta" style={{ marginTop: 'var(--space-3)' }}>
                      <span>🕐 {event.time}</span>
                      <span>📍 {event.location}</span>
                    </div>
                    <a href="#" className="btn btn-outline" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', width: '100%' }}>
                      View Event
                    </a>
                  </div>
                </div>
              ))}
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
              Faculty, staff, and student organizations can submit campus events for inclusion in the official VWU calendar.
            </p>
            <a href="#" className="btn btn-accent">Submit Your Event</a>
          </div>
        </div>
      </section>
    </main>
  );
}
