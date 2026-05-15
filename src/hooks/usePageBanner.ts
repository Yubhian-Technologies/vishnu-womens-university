import { useEffect, useState } from 'react';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PageBanner {
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
}

/**
 * Returns the first active banner assigned to the given page slug.
 * Falls back to `null` while loading so the page can show its default.
 */
export function usePageBanner(page: string): PageBanner | null {
  const [banner, setBanner] = useState<PageBanner | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'banners'),
      where('page', '==', page),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const d = snap.docs[0].data();
        setBanner({
          imageUrl:  d.imageUrl  ?? '',
          title:     d.title     ?? '',
          subtitle:  d.subtitle  ?? '',
          ctaLabel:  d.ctaLabel  ?? '',
          ctaLink:   d.ctaLink   ?? '',
        });
      } else {
        setBanner(null);
      }
    });
    return unsub;
  }, [page]);

  return banner;
}
