import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FlaskConical, Handshake } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useHashScroll } from '../../hooks/useHashScroll';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { ResearchItemDoc } from '../Admin/sections/ResearchItemsAdmin';

// Fixed, always-present category shells — the items within each one are
// admin-editable (researchItems collection), matching the pattern used by
// Governance's governance/committees/iqac categories.
const researchCategories = [
  { key: 'governance' as const, label: 'R&D Governance', desc: 'The committees and centers that set policy, oversee ethics, and protect intellectual property across every research activity at VWU.', icon: ShieldCheck },
  { key: 'output' as const, label: 'Research Output', desc: 'Funded projects, seed money grants, publications, and patents produced by VWU faculty and students.', icon: FlaskConical },
  { key: 'engagement' as const, label: 'Industry & Professional Engagement', desc: 'Partnerships, consultancy work, and professional body chapters that connect VWU research to the wider industry and academic community.', icon: Handshake },
];

export default function Research() {
  const { docs: researchItems } = useOrderedCollection<ResearchItemDoc>('researchItems', 'order');
  useHashScroll();

  useEffect(() => {
    document.title = 'Research & Development | Vishnu Womens University';
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
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      <PageHero
        page="research"
        defaultImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1920&q=60&auto=format"
        defaultTitle="Research & Development"
        defaultSubtitle="From funded projects and patents to industry MoUs and professional bodies — a look at how VWU builds knowledge that matters."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Research & Development' }]}
      />

      {/* Quick-jump nav */}
      <div style={{ background: 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)', position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height))', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {researchCategories.map(cat => (
            <a
              key={cat.key}
              href={`#${cat.key}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 'var(--space-3) var(--space-5)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none', whiteSpace: 'nowrap', borderBottom: '3px solid transparent', transition: 'all var(--transition-fast)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--color-accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text)'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; }}
            >
              <cat.icon size={14} /> {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* Category sections — items are Firestore-derived, so no scroll-reveal
          animation on the cards themselves (see the gotcha documented in
          CLAUDE.md). */}
      {researchCategories.map((cat, ci) => {
        const items = researchItems.filter(i => i.category === cat.key);
        return (
          <section
            key={cat.key}
            id={cat.key}
            className={`section ${ci % 2 === 0 ? 'bg-off-white' : 'bg-white'}`}
            style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 3.5rem)' }}
          >
            <div className="container">
              <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
                <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><cat.icon size={14} /> {cat.label}</span>
                <h2 className="section-title">{cat.label}</h2>
                <p style={{ color: 'var(--color-text-light)', maxWidth: 600, lineHeight: 1.7 }}>{cat.desc}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
                {items.map((item) => {
                  const Icon = resolveContentIcon(item.icon) || cat.icon;
                  return (
                    <div
                      key={item.slug}
                      style={{ background: ci % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', transition: 'all var(--transition-base)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                    >
                      <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={32} strokeWidth={1.75} /></div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.35 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-4)' }}>
                        {item.desc}
                      </p>
                      <Link
                        to={`/research/${item.slug}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-light-gray)', marginTop: 'auto' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
                      >
                        Learn More
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More About VWU</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/academics" className="btn btn-accent">Academics</Link>
              <Link to="/differentiators" className="btn btn-secondary">Differentiators</Link>
              <Link to="/governance" className="btn btn-secondary">Governance</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
