import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { reportFirestoreError, clearFirestoreError } from './firestoreErrorStore';
import type { SitePhotoDoc } from '../pages/Admin/sections/SitePhotosAdmin';
import type { PhotoItem } from '../components/PhotoGrid/PhotoGrid';
import { PHOTO_NEEDED_PLACEHOLDER } from '../lib/photoPlaceholder';

// Shared subscription for the whole `sitePhotos` collection. Nearly every
// public page calls useSitePhotos() 2-5 times — once per photo section on
// that page — and each call used to open its own onSnapshot listener
// fetching the *entire* collection independently: a page like Home (5
// sections) opened 5 redundant subscriptions all downloading the same
// data, which is why the real photos visibly took longer than necessary to
// replace the defaults. Every call site now shares one listener,
// reference-counted so it tears down once nothing on the page is using it.
let cachedDocs: SitePhotoDoc[] = [];
let cachedLoading = true;
let unsubscribe: (() => void) | null = null;
const subscribers = new Set<() => void>();

function subscribe(listener: () => void) {
  subscribers.add(listener);
  if (!unsubscribe) {
    cachedLoading = true;
    const q = query(collection(db, 'sitePhotos'), orderBy('order'));
    unsubscribe = onSnapshot(
      q,
      (snap) => {
        cachedDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SitePhotoDoc));
        cachedLoading = false;
        clearFirestoreError('sitePhotos');
        subscribers.forEach((l) => l());
      },
      (err) => {
        cachedLoading = false;
        reportFirestoreError('sitePhotos', err.message);
        subscribers.forEach((l) => l());
      }
    );
  }
  return () => {
    subscribers.delete(listener);
    if (subscribers.size === 0 && unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };
}

function useAllSitePhotoDocs(): { docs: SitePhotoDoc[]; loading: boolean } {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
  return { docs: cachedDocs, loading: cachedLoading };
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
  const { docs } = useAllSitePhotoDocs();
  const live = docs.filter((p) => p.page === page && (p.section ?? 'main') === section);
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
  const { docs } = useAllSitePhotoDocs();
  return docs.some((p) => p.page === page && (p.section ?? 'main') === section);
}

/**
 * Whether the sitePhotos collection is still loading — for callers that
 * need to gate a first paint (e.g. showing a skeleton instead of the
 * default stock photos) until Firestore has actually responded. Shares the
 * same subscription as useSitePhotos/useSectionHasPhotos, so it always
 * resolves at exactly the same moment as the photos those return — a
 * separate raw useOrderedCollection('sitePhotos', ...) call here would
 * open its own redundant listener that can resolve a beat earlier or later
 * than the shared one, which is what caused a visible flicker (skeleton →
 * default photo → real photo, instead of skeleton → real photo).
 */
export function useSitePhotosLoading(): boolean {
  const { loading } = useAllSitePhotoDocs();
  return loading;
}
