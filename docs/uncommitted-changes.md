# Uncommitted Changes — branch `sivaathmika`

_Generated snapshot — reflects the working tree as of this writing. Not committed or pushed._

Branch is up to date with `origin/sivaathmika` (no unpushed commits). Two files have uncommitted edits:

- `src/pages/Academics/ProgramDetail.tsx`
- `src/pages/Admin/sections/ProgramsAdmin.tsx`

## 1. Curriculum ("Programme Structure") section now hides when empty

**File:** `src/pages/Academics/ProgramDetail.tsx`

Previously the "Programme Structure" section always rendered on every programme's page, showing a "No curriculum has been added yet" placeholder when a programme had no semesters. It's now conditional — hidden entirely (both the section and its "Curriculum" Quick Links entry) until at least one semester exists, matching the same pattern already used for Labs, Mind Map, HOD, etc.

- Added `hasCurriculum = !!(program.semesters && program.semesters.length > 0)`.
- The `curriculum` Quick Links entry and the `<section id="curriculum">` block are both now gated on `hasCurriculum`.

## 2. New "Digital Library" feature — fully dynamic Section → Items system

**Files:** both.

Adds an optional "Digital Library" section to every programme's public page, entirely admin-authored per programme (no hardcoded headings or items — different branches can show completely different content).

### Data model (`ProgramsAdmin.tsx`)

New types on `ProgramDoc`:

```ts
export interface LibraryItem {
  label: string;
  value: string;
}
export interface LibrarySection {
  heading: string;
  items: LibraryItem[];
}
```

New optional fields on `ProgramDoc`:
- `libraryIntro?: string` — a plain overview paragraph.
- `libraryInCharge?: string` — free-text "In-charge of Department Library" line.
- `librarySections?: LibrarySection[]` — unlimited sections, each with unlimited items. Stored on each programme's own Firestore doc, so every branch's library data is independent.

### Admin UI (`ProgramsAdmin.tsx`)

A new "Digital Library" block in the Add/Edit Program form, below "Mind Map":
- Library Overview textarea, In-charge text input.
- Section editor mirroring the existing "Programme Structure (Semester-wise Curriculum)" editor's exact pattern:
  - **+ Add Section** creates a section with an editable heading.
  - Each section has **+ Add Item** (Item Name + Count fields), plus ↑/↓ reorder and ✕ remove per item.
  - Each section itself has ↑/↓ reorder and "Remove Section" (with confirmation).
- New handler functions: `addLibrarySection`, `updateLibrarySectionHeading`, `moveLibrarySection`, `removeLibrarySection`, `addLibraryItem`, `updateLibraryItem`, `moveLibraryItem`, `removeLibraryItem`.
- `set()`'s type signature widened to accept `LibrarySection[]`.
- `startEdit()` and `EMPTY` updated to include the new fields.

### Public rendering (`ProgramDetail.tsx`)

- `libraryTables = (program.librarySections || []).filter((sec) => sec.items.length > 0)` — sections with no items simply don't render.
- `hasLibrary` (gates the section + its Quick Links entry) is true if there's an overview, an in-charge line, or at least one non-empty section.
- Each section renders as its own heading + table (S. No / Item / Count columns, auto-numbered), reusing the existing `pb-activities-scroll` table styling already used elsewhere (e.g. Student Clubs' Committee Members table) — no new CSS.
- No admin terminology ("Section", "Item", etc.) appears on the public page — only the actual heading and item text the admin entered.
- New `BookOpen` icon import from `lucide-react` for the in-charge line.

### Migration note (not a code TODO — informational)

An earlier iteration of this feature (already superseded, not in the current diff) had stored Department Books / Complimentary Copies / other stats as fixed fields on a live "B.Tech ECE" Firestore record. Those fields were removed by this diff, so that record's old data is now orphaned/unused — the admin will need to re-enter it via the new Section → Items UI once these changes are committed and deployed. This affects only that one live record, not the code.

## Verification already performed this session

- `tsc --noEmit` — passes.
- `npm run build` — passes (only the pre-existing >500KB chunk-size warning, unrelated).
- Live dev-server screenshot (Playwright) of `/academics/ece` confirmed: no new console errors, Curriculum section correctly hidden when empty, Digital Library section renders correctly in its transitional (no-sections-yet) state.
