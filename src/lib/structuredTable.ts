// Parses a simple text format for editable member/roster tables, so an admin
// can manage a whole table (including multiple named sections, e.g. one per
// department) from a single textarea instead of a spreadsheet-style UI.
//
// Format:
//   ## Section Title                          (optional — starts a new named section)
//   Name | Role | Notes | Email | LinkedIn     (Notes, Email, LinkedIn are each optional per row)
//
// Rows before any "## " line go into a single unnamed section. Email/LinkedIn
// only make sense for roster-style pages (TPO Team, TPO Cell, ILO) — when
// set, PlacementDetail.tsx shows them as a compact "Contact: ... LinkedIn:
// ..." line right under that row's name, so per-person contact info can be
// managed in this same table instead of a separate admin section.
export interface StructuredTableRow {
  name: string;
  role: string;
  notes: string;
  email?: string;
  linkedin?: string;
}

export interface StructuredTableSection {
  title: string;
  rows: StructuredTableRow[];
}

export function parseStructuredTable(text: string): StructuredTableSection[] {
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const sections: StructuredTableSection[] = [];
  let current: StructuredTableSection | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      current = { title: line.slice(3).trim(), rows: [] };
      sections.push(current);
      continue;
    }
    const parts = line.split('|').map((p) => p.trim());
    const row: StructuredTableRow = {
      name: parts[0] || '', role: parts[1] || '', notes: parts[2] || '',
      ...(parts[3] ? { email: parts[3] } : {}),
      ...(parts[4] ? { linkedin: parts[4] } : {}),
    };
    if (!current) {
      current = { title: '', rows: [] };
      sections.push(current);
    }
    current.rows.push(row);
  }
  return sections;
}

// Distinct Year labels present in a flat structured table that reuses the
// optional 4th pipe field ("email" slot) as a Year instead of a real email —
// e.g. Placements' Internships page ("Company | Stipend/Month | No. of
// Selects | Year"). Rows with no 4th field at all are legacy/undated rows and
// aren't counted as a year.
export function listStructuredTableYears(text: string): string[] {
  const years = new Set<string>();
  parseStructuredTable(text).forEach((s) => s.rows.forEach((r) => {
    if (r.email && r.email.trim()) years.add(r.email.trim());
  }));
  return [...years];
}

// For flat "Name | Role | Notes | Year" tables (see listStructuredTableYears
// above) — merges newly imported rows for one specific year into the
// existing text, replacing only that year's own previous rows while leaving
// every other year's rows (and any legacy rows with no year at all)
// untouched. Unlike mergeFlexibleTable's "## " title-keyed sections, the year
// here lives inside each row itself, so it's forced onto every row of
// newDataText regardless of what (if anything) that field already held —
// the whole point is that an admin picks the year once, in the UI, rather
// than typing it into every row of the source spreadsheet.
export function mergeStructuredTableByYear(existingText: string, year: string, newDataText: string): string {
  const targetYear = year.trim();
  const existingRows = parseStructuredTable(existingText).flatMap((s) => s.rows);
  const importedRows = parseStructuredTable(newDataText).flatMap((s) => s.rows)
    .map((r): StructuredTableRow => ({ ...r, email: targetYear }));

  const noYear: StructuredTableRow[] = [];
  const byYear = new Map<string, StructuredTableRow[]>();
  const yearOrder: string[] = [];
  for (const row of existingRows) {
    const y = (row.email || '').trim();
    if (!y) { noYear.push(row); continue; }
    if (!byYear.has(y)) { byYear.set(y, []); yearOrder.push(y); }
    byYear.get(y)!.push(row);
  }
  if (!byYear.has(targetYear)) yearOrder.push(targetYear);
  byYear.set(targetYear, importedRows);

  const orderedRows = [...noYear, ...yearOrder.flatMap((y) => byYear.get(y) || [])];
  return orderedRows.map((r) => [r.name, r.role, r.notes, r.email || ''].join(' | ')).join('\n');
}

