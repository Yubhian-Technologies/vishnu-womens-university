import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  GraduationCap,
  Users,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  FileText,
  ArrowRight,
} from 'lucide-react';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { CustomSection } from '../../lib/customSections';
import { ruralWomenTechPark } from './ruralWomenTechPark.data';
import './rural-women-tech-park.css';

interface RwtpReportLink {
  id: string;
  label: string;
  fileUrl: string;
}

interface RuralWomenTechParkPageProps {
  item: DifferentiatorItemDoc;
  reportLinks: RwtpReportLink[];
  customSections: CustomSection[];
}

// Default gallery photos matching Image 1 / RWTP domain activities
const DEFAULT_RWTP_GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=800&auto=format&fit=crop&q=80',
    caption: 'Handloom & Textile Weaving Training',
  },
  {
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    caption: 'Food Processing & Baking Workshop',
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    caption: 'Waste Paper Recycling Initiative',
  },
  {
    url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
    caption: 'Women Empowerment Session',
  },
  {
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    caption: 'Virgin Coconut Oil Extraction Unit',
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    caption: 'CAD Stitching & Embroidery Center',
  },
];

export default function RuralWomenTechParkPage({
  item,
  reportLinks,
  customSections,
}: RuralWomenTechParkPageProps) {
  // Accordion open/close state. Open item '01' by default.
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    '01': true,
    '02': false,
    '03': false,
    '04': false,
    '05': false,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Gallery slider ref & scroll helpers
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndicator, setActiveIndicator] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 300;
    if (direction === 'left') {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setActiveIndicator((prev) => Math.max(0, prev - 1));
    } else {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setActiveIndicator((prev) => Math.min(4, prev + 1));
    }
  };

  // Collect photos from customSections or use defaults
  const gallerySection = customSections.find((s) => s.contentType === 'gallery');
  const uploadedPhotos = (gallerySection?.galleryPhotos || [])
    .filter((p) => p.imageUrl)
    .map((p) => ({ url: p.imageUrl, caption: p.caption || 'RWTP Impact Moment' }));

  const photos = uploadedPhotos.length > 0 ? uploadedPhotos : DEFAULT_RWTP_GALLERY;

  return (
    <div className="rwtp-page">
      {/* HERO BANNER REDESIGN */}
      <section className="rwtp-hero-container">
        <div className="rwtp-hero-card">
          {/* Background Photo */}
          <img
            src={item.heroImage || 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1600&auto=format&fit=crop&q=80'}
            alt={item.title || 'Rural Women Technology Park'}
            className="rwtp-hero-bg-img"
          />

          {/* Gradient Overlay */}
          <div className="rwtp-hero-overlay-gradient" />

          {/* Top-Left Organic Waves SVG */}
          <svg className="rwtp-hero-waves-tl" width="160" height="160" viewBox="0 0 160 160" fill="none">
            <circle cx="20" cy="20" r="100" fill="#6A8F74" fillOpacity="0.25" />
            <circle cx="20" cy="20" r="65" fill="#3D684D" fillOpacity="0.4" />
          </svg>

          {/* Bottom Center Lime Circle Arc SVG */}
          <svg className="rwtp-hero-arc-bc" width="300" height="200" viewBox="0 0 300 200" fill="none">
            <circle cx="150" cy="180" r="120" stroke="#D8EF86" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.65" />
            <circle cx="150" cy="180" r="150" stroke="#D8EF86" strokeWidth="1" opacity="0.35" />
          </svg>

          {/* Inner Centered Content Wrapper */}
          <div className="rwtp-hero-inner">
            {/* Hero Content */}
            <div className="rwtp-hero-content">
              <div className="rwtp-hero-tag">
                COMMUNITY EMPOWERMENT <span className="rwtp-hero-tag-line" />
              </div>

              <h1 className="rwtp-hero-title">
                Rural Women<br />
                Technology Park – <span className="rwtp-hero-wtp">WTP</span>
              </h1>

              <p className="rwtp-hero-desc">
                Empowering rural women through skill development, technology adoption and innovation to create sustainable livelihoods and stronger, self-reliant communities.
              </p>

              <a href="#stepper" className="rwtp-hero-btn">
                EXPLORE THE INITIATIVES <ArrowRight size={14} />
              </a>

              <div className="rwtp-hero-footer-keywords">
                SKILLS &nbsp;|&nbsp; OPPORTUNITIES &nbsp;|&nbsp; STRONGER COMMUNITIES
              </div>
            </div>
          </div>

          {/* Bottom-Right Curved Patch & Keywords */}
          <div className="rwtp-hero-br-card">
            <svg className="rwtp-hero-br-svg" viewBox="0 0 320 180" fill="none">
              <path d="M100 180 C180 180 230 100 320 50 L320 180 Z" fill="#0E2319" fillOpacity="0.9" />
            </svg>
            <div className="rwtp-hero-br-content">
              <div className="rwtp-hero-br-line" />
              <div className="rwtp-hero-br-list">
                <span>PEOPLE</span>
                <span>SKILLS</span>
                <span>INNOVATION</span>
                <span>BRIGHTER FUTURES</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: ABOUT WTP TOP HEADER BLOCK */}
      <section className="rwtp-about-section">
        <div className="rwtp-about-grid">
          {/* Left light mint card */}
          <div className="rwtp-about-card-left">
            <div className="rwtp-about-tag-badge">
              <Leaf size={16} /> ABOUT WTP
            </div>
            <p className="rwtp-about-text">
              The programme empowers lifelong development access to labs, responsibilities, and the use of technology
              in rural communities, financial services at the households leverages indigenous resources for socio-economic
              impact across the domains of healthcare, education, livelihood, and technology. Corporate Social Responsibility
              initiatives, women's health and nutrition, rural financial and value-added products, and modern village-making ideas.
            </p>
            <svg
              className="rwtp-about-leaf-bg"
              width="120"
              height="120"
              viewBox="0 0 100 100"
              fill="none"
            >
              <path
                d="M20,80 Q50,10 90,20 Q80,60 20,80 Z"
                fill="#29533E"
              />
              <path
                d="M20,80 Q50,45 90,20"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Right dark forest green card */}
          <div className="rwtp-about-card-right">
            <div className="rwtp-pillar-item">
              <div className="rwtp-pillar-icon">
                <GraduationCap size={20} />
              </div>
              <span className="rwtp-pillar-label">SKILLS FOR TODAY</span>
            </div>

            <div className="rwtp-pillar-item">
              <div className="rwtp-pillar-icon">
                <Users size={20} />
              </div>
              <span className="rwtp-pillar-label">LIVELIHOODS FOR TOMORROW</span>
            </div>

            <div className="rwtp-pillar-item">
              <div className="rwtp-pillar-icon">
                <Lightbulb size={20} />
              </div>
              <span className="rwtp-pillar-label">OPPORTUNITIES FOR BRIGHTER VILLAGES</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: GLIMPSES / MOMENTS OF IMPACT */}
      <section className="rwtp-glimpses-section">
        <div className="rwtp-section-header">
          <div>
            <div className="rwtp-glimpses-tag">GLIMPSES</div>
            <h2 className="rwtp-glimpses-title">Moments of Impact</h2>
            <p className="rwtp-glimpses-subtitle">
              Real stories. Real progress. A stronger tomorrow.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="rwtp-glimpses-controls">
              <button
                type="button"
                className="rwtp-nav-btn"
                onClick={() => handleScroll('left')}
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="rwtp-nav-btn"
                onClick={() => handleScroll('right')}
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <a href="#gallery" className="rwtp-view-gallery-btn">
              View Gallery <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Gallery Image Row */}
        <div className="rwtp-gallery-slider" ref={sliderRef} id="gallery">
          {photos.map((photo, index) => (
            <div key={index} className="rwtp-gallery-card">
              <img src={photo.url} alt={photo.caption} loading="lazy" />
            </div>
          ))}
        </div>

        {/* Indicator Bar */}
        <div className="rwtp-slider-indicators">
          <div className={`rwtp-indicator ${activeIndicator === 0 ? 'active' : 'inactive'}`} />
          <div className={`rwtp-indicator ${activeIndicator === 1 ? 'active' : 'inactive'}`} />
          <div className={`rwtp-indicator ${activeIndicator === 2 ? 'active' : 'inactive'}`} />
          <div className={`rwtp-indicator ${activeIndicator === 3 ? 'active' : 'inactive'}`} />
          <div className={`rwtp-indicator ${activeIndicator === 4 ? 'active' : 'inactive'}`} />
        </div>
      </section>

      {/* SECTION 3: STEPPER ACCORDION TIMELINE */}
      <section className="rwtp-stepper-section" id="stepper">
        <div className="rwtp-timeline-wrapper">
          <div className="rwtp-timeline-line" />

          {/* STEP 01: Introduction to Rural WTP */}
          <div className={`rwtp-step-item ${openItems['01'] ? 'is-open' : 'is-collapsed'}`}>
            <button
              type="button"
              className="rwtp-step-number-btn"
              onClick={() => toggleItem('01')}
            >
              01
            </button>
            <div className="rwtp-step-card">
              <div className="rwtp-step-header" onClick={() => toggleItem('01')}>
                <h3 className="rwtp-step-title">Introduction to Rural WTP</h3>
                <div className="rwtp-step-right">
                  <span className="rwtp-step-badge">BUILDING STRONGER COMMUNITIES</span>
                  <button type="button" className="rwtp-toggle-btn" aria-label="Toggle Step 01">
                    {openItems['01'] ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>

              {openItems['01'] && (
                <div className="rwtp-step-content">
                  <div className="rwtp-interventions-grid">
                    {/* Left Column */}
                    <div>
                      <div className="rwtp-intervention-block">
                        <h4 className="rwtp-intervention-title">Production of high value consumer goods</h4>
                        <p className="rwtp-intervention-desc">
                          Here, our graduates do the designing, space and demand; raise benefits of PUCs. There are demonstration areas ways to earthly to counsel skill, ready are identified links gear demonstrate its process and make our scale, stops, of city.. In the diversi are for different consumers for production's with simple products some for empowering livelihoods or incomes.
                        </p>
                      </div>

                      <div className="rwtp-intervention-block">
                        <h4 className="rwtp-intervention-title">Computer Aided Design for Spicing and Notebook Weaving</h4>
                        <p className="rwtp-intervention-desc">
                          We could approach in Art of weaving or make Notebook for Boxes of Standing and stationary at libraries. In this center we have pinoeered the grinding and spill boxes of cutting stewing designs and dress deep and costume sector / traditional of clothing according to the choices and needs of the customers.
                        </p>
                      </div>

                      <div className="rwtp-intervention-block">
                        <h4 className="rwtp-intervention-title">Women Health & Nutrition</h4>
                        <p className="rwtp-intervention-desc">
                          "Small changes can make a large difference" — a healthy balance program that are conducted to engage, educate and encourage. We highlighted our healthy choices and understanding and using a available foods.
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="rwtp-intervention-block">
                        <h4 className="rwtp-intervention-title">Food Processing and Value Added Products</h4>
                        <p className="rwtp-intervention-desc">
                          "HARNESS LE CHANGE". Training modules to provide tools and requirements. The program covers familiarization and uses of equipment for breads, cookies, cakes, chutneys and commercial items etc. Technology doctrine areas of making specialises and creation of allimony products.
                        </p>
                      </div>

                      <div className="rwtp-intervention-block">
                        <h4 className="rwtp-intervention-title">Power Making for Spicing of Modern Rural</h4>
                        <p className="rwtp-intervention-desc">
                          We introduce both the design and introduced to weave the ideas of spicing each paper. The need, our focused on expanding awareness about the household health affects of plastic and casing frame how to make astible bags and solutions of non-conventional uses.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="rwtp-step-summary-paragraph">
                    To maximize product market price through their educated materials without conducting group study, Dept. Pariait, Data. Practical knowledge analyses and marketing techniques used. Though these few activities, women have learned waste or converting mainstream by half filling the waste products made in the landfills and how they can be turned into beautiful usable dresses.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 02: Working Activities & Impact */}
          <div className={`rwtp-step-item ${openItems['02'] ? 'is-open' : 'is-collapsed'}`}>
            <button
              type="button"
              className="rwtp-step-number-btn"
              onClick={() => toggleItem('02')}
            >
              02
            </button>
            <div className="rwtp-step-card">
              <div className="rwtp-step-header" onClick={() => toggleItem('02')}>
                <h3 className="rwtp-step-title">Working Activities & Impact</h3>
                <div className="rwtp-step-right">
                  <span className="rwtp-step-badge">SKILLS THAT CREATE CHANGE</span>
                  <button type="button" className="rwtp-toggle-btn" aria-label="Toggle Step 02">
                    {openItems['02'] ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>

              {openItems['02'] && (
                <div className="rwtp-step-content">
                  <div className="rwtp-activities-table-wrapper">
                    <table className="rwtp-activities-table">
                      <thead>
                        <tr>
                          <th>Training Activity</th>
                          <th>No. of Trainings</th>
                          <th>Beneficiaries</th>
                          <th>SHGs Covered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ruralWomenTechPark.activities.map((act, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600 }}>{act.activity}</td>
                            <td>{act.trainings}</td>
                            <td>{act.beneficiaries}</td>
                            <td>{act.shgs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="rwtp-total-badge">
                    Total Rural Beneficiaries Trained: <strong>{ruralWomenTechPark.activitiesTotalBeneficiaries}+</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 03: Key Highlights */}
          <div className={`rwtp-step-item ${openItems['03'] ? 'is-open' : 'is-collapsed'}`}>
            <button
              type="button"
              className="rwtp-step-number-btn"
              onClick={() => toggleItem('03')}
            >
              03
            </button>
            <div className="rwtp-step-card">
              <div className="rwtp-step-header" onClick={() => toggleItem('03')}>
                <h3 className="rwtp-step-title">Key Highlights</h3>
                <div className="rwtp-step-right">
                  <span className="rwtp-step-badge">MILESTONES THAT MATTER</span>
                  <button type="button" className="rwtp-toggle-btn" aria-label="Toggle Step 03">
                    {openItems['03'] ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>

              {openItems['03'] && (
                <div className="rwtp-step-content">
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, lineHeight: 1.7, color: '#3b5244' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Supported by Department of Science & Technology (DST), Govt. of India</li>
                    <li style={{ marginBottom: '0.5rem' }}>Extensive training network covering over 1200+ rural women across Bhimavaram region</li>
                    <li style={{ marginBottom: '0.5rem' }}>Established self-sustaining micro-enterprises in bakeries, tailoring, and eco-friendly products</li>
                    <li style={{ marginBottom: '0.5rem' }}>Focus on waste paper recycling and indigenous virgin coconut oil processing</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* STEP 04: Facilities & Equipment */}
          <div className={`rwtp-step-item ${openItems['04'] ? 'is-open' : 'is-collapsed'}`}>
            <button
              type="button"
              className="rwtp-step-number-btn"
              onClick={() => toggleItem('04')}
            >
              04
            </button>
            <div className="rwtp-step-card">
              <div className="rwtp-step-header" onClick={() => toggleItem('04')}>
                <h3 className="rwtp-step-title">Facilities & Equipment</h3>
                <div className="rwtp-step-right">
                  <span className="rwtp-step-badge">TOOLS FOR BRIGHTER FUTURES</span>
                  <button type="button" className="rwtp-toggle-btn" aria-label="Toggle Step 04">
                    {openItems['04'] ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>

              {openItems['04'] && (
                <div className="rwtp-step-content">
                  <div className="rwtp-interventions-grid">
                    <div>
                      <h4 className="rwtp-intervention-title">Food Processing & Baking Lab</h4>
                      <p className="rwtp-intervention-desc">Commercial ovens, dough mixers, biomass dryers, and icing workstations.</p>
                    </div>
                    <div>
                      <h4 className="rwtp-intervention-title">CAD Tailoring & Embroidery Unit</h4>
                      <p className="rwtp-intervention-desc">Computerized stitching machines, handlooms, and pattern drafting software.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 05: Outcomes & Achievements */}
          <div className={`rwtp-step-item ${openItems['05'] ? 'is-open' : 'is-collapsed'}`}>
            <button
              type="button"
              className="rwtp-step-number-btn"
              onClick={() => toggleItem('05')}
            >
              05
            </button>
            <div className="rwtp-step-card">
              <div className="rwtp-step-header" onClick={() => toggleItem('05')}>
                <h3 className="rwtp-step-title">Outcomes & Achievements</h3>
                <div className="rwtp-step-right">
                  <span className="rwtp-step-badge">REAL IMPACT, REAL PEOPLE</span>
                  <button type="button" className="rwtp-toggle-btn" aria-label="Toggle Step 05">
                    {openItems['05'] ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              </div>

              {openItems['05'] && (
                <div className="rwtp-step-content">
                  <p className="rwtp-intervention-desc">
                    Over 1400+ rural women and self-help group members have gained sustainable livelihoods, technical independence, and financial inclusion through the technology park initiatives.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: REPORTS CONTAINER */}
      <section className="rwtp-reports-section">
        <div className="rwtp-reports-card">
          <div className="rwtp-reports-left">
            <div className="rwtp-reports-icon-badge">
              <FileText size={24} />
            </div>
            <div>
              <div className="rwtp-reports-tag">REPORTS</div>
              <h2 className="rwtp-reports-title">Report Links</h2>
            </div>
          </div>

          <div className="rwtp-reports-divider" />

          <div className="rwtp-reports-links-list">
            {reportLinks.length > 0 ? (
              reportLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.fileUrl}
                  download
                  className="rwtp-report-link-item"
                >
                  {link.label} <ArrowRight size={16} />
                </a>
              ))
            ) : (
              <>
                <a
                  href="/downloads/rwtp-project-completion-report.pdf"
                  download
                  className="rwtp-report-link-item"
                >
                  Click here for Detailed Report <ArrowRight size={16} />
                </a>
                <a
                  href="/downloads/rwtp-workshop-report.pdf"
                  download
                  className="rwtp-report-link-item"
                >
                  Click here for Important Findings Workshop <ArrowRight size={16} />
                </a>
              </>
            )}
          </div>

          <div className="rwtp-dot-matrix">
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: EXPLORE MORE DIFFERENTIATORS CTA */}
      <section className="rwtp-cta-section">
        {/* Left Side Organic Waves & Lines */}
        <svg className="rwtp-cta-bg-left" viewBox="0 0 450 260" fill="none" preserveAspectRatio="none">
          <path d="M-60 260 C120 260 220 180 180 60 C140 -40 20 -60 -60 -60 Z" fill="#D6E6DA" opacity="0.8" />
          <path d="M-40 20 C120 20 220 120 320 260" stroke="#5A7D67" strokeWidth="1.5" fill="none" opacity="0.7" />
        </svg>

        {/* Right Side Bottom Corner Blob */}
        <svg className="rwtp-cta-bg-right" viewBox="0 0 350 200" fill="none" preserveAspectRatio="none">
          <path d="M100 200 C200 200 350 120 350 0 L350 200 Z" fill="#E2EDE4" opacity="0.85" />
        </svg>

        <div className="rwtp-cta-container">
          <div className="rwtp-cta-main">
            <span className="rwtp-cta-tag">EMPOWERING RURAL WOMEN</span>
            <h2 className="rwtp-cta-title">Explore More Differentiators</h2>
            <p className="rwtp-cta-desc">
              Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.
            </p>
            <div className="rwtp-cta-buttons">
              <Link to="/differentiators" className="rwtp-btn-primary">
                All Differentiators <ArrowRight size={16} />
              </Link>
              <Link to="/admissions" className="rwtp-btn-outline">
                Apply Now
              </Link>
              <Link to="/academics" className="rwtp-btn-outline">
                Academics
              </Link>
            </div>
          </div>

          <div className="rwtp-cta-right-wrapper">
            {/* Cursive script text */}
            <div className="rwtp-cta-script">
              <span className="rwtp-cta-script-line">Stronger</span>
              <span className="rwtp-cta-script-line indent-1">Women</span>
              <span className="rwtp-cta-script-line indent-2">Brighter</span>
              <span className="rwtp-cta-script-line indent-3">Villages</span>
              <svg className="rwtp-cta-script-underline" width="90" height="12" viewBox="0 0 90 12" fill="none">
                <path d="M5 6 Q45 2 85 8" stroke="#8CB899" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Leaf Branch SVG */}
            <svg className="rwtp-cta-leaf-branch" width="110" height="140" viewBox="0 0 110 140" fill="none">
              <path d="M20 135 C35 100 65 55 95 10" stroke="#3B5B44" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M32 110 Q18 92 8 102 Q22 120 32 110 Z" fill="#4A6B53" />
              <path d="M46 88 Q32 70 22 80 Q36 98 46 88 Z" fill="#3B5B44" />
              <path d="M60 65 Q46 47 36 57 Q50 75 60 65 Z" fill="#5A7D65" />
              <path d="M74 42 Q60 24 50 34 Q64 52 74 42 Z" fill="#4A6B53" />
              <path d="M88 19 Q74 4 64 14 Q78 32 88 19 Z" fill="#3B5B44" />
              <path d="M37 105 Q55 92 60 102 Q47 115 37 105 Z" fill="#5A7D65" />
              <path d="M51 82 Q69 69 74 79 Q61 92 51 82 Z" fill="#4A6B53" />
              <path d="M65 58 Q83 45 88 55 Q75 68 65 58 Z" fill="#3B5B44" />
              <path d="M79 35 Q97 22 102 32 Q89 45 79 35 Z" fill="#4A6B53" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
