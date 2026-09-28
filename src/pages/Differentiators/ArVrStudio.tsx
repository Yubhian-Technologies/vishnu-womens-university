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
import { hasCustomSectionContent, type CustomSectionPhoto } from '../../lib/customSections';
import { type DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import { arVrStudio } from './arVrStudio.data';
import { renderBold } from '../../lib/boldText';
import './ArVrStudio.css';

const SLUG = 'ar-vr-studio';

export default function ArVrStudio() {
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const item = allItems.find((i) => i.slug === SLUG) ?? null;
  const [lightbox, setLightbox] = useState<{ photos: CustomSectionPhoto[]; index: number } | null>(null);

  useEffect(() => {
    document.title = `${arVrStudio.heroTitle} | Vishnu Women's University`;
  }, []);

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
        title={`${arVrStudio.heroTitle} | Vishnu Women's University`}
        description={arVrStudio.heroSubtitle}
        canonicalPath={`/differentiators/${SLUG}`}
      />

      {/* Hero Section */}
      <section className="arvr-hero">
        {heroImage && (
          <SmoothImage
            src={heroImage}
            alt={arVrStudio.heroTitle}
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
            <span className="is-current">{arVrStudio.heroTitle}</span>
          </div>
          <span className="arvr-eyebrow">
            <Glasses size={14} strokeWidth={2.4} /> {arVrStudio.heroCategory}
          </span>
          <h1 className="arvr-hero__title">{arVrStudio.heroTitle}</h1>
          <p className="arvr-hero__subtitle">{renderBold(arVrStudio.heroSubtitle)}</p>
        </div>
      </section>

      {/* About Section */}
      <section className="arvr-section">
        <div className="arvr-container">
          <h2 className="arvr-section-title">{arVrStudio.aboutTitle}</h2>
          <div className="arvr-glass arvr-overview">
            <Quote size={28} strokeWidth={2} className="arvr-overview__mark" aria-hidden="true" />
            <div className="arvr-prose">
              {arVrStudio.aboutParagraphs.map((para, i) => (
                <p key={i} style={{ marginBottom: i < arVrStudio.aboutParagraphs.length - 1 ? '1rem' : 0 }}>
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
              <Target size={14} strokeWidth={2.4} /> {arVrStudio.visionTitle}
            </span>
            <div className="arvr-prose">
              <p>{arVrStudio.vision}</p>
            </div>
          </div>
          <div className="arvr-glass arvr-vm-card">
            <span className="arvr-card-eyebrow">
              <Sparkles size={14} strokeWidth={2.4} /> {arVrStudio.missionTitle}
            </span>
            <ul className="arvr-checklist">
              {arVrStudio.mission.map((itemText, i) => (
                <li key={i}>{renderBold(itemText)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container">
          <h2 className="arvr-section-title">{arVrStudio.objectivesTitle}</h2>
          <div className="arvr-objectives-grid">
            {arVrStudio.objectivesFormatted.map((obj) => (
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
          <h2 className="arvr-section-title">{arVrStudio.conceptExperience.title}</h2>
          <p style={{ color: 'var(--avr-text-dim)', marginBottom: '1.5rem', marginTop: '-0.5rem', fontSize: '1.05rem' }}>
            {renderBold(arVrStudio.conceptExperience.intro)}
          </p>
          <div className="arvr-other-grid">
            {arVrStudio.conceptExperience.cards.map((card, i) => (
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
          <h2 className="arvr-section-title">{arVrStudio.techInfrastructure.title}</h2>
          <div className="arvr-other-grid">
            {arVrStudio.techInfrastructure.groups.map((group, i) => (
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
              {arVrStudio.keyHighlights.map((hl, i) => (
                <li key={i}>{renderBold(hl)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="arvr-section" style={{ paddingTop: 0 }}>
        <div className="arvr-container">
          <h2 className="arvr-section-title">{arVrStudio.galleryTitle}</h2>
          <p style={{ color: 'var(--avr-text-dim)', marginBottom: '1.5rem', marginTop: '-0.5rem', fontSize: '1.05rem' }}>
            {renderBold(arVrStudio.galleryCaption)}
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
                {renderBold(arVrStudio.galleryCaption)}
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
              <Mail size={14} strokeWidth={2.4} /> {arVrStudio.contact.title}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div>
                <strong>{arVrStudio.contact.name}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--avr-text-dim)' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '0.2rem', color: 'var(--avr-cyan)' }} />
                <span>{arVrStudio.contact.address.join(', ')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--avr-text-dim)' }}>
                <Mail size={16} style={{ flexShrink: 0, color: 'var(--avr-cyan)' }} />
                <a href={`mailto:${arVrStudio.contact.email}`} style={{ color: 'var(--avr-cyan)' }}>
                  {arVrStudio.contact.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--avr-text-dim)' }}>
                <Phone size={16} style={{ flexShrink: 0, color: 'var(--avr-cyan)' }} />
                <a href={`tel:${arVrStudio.contact.phone}`} style={{ color: 'var(--avr-cyan)' }}>
                  {arVrStudio.contact.phone}
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
                {arVrStudio.facultyInCharge.name}
              </div>
              <div style={{ color: 'var(--avr-cyan)', fontWeight: 600, fontSize: '0.95rem' }}>
                {arVrStudio.facultyInCharge.designation}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--avr-text-dim)', fontSize: '0.9rem' }}>
                <Mail size={15} style={{ color: 'var(--avr-cyan)' }} />
                <a href={`mailto:${arVrStudio.facultyInCharge.email}`} style={{ color: 'var(--avr-cyan)' }}>
                  {arVrStudio.facultyInCharge.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--avr-text-dim)', fontSize: '0.9rem' }}>
                <Phone size={15} style={{ color: 'var(--avr-cyan)' }} />
                <span>{arVrStudio.facultyInCharge.mobile}</span>
              </div>
              <div style={{ color: 'var(--avr-text-dim)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                <strong>Areas of Interest:</strong> {arVrStudio.facultyInCharge.interests}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="arvr-cta">
        <div className="arvr-container" style={{ textAlign: 'center' }}>
          <h2 className="arvr-cta__title">{arVrStudio.cta.title}</h2>
          <p className="arvr-cta__text">{renderBold(arVrStudio.cta.subtitle)}</p>
          <div className="arvr-cta__actions">
            <Link to="/differentiators" className="btn btn-accent">
              {arVrStudio.cta.btn1}
            </Link>
            <Link to="/academics" className="btn btn-secondary">
              {arVrStudio.cta.btn2}
            </Link>
            <Link to="/apply-now" className="btn btn-secondary">
              {arVrStudio.cta.btn3}
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

