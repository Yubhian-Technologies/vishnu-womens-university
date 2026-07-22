import { useEffect, useState } from 'react';
import { FileText, Download } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import type { DownloadDoc } from '../Admin/sections/DownloadsAdmin';
import '../detail-layout.css';

export default function AcademicDownloads() {
  const { docs: downloads } = useOrderedCollection<DownloadDoc>('downloads', 'order');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.title = 'Academic Documents | Vishnu Womens University';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="academics-downloads"
        defaultImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80"
        defaultTitle="Academic Documents"
        defaultSubtitle="Official academic documents — calendar and regulations — available for download."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Academic Documents' }]}
      />

      {/* Downloads */}
      <section id="downloads-content" className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Academics</span>
            <h2 className="section-title">Downloadable Resources</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Download the latest course curriculum, academic calendar, and academic regulations documents.
            </p>
          </div>

          {/* Rendered from Firestore, so no scroll-reveal animation here
              (see the gotcha documented in CLAUDE.md). */}
          <div className="thrust-accordion">
            <div className={`thrust-accordion-item${isOpen ? ' open' : ''}`}>
              <button
                type="button"
                className="thrust-accordion-header"
                onClick={() => setIsOpen((o) => !o)}
                aria-expanded={isOpen}
              >
                <span>Academic Documents ({downloads.length})</span>
                <span className="thrust-accordion-icon">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="thrust-accordion-collapse">
                <div className="thrust-accordion-collapse-inner">
                  <div style={{ padding: 'var(--space-5)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                    {downloads.map((d) => (
                      <div
                        key={d.id}
                        style={{
                          background: 'var(--color-white)',
                          border: '1.5px solid var(--color-light-gray)',
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-6)',
                          borderLeft: '4px solid var(--color-accent)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--space-4)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <FileText size={24} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)' }}>
                            {d.title}
                          </span>
                        </div>
                        <a
                          href={d.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="btn btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                        >
                          <Download size={16} strokeWidth={2} /> Download
                        </a>
                      </div>
                    ))}
                    {downloads.length === 0 && (
                      <p style={{ color: 'var(--color-text-light)', gridColumn: '1 / -1', textAlign: 'center' }}>
                        No downloads have been added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
