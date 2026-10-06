import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, BookOpen, Briefcase, Cpu, Microscope } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import AdmissionApplyForm from '../../components/AdmissionApplyForm/AdmissionApplyForm';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { useSiteContact, telHref } from '../../hooks/useSiteContact';
import { useDocument } from '../../hooks/useDocument';
import { DEFAULT_APPLY_NOW_CONTENT, APPLY_NOW_CONTENT_COLLECTION, APPLY_NOW_CONTENT_DOC_ID, type ApplyNowContentDoc } from '../Admin/sections/ApplyNowContentAdmin';
import './ApplyNow.css';

const defaultHeroPhoto = [
  { src: '/images/apply-bg.png', alt: 'VWU campus', caption: '' },
];

// Icons for the 4 programme cards are position-matched and structural --
// count/label come from ApplyNowContentAdmin's `programmes` field.
const PROGRAMME_ICONS = [BookOpen, Briefcase, Cpu, Microscope];
const PROGRAMME_KEYS = ['ug', 'mba', 'pg', 'research'];

export default function ApplyNow() {
  const heroPhoto = useSitePhotos('apply-now', 'hero', defaultHeroPhoto)[0];
  const photoSrc = heroPhoto?.src || PHOTO_NEEDED_PLACEHOLDER;
  const { phone } = useSiteContact();
  const { data: remoteContent } = useDocument<ApplyNowContentDoc>(APPLY_NOW_CONTENT_COLLECTION, APPLY_NOW_CONTENT_DOC_ID);
  const content = { ...DEFAULT_APPLY_NOW_CONTENT, ...remoteContent };

  useEffect(() => {
    document.title = "Apply Now | Vishnu Women's University";
  }, []);

  return (
    <main className="apply-now-page">
      <SEO
        title="Apply Now | Vishnu Women's University"
        description="Apply to Vishnu Women's University — quality education, modern infrastructure, experienced faculty, and research opportunities across 10 UG, 1 MBA, 4 M.Tech., and 3 Research programmes."
        canonicalPath="/apply-now"
      />

      <div className="apply-now-bg-wrap">
        <SmoothImage src={photoSrc} alt={heroPhoto?.alt || 'VWU campus'} className="apply-now-bg" />
        <div className="apply-now-bg-scrim" />
      </div>

      <div className="apply-now-phone-badge">
        <Phone size={14} />
        <a href={telHref(phone)}>{phone}</a>
      </div>

      <div className="container apply-now-grid">
        <div className="apply-now-info-col">
          <h1 className="apply-now-headline">
            {content.headline} <span>{content.headlineAccent}</span>
          </h1>
          <p className="apply-now-desc">
            {content.description}
          </p>

          <div className="apply-now-programmes-container">
            <div className="apply-now-stat-label-wrap">
              <span className="apply-now-stat-label">{content.statLabel}</span>
            </div>

            <div className="apply-now-cards-grid">
              {content.programmes.map((prog, idx) => {
                const IconComp = PROGRAMME_ICONS[idx % PROGRAMME_ICONS.length];
                return (
                  <Link key={PROGRAMME_KEYS[idx] || idx} to="/academics/departments" className="apply-now-card">
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
                  </Link>
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
