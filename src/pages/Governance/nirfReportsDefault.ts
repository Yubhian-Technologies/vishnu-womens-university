// Fallback content for the MHRD NIRF Reports item, sourced from
// https://svecw.edu.in/mhrd-nirf-reports/. Firestore's governanceItems doc
// for this slug currently has no tabbed report list at all (just a plain
// About paragraph) — this renders the real NIRF category tabs (Engineering,
// Innovation, SDG, Overall) directly instead (see NirfReportsSection.tsx).
//
// Each report links to a PDF under public/downloads/ following the pattern
// `NIRF-{year}-{category}.pdf` — none of these files exist yet (the real
// PDFs haven't been supplied), so every link 404s until the matching file
// is added to public/downloads/ with the exact name below.
export interface NirfReportsCategory {
  key: string;
  title: string;
  reports: { label: string; href: string }[];
}

export const NIRF_REPORTS_CATEGORIES: NirfReportsCategory[] = [
  {
    key: 'engineering',
    title: 'Engineering',
    reports: [{ label: 'NIRF 2026 :: Engineering', href: '/downloads/NIRF-2026-Engineering.pdf' }],
  },
  {
    key: 'innovation',
    title: 'Innovation',
    reports: [{ label: 'NIRF 2026 :: Innovation', href: '/downloads/NIRF-2026-Innovation.pdf' }],
  },
  {
    key: 'sdg',
    title: 'SDG',
    reports: [{ label: 'NIRF 2026 :: SDG Institution', href: '/downloads/NIRF-2026-SDG.pdf' }],
  },
  {
    key: 'overall',
    title: 'Overall',
    reports: [{ label: 'NIRF 2026 :: Overall', href: '/downloads/NIRF-2026-Overall.pdf' }],
  },
];
