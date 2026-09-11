import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Rocket, Factory, Microscope, Globe2, GraduationCap, ChevronRight, Users, BarChart3, ArrowRight, Plane, ChevronLeft } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { CustomSectionsIntro, CustomSectionsGalleries, CustomSectionsAccordion, CustomSectionsPlain, CustomSectionsPills, SectionSubtree } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import CustomTabsPage, { type TabItem } from '../../components/CustomTabsPage/CustomTabsPage';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import { hasTabContent, type CustomTab } from '../../lib/customTabs';
import { DIFFERENTIATOR_CATEGORIES, type BlockKey } from '../Admin/sections/DifferentiatorsAdmin';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { FacultyDoc } from '../Academics/Faculty';
import { talentSprintWise } from './talentSprintWise.data';
import { foreignLanguages } from './foreignLanguages.data';
import MicrochipPage from './MicrochipPage';
import TiDspPage from './TiDspPage';
import UltraTechPage from './UltraTechPage';
import ChipsToStartupPage from './ChipsToStartupPage';
import MedaPlmCoePage from './MedaPlmCoePage';
import VsacPage from './VsacPage';
import VehicleDesignLabPage from './VehicleDesignLabPage';
import DreamHouseLabPage from './DreamHouseLabPage';
import HpcLabPage from './HpcLabPage';
import IdeaLabPage from './IdeaLabPage';
import IicPage from './IicPage';
import RuralWomenTechParkPage from './RuralWomenTechParkPage';
import SmartInterviewsPage from './SmartInterviewsPage';
import '../detail-layout.css';
import '../gsac-shared.css';
import './foreign-languages.css';

// GSAC's "Global Opportunities" stat row — shown when the admin hasn't
// added a "Global Opportunities Stats" Custom Section yet, so the globe
// card never sits as a blank box below the title.
const DEFAULT_GSAC_STATS = [
  { value: '7+', label: 'Global Destinations' },
  { value: '360', label: 'End-to-End Support' },
  { value: 'Global', label: 'Alumni Network' },
];

// All 9 tabs are fully admin-defined now. Team/Testimonial/ELITE-project/
// NSE-clipping photos used to be admin-uploaded per fixed hardcoded id
// (WiseTeamPhotosAdmin.tsx etc.) — those panels are retired along with this
// page's conversion; a "Photos" files section within the matching tab lets
// the admin re-add them, just without the old per-item fixed slot.
function WisePage({ tabs }: { tabs: CustomTab[] }) {
  const tabItems: TabItem[] = tabs.map((tab) => ({ id: tab.id, label: tab.label, content: tab.sectionsDisplay === 'pills' ? <CustomSectionsPills sections={tab.sections} /> : <CustomSectionsPlain sections={tab.sections} /> }));
  const defaultTabId = tabs.find(hasTabContent)?.id ?? tabItems[0]?.id;
  return <CustomTabsPage tabs={tabItems} defaultTabId={defaultTabId} />;
}

const LANGUAGE_SUBTITLES: Record<string, string> = {
  French: 'A language of art, culture and global opportunities.',
  German: 'A language of innovation, engineering and excellence.',
  Spanish: 'A language that connects people and cultures.',
  Japanese: 'A language of tradition, technology and new possibilities.',
  Korean: 'A language of creativity, innovation and global influence.',
};

