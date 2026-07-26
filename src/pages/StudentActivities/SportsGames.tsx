import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { Activity, BadgeCheck } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { resolveContentIcon } from '../../lib/contentIcons';

const defaultApproachPhoto = [
  { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80', alt: 'Students at VWU sports', caption: '' },
];

export default function SportsGames() {
  const facilities = useContentBlocks('sports-games', 'facilities');
  const sportsProgram = useContentBlocks('sports-games', 'program');
  const achievements = useContentBlocks('sports-games', 'achievements');
  const approachPhoto = useSitePhotos('sports-games', 'main', defaultApproachPhoto)[0];

  useEffect(() => {
    document.title = 'Sports & Games | VWU';
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
        page="sports-games"
        defaultTitle="Sports & Games"
  defaultSubtitle="Physical fitness is taken seriously at VWU — a sound body supports a sound mind, and both are essential to a complete education."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Sports & Games' }]}
        scrollCtaTargetId="sports-games-content"
      />

      {/* Philosophy */}
      <section id="sports-games-content" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="grid-img-text">
            <div className="reveal-left">
              <span className="section-label">Our Approach</span>
              <h2 className="section-title">Sports as a Core Pillar</h2>
              <div className="divider" />
              <blockquote style={{ borderLeft: '4px solid var(--color-accent)', paddingLeft: 'var(--space-5)', marginBottom: 'var(--space-5)', fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)', fontStyle: 'italic', lineHeight: 1.8 }}>
                "A sound mind dwells in a sound body. Physical exercises keep one healthy and fit."
              </blockquote>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                At VWU, sport and physical activity are not afterthoughts — they are a deliberate part of student
                development, given serious attention alongside academics. Every student is encouraged to take part,
                compete, and push herself.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                A qualified female <strong>Physical Director</strong> manages all day-to-day athletic programs
                and prepares students to represent VWU at university and inter-collegiate competitions.
              </p>
            </div>
            <div className="reveal-right">
              <img
                src={approachPhoto.src}
                alt={approachPhoto.alt}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Infrastructure</span>
            <h2 className="section-title">Sports Facilities</h2>
          </div>
          <div className="grid-4">
            {facilities.map((f) => {
              const Icon = resolveContentIcon(f.icon) || Activity;
              return (
                <div key={f.id}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={35} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sports Program + Achievements */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid-2">
            <div className="reveal-left">
              <span className="section-label">Program Structure</span>
              <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>Sports Program Highlights</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                {sportsProgram.map((sp) => (
                  <div key={sp.id} style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)' }}>
                    <div style={{ minWidth: 130, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: 2 }}>{sp.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.5 }}>{sp.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <span className="section-label">Excellence</span>
              <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>Sports Achievements</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                {achievements.map((a) => {
                  const Icon = resolveContentIcon(a.icon) || BadgeCheck;
                  return (
                    <div key={a.id} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                      <Icon size={29} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', marginBottom: 4 }}>{a.title}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{a.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
              <Link to="/social-services" className="btn btn-secondary">Social Services</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
