import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { parseProfessionalBodyContent } from '../../lib/professionalBodyContent';
import { type ProfessionalBodyDoc } from '../Admin/sections/ProfessionalBodiesAdmin';
import ProfessionalBodyContentBlocks from './ProfessionalBodyContentBlocks';
import '../detail-layout.css';

// One Professional Body's own page — reached by clicking its logo on
// /research/professional-bodies (see ProfessionalBodiesSection.tsx). Shares
// the "research-detail" hero banner with every other /research/:slug page
// rather than needing its own admin banner slug, since this is one level
// further down (/research/professional-bodies/:key), not a top-level
// Research item of its own.
export default function ProfessionalBodyDetail() {
  const { key } = useParams<{ key: string }>();
  const { docs: bodies, loading } = useOrderedCollection<ProfessionalBodyDoc>('professionalBodies', 'order');
  const { slides: heroSlides } = usePageBanners('research-detail');
  const body = bodies.find((b) => b.key === key) ?? null;

  useEffect(() => {
    if (body) document.title = `${body.fullName} | Vishnu Women's University`;
  }, [body]);

  if (!body) {
    if (loading) {
      return (
        <RouteFallback />
      );
    }
    return <Navigate to="/research/professional-bodies" replace />;
  }

  const heroImage = heroSlides[0]?.imageUrl;
  const content = parseProfessionalBodyContent(body.contentText);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 340 }}>
        {heroImage && (
          <img src={heroImage} alt={body.fullName} className="page-hero-image" loading="eager" decoding="sync" {...fetchPriorityAttr('high')} />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/research" className="breadcrumb-item">Research & Development</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/research/professional-bodies" className="breadcrumb-item">Professional Bodies</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{body.shortName}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Users size={14} /> Professional Bodies
          </div>
          <h1>{body.fullName}</h1>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <span className="pb-grid-logo" style={{ width: 72, height: 72 }}>
              {body.imageUrl ? (
                <img src={body.imageUrl} alt={body.fullName} />
              ) : (
                <span className="pb-grid-logo-fallback">{body.shortName}</span>
              )}
            </span>
            <div>
              <span className="section-label">Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>{body.shortName}</h2>
            </div>
          </div>
          <ProfessionalBodyContentBlocks body={content} />
        </div>
      </section>
    </main>
  );
}
