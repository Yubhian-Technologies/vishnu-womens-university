import type { CSSProperties } from 'react';

export type BodyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

// Every plain line is its own paragraph — no blank-line-between-paragraphs
// rule to get right (that convention proved too easy to get wrong in
// practice: admins kept typing one point per line with no blank line,
// expecting each to render separately, and instead got everything joined
// into one block). A "- " prefix still groups consecutive lines into a
// bullet list; blank lines are optional visual spacing only, no longer
// required to separate paragraphs.
export function parseBodyContent(text: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of (text || '').split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith('- ')) {
      listItems.push(line.slice(2).trim());
      continue;
    }
    flushList();
    blocks.push({ type: 'paragraph', text: line });
  }

  flushList();
  return blocks;
}

const LINK_PATTERN = /^\[([^\]]+)\]\(([^)]+)\)$/;
// Links to a document file (as opposed to another page) download straight
// to the visitor's device instead of opening in a new tab.
const DOWNLOADABLE_FILE_PATTERN = /\.(pdf|docx?|xlsx?|pptx?|zip)$/i;

function renderInlineText(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(LINK_PATTERN);
    if (linkMatch) {
      const href = linkMatch[2];
      const isDownload = DOWNLOADABLE_FILE_PATTERN.test(href);
      return (
        <a
          key={index}
          href={href}
          {...(isDownload ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
          style={{ color: 'var(--color-primary)', fontWeight: 600 }}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// Renders parseBodyContent's blocks — shared by every admin-editable
// Intro/About/Overview-style text field on the site, so all of them support
// the same blank-line-separated paragraphs / "- " bullet lists / **bold** /
// [link](url) syntax instead of being dumped into one unbroken <p>.
export default function BodyBlocks({ blocks, paragraphStyle }: { blocks: BodyBlock[]; paragraphStyle: CSSProperties }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <ul key={index} style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem' }}>
              {block.items.map((entry, itemIndex) => (
                <li key={itemIndex} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.7rem' }}>
                  <span aria-hidden="true" style={{ fontSize: '1.4em', lineHeight: 1, flexShrink: 0 }}>•</span>
                  <span style={paragraphStyle}>{renderInlineText(entry)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} style={{ ...paragraphStyle, margin: '0 0 1rem' }}>
            {renderInlineText(block.text)}
          </p>
        );
      })}
    </>
  );
}
