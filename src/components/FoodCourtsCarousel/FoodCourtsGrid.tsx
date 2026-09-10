import { MapPin } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { CampusLifeItemDoc } from '../../pages/Admin/sections/CampusLifeAdmin';
import SmoothImage from '../SmoothImage/SmoothImage';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';

interface GridCard {
  key: string;
  name: string;
  imageUrl: string;
}

// Same real food court names as the page copy in FoodCourts.tsx — duplicated
// (not imported) since this is only a fallback label set, shown as
// placeholder tiles until an admin adds real photo cards for this page via
// /admin -> Campus Life -> Food Courts (same source FoodCourtsCarousel reads).
const FALLBACK_NAMES = [
  'Canoe & Cusine', 'Brewista', 'Tea Leaf', 'Central Square',
  'Bakers Treat', 'Tasty Corner', 'Nescafe Coffee Shops', 'Lake View Court',
];

export default function FoodCourtsGrid() {
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const page = items.find((i) => i.slug === 'food-courts');
  const liveCards = (page?.customSections || [])
    .filter((s) => s.contentType === 'imageCards')
    .flatMap((s) => s.imageCards || [])
    .filter((c) => c.imageUrl);

  const cards: GridCard[] = liveCards.length > 0
    ? liveCards.map((c, i) => ({ key: c.storagePath || String(i), name: c.title, imageUrl: c.imageUrl }))
    : FALLBACK_NAMES.map((name, i) => ({ key: String(i), name, imageUrl: PHOTO_NEEDED_PLACEHOLDER }));

  return (
    <div className="food-courts-grid">
      {cards.map((card) => (
        <div className="food-courts-grid__card" key={card.key}>
          <SmoothImage src={card.imageUrl} alt={card.name} className="food-courts-grid__image" />
          <div className="food-courts-grid__scrim" />
          <div className="food-courts-grid__label">
            <MapPin size={14} strokeWidth={2.4} />
            <span>{card.name}</span>
          </div>
        </div>
      ))}
      <style>{`
        .food-courts-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-5);
        }
        .food-courts-grid__card {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: transform var(--transition-smooth), box-shadow var(--transition-smooth);
        }
        .food-courts-grid__card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .food-courts-grid__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-smooth);
        }
        .food-courts-grid__card:hover .food-courts-grid__image {
          transform: scale(1.06);
        }
        .food-courts-grid__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11, 30, 66, 0) 50%, rgba(11, 30, 66, 0.75) 100%);
        }
        .food-courts-grid__label {
          position: absolute;
          left: var(--space-3);
          right: var(--space-3);
          bottom: var(--space-3);
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: var(--text-sm);
        }
        .food-courts-grid__label span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .food-courts-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .food-courts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
