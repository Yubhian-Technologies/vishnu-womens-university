import type { ReactNode } from 'react';
import { ExternalLink, Mail } from 'lucide-react';

const URL_RE = /(https?:\/\/[^\s"'<>)]+)/g;
const EMAIL_RE = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
const EMAIL_FULL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const LINK_STYLE = { color: 'var(--color-primary)', fontWeight: 600, wordBreak: 'break-word' as const };
// Small trailing icon so an auto-detected link reads as clickable at a
// glance instead of relying on color alone — matches the icon already used
// next to inline links elsewhere (e.g. "Research Profiles" links).
const ICON_STYLE = { display: 'inline', verticalAlign: '-0.1em', marginLeft: '0.3em' };

// Known academic/profile hosts get a short, readable label instead of the
// raw URL as the link text (e.g. a Scopus author link shows "Scopus
// Profile", not the full https://www.scopus.com/authid/detail.uri?... —
// there's no admin-provided label to fall back on here, since this is a
// bare URL typed straight into a sentence, not the dedicated Links content
// type's own label+URL fields). Anything not in this list still gets a big
// readability win by falling back to just its hostname rather than the
// full URL with path/query.
const KNOWN_LINK_LABELS: { test: RegExp; label: string }[] = [
  { test: /(^|\.)orcid\.org$/, label: 'ORCID Profile' },
  { test: /(^|\.)scopus\.com$/, label: 'Scopus Profile' },
  { test: /(^|\.)scholar\.google\.com$/, label: 'Google Scholar Profile' },
  { test: /(^|\.)researchgate\.net$/, label: 'ResearchGate Profile' },
  { test: /(^|\.)linkedin\.com$/, label: 'LinkedIn Profile' },
  { test: /(^|\.)(publons|webofscience)\.com$/, label: 'Web of Science Profile' },
  { test: /(^|\.)vidwan\.inflibnet\.ac\.in$/, label: 'Vidwan Profile' },
  { test: /(^|\.)(drive|docs)\.google\.com$/, label: 'View Document' },
];

function friendlyLinkLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return KNOWN_LINK_LABELS.find((k) => k.test.test(host))?.label ?? host;
  } catch {
    return url;
  }
}

// Second pass over a chunk already known to contain no URL — finds a bare
// email address (e.g. "Email: praju@svecw.edu.in") and wraps just that part
// in a mailto: link.
function linkifyEmails(text: string, keyPrefix: string): ReactNode {
  const parts = text.split(EMAIL_RE);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    EMAIL_FULL_RE.test(part)
      ? (
        <a key={`${keyPrefix}-${i}`} href={`mailto:${part}`} style={LINK_STYLE}>
          {part}<Mail size={12} strokeWidth={2.2} style={ICON_STYLE} aria-hidden="true" />
        </a>
      )
      : part
  );
}

/** Wraps any http(s):// URL or bare email address found in plain text in a
 *  clickable link (mailto: for an email), leaving everything else
 *  untouched. Used for admin-entered free-text (faculty profile facts/
 *  sections, Custom Section text/list content, etc.) where an editor may
 *  paste a URL or email directly into a sentence — e.g. a faculty member's
 *  own profile ID links or contact email inside a Profile Section — rather
 *  than through a dedicated link field. A URL's visible text is a short
 *  friendly label (see friendlyLinkLabel), not the raw URL itself — pasting
 *  a long Scopus/ORCID/Drive link shouldn't dump that whole URL onto the
 *  page as text. */
export function linkify(text: string): ReactNode {
  // split() with a capturing group interleaves the URL matches themselves
  // into the result array — those are exactly the parts starting with
  // "http", so no separate (stateful, error-prone) regex test is needed.
  const parts = text.split(URL_RE);
  if (parts.length === 1) return linkifyEmails(text, 'e');
  return parts.map((part, i) =>
    part.startsWith('http://') || part.startsWith('https://')
      ? (
        <a key={`u-${i}`} href={part} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>
          {friendlyLinkLabel(part)}<ExternalLink size={12} strokeWidth={2.2} style={ICON_STYLE} aria-hidden="true" />
        </a>
      )
      : <span key={`u-${i}`}>{linkifyEmails(part, `u-${i}-e`)}</span>
  );
}