// A more general text-table format for data that doesn't fit the fixed
// Name/Role/Notes shape above — e.g. Research's tables, which vary from a
// single "Area" column to "Project Title | PI | Amount | Agency". The first
// line of each section is treated as the header row; every line after it is
// a data row with the same number of pipe-separated cells.
//
// Format:
//   ## Section Title                 (optional — starts a new named section)
//   Header 1 | Header 2 | Header 3   (first line = column headers)
//   Value 1  | Value 2  | Value 3
export interface FlexibleTableSection {
  title: string;
  headers: string[];
  rows: string[][];
}

export function parseFlexibleTable(text: string): FlexibleTableSection[] {
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const sections: FlexibleTableSection[] = [];
  let current: FlexibleTableSection | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      current = { title: line.slice(3).trim(), headers: [], rows: [] };
      sections.push(current);
      continue;
    }
    const cells = line.split('|').map((c) => c.trim());
    if (!current) {
      current = { title: '', headers: [], rows: [] };
      sections.push(current);
    }
    if (current.headers.length === 0) {
      current.headers = cells;
    } else {
      current.rows.push(cells);
    }
  }
  return sections;
}

export function serializeFlexibleTable(sections: FlexibleTableSection[]): string {
  return sections.map((s) => {
    const lines: string[] = [];
    if (s.title) lines.push(`## ${s.title}`);
    if (s.headers.length > 0) lines.push(s.headers.join(' | '));
    s.rows.forEach((row) => lines.push(row.join(' | ')));
    return lines.join('\n');
  }).join('\n\n');
}

// Combines existing table text with newly imported text, folding new rows
// into an existing section of the exact same title (so re-importing a sheet
// adds rows instead of creating a duplicate section) — used by the generic
// custom-section table importer so "import" always means "append", never
// "replace" (see genericSectionImport.ts).
export function mergeFlexibleTable(existingText: string, newText: string): string {
  const byTitle = new Map<string, FlexibleTableSection>();
  const order: string[] = [];
  for (const section of [...parseFlexibleTable(existingText), ...parseFlexibleTable(newText)]) {
    const found = byTitle.get(section.title);
    if (found) {
      if (found.headers.length === 0) found.headers = section.headers;
      found.rows.push(...section.rows);
    } else {
      byTitle.set(section.title, { title: section.title, headers: section.headers, rows: [...section.rows] });
      order.push(section.title);
    }
  }
  return serializeFlexibleTable(order.map((title) => byTitle.get(title)!));
}

// A two-level collapsible format for content that groups into named
// categories, each containing several expandable areas with a flat list of
// items inside (e.g. Research's Thrust Areas: department -> research area ->
// faculty names). Rendered as an accordion rather than a table.
//
// An area can optionally go one level deeper for a department that's really
// a group of sub-departments (e.g. Basic Science containing Mathematics,
// Physics, ...), each with their own areas of work and faculty: start a
// "#### Sub-area Name" line right after the "### Area Name" line it belongs
// under, and its own item lines follow. An area with no "#### " lines under
// it keeps working exactly as before (its items are a flat faculty list).
//
// Format:
//   ## Category Title        (starts a new category)
//   ### Area Name            (starts a new expandable area within the category)
//   Item one                 (plain lines after "### " are that area's items)
//   Item two | /some/path    (an optional "| link" makes the item clickable)
//   ### Sub-department Name  (an area that's really a group of sub-areas)
//   #### Sub-area one        (starts a nested expandable sub-area)
//   Item three
//   #### Sub-area two
//   Item four
export interface AccordionItem {
  label: string;
  href?: string;
}

export interface AccordionSubArea {
  name: string;
  items: AccordionItem[];
}

export interface AccordionArea {
  name: string;
  items: AccordionItem[];
  subAreas?: AccordionSubArea[];
}

export interface AccordionCategory {
  title: string;
  areas: AccordionArea[];
}