function LanguageModuleAccordion({ lang, index }: { lang: typeof foreignLanguages.languages[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const isEven = (index + 1) % 2 === 0;
  const numColorClass = isEven ? 'fl-num-orange' : 'fl-num-blue';
  const subtitle = LANGUAGE_SUBTITLES[lang.name] || 'A language of global opportunities and communication.';

  return (
    <div className={`fl-module-card ${isOpen ? 'is-open' : ''}`}>
      <button
        className="fl-module-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="fl-module-header-left">
          <div className={`fl-module-number-box ${numColorClass}`}>
            0{index + 1}
          </div>
          <div className="fl-module-title-wrap">
            <h3 className="fl-module-title">{lang.name}</h3>
            <p className="fl-module-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className={`fl-module-toggle-circle ${numColorClass}`}>
          {isOpen ? '-' : '+'}
        </div>
      </button>

      {isOpen && (
        <div className="fl-module-body animate-fade-in">
          <p className="fl-module-quote">&quot;{lang.quote}&quot;</p>
          <div className="fl-module-paragraphs">
            {lang.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {lang.table && lang.table.length > 0 && (
            <div className="fl-module-stats">
              <h4 style={{ fontSize: 'var(--text-sm)', color: '#0F2547', marginBottom: 'var(--space-3)', fontWeight: 700 }}>{lang.reportLabel}</h4>
              <div className="fl-stats-table">
                <div className="fl-stats-row fl-stats-header">
                  <span>Year</span>
                  <span>Students Certified</span>
                </div>
                {lang.table.map((row, i) => (
                  <div key={i} className="fl-stats-row">
                    <span>{row.year}</span>
                    <strong>{row.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ForeignLanguagesPage({ data }: { data: typeof foreignLanguages }) {
  return (
    <div className="foreign-languages-theme">
      {/* 1. Top Quote Banner Card */}
      <div className="fl-body-quote-banner">
        <div className="fl-quote-banner-left">
          <div className="fl-quote-accent-bar" aria-hidden="true" />
          <div className="fl-quote-icon" aria-hidden="true">&ldquo;</div>
          <div className="fl-quote-content">
            <h2 className="fl-quote-title">
              &ldquo;A different language is a different <span className="fl-text-orange">vision of life.</span>&rdquo;
            </h2>
            <p className="fl-quote-author">&mdash; Federico Fellini</p>
          </div>
        </div>
        <div className="fl-quote-banner-right">
          <div className="fl-quote-tags-list">
            <span>LANGUAGES</span>
            <span>PEOPLE</span>
            <span>CULTURES</span>
            <span>OPPORTUNITIES</span>
          </div>
          <div className="fl-quote-tag-line" aria-hidden="true" />
        </div>
      </div>

      {/* 2. Intro Paragraph */}
      <p className="fl-body-intro-text">
        The importance of learning any foreign language transcends the acquisition of linguistic skills; it opens doorways to new cultures, perspectives and opportunities. In this modern world, proficiency in a foreign language fosters effective communication, breaking down barriers and promoting understanding among diverse communities.
      </p>

      {/* 3. Three Cards Grid: Vision, Objectives, Coordinator */}
      <div className="fl-body-cards-grid">
        {/* Card 1: Vision */}
        <div className="fl-info-card fl-card-coral">
          <div className="fl-info-card-wave" aria-hidden="true" />
          <div className="fl-info-card-header">
            <div className="fl-info-icon-circle fl-icon-orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </div>
            <h3 className="fl-info-card-title">VISION</h3>
          </div>
          <p className="fl-info-card-body">
            Empower individuals to communicate basic language skills in different languages confidently through the foreign languages program.
          </p>
        </div>

        {/* Card 2: Objectives */}
        <div className="fl-info-card fl-card-blue">
          <div className="fl-info-card-wave-blue" aria-hidden="true" />
          <div className="fl-info-card-header">
            <div className="fl-info-icon-circle fl-icon-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3 className="fl-info-card-title">OBJECTIVES</h3>
          </div>
          <ul className="fl-info-card-list">
            <li>Enhance Communication Skills</li>
            <li>Prepare for International Careers</li>
            <li>Support Study Abroad Programs</li>
            <li>Increase Employability</li>
            <li>Enrich Personal and Professional Growth</li>
          </ul>
        </div>

        {/* Card 3: Coordinator */}
        <div className="fl-info-card fl-card-coral">
          <div className="fl-info-card-wave" aria-hidden="true" />
          <div className="fl-info-card-header">
            <div className="fl-info-icon-circle fl-icon-orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="fl-info-card-title">COORDINATOR</h3>
          </div>
          <div className="fl-coordinator-details">
            <p className="fl-coordinator-name">Dr. G. J. V. Prasad</p>
            <p className="fl-coordinator-role">Assistant Professor of English</p>
            <p className="fl-coordinator-email">
              <a href="mailto:Prasad_gjv@svce.edu.in">Prasad_gjv@svce.edu.in</a>
            </p>
            <p className="fl-coordinator-phone">9012992948</p>
          </div>
        </div>
      </div>

      {/* 4. Languages Offered Banner Box */}
      <div className="fl-body-languages-banner">
        <div className="fl-lang-banner-col1">
          <div className="fl-eyebrow-tag">
            <span>LANGUAGES</span>
            <span className="fl-eyebrow-line" aria-hidden="true" />
          </div>
          <h2 className="fl-lang-banner-title">Languages Offered</h2>
        </div>
        <div className="fl-lang-banner-col2">
          <p>
            SVECW always takes a step forward in fulfilling students&apos; needs. As a new step, foreign languages program was introduced in the year 2012 and has been continuing to date. The languages are French, German, Spanish, Japanese, and Korean. Trainers from Global Language Solutions, Chennai, conduct classes at the institution for certification.
          </p>
        </div>
        <div className="fl-lang-banner-col3">
          <div className="fl-side-tag-text">
            <span>SAME WORDS.</span>
            <span>A BRIGHTER</span>
            <span>WORLD.</span>
          </div>
          <div className="fl-side-tag-line" aria-hidden="true" />
        </div>
      </div>

      {/* 5. Language Programmes Accordion */}
      <div className="fl-body-programmes-section">
        <div className="fl-programmes-header">
          <div>
            <div className="fl-eyebrow-tag">
              <span>PROGRAMMES</span>
              <span className="fl-eyebrow-line" aria-hidden="true" />
            </div>
            <h2 className="fl-programmes-title">Language Programmes</h2>
          </div>
          <div className="fl-programmes-badge">
            <div className="fl-badge-v-line" aria-hidden="true" />
            <div className="fl-badge-text">
              <span>BRIDGING CULTURES</span>
              <span>BUILDING FUTURES</span>
            </div>
          </div>
        </div>

        <div className="fl-modules-grid">
          {data.languages.map((lang, index) => (
            <LanguageModuleAccordion key={index} lang={lang} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const CATEGORY_ICONS: Record<string, typeof Rocket> = {
  innovation: Rocket, industry: Factory, research: Microscope, global: Globe2, student: GraduationCap,
};

// Items with their own dedicated `{item, sections}`-style page component
// (MedaPlmCoePage, VsacPage, ...) render it compactly — no padded section
// wrapper or bottom margin on the shared hero above it, since each of these
// pages supplies its own spacing.
const COMPACT_SLUGS = new Set([
  'meda-plm-coe', 'vsac', 'vehicle-design-lab', 'dream-house-lab', 'hpc-lab', 'aicte-idea-lab', 'institution-innovation-cell',
]);
// These three instead render inside the normal padded white section, just
// with a bit less top padding than the generic fallback below them.
const PADDED_SLUGS = new Set(['microchip-embedded', 'ti-dsp-coe', 'ultratech-coe']);

// Items saved before `description` existed still have their copy in the old
// `intro`/`about` fields (kept, deprecated, on DifferentiatorItemDoc) — build
// a throwaway CustomSection from those so the page never renders blank for
// an item that hasn't been re-saved from the new admin field yet.
function legacyDescriptionFromItem(item: DifferentiatorItemDoc): CustomSection {
  const text = (item.about || item.intro || item.desc || '').trim();
  return { id: 'description', label: 'Description', contentType: 'text', textContent: text };
}

// Same idea for the old fixed Key Highlights/Facilities/Outcomes/Partners
// fields — items not yet re-saved from the admin still have their content
// only there, not as Custom Sections, so synthesize the equivalent sections
// on every render (rather than requiring a migration step) and merge them in
// below whatever real Custom Sections the item already has.
function legacySectionsFromItem(item: DifferentiatorItemDoc): CustomSection[] {
  const specs: { id: string; label: string; values?: string[] }[] = [
    { id: 'highlights', label: 'Key Highlights', values: item.highlights },
    { id: 'facilities', label: 'Facilities & Equipment', values: item.facilities },
    { id: 'outcomes', label: 'Outcomes & Achievements', values: item.outcomes },
    { id: 'partners', label: 'Partners', values: item.partners },
  ];
  return specs
    .filter((s) => (s.values || []).filter(Boolean).length > 0)
    .map((s) => ({ id: s.id, label: s.label, contentType: 'list' as const, listText: (s.values || []).filter(Boolean).join('\n') }));
}

// Vision/Mission/Objectives are pre-existing named slots (their own field on
// DifferentiatorItemDoc, see DifferentiatorsAdmin.tsx) — only rendered when
// they actually have content, same as every other optional section here.
// Falls back to a same-id Custom Section for an item saved before these
// became fixed fields (when an admin had typed a "Vision" Custom Section by
// hand), so it still shows up here instead of looking blank.
function resolveBlock(item: DifferentiatorItemDoc, key: Exclude<BlockKey, 'description'>): CustomSection | null {
  const direct = item[key];
  if (direct && hasCustomSectionContent(direct)) return direct;
  const legacy = (item.customSections || []).find((s) => s.id === key);
  if (legacy && hasCustomSectionContent(legacy)) return legacy;
  return null;
}

function GsacHero({ heroImage }: { heroImage?: string }) {
  return (
    <section className="gsac-hero-section">
      <div className="gsac-hero-card">
        {heroImage && (
          <img src={heroImage} alt="GSAC" className="gsac-hero-bg" loading="eager" />
        )}
        <div className="gsac-hero-overlay" />

        <svg className="gsac-hero-doodle" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M -100 350 Q 400 -50 1100 150" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.6" />
        </svg>

        <div className="gsac-hero-airplane">
          <Plane size={24} />
        </div>

        <div className="gsac-hero-content-wrapper container">
          {/* Left Side */}
          <div className="gsac-hero-left">
            <div className="gsac-hero-eyebrow">
              <div className="gsac-hero-line"></div>
              GLOBAL OUTREACH
            </div>
            <h1 className="gsac-hero-title">
              <span className="text-white">Graduate Study</span><br />
              <span className="text-white">Abroad Center – </span>
              <span className="text-accent">GSAC</span>
            </h1>
            <p className="gsac-hero-subtitle">
              Empowering students to pursue international higher education across 7 global destinations through expert counselling, test preparation, loan support, and pre-departure guidance.
            </p>

            <div className="gsac-hero-features">
              <div className="gsac-hero-feature">
                <div className="gsac-hero-line" style={{ width: '20px', marginBottom: '8px' }}></div>
                <div className="gsac-hero-feature-title">EXPLORE</div>
                <div className="gsac-hero-feature-subtitle">GLOBAL<br/>OPPORTUNITIES</div>
              </div>
              <div className="gsac-hero-feature">
                <div className="gsac-hero-line" style={{ width: '20px', marginBottom: '8px' }}></div>
                <div className="gsac-hero-feature-title">LEARN</div>
                <div className="gsac-hero-feature-subtitle">FROM<br/>EXPERTS</div>
              </div>
              <div className="gsac-hero-feature">
                <div className="gsac-hero-line" style={{ width: '20px', marginBottom: '8px' }}></div>
                <div className="gsac-hero-feature-title">CONNECT</div>
                <div className="gsac-hero-feature-subtitle">WITH A<br/>GLOBAL NETWORK</div>
              </div>
              <div className="gsac-hero-feature">
                <div className="gsac-hero-line" style={{ width: '20px', marginBottom: '8px' }}></div>
                <div className="gsac-hero-feature-title">GO BEYOND</div>
                <div className="gsac-hero-feature-subtitle">A BRIGHTER<br/>TOMORROW</div>
              </div>
            </div>

            <div className="gsac-hero-stats-pill">
              <div className="gsac-stats-item">
                <strong>7+</strong>
                <span>Global Destinations</span>
              </div>
              <div className="gsac-stats-divider"></div>
              <div className="gsac-stats-item">
                <strong>Expert</strong>
                <span>End-to-End Guidance</span>
              </div>
              <div className="gsac-stats-divider"></div>
              <div className="gsac-stats-item">
                <strong>A Brighter</strong>
                <span>Global Future</span>
              </div>
            </div>
          </div>

          <div className="gsac-hero-bottom-left">
            STUDY<br/>EXPLORE<br/>GROW<br/>BELONG
          </div>

          {/* Right Side */}
          <div className="gsac-hero-right">
            <div className="gsac-hero-top-right">
              <div className="gsac-hero-vertical-text">
                A GLOBAL MINDSET<br />A BRIGHTER TOMORROW
                <div className="gsac-hero-line" style={{ alignSelf: 'flex-end', marginTop: '8px' }}></div>
              </div>
            </div>

            <div className="gsac-hero-bottom-right">
              <div className="gsac-hero-script">Beyond<br/>Borders</div>
              <div className="gsac-script-underline"></div>

              <div className="gsac-hero-carousel-controls">
                <button className="gsac-carousel-btn"><ChevronLeft size={16} /></button>
                <span>01 / 03</span>
                <button className="gsac-carousel-btn"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ForeignLanguagesHero({ heroImage }: { heroImage?: string }) {
  return (
    <section className="fl-hero-section">
      <div className="fl-hero-card">
        {heroImage && (
          <img src={heroImage} alt="Foreign Languages" className="fl-hero-bg" loading="eager" />
        )}
        <div className="fl-hero-overlay" />

        <svg className="fl-hero-doodle" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M 0 180 Q 250 80 500 250 T 1200 300" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.6" />
        </svg>

        <div className="fl-hero-content-wrapper container">
            {/* Left Side */}
            <div className="fl-hero-left">
              <div className="fl-hero-eyebrow">
                <div className="fl-hero-line"></div>
                GLOBAL OUTREACH
              </div>
              <h1 className="fl-hero-title">
                <span className="text-white">Foreign</span><br />
                <span className="text-accent">Languages</span>
              </h1>
              <p className="fl-hero-subtitle">
                Offering certified training in French, German, Spanish, Japanese, and Korean by Global Language Solutions to expand global communication skills and career opportunities.
              </p>
              <button className="fl-hero-btn">
                Explore More <ArrowRight size={16} />
              </button>
              <div className="fl-hero-features">
                <div className="fl-hero-feature">
                  <div className="fl-hero-feature-icon">
                    <Globe2 size={18} />
                  </div>
                  <span>GLOBAL<br />COMMUNICATION</span>
                </div>
                <div className="fl-hero-feature">
                  <div className="fl-hero-feature-icon">
                    <Users size={18} />
                  </div>
                  <span>CERTIFIED<br />TRAINING</span>
                </div>
                <div className="fl-hero-feature">
                  <div className="fl-hero-feature-icon">
                    <BarChart3 size={18} />
                  </div>
                  <span>BRIGHTER<br />OPPORTUNITIES</span>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="fl-hero-right">
              <div className="fl-hero-top-right">
                <div className="fl-hero-vertical-text">
                  LEARN<br />CONNECT<br />EXPLORE<br />BELONG
                  <div className="fl-hero-line right"></div>
                </div>
                <div className="fl-hero-script">
                  Languages<br />Build<br />Brighter<br />Futures
                </div>
              </div>

              <div className="fl-hero-bottom-right">
                <div className="fl-hero-languages-pill">
                  <span className="fl-pill-label">LANGUAGES OFFERED</span>
                  <span className="fl-pill-lang">FRENCH</span>
                  <span className="fl-pill-lang">GERMAN</span>
                  <span className="fl-pill-lang">SPANISH</span>
                  <span className="fl-pill-lang">JAPANESE</span>
                  <span className="fl-pill-lang">KOREAN</span>
                </div>
                <div className="fl-hero-bottom-tag">
                  <div className="fl-hero-line right thin"></div>
                  A MORE CONNECTED TOMORROW
                </div>
              </div>
            </div>
          </div>

          <div className="fl-hero-dots">
            <div className="fl-hero-dot active"></div>
            <div className="fl-hero-dot"></div>
            <div className="fl-hero-dot"></div>
          </div>
        </div>
    </section>
  );
}

function ForeignLanguagesFooter() {
  return (
    <section className="fl-cta-footer-section">
      {/* Left Waves Background */}
      <div className="fl-cta-bg-left" aria-hidden="true">
        <svg viewBox="0 0 450 300" fill="none" preserveAspectRatio="none">
          <path d="M0 0 H240 C190 70 120 110 0 150 Z" fill="#D97A5B" opacity="0.85" />
          <path d="M0 0 H190 C150 90 80 130 0 180 Z" fill="#C05A39" />
          <path d="M0 60 C150 70 270 170 330 300 H0 Z" fill="#EEDFD0" opacity="0.8" />
          <path d="M0 100 C130 110 230 190 290 300" stroke="#C05A39" strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* Right Waves Background */}
      <div className="fl-cta-bg-right" aria-hidden="true">
        <svg viewBox="0 0 450 300" fill="none" preserveAspectRatio="none">
          <path d="M450 0 H270 C310 60 380 100 450 130 Z" fill="#7B9EC7" opacity="0.85" />
          <path d="M450 40 C350 70 250 170 180 300 H450 Z" fill="#EEDFD0" opacity="0.7" />
          <path d="M450 80 C330 110 240 190 190 300" stroke="#C05A39" strokeWidth="1.5" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* Left Content (Vertical Tag & Leaf Branch) */}
      <div className="fl-cta-left-content">
        <div className="fl-cta-tag-group">
          <div className="fl-cta-tag-line" aria-hidden="true" />
          <div className="fl-cta-tag-text">
            <span>LANGUAGES</span>
            <span>CULTURES</span>
            <span>PEOPLE</span>
            <span>POSSIBILITIES</span>
          </div>
        </div>
        <div className="fl-cta-leaf-branch" aria-hidden="true">
          <svg width="180" height="170" viewBox="0 0 180 170" fill="none">
            <path d="M10 160 Q 60 110 110 40" stroke="#3B506B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30 140 C10 125 5 100 20 85 C35 100 40 125 30 140 Z" fill="#4A607A" />
            <path d="M45 125 C65 135 90 130 100 110 C85 105 60 110 45 125 Z" fill="#3B506B" />
            <path d="M60 100 C40 85 35 60 50 45 C65 60 70 85 60 100 Z" fill="#4A607A" />
            <path d="M75 85 C95 95 120 90 130 70 C115 65 90 70 75 85 Z" fill="#3B506B" />
            <path d="M90 60 C75 45 70 20 85 5 C100 20 105 45 90 60 Z" fill="#5B728D" />
            <path d="M110 40 C115 20 130 5 145 10 C140 25 125 40 110 40 Z" fill="#3B506B" />
          </svg>
        </div>
      </div>

      {/* Right Content (Script Text & Global Landmarks) */}
      <div className="fl-cta-right-content">
        <div className="fl-cta-script-group">
          <div className="fl-cta-script">
            <span>Learn</span>
            <span className="fl-cta-script-indent1">Explore</span>
            <span className="fl-cta-script-indent2">Belong</span>
          </div>
          <div className="fl-cta-script-underline" aria-hidden="true" />
        </div>

        <div className="fl-cta-landmarks" aria-hidden="true">
          <svg width="420" height="170" viewBox="0 0 420 170" fill="none">
            {/* Birds */}
            <g stroke="#C05A39" strokeWidth="1.2" fill="none">
              <path d="M120 50 Q125 45 130 50 Q135 45 140 50" />
              <path d="M150 65 Q154 61 158 65 Q162 61 166 65" />
              <path d="M380 60 Q384 56 388 60 Q392 56 396 60" />
              <path d="M350 75 Q353 72 356 75 Q359 72 362 75" />
            </g>

            {/* Eiffel Tower */}
            <g stroke="#64748B" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="80" y1="15" x2="80" y2="45" />
              <line x1="74" y1="45" x2="86" y2="45" />
              <path d="M76 45 L70 95 H90 L84 45 Z" />
              <line x1="64" y1="95" x2="96" y2="95" />
              <path d="M70 95 L55 165 H68 L74 125 C76 110 84 110 86 125 L92 165 H105 L90 95 Z" />
              <path d="M66 135 Q80 115 94 135" />
              <line x1="72" y1="60" x2="88" y2="60" />
              <line x1="71" y1="78" x2="89" y2="78" />
              <line x1="62" y1="115" x2="98" y2="115" />
            </g>

            {/* Torii Gate */}
            <g stroke="#64748B" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M190 90 C220 85 250 85 280 90 H180 Z" />
              <line x1="185" y1="100" x2="275" y2="100" strokeWidth="1.5" />
              <line x1="200" y1="100" x2="198" y2="165" strokeWidth="2" />
              <line x1="260" y1="100" x2="262" y2="165" strokeWidth="2" />
              <line x1="195" y1="120" x2="265" y2="120" strokeWidth="1.2" />
              <rect x="225" y="100" width="10" height="20" />
            </g>

            {/* Colosseum */}
            <g stroke="#64748B" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M290 165 H410 V110 C410 110 360 105 290 110 V165 Z" />
              <line x1="290" y1="130" x2="410" y2="130" />
              <line x1="290" y1="147" x2="410" y2="147" />
              <path d="M300 130 V120 C300 115 310 115 310 120 V130" />
              <path d="M320 130 V120 C320 115 330 115 330 120 V130" />
              <path d="M340 130 V120 C340 115 350 115 350 120 V130" />
              <path d="M360 130 V120 C360 115 370 115 370 120 V130" />
              <path d="M380 130 V120 C380 115 390 115 390 120 V130" />
              <path d="M300 165 V153 C300 148 310 148 310 153 V165" />
              <path d="M320 165 V153 C320 148 330 148 330 153 V165" />
              <path d="M340 165 V153 C340 148 350 148 350 153 V165" />
              <path d="M360 165 V153 C360 148 370 148 370 153 V165" />
              <path d="M380 165 V153 C380 148 390 148 390 153 V165" />
            </g>
          </svg>
        </div>
      </div>

      {/* Center Main Content */}
      <div className="container fl-cta-container">
        <div className="fl-cta-center">
          <div className="fl-cta-eyebrow">
            <span className="fl-cta-eyebrow-line" aria-hidden="true" />
            <span>YOUR NEXT OPPORTUNITY AWAITS</span>
            <span className="fl-cta-eyebrow-line" aria-hidden="true" />
          </div>

          <h2 className="fl-cta-title">Explore More Differentiators</h2>

          <p className="fl-cta-subtitle">
            Discover all the unique initiatives, labs, and centres that make VWU<br />
            an extraordinary place to learn and grow.
          </p>

          <div className="fl-cta-actions">
            <Link to="/differentiators" className="fl-cta-btn-primary">
              All Differentiators <ArrowRight size={16} />
            </Link>
            <Link to="/admissions" className="fl-cta-btn-secondary">
              Apply Now
            </Link>
            <Link to="/academics" className="fl-cta-btn-secondary">
              Academics
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DifferentiatorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const { docs: rwtpReportLinkDocs } = useOrderedCollection<WithId & { label: string; fileUrl: string }>('rwtpReportLinks', 'order');
  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const item = allItems.find((i) => i.slug === slug) ?? null;
  const category = item ? DIFFERENTIATOR_CATEGORIES.find((c) => c.id === item.category) : null;
  // GSAC's "Moments from GSAC" gallery starts collapsed to 3 photos with a
  // toggle to reveal the rest in place — see the gsac-only block below.
  const [gsacGalleryExpanded, setGsacGalleryExpanded] = useState(false);

  useEffect(() => {
    if (item) {
      document.title = `${item.title} | Vishnu Women's University`;
    }
  }, [item]);

  // External items (TBI, VJOC, Vishnu Student Success Centre, Radio Vishnu,
  // School of Music, ...) have no internal detail page — the card grid and
  // nav dropdown already link straight to item.url, but if anyone still
  // lands on this internal route (a stale bookmark, an old indexed link, a
  // menu spot that wasn't updated to check `external`), send them on to the
  // actual external site rather than stranding them on the generic
  // Differentiators listing.
  useEffect(() => {
    if (item?.external && item.url) {
      window.location.replace(item.url);
    }
  }, [item]);

  if (!item || !category) {
    if (loading) {
      return (
        <RouteFallback />
      );
    }
    return <Navigate to="/differentiators" replace />;
  }

  if (item.external && item.url) {
    return <RouteFallback />;
  }

  const CategoryIcon = CATEGORY_ICONS[category.id] || Rocket;
  const faculty = item.department ? allFaculty.filter((f) => f.department === item.department) : [];
  // Real Custom Sections, plus (only for an item that has genuinely never
  // been through the new structure — `description` still unset) any legacy
  // Highlights/Facilities/Outcomes/Partners content synthesized from the
  // deprecated fields (see legacySectionsFromItem). That `alreadyMigrated`
  // check matters: those deprecated fields are deliberately never cleared,
  // so once an item HAS been migrated, re-merging them here on every render
  // would silently bring back a Custom Section an admin just deleted (its id
  // simply wouldn't be in `item.customSections` anymore, so the "already
  // present" de-dupe below wouldn't catch it). Vision/Mission/Objectives are
  // excluded here — they're their own fixed fields now (see introBlocks
  // below), rendered separately so they always lead, in a fixed order, ahead
  // of any other admin-added intro section.
  const alreadyMigrated = item.description !== undefined;
  const promotedBlockIds = new Set(['vision', 'mission', 'objectives']);
  const baseCustomSections = (item.customSections || []).filter((s) => !promotedBlockIds.has(s.id));
  const legacyMergedSections = alreadyMigrated ? [] : (() => {
    const existingIds = new Set(baseCustomSections.map((s) => s.id));
    return legacySectionsFromItem(item).filter((s) => !existingIds.has(s.id));
  })();
  const effectiveCustomSections = [...baseCustomSections, ...legacyMergedSections];
  // If the resolved description has no real content — never filled in, or
  // (a since-fixed bug) migrated from an item that had only a Short
  // Description and no old Intro/About text, leaving `description` written
  // as empty — fall back to the item's Short Description (`desc`) rather
  // than showing a blank page. Safe to do regardless of migration status,
  // unlike falling back to intro/about again: `desc` is still a live,
  // admin-editable field (the "Short Description" textarea), not a frozen
  // deprecated one, so this can never resurrect something an admin actually
  // deleted from Description.
  const resolvedDescription = alreadyMigrated ? item.description! : legacyDescriptionFromItem(item);
  const descriptionSection: CustomSection = hasCustomSectionContent(resolvedDescription)
    ? resolvedDescription
    : { id: 'description', label: 'Description', contentType: 'text', textContent: (item.desc || '').trim() };
  const introBlocks: CustomSection[] = (['vision', 'mission', 'objectives'] as const)
    .map((key) => resolveBlock(item, key))
    .filter((s): s is CustomSection => !!s)
    .map((s) => ({ ...s, placement: 'intro' as const }));
  const heroImage = item.heroImage || heroSlides[0]?.imageUrl;
  const wise = item.slug === 'talentsprint-wise' ? talentSprintWise : null;

  // Chips to Startup (C2S) has its own bespoke hero + layout (see
  // ChipsToStartupPage.tsx) instead of the shared navy hero card below —
  // same idea as microchip-embedded/ti-dsp-coe/ultratech-coe's own body
  // below, just also replacing the hero. Faculty carousel / closing CTA
  // band further down the page still render normally afterward.
  const isChipsToStartup = item.slug === 'chips-to-startup';

  // GSAC's bespoke layout below (two-column Overview with a "Global
  // Opportunities" stats card, and a restyled Gallery header) is built
  // entirely from the same admin-editable Custom Sections every other
  // differentiator item already has — no schema change. Two are recognized
  // by convention rather than rendered generically:
  //   - a 'list' section titled exactly "Global Opportunities Stats" (one
  //     "Value | Label" line each, e.g. "7+ | Global Destinations") feeds
  //     the sidebar card instead of the accordion; optional — the card still
  //     shows with no stats until an admin adds it.
  //   - its 'gallery' section (however it's titled) gets a custom "Moments
  //     from GSAC" header + 3-photo-collapsed grid instead of the generic
  //     small-thumbnail strip every other item's gallery uses.
  const isGsac = item.slug === 'gsac-diff';
  const isForeignLanguages = item.slug === 'foreign-languages';
  const isRwtp = item.slug === 'rural-women-tech-park';
  const isSmartInterviews = item.slug === 'smart-interviews';
  const gsacStatsSection = isGsac
    ? effectiveCustomSections.find((s) => s.label.trim().toLowerCase() === 'global opportunities stats' && hasCustomSectionContent(s))
    : undefined;
  const gsacStats = (gsacStatsSection?.listText || '')
    .split('\n')
    .map((line) => {
      const [value, label] = line.split('|').map((s) => s.trim());
      return value ? { value, label: label || '' } : null;
    })
    .filter((s): s is { value: string; label: string } => !!s);
  const displayGsacStats = gsacStats.length > 0 ? gsacStats : DEFAULT_GSAC_STATS;
  const gsacGallerySection = isGsac
    ? effectiveCustomSections.find((s) => s.contentType === 'gallery' && hasCustomSectionContent(s))
    : undefined;
  const gsacGalleryPhotos = (gsacGallerySection?.galleryPhotos || []).filter((p) => p.imageUrl);
  const accordionSections = gsacStatsSection ? effectiveCustomSections.filter((s) => s !== gsacStatsSection) : effectiveCustomSections;

  if (isRwtp) {
    return (
      <main className="page-wrapper">
        <RuralWomenTechParkPage item={item} reportLinks={rwtpReportLinkDocs} customSections={effectiveCustomSections} />
      </main>
    );
  }

  if (isSmartInterviews) {
    return (
      <main className="page-wrapper">
        <SmartInterviewsPage item={item} customSections={effectiveCustomSections} />
      </main>
    );
  }

  return (
    <main className="page-wrapper">
      {/* Hero — Department Hero Card Design */}
      {isGsac ? (
        <GsacHero heroImage={heroImage} />
      ) : isForeignLanguages ? (
        <ForeignLanguagesHero heroImage={heroImage} />
      ) : !isChipsToStartup && (
        <section className="dept-hero-section" style={COMPACT_SLUGS.has(item.slug) ? { marginBottom: 0 } : undefined}>
          <div className="container">
            <div className="dept-hero-card">
              {heroImage && (
                <SmoothImage src={heroImage} alt={item.title} className="dept-hero-bg-img" loading="eager" decoding="sync" {...fetchPriorityAttr('high')} />
              )}
              <div className="dept-hero-overlay" />
              <div className="dept-hero-content">
                <div className="breadcrumb animate-fade-in" style={{ marginBottom: '0.8rem' }}>
                  <Link to="/" className="breadcrumb-item">Home</Link>
                  <span className="breadcrumb-sep">›</span>
                  <Link to="/differentiators" className="breadcrumb-item">Differentiators</Link>
                  <span className="breadcrumb-sep">›</span>
                  <Link to={`/differentiators#${category.id}`} className="breadcrumb-item">{category.label}</Link>
                  <span className="breadcrumb-sep">›</span>
                  <span className="breadcrumb-item active">{item.title}</span>
                </div>
                <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#C9973A', color: '#0B1E42', fontSize: 'var(--text-xs)', fontWeight: 800, padding: '0.35rem 0.9rem', borderRadius: '9999px', marginBottom: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  <CategoryIcon size={14} /> {category.label}
                </div>
                <h1 className="dept-hero-title">{item.title}</h1>
                {/* Its own "Hero Subtitle" admin field — deliberately not the
                    same as the Short Description (hub-card blurb) or the
                    Description block further down the page. */}
                {item.summary && (
                  <p className="dept-hero-subtitle">{item.summary}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Overview — Description/Vision/Mission/Objectives/Custom Sections,
          the same structure every non-external item has. Institution
          Innovation Cell, Vehicle Design Lab, and AICTE Idea Lab each have
          their own dedicated `{item, sections}` page component below;
          TalentSprint – WISE keeps its own dedicated tabbed page
          (WisePage) rendered separately, further down. */}
      {isChipsToStartup ? (
        <ChipsToStartupPage item={item} customSections={effectiveCustomSections} />
      ) : (isGsac || isForeignLanguages) ? (
        <section className="section bg-white">
          <div className="container">
            {isForeignLanguages ? (
              <ForeignLanguagesPage data={foreignLanguages} />
            ) : (
              <>
                {/* Same "About the Department" card treatment as the academic
                    department pages (see .dept-about-* in detail-layout.css):
                    accent-bordered gradient card, section label + title header
                    above it. GSAC adds a "Global Opportunities" stats sidebar
                    next to it — everything beyond the description (Vision/
                    Mission/Objectives, Key Highlights, Facilities, Outcomes,
                    Partners, Contacts, ...) is just Custom Sections either
                    way. */}
                <div className="detail-grid detail-grid--image-sidebar">
                  <div className="dept-about-main">
                    {/* No "Overview" / "About {title}" heading here on purpose
                        — the description below is meant to lead the page with
                        no heading of its own or above it (unlike About VWU/
                        About SVES/About R&D elsewhere on the site, which keep
                        theirs). */}
                    <div className="dept-about-card">
                      <SectionSubtree section={descriptionSection} />
                    </div>

                    {/* Vision/Mission/Objectives (introBlocks — fixed fields,
                        only rendered when filled in) lead, in that order,
                        followed by any other admin-added 'intro'-placed
                        Custom Section; everything else (Key Highlights,
                        Facilities, Outcomes, Partners, Contacts, ...) renders
                        as a collapsible accordion below (see
                        lib/customSections.ts). GSAC renders its own Gallery
                        further below (see gsacGallerySection) instead of the
                        generic one. */}
                    <CustomSectionsIntro sections={[...introBlocks, ...effectiveCustomSections]} />
                    <CustomSectionsAccordion sections={accordionSections} />
                  </div>

                  <div className="detail-sidebar">
                    <div className="gsac-globe-card">
                      <img src="/images/dot world map.webp" alt="" aria-hidden="true" className="gsac-globe-map" />
                      <h3 className="gsac-globe-title">Global<br />Opportunities<br />Brighter Futures</h3>
                      <div className="gsac-globe-divider" aria-hidden="true" />
                      <div className="gsac-globe-stats">
                        {displayGsacStats.map((s, i) => (
                          <div key={i} className="gsac-globe-stat">
                            <strong>{s.value}</strong>
                            {s.label && <span>{s.label}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GSAC's gallery — "Moments from GSAC" header, collapsed to 3
                    photos with a toggle to reveal the rest in place. Every
                    other differentiator item's gallery still renders
                    generically (CustomSectionsGalleries), unaffected. */}
                {gsacGalleryPhotos.length > 0 && (
                  <div style={{ marginTop: 'var(--space-10)' }}>
                    <div className="gsac-gallery-header">
                      <div>
                        <span className="section-label">Gallery</span>
                        <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Moments from GSAC</h2>
                        <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Sessions, interactions and global opportunities in action.</p>
                      </div>
                      {gsacGalleryPhotos.length > 3 && (
                        <button type="button" className="gsac-gallery-toggle" onClick={() => setGsacGalleryExpanded((v) => !v)}>
                          {gsacGalleryExpanded ? 'Show Less' : 'View Full Gallery'} <ChevronRight size={16} strokeWidth={2} />
                        </button>
                      )}
                    </div>
                    <div className="gsac-gallery-grid">
                      {(gsacGalleryExpanded ? gsacGalleryPhotos : gsacGalleryPhotos.slice(0, 3)).map((p, i) => (
                        <div className="gsac-gallery-item" key={p.imageUrl || i}>
                          <img src={p.imageUrl} alt={p.caption || 'Graduate Study Abroad Center'} loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      ) : (
        <section
          className={COMPACT_SLUGS.has(item.slug) ? 'section-compact' : 'section bg-white'}
          style={COMPACT_SLUGS.has(item.slug) ? { padding: 0 } : PADDED_SLUGS.has(item.slug) ? { paddingTop: '1rem' } : undefined}
        >
          <div className="container">
            {item.slug === 'microchip-embedded' ? (
              <MicrochipPage customSections={effectiveCustomSections} />
            ) : item.slug === 'ti-dsp-coe' ? (
              <TiDspPage customSections={effectiveCustomSections} />
            ) : item.slug === 'ultratech-coe' ? (
              <UltraTechPage
                customSections={effectiveCustomSections}
                descriptionSection={descriptionSection}
                introBlocks={introBlocks}
              />
            ) : item.slug === 'meda-plm-coe' ? (
              <MedaPlmCoePage item={item} sections={effectiveCustomSections} />
            ) : item.slug === 'vsac' ? (
              <VsacPage item={item} sections={effectiveCustomSections} />
            ) : item.slug === 'vehicle-design-lab' ? (
              <VehicleDesignLabPage item={item} sections={effectiveCustomSections} />
            ) : item.slug === 'dream-house-lab' ? (
              <DreamHouseLabPage item={item} sections={effectiveCustomSections} />
            ) : item.slug === 'hpc-lab' ? (
              <HpcLabPage item={item} sections={effectiveCustomSections} />
            ) : item.slug === 'aicte-idea-lab' ? (
              <IdeaLabPage item={item} sections={effectiveCustomSections} />
            ) : item.slug === 'institution-innovation-cell' ? (
              <IicPage item={item} sections={effectiveCustomSections} />
            ) : (
              <div className="dept-about-main">
                <div className="dept-about-card">
                  <SectionSubtree section={descriptionSection} />
                </div>
                <CustomSectionsIntro sections={[...introBlocks, ...effectiveCustomSections]} />
                <CustomSectionsGalleries sections={effectiveCustomSections} />
                <CustomSectionsAccordion sections={effectiveCustomSections} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Rural Women Tech Park's Report Links are admin-managed separately
          (Admin > Differentiators > Rural Women Tech Park > Report Links)
          — shown as their own labeled block here since a generic section
          has no way to know these specific entries are download links.
          Unreachable in practice: isRwtp returns its own dedicated page
          (RuralWomenTechParkPage, which renders these report links itself)
          before this point — kept only so a future removal of that early
          return doesn't silently lose these entirely. */}
      {item.slug === 'rural-women-tech-park' && rwtpReportLinkDocs.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Report Links</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {rwtpReportLinkDocs.map((link) => (
                <a key={link.id} href={link.fileUrl} download style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TalentSprint – WISE's own tabbed page (About WISE / Beneficiaries –
          Placements / and 7 more sections navigable from its sidebar). */}
      {wise && <WisePage tabs={item.tabs || []} />}

      {/* Faculty — shown only when this differentiator is linked to a
          teaching department (item.department). Reuses the Academics faculty
          grid + the shared `faculty` collection, so the roster is never
          re-entered here. No .reveal (Firestore-gated — see CLAUDE.md). */}
      {faculty.length > 0 && (
        <div id="faculty" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
          <FacultyCarousel faculty={faculty} title="Faculty" viewMoreLink="/faculty" />
        </div>
      )}

      {/* CTA */}
      {isForeignLanguages ? (
        <ForeignLanguagesFooter />
      ) : (
        <section style={{ background: 'var(--color-primary)', padding: (item.slug === 'meda-plm-coe' || item.slug === 'vsac' || item.slug === 'vehicle-design-lab' || item.slug === 'dream-house-lab' || item.slug === 'hpc-lab' || item.slug === 'aicte-idea-lab' || item.slug === 'institution-innovation-cell') ? 'var(--space-6) 0' : 'var(--space-14) 0' }}>
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
                <Link to="/apply-now" className="btn btn-secondary">Apply Now</Link>
                <Link to="/academics" className="btn btn-secondary">Academics</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
