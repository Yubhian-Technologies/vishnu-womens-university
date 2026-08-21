// Shared "Profile Facts" / "Profile Sections" data model and plain-text
// admin encoding for faculty profiles (src/pages/Admin/sections/FacultyAdmin.tsx),
// consumed by every page that renders a faculty member's full profile
// (FacultyProfile.tsx, FreshmanEngineering.tsx's About HOD tab).
//
// A section's body is authored as plain text and parsed into a small set of
// blocks so a non-technical admin can mix paragraphs, bullet lists, and
// tables under one heading without a rich-text editor:
//   - consecutive non-blank lines with no "- " prefix join into one paragraph
//   - a blank line starts a new paragraph/block
//   - a line starting with "- " starts/continues a bullet list
//   - a "TABLE:" line starts a table: the next line is the header row, every
//     following pipe-separated line is a data row, until a blank line

export interface FacultyFact {
  label: string;
  value: string;
}

export type SectionBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface FacultySection {
  title: string;
  blocks: SectionBlock[];
  /** Legacy shape (one bullet per array entry) some existing Firestore docs
   *  still have — normalize with getSectionBlocks() before rendering. */
  items?: string[];
}

/** Reads either the current `blocks` shape or the legacy `items` (plain
 *  bullet list) shape, so old faculty records keep rendering unchanged. */
export function getSectionBlocks(section: FacultySection): SectionBlock[] {
  if (section.blocks && section.blocks.length > 0) return section.blocks;
  if (section.items && section.items.length > 0) return [{ type: 'bullets', items: section.items }];
  return [];
}

export function factsToText(facts: FacultyFact[] = []): string {
  return facts.map((f) => `${f.label} | ${f.value}`).join('\n');
}

export function textToFacts(text: string): FacultyFact[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [label = '', value = ''] = line.split('|').map((s) => s.trim());
    return { label, value };
  });
}

function parseSectionBody(text: string): SectionBlock[] {
  const lines = text.split('\n');
  const blocks: SectionBlock[] = [];
  let paragraphBuf: string[] = [];
  let bulletBuf: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuf.length) {
      blocks.push({ type: 'paragraph', text: paragraphBuf.join(' ') });
      paragraphBuf = [];
    }
  };
  const flushBullets = () => {
    if (bulletBuf.length) {
      blocks.push({ type: 'bullets', items: bulletBuf });
      bulletBuf = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { flushParagraph(); flushBullets(); i++; continue; }

    if (/^table:?$/i.test(line)) {
      flushParagraph(); flushBullets();
      i++;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map((c) => c.trim()));
        i++;
      }
      if (rows.length > 0) {
        const [headers, ...body] = rows;
        blocks.push({ type: 'table', headers, rows: body });
      }
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      bulletBuf.push(line.slice(2).trim());
      i++;
      continue;
    }

    flushBullets();
    paragraphBuf.push(line);
    i++;
  }
  flushParagraph();
  flushBullets();
  return blocks;
}

function blocksToText(blocks: SectionBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === 'paragraph') return b.text;
      if (b.type === 'bullets') return b.items.map((it) => `- ${it}`).join('\n');
      return ['TABLE:', b.headers.join(' | '), ...b.rows.map((r) => r.join(' | '))].join('\n');
    })
    .join('\n\n');
}

export function sectionsToText(sections: FacultySection[] = []): string {
  return sections
    .map((s) => {
      const body = blocksToText(getSectionBlocks(s));
      return body ? `## ${s.title}\n${body}` : `## ${s.title}`;
    })
    .join('\n\n');
}

export function textToSections(text: string): FacultySection[] {
  const sections: FacultySection[] = [];
  let currentTitle: string | null = null;
  let bodyLines: string[] = [];

  const pushCurrent = () => {
    if (currentTitle !== null) {
      sections.push({ title: currentTitle, blocks: parseSectionBody(bodyLines.join('\n')) });
    }
  };

  for (const raw of text.split('\n')) {
    if (raw.trim().startsWith('## ')) {
      pushCurrent();
      currentTitle = raw.trim().slice(3).trim();
      bodyLines = [];
    } else if (currentTitle !== null) {
      bodyLines.push(raw);
    }
  }
  pushCurrent();
  return sections;
}
