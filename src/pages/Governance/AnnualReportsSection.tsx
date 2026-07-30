import { FileDown } from 'lucide-react';
import { ANNUAL_REPORTS_CATEGORIES } from './annualReportsDefault';

// A plain year-by-year archive (College Annual Reports, Annual Examination
// Reports, Examination Reforms, Financial Audit Statements) — each year
// downloads its own PDF from public/downloads/, so unlike the accordions
// used elsewhere on Governance/Research pages, nothing here needs to
// expand/collapse; every year is a direct link.
export default function AnnualReportsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {ANNUAL_REPORTS_CATEGORIES.map((cat) => (
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
