import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  X, 
  Clock, 
  Check, 
  Share2, 
  Building2,
  CalendarPlus
} from 'lucide-react';
import type { HappeningDoc } from '../../pages/Admin/sections/NewsAwardsDataAdmin';
import './UpcomingEvents.css';

interface FormattedDate {
  month: string;
  day: string;
  year?: string;
  weekday?: string;
  fullDateStr: string;
}

function parseEventDate(dateStr: string): FormattedDate {
  if (!dateStr) {
    return { month: 'VWU', day: '—', fullDateStr: '' };
  }
  const clean = dateStr.trim();
  
  // Matches "Month DD, YYYY" or "Month DD" (e.g. "March 28, 2026", "April 15")
  const match = clean.match(/^([A-Za-z]+)\s+(\d{1,2})(?:,?\s*(\d{4}))?/);
  if (match) {
    const month = match[1].slice(0, 3).toUpperCase();
    const day = match[2].padStart(2, '0');
    const year = match[3] || new Date().getFullYear().toString();
    
    let weekday: string | undefined;
    try {
      const d = new Date(`${match[1]} ${match[2]}, ${year}`);
      if (!isNaN(d.getTime())) {
        weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      }
    } catch {
      // Ignore fallback
    }
    
    return { month, day, year, weekday, fullDateStr: clean };
  }

  // Matches "DD Month YYYY" (e.g. "28 March 2026")
  const match2 = clean.match(/^(\d{1,2})\s+([A-Za-z]+)(?:,?\s*(\d{4}))?/);
  if (match2) {
    const day = match2[1].padStart(2, '0');
    const month = match2[2].slice(0, 3).toUpperCase();
    const year = match2[3] || new Date().getFullYear().toString();
    return { month, day, year, fullDateStr: clean };
  }

  return { month: 'EVENT', day: clean.slice(0, 5), fullDateStr: clean };
}

function getGoogleCalendarUrl(event: { title: string; date: string; description?: string; dept?: string }): string {
  const title = encodeURIComponent(`${event.title} | Vishnu Women's University`);
  const details = encodeURIComponent(
    `${event.description ? event.description + '\n\n' : ''}Organized by: ${event.dept || 'Vishnu Women\'s University'}\nCampus: Vishnu Women's University, Bhimavaram\nWebsite: https://vishnu.edu.in`
  );
  const location = encodeURIComponent("Vishnu Women's University Campus, Kovvada, Bhimavaram, Andhra Pradesh 534202");

  const parsed = Date.parse(event.date);
  let datesParam = '';
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const start = `${yyyy}${mm}${dd}`;
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    const end = `${nextDay.getFullYear()}${String(nextDay.getMonth() + 1).padStart(2, '0')}${String(nextDay.getDate()).padStart(2, '0')}`;
    datesParam = `&dates=${start}/${end}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${datesParam}`;
}

const DEFAULT_UPCOMING_EVENTS: HappeningDoc[] = [
  {
    id: 'up-1',
    title: 'TECHNOVA 2026: National Women in Tech Symposium & Hackathon',
    date: 'March 28, 2026',
    type: 'upcoming',
    dept: 'Dept. of CSE & AI',
    order: 0,
    description: '36-hour flagship hackathon, technical paper presentations, AI project expo, and keynote sessions with industry leaders from Google, Microsoft, and Amazon.',
  },
  {
    id: 'up-2',
    title: 'International Conference on Sustainable VLSI & Embedded Systems (ICSVES)',
    date: 'April 15, 2026',
    type: 'upcoming',
    dept: 'Dept. of ECE',
    order: 1,
    description: 'IEEE-partnered international conference showcasing cutting-edge semiconductor research, chip design workshops, and student paper tracks.',
  },
  {
    id: 'up-3',
    title: 'Annual Placement & Corporate Leadership Masterclass Series',
    date: 'May 04, 2026',
    type: 'upcoming',
    dept: 'Career Guidance & Placements',
    order: 2,
    description: 'Exclusive leadership panels, product architecture workshops, mock technical rounds, and networking with top tier-1 tech recruiters.',
  },
  {
    id: 'up-4',
    title: 'VWU Innovation Expo & Startup Incubation Pitchfest',
    date: 'May 20, 2026',
    type: 'upcoming',
    dept: 'Centre for Innovation (CIED)',
    order: 3,
    description: 'Live student venture pitches, patent portfolio exhibits, seed funding evaluations, and mentorship by angel investors.',
  },
];

