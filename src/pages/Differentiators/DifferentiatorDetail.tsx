import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Trophy, Rocket, Factory, Microscope, Globe2, GraduationCap } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import { useCollection, useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { DIFFERENTIATOR_CATEGORIES } from '../Admin/sections/DifferentiatorsAdmin';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { aicteIdeaLab } from './aicteIdeaLab.data';
import { institutionInnovationCell } from './institutionInnovationCell.data';
import { tedxSvecw } from './tedxSvecw.data';
import { medaPlmCoe } from './medaPlmCoe.data';
import { nasscomEmbedded } from './nasscomEmbedded.data';
import { hclVlsiTraining } from './hclVlsiTraining.data';
import { microchipEmbedded, type TeamMember } from './microchipEmbedded.data';
import { tiDspCoe, type TiDspFacultyMember, type ContentBlock } from './tiDspCoe.data';
import { ultraTechCoe, type UltraTechInCharge, type StudentsBenefitedGroup } from './ultraTechCoe.data';
import { chipsToStartup } from './chipsToStartup.data';
import { vsac, type VsacMember, type SimpleTable, type TrainingResearchItem, type CollaborationItem } from './vsac.data';
import { arVrStudio } from './arVrStudio.data';
import { vehicleDesignLab, type VdlFacilityPhase } from './vehicleDesignLab.data';
import {
  assistiveTechLab,
  type AtlMember,
  type AtlBatchGroup,
  type AtlProject,
  type AtlActivity,
  type AtlBlock,
  type AtlSeminarYear,
  type AtlOutcomeEvent,
  type AtlYearTraining,
} from './assistiveTechLab.data';
import { highPerformanceComputingLab, type HpcMember } from './highPerformanceComputingLab.data';
import {
  concreteCanoeLab,
  type CanoeSimpleTable,
  type CanoeStudentTeam,
  type CanoeCompetition,
} from './concreteCanoeLab.data';
import { dreamHouseConstructionLab, type DhclMember } from './dreamHouseConstructionLab.data';
import { foreignLanguages, type FlCoordinator, type FlLanguage } from './foreignLanguages.data';
import {
  talentSprintWise,
  type WiseModuleTab,
  type WiseModuleSection,
  type WiseProjectBatch,
  type WiseTeamMember,
  type WiseEliteProject,
  type WiseMentoringBatch,
  type WisePlacementStatsYear,
  type WiseTestimonial,
  type WiseNseClipping,
} from './talentSprintWise.data';
import { smartInterviews } from './smartInterviews.data';
import { ruralWomenTechPark } from './ruralWomenTechPark.data';
import { nirvahana, type NirvahanaEvent } from './nirvahana.data';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../detail-layout.css';

function IicMemberCard({ name, role, size = 96, photoUrl }: { name: string; role: string; size?: number; photoUrl?: string }) {
  return (
    <div style={{ border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-2)' }}>
      <img
        src={photoUrl || PHOTO_NEEDED_PLACEHOLDER}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-light-gray)' }}
      />
      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{name}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{role}</span>
    </div>
  );
}

// Section nav for the Institution Innovation Cell page — only "About IIC"
// and "IIC – Constitution" have real content so far; the rest show a
// coming-soon placeholder until that content is provided.
const IIC_TABS = [
  'About IIC',
  'IIC – Constitution',
  'Innovation Ambassadors',
  'IIC Activities',
  'Atal Tinkering Schools',
  'Rating Certificates',
  'IIC Annual Reports',
  'SIH Internal Hackathon Reports',
  'National Innovation Start-Up Policy',
];

// Vehicle Design Lab's sidebar sections — only "About VDL" and "Facilities
// & Projects" have real content so far; the rest show a coming-soon
// placeholder until that content is provided.
const VDL_TABS = [
  'About VDL',
  'Facilities & Projects',
  'Industry Collaborations',
  'Students Achievements & Placements',
  'VDL Outcomes',
];

// TalentSprint – WISE's own sidebar sections — only "About WISE" and
// "Beneficiaries – Placements" have real content so far; the rest show a
// coming-soon placeholder until that content is provided.
const WISE_TABS = [
  'About WISE',
  'Modules',
  'Projects',
  'WISE Team',
  'ELITE Program',
  'Microsoft Mentoring Program',
  'Beneficiaries – Placements',
  'Testimonials',
  'TalentSprint @ NSE',
];

function IicBulletList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div style={{ marginBottom: 'var(--space-8)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div style={{ width: 4, height: 28, background: 'var(--color-accent)', borderRadius: 'var(--radius-full)' }} />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{heading}</h2>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {items.map((point, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckBullets({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: '0 0 var(--space-5)', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {items.map((point, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
      <div style={{ width: 4, height: 24, background: 'var(--color-accent)', borderRadius: 'var(--radius-full)' }} />
      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{children}</h3>
    </div>
  );
}

function NasscomAccordion({ nasscom }: { nasscom: typeof nasscomEmbedded }) {
  const sectionTitles = ['Training / Research', 'Testimonials', 'Outcomes'];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {sectionTitles.map((title, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {title === 'Training / Research' && (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', margin: 0 }}>
                    {nasscom.trainingResearch}
                  </p>
                )}
                {title === 'Testimonials' && (
                  <>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                      {nasscom.testimonials.heading}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                      {nasscom.testimonials.quotes.map((q, qi) => (
                        <div key={qi}>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 'var(--space-1)' }}>
                            "{q.text}"
                          </p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', margin: 0 }}>{q.author}</p>
                        </div>
                      ))}
                    </div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                      {nasscom.testimonials.videoHeading}
                    </h4>
                    <a href={nasscom.testimonials.videoLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                      Click here to watch
                    </a>
                  </>
                )}
                {title === 'Outcomes' && <CheckBullets items={nasscom.outcomes} />}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function HclAccordion({ hcl }: { hcl: typeof hclVlsiTraining }) {
  const sectionTitles = ['Testimonials', 'Activities', 'Outcomes'];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {sectionTitles.map((title, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {title === 'Testimonials' && (
                  <>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                      {hcl.testimonials.heading}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      {hcl.testimonials.quotes.map((q, qi) => (
                        <div key={qi}>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 'var(--space-1)' }}>
                            "{q.text}"
                          </p>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', margin: 0 }}>{q.author}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {title === 'Activities' && (
                  hcl.activities.length > 0 ? (
                    <CheckBullets items={hcl.activities} />
                  ) : (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                      Content for this section is coming soon.
                    </p>
                  )
                )}
                {title === 'Outcomes' && (
                  hcl.outcomes.length > 0 ? (
                    <CheckBullets items={hcl.outcomes} />
                  ) : (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                      Content for this section is coming soon.
                    </p>
                  )
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function TeamMemberDetail({ member }: { member: TeamMember }) {
  const hasDetails = member.designation || member.email || member.mobile || member.interests || member.profileLink;
  if (!hasDetails) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
        Details for {member.name} are coming soon.
      </p>
    );
  }
  return (
    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.8 }}>
      <p style={{ margin: 0 }}><strong style={{ color: 'var(--color-primary)' }}>Name:</strong> {member.name}</p>
      {member.designation && <p style={{ margin: 0 }}><strong style={{ color: 'var(--color-primary)' }}>Designation:</strong> {member.designation}</p>}
      {member.email && (
        <p style={{ margin: 0 }}>
          <strong style={{ color: 'var(--color-primary)' }}>Email Id:</strong>{' '}
          <a href={`mailto:${member.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{member.email}</a>
        </p>
      )}
      {member.mobile && (
        <p style={{ margin: 0 }}>
          <strong style={{ color: 'var(--color-primary)' }}>Mobile No:</strong>{' '}
          <a href={`tel:${member.mobile}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{member.mobile}</a>
        </p>
      )}
      {member.callSign && <p style={{ margin: 0 }}><strong style={{ color: 'var(--color-primary)' }}>Call sign:</strong> {member.callSign}</p>}
      {member.interests && <p style={{ margin: 0 }}><strong style={{ color: 'var(--color-primary)' }}>Areas of Interest:</strong> {member.interests}</p>}
      {member.profileLink && (
        <p style={{ marginTop: 'var(--space-2)' }}>
          <a href={member.profileLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{member.profileLink}</a>
        </p>
      )}
    </div>
  );
}

function MicrochipTeam({ team }: { team: typeof microchipEmbedded.team }) {
  const [activeFaculty, setActiveFaculty] = useState(0);

  return (
    <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>{team.heading}</h3>

      <p style={{ fontWeight: 700, color: 'var(--color-text-light)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 'var(--space-2)' }}>In-charge</p>
      <div style={{ background: 'var(--color-primary)', color: 'var(--color-white)', textAlign: 'center', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
        {team.inCharge.name}
      </div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <TeamMemberDetail member={team.inCharge} />
      </div>

      <p style={{ fontWeight: 700, color: 'var(--color-text-light)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 'var(--space-2)' }}>Faculty Members</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {team.facultyMembers.map((m, i) => {
          const isActive = activeFaculty === i;
          return (
            <button
              key={m.name}
              onClick={() => setActiveFaculty(i)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-primary)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
              }}
            >
              {m.name}
            </button>
          );
        })}
      </div>
      <TeamMemberDetail member={team.facultyMembers[activeFaculty]} />
    </div>
  );
}

function MicrochipAccordion({ activities, outcomes }: { activities: string[]; outcomes: string[] }) {
  const sectionTitles = ['Activities', 'Outcomes'];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {sectionTitles.map((title, i) => {
        const isOpen = openIndex === i;
        const items = title === 'Activities' ? activities : outcomes;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {items.length > 0 ? (
                  <CheckBullets items={items} />
                ) : (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                    Content for this section is coming soon.
                  </p>
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function TiDspMemberCard({ member }: { member?: TiDspFacultyMember }) {
  if (!member) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
        Content for this section is coming soon.
      </p>
    );
  }
  return (
    <div style={{ border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{member.name}</span>
      {member.designation && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{member.designation}</span>}
      {member.email && (
        <a href={`mailto:${member.email}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{member.email}</a>
      )}
      {member.mobile && (
        <a href={`tel:${member.mobile}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{member.mobile}</a>
      )}
      {member.interests && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{member.interests}</span>}
    </div>
  );
}

function TiDspTeam({ team }: { team: typeof tiDspCoe.team }) {
  const [activeTab, setActiveTab] = useState<'In-Charge' | 'Faculty Members'>('In-Charge');

  return (
    <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: 'var(--space-6)' }}>
      <div style={{ background: 'var(--color-primary)', color: 'var(--color-white)', padding: 'var(--space-3) var(--space-5)', fontWeight: 700 }}>
        Team
      </div>
      <div style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
          {(['In-Charge', 'Faculty Members'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: '1 1 160px',
                  padding: 'var(--space-3) var(--space-5)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                  color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
        {activeTab === 'In-Charge' ? (
          <TiDspMemberCard member={team.inCharge} />
        ) : (
          team.facultyMembers.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              {team.facultyMembers.map((m) => <TiDspMemberCard key={m.name} member={m} />)}
            </div>
          ) : (
            <TiDspMemberCard />
          )
        )}
      </div>
    </div>
  );
}

const TI_DSP_TABLE_TH_STYLE: CSSProperties = {
  background: 'var(--color-primary)',
  color: 'var(--color-white)',
  padding: 'var(--space-2) var(--space-3)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  fontSize: 'var(--text-xs)',
};
const TI_DSP_TABLE_TD_STYLE: CSSProperties = {
  padding: 'var(--space-2) var(--space-3)',
  border: '1px solid var(--color-light-gray)',
  fontSize: 'var(--text-sm)',
  verticalAlign: 'top',
};

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
          {block.text}
        </p>
      );
    case 'bullets':
      return (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <CheckBullets items={block.items} />
        </div>
      );
    case 'numbered':
      return (
        <ol style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {block.items.map((entry, i) => (
            <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{entry}</li>
          ))}
        </ol>
      );
    case 'heading':
      return (
        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
          {block.text}
        </h4>
      );
    case 'table':
      return (
        <div style={{ overflowX: 'auto', marginBottom: 'var(--space-5)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th key={h} style={TI_DSP_TABLE_TH_STYLE}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={TI_DSP_TABLE_TD_STYLE}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'iicdcBatches':
      return <IicdcBatchesTable data={tiDspCoe.trainingResearch.iicdc2019} />;
    default:
      return null;
  }
}

function IicdcBatchesTable({ data }: { data: typeof tiDspCoe.trainingResearch.iicdc2019 }) {
  return (
    <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-5)' }}>
      <div style={{ background: 'var(--color-accent)', color: 'var(--color-primary)', textAlign: 'center', padding: 'var(--space-4)' }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{data.collegeName}</div>
        <div style={{ fontSize: 'var(--text-xs)' }}>{data.department}</div>
        <div style={{ fontWeight: 700, marginTop: 'var(--space-2)' }}>{data.tableTitle}</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TI_DSP_TABLE_TH_STYLE}>Batch No.</th>
              <th style={TI_DSP_TABLE_TH_STYLE}>Regd.No</th>
              <th style={TI_DSP_TABLE_TH_STYLE}>Name of the Student</th>
              <th style={TI_DSP_TABLE_TH_STYLE}>Title of the Project</th>
            </tr>
          </thead>
          <tbody>
            {data.batches.map((batch) =>
              batch.members.map((m, mi) => (
                <tr key={`${batch.batchNo}-${mi}`} style={{ background: batch.batchNo % 2 === 0 ? 'var(--color-off-white)' : 'var(--color-white)' }}>
                  {mi === 0 && (
                    <td rowSpan={batch.members.length} style={{ ...TI_DSP_TABLE_TD_STYLE, fontWeight: 700, textAlign: 'center' }}>
                      {batch.batchNo}
                    </td>
                  )}
                  <td style={TI_DSP_TABLE_TD_STYLE}>{m.regdNo}</td>
                  <td style={TI_DSP_TABLE_TD_STYLE}>{m.name}</td>
                  {mi === 0 && (
                    <td rowSpan={batch.members.length} style={TI_DSP_TABLE_TD_STYLE}>
                      {batch.title}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrainingResearchSection({ data }: { data: typeof tiDspCoe.trainingResearch }) {
  const [activeYear, setActiveYear] = useState(0);
  const year = data.years[activeYear];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <CheckBullets items={[data.workshopTitle]} />
      </div>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
        {data.intro}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
        {data.years.map((y, i) => {
          const isActive = activeYear === i;
          return (
            <button
              key={y.label}
              onClick={() => setActiveYear(i)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {y.label}
            </button>
          );
        })}
      </div>
      <div>
        {year.blocks.map((block, i) => <ContentBlockRenderer key={i} block={block} />)}
      </div>
    </div>
  );
}

function PhotoGrid({ photos, alt }: { photos: (WithId & { imageUrl: string })[]; alt: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
      {photos.map((p) => (
        <img
          key={p.id}
          src={p.imageUrl}
          alt={alt}
          style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
        />
      ))}
    </div>
  );
}

function ChipsToStartupAccordion({
  sections,
  content,
  activityPhotos,
  outcomePhotos,
}: {
  sections: string[];
  content: Record<string, string[]>;
  activityPhotos: (WithId & { imageUrl: string })[];
  outcomePhotos: (WithId & { imageUrl: string })[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ACTIVITIES_TITLE = 'Activities Done Under the Project';
  const OUTCOMES_TITLE = 'Outcomes';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {sections.map((title, i) => {
        const isOpen = openIndex === i;
        const isActivities = title === ACTIVITIES_TITLE;
        const isOutcomes = title === OUTCOMES_TITLE;
        const photos = isActivities ? activityPhotos : isOutcomes ? outcomePhotos : [];
        const items = content[title] ?? [];
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {isActivities || isOutcomes ? (
                  photos.length > 0 ? (
                    <PhotoGrid photos={photos} alt={title} />
                  ) : (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                      Content for this section is coming soon.
                    </p>
                  )
                ) : items.length > 0 ? (
                  <CheckBullets items={items} />
                ) : (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                    Content for this section is coming soon.
                  </p>
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function VdlTeamSection({ team }: { team: typeof vehicleDesignLab.team }) {
  const [activeTab, setActiveTab] = useState<'Lab Head' | 'Faculty Members'>('Lab Head');

  return (
    <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ display: 'flex' }}>
        {(['Lab Head', 'Faculty Members'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-5)',
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {tab === 'Lab Head' ? 'Lab Head:' : tab}
            </button>
          );
        })}
      </div>
      <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)' }}>
        {activeTab === 'Lab Head' ? (
          <TiDspMemberCard member={team.labHead} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
            {team.facultyMembers.map((m) => <TiDspMemberCard key={m.name} member={m} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function VdlVideoEmbed({ url }: { url?: string }) {
  if (!url) {
    return null;
  }
  return (
    <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-light-gray)' }}>
      <iframe
        src={url}
        title="Vehicle Design Lab video"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function VdlSinglePhoto({ photos, alt }: { photos: (WithId & { imageUrl: string })[]; alt: string }) {
  if (photos.length === 0) {
    return null;
  }
  return (
    <img
      src={photos[0].imageUrl}
      alt={alt}
      style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
    />
  );
}

function VdlFacilitiesSection({
  facilities,
  testingPhotos,
  campusVehiclePhotos,
}: {
  facilities: typeof vehicleDesignLab.facilities;
  testingPhotos: (WithId & { imageUrl: string })[];
  campusVehiclePhotos: (WithId & { imageUrl: string })[];
}) {
  const [activeTab, setActiveTab] = useState<'Activities and Programs' | 'Campus Utility Vehicle Projects'>('Activities and Programs');

  return (
    <div>
      <SectionHeading>Facility Overview</SectionHeading>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
        {facilities.overview}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 'var(--space-6)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {(['Activities and Programs', 'Campus Utility Vehicle Projects'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: '1 1 240px',
                padding: 'var(--space-3) var(--space-5)',
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {tab}:
            </button>
          );
        })}
      </div>

      {activeTab === 'Activities and Programs' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {facilities.activitiesPrograms.map((phase: VdlFacilityPhase, i) => (
            <div key={i}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                {phase.title}
              </h4>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                {phase.paragraph}
              </p>
              {phase.mediaType === 'video' ? (
                <VdlVideoEmbed url={phase.videoUrl} />
              ) : (
                <VdlSinglePhoto photos={testingPhotos} alt={phase.title} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
            {facilities.campusUtilityIntro}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {facilities.campusUtilityProjects.map((p, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                  <strong>{p.lead}</strong>{p.text}
                </span>
              </li>
            ))}
          </ul>
          {campusVehiclePhotos.length > 0 ? (
            <PhotoGrid photos={campusVehiclePhotos} alt="Campus Utility Vehicle Projects" />
          ) : (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
              Content for this section is coming soon.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function VdlIndustryCollaborationsSection({
  data,
  photos,
}: {
  data: typeof vehicleDesignLab.industryCollaborations;
  photos: (WithId & { imageUrl: string })[];
}) {
  return (
    <div>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
        {data.intro}
      </p>
      <VsacInnerAccordion titles={data.endowments.map((e) => `${e.title}:`)}>
        {(i) => {
          const e = data.endowments[i];
          const photo = photos[i];
          return (
            <>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-2)' }}>
                <strong>Bestowed By:</strong> {e.bestowedBy}
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: photo ? 'var(--space-4)' : 0 }}>
                <strong>Contribution:</strong> {e.contribution}
              </p>
              {photo && (
                <img
                  src={photo.imageUrl}
                  alt={e.title}
                  style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
                />
              )}
            </>
          );
        }}
      </VsacInnerAccordion>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginTop: 'var(--space-6)' }}>
        {data.closing}
      </p>
    </div>
  );
}

function VdlStudentsAchievementsSection({ data }: { data: typeof vehicleDesignLab.studentsAchievements }) {
  return (
    <div>
      <SectionHeading>Achievements</SectionHeading>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
        {data.intro}
      </p>
      <VsacInnerAccordion titles={data.competitions.map((c) => `${c.title}:`)}>
        {(i) => (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: 0 }}>
            {data.competitions[i].text}
          </p>
        )}
      </VsacInnerAccordion>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: 'var(--space-6) 0' }}>
        {data.closing}
      </p>

      <SectionHeading>Placements</SectionHeading>
      {data.placementsParagraphs.map((para, i) => (
        <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
          {para}
        </p>
      ))}

      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
        Achievements:
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {data.achievementReports.map((report) => (
          <li key={report.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <a href={report.href} download style={{ fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontWeight: 600 }}>{report.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VdlOutcomesSection({ outcomes }: { outcomes: typeof vehicleDesignLab.outcomes }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {outcomes.map((o) => (
        <div key={o.title}>
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>
            {o.title}
          </h4>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: 0 }}>
            {o.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function VsacMemberCard({ member }: { member?: VsacMember }) {
  if (!member) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
        Content for this section is coming soon.
      </p>
    );
  }
  return (
    <div style={{ border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{member.name}</span>
      {member.designation && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{member.designation}</span>}
      {member.email && (
        <a href={`mailto:${member.email}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{member.email}</a>
      )}
      {member.mobile && (
        <a href={`tel:${member.mobile}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{member.mobile}</a>
      )}
      {member.callSign && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>Call sign: {member.callSign}</span>}
      {member.interests && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{member.interests}</span>}
      {member.profileLink && (
        <a href={member.profileLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-dark, var(--color-accent))', fontWeight: 600, marginTop: 'var(--space-1)' }}>
          Shri Vishnu Engineering College for Women (irins.org)
        </a>
      )}
    </div>
  );
}

function VsacTabGroup({ labels, activeIndex, onSelect }: { labels: string[]; activeIndex: number; onSelect: (i: number) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
      {labels.map((label, i) => {
        const isActive = activeIndex === i;
        return (
          <button
            key={label}
            onClick={() => onSelect(i)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
              color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function VsacTeamSection({ team }: { team: typeof vsac.team }) {
  const [activeInCharge, setActiveInCharge] = useState(0);
  const [activeFaculty, setActiveFaculty] = useState(0);

  return (
    <div>
      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>In-charge</h4>
      <VsacTabGroup labels={team.inCharge.map((m) => m.name)} activeIndex={activeInCharge} onSelect={setActiveInCharge} />
      <VsacMemberCard member={team.inCharge[activeInCharge]} />

      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', margin: 'var(--space-6) 0 var(--space-3)' }}>Faculty Members</h4>
      <VsacTabGroup labels={team.facultyMembers.map((m) => m.name)} activeIndex={activeFaculty} onSelect={setActiveFaculty} />
      <VsacMemberCard member={team.facultyMembers[activeFaculty]} />
    </div>
  );
}

function VsacSimpleTable({ table }: { table: SimpleTable }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 'var(--space-5)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {table.headers.map((h) => (
              <th key={h} style={TI_DSP_TABLE_TH_STYLE}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={TI_DSP_TABLE_TD_STYLE}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VsacInnerAccordion({ titles, children }: { titles: string[]; children: (i: number) => ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {titles.map((title, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {children(i)}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function AtlMemberCard({ member }: { member?: AtlMember }) {
  if (!member) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
        Content for this section is coming soon.
      </p>
    );
  }
  const isIrins = member.profileLink?.includes('irins.org');
  return (
    <div style={{ border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}><strong>Name:</strong> {member.name}</p>
      {member.designation && <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}><strong>Designation:</strong> {member.designation}</p>}
      {member.email && (
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
          <strong>Email Id:</strong> <a href={`mailto:${member.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{member.email}</a>
        </p>
      )}
      {member.mobile && (
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
          <strong>Mobile No:</strong> <a href={`tel:${member.mobile}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{member.mobile}</a>
        </p>
      )}
      {member.interests && <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}><strong>Areas of Interest:</strong> {member.interests}</p>}
      {member.profileLink && (
        <a href={member.profileLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-dark, var(--color-accent))', fontWeight: 600, marginTop: 'var(--space-1)' }}>
          {isIrins ? 'Shri Vishnu Engineering College for Women (irins.org)' : member.profileLink}
        </a>
      )}
    </div>
  );
}

function AtlTeamSection({ team }: { team: typeof assistiveTechLab.team }) {
  const [activeTab, setActiveTab] = useState<'ATL Dean' | 'In-Charge' | 'Faculty Members'>('ATL Dean');
  const tabs = ['ATL Dean', 'In-Charge', 'Faculty Members'] as const;
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-5)' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: '1 1 33%',
                padding: 'var(--space-3) var(--space-4)',
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === 'ATL Dean' ? (
        <AtlMemberCard member={team.dean} />
      ) : activeTab === 'In-Charge' ? (
        <AtlMemberCard member={team.inCharge} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
          {team.facultyMembers.map((m) => <AtlMemberCard key={m.name} member={m} />)}
        </div>
      )}
    </div>
  );
}

function AtlBatchTable({ groups, showMentors = true, showBatchName = false }: { groups: AtlBatchGroup[]; showMentors?: boolean; showBatchName?: boolean }) {
  const headers = [
    'Batch No.',
    ...(showBatchName ? ['Name of the Batch'] : []),
    'Regd.No',
    'Name of the Student',
    'Department',
    ...(showMentors ? ['Mentors'] : []),
    'Selected Project',
  ];
  return (
    <div style={{ overflowX: 'auto', marginBottom: 'var(--space-5)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((h) => <th key={h} style={TI_DSP_TABLE_TH_STYLE}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <Fragment key={group.batchNo}>
              {group.members.map((m, mi) => (
                <tr key={`${group.batchNo}-${mi}`} style={{ background: group.batchNo % 2 === 0 ? 'var(--color-off-white)' : 'var(--color-white)' }}>
                  {mi === 0 && (
                    <td rowSpan={group.members.length} style={{ ...TI_DSP_TABLE_TD_STYLE, fontWeight: 700, textAlign: 'center' }}>
                      {group.batchNo}
                    </td>
                  )}
                  {showBatchName && mi === 0 && (
                    <td rowSpan={group.members.length} style={{ ...TI_DSP_TABLE_TD_STYLE, fontWeight: 700 }}>{group.batchName}</td>
                  )}
                  <td style={TI_DSP_TABLE_TD_STYLE}>{m.regdNo}</td>
                  <td style={TI_DSP_TABLE_TD_STYLE}>{m.name}</td>
                  <td style={TI_DSP_TABLE_TD_STYLE}>{m.department}</td>
                  {showMentors && mi === 0 && (
                    <td rowSpan={group.members.length} style={TI_DSP_TABLE_TD_STYLE}>{group.mentors}</td>
                  )}
                  {mi === 0 && (
                    <td rowSpan={group.members.length} style={TI_DSP_TABLE_TD_STYLE}>{group.selectedProject}</td>
                  )}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AtlProjectsTable({ projects, photos }: { projects: AtlProject[]; photos: (WithId & { imageUrl: string })[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={TI_DSP_TABLE_TH_STYLE}>Title</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Description</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Prototype</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={p.title} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
              <td style={{ ...TI_DSP_TABLE_TD_STYLE, fontWeight: 700 }}>{p.title}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{p.description}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>
                {photos[i] ? (
                  <img src={photos[i].imageUrl} alt={p.title} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                ) : (
                  <span style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-xs)' }}>Photo coming soon</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AtlBlockRenderer({ block }: { block: AtlBlock }) {
  switch (block.type) {
    case 'meta':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
          {block.items.map((m) => (
            <p key={m.label} style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              <strong>{m.label}:</strong> {m.value}
            </p>
          ))}
        </div>
      );
    case 'paragraph':
      return (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
          {block.text}
        </p>
      );
    case 'heading':
      return <SectionHeading>{block.text}</SectionHeading>;
    case 'bullets':
      return (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <CheckBullets items={block.items} />
        </div>
      );
    case 'boldBullets':
      return (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {block.items.map((b, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                <strong>{b.lead}</strong>{b.text}
              </span>
            </li>
          ))}
        </ul>
      );
    case 'numbered':
      return (
        <ol style={{ paddingLeft: 'var(--space-6)', marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{item}</li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          {block.title && (
            <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{block.title}:</p>
          )}
          <VsacSimpleTable table={block.table} />
        </div>
      );
    default:
      return null;
  }
}

function AtlActivitySection({ activity, photos }: { activity: AtlActivity; photos: (WithId & { imageUrl: string })[] }) {
  return (
    <div>
      {activity.blocks.map((block, i) => <AtlBlockRenderer key={i} block={block} />)}
      <div>
        <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Photographs:</p>
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} alt={activity.title} />
        ) : (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
            Content for this section is coming soon.
          </p>
        )}
      </div>
    </div>
  );
}

function AtlSeminarsSection({ seminars }: { seminars: AtlSeminarYear[] }) {
  const [activeYear, setActiveYear] = useState(0);
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {seminars.map((s, i) => {
          const isActive = activeYear === i;
          return (
            <button
              key={s.year}
              onClick={() => setActiveYear(i)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {s.year}
            </button>
          );
        })}
      </div>
      <CheckBullets items={seminars[activeYear].items} />
    </div>
  );
}

function AtlOutcomesGallerySection({
  outcomes,
  summitTable,
  atlInNewsCaption,
  regionalPhotos,
  iitPhotos,
  newsPhotos,
}: {
  outcomes: AtlOutcomeEvent[];
  summitTable: { title: string; headers: string[]; rows: string[][] };
  atlInNewsCaption: string;
  regionalPhotos: (WithId & { imageUrl: string })[];
  iitPhotos: (WithId & { imageUrl: string })[];
  newsPhotos: (WithId & { imageUrl: string })[];
}) {
  const [activeTab, setActiveTab] = useState<'Outcomes' | 'Gallery'>('Outcomes');
  return (
    <div>
      <div style={{ display: 'flex', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-5)' }}>
        {(['Outcomes', 'Gallery'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-5)',
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === 'Outcomes' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {outcomes.map((event) => (
            <div key={event.title}>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>{event.title}</h4>
              <AtlBatchTable groups={event.batches} showMentors={false} />
            </div>
          ))}
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>{summitTable.title}</h4>
            <VsacSimpleTable table={summitTable} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>{outcomes[0]?.title}</h4>
            {regionalPhotos.length > 0 ? (
              <PhotoGrid photos={regionalPhotos} alt={outcomes[0]?.title || ''} />
            ) : (
              <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Content for this section is coming soon.</p>
            )}
          </div>
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>{outcomes[1]?.title}</h4>
            {iitPhotos.length > 0 ? (
              <PhotoGrid photos={iitPhotos} alt={outcomes[1]?.title || ''} />
            ) : (
              <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Content for this section is coming soon.</p>
            )}
          </div>
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>ATL in News</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-3)' }}>{atlInNewsCaption}</p>
            {newsPhotos.length > 0 ? (
              <PhotoGrid photos={newsPhotos} alt="ATL in News" />
            ) : (
              <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Content for this section is coming soon.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const ATL_ACTIVITY_PHOTO_KEYS = [
  'zion-2023-24',
  'day-2023-24',
  'day-2024-25',
  'trance-2024-25',
  'zion-2025-26',
  'day-2025-26',
  'regional-meet-2025-26',
  'jntu-kakinada-2025-26',
  'rtih-2025-26',
  'rajahmundry-expo-2025-26',
];

function AtlTrainingResearchSection({
  years,
  projectPhotosByYear,
}: {
  years: AtlYearTraining[];
  projectPhotosByYear: (WithId & { imageUrl: string })[][];
}) {
  const [activeYear, setActiveYear] = useState(0);
  const year = years[activeYear];
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {years.map((y, i) => {
          const isActive = activeYear === i;
          return (
            <button
              key={y.yearLabel}
              onClick={() => setActiveYear(i)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {y.yearLabel}
            </button>
          );
        })}
      </div>
      {year.pdfHref && (
        <p style={{ marginBottom: 'var(--space-5)' }}>
          <a
            href={year.pdfHref}
            download
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', background: 'var(--color-off-white)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
          >
            ⬇ Download {year.yearLabel} Report (PDF)
          </a>
        </p>
      )}
      <VsacInnerAccordion titles={['Details of Bridge Course in ATL Lab', 'ATL Lab Projects']}>
        {(si) => si === 0 ? (
          <VsacSimpleTable table={year.bridgeCourse} />
        ) : (
          <AtlProjectsTable projects={year.projects} photos={projectPhotosByYear[activeYear] ?? []} />
        )}
      </VsacInnerAccordion>
    </div>
  );
}

function AtlAccordion({
  data,
  photoMap,
}: {
  data: typeof assistiveTechLab;
  photoMap: Record<string, (WithId & { imageUrl: string })[]>;
}) {
  const sections = [
    'Faculty Members',
    'Training/ Research or Academic Projects',
    'Students & Collaborations',
    'Clients',
    'Testimonials',
    'Seminars',
    'Activities',
    'People',
    'Publications',
    'Outcomes & Gallery',
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activityPhotosBySection = ATL_ACTIVITY_PHOTO_KEYS.map((k) => photoMap[k] ?? []);
  const trainingProjectPhotos = [
    photoMap['projects-2025-26'] ?? [],
    photoMap['projects-2024-25'] ?? [],
    photoMap['projects-2023-24'] ?? [],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {sections.map((title, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {title === 'Faculty Members' && <AtlTeamSection team={data.team} />}

                {title === 'Training/ Research or Academic Projects' && (
                  <AtlTrainingResearchSection years={data.trainingByYear} projectPhotosByYear={trainingProjectPhotos} />
                )}

                {title === 'Students & Collaborations' && (
                  <VsacInnerAccordion titles={[data.studentsBenefitted.yearLabel, data.studentsBenefitted2024.yearLabel, 'ATL Selected Students (2025-26)', 'Collaborations']}>
                    {(si) => {
                      if (si === 0) return <AtlBatchTable groups={data.studentsBenefitted.batches} showMentors />;
                      if (si === 1) return <AtlBatchTable groups={data.studentsBenefitted2024.batches} showMentors showBatchName />;
                      if (si === 2) return <VsacSimpleTable table={data.selectedStudents2025} />;
                      return <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: 0 }}>{data.collaborations}</p>;
                    }}
                  </VsacInnerAccordion>
                )}

                {title === 'Clients' && (
                  <ol style={{ paddingLeft: 'var(--space-6)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {data.clients.map((c, ci) => <li key={ci} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{c}</li>)}
                  </ol>
                )}

                {title === 'Testimonials' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    {data.testimonials.map((t, ti) => (
                      <div key={ti} style={{ paddingBottom: 'var(--space-4)', borderBottom: ti < data.testimonials.length - 1 ? '1px solid var(--color-light-gray)' : 'none' }}>
                        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 'var(--space-2)' }}>"{t.quote}"</p>
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{t.author}</p>
                      </div>
                    ))}
                  </div>
                )}

                {title === 'Seminars' && <AtlSeminarsSection seminars={data.seminars} />}

                {title === 'Activities' && (
                  <VsacInnerAccordion titles={data.activities.map((a) => a.title)}>
                    {(si) => <AtlActivitySection activity={data.activities[si]} photos={activityPhotosBySection[si] ?? []} />}
                  </VsacInnerAccordion>
                )}

                {title === 'People' && (
                  <div>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-3)' }}>{data.people.institutionsIntro}</p>
                    <CheckBullets items={data.people.institutions} />
                    {data.people.facultyParagraph.split('\n').map((para, pi) => (
                      <p key={pi} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-3)' }}>{para}</p>
                    ))}
                  </div>
                )}

                {title === 'Publications' && (
                  <ol style={{ paddingLeft: 'var(--space-6)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {data.publications.map((p, pi) => <li key={pi} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>{p}</li>)}
                  </ol>
                )}

                {title === 'Outcomes & Gallery' && (
                  <AtlOutcomesGallerySection
                    outcomes={data.outcomes}
                    summitTable={data.summitTable}
                    atlInNewsCaption={data.atlInNewsCaption}
                    regionalPhotos={photoMap['outcomes-regional-meet-2023-24'] ?? []}
                    iitPhotos={photoMap['outcomes-iit-madras-2023-24'] ?? []}
                    newsPhotos={photoMap['outcomes-news-2023-24'] ?? []}
                  />
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function VsacTrainingResearchSection({ items }: { items: TrainingResearchItem[] }) {
  return (
    <VsacInnerAccordion titles={items.map((it) => it.title)}>
      {(i) => {
        const item = items[i];
        return (
          <>
            {item.paragraphs.map((para, pi) => (
              <p key={pi} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                {para}
              </p>
            ))}
            {item.table && (
              <>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                  Participant List:
                </p>
                <VsacSimpleTable table={item.table} />
              </>
            )}
            {item.secondParagraph && (
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                {item.secondParagraph}
              </p>
            )}
            {item.secondTable && <VsacSimpleTable table={item.secondTable} />}
          </>
        );
      }}
    </VsacInnerAccordion>
  );
}

function VsacCollaborationsSection({ items, galleryPhotos }: { items: CollaborationItem[]; galleryPhotos: (WithId & { imageUrl: string })[] }) {
  return (
    <VsacInnerAccordion titles={items.map((it) => it.title)}>
      {(i) => {
        const item = items[i];
        if (item.isGallery) {
          return galleryPhotos.length > 0 ? (
            <PhotoGrid photos={galleryPhotos} alt="VSAC Gallery" />
          ) : (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
              Content for this section is coming soon.
            </p>
          );
        }
        return (
          <>
            {item.paragraphs?.map((para, pi) => (
              <p key={pi} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                {para}
              </p>
            ))}
            {item.intro && (
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                {item.intro}
              </p>
            )}
            {item.bullets && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {item.bullets.map((b, bi) => (
                  <li key={bi} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                      <strong>{b.lead}</strong>{b.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        );
      }}
    </VsacInnerAccordion>
  );
}

function VsacAccordion({
  team,
  trainingResearch,
  collaborations,
  galleryPhotos,
}: {
  team: typeof vsac.team;
  trainingResearch: TrainingResearchItem[];
  collaborations: CollaborationItem[];
  galleryPhotos: (WithId & { imageUrl: string })[];
}) {
  const sections = ['Team (VSAC)', 'Training / Research', 'Collaborations'];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {sections.map((title, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {title === 'Team (VSAC)' ? (
                  <VsacTeamSection team={team} />
                ) : title === 'Training / Research' ? (
                  <VsacTrainingResearchSection items={trainingResearch} />
                ) : (
                  <VsacCollaborationsSection items={collaborations} galleryPhotos={galleryPhotos} />
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function HpcMemberCard({ member }: { member?: HpcMember }) {
  if (!member) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
        Content for this section is coming soon.
      </p>
    );
  }
  return (
    <div style={{ border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{member.name}</span>
      {member.designation && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{member.designation}</span>}
      {member.email && (
        <a href={`mailto:${member.email}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{member.email}</a>
      )}
      {member.mobile && (
        <a href={`tel:${member.mobile.replace(/\s+/g, '')}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{member.mobile}</a>
      )}
      {member.interests && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{member.interests}</span>}
      {member.profileLink && (
        <a href={member.profileLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-dark, var(--color-accent))', fontWeight: 600, marginTop: 'var(--space-1)' }}>
          View Faculty Profile →
        </a>
      )}
    </div>
  );
}

function HpcTeamSection({ team }: { team: typeof highPerformanceComputingLab.team }) {
  const [activeTab, setActiveTab] = useState<'In-Charge' | 'Faculty Members'>('In-Charge');

  return (
    <div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {(['In-Charge', 'Faculty Members'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: '1 1 160px',
                padding: 'var(--space-3) var(--space-5)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === 'In-Charge' ? (
        <HpcMemberCard member={team.inCharge[0]} />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          {team.facultyMembers.map((m) => <HpcMemberCard key={m.name} member={m} />)}
        </div>
      )}
    </div>
  );
}

function HpcNotApplicable() {
  return (
    <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', textAlign: 'center' }}>
      <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', fontWeight: 700 }}>— NA —</span>
    </div>
  );
}

const HPC_SECTIONS = [
  'Team',
  'Training / Research or Academic Projects [Completed / Ongoing]',
  'Students Benefited',
  'Collaborations [National / International]',
  'Outcomes',
  'Activities',
];

function HpcAccordion({ data }: { data: typeof highPerformanceComputingLab }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {HPC_SECTIONS.map((title, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {title === 'Team' ? (
                  <HpcTeamSection team={data.team} />
                ) : title === 'Training / Research or Academic Projects [Completed / Ongoing]' ? (
                  <>
                    <SectionHeading>External Funded Projects</SectionHeading>
                    <CheckBullets items={data.fundedProjects} />
                    <div style={{ marginTop: 'var(--space-6)' }}>
                      <SectionHeading>Faculty Research</SectionHeading>
                      <CheckBullets items={data.facultyResearch} />
                    </div>
                  </>
                ) : title === 'Students Benefited' ? (
                  <HpcNotApplicable />
                ) : title === 'Collaborations [National / International]' ? (
                  <HpcNotApplicable />
                ) : title === 'Outcomes' ? (
                  <CheckBullets items={data.outcomes} />
                ) : (
                  <CheckBullets items={data.activities} />
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function CanoeSimpleTableView({ table }: { table: CanoeSimpleTable }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 'var(--space-5)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {table.headers.map((h) => (
              <th key={h} style={TI_DSP_TABLE_TH_STYLE}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={TI_DSP_TABLE_TD_STYLE}>
                  {cell.split('\n').map((line, li) => (
                    <Fragment key={li}>
                      {li > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CanoePhotoGrid({ photos }: { photos: (WithId & { imageUrl: string })[] }) {
  if (photos.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', margin: 0 }}>
        Photos coming soon.
      </p>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
      {photos.map((p) => (
        <img
          key={p.id}
          src={p.imageUrl}
          alt="Concrete Canoe Laboratory"
          style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
        />
      ))}
    </div>
  );
}

function CanoeStudentTeamPhoto({ team, photos }: { team: CanoeStudentTeam; photos: (WithId & { imageUrl: string })[] }) {
  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      {photos.length > 0 ? (
        <img
          src={photos[0].imageUrl}
          alt={team.label}
          style={{ width: '100%', maxWidth: 480, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)', display: 'block', marginBottom: 'var(--space-2)' }}
        />
      ) : (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', margin: '0 0 var(--space-2)' }}>
          Team photo coming soon.
        </p>
      )}
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 var(--space-2)' }}>{team.label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {team.students.map((s) => (
          <span key={s} style={{ fontSize: 'var(--text-xs)', background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-full)', padding: '0.2rem 0.7rem', color: 'var(--color-text)' }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function CanoeCompetitionsTable({ competitions }: { competitions: CanoeCompetition[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={TI_DSP_TABLE_TH_STYLE}>S.No</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Name of the Competition</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Date</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>List of Students Participated</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Year</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((c, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
              <td style={TI_DSP_TABLE_TD_STYLE}>{i + 1}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{c.name}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{c.date}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{c.students.join(', ')}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{c.year}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{c.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CANOE_SECTIONS = [
  'In-charge',
  'Academic Projects [Ongoing]',
  'Previous Project Works',
  'Students Benefited',
  'Faculty Mentors',
  'Outcomes',
  'Competitions',
  'Activities',
];

function CanoeAccordion({
  data,
  academicProjectPhotos,
  previousProjectPhotos,
  teamPhotos,
}: {
  data: typeof concreteCanoeLab;
  academicProjectPhotos: (WithId & { imageUrl: string })[];
  previousProjectPhotos: (WithId & { imageUrl: string })[];
  teamPhotos: Record<string, (WithId & { imageUrl: string })[]>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {CANOE_SECTIONS.map((title, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {title === 'In-charge' ? (
                  <HpcMemberCard member={data.inCharge} />
                ) : title === 'Academic Projects [Ongoing]' ? (
                  <>
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                      {data.academicProject.heading}
                    </p>
                    <CanoeSimpleTableView table={data.academicProject.team} />
                    {data.academicProject.paragraphs.map((p, i) => (
                      <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                        {p}
                      </p>
                    ))}
                    <CanoePhotoGrid photos={academicProjectPhotos} />
                  </>
                ) : title === 'Previous Project Works' ? (
                  <>
                    <CanoeSimpleTableView table={data.previousProjects.table} />
                    <CanoePhotoGrid photos={previousProjectPhotos} />
                  </>
                ) : title === 'Students Benefited' ? (
                  <>
                    {data.studentsBenefited.map((team) => (
                      <CanoeStudentTeamPhoto key={team.label} team={team} photos={teamPhotos[team.label] ?? []} />
                    ))}
                  </>
                ) : title === 'Faculty Mentors' ? (
                  <CheckBullets items={data.facultyMentors} />
                ) : title === 'Outcomes' ? (
                  <>
                    <SectionHeading>{data.outcomes.heading}</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
                      {data.outcomes.subheading}
                    </p>
                    {data.outcomes.paragraphs.map((p, i) => (
                      <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                        {p}
                      </p>
                    ))}
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      <strong>Brief: </strong>{data.outcomes.brief}
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Team Members</p>
                    <CanoeSimpleTableView table={data.outcomes.team} />
                  </>
                ) : title === 'Competitions' ? (
                  <CanoeCompetitionsTable competitions={data.competitions} />
                ) : (
                  <CheckBullets items={data.activities} />
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function DhclMemberCard({ member }: { member?: DhclMember }) {
  if (!member) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
        Content for this section is coming soon.
      </p>
    );
  }
  return (
    <div style={{ border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{member.name}</span>
      {member.designation && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{member.designation}</span>}
      {member.email && (
        <a href={`mailto:${member.email}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{member.email}</a>
      )}
      {member.mobile && (
        <a href={`tel:${member.mobile.replace(/\s+/g, '')}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{member.mobile}</a>
      )}
      {member.interests && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{member.interests}</span>}
      {member.website && (
        <a href={`https://${member.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-dark, var(--color-accent))', fontWeight: 600, marginTop: 'var(--space-1)' }}>
          {member.website}
        </a>
      )}
    </div>
  );
}

const DHCL_SECTIONS = [
  'In-charge',
  'Academic Projects [Ongoing]',
  'Students Benefited',
  'Outcomes',
  'Activities',
];

function DhclAccordion({ data }: { data: typeof dreamHouseConstructionLab }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {DHCL_SECTIONS.map((title, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {title === 'In-charge' ? (
                  <DhclMemberCard member={data.inCharge} />
                ) : title === 'Academic Projects [Ongoing]' ? (
                  <>
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                      {data.academicProject.heading}
                    </p>
                    <CanoeSimpleTableView table={data.academicProject.team} />
                    {data.academicProject.paragraphs.map((p, i) => (
                      <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                        {p}
                      </p>
                    ))}
                  </>
                ) : title === 'Students Benefited' ? (
                  <StudentsBenefitedTable groups={data.studentsBenefited} />
                ) : title === 'Outcomes' ? (
                  <>
                    <SectionHeading>{data.outcomes.heading}</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
                      {data.outcomes.subheading}
                    </p>
                    {data.outcomes.paragraphs.map((p, i) => (
                      <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                        {p}
                      </p>
                    ))}
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      <strong>Brief: </strong>{data.outcomes.brief}
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Team Members</p>
                    <CanoeSimpleTableView table={data.outcomes.team} />
                  </>
                ) : (
                  <CheckBullets items={data.activities} />
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function FlCoordinatorCard({ coordinator }: { coordinator: FlCoordinator }) {
  return (
    <div style={{ border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{coordinator.name}</span>
      {coordinator.designation && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{coordinator.designation}</span>}
      {coordinator.email && (
        <a href={`mailto:${coordinator.email}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{coordinator.email}</a>
      )}
      {coordinator.mobile && (
        <a href={`tel:${coordinator.mobile.replace(/\s+/g, '')}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{coordinator.mobile}</a>
      )}
    </div>
  );
}

function FlLanguageTable({ language }: { language: FlLanguage }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={TI_DSP_TABLE_TH_STYLE}>Academic Year</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>No. of students trained in {language.name}</th>
          </tr>
        </thead>
        <tbody>
          {language.table.map((row, i) => (
            <tr key={row.year} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
              <td style={TI_DSP_TABLE_TD_STYLE}>{row.year}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FlLanguageTabs({ languages }: { languages: FlLanguage[] }) {
  const [active, setActive] = useState(0);
  const lang = languages[active];

  return (
    <div style={{ marginTop: 'var(--space-6)' }}>
      <VsacTabGroup labels={languages.map((l) => l.name)} activeIndex={active} onSelect={setActive} />
      <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
        <p style={{ fontSize: 'var(--text-base)', fontStyle: 'italic', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
          “{lang.quote}”
        </p>
        {lang.paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
            {p}
          </p>
        ))}
        <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent-dark, var(--color-accent))', marginBottom: 'var(--space-4)' }}>
          <span aria-hidden="true">📄</span> {lang.reportLabel}
        </p>
        <FlLanguageTable language={lang} />
      </div>
    </div>
  );
}

interface WisePlacementDoc extends WithId {
  name: string;
  regdNo: string;
  company: string;
  package: string;
  imageUrl: string;
}

function WisePlacementCard({ placement }: { placement: WisePlacementDoc }) {
  return (
    <div style={{ borderRadius: 0, overflow: 'hidden', border: '1px solid var(--color-light-gray)' }}>
      <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--color-primary-dark)' }}>
        <img
          src={placement.imageUrl}
          alt={placement.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 'var(--space-2) var(--space-3)', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-white)' }}>{placement.company}</span>
          {placement.package && (
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-white)', background: 'var(--color-accent)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>{placement.package}</span>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-2) var(--space-3)', background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-white)', margin: 0, lineHeight: 1.3 }}>{placement.name}</p>
          {placement.regdNo && <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.85)', margin: 0 }}>{placement.regdNo}</p>}
        </div>
      </div>
    </div>
  );
}

// Only entries an admin has actually added (with a photo) show up here at
// all — no placeholder cards for entries that don't exist yet in Firestore.
function WisePlacementGrid({ placements }: { placements: WisePlacementDoc[] }) {
  const withPhotos = placements.filter((p) => p.imageUrl);
  if (withPhotos.length === 0) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 0, marginTop: 'var(--space-6)' }}>
      {withPhotos.map((p) => (
        <WisePlacementCard key={p.id} placement={p} />
      ))}
    </div>
  );
}

function NirvahanaTeamSection({ team }: { team: typeof nirvahana.team }) {
  const [activeTab, setActiveTab] = useState<'In-Charge' | 'Faculty Members'>('In-Charge');

  return (
    <div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {(['In-Charge', 'Faculty Members'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: '1 1 160px',
                padding: 'var(--space-3) var(--space-5)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>
      {activeTab === 'In-Charge' ? (
        <HpcMemberCard member={team.inCharge} />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          {team.facultyMembers.map((m) => <HpcMemberCard key={m.name} member={m} />)}
        </div>
      )}
    </div>
  );
}

function NirvahanaEventCard({ event, photoUrl }: { event: NirvahanaEvent; photoUrl?: string }) {
  return (
    <div>
      <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-off-white)' }}>
        <img
          src={photoUrl || PHOTO_NEEDED_PLACEHOLDER}
          alt={event.caption}
          style={{ width: '100%', height: 240, objectFit: 'cover' }}
        />
      </div>
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', textAlign: 'center', marginTop: 'var(--space-2)' }}>
        {event.caption}
      </p>
    </div>
  );
}

function NirvahanaActivitiesList({ activities }: { activities: typeof nirvahana.activities }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {activities.map((a) => (
        <li key={a.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
          <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>
            <strong>{a.title}:</strong> {a.description}
          </span>
        </li>
      ))}
    </ul>
  );
}

function StudentsBenefitedTable({ groups }: { groups: StudentsBenefitedGroup[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={TI_DSP_TABLE_TH_STYLE}>S. No</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Regd No</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Name of the Student</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <Fragment key={group.yearLabel}>
              <tr>
                <td colSpan={3} style={{ ...TI_DSP_TABLE_TD_STYLE, fontWeight: 700, background: 'var(--color-off-white)' }}>
                  {group.yearLabel}
                </td>
              </tr>
              {group.students.map((s, i) => (
                <tr key={s.regdNo} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                  <td style={TI_DSP_TABLE_TD_STYLE}>{i + 1}.</td>
                  <td style={TI_DSP_TABLE_TD_STYLE}>{s.regdNo}</td>
                  <td style={TI_DSP_TABLE_TD_STYLE}>{s.name}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UltraTechAccordion({
  sections,
  content,
  inCharge,
  studentsBenefited,
}: {
  sections: string[];
  content: Record<string, string[]>;
  inCharge: UltraTechInCharge;
  studentsBenefited: StudentsBenefitedGroup[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const IN_CHARGE_TITLE = 'In-charge';
  const STUDENTS_BENEFITED_TITLE = 'Students Benefited';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {sections.map((title, i) => {
        const isOpen = openIndex === i;
        const isInCharge = title === IN_CHARGE_TITLE;
        const isStudentsBenefited = title === STUDENTS_BENEFITED_TITLE;
        const items = content[title] ?? [];
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {isInCharge ? (
                  <TiDspMemberCard member={inCharge} />
                ) : isStudentsBenefited ? (
                  studentsBenefited.length > 0 ? (
                    <StudentsBenefitedTable groups={studentsBenefited} />
                  ) : (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                      Content for this section is coming soon.
                    </p>
                  )
                ) : items.length > 0 ? (
                  <CheckBullets items={items} />
                ) : (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                    Content for this section is coming soon.
                  </p>
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

const TI_DSP_TRAINING_RESEARCH_TITLE = 'Training / Research or Academic Projects [Completed / Ongoing]';
const TI_DSP_GALLERY_TITLE = 'Gallery';

function TiDspAccordion({
  sections,
  content,
  trainingResearch,
  galleryPhotos,
}: {
  sections: string[];
  content: Record<string, string[]>;
  trainingResearch: typeof tiDspCoe.trainingResearch;
  galleryPhotos: (WithId & { imageUrl: string })[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-6)' }}>
      {sections.map((title, i) => {
        const isOpen = openIndex === i;
        const isTrainingResearch = title === TI_DSP_TRAINING_RESEARCH_TITLE;
        const isGallery = title === TI_DSP_GALLERY_TITLE;
        const items = content[title] ?? [];
        return (
          <div key={title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{title}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {isTrainingResearch ? (
                  <TrainingResearchSection data={trainingResearch} />
                ) : isGallery ? (
                  galleryPhotos.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                      {galleryPhotos.map((p) => (
                        <img
                          key={p.id}
                          src={p.imageUrl}
                          alt="TI-DSP Centre of Excellence"
                          style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                      Content for this section is coming soon.
                    </p>
                  )
                ) : items.length > 0 ? (
                  <CheckBullets items={items} />
                ) : (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', margin: 0 }}>
                    Content for this section is coming soon.
                  </p>
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function IicPage({ iic }: { iic: typeof institutionInnovationCell }) {
  const [activeTab, setActiveTab] = useState(IIC_TABS[0]);
  const { docs: memberPhotos } = useCollection<WithId & { imageUrl: string }>('iicMemberPhotos', [], { silent: true });
  const memberPhotoMap = new Map(memberPhotos.map((p) => [p.id, p.imageUrl]));

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="detail-grid">
          <div>
            {activeTab === 'About IIC' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>About IIC</h2>
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-8)' }}>
                  {iic.about}
                </p>
                <IicBulletList heading="Vision" items={iic.vision} />
                <IicBulletList heading="Mission" items={iic.mission} />
                <div>
                  <span className="section-label">History</span>
                  <h2 className="section-title" style={{ fontSize: '1.5rem' }}>{iic.journeyTitle}</h2>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                    {iic.journey}
                  </p>
                </div>
              </>
            )}

            {activeTab === 'IIC – Constitution' && (
              <>
                <span className="section-label">Governance</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>IIC – Constitution</h2>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                  {iic.constitution.intro}
                </p>

                <h3 style={{ textAlign: 'center', color: 'var(--color-primary)', fontWeight: 900, marginBottom: 'var(--space-8)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {iic.constitution.heading}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                  <div style={{ maxWidth: 220 }}>
                    <IicMemberCard name={iic.constitution.chairman.name} role={iic.constitution.chairman.role} size={100} photoUrl={memberPhotoMap.get(iic.constitution.chairman.name)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                  {iic.constitution.leadership.map((person) => (
                    <IicMemberCard key={person.name} name={person.name} role={person.role} size={80} photoUrl={memberPhotoMap.get(person.name)} />
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  {iic.constitution.coordinators.map((person) => (
                    <IicMemberCard key={person.name} name={person.name} role={person.role} size={64} photoUrl={memberPhotoMap.get(person.name)} />
                  ))}
                </div>

                <p style={{ fontSize: 'var(--text-sm)' }}>
                  <a href={iic.constitution.viewLinkHref} download style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {iic.constitution.viewLinkText}
                  </a>
                </p>
              </>
            )}

            {activeTab === 'Innovation Ambassadors' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>Innovation Ambassadors</h2>
                <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                  {iic.innovationAmbassadors.roleIntro}
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                  {iic.innovationAmbassadors.responsibilities.map((point, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>{point}</span>
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                  {iic.innovationAmbassadors.listIntro}
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {iic.innovationAmbassadors.links.map((link, i) => (
                    <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>
                      * {link.href ? (
                        <a href={link.href} download style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{link.label}</a>
                      ) : (
                        link.label
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {activeTab === 'IIC Activities' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>IIC Activities</h2>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                  {iic.activities.intro}
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {iic.activities.years.map((year, i) => (
                    <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>
                      * {year.href ? (
                        <a href={year.href} download style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{year.label}</a>
                      ) : (
                        year.label
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {activeTab === 'Atal Tinkering Schools' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>Atal Tinkering Schools</h2>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                  {iic.atalTinkeringSchools.intro}
                </p>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                  {iic.atalTinkeringSchools.listHeading}
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-accent)' }}>
                        <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900, whiteSpace: 'nowrap' }}>S.No</th>
                        <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900, whiteSpace: 'nowrap' }}>School Code</th>
                        <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900 }}>School Name</th>
                        <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900 }}>Address</th>
                        <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900 }}>Email</th>
                        <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900, whiteSpace: 'nowrap' }}>Mobile</th>
                        <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900 }}>IIC Coordinator</th>
                      </tr>
                    </thead>
                    <tbody>
                      {iic.atalTinkeringSchools.schools.map((school, i) => (
                        <tr key={school.sno} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'transparent' }}>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{school.sno}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{school.schoolCode}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', fontWeight: 600 }}>{school.schoolName}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{school.address}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{school.email}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{school.mobile}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{school.coordinator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'Rating Certificates' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>Rating Certificates</h2>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {iic.ratingCertificates.map((cert, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {cert.href ? (
                        <a href={cert.href} download style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-base)' }}>{cert.label}</a>
                      ) : (
                        <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{cert.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {activeTab === 'IIC Annual Reports' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>IIC Annual Reports</h2>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {iic.annualReports.map((report, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {report.href ? (
                        <a href={report.href} download style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-base)' }}>{report.label}</a>
                      ) : (
                        <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{report.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {activeTab === 'SIH Internal Hackathon Reports' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>SIH Internal Hackathon Reports</h2>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {iic.sihHackathonReports.map((report, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {report.href ? (
                        <a href={report.href} download style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-base)' }}>{report.label}</a>
                      ) : (
                        <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{report.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {activeTab === 'National Innovation Start-Up Policy' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>{iic.nisp.heading}</h2>
                <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {iic.nisp.items.map((row, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', background: i % 2 === 0 ? 'var(--color-off-white)' : 'var(--color-white)' }}
                    >
                      <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{row.label}</span>
                      {row.href ? (
                        <a href={row.href} download style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>Click here..</a>
                      ) : (
                        <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>Click here..</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {!['About IIC', 'IIC – Constitution', 'Innovation Ambassadors', 'IIC Activities', 'Atal Tinkering Schools', 'Rating Certificates', 'IIC Annual Reports', 'SIH Internal Hackathon Reports', 'National Innovation Start-Up Policy'].includes(activeTab) && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{activeTab}</h2>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>
                  Content for this section is coming soon.
                </p>
              </>
            )}
          </div>

          {/* Section nav */}
          <div className="detail-sidebar">
            <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'sticky', top: '110px' }}>
              {IIC_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-5)',
                      border: 'none',
                      borderBottom: '1px solid var(--color-light-gray)',
                      background: isActive ? 'var(--color-primary)' : 'transparent',
                      color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VdlPage({ vdl }: { vdl: typeof vehicleDesignLab }) {
  const [activeTab, setActiveTab] = useState(VDL_TABS[0]);
  const { docs: testingPhotos } = useCollection<WithId & { imageUrl: string }>('vdlTestingPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: campusVehiclePhotos } = useCollection<WithId & { imageUrl: string }>('vdlCampusVehiclePhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: industryCollabPhotos } = useCollection<WithId & { imageUrl: string }>('vdlIndustryCollabPhotos', [orderBy('order', 'asc')], { silent: true });

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="detail-grid">
          <div>
            {activeTab === 'About VDL' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>About VDL</h2>
                {vdl.paragraphs.map((para, i) => (
                  <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                    {para}
                  </p>
                ))}
                <CheckBullets items={vdl.fundamentals} />

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <SectionHeading>Vision</SectionHeading>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                    {vdl.vision}
                  </p>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <SectionHeading>Mission</SectionHeading>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                    {vdl.mission}
                  </p>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <SectionHeading>Objectives</SectionHeading>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {vdl.objectives.map((o, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                          <strong>{o.lead}</strong>{o.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <VdlTeamSection team={vdl.team} />
                </div>
              </>
            )}

            {activeTab === 'Facilities & Projects' && (
              <>
                <span className="section-label">Infrastructure</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>Facilities & Projects</h2>
                <VdlFacilitiesSection
                  facilities={vdl.facilities}
                  testingPhotos={testingPhotos}
                  campusVehiclePhotos={campusVehiclePhotos}
                />
              </>
            )}

            {activeTab === 'Industry Collaborations' && (
              <>
                <span className="section-label">Partnerships</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>Industry Collaborations</h2>
                <VdlIndustryCollaborationsSection data={vdl.industryCollaborations} photos={industryCollabPhotos} />
              </>
            )}

            {activeTab === 'Students Achievements & Placements' && (
              <>
                <span className="section-label">Recognition</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>Students Achievements & Placements</h2>
                <VdlStudentsAchievementsSection data={vdl.studentsAchievements} />
              </>
            )}

            {activeTab === 'VDL Outcomes' && (
              <>
                <span className="section-label">Impact</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>VDL Outcomes</h2>
                <VdlOutcomesSection outcomes={vdl.outcomes} />
              </>
            )}
          </div>

          {/* Section nav */}
          <div className="detail-sidebar">
            <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'sticky', top: '110px' }}>
              {VDL_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-5)',
                      border: 'none',
                      borderBottom: '1px solid var(--color-light-gray)',
                      background: isActive ? 'var(--color-primary)' : 'transparent',
                      color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WiseModuleItemList({ items }: { items: { number: string; text: string }[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {items.map((it) => (
        <li key={it.number} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>▸</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{it.number} {it.text}</span>
        </li>
      ))}
    </ul>
  );
}

function WiseModuleSectionView({ section }: { section: WiseModuleSection }) {
  return (
    <div style={{ marginBottom: 'var(--space-5)' }}>
      <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
        {section.number}. {section.title}
      </p>
      {section.items && <WiseModuleItemList items={section.items} />}
      {section.subgroups && section.subgroups.map((sg) => (
        <div key={sg.number} style={{ marginTop: 'var(--space-3)', marginLeft: 'var(--space-4)' }}>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--space-1)' }}>
            {sg.number} {sg.title}
          </p>
          <WiseModuleItemList items={sg.items} />
        </div>
      ))}
    </div>
  );
}

function WiseModulesSection({ intro, modules }: { intro: string; modules: WiseModuleTab[] }) {
  const [active, setActive] = useState(0);
  const tab = modules[active];

  return (
    <>
      <span className="section-label">Program Modules</span>
      <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-4)' }}>Modules</h2>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
        {intro}
      </p>
      <VsacTabGroup labels={modules.map((m) => m.name)} activeIndex={active} onSelect={setActive} />
      {tab.simpleList ? (
        <CheckBullets items={tab.simpleList} />
      ) : (
        tab.sections?.map((s) => <WiseModuleSectionView key={s.number} section={s} />)
      )}
    </>
  );
}

function WiseProjectsSection({ intro, batches }: { intro: string; batches: WiseProjectBatch[] }) {
  const [active, setActive] = useState(0);
  const batch = batches[active];

  return (
    <>
      <span className="section-label">Beneficiaries</span>
      <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-4)' }}>Projects</h2>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
        {intro}
      </p>
      <VsacTabGroup labels={batches.map((b) => b.year)} activeIndex={active} onSelect={setActive} />
      {batch.modules.map((m) => (
        <div key={m.heading} style={{ marginBottom: 'var(--space-6)' }}>
          <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
            {m.heading}
          </p>
          <CheckBullets items={m.projects} />
        </div>
      ))}
    </>
  );
}

function WiseTeamMemberCard({ member, photoUrl }: { member: WiseTeamMember; photoUrl?: string }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <img
        src={photoUrl || PHOTO_NEEDED_PLACEHOLDER}
        alt={member.name}
        style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--color-light-gray)' }}
      />
      <div style={{ flex: '1 1 260px' }}>
        <p style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-primary)', margin: 0 }}>{member.name}</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', margin: '0 0 var(--space-3)' }}>{member.designation}</p>
        {member.bio.map((p, i) => (
          <p key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 'var(--space-3)' }}>{p}</p>
        ))}
      </div>
    </div>
  );
}

function WiseTeamAccordion({ team, photoMap }: { team: WiseTeamMember[]; photoMap: Record<string, string | undefined> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-4)' }}>
      {team.map((member, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={member.id}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>
                {member.name}, {member.designation}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                <WiseTeamMemberCard member={member} photoUrl={photoMap[member.id]} />
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function WiseEliteInfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-white)' }}>
      <div style={{ background: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: 'var(--space-3) var(--space-4)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
        {title}
      </div>
      <div style={{ padding: 'var(--space-4)' }}>
        {children}
      </div>
    </div>
  );
}

function WiseEliteProjectView({ project, photoUrl }: { project: WiseEliteProject; photoUrl?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
      <WiseEliteInfoCard title={`Project: ${project.name}`}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
          {project.description}
        </p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {project.students.map((s) => (
            <li key={s.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              <span>• {s.name}</span>
              <span style={{ color: 'var(--color-text-light)', whiteSpace: 'nowrap' }}>{s.college}</span>
            </li>
          ))}
        </ul>
      </WiseEliteInfoCard>
      <WiseEliteInfoCard title={`Project: ${project.name}`}>
        <img
          src={photoUrl || PHOTO_NEEDED_PLACEHOLDER}
          alt={project.name}
          style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
        />
      </WiseEliteInfoCard>
    </div>
  );
}

function WiseEliteProjectsSection({
  intro,
  projects,
  photoMap,
}: {
  intro: string;
  projects: WiseEliteProject[];
  photoMap: Record<string, string | undefined>;
}) {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <>
      <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
        {intro}
      </p>
      <VsacTabGroup labels={projects.map((p) => p.name)} activeIndex={active} onSelect={setActive} />
      <WiseEliteProjectView project={project} photoUrl={photoMap[project.id]} />
    </>
  );
}

function WiseMentoringTable({ batch }: { batch: WiseMentoringBatch }) {
  return (
    <>
      <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)' }}>
        {batch.heading}
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TI_DSP_TABLE_TH_STYLE}>S.No</th>
              <th style={TI_DSP_TABLE_TH_STYLE}>Name of the Student</th>
              <th style={TI_DSP_TABLE_TH_STYLE}>Regd No</th>
              <th style={TI_DSP_TABLE_TH_STYLE}>Section</th>
            </tr>
          </thead>
          <tbody>
            {batch.students.map((s, i) => (
              <tr key={s.regdNo} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                <td style={TI_DSP_TABLE_TD_STYLE}>{i + 1}</td>
                <td style={TI_DSP_TABLE_TD_STYLE}>{s.name}</td>
                <td style={TI_DSP_TABLE_TD_STYLE}>{s.regdNo}</td>
                <td style={TI_DSP_TABLE_TD_STYLE}>{s.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WiseMentoringSection({ paragraphs, batches }: { paragraphs: string[]; batches: WiseMentoringBatch[] }) {
  const [active, setActive] = useState(0);
  const batch = batches[active];

  return (
    <>
      <span className="section-label">Advanced Track</span>
      <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>Microsoft Mentoring Program</h2>
      {paragraphs.map((para, i) => (
        <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
          {para}
        </p>
      ))}
      <div style={{ marginTop: 'var(--space-6)' }}>
        <VsacTabGroup labels={batches.map((b) => b.tabLabel)} activeIndex={active} onSelect={setActive} />
        <WiseMentoringTable batch={batch} />
      </div>
    </>
  );
}

function WisePlacementStatsTable({ ranges }: { ranges: WisePlacementStatsYear['ranges'] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={TI_DSP_TABLE_TH_STYLE}>Range</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Total Count</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Company Selected</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>Package</th>
            <th style={TI_DSP_TABLE_TH_STYLE}>No. of Students</th>
          </tr>
        </thead>
        <tbody>
          {ranges.map((r) => r.rows.map((row, i) => (
            <tr key={`${r.range}-${i}`} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
              {i === 0 && (
                <td rowSpan={r.rows.length} style={{ ...TI_DSP_TABLE_TD_STYLE, fontWeight: 700, verticalAlign: 'top', background: 'var(--color-off-white)' }}>
                  {r.range}
                </td>
              )}
              {i === 0 && (
                <td rowSpan={r.rows.length} style={{ ...TI_DSP_TABLE_TD_STYLE, verticalAlign: 'top', background: 'var(--color-off-white)' }}>
                  {r.totalCount}
                </td>
              )}
              <td style={TI_DSP_TABLE_TD_STYLE}>{row.company}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{row.package}</td>
              <td style={TI_DSP_TABLE_TD_STYLE}>{row.count}</td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  );
}

function WisePlacementStatsAccordion({ years }: { years: WisePlacementStatsYear[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {years.map((y, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={y.heading}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{y.heading}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>{y.heading}</p>
                <WisePlacementStatsTable ranges={y.ranges} />
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function WiseTestimonialCard({ testimonial, photoUrl }: { testimonial: WiseTestimonial; photoUrl?: string }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <img
        src={photoUrl || PHOTO_NEEDED_PLACEHOLDER}
        alt={testimonial.name}
        style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--color-light-gray)' }}
      />
      <div style={{ flex: '1 1 260px' }}>
        <p style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-primary)', margin: 0 }}>{testimonial.name}</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', margin: '0 0 var(--space-3)' }}>
          {testimonial.batch} | {testimonial.company}
        </p>
        {testimonial.quote.map((p, i) => (
          <p key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 'var(--space-3)' }}>{p}</p>
        ))}
      </div>
    </div>
  );
}

function WiseTestimonialAccordion({ testimonials, photoMap }: { testimonials: WiseTestimonial[]; photoMap: Record<string, string | undefined> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'var(--space-4)' }}>
      {testimonials.map((t, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={t.id}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)' }}>
                {t.name} | {t.batch}.
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1 }}>{isOpen ? '−' : '+'}</span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                <WiseTestimonialCard testimonial={t} photoUrl={photoMap[t.id]} />
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

function WiseNseClippingCard({ clipping, photoUrl }: { clipping: WiseNseClipping; photoUrl?: string }) {
  return (
    <div>
      <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-off-white)' }}>
        <img
          src={photoUrl || PHOTO_NEEDED_PLACEHOLDER}
          alt={clipping.caption}
          style={{ width: '100%', height: 260, objectFit: 'cover' }}
        />
      </div>
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', textAlign: 'center', marginTop: 'var(--space-2)' }}>
        {clipping.caption}
      </p>
    </div>
  );
}

function WiseNseSection({ paragraphs, clippings, photoMap }: { paragraphs: string[]; clippings: WiseNseClipping[]; photoMap: Record<string, string | undefined> }) {
  return (
    <>
      <span className="section-label">Partnership</span>
      <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>TalentSprint @ NSE</h2>
      {paragraphs.map((para, i) => (
        <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
          {para}
        </p>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
        {clippings.map((c) => (
          <WiseNseClippingCard key={c.id} clipping={c} photoUrl={photoMap[c.id]} />
        ))}
      </div>
    </>
  );
}

function WisePage({ wise }: { wise: typeof talentSprintWise }) {
  const [activeTab, setActiveTab] = useState(WISE_TABS[0]);
  const { docs: wisePlacements } = useOrderedCollection<WisePlacementDoc>('wisePlacements', 'order');
  const { docs: wiseTeamPhotos } = useCollection<WithId & { imageUrl?: string }>('wiseTeamPhotos', [], { silent: true });
  const wiseTeamPhotoMap = Object.fromEntries(wiseTeamPhotos.map((p) => [p.id, p.imageUrl]));
  const { docs: wiseElitePhotos } = useCollection<WithId & { imageUrl?: string }>('wiseEliteProjectPhotos', [], { silent: true });
  const wiseElitePhotoMap = Object.fromEntries(wiseElitePhotos.map((p) => [p.id, p.imageUrl]));
  const { docs: wiseTestimonialPhotos } = useCollection<WithId & { imageUrl?: string }>('wiseTestimonialPhotos', [], { silent: true });
  const wiseTestimonialPhotoMap = Object.fromEntries(wiseTestimonialPhotos.map((p) => [p.id, p.imageUrl]));
  const { docs: wiseNsePhotos } = useCollection<WithId & { imageUrl?: string }>('wiseNseClippings', [], { silent: true });
  const wiseNsePhotoMap = Object.fromEntries(wiseNsePhotos.map((p) => [p.id, p.imageUrl]));

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="detail-grid">
          <div>
            {activeTab === 'About WISE' && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>About WISE</h2>
                {wise.paragraphs.map((para, i) => (
                  <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                    {para}
                  </p>
                ))}
                <div style={{ marginTop: 'var(--space-6)' }}>
                  <SectionHeading>Program Objectives</SectionHeading>
                  <CheckBullets items={wise.objectives} />
                </div>
              </>
            )}

            {activeTab === 'Modules' && (
              <WiseModulesSection intro={wise.modulesIntro} modules={wise.modules} />
            )}

            {activeTab === 'Projects' && (
              <WiseProjectsSection intro={wise.projectsIntro} batches={wise.projectBatches} />
            )}

            {activeTab === 'WISE Team' && (
              <>
                <span className="section-label">Team</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>WISE Team</h2>
                <WiseTeamAccordion team={wise.team} photoMap={wiseTeamPhotoMap} />
              </>
            )}

            {activeTab === 'ELITE Program' && (
              <>
                <span className="section-label">Advanced Track</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>ELITE Program</h2>
                {wise.elite.intro.map((para, i) => (
                  <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                    {para}
                  </p>
                ))}

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <SectionHeading>Level – 1 Selection Criteria</SectionHeading>
                  <ol style={{ margin: 0, padding: '0 0 0 1.2rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {wise.elite.level1.map((point, i) => (
                      <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>{point}</li>
                    ))}
                  </ol>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <SectionHeading>Level – 2 Selection Criteria</SectionHeading>
                  <ol style={{ margin: 0, padding: '0 0 0 1.2rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {wise.elite.level2.map((point, i) => (
                      <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>{point}</li>
                    ))}
                  </ol>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <SectionHeading>Benefits of WISE-ELITE Program</SectionHeading>
                  <CheckBullets items={wise.elite.benefits} />
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <WiseEliteProjectsSection intro={wise.elite.projectsIntro} projects={wise.elite.projects} photoMap={wiseElitePhotoMap} />
                </div>
              </>
            )}

            {activeTab === 'Microsoft Mentoring Program' && (
              <WiseMentoringSection paragraphs={wise.mentoring.paragraphs} batches={wise.mentoring.batches} />
            )}

            {activeTab === 'Testimonials' && (
              <>
                <span className="section-label">Voices</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Testimonials</h2>
                <WiseTestimonialAccordion testimonials={wise.testimonials} photoMap={wiseTestimonialPhotoMap} />
              </>
            )}

            {activeTab === 'TalentSprint @ NSE' && (
              <WiseNseSection paragraphs={wise.nse.paragraphs} clippings={wise.nse.clippings} photoMap={wiseNsePhotoMap} />
            )}

            {activeTab === 'Beneficiaries – Placements' && (
              <>
                <span className="section-label">Impact</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-5)' }}>Beneficiaries – Placements</h2>

                <WisePlacementStatsAccordion years={wise.beneficiaryStats} />

                <div style={{ marginTop: 'var(--space-8)' }}>
                  <SectionHeading>Placement Highlights</SectionHeading>
                  <WisePlacementGrid placements={wisePlacements} />
                  {wisePlacements.filter((p) => p.imageUrl).length === 0 && (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>
                      Content for this section is coming soon.
                    </p>
                  )}
                </div>
              </>
            )}

            {!['About WISE', 'Modules', 'Projects', 'WISE Team', 'ELITE Program', 'Microsoft Mentoring Program', 'Beneficiaries – Placements', 'Testimonials', 'TalentSprint @ NSE'].includes(activeTab) && (
              <>
                <span className="section-label">Overview</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{activeTab}</h2>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>
                  Content for this section is coming soon.
                </p>
              </>
            )}
          </div>

          {/* Section nav */}
          <div className="detail-sidebar">
            <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'sticky', top: '110px' }}>
              {WISE_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-5)',
                      border: 'none',
                      borderBottom: '1px solid var(--color-light-gray)',
                      background: isActive ? 'var(--color-primary)' : 'transparent',
                      color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CATEGORY_ICONS: Record<string, typeof Rocket> = {
  innovation: Rocket, industry: Factory, research: Microscope, global: Globe2, student: GraduationCap,
};

export default function DifferentiatorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const { docs: tedxPhotos } = useCollection<WithId & { imageUrl: string }>('tedxSvecwPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: tiDspGalleryPhotos } = useCollection<WithId & { imageUrl: string }>('tiDspGalleryPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: c2sActivityPhotos } = useCollection<WithId & { imageUrl: string }>('chipsToStartupActivityPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: c2sOutcomePhotos } = useCollection<WithId & { imageUrl: string }>('chipsToStartupOutcomePhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: vsacGalleryPhotos } = useCollection<WithId & { imageUrl: string }>('vsacGalleryPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlProjectPhotos2023 } = useCollection<WithId & { imageUrl: string }>('atlProjectPrototypePhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlProjectPhotos2024 } = useCollection<WithId & { imageUrl: string }>('atlProjectPrototypePhotos2024', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlProjectPhotos2025 } = useCollection<WithId & { imageUrl: string }>('atlProjectPrototypePhotos2025', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlZionPhotos } = useCollection<WithId & { imageUrl: string }>('atlZionVisitPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlDayPhotos } = useCollection<WithId & { imageUrl: string }>('atlDayEventPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlDay2024Photos } = useCollection<WithId & { imageUrl: string }>('atlDay2024EventPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlTrance2025Photos } = useCollection<WithId & { imageUrl: string }>('atlTrance2025Photos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlZion2025Photos } = useCollection<WithId & { imageUrl: string }>('atlZion2025VisitPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlDay2025Photos } = useCollection<WithId & { imageUrl: string }>('atlDay2025EventPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlRegionalMeet2025Photos } = useCollection<WithId & { imageUrl: string }>('atlRegionalMeet2025Photos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlJntuKakinadaPhotos } = useCollection<WithId & { imageUrl: string }>('atlJntuKakinadaPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlRtihPhotos } = useCollection<WithId & { imageUrl: string }>('atlRtihPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlRajahmundryExpoPhotos } = useCollection<WithId & { imageUrl: string }>('atlRajahmundryExpoPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlRegionalMeetPhotos } = useCollection<WithId & { imageUrl: string }>('atlGalleryRegionalMeetPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlIitMadrasPhotos } = useCollection<WithId & { imageUrl: string }>('atlGalleryIitMadrasPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: atlNewsPhotos } = useCollection<WithId & { imageUrl: string }>('atlGalleryNewsPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: canoeAcademicProjectPhotos } = useCollection<WithId & { imageUrl: string }>('canoeAcademicProjectPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: canoePreviousProjectPhotos } = useCollection<WithId & { imageUrl: string }>('canoePreviousProjectPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: canoeTeamWakaPhotos } = useCollection<WithId & { imageUrl: string }>('canoeTeamWakaPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: canoeTeamAikyamPhotos } = useCollection<WithId & { imageUrl: string }>('canoeTeamAikyamPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: canoeTeamKanuPhotos } = useCollection<WithId & { imageUrl: string }>('canoeTeamKanuPhotos', [orderBy('order', 'asc')], { silent: true });
  const { docs: nirvahanaEventPhotos } = useCollection<WithId & { imageUrl?: string }>('nirvahanaEventPhotos', [], { silent: true });
  const nirvahanaPhotoMap = Object.fromEntries(nirvahanaEventPhotos.map((p) => [p.id, p.imageUrl]));
  const item = allItems.find((i) => i.slug === slug) ?? null;
  const category = item ? DIFFERENTIATOR_CATEGORIES.find((c) => c.id === item.category) : null;

  useEffect(() => {
    if (item) {
      document.title = `${item.title} | Vishnu Women's University`;
    }
  }, [item]);

  if (!item || !category) {
    if (loading) {
      return (
        <main className="route-fallback">
          <div className="route-fallback__spinner" />
        </main>
      );
    }
    return <Navigate to="/differentiators" replace />;
  }

  const CategoryIcon = CATEGORY_ICONS[category.id] || Rocket;
  const heroImage = item.heroImage || heroSlides[0]?.imageUrl;
  const ideaLab = item.slug === 'aicte-idea-lab' ? aicteIdeaLab : null;
  const iic = item.slug === 'institution-innovation-cell' ? institutionInnovationCell : null;
  const tedx = item.slug === 'tedxsvecw' ? tedxSvecw : null;
  const medaPlm = item.slug === 'meda-plm-coe' ? medaPlmCoe : null;
  const nasscom = item.slug === 'nasscom-embedded' ? nasscomEmbedded : null;
  const hcl = item.slug === 'hcl-vlsi-training' ? hclVlsiTraining : null;
  const microchip = item.slug === 'microchip-embedded' ? microchipEmbedded : null;
  const tidsp = item.slug === 'ti-dsp-coe' ? tiDspCoe : null;
  const ultraTech = item.slug === 'ultratech-coe' ? ultraTechCoe : null;
  const c2s = item.slug === 'chips-to-startup' ? chipsToStartup : null;
  const vsacPage = item.slug === 'vsac' ? vsac : null;
  const arVr = item.slug === 'ar-vr-studio' ? arVrStudio : null;
  const vdl = item.slug === 'vehicle-design-lab' ? vehicleDesignLab : null;
  const atl = item.slug === 'assistive-tech-lab' ? assistiveTechLab : null;
  const hpc = item.slug === 'hpc-lab' ? highPerformanceComputingLab : null;
  const canoe = item.slug === 'concrete-canoe-lab' ? concreteCanoeLab : null;
  const dhcl = item.slug === 'dream-house-lab' ? dreamHouseConstructionLab : null;
  const fl = item.slug === 'foreign-languages' ? foreignLanguages : null;
  const wise = item.slug === 'talentsprint-wise' ? talentSprintWise : null;
  const si = item.slug === 'smart-interviews' ? smartInterviews : null;
  const rwtp = item.slug === 'rural-women-tech-park' ? ruralWomenTechPark : null;
  const nirv = item.slug === 'nirvahana' ? nirvahana : null;

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 380 }}>
        {heroImage && (
          <SmoothImage src={heroImage} alt={item.title} className="page-hero-image" loading="eager" decoding="sync" fetchPriority="high" />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/differentiators" className="breadcrumb-item">Differentiators</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to={`/differentiators#${category.id}`} className="breadcrumb-item">{category.label}</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <CategoryIcon size={14} /> {category.label}
          </div>
          <h1 className="animate-fade-in-up">{item.title}</h1>
        </div>
      </section>

      {/* Intro — Institution Innovation Cell, Vehicle Design Lab, and
          TalentSprint – WISE each get their own dedicated tabbed page below
          instead, since they have a persistent section nav sidebar rather
          than the generic Key Highlights sidebar. */}
      {!iic && !vdl && !wise && (
      <section className="section bg-white">
        <div className="container">
          <div className="detail-grid">
            {/* Main content */}
            <div>
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{ultraTech ? ultraTech.pageTitle : arVr ? arVr.pageTitle : `About ${item.title}`}</h2>
              {atl ? (
                <>
                  {atl.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  {atl.vision && (
                    <div>
                      <SectionHeading>Vision</SectionHeading>
                      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                        {atl.vision}
                      </p>
                    </div>
                  )}

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={atl.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={atl.objectives} />
                  </div>

                  <AtlAccordion
                    data={atl}
                    photoMap={{
                      'projects-2023-24': atlProjectPhotos2023,
                      'projects-2024-25': atlProjectPhotos2024,
                      'projects-2025-26': atlProjectPhotos2025,
                      'zion-2023-24': atlZionPhotos,
                      'day-2023-24': atlDayPhotos,
                      'day-2024-25': atlDay2024Photos,
                      'trance-2024-25': atlTrance2025Photos,
                      'zion-2025-26': atlZion2025Photos,
                      'day-2025-26': atlDay2025Photos,
                      'regional-meet-2025-26': atlRegionalMeet2025Photos,
                      'jntu-kakinada-2025-26': atlJntuKakinadaPhotos,
                      'rtih-2025-26': atlRtihPhotos,
                      'rajahmundry-expo-2025-26': atlRajahmundryExpoPhotos,
                      'outcomes-regional-meet-2023-24': atlRegionalMeetPhotos,
                      'outcomes-iit-madras-2023-24': atlIitMadrasPhotos,
                      'outcomes-news-2023-24': atlNewsPhotos,
                    }}
                  />
                </>
              ) : hpc ? (
                <>
                  {hpc.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {hpc.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={hpc.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={hpc.objectives} />
                  </div>

                  <HpcAccordion data={hpc} />
                </>
              ) : canoe ? (
                <>
                  {canoe.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {canoe.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={canoe.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={canoe.objectives} />
                  </div>

                  <CanoeAccordion
                    data={canoe}
                    academicProjectPhotos={canoeAcademicProjectPhotos}
                    previousProjectPhotos={canoePreviousProjectPhotos}
                    teamPhotos={{
                      'Team – WAKA (IV Year, 2020 Batch)': canoeTeamWakaPhotos,
                      'Team – AIKYAM (III Year, 2021 Batch)': canoeTeamAikyamPhotos,
                      'Team – KANU': canoeTeamKanuPhotos,
                    }}
                  />
                </>
              ) : dhcl ? (
                <>
                  {dhcl.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {dhcl.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={dhcl.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={dhcl.objectives} />
                  </div>

                  <DhclAccordion data={dhcl} />
                </>
              ) : fl ? (
                <>
                  <p style={{ fontSize: 'var(--text-base)', fontStyle: 'italic', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                    “{fl.quote.text}” — {fl.quote.author}
                  </p>
                  {fl.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {fl.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={fl.objectives} />
                  </div>

                  <div>
                    <SectionHeading>Languages Offered</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {fl.languagesOffered}
                    </p>
                  </div>

                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <SectionHeading>Coordinator</SectionHeading>
                    <FlCoordinatorCard coordinator={fl.coordinator} />
                  </div>

                  <FlLanguageTabs languages={fl.languages} />
                </>
              ) : si ? (
                <>
                  {si.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  {si.phases.map((phase) => (
                    <div key={phase.label} style={{ marginBottom: 'var(--space-5)' }}>
                      <SectionHeading>{phase.label}</SectionHeading>
                      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                        {phase.content}
                      </p>
                    </div>
                  ))}

                  {si.moreParagraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>{si.batchesHeading}</SectionHeading>
                    <CheckBullets items={si.batches.map((b) => `${b.years}: ${b.count}`)} />
                  </div>
                </>
              ) : rwtp ? (
                <>
                  {rwtp.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
                    <SectionHeading>{rwtp.interventionsHeading}</SectionHeading>
                  </div>

                  {rwtp.interventions.map((intervention) => (
                    <div key={intervention.title} style={{ marginBottom: 'var(--space-6)' }}>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                        {intervention.title}
                      </h3>
                      {intervention.paragraphs.map((p, i) => (
                        <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-3)' }}>
                          {p}
                        </p>
                      ))}
                    </div>
                  ))}

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>{rwtp.activitiesHeading}</SectionHeading>
                    <div style={{ overflowX: 'auto', marginBottom: 'var(--space-3)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={TI_DSP_TABLE_TH_STYLE}>Activity</th>
                            <th style={TI_DSP_TABLE_TH_STYLE}>Trainings Completed</th>
                            <th style={TI_DSP_TABLE_TH_STYLE}>Beneficiaries</th>
                            <th style={TI_DSP_TABLE_TH_STYLE}>SHGs Involved</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rwtp.activities.map((a, i) => (
                            <tr key={a.activity} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                              <td style={TI_DSP_TABLE_TD_STYLE}>{a.activity}</td>
                              <td style={TI_DSP_TABLE_TD_STYLE}>{a.trainings}</td>
                              <td style={TI_DSP_TABLE_TD_STYLE}>{a.beneficiaries}</td>
                              <td style={TI_DSP_TABLE_TD_STYLE}>{a.shgs}</td>
                            </tr>
                          ))}
                          <tr style={{ background: 'var(--color-off-white)', fontWeight: 700 }}>
                            <td style={TI_DSP_TABLE_TD_STYLE}>Total</td>
                            <td style={TI_DSP_TABLE_TD_STYLE} />
                            <td style={TI_DSP_TABLE_TD_STYLE}>{rwtp.activitiesTotalBeneficiaries}</td>
                            <td style={TI_DSP_TABLE_TD_STYLE} />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {rwtp.reportLinks.map((link) => (
                      <a key={link.href} href={link.href} download style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
                        {link.label} →
                      </a>
                    ))}
                  </div>
                </>
              ) : nirv ? (
                <>
                  {nirv.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {nirv.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {nirv.mission}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={nirv.objectives} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-5)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                    {nirv.events.map((event) => (
                      <NirvahanaEventCard key={event.id} event={event} photoUrl={nirvahanaPhotoMap[event.id]} />
                    ))}
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Activities</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {nirv.activitiesIntro}
                    </p>
                    <NirvahanaActivitiesList activities={nirv.activities} />
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Team</SectionHeading>
                    <NirvahanaTeamSection team={nirv.team} />
                  </div>
                </>
              ) : arVr ? (
                <>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                    {arVr.overview}
                  </p>

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {arVr.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={arVr.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={arVr.objectives} />
                  </div>

                  <div>
                    <SectionHeading>AR/VR Studio Features</SectionHeading>
                    <CheckBullets items={arVr.features} />
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Contact Us</SectionHeading>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0, fontWeight: 700 }}>{arVr.contact.name}</p>
                    {arVr.contact.address.map((line, i) => (
                      <p key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>{line}</p>
                    ))}
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                      Email: <a href={`mailto:${arVr.contact.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{arVr.contact.email}</a>
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                      Phone: <a href={`tel:${arVr.contact.phone}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{arVr.contact.phone}</a>
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                      Website: <a href={arVr.contact.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{arVr.contact.website.replace(/^https?:\/\//, '')}</a>
                    </p>
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Faculty In-charge</SectionHeading>
                    <TiDspMemberCard member={arVr.facultyInCharge} />
                  </div>
                </>
              ) : vsacPage ? (
                <>
                  {vsacPage.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {vsacPage.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={vsacPage.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={vsacPage.objectives} />
                  </div>

                  <VsacAccordion
                    team={vsacPage.team}
                    trainingResearch={vsacPage.trainingResearch}
                    collaborations={vsacPage.collaborations}
                    galleryPhotos={vsacGalleryPhotos}
                  />
                </>
              ) : c2s ? (
                <>
                  {c2s.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div>
                    <SectionHeading>Main Objectives of the C2S Program</SectionHeading>
                    <CheckBullets items={c2s.objectives} />
                  </div>

                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginTop: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    {c2s.closingParagraph}
                  </p>

                  <div>
                    <SectionHeading>Project Outlay</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: '0 0 var(--space-2)' }}>
                      <strong>Name of Institute:</strong> {c2s.projectOutlay.institute}
                    </p>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: '0 0 var(--space-2)' }}>
                      <strong>Title of the project:</strong> {c2s.projectOutlay.projectTitle}
                    </p>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: '0 0 var(--space-2)' }}>
                      <strong>Total outlay of project:</strong> {c2s.projectOutlay.totalOutlay}
                    </p>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: '0 0 var(--space-4)' }}>
                      <strong>Duration of project:</strong> {c2s.projectOutlay.duration}
                    </p>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, margin: '0 0 var(--space-2)', fontWeight: 700 }}>
                      Name of Chief Investigator (CI)/ Co-CI associated with the project:
                    </p>
                    <CheckBullets items={c2s.projectOutlay.investigators} />
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Resources Received under C2S Project</SectionHeading>
                    <CheckBullets items={c2s.resources} />
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>EDA Tools and Boards Received under C2S Project</SectionHeading>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {c2s.edaTools.headers.map((h) => (
                              <th key={h} style={TI_DSP_TABLE_TH_STYLE}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {c2s.edaTools.rows.map((row, ri) => (
                            <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                              {row.map((cell, ci) => (
                                <td key={ci} style={TI_DSP_TABLE_TD_STYLE}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Broad Objectives of Project</SectionHeading>
                    <CheckBullets items={c2s.broadObjectives} />
                  </div>

                  <ChipsToStartupAccordion
                    sections={c2s.accordionSections}
                    content={c2s.accordionContent}
                    activityPhotos={c2sActivityPhotos}
                    outcomePhotos={c2sOutcomePhotos}
                  />
                </>
              ) : ultraTech ? (
                <>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                    {ultraTech.overview}
                  </p>

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                      {ultraTech.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={ultraTech.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                      {ultraTech.objectives}
                    </p>
                  </div>

                  <UltraTechAccordion
                    sections={ultraTech.accordionSections}
                    content={ultraTech.accordionContent}
                    inCharge={ultraTech.inCharge}
                    studentsBenefited={ultraTech.studentsBenefited}
                  />
                </>
              ) : tidsp ? (
                <>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                    {tidsp.overview}
                  </p>

                  <div>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                      "{tidsp.vision}"
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={tidsp.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={tidsp.objectives} />
                  </div>

                  <TiDspTeam team={tidsp.team} />
                  <TiDspAccordion sections={tidsp.accordionSections} content={tidsp.accordionContent} trainingResearch={tidsp.trainingResearch} galleryPhotos={tiDspGalleryPhotos} />
                </>
              ) : microchip ? (
                <>
                  {microchip.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Vision</SectionHeading>
                    <CheckBullets items={microchip.vision} />
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={microchip.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={microchip.objectives} />
                  </div>

                  <MicrochipTeam team={microchip.team} />
                  <MicrochipAccordion activities={microchip.activities} outcomes={microchip.outcomes} />
                </>
              ) : hcl ? (
                <>
                  {hcl.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                      {hcl.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={hcl.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={hcl.objectives} />
                  </div>

                  <div>
                    <SectionHeading>Faculty Members</SectionHeading>
                    <CheckBullets items={hcl.facultyMembers} />
                  </div>

                  <HclAccordion hcl={hcl} />
                </>
              ) : nasscom ? (
                <>
                  {nasscom.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <SectionHeading>Vision</SectionHeading>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                      {nasscom.vision}
                    </p>
                  </div>

                  <div>
                    <SectionHeading>Mission</SectionHeading>
                    <CheckBullets items={nasscom.mission} />
                  </div>

                  <div>
                    <SectionHeading>Objectives</SectionHeading>
                    <CheckBullets items={nasscom.objectives} />
                  </div>

                  <div>
                    <SectionHeading>Faculty Members</SectionHeading>
                    <CheckBullets items={nasscom.facultyMembers} />
                  </div>

                  <div>
                    <SectionHeading>Clients</SectionHeading>
                    <CheckBullets items={nasscom.clients} />
                  </div>

                  <NasscomAccordion nasscom={nasscom} />
                </>
              ) : medaPlm ? (
                <>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                    {medaPlm.intro}
                  </p>

                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {medaPlm.meda.heading}
                  </h3>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                    {medaPlm.meda.intro}
                  </p>
                  <CheckBullets items={medaPlm.meda.tools} />
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                    {medaPlm.meda.conceptsIntro}
                  </p>
                  <CheckBullets items={medaPlm.meda.concepts} />
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)' }}>
                    {medaPlm.meda.closing}
                  </p>

                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                    {medaPlm.plm.heading}
                  </h3>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                    {medaPlm.plm.intro}
                  </p>
                  <CheckBullets items={medaPlm.plm.training} />
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                    {medaPlm.plm.teamcenterIntro}
                  </p>
                  <CheckBullets items={medaPlm.plm.teamcenter} />

                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                    {medaPlm.outcomeHeading}
                  </h3>
                  <CheckBullets items={medaPlm.outcomes} />
                </>
              ) : tedx ? (
                <>
                  {tedxPhotos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                      {tedxPhotos.map((p) => (
                        <img
                          key={p.id}
                          src={p.imageUrl}
                          alt="TEDxSVECW"
                          style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
                        />
                      ))}
                    </div>
                  )}
                  {tedx.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}
                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                      Contact Details:
                    </h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>{tedx.contact.name},</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>{tedx.contact.role}</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>{tedx.contact.department}</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                      Contact : <a href={`tel:${tedx.contact.phone}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{tedx.contact.phone}</a>
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
                      E-Mail : <a href={`mailto:${tedx.contact.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{tedx.contact.email}</a>
                    </p>
                  </div>
                </>
              ) : ideaLab ? (
                <>
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                    {ideaLab.tagline}
                  </p>
                  {ideaLab.paragraphs.map((para, i) => (
                    <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
                      {para}
                    </p>
                  ))}
                </>
              ) : (
                <>
                  {item.intro && (
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                      {item.intro}
                    </p>
                  )}
                  {item.about && (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}>
                      {item.about}
                    </p>
                  )}
                  {!item.intro && !item.about && (
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                      {item.desc}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Sidebar: key highlights */}
            <div className="detail-sidebar">
              <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'sticky', top: '110px' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                  Key Highlights
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {item.highlights.map((h) => (
                    <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{h}</span>
                    </li>
                  ))}
                </ul>
                {item.partners && item.partners.length > 0 && (
                  <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-light-gray)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Partners</p>
                    {item.partners.map((p) => (
                      <span key={p} style={{ display: 'inline-block', fontSize: 'var(--text-xs)', background: 'var(--color-primary)', color: 'var(--color-white)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', marginRight: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Institution Innovation Cell's own tabbed page (About IIC / IIC –
          Constitution / and 7 more sections navigable from its sidebar). */}
      {iic && <IicPage iic={iic} />}

      {/* Vehicle Design Lab's own tabbed page (About VDL / Facilities &
          Projects / and 3 more sections navigable from its sidebar). */}
      {vdl && <VdlPage vdl={vdl} />}

      {/* TalentSprint – WISE's own tabbed page (About WISE / Beneficiaries –
          Placements / and 7 more sections navigable from its sidebar). */}
      {wise && <WisePage wise={wise} />}

      {/* Institute & Coordinator Details — only on the AICTE IDEA Lab page */}
      {ideaLab && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Application Details</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Institute & Coordinator Details</h2>
            </div>
            <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {ideaLab.fields.map((f, i) => (
                <div
                  key={i}
                  className="mobile-stack-grid"
                  style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', background: i % 2 === 0 ? 'var(--color-off-white)' : 'var(--color-white)' }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{f.label}</span>
                  <div>
                    {f.value.map((line, li) => (
                      <p key={li} style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vision — only on the AICTE IDEA Lab page */}
      {ideaLab && (
        <section className="section bg-white">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{ width: 4, height: 32, background: 'var(--color-accent)', borderRadius: 'var(--radius-full)' }} />
              <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Vision</h2>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {ideaLab.vision.map((v, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.6 }}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Facilities */}
      {item.facilities && item.facilities.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Infrastructure</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Facilities & Equipment</h2>
            </div>
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              {item.facilities.map((f) => (
                <div key={f}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outcomes — background alternates with whether Facilities rendered
          just above it (hardcoding bg-white here assumed Facilities, which
          is bg-off-white, always precedes it; when an item has no facilities
          data — e.g. TalentSprint – WISE — Outcomes landed directly under
          Overview with the *same* bg-white and no visual break between them,
          which read as a single oversized blank gap rather than two sections). */}
      {item.outcomes && item.outcomes.length > 0 && (
        <section className={`section ${item.facilities && item.facilities.length > 0 ? 'bg-white' : 'bg-off-white'}`}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Impact</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
            </div>
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {item.outcomes.map((o) => (
                <div key={o}
                  style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <Trophy size={20} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Explore More Differentiators
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto var(--space-6)' }}>
              Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/differentiators" className="btn btn-accent">All Differentiators</Link>
              <Link to="/admissions" className="btn btn-secondary">Apply Now</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
