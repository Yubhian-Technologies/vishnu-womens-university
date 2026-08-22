import { useEffect } from 'react';
import PageHero from '../../components/PageHero/PageHero';
import PoliciesListSection from './PoliciesListSection';
import '../detail-layout.css';

export default function PoliciesProcedures() {
  useEffect(() => {
    document.title = "Policies & Procedures | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      <PageHero
        page="policies-procedures"
        defaultTitle="Policies & Procedures"
        defaultSubtitle="A structured framework for governance, academics, research, and campus sustainability at VWU."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Policies & Procedures' }]}
      />

      <section className="section bg-white">
        <div className="container" style={{ maxWidth: 900 }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
            Vishnu Women's University has established a set of well-defined policies and standard operating procedures
            to ensure effective governance, academic excellence, transparency, and continuous
            institutional development.
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-8)' }}>
            These policies provide a structured framework for teaching–learning, research,
            administration, student support, and campus sustainability, aligning with the
            guidelines of statutory bodies such as AICTE and UGC.
          </p>

          <PoliciesListSection />
        </div>
      </section>
    </main>
  );
}
