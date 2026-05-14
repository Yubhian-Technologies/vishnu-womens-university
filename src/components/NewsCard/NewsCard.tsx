import { Link } from 'react-router-dom';
import './NewsCard.css';

export interface NewsArticle {
  id: number;
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
}

export default function NewsCard({ article, className = '' }: NewsCardProps) {
  return (
    <article className={`news-card ${className}`} aria-label={article.title}>
      <div className="news-card-image-wrap">
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          className="news-card-image"
          loading="lazy"
        />
        <span className="news-card-category">{article.category}</span>
      </div>
      <div className="news-card-body">
        <time className="news-card-date" dateTime={article.date}>{article.date}</time>
        <Link to={article.path} className="news-card-title">
          {article.title}
        </Link>
        <p className="news-card-excerpt">{article.excerpt}</p>
        <div className="news-card-footer">
          <Link to={article.path} className="news-card-link">
            Read More
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
