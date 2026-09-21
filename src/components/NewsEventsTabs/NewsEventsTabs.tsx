import { useState } from 'react';
import { Calendar, FileText, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import type { NewsEventsYear } from '../../pages/Admin/sections/ProgramsAdmin';
import SmoothCollapse from '../SmoothCollapse/SmoothCollapse';
import { SectionSubtree } from '../CustomSectionsRenderer/CustomSectionsRenderer';
import HorizontalEventsShowcase from '../HorizontalEventsShowcase/HorizontalEventsShowcase';
import type { CustomSectionContentType, CustomSectionImageCard } from '../../lib/customSections';

// Every content type this codebase actually renders as something other than
// image cards — used below to tell a genuinely different kind of content
// (a real table, a real checklist, ...) apart from a stray/unrecognized
// contentType value some data may carry (never a value this admin UI has
// ever offered — see CustomSectionEditor's CONTENT_TYPE_LABELS) with nothing
// real behind it. The former must keep the safe tabs+accordion fallback
// below so nothing real is ever hidden; the latter has nothing to lose.
const KNOWN_NON_IMAGE_TYPES = new Set<CustomSectionContentType>(['text', 'table', 'links', 'files', 'list', 'person', 'gallery', 'contacts']);

export interface NewsEventsCategory {
  key: string;
  label: string;
  years: NewsEventsYear[];
}

interface Props {
  categories: NewsEventsCategory[];
  navOffset: string;
  /** Renders just the category tabs + accordion list, skipping the outer
   *  section/container and the collapsible "News & Events" header — used
   *  when this is nested inside another tab (e.g. the Programme Hub) that
   *  already provides its own label and show/hide affordance. */
  embedded?: boolean;
  departmentSlug?: string;
}

function isUrl(text: string): boolean {
  return /^(https?:\/\/|\/|.*\.pdf$)/i.test(text.trim());
}

export default function NewsEventsTabs({ categories, navOffset, embedded, departmentSlug }: Props) {
  const withContent = categories.filter((c) => c.years.length > 0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [expandedYearIndex, setExpandedYearIndex] = useState<number | null>(0);

  if (withContent.length === 0) return null;
  const active = categories.find((c) => c.key === activeKey) ?? withContent[0];

  const handleCategoryChange = (key: string) => {
    setActiveKey(key);
    setExpandedYearIndex(0); // Reset to first year open on tab change
  };

  // Once every category/year here is an admin-defined Custom Section using
  // the "Images (photo + caption each)" content type — the pattern the
  // simplified admin editor now always writes — this whole feature collapses
  // to one flat, arrow-scrollable carousel: no category tabs, no per-year
  // accordion, and so no more of a section's own name showing twice (once as
  // its tab, once as its single "year" trigger, since a plain Custom Section
  // has no real year of its own). Anything still in the older table/text/
  // mixed shape (not yet touched by the new editor) keeps the tabs+accordion
  // rendering below untouched.
  const allYears = withContent.flatMap((c) => c.years);
  const allDynamic = allYears.length > 0 && allYears.every((y) => !!y.section);
  const hasOtherRealContent = allDynamic && allYears.some((y) => {
    const ct = y.section!.contentType;
    return ct !== 'imageCards' && KNOWN_NON_IMAGE_TYPES.has(ct);
  });
  const flatEventCards: CustomSectionImageCard[] = allDynamic
    ? allYears.flatMap((y) => (y.section!.imageCards || []).filter((c) => c.imageUrl || c.title.trim() || c.description.trim()))
    : [];
  const showFlatCarousel = allDynamic && !hasOtherRealContent && flatEventCards.length > 0;

  // Shared panel body for one "year" entry, reused both by the accordion
  // item below and by the header-less flat card (used when a year's label
  // just repeats its category's own name — see skipHeader below).
  const renderYearBody = (yr: NewsEventsYear) => {
    const mode = yr.mode || 'table';
    const showSection = !!yr.section;
    const showTable = !showSection && (mode === 'table' || mode === 'both') && yr.columns.length > 0;
    const cards = yr.cards || [];
    const showCards = !showSection && (mode === 'cards' || mode === 'both') && cards.length > 0;
    const showText = !showSection && mode === 'text' && !!yr.text;

    return (
      <>
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
                    <img loading="lazy" src={card.imageUrl} alt={card.title || 'News & Events'} className="news-events-card-img" />
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

        {showSection && <SectionSubtree section={yr.section!} departmentSlug={departmentSlug} categorySlug={active.key} />}

        {!showTable && !showCards && !showText && !showSection && (
          <p className="news-events-empty-text">Nothing added for this academic year yet.</p>
        )}
      </>
    );
  };

  const body = (
    <>
        <p className="section-desc" style={{ marginTop: '0.4rem', marginBottom: 'var(--space-6)' }}>
          Latest department announcements, academic activities, workshops, and student achievements.
        </p>

        {showFlatCarousel ? (
          <HorizontalEventsShowcase cards={flatEventCards} />
        ) : (
          <>
            {/* Category Tabs — pointless (and visually redundant) with only
                one category, so only shown when there's a real choice. */}
            {withContent.length > 1 && (
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
            )}

            {/* Collapsible Academic Year List */}
            {active.years.length > 0 ? (
              <div className="news-events-accordion-list" style={{ marginTop: 'var(--space-6)' }}>
                {active.years.map((yr, yi) => {
                  const isExpanded = expandedYearIndex === yi;
                  // A year whose label just repeats its category's own name
                  // isn't a real distinct year — it's a plain Custom Section
                  // with no sub-sections. Showing it behind its own click-to-
                  // expand trigger would just repeat the category label a
                  // second time; render its content directly instead.
                  const skipHeader = active.years.length === 1 && yr.year === active.label;

                  if (skipHeader) {
                    return (
                      <div key={yi} className="news-events-accordion-item">
                        <div className="news-events-accordion-panel">
                          {renderYearBody(yr)}
                        </div>
                      </div>
                    );
                  }

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
                          {renderYearBody(yr)}
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
        )}
    </>
  );

  if (embedded) return body;

  return (
    <section id="news-events" className="section bg-white" style={{ scrollMarginTop: navOffset }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Events &amp; Happenings</h2>
        </div>
        <div id="news-events-panel-wrap">
          {body}
        </div>
      </div>
    </section>
  );
}
