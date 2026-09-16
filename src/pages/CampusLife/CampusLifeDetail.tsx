import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CustomSectionsRenderer, { CustomSectionsPlain } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos, useSitePhotosLoading } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { hasCustomSectionContent } from '../../lib/customSections';
import { findCampusFacilityBySlug } from '../Campus/campusFacilities.data';
import VwuSportsSection from '../../components/VwuSportsSection/VwuSportsSection';
import CampusEventsShowcase from '../../components/CampusEventsShowcase/CampusEventsShowcase';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import '../detail-layout.css';
import '../Campus/tabbed-section.css';

// Student Activities pages had no dedicated data file (content lived only
// in Page Content Blocks) — kept here just for a sensible hero default/CTA
// before an admin has entered anything; Hero Banners in /admin overrides
// title/subtitle exactly the same way it does for every other page.
const ACTIVITY_DEFAULTS: Record<string, { title: string; subtitle: string }> = {
  'vishnu-tv-academy': { title: 'Vishnu TV Academy', subtitle: 'Student-run and student-driven — the only dedicated campus TV Academy in Andhra Pradesh.' },
  'arts-culture': { title: 'Arts & Culture', subtitle: 'Nurturing creativity, preserving heritage, and building a sense of belonging — developing responsible and culturally grounded leaders.' },
  'sports-games': { title: 'Sports & Games', subtitle: 'Building Strength, Skill, Teamwork, and Sporting Spirit.' },
  'social-services': { title: 'Social Services', subtitle: 'The National Service Scheme at VWU shapes engineers who are equally committed to their craft and to the communities they serve.' },
  'campus-magazines': { title: 'Campus Magazines', subtitle: 'Three publications that document academic achievements, student creativity, and the story of campus life at VWU and across SVES.' },
};
const ACTIVITY_SLUGS = Object.keys(ACTIVITY_DEFAULTS);
const ACTIVITY_LABELS: Record<string, string> = {
  'vishnu-tv-academy': 'Vishnu TV Academy', 'arts-culture': 'Arts & Culture', 'sports-games': 'Sports & Games',
  'social-services': 'Social Services', 'campus-magazines': 'Campus Magazines',
};

// Whichever slug the admin currently has this page saved under (it's been
// renamed once already while being set up) gets the CampusEventsShowcase
// treatment below — matching both rather than one exact string means a
// future rename between these two doesn't silently drop back to the plain
// placeholder-text view.
const EVENTS_SHOWCASE_SLUGS = new Set(['event', 'events']);

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

// Swimming Pool — hardcoded rather than the admin-entered CustomSections
// content, which had every heading ("Pool at a Glance", "Facilities &
// Support") typed as a plain line inside one flat List block, so each one
// rendered as its own bullet item instead of a heading over its group. Fixed
// here directly since restructuring the CMS record wasn't an option this
// time; the tradeoff is this section is no longer editable from
// Admin -> Campus Life for this page.
const SWIMMING_POOL_FACILITIES: { title: string; desc: string }[] = [
  { title: 'Six-Lane Swimming Pool', desc: 'The 80 ft × 40 ft pool provides dedicated lanes for structured practice, fitness swimming and recreational use.' },
  { title: 'Professional Coaching', desc: 'Experienced coaching support helps students develop swimming techniques across the major strokes while building confidence, endurance and water skills.' },
  { title: 'Water Quality & Maintenance', desc: 'Modern circulation and purification systems support regular water maintenance and help provide a clean swimming environment.' },
  { title: 'Safety Facilities', desc: 'The pool area is equipped with essential lifesaving and poolside safety equipment to support safe aquatic activity.' },
  { title: 'Poolside Amenities', desc: 'The surrounding poolside area provides space for students to prepare, relax and spend time between swimming sessions.' },
  { title: 'Nearby Refreshments', desc: 'A refreshment facility located close to the pool offers students convenient access to food and beverages before or after their activities.' },
];

