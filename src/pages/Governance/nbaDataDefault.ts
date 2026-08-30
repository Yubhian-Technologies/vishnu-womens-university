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
  { label: 'UG – Computer Science & Engineering', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBA-DCP-UG-CSE.pdf?alt=media&token=8aed953d-5355-4081-9305-613576de1c4a' },
  { label: 'UG – Electronics & Communication Engineering', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBA-DCP-UG-ECE.pdf?alt=media&token=e448083a-e357-4050-ad35-a1b98e0af7f0' },
  { label: 'UG – Electrical & Electronics Engineering', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBA-DCP-UG-EEE.pdf?alt=media&token=23723a78-491d-4d9b-bcad-44c50de529f5' },
  { label: 'UG – Information Technology', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBA-DCP-UG-IT.pdf?alt=media&token=52bd8411-f2c5-48fa-9032-bf34dfe7d0ad' },
];

export const NBA_DATA_INSTITUTIONAL: NbaDataItem[] = [
  { label: 'Details of Students', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBA-DCP-Students.pdf?alt=media&token=45ae392c-14ac-434c-9ab5-ffdd39b4d1ca' },
  { label: 'Details of Placement', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBA-DCP-Placement.pdf?alt=media&token=4665c654-7eab-4327-9f34-4a5fd91ab5c5' },
  { label: 'Details of Faculty', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBA-DCP-Faculty.pdf?alt=media&token=981fef6b-f5cf-4311-a9b6-eb85bc772a97' },
];
