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
import type { CustomSection } from '../../lib/customSections';
import { CustomSectionsAccordion } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { renderBold } from '../../lib/boldText';
import './MicrochipPage.css';

interface MicrochipPageProps {
  customSections?: CustomSection[];
}

export default function MicrochipPage({ customSections = [] }: MicrochipPageProps) {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const data = microchipEmbedded;

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
    (s) => s.id !== 'gallery' && s.contentType !== 'gallery'
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
            <h2 className="mc-about-title">{data.about.title}</h2>
          </div>
          <div className="mc-about-body">
            {data.about.paragraphs.map((para, idx) => (
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
              <p>{data.vision.statement}</p>
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
              {data.mission.points.map((point, idx) => (
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
      {accordionSections.length > 0 && (
        <section className="mc-custom-sections" style={{ marginTop: '3rem' }}>
          <CustomSectionsAccordion sections={accordionSections} />
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
