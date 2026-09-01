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

import { generateSectionId, type CustomSection } from './customSections';
import { serializeFlexibleTable } from './structuredTable';

export interface FacultyFact {
  label: string;
  value: string;
}

export type SectionBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  // `rows` wraps each row in an object (not a bare string[]) because
  // Firestore rejects arrays nested directly inside arrays — a plain
  // string[][] fails on save with "Nested arrays are not supported".
  | { type: 'table'; headers: string[]; rows: { cells: string[] }[] };

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
        blocks.push({ type: 'table', headers, rows: body.map((cells) => ({ cells })) });
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
      return ['TABLE:', b.headers.join(' | '), ...b.rows.map((r) => r.cells.join(' | '))].join('\n');
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

// One-time upgrade path: turns a faculty member's old plain-text-authored
// `sections` (blocks parsed from the "## Title / TABLE: / - bullet" format
// above) into the richer, structured `CustomSection[]` shape used everywhere
// else in the admin (Programs, Differentiators — see lib/customSections.ts
// and CustomSectionEditor.tsx). Run once, automatically, by FacultyAdmin's
// startEdit() whenever a record has old-format `sections` but no
// `customSections` yet, so opening a faculty member for editing upgrades
// their profile to the same editor everyone else gets — sub-sections, real
// tables, lists of links, uploaded files — without losing any existing
// content. The common case (a section holding exactly one block) maps
// directly to the matching content type; a section mixing multiple blocks
// (rare — most profiles use one kind of content per section) keeps its
// first text/list block as the section's own content and pushes every other
// block in as its own labeled sub-section, so nothing is dropped either way.
export function facultySectionsToCustomSections(sections: FacultySection[]): CustomSection[] {
  const out: CustomSection[] = [];
  const tableText = (b: Extract<SectionBlock, { type: 'table' }>) =>
    serializeFlexibleTable([{ title: '', headers: b.headers, rows: b.rows.map((r) => r.cells) }]);

  sections.forEach((s) => {
    const blocks = getSectionBlocks(s);
    const id = generateSectionId(s.title, out);

    if (blocks.length <= 1) {
      const b = blocks[0];
      const base: CustomSection = { id, label: s.title, contentType: 'text', textContent: '' };
      if (!b) { out.push(base); return; }
      if (b.type === 'table') out.push({ ...base, contentType: 'table', tableText: tableText(b) });
      else if (b.type === 'bullets') out.push({ ...base, contentType: 'list', listText: b.items.join('\n') });
      else out.push({ ...base, contentType: 'text', textContent: b.text });
      return;
    }

    const parent: CustomSection = { id, label: s.title, contentType: 'text', textContent: '' };
    const subs: CustomSection[] = [];
    let ownContentUsed = false;
    blocks.forEach((b) => {
      if (!ownContentUsed && b.type !== 'table') {
        if (b.type === 'bullets') { parent.contentType = 'list'; parent.listText = b.items.join('\n'); }
        else { parent.contentType = 'text'; parent.textContent = b.text; }
        ownContentUsed = true;
        return;
      }
      const subId = generateSectionId(b.type === 'table' ? 'Table' : b.type === 'bullets' ? 'List' : 'Text', [...out, parent, ...subs]);
      if (b.type === 'table') subs.push({ id: subId, label: 'Table', contentType: 'table', tableText: tableText(b) });
      else if (b.type === 'bullets') subs.push({ id: subId, label: 'List', contentType: 'list', listText: b.items.join('\n') });
      else subs.push({ id: subId, label: 'Text', contentType: 'text', textContent: b.text });
    });
    if (subs.length > 0) parent.subSections = subs;
    out.push(parent);
  });

  return out;
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
