// Parses a detail page's "About" text field into heading/paragraph/list
// blocks, so a single Firestore string field can hold a sub-heading plus a
// bulleted "Bold Label: description" (or plain bullet) list, instead of
// needing dedicated admin UI per block type. Shared by ResearchDetail.tsx
// and GovernanceDetail.tsx.
//
// Format:
//   ## Sub-heading            (optional — starts a new heading block)
//   Plain paragraph text.     (consecutive non-blank, non-list lines join into one paragraph)
//   - Bullet text              ("Bold Label: rest" renders the label in bold)
export type AboutBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

export function parseAboutContent(text: string): AboutBlock[] {
  const blocks: AboutBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
      paragraphLines = [];
    }
  };
  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of (text || '').split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraphLines.push(line);
  }
  flushParagraph();
  flushList();
  return blocks;
}
