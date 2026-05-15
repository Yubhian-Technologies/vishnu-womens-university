import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const highlights = [
  { icon: '🏆', value: 'Top 5', label: 'Among JNTUK Affiliated Colleges', desc: 'VWU consistently ranks in the top 5 affiliated engineering colleges under JNTU Kakinada in terms of pass percentage.' },
  { icon: '📈', value: '90%+', label: 'Annual Pass Rate', desc: 'More than ninety percent of students receive their Engineering Degree every academic year across all departments.' },
  { icon: '🥇', value: 'Gold Medals', label: 'University Rank Holders', desc: 'Students from VWU frequently achieve university Gold Medals, with many receiving multiple awards in a single convocation.' },
  { icon: '🎓', value: '1,400+', label: 'Students Placed (2024–25)', desc: 'Record placements each year with leading companies including Amazon, TCS, Infosys, Wipro, and 150+ other recruiters.' },
];

const departmentStats = [
  { dept: 'CSE', passRate: '95%', ranks: 'Multiple Gold Medalists' },
  { dept: 'ECE', passRate: '93%', ranks: 'University Rank Holders' },
  { dept: 'IT', passRate: '94%', ranks: 'University Rank Holders' },
  { dept: 'EEE', passRate: '91%', ranks: 'University Rank Holders' },
  { dept: 'ME', passRate: '90%', ranks: 'University Rank Holders' },
  { dept: 'CE', passRate: '92%', ranks: 'University Rank Holders' },
  { dept: 'AI', passRate: '94%', ranks: 'University Rank Holders' },
  { dept: 'MBA', passRate: '93%', ranks: 'University Rank Holders' },
];

const factors = [
  { icon: '📖', title: 'Rigorous Academic Curriculum', desc: 'Industry-aligned curriculum updated regularly with inputs from academia and industry experts.' },
  { icon: '👩‍🏫', title: '230+ Expert Faculty', desc: 'Highly qualified faculty with doctoral degrees, research experience, and industry exposure.' },
  { icon: '🔬', title: 'State-of-the-Art Labs', desc: '50+ specialised labs providing hands-on practical training alongside theoretical learning.' },
  { icon: '📊', title: 'Continuous Assessment', desc: 'Regular internal assessments, remedial classes, and personalised mentoring for every student.' },
  { icon: '🏅', title: 'Competitive Coaching', desc: 'Dedicated coaching for GATE, GRE, and competitive exams to boost higher education outcomes.' },
  { icon: '🤝', title: 'Industry Partnerships', desc: 'MoUs with leading companies enable real-world project exposure and internship opportunities.' },
];

export default function ResultAnalysis() {
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
      />

      {/* Key Statement Banner */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
            {highlights.map((h, i) => (
              <div key={h.label} className="reveal" data-delay={`${i * 80}`}
                style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', textAlign: 'center', transition: 'all var(--transition-base)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: 'var(--space-3)' }}>{h.icon}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 4 }}>{h.value}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>{h.label}</div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{h.desc}</p>
              </div>
            ))}
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
          <div className="reveal" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', maxWidth: 720, margin: '0 auto' }}>
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
                  <tr key={d.dept} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ padding: 'var(--space-4) var(--space-5)', fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--color-light-gray)' }}>{d.dept}</td>
                    <td style={{ padding: 'var(--space-4) var(--space-5)', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--color-light-gray)' }}>
                      <span style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--color-primary)', fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(201,168,76,0.3)' }}>{d.passRate}</span>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', borderBottom: '1px solid var(--color-light-gray)' }}>{d.ranks}</td>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
            {factors.map((f, i) => (
              <div key={f.title} className="reveal" data-delay={`${i * 70}`}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', transition: 'all var(--transition-base)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
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
