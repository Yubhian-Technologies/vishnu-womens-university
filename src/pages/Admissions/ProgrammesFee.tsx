import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';

const DEFAULT_BTECH_FEE = '₹ 1,05,000';
const DEFAULT_MTECH_FEE = '₹ 55,800';
const DEFAULT_MBA_FEE = '₹ 55,000';

// VISWPU is a second, separate AP EAPCET college code — its B.Tech seats
// aren't part of the admin-managed `programs` collection (those are the
// VISW-code totals), so they're hardcoded here rather than admin-editable:
// this is a fixed, externally-issued code and count, not day-to-day content.
const VISWPU_BTECH_PROGRAMS: { name: string; code: string; intake: number; fee: string }[] = [
  { name: 'CSE [Artificial Intelligence & Machine Learning]', code: 'B.Tech AI & ML', intake: 120, fee: '₹ 47,000' },
  { name: 'Electronics Engineering (VLSI Design & Technology)', code: 'B.Tech EVT', intake: 60, fee: '₹ 47,000' },
];

// A program can be split across both codes (e.g. AI&ML: 240 total intake in
// the admin `programs` collection = 120 VISW + 120 VISWPU) — unlike EVT,
// which is carved out of the VISW table entirely (see the filter below), the
// admin's `intake` for these still reflects the combined total. Subtracting
// each one's fixed VISWPU share here, display-only, is what keeps the VISW
// table from double-counting the VISWPU seats shown just below it — the
// admin-editable total itself (240) is correct and unchanged, and anywhere
// else that reads it (e.g. the department page) is meant to show that
// combined total, not the VISW-only split.
const VISWPU_INTAKE_BY_NAME: Record<string, number> = Object.fromEntries(
  VISWPU_BTECH_PROGRAMS.map((p) => [p.name, p.intake])
);

export default function ProgrammesFee() {
  const { docs: allPrograms } = useOrderedCollection<ProgramDoc>('programs', 'order');
  // EVT is excluded from the VISW table on this page only — it's listed
  // under VISWPU instead (see VISWPU_BTECH_PROGRAMS above). Nothing is
  // changed in admin/Firestore or on any other page that reads `programs`.
  const btechPrograms = useMemo(() => allPrograms.filter(p => p.category === 'btech' && p.shortName !== 'B.Tech EVT'), [allPrograms]);
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
  defaultSubtitle="Complete list of programs, intake capacities, and annual fee structure Category A."
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
          <span style={{ display: 'inline-block', background: 'var(--color-primary)', color: 'var(--color-white)', fontWeight: 800, fontSize: 'var(--text-sm)', letterSpacing: '0.04em', padding: '0.4rem 1.1rem', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)' }}>
            VISW
          </span>
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
                {btechPrograms.map((p, i) => {
                  const viswIntake = p.intake - (VISWPU_INTAKE_BY_NAME[p.name] || 0);
                  return (
                    <tr key={p.id} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                      <td style={{ ...tableCell, color: 'var(--color-accent)', fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}</td>
                      <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{p.name}</td>
                      <td style={tableCell}>{p.shortName}</td>
                      <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{viswIntake}</td>
                      <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{p.fee || DEFAULT_BTECH_FEE}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* VISWPU B.Tech programs — hardcoded, see note above VISWPU_BTECH_PROGRAMS */}
          <span style={{ display: 'inline-block', background: 'var(--color-primary)', color: 'var(--color-white)', fontWeight: 800, fontSize: 'var(--text-sm)', letterSpacing: '0.04em', padding: '0.4rem 1.1rem', borderRadius: 'var(--radius-sm)', margin: 'var(--space-10) 0 var(--space-3)' }}>
            VISWPU
          </span>
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
                {VISWPU_BTECH_PROGRAMS.map((p, i) => (
                  <tr key={p.code} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ ...tableCell, color: 'var(--color-accent)', fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{p.name}</td>
                    <td style={tableCell}>{p.code}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{p.intake}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{p.fee}</td>
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
              <Link to="/apply-now" className="btn btn-secondary btn-lg">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
