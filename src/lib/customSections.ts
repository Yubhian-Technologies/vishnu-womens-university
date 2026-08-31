import { slugify } from './slugify';
import { parseFlexibleTable, parseLinkList } from './structuredTable';

// Admin-defined custom sections, added per-program from the Programs admin
// (see CustomSectionEditor.tsx) and rendered generically on both
// ProgramDetail.tsx and DepartmentDetail.tsx (the latter reads the same
// ProgramDoc field off its active programme) — see CustomSectionsRenderer.tsx.
// Purely additive: every existing hardcoded section on those pages is
// untouched by this.

export type CustomSectionContentType = 'text' | 'table' | 'links' | 'files';

export interface CustomSectionFile {
  label: string;
  fileUrl: string;
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
  // One level of nesting is all the admin UI exposes (CustomSectionEditor
  // only recurses to depth 1) even though the shape itself is recursive.
  subSections?: CustomSection[];
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
