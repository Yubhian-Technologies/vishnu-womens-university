import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';

const infoPhotos = [
  { src: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80', alt: 'Green campus environment', caption: 'Green Campus' },
  { src: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', alt: 'Campus aerial view', caption: 'Bhimavaram Campus' },
  { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Library resources', caption: 'e-Library' },
  { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80', alt: 'Campus dining', caption: 'Food Courts' },
  { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Students at orientation', caption: 'Freshers Orientation' },
];

const academicCalendar = [
  { event: 'Odd Semester Commencement', date: 'July 15, 2026' },
  { event: 'Freshers\' Orientation', date: 'July 16–18, 2026' },
  { event: 'Internal Assessment – I', date: 'August 25–30, 2026' },
  { event: 'Mid-Semester Break', date: 'September 15–17, 2026' },
  { event: 'Internal Assessment – II', date: 'October 10–15, 2026' },
  { event: 'Technova National Symposium', date: 'October 20, 2026' },
  { event: 'End Semester Examinations', date: 'November 15 – December 5, 2026' },
  { event: 'Even Semester Commencement', date: 'January 5, 2027' },
  { event: 'Internal Assessment – I (Even)', date: 'February 10–15, 2027' },
  { event: 'Internal Assessment – II (Even)', date: 'March 20–25, 2027' },
  { event: 'End Semester Examinations (Even)', date: 'April 20 – May 10, 2027' },
  { event: 'Summer Vacation', date: 'May 11 – July 14, 2027' },
];

const holidays = [
  { name: 'Ugadi (Telugu New Year)', date: 'March 30, 2026' },
  { name: 'Sri Rama Navami', date: 'April 6, 2026' },
  { name: 'Dr. Ambedkar Jayanti', date: 'April 14, 2026' },
  { name: 'Good Friday', date: 'April 18, 2026' },
  { name: 'May Day (Labour Day)', date: 'May 1, 2026' },
  { name: 'Eid-ul-Adha (Bakrid)', date: 'June 6, 2026' },
  { name: 'Independence Day', date: 'August 15, 2026' },
  { name: 'Ganesh Chaturthi', date: 'August 27, 2026' },
  { name: 'Gandhi Jayanti', date: 'October 2, 2026' },
  { name: 'Vijayadasami (Dussehra)', date: 'October 22, 2026' },
  { name: 'Diwali', date: 'November 1, 2026' },
  { name: 'Christmas', date: 'December 25, 2026' },
];

const ictPlatforms = [
  { icon: '🖥️', name: 'Vishnu LMS', desc: 'The official Learning Management System for course materials, assignments, quizzes, and academic resources.', link: '#' },
  { icon: '📝', name: 'Examination Portal', desc: 'Online portal for exam registration, hall ticket download, and result viewing for all JNTUK examinations.', link: '#' },
  { icon: '📰', name: 'Prathibha Magazine', desc: 'VWU\'s official campus magazine featuring student articles, alumni stories, research highlights, and events.', link: '#' },
  { icon: '📊', name: 'Academic ERP', desc: 'Integrated ERP system for attendance tracking, grade management, timetables, and student academic records.', link: '#' },
  { icon: '📚', name: 'e-Library Access', desc: 'Digital library portal giving access to IEEE Xplore, Springer, NPTEL, and 1,00,000+ e-books and journals.', link: '#' },
  { icon: '🎥', name: 'NPTEL & SWAYAM', desc: 'Access to NPTEL online courses and SWAYAM platform for supplementary learning and MOOC certifications.', link: '#' },
];

const howToReach = [
  { mode: '✈️ By Air', desc: 'Three airports serve Bhimavaram:\n• Rajamahendravaram (Rajahmundry) Airport — approx. 70 km away.\n• Gannavaram (Vijayawada) Airport — approx. 120 km away.\n• Visakhapatnam (VSKP) Airport — approx. 250 km away.\nTaxis and cab services are available from all three airports.' },
  { mode: '🚂 By Train', desc: 'Bhimavaram Town (BVRT) and Bhimavaram Junction (BZM) are well-connected to major cities. Direct trains from Hyderabad, Visakhapatnam, Chennai, and Vijayawada.' },
  { mode: '🚌 By Road', desc: 'Bhimavaram is accessible via NH-16 (East Coast Road). Regular APSRTC buses operate from Vijayawada (120 km), Hyderabad (400 km), and Visakhapatnam (250 km).' },
  { mode: '🚗 By Car', desc: 'VWU is located in Vishnupur, 3 km from Bhimavaram on the Tadepalligudem Road. Easily accessible by road from all major cities in Andhra Pradesh.' },
];

const counsellingScheme = [
  { step: '01', title: 'EAPCET Rank', desc: 'Qualify in AP EAPCET. VWU Code: VISW. Use your rank for counselling in all B.Tech specializations.' },
  { step: '02', title: 'AP EAPCET Counselling', desc: 'Register at the official AP EAPCET Counselling portal. Enter VWU (Code: VISW) as your college preference.' },
  { step: '03', title: 'Document Verification', desc: 'Report to the AP Counselling Authority with original certificates for verification and seat allotment.' },
  { step: '04', title: 'Seat Allotment', desc: 'Download your allotment order and report to VWU with all original documents within the specified date.' },
  { step: '05', title: 'Fee Payment', desc: 'Complete fee payment (Government-regulated) and submit documents at VWU Admissions Office.' },
  { step: '06', title: 'Enrolment', desc: 'Receive your student ID, begin classes, and become a part of the VWU family!' },
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
        defaultImage="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"
        defaultTitle="Information"
  defaultSubtitle="Academic calendar, holidays, how to reach us, counselling, ICT platforms, and more."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'Information' }]}
      />

      {/* Tabs */}
      <section className="section bg-off-white">
        <div className="container">
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-10)', flexWrap: 'wrap', borderBottom: '2px solid var(--color-light-gray)', paddingBottom: 0 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: 'var(--space-3) var(--space-5)',
                  background: 'none',
                  border: 'none',
                  borderBottom: `3px solid ${activeTab === tab.id ? 'var(--color-accent)' : 'transparent'}`,
                  marginBottom: -2,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-light)',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Academic Calendar */}
          {activeTab === 'calendar' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>Academic Calendar 2026–27</h2>
              <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-primary)' }}>
                      <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-xs)' }}>S.No</th>
                      <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-xs)' }}>Event / Activity</th>
                      <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-xs)' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicCalendar.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-light-gray)', background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                        <td style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-accent)', fontWeight: 900 }}>{i + 1}</td>
                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontWeight: 600, color: 'var(--color-primary)' }}>{item.event}</td>
                        <td style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-text-light)' }}>{item.date}</td>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                {holidays.map((h, i) => (
                  <div key={i} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
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
                Vishnu Womens University is located in Vishnupur, Bhimavaram, West Godavari District, Andhra Pradesh – 534 202.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
                {howToReach.map((r, i) => (
                  <div key={i} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-5)', alignItems: 'flex-start', borderLeft: '4px solid var(--color-accent)' }}>
                    <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{r.mode.split(' ')[0]}</span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{r.mode.split(' ').slice(1).join(' ')}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--color-accent)', display: 'block', marginBottom: 'var(--space-2)' }}>📍 Address</strong>
                Vishnu Womens University, Vishnupur, Bhimavaram – 534 202<br />
                West Godavari District, Andhra Pradesh, India<br />
                <a href="tel:08816250864" style={{ color: 'var(--color-accent)' }}>📞 08816-250864</a> &nbsp;|&nbsp;
                <a href="mailto:info@svecw.edu.in" style={{ color: 'var(--color-accent)' }}>✉ info@svecw.edu.in</a>
              </div>
            </div>
          )}

          {/* Counselling */}
          {activeTab === 'counselling' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>AP EAPCET Counselling Scheme</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Admissions to B.Tech programs at VWU are through AP EAPCET counselling. VWU College Code: <strong style={{ color: 'var(--color-primary)' }}>VISW</strong>. Follow the steps below to secure your seat.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {counsellingScheme.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-6)', background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5) var(--space-6)', alignItems: 'flex-start', transition: 'all 0.2s' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)', minWidth: 48, flexShrink: 0 }}>{s.step}</div>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {ictPlatforms.map((p, i) => (
                  <div key={i} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '2rem', flexShrink: 0 }}>{p.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.name}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>{p.desc}</p>
                      <a href={p.link} className="btn btn-outline" style={{ fontSize: 'var(--text-xs)', padding: '0.35rem 0.9rem' }}>Access Portal</a>
                    </div>
                  </div>
                ))}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {[
                  { icon: '🌿', title: 'Green Campus Initiative', desc: 'Solar energy, rainwater harvesting, waste management, and biodiversity conservation across the 100-acre campus.' },
                  { icon: '♿', title: 'Facilities for Differently-Abled', desc: 'Ramps, accessible restrooms, assistive technology, and dedicated support for students with disabilities.' },
                  { icon: '🤝', title: 'Anti-Ragging Policy', desc: 'Zero-tolerance anti-ragging policy with an active Anti-Ragging Committee, helpline, and regular awareness programs.' },
                  { icon: '⚖️', title: 'Internal Complaints Committee', desc: 'A designated Internal Committee (IC) to address complaints related to sexual harassment, ensuring a safe campus.' },
                  { icon: '🧠', title: 'Student Wellness Program', desc: 'Regular counselling sessions, mental health awareness workshops, and a dedicated student wellness center.' },
                  { icon: '📊', title: 'Transparency & RTI', desc: 'VWU is committed to transparency with RTI compliance, public self-disclosure, and audited financial statements.' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-accent)' }}>
                    <span style={{ fontSize: '2rem', flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{item.title}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Campus Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={infoPhotos}
            label="Campus Life"
            title="VWU in Pictures"
            subtitle="A visual glimpse of the campus, facilities, and everyday life at Vishnu Womens University in Bhimavaram."
            highlights={[
              'Located in Vishnupur, 3 km from Bhimavaram',
              'Well connected by road, rail, and air',
              'Academic calendar follows JNTUK schedule',
              'Vishnu LMS, e-Library & ERP systems in use',
              'NPTEL & SWAYAM MOOCs integrated into curriculum',
            ]}
            columns={2}
            layout="side-text"
          />
        </div>
      </section>
    </main>
  );
}
