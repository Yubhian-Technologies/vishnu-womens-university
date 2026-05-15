import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const initiatives = [
  {
    icon: '🎊',
    title: 'Festival Celebrations',
    desc: 'VWU maintains a traditional atmosphere celebrating all Indian festivals with utmost enthusiasm, fostering an inclusive community spirit of "Vasudhaika Kutumbakam" — the world is one family.',
  },
  {
    icon: '🎨',
    title: 'Artistic Development',
    desc: 'Students with creative passions receive encouragement, mentoring, and facility access for painting, photography, music, and decorative art — nurturing talent alongside technical education.',
  },
  {
    icon: '🎭',
    title: 'Performing Arts',
    desc: 'Dance, drama, and music form the heart of campus performing arts. Through dedicated clubs and events, students develop their talent and bring it to life on stage.',
  },
  {
    icon: '📸',
    title: 'Photography & Film',
    desc: 'The Flash It Out Club and Vishnu TV Academy give students professional outlets for photography and filmmaking, documenting campus life and creating impactful visual stories.',
  },
];

const events = [
  {
    icon: '🌟',
    name: 'Annual Day',
    desc: 'The flagship annual celebration of VWU — showcasing student talent through cultural performances, awards, and recognition of academic and co-curricular excellence.',
  },
  {
    icon: '🔬',
    name: 'Medha Milan',
    desc: 'A national-level technical symposium bringing together students from across Andhra Pradesh and Telangana for technical competitions, paper presentations, and cultural events.',
  },
  {
    icon: '🏅',
    name: 'Sports Day',
    desc: 'Annual Sports Day celebrating athletic talent and the spirit of healthy competition, with track events, field sports, and special recognition for outstanding athletes.',
  },
];

export default function ArtsCulture() {
  useEffect(() => {
    document.title = 'Arts & Culture | VWU';
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
        page="arts-culture"
        defaultImage="https://images.unsplash.com/photo-1545959570-a94084071b5d?w=1920&q=80"
        defaultTitle="Arts & Culture"
  defaultSubtitle="Cultivating creativity, heritage, and a sense of belonging — shaping cultured and responsible leaders of tomorrow."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Arts & Culture' }]}
      />

      {/* Philosophy */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-14)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label">Our Philosophy</span>
              <h2 className="section-title">Culture is the Heart of Education</h2>
              <div className="divider" />
              <blockquote style={{ borderLeft: '4px solid var(--color-accent)', paddingLeft: 'var(--space-5)', marginBottom: 'var(--space-5)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-primary)', fontStyle: 'italic', lineHeight: 1.8 }}>
                "A healthy Nation would be built only when we have a strong force of cultured and responsible youngsters."
              </blockquote>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                At VWU, education goes far beyond academic preparation. We believe that cultural engagement,
                artistic expression, and social awareness are essential pillars of a complete education —
                not extras, but necessities.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                Our campus maintains the spirit of <strong>"Vasudhaika Kutumbakam"</strong> — the world is one family —
                celebrating every Indian festival with the enthusiasm and community spirit that makes VWU
                a truly inclusive place to live and learn.
              </p>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=900&q=80"
                alt="Cultural performances at VWU"
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">What We Do</span>
            <h2 className="section-title">Cultural Initiatives</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
            {initiatives.map((init, i) => (
              <div key={init.title} className="reveal" data-delay={`${i * 80}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: 'var(--space-3)' }}>{init.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{init.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{init.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Events */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Signature Events</span>
            <h2 style={{ color: 'var(--color-white)' }} className="section-title">Our Annual Celebrations</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 600, margin: '0 auto', fontSize: 'var(--text-base)' }}>
              Three flagship events each year provide "ventilation to knowledge, recreation, fine arts, creative ideas, and insightful interaction."
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
            {events.map((ev, i) => (
              <div key={ev.name} className="reveal" data-delay={`${i * 100}`}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', textAlign: 'center', transition: 'all var(--transition-base)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{ev.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>{ev.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{ev.desc}</p>
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
              <Link to="/sports-games" className="btn btn-secondary">Sports & Games</Link>
              <Link to="/vishnu-tv-academy" className="btn btn-secondary">Vishnu TV Academy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
