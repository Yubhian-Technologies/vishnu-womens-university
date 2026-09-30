import { useState } from 'react';
import {
  Compass,
  Target,
  Cpu,
  Zap,
  CheckCircle2,
  Award,
  Sparkles,
  Wrench,
  GraduationCap,
  Building2,
  Handshake,
  Maximize2,
  X,
} from 'lucide-react';
import { microchipEmbedded } from './microchipEmbedded.data';
import { useDocument } from '../../hooks/useDocument';
import type { MicrochipDoc } from '../Admin/sections/MicrochipContentAdmin';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import { CustomSectionsAccordion, CustomSectionsIntro } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { renderBold } from '../../lib/boldText';
import './MicrochipPage.css';

interface MicrochipPageProps {
  item?: DifferentiatorItemDoc;
  descriptionSection?: CustomSection;
  introBlocks?: CustomSection[];
  customSections?: CustomSection[];
}

export default function MicrochipPage({
  item,
  descriptionSection,
  introBlocks = [],
  customSections = [],
}: MicrochipPageProps) {
  const { data: remoteData } = useDocument<MicrochipDoc>('settings', 'microchipEmbedded');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const data = {
    hero: remoteData?.hero || microchipEmbedded.hero,
    about: {
      title: remoteData?.about?.title || microchipEmbedded.about.title,
      paragraphs: remoteData?.about?.paragraphs && remoteData.about.paragraphs.length > 0 ? remoteData.about.paragraphs : microchipEmbedded.about.paragraphs,
    },
    vision: {
      title: remoteData?.vision?.title || microchipEmbedded.vision.title,
      statement: remoteData?.vision?.statement || microchipEmbedded.vision.statement,
    },
    mission: {
      title: remoteData?.mission?.title || microchipEmbedded.mission.title,
      intro: remoteData?.mission?.intro || microchipEmbedded.mission.intro,
      points: remoteData?.mission?.points && remoteData.mission.points.length > 0 ? remoteData.mission.points : microchipEmbedded.mission.points,
    },
    learningAreas: remoteData?.learningAreas && remoteData.learningAreas.length > 0 ? remoteData.learningAreas : microchipEmbedded.learningAreas,
    trainingAndActivities: remoteData?.trainingAndActivities || microchipEmbedded.trainingAndActivities,
    programmeOutcome: remoteData?.programmeOutcome || microchipEmbedded.programmeOutcome,
    technicalHighlights: {
      title: remoteData?.technicalHighlights?.title || microchipEmbedded.technicalHighlights.title,
      items: remoteData?.technicalHighlights?.items && remoteData.technicalHighlights.items.length > 0 ? remoteData.technicalHighlights.items : microchipEmbedded.technicalHighlights.items,
    },
    facilities: {
      title: remoteData?.facilities?.title || microchipEmbedded.facilities.title,
      intro: remoteData?.facilities?.intro || microchipEmbedded.facilities.intro,
      items: remoteData?.facilities?.items && remoteData.facilities.items.length > 0 ? remoteData.facilities.items : microchipEmbedded.facilities.items,
    },
    learningPartners: {
      title: remoteData?.learningPartners?.title || microchipEmbedded.learningPartners.title,
      partners: remoteData?.learningPartners?.partners && remoteData.learningPartners.partners.length > 0 ? remoteData.learningPartners.partners : microchipEmbedded.learningPartners.partners,
    },
    gallery: microchipEmbedded.gallery,
    cta: microchipEmbedded.cta,
  };
  const additionalSections = remoteData?.additionalSections || [];

  const aboutParagraphs = item?.description?.textContent
    ? [item.description.textContent]
    : descriptionSection?.textContent
    ? [descriptionSection.textContent]
    : item?.desc
    ? [item.desc]
    : data.about.paragraphs;

  const visionText =
    (item?.vision && hasCustomSectionContent(item.vision) && (item.vision.textContent || item.vision.listText)) ||
    introBlocks.find((s) => s.id === 'vision')?.textContent?.trim() ||
    data.vision.statement;

  const missionList =
    (item?.mission && hasCustomSectionContent(item.mission) && (item.mission.listText?.split('\n').filter(Boolean) || [item.mission.textContent || ''])) ||
    introBlocks.find((s) => s.id === 'mission')?.listText?.split('\n').filter(Boolean) ||
    data.mission.points;

  // Extract gallery photos from admin custom sections
  const gallerySection = customSections.find(
    (s) => s.id === 'gallery' || s.label?.toLowerCase() === 'gallery' || s.contentType === 'gallery'
  );
  const galleryItems: { url: string; label: string }[] = [];

  if (gallerySection) {
    if (gallerySection.galleryPhotos) {
      gallerySection.galleryPhotos.forEach((p, idx) => {
        if (p.imageUrl) galleryItems.push({ url: p.imageUrl, label: p.caption || `Microchip Workshop Photo ${idx + 1}` });
      });
    } else if (gallerySection.files) {
      gallerySection.files.forEach((f, idx) => {
        if (f.fileUrl) galleryItems.push({ url: f.fileUrl, label: f.label || `Microchip Workshop Photo ${idx + 1}` });
      });
    } else if (gallerySection.imageCards) {
      gallerySection.imageCards.forEach((c, idx) => {
        if (c.imageUrl) galleryItems.push({ url: c.imageUrl, label: c.title || `Microchip Workshop Photo ${idx + 1}` });
      });
    }
  }

  // Filter out any custom sections handled specifically
  const accordionSections = customSections.filter(
    (s) => s.id !== 'gallery' && s.contentType !== 'gallery' && s.placement !== 'intro'
  );

  return (
    <div className="mc-page-container">
      {/* 1. ABOUT THE CENTRE */}
      <section className="mc-about-section">
        <div className="mc-about-card">
          <div className="mc-about-header">
            <span className="mc-section-badge">
              <Cpu size={14} /> Centre Overview
            </span>
            <h2 className="mc-about-title">{item?.title || data.about.title}</h2>
          </div>
          <div className="mc-about-body">
            {aboutParagraphs.map((para, idx) => (
              <p key={idx} className="mc-about-text">{renderBold(para)}</p>
            ))}
          </div>

          <div className="mc-key-tags">
            <span className="mc-key-tag">
              <Cpu size={14} /> 8, 16 & 32-Bit PIC Microcontrollers
            </span>
            <span className="mc-key-tag">
              <Zap size={14} /> IoT & Sensor-Based Applications
            </span>
            <span className="mc-key-tag">
              <Handshake size={14} /> EduSkills & AICTE ATAL Integration
            </span>
          </div>
        </div>
      </section>

      {/* 2. VISION & MISSION */}
      <section className="mc-vm-section">
        <div className="mc-vm-grid">
          {/* Vision */}
          <div className="mc-vm-card mc-vision-card">
            <span className="mc-vm-badge">
              <Compass size={14} /> Strategic Vision
            </span>
            <h3 className="mc-vm-title">{data.vision.title}</h3>
            <div className="mc-vision-content">
              <p>{renderBold(visionText)}</p>
            </div>
          </div>

          {/* Mission */}
          <div className="mc-vm-card mc-mission-card">
            <span className="mc-vm-badge">
              <Target size={14} /> Institutional Mission
            </span>
            <h3 className="mc-vm-title">{data.mission.title}</h3>
            <p className="mc-mission-intro">{renderBold(data.mission.intro)}</p>
            <ul className="mc-mission-list">
              {missionList.map((point: string, idx: number) => (
                <li key={idx} className="mc-mission-item">
                  <CheckCircle2 size={16} className="mc-mission-check" />
                  <span>{renderBold(point)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. CORE LEARNING AREAS */}
      <section className="mc-learning-section">
        <div className="mc-section-header">
          <span className="mc-section-label">Competency Framework</span>
          <h2 className="mc-section-title">Core Learning Areas</h2>
        </div>

        <div className="mc-learning-grid">
          {data.learningAreas.map((area) => (
            <div key={area.number} className="mc-learning-card">
              <div className="mc-learning-num">{area.number}</div>
              <div className="mc-learning-content">
                <h4 className="mc-learning-card-title">{area.title}</h4>
                <p className="mc-learning-card-desc">{renderBold(area.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRAINING & ACTIVITIES & PROGRAMME OUTCOME */}
      <section className="mc-training-outcome-section">
        <div className="mc-training-grid">
          {/* Training & Activities */}
          <div className="mc-training-card">
            <div className="mc-feature-badge">
              <Award size={14} /> {data.trainingAndActivities.title}
            </div>
            <h3 className="mc-training-title">{data.trainingAndActivities.programmeName}</h3>
            <p className="mc-training-desc">{renderBold(data.trainingAndActivities.description)}</p>
          </div>

          {/* Programme Outcome */}
          <div className="mc-outcome-card">
            <div className="mc-feature-badge mc-badge-outcome">
              <Sparkles size={14} /> {data.programmeOutcome.title}
            </div>
            <h3 className="mc-outcome-title">Faculty Development & Impact</h3>
            <p className="mc-outcome-desc">{renderBold(data.programmeOutcome.description)}</p>
          </div>
        </div>
      </section>

      {/* 5. TECHNICAL HIGHLIGHTS & FACILITIES */}
      <section className="mc-details-section">
        <div className="mc-details-grid">
          {/* Technical Highlights */}
          <div className="mc-details-card">
            <div className="mc-details-header">
              <Zap size={20} className="mc-details-icon" />
              <h3 className="mc-details-title">{data.technicalHighlights.title}</h3>
            </div>
            <ul className="mc-highlights-list">
              {data.technicalHighlights.items.map((item, idx) => (
                <li key={idx} className="mc-highlight-item">
                  <div className="mc-highlight-bullet" />
                  <span>{renderBold(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Facilities & Development Resources */}
          <div className="mc-details-card">
            <div className="mc-details-header">
              <Wrench size={20} className="mc-details-icon" />
              <h3 className="mc-details-title">{data.facilities.title}</h3>
            </div>
            <p className="mc-facilities-intro">{renderBold(data.facilities.intro)}</p>
            <ul className="mc-facilities-list">
              {data.facilities.items.map((item, idx) => (
                <li key={idx} className="mc-facility-item">
                  <CheckCircle2 size={16} className="mc-facility-icon" />
                  <span>{renderBold(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. EXTERNAL PROGRAMMES & LEARNING PARTNERS */}
      <section className="mc-partners-section">
        <div className="mc-section-header">
          <span className="mc-section-label">Collaborative Ecosystem</span>
          <h2 className="mc-section-title">{data.learningPartners.title}</h2>
        </div>

        <div className="mc-partners-grid">
          {data.learningPartners.partners.map((partner, idx) => (
            <div key={idx} className="mc-partner-card">
              <div className="mc-partner-header">
                <div className="mc-partner-avatar">
                  <Building2 size={24} />
                </div>
                <div>
                  <h4 className="mc-partner-name">{partner.name}</h4>
                  <span className="mc-partner-badge">Official Learning Partner</span>
                </div>
              </div>
              <p className="mc-partner-desc">{renderBold(partner.description)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GALLERY SECTION */}
      <section className="mc-gallery-section">
        <div className="mc-section-header">
          <span className="mc-section-label">Visual Documentation</span>
          <h2 className="mc-section-title">{data.gallery.title}</h2>
          <p className="mc-gallery-caption-subtitle">{renderBold(data.gallery.caption)}</p>
        </div>

        {galleryItems.length > 0 ? (
          <div className="mc-gallery-grid">
            {galleryItems.map((photo, idx) => (
              <div
                key={idx}
                className="mc-gallery-item"
                onClick={() => setLightboxImg(photo.url)}
              >
                <img loading="lazy" src={photo.url} alt={photo.label} className="mc-gallery-img" />
                <div className="mc-gallery-overlay">
                  <span>{photo.label}</span>
                  <Maximize2 size={16} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mc-gallery-showcase">
            <div className="mc-showcase-card">
              <div className="mc-showcase-icon">
                <GraduationCap size={32} />
              </div>
              <h4 className="mc-showcase-title">{renderBold(data.gallery.caption)}</h4>
              <p className="mc-showcase-desc">
                Interactive practical workshops and faculty development sessions covering PIC microcontrollers, embedded programming, and IoT interfacing.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 8. DYNAMIC CUSTOM SECTIONS ACCORDION (If added via Admin) */}
      {customSections.some((s) => s.placement === 'intro') && (
        <section className="mc-custom-sections" style={{ marginTop: '2rem' }}>
          <CustomSectionsIntro sections={customSections} />
        </section>
      )}
      {accordionSections.length > 0 && (
        <section className="mc-custom-sections" style={{ marginTop: '2rem' }}>
          <CustomSectionsAccordion sections={accordionSections} />
        </section>
      )}

      {/* Dynamic Additional Sections from Admin */}
      {additionalSections.length > 0 && (
        <section className="mc-custom-sections" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {additionalSections.map((sec) => (
              <div key={sec.id} className="mc-details-card">
                {sec.badge && (
                  <div className="mc-feature-badge">
                    <Sparkles size={14} /> {sec.badge}
                  </div>
                )}
                <h3 className="mc-details-title">{sec.title}</h3>
                {(sec.paragraphs || []).map((p, pIdx) => (
                  <p key={pIdx} className="mc-facilities-intro" style={{ marginBottom: '0.75rem' }}>
                    {renderBold(p)}
                  </p>
                ))}
                {(sec.bulletPoints || []).length > 0 && (
                  <ul className="mc-facilities-list" style={{ marginTop: '0.5rem' }}>
                    {sec.bulletPoints!.map((b, bIdx) => (
                      <li key={bIdx} className="mc-facility-item">
                        <CheckCircle2 size={16} className="mc-facility-icon" />
                        <span>{renderBold(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="meda-lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <button
            type="button"
            className="meda-lightbox-close"
            onClick={() => setLightboxImg(null)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <img src={lightboxImg} alt="Gallery Preview" className="meda-lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
