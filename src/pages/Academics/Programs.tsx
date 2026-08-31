import { useEffect } from 'react';
import PageHero from '../../components/PageHero/PageHero';
import '../detail-layout.css';

export default function Programs() {
  useEffect(() => {
    document.title = "Programs | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      <PageHero
        page="academics-programs"
        defaultTitle="Programs"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Programs' }]}
      />
      <section className="section bg-white">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-light)' }}>Content coming soon.</p>
        </div>
      </section>
    </main>
  );
}
