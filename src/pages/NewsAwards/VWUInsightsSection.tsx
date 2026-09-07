import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import { INSIGHT_CATEGORIES, type InsightCategory, type InsightDoc } from '../Admin/sections/InsightsAdmin';
import { SectionNav, InsightCard } from './VWUInsightsShared';
import './VWUInsights.css';

export default function VWUInsightsSection({ category }: { category: InsightCategory }) {
  const meta = INSIGHT_CATEGORIES.find((c) => c.slug === category)!;
  const { docs: all, loading } = useOrderedCollection<InsightDoc>('insights', 'date', 'desc');
  const posts = all.filter((p) => p.category === category);

  useEffect(() => {
    document.title = `${meta.label} | VWU Insights`;
  }, [meta.label]);

  return (
    <main className="vwui-page">
      <header className="vwui-masthead">
        <div className="vwui-masthead-inner">
          <Link to="/news-awards/vwu-insights" className="vwui-eyebrow vwui-eyebrow-link">VWU Insights</Link>
          <h1 className="vwui-title">{meta.label}</h1>
        </div>
      </header>

      <div className="vwui-secnav-wrap">
        <div className="vwui-secnav-inner">
          <SectionNav active={category} />
        </div>
      </div>

      <section className="vwui-body">
        {loading ? (
          <p className="vwui-empty">Loading&hellip;</p>
        ) : posts.length === 0 ? (
          <p className="vwui-empty">No {meta.label} articles yet.</p>
        ) : (
          <div className="vwui-grid">
            {posts.map((post) => (
              <InsightCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>More from VWU</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/news-awards/vwu-insights" className="btn btn-accent">All VWU Insights</Link>
            <Link to="/news-awards/happenings" className="btn btn-secondary">Happenings at VWU</Link>
            <Link to="/news-awards" className="btn btn-secondary">Back to News &amp; Awards</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
