import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { CALENDAR_CATEGORIES, type CalendarEntry } from '../Admin/sections/AcademicCalendarAdmin';
import type { HolidayEntry } from '../Admin/sections/HolidaysAdmin';
import { CalendarOff, Monitor, FileText } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import { ICT_RESOURCE_GROUPS } from './ictResources.data';
import { DEFAULT_OTHER_PRACTICES, EXPERIENTIAL_LEARNING_INTRO, type OtherPracticeItem } from './otherPractices.data';
import './Information.css';

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

type TabId = 'calendar' | 'holidays' | 'counselling' | 'ict' | 'practices';

const hashToTab: Record<string, TabId> = {
  '#academic-calendar': 'calendar',
  '#holidays':          'holidays',
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
  const counsellingScheme = useContentBlocks('information', 'counsellingScheme');
  const otherPractices = DEFAULT_OTHER_PRACTICES;

  useEffect(() => {
    const tab = hashToTab[location.hash];
    if (tab) setActiveTab(tab);
  }, [location.hash]);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'calendar', label: 'Academic Calendar' },
    { id: 'holidays', label: 'List of Holidays' },
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
  defaultSubtitle="Academic calendar, holidays, counselling, ICT platforms, and more."
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
                {holidays.length > 0 ? holidays.map((h) => (
                  <div key={h.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{ background: 'var(--color-primary)', color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1.3rem', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', minWidth: 52, textAlign: 'center', lineHeight: 1 }}>
                      {h.date ? h.date.split(' ')[1]?.replace(',', '') ?? '' : ''}
                      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h.date ? (h.date.split(' ')[0] || '').toUpperCase() : ''}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{h.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{h.date}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-8) 1rem', color: 'var(--color-text-light)' }}>
                    <CalendarOff size={28} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
                    <p style={{ fontSize: 'var(--text-sm)' }}>The holiday list for this year hasn&apos;t been published yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Counselling */}
          {activeTab === 'counselling' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>Counselling Scheme</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', listStyle: 'none', padding: 0, margin: 0, maxWidth: 820 }}>
                {counsellingScheme.length > 0 ? counsellingScheme.map((s) => (
                  <li key={s.id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: '50% 50% 50% 0', background: 'var(--color-accent)', marginTop: '0.5em' }} />
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.7 }}>{s.desc || s.title}</p>
                  </li>
                )) : (
                  <li style={{ textAlign: 'center', padding: 'var(--space-8) 1rem', color: 'var(--color-text-light)' }}>
                    <p style={{ fontSize: 'var(--text-sm)' }}>The counselling scheme details haven&apos;t been published yet. Please contact the admissions office for assistance.</p>
                  </li>
                )}
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

              {/* Historical link archive carried over from the old SVECW
                  ICT Platforms page — see ictResources.data.ts */}
              <div style={{ marginTop: 'var(--space-12)', display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
                {ICT_RESOURCE_GROUPS.map((group) => (
                  <div key={group.heading}>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '2px solid var(--color-accent)' }}>
                      {group.heading}
                    </h3>
                    <ul className="mobile-stack-grid" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 'var(--space-8)' }}>
                      {group.links.map((link) => (
                        <li key={link.label} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-light-gray)' }}>
                          <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50% 50% 50% 0', background: 'var(--color-accent)', marginTop: '0.6em' }} />
                          <span style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                            {link.url ? (
                              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                {link.label}
                              </a>
                            ) : (
                              <span style={{ color: 'var(--color-text)' }}>{link.label}</span>
                            )}
                            {link.note && (
                              <span style={{ display: 'block', color: 'var(--color-text-light)', fontSize: 'var(--text-xs)', marginTop: 2 }}>{link.note}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Practices / Experiential Learning */}
          {activeTab === 'practices' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-3)' }}>Experiential Learning & Other Practices at VWU</h2>
              <div style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderLeft: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                <p style={{ color: 'var(--color-text)', fontSize: 'var(--text-base)', lineHeight: 1.7, margin: 0 }}>
                  {EXPERIENTIAL_LEARNING_INTRO}
                </p>
              </div>

              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {otherPractices.map((item) => {
                  const Icon = resolveContentIcon(item.icon) || Monitor;
                  const practiceBullets = (item as OtherPracticeItem).bullets;
                  return (
                    <div key={item.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-accent)' }}>
                      <Icon size={32} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{item.title}</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: practiceBullets?.length ? 'var(--space-3)' : 0 }}>{item.desc}</p>
                        {practiceBullets && practiceBullets.length > 0 && (
                          <ul style={{ paddingLeft: 'var(--space-4)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                            {practiceBullets.map((bullet, idx) => (
                              <li key={idx} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.5 }}>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
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
