import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const facilities = [
  { id: 'smart-classrooms', icon: '📺', title: 'Smart Class Rooms', desc: 'More than 200 digitally-fitted classrooms with projectors, interactive whiteboards, and live-streaming support for hybrid delivery.' },
  { id: 'labs',             icon: '🔬', title: 'Specialised Laboratories', desc: 'Over 50 purpose-built labs spread across all departments — spanning AI & ML, VLSI design, Power Electronics, and Civil Engineering.' },
  { id: 'library',          icon: '📚', title: 'Central Library', desc: 'More than 1,00,000 volumes alongside e-journals, NPTEL resources, Springer, and IEEE Xplore access, with quiet reading spaces.' },
  { id: 'auditoriums',      icon: '🎭', title: 'Auditoriums', desc: 'A 2,000-seat main auditorium plus multiple seminar halls, supporting events, conferences, cultural programs, and symposia.' },
  { id: 'bookstores',       icon: '📖', title: 'Campus Book Stores', desc: 'A well-stocked campus bookstore carrying prescribed texts, reference materials, stationery, and digital resources.' },
  { id: 'wifi',             icon: '📶', title: 'Wi-Fi Campus', desc: 'Campus-wide 1 Gbps Wi-Fi covering academic blocks, hostels, and recreational areas, available around the clock.' },
  { id: 'hostels',          icon: '🏠', title: 'Campus Hostels', desc: 'Secure women\'s hostels with round-the-clock security, an attached mess, fast Wi-Fi, and recreation spaces for resident students.' },
  { id: 'food-courts',      icon: '🍽️', title: 'Food Courts', desc: 'Clean, well-run campus food courts offering freshly prepared vegetarian and non-vegetarian meals throughout the day.' },
  { id: 'fitness',          icon: '💪', title: 'VISHNU Fitness Centre', desc: 'A fully equipped gym with modern training equipment, qualified instructors, and structured fitness programs for all students.' },
  { id: 'swimming-pool',    icon: '🏊', title: 'Swimming Pool', desc: 'An Olympic-standard pool open to students and staff, with certified coaching and regularly scheduled swimming sessions.' },
  { id: 'health-care',      icon: '🏥', title: 'Health Care', desc: 'An on-campus medical centre staffed by qualified doctors and nurses, providing primary healthcare to students and staff.' },
  { id: 'security',         icon: '🔐', title: 'Campus Security', desc: 'Round-the-clock CCTV monitoring, trained security personnel, and controlled entry points maintaining a safe campus.' },
  { id: 'travel-desk',      icon: '🚌', title: 'Travel Desk', desc: 'A dedicated travel desk handling transport coordination, bus passes, and travel-related support for students and staff.' },
  { id: 'temples',          icon: '🛕', title: 'Temples', desc: 'On-campus temples and prayer spaces where students can find quiet, reflection, and a sense of spiritual grounding.' },
  { id: 'staff-quarters',   icon: '🏘️', title: 'Staff Quarters', desc: 'Residential quarters for faculty and staff within the Green Meadows campus network, enabling convenient on-campus living.' },
  { id: 'other-facilities', icon: '♿', title: 'Other Facilities', desc: 'Accessibility provisions for differently-abled students, an indoor games room, student lounge, ATM, photocopying services, and more.' },
];

export default function Campus() {
  useEffect(() => {
    document.title = 'Campus Life | VWU';
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

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="campus"
        defaultImage="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=80"
        defaultTitle="Campus Life at VWU"
  defaultSubtitle="A 100-acre campus in Bhimavaram where learning, wellness, and community life come together."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Campus Life' }]}
      />

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {[
              { num: '100', label: 'Acres Campus' },
              { num: '200+', label: 'Smart Classrooms' },
              { num: '50+', label: 'Laboratories' },
              { num: '1 Gbps', label: 'Campus Wi-Fi' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Infrastructure</span>
            <h2 className="section-title">World-Class Campus Facilities</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Each facility at VWU has been developed to support students academically, promote personal well-being, and enrich campus life.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }} className="campus-facilities-grid">
            {facilities.map((f, i) => (
              <div key={f.title} id={f.id} className="reveal" data-delay={`${i * 40}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-3)' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Image Gallery */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Gallery</span>
            <h2 className="section-title">A Glimpse of VWU Campus</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            {[
              { src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms' },
              { src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research labs' },
              { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', alt: 'Campus hostel' },
              { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports facilities' },
              { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80', alt: 'Campus dining' },
              { src: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', alt: 'Campus life' },
            ].map((img, i) => (
              <div key={i} className="reveal" data-delay={`${i * 60}`} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: 220 }}>
                <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-16) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Experience VWU</span>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Come See Our Campus</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto var(--space-8)' }}>
              Schedule a campus visit to tour the facilities in person, meet our faculty, and get a clear picture of life at VWU.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg">Schedule a Visit</Link>
              <Link to="/student-life" className="btn btn-secondary btn-lg">Student Life</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
