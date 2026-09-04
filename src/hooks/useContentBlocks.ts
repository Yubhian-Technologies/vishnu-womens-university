import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { reportFirestoreError, clearFirestoreError } from './firestoreErrorStore';
import type { ContentBlockDoc } from '../pages/Admin/sections/ContentBlocksAdmin';

// Shared subscription for the whole `contentBlocks` collection — same fix,
// same reason, as the one in useSitePhotos.ts. Nearly every public page
// calls useContentBlocks() several times (once per content section on that
// page — Home.tsx alone calls it 5 times), and each call used to open its
// own onSnapshot listener fetching the *entire* collection independently.
// Every call site now shares one listener, reference-counted so it tears
// down once nothing on the page is using it.
let cachedDocs: ContentBlockDoc[] = [];
let cachedLoading = true;
let unsubscribe: (() => void) | null = null;
const subscribers = new Set<() => void>();

function subscribe(listener: () => void) {
  subscribers.add(listener);
  if (!unsubscribe) {
    cachedLoading = true;
    const q = query(collection(db, 'contentBlocks'), orderBy('order'));
    unsubscribe = onSnapshot(
      q,
      (snap) => {
        cachedDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContentBlockDoc));
        cachedLoading = false;
        clearFirestoreError('contentBlocks');
        subscribers.forEach((l) => l());
      },
      (err) => {
        cachedLoading = false;
        reportFirestoreError('contentBlocks', err.message);
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

function useAllContentBlockDocs(): { docs: ContentBlockDoc[]; loading: boolean } {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
  return { docs: cachedDocs, loading: cachedLoading };
}

/** Live content blocks for one (page, section) pair, already filtered and ordered. */
export function useContentBlocks(page: string, section: string): ContentBlockDoc[] {
  const { docs } = useAllContentBlockDocs();
  return docs.filter((b) => b.page === page && b.section === section);
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
  const item = stats.find((s) => s.title.toLowerCase().includes('eapcet'));
  return item?.value || DEFAULT_EAPCET_CODE;
}
