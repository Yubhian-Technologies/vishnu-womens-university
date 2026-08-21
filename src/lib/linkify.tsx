import type { ReactNode } from 'react';

const URL_RE = /(https?:\/\/[^\s"'<>)]+)/g;

/** Wraps any http(s):// URL found in plain text in a clickable link,
 *  leaving everything else untouched. Used for admin-entered free-text
 *  (faculty profile facts/sections, etc.) where an editor may paste a URL
 *  directly into a sentence rather than through a dedicated link field. */
export function linkify(text: string): ReactNode {
  // split() with a capturing group interleaves the URL matches themselves
  // into the result array — those are exactly the parts starting with
  // "http", so no separate (stateful, error-prone) regex test is needed.
  const parts = text.split(URL_RE);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith('http://') || part.startsWith('https://')
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, wordBreak: 'break-word' }}>{part}</a>
      : <span key={i}>{part}</span>
  );
}
