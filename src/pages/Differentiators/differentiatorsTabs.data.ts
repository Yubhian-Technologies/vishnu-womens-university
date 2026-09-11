// Consolidated extract of all tab definitions across the
// Differentiators pages. Tabs come from two sources:
//   1. Fixed/hardcoded in DifferentiatorDetail.tsx (IIC + IdeaLab)
//   2. Dynamic admin-defined via Firestore (`item.tabs` on each
//      DifferentiatorItemDoc) — rendered by VdlPage, WisePage,
//      IdeaLabPage, and merged into IicPage.
//   3. Special extra content injected alongside certain dynamic tabs
//      (e.g. VDL achievement reports under "Students Achievements &
//      Placements", IIC council members under "IIC – Constitution").
//
// The 4 differentiator items with tabbed pages are defined in
// DifferentiatorsAdmin.tsx as TABS_SLUGS.

import type { CustomTab } from '../../lib/customTabs';

// ───────────────────────────────────────────────────────────
// 1. Institution Innovation Cell (slug: institution-innovation-cell)
//    Has 4 fixed tabs added in IicPage() + dynamic tabs from Firestore.
// ───────────────────────────────────────────────────────────
export const IIC_FIXED_TABS: CustomTab[] = [
  {
    id: 'rating-certificates',
    label: 'Rating Certificates',
    sections: [],
    sectionsDisplay: 'stacked',
  },
  {
    id: 'iic-annual-reports',
    label: 'IIC Annual Reports',
    sections: [],
    sectionsDisplay: 'stacked',
  },
  {
    id: 'sih-hackathon-reports',
    label: 'SIH Internal Hackathon Reports',
    sections: [],
    sectionsDisplay: 'stacked',
  },
  {
    id: 'nisp',
    label: 'National Innovation Start-Up Policy',
    sections: [],
    sectionsDisplay: 'stacked',
  },
];

// ───────────────────────────────────────────────────────────
// 2. AICTE IDEA Lab (slug: aicte-idea-lab)
//    Has 3 fixed tabs added in IdeaLabPage() + dynamic tabs from Firestore.
// ───────────────────────────────────────────────────────────
export const IDEA_LAB_FIXED_TABS: CustomTab[] = [
  {
    id: 'team',
    label: 'Team',
    sections: [],
    sectionsDisplay: 'stacked',
  },
  {
    id: 'student-ambassadors',
    label: 'Student Ambassadors',
    sections: [],
    sectionsDisplay: 'stacked',
  },
  {
    id: 'facilities',
    label: 'Facilities',
    sections: [],
    sectionsDisplay: 'stacked',
  },
];

// ───────────────────────────────────────────────────────────
// 3. Vehicle Design Lab (slug: vehicle-design-lab)
//    Only dynamic tabs from Firestore (item.tabs).
//    Special tab: "Students Achievements & Placements" gets
//    VDL achievement reports injected.
// ───────────────────────────────────────────────────────────
export const VDL_SPECIAL_TABS = ['Students Achievements & Placements'] as const;

// ───────────────────────────────────────────────────────────
// 4. TalentSprint – WISE (slug: talentsprint-wise)
//    Only dynamic tabs from Firestore (item.tabs).
// ───────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────
// Combined list of all differentiator items that use tabbed pages.
// ───────────────────────────────────────────────────────────
export const DIFFERENTIATOR_TABS_SLUGS = [
  'institution-innovation-cell',
  'vehicle-design-lab',
  'talentsprint-wise',
  'aicte-idea-lab',
] as const;

export type DifferentiatorTabsSlug = (typeof DIFFERENTIATOR_TABS_SLUGS)[number];

// Maps each slug to its fixed tabs (empty array if none).
export const DIFFERENTIATOR_FIXED_TABS: Record<DifferentiatorTabsSlug, CustomTab[]> = {
  'institution-innovation-cell': IIC_FIXED_TABS,
  'vehicle-design-lab': [],
  'talentsprint-wise': [],
  'aicte-idea-lab': IDEA_LAB_FIXED_TABS,
};

// ───────────────────────────────────────────────────────────
// Quick lookup: which slug has which fixed tabs, and any special
// tab-level content injection.
// ───────────────────────────────────────────────────────────
export interface DifferentiatorTabMeta {
  slug: DifferentiatorTabsSlug;
  fixedTabCount: number;
  hasDynamicTabs: boolean;
  specialTabInjections: string[];
}

export const DIFFERENTIATOR_TAB_META: DifferentiatorTabMeta[] = [
  {
    slug: 'institution-innovation-cell',
    fixedTabCount: IIC_FIXED_TABS.length,
    hasDynamicTabs: true,
    specialTabInjections: [
      'IIC – Constitution → council members + PDF links',
      'Innovation Ambassadors → ambassador PDF links',
      'IIC Activities → year-by-year activity PDFs',
    ],
  },
  {
    slug: 'vehicle-design-lab',
    fixedTabCount: 0,
    hasDynamicTabs: true,
    specialTabInjections: [
      'Students Achievements & Placements → VDL achievement reports',
    ],
  },
  {
    slug: 'talentsprint-wise',
    fixedTabCount: 0,
    hasDynamicTabs: true,
    specialTabInjections: [],
  },
  {
    slug: 'aicte-idea-lab',
    fixedTabCount: IDEA_LAB_FIXED_TABS.length,
    hasDynamicTabs: true,
    specialTabInjections: [],
  },
];
