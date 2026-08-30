import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { NIRF_CATEGORIES, type NirfReportDoc } from '../Admin/sections/NirfReportsAdmin';

// A tabbed report browser (Engineering / Innovation / SDG / Overall) — reuses
// the .iqac-cell-tabs segmented control first built for the Internal Quality
// Assurance Cell page (same visual shape: equal-width tabs, filled active
// state) and the .annual-reports-link chip style from Annual Reports &
// Reforms, since each NIRF category is just a small list of dated report
// PDFs, same as that page's year chips. Admin-editable via /admin → NIRF
// Reports (NirfReportsAdmin.tsx).
export default function NirfReportsSection() {
  const { docs } = useOrderedCollection<NirfReportDoc>('nirfReportsDocs', 'order');
  const categories = NIRF_CATEGORIES.map((c) => ({
    key: c.key,
    title: c.label,
    reports: docs.filter((d) => d.category === c.key).map((d) => ({ label: d.label, href: d.fileUrl })),
  })).filter((c) => c.reports.length > 0);

  const [activeKey, setActiveKey] = useState(categories[0]?.key ?? '');
  const active = categories.find((c) => c.key === activeKey) ?? categories[0];

  if (categories.length === 0) return null;

  return (
    <div>
      <div className="iqac-cell-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`iqac-cell-tab${cat.key === (active?.key ?? activeKey) ? ' active' : ''}`}
            onClick={() => setActiveKey(cat.key)}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {active && (
        <ul className="annual-reports-list">
          {active.reports.map((r) => (
            <li key={r.href}>
              <a href={r.href} download className="annual-reports-link">
                <FileDown size={14} strokeWidth={2} className="annual-reports-icon" />
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
