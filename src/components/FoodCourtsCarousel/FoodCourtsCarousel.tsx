import { useOrderedCollection } from '../../hooks/useCollection';
import type { CampusLifeItemDoc } from '../../pages/Admin/sections/CampusLifeAdmin';
import PhotoCarouselStrip from '../PhotoCarousel/PhotoCarouselStrip';

/**
 * Photo carousel of campus food courts. No dedicated admin section of its
 * own — deliberately reuses the *existing* Campus Life admin (see
 * /admin -> Campus Life -> "Food Courts" page -> add an "Images (photo +
 * caption each)" section), same as every other facility page's photo
 * content. This component just reads that page's `imageCards` and feeds
 * them straight into PhotoCarouselStrip (originally built for Placement
 * Highlights' "notable people" strip — the shape is identical: a photo, a
 * name underneath, click-to-zoom).
 *
 * A card with no photo uploaded yet is filtered out, same "hidden until
 * real content exists" pattern as every other Firestore-backed section on
 * this site (see CLAUDE.md's content model notes).
 */
export default function FoodCourtsCarousel() {
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const page = items.find((i) => i.slug === 'food-courts');
  const cards = (page?.customSections || [])
    .filter((s) => s.contentType === 'imageCards')
    .flatMap((s) => s.imageCards || [])
    .filter((c) => c.imageUrl);

  if (cards.length === 0) return null;

  return (
    <PhotoCarouselStrip
      cards={cards.map((c, i) => ({
        name: c.title,
        subtitle: c.description,
        imageUrl: c.imageUrl,
        storagePath: c.storagePath || String(i),
      }))}
    />
  );
}
