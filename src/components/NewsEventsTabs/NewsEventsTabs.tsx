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
          active.years.map((yr, yi) => {
            const mode = yr.mode || 'table';
            const showTable = (mode === 'table' || mode === 'both') && yr.columns.length > 0;
            const cards = yr.cards || [];
            const showCards = (mode === 'cards' || mode === 'both') && cards.length > 0;
            const showText = mode === 'text' && !!yr.text;
            return (
            <div key={yi} style={{ marginTop: 'var(--space-6)', marginBottom: yi === active.years.length - 1 ? 0 : 'var(--space-8)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                Academic Year :: {yr.year}
              </h3>
              {showTable && (
                <div className="pb-activities-scroll">
                  <table className="news-events-table">
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
              )}
              {showCards && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-5)', marginTop: showTable ? 'var(--space-6)' : 0 }}>
                  {cards.map((card, ci) => (
                    <div key={ci} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      {card.imageUrl && (
                        <img src={card.imageUrl} alt={card.title || 'News & Events'} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                      )}
                      <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
                        {card.title && (
                          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.4, marginBottom: card.description ? 'var(--space-2)' : 0 }}>
                            {card.title}
                          </h4>
                        )}
                        {card.description && (
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{card.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showText && (
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.85, fontSize: 'var(--text-base)', whiteSpace: 'pre-line' }}>{yr.text}</p>
              )}
              {!showTable && !showCards && !showText && (
                <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>Nothing added for this year yet.</p>
              )}
            </div>
            );
          })
        ) : (
          <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', marginTop: 'var(--space-6)' }}>
            Nothing added under "{active.label}" yet.
          </p>
        )}
      </div>
    </section>
  );
}
