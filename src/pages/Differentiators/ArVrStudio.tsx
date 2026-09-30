import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Glasses, Target, Sparkles, Mail, Users, Cpu, Quote, ChevronLeft, ChevronRight, X,
  Phone, MapPin, Layers
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { CustomSectionsIntro, CustomSectionsGalleries, CustomSectionsAccordion } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { hasCustomSectionContent, type CustomSectionPhoto } from '../../lib/customSections';
import { type DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { arVrStudio } from './arVrStudio.data';
import { useDocument } from '../../hooks/useDocument';
import type { ArVrStudioDoc } from '../Admin/sections/ArVrStudioContentAdmin';
import { renderBold } from '../../lib/boldText';
import './ArVrStudio.css';

const SLUG = 'ar-vr-studio';

export default function ArVrStudio() {
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const item = allItems.find((i) => i.slug === SLUG) ?? null;
  const [lightbox, setLightbox] = useState<{ photos: CustomSectionPhoto[]; index: number } | null>(null);
  const { data: remoteData } = useDocument<ArVrStudioDoc>('settings', 'arVrStudio');
  const studio = { ...arVrStudio, ...(remoteData || {}) };

  const dynamicTitle = item?.title || studio.heroTitle;
  const dynamicSubtitle = item?.summary || item?.desc || studio.heroSubtitle;
  const aboutParagraphs = (item?.description && hasCustomSectionContent(item.description) && item.description.textContent)
    ? [item.description.textContent]
    : item?.desc
    ? [item.desc]
    : studio.aboutParagraphs;

  const visionText = (item?.vision && hasCustomSectionContent(item.vision) && (item.vision.textContent || item.vision.listText)) || studio.vision;

  const missionList = (item?.mission && hasCustomSectionContent(item.mission) && (item.mission.listText?.split('\n').filter(Boolean) || [item.mission.textContent || ''])) || studio.mission;

  useEffect(() => {
    document.title = `${dynamicTitle} | Vishnu Women's University`;
  }, [dynamicTitle]);

  if (!item && loading) {
    return <RouteFallback />;
  }

  // Extract gallery photos if any exist in admin dynamic customSections
  const effectiveCustomSections = item?.customSections || [];
  const gallerySections = effectiveCustomSections.filter((s) => s.contentType === 'gallery' && hasCustomSectionContent(s));
  const galleryPhotos = gallerySections.flatMap((s) => s.galleryPhotos || []).filter((p) => p.imageUrl);

  const heroImage = item?.heroImage || heroSlides[0]?.imageUrl || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=1600';

  return (
    <main className="page-wrapper arvr-page">
      <SEO
        title={`${dynamicTitle} | Vishnu Women's University`}
        description={dynamicSubtitle}
        canonicalPath={`/differentiators/${SLUG}`}
      />

      {/* Hero Section */}
      <section className="arvr-hero">
        {heroImage && (
          <SmoothImage
            src={heroImage}
            alt={dynamicTitle}
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
            <span>/</span>
            <Link to="/differentiators#research-specialised-labs">Research & Specialised Labs</Link>
            <span>/</span>
            <span className="is-current">{dynamicTitle}</span>
          </div>
          <span className="arvr-eyebrow">
            <Glasses size={14} strokeWidth={2.4} /> {studio.heroCategory}
          </span>
          <h1 className="arvr-hero__title">{dynamicTitle}</h1>
          <p className="arvr-hero__subtitle">{renderBold(dynamicSubtitle)}</p>
        </div>
      </section>

      {/* About Section */}
      <section className="arvr-section">
        <div className="arvr-container">
          <h2 className="arvr-section-title">{studio.aboutTitle}</h2>
          <div className="arvr-glass arvr-overview">
            <Quote size={28} strokeWidth={2} className="arvr-overview__mark" aria-hidden="true" />
            <div className="arvr-prose">
              {aboutParagraphs.map((para, i) => (
                <p key={i} style={{ marginBottom: i < aboutParagraphs.length - 1 ? '1rem' : 0 }}>
                  {renderBold(para)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Side-by-Side Cards */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container arvr-vm-grid">
          <div className="arvr-glass arvr-vm-card">
            <span className="arvr-card-eyebrow">
              <Target size={14} strokeWidth={2.4} /> {studio.visionTitle}
            </span>
            <div className="arvr-prose">
              <p>{renderBold(visionText)}</p>
            </div>
          </div>
          <div className="arvr-glass arvr-vm-card">
            <span className="arvr-card-eyebrow">
              <Sparkles size={14} strokeWidth={2.4} /> {studio.missionTitle}
            </span>
            <ul className="arvr-checklist">
              {missionList.map((itemText, i) => (
                <li key={i}>{renderBold(itemText)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container">
          <h2 className="arvr-section-title">{studio.objectivesTitle}</h2>
          <div className="arvr-objectives-grid">
            {studio.objectivesFormatted.map((obj) => (
              <div key={obj.code} className="arvr-glass arvr-objective-card">
                <span className="arvr-objective-num">{obj.code}</span>
                <div>
                  <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--avr-text)' }}>
                    {obj.title}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--avr-text-dim)', lineHeight: 1.6 }}>{renderBold(obj.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From Concept to Immersive Experience Section */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container">
          <h2 className="arvr-section-title">{studio.conceptExperience.title}</h2>
          <p style={{ color: 'var(--avr-text-dim)', marginBottom: '1.5rem', marginTop: '-0.5rem', fontSize: '1.05rem' }}>
            {renderBold(studio.conceptExperience.intro)}
          </p>
          <div className="arvr-other-grid">
            {studio.conceptExperience.cards.map((card, i) => (
              <div key={i} className="arvr-glass arvr-info-card">
                <span className="arvr-card-eyebrow">
                  <Layers size={14} strokeWidth={2.4} /> {card.title}
                </span>
                <p style={{ margin: 0, color: 'var(--avr-text-dim)', lineHeight: 1.6 }}>{renderBold(card.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Infrastructure Section */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container">
          <h2 className="arvr-section-title">{studio.techInfrastructure.title}</h2>
          <div className="arvr-other-grid">
            {studio.techInfrastructure.groups.map((group, i) => (
              <div key={i} className="arvr-glass arvr-info-card">
                <span className="arvr-card-eyebrow">
                  <Cpu size={14} strokeWidth={2.4} /> {group.category}
                </span>
                <ul className="arvr-checklist">
                  {group.items.map((itemStr, idx) => (
                    <li key={idx}>{renderBold(itemStr)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Highlights Section */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container">
          <h2 className="arvr-section-title">Key Highlights</h2>
          <div className="arvr-glass" style={{ padding: 'var(--space-6)' }}>
            <ul className="arvr-checklist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {studio.keyHighlights.map((hl, i) => (
                <li key={i}>{renderBold(hl)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container">
          <h2 className="arvr-section-title">{studio.galleryTitle}</h2>
          <p style={{ color: 'var(--avr-text-dim)', marginBottom: '1.5rem', marginTop: '-0.5rem', fontSize: '1.05rem' }}>
            {renderBold(studio.galleryCaption)}
          </p>
          {galleryPhotos.length > 0 ? (
            <div className="arvr-gallery-grid">
              {galleryPhotos.map((p, i) => (
                <button
                  key={p.imageUrl || i}
                  type="button"
                  className="arvr-gallery-tile"
                  onClick={() => setLightbox({ photos: galleryPhotos, index: i })}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={p.imageUrl} alt={p.caption || ''} loading="lazy" />
                  {p.caption && <span className="arvr-gallery-caption">{renderBold(p.caption)}</span>}
                </button>
              ))}
            </div>
          ) : (
            <div className="arvr-glass" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <p style={{ color: 'var(--avr-text-dim)', margin: 0 }}>
                {renderBold(studio.galleryCaption)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Connect & Faculty In-Charge Section */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container arvr-vm-grid">
          {/* Contact Card */}
          <div className="arvr-glass arvr-info-card">
            <span className="arvr-card-eyebrow">
              <Mail size={14} strokeWidth={2.4} /> {studio.contact.title}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div>
                <strong>{studio.contact.name}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--avr-text-dim)' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '0.2rem', color: 'var(--avr-cyan)' }} />
                <span>{studio.contact.address.join(', ')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--avr-text-dim)' }}>
                <Mail size={16} style={{ flexShrink: 0, color: 'var(--avr-cyan)' }} />
                <a href={`mailto:${studio.contact.email}`} style={{ color: 'var(--avr-cyan)' }}>
                  {studio.contact.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--avr-text-dim)' }}>
                <Phone size={16} style={{ flexShrink: 0, color: 'var(--avr-cyan)' }} />
                <a href={`tel:${studio.contact.phone}`} style={{ color: 'var(--avr-cyan)' }}>
                  {studio.contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Faculty In-Charge Card */}
          <div className="arvr-glass arvr-info-card">
            <span className="arvr-card-eyebrow">
              <Users size={14} strokeWidth={2.4} /> Faculty In-Charge
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--avr-text)' }}>
                {studio.facultyInCharge.name}
              </div>
              <div style={{ color: 'var(--avr-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>
                {studio.facultyInCharge.designation}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--avr-text-dim)', fontSize: '0.9rem' }}>
                <Mail size={15} style={{ color: 'var(--avr-cyan)' }} />
                <a href={`mailto:${studio.facultyInCharge.email}`} style={{ color: 'var(--avr-cyan)' }}>
                  {studio.facultyInCharge.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--avr-text-dim)', fontSize: '0.9rem' }}>
                <Phone size={15} style={{ color: 'var(--avr-cyan)' }} />
                <span>{studio.facultyInCharge.mobile}</span>
              </div>
              <div style={{ color: 'var(--avr-text-dim)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                <strong>Areas of Interest:</strong> {studio.facultyInCharge.interests}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC CUSTOM SECTIONS */}
      {effectiveCustomSections.some((s) => s.placement === 'intro') && (
        <section className="arvr-section" style={{ paddingTop: 0 }}>
          <div className="arvr-container">
            <CustomSectionsIntro sections={effectiveCustomSections} />
          </div>
        </section>
      )}
      {effectiveCustomSections.length > 0 && (
        <section className="arvr-section" style={{ paddingTop: 0 }}>
          <div className="arvr-container">
            <CustomSectionsGalleries sections={effectiveCustomSections} />
            <CustomSectionsAccordion sections={effectiveCustomSections.filter((s) => s.placement !== 'intro' && s.contentType !== 'gallery')} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="arvr-cta">
        <div className="arvr-container" style={{ textAlign: 'center' }}>
          <h2 className="arvr-cta__title">{studio.cta.title}</h2>
          <p className="arvr-cta__text">{renderBold(studio.cta.subtitle)}</p>
          <div className="arvr-cta__actions">
            <Link to="/differentiators" className="btn btn-accent">
              {studio.cta.btn1}
            </Link>
            <Link to="/academics" className="btn btn-secondary">
              {studio.cta.btn2}
            </Link>
            <Link to="/apply-now" className="btn btn-secondary">
              {studio.cta.btn3}
            </Link>
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
          <img loading="lazy" src={lightbox.photos[lightbox.index].imageUrl} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}

