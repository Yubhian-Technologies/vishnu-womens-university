import { useActiveLandingPage } from '../../hooks/useActiveLandingPage';
import { LANDING_PAGE_REGISTRY, DEFAULT_LANDING_PAGE_ID } from '../../lib/landingPageRegistry';

// Renders whichever landing page is currently marked active in Firestore
// (see /admin → Landing Pages), falling back to the original homepage while
// loading, on error, or before any page has ever been activated. This is
// the only thing standing in for `<Home />` on the "/" route — swapping the
// live page never requires a code change or deploy, and adding a future
// landing page never requires touching this file (see landingPageRegistry.ts).
export default function LandingPageLoader() {
  const { activeId } = useActiveLandingPage();
  const entry =
    LANDING_PAGE_REGISTRY.find((e) => e.id === activeId) ??
    LANDING_PAGE_REGISTRY.find((e) => e.id === DEFAULT_LANDING_PAGE_ID) ??
    LANDING_PAGE_REGISTRY[0];
  const Component = entry.component;
  return <Component />;
}
