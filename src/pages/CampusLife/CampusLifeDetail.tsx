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
  'arts-culture': { title: 'Arts, Culture & Campus Life at Vishnu Women’s University', subtitle: 'Learning, creativity and community beyond the classroom' },
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
              {visibleSections.length > 0 ? (
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
            <PhotoGrid images={photos} label="" title={title} subtitle={slug === 'campus-security' ? 'Campus Security in Action' : undefined} columns={3} layout="default" />
          </div>
        </section>
      )}

      {/* The Events showcase already has its own "Explore More of Campus
          Life" closing band (see .ces-close in CampusEventsShowcase.tsx) —
          this generic one would otherwise duplicate it directly underneath. */}
      {!EVENTS_SHOWCASE_SLUGS.has(slug) && (
        <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-white)', marginBottom: slug === 'campus-book-stores' || slug === 'campus-security' ? 'var(--space-2)' : 'var(--space-4)' }}>
              {slug === 'campus-book-stores' ? 'Explore More Campus Facilities' : (slug === 'swimming-pool' ? 'Dive into More of Campus Life' : (isActivity ? 'Explore More Student Activities' : 'Explore More of Campus Life'))}
            </h2>
            {slug === 'campus-book-stores' && (
              <p style={{ color: 'var(--color-white)', fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
                Discover the spaces and services that support learning and everyday student life at Vishnu Women's University.
              </p>
            )}
            {slug === 'campus-security' && (
              <p style={{ color: 'var(--color-white)', fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
                Discover the facilities, experiences, and support systems that make student life at Vishnu Women's University enriching and engaging.
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
                  <Link to="/campus" className="btn btn-accent">{slug === 'campus-book-stores' ? 'Explore Campus Facilities' : (slug === 'swimming-pool' ? 'Back to Campus Life →' : (slug === 'campus-security' ? 'Explore Campus Life →' : 'Back to Campus Life'))}</Link>
                  <Link to={slug === 'swimming-pool' ? '/campus/sports' : '/student-life'} className="btn btn-secondary">{slug === 'campus-book-stores' ? 'Discover Student Life' : (slug === 'swimming-pool' ? 'Explore Fitness & Sports →' : (slug === 'campus-security' ? 'Discover Student Life →' : 'Student Life'))}</Link>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
