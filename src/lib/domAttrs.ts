// React 18.3 (the version installed here) doesn't yet support the camelCase
// `fetchPriority` JSX prop — that was added in React 19. Passing it as
// `fetchPriority="high"` triggers "Warning: React does not recognize the
// `fetchPriority` prop on a DOM element" and silently drops it, losing the
// actual browser hint. Spreading this lowercase-keyed object instead sets
// the real HTML attribute directly (React passes through any lowercase,
// hyphen-free prop name it doesn't specially recognize as a plain
// attribute) — present in the initial render, unlike setting it via a
// ref + useEffect after mount, which would arrive too late for the
// browser's preload scanner to use it for an above-the-fold LCP image.
export function fetchPriorityAttr(value: 'high' | 'low' | 'auto'): Record<string, string> {
  return { fetchpriority: value };
}
