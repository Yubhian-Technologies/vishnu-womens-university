import { useOrderedCollection } from './useCollection';
import type { SitePhotoDoc } from '../pages/Admin/sections/SitePhotosAdmin';
import type { PhotoItem } from '../components/PhotoGrid/PhotoGrid';

/**
 * PhotoGrid-ready photos for one (page, section) gallery, merged per slot
 * against `defaults`: a live doc at `order === i` overrides `defaults[i]`;
 * a slot with no live doc keeps showing its default, so replacing one slot
 * can never blank out the others. Live docs with `order >= defaults.length`
 * are appended as extra, admin-added photos beyond the default set.
 * A missing `section` on a live doc is treated as `'main'` (today's
 * pre-existing galleries, created before sections existed).
 */
export function useSitePhotos(page: string, section: string, defaults: PhotoItem[]): PhotoItem[] {
  const { docs } = useOrderedCollection<SitePhotoDoc>('sitePhotos', 'order');
  const live = docs.filter((p) => p.page === page && (p.section ?? 'main') === section);
  if (live.length === 0) return defaults;

  const byOrder = new Map(live.map((p) => [p.order, p]));
  const merged = defaults.map((def, i) => {
    const override = byOrder.get(i);
    return override ? { src: override.imageUrl, alt: override.alt, caption: override.caption } : def;
  });
  const extra = live
    .filter((p) => p.order >= defaults.length)
    .sort((a, b) => a.order - b.order)
    .map((p) => ({ src: p.imageUrl, alt: p.alt, caption: p.caption }));

  return [...merged, ...extra];
}

/** Whether a (page, section) gallery has any real, admin-uploaded photo yet. */
export function useSectionHasPhotos(page: string, section: string): boolean {
  const { docs } = useOrderedCollection<SitePhotoDoc>('sitePhotos', 'order');
  return docs.some((p) => p.page === page && (p.section ?? 'main') === section);
}
