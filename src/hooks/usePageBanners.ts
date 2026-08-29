import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface BannerSlide {
  id: string;
  imageUrl: string;
  videoUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
}

/**
 * Returns banner slides for a page, straight from the live Firestore
 * listener — no localStorage cache. PageHero/HeroSlider already show their
 * own default image immediately regardless of `loading`, so there was
 * nothing for a cache to avoid a flash of; it only risked briefly showing a
 * stale banner (wrong image/title) from a previous visit before the live
 * snapshot arrived.
 */
export function usePageBanners(page: string): { slides: BannerSlide[]; loading: boolean } {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'banners'), where('page', '==', page));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .map((d) => ({
            id:       d.id,
            imageUrl: d.data().imageUrl  ?? '',
            videoUrl: d.data().videoUrl  ?? '',
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
      () => setLoading(false),
    );
    return unsub;
  }, [page]);

  return { slides, loading };
}
