import type { NewsArticle } from '../components/NewsCard/NewsCard';
import type { HappeningDoc } from '../pages/Admin/sections/NewsAwardsDataAdmin';
import { NEWS_FALLBACK_IMAGE } from './news';

/** Adapts a HappeningDoc into the fixed "article" shape NewsCard expects —
 *  see this file's `news`-collection equivalent, newsDocToArticle. Shared
 *  between Home.tsx's "Latest from VWU" teaser and Happenings.tsx's full
 *  Recent Events grid so both render happenings as identical news cards,
 *  each linking to the per-happening detail page (HappeningDetail.tsx,
 *  routed at /news-awards/happenings/:id). */
export function happeningToArticle(item: HappeningDoc): NewsArticle {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.description || '',
    date: item.date,
    category: item.dept || 'Recent',
    imageUrl: item.imageUrl || NEWS_FALLBACK_IMAGE,
    imageAlt: item.title,
    path: `/news-awards/happenings/${item.id}`,
  };
}

export interface ParsedHappeningDate {
  month: string;
  day: string;
  year?: string;
  weekday?: string;
  fullDateStr: string;
  // Parsed date at midnight, or null when the free-text date field
  // couldn't be parsed.
  timestamp: number | null;
}

/** Parses a happening's free-text `date` field (e.g. "March 28, 2026" or
 *  "28 March 2026") into display parts plus a comparable timestamp. Shared
 *  by UpcomingEvents.tsx (Home page) and Happenings.tsx so both format
 *  dates and decide what's still upcoming the same way. */
export function parseHappeningDate(dateStr: string): ParsedHappeningDate {
  if (!dateStr) {
    return { month: 'VWU', day: '—', fullDateStr: '', timestamp: null };
  }
  const clean = dateStr.trim();

  // Matches "Month DD, YYYY" or "Month DD" (e.g. "March 28, 2026", "April 15"),
  // and a "Month D–D, YYYY" range (e.g. "October 6–13, 2025") — the optional
  // "–D" group lets the year still be found right after the range's second
  // day instead of being skipped (it used to silently default to the
  // current year whenever a range came between the day and the year).
  const match = clean.match(/^([A-Za-z]+)\s+(\d{1,2})(?:\s*[–—-]\s*\d{1,2})?(?:,?\s*(\d{4}))?/);
  if (match) {
    const month = match[1].slice(0, 3).toUpperCase();
    const day = match[2].padStart(2, '0');
    const year = match[3] || new Date().getFullYear().toString();

    let weekday: string | undefined;
    let timestamp: number | null = null;
    const d = new Date(`${match[1]} ${match[2]}, ${year}`);
    if (!isNaN(d.getTime())) {
      weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      timestamp = d.getTime();
    }

    return { month, day, year, weekday, fullDateStr: clean, timestamp };
  }

  // Matches "DD Month YYYY" (e.g. "28 March 2026") and a "D–D Month YYYY"
  // range, same reasoning as the range group above.
  const match2 = clean.match(/^(\d{1,2})(?:\s*[–—-]\s*\d{1,2})?\s+([A-Za-z]+)(?:,?\s*(\d{4}))?/);
  if (match2) {
    const day = match2[1].padStart(2, '0');
    const month = match2[2].slice(0, 3).toUpperCase();
    const year = match2[3] || new Date().getFullYear().toString();
    const d = new Date(`${match2[2]} ${match2[1]}, ${year}`);
    return { month, day, year, fullDateStr: clean, timestamp: isNaN(d.getTime()) ? null : d.getTime() };
  }

  return { month: 'EVENT', day: clean.slice(0, 5), fullDateStr: clean, timestamp: null };
}

/** True unless the happening's date has already passed. Admins set
 *  type: 'upcoming' manually and don't always flip it back once the date
 *  elapses, so both "Upcoming" listings filter through this instead of
 *  trusting `type` alone. Dates we can't parse are kept rather than
 *  hidden (fail open). */
export function isUpcomingHappening(item: HappeningDoc): boolean {
  const ts = parseHappeningDate(item.date).timestamp;
  if (ts === null) return true;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return ts >= startOfToday.getTime();
}
