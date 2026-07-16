import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Handshake, Palette, type LucideIcon } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import type { ClubDoc } from '../Admin/sections/StudentClubsAdmin';
import { CLUB_CATEGORIES } from '../Admin/sections/StudentClubsAdmin';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Technical Clubs': Laptop,
  'Social & Service Clubs': Handshake,
  'Creative & Arts Clubs': Palette,
};

export default function StudentClubs() {
  const { docs: allClubs } = useOrderedCollection<ClubDoc>('studentClubs', 'order');
  const stats = useContentBlocks('student-clubs', 'stats');

  const clubCategories = useMemo(() => (
    CLUB_CATEGORIES
      .map((label) => ({ label, icon: CATEGORY_ICONS[label], clubs: allClubs.filter((c) => c.category === label) }))
      .filter((cat) => cat.clubs.length > 0)
  ), [allClubs]);

  useEffect(() => {
    document.title = 'Student Clubs | VWU';
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
        page="student-clubs"
        defaultImage="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
        defaultTitle="Student Clubs"
  defaultSubtitle="23 active clubs across technology, social service, arts, and culture — VWU has a community for every interest."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Student Clubs' }]}
        scrollCtaTargetId="student-clubs-content"
      />

      {/* Stats */}
      <section id="student-clubs-content" style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.id} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Categories — rendered from Firestore, so no scroll-reveal
          animation here (see the gotcha documented in CLAUDE.md). */}
      {clubCategories.map((cat, ci) => (
        <section key={cat.label} className={`section ${ci % 2 === 0 ? 'bg-off-white' : 'bg-white'}`}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <cat.icon size={32} strokeWidth={1.75} />
                <span className="section-label" style={{ position: 'static', marginBottom: 0 }}>{cat.label}</span>
              </div>
              <h2 className="section-title">{cat.label}</h2>
            </div>
            <div className="grid-4">
              {cat.clubs.map((club) => (
                <div key={club.id}
                  style={{ background: ci % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', transition: 'all var(--transition-base)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.3 }}>{club.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{club.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More Student Activities</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/vishnu-tv-academy" className="btn btn-accent">Vishnu TV Academy</Link>
              <Link to="/social-services" className="btn btn-secondary">Social Services</Link>
              <Link to="/arts-culture" className="btn btn-secondary">Arts & Culture</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
