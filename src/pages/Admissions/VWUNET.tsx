import { useEffect } from 'react';
import PageHero from '../../components/PageHero/PageHero';

/**
 * VWUNET — Vishnu Women's University National Entrance Test.
 * Placeholder page linked from the banner on /admission-procedure.
 * Content is not ready yet, so it shows an "under development" title only.
 */
export default function VWUNET() {
  useEffect(() => {
    document.title = "VWUNET | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      <PageHero
        page="vwunet"
        defaultTitle="VWUNET"
        defaultSubtitle="Vishnu Women's University National Entrance Test"
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Admissions', to: '/admissions' },
          { label: 'VWUNET' },
        ]}
        hideCta={true}
      />

      <section
        className="section bg-white"
        style={{ minHeight: '55vh', display: 'flex', alignItems: 'center' }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <h2
            className="section-title"
            style={{ fontSize: 'clamp(2.25rem, 7vw, 4rem)', margin: 0 }}
          >
            Section Under Development
          </h2>
        </div>
      </section>
    </main>
  );
}
