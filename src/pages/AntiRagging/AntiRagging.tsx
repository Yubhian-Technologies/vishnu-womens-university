import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { useDocument } from '../../hooks/useDocument';
import { DEFAULT_ANTI_RAGGING_CONTENT, ANTI_RAGGING_CONTENT_COLLECTION, ANTI_RAGGING_CONTENT_DOC_ID, type AntiRaggingContentDoc } from '../Admin/sections/AntiRaggingContentAdmin';
import '../detail-layout.css';

const defaultPhoto = [{ src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Anti-Ragging', caption: '' }];

export default function AntiRagging() {
  useEffect(() => {
    document.title = "Anti-Ragging | Vishnu Women's University";
  }, []);

  const [photo] = useSitePhotos('anti-ragging', 'main', defaultPhoto);
  const { data: remoteContent } = useDocument<AntiRaggingContentDoc>(ANTI_RAGGING_CONTENT_COLLECTION, ANTI_RAGGING_CONTENT_DOC_ID);
  const content = { ...DEFAULT_ANTI_RAGGING_CONTENT, ...remoteContent };

  return (
    <main className="page-wrapper">
      <PageHero
        page="anti-ragging"
        defaultTitle="Anti-Ragging"
        defaultSubtitle="Vishnu Women's University is committed to a safe, ragging-free campus for every student."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Anti-Ragging' }]}
      />

      <section className="section bg-white">
        <div className="container">
          <div className="detail-grid">
            <div>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>
                {content.salutation}
              </p>
              {content.paragraphs.filter(Boolean).map((p, i) => (
                <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>{p}</p>
              ))}
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                {content.signature}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link to="/governance/anti-ragging" className="btn btn-primary">Anti-Ragging Committee</Link>
                <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
              </div>
            </div>

            <div className="detail-sidebar">
              <div style={{ position: 'sticky', top: '110px' }}>
                <img loading="lazy"
                  src={photo.src}
                  alt={photo.alt}
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-light-gray)', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
