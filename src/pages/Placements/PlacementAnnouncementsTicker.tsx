import { useState } from 'react';
import './PlacementAnnouncementsTicker.css';

// Finds which column of a flexible (admin-defined header) table holds a
// given field, by loose substring match against the header text — so this
// works regardless of exact header wording ("LPA" vs "Salary (LPA)" vs
// "Package", "Company" vs "Company Name", etc.) rather than requiring an
// exact column name.
function findColumn(headers: string[], keywords: string[]): number {
  return headers.findIndex((h) => keywords.some((k) => h.toLowerCase().includes(k)));
}

interface Announcement {
  name: string;
  batch: string;
  branch: string;
  company: string;
  lpa: string;
}

function parseAnnouncements(headers: string[], rows: string[][]): Announcement[] {
  const nameIdx = findColumn(headers, ['name']);
  const batchIdx = findColumn(headers, ['batch']);
  const branchIdx = findColumn(headers, ['branch']);
  const companyIdx = findColumn(headers, ['company']);
  const lpaIdx = findColumn(headers, ['lpa', 'salary', 'package', 'ctc']);
  if (nameIdx === -1 || companyIdx === -1) return [];
  return rows
    .map((row) => ({
      name: row[nameIdx] || '',
      batch: batchIdx > -1 ? row[batchIdx] || '' : '',
      branch: branchIdx > -1 ? row[branchIdx] || '' : '',
      company: row[companyIdx] || '',
      lpa: lpaIdx > -1 ? row[lpaIdx] || '' : '',
    }))
    .filter((a) => a.name && a.company);
}

// Best-effort logo via a guessed domain (CompanyName -> companyname.com)
// through Google's favicon service — no curated company list to maintain,
// since this ticker's companies come from whatever an admin imports rather
// than a fixed recruiter set. Falls back to an initial-letter badge.
function CompanyLogo({ company }: { company: string }) {
  const guessedDomain = `${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="pat-card__logo pat-card__logo--fallback">{company.charAt(0)}</span>
  ) : (
    <img
      className="pat-card__logo"
      src={`https://www.google.com/s2/favicons?domain=${guessedDomain}&sz=64`}
      alt={company}
      onError={() => setFailed(true)}
    />
  );
}

function AnnouncementCard({ a }: { a: Announcement }) {
  return (
    <div className="pat-card">
      <CompanyLogo company={a.company} />
      <div className="pat-card__body">
        {a.lpa && <div className="pat-card__lpa">{a.lpa} LPA</div>}
        <div className="pat-card__name">{a.name}</div>
        {(a.branch || a.batch) && (
          <div className="pat-card__meta">{[a.branch, a.batch].filter(Boolean).join(' · ')}</div>
        )}
      </div>
    </div>
  );
}

// One scrolling row — duplicates its slice of announcements for a seamless
// loop, and scrolls right-to-left or left-to-right depending on `reverse`.
function TickerRow({ items, reverse }: { items: Announcement[]; reverse: boolean }) {
  // Same reasoning as the single-row version: duration scales with card
  // count so speed stays constant (5.5s/card) instead of racing through a
  // longer row in the same fixed time.
  const duration = Math.max(20, items.length * 5.5);
  return (
    <div className="pat__track-wrap">
      <div
        className={`pat__track${reverse ? ' pat__track--reverse' : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((a, i) => <AnnouncementCard key={`a-${i}`} a={a} />)}
        {items.map((a, i) => <AnnouncementCard key={`b-${i}`} a={a} />)}
      </div>
    </div>
  );
}

export default function PlacementAnnouncementsTicker({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const announcements = parseAnnouncements(headers, rows);
  if (announcements.length === 0) return null;

  // More than one row (each scrolling the opposite direction from its
  // neighbor) once there's enough content to make that read as a wall of
  // activity rather than a single sparse line — round-robin split keeps
  // each row's card order varied rather than one row being all early rows
  // and another all late ones.
  const rowCount = announcements.length >= 4 ? 2 : 1;
  const tickerRows: Announcement[][] = Array.from({ length: rowCount }, () => []);
  announcements.forEach((a, i) => tickerRows[i % rowCount].push(a));

  return (
    <div className="pat">
      <h3 className="pat__title">Recent Placement Announcements</h3>
      <div className="pat__rows">
        {tickerRows.map((items, i) => (
          <TickerRow key={i} items={items} reverse={i % 2 === 1} />
        ))}
      </div>
    </div>
  );
}
