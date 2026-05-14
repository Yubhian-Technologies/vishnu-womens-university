import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StudentLife.css';

const clubs = [
  { icon: '📻', name: 'Radio Vishnu 90.4', count: 'Campus FM station' },
  { icon: '📺', name: 'Vishnu TV Academy', count: 'Media & broadcasting' },
  { icon: '🤝', name: 'Student Government', count: 'Student council' },
  { icon: '🌱', name: 'NSS Unit', count: 'National Service Scheme' },
  { icon: '🛡️', name: 'NCC Wing', count: 'National Cadet Corps' },
  { icon: '💻', name: 'Tech Clubs (CSE/ECE/EEE)', count: 'Department-level clubs' },
  { icon: '🎨', name: 'Arts & Culture Club', count: 'Creativity & expression' },
  { icon: '📖', name: 'Prathibha Magazine', count: 'Campus literary journal' },
  { icon: '🌍', name: 'Social Service Club', count: 'Community outreach' },
  { icon: '🤖', name: 'Robotics Club', count: 'Innovation & design' },
  { icon: '♀️', name: 'Women Empowerment Cell', count: 'Leadership & awareness' },
  { icon: '🌿', name: 'Eco Club', count: 'Green campus initiative' },
];

const housing = [
  { name: 'Vishnu Girls Hostel – Block A', type: "Women's hostel", desc: 'Spacious rooms with modern amenities, 24/7 security, and high-speed Wi-Fi for all residents.' },
  { name: 'Vishnu Girls Hostel – Block B', type: "Women's hostel", desc: 'Comfortable accommodation with attached food court, reading rooms, and recreational facilities.' },
  { name: 'Staff Quarters', type: 'Faculty housing', desc: 'On-campus accommodation for faculty and staff within the Green Meadows campus network.' },
];

const services = [
  { icon: '🎓', title: 'Career Services Center', desc: 'Resume building, mock interviews, campus placement drives, and career counseling — powering 1,400+ annual placements.' },
  { icon: '🧠', title: 'Student Wellness Center', desc: 'Healthcare, mental wellness resources, and medical facilities available to all students on campus.' },
  { icon: '📚', title: 'Central Library', desc: 'Thousands of engineering textbooks, e-journals, NPTEL resources, and quiet study spaces for academic excellence.' },
  { icon: '💡', title: 'Assistive Technology Lab', desc: 'Pioneering lab developing assistive solutions for differently-abled persons — open to all for learning and research.' },
  { icon: '🏅', title: 'Sports & Games Facilities', desc: 'Indoor and outdoor sports facilities including courts, a swimming pool, and a fitness center for holistic development.' },
  { icon: '🌐', title: 'International Outreach', desc: 'Vishnu Japan Outreach Centre and international academic tie-ups for global exposure and exchange opportunities.' },
];

const athletics = [
  { sport: 'Cricket', season: 'Year-round', icon: '🏏' },
  { sport: 'Volleyball', season: 'Year-round', icon: '🏐' },
  { sport: 'Badminton', season: 'Year-round', icon: '🏸' },
  { sport: 'Basketball', season: 'Year-round', icon: '🏀' },
  { sport: 'Kabaddi', season: 'Year-round', icon: '🤼‍♀️' },
  { sport: 'Athletics / Track', season: 'Annual', icon: '🏃‍♀️' },
  { sport: 'Swimming', season: 'Year-round', icon: '🏊‍♀️' },
  { sport: 'Table Tennis', season: 'Year-round', icon: '🏓' },
  { sport: 'Chess', season: 'Year-round', icon: '♟️' },
  { sport: 'Throwball', season: 'Year-round', icon: '🏐' },
];

