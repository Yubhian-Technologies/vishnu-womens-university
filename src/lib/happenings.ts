import type { NewsArticle } from '../components/NewsCard/NewsCard';
import type { HappeningDoc } from '../pages/Admin/sections/NewsAwardsDataAdmin';
import { NEWS_FALLBACK_IMAGE } from './news';

/** Adapts a HappeningDoc into the fixed "article" shape NewsCard expects —
 *  see this file's `news`-collection equivalent, newsDocToArticle. Shared
 *  between Home.tsx's "Latest from VWU" teaser and Happenings.tsx's full
 *  Recent Events grid so both render happenings as identical news cards.
 *  There's no per-happening detail page, so — same as the news version —
 *  every card just links back to the listing it came from. */
export function happeningToArticle(item: HappeningDoc): NewsArticle {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.description || '',
    date: item.date,
    category: item.dept || 'Recent',
    imageUrl: item.imageUrl || NEWS_FALLBACK_IMAGE,
    imageAlt: item.title,
    path: '/news-awards/happenings',
  };
}
