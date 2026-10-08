import { useEffect } from 'react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { GoverningBodyDoc } from '../Admin/sections/GoverningBodyAdmin';
import { GOVERNING_BODY_DEFAULTS, GOVERNING_BODY_NOTES } from './governingBody.data';
import './GoverningBody.css';

type GbRow = { number?: number; name: string; details: string };

const FALLBACK_ROWS: GbRow[] = GOVERNING_BODY_DEFAULTS;

function rowsFromDocs(docs: GoverningBodyDoc[]): GbRow[] {
  return docs.map((m) => ({
    number: m.number,
    name: m.name,
    details: [m.nature || m.position, m.org].filter(Boolean).join(', '),
  }));
}

function GoverningBodyTable({ rows }: { rows: GbRow[] }) {
  return (
    <div className="gb-table-wrap">
      <table className="gb-table">
        <thead>
          <tr>
            <th scope="col">Number</th>
            <th scope="col">Name</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.number ?? i + 1}</td>
              <td className="gb-table__name">
                {row.name ? <strong>{row.name}</strong> : <span className="gb-table__empty">-</span>}
              </td>
              <td>{row.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GoverningBody() {
  const { docs: members } = useOrderedCollection<GoverningBodyDoc>('governingBody', 'order');
  const rows = members.length ? rowsFromDocs(members) : FALLBACK_ROWS;

  useEffect(() => {
    document.title = "Governing Body | Vishnu Women's University";
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
    <main className="page-wrapper governing-body-page">
      {/* Hero */}
      <PageHero
        page="governing-body"
        defaultTitle="Governing Body"
        defaultSubtitle="Dedicated leaders and distinguished members committed to academic excellence, institutional governance, innovation, and continuous growth."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Governance', to: '/governance' }, { label: 'Governing Body' }]}
      />

      {/* Composition table */}
      <section className="section gb-composition">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 className="gb-overview__title">Governing Body (GB)</h2>
          </div>
          <GoverningBodyTable rows={rows} />
          <ul className="gb-notes">
            {GOVERNING_BODY_NOTES.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
