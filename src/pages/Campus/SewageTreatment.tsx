import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Recycle, FlaskConical, Leaf, IndianRupee, CalendarDays,
  Sparkles, ShieldCheck, Waves, Factory, ArrowRight, Camera
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CustomSectionsRenderer from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { hasCustomSectionContent } from '../../lib/customSections';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import './SewageTreatment.css';

// Campus & sewage-load figures quoted in the DST project write-up
const CAMPUS_STATS = [
  { value: '80', label: 'Acre Campus' },
  { value: '7', label: 'Constituent Institutes' },
  { value: '~17,000', label: 'Students' },
  { value: '~6,000', label: 'Hostel Residents' },
  { value: '~9 Lakh L', label: 'Daily Water Requirement' },
  { value: '~7 Lakh L', label: 'Daily Sewage Generated' },
];

const PROJECT_FACTS = [
  { icon: Factory, label: 'Plants Commissioned', value: '2 Sewage Treatment Plants' },
  { icon: Droplets, label: 'Capacity (each)', value: '200 KLD' },
  { icon: IndianRupee, label: 'DST Grant Sanctioned', value: 'Rs. 59.866 Lakhs' },
  { icon: IndianRupee, label: 'Total Project Cost', value: 'Rs. 170.536 Lakhs' },
  { icon: CalendarDays, label: 'Sanctioned With Effect From', value: '28 / 11 / 2014 — for 2 years' },
  { icon: FlaskConical, label: 'Treatment Technology', value: 'Improved Moving Bed Bio-film Reactor (MBBR)' },
];

export const DEFAULT_PHOTOS = [
  { src: '/images/sewage-treatment-plants/stp-1.jpg', alt: 'Sewage Treatment Plant at VWU — photo 1', caption: 'On-site 200 KLD MBBR Plant' },
  { src: '/images/sewage-treatment-plants/stp-2.jpg', alt: 'Sewage Treatment Plant at VWU — photo 2', caption: 'Aeration & Distribution Tank' },
  { src: '/images/sewage-treatment-plants/stp-3.jpg', alt: 'Sewage Treatment Plant at VWU — photo 3', caption: 'Sand & Carbon Filter Pressure Vessels' },
];

