import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Clock, Phone, Mail, Ticket, Globe, FileCheck, Compass, GraduationCap, Building, Sparkles, CheckCircle2
} from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import type { CampusLifeItemDoc } from '../Admin/sections/CampusLifeAdmin';
import './TravelDesk.css';

// Default Fallback Photos for Travel Desk
const DEFAULT_TRAVEL_PHOTOS = Array.from({ length: 6 }, (_, i) => ({
  src: PHOTO_NEEDED_PLACEHOLDER,
  alt: `VWU Travel Desk Photo ${i + 1}`,
  caption: `Campus Travel Desk & Ticket Booking Counter`,
}));

const SERVICES = [
  {
    icon: Ticket,
    title: 'Ticket Bookings',
    desc: 'Hassle-free reservations for Bus, Train, and Flight tickets for local and outstation journeys.',
  },
  {
    icon: Globe,
    title: 'Passport & Visa Assistance',
    desc: 'Complete documentation support and guidance for new passport applications and visa processing.',
  },
  {
    icon: Compass,
    title: 'Holiday Packages',
    desc: 'Customized vacation and holiday packages designed for individuals, families, and student groups.',
  },
  {
    icon: Building,
    title: 'Hotel Bookings',
    desc: 'Verified hotel reservations and budget-friendly stay arrangements across major destinations.',
  },
  {
    icon: FileCheck,
    title: 'Attestation Services',
    desc: 'Professional document verification and attestation support for official travel requirements.',
  },
  {
    icon: GraduationCap,
    title: 'Overseas Education Guidance',
    desc: 'Expert guidance for international travel, university visits, and overseas education procedures.',
  },
];

