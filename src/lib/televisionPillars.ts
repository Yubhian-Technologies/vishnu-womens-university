// The Television page's "Programming & Content" section — 4 fixed
// categories (Education, Entertainment, News, Events), same idea as any
// other page's fixed section heading. What's shown *under* each category
// (photo + short description) is entirely admin-controlled from Admin ->
// Campus Life -> Television -> Programming Pillars — nothing here is
// content, just the 4 category names/icons that structure the section.
export type TelevisionPillarKey = 'education' | 'entertainment' | 'news' | 'events';

export const TELEVISION_PILLAR_KEYS: TelevisionPillarKey[] = ['education', 'entertainment', 'news', 'events'];

export const TELEVISION_PILLAR_LABELS: Record<TelevisionPillarKey, string> = {
  education: 'Education',
  entertainment: 'Entertainment',
  news: 'News',
  events: 'Events',
};

export interface TelevisionPillarContent {
  imageUrl: string;
  storagePath: string;
  desc: string;
}

export type TelevisionPillars = Record<TelevisionPillarKey, TelevisionPillarContent>;

export const EMPTY_TELEVISION_PILLAR: TelevisionPillarContent = { imageUrl: '', storagePath: '', desc: '' };

export function emptyTelevisionPillars(): TelevisionPillars {
  return {
    education: { ...EMPTY_TELEVISION_PILLAR },
    entertainment: { ...EMPTY_TELEVISION_PILLAR },
    news: { ...EMPTY_TELEVISION_PILLAR },
    events: { ...EMPTY_TELEVISION_PILLAR },
  };
}

export function toTelevisionPillarsForm(pillars: Partial<TelevisionPillars> | undefined): TelevisionPillars {
  const base = emptyTelevisionPillars();
  if (!pillars) return base;
  for (const key of TELEVISION_PILLAR_KEYS) {
    base[key] = { ...base[key], ...pillars[key] };
  }
  return base;
}
