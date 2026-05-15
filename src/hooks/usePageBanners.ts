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

const CACHE_KEY = (page: string) => `vwu_banner_${page}`;

function readCache(page: string): BannerSlide[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY(page));
    return raw ? (JSON.parse(raw) as BannerSlide[]) : [];
  } catch { return []; }
}

function writeCache(page: string, slides: BannerSlide[]) {
  try { localStorage.setItem(CACHE_KEY(page), JSON.stringify(slides)); } catch { /* quota full */ }
}

/**
 * Returns banner slides for a page.
 * First render uses localStorage cache (instant, no flash).
 * Firestore result updates it in the background.
 * loading=true only when cache is empty AND Firestore hasn't responded yet.
 */
export function usePageBanners(page: string): { slides: BannerSlide[]; loading: boolean } {
  const cached = readCache(page);
  const [slides, setSlides] = useState<BannerSlide[]>(cached);
  const [loading, setLoading] = useState(cached.length === 0);

  useEffect(() => {
    const q = query(collection(db, 'banners'), where('page', '==', page));
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
        writeCache(page, docs);
        setSlides(docs);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, [page]);

  return { slides, loading };
}
