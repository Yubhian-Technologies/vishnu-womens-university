import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { NEWS_FALLBACK_IMAGE } from '../../../lib/news';
import SmoothImage from '../../../components/SmoothImage/SmoothImage';
import Reveal from '../Reveal';

interface NewsDoc {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  body: string;
  imageUrl: string;
  featured: boolean;
}

function readTime(body: string) {
  const words = body ? body.trim().split(/\s+/).length : 0;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function News() {
  const { docs } = useOrderedCollection<NewsDoc>('news', 'date', 'desc');
  const items = docs.slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="lpe-section lpe-section--dim lpe-news" id="news" aria-label="Latest news">
      <div className="lpe-container lpe-news__grid">
        <Reveal index={0} className="lpe-news__col">
          <span className="lpe-eyebrow">VWU News</span>
          <h2 className="lpe-h2">Stories to keep you<br /><span className="lpe-italic">informed and inspired.</span></h2>
          <p className="lpe-lede" style={{ marginBottom: '1.5rem' }}>
            News, research breakthroughs, and campus milestones from Vishnu Women&rsquo;s University.
          </p>
          <Link to="/news" className="lpe-btn lpe-btn--pill">VWU News</Link>
        </Reveal>

        <div className="lpe-news__cards">
          {items.map((n, i) => (
            <Reveal key={n.id} index={i} variant="media" className="lpe-card">
              <div className="lpe-card__media">
                <SmoothImage src={n.imageUrl || NEWS_FALLBACK_IMAGE} alt={n.title} loading="lazy" />
              </div>
              <div className="lpe-card__body">
                <span className="lpe-card__meta lpe-card__meta--category">{n.category}</span>
                <h3 className="lpe-card__title">{n.title}</h3>
                <p className="lpe-card__desc">{n.summary}</p>
                <span className="lpe-card__meta">{readTime(n.body)} &nbsp;|&nbsp; {n.date}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
