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
  Award,
  CheckCircle2,
} from 'lucide-react';
import { CustomSectionsIntro, CustomSectionsGalleries, CustomSectionsAccordion } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { hasCustomSectionContent } from '../../lib/customSections';
import { useDocument } from '../../hooks/useDocument';
import type { VsacDoc } from '../Admin/sections/VsacContentAdmin';
import { vsac, type VsacMember, type SimpleTable } from './vsac.data';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import { renderBold } from '../../lib/boldText';
import './VsacPage.css';

interface VsacPageProps {
  item: DifferentiatorItemDoc;
  sections: CustomSection[];
}

export default function VsacPage({ item, sections }: VsacPageProps) {
  const { data: remoteData } = useDocument<VsacDoc>('settings', 'vsac');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const rawParagraphs = remoteData?.paragraphs && remoteData.paragraphs.length > 0 ? remoteData.paragraphs : vsac.paragraphs;
  const rawVision = remoteData?.vision || vsac.vision;
  const rawMission = remoteData?.mission && remoteData.mission.length > 0 ? remoteData.mission : vsac.mission;
  const rawObjectives = remoteData?.objectives && remoteData.objectives.length > 0 ? remoteData.objectives : vsac.objectives;
  const trainingResearch = remoteData?.trainingResearch && remoteData.trainingResearch.length > 0 ? remoteData.trainingResearch : vsac.trainingResearch;
  const industryCollaboration = remoteData?.industryCollaboration || vsac.industryCollaboration;
  const additionalSections = remoteData?.additionalSections || [];

  const aboutParagraphs = (item?.description && hasCustomSectionContent(item.description) && item.description.textContent)
    ? [item.description.textContent]
    : item?.desc
    ? [item.desc]
    : rawParagraphs;

  const visionText = (item?.vision && hasCustomSectionContent(item.vision) && (item.vision.textContent || item.vision.listText)) || rawVision;

  const missionList = (item?.mission && hasCustomSectionContent(item.mission) && (item.mission.listText?.split('\n').filter(Boolean) || [item.mission.textContent || ''])) || rawMission;

  const objectivesList = (item?.objectives && hasCustomSectionContent(item.objectives) && (item.objectives.listText?.split('\n').filter(Boolean) || [item.objectives.textContent || ''])) || rawObjectives;

  // Extract existing photos safely
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

  const RenderPhotoFrame = ({ index }: { index: number }) => {
    if (galleryItems.length === 0) return null;
    const photo = galleryItems[index % galleryItems.length];
    return (
      <div className="vsac-photo-frame" onClick={() => setLightboxImg(photo.url)}>
        <img loading="lazy" src={photo.url} alt={photo.label} className="vsac-photo-frame-img" />
        <div className="vsac-photo-frame-caption">
          <span>{photo.label}</span>
          <Maximize2 size={12} />
        </div>
      </div>
    );
  };

  const hasPhotos = galleryItems.length > 0;

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
                  {row.cells.map((cell, cIdx) => (
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
      {/* 1. ABOUT VSAC & TELEMETRY HEADER BANNER */}
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

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00E5FF', margin: '1rem 0 0.85rem', letterSpacing: '0.05em' }}>
            {item?.title || vsac.aboutTitle}
          </h2>

          {aboutParagraphs.map((para, idx) => (
            <p key={idx} className="vsac-overview-text">
              {renderBold(para)}
            </p>
          ))}
        </div>
        {hasPhotos && <RenderPhotoFrame index={0} />}
      </section>

      {/* 2. VISION, MISSION & OBJECTIVES */}
      <div className="vsac-block">
        <div className="vsac-block-header">
          <h2 className="vsac-block-title">
            <Target size={18} style={{ color: '#00E5FF' }} /> Mission Control Directives
          </h2>
        </div>
        <div className="vsac-block-body">
          <div className={`vsac-split ${hasPhotos ? 'has-photo' : 'no-photo'}`}>
            <div className="vsac-orbit-grid">
              {/* Vision & Mission */}
              <div className="vsac-orbit-card">
                <div className="vsac-orbit-title">
                  <Compass size={16} style={{ color: '#00E5FF' }} /> {vsac.visionTitle}
                </div>
                <p className="vsac-orbit-item" style={{ fontStyle: 'italic', fontWeight: 500, lineHeight: 1.6, color: '#334155' }}>
                  &ldquo;{renderBold(visionText)}&rdquo;
                </p>

                <div className="vsac-orbit-title" style={{ marginTop: '1.25rem' }}>
                  <Sparkles size={16} style={{ color: '#FFB300' }} /> {vsac.missionTitle}
                </div>
                <ul className="vsac-orbit-list">
                  {missionList.map((m, idx) => (
                    <li key={idx} className="vsac-orbit-item">
                      <span className="vsac-orbit-dot">✓</span>
                      <span>{renderBold(m)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Objectives */}
              <div className="vsac-orbit-card" style={{ borderLeftColor: '#FFB300' }}>
                <div className="vsac-orbit-title">
                  <Target size={16} style={{ color: '#FFB300' }} /> {vsac.objectivesTitle}
                </div>
                <ul className="vsac-orbit-list">
                  {objectivesList.map((obj, idx) => (
                    <li key={idx} className="vsac-orbit-item">
                      <span className="vsac-orbit-dot" style={{ background: '#FFB300', color: '#070F26' }}>
                        ✓
                      </span>
                      <span>{renderBold(obj)}</span>
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

      {/* 3. FLIGHT OPERATIONS TEAM */}
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

      {/* 4. SPACE RESEARCH & TRAINING OPERATIONS */}
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
                {trainingResearch.map((item, idx) => (
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
              {trainingResearch[activeTab] && (
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#070F26', marginBottom: 'var(--space-2)' }}>
                    {trainingResearch[activeTab].title}
                  </h3>
                  {trainingResearch[activeTab].paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="vsac-orbit-item" style={{ marginBottom: 'var(--space-2)', lineHeight: 1.6 }}>
                      {renderBold(p)}
                    </p>
                  ))}

                  {trainingResearch[activeTab].table && (
                    <RenderTable table={trainingResearch[activeTab].table!} />
                  )}

                  {trainingResearch[activeTab].secondParagraph && (
                    <p className="vsac-orbit-item" style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)', lineHeight: 1.6 }}>
                      {trainingResearch[activeTab].secondParagraph}
                    </p>
                  )}

                  {trainingResearch[activeTab].secondTable && (
                    <RenderTable table={trainingResearch[activeTab].secondTable!} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. DHRUVA SPACE COLLABORATION */}
      <div className="vsac-block">
        <div className="vsac-block-header">
          <h2 className="vsac-block-title">
            <Building2 size={18} style={{ color: '#00E5FF' }} /> {industryCollaboration.title}
          </h2>
        </div>
        <div className="vsac-block-body">
          <div className="vsac-orbit-card" style={{ borderLeftColor: '#00E5FF', background: '#FFFFFF' }}>
            {industryCollaboration.paragraphs.map((p, idx) => (
              <p key={idx} className="vsac-orbit-item" style={{ color: '#334155', lineHeight: 1.65, marginBottom: idx < industryCollaboration.paragraphs.length - 1 ? '0.75rem' : 0 }}>
                {renderBold(p)}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 6. EXTENDING THE IMPACT OF SPACE EDUCATION (SOCIAL IMPACT) */}
      <div className="vsac-block">
        <div className="vsac-block-header">
          <h2 className="vsac-block-title">
            <Globe2 size={18} style={{ color: '#00E5FF' }} /> {vsac.socialImpacts.title}
          </h2>
        </div>
        <div className="vsac-block-body">
          <div className="vsac-bullets-grid">
            {vsac.socialImpacts.bullets.map((b, bIdx) => (
              <div key={bIdx} className="vsac-bullet-card">
                <span className="vsac-bullet-lead">{b.lead}</span>
                <span className="vsac-bullet-text">{renderBold(b.text)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. LEARNING OUTCOMES */}
      <div className="vsac-block">
        <div className="vsac-block-header">
          <h2 className="vsac-block-title">
            <Award size={18} style={{ color: '#FFB300' }} /> {vsac.learningOutcomes.title}
          </h2>
        </div>
        <div className="vsac-block-body">
          <div className="vsac-bullets-grid">
            {vsac.learningOutcomes.bullets.map((b, bIdx) => (
              <div key={bIdx} className="vsac-bullet-card" style={{ borderLeft: '3px solid #FFB300' }}>
                <span className="vsac-bullet-lead">{b.lead}</span>
                <span className="vsac-bullet-text">{renderBold(b.text)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. GALLERY SHOWCASE */}
      {galleryItems.length > 0 && (
        <div className="vsac-block">
          <div className="vsac-block-header">
            <div>
              <h2 className="vsac-block-title">
                <ImageIcon size={18} style={{ color: '#00E5FF' }} /> {vsac.galleryTitle}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '0.2rem 0 0', fontWeight: 500 }}>
                {renderBold(vsac.galleryCaption)}
              </p>
            </div>
          </div>
          <div className="vsac-block-body">
            <div className="vsac-gallery-grid">
              {galleryItems.map((photo, idx) => (
                <div key={idx} className="vsac-gallery-card" onClick={() => setLightboxImg(photo.url)}>
                  <img loading="lazy" src={photo.url} alt={photo.label} className="vsac-gallery-img" />
                  <div className="vsac-gallery-overlay">
                    <span>{photo.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC CUSTOM SECTIONS */}
      {sections.some((s) => s.placement === 'intro') && (
        <div style={{ marginTop: '2rem' }}>
          <CustomSectionsIntro sections={sections} />
        </div>
      )}
      <div style={{ marginTop: '2rem' }}>
        <CustomSectionsGalleries sections={sections} />
        <CustomSectionsAccordion sections={sections.filter((s) => s.placement !== 'intro' && s.contentType !== 'gallery' && s.id !== 'gallery')} />
      </div>

      {/* Dynamic Additional Sections from Admin */}
      {additionalSections.length > 0 && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {additionalSections.map((sec) => (
            <div key={sec.id} className="vsac-block">
              <div className="vsac-block-header">
                <h2 className="vsac-block-title">
                  <Sparkles size={18} style={{ color: '#00E5FF' }} /> {sec.title}
                </h2>
                {sec.badge && <span className="vsac-block-tag">{sec.badge}</span>}
              </div>
              <div className="vsac-block-body">
                {(sec.paragraphs || []).map((p, pIdx) => (
                  <p key={pIdx} className="vsac-block-text" style={{ marginBottom: '0.75rem' }}>
                    {renderBold(p)}
                  </p>
                ))}
                {(sec.bulletPoints || []).length > 0 && (
                  <ul className="vsac-mission-list" style={{ marginTop: '0.75rem' }}>
                    {sec.bulletPoints!.map((b, bIdx) => (
                      <li key={bIdx} className="vsac-mission-item">
                        <CheckCircle2 size={16} style={{ color: '#00E5FF', flexShrink: 0, marginTop: 3 }} />
                        <span>{renderBold(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
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