export default function SewageTreatment() {
  const photos = useSitePhotos('campus', 'sewage-treatment-plants', DEFAULT_PHOTOS);

  const getPhotoSrc = (index: number) => {
    const p = photos[index]?.src;
    if (p && !p.includes('photoPlaceholder') && !p.includes('data:image')) return p;
    return DEFAULT_PHOTOS[index % DEFAULT_PHOTOS.length].src;
  };

  // Admin-editable name + extra content (including a proper multi-photo
  // gallery section type) — same `campusLifeItems` system every other
  // Campus Life page uses, via Admin -> Campus Life -> Sewage Treatment
  // Plants. Falls back to the existing hardcoded title if no admin item
  // has been created yet.
  const { docs: campusLifeItems } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = campusLifeItems.find((i) => i.slug === 'sewage-treatment-plants');
  const pageTitle = adminItem?.title || 'Sewage Treatment Plants';
  const customSections = (adminItem?.customSections || []).filter(hasCustomSectionContent);

  useEffect(() => {
    document.title = `${pageTitle} | VWU`;
  }, [pageTitle]);

  // Mount-only, not keyed on Firestore data — see the .reveal/Firestore
  // gotcha in CLAUDE.md (re-running this per live data update can tear the
  // observer down mid-animation and permanently miss elements).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="stp-page">
      <SEO
        title="Sewage Treatment Plants — Zero Discharge Campus | Vishnu Women's University"
        description="Two DST-funded 200 KLD sewage treatment plants using MBBR technology make the VWU campus a zero-discharge campus, with treated effluent reused for campus and highway greenery."
        canonicalPath="/campus/sewage-treatment-plants"
      />

      <PageHero
        page="campus-sewage-treatment-plants"
        defaultTitle={pageTitle}
        defaultSubtitle="A zero-discharge campus — every drop of sewage generated is treated on site and returned to the land as irrigation for campus and highway greenery."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Campus Life', to: '/campus' }, { label: pageTitle }]}
        hideCta={true}
      />

      {/* Admin-added content (Admin -> Campus Life -> Sewage Treatment
          Plants -> Sections) — includes a "Photo Gallery" section type for
          adding as many extra photos as needed, beyond the 3 fixed Site
          Photos slots used throughout the page below. Hidden until an
          admin actually adds something here. */}
      {customSections.length > 0 && (
        <section className="stp-section">
          <div className="stp-container">
            <CustomSectionsRenderer sections={customSections} />
          </div>
        </section>
      )}

      {/* 1. Eco Metrics Hero Dashboard */}
      <section className="stp-stats-banner">
        <div className="stp-container">
          <div className="stp-stats-grid">
            {CAMPUS_STATS.map((s) => (
              <div key={s.label} className="stp-stat-card">
                <div className="stp-stat-val">{s.value}</div>
                <div className="stp-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Vision & Water Conservation Narrative with Interleaved Media */}
      <section className="stp-section stp-vision-section">
        <div className="stp-container">
          <div className="stp-header">
            <div className="stp-badge">
              <Leaf size={14} />
              <span>SUSTAINABLE VISION</span>
            </div>
            <h2 className="stp-title">
              Water is a Precious <span>Natural Resource</span>
            </h2>
            <p className="stp-subtitle">
              Pioneering natural resource conservation as an integral part of institutional vision.
            </p>
          </div>

          <div className="stp-vision-card">
            <div className="stp-vision-quote">
              <div className="stp-vision-quote-text">
                “Water is a precious natural resource gifted by God to mankind, and one of the five powerful elements of life creation. A resource this precious needs careful consumption.”
              </div>
            </div>

            <div className="stp-vision-grid">
              <div className="stp-vision-body">
                <p>
                  Knowing this, Vishnu Women’s University has incorporated <strong>sustainable environmental protection into its Vision Statement</strong>, and the management consistently encourages natural-resource-conservative practices across the campus.
                </p>
                <p>
                  The campus extends across a serene <strong>80 acres</strong>, three kilometres from the outskirts of Bhimavaram town. It houses <strong>7 constituent institutes</strong> with a total strength of about <strong>17,000 students</strong>, of whom around <strong>6,000 stay in the hostels</strong>. Meeting the daily needs of a campus this size requires roughly <strong>9 lakh litres of water per day</strong> — and the sewage generated is correspondingly high, estimated at about <strong>7 lakh litres per day</strong>, all of which would ultimately reach a natural drain without intervention.
                </p>

                <div className="stp-vision-highlight-box">
                  <div className="stp-vision-highlight-title">
                    <Recycle size={20} />
                    <span>Closed-Loop Resource Cycle</span>
                  </div>
                  <div className="stp-water-loop">
                    <div className="stp-loop-step">
                      <Droplets size={18} className="stp-loop-icon" />
                      <span>9 Lakh Litres Daily Campus Demand</span>
                    </div>
                    <div className="stp-loop-step">
                      <Waves size={18} className="stp-loop-icon" />
                      <span>7 Lakh Litres Daily Sewage Channeled</span>
                    </div>
                    <div className="stp-loop-step">
                      <ShieldCheck size={18} className="stp-loop-icon" />
                      <span>100% Zero Discharge Into Public Drains</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interleaved Photo Slot 1 & 2 */}
              <div className="stp-vision-sidebar">
                <div className="stp-media-card">
                  <img
                    src={getPhotoSrc(0)}
                    alt="VWU Sewage Treatment Plant View"
                    className="stp-media-img"
                    onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[0].src; }}
                  />
                  <div className="stp-media-badge">
                    <Camera size={16} />
                    <span>On-Site 200 KLD MBBR Plant</span>
                  </div>
                </div>

                <div className="stp-media-card">
                  <img
                    src={getPhotoSrc(1)}
                    alt="VWU Sewage Treatment Water Recycling"
                    className="stp-media-img"
                    onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[1].src; }}
                  />
                  <div className="stp-media-badge">
                    <Sparkles size={16} />
                    <span>Treated Effluent Distribution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DST-Funded Treatment Plants Specifications Showcase */}
      <section className="stp-section stp-dst-section">
        <div className="stp-container">
          <div className="stp-header">
            <div className="stp-badge">
              <Sparkles size={14} />
              <span>DST NEW DELHI FUNDED PROJECT</span>
            </div>
            <h2 className="stp-title">
              DST-Funded <span>Treatment Plants</span>
            </h2>
            <p className="stp-subtitle">
              Sanctioned by the Department of Science & Technology to achieve 100% zero-discharge campus operations.
            </p>
          </div>

          <div className="stp-dst-showcase">
            <div className="stp-dst-narrative">
              To provide an eco-friendly environment and ensure <strong>zero discharge into the drain</strong>, the University — with extended help from the management — applied to the <strong>Department of Science & Technology (DST), New Delhi</strong> to construct a sewage treatment plant for the sewage generated on campus. On a kind perusal of the proposal, DST sanctioned the project, and sewage collected from the various zones of activity across the campus is now channelled through a network of drainages into the treatment plants.
            </div>

            {/* Interleaved Photo Slot 3 */}
            <div className="stp-media-card">
              <img
                src={getPhotoSrc(2)}
                alt="DST Funded Sewage Treatment Installation"
                className="stp-media-img"
                onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[2].src; }}
              />
              <div className="stp-media-badge">
                <ShieldCheck size={16} />
                <span>DST Sanctioned Facility • Rs. 170+ Lakh Project</span>
              </div>
            </div>
          </div>

          <div className="stp-spec-grid">
            {PROJECT_FACTS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="stp-spec-card">
                <div className="stp-spec-icon-box">
                  <Icon size={24} />
                </div>
                <div>
                  <div className="stp-spec-lbl">{label}</div>
                  <div className="stp-spec-val">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Treatment Methodology Process Cards with Integrated Step Photos */}
      <section className="stp-section stp-method-section">
        <div className="stp-container">
          <div className="stp-header">
            <div className="stp-badge">
              <FlaskConical size={14} />
              <span>ADVANCED CLEAN-TECH METHODOLOGY</span>
            </div>
            <h2 className="stp-title">
              MBBR Technology <span>with Probiotics</span>
            </h2>
            <p className="stp-subtitle">
              Integrating bio-film reactors and biological probiotics for high-efficiency effluent purification.
            </p>
          </div>

          <div className="stp-process-flow">
            <div className="stp-process-card">
              <div className="stp-process-num">01</div>
              {/* Interleaved Photo Slot 4 */}
              <div className="stp-process-img-box">
                <img
                  src={getPhotoSrc(3)}
                  alt="Zonal Drainage Network"
                  onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[0].src; }}
                />
              </div>
              <h3 className="stp-process-title">Zonal Sewage Collection</h3>
              <p className="stp-process-body">
                Sewage collected from hostels, academic blocks, mess facilities, and residential quarters across the 80-acre campus is channelled through an integrated network of underground drainages into the treatment plants.
              </p>
            </div>

            <div className="stp-process-card">
              <div className="stp-process-num">02</div>
              {/* Interleaved Photo Slot 5 */}
              <div className="stp-process-img-box">
                <img
                  src={getPhotoSrc(4)}
                  alt="MBBR Biofilm Reactor"
                  onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[1].src; }}
                />
              </div>
              <h3 className="stp-process-title">MBBR & Probiotic Dosing</h3>
              <p className="stp-process-body">
                Treatment is carried out using an <strong>Improved Moving Bed Bio-film Reactor (MBBR)</strong>. The methodology includes the strategic use of <strong>probiotics along with MBBR technology</strong> for bio-degradation of waste water.
              </p>
            </div>

            <div className="stp-process-card">
              <div className="stp-process-num">03</div>
              {/* Interleaved Photo Slot 6 */}
              <div className="stp-process-img-box">
                <img
                  src={getPhotoSrc(5)}
                  alt="BIS Quality Water Testing"
                  onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[2].src; }}
                />
              </div>
              <h3 className="stp-process-title">BIS Standard Analysis</h3>
              <p className="stp-process-body">
                Samples are collected periodically <strong>before and after treatment</strong> and analysed for various important physio-chemical parameters, with results strictly verified against standards prescribed by the <strong>Bureau of Indian Standards</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Impact & Application Dual Spotlight with Feature Photos */}
      <section className="stp-section stp-impact-section">
        <div className="stp-container">
          <div className="stp-header">
            <div className="stp-badge">
              <Leaf size={14} />
              <span>ENVIRONMENTAL IMPACT</span>
            </div>
            <h2 className="stp-title">
              Treated Water, <span>Put Back to Work</span>
            </h2>
            <p className="stp-subtitle">
              Recycling 100% of treated effluent to nourish campus landscaping and public highway greenery.
            </p>
          </div>

          <div className="stp-impact-grid">
            <div className="stp-impact-media-card">
              {/* Interleaved Photo Slot 7 */}
              <div className="stp-impact-img-box">
                <img
                  src={getPhotoSrc(6)}
                  alt="Campus Greenery Irrigation"
                  onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[0].src; }}
                />
              </div>
              <div className="stp-impact-body">
                <span className="stp-impact-tag">ON-CAMPUS IRRIGATION</span>
                <h3 className="stp-impact-title">Campus Greenery & Botanical Lawns</h3>
                <p className="stp-impact-desc">
                  The treated sewage (effluent) is used for gardening purposes across the campus, saving a substantial quantity of fresh water demand and supporting rich greenery development throughout the 80-acre university grounds.
                </p>
              </div>
            </div>

            <div className="stp-impact-media-card">
              {/* Interleaved Photo Slot 8 */}
              <div className="stp-impact-img-box">
                <img
                  src={getPhotoSrc(7)}
                  alt="2.5 KM Adopted Highway Greenery"
                  onError={(e) => { e.currentTarget.src = DEFAULT_PHOTOS[1].src; }}
                />
              </div>
              <div className="stp-impact-body">
                <span className="stp-impact-tag">COMMUNITY HIGHWAY ADOPTION</span>
                <h3 className="stp-impact-title">2.5 KM Adopted National Highway Greenery</h3>
                <p className="stp-impact-desc">
                  Sri Vishnu Educational Society has long been invested in societal problems. In that spirit, the Society has adopted the maintenance of nearly <strong>2.5 km of the proposed National Highway road</strong> passing in front of the campus — with treated water consumed in the road-partition greenery and other adopted sites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. On-Site Gallery Section */}
      <section className="stp-section stp-gallery-section">
        <div className="stp-container">
          <PhotoGrid
            images={photos}
            title="STP Infrastructure Gallery"
            label="GALLERY SHOWCASE"
            subtitle="Visual glimpses of the 200 KLD MBBR sewage treatment plants, testing labs, and recycled water distribution."
          />
        </div>
      </section>

      {/* 7. Eco Action Bottom CTA */}
      <section className="stp-cta-banner">
        <div className="stp-container">
          <h2>Explore More Campus Life Facilities</h2>
          <p>Discover our central library, hosteller amenities, health care, and sustainability initiatives across VWU.</p>
          <div className="stp-cta-btns">
            <Link to="/campus" className="stp-btn stp-btn-emerald">
              Back to Campus Life <ArrowRight size={18} style={{ marginLeft: 6 }} />
            </Link>
            <Link to="/campus/other-facilities" className="stp-btn stp-btn-outline">
              Other Facilities
            </Link>
            <Link to="/differentiators" className="stp-btn stp-btn-outline">
              Differentiators
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
