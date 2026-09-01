import { slugify } from './slugify';
import { parseFlexibleTable, parseLinkList } from './structuredTable';

// Admin-defined custom sections, added per-program from the Programs admin
// (see CustomSectionEditor.tsx) and rendered generically on both
// ProgramDetail.tsx and DepartmentDetail.tsx (the latter reads the same
// ProgramDoc field off its active programme) — see CustomSectionsRenderer.tsx.
// Purely additive: every existing hardcoded section on those pages is
// untouched by this.

export type CustomSectionContentType = 'text' | 'table' | 'links' | 'files' | 'list' | 'person';

export interface CustomSectionFile {
  label: string;
  fileUrl: string;
  storagePath: string;
}

export interface CustomSectionPhoto {
  imageUrl: string;
  storagePath: string;
}

export interface CustomSection {
  // Slugified from the label once, at creation time, then frozen — renaming
  // the section later must NOT change this, or every bookmarked/shared
  // #anchor and the Quick Links entry pointing at it would break.
  id: string;
  label: string;
  contentType: CustomSectionContentType;
  textContent?: string;
  tableText?: string;
  linksText?: string;
  files?: CustomSectionFile[];
  // 'list' — a short checkmark-bullet list (one item per line), the same
  // shape/convention as every other one-per-line field in this codebase
  // (Programs' mission/highlights, Key Highlights, ...) — a plain paragraph
  // ('text') doesn't fit a bulleted Mission/Objectives/Activities list.
  listText?: string;
  // 'person' — a short role/designation line (e.g. "Dean · WISE"), shown
  // between the name and the bio (textContent, reused for the bio here) on
  // a person's card — see PersonCard in CustomSectionsRenderer.tsx.
  personPosition?: string;
  // Subsections can themselves have subsections, arbitrarily deep — lets a
  // section hold several distinct pieces together (e.g. a description plus
  // two separate tables) by giving each its own nested section instead of
  // cramming them into one contentType.
  subSections?: CustomSection[];
  // How THIS section's own subSections display — 'stacked' (default) shows
  // each one below the previous; 'pills' shows a horizontal pill switcher
  // (one subsection's content at a time), same mechanism as a tab's
  // sectionsDisplay but one level down — e.g. a "Training / Research"
  // section whose subsections are academic years.
  subSectionsDisplay?: 'stacked' | 'pills';
  // Where this section renders on the Differentiators detail page — 'intro'
  // sections show compactly inline in the page's intro column (next to
  // About, matching the old Vision/Mission/Objectives styling); everything
  // else (the default, undefined counts as 'accordion') renders as a
  // collapsible accordion panel below, matching the old
  // In-charge/Academic Projects/... accordions. Ignored on Programs pages,
  // which always render every custom section as its own full section.
  placement?: 'intro' | 'accordion';
  // Optional heavier heading weight for this section's label, admin-toggled
  // per section — off by default (matches the current look everywhere).
  boldHeading?: boolean;
  // Optional single photo shown beside this section's content (round avatar
  // treatment — see CustomSectionBody in CustomSectionsRenderer.tsx).
  // Independent of contentType — a section can have a photo alongside text,
  // a table, a list, etc.
  photo?: CustomSectionPhoto;
}

// Every anchor id already hardcoded in ProgramDetail.tsx/DepartmentDetail.tsx
// — a custom section's generated id must never collide with one of these,
// or document.getElementById() in the hash-scroll effect on either page
// would resolve to the wrong element.
export const RESERVED_SECTION_IDS = new Set([
  'about', 'vision-mission', 'peos-pos-psos', 'hod', 'faculty', 'mindmap',
  'curriculum', 'labs', 'library', 'news', 'newsletter', 'rnd',
  'program-toggle', 'programme-about', 'highlights', 'program-levels',
  'placements', 'news-events',
]);

function collectIds(sections: CustomSection[], into: Set<string>) {
  for (const s of sections) {
    if (s.id) into.add(s.id);
    if (s.subSections) collectIds(s.subSections, into);
  }
}

// Generates a stable, unique anchor id for a newly-created section. Called
// once at creation time only — never re-derived from a later label edit.
export function generateSectionId(label: string, allSections: CustomSection[]): string {
  const taken = new Set(RESERVED_SECTION_IDS);
  collectIds(allSections, taken);
  const base = slugify(label) || 'section';
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// Mirrors the `hasX` presence checks every existing fixed section already
// uses (e.g. hasLibrary checks parsed table rows exist, not just that the
// field is set) — a section with an empty/whitespace-only field shouldn't
// get a Quick Links entry or render an empty block. A parent section with
// no content of its own still counts as visible if any subsection does.
export function hasCustomSectionContent(section: CustomSection): boolean {
  if (section.photo?.imageUrl) return true;
  const ownContent = (() => {
    switch (section.contentType) {
      case 'text':
        return !!section.textContent?.trim();
      case 'table':
        return parseFlexibleTable(section.tableText || '').some((t) => t.headers.length > 0);
      case 'links':
        return parseLinkList(section.linksText || '').some((g) => g.links.length > 0);
      case 'files':
        return (section.files || []).some((f) => !!f.fileUrl);
      case 'list':
        return (section.listText || '').split('\n').map((s) => s.trim()).filter(Boolean).length > 0;
      case 'person':
        return !!section.textContent?.trim() || !!section.personPosition?.trim();
      default:
        return false;
    }
  })();
  if (ownContent) return true;
  return (section.subSections || []).some(hasCustomSectionContent);
}

// Immutable update at an arbitrary depth in the section tree, addressed by a
// path of indices (e.g. [2] = top-level section 2, [2, 0] = its first
// sub-section). Used specifically for file upload/remove handlers: several
// FileUploader uploads can resolve concurrently, and each must recompute its
// next tree from the CURRENT form state (via setForm(p => ...) at the call
// site), never a closed-over snapshot — otherwise whichever upload's state
// write lands last silently overwrites every other upload that already
// landed. See handleLabPdf/removeLabPdf in ProgramsAdmin.tsx for the same
// bug class in the (flatter) Labs editor.
export function replaceAtPath(
  sections: CustomSection[],
  path: number[],
  updater: (section: CustomSection) => CustomSection,
): CustomSection[] {
  const [index, ...rest] = path;
  return sections.map((s, i) => {
    if (i !== index) return s;
    if (rest.length === 0) return updater(s);
    return { ...s, subSections: replaceAtPath(s.subSections || [], rest, updater) };
  });
}

// Read-only counterpart to replaceAtPath — used to look up a section (e.g.
// to read a file's storagePath before deleting it) without mutating.
export function getAtPath(sections: CustomSection[], path: number[]): CustomSection | undefined {
  const [index, ...rest] = path;
  const section = sections[index];
  if (!section) return undefined;
  return rest.length === 0 ? section : getAtPath(section.subSections || [], rest);
}
