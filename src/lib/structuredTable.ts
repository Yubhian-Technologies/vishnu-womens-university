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
