// Home page hero banner carousel (full-screen photo slides with a text
// overlay shown before the hero video). Managed from /admin → Home Hero
// Banners; stored in the `homeHeroBanners` collection.

export const HOME_HERO_BANNERS_COLLECTION = 'homeHeroBanners';

/** At most this many banners play before the hero video. */
export const MAX_HOME_HERO_BANNERS = 3;

export type HeroTextPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export const HERO_TEXT_POSITIONS: { value: HeroTextPosition; label: string }[] = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
];

export interface HomeHeroBannerDoc {
  id: string;
  imageUrl: string;
  storagePath: string;
  /** Overlay headline */
  text: string;
  /** Optional smaller line under the headline */
  subtext: string;
  position: HeroTextPosition;
  ctaLabel: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

/** Serve Cloudinary banners resized (≤1920px wide) and in the best format
 *  for the browser instead of the original multi-MB upload. Non-Cloudinary
 *  URLs, and ones that already carry a transformation, pass through. */
export function optimizeBannerUrl(url: string): string {
  const marker = '/image/upload/';
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const rest = url.slice(i + marker.length);
  if (/^[a-z]{1,3}_[^/]*\//.test(rest)) return url;
  return `${url.slice(0, i + marker.length)}f_auto,q_auto,w_1920,c_limit/${rest}`;
}

// Last-known banner list, so a repeat visit knows what to show on the very
// first frame instead of waiting for Firestore's first snapshot.
const CACHE_KEY = 'vwu:home-hero-banners';

export function readCachedBanners(): HomeHeroBannerDoc[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCachedBanners(banners: HomeHeroBannerDoc[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(banners));
  } catch { /* storage unavailable */ }
}
