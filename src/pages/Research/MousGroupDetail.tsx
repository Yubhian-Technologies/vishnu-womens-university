import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Handshake } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import type { MousPartnerLogoDoc } from '../Admin/sections/MousPartnerLogosAdmin';
import '../detail-layout.css';

// The full partner list for one MoUs group (e.g. "Foreign Universities") —
// reached via "+ More" on /research/mous, which only shows each group's
// first 10 partners inline. Shares the "research-detail" hero banner like
// ProfessionalBodyDetail.tsx, for the same reason (one level below a
// top-level Research item, not one of its own).
export default function MousGroupDetail() {
  const { group } = useParams<{ group: string }>();
  const groupName = group ? decodeURIComponent(group) : '';
  const { docs: allPartners, loading } = useOrderedCollection<MousPartnerLogoDoc>('mousPartnerLogos', 'order');
  const { slides: heroSlides } = usePageBanners('research-detail');
  const partners = allPartners.filter((p) => (p.section || '') === groupName);

  useEffect(() => {
    if (groupName) document.title = `${groupName} | MoUs | Vishnu Women's University`;
  }, [groupName]);

  if (!loading && partners.length === 0) return <Navigate to="/research/mous" replace />;
  if (loading) return <RouteFallback />;

  const heroImage = heroSlides[0]?.imageUrl;

  return (
    <main className="page-wrapper">
      <section className="page-hero" style={{ minHeight: 340 }}>
        {heroImage && (
          <img src={heroImage} alt={groupName} className="page-hero-image" loading="eager" decoding="sync" {...fetchPriorityAttr('high')} />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/research" className="breadcrumb-item">Research & Development</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/research/mous" className="breadcrumb-item">MoUs</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{groupName}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Handshake size={14} /> MoUs
          </div>
          <h1>{groupName}</h1>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Details</span>
            <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{groupName}</h2>
          </div>
          <div className="pb-grid pb-grid--mous">
            {partners.map((p) => {
              const content = (
                <>
                  <span className="pb-grid-logo">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.label} />
                    ) : (
                      <span className="pb-grid-logo-fallback">{p.label}</span>
                    )}
                  </span>
                  <span className="pb-grid-name">{p.label}</span>
                </>
              );
              return p.pdfUrl ? (
                <a key={p.id} href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="pb-grid-item">
                  {content}
                </a>
              ) : (
                <div key={p.id} className="pb-grid-item">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
