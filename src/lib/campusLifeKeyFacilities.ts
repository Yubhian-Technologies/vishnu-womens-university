// Content behind the website header's Campus Life menu -> "Key Facilities"
// column. These are standalone pages/links (Wellness, Clubs, Student Clubs,
// ...) that don't live in the campusLifeItems collection — they have their
// own routes/components or dedicated admins — so the header menu list is
// managed here instead, from Admin -> Campus Life -> "Key Facilities
// (website header menu)".
//
// The Firestore `campusLifeKeyFacilities` collection (docs: label, url,
// order) is the live source the header reads. These defaults are used as
// the one-click "Add starter content" seed in the admin, and as the header's
// fallback while the collection is empty so the menu never goes blank.

export interface KeyFacilityNavDoc {
  id: string;
  label: string;
  url: string;
  order: number;
}

export const KEY_FACILITY_LINK_DEFAULTS: { label: string; url: string }[] = [
  { label: 'Sewage Treatment Plants', url: '/campus/sewage-treatment-plants' },
  { label: 'Wellness Centre', url: '/campus/wellness' },
  { label: 'Vishnu TV Academy', url: '/vishnu-tv-academy' },
  { label: 'Student Clubs', url: '/campus/clubs' },
  { label: 'Vishnu School of Music', url: 'https://svesschoolofmusic.in/' },
  { label: 'Social Services', url: '/social-services' },
];