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
  ChevronDown
} from 'lucide-react';
import './TiDspPage.css';

interface TiDspPageProps {
  customSections?: CustomSection[];
}

export default function TiDspPage({ customSections = [] }: TiDspPageProps) {
  const { overview, vision, mission, objectives, team } = tiDspCoe;
  const [isTeamOpen, setIsTeamOpen] = useState(true);

  const accordionSections = customSections.filter(
    (s) => s.id !== 'team' && !s.label.toLowerCase().includes('team')
  );

  return (
    <div className="ti-page-container">
      {/* 1. OVERVIEW & LAB CAPABILITIES */}
      <section className="ti-overview-section">
        <div className="ti-overview-paragraph">
          <p>{overview}</p>
        </div>

        <div className="ti-stats-strip">
          <div className="ti-stat-box">
            <div className="ti-stat-icon">01</div>
            <div>
              <div className="ti-stat-val">TMS320C6713</div>
              <div className="ti-stat-lbl">TI DSP Starter Kits & Starter Kits</div>
            </div>
          </div>
          <div className="ti-stat-box">
            <div className="ti-stat-icon">10L</div>
            <div>
              <div className="ti-stat-val">AICTE MODROBS</div>
              <div className="ti-stat-lbl">Lab Modernization Funding</div>
            </div>
          </div>
          <div className="ti-stat-box">
            <div className="ti-stat-icon">53L</div>
            <div>
              <div className="ti-stat-val">DST Research Project</div>
              <div className="ti-stat-lbl">Telephony Speech Enhancement</div>
            </div>
          </div>
          <div className="ti-stat-box">
            <div className="ti-stat-icon">MAT</div>
            <div>
              <div className="ti-stat-val">MATLAB License</div>
              <div className="ti-stat-lbl">Campus Unlimited Access</div>
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
              "{vision}"
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
                <h4>{title}</h4>
                <p>{desc || objStr}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TEAM & FACULTY (COLLAPSIBLE ACCORDION ITEM 01) */}
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

      {/* 5. DYNAMIC CUSTOM SECTIONS ACCORDION (Starting at 02) */}
      {accordionSections.length > 0 && (
        <section className="ti-custom-sections">
          <CustomSectionsAccordion sections={accordionSections} startIndex={2} />
        </section>
      )}

      {/* 6. PHOTO GALLERIES (AT THE VERY BOTTOM OF THE PAGE) */}
      {customSections.length > 0 && (
        <section className="ti-custom-galleries" style={{ marginTop: '3.5rem' }}>
          <CustomSectionsGalleries sections={customSections} />
        </section>
      )}
    </div>
  );
}
