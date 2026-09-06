import { useEffect } from 'react';
import { Phone, BookOpen, Briefcase, Cpu, Microscope } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import AdmissionApplyForm from '../../components/AdmissionApplyForm/AdmissionApplyForm';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import './ApplyNow.css';

const defaultHeroPhoto = [
  { src: '/images/apply-bg.png', alt: 'VWU campus', caption: '' },
];

const PROGRAMMES_DATA = [
  {
    key: 'ug',
    count: '10',
    fullForm: 'Undergraduate (UG)',
    icon: BookOpen,
  },
  {
    key: 'mba',
    count: '1',
    fullForm: 'Master of Business Administration (MBA)',
    icon: Briefcase,
  },
  {
    key: 'pg',
    count: '4',
    fullForm: 'Postgraduate (M.Tech)',
    icon: Cpu,
  },
  {
    key: 'research',
    count: '3',
    fullForm: 'Doctoral & Research (Ph.D.)',
    icon: Microscope,
  },
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

          <div className="apply-now-programmes-container">
            <div className="apply-now-stat-label-wrap">
              <span className="apply-now-stat-label">Programmes Offered</span>
            </div>

            <div className="apply-now-cards-grid">
              {PROGRAMMES_DATA.map((prog) => {
                const IconComp = prog.icon;
                return (
                  <div key={prog.key} className="apply-now-card">
                    <div className="apply-now-card-top">
                      <div className="apply-now-card-icon-wrap">
                        <IconComp size={18} className="apply-now-card-icon" />
                      </div>
                      <span className="apply-now-card-count">
                        <span className="apply-now-card-num">{prog.count}</span>
                        <span className="apply-now-card-unit">{prog.count === '1' ? 'Course' : 'Courses'}</span>
                      </span>
                    </div>
                    <div className="apply-now-card-title">{prog.fullForm}</div>
                  </div>
                );
              })}
            </div>
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
