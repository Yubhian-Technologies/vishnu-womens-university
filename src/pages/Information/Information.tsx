import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import type { CalendarEntry } from '../Admin/sections/AcademicCalendarAdmin';
import type { HolidayEntry } from '../Admin/sections/HolidaysAdmin';
import { Monitor, Plane, MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { useContentBlocks, useEapcetCode } from '../../hooks/useContentBlocks';
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
  const { docs: holidays } = useOrderedCollection<HolidayEntry>('holidays', 'order');
  const placementsCareersPhotos = useSitePhotos('information', 'placements-careers', defaultPlacementsCareersPhotos);
  const hasPlacementsCareersPhotos = useSectionHasPhotos('information', 'placements-careers');
  const antiRaggingSafetyPhotos = useSitePhotos('information', 'anti-ragging-safety', defaultAntiRaggingSafetyPhotos);
  const hasAntiRaggingSafetyPhotos = useSectionHasPhotos('information', 'anti-ragging-safety');
  const ictPlatforms = useContentBlocks('information', 'ictPlatforms');
  const howToReach = useContentBlocks('information', 'howToReach');
  const counsellingScheme = useContentBlocks('information', 'counsellingScheme');
  const otherPractices = useContentBlocks('information', 'otherPractices');
  const eapcetCode = useEapcetCode();

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
              <h2 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>Academic Calendar 2026–27</h2>
              <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', overflowX: 'auto', overflowY: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-light-gray)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-primary)' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-xs)' }}>S.No</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-xs)' }}>Event / Activity</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-xs)' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicCalendar.map((item, i) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(27, 67, 50, 0.08)', background: i % 2 === 0 ? 'var(--color-white)' : 'rgba(27, 67, 50, 0.035)' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--color-accent)', fontWeight: 900 }}>{i + 1}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-primary)' }}>{item.event}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-light)' }}>{item.date}</td>
                      </tr>
                    ))}
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
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>AP EAPCET Counselling Scheme</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Admissions to B.Tech programs at VWU are through AP EAPCET counselling. VWU College Code: <strong style={{ color: 'var(--color-primary)' }}>{eapcetCode}</strong>. Follow the steps below to secure your seat.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {counsellingScheme.map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', gap: 'var(--space-6)', background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5) var(--space-6)', alignItems: 'flex-start', transition: 'all 0.2s' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)', minWidth: 48, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{s.title}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.7 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
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
