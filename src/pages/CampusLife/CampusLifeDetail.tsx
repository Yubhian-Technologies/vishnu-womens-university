import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CampusFacilitiesNav from '../Campus/CampusFacilitiesNav';
import CustomSectionsRenderer, { CustomSectionsPlain } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { hasCustomSectionContent } from '../../lib/customSections';
import { findCampusFacilityBySlug } from '../Campus/campusFacilities.data';
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

const NAV_OFFSET = 'calc(var(--topbar-height) + var(--header-height) + 1rem)';

// These two facility pages moved out of Campus Life's header nav and its
// "Quick Navigation" sidebar list (now linked from Academics > Information
// instead) — see campusFacilities.data.ts. They're still rendered by this
// same shared component (their URLs are unchanged), so the sidebar has to be
// suppressed here explicitly rather than just by removing them from the
// facilities array, or it'd keep showing on these two pages alone.
const RELOCATED_TO_ACADEMICS_SLUGS = ['smart-classrooms', 'state-of-the-art-labs'];

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
  const showQuickNav = !isActivity && !RELOCATED_TO_ACADEMICS_SLUGS.includes(slug);
  const facilityDefault = !isActivity ? findCampusFacilityBySlug(slug) : undefined;
  const activityDefault = isActivity ? ACTIVITY_DEFAULTS[slug] : undefined;

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER, alt: `${item?.title || slug} — Photo ${i + 1}`, caption: '',
  }));
  const photos = useSitePhotos('campus', slug, defaultPhotos);

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
      <PageHero
        page={heroPage}
        defaultTitle={title}
        defaultSubtitle={subtitle}
        breadcrumb={isActivity
          ? [{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: title }]
          : [{ label: 'Home', to: '/' }, { label: 'Campus Life', to: '/campus' }, { label: title }]}
      />

      {visibleTabs.length > 0 && activeTab ? (
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
            {showQuickNav ? (
              <div className="detail-grid">
                <div>
                  <CustomSectionsPlain sections={activeTab.sections} />
                </div>
                <div className="detail-sidebar">
                  <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)' }}>
                    <CampusFacilitiesNav activeSlug={slug} />
                  </div>
                </div>
              </div>
            ) : (
              <CustomSectionsPlain sections={activeTab.sections} />
            )}
          </div>
        </section>
      ) : !isActivity ? (
        <section className="section bg-white">
          <div className="container">
            {showQuickNav ? (
              <div className="detail-grid">
                <div>
                  <span className="section-label">Campus Life</span>
                  <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{title}</h2>
                  {visibleSections.length > 0 ? (
                    <div style={{ marginTop: 'var(--space-5)' }}>
                      <CustomSectionsPlain sections={visibleSections} />
                    </div>
                  ) : (
                    <p style={{ color: 'var(--color-text-light)' }}>Content for this page is coming soon.</p>
                  )}
                </div>
                <div className="detail-sidebar">
                  <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)' }}>
                    <CampusFacilitiesNav activeSlug={slug} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span className="section-label">Academics</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{title}</h2>
                {visibleSections.length > 0 ? (
                  <div style={{ marginTop: 'var(--space-5)' }}>
                    <CustomSectionsPlain sections={visibleSections} />
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-light)' }}>Content for this page is coming soon.</p>
                )}
              </div>
            )}
          </div>
        </section>
      ) : (
        <CustomSectionsRenderer sections={visibleSections} navOffset={NAV_OFFSET} />
      )}

      {!isActivity && photos.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid images={photos} label="" title={title} columns={3} layout="default" />
          </div>
        </section>
      )}

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
            {isActivity ? 'Explore More Student Activities' : 'Explore More of Campus Life'}
          </h2>
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
                <Link to="/campus" className="btn btn-accent">Back to Campus Life</Link>
                <Link to="/student-life" className="btn btn-secondary">Student Life</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
