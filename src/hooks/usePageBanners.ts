import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface BannerSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
}

/** Returns all banner slides for a given page slug, ordered by `order` field. */
export function usePageBanners(page: string): { slides: BannerSlide[]; loading: boolean } {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only use `where` — sort client-side to avoid requiring a Firestore composite index
    const q = query(
      collection(db, 'banners'),
      where('page', '==', page),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({
            id:       d.id,
            imageUrl: d.data().imageUrl  ?? '',
            title:    d.data().title     ?? '',
            subtitle: d.data().subtitle  ?? '',
            ctaLabel: d.data().ctaLabel  ?? '',
            ctaLink:  d.data().ctaLink   ?? '',
            order:    d.data().order     ?? 0,
          }))
          .sort((a, b) => a.order - b.order);
        setSlides(docs);
        setLoading(false);
      },
      () => setLoading(false), // on error: show fallback image
    );
    return unsub;
  }, [page]);

  return { slides, loading };
}