export function parseAccordionTable(text: string): AccordionCategory[] {
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const categories: AccordionCategory[] = [];
  let currentCategory: AccordionCategory | null = null;
  let currentArea: AccordionArea | null = null;
  let currentSubArea: AccordionSubArea | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentCategory = { title: line.slice(3).trim(), areas: [] };
      categories.push(currentCategory);
      currentArea = null;
      currentSubArea = null;
      continue;
    }
    if (line.startsWith('### ')) {
      if (!currentCategory) {
        currentCategory = { title: '', areas: [] };
        categories.push(currentCategory);
      }
      currentArea = { name: line.slice(4).trim(), items: [] };
      currentCategory.areas.push(currentArea);
      currentSubArea = null;
      continue;
    }
    if (line.startsWith('#### ')) {
      if (!currentCategory) {
        currentCategory = { title: '', areas: [] };
        categories.push(currentCategory);
      }
      if (!currentArea) {
        currentArea = { name: '', items: [] };
        currentCategory.areas.push(currentArea);
      }
      currentSubArea = { name: line.slice(5).trim(), items: [] };
      if (!currentArea.subAreas) currentArea.subAreas = [];
      currentArea.subAreas.push(currentSubArea);
      continue;
    }
    if (!currentCategory) {
      currentCategory = { title: '', areas: [] };
      categories.push(currentCategory);
    }
    if (!currentArea) {
      currentArea = { name: '', items: [] };
      currentCategory.areas.push(currentArea);
    }
    const pipeIndex = line.indexOf('|');
    const item: AccordionItem = pipeIndex > -1
      ? { label: line.slice(0, pipeIndex).trim(), href: line.slice(pipeIndex + 1).trim() || undefined }
      : { label: line };
    (currentSubArea ?? currentArea).items.push(item);
  }
  return categories;
}

// A richer per-item accordion for content that's more than a flat list per
// area — e.g. Research's Funded Projects, where each project (grouped under
// an Ongoing/Completed category) has several labeled fields (PI, Department,
// Amount, Agency, ...) plus a bulleted Outcome list.
//
// Format:
//   ## Category Title              (optional — starts a new category, e.g. "Ongoing Projects")
//   ### Project Title              (starts a new project)
//   Label: value                   (a labeled field shown under the project)
//   Another Label: value | /link   (an optional "| link" makes the value a download/link)
//   Outcome:                       (optional marker line, itself not shown — bullets below are)
//   - Outcome bullet one
//   - Outcome bullet two
export interface ProjectAccordionField {
  label: string;
  value: string;
  href?: string;
}

export interface ProjectAccordionItem {
  title: string;
  fields: ProjectAccordionField[];
  outcomes: string[];
}

export interface ProjectAccordionCategory {
  title: string;
  projects: ProjectAccordionItem[];
}

export function parseProjectAccordion(text: string): ProjectAccordionCategory[] {
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const categories: ProjectAccordionCategory[] = [];
  let currentCategory: ProjectAccordionCategory | null = null;
  let currentProject: ProjectAccordionItem | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentCategory = { title: line.slice(3).trim(), projects: [] };
      categories.push(currentCategory);
      currentProject = null;
      continue;
    }
    if (line.startsWith('### ')) {
      if (!currentCategory) {
        currentCategory = { title: '', projects: [] };
        categories.push(currentCategory);
      }
      currentProject = { title: line.slice(4).trim(), fields: [], outcomes: [] };
      currentCategory.projects.push(currentProject);
      continue;
    }
    if (!currentCategory) {
      currentCategory = { title: '', projects: [] };
      categories.push(currentCategory);
    }
    if (!currentProject) {
      currentProject = { title: '', fields: [], outcomes: [] };
      currentCategory.projects.push(currentProject);
    }

    if (line.startsWith('- ')) {
      currentProject.outcomes.push(line.slice(2).trim());
      continue;
    }
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const label = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      let href: string | undefined;
      const pipeIndex = value.indexOf('|');
      if (pipeIndex > -1) {
        href = value.slice(pipeIndex + 1).trim() || undefined;
        value = value.slice(0, pipeIndex).trim();
      }
      if (value) currentProject.fields.push({ label, value, href });
    }
  }
  return categories;
}

