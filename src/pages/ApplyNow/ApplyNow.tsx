import { useEffect } from 'react';
import { Phone } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import AdmissionApplyForm from '../../components/AdmissionApplyForm/AdmissionApplyForm';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import './ApplyNow.css';

const defaultHeroPhoto = [
  { src: '/images/future-focussed.jpeg', alt: 'VWU campus', caption: '' },
];

export default function ApplyNow() {
  const heroPhoto = useSitePhotos('apply-now', 'hero', defaultHeroPhoto)[0];
  const photoSrc = heroPhoto?.src || PHOTO_NEEDED_PLACEHOLDER;

  useEffect(() => {
    document.title = "Apply Now | Vishnu Women's University";
  }, []);

  return (
    <main className="apply-now-page">
      <SEO
        title="Apply Now | Vishnu Women's University"
        description="Apply to Vishnu Women's University — quality education, modern infrastructure, experienced faculty, and research opportunities across 10 UG, 1 MBA, 4 M.Tech, and 3 Research programmes."
        canonicalPath="/apply-now"
      />

      <div className="apply-now-bg-wrap">
        <SmoothImage src={photoSrc} alt={heroPhoto?.alt || 'VWU campus'} className="apply-now-bg" />
        <div className="apply-now-bg-scrim" />
      </div>

      <div className="apply-now-phone-badge">
        <Phone size={14} />
        <a href="tel:08816250864">08816-250864</a>
      </div>

      <div className="container apply-now-grid">
        <div className="apply-now-info-col">
          <h1 className="apply-now-headline">
            Academic Excellence. <span>Limitless Possibilities.</span>
          </h1>
          <p className="apply-now-desc">
            Vishnu Women&rsquo;s University offers quality education, modern infrastructure, experienced faculty, research opportunities, and a vibrant campus environment&mdash;empowering women to learn, lead, and excel.
          </p>
          <div className="apply-now-stat-card">
            <span className="apply-now-stat-number">10 UG + 1 MBA + 4 M.Tech. + 3 Research Programmes</span>
            <span className="apply-now-stat-label">Programmes Offered</span>
          </div>
        </div>

        <div className="apply-now-form-col">
          <div className="apply-now-form-card">
            <AdmissionApplyForm />
          </div>
        </div>
      </div>
    </main>
  );
}
