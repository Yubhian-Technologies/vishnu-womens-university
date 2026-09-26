import type { ReactNode } from 'react';

const BOLD_SPLIT_RE = /(\*\*[\s\S]+?\*\*)/g;

function isBoldPart(part: string): boolean {
  return part.length > 4 && part.startsWith('**') && part.endsWith('**');
}

/** Splits admin-entered text on **double-asterisk** markers — returns
 *  [text, isBold] segments. Shared by renderBold and linkify so both treat
 *  the markers identically. */
export function splitBold(text: string): { text: string; bold: boolean }[] {
  return text
    .split(BOLD_SPLIT_RE)
    .filter((part) => part !== '')
    .map((part) => (isBoldPart(part) ? { text: part.slice(2, -2), bold: true } : { text: part, bold: false }));
}

/** Renders any **text** wrapped in double asterisks as inline bold, so an
 *  admin can bold a phrase in the middle of a paragraph from any admin text
 *  field (e.g. "Admissions open on **June 1st** for all programmes").
 *  Anything that isn't a string, or has no markers, is returned untouched. */
export function renderBold(text: ReactNode): ReactNode {
  if (typeof text !== 'string' || !text.includes('**')) return text;
  const segments = splitBold(text);
  if (!segments.some((s) => s.bold)) return text;
  return segments.map((s, i) => (s.bold ? <strong key={i}>{s.text}</strong> : s.text));
}
