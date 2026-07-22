// Parses a simple text format for editable member/roster tables, so an admin
// can manage a whole table (including multiple named sections, e.g. one per
// department) from a single textarea instead of a spreadsheet-style UI.
//
// Format:
//   ## Section Title          (optional — starts a new named section)
//   Name | Role | Notes       (Notes is optional per row)
//
// Rows before any "## " line go into a single unnamed section.
export interface StructuredTableRow {
  name: string;
  role: string;
  notes: string;
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
    const row: StructuredTableRow = { name: parts[0] || '', role: parts[1] || '', notes: parts[2] || '' };
    if (!current) {
      current = { title: '', rows: [] };
      sections.push(current);
    }
    current.rows.push(row);
  }
  return sections;
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

// A two-level collapsible format for content that groups into named
// categories, each containing several expandable areas with a flat list of
// items inside (e.g. Research's Thrust Areas: department -> research area ->
// faculty names). Rendered as an accordion rather than a table.
//
// Format:
//   ## Category Title      (starts a new category)
//   ### Area Name          (starts a new expandable area within the category)
//   Item one               (plain lines after "### " are that area's items)
//   Item two | /some/path  (an optional "| link" makes the item clickable)
export interface AccordionItem {
  label: string;
  href?: string;
}

export interface AccordionArea {
  name: string;
  items: AccordionItem[];
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

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentCategory = { title: line.slice(3).trim(), areas: [] };
      categories.push(currentCategory);
      currentArea = null;
      continue;
    }
    if (line.startsWith('### ')) {
      if (!currentCategory) {
        currentCategory = { title: '', areas: [] };
        categories.push(currentCategory);
      }
      currentArea = { name: line.slice(4).trim(), items: [] };
      currentCategory.areas.push(currentArea);
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
    if (pipeIndex > -1) {
      currentArea.items.push({ label: line.slice(0, pipeIndex).trim(), href: line.slice(pipeIndex + 1).trim() || undefined });
    } else {
      currentArea.items.push({ label: line });
    }
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
