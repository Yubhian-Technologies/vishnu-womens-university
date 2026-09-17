import { useEffect } from 'react';
import { Sparkles, Heart, Sun, Church, Compass, Flame, Users, Landmark, CheckCircle2 } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { hasCustomSectionContent } from '../../lib/customSections';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import {
  DEFAULT_TEMPLES_HERO_STATS,
  DEFAULT_TEMPLES_ABOUT,
  DEFAULT_TEMPLES_PILLARS,
} from '../Admin/sections/TemplesAdmin';
import './Temples.css';

// Default Fallback Photos
const DEFAULT_TEMPLE_PHOTOS = Array.from({ length: 6 }, (_, i) => ({
  src: PHOTO_NEEDED_PLACEHOLDER,
  alt: `Campus Temple Photo ${i + 1}`,
  caption: `Temples of God — Sacred Campus Sanctuary`,
}));

const ICON_MAP: Record<string, typeof Heart> = {
  Heart,
  Sun,
  Church,
  Compass,
  Flame,
  Users,
  Landmark,
  Sparkles,
};

export default function Temples() {
  // Dynamic admin data from Firestore `campusLifeItems` (slug: 'temples')
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = items.find((i) => i.slug === 'temples');
  const facilityDefault = findCampusFacilityBySlug('temples');

  // Dynamic admin photos from `useSitePhotos`
  const photos = useSitePhotos('campus', 'temples', DEFAULT_TEMPLE_PHOTOS);

  // Dynamic content blocks
  const heroStatDocs = useContentBlocks('temples', 'heroStats');
  const aboutDocs = useContentBlocks('temples', 'about');
  const pillarDocs = useContentBlocks('temples', 'pillars');

  const aboutDoc = aboutDocs[0];

  const statsList = heroStatDocs.length > 0
    ? heroStatDocs.map((s) => ({
        value: s.value || '',
        label: s.title || '',
        icon: ICON_MAP[s.icon || 'Church'] || Church,
      }))
    : DEFAULT_TEMPLES_HERO_STATS.map((s) => ({
        value: s.value,
        label: s.label,
        icon: ICON_MAP[s.icon] || Church,
      }));

  const aboutData = {
    badge: aboutDoc?.value || DEFAULT_TEMPLES_ABOUT.badge,
    title: aboutDoc?.title || DEFAULT_TEMPLES_ABOUT.title,
    subtitle: aboutDoc?.slug || DEFAULT_TEMPLES_ABOUT.subtitle,
    philosophyText: aboutDoc?.desc || DEFAULT_TEMPLES_ABOUT.philosophyText,
  };

  const pillarsList = pillarDocs.length > 0
    ? pillarDocs.map((p) => ({
        icon: ICON_MAP[p.icon || 'Heart'] || Heart,
        tag: p.slug || '',
        title: p.title || '',
        desc: p.desc || '',
      }))
    : DEFAULT_TEMPLES_PILLARS.map((p) => ({
        icon: ICON_MAP[p.icon] || Heart,
        tag: p.tag,
        title: p.title,
        desc: p.desc,
      }));

  // Dynamic titles and subtitles
  const title = adminItem?.title || facilityDefault?.title || 'Temples of God';
  // Deliberately NOT reading adminItem?.desc here — this hero subtitle is
  // meant to stay in sync with the current copy regardless of stale/older
  // text that may still be saved on the campusLifeItems 'temples' doc.
  const subtitle = facilityDefault?.heroSubtitle || 'A peaceful campus space for reflection, prayer, and inner calm.';

  // Dynamic admin custom sections
  const customSections = (adminItem?.customSections || [])
    .filter(hasCustomSectionContent)
    .filter((sec) => !sec.label?.toLowerCase().includes('reverence') && !sec.label?.toLowerCase().includes('reflection'));

  useEffect(() => {
    document.title = `${title} | Campus Life | VWU`;
  }, [title]);

  return (
    <main className="temple-page">
      <PageHero
        page="campus-temples"
        defaultTitle={title}
        defaultSubtitle={subtitle}
        forceSubtitle={subtitle}
        hideCta={true}
      />

      {/* Divine Hero Banner */}
      <section className="tmpl-hero">
        <div className="tmpl-container">
          <div className="tmpl-hero-grid">
            <div className="tmpl-hero-content">
              <h1 className="tmpl-hero-title">
                {title.includes('God') ? (
                  <>
                    Temples of <span className="tmpl-hero-highlight">God</span>
                  </>
                ) : (
                  title
                )}
              </h1>

              {/* Stat Badges */}
              <div className="tmpl-hero-stats">
                {statsList.map((st, i) => {
                  const Icon = st.icon;
                  return (
                    <div key={i} className="tmpl-stat-pill">
                      <div className="tmpl-stat-icon">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="tmpl-stat-val">{st.value}</div>
                        <div className="tmpl-stat-lbl">{st.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="tmpl-hero-img-box">
              <img loading="lazy"
                src={photos[0]?.src || PHOTO_NEEDED_PLACEHOLDER}
                alt="Temples of God"
                className="tmpl-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual Philosophy & Text Section */}
      <section className="tmpl-section">
        <div className="tmpl-container">
          <div className="tmpl-section-header">
            <h2 className="tmpl-section-title">
              {aboutData.title}
            </h2>
            <p className="tmpl-section-subtitle">
              {aboutData.subtitle}
            </p>
          </div>

          <div className="tmpl-philosophy-card">
            <div className="tmpl-philosophy-quote">
              “Worship is putting the spotlight on God. This whole idea is to engage our students in an atmosphere and attitude of reverence and joy.”
            </div>
            <p className="tmpl-philosophy-text">
              {aboutData.philosophyText}
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Admin Photo Gallery Section (Clean Single Title via PhotoGrid props) */}
      <section className="tmpl-section tmpl-gallery-section">
        <div className="tmpl-container">
          <PhotoGrid
            images={photos}
            title="Temple Gallery"
            label="GALLERY SHOWCASE"
            subtitle="Explore glimpses of the temple complex, its architecture, interiors, and peaceful campus surroundings."
          />
        </div>
      </section>

      {/* Sanctuary Pillars Grid */}
      <section className="tmpl-section tmpl-highlights-section">
        <div className="tmpl-container">
          <div className="tmpl-section-header">
            <h2 className="tmpl-section-title">
              Sanctuary <span>Highlights</span>
            </h2>
            <p className="tmpl-section-subtitle">
              The temple complex offers dedicated spaces and surroundings that support reflection, inclusion and wellbeing within the University community.
            </p>
          </div>

          <div className="tmpl-pillars-grid">
            {pillarsList.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="tmpl-pillar-card">
                  <div className="tmpl-pillar-icon">
                    <Icon size={24} />
                  </div>
                  <h3 className="tmpl-pillar-title">{p.title}</h3>
                  <p className="tmpl-pillar-desc">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Admin Custom Sections */}
      {customSections.length > 0 && (
        <section className="tmpl-section">
          <div className="tmpl-container">
            <CustomSectionsRenderer sections={customSections} />
          </div>
        </section>
      )}

      {/* Flagship Enhanced Closing Section Above Footer: "A Space for Reverence, Reflection & Inner Peace" */}
      <section className="tmpl-section tmpl-reflection-section">
        <div className="tmpl-container">
          <div className="tmpl-section-header">
            <h2 className="tmpl-section-title">
              Supporting Wellbeing and <span>Campus Community</span>
            </h2>
            <p className="tmpl-section-subtitle">
              The temple complex contributes to the campus environment by supporting personal reflection, inclusivity and a sense of wellbeing among members of the University community.
            </p>
          </div>

          <div className="tmpl-reflection-cards">
            {/* Paragraph 1 Card: Personal Wellbeing */}
            <div className="tmpl-reflection-card">
              <div className="tmpl-reflection-tag">PERSONAL WELLBEING</div>
              <div className="tmpl-reflection-icon-box">
                <Heart size={28} />
              </div>
              <h3 className="tmpl-reflection-card-title">Space for Reflection and Wellbeing</h3>
              <p className="tmpl-reflection-card-body">
                The temple complex provides students, faculty and staff with a quiet setting for prayer, contemplation and personal reflection. It offers an opportunity to pause and spend time away from academic and professional routines.
              </p>
              <ul className="tmpl-highlights-list">
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Spaces for Prayer and Contemplation</span>
                </li>
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Quiet Setting for Personal Reflection</span>
                </li>
              </ul>
            </div>

            {/* Paragraph 2 Card: Inclusion and Respect */}
            <div className="tmpl-reflection-card">
              <div className="tmpl-reflection-tag">INCLUSION AND RESPECT</div>
              <div className="tmpl-reflection-icon-box">
                <Users size={28} />
              </div>
              <h3 className="tmpl-reflection-card-title">Respect for Diverse Faiths and Traditions</h3>
              <p className="tmpl-reflection-card-body">
                The University welcomes people from diverse faiths, traditions and backgrounds. The temple complex provides a shared space that encourages respectful engagement and consideration for individual beliefs and practices.
              </p>
              <ul className="tmpl-highlights-list">
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Welcoming Diverse Faiths and Backgrounds</span>
                </li>
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Encouraging Mutual Respect</span>
                </li>
              </ul>
            </div>

            {/* Paragraph 3 Card: Campus Environment */}
            <div className="tmpl-reflection-card">
              <div className="tmpl-reflection-tag">CAMPUS ENVIRONMENT</div>
              <div className="tmpl-reflection-icon-box">
                <Landmark size={28} />
              </div>
              <h3 className="tmpl-reflection-card-title">A Distinctive Campus Space</h3>
              <p className="tmpl-reflection-card-body">
                Located within the University campus, the temple complex complements the academic, residential and student-life environment by providing a dedicated space for spiritual reflection and quiet contemplation.
              </p>
              <ul className="tmpl-highlights-list">
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Part of the University Campus Environment</span>
                </li>
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Dedicated Space for Reflection and Wellbeing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quote Callout Banner */}
          <div className="tmpl-quote-callout">
            <div className="tmpl-callout-icon">
              <Sparkles size={34} />
            </div>
            <div>
              <div className="tmpl-callout-title">A Distinctive Part of Campus Life</div>
              <div className="tmpl-callout-desc">
                The temple complex forms an integral part of the University campus, providing students, faculty and staff with a dedicated space for prayer, reflection and quiet contemplation within a peaceful setting.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
