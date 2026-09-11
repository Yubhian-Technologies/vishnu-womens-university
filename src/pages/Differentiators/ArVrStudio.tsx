import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Glasses, Target, Sparkles, Mail, Users, Cpu, Boxes, Quote, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { SectionSubtree } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { hasCustomSectionContent, type CustomSection, type CustomSectionPhoto } from '../../lib/customSections';
import { DIFFERENTIATOR_CATEGORIES, type DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import './ArVrStudio.css';

// Bespoke, visually distinct "Tech/AR" dark-glassmorphism page for exactly
// one differentiator (slug: ar-vr-studio) — carved out of the generic
// /differentiators/:slug -> DifferentiatorDetail.tsx route (see App.tsx)
// the same way /campus/food-courts was carved out of /campus/:slug.
// Content is still read live from the same `differentiatorItems` Firestore
// doc DifferentiatorDetail.tsx uses (admin-editable at /admin ->
// Differentiators), so nothing here is hardcoded text — only the
// surrounding markup/CSS differs. Every other differentiator keeps
// rendering through the shared template, completely unaffected.
const SLUG = 'ar-vr-studio';
type IntroBlockKey = 'vision' | 'mission' | 'objectives';

// Same fallback-resolution helpers as DifferentiatorDetail.tsx (not exported
// there, so mirrored here) — keeps this page correct for legacy items that
// predate the dedicated description/vision/mission/objectives fields.
function legacyDescriptionFromItem(item: DifferentiatorItemDoc): CustomSection {
  const text = (item.about || item.intro || item.desc || '').trim();
  return { id: 'description', label: 'Description', contentType: 'text', textContent: text };
}

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

function resolveBlock(item: DifferentiatorItemDoc, key: IntroBlockKey): CustomSection | null {
  const direct = item[key];
  if (direct && hasCustomSectionContent(direct)) return direct;
  const legacy = (item.customSections || []).find((s) => s.id === key);
  if (legacy && hasCustomSectionContent(legacy)) return legacy;
  return null;
}

// Pulls the one-item-per-line values out of a 'list' section for a grid/chip
// layout; anything else falls back to the generic SectionSubtree renderer at
// the call site so no content type is ever silently dropped.
function listItems(section: CustomSection | null): string[] {
  if (!section || section.contentType !== 'list') return [];
  return (section.listText || '').split('\n').map((s) => s.trim()).filter(Boolean);
}

// Purely cosmetic icon lookup by section label — never affects the text
// itself, and falls back to a generic icon for any section an admin adds
// later that isn't one of these four.
function sectionIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('contact')) return Mail;
  if (l.includes('faculty') || l.includes('in-charge') || l.includes('incharge')) return Users;
  if (l.includes('facilit') || l.includes('equipment')) return Cpu;
  if (l.includes('highlight')) return Sparkles;
  return Boxes;
}

