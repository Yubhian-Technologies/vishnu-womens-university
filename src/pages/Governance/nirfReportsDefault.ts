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
    reports: [{ label: 'NIRF 2026 :: Engineering', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNIRF-2026-Engineering.pdf?alt=media&token=3198ed51-7def-414f-9d9b-5c8fcd1633b8' }],
  },
  {
    key: 'innovation',
    title: 'Innovation',
    reports: [{ label: 'NIRF 2026 :: Innovation', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNIRF-2026-Innovation.pdf?alt=media&token=bd5e42e5-74eb-40b2-9c3a-fca0f54193ce' }],
  },
  {
    key: 'sdg',
    title: 'SDG',
    reports: [{ label: 'NIRF 2026 :: SDG Institution', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNIRF-2026-SDG.pdf?alt=media&token=5b7cf2cd-64bc-432e-9966-b560c54aed90' }],
  },
  {
    key: 'overall',
    title: 'Overall',
    reports: [{ label: 'NIRF 2026 :: Overall', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNIRF-2026-Overall.pdf?alt=media&token=6f4edb2a-f556-406d-b3b4-4f44c929659b' }],
  },
];
