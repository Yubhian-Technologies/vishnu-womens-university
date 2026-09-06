// Bridges the institution-wide "Placements" module (src/pages/Placements —
// batch-wise branchOffers, admin-editable via Admin -> Placement Year Data,
// falling back to placementStats.data.ts, see usePlacementYears.ts) with a
// department's own page (DepartmentDetail.tsx / ProgramDetail.tsx), which
// separately tracks its own admin-uploaded Academic Year records on the
// `departments` doc. The two are independently maintained (one is an
// institution-wide published transcript, the other is per-department Excel
// imports) and can disagree or one can be missing entirely for a given
// year — this reads the published module's numbers up to department level
// so a visitor never sees "no data" when the institution has in fact
// published a figure for that batch.
import type { PlacementYear } from '../pages/Placements/placementStats.data';

// A `branch` label is free-typed admin text and has drifted across years/
// editors — "CSE(AI&DS) Offers" in the static seed data, "CSE[AI&DS] Offers"
// in the live Admin -> Placement Year Data collection, plain "AIDS Offers"
// in older batches, even a bare "cse" with no "Offers" suffix on a
// still-being-filled-in entry. Reducing every label to only its letters and
// digits (brackets, punctuation, "&", "Offers", and whitespace all stripped)
// collapses every one of those down to the same key, so matching is exact-
// equality against that key instead of a growing list of fragile regexes.
function normalizeBranchKey(branch: string): string {
  return branch
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/offers$/, '');
}

// The main Placements module tracks CSE's AI/DS, AI/ML and Cyber Security
// specializations as their own `branchOffers` rows, but on the Academics
// side AI/DS and AI/ML live under the separate AI department while Cyber
// Security stays under CSE — see DEPARTMENT_GROUPS in departmentGroups.ts.
// ECE has no separate EVT row in any published batch so far, but the key is
// included defensively in case a future batch adds one.
const DEPT_BRANCH_KEYS: Record<string, string[]> = {
  CSE: ['cse', 'csecybersecurity', 'cybersecurity'],
  AI: ['cseaids', 'aids', 'cseaiml', 'aiml'],
  ECE: ['ece', 'eceevt', 'evt'],
  EEE: ['eee'],
  CE: ['civil'],
  ME: ['mech', 'mechanical'],
  IT: ['it'],
  MBA: ['mba'],
};

// A department's own Academic Year label is free-typed admin text — "2025-26",
// "2019-2023", "2026", even a stray "AY 2022" — while the Placements module
// uses a "2022–2026" batch-range format (or, on at least one live entry seen
// so far, a plain "2025-2026" with a regular hyphen). Matching on the END
// year (the graduating year, always the more meaningful anchor for "which
// batch is this") is what actually lines the two up: the last year-like
// number found in the label, with a 2-digit trailing year inheriting the
// century of the nearest 4-digit year before it (so "2025-26" reads as
// 2026, not 26).
export function extractEndYear(label: string): number | null {
  const tokens = label.match(/\d{4}|\d{2}/g);
  if (!tokens || tokens.length === 0) return null;
  let century = 2000;
  let end: number | null = null;
  for (const tok of tokens) {
    if (tok.length === 4) {
      const y = parseInt(tok, 10);
      century = Math.floor(y / 100) * 100;
      end = y;
    } else {
      end = century + parseInt(tok, 10);
    }
  }
  return end;
}

export interface DeptBatchStats {
  /** The Placements module's own batch label, e.g. "2022–2026". */
  batch: string;
  /** Summed across every sub-branch that belongs to this department. */
  offers: number;
  /** Highest of each matching sub-branch's own highestLPA, when set. */
  highestLPA?: number;
}

// Every batch this department has a published figure for, most recent
// first — a department with no `branchOffers` breakdown at all in a given
// batch (only the older, pre-branch-tracking years) simply has no entry for
// that batch, not a zero. When two batches share the same end year (seen
// live: a fresh, still-being-entered "2025-2026" alongside the full
// "2022–2026" batch it presumably belongs to, the new entry having only a
// couple of offers typed in so far), the one with more offers for this
// department wins — a handful of just-started offers shouldn't shadow an
// already-published full-batch figure.
export function getDeptBatchStats(deptShortCode: string, years: PlacementYear[]): DeptBatchStats[] {
  const keys = DEPT_BRANCH_KEYS[deptShortCode.trim().toUpperCase()];
  if (!keys) return [];
  const byEndYear = new Map<number, DeptBatchStats>();
  for (const y of years) {
    const matches = (y.branchOffers || []).filter((b) => keys.includes(normalizeBranchKey(b.branch)));
    if (matches.length === 0) continue;
    const offers = matches.reduce((sum, b) => sum + b.offers, 0);
    const highestLPA = matches.reduce<number | undefined>(
      (max, b) => (b.highestLPA != null && (max == null || b.highestLPA > max) ? b.highestLPA : max),
      undefined
    );
    const endYear = extractEndYear(y.batch);
    if (endYear == null) continue;
    const existing = byEndYear.get(endYear);
    if (!existing || offers > existing.offers) {
      byEndYear.set(endYear, { batch: y.batch, offers, highestLPA });
    }
  }
  return Array.from(byEndYear.entries())
    .sort(([a], [b]) => b - a)
    .map(([, stats]) => stats);
}

// The one batch (if any) whose end year matches this department Academic
// Year label's end year.
export function findDeptBatchStatsForYearLabel(
  deptShortCode: string,
  yearLabel: string,
  years: PlacementYear[]
): DeptBatchStats | null {
  const endYear = extractEndYear(yearLabel);
  if (endYear == null) return null;
  return getDeptBatchStats(deptShortCode, years).find((b) => extractEndYear(b.batch) === endYear) ?? null;
}
