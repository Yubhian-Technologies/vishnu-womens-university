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
}

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
