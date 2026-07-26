import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { setLenis } from '../../lib/smoothScroll';

/**
 * Mounted once at the app root. Gives the whole site inertia/momentum
 * scrolling instead of the browser's default 1:1 scroll — wheel/touch
 * input is eased toward the target position over a short duration rather
 * than jumping there instantly.
 *
 * Skipped entirely under prefers-reduced-motion: users who've asked their
 * OS for less motion get plain native scroll, no easing layered on top.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      // Catches plain <a href="#id"> clicks we don't route through
      // smoothScrollTo ourselves, so they ease through Lenis too instead
      // of falling back to an instant native jump.
      anchors: true,
    });
    setLenis(lenis);

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
