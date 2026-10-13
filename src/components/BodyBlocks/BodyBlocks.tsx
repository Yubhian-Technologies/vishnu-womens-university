import type { CSSProperties } from 'react';
import { linkify } from '../../lib/linkify';

export type BodyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

// Matches lines starting with bullet symbols (- , * , • , – , — ) or numbered points (1. , 1) )
const BULLET_PATTERN = /^([•]\s*|[-*–—]\s+|\d+[.)]\s+)(.+)$/;

export function parseBodyContent(text: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  let listItems: string[] = [];
  let paragraphLines: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') });
      paragraphLines = [];
    }
  };

  for (const rawLine of (text || '').split('\n')) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }
    const bulletMatch = trimmed.match(BULLET_PATTERN);
    if (bulletMatch) {
      flushParagraph();
      listItems.push(bulletMatch[2].trim());
      continue;
    }
    flushList();
    paragraphLines.push(trimmed);
  }

  flushList();
  flushParagraph();
  return blocks;
}

const LINK_PATTERN = /^\[([^\]]+)\]\(([^)]+)\)$/;
// Links to a document file (as opposed to another page) download straight
// to the visitor's device instead of opening in a new tab.
const DOWNLOADABLE_FILE_PATTERN = /\.(pdf|docx?|xlsx?|pptx?|zip)$/i;

function renderInlineText(text: string, strongStyle?: CSSProperties) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong
          key={index}
          style={strongStyle ?? { fontWeight: 700 }}
        >
          {linkify(part.slice(2, -2))}
        </strong>
      );
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
    return <span key={index}>{linkify(part)}</span>;
  });
}

// Renders parseBodyContent's blocks — shared by every admin-editable
// Intro/About/Overview-style text field on the site, so all of them support
// the same blank-line-separated paragraphs / bullet lists / **bold** /
// [link](url) syntax instead of being dumped into one unbroken <p>.
export default function BodyBlocks({
  blocks,
  paragraphStyle,
  strongStyle,
  listStyle,
}: {
  blocks: BodyBlock[];
  paragraphStyle?: CSSProperties;
  strongStyle?: CSSProperties;
  listStyle?: CSSProperties;
}) {
  return (
    <>
      {blocks.map((block, index) => {
        const isLast = index === blocks.length - 1;
        if (block.type === 'list') {
          return (
            <ul key={index} style={{ listStyle: 'none', padding: 0, margin: isLast ? 0 : '0 0 1rem', ...listStyle }}>
              {block.items.map((entry, itemIndex) => (
                <li
                  key={itemIndex}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    marginBottom: itemIndex === block.items.length - 1 ? 0 : '0.6rem',
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: '1.2em', lineHeight: 1.4, flexShrink: 0, color: 'currentColor' }}>•</span>
                  <span style={{ ...paragraphStyle, whiteSpace: 'pre-line' }}>{renderInlineText(entry, strongStyle)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={index}
            style={{
              lineHeight: 1.8,
              ...paragraphStyle,
              whiteSpace: 'pre-line',
              margin: isLast ? 0 : (paragraphStyle?.margin ?? '0 0 1rem'),
            }}
          >
            {renderInlineText(block.text, strongStyle)}
          </p>
        );
      })}
    </>
  );
}
