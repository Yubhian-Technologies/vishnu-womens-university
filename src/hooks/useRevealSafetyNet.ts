import { useEffect } from 'react';

const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

// Page-level observers scan once on mount and miss reveal elements rendered
// later (e.g. after Firestore data arrives). This picks up any that appear.
export function useRevealSafetyNet() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
          io.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (!el.classList.contains('revealed')) io.observe(el);
      });
    };
    observeAll(document);

    const mo = new MutationObserver((records) => {
      records.forEach((r) =>
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches(SELECTOR) && !n.classList.contains('revealed')) io.observe(n);
          observeAll(n);
        })
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}
