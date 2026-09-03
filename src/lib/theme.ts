// Single source of truth for which CSS custom properties an admin can
// override site-wide, and what they look like out of the box (kept in sync
// with src/styles/variables.css by hand — there's no build step that reads
// one from the other). ThemeAdmin.tsx renders a color picker per entry here;
// ThemeOverrides.tsx applies whatever's saved in Firestore on top of these.
export interface ColorVarDef {
  key: string;
  label: string;
  hint: string;
  default: string;
  // When set, leaving this field blank in the admin means "inherit this
  // other CSS variable" rather than "use `default`" — ThemeAdmin.tsx omits
  // the key from Firestore entirely in that case, so Footer.css's own
  // var(--footer-bg, var(--color-primary-dark, ...)) fallback chain is what
  // actually resolves it, live, instead of a value getting pinned in place.
  inheritsFrom?: string;
}

// Footer-specific overrides — separate from COLOR_VARS because the footer
// intentionally stays dark even when the rest of the site is light, so its
// colors can't just reuse the main palette directly. --footer-bg and
// --footer-accent inherit from the main theme until an admin explicitly sets
// one, so changing Primary Dark or Accent above still re-colors the footer
// without needing to touch this section at all.
export const FOOTER_COLOR_VARS: ColorVarDef[] = [
  { key: '--footer-bg', label: 'Footer Background', hint: 'Blank inherits Primary Dark from the theme above.', default: '#0d251a', inheritsFrom: '--color-primary-dark' },
  { key: '--footer-text', label: 'Footer Text', hint: 'Body text and muted details in the footer.', default: '#e2e8f0' },
  { key: '--footer-heading', label: 'Footer Heading', hint: 'Headings, brand name, and brightest text in the footer.', default: '#ffffff' },
  { key: '--footer-accent', label: 'Footer Accent', hint: 'Blank inherits Accent from the theme above.', default: '#c9a84c', inheritsFrom: '--color-accent' },
];

export const COLOR_VARS: ColorVarDef[] = [
  { key: '--color-primary', label: 'Primary', hint: 'Main brand color — headings, primary buttons, nav.', default: '#1b4332' },
  { key: '--color-primary-dark', label: 'Primary Dark', hint: 'Hero overlays, footer background.', default: '#081c15' },
  { key: '--color-primary-light', label: 'Primary Light', hint: 'Lighter accents on top of Primary.', default: '#2d6a4f' },
  { key: '--color-secondary', label: 'Secondary', hint: 'Supporting brand color.', default: '#40916c' },
  { key: '--color-accent', label: 'Accent', hint: 'Gold highlights, call-to-action buttons.', default: '#C9A84C' },
  { key: '--color-accent-light', label: 'Accent Light', hint: 'Lighter accent for hovers/highlights.', default: '#e8c96a' },
  { key: '--color-red', label: 'Red', hint: 'Alerts and urgent highlights.', default: '#C8102E' },
  { key: '--color-white', label: 'White', hint: 'Page/card background.', default: '#f5fbf7' },
  { key: '--color-off-white', label: 'Off White', hint: 'Alternating section background.', default: '#e8f5ed' },
  { key: '--color-light-gray', label: 'Light Gray', hint: 'Borders and dividers.', default: '#cde8d9' },
  { key: '--color-mid-gray', label: 'Mid Gray', hint: 'Muted UI details.', default: '#9BA5B4' },
  { key: '--color-dark-gray', label: 'Dark Gray', hint: 'Secondary UI details.', default: '#555F6E' },
  { key: '--color-text', label: 'Text', hint: 'Main body text.', default: '#1a1f2e' },
  { key: '--color-text-light', label: 'Text Light', hint: 'Secondary/muted text.', default: '#4A5568' },
];

export const THEME_DOC = { collection: 'siteSettings', id: 'theme' } as const;
