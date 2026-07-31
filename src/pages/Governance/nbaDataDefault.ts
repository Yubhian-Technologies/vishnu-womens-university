// Fallback content for the MHRD NIRF Reports' sibling item, "NBA – Data
// Capturing Points" (slug: nba-data). Firestore's governanceItems doc for
// this slug currently has no DCP document list at all (just a plain About
// paragraph) — this renders the real per-programme and institutional DCP
// document links directly instead (see NbaDataSection.tsx).
//
// Each entry links to a PDF under public/downloads/ following the pattern
// `NBA-DCP-{Category}.pdf`.
export interface NbaDataItem {
  label: string;
  href: string;
}

export const NBA_DATA_UG_PROGRAMMES: NbaDataItem[] = [
  { label: 'UG – Computer Science & Engineering', href: '/downloads/NBA-DCP-UG-CSE.pdf' },
  { label: 'UG – Electronics & Communication Engineering', href: '/downloads/NBA-DCP-UG-ECE.pdf' },
  { label: 'UG – Electrical & Electronics Engineering', href: '/downloads/NBA-DCP-UG-EEE.pdf' },
  { label: 'UG – Information Technology', href: '/downloads/NBA-DCP-UG-IT.pdf' },
];

export const NBA_DATA_INSTITUTIONAL: NbaDataItem[] = [
  { label: 'Details of Students', href: '/downloads/NBA-DCP-Students.pdf' },
  { label: 'Details of Placement', href: '/downloads/NBA-DCP-Placement.pdf' },
  { label: 'Details of Faculty', href: '/downloads/NBA-DCP-Faculty.pdf' },
];
