import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const focusAreas = [
  { icon: '📚', title: 'Education', desc: 'Guest lectures, laboratory experiments, classroom presentations, and workshop recordings made accessible to the entire campus community.' },
  { icon: '🎬', title: 'Entertainment', desc: 'Student-produced entertainment programs, creative shows, and campus experiences that capture the spirit of life at VWU.' },
  { icon: '📅', title: 'Events', desc: 'Live and recorded coverage of symposia, cultural fests, sports days, and all major campus events.' },
  { icon: '📰', title: 'News', desc: 'Campus news bulletins, institutional updates, and student journalism keeping the VWU community informed.' },
];

const docTopics = [
  'Health Care & Hygiene',
  'Personality Development',
  'Child Labour Awareness',
  "Women's Education & Empowerment",
  'Environmental Concerns',
  'Social Issues',
];

const productions = [
  { icon: '🎥', label: 'Documentary Films' },
  { icon: '🎤', label: 'Guest Lecture Recordings' },
  { icon: '🔬', label: 'Lab Experiment Videos' },
  { icon: '📋', label: 'Seminar & Workshop Coverage' },
  { icon: '💡', label: 'Student-Developed Programs' },
  { icon: '🎓', label: 'Classroom Presentations' },
];

export default function VishnuTV() {
  useEffect(() => {
    document.title = 'Vishnu TV Academy | VWU';
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
      <section className="page-hero" style={{ minHeight: 360 }}>
        <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80" alt="Vishnu TV Academy" className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/academics" className="breadcrumb-item">Academics</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Vishnu TV Academy</span>
          </div>
          <h1 className="animate-fade-in-up">Vishnu TV Academy</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            By the students. For the students. — The only campus TV Academy in Andhra Pradesh.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-14)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label">About</span>
              <h2 className="section-title">A First in Andhra Pradesh</h2>
              <div className="divider" />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                The <strong>Vishnu TV Academy</strong> is the only campus in Andhra Pradesh to have a TV Academy
                built exclusively for students. Inspired by and built upon the success of
                <strong> Radio Vishnu 90.4</strong>, the academy embodies a simple but powerful philosophy —
                every program is created <em>"by the students, for the students."</em>
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                Students at Vishnu TV Academy take complete ownership of content creation — from conceptualisation
                to production — developing real-world skills in filmmaking, journalism, anchoring, and digital media
                while contributing meaningfully to campus life.
              </p>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=900&q=80"
                alt="Students in TV studio"
                style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">What We Cover</span>
            <h2 className="section-title">Four Pillars of Vishnu TV</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
            {focusAreas.map((f, i) => (
              <div key={f.title} className="reveal" data-delay={`${i * 80}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderTop: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-3)' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentary Topics + Productions */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>
            <div className="reveal-left">
              <span className="section-label">Documentary Films</span>
              <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>Social Impact Stories</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
                Students create documentary films addressing real social challenges, giving future engineers and technologists a lens to understand the world they are building for.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {docTopics.map((t) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 900 }}>›</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <span className="section-label">Content We Produce</span>
              <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>Production Types</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
                Beyond documentaries, the academy captures the full breadth of campus academic and creative life.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {productions.map((p) => (
                  <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{p.icon}</span>
                    <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--color-primary)' }}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More Student Activities</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/student-clubs" className="btn btn-accent">Student Clubs</Link>
              <Link to="/arts-culture" className="btn btn-secondary">Arts & Culture</Link>
              <Link to="/sports-games" className="btn btn-secondary">Sports & Games</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
