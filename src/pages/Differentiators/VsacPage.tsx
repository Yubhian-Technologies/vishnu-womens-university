import { useState } from 'react';
import {
  Radio,
  Compass,
  Target,
  Users,
  Building2,
  Image as ImageIcon,
  X,
  BookOpen,
  Cpu,
  Globe2,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { vsac, type VsacMember, type SimpleTable } from './vsac.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import './VsacPage.css';

interface VsacPageProps {
  item: DifferentiatorItemDoc;
  sections: CustomSection[];
}

export default function VsacPage({ sections }: VsacPageProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Extract existing photos safely (100% exact retention, no photos added or removed)
  const gallerySection = sections.find(
    (s) => s.id === 'gallery' || s.label?.toLowerCase() === 'gallery' || s.contentType === 'gallery'
  );
  const galleryItems: { url: string; label: string }[] = [];

  if (gallerySection) {
    if (gallerySection.galleryPhotos) {
      gallerySection.galleryPhotos.forEach((p, idx) => {
        if (p.imageUrl) galleryItems.push({ url: p.imageUrl, label: p.caption || `VSAC Space Photo ${idx + 1}` });
      });
    } else if (gallerySection.files) {
      gallerySection.files.forEach((f, idx) => {
        if (f.fileUrl) galleryItems.push({ url: f.fileUrl, label: f.label || `VSAC Space Photo ${idx + 1}` });
      });
    } else if (gallerySection.imageCards) {
      gallerySection.imageCards.forEach((c, idx) => {
        if (c.imageUrl) galleryItems.push({ url: c.imageUrl, label: c.title || `VSAC Space Photo ${idx + 1}` });
      });
    }
  }

  // Helper component to render a section's assigned photo frame using modulo index
  const RenderPhotoFrame = ({ index }: { index: number }) => {
    if (galleryItems.length === 0) return null;
    const photo = galleryItems[index % galleryItems.length];
    return (
      <div className="vsac-photo-frame" onClick={() => setLightboxImg(photo.url)}>
        <img src={photo.url} alt={photo.label} className="vsac-photo-frame-img" />
        <div className="vsac-photo-frame-caption">
          <span>{photo.label}</span>
          <Maximize2 size={12} />
        </div>
      </div>
    );
  };

  const hasPhotos = galleryItems.length > 0;

  // Helper component to render an expandable table (+ to see entire list, - to collapse)
  const RenderTable = ({ table }: { table: SimpleTable }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const PREVIEW_COUNT = 5;
    const isExpandable = table.rows.length > PREVIEW_COUNT;
    const visibleRows = isExpandable && !isExpanded ? table.rows.slice(0, PREVIEW_COUNT) : table.rows;

    return (
      <div>
        <div className="vsac-table-container">
          <table className="vsac-table">
            <thead>
              <tr>
                {table.headers.map((h, idx) => (
                  <th key={idx}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isExpandable && (
          <div className="vsac-expand-wrap">
            <button
              className={`vsac-expand-btn ${isExpanded ? 'expanded' : ''}`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? `- Show Less (${PREVIEW_COUNT} entries)` : `+ View Entire List (${table.rows.length} entries)`}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="vsac-container" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* Telemetry Mission Control Header Banner (Paired with Photo 0) */}
      <section className={`vsac-telemetry-banner ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
        <div>
          <div className="vsac-callsign-bar">
            <span className="vsac-callsign-badge">
              <Radio size={14} /> CALL SIGN: VU2VEP
            </span>
            <span className="vsac-spec-chip">
              <Globe2 size={12} /> Frequency: 2200–2290 MHz (S-Band)
            </span>
            <span className="vsac-spec-chip">
              <Cpu size={12} /> 3m Parabolic Mesh Reflector (35.4 dBi)
            </span>
            <span className="vsac-spec-chip">
              <Building2 size={12} /> Partner: Dhruva Space
            </span>
          </div>

          {vsac.paragraphs.map((para, idx) => (
            <p key={idx} className="vsac-overview-text">
              {para}
            </p>
          ))}
        </div>
        {hasPhotos && <RenderPhotoFrame index={0} />}
      </section>

      {/* Orbit Directives: Vision, Mission & Objectives (Paired with Photo 1) */}
      <div className="vsac-block">
        <div className="vsac-block-header">
          <h2 className="vsac-block-title">
            <Target size={18} style={{ color: '#00E5FF' }} /> Mission Control Directives
          </h2>
        </div>
        <div className="vsac-block-body">
          <div className={`vsac-split ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
            <div className="vsac-orbit-grid">
              {/* Vision */}
              <div className="vsac-orbit-card">
                <div className="vsac-orbit-title">
                  <Compass size={16} style={{ color: '#00E5FF' }} /> Vision
                </div>
                <p className="vsac-orbit-item" style={{ fontStyle: 'italic', fontWeight: 600 }}>
                  {vsac.vision}
                </p>

                <div className="vsac-orbit-title" style={{ marginTop: 'var(--space-3)' }}>
                  <Sparkles size={16} style={{ color: '#FFB300' }} /> Mission
                </div>
                <ul className="vsac-orbit-list">
                  {vsac.mission.map((m, idx) => (
                    <li key={idx} className="vsac-orbit-item">
                      <span className="vsac-orbit-dot">✓</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Objectives */}
              <div className="vsac-orbit-card" style={{ borderLeftColor: '#FFB300' }}>
                <div className="vsac-orbit-title">
                  <Target size={16} style={{ color: '#FFB300' }} /> Objectives
                </div>
                <ul className="vsac-orbit-list">
                  {vsac.objectives.map((obj, idx) => (
                    <li key={idx} className="vsac-orbit-item">
                      <span className="vsac-orbit-dot" style={{ background: '#FFB300', color: '#070F26' }}>
                        ✓
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Photo 1 */}
            {hasPhotos && <RenderPhotoFrame index={1} />}
          </div>
        </div>
      </div>

      {/* Flight Operations Team (HAM Radio Operators) */}
      <div className="vsac-block">
        <div className="vsac-block-header">
          <h2 className="vsac-block-title">
            <Users size={18} style={{ color: '#00E5FF' }} /> Flight Operations Team & HAM Radio Operators
          </h2>
        </div>
        <div className="vsac-block-body">
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#070F26', textTransform: 'uppercase', marginBottom: 'var(--space-2)', letterSpacing: '0.05em' }}>
            Faculty In-Charge
          </h3>
          <div className="vsac-team-grid" style={{ marginBottom: 'var(--space-3)' }}>
            {vsac.team.inCharge.map((member: VsacMember, idx: number) => (
              <div key={idx} className="vsac-team-card" style={{ borderLeft: '3px solid #00E5FF' }}>
                <div className="vsac-team-top">
                  <div>
                    <h4 className="vsac-team-name">{member.name}</h4>
                    <span className="vsac-team-role">{member.designation}</span>
                  </div>
                  {member.callSign && <span className="vsac-ham-badge">{member.callSign}</span>}
                </div>
                <div className="vsac-team-meta">
                  {member.interests && <span>Interests: {member.interests}</span>}
                  {member.email && <span>Email: {member.email}</span>}
                  {member.mobile && <span>Mobile: {member.mobile}</span>}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#070F26', textTransform: 'uppercase', marginBottom: 'var(--space-2)', letterSpacing: '0.05em' }}>
            Faculty Team Members
          </h3>
          <div className="vsac-team-grid">
            {vsac.team.facultyMembers.map((member: VsacMember, idx: number) => (
              <div key={idx} className="vsac-team-card">
                <div className="vsac-team-top">
                  <div>
                    <h4 className="vsac-team-name">{member.name}</h4>
                    <span className="vsac-team-role">{member.designation}</span>
                  </div>
                  {member.callSign && <span className="vsac-ham-badge">{member.callSign}</span>}
                </div>
                <div className="vsac-team-meta">
                  {member.interests && <span>Interests: {member.interests}</span>}
                  {member.email && <span>Email: {member.email}</span>}
                  {member.mobile && <span>Mobile: {member.mobile}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training & Research Operations (Paired with Photo 2) */}
      <div className="vsac-block">
        <div className="vsac-block-header">
          <h2 className="vsac-block-title">
            <BookOpen size={18} style={{ color: '#00E5FF' }} /> Space Research & Training Operations
          </h2>
        </div>
        <div className="vsac-block-body">
          <div className={`vsac-split ${hasPhotos ? 'has-photo reverse' : 'no-photo'}`}>
            {/* Photo 2 */}
            {hasPhotos && <RenderPhotoFrame index={2} />}

            <div>
              {/* Tab Switcher */}
              <div className="vsac-tabs-bar">
                {vsac.trainingResearch.map((item, idx) => (
                  <button
                    key={idx}
                    className={`vsac-tab-btn ${activeTab === idx ? 'active' : ''}`}
                    onClick={() => setActiveTab(idx)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Active Training Section Content */}
              {vsac.trainingResearch[activeTab] && (
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#070F26', marginBottom: 'var(--space-2)' }}>
                    {vsac.trainingResearch[activeTab].title}
                  </h3>
                  {vsac.trainingResearch[activeTab].paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="vsac-orbit-item" style={{ marginBottom: 'var(--space-2)' }}>
                      {p}
                    </p>
                  ))}

                  {vsac.trainingResearch[activeTab].table && (
                    <RenderTable table={vsac.trainingResearch[activeTab].table!} />
                  )}

                  {vsac.trainingResearch[activeTab].secondParagraph && (
                    <p className="vsac-orbit-item" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      {vsac.trainingResearch[activeTab].secondParagraph}
                    </p>
                  )}

                  {vsac.trainingResearch[activeTab].secondTable && (
                    <RenderTable table={vsac.trainingResearch[activeTab].secondTable!} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Industry Collaboration & Social Impact (Paired with Photo 3) */}
      <div className="vsac-block">
        <div className="vsac-block-header">
          <h2 className="vsac-block-title">
            <Building2 size={18} style={{ color: '#00E5FF' }} /> Industry Collaboration & Social Impact
          </h2>
        </div>
        <div className="vsac-block-body">
          <div className={`vsac-split ${hasPhotos ? 'has-photo' : 'no-photo'}`} style={{ marginBottom: 'var(--space-3)' }}>
            <div>
              {/* Dhruva Space Collaboration */}
              {vsac.collaborations[0] && (
                <div className="vsac-orbit-card" style={{ borderLeftColor: '#070F26' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#070F26', marginBottom: 'var(--space-2)' }}>
                    {vsac.collaborations[0].title}
                  </h3>
                  {vsac.collaborations[0].paragraphs?.map((p, idx) => (
                    <p key={idx} className="vsac-orbit-item">
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Photo 3 */}
            {hasPhotos && <RenderPhotoFrame index={3} />}
          </div>

          {/* Social Impacts Grid */}
          {vsac.collaborations[1] && (
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#070F26', marginBottom: 'var(--space-2)' }}>
                {vsac.collaborations[1].title}
              </h3>
              {vsac.collaborations[1].intro && (
                <p className="vsac-orbit-item" style={{ marginBottom: 'var(--space-2)' }}>
                  {vsac.collaborations[1].intro}
                </p>
              )}
              <div className="vsac-bullets-grid">
                {vsac.collaborations[1].bullets?.map((b, bIdx) => (
                  <div key={bIdx} className="vsac-bullet-card">
                    <span className="vsac-bullet-lead">{b.lead}</span>
                    <span className="vsac-bullet-text">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outcomes Grid */}
          {vsac.collaborations[2] && (
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#070F26', marginBottom: 'var(--space-2)' }}>
                {vsac.collaborations[2].title}
              </h3>
              {vsac.collaborations[2].intro && (
                <p className="vsac-orbit-item" style={{ marginBottom: 'var(--space-2)' }}>
                  {vsac.collaborations[2].intro}
                </p>
              )}
              <div className="vsac-bullets-grid">
                {vsac.collaborations[2].bullets?.map((b, bIdx) => (
                  <div key={bIdx} className="vsac-bullet-card" style={{ borderLeft: '3px solid #FFB300' }}>
                    <span className="vsac-bullet-lead">{b.lead}</span>
                    <span className="vsac-bullet-text">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Satellite Photo Gallery Showcase (Using Existing Photos) */}
      {galleryItems.length > 0 && (
        <div className="vsac-block">
          <div className="vsac-block-header">
            <h2 className="vsac-block-title">
              <ImageIcon size={18} style={{ color: '#00E5FF' }} /> Satellite Ground Station Gallery
            </h2>
          </div>
          <div className="vsac-block-body">
            <div className="vsac-gallery-grid">
              {galleryItems.map((photo, idx) => (
                <div key={idx} className="vsac-gallery-card" onClick={() => setLightboxImg(photo.url)}>
                  <img src={photo.url} alt={photo.label} className="vsac-gallery-img" />
                  <div className="vsac-gallery-overlay">
                    <span>{photo.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Lightbox */}
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
