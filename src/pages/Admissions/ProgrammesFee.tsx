import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';

const DEFAULT_BTECH_FEE = '₹ 1,05,000';
const DEFAULT_MTECH_FEE = '₹ 55,800';
const DEFAULT_MBA_FEE = '₹ 55,000';

export default function ProgrammesFee() {
  const { docs: allPrograms } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const btechPrograms = useMemo(() => allPrograms.filter(p => p.category === 'btech'), [allPrograms]);
  const mtechPrograms = useMemo(() => allPrograms.filter(p => p.category === 'mtech'), [allPrograms]);
  const mbaProgram = useMemo(() => allPrograms.find(p => p.category === 'mba'), [allPrograms]);
  const phdPrograms = useMemo(() => allPrograms.filter(p => p.category === 'phd'), [allPrograms]);

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
        defaultTitle="Programmes & Fee Structure"
  defaultSubtitle="Complete list of programs, intake capacities, and annual fee structure for AY 2025–26."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Programmes & Fee' }]}
        scrollCtaTargetId="programmes-fee-content"
      />

      {/* B.Tech */}
      <section id="programmes-fee-content" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Undergraduate</span>
            <h2 className="section-title">B.Tech Programs</h2>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {[
                { label: 'Duration', value: '4 Years' },
                { label: 'Annual Fee', value: btechPrograms[0]?.fee || DEFAULT_BTECH_FEE },
                { label: 'Total Intake', value: `${btechPrograms.reduce((s, p) => s + (p.intake || 0), 0)} Seats` },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-6)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ borderRadius: 'var(--radius-md)', overflowX: 'auto', overflowY: 'hidden', boxShadow: 'var(--shadow-md)' }}>
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
                  <tr key={p.id} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ ...tableCell, color: 'var(--color-accent)', fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{p.name}</td>
                    <td style={tableCell}>{p.shortName}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{p.intake}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{p.fee || DEFAULT_BTECH_FEE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* M.Tech */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Postgraduate</span>
            <h2 className="section-title">M.Tech Programs</h2>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {[
                { label: 'Duration', value: '2 Years' },
                { label: 'Annual Fee', value: mtechPrograms[0]?.fee || DEFAULT_MTECH_FEE },
                { label: 'Total Intake', value: `${mtechPrograms.reduce((s, p) => s + (p.intake || 0), 0)} Seats` },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-6)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ borderRadius: 'var(--radius-md)', overflowX: 'auto', overflowY: 'hidden', boxShadow: 'var(--shadow-md)' }}>
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
                  <tr key={p.id} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{p.name}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{p.intake}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{p.fee || DEFAULT_MTECH_FEE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MBA */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Management</span>
            <h2 className="section-title">MBA</h2>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {[
                { label: 'Duration', value: '2 Years' },
                { label: 'Annual Fee', value: mbaProgram?.fee || DEFAULT_MBA_FEE },
                { label: 'Total Intake', value: `${mbaProgram?.intake || 60} Seats` },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-6)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ borderRadius: 'var(--radius-md)', overflowX: 'auto', overflowY: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-white)' }}>
              <thead>
                <tr>
                  <th style={tableHead}>Programme</th>
                  <th style={{ ...tableHead, textAlign: 'center' }}>Seats</th>
                  <th style={{ ...tableHead, textAlign: 'center' }}>Annual Fee</th>
                  <th style={{ ...tableHead, textAlign: 'center' }}>Entrance</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: 'var(--color-white)' }}>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>Master of Business Administration</td>
                  <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{mbaProgram?.intake || 60}</td>
                  <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{mbaProgram?.fee || DEFAULT_MBA_FEE}</td>
                  <td style={{ ...tableCell, textAlign: 'center' }}>ICET</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ph.D. */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Doctoral</span>
            <h2 className="section-title">Ph.D. Programs</h2>
          </div>
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
            {phdPrograms.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 900 }}>PhD</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>{p.name}</span>
              </div>
            ))}
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
