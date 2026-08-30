import { FileDown } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { ANNUAL_REPORT_CATEGORIES, DEFAULT_ANNUAL_REPORTS, type AnnualReportDoc } from '../Admin/sections/AnnualReportsAdmin';

// A plain year-by-year archive (College Annual Reports, Annual Examination
// Reports, Examination Reforms, Financial Audit Statements) — each year
// downloads its own PDF, so unlike the accordions used elsewhere on
// Governance/Research pages, nothing here needs to expand/collapse; every
// year is a direct link. Admin-editable via /admin → Annual Reports &
// Reforms (AnnualReportsAdmin.tsx); DEFAULT_ANNUAL_REPORTS is the "nothing
// uploaded yet" fallback for a fresh Firestore.
export default function AnnualReportsSection() {
  const { docs: liveDocs } = useOrderedCollection<AnnualReportDoc>('annualReportsDocs', 'order');
  const docs = liveDocs.length > 0 ? liveDocs : (DEFAULT_ANNUAL_REPORTS as AnnualReportDoc[]);
  const categories = ANNUAL_REPORT_CATEGORIES.map((c) => ({
    key: c.key,
    title: c.label,
    years: docs.filter((d) => d.category === c.key).map((d) => ({ label: d.label, href: d.fileUrl })),
  })).filter((c) => c.years.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {categories.map((cat) => (
        <div key={cat.key}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
            {cat.title}
          </h3>
          <ul className="annual-reports-list">
            {cat.years.map((y) => (
              <li key={y.href}>
                <a href={y.href} download className="annual-reports-link">
                  <FileDown size={14} strokeWidth={2} className="annual-reports-icon" />
                  {y.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