export default function StudentLife() {
  useEffect(() => {
    document.title = 'Student Life | Vishnu Womens University';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => el.classList.add('revealed'), parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1920&q=80"
          alt="Students enjoying campus life at VWU"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Student Life</span>
          </div>
          <h1 className="animate-fade-in-up">Discover Your Place at VWU</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            At VWU, you'll find more than an engineering degree. You'll find your community, your purpose, and your future.
          </p>
        </div>
      </section>

      {/* Quote Banner */}
      <section style={{ background: 'var(--color-accent)', padding: 'var(--space-6) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
            "VWU is about excellence and empowerment. If you want a space where you can grow into a confident, skilled engineer, VWU is the place for you." — Divya, ECE Graduate
          </p>
        </div>
      </section>

      {/* Clubs & Orgs */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Get Involved</span>
            <h2 className="section-title">Student Organizations & Clubs</h2>
            <p className="section-desc">
              With 30+ student clubs and organizations, there's a place for everyone at VWU.
              Or start your own!
            </p>
          </div>
          <div className="sl-clubs-grid">
            {clubs.map((club, i) => (
              <div key={club.name} className="sl-club-card reveal" data-delay={`${i * 50}`}>
                <div className="sl-club-icon">{club.icon}</div>
                <h3>{club.name}</h3>
                <span>{club.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Housing */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px' }}>
        <div className="reveal-left" style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80"
            alt="Women's hostel at VWU"
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '380px' }}
            loading="lazy"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,28,84,0.25)' }} />
        </div>
        <div className="reveal-right" style={{ background: 'var(--color-primary)', padding: 'var(--space-12) var(--space-10)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Campus Hostels</span>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-6)' }}>Your Home Away from Home</h2>
          <div className="sl-housing-list">
            {housing.map(h => (
              <div key={h.name} className="sl-housing-item">
                <div className="sl-housing-name">{h.name}</div>
                <div className="sl-housing-type">{h.type}</div>
                <div className="sl-housing-desc">{h.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/student-life" className="btn btn-accent" style={{ alignSelf: 'flex-start', marginTop: 'var(--space-6)' }}>
            Explore Housing Options
          </Link>
        </div>
      </section>

      {/* Athletics */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="sl-athletics-header reveal">
            <div>
              <span className="section-label">VWU Sports</span>
              <h2 className="section-title">Sports & Games at VWU</h2>
              <p className="section-desc">
                VWU encourages holistic development through a wide range of sports
                facilities, inter-college tournaments, and state-level competitions.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"
              alt="VWU sports and athletics"
              className="sl-athletics-image reveal-scale"
              loading="lazy"
            />
          </div>
          <div className="sl-sports-grid">
            {athletics.map((s, i) => (
              <div key={s.sport} className="sl-sport-card reveal" data-delay={`${i * 40}`}>
                <span className="sl-sport-icon">{s.icon}</span>
                <div className="sl-sport-name">{s.sport}</div>
                <span className="sl-sport-season">{s.season}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Services */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">Support</span>
            <h2 className="section-title">We're Here for You</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              From your first day to graduation, VWU's student services team is dedicated to your success.
            </p>
          </div>
          <div className="sl-services-grid">
            {services.map((s, i) => (
              <div key={s.title} className="sl-service-card reveal" data-delay={`${i * 80}`}>
                <div className="sl-service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to="/student-life" className="sl-service-link">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div className="sl-dining-grid">
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Campus Dining</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Nutritious, Delicious, and Convenient</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-lg)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                VWU's campus food courts serve hygienic, freshly prepared vegetarian and
                non-vegetarian meals. Separate mess facilities are available for hostel residents.
              </p>
              <div className="sl-dining-features">
                {['On-campus food court', 'Hostel mess facility', 'Hygienic & fresh meals daily', 'Vegetarian & non-vegetarian options', 'Affordable meal plans'].map(f => (
                  <div key={f} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 900 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80"
                alt="Campus dining hall"
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-off-white">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label">Take the Next Step</span>
            <h2 className="section-title">Ready to Join VWU?</h2>
            <p className="section-desc" style={{ margin: '0 auto var(--space-8)' }}>
              Schedule a campus visit and experience student life at VWU for yourself.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-primary btn-lg">Plan My Visit Now</Link>
              <Link to="/admissions" className="btn btn-outline btn-lg">Apply for Free</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
