import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const facilities = [
  { icon: '📺', title: 'Smart Class Rooms', desc: '200+ digitally-equipped smart classrooms with projectors, interactive whiteboards, and live-streaming capability for hybrid learning.' },
  { icon: '🔬', title: 'State-of-the-art Labs', desc: '50+ specialised laboratories across all departments — from AI & ML labs to VLSI design, Power Electronics, and Civil Engineering labs.' },
  { icon: '📚', title: 'Central Library', desc: '1,00,000+ volumes, e-journals, NPTEL digital resources, Springer, IEEE Xplore access, and dedicated reading areas for all students.' },
  { icon: '🎭', title: 'Auditoriums', desc: 'A 2,000-seat main auditorium and multiple seminar halls for events, conferences, cultural programs, and symposia.' },
  { icon: '📖', title: 'Campus Book Store', desc: 'A fully stocked campus bookstore offering prescribed textbooks, reference materials, stationery, and digital resources.' },
  { icon: '📶', title: 'Wi-Fi Campus', desc: '1 Gbps campus-wide Wi-Fi across all academic blocks, hostels, and recreational areas for 24/7 seamless connectivity.' },
  { icon: '🏠', title: 'Campus Hostels', desc: 'Secure, modern women\'s hostels with 24/7 security, attached mess, high-speed Wi-Fi, and recreational facilities for resident students.' },
  { icon: '🍽️', title: 'Food Courts', desc: 'Hygienic, well-equipped campus food courts serving freshly prepared vegetarian and non-vegetarian meals throughout the day.' },
  { icon: '💪', title: 'VISHNU Fitness Centre', desc: 'A fully equipped gymnasium and fitness centre with modern equipment, trained instructors, and scheduled fitness programs.' },
  { icon: '🏊', title: 'Swimming Pool', desc: 'An Olympic-standard swimming pool available for students and staff, with certified coaching and regular swimming sessions.' },
  { icon: '🏥', title: 'Health Care Centre', desc: 'On-campus medical facility with qualified doctors, nurses, and first aid — providing primary healthcare to all students and staff.' },
  { icon: '🔐', title: 'Campus Security', desc: '24/7 CCTV surveillance, security personnel, and controlled access entry points ensuring a safe and secure campus environment.' },
  { icon: '🚌', title: 'Travel Desk', desc: 'Dedicated travel desk providing transport coordination, bus passes, and travel assistance for students and staff.' },
  { icon: '🛕', title: 'Temples', desc: 'On-campus temples and prayer spaces providing a place of reflection, peace, and spiritual well-being for all students.' },
  { icon: '🏘️', title: 'Staff Quarters', desc: 'On-campus residential quarters for faculty and staff within the Green Meadows campus network for convenient living.' },
  { icon: '♿', title: 'Other Facilities', desc: 'Facilities for differently-abled students, indoor games room, student lounge, ATM, photocopying, and more across campus.' },
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
      <section className="page-hero">
        <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=80" alt="VWU campus" className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/about" className="breadcrumb-item">Discover</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Campus Life</span>
          </div>
          <h1 className="animate-fade-in-up">Campus Life at VWU</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            A 100-acre campus in Bhimavaram designed to inspire learning, wellness, and community.
          </p>
        </div>
      </section>

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
              Every facility at VWU is designed to support your academic journey, personal well-being, and campus life experience.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }} className="campus-facilities-grid">
            {facilities.map((f, i) => (
              <div key={f.title} className="reveal" data-delay={`${i * 40}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)' }}
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
              Schedule a campus visit to experience VWU's world-class facilities, meet our faculty, and discover your future home.
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
