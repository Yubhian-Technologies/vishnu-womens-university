import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { findProgramBySlug } from './programs.data';
import '../detail-layout.css';

const categoryLabel: Record<string, string> = {
  btech: 'B.Tech',
  mtech: 'M.Tech',
  mba: 'MBA',
  phd: 'Ph.D.',
};

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const program = slug ? findProgramBySlug(slug) : undefined;

  useEffect(() => {
    if (program) {
      document.title = `${program.shortName} | Vishnu Womens University`;
    }
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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [program]);

  if (!program) return <Navigate to="/academics" replace />;

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 380 }}>
        <img src={program.heroImage} alt={program.name} className="page-hero-image" />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/academics" className="breadcrumb-item">Academics</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{program.shortName}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-primary-dark)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {categoryLabel[program.category]}
          </div>
          <h1 className="animate-fade-in-up">{program.name}</h1>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-5) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
            {[
              { label: 'Annual Intake', value: `${program.intake} Seats` },
              { label: 'Established', value: program.established },
              { label: 'Accreditation', value: program.accreditation },
              ...(program.hod ? [{ label: 'Head of Department', value: program.hod }] : []),
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Highlights */}
      <section className="section bg-white">
        <div className="container">
          <div className="detail-grid">
            {/* Main content */}
            <div>
              <div className="reveal-left">
                <span className="section-label">About the Programme</span>
                <h2 className="section-title">{program.shortName}</h2>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.85, fontSize: 'var(--text-base)', marginBottom: 'var(--space-6)' }}>
                  {program.about}
                </p>
              </div>

              {/* Programme Highlights */}
              <div className="reveal" style={{ marginTop: 'var(--space-8)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
                  Programme Highlights
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                  {program.highlights.map((h) => (
                    <li key={h} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', color: 'var(--color-text)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 900, fontSize: '1rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="detail-sidebar">
              <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {/* Career Outcomes */}
                <div className="reveal" style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-3)', borderBottom: '2px solid var(--color-accent)' }}>
                    Career Outcomes
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {program.outcomes.map((o) => (
                      <li key={o} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-light-gray)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, display: 'inline-block' }} />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Card */}
                <div className="reveal" style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>{program.icon}</div>
                  <h4 style={{ color: 'var(--color-white)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>Interested in {program.shortName}?</h4>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)', lineHeight: 1.6 }}>Apply through EAPCET (Code: VISW) or contact our admissions team.</p>
                  <Link to="/admissions" className="btn btn-accent" style={{ display: 'block', marginBottom: 'var(--space-2)', textAlign: 'center' }}>Apply Now</Link>
                  <Link to="/programmes-fee-structure" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center' }}>View Fee Structure</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Labs & Resources */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Infrastructure</span>
            <h2 className="section-title">Labs & Resources</h2>
            <p className="section-desc">State-of-the-art laboratory facilities that bring coursework to life with hands-on, industry-relevant experimentation.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            {program.labs.map((lab, i) => (
              <div key={lab} className="reveal" data-delay={`${i * 50}`} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-accent)' }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🔬</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.4 }}>{lab}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      {program.faculty && program.faculty.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Our Team</span>
              <h2 className="section-title">Faculty</h2>
              <p className="section-desc">{program.faculty.length} dedicated faculty members bringing academic excellence and industry expertise to every classroom.</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary)' }}>
                    {['S.No', 'Name', 'Designation', 'Qualification'].map(h => (
                      <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-white)', fontWeight: 700, textAlign: 'left', fontSize: '0.72rem', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {program.faculty.map((f, i) => (
                    <tr key={f.name} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-light)', fontWeight: 600, width: 48 }}>{i + 1}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary)', fontWeight: 700 }}>{f.name}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-full)',
                          whiteSpace: 'nowrap',
                          background: f.designation.includes('HOD') || f.designation === 'Professor'
                            ? 'rgba(10,35,81,0.1)'
                            : f.designation.includes('Associate')
                              ? 'rgba(201,168,76,0.15)'
                              : 'rgba(0,0,0,0.05)',
                          color: f.designation.includes('HOD') || f.designation === 'Professor'
                            ? 'var(--color-primary)'
                            : f.designation.includes('Associate')
                              ? 'var(--color-accent)'
                              : 'var(--color-text-light)',
                          border: `1px solid ${f.designation.includes('HOD') || f.designation === 'Professor'
                            ? 'rgba(10,35,81,0.2)'
                            : f.designation.includes('Associate')
                              ? 'rgba(201,168,76,0.3)'
                              : 'rgba(0,0,0,0.1)'}`,
                        }}>
                          {f.designation}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-light)' }}>{f.qualification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Curriculum — only if semesters present */}
      {program.semesters && program.semesters.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Curriculum</span>
              <h2 className="section-title">Programme Structure</h2>
              <p className="section-desc">A well-structured 4-year, 8-semester curriculum blending core foundations with advanced specialisations and practical projects.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
              {program.semesters.map((sem, i) => (
                <div key={sem.label} className="reveal" data-delay={`${i * 40}`} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-light-gray)' }}>
                    {sem.label}
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {sem.subjects.map((s) => (
                      <li key={s} style={{ fontSize: '0.78rem', color: 'var(--color-text)', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', lineHeight: 1.4 }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Apply Today</span>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Begin Your Journey in {program.shortName}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto var(--space-8)', lineHeight: 1.7 }}>
              Join a thriving academic community. Apply through EAPCET (Code: VISW), explore our fee structure, or schedule a campus visit today.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg">Apply via EAPCET</Link>
              <Link to="/programmes-fee-structure" className="btn btn-secondary btn-lg">Fee Structure</Link>
              <Link to="/academics" className="btn btn-secondary btn-lg">All Programmes</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
