import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Recycle, FlaskConical, IndianRupee, CalendarDays,
  ShieldCheck, Waves, Factory
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { hasCustomSectionContent } from '../../lib/customSections';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import { renderBold } from '../../lib/boldText';
import { useDocument } from '../../hooks/useDocument';
import { DEFAULT_SEWAGE_TREATMENT_CONTENT, SEWAGE_TREATMENT_CONTENT_COLLECTION, SEWAGE_TREATMENT_CONTENT_DOC_ID, type SewageTreatmentContentDoc } from '../Admin/sections/SewageTreatmentContentAdmin';
import './SewageTreatment.css';

// Icons for the 6 project-fact tiles and the 3 closed-loop steps are
// position-matched and structural -- text comes from
// SewageTreatmentContentAdmin's `projectFacts` / `loopSteps` fields.
const PROJECT_FACT_ICONS = [Factory, Droplets, IndianRupee, IndianRupee, CalendarDays, FlaskConical];
const LOOP_ICONS = [Droplets, Waves, ShieldCheck];

export const DEFAULT_PHOTOS = [
  { src: '/images/sewage-treatment-plants/stp-1.jpg', alt: 'Sewage Treatment Plant at VWU — photo 1', caption: 'On-site 200 KLD MBBR Plant' },
  { src: '/images/sewage-treatment-plants/stp-2.jpg', alt: 'Sewage Treatment Plant at VWU — photo 2', caption: 'Aeration & Distribution Tank' },
  { src: '/images/sewage-treatment-plants/stp-3.jpg', alt: 'Sewage Treatment Plant at VWU — photo 3', caption: 'Sand & Carbon Filter Pressure Vessels' },
];

