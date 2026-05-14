import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const magazines = [
  {
    icon: '📰',
    name: 'Campus Browser',
    type: 'Newsletter',
    since: 'June 2003',
    patron: 'Sri K.V. Vishnu Raju, Chairman, SVES',
    desc: 'Campus Browser has been documenting the progressive strides of VWU and all SVES institutions since June 2003. The newsletter covers academics, co-curricular activities, events, and community initiatives — forming an ongoing chronicle of campus life.',
    highlights: ['Academic achievements & milestones', 'Co-curricular activity coverage', 'Community and outreach initiatives', 'Institutional news & updates'],
    color: 'var(--color-primary)',
  },
  {
    icon: '📖',
    name: 'Vishnu Era',
    type: 'Quarterly Magazine',
    since: 'Ongoing',
    patron: 'Sri Vishnu Educational Society',
    desc: 'Vishnu Era is the flagship quarterly magazine of SVES that "gives a bird\'s eye view of the saga of SVES." It highlights the activities and contributions of students and staff across all SVES institutions with a rich mix of content.',
    highlights: ['Technical & literary articles', '"Upper Cut" — profiles of influential figures', 'Alumni success stories from abroad', 'Thought-provoking essays & science articles'],
    color: '#7b1fa2',
  },
  {
    icon: '💡',
    name: 'Prathibha',
    type: 'Digital Magazine',
    since: 'Ongoing',
    patron: 'VWU Students & Faculty',
    desc: 'Prathibha is a student magazine available in digital flip-book format, showcasing the creativity, technical insights, and literary talent of VWU students in an accessible online format.',
    highlights: ['Digital flip-book format', 'Student creative contributions', 'Technical articles & projects', 'Available online via VWU portal'],
    color: '#1565c0',
  },
];

export default function CampusMagazines() {
  useEffect(() => {
    document.title = 'Campus Magazines | VWU';
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
        <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80" alt="Campus Magazines" className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/academics" className="breadcrumb-item">Academics</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Campus Magazines</span>
          </div>
          <h1 className="animate-fade-in-up">Campus Magazines</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Three publications capturing the academic achievements, creative voices, and campus life at VWU and SVES.
          </p>
        </div>
      </section>

      {/* Magazines */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-14)' }}>
            <span className="section-label">Publications</span>
            <h2 className="section-title">Our Campus Publications</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              From newsletters to quarterly magazines and digital flip-books — VWU's student voices reach across formats.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {magazines.map((mag, i) => (
              <div key={mag.name} className={i % 2 === 0 ? 'reveal-left' : 'reveal-right'}
                style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-10)', background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ background: mag.color, padding: 'var(--space-10)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ fontSize: '4rem' }}>{mag.icon}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--color-white)' }}>{mag.name}</div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', padding: '4px 14px', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{mag.type}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Since {mag.since}</div>
                </div>
                <div style={{ padding: 'var(--space-8)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>Under the patronage of</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>{mag.patron}</div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>{mag.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {mag.highlights.map((h) => (
                      <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 900 }}>✓</span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More Student Activities</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/student-clubs" className="btn btn-accent">Student Clubs</Link>
              <Link to="/arts-culture" className="btn btn-secondary">Arts & Culture</Link>
              <Link to="/vishnu-tv-academy" className="btn btn-secondary">Vishnu TV Academy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
