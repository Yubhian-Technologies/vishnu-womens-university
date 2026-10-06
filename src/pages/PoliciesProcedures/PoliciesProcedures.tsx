import { useEffect } from 'react';
import PageHero from '../../components/PageHero/PageHero';
import PoliciesListSection from './PoliciesListSection';
import { useDocument } from '../../hooks/useDocument';
import { DEFAULT_POLICIES_INTRO, POLICIES_INTRO_COLLECTION, POLICIES_INTRO_DOC_ID, type PoliciesIntroDoc } from '../Admin/sections/PoliciesIntroAdmin';
import '../detail-layout.css';

export default function PoliciesProcedures() {
  const { data: remoteIntro } = useDocument<PoliciesIntroDoc>(POLICIES_INTRO_COLLECTION, POLICIES_INTRO_DOC_ID);
  const intro = remoteIntro?.paragraphs?.length ? remoteIntro.paragraphs : DEFAULT_POLICIES_INTRO.paragraphs;

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
          {intro.filter(Boolean).map((p, i, arr) => (
            <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: i === arr.length - 1 ? 'var(--space-8)' : 'var(--space-5)' }}>{p}</p>
          ))}

          <PoliciesListSection />
        </div>
      </section>
    </main>
  );
}
