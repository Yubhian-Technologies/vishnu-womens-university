import { Link } from 'react-router-dom';
import './NewsCard.css';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  path: string;
}

interface NewsCardProps {
  article: NewsArticle;
  className?: string;
  isFeatured?: boolean;
  // When given, the title and "Read article" call this instead of navigating
  // to article.path — used for happening-backed cards (see
  // lib/happenings.ts / NewsArticleDialog), which have no separate detail
  // page to link to and open a dialog with the image/excerpt in place
  // instead.
  onReadMore?: () => void;
}

export default function NewsCard({ article, className = '', isFeatured = false, onReadMore }: NewsCardProps) {
  const showCategory = Boolean(article.category && article.category.trim().toLowerCase() !== 'recent');

  return (
    <article className={`news-card ${isFeatured ? 'news-card--featured' : ''} ${className}`} aria-label={article.title}>
      <div className="news-card-image-wrap">
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          className="news-card-image"
          loading="lazy"
        />
        {showCategory && <span className="news-card-category">{article.category}</span>}
      </div>
      <div className="news-card-body">
        <time className="news-card-date" dateTime={article.date}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9973A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="news-card-date-icon">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{article.date}</span>
        </time>
        {onReadMore ? (
          <button type="button" className="news-card-title news-card-title--btn" onClick={onReadMore}>
            {article.title}
          </button>
        ) : (
          <Link to={article.path} className="news-card-title">
            {article.title}
          </Link>
        )}
        <p className="news-card-excerpt">{article.excerpt}</p>
        <div className="news-card-footer">
          {onReadMore ? (
            <button type="button" className="news-card-link news-card-link--btn" onClick={onReadMore}>
              <span>Read article</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          ) : (
            <Link to={article.path} className="news-card-link">
              <span>Read article</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
