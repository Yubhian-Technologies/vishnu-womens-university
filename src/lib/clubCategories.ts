import { useOrderedCollection, type WithId } from '../hooks/useCollection';

// Club categories used to be hardcoded in StudentClubsAdmin.tsx. Today they
// live in the `studentClubCategories` Firestore collection so an admin can
// add, edit, and delete categories without a deploy. The original three stay
// in code only as a *fallback* for a brand-new project whose collection
// hasn't been seeded yet — the moment an admin adds a category, the three
// built-ins are written into Firestore too (see StudentClubsAdmin's save
// handler), so every category from then on is a real, editable/deletable doc
// and removing one actually sticks.
export interface ClubCategoryDef {
  id?: string;
  name: string;
  icon: string;
  accent: string;
  bg: string;
  order: number;
}

export type ClubCategoryDoc = WithId & Omit<ClubCategoryDef, 'id'>;

export const CLUB_CATEGORIES_COLLECTION = 'studentClubCategories';

export const DEFAULT_CLUB_CATEGORIES: ClubCategoryDef[] = [
  { name: 'Technical Clubs', icon: 'Laptop', bg: '#E1E6EC', accent: '#2F5FD0', order: 0 },
  { name: 'Social & Service Clubs', icon: 'Handshake', bg: '#F2F0E7', accent: '#268946', order: 1 },
  { name: 'Creative & Arts Clubs', icon: 'Palette', bg: '#E7E8E6', accent: '#C0529A', order: 2 },
];

// Active categories for the site: the Firestore collection once it has any
// docs, otherwise the three starter categories (so a fresh, unseeded project
// still shows them everywhere the site groups by category).
export function useClubCategories(): ClubCategoryDef[] {
  const { docs, loading } = useOrderedCollection<ClubCategoryDoc>(CLUB_CATEGORIES_COLLECTION, 'order');
  if (loading || docs.length === 0) return DEFAULT_CLUB_CATEGORIES;
  return docs;
}