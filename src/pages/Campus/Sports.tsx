import { useEffect, useState, useRef, useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Activity } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { useDocument } from '../../hooks/useDocument';
import {
  SPORTS_HERO_DEFAULTS, resolveSportsPalette, resolveSectionPalette, sectionHasSolidBg, resolveSectionOpacity, contrastTextColor,
  type SportsCategoryDoc, type SportsTournamentDoc, type SportsAchievementDoc, type SportsFacilityDoc,
  type SportsPageSettingsDoc, type SportsPalette,
} from '../../lib/sportsPage';
import './Sports.css';

type CategoryItem = WithId & SportsCategoryDoc;
type TournamentItem = WithId & SportsTournamentDoc;
type AchievementItem = WithId & SportsAchievementDoc;
type FacilityItem = WithId & SportsFacilityDoc;

function Section({ visible, children }: { visible: boolean; children: ReactNode }) {
  if (!visible) return null;
  return <>{children}</>;
}

function paletteVarsFor(palette: SportsPalette, opacity = 100, isSolid = false): CSSProperties {
  return {
    '--color-primary': palette.primary,
    '--color-primary-dark': palette.primaryDark,
    '--color-accent': palette.accent,
    '--section-bg-opacity': `${opacity}%`,
    ...(isSolid ? { '--section-text-color': contrastTextColor(palette.primary), '--section-text-shadow': 'none' } : {}),
  } as CSSProperties;
}

const ACHIEVEMENTS_PREVIEW_COUNT = 6;

const RING_CLASSES = [
  'sports-circle-card--gold',
  'sports-circle-card--pink',
  'sports-circle-card--orange',
  'sports-circle-card--cyan',
  'sports-circle-card--purple',
];

