import { useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Sparkles, Palette, Music, Camera, PartyPopper, ArrowRight, Drama, X } from 'lucide-react';
import { parseFlexibleTable } from '../../lib/structuredTable';
import { smoothScrollTo } from '../../lib/smoothScroll';
import type { CampusLifeItemDoc } from '../../pages/Admin/sections/CampusLifeAdmin';
import type { CustomSection } from '../../lib/customSections';
import { SECTION_ACCENT_COLORS, findSectionAccentColor } from '../../lib/sectionAccentColors';
import { usePageBanners } from '../../hooks/usePageBanners';
import './CampusEventsShowcase.css';

// Fixed page chrome (not read from any admin field) — the reference
// design's 4-category strip under the page's first section. Purely
// decorative/labelling, same treatment as the hero's own hardcoded eyebrow
// and tagline copy just above.
const CULTURAL_CATEGORIES: { label: string; sub: string; Icon: typeof Sparkles }[] = [
  {
    label: 'Festival Celebrations',
    sub: 'Celebrating every Indian festival with genuine enthusiasm and unity.',
    Icon: PartyPopper,
  },
  {
    label: 'Artistic Development',
    sub: 'Guidance and access to painting, photography, music, and craft facilities.',
    Icon: Palette,
  },
  {
    label: 'Performing Arts',
    sub: 'Dance, drama, and music thrive through dedicated clubs and events.',
    Icon: Drama,
  },
  {
    label: 'Photography & Film',
    sub: 'Flash It Out Club and Vishnu TV Academy fuel creative storytelling.',
    Icon: Camera,
  },
];

const ICON_BY_KEYWORD: { match: string; Icon: typeof Sparkles }[] = [
  { match: 'festival', Icon: PartyPopper },
  { match: 'artistic', Icon: Palette },
  { match: 'performing', Icon: Music },
  { match: 'photograph', Icon: Camera },
];

function iconFor(title: string) {
  const hit = ICON_BY_KEYWORD.find((i) => title.toLowerCase().includes(i.match));
  return hit?.Icon ?? Sparkles;
}

// A third column is optional — e.g. a date/venue line an admin can add per
// row — used only if the table actually has one; a plain "Title |
// Description" table still works exactly as before.
function tableRows(tableText: string | undefined): { title: string; desc: string; meta?: string }[] {
  const parsed = parseFlexibleTable(tableText || '');
  const rows = parsed[0]?.rows || [];
  return rows.map(([title = '', desc = '', meta]) => ({ title, desc, meta: meta?.trim() || undefined }));
}

function sectionPhotoUrls(section: CustomSection): { url: string; caption?: string }[] {
  return (section.galleryPhotos || [])
    .filter((p) => p.imageUrl)
    .map((p) => ({ url: p.imageUrl, caption: p.caption }));
}

// Every section gets its own accent colour — either explicitly pinned by an
// admin (section.accentColor, set via the swatch picker in
// CustomSectionEditor.tsx) or, when left on "Auto", cycled through
// SECTION_ACCENT_COLORS by position. Applied by overriding the same
// --ces-amber/--ces-amber-deep custom properties every existing rule
// already reads (eyebrows, buttons, badges, sparkles, dots, card icons), so
// one inline style per section is enough to recolour everything in it
// consistently, with no separate colour logic duplicated per element.
function paletteStyle(section: CustomSection, index: number): CSSProperties {
  const c = findSectionAccentColor(section.accentColor) ?? SECTION_ACCENT_COLORS[index % SECTION_ACCENT_COLORS.length];
  return { '--ces-amber': c.accent, '--ces-amber-deep': c.deep, '--ces-on-amber': c.onAccent } as CSSProperties;
}