export default function TravelDesk() {
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = items.find((i) => i.slug === 'travel-desk');
  const facilityDefault = findCampusFacilityBySlug('travel-desk');

  const photos = useSitePhotos('campus', 'travel-desk', DEFAULT_TRAVEL_PHOTOS);

  const title = adminItem?.title || facilityDefault?.title || 'Travel Desk';
  const subtitle = adminItem?.desc || facilityDefault?.heroSubtitle || 'Convenient Travel Support for Local and Outstation Journeys.';

  useEffect(() => {
    document.title = `${title} | Campus Life | VWU`;
  }, [title]);

  return (
    <main className="travel-desk-page">
      <PageHero
        page="campus-travel-desk"
        defaultTitle={title}
        defaultSubtitle={subtitle}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: title },
        ]}
        hideCta={true}
      />

      {/* Hero Intro Banner */}
      <section className="td-hero">
        <div className="td-container">
          <div className="td-hero-grid">
            <div className="td-hero-content">
              <div className="td-badge">
                <Sparkles size={14} />
                <span>ON-CAMPUS TRAVEL FACILITY</span>
              </div>
              <h1 className="td-hero-title">
                Campus <span className="td-hero-highlight">Travel Desk</span>
              </h1>
              <p className="td-hero-subtitle">
                {subtitle}
              </p>

              {/* Quick Highlight Pills */}
              <div className="td-hero-pills">
                <div className="td-pill">
                  <div className="td-pill-icon"><MapPin size={18} /></div>
                  <div>
                    <div className="td-pill-val">Opposite Central Square</div>
                    <div className="td-pill-lbl">Adjacent to ICICI ATM</div>
                  </div>
                </div>

                <div className="td-pill">
                  <div className="td-pill-icon"><Clock size={18} /></div>
                  <div>
                    <div className="td-pill-val">4:00 PM – 7:00 PM</div>
                    <div className="td-pill-lbl">Daily & Sunday Hours</div>
                  </div>
                </div>

                <div className="td-pill">
                  <div className="td-pill-icon"><Phone size={18} /></div>
                  <div>
                    <div className="td-pill-val">9624 123 123</div>
                    <div className="td-pill-lbl">Direct Helpline</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="td-hero-img-box">
              <img
                src={photos[0]?.src || PHOTO_NEEDED_PLACEHOLDER}
                alt="VWU Travel Desk"
                className="td-hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Key Info Cards */}
      <section className="td-section">
        <div className="td-container">
          <div className="td-section-header">
            <div className="td-badge">CONVENIENT SERVICES</div>
            <h2 className="td-section-title">
              About the <span>Travel Desk</span>
            </h2>
            <p className="td-section-subtitle">
              Designed to simplify travel and documentation needs for students, faculty, and staff.
            </p>
          </div>

          <div className="td-about-card">
            <div className="td-about-main">
              <p className="td-about-paragraph">
                A dedicated Travel Desk is now available on campus, conveniently located opposite Central Square and adjacent to the ICICI ATM. It offers a wide range of services including ticket bookings (bus, train, air), passport and visa assistance, holiday packages, hotel bookings, attestation services, and overseas education guidance.
              </p>
              <p className="td-about-paragraph">
                This facility is designed to simplify travel and documentation needs for students, faculty, and staff, ensuring safe, hassle-free journey planning without needing to leave the campus.
              </p>
            </div>

            {/* Timings & Contact Info Box */}
            <div className="td-info-sidebar">
              <div className="td-info-box">
                <div className="td-info-header">
                  <Clock size={20} className="td-info-icon" />
                  <h3>Working Hours</h3>
                </div>
                <div className="td-info-body">
                  <div className="td-timing-row">
                    <span className="td-timing-day">Monday – Saturday:</span>
                    <span className="td-timing-time">4:00 PM to 7:00 PM</span>
                  </div>
                  <div className="td-timing-row">
                    <span className="td-timing-day">Sundays:</span>
                    <span className="td-timing-time">11:00 AM to 7:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="td-info-box">
                <div className="td-info-header">
                  <Phone size={20} className="td-info-icon" />
                  <h3>Out of Hours Assistance</h3>
                </div>
                <div className="td-info-body">
                  <div className="td-contact-item">
                    <Phone size={16} />
                    <a href="tel:9624123123">9624 123 123</a>
                  </div>
                  <div className="td-contact-item">
                    <Mail size={16} />
                    <a href="mailto:support@ushodayaholidays.in">support@ushodayaholidays.in</a>
                  </div>
                  <div className="td-partner-tag">
                    Partner: <strong>Ushodaya Holidays</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="td-section td-services-section">
        <div className="td-container">
          <div className="td-section-header">
            <div className="td-badge">SERVICE SPECTRUM</div>
            <h2 className="td-section-title">
              Services <span>Offered</span>
            </h2>
            <p className="td-section-subtitle">
              Comprehensive travel booking, documentation, and advisory support at your fingertips.
            </p>
          </div>

          <div className="td-services-grid">
            {SERVICES.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="td-service-card">
                  <div className="td-service-icon-box">
                    <Icon size={24} />
                  </div>
                  <h3 className="td-service-title">{s.title}</h3>
                  <p className="td-service-desc">{s.desc}</p>
                  <div className="td-service-check">
                    <CheckCircle2 size={16} />
                    <span>On-Campus Assistance</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="td-section td-gallery-section">
        <div className="td-container">
          <PhotoGrid
            images={photos}
            title="Travel Desk Gallery"
            label="GALLERY SHOWCASE"
            subtitle="Glimpses of the campus travel counter and travel assistance services."
          />
        </div>
      </section>

      {/* Explore More Footer CTA */}
      <section className="td-cta-section">
        <div className="td-container">
          <h2>Explore More Campus Life Facilities</h2>
          <p>Discover our central library, hosteller amenities, health care, and sports centers across the VWU campus.</p>
          <div className="td-cta-buttons">
            <Link to="/campus" className="td-btn td-btn-gold">Back to Campus Life</Link>
            <Link to="/contact" className="td-btn td-btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