export default function SewageTreatment() {
  const photos = useSitePhotos('campus', 'sewage-treatment-plants', DEFAULT_PHOTOS);
  const { data: remoteContent } = useDocument<SewageTreatmentContentDoc>(SEWAGE_TREATMENT_CONTENT_COLLECTION, SEWAGE_TREATMENT_CONTENT_DOC_ID);
  const content = { ...DEFAULT_SEWAGE_TREATMENT_CONTENT, ...remoteContent };

  const getPhotoSrc = (index: number) => {
    const p = photos[index]?.src;
    if (p && !p.includes('photoPlaceholder') && !p.includes('data:image')) return p;
    return DEFAULT_PHOTOS[index % DEFAULT_PHOTOS.length].src;
  };

  // Admin-editable name + extra content (including a proper multi-photo
  // gallery section type) — same `campusLifeItems` system every other
  // Campus Life page uses, via Admin -> Campus Life -> Sewage Treatment
  // Plants. Falls back to the existing hardcoded title if no admin item
  // has been created yet.
  const { docs: campusLifeItems } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = campusLifeItems.find((i) => i.slug === 'sewage-treatment-plants');
  const pageTitle = adminItem?.title || 'Sewage Treatment Plants';
  const customSections = (adminItem?.customSections || []).filter(hasCustomSectionContent);

  useEffect(() => {
    document.title = `${pageTitle} | VWU`;
  }, [pageTitle]);

  // Mount-only, not keyed on Firestore data — see the .reveal/Firestore
  // gotcha in CLAUDE.md (re-running this per live data update can tear the
  // observer down mid-animation and permanently miss elements).
  useEffect(() => {
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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="stp-page page-wrapper">
      <SEO
        title="Sewage Treatment Plants — Zero Discharge Campus | Vishnu Women's University"
        description="Two DST-funded 200 KLD sewage treatment plants using MBBR technology make the VWU campus a zero-discharge campus, with treated effluent reused for campus and highway greenery."
        canonicalPath="/campus/sewage-treatment-plants"
      />

      <PageHero
        page="campus-sewage-treatment-plants"
        defaultTitle={pageTitle}
        defaultSubtitle="A zero-discharge campus — every drop of sewage generated is treated on site and returned to the land as irrigation for campus and highway greenery."
        hideCta={true}
      />

      {/* Admin-added content (Admin -> Campus Life -> Sewage Treatment
          Plants -> Sections) — includes a "Photo Gallery" section type for
          adding as many extra photos as needed, beyond the 3 fixed Site
          Photos slots used throughout the page below. Hidden until an
          admin actually adds something here. */}
      {customSections.length > 0 && (
        <section className="stp-section">
          <div className="stp-container">
            <CustomSectionsRenderer sections={customSections} />
          </div>
        </section>
      )}

      {/* 1. Eco Metrics Hero Dashboard */}
      <section className="stp-stats-banner">
        <div className="stp-container">
          <div className="stp-stats-grid">
            {content.campusStats.map((s) => (
              <div key={s.label} className="stp-stat-card">
                <div className="stp-stat-val">{renderBold(s.value)}</div>
                <div className="stp-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Vision & Water Conservation Narrative with Interleaved Media */}
      <section className="stp-section stp-vision-section">
        <div className="stp-container">
          <div className="stp-header">
            <h2 className="stp-title">
              {content.visionHeading}
            </h2>
            <p className="stp-subtitle">
              {content.visionSubtitle}
            </p>
          </div>

          <div className="stp-vision-card">
            <div className="stp-vision-quote">
              <div className="stp-vision-quote-text">
                {content.visionQuote}
              </div>
            </div>

            <div className="stp-vision-grid">
              <div className="stp-vision-body">
                <p>{renderBold(content.visionParagraph1)}</p>
                <p>{renderBold(content.visionParagraph2)}</p>

                <div className="stp-vision-highlight-box">
                  <div className="stp-vision-highlight-title">
                    <Recycle size={20} />
                    <span>Closed-Loop Resource Cycle</span>
                  </div>
                  <div className="stp-water-loop">
                    {content.loopSteps.map((step, i) => {
                      const Icon = LOOP_ICONS[i % LOOP_ICONS.length];
                      return (
                        <div key={i} className="stp-loop-step">
                          <Icon size={18} className="stp-loop-icon" />
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Interleaved Photo Slot 1 & 2 */}
              <div className="stp-vision-sidebar">
                <div className="stp-media-card">
                  <img loading="lazy"
                    src={getPhotoSrc(0)}
                    alt="VWU Sewage Treatment Plant View"
                    className="stp-media-img"
                    onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[0].src; }}
                  />
                  </div>

                <div className="stp-media-card">
                  <img loading="lazy"
                    src={getPhotoSrc(1)}
                    alt="VWU Sewage Treatment Water Recycling"
                    className="stp-media-img"
                    onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[1].src; }}
                  />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DST-Funded Treatment Plants Specifications Showcase */}
      <section className="stp-section stp-dst-section">
        <div className="stp-container">
          <div className="stp-header">
            <h2 className="stp-title">
              {content.dstHeading}
            </h2>
            <p className="stp-subtitle">
              {content.dstSubtitle}
            </p>
          </div>

          <div className="stp-dst-showcase">
            <div className="stp-dst-narrative">
              {renderBold(content.dstParagraph)}
            </div>

            {/* Interleaved Photo Slot 3 */}
            <div className="stp-media-card">
              <img loading="lazy"
                src={getPhotoSrc(2)}
                alt="DST Funded Sewage Treatment Installation"
                className="stp-media-img"
                onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[2].src; }}
              />
              </div>
          </div>

          <div className="stp-spec-grid">
            {content.projectFacts.map(({ label, value }, i) => {
              const Icon = PROJECT_FACT_ICONS[i % PROJECT_FACT_ICONS.length];
              return (
                <div key={label} className="stp-spec-card">
                  <div className="stp-spec-icon-box">
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="stp-spec-lbl">{label}</div>
                    <div className="stp-spec-val">{value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Treatment Methodology Process Cards with Integrated Step Photos */}
      <section className="stp-section stp-method-section">
        <div className="stp-container">
          <div className="stp-header">
            <h2 className="stp-title">
              {content.methodHeading}
            </h2>
            <p className="stp-subtitle">
              {content.methodSubtitle}
            </p>
          </div>

          <div className="stp-process-flow">
            {content.processSteps.map((step, i) => (
              <div key={i} className="stp-process-card">
                <div className="stp-process-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="stp-process-img-box">
                  <img loading="lazy"
                    src={getPhotoSrc(i + 3)}
                    alt={step.title}
                    onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[i % DEFAULT_PHOTOS.length].src; }}
                  />
                </div>
                <h3 className="stp-process-title">{step.title}</h3>
                <p className="stp-process-body">{renderBold(step.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Impact & Application Dual Spotlight with Feature Photos */}
      <section className="stp-section stp-impact-section">
        <div className="stp-container">
          <div className="stp-header">
            <h2 className="stp-title">
              {content.impactHeading}
            </h2>
            <p className="stp-subtitle">
              {content.impactSubtitle}
            </p>
          </div>

          <div className="stp-impact-grid">
            {content.impactSpotlights.map((s, i) => (
              <div key={i} className="stp-impact-media-card">
                <div className="stp-impact-img-box">
                  <img loading="lazy"
                    src={getPhotoSrc(i + 6)}
                    alt={s.title}
                    onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[i % DEFAULT_PHOTOS.length].src; }}
                  />
                </div>
                <div className="stp-impact-body">
                  <span className="stp-impact-tag">{s.tag}</span>
                  <h3 className="stp-impact-title">{s.title}</h3>
                  <p className="stp-impact-desc">{renderBold(s.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. On-Site Gallery Section */}
      <section className="stp-section stp-gallery-section">
        <div className="stp-container">
          <PhotoGrid
            images={photos}
            title="STP Infrastructure Gallery"
            label="GALLERY SHOWCASE"
            subtitle="Visual glimpses of the 200 KLD MBBR sewage treatment plants, testing labs, and recycled water distribution."
          />
        </div>
      </section>

      {/* 7. Eco Action Bottom CTA */}
      <section className="stp-cta-banner">
        <div className="stp-container">
          <h2>{content.ctaHeading}</h2>
          <p>{content.ctaParagraph}</p>
          <div className="stp-cta-btns">
            <Link to="/campus/other-facilities" className="stp-btn stp-btn-outline">
              Other Facilities
            </Link>
            <Link to="/differentiators" className="stp-btn stp-btn-outline">
              Differentiators
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
