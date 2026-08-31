import { useEffect } from 'react';
import PageHero from '../../components/PageHero/PageHero';
import '../detail-layout.css';

export default function Departments() {
  useEffect(() => {
    document.title = "Departments | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      <PageHero
        page="academics-departments"
        defaultTitle="Departments"
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Departments' }]}
      />
      <section className="section bg-white">
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-light)' }}>Content coming soon.</p>
        </div>
      </section>
    </main>
  );
}
