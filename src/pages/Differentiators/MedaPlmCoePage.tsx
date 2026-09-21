import { useState } from 'react';
import {
  Award,
  BookOpen,
  Boxes,
  CheckCircle2,
  Cpu,
  Database,
  Settings,
  Sparkles,
  Workflow,
  Wrench,
  Building2,
  X,
  Maximize2,
  Layers,
  Handshake,
} from 'lucide-react';
import { medaPlmCoe } from './medaPlmCoe.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import './MedaPlmCoePage.css';

interface MedaPlmCoePageProps {
  item: DifferentiatorItemDoc;
  sections: CustomSection[];
}

export default function MedaPlmCoePage({ sections }: MedaPlmCoePageProps) {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Extract existing photos from custom sections safely
  const gallerySection = sections.find(
    (s) => s.id === 'gallery' || s.label?.toLowerCase() === 'gallery' || s.contentType === 'gallery'
  );
  const galleryItems: { url: string; label: string }[] = [];

  if (gallerySection) {
    if (gallerySection.galleryPhotos) {
      gallerySection.galleryPhotos.forEach((p, idx) => {
        if (p.imageUrl) galleryItems.push({ url: p.imageUrl, label: p.caption || `MEDA & PLM CoE Photo ${idx + 1}` });
      });
    } else if (gallerySection.files) {
      gallerySection.files.forEach((f, idx) => {
        if (f.fileUrl) galleryItems.push({ url: f.fileUrl, label: f.label || `MEDA & PLM CoE Photo ${idx + 1}` });
      });
    } else if (gallerySection.imageCards) {
      gallerySection.imageCards.forEach((c, idx) => {
        if (c.imageUrl) galleryItems.push({ url: c.imageUrl, label: c.title || `MEDA & PLM CoE Photo ${idx + 1}` });
      });
    }
  }

  // Extract legacy or Firestore custom sections (Key Highlights, Facilities, Outcomes, Partners)
  const highlightsSection = sections.find((s) => s.id === 'highlights' || s.label === 'Key Highlights');
  const facilitiesSection = sections.find((s) => s.id === 'facilities' || s.label?.includes('Facilities'));
  const outcomesSection = sections.find((s) => s.id === 'outcomes' || s.label?.includes('Outcomes'));
  const partnersSection = sections.find((s) => s.id === 'partners' || s.label === 'Partners');

  // Convert listText or items
  const parseList = (sec?: CustomSection): string[] => {
    if (!sec) return [];
    if (sec.listText) {
      return sec.listText.split('\n').map((l) => l.trim()).filter(Boolean);
    }
    return [];
  };

  const highlights = parseList(highlightsSection);
  const facilities = parseList(facilitiesSection);
  const outcomes = parseList(outcomesSection);
  const partners = parseList(partnersSection);

  // Helper component to render a section's photo frame safely using modulo index
  const RenderPhotoFrame = ({ index }: { index: number }) => {
    if (galleryItems.length === 0) return null;
    const photo = galleryItems[index % galleryItems.length];
    return (
      <div className="meda-photo-frame" onClick={() => setLightboxImg(photo.url)}>
        <img loading="lazy" src={photo.url} alt={photo.label} className="meda-photo-frame-img" />
        <div className="meda-photo-frame-caption">
          <span>{photo.label}</span>
          <Maximize2 size={14} />
        </div>
      </div>
    );
  };

  const hasPhotos = galleryItems.length > 0;
  const data = medaPlmCoe;

  return (
    <div className="meda-plm-container">
      {/* Centre at a Glance Strip */}
      <section className="meda-glance-strip">
        <div className="meda-glance-grid">
          <div className="meda-glance-card">
            <div className="meda-glance-icon-box">
              <Cpu className="meda-glance-icon" size={20} />
            </div>
            <div className="meda-glance-info">
              <span className="meda-glance-title">{data.glance[0].title}</span>
              <span className="meda-glance-subtitle">{data.glance[0].subtitle}</span>
            </div>
          </div>

          <div className="meda-glance-card">
            <div className="meda-glance-icon-box">
              <Layers className="meda-glance-icon" size={20} />
            </div>
            <div className="meda-glance-info">
              <span className="meda-glance-title">{data.glance[1].title}</span>
              <span className="meda-glance-subtitle">{data.glance[1].subtitle}</span>
            </div>
          </div>

          <div className="meda-glance-card">
            <div className="meda-glance-icon-box">
              <Handshake className="meda-glance-icon" size={20} />
            </div>
            <div className="meda-glance-info">
              <span className="meda-glance-title">{data.glance[2].title}</span>
              <span className="meda-glance-subtitle">{data.glance[2].subtitle}</span>
            </div>
          </div>

          <div className="meda-glance-card">
            <div className="meda-glance-icon-box">
              <Boxes className="meda-glance-icon" size={20} />
            </div>
            <div className="meda-glance-info">
              <span className="meda-glance-title">{data.glance[3].title}</span>
              <span className="meda-glance-subtitle">{data.glance[3].subtitle}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero MoU Banner Section: Industry Collaboration with Capgemini */}
      <section className={`meda-hero-banner ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
        <div>
          <div className="meda-hero-badge">
            <Sparkles size={14} /> Capgemini Collaboration MoU
          </div>
          <h2 className="meda-hero-title">{data.collaboration.title}</h2>
          <div className="meda-hero-paragraphs">
            {data.collaboration.paragraphs.map((p, idx) => (
              <p key={idx} className="meda-hero-text">{p}</p>
            ))}
          </div>
        </div>
        {hasPhotos && <RenderPhotoFrame index={0} />}
      </section>

      {/* Section 01: Mechanical Engineering Design Automation (MEDA) */}
      <div className="meda-section-block">
        <div className="meda-section-banner">
          <div className="meda-section-banner-title">
            <span className="meda-section-num">01</span>
            <h2 className="meda-section-name">{data.meda.heading}</h2>
          </div>
        </div>

        <div className="meda-glass-card">
          <div className={`meda-glass-split ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
            <div>
              <p className="meda-closing-note" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', fontStyle: 'normal', color: '#475569', fontSize: '0.975rem' }}>
                {data.meda.intro}
              </p>

              {/* Software Platforms */}
              <div style={{ margin: '0.75rem 0 0.5rem 0', fontWeight: 800, fontSize: '0.85rem', color: '#0B1E42', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {data.meda.softwarePlatformsHeading}
              </div>
              <div className="meda-tools-container">
                {data.meda.softwarePlatforms.map((tool, idx) => (
                  <div key={idx} className="meda-tool-pill-card">
                    <div className="meda-tool-icon-wrap">
                      {idx === 0 && <Cpu size={18} />}
                      {idx === 1 && <Boxes size={18} />}
                      {idx === 2 && <Wrench size={18} />}
                    </div>
                    <div className="meda-tool-desc">
                      <span className="meda-tool-title">{tool.name}</span> – {tool.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Areas of Learning */}
              <div className="meda-concepts-panel">
                <div className="meda-concepts-header">
                  <BookOpen size={16} /> {data.meda.learningAreasHeading}
                </div>
                <ul className="meda-concepts-grid">
                  {data.meda.learningAreas.map((concept, idx) => (
                    <li key={idx} className="meda-concept-row">
                      <span className="meda-concept-check">✓</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="meda-closing-note">{data.meda.closing}</p>
            </div>

            {/* Section 01 Photo Frame */}
            {hasPhotos && <RenderPhotoFrame index={1} />}
          </div>
        </div>
      </div>

      {/* Section 02: Product Lifecycle Management (PLM) */}
      <div className="meda-section-block">
        <div className="meda-section-banner">
          <div className="meda-section-banner-title">
            <span className="meda-section-num">02</span>
            <h2 className="meda-section-name">{data.plm.heading}</h2>
          </div>
        </div>

        <div className="meda-glass-card">
          <div className={`meda-glass-split ${hasPhotos ? 'has-photo reverse' : 'no-photo'}`}>
            {/* Section 02 Photo Frame */}
            {hasPhotos && <RenderPhotoFrame index={2} />}

            <div>
              <p className="meda-closing-note" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', fontStyle: 'normal', color: '#475569', fontSize: '0.975rem' }}>
                {data.plm.intro}
              </p>

              {/* Training Modules */}
              <div className="meda-concepts-panel" style={{ background: '#F8FAFC', marginBottom: '0.75rem' }}>
                <div className="meda-concepts-header">
                  <Workflow size={16} /> {data.plm.trainingHeading}
                </div>
                <ul className="meda-concepts-grid">
                  {data.plm.trainingItems.map((train, idx) => (
                    <li key={idx} className="meda-concept-row">
                      <span className="meda-concept-check" style={{ background: '#0070AD', color: '#FFFFFF' }}>✓</span>
                      <span>{train}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Siemens Teamcenter Box */}
              <div className="meda-tool-pill-card" style={{ borderLeftColor: '#C9973A', background: '#FFFDF7' }}>
                <div className="meda-tool-icon-wrap" style={{ background: 'rgba(201, 151, 58, 0.15)', color: '#C9973A' }}>
                  <Database size={18} />
                </div>
                <div className="meda-tool-desc">
                  <span className="meda-tool-title">{data.plm.teamcenter.heading}</span>
                  <p style={{ margin: '0.2rem 0 0 0', color: '#475569', fontSize: '0.85rem' }}>
                    {data.plm.teamcenter.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 03: Learning Outcomes & Opportunities */}
      <div className="meda-section-block">
        <div className="meda-section-banner" style={{ background: 'linear-gradient(90deg, #132A58 0%, #0B1E42 100%)' }}>
          <div className="meda-section-banner-title">
            <span className="meda-section-num" style={{ background: '#F8DA8D' }}>03</span>
            <h2 className="meda-section-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: '#F8DA8D' }} /> {data.outcomes.heading}
            </h2>
          </div>
        </div>

        <div className="meda-glass-card">
          <div className={`meda-glass-split ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
            <div>
              <p className="meda-closing-note" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', fontStyle: 'normal', color: '#475569', fontSize: '0.975rem' }}>
                {data.outcomes.intro}
              </p>

              <div style={{ margin: '0.75rem 0 0.5rem 0', fontWeight: 800, fontSize: '0.85rem', color: '#0B1E42', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {data.outcomes.opportunitiesHeading}
              </div>

              <div className="meda-outcomes-wrapper">
                {data.outcomes.opportunities.map((opp, idx) => (
                  <div key={idx} className="meda-outcome-box">
                    <div className="meda-outcome-icon-wrap">
                      <CheckCircle2 size={16} color="#0B1E42" />
                    </div>
                    <p className="meda-outcome-desc">{opp}</p>
                  </div>
                ))}
              </div>

              <p className="meda-closing-note">{data.outcomes.closing}</p>
            </div>

            {/* Section 03 Photo Frame */}
            {hasPhotos && <RenderPhotoFrame index={3} />}
          </div>
        </div>
      </div>

      {/* Dynamic Admin Custom Sections: Key Highlights / Facilities / Partners (if added in Admin) */}
      {(highlights.length > 0 || outcomes.length > 0) && (
        <div className="meda-matrix-wrapper">
          {/* Key Highlights */}
          {highlights.length > 0 && (
            <div className="meda-matrix-card">
              <div className="meda-matrix-head">
                <Sparkles size={16} style={{ color: '#C9973A' }} /> Key Highlights
              </div>
              <ul className="meda-matrix-items">
                {highlights.map((h, i) => (
                  <li key={i} className="meda-matrix-row">
                    <CheckCircle2 size={14} style={{ color: '#0070AD', flexShrink: 0, marginTop: 2 }} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {hasPhotos && <RenderPhotoFrame index={4} />}
            </div>
          )}

          {/* Outcomes & Achievements */}
          {outcomes.length > 0 && (
            <div className="meda-matrix-card">
              <div className="meda-matrix-head">
                <Award size={16} style={{ color: '#C9973A' }} /> Additional Achievements
              </div>
              <ul className="meda-matrix-items">
                {outcomes.map((o, i) => (
                  <li key={i} className="meda-matrix-row">
                    <Award size={14} style={{ color: '#C9973A', flexShrink: 0, marginTop: 2 }} />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
              {hasPhotos && <RenderPhotoFrame index={5} />}
            </div>
          )}
        </div>
      )}

      {/* Side-by-Side Row: Facilities & Equipment AND Partners (if added in Admin) */}
      {(facilities.length > 0 || partners.length > 0) && (
        <div className="meda-matrix-wrapper">
          {/* Facilities & Equipment */}
          {facilities.length > 0 && (
            <div className="meda-matrix-card">
              <div className="meda-matrix-head">
                <Settings size={16} style={{ color: '#0070AD' }} /> Facilities & Equipment
              </div>
              <ul className="meda-matrix-items">
                {facilities.map((f, i) => (
                  <li key={i} className="meda-matrix-row">
                    <Cpu size={14} style={{ color: '#0B1E42', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontWeight: 700 }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Partners */}
          {partners.length > 0 && (
            <div className="meda-matrix-card">
              <div className="meda-matrix-head">
                <Building2 size={16} style={{ color: '#0B1E42' }} /> Industry Partners
              </div>
              <ul className="meda-matrix-items">
                {partners.map((p, i) => (
                  <li key={i} className="meda-matrix-row" style={{ background: '#FFFDF5', borderColor: 'rgba(201, 151, 58, 0.3)' }}>
                    <Building2 size={14} style={{ color: '#C9973A', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontWeight: 800, color: '#0B1E42', fontSize: '0.95rem' }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Lightbox for Photos */}
      {lightboxImg && (
        <div className="meda-lightbox-backdrop" onClick={() => setLightboxImg(null)}>
          <div className="meda-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="meda-lightbox-close" onClick={() => setLightboxImg(null)}>
              <X size={28} />
            </button>
            <img loading="lazy" src={lightboxImg} alt="Enlarged photo" className="meda-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}