// A section's own photos as a continuously self-scrolling strip — rounded
// photo tiles with their caption as a bold label overlay, drifting sideways
// on a pure-CSS marquee animation (no click arrows/dots, no JS timer to get
// stuck paused) so the photos are always visibly moving on their own. Used
// for a plain (non-Table) section's photo block instead of a single long
// static grid. Pausing only happens on hover (CSS-only, via
// `animation-play-state`), so a viewer can still stop to read a caption.
// Four or fewer photos aren't worth animating (nothing to reveal by
// scrolling), so those render as a plain static row instead.
const MARQUEE_MIN_PHOTOS = 5;
const MARQUEE_SECONDS_PER_PHOTO = 3.5;
function PhotoCarousel({ photos, altPrefix }: { photos: { url: string; caption?: string }[]; altPrefix: string }) {
  if (photos.length < MARQUEE_MIN_PHOTOS) {
    return (
      <div className="ces-carousel-static">
        {photos.map((p) => (
          <div key={p.url} className="ces-rich-photo">
            <img src={p.url} alt={p.caption || altPrefix} loading="lazy" />
            {p.caption && <span className="ces-rich-photo-caption">{p.caption}</span>}
          </div>
        ))}
      </div>
    );
  }

  const duration = photos.length * MARQUEE_SECONDS_PER_PHOTO;
  // The track is the photo list duplicated back-to-back; animating it from
  // translateX(0) to translateX(-50%) — exactly one copy's width — loops
  // seamlessly with no visible jump or reset.
  return (
    <div className="ces-carousel" style={{ '--ces-marquee-duration': `${duration}s` } as CSSProperties}>
      <div className="ces-carousel-track">
        {[...photos, ...photos].map((p, i) => (
          <div key={`${p.url}-${i}`} className="ces-rich-photo" aria-hidden={i >= photos.length}>
            <img src={p.url} alt={p.caption || altPrefix} loading="lazy" />
            {p.caption && <span className="ces-rich-photo-caption">{p.caption}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Full-screen click-to-enlarge view for a photo set, with prev/next when
// there's more than one — shared by PhotoGridShowMore ("Gallery" and every
// other trailing photo grid) and PhotoFan ("Cultural Initiatives") below.
function CesLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: { url: string; caption?: string }[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  // Rendered into document.body via a portal rather than in place — this
  // page nests it several levels deep (inside .ces-fan, .ces-section-photos,
  // etc.), and if any ancestor along the way ever picks up a transform or
  // similar (e.g. a scroll-reveal animation), a plain `position: fixed`
  // here would stop covering the real viewport and instead get boxed into
  // that ancestor's own bounds. A portal sidesteps that entirely.
  return createPortal(
    <div className="ces-lightbox" onClick={onClose}>
      <button type="button" className="ces-lightbox-close" onClick={onClose} aria-label="Close">
        <X size={20} strokeWidth={2} />
      </button>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="ces-lightbox-arrow ces-lightbox-arrow--prev"
            onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + photos.length) % photos.length); }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            className="ces-lightbox-arrow ces-lightbox-arrow--next"
            onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % photos.length); }}
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}
      <div className="ces-lightbox-body" onClick={(e) => e.stopPropagation()}>
        <img src={photos[index].url} alt={photos[index].caption || ''} />
        {photos[index].caption && <p>{photos[index].caption}</p>}
      </div>
    </div>,
    document.body,
  );
}

// A section's own photos as a static grid, capped to a first batch with a
// "Show More" button revealing the rest — used for every OTHER photo block
// on this page (the trailing photo grid under a Table section's card grid/
// event list, and the "Gallery" section specifically) instead of an
// auto-advancing carousel, so only the dedicated showcase carousel above
// auto-scrolls. `initial` defaults to SHOW_MORE_INITIAL but the "Gallery"
// section is deliberately capped tighter (4) per an explicit design request.
// `variant="polaroid"` (Gallery only) gives each tile a white-bordered,
// alternating-tilt look instead of a plain boxed thumbnail — purely
// cosmetic, the show/hide-more behaviour underneath is identical either way.
const SHOW_MORE_INITIAL = 6;
function PhotoGridShowMore({
  photos,
  altPrefix,
  initial = SHOW_MORE_INITIAL,
  variant,
}: {
  photos: { url: string; caption?: string }[];
  altPrefix: string;
  initial?: number;
  variant?: 'polaroid';
}) {
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const visible = expanded ? photos : photos.slice(0, initial);
  const hasMore = photos.length > initial;

  return (
    <div>
      <div className={`ces-section-photos${variant ? ` ces-section-photos--${variant}` : ''}`}>
        {visible.map((p, i) => (
          <figure
            key={p.url}
            className={`ces-section-photo${variant ? ` ces-section-photo--${variant}` : ''}${
              variant && i % 2 === 1 ? ' ces-section-photo--alt' : ''
            }`}
            onClick={() => setLightbox(i)}
          >
            <img src={p.url} alt={p.caption || altPrefix} loading="lazy" />
            {p.caption && <figcaption>{p.caption}</figcaption>}
          </figure>
        ))}
      </div>
      {hasMore && (
        <button type="button" className="ces-show-more" onClick={() => setExpanded((e) => !e)}>
          {expanded ? 'Show Less' : `Show More (${photos.length - initial} more)`}
        </button>
      )}
      {lightbox !== null && (
        <CesLightbox photos={visible} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />
      )}
    </div>
  );
}

