// A department/programme's Head is shown as "Head of the Department"
// everywhere by default — except Physics, Mathematics, English, Chemistry,
// and MBA, whose current Head holds the role as an in-charge appointment
// rather than a permanent Headship, so they read "HOD-I/C" instead.
// Matched by substring (case-insensitive) against whatever name/title is on
// hand at each call site (e.g. "Department of Physics", "MBA"), so it
// doesn't depend on exact naming.
const HOD_IN_CHARGE_KEYWORDS = ['physics', 'mathematics', 'english', 'chemistry', 'mba', 'business administration'];

export function isHodInCharge(deptName: string | undefined | null): boolean {
  if (!deptName) return false;
  const lower = deptName.toLowerCase();
  return HOD_IN_CHARGE_KEYWORDS.some((k) => lower.includes(k));
}

export function hodTitle(deptName: string | undefined | null): string {
  return isHodInCharge(deptName) ? 'HOD-I/C' : 'Head of the Department';
}
