import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { smoothScrollTo } from '../lib/smoothScroll';

// React Router's <Link> (used by the top Header nav's dropdown menus, which link
// to paths like "/campus#library") only updates the URL — unlike a native
// <a href="#...">, it does not trigger the browser's built-in scroll-to-fragment
// behavior. This restores that behavior for SPA navigation.
export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) smoothScrollTo(el);
    // location.pathname (not just .hash) is a dependency too: switching between
    // programs on the same detail page navigates to the same "#program-toggle"
    // hash each time (e.g. "/academics/cse" -> "/academics/cyber-security", both
    // "#program-toggle"), and a same-string hash doesn't retrigger this effect
    // on its own — leaving the freshly re-mounted page's scroll position
    // wherever it happened to land instead of back at the target section.
  }, [location.hash, location.pathname]);
}
