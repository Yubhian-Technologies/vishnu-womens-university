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
  }, [location.hash]);
}
