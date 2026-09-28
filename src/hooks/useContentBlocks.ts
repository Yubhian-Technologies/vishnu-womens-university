import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { reportFirestoreError, clearFirestoreError } from './firestoreErrorStore';
import type { ContentBlockDoc } from '../pages/Admin/sections/ContentBlocksAdmin';

// One shared, reference-counted listener *per page slug* — not one listener
// for the whole `contentBlocks` collection. That used to mean every call
// anywhere on the site (Home alone calls this 5+ times, and nearly every
// other page pulls in at least one more via useEapcetCode) opened (or
// shared) a single listener that read the *entire* collection — every
// page's content blocks, not just the one being viewed. Filtering by
// `page` server-side means a page only ever pays for its own blocks.
// Multiple sections on the same page still share one listener (filtered
// further by `section` in memory below), same sharing benefit as before,
// just scoped to the page instead of the whole site.
interface PageCache {
  docs: ContentBlockDoc[];
  loading: boolean;
  unsubscribe: (() => void) | null;
  subscribers: Set<() => void>;
  teardownTimer: ReturnType<typeof setTimeout> | null;
}

const pageCaches = new Map<string, PageCache>();

// A client-side route change unmounts the old page's consumers and mounts
// the new page's a moment later. If the new page reads the same `page` slug
// (e.g. "admission-procedure", pulled in by useEapcetCode on almost every
// page), tearing down the instant subscriber count hits zero would force an
// immediate full re-read the next page's mount. Waiting a few seconds lets
// that resubscribe reuse the still-open listener instead.
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
    const errorKey = `contentBlocks/${page}`;
    const q = query(collection(db, 'contentBlocks'), where('page', '==', page), orderBy('order'));
    cache.unsubscribe = onSnapshot(
      q,
      (snap) => {
        cache.docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContentBlockDoc));
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

function usePageContentBlockDocs(page: string): { docs: ContentBlockDoc[]; loading: boolean } {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(page, () => setTick((t) => t + 1)), [page]);
  const cache = pageCaches.get(page);
  return { docs: cache?.docs ?? [], loading: cache?.loading ?? true };
}

/** Live content blocks for one (page, section) pair, already filtered and ordered. */
export function useContentBlocks(page: string, section: string): ContentBlockDoc[] {
  const { docs } = usePageContentBlockDocs(page);
  return docs.filter((b) => b.section === section);
}

const DEFAULT_EAPCET_CODE = 'VISW, VISWPU';

/**
 * The EAPCET/EAMCET college code, quoted in several places across the site
 * (Admissions, Academics, Program Detail, Information) that used to each
 * hardcode "VISW" independently — so an admin editing the code in one place
 * never updated the others. This reuses the one place it's already
 * admin-editable: the "EAPCET Code" stat item under Content Blocks admin →
 * Admission Procedure — Stats.
 */
export function useEapcetCode(): string {
  const stats = useContentBlocks('admission-procedure', 'stats');
  const item = stats.find((s) => (s.title || '').toLowerCase().includes('eapcet'));
  const value = item?.value || DEFAULT_EAPCET_CODE;
  // Normalize comma spacing regardless of how the admin typed it (e.g.
  // "VISW,VISWPU" with no space) — this is quoted verbatim in several
  // places across the site, so fixing it here fixes every one of them.
  return value.replace(/,\s*/g, ', ');
}
