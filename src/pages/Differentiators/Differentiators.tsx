import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Factory, Microscope, Globe2, GraduationCap } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useOrderedCollection } from '../../hooks/useCollection';
import { DIFFERENTIATOR_CATEGORIES } from '../Admin/sections/DifferentiatorsAdmin';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import './Differentiators.css';

// Fixed top-level categories — not admin content. Items within each are Firestore-backed.
const CATEGORY_ICONS: Record<string, typeof Rocket> = {
  innovation: Rocket, industry: Factory, research: Microscope, global: Globe2, student: GraduationCap,
};
const categoryMeta = DIFFERENTIATOR_CATEGORIES.map((c) => ({ ...c, id: c.id, icon: CATEGORY_ICONS[c.id] || Rocket }));

export default function Differentiators() {
  useHashScroll();
  const { docs: allItems } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const categories = useMemo(() => categoryMeta.map((cat) => ({
    ...cat,
    items: allItems.filter((i) => i.category === cat.id),
  })), [allItems]);

  useEffect(() => {
    document.title = "Differentiators | Vishnu Women's University";
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

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="differentiators"
        defaultTitle="What Sets VWU Apart"
  defaultSubtitle="Distinctive initiatives in innovation, industry engagement, research, international outreach, and student development — all aimed at producing well-rounded women engineers."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Differentiators' }]}
      />

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {[
              { num: `${totalItems}+`, label: 'Unique Initiatives' },
              { num: `${categories.length}`, label: 'Focus Areas' },
              { num: '15+', label: 'Industry Partners' },
              { num: '3', label: 'International Centres' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick-jump nav */}
      <section style={{ background: 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat) => (
              <a key={cat.id} href={`#${cat.id}`} className="diff-jump-pill">
                <cat.icon size={16} strokeWidth={1.75} /> {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Category sections */}
      {categories.map((cat, ci) => (
        <section key={cat.id} id={cat.id} className={`section ${ci % 2 === 0 ? 'bg-off-white' : 'bg-white'}`} style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                <div className="diff-category-icon">
                  <cat.icon size={26} strokeWidth={1.75} />
                </div>
                <div>
                  <span className="section-label" style={{ position: 'static', marginBottom: 0 }}>{cat.label}</span>
                  <h2 className="section-title" style={{ margin: 0 }}>{cat.label}</h2>
                </div>
              </div>
            </div>

            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
              {cat.items.map((item) => (
                <div key={item.slug} className={`diff-item-card${ci % 2 === 0 ? '' : ' diff-item-card--alt'}`}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', marginBottom: 'var(--space-3)' }} />

                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.35 }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-4)' }}>
                    {item.desc}
                  </p>

                  {/* Learn More */}
                  {item.external && item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="diff-item-link">
                      Learn More
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2.5 9.5l7-7M4 2.5h5.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ) : (
                    <Link to={`/differentiators/${item.slug}`} className="diff-item-link">
                      Learn More
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  )}
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
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Experience the VWU Difference
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto var(--space-6)' }}>
              Visit VWU in person to see these initiatives firsthand. Schedule a campus visit and explore the ecosystem built for India's next generation of women technologists.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/apply-now" className="btn btn-accent">Apply Now</Link>
              <Link to="/campus" className="btn btn-secondary">Campus Life</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
