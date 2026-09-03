import './RouteFallback.css';

// Full-screen loading takeover shown by every router Suspense boundary while
// a page's code-split JS chunk downloads, and by the few pages that also
// wait on a Firestore doc to resolve before they know whether to render
// content or redirect (see the .reveal/Firestore gotcha in CLAUDE.md — this
// screen intentionally has no scroll-reveal wiring of its own). One shared
// component so the loading experience — and any future tweak to it — stays
// identical everywhere instead of drifting across call sites.
export default function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__sr-only">Loading…</span>
      <div className="route-fallback__aurora" aria-hidden="true" />
      <div className="route-fallback__content" aria-hidden="true">
        <img src="/images/logo.png" alt="" className="route-fallback__logo" />
        <p className="route-fallback__tagline">Vishnu Women&rsquo;s University</p>
        <div className="route-fallback__dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
