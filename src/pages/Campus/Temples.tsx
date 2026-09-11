import { useEffect } from 'react';
import { Sparkles, Heart, Sun, Church, Compass, Flame, Users, Landmark, CheckCircle2 } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { hasCustomSectionContent } from '../../lib/customSections';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import './Temples.css';

// Default Fallback Photos
const DEFAULT_TEMPLE_PHOTOS = Array.from({ length: 6 }, (_, i) => ({
  src: PHOTO_NEEDED_PLACEHOLDER,
  alt: `Campus Temple Photo ${i + 1}`,
  caption: `Temples of God — Sacred Campus Sanctuary`,
}));

export default function Temples() {
  // Dynamic admin data from Firestore `campusLifeItems` (slug: 'temples')
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = items.find((i) => i.slug === 'temples');
  const facilityDefault = findCampusFacilityBySlug('temples');

  // Dynamic admin photos from `useSitePhotos`
  const photos = useSitePhotos('campus', 'temples', DEFAULT_TEMPLE_PHOTOS);

  // Dynamic titles and subtitles
  const title = adminItem?.title || facilityDefault?.title || 'Temples of God';
  const subtitle = adminItem?.desc || facilityDefault?.heroSubtitle || 'A Space for Reflection, Reverence, and Inner Peace.';

  // Full canonical text preserved 100% intact
  const canonicalPhilosophyText = `Worship is putting the spotlight on God. This whole idea is to engage our Vishnu Women's University students in an atmosphere and attitude of reverence and joy. Vishnu Women's University engage students from varied faith and religious traditions as well as students without religious affiliation. So, Vishnu Women's University holds a place for temple of gods in the campus. The temple is built on a high foundation covering an area of 25,000 square feet.`;

  // Dynamic admin custom sections (exclude duplicate legacy text version of Reverence section)
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
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: title },
        ]}
        hideCta={true}
      />

      {/* Divine Hero Banner */}
      <section className="tmpl-hero">
        <div className="tmpl-container">
          <div className="tmpl-hero-grid">
            <div className="tmpl-hero-content">
              <div className="tmpl-badge">
                <Sparkles size={14} />
                <span>SACRED SANCTUARY • CAMPUS REVERENCE</span>
              </div>
              <h1 className="tmpl-hero-title">
                {title.includes('God') ? (
                  <>
                    Temples of <span className="tmpl-hero-highlight">God</span>
                  </>
                ) : (
                  title
                )}
              </h1>
              <p className="tmpl-hero-subtitle">{subtitle}</p>

              {/* Stat Badges */}
              <div className="tmpl-hero-stats">
                <div className="tmpl-stat-pill">
                  <div className="tmpl-stat-icon">
                    <Church size={18} />
                  </div>
                  <div>
                    <div className="tmpl-stat-val">25,000</div>
                    <div className="tmpl-stat-lbl">Sq. Ft. Area</div>
                  </div>
                </div>

                <div className="tmpl-stat-pill">
                  <div className="tmpl-stat-icon">
                    <Compass size={18} />
                  </div>
                  <div>
                    <div className="tmpl-stat-val">All Faiths</div>
                    <div className="tmpl-stat-lbl">Inclusive Reverence</div>
                  </div>
                </div>

                <div className="tmpl-stat-pill">
                  <div className="tmpl-stat-icon">
                    <Flame size={18} />
                  </div>
                  <div>
                    <div className="tmpl-stat-val">Sanctuary</div>
                    <div className="tmpl-stat-lbl">Inner Peace & Joy</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tmpl-hero-img-box">
              <img
                src={photos[0]?.src || PHOTO_NEEDED_PLACEHOLDER}
                alt="Temples of God"
                className="tmpl-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual Philosophy & Text Section (100% Preserved Text) */}
      <section className="tmpl-section">
        <div className="tmpl-container">
          <div className="tmpl-section-header">
            <div className="tmpl-badge">CAMPUS SANCTUARY</div>
            <h2 className="tmpl-section-title">
              Spiritual <span>Philosophy</span>
            </h2>
            <p className="tmpl-section-subtitle">
              A sacred space built to nurture peace, reverence, and spiritual well-being.
            </p>
          </div>

          <div className="tmpl-philosophy-card">
            <div className="tmpl-philosophy-quote">
              “Worship is putting the spotlight on God. This whole idea is to engage our students in an atmosphere and attitude of reverence and joy.”
            </div>
            <p className="tmpl-philosophy-text">
              {canonicalPhilosophyText}
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
            subtitle="Visual glimpses of the campus temple sanctuary, architecture, and festival celebrations."
          />
        </div>
      </section>

      {/* Sanctuary Pillars Grid */}
      <section className="tmpl-section tmpl-highlights-section">
        <div className="tmpl-container">
          <div className="tmpl-section-header">
            <div className="tmpl-badge">SACRED ARCHITECTURE</div>
            <h2 className="tmpl-section-title">
              Sanctuary <span>Highlights</span>
            </h2>
            <p className="tmpl-section-subtitle">
              Designed to foster reflection, peace, and spiritual harmony for the entire campus community.
            </p>
          </div>

          <div className="tmpl-pillars-grid">
            <div className="tmpl-pillar-card">
              <div className="tmpl-pillar-icon">
                <Heart size={24} />
              </div>
              <h3 className="tmpl-pillar-title">Reverence & Joy</h3>
              <p className="tmpl-pillar-desc">
                Creating an atmosphere where students engage in daily reflection with peace, gratitude, and reverence.
              </p>
            </div>

            <div className="tmpl-pillar-card">
              <div className="tmpl-pillar-icon">
                <Sun size={24} />
              </div>
              <h3 className="tmpl-pillar-title">Inclusive Harmony</h3>
              <p className="tmpl-pillar-desc">
                Welcoming students from varied faith and religious traditions as well as those without religious affiliation.
              </p>
            </div>

            <div className="tmpl-pillar-card">
              <div className="tmpl-pillar-icon">
                <Church size={24} />
              </div>
              <h3 className="tmpl-pillar-title">25,000 Sq. Ft. Sanctuary</h3>
              <p className="tmpl-pillar-desc">
                Built on a high foundation covering 25,000 square feet, offering spacious halls for peaceful reflection.
              </p>
            </div>

            <div className="tmpl-pillar-card">
              <div className="tmpl-pillar-icon">
                <Sparkles size={24} />
              </div>
              <h3 className="tmpl-pillar-title">Festivals & Celebrations</h3>
              <p className="tmpl-pillar-desc">
                Observing major traditional festivals with unity, joy, and collective campus participation.
              </p>
            </div>
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
            <div className="tmpl-badge">HOLISTIC WELLBEING • CAMPUS SANCTUARY</div>
            <h2 className="tmpl-section-title">
              A Space for Reverence, <span>Reflection & Inner Peace</span>
            </h2>
            <p className="tmpl-section-subtitle">
              Fostering spiritual wellbeing, mutual respect, and quiet contemplation across the campus community.
            </p>
          </div>

          <div className="tmpl-reflection-cards">
            {/* Paragraph 1 Card: Holistic Wellbeing */}
            <div className="tmpl-reflection-card">
              <div className="tmpl-reflection-tag">HOLISTIC WELLBEING</div>
              <div className="tmpl-reflection-icon-box">
                <Heart size={28} />
              </div>
              <h3 className="tmpl-reflection-card-title">Holistic Development & Wellbeing</h3>
              <p className="tmpl-reflection-card-body">
                Vishnu Women’s University recognises that spirituality, reflection, and inner wellbeing can be meaningful aspects of a student’s holistic development. The campus provides a serene space for prayer, contemplation, and quiet reflection, fostering an atmosphere of reverence, peace, and joy.
              </p>
              <ul className="tmpl-highlights-list">
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Prayer & Contemplation Spaces</span>
                </li>
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Atmosphere of Reverence, Peace & Joy</span>
                </li>
              </ul>
            </div>

            {/* Paragraph 2 Card: Inclusive Spiritual Harmony */}
            <div className="tmpl-reflection-card">
              <div className="tmpl-reflection-tag">INCLUSIVITY & HARMONY</div>
              <div className="tmpl-reflection-icon-box">
                <Users size={28} />
              </div>
              <h3 className="tmpl-reflection-card-title">Inclusive Spiritual Harmony</h3>
              <p className="tmpl-reflection-card-body">
                The University welcomes students from diverse faiths, religious traditions, and backgrounds, as well as those without religious affiliation, and respects their individual beliefs and perspectives. The temple on campus forms part of the University’s distinctive environment, offering those who wish to worship a peaceful place for spiritual practice and reflection.
              </p>
              <ul className="tmpl-highlights-list">
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>All Faiths & Backgrounds Welcomed</span>
                </li>
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Respect for Individual Beliefs</span>
                </li>
              </ul>
            </div>

            {/* Paragraph 3 Card: Architectural Landmark */}
            <div className="tmpl-reflection-card">
              <div className="tmpl-reflection-tag">CAMPUS LANDMARK</div>
              <div className="tmpl-reflection-icon-box">
                <Landmark size={28} />
              </div>
              <h3 className="tmpl-reflection-card-title">25,000 Sq. Ft. Spiritual Landmark</h3>
              <p className="tmpl-reflection-card-body">
                Built on an elevated foundation and spread across approximately 25,000 sq. ft., the temple complex is an important architectural and spiritual landmark of the campus. Its tranquil surroundings provide an opportunity for students and members of the University community to pause, reflect, and find a sense of peace amidst their academic journey.
              </p>
              <ul className="tmpl-highlights-list">
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>25,000 Sq. Ft. Elevated Foundation</span>
                </li>
                <li className="tmpl-highlight-item">
                  <CheckCircle2 size={16} className="tmpl-highlight-icon" />
                  <span>Tranquil Surroundings for Inner Peace</span>
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
              <div className="tmpl-callout-title">Architectural & Spiritual Campus Landmark</div>
              <div className="tmpl-callout-desc">
                Spread across 25,000 sq. ft. on an elevated foundation — offering students a serene environment to pause, reflect, and cultivate inner peace throughout their academic journey.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
