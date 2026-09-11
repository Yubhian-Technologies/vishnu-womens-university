// Shared types/defaults for the Campus Life > Sports page (src/pages/Campus/Sports.tsx)
// and its admin (src/pages/Admin/sections/SportsAdmin.tsx + sections/sports/*).
//
// Nothing here is shown on the public page unless an admin actually entered it —
// each section is hidden entirely while its own collection is empty (same "no
// static fallback" convention every Firestore-backed section on this site
// follows, see CLAUDE.md), and a section's own label/title/subtitle only
// renders if that specific field was set. The one exception is the hero
// title/subtitle, which — like every other page's <PageHero> on this site —
// shows a hardcoded default until an admin overrides it. The colour palette
// is a fixed choice from a preset list (not free text), so defaulting it is
// picking a valid starting option, not injecting hardcoded copy — nothing
// about which sports/tournaments/achievements/facilities exist, their
// names, or their pictures is fixed; admins add, rename, re-picture, and
// reorder every one of them.

// A gallery photo on a sport's own detail page (/campus/sports/:id) —
// admin adds/removes freely, same upload style as everywhere else.
export interface SportsGalleryImage {
  url: string;
  storagePath: string;
}

// Explore Our Sports — an uploaded icon/photo shown at its own natural
// aspect ratio, plus name, optional subtitle, and category tag. Clicking
// its tile opens this sport's own detail page (id-addressed, so no slug
// collisions to worry about) — `about` and `gallery` back that page and
// are optional, same "no static fallback" convention as everything else.
export interface SportsCategoryDoc {
  title: string;
  subtitle?: string;
  categoryTag?: string;
  imageUrl: string;
  storagePath: string;
  order: number;
  about?: string;
  gallery?: SportsGalleryImage[];
}

// Collegewise Tournaments — photo-only cards displayed in an auto-sliding strip.
export interface SportsTournamentDoc {
  title?: string;          // optional — no longer shown on the card
  imageUrl: string;
  storagePath: string;
  order: number;
}

// Medals & Achievements — photo-only cards displayed in a gallery grid.
export interface SportsAchievementDoc {
  title?: string;          // optional — no longer shown on the card
  order: number;
  imageUrl?: string;
  storagePath?: string;
}

// Infrastructure & Our Sports — photo card with bento tags and featured hero flag.
export interface SportsFacilityDoc {
  title: string;
  imageUrl: string;
  storagePath: string;
  isFeatured?: boolean;
  tagsString?: string;
  order: number;
}

export interface SportsSectionText {
  label: string;
  title: string;
  subtitle: string;
}

// The closing band — up to three short phrases joined by "|" (e.g. "More
// Sports | More Opportunities | A Healthier You"). No button, matching the
// reference design.
export interface SportsClosingText {
  segment1: string;
  segment2: string;
  segment3: string;
}

export type SportsPaletteSection = 'explore' | 'tournaments' | 'achievements' | 'infrastructure';

export type SportsSectionPalettes = Record<SportsPaletteSection, string>;

// 0–100, percentage opacity of the chosen solid colour over that section's
// area — 100 is fully solid (photo not visible at all through it), lower
// values let the shared background photo blend through underneath. Only
// meaningful once a section has an actual colour chosen (not "Photo").
export type SportsSectionOpacities = Record<SportsPaletteSection, number>;

export interface SportsPageSettingsDoc {
  heroTitle: string;
  heroSubtitle: string;
  // Applies to the hero banner accent and the closing band only — each of
  // the 4 content sections below has its own independent choice instead
  // (sectionPalettes).
  palette: string;
  sectionPalettes: SportsSectionPalettes;
  sectionOpacities: SportsSectionOpacities;
  explore: SportsSectionText;
  tournaments: SportsSectionText;
  achievements: SportsSectionText;
  infrastructure: SportsSectionText;
  closing: SportsClosingText;
  // A large trophy/heading photo shown to the left of the "Medals &
  // Achievements" heading (in place of the small icon) once an admin
  // uploads one — see the "Champions of VIT"-style reference design. Blank
  // by default, same as every other admin-controlled photo on this page.
  achievementsIcon: { imageUrl: string; storagePath: string };
}

export interface SportsPalette {
  label: string;
  primary: string;
  primaryDark: string;
  accent: string;
}

