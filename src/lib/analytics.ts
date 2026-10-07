const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

// Loads gtag.js and configures GA4. Safe to call once; a missing
// VITE_GA_MEASUREMENT_ID (e.g. local dev without it set) just no-ops,
// matching how src/lib/firebase.ts handles a missing config.
export function initAnalytics() {
  if (initialized || !GA_MEASUREMENT_ID || typeof document === 'undefined') return;
  initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  // SPA route changes are tracked manually via trackPageview, not gtag's
  // own page_location auto-detection (which only fires on real page loads).
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageview(path: string, title?: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}