function SwimmingPoolContent() {
  return (
    <div>
      <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-light)', margin: '0 0 var(--space-4)' }}>
        Train. Stay Active. Recharge.
      </p>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, margin: '0 0 var(--space-8)' }}>
        The swimming pool at Vishnu Women&rsquo;s University provides students with a dedicated space for aquatic training, fitness and recreation. Located near the Sports Complex, the facility supports both beginners and experienced swimmers while encouraging swimming as part of an active and balanced campus lifestyle.
      </p>

      <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>Pool at a Glance</h3>
      <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-8)' }}>
        80 ft × 40 ft swimming pool &nbsp;|&nbsp; Six lanes &nbsp;|&nbsp; Coaching support &nbsp;|&nbsp; Water circulation and purification systems
      </p>

      <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: 'var(--space-5)' }}>Facilities & Support</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
        {SWIMMING_POOL_FACILITIES.map((f) => (
          <div key={f.title} style={{ padding: 'var(--space-5)', background: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
            <strong style={{ display: 'block', fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)', color: 'var(--color-heading)' }}>{f.title}</strong>
            <span style={{ color: 'var(--color-text-light)', lineHeight: 1.6, display: 'block' }}>{f.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--color-off-white)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>Supporting an Active Campus Lifestyle</h3>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text)', lineHeight: 1.7, fontStyle: 'italic' }}>
          The swimming pool forms part of the University&rsquo;s wider sports and wellness infrastructure, giving students another opportunity to stay active, develop new skills and make recreation part of everyday campus life.
        </p>
      </div>
    </div>
  );
}

/**
 * One shared detail page for every admin-managed Campus Life page — the 16
 * facility pages under /campus/:slug (some as a single scrolling page of
 * sections, a few — Central Library, Campus Hostels, Other Facilities — as
 * the same horizontal-tab layout they always had) and the 5 Student
 * Activities pages (Vishnu TV Academy, Arts & Culture, Sports & Games,
 * Social Services, Campus Magazines). Content comes from the
 * `campusLifeItems` Firestore collection, edited via /admin → Campus Life.
 * Student Clubs and Radio Vishnu are NOT here — they keep their own
 * existing dedicated pages/admin sections.
 */
export default function CampusLifeDetail({ slug: slugProp }: { slug?: string }) {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const slug = slugProp ?? slugParam ?? '';
  const { docs: items, loading } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const item = items.find((i) => i.slug === slug);

  const visibleTabs = (item?.tabs || []).filter((t) => t.sections.some(hasCustomSectionContent));
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const activeTab = visibleTabs.find((t) => t.id === activeTabId) ?? visibleTabs[0];

  const isActivity = ACTIVITY_SLUGS.includes(slug);
  const facilityDefault = !isActivity ? findCampusFacilityBySlug(slug) : undefined;
  const activityDefault = isActivity ? ACTIVITY_DEFAULTS[slug] : undefined;

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER, alt: `${item?.title || slug} — Photo ${i + 1}`, caption: '',
  }));
  const photos = useSitePhotos('campus', slug, defaultPhotos);
  // Gates the photo grid's first paint: until Firestore actually responds,
  // an admin-uploaded photo can't be told apart from "none uploaded yet",
  // so rendering immediately would flash the generic default photo before
  // swapping to the real one a moment later on every page load/refresh.
  // Shares useSitePhotos' subscription (not a separate listener) so this
  // resolves at the exact same moment as `photos` itself.
  const photosLoading = useSitePhotosLoading();

  useEffect(() => {
    if (item) document.title = `${item.title} | VWU`;
  }, [item]);

  if (!loading && !item) return <Navigate to={isActivity ? '/student-life' : '/campus'} replace />;
  if (!item) return null;

  const title = item.title || facilityDefault?.title || activityDefault?.title || slug;
  const subtitle = facilityDefault?.heroSubtitle ?? facilityDefault?.desc ?? activityDefault?.subtitle;
  const heroPage = isActivity ? slug : `campus-${slug}`;
  const visibleSections = (item.customSections || []).filter(hasCustomSectionContent);

  return (
    <main className="page-wrapper">
      {!EVENTS_SHOWCASE_SLUGS.has(slug) && (
        <PageHero
          page={heroPage}
          defaultTitle={title}
          defaultSubtitle={subtitle}
          breadcrumb={isActivity
            ? [{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: title }]
            : [{ label: 'Home', to: '/' }, { label: 'Campus Life', to: '/campus' }, { label: title }]}
          hideCta={true}
        />
      )}

      {EVENTS_SHOWCASE_SLUGS.has(slug) ? (
        <CampusEventsShowcase sourceItem={item} />
      ) : visibleTabs.length > 0 && activeTab ? (
        <section className="section bg-white">
          <div className="container">
            <div className="section-tabs">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`section-tab-btn${activeTab.id === tab.id ? ' active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <CustomSectionsPlain sections={activeTab.sections} />
          </div>
        </section>
      ) : !isActivity ? (
        <section className="section bg-white">
          <div className="container">
            <div>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{title}</h2>
              {slug === 'swimming-pool' ? (
                <div style={{ marginTop: 'var(--space-5)' }}>
                  <SwimmingPoolContent />
                </div>
              ) : visibleSections.length > 0 ? (
                <div style={{ marginTop: 'var(--space-5)' }}>
                  <CustomSectionsPlain sections={visibleSections} />
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-light)' }}>Content for this page is coming soon.</p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <CustomSectionsRenderer sections={visibleSections} navOffset={NAV_OFFSET} />
      )}

      {/* "Sports & Games at VWU" — relocated here from /student-life. */}
      {slug === 'sports-games' && <VwuSportsSection />}

      {!isActivity && !EVENTS_SHOWCASE_SLUGS.has(slug) && !photosLoading && photos.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={photos}
              label={slug === 'other-facilities' ? 'Campus Facilities Gallery' : ''}
              title={slug === 'other-facilities' ? 'Explore the Spaces That Support Campus Life' : title}
              subtitle={slug === 'other-facilities' ? 'Take a closer look at the infrastructure, services, learning spaces, and shared facilities across Vishnu Women’s University.' : undefined}
              galleryLinkText={slug === 'other-facilities' ? 'View Full Gallery' : undefined}
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* The Events showcase already has its own "Explore More of Campus
          Life" closing band (see .ces-close in CampusEventsShowcase.tsx) —
          this generic one would otherwise duplicate it directly underneath. */}
      {!EVENTS_SHOWCASE_SLUGS.has(slug) && (
        <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-white)', marginBottom: slug === 'campus-book-stores' ? 'var(--space-2)' : 'var(--space-4)' }}>
              {slug === 'campus-book-stores' ? 'Explore More Campus Facilities' : slug === 'swimming-pool' ? 'Dive into More of Campus Life' : (isActivity ? 'Explore More Student Activities' : 'Explore More of Campus Life')}
            </h2>
            {slug === 'campus-book-stores' && (
              <p style={{ color: 'var(--color-white)', fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
                Discover the spaces and services that support learning and everyday student life at Vishnu Women's University.
              </p>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {isActivity ? (
                <>
                  <Link to="/student-clubs" className="btn btn-accent">Student Clubs</Link>
                  {ACTIVITY_SLUGS.filter((s) => s !== slug).slice(0, 2).map((s) => (
                    <Link key={s} to={`/${s}`} className="btn btn-secondary">{ACTIVITY_LABELS[s]}</Link>
                  ))}
                </>
              ) : (
                <>
                  <Link to="/campus" className="btn btn-accent">
                    {slug === 'campus-book-stores' ? 'Explore Campus Facilities' : slug === 'swimming-pool' ? 'Back to Campus Life →' : 'Back to Campus Life'}
                  </Link>
                  {slug === 'swimming-pool' ? (
                    <Link to="/campus/sports" className="btn btn-secondary">Explore Fitness & Sports →</Link>
                  ) : (
                    <Link to="/student-life" className="btn btn-secondary">{slug === 'campus-book-stores' ? 'Discover Student Life' : 'Student Life'}</Link>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
