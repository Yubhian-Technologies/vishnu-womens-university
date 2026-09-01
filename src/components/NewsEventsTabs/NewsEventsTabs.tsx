import { useState } from 'react';
import type { NewsEventsYear } from '../../pages/Admin/sections/ProgramsAdmin';

export interface NewsEventsCategory {
  key: string;
  label: string;
  years: NewsEventsYear[];
}

interface Props {
  categories: NewsEventsCategory[];
  eyebrow: string;
  navOffset: string;
}

/**
 * News & Events academic-year tables, split into a department's News &
 * Events / Student Awards / Others categories, switched with the same
 * `.section-tabs` control already used for the PEOs/POs/PSOs tabs on this
 * page. Renders nothing if every category is empty; once at least one has
 * content, every category still gets its own tab (even an empty one), so
 * clicking between them never feels like something broke.
 */
export default function NewsEventsTabs({ categories, eyebrow, navOffset }: Props) {
  const withContent = categories.filter((c) => c.years.length > 0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  if (withContent.length === 0) return null;
  const active = categories.find((c) => c.key === activeKey) ?? withContent[0];

  return (
    <section id="news-events" className="section bg-white" style={{ scrollMarginTop: navOffset }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <span className="section-label">{eyebrow}</span>
          <h2 className="section-title">News &amp; Events</h2>
        </div>
        <div className="section-tabs">
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveKey(c.key)}
              className={`section-tab-btn${active.key === c.key ? ' active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {active.years.length > 0 ? (
          active.years.map((yr, yi) => (
            <div key={yi} style={{ marginTop: 'var(--space-6)', marginBottom: yi === active.years.length - 1 ? 0 : 'var(--space-8)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                Academic Year :: {yr.year}
              </h3>
              <div className="pb-activities-scroll">
                <table>
                  <thead>
                    <tr>
                      <th className="pb-activities-num">S.No</th>
                      {yr.columns.map((col, ci) => <th key={ci}>{col}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {yr.rows.map((row, ri) => (
                      <tr key={ri}>
                        <td className="pb-activities-num">{ri + 1}</td>
                        {yr.columns.map((_, ci) => <td key={ci}>{row.cells[ci] ?? ''}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', marginTop: 'var(--space-6)' }}>
            Nothing added under "{active.label}" yet.
          </p>
        )}
      </div>
    </section>
  );
}