export default function ArVrStudio() {
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const item = allItems.find((i) => i.slug === SLUG) ?? null;
  const [lightbox, setLightbox] = useState<{ photos: CustomSectionPhoto[]; index: number } | null>(null);

  useEffect(() => {
    if (item) document.title = `${item.title} | Vishnu Women's University`;
  }, [item]);

  if (!item) {
    if (loading) return <RouteFallback />;
    return <Navigate to="/differentiators" replace />;
  }

  const category = DIFFERENTIATOR_CATEGORIES.find((c) => c.id === item.category);
  const alreadyMigrated = item.description !== undefined;
  const promotedBlockIds = new Set(['vision', 'mission', 'objectives']);
  const baseCustomSections = (item.customSections || []).filter((s) => !promotedBlockIds.has(s.id));
  const legacyMergedSections = alreadyMigrated ? [] : (() => {
    const existingIds = new Set(baseCustomSections.map((s) => s.id));
    return legacySectionsFromItem(item).filter((s) => !existingIds.has(s.id));
  })();
  const effectiveCustomSections = [...baseCustomSections, ...legacyMergedSections];

  const resolvedDescription = alreadyMigrated ? item.description! : legacyDescriptionFromItem(item);
  const descriptionSection: CustomSection = hasCustomSectionContent(resolvedDescription)
    ? resolvedDescription
    : { id: 'description', label: 'Description', contentType: 'text', textContent: (item.desc || '').trim() };

  const vision = resolveBlock(item, 'vision');
  const mission = resolveBlock(item, 'mission');
  const objectives = resolveBlock(item, 'objectives');
  const missionItems = listItems(mission);
  const objectiveItems = listItems(objectives);

  const gallerySections = effectiveCustomSections.filter((s) => s.contentType === 'gallery' && hasCustomSectionContent(s));
  const otherSections = effectiveCustomSections.filter((s) => s.contentType !== 'gallery' && hasCustomSectionContent(s));
  const galleryPhotos = gallerySections.flatMap((s) => s.galleryPhotos || []).filter((p) => p.imageUrl);

  const heroImage = item.heroImage || heroSlides[0]?.imageUrl;

  return (
    <main className="page-wrapper arvr-page">
      <SEO
        title={`${item.title} | Vishnu Women's University`}
        description={item.summary || item.desc}
        canonicalPath={`/differentiators/${SLUG}`}
      />

      {/* Hero */}
      <section className="arvr-hero">
        {heroImage && (
          <SmoothImage
            src={heroImage}
            alt={item.title}
            className="arvr-hero__bg"
            loading="eager"
            decoding="sync"
            {...fetchPriorityAttr('high')}
          />
        )}
        <div className="arvr-hero__grid" aria-hidden="true" />
        <div className="arvr-hero__content">
          <div className="arvr-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/differentiators">Differentiators</Link>
            {category && (
              <>
                <span>/</span>
                <Link to={`/differentiators#${category.id}`}>{category.label}</Link>
              </>
            )}
            <span>/</span>
            <span className="is-current">{item.title}</span>
          </div>
          {category && (
            <span className="arvr-eyebrow">
              <Glasses size={14} strokeWidth={2.4} /> {category.label}
            </span>
          )}
          <h1 className="arvr-hero__title">{item.title}</h1>
          {item.summary && <p className="arvr-hero__subtitle">{item.summary}</p>}
        </div>
      </section>

      {/* Overview */}
      {hasCustomSectionContent(descriptionSection) && (
        <section className="arvr-section">
          <div className="arvr-container">
            <div className="arvr-glass arvr-overview">
              <Quote size={28} strokeWidth={2} className="arvr-overview__mark" aria-hidden="true" />
              <div className="arvr-prose"><SectionSubtree section={descriptionSection} /></div>
            </div>
          </div>
        </section>
      )}

      {/* Vision & Mission — side-by-side cards */}
      {(vision || mission) && (
        <section className="arvr-section">
          <div className="arvr-container arvr-vm-grid">
            {vision && (
              <div className="arvr-glass arvr-vm-card">
                <span className="arvr-card-eyebrow"><Target size={14} strokeWidth={2.4} /> {vision.label || 'Vision'}</span>
                <div className="arvr-prose"><SectionSubtree section={vision} /></div>
              </div>
            )}
            {mission && (
              <div className="arvr-glass arvr-vm-card">
                <span className="arvr-card-eyebrow"><Sparkles size={14} strokeWidth={2.4} /> {mission.label || 'Mission'}</span>
                {missionItems.length > 0 ? (
                  <ul className="arvr-checklist">
                    {missionItems.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                ) : (
                  <div className="arvr-prose"><SectionSubtree section={mission} /></div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Objectives — grid of cards */}
      {objectives && (
        <section className="arvr-section">
          <div className="arvr-container">
            <h2 className="arvr-section-title">{objectives.label || 'Objectives'}</h2>
            {objectiveItems.length > 0 ? (
              <div className="arvr-objectives-grid">
                {objectiveItems.map((o, i) => (
                  <div key={i} className="arvr-glass arvr-objective-card">
                    <span className="arvr-objective-num">{String(i + 1).padStart(2, '0')}</span>
                    <p>{o}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="arvr-glass arvr-prose" style={{ padding: 'var(--space-6)' }}>
                <SectionSubtree section={objectives} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryPhotos.length > 0 && (
        <section className="arvr-section">
          <div className="arvr-container">
            <h2 className="arvr-section-title">{gallerySections[0].label}</h2>
            <div className="arvr-gallery-grid">
              {galleryPhotos.map((p, i) => (
                <button
                  key={p.imageUrl}
                  type="button"
                  className="arvr-gallery-tile"
                  onClick={() => setLightbox({ photos: galleryPhotos, index: i })}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={p.imageUrl} alt={p.caption || ''} loading="lazy" />
                  {p.caption && <span className="arvr-gallery-caption">{p.caption}</span>}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Facilities, Contact, Faculty In-charge, Key Highlights, and any
          further admin-added sections — rendered generically. */}
      {otherSections.length > 0 && (
        <section className="arvr-section">
          <div className="arvr-container arvr-other-grid">
            {otherSections.map((section, i) => {
              const Icon = sectionIcon(section.label);
              const items = listItems(section);
              return (
                <div key={`${section.id}-${i}`} className="arvr-glass arvr-info-card">
                  <span className="arvr-card-eyebrow"><Icon size={14} strokeWidth={2.4} /> {section.label}</span>
                  {items.length > 0 ? (
                    <ul className="arvr-chip-list">
                      {items.map((it, ii) => <li key={ii}>{it}</li>)}
                    </ul>
                  ) : (
                    <div className="arvr-prose"><SectionSubtree section={section} /></div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="arvr-cta">
        <div className="arvr-container" style={{ textAlign: 'center' }}>
          <h2 className="arvr-cta__title">Explore More Differentiators</h2>
          <p className="arvr-cta__text">
            Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.
          </p>
          <div className="arvr-cta__actions">
            <Link to="/differentiators" className="btn btn-accent">All Differentiators</Link>
            <Link to="/apply-now" className="btn btn-secondary">Apply Now</Link>
            <Link to="/academics" className="btn btn-secondary">Academics</Link>
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="arvr-lightbox" onClick={() => setLightbox(null)}>
          <button type="button" className="arvr-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close">
            <X size={20} />
          </button>
          {lightbox.photos.length > 1 && (
            <>
              <button
                type="button"
                className="arvr-lightbox__nav arvr-lightbox__nav--prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((s) => s && ({ ...s, index: (s.index - 1 + s.photos.length) % s.photos.length }));
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="arvr-lightbox__nav arvr-lightbox__nav--next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((s) => s && ({ ...s, index: (s.index + 1) % s.photos.length }));
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          <img src={lightbox.photos[lightbox.index].imageUrl} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
