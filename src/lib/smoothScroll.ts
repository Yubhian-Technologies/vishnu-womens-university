import Lenis from 'lenis';

// Module-level singleton so any component (not just the one that creates
// it) can drive scroll position through Lenis's virtual scroll instead of
// the native one — calling native `scrollIntoView`/`window.scrollTo` while
// Lenis's own rAF loop is also animating the same scroll position causes
// the two to fight, producing visible jitter.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Scroll to a target, routed through Lenis when it's active (see above for
 * why) and falling back to native scroll when Lenis is off (reduced-motion
 * users, or before it's finished mounting).
 */
export function smoothScrollTo(
  target: string | number | HTMLElement,
  options?: { offset?: number; immediate?: boolean }
) {
  if (instance) {
    instance.scrollTo(target, { offset: options?.offset, immediate: options?.immediate });
    return;
  }
  const behavior: ScrollBehavior = options?.immediate ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior, block: 'start' });
  }
}
