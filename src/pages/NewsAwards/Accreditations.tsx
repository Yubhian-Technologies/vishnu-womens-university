import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { awards, AwardItem } from './news-awards.data';

const tabs = [
  { key: 'ranking', label: 'Rankings & Ratings' },
  { key: 'award', label: 'Awards & Recognitions' },
  { key: 'accreditation', label: 'Accreditations & Approvals' },
] as const;

type TabKey = typeof tabs[number]['key'];

const categoryIcons: Record<TabKey, string> = {
  ranking: '📊',
  award: '🏆',
  accreditation: '✅',
};

function AwardCard({ item, index }: { item: AwardItem; index: number }) {
  return (
    <div
      className="reveal"
      data-delay={`${index * 50}`}
      style={{
        background: 'var(--color-white)',
        border: '1.5px solid var(--color-light-gray)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.4, flex: 1 }}>
          {item.name}
        </h3>
        {item.year && (
          <span style={{ flexShrink: 0, fontSize: 'var(--text-xs)', fontWeight: 700, background: 'var(--color-accent)', color: 'var(--color-white)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
            {item.year}
          </span>
        )}
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', lineHeight: 1.5 }}>
        <strong>Issued by:</strong> {item.issuedBy}
      </p>
      {item.details && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.55, borderTop: '1px solid var(--color-light-gray)', paddingTop: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
          {item.details}
        </p>
      )}
    </div>
  );
}

export default function Accreditations() {
  const [activeTab, setActiveTab] = useState<TabKey>('ranking');

  useEffect(() => {
    document.title = 'Accreditations & Awards | Vishnu Womens University';
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
  }, [activeTab]);

  const filtered = awards.filter(a => a.category === activeTab);
  const counts = { ranking: awards.filter(a => a.category === 'ranking').length, award: awards.filter(a => a.category === 'award').length, accreditation: awards.filter(a => a.category === 'accreditation').length };

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 340 }}>
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
          alt="Accreditations and Awards at VWU"
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/news-awards" className="breadcrumb-item">News & Awards</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">Accreditations & Awards</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <span>🏆</span> Recognition & Quality
          </div>
          <h1 className="animate-fade-in-up">Accreditations & Awards</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Recognised by India's leading bodies for quality, innovation, and academic excellence — a record built over two decades.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{counts.ranking}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Rankings & Ratings</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{counts.award}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Awards & Recognitions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{counts.accreditation}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>Accreditations & Approvals</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Cards */}
      <section className="section bg-off-white">
        <div className="container">
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  background: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-white)',
                  borderColor: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-light-gray)',
                  color: activeTab === tab.key ? 'var(--color-white)' : 'var(--color-text)',
                }}
              >
                <span>{categoryIcons[tab.key]}</span>
                {tab.label}
                <span style={{
                  fontSize: 'var(--text-xs)',
                  background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : 'var(--color-light-gray)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {filtered.map((item, i) => (
              <AwardCard key={item.name} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More at VWU</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/news-awards/happenings" className="btn btn-accent">Happenings at VWU</Link>
              <Link to="/news-awards/gallery" className="btn btn-secondary">Gallery</Link>
              <Link to="/news-awards" className="btn btn-secondary">Back to News & Awards</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
