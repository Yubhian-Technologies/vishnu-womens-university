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
  // When given, the title and "Read More" call this instead of navigating
  // to article.path — used for happening-backed cards (see
  // lib/happenings.ts / NewsArticleDialog), which have no separate detail
  // page to link to and open a dialog with the image/excerpt in place
  // instead.
  onReadMore?: () => void;
}

export default function NewsCard({ article, className = '', onReadMore }: NewsCardProps) {
  return (
    <article className={`news-card ${className}`} aria-label={article.title}>
      <div className="news-card-image-wrap">
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          className="news-card-image"
        />
        <span className="news-card-category">{article.category}</span>
      </div>
      <div className="news-card-body">
        <time className="news-card-date" dateTime={article.date}>{article.date}</time>
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
              Read More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <Link to={article.path} className="news-card-link">
              Read More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
