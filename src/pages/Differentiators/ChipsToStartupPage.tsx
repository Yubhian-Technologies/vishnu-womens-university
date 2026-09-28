import { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  Cpu,
  ChevronDown,
  FileText,
  Boxes,
  Target,
  Award,
  Star,
  Building2,
  Handshake,
  FolderKanban,
  Coins,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { CustomSectionsGalleries, SectionSubtree } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import { hasCustomSectionContent, type CustomSection } from '../../lib/customSections';
import { smoothScrollTo } from '../../lib/smoothScroll';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { chipsToStartup } from './chipsToStartup.data';
import { renderBold } from '../../lib/boldText';
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

export default function ChipsToStartupPage({
  item,
  customSections,
}: {
  item: DifferentiatorItemDoc;
  customSections: CustomSection[];
}) {
  const {
    heroPills,
    heroTitle,
    heroSubtitle,
    heroCtaText,
    aboutTitle,
    aboutParagraphs,
    statCards,
    objectives,
    galleryCaption,
    projectOutlay,
    resources,
    edaTools,
    projectObjectives,
    facilities,
    keyHighlights,
  } = chipsToStartup;

  const modules = customSections.filter(
    (s) => s.placement !== 'intro' && s.contentType !== 'gallery' && hasCustomSectionContent(s)
  );
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  return (
    <div className="cts-page">
      {/* 1. HERO BANNER */}
      <section className="cts-hero">
        {item.heroImage && (
          <SmoothImage
            src={item.heroImage}
            alt={heroTitle}
            className="cts-hero-img"
            loading="eager"
            decoding="sync"
          />
        )}
        <div className="cts-hero-scrim" />
        <div className="cts-hero-doodle" aria-hidden="true">
          Build<br />Design<br />Create
        </div>
        <div className="cts-hero-inner">
          <div className="cts-hero-content" style={{ maxWidth: '640px' }}>
            <div className="cts-hero-pills">
              {heroPills.map((pill, idx) => (
                <span
                  key={idx}
                  className={`cts-pill ${
                    idx === 0 ? 'cts-pill--green' : idx === 1 ? 'cts-pill--orange' : 'cts-pill--purple'
                  }`}
                >
                  {pill}
                </span>
              ))}
            </div>
            <h1 className="cts-hero-title" style={{ fontSize: '2.4rem' }}>
              {heroTitle}
            </h1>
            <p className="cts-hero-sub" style={{ fontSize: '1rem', lineHeight: '1.65' }}>
              {renderBold(heroSubtitle)}
            </p>
            <button
              type="button"
              className="cts-btn-primary"
              onClick={() => smoothScrollTo('#cts-about')}
            >
              {heroCtaText} <ArrowRight size={16} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE PROGRAMME & STAT / HIGHLIGHT CARDS */}
      <section className="cts-card cts-about" id="cts-about">
        <div className="cts-about-text">
          <span className="cts-card-icon">
            <Sparkles size={18} strokeWidth={2} />
          </span>
          <h2 className="cts-card-title">{aboutTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{renderBold(p)}</p>
            ))}
          </div>
        </div>

        <div className="cts-badge-grid">
          {statCards.map((sc, i) => (
            <div key={i} className="cts-badge-card" style={{ flexDirection: 'column', gap: '0.4rem', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="cts-badge-icon">
                  {i === 0 ? <Coins size={14} /> : i === 1 ? <Cpu size={14} /> : i === 2 ? <ShieldCheck size={14} /> : <Wrench size={14} />}
                </span>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
                  {sc.title}
                </span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1E42' }}>
                {sc.val}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 400 }}>
                {renderBold(sc.desc)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROGRAMME OBJECTIVES */}
      <section className="cts-card cts-objectives">
        <div className="cts-objectives-text">
          <span className="cts-card-icon">
            <Lightbulb size={18} strokeWidth={2} />
          </span>
          <h2 className="cts-card-title">Objectives</h2>
          <ul className="cts-checklist">
            {objectives.map((o, i) => (
              <li key={i}>
                <CheckCircle2 size={16} strokeWidth={2} className="cts-check-icon" />
                <span>{renderBold(o)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cts-objectives-doodle" aria-hidden="true">
          <span className="cts-doodle-text">
            Learn<br />Build<br />Grow
          </span>
          <span className="cts-doodle-chip-wrap">
            <span className="cts-doodle-blob cts-doodle-blob--green" />
            <span className="cts-doodle-blob cts-doodle-blob--orange" />
            <svg width="72" height="72" viewBox="0 0 64 64" fill="none" className="cts-doodle-chip">
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

      {/* 4. PROJECT OVERVIEW & FUNDING (PROJECT OUTLAY) */}
      <section className="cts-card">
        <span className="cts-card-icon">
          <FileText size={18} strokeWidth={2} />
        </span>
        <h2 className="cts-card-title">{projectOutlay.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.35rem' }}>
              Institution
            </div>
            <div style={{ fontWeight: 600, color: '#0F2547', fontSize: '0.95rem' }}>
              {projectOutlay.institute}
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.35rem' }}>
              Project Title
            </div>
            <div style={{ fontWeight: 600, color: '#0F2547', fontSize: '0.95rem' }}>
              {projectOutlay.projectTitle}
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '0.35rem' }}>
              Total Project Outlay & Duration
            </div>
            <div style={{ fontWeight: 700, color: '#0F2547', fontSize: '1.1rem' }}>
              {projectOutlay.totalOutlay} <span style={{ fontWeight: 400, fontSize: '0.9rem', color: '#64748B' }}>({projectOutlay.duration})</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', background: '#F1F5F9', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#334155', marginBottom: '0.75rem' }}>
            Project Investigators
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {projectOutlay.investigators.map((inv, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#1E293B', fontWeight: 500 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === 0 ? '#C9973A' : '#64748B', flexShrink: 0 }} />
                <span>{renderBold(inv)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROGRAMME RESOURCES & CAPACITY BUILDING */}
      <section className="cts-card">
        <span className="cts-card-icon">
          <Boxes size={18} strokeWidth={2} />
        </span>
        <h2 className="cts-card-title">{resources.title}</h2>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
          {renderBold(resources.intro)}
        </p>
        <p style={{ fontWeight: 600, color: '#0F2547', margin: '0 0 0.75rem', fontSize: '0.95rem' }}>
          {renderBold(resources.keyIntro)}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
          {resources.items.map((itemStr, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <CheckCircle2 size={16} className="cts-check-icon" style={{ marginTop: '2px' }} />
              <span style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500, lineHeight: '1.4' }}>{renderBold(itemStr)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EDA TOOLS & DESIGN INFRASTRUCTURE */}
      <section className="cts-card">
        <span className="cts-card-icon">
          <Cpu size={18} strokeWidth={2} />
        </span>
        <h2 className="cts-card-title">{edaTools.title}</h2>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, margin: '0 0 1.25rem' }}>
          {renderBold(edaTools.intro)}
        </p>

        <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#0F2547', color: '#FFFFFF' }}>
                {edaTools.headers.map((h, idx) => (
                  <th key={idx} style={{ padding: '0.85rem 1rem', fontWeight: 600, borderBottom: '1px solid #1E293B', width: idx === 0 ? '70px' : idx === 1 ? '220px' : 'auto' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {edaTools.rows.map((row, rIdx) => (
                <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#64748B' }}>{row[0]}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0F2547' }}>{row[1]}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155', lineHeight: '1.5' }}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. PROJECT OBJECTIVES (BROAD OBJECTIVES OF PROJECT) */}
      <section className="cts-card">
        <span className="cts-card-icon">
          <Target size={18} strokeWidth={2} />
        </span>
        <h2 className="cts-card-title">{projectObjectives.title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.75rem' }}>
          {projectObjectives.items.map((itemStr, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#F8FAFC', padding: '1rem 1.1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0F2547', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                0{idx + 1}
              </div>
              <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 500, lineHeight: '1.6' }}>
                {renderBold(itemStr)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FACILITIES & EQUIPMENT */}
      <section className="cts-card">
        <span className="cts-card-icon">
          <Building2 size={18} strokeWidth={2} />
        </span>
        <h2 className="cts-card-title">{facilities.title}</h2>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
          {renderBold(facilities.intro)}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F2547', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} /> Development Hardware
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {facilities.developmentHardware.map((hw, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                  <CheckCircle2 size={15} className="cts-check-icon" style={{ marginTop: '2px' }} />
                  <span>{renderBold(hw)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F2547', margin: '0 0 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Boxes size={16} /> Design Infrastructure
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {facilities.designInfrastructure.map((infra, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: '#334155' }}>
                  <CheckCircle2 size={15} className="cts-check-icon" style={{ marginTop: '2px' }} />
                  <span>{renderBold(infra)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. KEY HIGHLIGHTS */}
      <section className="cts-card">
        <span className="cts-card-icon">
          <Star size={18} strokeWidth={2} />
        </span>
        <h2 className="cts-card-title">Key Highlights</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem', marginTop: '0.75rem' }}>
          {keyHighlights.map((kh, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#F5E6C8', color: '#A1791F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <Star size={13} />
              </div>
              <span style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500, lineHeight: '1.5' }}>
                {renderBold(kh)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 10. GALLERY WITH CAPTION */}
      <section className="cts-card cts-gallery">
        <span className="cts-card-icon">
          <LayoutGrid size={18} strokeWidth={2} />
        </span>
        <div style={{ marginBottom: '1rem' }}>
          <h2 className="cts-card-title" style={{ margin: 0 }}>Gallery</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0.35rem 0 0', fontWeight: 500 }}>
            {renderBold(galleryCaption)}
          </p>
        </div>
        <CustomSectionsGalleries sections={customSections} />
      </section>

      {/* 11. DYNAMIC MODULES (IF ANY CUSTOM SECTIONS REMAIN) */}
      {modules.length > 0 && (
        <section className="cts-card cts-modules" id="cts-modules">
          <span className="cts-card-icon">
            <FolderKanban size={18} strokeWidth={2} />
          </span>
          <h2 className="cts-card-title">Additional Modules</h2>
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
                    <span className="cts-module-icon">
                      <Icon size={16} strokeWidth={2} />
                    </span>
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
