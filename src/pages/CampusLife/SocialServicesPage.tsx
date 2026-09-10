import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Users, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Building2, 
  Stethoscope, 
  Star, 
  ShieldCheck, 
  BookOpen, 
  Activity, 
  Leaf 
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import { smoothScrollTo } from '../../lib/smoothScroll';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import './SocialServicesPage.css';

const DEFAULT_PHOTOS = [
  { src: '/images/vibrant-campus.png', alt: 'NSS Social Services Community Outreach' },
  { src: '/images/1000074551.jpg', alt: 'VWU Students Planting Trees' }
];

export default function SocialServicesPage() {
  // Real-time Firestore subscription to campusLifeItems collection
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const firestoreDoc = items.find((i) => i.slug === 'social-services');
  
  // Real-time site photos subscription from Firestore /admin → Site Photos
  const photos = useSitePhotos('campus', 'social-services', DEFAULT_PHOTOS);

  useEffect(() => {
    const title = firestoreDoc?.title ? `${firestoreDoc.title} | VWU` : "Social Services & NSS | Vishnu Women's University";
    document.title = title;
  }, [firestoreDoc]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      smoothScrollTo(top);
    }
  };

  const heroBg = photos[0]?.src || '/images/vibrant-campus.png';
  const plantingImg = photos[1]?.src || '/images/1000074551.jpg';

  return (
    <main className="ss-page page-wrapper">
      <SEO
        title={firestoreDoc?.title ? `${firestoreDoc.title} | Vishnu Women's University` : "Social Services & NSS | Vishnu Women's University"}
        description="The National Service Scheme at VWU shapes engineers who are equally committed to their craft and to the communities they serve."
      />

      {/* ====================================================================
          1. HERO BANNER
          ==================================================================== */}
      <section className="ss-hero-container" style={{ backgroundImage: `url('${heroBg}')` }}>
        <div className="ss-hero-overlay" />
        
        <div className="ss-hero-content">
          {/* Badge */}
          <div className="ss-hero-badge">
            VIT SOCIAL SERVICE
          </div>

          {/* H1 Heading */}
          <h1 className="ss-hero-title">
            {firestoreDoc?.title || "Extending Education."}
            <span>Empowering Communities.</span>
          </h1>

          {/* Subtitle */}
          <p className="ss-hero-sub">
            {firestoreDoc?.desc || "Through NSS and community initiatives, our students turn knowledge into meaningful action."}
          </p>

          {/* Buttons */}
          <div className="ss-hero-btns">
            <button 
              onClick={() => handleScrollTo('communities-serve')} 
              className="ss-btn-gold"
            >
              Explore Our Initiatives <ArrowRight size={17} />
            </button>
            <Link to="/news-awards/gallery" className="ss-btn-outline-white">
              View Gallery <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Translucent Highlights Bar */}
        <div className="ss-hero-bar">
          <div className="ss-hero-bar-grid">
            <div className="ss-bar-item">
              <div className="ss-bar-icon">
                <Users size={24} />
              </div>
              <div className="ss-bar-text">
                <h4>Community Outreach</h4>
                <p>Stronger communities, brighter futures</p>
              </div>
            </div>

            <div className="ss-bar-item">
              <div className="ss-bar-icon">
                <GraduationCap size={24} />
              </div>
              <div className="ss-bar-text">
                <h4>Student Volunteers</h4>
                <p>Building skills, creating impact</p>
              </div>
            </div>

            <div className="ss-bar-item">
              <div className="ss-bar-icon">
                <Sparkles size={24} />
              </div>
              <div className="ss-bar-text">
                <h4>Social Initiatives</h4>
                <p>Education | Health | Awareness</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. NSS AT VWU SECTION
          ==================================================================== */}
      <section className="ss-nss-section">
        <div className="ss-section-inner">
          <div className="ss-nss-grid">
            {/* Left: Tree Planting Photo */}
            <div className="ss-nss-img-box">
              <img 
                src={plantingImg} 
                alt="VWU Students Planting Sapling in NSS Drive"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/vibrant-campus.png';
                }}
              />
            </div>

            {/* Right: Text & Quote */}
            <div className="ss-nss-content">
              <span className="ss-pill-tag">NSS AT VWU</span>
              <h2 className="ss-nss-title">
                Serving the Nation<br />Through Education
              </h2>

              <div className="ss-nss-text">
                <p>
                  National integrity should flow from the heart of every citizen. Apart from academics, every student must involve in serving her country.
                </p>
                <p>
                  At VWU, the National Service Scheme (NSS) is a meaningful part of student formation. The programme rests on the conviction that “Education and Service to the community and by the community” is the true basis of a complete education.
                </p>
                <p>
                  Through NSS, students take part in nation-building work, strengthen their interpersonal abilities, and help foster a Technocratic Environment in rural communities — continuing the humanitarian values that our founder Dr. B. V. Raju embodied throughout his life.
                </p>
              </div>

              {/* Quote Box */}
              <div className="ss-nss-quote-box">
                <span className="ss-quote-mark">“</span>
                <p className="ss-quote-content">
                  “Education and Service to the community and by the community.”
                </p>
              </div>

              <button 
                onClick={() => handleScrollTo('founder-legacy')} 
                className="ss-btn-navy"
              >
                Learn More <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. COMMUNITIES WE SERVE SECTION
          ==================================================================== */}
      <section className="ss-nss-section" id="communities-serve">
        <div className="ss-section-inner">
          <div className="ss-section-title-wrap">
            <h2 className="ss-main-title">Communities We Serve</h2>
            <p className="ss-main-sub">
              Our students actively contribute to communities through education, healthcare, awareness and outreach.
            </p>
          </div>

          <div className="ss-cards-grid">
            {/* Card 1: Rural Students */}
            <div className="ss-card">
              <div className="ss-card-img-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop" 
                  alt="Rural Students"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/vibrant-campus.png'; }}
                />
                <div className="ss-card-icon-badge">
                  <GraduationCap size={22} />
                </div>
              </div>
              <div className="ss-card-body">
                <h3 className="ss-card-title">Rural Students</h3>
                <p className="ss-card-desc">
                  Extending educational support and skills programs to economically disadvantaged students from rural backgrounds.
                </p>
              </div>
            </div>

            {/* Card 2: Leprosy Care */}
            <div className="ss-card">
              <div className="ss-card-img-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop" 
                  alt="Leprosy Care"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/campusview.jpg'; }}
                />
                <div className="ss-card-icon-badge">
                  <Heart size={22} />
                </div>
              </div>
              <div className="ss-card-body">
                <h3 className="ss-card-title">Leprosy Care</h3>
                <p className="ss-card-desc">
                  Offering care, compassion, and dignity to individuals affected by leprosy through regular visits and welfare activities.
                </p>
              </div>
            </div>

            {/* Card 3: Village Communities */}
            <div className="ss-card">
              <div className="ss-card-img-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop" 
                  alt="Village Communities"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/SLS01311.JPG'; }}
                />
                <div className="ss-card-icon-badge">
                  <Building2 size={22} />
                </div>
              </div>
              <div className="ss-card-body">
                <h3 className="ss-card-title">Village Communities</h3>
                <p className="ss-card-desc">
                  Working with nearby villages on technical literacy, nutritional awareness, and broader community welfare initiatives.
                </p>
              </div>
            </div>

            {/* Card 4: Persons with Disabilities */}
            <div className="ss-card">
              <div className="ss-card-img-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=600&auto=format&fit=crop" 
                  alt="Persons with Disabilities"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/vibrant-campus.png'; }}
                />
                <div className="ss-card-icon-badge">
                  <Activity size={22} />
                </div>
              </div>
              <div className="ss-card-body">
                <h3 className="ss-card-title">Persons with Disabilities</h3>
                <p className="ss-card-desc">
                  Supporting individuals with physical disabilities through awareness programs, assistive technology exposure, and inclusive campus activities.
                </p>
              </div>
            </div>

            {/* Card 5: Hospital Patients */}
            <div className="ss-card">
              <div className="ss-card-img-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop" 
                  alt="Hospital Patients"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/campusview.jpg'; }}
                />
                <div className="ss-card-icon-badge">
                  <Stethoscope size={22} />
                </div>
              </div>
              <div className="ss-card-body">
                <h3 className="ss-card-title">Hospital Patients</h3>
                <p className="ss-card-desc">
                  Serving hospital patients through welfare visits, blood donation drives, and coordination with partner organisations.
                </p>
              </div>
            </div>

            {/* Card 6: Academic Excellence */}
            <div className="ss-card">
              <div className="ss-card-img-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop" 
                  alt="Academic Excellence"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/SLS01311.JPG'; }}
                />
                <div className="ss-card-icon-badge">
                  <Star size={22} />
                </div>
              </div>
              <div className="ss-card-body">
                <h3 className="ss-card-title">Academic Excellence</h3>
                <p className="ss-card-desc">
                  Acknowledging and supporting high-achieving students from nearby institutions through mentoring and motivational programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. OUR CORE VALUES SECTION (01 - 06 Grid)
          ==================================================================== */}
      <section className="ss-values-section">
        <div className="ss-section-inner">
          <div className="ss-section-title-wrap">
            <h2 className="ss-main-title">Our Core Values</h2>
          </div>

          <div className="ss-values-grid-6">
            {/* 01: Not Me But You */}
            <div className="ss-value-item">
              <span className="ss-value-num">01</span>
              <div className="ss-value-icon-circle c-1">
                <HeartHandshake size={24} />
              </div>
              <h3 className="ss-value-name">Not Me But You</h3>
              <p className="ss-value-sub">Selfless service for better tomorrow.</p>
            </div>

            {/* 02: Service Before Self */}
            <div className="ss-value-item">
              <span className="ss-value-num">02</span>
              <div className="ss-value-icon-circle c-2">
                <ShieldCheck size={24} />
              </div>
              <h3 className="ss-value-name">Service Before Self</h3>
              <p className="ss-value-sub">Putting community needs first.</p>
            </div>

            {/* 03: Education Through Community */}
            <div className="ss-value-item">
              <span className="ss-value-num">03</span>
              <div className="ss-value-icon-circle c-3">
                <BookOpen size={24} />
              </div>
              <h3 className="ss-value-name">Education Through Community</h3>
              <p className="ss-value-sub">Learning, sharing, growing together.</p>
            </div>

            {/* 04: Nation Building Through Youth */}
            <div className="ss-value-item">
              <span className="ss-value-num">04</span>
              <div className="ss-value-icon-circle c-4">
                <Users size={24} />
              </div>
              <h3 className="ss-value-name">Nation Building Through Youth</h3>
              <p className="ss-value-sub">Empowered youth, for a stronger nation.</p>
            </div>

            {/* 05: Inclusive Development */}
            <div className="ss-value-item">
              <span className="ss-value-num">05</span>
              <div className="ss-value-icon-circle c-5">
                <Users size={24} />
              </div>
              <h3 className="ss-value-name">Inclusive Development</h3>
              <p className="ss-value-sub">Equal opportunities for all.</p>
            </div>

            {/* 06: Rural Empowerment */}
            <div className="ss-value-item">
              <span className="ss-value-num">06</span>
              <div className="ss-value-icon-circle c-6">
                <Leaf size={24} />
              </div>
              <h3 className="ss-value-name">Rural Empowerment</h3>
              <p className="ss-value-sub">Stronger villages, brighter futures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. FOUNDER'S LEGACY SECTION (Dr. B. V. Raju Foundation)
          ==================================================================== */}
      <section className="ss-legacy-section" id="founder-legacy">
        <div className="ss-section-inner">
          <div className="ss-legacy-card-grid">
            {/* Left: Founder Photo with Quote Overlay */}
            <div className="ss-founder-img-box">
              <img 
                src="/images/governing-body-founder.jpg" 
                alt="Padma Bhushan Dr. B. V. Raju"
              />
              <div className="ss-founder-overlay">
                <p className="ss-founder-quote-text">
                  “Service to humanity is the highest form of education.”
                </p>
                <p className="ss-founder-name">- Dr. B. V. Raju</p>
              </div>
            </div>

            {/* Right: Content */}
            <div className="ss-legacy-text">
              <span className="ss-pill-tag">FOUNDER'S LEGACY</span>
              <h2 className="ss-nss-title">Dr. B. V. Raju Foundation</h2>
              <p>
                VWU's ethos of service has deep roots in the life of our founder, the late Padma Bhushan Dr. B. V. Raju, who devoted his later years to humanitarian causes — building leprosy care centres, schools, women's associations, community halls, and veterinary facilities in surrounding villages, all without government support.
              </p>
              <p>
                The Dr. B. V. Raju Foundation continues this tradition today. VWU students take an active part in this mission, channelling their technical knowledge, empathy, and sense of purpose into communities that genuinely need both.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
