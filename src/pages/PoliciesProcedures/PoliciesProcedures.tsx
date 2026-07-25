import { useEffect } from 'react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { DEFAULT_POLICIES, type PolicyDoc } from '../Admin/sections/PoliciesAdmin';
import '../detail-layout.css';

export default function PoliciesProcedures() {
  useEffect(() => {
    document.title = 'Policies & Procedures | Vishnu Womens University';
  }, []);

  const { docs: livePolicies } = useOrderedCollection<PolicyDoc>('institutionalPolicies', 'order');
  const policies = livePolicies.length > 0 ? livePolicies : (DEFAULT_POLICIES as PolicyDoc[]);

  return (
    <main className="page-wrapper">
      <PageHero
        page="policies-procedures"
        defaultImage="https://images.unsplash.com/photo-1568667256549-094345857637?w=1920&q=80"
        defaultTitle="Policies & Procedures"
        defaultSubtitle="A structured framework for governance, academics, research, and campus sustainability at VWU."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Policies & Procedures' }]}
      />

      <section className="section bg-white">
        <div className="container" style={{ maxWidth: 900 }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
            Vishnu Womens University has established a set of well-defined policies and standard operating procedures
            to ensure effective governance, academic excellence, transparency, and continuous
            institutional development.
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-8)' }}>
            These policies provide a structured framework for teaching–learning, research,
            administration, student support, and campus sustainability, aligning with the
            guidelines of statutory bodies such as AICTE and UGC.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {policies.map((p) => (
              <div key={p.title} style={{ borderBottom: '1px solid var(--color-light-gray)', paddingBottom: 'var(--space-5)' }}>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontWeight: 700, marginBottom: p.description ? 'var(--space-2)' : 0 }}>
                  {p.title}
                  {' – '}
                  {p.fileUrl ? (
                    <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" download style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
                      View
                    </a>
                  ) : (
                    <span style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>View</span>
                  )}
                </p>
                {p.description && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.65 }}>
                    {p.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
