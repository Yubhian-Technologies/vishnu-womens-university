import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Building2, ArrowLeft, Share2, Check } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import NewsCard from '../../components/NewsCard/NewsCard';
import SEO from '../../components/SEO/SEO';
import { useDocument } from '../../hooks/useDocument';
import { useOrderedCollection } from '../../hooks/useCollection';
import { happeningToArticle } from '../../lib/happenings';
import type { HappeningDoc } from '../Admin/sections/NewsAwardsDataAdmin';
import './HappeningDetail.css';

export default function HappeningDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: item, loading } = useDocument<HappeningDoc>('happenings', id);
  const { docs: allHappenings } = useOrderedCollection<HappeningDoc>('happenings', 'order');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (item?.title) {
      document.title = `${item.title} | Vishnu Women's University`;
    }
  }, [item]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item?.title || "VWU Happening",
          text: item?.description?.slice(0, 100) || "Check out this update from Vishnu Women's University",
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard if share dismissed or unsupported
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const otherRecent = allHappenings
    .filter((h) => h.id !== id && h.type === 'recent')
    .slice(0, 3);

  if (loading) {
    return (
      <main className="page-wrapper">
        <PageHero
          page="news-awards-happenings"
          defaultTitle="Loading..."
          breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Happenings', to: '/news-awards/happenings' }]}
        />
        <section className="section bg-white">
          <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--color-text-light)' }}>Loading happening details...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="page-wrapper">
        <PageHero
          page="news-awards-happenings"
          defaultTitle="Article Not Found"
          breadcrumb={[{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Happenings', to: '/news-awards/happenings' }]}
        />
        <section className="section bg-white">
          <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2>Article Not Found</h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
              The happening or news story you are looking for does not exist or has been removed.
            </p>
            <Link to="/news-awards/happenings" className="btn btn-accent">
              <ArrowLeft size={16} />
              <span>Back to Happenings</span>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-wrapper happening-detail-page">
      <SEO
        title={`${item.title} | Vishnu Women's University`}
        description={item.description?.slice(0, 155) || `${item.title} - Vishnu Women's University campus happening.`}
        canonicalPath={`/news-awards/happenings/${item.id}`}
      />

      <PageHero
        page="news-awards-happenings"
        defaultTitle={item.title}
        defaultSubtitle={item.dept ? `Department: ${item.dept}` : 'VWU Campus Event & News'}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'News & Awards', to: '/news-awards' },
          { label: 'Happenings', to: '/news-awards/happenings' },
          { label: item.title },
        ]}
      />

      <section className="section bg-white">
        <div className="container happ-detail-container">
          <div className="happ-detail-back-bar">
            <Link to="/news-awards/happenings#recent-events" className="happ-detail-back-link">
              <ArrowLeft size={16} />
              <span>Back to Recent Events</span>
            </Link>
            <button type="button" className="happ-detail-share-btn" onClick={handleShare}>
              {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          <article className="happ-detail-card">
            {/* Meta badges strip */}
            <div className="happ-detail-meta">
              {item.date && (
                <span className="happ-meta-badge happ-meta-badge--date">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </span>
              )}
              {item.dept && (
                <span className="happ-meta-badge happ-meta-badge--dept">
                  <Building2 size={14} />
                  <span>{item.dept}</span>
                </span>
              )}
            </div>

            {/* Article Heading */}
            <h1 className="happ-detail-title">{item.title}</h1>

            {/* Main Featured Image */}
            {item.imageUrl && (
              <div className="happ-detail-img-wrap">
                <img src={item.imageUrl} alt={item.title} className="happ-detail-img" />
              </div>
            )}

            {/* Article Description / Body */}
            <div className="happ-detail-body">
              {item.description ? (
                item.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="happ-detail-paragraph">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="happ-detail-paragraph">
                  No additional details provided for this campus event.
                </p>
              )}
            </div>
          </article>

          {/* Related / Other Recent Events */}
          {otherRecent.length > 0 && (
            <div className="happ-detail-related">
              <div className="section-head-left" style={{ marginBottom: '1.5rem' }}>
                <span className="section-label">More Updates</span>
                <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Other Recent Happenings</h2>
              </div>

              <div className="happ-detail-related-grid">
                {otherRecent.map((ev) => {
                  const article = happeningToArticle(ev);
                  return <NewsCard key={ev.id} article={article} />;
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
