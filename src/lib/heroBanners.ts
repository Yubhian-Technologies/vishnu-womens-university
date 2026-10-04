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
