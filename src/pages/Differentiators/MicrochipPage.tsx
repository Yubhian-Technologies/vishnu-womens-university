import { useState } from 'react';
import type { CustomSection } from '../../lib/customSections';
import { CustomSectionsGalleries, CustomSectionsAccordion } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import { microchipEmbedded } from './microchipEmbedded.data';
import {
  Target,
  Compass,
  Mail,
  ExternalLink,
  BookOpen,
  Radio,
  ChevronDown
} from 'lucide-react';
import './MicrochipPage.css';

interface MicrochipPageProps {
  customSections?: CustomSection[];
}

export default function MicrochipPage({ customSections = [] }: MicrochipPageProps) {
  const { paragraphs, vision, mission, objectives, team } = microchipEmbedded;
  const [isTeamOpen, setIsTeamOpen] = useState(true);

  const accordionSections = customSections.filter(
    (s) => s.id !== 'team' && !s.label.toLowerCase().includes('team')
  );

  return (
    <div className="mc-page-container">
      {/* 1. OVERVIEW & LAB CAPABILITIES */}
      <section className="mc-overview-section">
        <div className="mc-overview-paragraphs">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>

      {/* 2. VISION & MISSION */}
      <section className="mc-vm-section">
        <div className="mc-vm-grid">
          {/* Vision */}
          <div className="mc-vm-card">
            <span className="mc-vm-badge">
              <Compass size={14} /> Strategic Vision
            </span>
            <h3 className="mc-vm-title">Our Vision</h3>
            <ul className="mc-vision-bullets">
              {vision.map((v, idx) => (
                <li key={idx} className="mc-vision-bullet">
                  <span className="mc-bullet-disc" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mission */}
          <div className="mc-vm-card">
            <span className="mc-vm-badge">
              <Target size={14} /> Institutional Mission
            </span>
            <h3 className="mc-vm-title">Our Mission</h3>
            <div className="mc-mission-box">
              "{mission[0]}"
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE OBJECTIVES */}
      <section className="mc-objectives-section">
        <div className="mc-section-header">
          <span className="mc-section-label">Pillars of Excellence</span>
          <h2 className="mc-section-title">Core Objectives</h2>
        </div>

        <div className="mc-objectives-grid">
          {objectives.map((objStr, idx) => {
            const [title, ...descParts] = objStr.split(':');
            const desc = descParts.join(':').trim();
            return (
              <div key={idx} className="mc-obj-card">
                <div className="mc-obj-num">0{idx + 1}</div>
                <div className="mc-obj-content">
                  <h4>{title}</h4>
                  <p>{desc || objStr}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TEAM & FACULTY (COLLAPSIBLE ACCORDION ITEM 01) */}
      <section className="mc-team-accordion-wrapper" style={{ marginTop: '2.5rem', marginBottom: '0.75rem' }}>
        <div className={`cs-accordion-item${isTeamOpen ? ' is-open' : ''}`}>
          <button
            type="button"
            className="cs-accordion-trigger"
            onClick={() => setIsTeamOpen(!isTeamOpen)}
            aria-expanded={isTeamOpen}
          >
            <span className="cs-accordion-num" aria-hidden="true">01</span>
            <span className="cs-accordion-title">{team.heading}</span>
            <ChevronDown size={18} strokeWidth={2.25} className="cs-accordion-chevron" aria-hidden="true" />
          </button>
          
          <SmoothCollapse open={isTeamOpen}>
            <div className="cs-accordion-body" style={{ padding: '2rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              {/* Faculty In-Charge */}
              <div className="mc-incharge-card">
                <div className="mc-incharge-avatar">
                  {team.inCharge.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <span className="mc-incharge-badge">Faculty In-Charge</span>
                  <h3 className="mc-incharge-name">{team.inCharge.name}</h3>
                  <div className="mc-incharge-desig">{team.inCharge.designation}</div>

                  <div className="mc-contact-meta">
                    {team.inCharge.email && (
                      <div className="mc-contact-item">
                        <Mail size={15} color="#c9973a" />
                        <a href={`mailto:${team.inCharge.email}`}>{team.inCharge.email}</a>
                      </div>
                    )}
                    {team.inCharge.interests && (
                      <div className="mc-contact-item">
                        <BookOpen size={15} color="#c9973a" />
                        <span><strong>Interests:</strong> {team.inCharge.interests}</span>
                      </div>
                    )}
                    {team.inCharge.profileLink && (
                      <div className="mc-contact-item">
                        <ExternalLink size={15} color="#c9973a" />
                        <a href={team.inCharge.profileLink} target="_blank" rel="noopener noreferrer">IRINS Profile</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Faculty Members Grid */}
              <div className="mc-faculty-grid">
                {team.facultyMembers.map((member, idx) => (
                  <div key={idx} className="mc-faculty-card">
                    <div className="mc-faculty-header">
                      <div className="mc-faculty-avatar">
                        {member.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="mc-faculty-name">{member.name}</h4>
                        <div className="mc-faculty-desig">{member.designation}</div>
                      </div>
                    </div>

                    <div className="mc-faculty-details">
                      {member.callSign && (
                        <div className="mc-callsign-badge">
                          <Radio size={12} style={{ display: 'inline', marginRight: 4 }} />
                          Call Sign: {member.callSign}
                        </div>
                      )}
                      {member.interests && (
                        <div><strong>Interests:</strong> {member.interests}</div>
                      )}
                      {member.email && (
                        <div style={{ wordBreak: 'break-all' }}>
                          <Mail size={13} style={{ display: 'inline', marginRight: 4 }} />
                          <a href={`mailto:${member.email}`} style={{ color: '#0b1e42' }}>{member.email}</a>
                        </div>
                      )}
                      {member.profileLink && (
                        <div style={{ marginTop: '0.25rem' }}>
                          <a href={member.profileLink} target="_blank" rel="noopener noreferrer" style={{ color: '#c9973a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            Profile Link <ExternalLink size={12} />
                          </a>
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

      {/* 6. DYNAMIC CUSTOM SECTIONS ACCORDION (Starting at 02) */}
      {accordionSections.length > 0 && (
        <section className="mc-custom-sections">
          <CustomSectionsAccordion sections={accordionSections} startIndex={2} />
        </section>
      )}

      {/* 7. PHOTO GALLERIES (AT THE VERY BOTTOM OF THE PAGE) */}
      {customSections.length > 0 && (
        <section className="mc-custom-galleries" style={{ marginTop: '3.5rem' }}>
          <CustomSectionsGalleries sections={customSections} />
        </section>
      )}
    </div>
  );
}
