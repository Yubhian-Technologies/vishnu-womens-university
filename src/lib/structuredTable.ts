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
//   Item two
export interface AccordionArea {
  name: string;
  items: string[];
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
    currentArea.items.push(line);
  }
  return categories;
}
