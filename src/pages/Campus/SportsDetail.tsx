import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useDocument } from '../../hooks/useDocument';
import type { SportsCategoryDoc } from '../../lib/sportsPage';
import './SportsDetail.css';

// One detail page per "Explore Our Sports" tile, addressed by Firestore doc
// id (no slug field to manage / no collision risk if two sports share a
// name). About text and the gallery are both optional and admin-only —
// nothing here is hardcoded, and each section simply doesn't render until
// an admin adds it from Admin -> Sports -> Explore Our Sports.
export default function SportsDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: sport, loading } = useDocument<SportsCategoryDoc>('sportsCategories', id);

  useEffect(() => {
    document.title = sport ? `${sport.title} | Sports | VWU` : 'Sports | VWU';
  }, [sport]);

  if (loading) return <RouteFallback />;

  if (!sport) {
    return (
      <main className="page-wrapper sports-detail-page sports-detail-page--missing">
        <div className="container">
          <p className="sports-detail__missing">This sport couldn&rsquo;t be found.</p>
          <Link to="/campus/sports" className="sports-detail__back">
            <ArrowLeft size={16} /> Back to Sports
          </Link>
        </div>
      </main>
    );
  }

  const gallery = sport.gallery || [];

  return (
    <main className="page-wrapper sports-detail-page">
      <div className="sports-detail__hero">
        {sport.imageUrl && <img src={sport.imageUrl} alt={sport.title} className="sports-detail__hero-img" />}
        <div className="sports-detail__hero-overlay" />
        <div className="container sports-detail__hero-content">
          <Link to="/campus/sports" className="sports-detail__back">
            <ArrowLeft size={16} /> Back to Sports
          </Link>
          {sport.categoryTag && <span className="sports-detail__tag">{sport.categoryTag}</span>}
          <h1 className="sports-detail__title">{sport.title}</h1>
          {sport.subtitle && <p className="sports-detail__subtitle">{sport.subtitle}</p>}
        </div>
      </div>

      {sport.about && (
        <section className="sports-detail__section">
          <div className="container sports-detail__about">
            <h2 className="sports-detail__section-title">About {sport.title}</h2>
            {sport.about.split('\n').filter((p) => p.trim()).map((para, i) => (
              <p key={i} className="sports-detail__about-para">{para}</p>
            ))}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="sports-detail__section sports-detail__section--alt">
          <div className="container">
            <h2 className="sports-detail__section-title">Gallery</h2>
            <div className="sports-detail__gallery">
              {gallery.map((g, i) => (
                <div className="sports-detail__gallery-item" key={g.storagePath || i}>
                  <img src={g.url} alt={`${sport.title} ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