// Up to 4 photos side by side in a plain row — a fixed decorative strip
// (not a full gallery; that's what the "Gallery" section/PhotoGridShowMore
// above is for) shown beside a section's intro copy, matching the reference
// design's "Cultural Initiatives" layout. Purely presentational: no click
// behaviour, and it always shows the same first-4 photos rather than
// rotating, since its job is a static bit of visual texture, not browsing.
function PhotoFan({ photos, altPrefix }: { photos: { url: string; caption?: string }[]; altPrefix: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const shown = photos.slice(0, 4);
  return (
    <div className="ces-fan">
      {shown.map((p, i) => (
        <div key={p.url} className={`ces-fan-photo ces-fan-photo-${i}`} onClick={() => setLightbox(i)}>
          <img src={p.url} alt={p.caption || altPrefix} loading="lazy" />
        </div>
      ))}
      {lightbox !== null && (
        <CesLightbox photos={shown} index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />
      )}
    </div>
  );
}

/**
 * The "Event"/"Events" Campus Life page's own bespoke look — per an explicit
 * design request, intentionally its own amber/near-black theme rather than
 * the rest of the site's navy/gold, scoped entirely to `.ces-page` below via
 * its own CSS custom properties so nothing here leaks into any other page's
 * colours.
 *
 * Fully dynamic and self-contained: everything below is read straight off
 * this page's own `customSections` (edited the normal way, via Admin ->
 * Campus Life -> this page's Sections editor) — no other page's content is
 * read or altered. Every section renders as its own block, in the order an
 * admin put them in, under its OWN label — e.g. a section named "Cultural
 * Initiatives" always shows its own photos and content right under that
 * exact heading, never pooled with any other section's.
 *
 * A Table-type section gets one of two card treatments based on its
 * position among *other Table sections* (not its label text, so renaming a
 * section never changes its layout): the first Table section on the page
 * renders as a light photo-card grid ("Cultural Initiatives" in the
 * reference design); every Table section after that renders as the dark
 * tagline-led band with a card list ("Our Annual Celebrations" in the
 * reference) — so adding a second Table section (named whatever an admin
 * likes) automatically gets that look. Its rows can optionally carry a
 * third "Title | Description | Date/venue" column, shown as a small badge
 * on each card when present — no fabricated dates are ever shown when that
 * column is left out. Any non-Table section renders as a plain heading +
 * paragraph + its own photo grid, each photo with its caption, alternating
 * light/dark purely for rhythm. The hero always renders (even with nothing
 * added yet) so the page has a real look from day one, using the very first
 * photo found across every section as its backdrop; every number in the
 * stat bar is counted directly from whatever's actually there, never an
 * invented figure.
 */
export default function CampusEventsShowcase({ sourceItem }: { sourceItem: CampusLifeItemDoc | undefined }) {
  const allSections = sourceItem?.customSections || [];
  const visibleSections = allSections.filter((s) => {
    const hasText = s.contentType === 'text' && !!s.textContent?.trim();
    const hasTable = s.contentType === 'table' && tableRows(s.tableText).length > 0;
    const hasPhotos = sectionPhotoUrls(s).length > 0;
    return hasText || hasTable || hasPhotos;
  });

  const allPhotos = allSections.flatMap(sectionPhotoUrls);
  // The hero backdrop is this page's OWN dedicated Hero Banner (Admin ->
  // Hero Banners -> "Campus Life: Events") if one has been set there, else
  // this page's own first uploaded photo. `allPhotos` comes from a
  // SEPARATE Firestore read (the campusLifeItems doc, loaded by the parent
  // CampusLifeDetail) with its own independent timing from the banner
  // listener below — falling back to it unconditionally meant that on a
  // page load where the item doc happened to resolve first, its photo
  // would flash in as the hero, then get replaced the moment the banner
  // listener caught up moments later. Waiting for the banner listener to
  // finish loading before ever falling back removes that race: nothing
  // shows until we actually know whether a dedicated banner exists.
  const { slides: eventsBannerSlides, loading: eventsBannerLoading } = usePageBanners('campus-events');
  const heroImage = eventsBannerSlides[0]?.imageUrl || (!eventsBannerLoading ? allPhotos[0]?.url : undefined);

  return (
    <div className="ces-page">
      {/* ── Hero — always shown, even before any content is added ───────── */}
      <section className="ces-hero">
        {heroImage && (
          // A real <img> (fetchPriority="high") instead of a CSS
          // background-image — this is the page's biggest, most-visible
          // photo, and a background-image gets no fetch priority of its
          // own, so it can sit queued behind other page requests (fonts,
          // other photos) even though it's the most important thing to
          // paint first. This hints the browser to fetch it immediately.
          <img src={heroImage} alt="" className="ces-hero-bg" fetchPriority="high" decoding="async" />
        )}
        <div className="container ces-hero-inner">
          <div className="ces-hero-copy">
            <span className="ces-eyebrow">— Campus Life · Arts and Culture</span>
            <h1 className="ces-hero-title">
              Where <span>Campus</span><br />Comes Alive
            </h1>
            <p className="ces-hero-script">Where every event tells a story</p>
            <p className="ces-hero-desc">
              From cultural festivals to annual celebrations, VWU's campus events bring students together
              to create, perform, and celebrate as one community.
            </p>
            {visibleSections.length > 0 && (
              <div className="ces-hero-actions">
                <button type="button" className="ces-btn ces-btn--solid" onClick={() => smoothScrollTo('#ces-sections')}>
                  Explore Arts and Culture <ArrowRight size={16} strokeWidth={2.25} />
                </button>
              </div>
            )}
          </div>
          <div className="ces-hero-tagline" aria-hidden="true">
            Every Event.<br />One Community.
          </div>
        </div>
      </section>

      {/* ── Every section, in order, under its own heading ───────────────── */}
      <div id="ces-sections">
        {(() => {
          let tableSectionCount = 0;
          let otherSectionCount = 0;
          return visibleSections.map((section, sectionIndex) => {
            const photos = sectionPhotoUrls(section);
            const colorVars = paletteStyle(section, sectionIndex);

            if (section.contentType === 'table') {
              const rows = tableRows(section.tableText);
              const tableIndex = tableSectionCount++;

              // First Table section — light photo-card grid.
              if (tableIndex === 0) {
                return (
                  <section key={section.id} className="ces-section ces-section--light" style={colorVars}>
                    <div className="container">
                      <div className="ces-section-head">
                        <div>
                          <span className="ces-eyebrow ces-eyebrow--dark">— {section.label}</span>
                          <h2 className="ces-section-title">{section.label}</h2>
                          {section.subtitle && <p className="ces-close-desc">{section.subtitle}</p>}
                        </div>
                      </div>
                      {rows.length > 0 && (
                        <div className="ces-initiative-grid">
                          {rows.map((card, ci) => {
                            const Icon = iconFor(card.title);
                            const bg = photos.length > 0 ? photos[ci % photos.length].url : undefined;
                            return (
                              <div
                                key={card.title}
                                className={`ces-initiative-card${bg ? ' ces-initiative-card--photo' : ''}`}
                                style={bg ? { backgroundImage: `url(${bg})` } : undefined}
                              >
                                {!bg && <Icon size={28} strokeWidth={1.75} className="ces-initiative-icon" />}
                                <div className="ces-initiative-card-foot">
                                  <h3>{card.title}</h3>
                                  <span className="ces-arrow-btn"><ArrowRight size={14} strokeWidth={2.5} /></span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {photos.length > 0 && <PhotoGridShowMore photos={photos} altPrefix={section.label} />}
                    </div>
                  </section>
                );
              }

              // Every Table section after the first — dark tagline-led band
              // with a card list, matching "Our Annual Celebrations" in the
              // reference design, regardless of what this section is named.
              // A blurred/dimmed version of the section's first photo backs
              // the whole band; each card gets its OWN photo (cycled from
              // the same set) as its tile background, matching the
              // reference's vivid photo cards rather than a flat translucent
              // box — falls back to a plain icon-badge card if no photos
              // have been added to this section at all.
              const bandBg = photos[0]?.url;
              return (
                <section
                  key={section.id}
                  className="ces-events"
                  style={bandBg ? { ...colorVars, backgroundImage: `url(${bandBg})` } : colorVars}
                >
                  <div className="container ces-events-grid">
                    <div className="ces-events-lead">
                      <span className="ces-script">{section.label}</span>
                    </div>
                    <div className="ces-events-main">
                      <div className="ces-section-head">
                        <div>
                          <span className="ces-eyebrow">— {section.label}</span>
                          <h2 className="ces-section-title ces-section-title--light">{section.label}</h2>
                          {section.subtitle && <p className="ces-events-sub">{section.subtitle}</p>}
                        </div>
                      </div>
                      {rows.length > 0 && (
                        <div className="ces-event-list">
                          {rows.map((card, ci) => {
                            const cardBg = photos.length > 0 ? photos[ci % photos.length].url : undefined;
                            return (
                              <div
                                key={card.title}
                                className={`ces-event-card${cardBg ? ' ces-event-card--photo' : ''}`}
                                style={cardBg ? { backgroundImage: `url(${cardBg})` } : undefined}
                              >
                                {card.meta ? (
                                  <span className="ces-event-date-badge">{card.meta}</span>
                                ) : !cardBg && (
                                  <span className="ces-event-badge"><PartyPopper size={20} strokeWidth={2} /></span>
                                )}
                                <div className="ces-event-card-body">
                                  <h3>{card.title}</h3>
                                  <p>{card.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {photos.length > 0 && <PhotoGridShowMore photos={photos} altPrefix={section.label} />}
                    </div>
                  </div>
                </section>
              );
            }

            // Position among *other generic (non-Table) sections* decides the
            // layout — never the label text, so renaming a section never
            // changes its look. The first one gets the light "Cultural
            // Initiatives" intro treatment (copy beside a small side-by-side
            // photo strip); every one after that alternates the dark
            // "Annual Celebrations" band (copy beside the auto-scrolling
            // photo strip) and a light "Gallery" band (copy beside a
            // polaroid-style photo row) — exactly reproducing the
            // light/dark/light rhythm of the reference design for the
            // page's current 3 sections, and staying sensible if an admin
            // adds a 4th or 5th.
            const genericIndex = otherSectionCount++;
            const isFirstGeneric = genericIndex === 0;
            const isDark = !isFirstGeneric && genericIndex % 2 === 1;
            const isGalleryLabel = section.label.trim().toLowerCase() === 'gallery';

            const copy = (
              <div>
                <h2 className={`ces-section-title${isDark ? ' ces-section-title--light' : ''}`}>{section.label}</h2>
                {section.subtitle && <p className={isDark ? 'ces-events-sub' : 'ces-close-desc'}>{section.subtitle}</p>}
                {section.textContent?.trim() && (
                  <p className={isDark ? 'ces-events-sub' : 'ces-close-desc'} style={{ whiteSpace: 'pre-line' }}>
                    {section.textContent}
                  </p>
                )}
              </div>
            );

            if (isFirstGeneric) {
              return (
                <section key={section.id} className="ces-section ces-section--light" style={colorVars}>
                  <div className="container">
                    <div className="ces-intro-grid">
                      <div>
                        {copy}
                        <div className="ces-category-row">
                          {CULTURAL_CATEGORIES.map(({ label, sub, Icon }) => (
                            <div key={label} className="ces-category">
                              <span className="ces-category-icon"><Icon size={22} strokeWidth={1.75} /></span>
                              <h4>{label}</h4>
                              <p>{sub}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {photos.length > 0 && (
                        <div className="ces-intro-collage">
                          <PhotoFan photos={photos} altPrefix={section.label} />
                          <p className="ces-quote">
                            “Art has the power to<br />transform, connect<br />and inspire.”
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );
            }

            if (isDark) {
              // The section's own first photo becomes a dimmed, full-bleed
              // backdrop (like the crowd/lights photo behind the reference
              // design's dark band) instead of a flat colour fill — falls
              // back to the plain accent gradient when no photo is set yet.
              const bandBg = photos[0]?.url;
              return (
                <section
                  key={section.id}
                  className="ces-section ces-section--dark ces-section--photos"
                  style={bandBg ? { ...colorVars, backgroundImage: `url(${bandBg})` } : colorVars}
                >
                  <div className="container ces-celebrate-grid">
                    <div>
                      {copy}
                      <Link to="/events" className="ces-btn ces-btn--solid" style={{ marginTop: 'var(--space-5)' }}>
                        View All Events <ArrowRight size={16} strokeWidth={2.25} />
                      </Link>
                    </div>
                    <div>{photos.length > 0 && <PhotoCarousel photos={photos} altPrefix={section.label} />}</div>
                  </div>
                </section>
              );
            }

            return (
              <section key={section.id} className="ces-section ces-section--light ces-section--photos" style={colorVars}>
                <div className="container ces-gallery-grid">
                  <div>
                    {copy}
                    {isGalleryLabel && (
                      <Link to="/news-awards/gallery" className="ces-btn ces-btn--dark" style={{ marginTop: 'var(--space-5)' }}>
                        View Gallery <ArrowRight size={16} strokeWidth={2.25} />
                      </Link>
                    )}
                  </div>
                  <div>
                    {photos.length > 0 && (
                      isGalleryLabel ? (
                        <PhotoGridShowMore photos={photos} altPrefix={section.label} initial={4} variant="polaroid" />
                      ) : (
                        <PhotoCarousel photos={photos} altPrefix={section.label} />
                      )
                    )}
                  </div>
                </div>
              </section>
            );
          });
        })()}
      </div>
    </div>
  );
}
