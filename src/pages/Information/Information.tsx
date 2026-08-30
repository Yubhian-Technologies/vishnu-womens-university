import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { CALENDAR_CATEGORIES, type CalendarEntry } from '../Admin/sections/AcademicCalendarAdmin';
import type { HolidayEntry } from '../Admin/sections/HolidaysAdmin';
import { Monitor, Plane, MapPin, Phone, Mail, Navigation, FileText } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import './Information.css';

// Same coordinates as the embedded map on the Contact page. Omitting the
// "origin" param makes Google Maps use the visitor's current location
// (after they grant the browser permission prompt) as the route start.
const GOOGLE_MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=16.568119,81.522098';

const defaultPlacementsCareersPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Placement Drive', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Recruitment Interviews', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Mock Interview Prep', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Hall of Fame / Placed Students', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'HR Conclave', caption: '' },
];

const defaultAntiRaggingSafetyPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Student Safety Seminars', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Grievance Cell', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Awareness Poster Displays', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Counseling Room', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Campus Patrol & Security', caption: '' },
];

type TabId = 'calendar' | 'holidays' | 'reach' | 'counselling' | 'ict' | 'practices';

const hashToTab: Record<string, TabId> = {
  '#academic-calendar': 'calendar',
  '#holidays':          'holidays',
  '#how-to-reach':      'reach',
  '#counselling':       'counselling',
  '#ict-platforms':     'ict',
  '#other-practices':   'practices',
};

