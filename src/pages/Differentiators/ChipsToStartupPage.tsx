import {
  Sparkles, Lightbulb, LayoutGrid, ArrowRight, CheckCircle2, Cpu,
  FileText, Boxes, Target, Award, Star, Building2, Handshake, FolderKanban,
} from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { CustomSectionsGalleries, CustomSectionsAccordion } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
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
// The "Modules" list is a visual index of those same Custom Sections
// (Project Outlay, Resources, EDA Tools, ...); their full content still
// renders normally just below via the shared CustomSectionsAccordion, so
// nothing an admin edits there needs a second place to be kept in sync.
export default function ChipsToStartupPage({ item, customSections }: { item: DifferentiatorItemDoc; customSections: CustomSection[] }) {
  const aboutText = item.description?.textContent || item.about || item.intro || item.desc || '';
  const highlightBadges = (item.highlights || []).filter(Boolean).slice(0, 4);
  const objectivesList = (item.objectives?.listText || '')
    .split('\n').map((s) => s.trim()).filter(Boolean);
  const modules = customSections.filter((s) => s.placement !== 'intro' && s.contentType !== 'gallery' && hasCustomSectionContent(s));

  return (
    <div className="cts-page">
      {/* Hero */}
      <section className="cts-hero">
        {item.heroImage && <SmoothImage src={item.heroImage} alt={item.title} className="cts-hero-img" loading="eager" decoding="sync" />}
        <div className="cts-hero-scrim" />
        <div className="cts-hero-doodle" aria-hidden="true">Build<br />Design<br />Create</div>
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
            <Cpu size={56} strokeWidth={1.25} className="cts-doodle-chip" />
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

      {/* Modules — a visual index of the sections below; full content for
          each stays in the shared accordion so it's edited in one place. */}
      {modules.length > 0 && (
        <section className="cts-card cts-modules" id="cts-modules">
          <span className="cts-card-icon"><FolderKanban size={18} strokeWidth={2} /></span>
          <h2 className="cts-card-title">Modules</h2>
          <div className="cts-modules-grid">
            {modules.map((m) => {
              const Icon = MODULE_ICONS[m.id] || FileText;
              return (
                <div key={m.id} className="cts-module-row">
                  <span className="cts-module-icon"><Icon size={16} strokeWidth={2} /></span>
                  <span className="cts-module-label">{m.label}</span>
                  <ArrowRight size={15} strokeWidth={2} className="cts-module-arrow" />
                </div>
              );
            })}
          </div>
          <CustomSectionsAccordion sections={modules} />
        </section>
      )}
    </div>
  );
}