export function serializeProjectAccordion(categories: ProjectAccordionCategory[]): string {
  return categories.map((cat) => {
    const lines: string[] = [];
    if (cat.title) lines.push(`## ${cat.title}`);
    cat.projects.forEach((p, i) => {
      if (i > 0) lines.push('');
      lines.push(`### ${p.title}`);
      p.fields.forEach((f) => lines.push(f.href ? `${f.label}: ${f.value} | ${f.href}` : `${f.label}: ${f.value}`));
      if (p.outcomes.length > 0) {
        lines.push('Outcome:');
        p.outcomes.forEach((o) => lines.push(`- ${o}`));
      }
    });
    return lines.join('\n');
  }).join('\n\n');
}

// Combines existing Project Accordion text with newly imported text, folding
// any new project into an existing category of the exact same title (so
// re-importing a year's file adds to that year's heading instead of creating
// a duplicate one) and sorting categories with a year in their title (e.g.
// "2024 – Granted") newest-first — categories without a year (e.g. "Ongoing
// Projects") sort to the end, in their original relative order.
export function mergeProjectAccordion(existingText: string, newText: string): string {
  const byTitle = new Map<string, ProjectAccordionCategory>();
  const order: string[] = [];
  for (const cat of [...parseProjectAccordion(existingText), ...parseProjectAccordion(newText)]) {
    const found = byTitle.get(cat.title);
    if (found) {
      found.projects.push(...cat.projects);
    } else {
      byTitle.set(cat.title, { title: cat.title, projects: [...cat.projects] });
      order.push(cat.title);
    }
  }
  const yearOf = (title: string) => {
    const m = title.match(/\b(19|20)\d{2}\b/);
    return m ? parseInt(m[0], 10) : -Infinity;
  };
  const merged = order
    .map((title, i) => ({ cat: byTitle.get(title)!, i }))
    .sort((a, b) => yearOf(b.cat.title) - yearOf(a.cat.title) || a.i - b.i)
    .map(({ cat }) => cat);
  return serializeProjectAccordion(merged);
}

// A flat, optionally-grouped list of named links — for custom sections that
// just need "Label -> URL" (e.g. a list of people's profile links, external
// resources). Deliberately not the richer parseAccordionTable format (that
// one has category -> area -> sub-area nesting this doesn't need) nor
// ProgramsAdmin.tsx's colon-separated hodResearchProfiles mini-format (that
// one has no grouping and no merge function) — this follows the same
// pipe-cell convention as every other format in this file instead.
//
// Format:
//   ## Optional Group Heading   (optional — starts a new named group)
//   Label one | https://example.com/one
//   Label two | https://example.com/two
export interface LinkListItem {
  label: string;
  url: string;
}

export interface LinkListGroup {
  title: string;
  links: LinkListItem[];
}

export function parseLinkList(text: string): LinkListGroup[] {
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const groups: LinkListGroup[] = [];
  let current: LinkListGroup | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      current = { title: line.slice(3).trim(), links: [] };
      groups.push(current);
      continue;
    }
    if (!current) {
      current = { title: '', links: [] };
      groups.push(current);
    }
    const pipeIndex = line.indexOf('|');
    const label = (pipeIndex > -1 ? line.slice(0, pipeIndex) : line).trim();
    const url = (pipeIndex > -1 ? line.slice(pipeIndex + 1) : '').trim();
    if (label && url) current.links.push({ label, url });
  }
  return groups;
}

export function serializeLinkList(groups: LinkListGroup[]): string {
  return groups.map((g) => {
    const lines: string[] = [];
    if (g.title) lines.push(`## ${g.title}`);
    g.links.forEach((l) => lines.push(`${l.label} | ${l.url}`));
    return lines.join('\n');
  }).join('\n\n');
}

// Same "import appends, never replaces" merge as mergeFlexibleTable /
// mergeProjectAccordion above — folds new links into an existing group of
// the exact same title instead of duplicating the heading.
export function mergeLinkList(existingText: string, newText: string): string {
  const byTitle = new Map<string, LinkListGroup>();
  const order: string[] = [];
  for (const group of [...parseLinkList(existingText), ...parseLinkList(newText)]) {
    const found = byTitle.get(group.title);
    if (found) {
      found.links.push(...group.links);
    } else {
      byTitle.set(group.title, { title: group.title, links: [...group.links] });
      order.push(group.title);
    }
  }
  return serializeLinkList(order.map((title) => byTitle.get(title)!));
}
