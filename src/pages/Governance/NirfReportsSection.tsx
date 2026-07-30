import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { NIRF_REPORTS_CATEGORIES } from './nirfReportsDefault';

// A tabbed report browser (Engineering / Innovation / SDG / Overall) — reuses
// the .iqac-cell-tabs segmented control first built for the Internal Quality
// Assurance Cell page (same visual shape: equal-width tabs, filled active
// state) and the .annual-reports-link chip style from Annual Reports &
// Reforms, since each NIRF category is just a small list of dated report
// PDFs, same as that page's year chips.
export default function NirfReportsSection() {
  const [activeKey, setActiveKey] = useState(NIRF_REPORTS_CATEGORIES[0]?.key ?? '');
  const active = NIRF_REPORTS_CATEGORIES.find((c) => c.key === activeKey) ?? NIRF_REPORTS_CATEGORIES[0];

  return (
    <div>
      <div className="iqac-cell-tabs">
        {NIRF_REPORTS_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`iqac-cell-tab${cat.key === activeKey ? ' active' : ''}`}
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
