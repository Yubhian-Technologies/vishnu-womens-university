import { useState } from 'react';
import type { CustomSection } from '../../lib/customSections';
import { CustomSectionsGalleries, CustomSectionsAccordion } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import { tiDspCoe } from './tiDspCoe.data';
import {
  Target,
  Compass,
  Mail,
  BookOpen,
  ChevronDown,
  Award,
  Cpu,
  Layers,
  FileText,
  Building2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import './TiDspPage.css';

interface TiDspPageProps {
  customSections?: CustomSection[];
}

export default function TiDspPage({ customSections = [] }: TiDspPageProps) {
  const {
    aboutTitle,
    overview,
    vision,
    mission,
    objectives,
    keyHighlights,
    facilitiesEquipment,
    industryAssociation,
    team,
    labDevelopment,
    societalImpact,
    researchOutputs,
    trainingActivities,
    trainingResearch,
  } = tiDspCoe;

  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [activeProjectYear, setActiveProjectYear] = useState<number>(0);

  const accordionSections = customSections.filter(
    (s) => s.id !== 'team' && !s.label.toLowerCase().includes('team')
  );

  return (
    <div className="ti-page-container">
      {/* 1. OVERVIEW & ABOUT THE CENTRE */}
      <section className="ti-overview-section">
        <div className="iic-card" style={{ marginBottom: '2rem' }}>
          <div className="iic-badge">
            <Sparkles size={14} /> Centre of Excellence
          </div>
          <h2 className="iic-card-title">{aboutTitle}</h2>
          {overview.map((p, i) => (
            <p key={i} className="iic-lead-text" style={{ marginBottom: i < overview.length - 1 ? '1rem' : 0 }}>
              {p}
            </p>
          ))}
        </div>

        {/* STATS STRIP */}
        <div className="ti-stats-strip">
          <div className="ti-stat-box">
            <div className="ti-stat-icon"><Cpu size={20} /></div>
            <div>
              <div className="ti-stat-val">TMS320C6713 DSKs</div>
              <div className="ti-stat-lbl">DSP Development Platforms</div>
            </div>
          </div>
          <div className="ti-stat-box">
            <div className="ti-stat-icon">₹10L</div>
            <div>
              <div className="ti-stat-val">₹10 Lakh</div>
              <div className="ti-stat-lbl">AICTE-MODROBS Lab Modernisation Funding</div>
            </div>
          </div>
          <div className="ti-stat-box">
            <div className="ti-stat-icon">₹53L</div>
            <div>
              <div className="ti-stat-val">₹53 Lakh</div>
              <div className="ti-stat-lbl">DST-Funded Telephony Speech Enhancement Research</div>
            </div>
          </div>
          <div className="ti-stat-box">
            <div className="ti-stat-icon">MAT</div>
            <div>
              <div className="ti-stat-val">MATLAB</div>
              <div className="ti-stat-lbl">Campus-Wide Academic Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISION & MISSION */}
      <section className="ti-vm-section">
        <div className="ti-vm-grid">
          {/* Vision */}
          <div className="ti-vm-card">
            <span className="ti-vm-badge">
              <Compass size={14} /> Strategic Vision
            </span>
            <h3 className="ti-vm-title">Our Vision</h3>
            <div className="ti-vision-text">
              &quot;{vision}&quot;
            </div>
          </div>

          {/* Mission */}
          <div className="ti-vm-card">
            <span className="ti-vm-badge">
              <Target size={14} /> Institutional Mission
            </span>
            <h3 className="ti-vm-title">Our Mission</h3>
            <ul className="ti-mission-list">
              {mission.map((item, idx) => (
                <li key={idx} className="ti-mission-item">
                  <span className="ti-mission-disc" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. CORE OBJECTIVES */}
      <section className="ti-objectives-section">
        <div className="ti-section-header">
          <span className="ti-section-label">Pillars of Excellence</span>
          <h2 className="ti-section-title">Core Objectives</h2>
        </div>

        <div className="ti-objectives-grid">
          {objectives.map((objStr, idx) => {
            const [title, ...descParts] = objStr.split(':');
            const desc = descParts.join(':').trim();
            return (
              <div key={idx} className="ti-obj-card">
                <div className="ti-obj-num">0{idx + 1}</div>
                <h4>0{idx + 1}. {title}</h4>
                <p>{desc || objStr}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LAB DEVELOPMENT & EXTERNAL SUPPORT + SOCIETAL IMPACT RESEARCH */}
      <section style={{ marginTop: '2.5rem' }}>
        <div className="iic-vision-mission-grid">
          {/* Lab Development & External Support */}
          <div className="iic-card">
            <div className="iic-badge cyan">
              <Building2 size={14} /> Modernisation & Support
            </div>
            <h3 className="iic-card-title">Lab Development & External Support</h3>
            {labDevelopment.map((p, i) => (
              <p key={i} className="iic-lead-text" style={{ marginBottom: i < labDevelopment.length - 1 ? '0.85rem' : 0, fontSize: '0.95rem' }}>
                {p}
              </p>
            ))}
          </div>

          {/* Societal Impact Research */}
          <div className="iic-card">
            <div className="iic-badge gold">
              <Award size={14} /> Research & Social Relevance
            </div>
            <h3 className="iic-card-title">Societal Impact Research</h3>
            {societalImpact.map((p, i) => (
              <p key={i} className="iic-lead-text" style={{ marginBottom: i < societalImpact.length - 1 ? '0.85rem' : 0, fontSize: '0.95rem' }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RESEARCH OUTPUTS & PUBLICATIONS */}
      <section style={{ marginTop: '2rem' }}>
        <div className="iic-card">
          <div className="iic-badge purple">
            <FileText size={14} /> Academic Publications
          </div>
          <h3 className="iic-card-title">{researchOutputs.title}</h3>
          <p className="iic-lead-text" style={{ marginBottom: '1rem' }}>
            {researchOutputs.intro}
          </p>
          <ul className="iic-checklist" style={{ marginBottom: '1.5rem' }}>
            {researchOutputs.areas.map((area, idx) => (
              <li key={idx}>
                <CheckCircle2 size={16} className="iic-check-icon gold" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0B1E42', marginBottom: '1rem' }}>
            Selected Publications & Presentations
          </h4>
          <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#4A5568', fontSize: '0.925rem', lineHeight: 1.6 }}>
            {researchOutputs.publications.map((pub, idx) => (
              <li key={idx} style={{ paddingLeft: '0.25rem' }}>
                {pub}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. TRAINING & ACADEMIC ACTIVITIES + KEY HIGHLIGHTS */}
      <section style={{ marginTop: '2rem' }}>
        <div className="iic-vision-mission-grid">
          {/* Training & Academic Activities */}
          <div className="iic-card">
            <div className="iic-badge">
              <BookOpen size={14} /> Workshops & Training
            </div>
            <h3 className="iic-card-title">{trainingActivities.title}</h3>
            <ul className="iic-checklist" style={{ marginTop: '1rem' }}>
              {trainingActivities.activities.map((act, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="iic-check-icon cyan" />
                  <strong style={{ color: '#0B1E42' }}>{act.title}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Highlights */}
          <div className="iic-card">
            <div className="iic-badge gold">
              <Award size={14} /> Key Achievements
            </div>
            <h3 className="iic-card-title">Key Highlights</h3>
            <ul className="iic-checklist" style={{ marginTop: '1rem' }}>
              {keyHighlights.map((hl, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="iic-check-icon gold" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. FACILITIES & EQUIPMENT + INDUSTRY ASSOCIATION */}
      <section style={{ marginTop: '2rem' }}>
        <div className="iic-vision-mission-grid">
          {/* Facilities & Equipment */}
          <div className="iic-card">
            <div className="iic-badge cyan">
              <Cpu size={14} /> Lab Infrastructure
            </div>
            <h3 className="iic-card-title">Facilities & Equipment</h3>
            <p className="iic-lead-text" style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
              The Centre provides access to a range of DSP and embedded-development resources, including:
            </p>
            <ul className="iic-checklist">
              {facilitiesEquipment.map((eq, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="iic-check-icon cyan" />
                  <span>{eq}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry Association */}
          <div className="iic-card">
            <div className="iic-badge purple">
              <Layers size={14} /> Industry Partnership
            </div>
            <h3 className="iic-card-title">{industryAssociation.title}</h3>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1E42', marginBottom: '0.5rem' }}>
                {industryAssociation.partner}
              </h4>
              <p style={{ color: '#4A5568', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                {industryAssociation.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. STUDENT PROJECTS & RESEARCH + YEAR-WISE ARCHIVE */}
      <section style={{ marginTop: '2rem' }}>
        <div className="iic-card">
          <div className="iic-badge gold">
            <BookOpen size={14} /> Project Work & Experimentation
          </div>
          <h3 className="iic-card-title">{trainingResearch.title}</h3>
          {trainingResearch.paragraphs.map((p, i) => (
            <p key={i} className="iic-lead-text" style={{ marginBottom: i < trainingResearch.paragraphs.length - 1 ? '0.85rem' : '1.5rem' }}>
              {p}
            </p>
          ))}

          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1E42', marginBottom: '1rem' }}>
            {trainingResearch.archiveTitle}
          </h4>

          {/* Year Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {trainingResearch.years.map((yearTab, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveProjectYear(idx)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeProjectYear === idx ? '#0B1E42' : '#edf2f7',
                  color: activeProjectYear === idx ? '#ffffff' : '#4a5568',
                  transition: 'all 0.2s ease',
                }}
              >
                {yearTab.label}
              </button>
            ))}
          </div>

          {/* Active Year Blocks */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
            {trainingResearch.years[activeProjectYear]?.blocks.map((block, idx) => {
              if (block.type === 'paragraph') {
                return (
                  <p key={idx} style={{ color: '#4A5568', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'heading') {
                return (
                  <h5 key={idx} style={{ fontSize: '1rem', fontWeight: 700, color: '#0B1E42', marginTop: '1rem', marginBottom: '0.5rem' }}>
                    {block.text}
                  </h5>
                );
              }
              if (block.type === 'bullets') {
                return (
                  <ul key={idx} className="iic-checklist" style={{ marginBottom: '1rem' }}>
                    {block.items.map((item, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} className="iic-check-icon cyan" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === 'numbered') {
                return (
                  <ol key={idx} style={{ paddingLeft: '1.25rem', marginBottom: '1rem', color: '#4A5568', fontSize: '0.925rem', lineHeight: 1.6 }}>
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                );
              }
              if (block.type === 'table') {
                return (
                  <div key={idx} style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                    <table className="iic-nisp-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          {block.headers.map((h, i) => (
                            <th key={i}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>

      {/* 9. TEAM & FACULTY (COLLAPSIBLE ACCORDION ITEM) */}
      <section className="ti-team-accordion-wrapper" style={{ marginTop: '2.5rem', marginBottom: '0.75rem' }}>
        <div className={`cs-accordion-item${isTeamOpen ? ' is-open' : ''}`}>
          <button
            type="button"
            className="cs-accordion-trigger"
            onClick={() => setIsTeamOpen(!isTeamOpen)}
            aria-expanded={isTeamOpen}
          >
            <span className="cs-accordion-num" aria-hidden="true">01</span>
            <span className="cs-accordion-title">Team (TI-DSP Centre of Excellence)</span>
            <ChevronDown size={18} strokeWidth={2.25} className="cs-accordion-chevron" aria-hidden="true" />
          </button>
          
          <SmoothCollapse open={isTeamOpen}>
            <div className="cs-accordion-body" style={{ padding: '2rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              {/* Faculty In-Charge */}
              <div className="ti-incharge-card">
                <div className="ti-incharge-avatar">
                  {team.inCharge.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <span className="ti-incharge-badge">Faculty In-Charge</span>
                  <h3 className="ti-incharge-name">{team.inCharge.name}</h3>
                  <div className="ti-incharge-desig">{team.inCharge.designation}</div>

                  <div className="ti-contact-meta">
                    {team.inCharge.email && (
                      <div className="ti-contact-item">
                        <Mail size={15} color="#c9973a" />
                        <a href={`mailto:${team.inCharge.email}`}>{team.inCharge.email}</a>
                      </div>
                    )}
                    {team.inCharge.interests && (
                      <div className="ti-contact-item">
                        <BookOpen size={15} color="#c9973a" />
                        <span><strong>Interests:</strong> {team.inCharge.interests}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Faculty Members Grid */}
              <div className="ti-faculty-grid">
                {team.facultyMembers.map((member, idx) => (
                  <div key={idx} className="ti-faculty-card">
                    <div className="ti-faculty-header">
                      <div className="ti-faculty-avatar">
                        {member.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="ti-faculty-name">{member.name}</h4>
                        <div className="ti-faculty-desig">{member.designation}</div>
                      </div>
                    </div>

                    <div className="ti-faculty-details">
                      {member.interests && (
                        <div><strong>Interests:</strong> {member.interests}</div>
                      )}
                      {member.email && (
                        <div style={{ wordBreak: 'break-all' }}>
                          <Mail size={13} style={{ display: 'inline', marginRight: 4 }} />
                          <a href={`mailto:${member.email}`} style={{ color: '#0b1e42' }}>{member.email}</a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SmoothCollapse>
        </div>
      </section>

      {/* 10. DYNAMIC CUSTOM SECTIONS ACCORDION (Starting at 02) */}
      {accordionSections.length > 0 && (
        <section className="ti-custom-sections">
          <CustomSectionsAccordion sections={accordionSections} startIndex={2} />
        </section>
      )}

      {/* 11. PHOTO GALLERIES (AT THE VERY BOTTOM OF THE PAGE) */}
      <section className="ti-custom-galleries" style={{ marginTop: '3.5rem' }}>
        <div className="gsac-gallery-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <span className="section-label">Gallery</span>
            <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Student Project Development Session</h2>
            <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Glimpses of practical learning, experimentation and project development at the TI-DSP Centre.</p>
          </div>
        </div>
        {customSections.length > 0 && (
          <CustomSectionsGalleries sections={customSections} />
        )}
      </section>
    </div>
  );
}
