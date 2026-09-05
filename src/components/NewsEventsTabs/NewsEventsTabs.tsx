import { useState } from 'react';
import { Calendar, FileText, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import type { NewsEventsYear } from '../../pages/Admin/sections/ProgramsAdmin';
import SmoothCollapse from '../SmoothCollapse/SmoothCollapse';

export interface NewsEventsCategory {
  key: string;
  label: string;
  years: NewsEventsYear[];
}

interface Props {
  categories: NewsEventsCategory[];
  eyebrow: string;
  navOffset: string;
  /** Renders just the category tabs + accordion list, skipping the outer
   *  section/container and the collapsible "News & Events" header — used
   *  when this is nested inside another tab (e.g. the Programme Hub) that
   *  already provides its own label and show/hide affordance. */
  embedded?: boolean;
}

function isUrl(text: string): boolean {
  return /^(https?:\/\/|\/|.*\.pdf$)/i.test(text.trim());
}

function getEventCount(yr: NewsEventsYear): number {
  const mode = yr.mode || 'table';
  let count = 0;
  if (mode === 'table' || mode === 'both') {
    count = Math.max(count, yr.rows?.length || 0);
  }
  if (mode === 'cards' || mode === 'both') {
    count = Math.max(count, yr.cards?.length || 0);
  }
  if (mode === 'text' && yr.text) {
    count = Math.max(count, 1);
  }
  return count;
}

function formatEventCountLabel(count: number): string {
  const padded = String(count).padStart(2, '0');
  const label = count === 1 ? 'event' : 'events';
  return `${padded} ${label}`;
}

export default function NewsEventsTabs({ categories, eyebrow, navOffset, embedded }: Props) {
  const withContent = categories.filter((c) => c.years.length > 0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [expandedYearIndex, setExpandedYearIndex] = useState<number | null>(0);
  const [sectionExpanded, setSectionExpanded] = useState(false);

  if (withContent.length === 0) return null;
  const active = categories.find((c) => c.key === activeKey) ?? withContent[0];

  const handleCategoryChange = (key: string) => {
    setActiveKey(key);
    setExpandedYearIndex(0); // Reset to first year open on tab change
  };

  const body = (
    <>
        <p className="section-desc" style={{ marginTop: '0.4rem', marginBottom: 'var(--space-6)' }}>
          Latest department announcements, academic activities, workshops, and student achievements.
        </p>

        {/* Category Tabs */}
        <div className="section-tabs" role="tablist" aria-label="News and Events categories">
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={active.key === c.key}
              onClick={() => handleCategoryChange(c.key)}
              className={`section-tab-btn${active.key === c.key ? ' active' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Collapsible Academic Year List */}
        {active.years.length > 0 ? (
          <div className="news-events-accordion-list" style={{ marginTop: 'var(--space-6)' }}>
            {active.years.map((yr, yi) => {
              const isExpanded = expandedYearIndex === yi;
              const mode = yr.mode || 'table';
              const showTable = (mode === 'table' || mode === 'both') && yr.columns.length > 0;
              const cards = yr.cards || [];
              const showCards = (mode === 'cards' || mode === 'both') && cards.length > 0;
              const showText = mode === 'text' && !!yr.text;
              const count = getEventCount(yr);
              const countLabel = formatEventCountLabel(count);

              return (
                <div key={yi} className={`news-events-accordion-item${isExpanded ? ' is-open' : ''}`}>
                  {/* Single Row Trigger Button */}
                  <button
                    type="button"
                    className="news-events-accordion-trigger"
                    onClick={() => setExpandedYearIndex(isExpanded ? null : yi)}
                    aria-expanded={isExpanded}
                    aria-controls={`news-events-year-panel-${yi}`}
                  >
                    <div className="news-events-accordion-year-wrap">
                      <Calendar size={16} strokeWidth={2.2} className="news-events-accordion-year-icon" />
                      <span className="news-events-accordion-year-text">{yr.year}</span>
                    </div>

                    <div className="news-events-accordion-right">
                      <span className="news-events-count-badge">{countLabel}</span>
                      <span className="news-events-chevron-circle">
                        <ChevronDown
                          size={16}
                          strokeWidth={2.4}
                          className={`news-events-accordion-chevron${isExpanded ? ' is-open' : ''}`}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </button>

                  {/* Collapsible Panel */}
                  <SmoothCollapse open={isExpanded}>
                    <div id={`news-events-year-panel-${yi}`} className="news-events-accordion-panel">
                      {showTable && (
                        <>
                          {/* Desktop Table View */}
                          <div className="news-events-table-wrap desktop-only-table">
                            <table className="news-events-table">
                              <thead>
                                <tr>
                                  <th style={{ width: '60px', textAlign: 'center' }}>S.No</th>
                                  {yr.columns.map((col, ci) => (
                                    <th key={ci}>{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {yr.rows.map((row, ri) => (
                                  <tr key={ri}>
                                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>{ri + 1}</td>
                                    {yr.columns.map((_, ci) => {
                                      const val = (row.cells[ci] ?? '').trim();
                                      return (
                                        <td key={ci}>
                                          {isUrl(val) ? (
                                            <a href={val} target="_blank" rel="noopener noreferrer" className="news-events-pdf-link">
                                              <FileText size={14} strokeWidth={2.2} />
                                              <span>View Document</span>
                                              <ExternalLink size={12} strokeWidth={2.2} />
                                            </a>
                                          ) : (
                                            val
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Responsive Cards View */}
                          <div className="news-events-mobile-cards-grid mobile-only-cards">
                            {yr.rows.map((row, ri) => {
                              const firstCol = row.cells[0] || '';
                              const secondCol = row.cells[1] || '';
                              const thirdCol = row.cells[2] || '';
                              const linkCol = row.cells.find((c) => isUrl(c || ''));

                              return (
                                <div key={ri} className="news-events-mobile-card">
                                  <div className="news-events-mobile-card-top">
                                    <span className="news-events-sno-pill">#{ri + 1}</span>
                                    {firstCol && (
                                      <span className="news-events-date-chip">
                                        <Calendar size={12} strokeWidth={2.2} />
                                        <span>{firstCol}</span>
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="news-events-mobile-card-title">{secondCol || firstCol}</h4>
                                  {thirdCol && !isUrl(thirdCol) && (
                                    <p className="news-events-mobile-card-desc">{thirdCol}</p>
                                  )}
                                  {linkCol && (
                                    <a href={linkCol} target="_blank" rel="noopener noreferrer" className="news-events-mobile-card-action">
                                      <FileText size={14} strokeWidth={2.2} />
                                      <span>View Document / Report</span>
                                      <ChevronRight size={14} strokeWidth={2.2} />
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {showCards && (
                        <div className="news-events-cards-grid" style={{ marginTop: showTable ? 'var(--space-6)' : 0 }}>
                          {cards.map((card, ci) => (
                            <div key={ci} className="news-events-media-card">
                              {card.imageUrl && (
                                <div className="news-events-card-img-wrap">
                                  <img src={card.imageUrl} alt={card.title || 'News & Events'} className="news-events-card-img" />
                                </div>
                              )}
                              <div className="news-events-card-body">
                                {card.title && <h4 className="news-events-card-title">{card.title}</h4>}
                                {card.description && <p className="news-events-card-desc">{card.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showText && <p className="news-events-text-block">{yr.text}</p>}

                      {!showTable && !showCards && !showText && (
                        <p className="news-events-empty-text">Nothing added for this academic year yet.</p>
                      )}
                    </div>
                  </SmoothCollapse>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="news-events-empty-text">Nothing added under "{active.label}" yet.</p>
        )}
    </>
  );

  if (embedded) return body;

  return (
    <section id="news-events" className="section bg-white" style={{ scrollMarginTop: navOffset }}>
      <div className="container">
        <button
          type="button"
          className="dept-outcomes-toggle"
          onClick={() => setSectionExpanded((v) => !v)}
          aria-expanded={sectionExpanded}
          aria-controls="news-events-panel-wrap"
        >
          <div>
            <span className="section-label dept-section-label">{eyebrow}</span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>News &amp; Events</h2>
          </div>
          <ChevronDown
            size={22}
            strokeWidth={2.2}
            className={`dept-outcomes-toggle-chevron${sectionExpanded ? ' is-open' : ''}`}
            aria-hidden="true"
          />
        </button>
        <SmoothCollapse open={sectionExpanded}>
          <div id="news-events-panel-wrap" style={{ paddingTop: 'var(--space-6)' }}>
            {body}
          </div>
        </SmoothCollapse>
      </div>
    </section>
  );
}
