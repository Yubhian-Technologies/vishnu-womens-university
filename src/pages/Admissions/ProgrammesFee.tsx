import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const btechPrograms = [
  { name: 'Computer Science & Engineering – AI & Data Science', code: 'CSE [AI & DS]', seats: 120 },
  { name: 'Computer Science & Engineering – AI & Machine Learning', code: 'CSE [AI & ML]', seats: 180 },
  { name: 'Computer Science & Engineering – Cyber Security', code: 'CSE [CS]', seats: 60 },
  { name: 'Computer Science & Engineering', code: 'CSE', seats: 180 },
  { name: 'Information Technology', code: 'IT', seats: 180 },
  { name: 'Electronics & Communication Engineering', code: 'ECE', seats: 120 },
  { name: 'Electrical & Electronics Engineering', code: 'EEE', seats: 60 },
  { name: 'Civil Engineering', code: 'CE', seats: 60 },
  { name: 'Mechanical Engineering', code: 'ME', seats: 60 },
];

const mtechPrograms = [
  { name: 'M.Tech – Computer Science & Engineering', code: 'CSE', seats: 18 },
  { name: 'M.Tech – VLSI Design', code: 'VLSI', seats: 18 },
  { name: 'M.Tech – Power Electronics', code: 'PE', seats: 9 },
  { name: 'M.Tech – Software Engineering', code: 'SE', seats: 9 },
];

const phdPrograms = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
];

export default function ProgrammesFee() {
  useEffect(() => {
    document.title = 'Programmes & Fee Structure | VWU';
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

  const tableHead: React.CSSProperties = {
    background: 'var(--color-primary)',
    color: 'var(--color-white)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: 'var(--space-4) var(--space-5)',
    textAlign: 'left',
  };
  const tableCell: React.CSSProperties = {
    padding: 'var(--space-4) var(--space-5)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text)',
    borderBottom: '1px solid var(--color-light-gray)',
    fontFamily: 'var(--font-sans)',
  };

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="programmes-fee"
        defaultImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
        defaultTitle="Programmes & Fee Structure"
  defaultSubtitle="Complete list of programs, intake capacities, and annual fee structure for AY 2025–26."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Programmes & Fee' }]}
      />

      {/* B.Tech */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Undergraduate</span>
            <h2 className="section-title">B.Tech Programs</h2>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {[
                { label: 'Duration', value: '4 Years' },
                { label: 'Annual Fee', value: '₹ 1,05,000' },
                { label: 'Total Intake', value: `${btechPrograms.reduce((s, p) => s + p.seats, 0)} Seats` },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-6)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-white)' }}>
              <thead>
                <tr>
                  <th style={tableHead}>S.No</th>
                  <th style={tableHead}>Programme</th>
                  <th style={tableHead}>Code</th>
                  <th style={{ ...tableHead, textAlign: 'center' }}>Intake (Seats)</th>
                  <th style={{ ...tableHead, textAlign: 'center' }}>Annual Fee</th>
                </tr>
              </thead>
              <tbody>
                {btechPrograms.map((p, i) => (
                  <tr key={p.code} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ ...tableCell, color: 'var(--color-accent)', fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{p.name}</td>
                    <td style={tableCell}>{p.code}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{p.seats}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>₹ 1,05,000</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* M.Tech + MBA */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-10)' }}>
            {/* M.Tech */}
            <div>
              <div className="reveal" style={{ marginBottom: 'var(--space-6)' }}>
                <span className="section-label">Postgraduate</span>
                <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>M.Tech Programs</h2>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
                  {[{ label: 'Duration', value: '2 Years' }, { label: 'Annual Fee', value: '₹ 55,800' }].map(s => (
                    <div key={s.label} style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-5)', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="reveal" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-white)' }}>
                  <thead>
                    <tr>
                      <th style={tableHead}>Programme</th>
                      <th style={{ ...tableHead, textAlign: 'center' }}>Seats</th>
                      <th style={{ ...tableHead, textAlign: 'center' }}>Annual Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mtechPrograms.map((p, i) => (
                      <tr key={p.code} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                        <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{p.name}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{p.seats}</td>
                        <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>₹ 55,800</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MBA + PhD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <div className="reveal">
                <span className="section-label">Management</span>
                <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-5)' }}>MBA</h2>
                <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>Master of Business Administration</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {[['Duration', '2 Years'], ['Intake', '60 Seats'], ['Annual Fee', '₹ 55,000'], ['Entrance', 'ICET']].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--color-light-gray)', paddingBottom: 'var(--space-2)' }}>
                        <span style={{ color: 'var(--color-text-light)' }}>{k}</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="reveal">
                <span className="section-label">Doctoral</span>
                <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-5)' }}>Ph.D.</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {phdPrograms.map((p) => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)' }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 900 }}>PhD</span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship note */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-10) 0' }}>
        <div className="container">
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Financial Support</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-3)' }}>PM Vidyalaxmi Scheme</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                Meritorious students can avail financial assistance through the <strong style={{ color: 'var(--color-accent)' }}>PM Vidyalaxmi Scheme</strong>,
                making quality engineering education accessible to all deserving students regardless of financial background.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/admission-procedure" className="btn btn-accent btn-lg">Admission Procedure</Link>
              <Link to="/admissions" className="btn btn-secondary btn-lg">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
