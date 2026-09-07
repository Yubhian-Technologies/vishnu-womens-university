import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import { type InsightDoc } from '../Admin/sections/InsightsAdmin';
import { SectionNav, InsightCard } from './VWUInsightsShared';
import './VWUInsights.css';

export default function VWUInsights() {
  const { docs: posts, loading } = useOrderedCollection<InsightDoc>('insights', 'date', 'desc');

  useEffect(() => {
    document.title = "VWU Insights | Vishnu Women's University";
  }, []);

  const latest = posts.slice(0, 9);

  return (
    <main className="vwui-page">
      <header className="vwui-masthead">
        <div className="vwui-masthead-inner">
          <span className="vwui-eyebrow">VWU Insights</span>
          <h1 className="vwui-title">Stories, research, and life at Vishnu Women&rsquo;s University</h1>
          <p className="vwui-dek">
            Reporting and perspective from across the university &mdash; the work of our faculty and
            students, and the community they build.
          </p>
        </div>
      </header>

      <div className="vwui-secnav-wrap">
        <div className="vwui-secnav-inner">
          <SectionNav />
        </div>
      </div>

      <section className="vwui-body">
        <h2 className="vwui-strip-title">Latest</h2>
        {loading ? (
          <p className="vwui-empty">Loading&hellip;</p>
        ) : latest.length === 0 ? (
          <p className="vwui-empty">No articles have been published yet.</p>
        ) : (
          <div className="vwui-grid">
            {latest.map((post) => (
              <InsightCard key={post.id} post={post} showSection />
            ))}
          </div>
        )}
      </section>

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>More from VWU</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/news-awards/happenings" className="btn btn-accent">Happenings at VWU</Link>
            <Link to="/news-awards/gallery" className="btn btn-secondary">Gallery</Link>
            <Link to="/news-awards" className="btn btn-secondary">Back to News &amp; Awards</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
