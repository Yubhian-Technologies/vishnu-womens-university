import type { NewsArticle } from '../components/NewsCard/NewsCard';
import { formatDate } from './formatDate';

export interface NewsDoc {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  body: string;
  imageUrl: string;
  featured: boolean;
}

export const NEWS_CATEGORIES = ['News', 'Event', 'Achievement', 'Award', 'Announcement', 'Research'];

export const NEWS_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80';

export function newsDocToArticle(item: NewsDoc): NewsArticle {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.summary,
    date: formatDate(item.date),
    category: item.category,
    imageUrl: item.imageUrl || NEWS_FALLBACK_IMAGE,
    imageAlt: item.title,
    path: '/news',
  };
}
