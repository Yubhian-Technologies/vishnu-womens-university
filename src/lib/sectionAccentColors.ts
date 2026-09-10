// Shared accent-colour palette a custom section can optionally be pinned to
// (see CustomSection.accentColor) — defined once here so the admin's swatch
// picker (CustomSectionEditor.tsx) and any renderer that uses it (currently
// just CampusEventsShowcase.tsx, for the Campus Life "Events" page) always
// agree on the same set of colours/hex values, rather than each keeping its
// own copy that could drift apart. A section with no accentColor set falls
// back to whatever the consuming renderer does by default (e.g. cycling
// through this same list by position).
export interface SectionAccentColor {
  key: string;
  label: string;
  /** Main colour — used for eyebrow/button/badge backgrounds on a dark
   *  section, and the background tint itself. */
  accent: string;
  /** A darker shade of `accent` — used wherever text needs to read against
   *  a light/white background instead (e.g. the eyebrow label on the light
   *  "Cultural Initiatives"-style section). */
  deep: string;
  /** Text colour to place ON TOP of a solid `accent`-coloured badge/button
   *  (e.g. .ces-event-badge) — light text for darker/saturated accents
   *  (Navy, Red), dark ink for lighter ones (White, Light Pink, Orange,
   *  Green), so every colour stays readable rather than assuming one fixed
   *  text colour works for all of them. */
  onAccent: string;
}

export const SECTION_ACCENT_COLORS: SectionAccentColor[] = [
  { key: 'white', label: 'White', accent: '#ffffff', deep: '#475569', onAccent: '#0c1220' },
  { key: 'navy', label: 'Navy Blue', accent: '#1e3a8a', deep: '#14265c', onAccent: '#ffffff' },
  { key: 'pink', label: 'Light Pink', accent: '#f9a8d4', deep: '#db2777', onAccent: '#0c1220' },
  { key: 'orange', label: 'Orange', accent: '#fb923c', deep: '#c2410c', onAccent: '#0c1220' },
  { key: 'red', label: 'Red', accent: '#ef4444', deep: '#b91c1c', onAccent: '#ffffff' },
  { key: 'green', label: 'Green', accent: '#22c55e', deep: '#15803d', onAccent: '#0c1220' },
];

export function findSectionAccentColor(key: string | undefined): SectionAccentColor | undefined {
  return key ? SECTION_ACCENT_COLORS.find((c) => c.key === key) : undefined;
}
