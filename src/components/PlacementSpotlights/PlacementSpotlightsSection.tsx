import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { PlacementHighlightDoc } from '../../pages/Admin/sections/PlacementHighlightsAdmin';
import './PlacementSpotlightsSection.css';

function SpotlightCard({ item }: { item: PlacementHighlightDoc }) {
  return (
    <article className="ph-spot-card">
      <div className="ph-spot-card__image">
        <img src={item.photoUrl} alt={item.name} loading="lazy" />
        <div className="ph-spot-card__scrim" aria-hidden="true" />
        <div className="ph-spot-card__logo">
          {item.logoUrl ? (
            <img src={item.logoUrl} alt={item.companyName || 'Recruiter'} loading="lazy" />
          ) : (
            <Building2 size={18} strokeWidth={1.75} aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="ph-spot-card__info">
        <p className="ph-spot-card__name">{item.name}</p>
        {item.role && <p className="ph-spot-card__role">{item.role}</p>}
        <div className="ph-spot-card__package">{item.package}</div>
      </div>
    </article>
  );
}

/**
 * Home page-only section — a 4/2/1-column grid of placement highlight
 * cards, each showing only logo, student name, role, and package. Reuses
 * the same `placementHighlights` collection (admin-managed via /admin ->
 * Home — Placement Highlights) that already powers WomensEducationSection's
 * rotating card and LatestGraduatesShowcase's carousel — this is a third,
 * differently-laid-out view of the same data, not a separate collection.
 * Renders nothing until at least one highlight exists — no mock data,
 * same convention as those two sections.
 *
 * No .reveal/IntersectionObserver animation classes — see CLAUDE.md's
 * Firestore-vs-scroll-reveal gotcha; content gated behind live data renders
 * plainly instead.
 */
export default function PlacementSpotlightsSection() {
  const { docs: highlights } = useOrderedCollection<PlacementHighlightDoc>('placementHighlights', 'order');
  if (highlights.length === 0) return null;

  return (
    <section className="ph-spot-section" aria-label="Recent Placement Highlights">
      <div className="container">
        <div className="ph-spot-header">
          <div className="ph-spot-header__text">
            <span className="ph-spot-eyebrow">Placement Highlights</span>
            <h2 className="ph-spot-title">Recent Placement Highlights</h2>
            <p className="ph-spot-subtitle">Celebrating our students' success with leading companies.</p>
          </div>
          <Link to="/placements" className="ph-spot-viewall">
            <span>View All Placements</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="ph-spot-grid">
          {highlights.map((item) => <SpotlightCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
