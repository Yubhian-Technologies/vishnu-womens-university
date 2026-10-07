import { useEffect } from 'react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { GoverningBodyDoc } from '../Admin/sections/GoverningBodyAdmin';
import './GoverningBody.css';

export interface GoverningBodyMember {
  id: string;
  name: string;
  position: string;
  category: string;
  photoUrl?: string;
  order: number;
}




export const defaultMembers: Omit<GoverningBodyMember, 'id'>[] = [
  { name: 'Sri K.V. Vishnu Raju', position: 'Chairman, SVES', category: 'Management', order: 1 },
  { name: 'Sri Ravichandran Rajagopal', position: 'Vice-Chancellor, SVES', category: 'Management', order: 2 },
  { name: 'Sri Aditya Vissam', position: 'Secretary, SVES', category: 'Management', order: 3 },
  { name: 'Sri K. Sai Sumant', position: 'Joint Secretary, SVES', category: 'Management', order: 4 },
  { name: 'Sri JVSSRD Prasada Raju', position: 'Director, SVES', category: 'Management', order: 5 },
  { name: 'Prof. P. Venkata Rama Raju', position: "Vice-Principal, Vishnu Women's University", category: 'Teachers', order: 6 },
  { name: 'Dr. S.M. Padmaja', position: 'Professor & Head, EEE', category: 'Teachers', order: 7 },
  { name: 'Dr. U. Chandra Sekhar', position: 'WIPRO, Bengaluru', category: 'Educationalist / Industrialist', order: 8 },
  { name: 'Dr. Buddha Singh', position: 'JNU, New Delhi', category: 'UGC Nominee', order: 9 },
  { name: 'Mr. J. Satyanarayana Murthy', position: 'RJD, Technical Education', category: 'State Government', order: 10 },
  { name: 'Prof. GVR Prasada Raju', position: 'JNTUK, Kakinada', category: 'University Nominee', order: 11 },
  { name: 'Dr. G. Srinivasa Rao', position: "Principal, Vishnu Women's University", category: 'Principal (Ex-Officio)', order: 12 },
];

// Statutory composition of the Governing Body (static — from the official GB table).
const GB_TABLE: { category: string; rows: { nature: string; name?: string; org?: string }[] }[] = [
  {
    category: 'Category (A): Ex-Officio Members',
    rows: [
      { nature: 'Chancellor of the University', name: 'Sri K.V. Vishnu Raju' },
      { nature: 'Vice-Chancellor of the University', name: 'Dr. K V N Sunitha' },
      { nature: 'Chairman, APSCHE', name: 'Prof. S. Vijaya Bhaskara Rao' },
      { nature: 'Secretary, Govt. of AP, HE Department' },
      { nature: 'Registrar of the University', name: 'Dr. P Srinivasa Raju' },
    ],
  },
  {
    category: 'Category (B): Nominated Members',
    rows: [
      { nature: 'An eminent academician from the field of science/engineering & Technology/social sciences/Law/Management', name: 'Dr. Seema Varma', org: 'NITTTR, Bhopal' },
      { nature: 'The director of National Laboratory or his/her nominee not below the rank of Scientist G', name: 'Dr Uma', org: 'ISRO Scientist G' },
      { nature: 'Nominee of CII' },
      { nature: 'A reputed Chartered Accountant' },
      { nature: 'A Member from public life who has contributed significantly to societal/national development' },
      { nature: 'A Member of the sponsoring body', name: 'Shri Ravi Chandran Rajagopal', org: 'Vice Chairman, SVES' },
      { nature: 'Nominee by the sponsoring Body', name: 'Mr K Aditya Vissam', org: 'Secretary, SVES' },
      { nature: 'Nominee by the Sponsoring Body', name: 'Dr G Srinivasa Rao', org: 'Pro Vice-Chancellor, VWU' },
    ],
  },
];

type GbGroup = { category: string; rows: { nature: string; name?: string; org?: string }[] };

function groupsFromDocs(docs: GoverningBodyDoc[]): GbGroup[] {
  const order: string[] = [];
  const map = new Map<string, GbGroup['rows']>();
  docs.forEach((m) => {
    if (!map.has(m.category)) { map.set(m.category, []); order.push(m.category); }
    map.get(m.category)!.push({ nature: m.nature || m.position || '', name: m.name, org: m.org });
  });
  return order.map((category) => ({ category, rows: map.get(category)! }));
}

function GoverningBodyTable({ groups }: { groups: GbGroup[] }) {
  let n = 0;
  return (
    <div className="gb-table-wrap">
      <table className="gb-table">
        <thead>
          <tr>
            <th scope="col">Number</th>
            <th scope="col">Category</th>
            <th scope="col">Nature</th>
            <th scope="col">Name of the Member</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) =>
            group.rows.map((row, i) => (
              <tr key={`${group.category}-${i}`} className={i === 0 ? 'gb-table__group-start' : undefined}>
                <td>Member {++n}</td>
                {i === 0 && (
                  <th scope="rowgroup" rowSpan={group.rows.length} className="gb-table__category">
                    {group.category}
                  </th>
                )}
                <td>{row.nature}</td>
                <td className="gb-table__name">
                  {row.name ? <strong>{row.name}</strong> : <span className="gb-table__empty">—</span>}
                  {row.org && <span className="gb-table__org">{row.org}</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function GoverningBody() {
  const { docs: members } = useOrderedCollection<GoverningBodyDoc>('governingBody', 'order');
  const groups = members.length ? groupsFromDocs(members) : GB_TABLE;

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
            <h2 className="gb-overview__title">Governing Body at VWU</h2>
          </div>
          <GoverningBodyTable groups={groups} />
        </div>
      </section>
    </main>
  );
}
