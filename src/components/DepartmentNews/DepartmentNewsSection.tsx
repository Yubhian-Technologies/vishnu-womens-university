import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { formatDate } from '../../lib/formatDate';
import SmoothImage from '../SmoothImage/SmoothImage';
import './DepartmentNewsSection.css';

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

// One News & Events entry, tagged to a single program slug. Managed from
// /admin -> Department News & Events. Shape mirrors the global `news`
// collection plus a `program` tag.
export interface DepartmentNewsDoc {
  id: string;
  program: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  body: string;
  imageUrl: string;
  storagePath: string;
}

interface Props {
  /** Program slug(s) to show News & Events for. Pass an array on the shared
   *  AI/CSE/ECE department page so items entered under any programme in the
   *  group show on every side of the toggle. */
  programSlug: string | string[];
  /** Wrapping <section> background — alternate with the section above it. */
  background?: string;
}

/**
 * News & Events feed for one program (or a whole grouped department). Renders
 * nothing until at least one `departmentNews` doc is tagged to one of the
 * given slug(s), so pages without any entries are visually unchanged.
 */
export default function DepartmentNewsSection({ programSlug, background = 'var(--color-white)' }: Props) {
  const { docs } = useOrderedCollection<DepartmentNewsDoc>('departmentNews', 'date', 'desc');
  const slugs = Array.isArray(programSlug) ? programSlug : [programSlug];
  const items = docs.filter((n) => slugs.includes(n.program));
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (items.length === 0) return null;

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section id="news" className="section" style={{ background, scrollMarginTop: NAV_OFFSET }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <span className="section-label">Latest Updates</span>
          <h2 className="section-title">News &amp; Events</h2>
          <p className="section-desc">
            Announcements, events, achievements and activities from the department.
          </p>
        </div>

        <div className="dept-news-grid">
          {items.map((item) => {
            const isOpen = expanded.has(item.id);
            return (
              <article key={item.id} className={`dept-news-card${isOpen ? ' open' : ''}`}>
                {item.imageUrl && (
                  <div className="dept-news-card__media">
                    <SmoothImage src={item.imageUrl} alt={item.title} />
                    <span className="dept-news-card__badge">{item.category}</span>
                  </div>
                )}
                <div className="dept-news-card__body">
                  <span className="dept-news-card__date">
                    <CalendarDays size={13} strokeWidth={1.75} /> {formatDate(item.date)}
                  </span>
                  <h3 className="dept-news-card__title">{item.title}</h3>
                  {item.summary && <p className="dept-news-card__summary">{item.summary}</p>}
                  {item.body && (
                    <>
                      <div className="dept-news-card__collapse" aria-hidden={!isOpen}>
                        <div className="dept-news-card__collapse-inner">
                          <p className="dept-news-card__full">{item.body}</p>
                        </div>
                      </div>
                      <button type="button" className="dept-news-card__more" onClick={() => toggle(item.id)}>
                        {isOpen ? '← Show less' : 'Read more →'}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
