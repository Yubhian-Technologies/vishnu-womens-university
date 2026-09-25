import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { reportFirestoreError, clearFirestoreError } from './firestoreErrorStore';
import type { SitePhotoDoc } from '../pages/Admin/sections/SitePhotosAdmin';
import type { PhotoItem } from '../components/PhotoGrid/PhotoGrid';
import { PHOTO_NEEDED_PLACEHOLDER } from '../lib/photoPlaceholder';

// One shared, reference-counted listener *per page slug* — not one listener
// for the whole `sitePhotos` collection. That used to mean every call
// anywhere on the site (Home alone calls this 3+ times) opened (or shared)
// a single listener that read every photo on every page across the whole
// site, just to show the handful that page actually needed. Filtering by
// `page` server-side means a page only ever pays for its own photos.
// Multiple sections on the same page still share one listener (filtered
// further by `section` in memory below), same sharing benefit as before,
// just scoped to the page instead of the whole site.
interface PageCache {
  docs: SitePhotoDoc[];
  loading: boolean;
  unsubscribe: (() => void) | null;
  subscribers: Set<() => void>;
  teardownTimer: ReturnType<typeof setTimeout> | null;
}

const pageCaches = new Map<string, PageCache>();

// See useContentBlocks.ts for why this grace period exists — same reasoning,
// same shared-across-navigation benefit.
const TEARDOWN_GRACE_MS = 4000;

function subscribe(page: string, listener: () => void) {
  let cache = pageCaches.get(page);
  if (!cache) {
    cache = { docs: [], loading: true, unsubscribe: null, subscribers: new Set(), teardownTimer: null };
    pageCaches.set(page, cache);
  }
  cache.subscribers.add(listener);
  if (cache.teardownTimer) {
    clearTimeout(cache.teardownTimer);
    cache.teardownTimer = null;
  }
  if (!cache.unsubscribe) {
    cache.loading = true;
    const errorKey = `sitePhotos/${page}`;
    const q = query(collection(db, 'sitePhotos'), where('page', '==', page), orderBy('order'));
    cache.unsubscribe = onSnapshot(
      q,
      (snap) => {
        cache.docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SitePhotoDoc));
        cache.loading = false;
        clearFirestoreError(errorKey);
        cache.subscribers.forEach((l) => l());
      },
      (err) => {
        cache.loading = false;
        reportFirestoreError(errorKey, err.message);
        cache.subscribers.forEach((l) => l());
      }
    );
  }
  return () => {
    cache.subscribers.delete(listener);
    if (cache.subscribers.size === 0 && cache.unsubscribe) {
      cache.teardownTimer = setTimeout(() => {
        if (cache.subscribers.size === 0 && cache.unsubscribe) {
          cache.unsubscribe();
          cache.unsubscribe = null;
          pageCaches.delete(page);
        }
      }, TEARDOWN_GRACE_MS);
    }
  };
}

function usePageSitePhotoDocs(page: string): { docs: SitePhotoDoc[]; loading: boolean } {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(page, () => setTick((t) => t + 1)), [page]);
  const cache = pageCaches.get(page);
  return { docs: cache?.docs ?? [], loading: cache?.loading ?? true };
}

/**
 * PhotoGrid-ready photos for one (page, section) gallery, merged per slot
 * against `defaults`: a live doc at `order === i` overrides `defaults[i]`;
 * a slot with no live doc keeps showing its default, so replacing one slot
 * can never blank out the others. Live docs with `order >= defaults.length`
 * are appended as extra, admin-added photos beyond the default set.
 * A missing `section` on a live doc is treated as `'main'` (today's
 * pre-existing galleries, created before sections existed).
 *
 * Slots still showing the shared "Photo Needed" placeholder (no real photo
 * uploaded yet, from either a default or a live doc) are dropped rather than
 * rendered, so the public gallery only ever shows real photos and reflows
 * without gaps as they're uploaded.
 */
export function useSitePhotos(page: string, section: string, defaults: PhotoItem[]): PhotoItem[] {
  const { docs } = usePageSitePhotoDocs(page);
  const live = docs.filter((p) => (p.section ?? 'main') === section);
  if (live.length === 0) return defaults.filter((p) => p.src !== PHOTO_NEEDED_PLACEHOLDER);

  const byOrder = new Map(live.map((p) => [p.order, p]));
  const merged = defaults.map((def, i) => {
    const override = byOrder.get(i);
    return override ? { src: override.imageUrl, alt: override.alt, caption: override.caption } : def;
  });
  const extra = live
    .filter((p) => p.order >= defaults.length)
    .sort((a, b) => a.order - b.order)
    .map((p) => ({ src: p.imageUrl, alt: p.alt, caption: p.caption }));

  return [...merged, ...extra].filter((p) => p.src !== PHOTO_NEEDED_PLACEHOLDER);
}

/** Whether a (page, section) gallery has any real, admin-uploaded photo yet. */
export function useSectionHasPhotos(page: string, section: string): boolean {
  const { docs } = usePageSitePhotoDocs(page);
  return docs.some((p) => (p.section ?? 'main') === section);
}

/**
 * Whether the current page's sitePhotos are still loading — for callers
 * that need to gate a first paint (e.g. showing a skeleton instead of the
 * default stock photos) until Firestore has actually responded. Shares the
 * same subscription as useSitePhotos/useSectionHasPhotos for the same page,
 * so it always resolves at exactly the same moment as the photos those
 * return — a separate raw query here would open its own redundant listener
 * that can resolve a beat earlier or later than the shared one, which is
 * what caused a visible flicker (skeleton → default photo → real photo,
 * instead of skeleton → real photo).
 */
export function useSitePhotosLoading(page: string): boolean {
  const { loading } = usePageSitePhotoDocs(page);
  return loading;
}
