// The 16 real "Discover > Campus Life" header dropdown items (see
// src/components/Header/Header.tsx navItems). Slugs match the sub-section
// keys already used for these facilities in src/pages/Admin/sections/
// SitePhotosAdmin.tsx's DEFAULT_SECTIONS.campus, so useSitePhotos('campus',
// slug, ...) on the detail page pulls the exact same admin-editable photos.
export interface CampusFacility {
  slug: string;
  title: string;
  desc: string;
}

export const campusFacilities: CampusFacility[] = [
  { slug: 'smart-classrooms', title: 'Smart Class Rooms', desc: "VWU's smart classrooms are equipped with interactive displays and modern audio-visual systems, creating an engaging, technology-enabled learning environment for every session." },
  { slug: 'state-of-the-art-labs', title: 'State-of-the-art Labs', desc: 'Specialised laboratories across every department give students hands-on access to modern equipment and tools, supporting practical learning alongside classroom instruction.' },
  { slug: 'central-library', title: 'Central Library', desc: 'The Central Library offers a spacious reading environment along with a wide collection of academic texts, journals, and digital resources to support student and faculty research.' },
  { slug: 'auditoriums', title: 'Auditoriums', desc: "VWU's auditoriums host seminars, conferences, cultural events, and convocations, providing a large, well-equipped venue for campus-wide gatherings." },
  { slug: 'campus-book-stores', title: 'Campus Book Stores', desc: 'The on-campus book store stocks textbooks, stationery, and academic essentials, making it convenient for students to get what they need without leaving campus.' },
  { slug: 'wifi-campus', title: 'Wi-Fi Campus', desc: 'High-speed Wi-Fi connectivity spans the entire campus, keeping students and faculty connected for coursework, research, and communication at all times.' },
  { slug: 'campus-hostels', title: 'Campus Hostels', desc: 'Secure, comfortable hostel accommodation is available for resident students, with modern amenities designed to make campus life convenient and safe.' },
  { slug: 'food-courts', title: 'Food Courts', desc: "VWU's food courts serve hygienic, freshly prepared meals throughout the day, offering a variety of options for students and staff." },
  { slug: 'fitness-centre', title: 'VISHNU Fitness Centre', desc: 'The VISHNU Fitness Centre gives students access to fitness equipment and facilities to support their physical health alongside academic life.' },
  { slug: 'staff-quarters', title: 'Staff Quarters', desc: 'On-campus staff quarters provide residential accommodation for faculty and staff within the university campus.' },
  { slug: 'travel-desk', title: 'Travel Desk', desc: 'The campus travel desk assists students and staff with transport arrangements, making local and outstation travel simpler to coordinate.' },
  { slug: 'temples', title: 'Temples', desc: 'On-campus temples provide a space for reflection and spiritual practice, reflecting the cultural values that are part of everyday campus life.' },
  { slug: 'health-care', title: 'Health Care', desc: 'The campus health centre offers basic medical care and support, helping ensure the wellbeing of students and staff throughout the academic year.' },
  { slug: 'swimming-pool', title: 'Swimming Pool', desc: "VWU's swimming pool facility supports student fitness and recreation as part of the university's broader sports and wellness offerings." },
  { slug: 'campus-security', title: 'Campus Security', desc: 'Round-the-clock campus security, including CCTV monitoring, helps maintain a safe and secure environment for everyone on campus.' },
  { slug: 'other-facilities', title: 'Other Facilities', desc: 'Beyond the facilities listed here, VWU continues to invest in additional infrastructure and amenities that support a well-rounded campus experience.' },
];

export function findCampusFacilityBySlug(slug: string): CampusFacility | undefined {
  return campusFacilities.find((f) => f.slug === slug);
}

// Facilities on the public Campus page come from the freely admin-entered
// `contentBlocks` collection, so an admin can title/slug a card however
// they like — it won't always line up with one of the 16 canonical slugs
// above. Known real-world title variants are mapped here so those tiles
// still link to the right dedicated page even when their stored slug
// doesn't match (e.g. an admin-entered "Specialised Laboratories" card
// should open the "State-of-the-art Labs" page).
const FACILITY_TITLE_ALIASES: Record<string, string> = {
  'specialised laboratories': 'state-of-the-art-labs',
  'specialized laboratories': 'state-of-the-art-labs',
  'specialised labs': 'state-of-the-art-labs',
  'specialized labs': 'state-of-the-art-labs',
  'laboratories': 'state-of-the-art-labs',
  'labs': 'state-of-the-art-labs',
};

/** Resolves an admin-entered facility card to its dedicated page, trying
 *  the stored slug first and falling back to a known title alias. */
export function resolveCampusFacility(title: string, slug?: string): CampusFacility | undefined {
  if (slug) {
    const bySlug = findCampusFacilityBySlug(slug);
    if (bySlug) return bySlug;
  }
  const aliasSlug = FACILITY_TITLE_ALIASES[title.trim().toLowerCase()];
  return aliasSlug ? findCampusFacilityBySlug(aliasSlug) : undefined;
}
