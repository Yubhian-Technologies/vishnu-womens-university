import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../detail-layout.css';

const defaultPhoto = [{ src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Anti Ragging', caption: '' }];

export default function AntiRagging() {
  useEffect(() => {
    document.title = 'Anti Ragging | Vishnu Womens University';
  }, []);

  const [photo] = useSitePhotos('anti-ragging', 'main', defaultPhoto);

  return (
    <main className="page-wrapper">
      <PageHero
        page="anti-ragging"
        defaultImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80"
        defaultTitle="Anti Ragging"
        defaultSubtitle="Vishnu Womens University is committed to a safe, ragging-free campus for every student."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Anti Ragging' }]}
      />

      <section className="section bg-white">
        <div className="container">
          <div className="detail-grid">
            <div>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', fontWeight: 600, marginBottom: 'var(--space-5)' }}>
                Dear Fresher,
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                Warm greetings and welcome to our institution. As a first step you've chosen the right
                college and the course you aspire to have. Make use of all the facilities and the
                ambiance you will have here.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                Since its inception, our institution has set high standards of education and is
                committed to taking students to new heights year by year. These efforts have culminated
                into consistently positioning Vishnu Womens University among the best in the state.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                As a fresher, you may have many apprehensions about Ragging but mind you, ours is a
                ragging-free campus. We always believe that ragging is an uncivilized and inhuman
                practice. In this regard, we formed an anti-ragging committee to ensure strict vigilance
                in the campus. A series of measures have been devised and implemented for the years to
                rule out any incident of ragging to be attempted by senior students at any place inside
                the Campus. Having a fully residential campus, it enhances our responsibility and also
                empowers us with greater control over students. For making ragging non-gratis at Vishnu Womens University,
                all stakeholders viz. management, faculty, students and employees are extending full
                support and cooperation. Students are enlightened in such a way that they never even
                allow the thought of ragging.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                Our anti-ragging committee members, anti-ragging squad and mentoring cell will always
                extend their support and cooperation to you at any moment and we ensure that Vishnu Womens University is
                free from ragging virus. Please feel free to get in touch with us in case you need any
                help, clarification or any other support in this regard.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                PRINCIPAL
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link to="/governance/anti-ragging" className="btn btn-primary">Anti Ragging Committee</Link>
                <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
              </div>
            </div>

            <div className="detail-sidebar">
              <div style={{ position: 'sticky', top: '110px' }}>
                <img
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
