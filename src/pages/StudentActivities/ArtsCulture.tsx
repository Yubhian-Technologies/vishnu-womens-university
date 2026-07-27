import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { PartyPopper } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { resolveContentIcon } from '../../lib/contentIcons';

const defaultPhilosophyPhoto = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Cultural performances at VWU', caption: '' },
];

export default function ArtsCulture() {
  const initiatives = useContentBlocks('arts-culture', 'initiatives');
  const events = useContentBlocks('arts-culture', 'events');
  const philosophyPhoto = useSitePhotos('arts-culture', 'main', defaultPhilosophyPhoto)[0];

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
        defaultTitle="Arts & Culture"
  defaultSubtitle="Nurturing creativity, preserving heritage, and building a sense of belonging — developing responsible and culturally grounded leaders."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Arts & Culture' }]}
        scrollCtaTargetId="arts-culture-content"
      />

      {/* Philosophy */}
      <section id="arts-culture-content" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="grid-img-text">
            <div className="reveal-left">
              <span className="section-label">Our Philosophy</span>
              <h2 className="section-title">Culture is the Heart of Education</h2>
              <div className="divider" />
              <blockquote style={{ borderLeft: '4px solid var(--color-accent)', paddingLeft: 'var(--space-5)', marginBottom: 'var(--space-5)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-primary)', fontStyle: 'italic', lineHeight: 1.8 }}>
                "A healthy Nation would be built only when we have a strong force of cultured and responsible youngsters."
              </blockquote>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                At VWU, learning extends well beyond the classroom. Cultural participation, artistic expression, and social
                awareness are treated as integral to a complete education — not supplementary, but essential.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                Campus life is shaped by the spirit of <strong>"Vasudhaika Kutumbakam"</strong> — the world is one family —
                and every Indian festival is observed with the energy and inclusivity that defines VWU
                as a community.
              </p>
            </div>
            {philosophyPhoto && (
              <div>
                <img
                  src={philosophyPhoto.src}
                  alt={philosophyPhoto.alt}
                  style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                />
              </div>
            )}
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
          <div className="grid-4">
            {initiatives.map((init) => {
              const Icon = resolveContentIcon(init.icon) || PartyPopper;
              return (
                <div key={init.id}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={35} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{init.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{init.desc}</p>
                </div>
              );
            })}
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
              Three major annual events that offer students an outlet for knowledge, recreation, fine arts, creative expression, and meaningful interaction.
            </p>
          </div>
          <div className="grid-3">
            {events.map((ev) => {
              const Icon = resolveContentIcon(ev.icon) || PartyPopper;
              return (
                <div key={ev.id}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)', padding: 'var(--space-8)', textAlign: 'center', transition: 'all var(--transition-base)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                >
                  <div style={{ marginBottom: 'var(--space-4)' }}><Icon size={48} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>{ev.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{ev.desc}</p>
                </div>
              );
            })}
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
