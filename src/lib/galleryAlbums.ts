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
  // Numeric dates are day-first: "31/08/2026" (never month-first).
  const dmy = start.match(/^(\d{1,2})[/.-](\d{1,2})[/.-]((?:19|20)\d{2})$/);
  if (dmy) {
    const d = new Date(+dmy[3], +dmy[2] - 1, +dmy[1]);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }
  const withYear = /\b(19|20)\d{2}\b/.test(start) ? start : `${start}, ${album.year}`;
  const parsed = parseHappeningDate(withYear).timestamp;
  if (parsed !== null) return parsed;
  // Date.parse is very lenient ("TBA, 2025" → Jan 1) — only trust it for
  // numeric formats like "Aug/23/2026" or "2025-10-15".
  if (!/\d/.test(start)) return null;
  const t = Date.parse(withYear);
  return Number.isNaN(t) ? null : t;
}

/**
 * Display form of an album's free-text date as DD/MM/YYYY ("Oct/08/2026" →
 * "08/10/2026"). Only complete single dates are converted (each side of a
 * "start – end" range separately); anything else is returned unchanged.
 */
export function formatAlbumDate(date: string | undefined): string {
  const text = (date || '').trim();
  if (!text) return '';
  const fmt = (part: string): string => {
    const p = part.trim();
    if (/^\d{1,2}[/.-]\d{1,2}[/.-](19|20)\d{2}$/.test(p)) {
      const [d, m, y] = p.split(/[/.-]/);
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
    const full =
      /^[A-Za-z]+[\s/.-]+\d{1,2},?[\s/.-]+(19|20)\d{2}$/.test(p) ||
      /^\d{1,2}\s+[A-Za-z]+,?\s+(19|20)\d{2}$/.test(p) ||
      /^(19|20)\d{2}-\d{1,2}-\d{1,2}$/.test(p);
    if (!full) return part;
    const iso = p.match(/^((?:19|20)\d{2})-(\d{1,2})-(\d{1,2})$/);
    const d = iso ? new Date(+iso[1], +iso[2] - 1, +iso[3]) : new Date(p.replace(/[/.-]/g, ' '));
    if (Number.isNaN(d.getTime())) return part;
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };
  return text.split(/(\s+[–—-]\s+)/).map((s, i) => (i % 2 ? s : fmt(s))).join('');
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
