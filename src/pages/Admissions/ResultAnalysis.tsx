import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import { Trophy } from 'lucide-react';

export default function ResultAnalysis() {
  const highlights = useContentBlocks('result-analysis', 'highlights');
  const departmentStats = useContentBlocks('result-analysis', 'departmentStats');
  const factors = useContentBlocks('result-analysis', 'factors');

  useEffect(() => {
    document.title = 'Result Analysis | VWU';
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
        page="result-analysis"
        defaultImage="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1920&q=80"
        defaultTitle="Result Analysis"
  defaultSubtitle="VWU consistently ranks among the top 5 affiliated colleges of JNTU Kakinada with 90%+ annual pass rates."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Result Analysis' }]}
        scrollCtaTargetId="result-analysis-content"
      />

      {/* Key Statement Banner */}
      <section id="result-analysis-content" style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 700, color: 'var(--color-accent)', fontStyle: 'italic', maxWidth: 820, margin: '0 auto', lineHeight: 1.7 }}>
            "Shri Vishnu Engineering College for Women always stands one among the top five affiliated colleges of JNTU Kakinada in terms of pass percentage."
          </blockquote>
        </div>
      </section>

      {/* Highlights */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Academic Excellence</span>
            <h2 className="section-title">Result Highlights</h2>
          </div>
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
            {highlights.map((h) => {
              const Icon = resolveContentIcon(h.icon) || Trophy;
              return (
                <div key={h.id}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', textAlign: 'center', transition: 'all var(--transition-base)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={38} strokeWidth={1.75} /></div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 4 }}>{h.value}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>{h.title}</div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Department-wise */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Department Performance</span>
            <h2 className="section-title">Department-Wise Results</h2>
          </div>
          <div style={{ borderRadius: 'var(--radius-md)', overflowX: 'auto', overflowY: 'hidden', boxShadow: 'var(--shadow-md)', maxWidth: 720, margin: '0 auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-white)' }}>
              <thead>
                <tr style={{ background: 'var(--color-primary)' }}>
                  {['Department', 'Approx. Pass Rate', 'Distinction'].map(h => (
                    <th key={h} style={{ padding: 'var(--space-4) var(--space-5)', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((d, i) => (
                  <tr key={d.id} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ padding: 'var(--space-4) var(--space-5)', fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--color-light-gray)' }}>{d.title}</td>
                    <td style={{ padding: 'var(--space-4) var(--space-5)', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--color-light-gray)' }}>
                      <span style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--color-primary)', fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(201,168,76,0.3)' }}>{d.value}</span>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-light-gray)' }}>{d.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Success Factors */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Why We Excel</span>
            <h2 style={{ color: 'var(--color-white)' }} className="section-title">Factors Behind Our Results</h2>
          </div>
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
            {factors.map((f) => {
              const Icon = resolveContentIcon(f.icon) || Trophy;
              return (
                <div key={f.id}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                >
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={32} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{f.desc}</p>
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
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Join a College That Delivers Results</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admission-procedure" className="btn btn-accent">How to Apply</Link>
              <Link to="/programmes-fee-structure" className="btn btn-secondary">Fee Structure</Link>
              <Link to="/admissions" className="btn btn-secondary">Admissions Home</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
