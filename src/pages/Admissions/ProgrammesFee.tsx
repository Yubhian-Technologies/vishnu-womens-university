import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import { dotTech } from '../../lib/academicDegreeNames';

const BTECH_FEE = '₹ 1,05,000';
const MTECH_FEE = '₹ 55,800';
const MBA_FEE = '₹ 55,000';

type ProgramRow = { name: string; code: string; intake: number; fee: string };

// All programme tables on this page are hardcoded reference data (Category A
// intake + fee), not admin-managed content — these are fixed, externally
// issued branch codes and seat counts.

// Category A, VISW college code.
const BTECH_VISW_PROGRAMS: ProgramRow[] = [
  { name: 'Computer Science & Engineering', code: 'B.Tech CSE', intake: 180, fee: BTECH_FEE },
  { name: 'CSE [Artificial Intelligence & Machine Learning]', code: 'B.Tech CSE(AI & ML)', intake: 120, fee: BTECH_FEE },
  { name: 'CSE [Artificial Intelligence & Data Science]', code: 'B.Tech CSE(AI & DS)', intake: 120, fee: BTECH_FEE },
  { name: 'CSE [Cyber Security]', code: 'B.Tech Cyber Security', intake: 60, fee: BTECH_FEE },
  { name: 'Information Technology', code: 'B.Tech IT', intake: 180, fee: BTECH_FEE },
  { name: 'Electronics & Communication Engineering', code: 'B.Tech ECE', intake: 120, fee: BTECH_FEE },
  { name: 'Electrical & Electronics Engineering', code: 'B.Tech EEE', intake: 60, fee: BTECH_FEE },
  { name: 'Civil Engineering', code: 'B.Tech CE', intake: 60, fee: BTECH_FEE },
  { name: 'Mechanical Engineering', code: 'B.Tech ME', intake: 60, fee: BTECH_FEE },
];

// Second AP EAPCET college code (VISWPU) — separate B.Tech seats.
const VISWPU_BTECH_PROGRAMS: ProgramRow[] = [
  { name: 'CSE [Artificial Intelligence & Machine Learning]', code: 'CSM', intake: 120, fee: '₹ 47,000' },
  { name: 'Electronics Engineering (VLSI Design & Technology)', code: 'EVT', intake: 60, fee: '₹ 47,000' },
];

const MTECH_PROGRAMS: ProgramRow[] = [
  { name: 'M.Tech – Computer Science & Engineering', code: 'M.Tech CSE', intake: 18, fee: MTECH_FEE },
  { name: 'M.Tech – VLSI Design', code: 'M.Tech VLSI', intake: 18, fee: MTECH_FEE },
  { name: 'M.Tech – Power Electronics', code: 'M.Tech Power Electronics', intake: 9, fee: MTECH_FEE },
  { name: 'M.Tech – Software Engineering', code: 'M.Tech Software Engg.', intake: 9, fee: MTECH_FEE },
];

const BTECH_TOTAL_INTAKE = [...BTECH_VISW_PROGRAMS, ...VISWPU_BTECH_PROGRAMS].reduce((s, p) => s + p.intake, 0);
const MTECH_TOTAL_INTAKE = MTECH_PROGRAMS.reduce((s, p) => s + p.intake, 0);

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

// One shared header row for every programme table on this page. `extra`
// appends table-specific trailing columns (e.g. MBA's "Entrance").
const BASE_HEADERS = ['S.No.', 'Programme', 'Branch Code', 'Total Intake', 'Tuition Fee (CAT A)'];

function TableHead({ extra = [] }: { extra?: string[] }) {
  return (
    <thead>
      <tr>
        {[...BASE_HEADERS, ...extra].map((label, i) => (
          <th key={label} style={i >= 3 ? { ...tableHead, textAlign: 'center' } : tableHead}>
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default function ProgrammesFee() {
  // Ph.D. programmes stay admin-managed; the taught-programme tables below are hardcoded.
  const { docs: allPrograms } = useOrderedCollection<ProgramDoc>('programs', 'order');
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
            <h2 className="section-title">{dotTech('B.Tech Programs')}</h2>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {[
                { label: 'Duration', value: '4 Years' },
                { label: 'Tuition Fee', value: BTECH_FEE },
                { label: 'Total Intake', value: `${BTECH_TOTAL_INTAKE} Seats` },
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
              <TableHead />
              <tbody>
                {BTECH_VISW_PROGRAMS.map((p, i) => (
                  <tr key={p.code} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ ...tableCell, color: 'var(--color-accent)', fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{dotTech(p.name)}</td>
                    <td style={tableCell}>{dotTech(p.code)}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{p.intake}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{p.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISWPU B.Tech programs — hardcoded, see note above VISWPU_BTECH_PROGRAMS */}
          <span style={{ display: 'inline-block', background: 'var(--color-primary)', color: 'var(--color-white)', fontWeight: 800, fontSize: 'var(--text-sm)', letterSpacing: '0.04em', padding: '0.4rem 1.1rem', borderRadius: 'var(--radius-sm)', margin: 'var(--space-10) 0 var(--space-3)' }}>
            VISWPU
          </span>
          <div className="reveal" style={{ borderRadius: 'var(--radius-md)', overflowX: 'auto', overflowY: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-white)' }}>
              <TableHead />
              <tbody>
                {VISWPU_BTECH_PROGRAMS.map((p, i) => (
                  <tr key={p.code} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ ...tableCell, color: 'var(--color-accent)', fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{dotTech(p.name)}</td>
                    <td style={tableCell}>{dotTech(p.code)}</td>
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
            <h2 className="section-title">{dotTech('M.Tech Programs')}</h2>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {[
                { label: 'Duration', value: '2 Years' },
                { label: 'Tuition Fee', value: MTECH_FEE },
                { label: 'Total Intake', value: `${MTECH_TOTAL_INTAKE} Seats` },
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
              <TableHead />
              <tbody>
                {MTECH_PROGRAMS.map((p, i) => (
                  <tr key={p.code} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ ...tableCell, color: 'var(--color-accent)', fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>{dotTech(p.name)}</td>
                    <td style={tableCell}>{dotTech(p.code)}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>{p.intake}</td>
                    <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{p.fee}</td>
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
            <h2 className="section-title">MBA</h2>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              {[
                { label: 'Duration', value: '2 Years' },
                { label: 'Tuition Fee', value: MBA_FEE },
                { label: 'Total Intake', value: '60 Seats' },
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
              <TableHead extra={['Entrance']} />
              <tbody>
                <tr style={{ background: 'var(--color-white)' }}>
                  <td style={{ ...tableCell, color: 'var(--color-accent)', fontWeight: 900 }}>01</td>
                  <td style={{ ...tableCell, fontWeight: 600, color: 'var(--color-primary)' }}>Master of Business Administration</td>
                  <td style={tableCell}></td>
                  <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700 }}>60</td>
                  <td style={{ ...tableCell, textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{MBA_FEE}</td>
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
            <h2 className="section-title">Ph.D. Programs</h2>
          </div>
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
            {phdPrograms.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 900 }}>PhD</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>{dotTech(p.name)}</span>
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
