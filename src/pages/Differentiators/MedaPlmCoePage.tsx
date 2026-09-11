import { useState } from 'react';
import {
  Award,
  BookOpen,
  Boxes,
  CheckCircle2,
  Cpu,
  Database,
  Settings,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
  Users,
  Briefcase,
  Building2,
  X,
  Maximize2,
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

  // Extract existing photos from custom sections safely (100% exact retention, no photos added or removed)
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
        <img src={photo.url} alt={photo.label} className="meda-photo-frame-img" />
        <div className="meda-photo-frame-caption">
          <span>{photo.label}</span>
          <Maximize2 size={14} />
        </div>
      </div>
    );
  };

  const hasPhotos = galleryItems.length > 0;

  return (
    <div className="meda-plm-container">
      {/* MoU Executive Hero Banner (Paired with Photo 0) */}
      <section className={`meda-hero-banner ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
        <div>
          <div className="meda-hero-badge">
            <Sparkles size={14} /> Capgemini Collaboration MoU
          </div>
          <p className="meda-hero-text">{medaPlmCoe.intro}</p>
        </div>
        {hasPhotos && <RenderPhotoFrame index={0} />}
      </section>

      {/* Section 01: Mechanical Engineering Design Automation (MEDA) */}
      <div className="meda-section-block">
        <div className="meda-section-banner">
          <div className="meda-section-banner-title">
            <span className="meda-section-num">01</span>
            <h2 className="meda-section-name">{medaPlmCoe.meda.heading}</h2>
          </div>
        </div>

        <div className="meda-glass-card">
          <div className={`meda-glass-split ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
            <div>
              <p className="meda-closing-note" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', fontStyle: 'normal', color: '#475569', fontSize: '0.975rem' }}>
                {medaPlmCoe.meda.intro}
              </p>

              {/* Software Tools List */}
              <div className="meda-tools-container">
                <div className="meda-tool-pill-card">
                  <div className="meda-tool-icon-wrap">
                    <Cpu size={18} />
                  </div>
                  <div className="meda-tool-desc">
                    <span className="meda-tool-title">CATIA</span> – for 3D modeling, assembly design, and drafting.
                  </div>
                </div>

                <div className="meda-tool-pill-card">
                  <div className="meda-tool-icon-wrap">
                    <Boxes size={18} />
                  </div>
                  <div className="meda-tool-desc">
                    <span className="meda-tool-title">Siemens NX CAD</span> – for advanced parametric modeling, sheet metal design, and surface modeling.
                  </div>
                </div>

                <div className="meda-tool-pill-card">
                  <div className="meda-tool-icon-wrap">
                    <Wrench size={18} />
                  </div>
                  <div className="meda-tool-desc">
                    <span className="meda-tool-title">ANSYS</span> – for finite element analysis (FEA), structural, thermal, and dynamic simulation.
                  </div>
                </div>
              </div>

              {/* Technical Concepts */}
              <div className="meda-concepts-panel">
                <div className="meda-concepts-header">
                  <BookOpen size={16} /> {medaPlmCoe.meda.conceptsIntro}
                </div>
                <ul className="meda-concepts-grid">
                  {medaPlmCoe.meda.concepts.map((concept, idx) => (
                    <li key={idx} className="meda-concept-row">
                      <span className="meda-concept-check">✓</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="meda-closing-note">{medaPlmCoe.meda.closing}</p>
            </div>

            {/* Section 01 Photo Frame */}
            {hasPhotos && <RenderPhotoFrame index={1} />}
          </div>
        </div>
      </div>

      {/* Section 02: Product Life Cycle Management (PLM) */}
      <div className="meda-section-block">
        <div className="meda-section-banner">
          <div className="meda-section-banner-title">
            <span className="meda-section-num">02</span>
            <h2 className="meda-section-name">{medaPlmCoe.plm.heading}</h2>
          </div>
        </div>

        <div className="meda-glass-card">
          <div className={`meda-glass-split ${hasPhotos ? 'has-photo reverse' : 'no-photo'}`}>
            {/* Section 02 Photo Frame */}
            {hasPhotos && <RenderPhotoFrame index={2} />}

            <div>
              <p className="meda-closing-note" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', fontStyle: 'normal', color: '#475569', fontSize: '0.975rem' }}>
                {medaPlmCoe.plm.intro}
              </p>

              {/* Training Modules */}
              <div className="meda-tools-container">
                {medaPlmCoe.plm.training.map((train, idx) => (
                  <div key={idx} className="meda-tool-pill-card" style={{ borderLeftColor: '#0B1E42' }}>
                    <div className="meda-tool-icon-wrap" style={{ background: 'rgba(11, 30, 66, 0.08)', color: '#0B1E42' }}>
                      <Workflow size={18} />
                    </div>
                    <div className="meda-tool-desc">{train}</div>
                  </div>
                ))}
              </div>

              {/* Siemens Teamcenter Capabilities */}
              <div className="meda-concepts-panel" style={{ background: '#F8FAFC' }}>
                <div className="meda-concepts-header">
                  <Database size={16} /> {medaPlmCoe.plm.teamcenterIntro}
                </div>
                <ul className="meda-concepts-grid">
                  {medaPlmCoe.plm.teamcenter.map((tc, idx) => (
                    <li key={idx} className="meda-concept-row">
                      <span className="meda-concept-check" style={{ background: '#C9973A', color: '#0B1E42' }}>✓</span>
                      <span>{tc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 03: Outcome and Benefits */}
      <div className="meda-section-block">
        <div className="meda-section-banner" style={{ background: 'linear-gradient(90deg, #132A58 0%, #0B1E42 100%)' }}>
          <div className="meda-section-banner-title">
            <span className="meda-section-num" style={{ background: '#F8DA8D' }}>03</span>
            <h2 className="meda-section-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: '#F8DA8D' }} /> {medaPlmCoe.outcomeHeading}
            </h2>
          </div>
        </div>

        <div className="meda-glass-card">
          <div className={`meda-glass-split ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
            <div className="meda-outcomes-wrapper">
              {medaPlmCoe.outcomes.map((outcome, idx) => (
                <div key={idx} className="meda-outcome-box">
                  <div className="meda-outcome-icon-wrap">
                    {idx === 0 && <Users size={18} />}
                    {idx === 1 && <ShieldCheck size={18} />}
                    {idx === 2 && <Briefcase size={18} />}
                    {idx === 3 && <CheckCircle2 size={18} />}
                  </div>
                  <p className="meda-outcome-desc">{outcome}</p>
                </div>
              ))}
            </div>

            {/* Section 03 Photo Frame */}
            {hasPhotos && <RenderPhotoFrame index={3} />}
          </div>
        </div>
      </div>

      {/* Sections 04 & 06 Tall Cards with Photos Row */}
      <div className="meda-matrix-wrapper">
        {/* 04 Key Highlights */}
        {highlights.length > 0 && (
          <div className="meda-matrix-card">
            <div className="meda-matrix-head">
              <span className="meda-section-num" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>04</span>
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

        {/* 06 Outcomes & Achievements */}
        {outcomes.length > 0 && (
          <div className="meda-matrix-card">
            <div className="meda-matrix-head">
              <span className="meda-section-num" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>06</span>
              <Award size={16} style={{ color: '#C9973A' }} /> Outcomes & Achievements
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

      {/* Side-by-Side Row: 05 Facilities & Equipment AND 07 Partners Horizontal Cards */}
      <div className="meda-matrix-wrapper">
        {/* 05 Facilities & Equipment */}
        {facilities.length > 0 && (
          <div className="meda-matrix-card">
            <div className="meda-matrix-head">
              <span className="meda-section-num" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>05</span>
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

        {/* 07 Partners */}
        {partners.length > 0 && (
          <div className="meda-matrix-card">
            <div className="meda-matrix-head">
              <span className="meda-section-num" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>07</span>
              <Building2 size={16} style={{ color: '#0B1E42' }} /> Partners
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

      {/* Lightbox for Photos */}
      {lightboxImg && (
        <div className="meda-lightbox-backdrop" onClick={() => setLightboxImg(null)}>
          <div className="meda-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="meda-lightbox-close" onClick={() => setLightboxImg(null)}>
              <X size={28} />
            </button>
            <img src={lightboxImg} alt="Enlarged photo" className="meda-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}