function SportsCategorySlider({ sports }: { sports: CategoryItem[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items if needed so full-width edge-to-edge carousel has plenty of cards across wide displays
  const displaySports = useMemo(() => {
    if (sports.length === 0) return [];
    if (sports.length < 8) {
      return [...sports, ...sports, ...sports].map((item, i) => ({
        ...item,
        uniqueKey: `${item.id}-${i}`,
      }));
    }
    return sports.map((item, i) => ({ ...item, uniqueKey: `${item.id}-${i}` }));
  }, [sports]);

  useEffect(() => {
    if (isPaused || displaySports.length <= 1) return;

    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollLeft >= maxScroll - 20) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardWidth = window.innerWidth <= 768 ? 280 : 360;
        sliderRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, displaySports.length]);

  return (
    <div
      className="sports-explore-slider-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="sports-explore-slider" ref={sliderRef}>
        {displaySports.map((s, idx) => {
          const ringClass = RING_CLASSES[idx % RING_CLASSES.length];
          const isBlob = idx % 3 === 2;

          return (
            <Link to={`/campus/sports/${s.id}`} key={s.uniqueKey} className={`sports-circle-card ${ringClass} ${isBlob ? 'sports-circle-card--blob' : ''}`}>
              <div className="sports-circle-card__inner">
                {s.imageUrl ? (
                  <img src={s.imageUrl} alt={s.title} className="sports-circle-card__img" loading="lazy" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#121826', color: '#e0b04a' }}>
                    <Activity size={48} />
                  </div>
                )}

                <div className="sports-circle-card__overlay">
                  <h3 className="sports-circle-card__title">{s.title}</h3>
                  {s.subtitle && <span className="sports-circle-card__subtitle">{s.subtitle}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SportsTournamentSlider({ tournaments }: { tournaments: TournamentItem[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items if needed so full-width slider has plenty of cards across wide displays
  const displayTournaments = useMemo(() => {
    if (tournaments.length === 0) return [];
    if (tournaments.length < 6) {
      return [...tournaments, ...tournaments, ...tournaments].map((item, i) => ({
        ...item,
        uniqueKey: `${item.id}-${i}`,
      }));
    }
    return tournaments.map((item, i) => ({ ...item, uniqueKey: `${item.id}-${i}` }));
  }, [tournaments]);

  // Set initial scroll position towards maxScroll so reverse auto-scroll starts immediately
  useEffect(() => {
    if (!sliderRef.current) return;
    const { scrollWidth, clientWidth } = sliderRef.current;
    sliderRef.current.scrollLeft = Math.max(0, scrollWidth - clientWidth);
  }, [displayTournaments.length]);

  useEffect(() => {
    if (isPaused || displayTournaments.length <= 1) return;

    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;

      // Scroll in OPPOSITE direction to Explore Our Sports (-cardWidth per step)
      if (scrollLeft <= 20) {
        sliderRef.current.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        const cardWidth = window.innerWidth <= 768 ? 290 : 400;
        sliderRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, displayTournaments.length]);

  return (
    <div
      className="sports-tournaments-slider-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="sports-tournaments-slider" ref={sliderRef}>
        {displayTournaments.map((t) => (
          <div className="sports-tournament-card-v2" key={t.uniqueKey}>
            <div className="sports-tournament-card-v2__media">
              {t.imageUrl ? (
                <img src={t.imageUrl} alt="College-wise tournament" loading="lazy" />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#121826' }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getFacilityTags(facility: FacilityItem) {
  if (facility.tagsString && facility.tagsString.trim()) {
    return facility.tagsString.split(',').map((t) => t.trim()).filter(Boolean);
  }
  const t = facility.title.toLowerCase();
  if (t.includes('pool') || t.includes('swim')) return ['10 Lanes', 'Heated Water', 'Grandstand Seating', 'Timing System'];
  if (t.includes('turf') || t.includes('ground') || t.includes('stadium')) return ['Floodlit', 'FIFA Approved', 'Running Track', 'Spectator Stands'];
  if (t.includes('gym') || t.includes('fitness')) return ['Fitness Center', 'Strength Training', 'Cardio Zone', 'Open 24/7'];
  if (t.includes('court') || t.includes('badminton') || t.includes('basket')) return ['8 Courts', 'Wooden Flooring', 'International Standard'];
  return ['World-Class Facility', 'Professional Coaching', 'All-Weather Arena'];
}

export default function Sports() {
  const { docs: sports } = useOrderedCollection<CategoryItem>('sportsCategories', 'order');
  const { docs: tournaments } = useOrderedCollection<TournamentItem>('sportsTournaments', 'order');
  const { docs: achievements } = useOrderedCollection<AchievementItem>('sportsAchievements', 'order');
  const { docs: facilities } = useOrderedCollection<FacilityItem>('sportsFacilities', 'order');
  const { data: settingsDoc } = useDocument<SportsPageSettingsDoc>('sportsPageSettings', 'main');

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  const heroTitle = settingsDoc?.heroTitle || SPORTS_HERO_DEFAULTS.heroTitle;
  const heroSubtitle = settingsDoc?.heroSubtitle || SPORTS_HERO_DEFAULTS.heroSubtitle;
  const palette = resolveSportsPalette(settingsDoc);
  const explorePalette = resolveSectionPalette(settingsDoc, 'explore');
  const tournamentsPalette = resolveSectionPalette(settingsDoc, 'tournaments');
  const achievementsPalette = resolveSectionPalette(settingsDoc, 'achievements');
  const infrastructurePalette = resolveSectionPalette(settingsDoc, 'infrastructure');

  const exploreSolid = sectionHasSolidBg(settingsDoc, 'explore');
  const tournamentsSolid = sectionHasSolidBg(settingsDoc, 'tournaments');
  const achievementsSolid = sectionHasSolidBg(settingsDoc, 'achievements');
  const infrastructureSolid = sectionHasSolidBg(settingsDoc, 'infrastructure');
  const exploreOpacity = resolveSectionOpacity(settingsDoc, 'explore');
  const tournamentsOpacity = resolveSectionOpacity(settingsDoc, 'tournaments');
  const achievementsOpacity = resolveSectionOpacity(settingsDoc, 'achievements');
  const infrastructureOpacity = resolveSectionOpacity(settingsDoc, 'infrastructure');

  const closing = settingsDoc?.closing;
  const closingSegments = [closing?.segment1, closing?.segment2, closing?.segment3].filter((s): s is string => !!s);

  useEffect(() => {
    document.title = 'Sports | VWU';
  }, []);

  const paletteVars = {
    '--color-primary': palette.primary,
    '--color-primary-dark': palette.primaryDark,
    '--color-accent': palette.accent,
  } as CSSProperties;

  const categoryTabs = ['ALL', 'INDOOR', 'OUTDOOR', 'TRACK & FIELD'];
  const filteredSports = sports.filter((s) => {
    if (activeTab === 'ALL') return true;
    if (s.categoryTag) return s.categoryTag.toUpperCase() === activeTab;
    const title = s.title.toLowerCase();
    if (activeTab === 'INDOOR') {
      return title.includes('badminton') || title.includes('table') || title.includes('chess') || title.includes('gym') || title.includes('carrom') || title.includes('squash');
    }
    if (activeTab === 'OUTDOOR') {
      return title.includes('basket') || title.includes('volley') || title.includes('tennis') || title.includes('cricket') || title.includes('football') || title.includes('kabaddi') || title.includes('kho');
    }
    if (activeTab === 'TRACK & FIELD') {
      return title.includes('athletic') || title.includes('track') || title.includes('swim') || title.includes('run') || title.includes('relay');
    }
    return true;
  });

  return (
    <main className="page-wrapper sports-page" style={paletteVars}>
      <div className="sports-fixed-bg" />
      <div className="sports-bg-overlay" />

      <PageHero
        page="campus-sports"
        defaultImage="/images/sports-hero-bg.jpg"
        defaultTitle={heroTitle}
        defaultSubtitle={heroSubtitle}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Campus Life', to: '/campus' }, { label: 'Sports' }]}
        hideCta={true}
      />

      {/* Section 1: Explore Our Sports — Giant Circular & Fluid Blob Cards */}
      <Section visible={sports.length > 0}>
        <section className={`section sports-section${exploreSolid ? ' sports-section--solid' : ''}`} style={paletteVarsFor(explorePalette, exploreOpacity, exploreSolid)}>
          <div className="container">
            <div className="sports-explore-header">
              <span className="sports-explore-eyebrow">
                <Activity size={14} /> Our Sports Disciplines
              </span>

              <h2 className="sports-explore-title">
                {settingsDoc?.explore?.title || 'EXPLORE OUR SPORTS'}
              </h2>
              <p className="sports-explore-subtitle">
                {settingsDoc?.explore?.subtitle || 'A World of Athletics for Tomorrow\'s Leaders'}
              </p>

              {/* Filter Pills */}
              <div className="sports-category-pills">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`sports-category-pill ${activeTab === tab ? 'sports-category-pill--active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SportsCategorySlider sports={filteredSports} />
        </section>
      </Section>

      {/* Section 2: Collegewise Tournaments — just a photo and a name */}
      <Section visible={tournaments.length > 0}>
        <section className={`section sports-section${tournamentsSolid ? ' sports-section--solid' : ''}`} style={paletteVarsFor(tournamentsPalette, tournamentsOpacity, tournamentsSolid)}>
          <div className="container">
            <div className="sports-tournaments-header">
              <span className="sports-explore-eyebrow">
                <Trophy size={14} /> Campus Competitions
              </span>
              <h2 className="sports-tournaments-title">
                {settingsDoc?.tournaments?.title || 'COLLEGEWISE TOURNAMENTS'}
              </h2>
            </div>
          </div>

          <SportsTournamentSlider tournaments={tournaments} />
        </section>
      </Section>

      {/* Section 3: Medals & Achievements — Hall of Champions */}
      <Section visible={achievements.length > 0}>
        <section className={`section sports-section${achievementsSolid ? ' sports-section--solid' : ''}`} style={paletteVarsFor(achievementsPalette, achievementsOpacity, achievementsSolid)}>
          <div className="container">
            <div className="sports-achievements-header">
              <span className="sports-explore-eyebrow">
                <Trophy size={14} /> Athletic Excellence
              </span>
              <h2 className="sports-achievements-title">
                {settingsDoc?.achievements?.title || 'HALL OF CHAMPIONS'}
              </h2>
              <p className="sports-achievements-subtitle">
                CELEBRATING OUR ATHLETIC LEGACY
              </p>
            </div>

            {/* Champions Gallery Grid — the card is the photo, full-bleed;
                the name sits below it, outside the card's own box. Only
                the first ACHIEVEMENTS_PREVIEW_COUNT show until "Show More"
                is clicked, so a long list doesn't dominate the page. */}
            <div className="sports-champions-gallery">
              {(showAllAchievements ? achievements : achievements.slice(0, ACHIEVEMENTS_PREVIEW_COUNT)).map((a) => (
                <div className="sports-medallion-item" key={a.id}>
                  <div className="sports-medallion-card">
                    {a.imageUrl ? (
                      <img src={a.imageUrl} alt="Achievement photo" className="sports-medallion-card__img" loading="lazy" />
                    ) : (
                      <div className="sports-medallion-card__placeholder">
                        <Trophy size={36} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {achievements.length > ACHIEVEMENTS_PREVIEW_COUNT && (
              <div className="sports-show-more-wrap">
                <button type="button" className="sports-show-more-btn" onClick={() => setShowAllAchievements((v) => !v)}>
                  {showAllAchievements ? 'Show Less' : 'Show More'}
                </button>
              </div>
            )}
          </div>
        </section>
      </Section>

      {/* Section 4: Infrastructure & Facilities (Bento Grid) */}
      <Section visible={facilities.length > 0}>
        <section className={`section sports-section${infrastructureSolid ? ' sports-section--solid' : ''}`} style={paletteVarsFor(infrastructurePalette, infrastructureOpacity, infrastructureSolid)}>
          <div className="container">
            <div className="sports-infra-header">
              <span className="sports-explore-eyebrow">
                <Activity size={14} /> World-Class Venues
              </span>
              <h2 className="sports-infra-title">
                {settingsDoc?.infrastructure?.title || 'Infrastructure & Facilities'}
              </h2>
              <p className="sports-infra-subtitle">
                {settingsDoc?.infrastructure?.subtitle || 'Explore our world-class, state-of-the-art sporting amenities designed for athletes and students.'}
              </p>
            </div>

            <div className="sports-bento-container">
              {facilities.map((f, idx) => {
                const isHero = f.isFeatured ?? (idx === 0);
                const tags = getFacilityTags(f);

                return (
                  <div className={`sports-bento-item ${isHero ? 'sports-bento-item--hero' : ''}`} key={f.id}>
                    {f.imageUrl ? (
                      <img src={f.imageUrl} alt={f.title} className="sports-bento-item__img" loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#121826' }} />
                    )}

                    <div className="sports-bento-item__overlay">
                      <div className="sports-bento-item__tags">
                        {tags.map((tag) => (
                          <span className="sports-bento-pill-tag" key={tag}>{tag}</span>
                        ))}
                      </div>

                      <h3 className="sports-bento-item__title">{f.title}</h3>

                      {isHero && (
                        <button type="button" className="sports-bento-item__btn">
                          Explore Facility <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Section>

      {/* Closing Tagline Band */}
      <Section visible={closingSegments.length > 0}>
        <section className="sports-closing-band">
          <div className="container">
            <p className="sports-closing-tagline">{closingSegments.join('  |  ')}</p>
            <p className="sports-closing-brand">Vishnu Women's University</p>
          </div>
        </section>
      </Section>
    </main>
  );
}
