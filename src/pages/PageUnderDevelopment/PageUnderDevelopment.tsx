import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Construction, Clock3 } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import './PageUnderDevelopment.css';

export interface PageUnderDevelopmentProps {
  /** The specific page being built, e.g. "Academic Council". Falls back to a generic message when omitted. */
  pageTitle?: string;
  /** Section to offer as the "back" destination, e.g. { label: 'Governance', path: '/governance' }. */
  parent?: { label: string; path: string };
}

interface PageUnderDevelopmentNavState {
  pageTitle?: string;
  parent?: { label: string; path: string };
}

// Shared placeholder shown for nav destinations whose content isn't built
// yet — used as a self-contained page (see /under-development in App.tsx)
// and embedded inline by GovernanceDetail for governance/committee/IQAC
// slugs that don't have a Firestore item yet, so a visitor always lands on
// something purposeful instead of a dead link or a silent redirect.
export default function PageUnderDevelopment(props: PageUnderDevelopmentProps) {
  const location = useLocation();
  // A navbar link for a still-"Greyed out" item (Admin → Header Menu) routes
  // straight here and hands off the item's own label/section via router
  // state instead of a prop, since Header.tsx doesn't render this component
  // directly — explicit props (as GovernanceDetail passes) still win.
  const navState = (location.state || null) as PageUnderDevelopmentNavState | null;
  const pageTitle = props.pageTitle ?? navState?.pageTitle;

  // Hides the shared site footer for as long as this placeholder is the
  // thing on screen — it fits a "still building this" page better than the
  // full sitemap footer, and this works whether the page is reached directly
  // (/under-development) or rendered inline (e.g. GovernanceDetail's
  // not-yet-populated slugs), without either of those callers needing to
  // know about the footer at all.
  useEffect(() => {
    document.body.classList.add('hide-site-footer');
    return () => { document.body.classList.remove('hide-site-footer'); };
  }, []);

  return (
    <main className="page-wrapper pud-page">
      <SEO
        title="Page Under Development"
        description="This page is currently being built. Please check back soon."
        noindex
      />
      <section className="pud-hero">
        <div className="container">
          <div className="pud-card">
            <div className="pud-icon-ring" aria-hidden="true">
              <div className="pud-icon-ring-pulse" />
              <Construction size={40} strokeWidth={1.75} className="pud-icon" />
            </div>

            <span className="pud-badge">
              <Clock3 size={13} strokeWidth={2.25} />
              Coming Soon
            </span>

            {pageTitle && (
              <h1 className="pud-page-name">{pageTitle}</h1>
            )}

            <p className="pud-status-text">Page Under Development</p>

            <div className="pud-progress" role="img" aria-label="Page in progress">
              <span className="pud-progress-fill" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
