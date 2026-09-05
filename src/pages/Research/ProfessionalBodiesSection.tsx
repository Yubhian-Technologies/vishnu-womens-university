import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import { type ProfessionalBodyDoc } from '../Admin/sections/ProfessionalBodiesAdmin';

// The Professional Bodies list is a grid of circular logos (5 per row) —
// each links through to that body's own page (/research/professional-
// bodies/:key, see ProfessionalBodyDetail.tsx) which renders its full
// content (paragraphs, advisor/chair details, chapter info, activity log —
// see professionalBodyContent.ts). A body with no logo uploaded yet
// (Admin → Research → Professional Bodies → Logo) just shows its short
// name inside the circle instead of leaving a blank tile.
export default function ProfessionalBodiesSection() {
  const { docs: bodies } = useOrderedCollection<ProfessionalBodyDoc>('professionalBodies', 'order');

  return (
    <div className="pb-grid">
      {bodies.map((body) => (
        <Link key={body.id} to={`/research/professional-bodies/${body.key}`} className="pb-grid-item">
          <span className="pb-grid-logo">
            {body.imageUrl ? (
              <img src={body.imageUrl} alt={body.fullName} />
            ) : (
              <span className="pb-grid-logo-fallback">{body.shortName}</span>
            )}
          </span>
          <span className="pb-grid-name">{body.shortName}</span>
        </Link>
      ))}
    </div>
  );
}
