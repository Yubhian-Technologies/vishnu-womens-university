import { slugify } from './slugify';
import { hasCustomSectionContent, type CustomSection } from './customSections';

// Admin-managed sidebar tabs for the Differentiators pages that use a
// persistent tab layout instead of the intro/accordion split (WISE, IIC,
// Vehicle Design Lab, AICTE Idea Lab — see CustomTabsEditor.tsx for the
// admin UI and CustomTabsPage.tsx for the public rendering). Each tab owns
// its own independent CustomSection tree, reusing the exact same
// CustomSectionEditor/CustomSectionsRenderer machinery already built for
// Programs and the intro/accordion Differentiators pages.
export interface CustomTab {
  // Slugified from the label once, at creation time, then frozen — same
  // stability rule as CustomSection.id.
  id: string;
  label: string;
  sections: CustomSection[];
  // How this tab's top-level sections render on the public page — 'stacked'
  // (the default) shows every section one below another (CustomSectionsPlain);
  // 'pills' shows a horizontal row of pill buttons, one per section, with
  // only the selected section's content shown below (CustomSectionsPills) —
  // matches the old WISE Modules tab's own internal tab strip.
  sectionsDisplay?: 'stacked' | 'pills';
}

function collectTabIds(tabs: CustomTab[]): Set<string> {
  return new Set(tabs.map((t) => t.id).filter(Boolean));
}

export function generateTabId(label: string, existingTabs: CustomTab[]): string {
  const taken = collectTabIds(existingTabs);
  const base = slugify(label) || 'tab';
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// Every admin-created tab stays visible on the public page regardless of
// content (matches the old hardcoded WISE_TABS/IIC_TABS/etc. arrays, which
// always showed every tab with a "coming soon" fallback for empty ones) —
// this is only used to pick a sensible default tab to open.
export function hasTabContent(tab: CustomTab): boolean {
  return tab.sections.some(hasCustomSectionContent);
}
