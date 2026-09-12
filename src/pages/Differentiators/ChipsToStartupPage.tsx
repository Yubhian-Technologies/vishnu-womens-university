import { useState } from 'react';
import {
  Sparkles, Lightbulb, LayoutGrid, ArrowRight, CheckCircle2, Cpu, ChevronDown,
  FileText, Boxes, Target, Award, Star, Building2, Handshake, FolderKanban,
} from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { CustomSectionsGalleries, SectionSubtree } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import { smoothScrollTo } from '../../lib/smoothScroll';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import './ChipsToStartupPage.css';

const MODULE_ICONS: Record<string, typeof FileText> = {
  'project-outlay': FileText,
  resources: Boxes,
  'eda-tools': Cpu,
  'broad-objectives-of-project': Target,
  patent: Award,
  highlights: Star,
  facilities: Building2,
  partners: Handshake,
};

// This one differentiator (Chips to Startup / C2S) gets its own bespoke
// hero + layout per an explicit design request — every field below reads
// straight from the real admin-entered item (title/summary/heroImage/
// highlights/objectives) and its real Custom Sections, nothing invented.
// "Modules" is a single accordion over those same Custom Sections (Project
// Outlay, Resources, EDA Tools, ...) — clicking a row expands its real
// content in place, rather than a separate static index plus a second
// full list underneath.
export default function ChipsToStartupPage({ item, customSections }: { item: DifferentiatorItemDoc; customSections: CustomSection[] }) {
  const aboutText = item.description?.textContent || item.about || item.intro || item.desc || '';
  const highlightBadges = (item.highlights || []).filter(Boolean).slice(0, 4);
  const objectivesList = (item.objectives?.listText || '')
    .split('\n').map((s) => s.trim()).filter(Boolean);
  const modules = customSections.filter((s) => s.placement !== 'intro' && s.contentType !== 'gallery' && hasCustomSectionContent(s));
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  return (
    <div className="cts-page">
      {/* Hero */}
      <section className="cts-hero">
        {item.heroImage && <SmoothImage src={item.heroImage} alt={item.title} className="cts-hero-img" loading="eager" decoding="sync" />}
        <div className="cts-hero-scrim" />
        <div className="cts-hero-doodle" aria-hidden="true">Build<br />Design<br />Create</div>
        <div className="cts-hero-inner">
          <div className="cts-hero-content">
            <div className="cts-hero-pills">
              <span className="cts-pill cts-pill--green">Innovation</span>
              <span className="cts-pill cts-pill--orange">Learning</span>
              <span className="cts-pill cts-pill--purple">Impact</span>
            </div>
            <h1 className="cts-hero-title">{item.title}</h1>
            {item.summary && <p className="cts-hero-sub">{item.summary}</p>}
            <button type="button" className="cts-btn-primary" onClick={() => smoothScrollTo('#cts-modules')}>
              Explore Learning Path <ArrowRight size={16} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </section>

      {/* About the Program */}
      {aboutText && (
        <section className="cts-card cts-about">
          <div className="cts-about-text">
            <span className="cts-card-icon"><Sparkles size={18} strokeWidth={2} /></span>
            <h2 className="cts-card-title">About the Program</h2>
            <p>{aboutText}</p>
          </div>
          {highlightBadges.length > 0 && (
            <div className="cts-badge-grid">
              {highlightBadges.map((h, i) => (
                <div key={i} className="cts-badge-card">
                  <span className="cts-badge-icon"><Star size={16} strokeWidth={2} /></span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Objectives */}
      {objectivesList.length > 0 && (
        <section className="cts-card cts-objectives">
          <div className="cts-objectives-text">
            <span className="cts-card-icon"><Lightbulb size={18} strokeWidth={2} /></span>
            <h2 className="cts-card-title">Objectives</h2>
            <ul className="cts-checklist">
              {objectivesList.map((o, i) => (
                <li key={i}>
                  <CheckCircle2 size={16} strokeWidth={2} className="cts-check-icon" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="cts-objectives-doodle" aria-hidden="true">
            <span className="cts-doodle-text">Learn<br />Build<br />Grow</span>
            <span className="cts-doodle-chip-wrap">
              <span className="cts-doodle-blob cts-doodle-blob--green" />
              <span className="cts-doodle-blob cts-doodle-blob--orange" />
              <svg width="72" height="72" viewBox="0 0 64 64" fill="none" className="cts-doodle-chip">
                {/* Circuit traces radiating out from each side, each ending in a small node — a corner
                    trace on either side of a straight middle one, matching the reference's "fanned" look. */}
                {[
                  ['22,16', '15,7'], ['32,16', '32,4'], ['42,16', '49,7'],
                  ['22,48', '15,57'], ['32,48', '32,60'], ['42,48', '49,57'],
                  ['16,22', '7,15'], ['16,32', '4,32'], ['16,42', '7,49'],
                  ['48,22', '57,15'], ['48,32', '60,32'], ['48,42', '57,49'],
                ].map(([from, to]) => {
                  const [x1, y1] = from.split(',');
                  const [x2, y2] = to.split(',');
                  return (
                    <g key={to}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5b8a6b" strokeWidth="1.75" strokeLinecap="round" />
                      <circle cx={x2} cy={y2} r="2" fill="#5b8a6b" />
                    </g>
                  );
                })}
                <rect x="16" y="16" width="32" height="32" rx="7" fill="#eef2e6" stroke="#3f6b4f" strokeWidth="2.5" />
                <rect x="23" y="23" width="18" height="18" rx="4" fill="#2f4a3d" />
                <rect x="23" y="23" width="18" height="8" rx="4" fill="#4a7059" opacity="0.55" />
              </svg>
            </span>
          </div>
        </section>
      )}

      {/* Gallery — reuses the same admin-managed gallery Custom Section
          every other Differentiators detail page renders photos from. */}
      <section className="cts-card cts-gallery">
        <span className="cts-card-icon"><LayoutGrid size={18} strokeWidth={2} /></span>
        <h2 className="cts-card-title">Gallery</h2>
        <CustomSectionsGalleries sections={customSections} />
      </section>

      {/* Modules — click a row to expand its real content in place. */}
      {modules.length > 0 && (
        <section className="cts-card cts-modules" id="cts-modules">
          <span className="cts-card-icon"><FolderKanban size={18} strokeWidth={2} /></span>
          <h2 className="cts-card-title">Modules</h2>
          <div className="cts-modules-grid">
            {modules.map((m) => {
              const Icon = MODULE_ICONS[m.id] || FileText;
              const isOpen = openModuleId === m.id;
              return (
                <div key={m.id} className={`cts-module-row${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="cts-module-trigger"
                    onClick={() => setOpenModuleId(isOpen ? null : m.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="cts-module-icon"><Icon size={16} strokeWidth={2} /></span>
                    <span className="cts-module-label">{m.label}</span>
                    <ChevronDown size={16} strokeWidth={2.25} className="cts-module-arrow" aria-hidden="true" />
                  </button>
                  <SmoothCollapse open={isOpen}>
                    <div className="cts-module-body">
                      <SectionSubtree section={m} />
                    </div>
                  </SmoothCollapse>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
