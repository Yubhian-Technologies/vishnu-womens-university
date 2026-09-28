import { parseHappeningDate } from './happenings';

/**
 * Timestamp of an event album's free-text date (Admin → Gallery → Event
 * Albums), for sorting. Handles the formats admins type or import:
 * "March 8, 2025", "March 7–8, 2025", "8 March 2025", "Oct 15, 2025 – Oct 17,
 * 2025" (start date is used), "Aug/23/2026", "2025-10-15". A date without a
 * year ("March 8") takes the album's own year. Unreadable/blank → null.
 */
export function albumDateTimestamp(album: { date?: string; year: number }): number | null {
  const start = (album.date || '').split(/\s+[–—-]\s+/)[0].trim();
  if (!start) return null;
  const withYear = /\b(19|20)\d{2}\b/.test(start) ? start : `${start}, ${album.year}`;
  const parsed = parseHappeningDate(withYear).timestamp;
  if (parsed !== null) return parsed;
  // Date.parse is very lenient ("TBA, 2025" → Jan 1) — only trust it for
  // numeric formats like "Aug/23/2026" or "2025-10-15".
  if (!/\d/.test(start)) return null;
  const t = Date.parse(withYear);
  return Number.isNaN(t) ? null : t;
}

/** Albums sorted by date, latest first. Undated/unreadable dates go last, keeping their existing order. */
export function sortAlbumsLatestFirst<T extends { date?: string; year: number }>(albums: T[]): T[] {
  return albums
    .map((a, i) => ({ a, i, t: albumDateTimestamp(a) }))
    .sort((x, y) => {
      if (x.t === null && y.t === null) return x.i - y.i;
      if (x.t === null) return 1;
      if (y.t === null) return -1;
      return y.t - x.t || x.i - y.i;
    })
    .map(({ a }) => a);
}
