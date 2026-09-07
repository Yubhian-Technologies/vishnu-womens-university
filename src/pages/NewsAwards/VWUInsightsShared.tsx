import { Link } from 'react-router-dom';
import { INSIGHT_CATEGORIES, type InsightCategory, type InsightDoc } from '../Admin/sections/InsightsAdmin';

export const insightPath = (slug: InsightCategory) => `/news-awards/vwu-insights/${slug}`;

export function formatInsightDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Stanford-style horizontal section nav shared by the landing + section pages. */
export function SectionNav({ active }: { active?: InsightCategory }) {
  return (
    <nav className="vwui-secnav" aria-label="VWU Insights sections">
      {INSIGHT_CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          to={insightPath(c.slug)}
          className={`vwui-secnav-link${active === c.slug ? ' is-active' : ''}`}
          aria-current={active === c.slug ? 'page' : undefined}
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}

/** Article card. Non-interactive for now — the detail page isn't wired yet. */
export function InsightCard({ post, showSection = false }: { post: InsightDoc; showSection?: boolean }) {
  const sectionLabel = INSIGHT_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category;
  return (
    <article className="vwui-card">
      <div className="vwui-card-media">
        {post.imageUrl
          ? <img src={post.imageUrl} alt="" loading="lazy" />
          : <div className="vwui-card-media-ph" aria-hidden="true" />}
      </div>
      <div className="vwui-card-text">
        {showSection && <span className="vwui-card-section">{sectionLabel}</span>}
        <div className="vwui-card-meta">
          <time>{formatInsightDate(post.date)}</time>
          {post.readMinutes ? <><span className="vwui-dot" />{post.readMinutes} min read</> : null}
        </div>
        <h3 className="vwui-card-title">{post.title}</h3>
        {post.dek && <p className="vwui-card-dek">{post.dek}</p>}
        {post.author && <p className="vwui-card-byline">{post.author}</p>}
      </div>
    </article>
  );
}