export default function Information() {
  const [activeTab, setActiveTab] = useState<TabId>('calendar');
  const location = useLocation();

  useEffect(() => {
    document.title = 'Information | VWU';
  }, []);

  const { docs: academicCalendar } = useOrderedCollection<CalendarEntry>('academicCalendar', 'order');
  const calendarColumns = CALENDAR_CATEGORIES.map((cat) => academicCalendar.filter((item) => item.category === cat.id));
  const calendarRowCount = calendarColumns.reduce((max, items) => Math.max(max, items.length), 0);
  const { docs: holidays } = useOrderedCollection<HolidayEntry>('holidays', 'order');
  const placementsCareersPhotos = useSitePhotos('information', 'placements-careers', defaultPlacementsCareersPhotos);
  const hasPlacementsCareersPhotos = useSectionHasPhotos('information', 'placements-careers');
  const antiRaggingSafetyPhotos = useSitePhotos('information', 'anti-ragging-safety', defaultAntiRaggingSafetyPhotos);
  const hasAntiRaggingSafetyPhotos = useSectionHasPhotos('information', 'anti-ragging-safety');
  const ictPlatforms = useContentBlocks('information', 'ictPlatforms');
  const howToReach = useContentBlocks('information', 'howToReach');
  const counsellingScheme = useContentBlocks('information', 'counsellingScheme');
  const otherPractices = useContentBlocks('information', 'otherPractices');

  useEffect(() => {
    const tab = hashToTab[location.hash];
    if (tab) setActiveTab(tab);
  }, [location.hash]);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'calendar', label: 'Academic Calendar' },
    { id: 'holidays', label: 'List of Holidays' },
    { id: 'reach', label: 'How to Reach' },
    { id: 'counselling', label: 'Counselling Scheme' },
    { id: 'ict', label: 'ICT Platforms' },
    { id: 'practices', label: 'Other Practices' },
  ];

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="information"
        defaultTitle="Information"
  defaultSubtitle="Academic calendar, holidays, how to reach us, counselling, ICT platforms, and more."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'Information' }]}
      />

      {/* Tabs */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="info-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`info-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Academic Calendar */}
          {activeTab === 'calendar' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Academic Calendar</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-6)', maxWidth: 680 }}>
                Each program/year publishes its own signed academic calendar as a PDF — pick one below to view or download it.
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', maxWidth: 720, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {CALENDAR_CATEGORIES.map((cat) => (
                        <th key={cat.id} style={{ textAlign: 'left', fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: 'var(--space-3) var(--space-5) var(--space-3) 0', borderBottom: '2px solid var(--color-accent)' }}>
                          {cat.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: calendarRowCount }).map((_, row) => (
                      <tr key={row}>
                        {calendarColumns.map((items, col) => (
                          <td key={CALENDAR_CATEGORIES[col].id} style={{ padding: 'var(--space-3) var(--space-5) var(--space-3) 0', borderBottom: '1px solid var(--color-light-gray)' }}>
                            {items[row] && (
                              <a
                                href={items[row].fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent)', fontWeight: 700, fontSize: 'var(--text-sm)', textDecoration: 'none' }}
                              >
                                <FileText size={14} strokeWidth={2} /> {items[row].label}
                              </a>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {calendarRowCount === 0 && (
                      <tr><td colSpan={CALENDAR_CATEGORIES.length} style={{ padding: 'var(--space-4) 0', color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>Not posted yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Holidays */}
          {activeTab === 'holidays' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>List of Holidays 2026</h2>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                {holidays.map((h) => (
                  <div key={h.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{ background: 'var(--color-primary)', color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1.3rem', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', minWidth: 52, textAlign: 'center', lineHeight: 1 }}>
                      {h.date.split(' ')[1].replace(',', '')}
                      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h.date.split(' ')[0].toUpperCase()}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{h.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{h.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Reach */}
          {activeTab === 'reach' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>How to Reach VWU</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 600 }}>
                Vishnu Women's University is located in Vishnupur, Bhimavaram, West Godavari District, Andhra Pradesh – 534 202.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
                {howToReach.map((r) => {
                  const Icon = resolveContentIcon(r.icon) || Plane;
                  return (
                    <div key={r.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start', borderLeft: '4px solid var(--color-accent)' }}>
                      <Icon size={29} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{r.title}</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{r.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: 'var(--space-2)' }}><MapPin size={15} /> Address</strong>
                Vishnu Women's University, Vishnupur, Bhimavaram – 534 202<br />
                West Godavari District, Andhra Pradesh, India<br />
                <a href="tel:08816250864" style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={14} /> 08816-250864</a> &nbsp;|&nbsp;
                <a href="mailto:info@vwu.edu.in" style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={14} /> info@vwu.edu.in</a>
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <a href={GOOGLE_MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                    <Navigation size={16} strokeWidth={2} style={{ marginRight: '0.4rem' }} /> Get Route
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Counselling */}
          {activeTab === 'counselling' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>Counselling Scheme</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', listStyle: 'none', padding: 0, margin: 0, maxWidth: 820 }}>
                {counsellingScheme.map((s) => (
                  <li key={s.id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: '50% 50% 50% 0', background: 'var(--color-accent)', marginTop: '0.5em' }} />
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.7 }}>{s.desc || s.title}</p>
                  </li>
                ))}
              </ul>
              <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
                <Link to="/admissions" className="btn btn-primary btn-lg">Learn More About Admissions</Link>
              </div>
            </div>
          )}

          {/* ICT Platforms */}
          {activeTab === 'ict' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>ICT Platforms & Digital Resources</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                VWU leverages a comprehensive suite of digital learning platforms to enhance academic delivery, student engagement, and research access.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {ictPlatforms.map((p) => {
                  const Icon = resolveContentIcon(p.icon) || Monitor;
                  return (
                    <div key={p.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                      <Icon size={32} strokeWidth={1.75} />
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.title}</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>{p.desc}</p>
                        <a href={p.slug || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 'var(--text-xs)', padding: '0.35rem 0.9rem' }}>Access Portal</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Practices */}
          {activeTab === 'practices' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Other Practices at VWU</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Beyond academics, VWU follows best practices in sustainability, inclusivity, ethics, and community engagement.
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {otherPractices.map((item) => {
                  const Icon = resolveContentIcon(item.icon) || Monitor;
                  return (
                    <div key={item.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-accent)' }}>
                      <Icon size={32} strokeWidth={1.75} />
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{item.title}</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Placements & Careers — hidden until real photos are added */}
      {hasPlacementsCareersPhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={placementsCareersPhotos}
              label="Placements & Careers"
              title="Launching Careers at VWU"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Anti-Ragging & Safety — hidden until real photos are added */}
      {hasAntiRaggingSafetyPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={antiRaggingSafetyPhotos}
              label="Anti-Ragging & Safety"
              title="A Safe, Supportive Campus"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}
    </main>
  );
}
