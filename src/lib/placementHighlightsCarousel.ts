// Shared between the admin crop step (PlacementItemsAdmin.tsx) and the
// public carousel (PhotoCarousel.tsx) so both sides agree on one exact
// ratio — admins crop new uploads to it, and the carousel itself crops
// (object-fit: cover) whatever's actually stored to the same ratio,
// so older photos that predate this fix still display consistently.
export const PLACEMENT_HIGHLIGHTS_CAROUSEL_RATIO = 2940 / 898;