interface Props {
  happenings?: HappeningDoc[];
}

export default function UpcomingEvents({ happenings = [] }: Props) {
  const items = happenings.length > 0 ? happenings : DEFAULT_UPCOMING_EVENTS;
  const [selectedEvent, setSelectedEvent] = useState<HappeningDoc | null>(null);
  const [copied, setCopied] = useState(false);

  // Featured first event + subsequent schedule list
  const featuredEvent = items[0];
  const otherEvents = items.slice(1);

  useEffect(() => {
    if (!selectedEvent) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedEvent(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedEvent]);

  const handleShare = (e: React.MouseEvent, ev: HappeningDoc) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: ev.title,
        text: `${ev.title} at Vishnu Women's University on ${ev.date}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${ev.title} - ${ev.date} | Vishnu Women's University\n${window.location.origin}/news-awards/happenings`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const featuredDate = featuredEvent ? parseEventDate(featuredEvent.date) : null;

  return (
    <section className="m3-upcoming-section" id="upcoming-events" aria-label="Upcoming Events at VWU">
      {/* Background ambient lighting */}
      <div className="m3-upcoming-glow-1" aria-hidden="true" />
      <div className="m3-upcoming-glow-2" aria-hidden="true" />

      <div className="container">
        {/* Section Header with Google M3 Pill Badge */}
        <div className="m3-upcoming-header">
          <div className="m3-upcoming-header-text reveal-left">
            <h2 className="m3-upcoming-title">Upcoming at VWU</h2>
            <p className="m3-upcoming-subtitle">
              Mark your calendar for upcoming tech symposiums, IEEE conferences, workshops, and campus life milestones.
            </p>
          </div>
          
          <div className="m3-upcoming-header-action reveal-right">
            <Link to="/news-awards/happenings" className="m3-btn m3-btn--tonal">
              <span>View All Events</span>
              <ArrowRight size={16} className="m3-btn-arrow" />
            </Link>
          </div>
        </div>

        {/* Events Layout: Spotlight Grid */}
        <div className="m3-upcoming-grid">
          {/* Hero Spotlight Card (Featured Next Event) */}
          {featuredEvent && featuredDate && (
            <div 
              className="m3-card m3-card--featured reveal-left"
              onClick={() => setSelectedEvent(featuredEvent)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedEvent(featuredEvent); }}
            >
              <div className="m3-featured-top">
                <span className="m3-badge-next">Next Event</span>
                {featuredEvent.dept && (
                  <span className="m3-dept-tag">
                    <span>{featuredEvent.dept}</span>
                  </span>
                )}
              </div>

              <div className="m3-featured-content">
                {/* Date Tile */}
                <div className="m3-cal-tile m3-cal-tile--hero">
                  <div className="m3-cal-tile-month">{featuredDate.month}</div>
                  <div className="m3-cal-tile-day">{featuredDate.day}</div>
                </div>

                <div className="m3-featured-details">
                  <div className="m3-event-date-full">
                    <CalendarDays size={14} strokeWidth={2} />
                    <span>{featuredEvent.date}</span>
                  </div>
                  <h3 className="m3-featured-title">{featuredEvent.title}</h3>
                  {featuredEvent.description && (
                    <p className="m3-featured-desc">{featuredEvent.description}</p>
                  )}

                  <div className="m3-featured-meta-row">
                    <span className="m3-meta-item">
                      <MapPin size={13} strokeWidth={2} />
                      <span>VWU Campus Auditorium</span>
                    </span>
                    <span className="m3-meta-item">
                      <Clock size={13} strokeWidth={2} />
                      <span>Full Day Event</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="m3-featured-footer">
                <a 
                  href={getGoogleCalendarUrl(featuredEvent)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="m3-btn m3-btn--primary m3-btn--sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CalendarPlus size={14} />
                  <span>Add to Calendar</span>
                </a>

                <button 
                  type="button" 
                  className="m3-btn-subtle"
                  onClick={() => setSelectedEvent(featuredEvent)}
                >
                  <span>Quick Details →</span>
                </button>
              </div>
            </div>
          )}

          {/* Schedule Column (Compact Remaining Events) */}
          <div className="m3-schedule-list reveal-right">
            {otherEvents.map((item, idx) => {
              const dt = parseEventDate(item.date);
              return (
                <div 
                  key={item.id || idx} 
                  className="m3-card m3-card--row"
                  onClick={() => setSelectedEvent(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedEvent(item); }}
                >
                  {/* Calendar Date Tile */}
                  <div className="m3-cal-tile">
                    <div className="m3-cal-tile-month">{dt.month}</div>
                    <div className="m3-cal-tile-day">{dt.day}</div>
                  </div>

                  <div className="m3-row-content">
                    <div className="m3-row-meta-top">
                      {item.dept && (
                        <span className="m3-dept-pill">{item.dept}</span>
                      )}
                      <span className="m3-date-pill">{item.date}</span>
                    </div>

                    <h4 className="m3-row-title">{item.title}</h4>
                  </div>

                  <div className="m3-row-actions">
                    <a
                      href={getGoogleCalendarUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="m3-icon-btn"
                      title="Add to Google Calendar"
                      aria-label="Add to Google Calendar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CalendarPlus size={15} />
                    </a>

                    <div className="m3-action-arrow">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subdued Footer Archive Link */}
        <div className="m3-upcoming-footer-bar reveal">
          <Link to="/news-awards/happenings" className="m3-footer-link">
            <span>Explore Past Happenings &amp; Archives</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Google M3 Event Detail Dialog Modal */}
      {selectedEvent && (
        <div className="m3-dialog-overlay" onClick={() => setSelectedEvent(null)}>
          <div 
            className="m3-dialog" 
            role="dialog" 
            aria-modal="true" 
            aria-label={selectedEvent.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="m3-dialog-close-btn" 
              onClick={() => setSelectedEvent(null)}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div className="m3-dialog-header">
              <div className="m3-dialog-eyebrow">
                <span className="m3-chip m3-chip--primary">
                  <Sparkles size={12} />
                  <span>Upcoming Event</span>
                </span>
                {selectedEvent.dept && (
                  <span className="m3-dept-pill">{selectedEvent.dept}</span>
                )}
              </div>
              <h3 className="m3-dialog-title">{selectedEvent.title}</h3>
            </div>

            <div className="m3-dialog-body">
              {/* Event Meta Cards */}
              <div className="m3-dialog-meta-grid">
                <div className="m3-dialog-meta-card">
                  <CalendarDays size={18} className="m3-meta-icon" />
                  <div>
                    <span className="m3-meta-label">Date</span>
                    <span className="m3-meta-val">{selectedEvent.date}</span>
                  </div>
                </div>

                <div className="m3-dialog-meta-card">
                  <MapPin size={18} className="m3-meta-icon" />
                  <div>
                    <span className="m3-meta-label">Location</span>
                    <span className="m3-meta-val">VWU Campus, Bhimavaram</span>
                  </div>
                </div>

                <div className="m3-dialog-meta-card">
                  <Building2 size={18} className="m3-meta-icon" />
                  <div>
                    <span className="m3-meta-label">Department</span>
                    <span className="m3-meta-val">{selectedEvent.dept || 'Vishnu Women\'s University'}</span>
                  </div>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="m3-dialog-desc-box">
                  <h4 className="m3-desc-heading">About This Event</h4>
                  <p className="m3-desc-text">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <div className="m3-dialog-footer">
              <a 
                href={getGoogleCalendarUrl(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="m3-btn m3-btn--primary"
              >
                <CalendarPlus size={16} />
                <span>Add to Google Calendar</span>
              </a>

              <button 
                type="button" 
                className="m3-btn m3-btn--tonal"
                onClick={(e) => handleShare(e, selectedEvent)}
              >
                {copied ? <Check size={16} color="green" /> : <Share2 size={16} />}
                <span>{copied ? 'Link Copied!' : 'Share Event'}</span>
              </button>

              <Link 
                to="/news-awards/happenings" 
                className="m3-btn m3-btn--outlined"
                onClick={() => setSelectedEvent(null)}
              >
                <span>All Happenings</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
