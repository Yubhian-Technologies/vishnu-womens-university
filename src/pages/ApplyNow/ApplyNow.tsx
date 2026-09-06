import { useState, useEffect } from 'react';
import { Phone, BookOpen, Briefcase, Cpu, Microscope, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import AdmissionApplyForm from '../../components/AdmissionApplyForm/AdmissionApplyForm';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import './ApplyNow.css';

const defaultHeroPhoto = [
  { src: '/images/future-focussed.jpeg', alt: 'VWU campus', caption: '' },
];

const PROGRAMMES_DATA = {
  ug: {
    count: '10',
    label: 'Undergraduate (UG) Programmes',
    icon: BookOpen,
    items: [
      'B.Tech - Computer Science & Engineering',
      'B.Tech - Artificial Intelligence & Data Science',
      'B.Tech - Artificial Intelligence & Machine Learning',
      'B.Tech - Information Technology',
      'B.Tech - Electronics & Communication Engg.',
      'B.Tech - Electrical & Electronics Engg.',
      'B.Tech - Civil Engineering',
      'B.Tech - Mechanical Engineering',
      'B.Tech - Computer Science & Business Systems',
      'B.Tech - Cyber Security',
    ],
  },
  mba: {
    count: '1',
    label: 'MBA Programme',
    icon: Briefcase,
    items: ['Master of Business Administration (MBA)'],
  },
  pg: {
    count: '4',
    label: 'PG (M.Tech) Programmes',
    icon: Cpu,
    items: [
      'M.Tech - Computer Science & Engineering',
      'M.Tech - VLSI & Embedded Systems',
      'M.Tech - Power Electronics & Drives',
      'M.Tech - Information Technology',
    ],
  },
  research: {
    count: '3',
    label: 'Research Programmes (Ph.D.)',
    icon: Microscope,
    items: [
      'Ph.D. in Engineering & Technology',
      'Ph.D. in Sciences & Humanities',
      'Ph.D. in Management Studies',
    ],
  },
};

export default function ApplyNow() {
  const [activeTab, setActiveTab] = useState<'ug' | 'mba' | 'pg' | 'research'>('ug');
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
              <span className="apply-now-stat-hint">Select to explore courses</span>
            </div>

            <div className="apply-now-tabs-grid">
              {(['ug', 'mba', 'pg', 'research'] as const).map((key) => {
                const prog = PROGRAMMES_DATA[key];
                const IconComp = prog.icon;
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`apply-now-tab-card ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(key)}
                  >
                    <IconComp size={15} className="apply-now-tab-icon" />
                    <span className="apply-now-tab-num">{prog.count}</span>
                    <span className="apply-now-tab-text">{key === 'pg' ? 'PG (MTECH)' : key === 'research' ? 'RESEARCH' : key.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            {/* Program Detail Preview Panel */}
            <div className="apply-now-program-panel">
              <div className="apply-now-panel-header">
                <span className="apply-now-panel-title">
                  {PROGRAMMES_DATA[activeTab].label}
                </span>
                <span className="apply-now-panel-count">
                  {PROGRAMMES_DATA[activeTab].items.length} {PROGRAMMES_DATA[activeTab].items.length === 1 ? 'Course' : 'Courses'}
                </span>
              </div>
              <div className="apply-now-program-list">
                {PROGRAMMES_DATA[activeTab].items.map((item) => (
                  <div key={item} className="apply-now-program-chip">
                    <CheckCircle2 size={13} className="apply-now-chip-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
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