// A handful of curated starting points, shown as quick-pick swatches in the
// admin — but not the only choice: each of the 4 content sections also
// accepts any arbitrary hex colour (see isCustomSectionColor/
// resolveSectionPalette below) via a native colour picker in the admin, so
// nothing here restricts what an admin can actually pick for a section.
export const SPORTS_PALETTES: Record<string, SportsPalette> = {
  'navy-gold': { label: 'Navy & Gold', primary: '#0b1e42', primaryDark: '#07142c', accent: '#C9A84C' },
  'midnight-orange': { label: 'Midnight & Orange', primary: '#0a1128', primaryDark: '#05070f', accent: '#f97316' },
  'maroon-gold': { label: 'Maroon & Gold', primary: '#4a0e0e', primaryDark: '#2e0505', accent: '#e0b04a' },
  'forest-emerald': { label: 'Forest & Emerald', primary: '#0f2e1d', primaryDark: '#081c12', accent: '#34d399' },
};

export const DEFAULT_SPORTS_PALETTE = 'navy-gold';

// Sentinel "colour" for a content section — not a real entry in
// SPORTS_PALETTES, so resolveSectionPalette still falls back to the default
// palette's colours for accent styling, but sectionHasSolidBg (below) reads
// this to mean "no colour chosen, keep showing the shared background photo".
// This is the default for every section until an admin actively picks a
// real colour in the admin's "Colour Palette" picker.
export const SPORTS_PALETTE_PHOTO = 'photo';

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

// A section's stored colour can be a curated palette key OR any arbitrary
// hex colour an admin picked via the native colour input — this tells them
// apart.
export function isCustomSectionColor(key: string | undefined): key is string {
  return !!key && HEX_COLOR_RE.test(key);
}

