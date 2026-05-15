import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
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
    const q = query(
      collection(db, 'banners'),
      where('page', '==', page),
      orderBy('order', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setSlides(
        snap.docs.map((d) => ({
          id:       d.id,
          imageUrl: d.data().imageUrl  ?? '',
          title:    d.data().title     ?? '',
          subtitle: d.data().subtitle  ?? '',
          ctaLabel: d.data().ctaLabel  ?? '',
          ctaLink:  d.data().ctaLink   ?? '',
          order:    d.data().order     ?? 0,
        }))
      );
      setLoading(false);
    });
    return unsub;
  }, [page]);

  return { slides, loading };
}
