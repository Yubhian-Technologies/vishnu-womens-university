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
}

export default function NewsCard({ article, className = '' }: NewsCardProps) {
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
        <time className="news-card-date" dateTime={article.date}>
          <i className="fa-solid fa-calendar-days" aria-hidden="true" /> {article.date}
        </time>
        <Link to={article.path} className="news-card-title">
          {article.title}
        </Link>
        <p className="news-card-excerpt">{article.excerpt}</p>
        <div className="news-card-footer">
          <Link to={article.path} className="news-card-link">
            Read More
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