// Darkens a hex colour by a flat amount per channel — used to derive a
// section's --color-primary-dark from an arbitrary admin-picked colour
// (the curated palettes specify this by hand instead).
function darkenHex(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const clamp = (c: number) => Math.max(0, Math.min(255, c));
  const r = clamp((num >> 16) - amount);
  const g = clamp(((num >> 8) & 0xff) - amount);
  const b = clamp((num & 0xff) - amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Picks readable heading/tile-name text — white or near-black — for a given
// solid section background, using the standard WCAG relative-luminance
// formula. The curated palettes are all dark (white always wins), but an
// admin-picked custom colour can be anything (including a light one), so
// this keeps text legible regardless of what's chosen.
export function contrastTextColor(hex: string): string {
  const num = parseInt(hex.slice(1), 16);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLinear((num >> 16) & 0xff);
  const g = toLinear((num >> 8) & 0xff);
  const b = toLinear(num & 0xff);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? '#141414' : '#ffffff';
}

export function resolveSportsPalette(doc: Partial<SportsPageSettingsDoc> | null | undefined): SportsPalette {
  const key = doc?.palette;
  return (key && SPORTS_PALETTES[key]) ? SPORTS_PALETTES[key] : SPORTS_PALETTES[DEFAULT_SPORTS_PALETTE];
}

// Same idea as resolveSportsPalette, but for one of the 4 content sections'
// own independent colour choice rather than the page-wide one (which only
// covers the hero banner and the closing band — see SportsPageSettingsDoc).
// Accepts a curated palette key or any custom hex colour.
export function resolveSectionPalette(
  doc: Partial<SportsPageSettingsDoc> | null | undefined,
  section: SportsPaletteSection,
): SportsPalette {
  const key = doc?.sectionPalettes?.[section];
  if (key && SPORTS_PALETTES[key]) return SPORTS_PALETTES[key];
  if (isCustomSectionColor(key)) {
    return { label: 'Custom', primary: key, primaryDark: darkenHex(key, 55), accent: SPORTS_PALETTES[DEFAULT_SPORTS_PALETTE].accent };
  }
  return SPORTS_PALETTES[DEFAULT_SPORTS_PALETTE];
}

// Whether this section should show as a solid, opaque colour (hiding the
// shared background photo behind it) rather than the photo showing through.
// True only once an admin has actually picked a real colour for this
// section — the default (unset, or explicitly "Photo") keeps the photo
// visible, matching the page's original look until someone opts in.
export function sectionHasSolidBg(
  doc: Partial<SportsPageSettingsDoc> | null | undefined,
  section: SportsPaletteSection,
): boolean {
  const key = doc?.sectionPalettes?.[section];
  if (!key || key === SPORTS_PALETTE_PHOTO) return false;
  return !!SPORTS_PALETTES[key] || isCustomSectionColor(key);
}

export const DEFAULT_SPORTS_SECTION_OPACITY = 100;

// This section's colour opacity (0–100), only meaningful once it has an
// actual colour chosen — defaults to fully solid (100).
export function resolveSectionOpacity(
  doc: Partial<SportsPageSettingsDoc> | null | undefined,
  section: SportsPaletteSection,
): number {
  const value = doc?.sectionOpacities?.[section];
  return (typeof value === 'number' && value >= 0 && value <= 100) ? value : DEFAULT_SPORTS_SECTION_OPACITY;
}

// Hero fallback only — same role as the `defaultTitle`/`defaultSubtitle`
// every other page passes into <PageHero>. Not used for any other field.
export const SPORTS_HERO_DEFAULTS = {
  heroTitle: 'Play with Passion, Compete with Pride',
  heroSubtitle: 'Sports build stronger bodies, sharper minds, and a united campus.',
};

// Suggested copy shown only as <input placeholder> ghost text in the admin
// form — never rendered on the public page, never saved unless an admin
// actually types (or accepts) it.
export const SPORTS_TEXT_SUGGESTIONS: Record<'explore' | 'tournaments' | 'achievements' | 'infrastructure', SportsSectionText> = {
  explore: { label: 'Our Sports', title: 'Explore Our Sports', subtitle: '' },
  tournaments: { label: 'Competitions', title: 'Collegewise Tournaments', subtitle: '' },
  achievements: { label: 'Our Achievements', title: 'Medals & Achievements', subtitle: '' },
  infrastructure: { label: 'Infrastructure', title: 'Infrastructure & Our Sports', subtitle: '' },
};

export const SPORTS_CLOSING_SUGGESTION: SportsClosingText = {
  segment1: 'More Sports',
  segment2: 'More Opportunities',
  segment3: 'A Healthier You',
};

function toSectionTextForm(d: Partial<SportsSectionText> | undefined): SportsSectionText {
  return { label: d?.label ?? '', title: d?.title ?? '', subtitle: d?.subtitle ?? '' };
}

// Admin form initial state — the *actual* saved value for every field (blank
// if never set), never a hardcoded default; the form's placeholders supply
// the suggestion text instead.
export function toSportsSettingsForm(doc: Partial<SportsPageSettingsDoc> | null | undefined): SportsPageSettingsDoc {
  const d = doc || {};
  return {
    heroTitle: d.heroTitle ?? '',
    heroSubtitle: d.heroSubtitle ?? '',
    palette: (d.palette && SPORTS_PALETTES[d.palette]) ? d.palette : DEFAULT_SPORTS_PALETTE,
    sectionPalettes: {
      explore: d.sectionPalettes?.explore ?? SPORTS_PALETTE_PHOTO,
      tournaments: d.sectionPalettes?.tournaments ?? SPORTS_PALETTE_PHOTO,
      achievements: d.sectionPalettes?.achievements ?? SPORTS_PALETTE_PHOTO,
      infrastructure: d.sectionPalettes?.infrastructure ?? SPORTS_PALETTE_PHOTO,
    },
    sectionOpacities: {
      explore: d.sectionOpacities?.explore ?? DEFAULT_SPORTS_SECTION_OPACITY,
      tournaments: d.sectionOpacities?.tournaments ?? DEFAULT_SPORTS_SECTION_OPACITY,
      achievements: d.sectionOpacities?.achievements ?? DEFAULT_SPORTS_SECTION_OPACITY,
      infrastructure: d.sectionOpacities?.infrastructure ?? DEFAULT_SPORTS_SECTION_OPACITY,
    },
    explore: toSectionTextForm(d.explore),
    tournaments: toSectionTextForm(d.tournaments),
    achievements: toSectionTextForm(d.achievements),
    infrastructure: toSectionTextForm(d.infrastructure),
    closing: {
      segment1: d.closing?.segment1 ?? '',
      segment2: d.closing?.segment2 ?? '',
      segment3: d.closing?.segment3 ?? '',
    },
    achievementsIcon: {
      imageUrl: d.achievementsIcon?.imageUrl ?? '',
      storagePath: d.achievementsIcon?.storagePath ?? '',
    },
  };
}
