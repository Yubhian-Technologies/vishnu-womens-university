import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { NewsArticle } from './NewsCard';
import './NewsArticleDialog.css';

interface Props {
  article: NewsArticle | null;
  onClose: () => void;
}

/** Detail dialog opened by a NewsCard's title/"Read More" when it was given
 *  `onReadMore` — currently the happening-backed cards on the Home page and
 *  /news-awards/happenings (see lib/happenings.ts), which have no separate
 *  detail page of their own to link to. */
export default function NewsArticleDialog({ article, onClose }: Props) {
  useEffect(() => {
    if (!article) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div className="news-article-dialog-overlay" onClick={onClose}>
      <div className="news-article-dialog" role="dialog" aria-modal="true" aria-label={article.title} onClick={(e) => e.stopPropagation()}>
        <button className="news-article-dialog-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="news-article-dialog-image">
          <img src={article.imageUrl} alt={article.imageAlt} />
          <span className="news-article-dialog-category">{article.category}</span>
        </div>
        <div className="news-article-dialog-body">
          <time className="news-article-dialog-date">{article.date}</time>
          <h3 className="news-article-dialog-title">{article.title}</h3>
          {article.excerpt
            ? <p className="news-article-dialog-desc">{article.excerpt}</p>
            : <p className="news-article-dialog-desc news-article-dialog-desc--empty">More details coming soon.</p>}
        </div>
      </div>
    </div>
  );
}
