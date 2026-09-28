import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Clock,
  CalendarPlus
} from 'lucide-react';
import type { HappeningDoc } from '../../pages/Admin/sections/NewsAwardsDataAdmin';
import { parseHappeningDate, isUpcomingHappening } from '../../lib/happenings';
import { renderBold } from '../../lib/boldText';
import './UpcomingEvents.css';

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

// Shown only until an admin adds real "Upcoming" happenings (see
// NewsAwardsDataAdmin.tsx). Dates are computed relative to today rather
// than hardcoded so this placeholder content never drifts into the past —
// a fixed date string here would otherwise start displaying as a stale
// "upcoming" event the moment it elapsed.
function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
}

const DEFAULT_UPCOMING_EVENTS: HappeningDoc[] = [
  {
    id: 'up-1',
    title: 'TECHNOVA 2026: National Women in Tech Symposium & Hackathon',
    date: daysFromNow(14),
    type: 'upcoming',
    dept: 'Dept. of CSE & AI',
    order: 0,
    description: '36-hour flagship hackathon, technical paper presentations, AI project expo, and keynote sessions with industry leaders from Google, Microsoft, and Amazon.',
  },
  {
    id: 'up-2',
    title: 'International Conference on Sustainable VLSI & Embedded Systems (ICSVES)',
    date: daysFromNow(30),
    type: 'upcoming',
    dept: 'Dept. of ECE',
    order: 1,
    description: 'IEEE-partnered international conference showcasing cutting-edge semiconductor research, chip design workshops, and student paper tracks.',
  },
  {
    id: 'up-3',
    title: 'Annual Placement & Corporate Leadership Masterclass Series',
    date: daysFromNow(45),
    type: 'upcoming',
    dept: 'Career Guidance & Placements',
    order: 2,
    description: 'Exclusive leadership panels, product architecture workshops, mock technical rounds, and networking with top tier-1 tech recruiters.',
  },
  {
    id: 'up-4',
    title: 'VWU Innovation Expo & Startup Incubation Pitchfest',
    date: daysFromNow(60),
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
  const navigate = useNavigate();
  const candidates = happenings.length > 0 ? happenings : DEFAULT_UPCOMING_EVENTS;
  // Admins set type: 'upcoming' manually and don't always remember to flip
  // it back once the date passes — drop anything whose parsed date is
  // already before today so a stale entry can't linger indefinitely.
  const items = candidates.filter(isUpcomingHappening);

  // Featured first event + subsequent schedule list
  const featuredEvent = items[0];
  const otherEvents = items.slice(1);
  const featuredDate = featuredEvent ? parseHappeningDate(featuredEvent.date) : null;

  // Cards link to the existing per-happening detail page
  // (HappeningDetail.tsx, routed at /news-awards/happenings/:id) instead
  // of opening an in-place dialog.
  const goToEvent = (item: HappeningDoc) => navigate(`/news-awards/happenings/${item.id}`);

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

        {items.length === 0 && (
          <p className="m3-upcoming-empty reveal">No upcoming events right now — check back soon.</p>
        )}

        {/* Events Layout: Spotlight Grid */}
        <div className="m3-upcoming-grid">
          {/* Hero Spotlight Card (Featured Next Event) */}
          {featuredEvent && featuredDate && (
            <div
              className="m3-card m3-card--featured reveal-left"
              onClick={() => goToEvent(featuredEvent)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToEvent(featuredEvent); }}
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
                    <p className="m3-featured-desc">{renderBold(featuredEvent.description)}</p>
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
                  onClick={() => goToEvent(featuredEvent)}
                >
                  <span>View Details →</span>
                </button>
              </div>
            </div>
          )}

          {/* Schedule Column (Compact Remaining Events) */}
          <div className="m3-schedule-list reveal-right">
            {otherEvents.map((item, idx) => {
              const dt = parseHappeningDate(item.date);
              return (
                <div
                  key={item.id || idx}
                  className="m3-card m3-card--row"
                  onClick={() => goToEvent(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToEvent(item); }}
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
    </section>
  );
}
