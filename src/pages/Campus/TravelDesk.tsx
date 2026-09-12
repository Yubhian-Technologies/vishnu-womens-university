import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Clock, Phone, Mail, Ticket, Globe, FileCheck, Compass, GraduationCap, Building, Sparkles, CheckCircle2
} from 'lucide-react';
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
  DEFAULT_TRAVEL_CONTACTS,
  DEFAULT_TRAVEL_ABOUT,
  DEFAULT_TRAVEL_SERVICES,
} from '../Admin/sections/TravelDeskAdmin';
import './TravelDesk.css';

// Default Fallback Photos for Travel Desk
const DEFAULT_TRAVEL_PHOTOS = Array.from({ length: 6 }, (_, i) => ({
  src: PHOTO_NEEDED_PLACEHOLDER,
  alt: `VWU Travel Desk Photo ${i + 1}`,
  caption: `Campus Travel Desk & Ticket Booking Counter`,
}));

const ICON_MAP: Record<string, typeof Ticket> = {
  Ticket,
  Globe,
  Compass,
  Building,
  FileCheck,
  GraduationCap,
  Phone,
  Clock,
  MapPin,
  Sparkles,
};

export default function TravelDesk() {
  const { docs: items } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const adminItem = items.find((i) => i.slug === 'travel-desk');
  const facilityDefault = findCampusFacilityBySlug('travel-desk');

  const photos = useSitePhotos('campus', 'travel-desk', DEFAULT_TRAVEL_PHOTOS);

  // Content Blocks for Travel Desk text editing
  const contactsDocs = useContentBlocks('travel-desk', 'contacts');
  const aboutDocs = useContentBlocks('travel-desk', 'about');
  const serviceDocs = useContentBlocks('travel-desk', 'services');

  const contactsDoc = contactsDocs[0];
  const aboutDoc = aboutDocs[0];

  const contactParts = (contactsDoc?.storagePath || '').split(';;');

  const contactData = {
    location: contactsDoc?.title || DEFAULT_TRAVEL_CONTACTS.location,
    locationSub: contactsDoc?.slug || DEFAULT_TRAVEL_CONTACTS.locationSub,
    timings: contactsDoc?.value || DEFAULT_TRAVEL_CONTACTS.timings,
    timingsSub: contactsDoc?.desc || DEFAULT_TRAVEL_CONTACTS.timingsSub,
    phone: contactsDoc?.icon || DEFAULT_TRAVEL_CONTACTS.phone,
    email: contactParts[0] || DEFAULT_TRAVEL_CONTACTS.email,
    partner: contactParts[1] || DEFAULT_TRAVEL_CONTACTS.partner,
  };

  const aboutData = {
    badge: aboutDoc?.value || DEFAULT_TRAVEL_ABOUT.badge,
    title: aboutDoc?.title || DEFAULT_TRAVEL_ABOUT.title,
    subtitle: aboutDoc?.slug || DEFAULT_TRAVEL_ABOUT.subtitle,
    paragraphs: aboutDoc?.desc ? aboutDoc.desc.split('\n\n') : [DEFAULT_TRAVEL_ABOUT.paragraph1, DEFAULT_TRAVEL_ABOUT.paragraph2],
    timingMonSat: aboutDoc?.icon || DEFAULT_TRAVEL_ABOUT.timingMonSat,
    timingSun: aboutDoc?.storagePath || DEFAULT_TRAVEL_ABOUT.timingSun,
  };

  const servicesList = serviceDocs.length > 0
    ? serviceDocs.map((s) => ({
        icon: ICON_MAP[s.icon || 'Ticket'] || Ticket,
        title: s.title,
        desc: s.desc,
      }))
    : DEFAULT_TRAVEL_SERVICES.map((s) => ({
        icon: ICON_MAP[s.icon] || Ticket,
        title: s.title,
        desc: s.desc,
      }));

  const title = adminItem?.title || facilityDefault?.title || 'Travel Desk';
  const subtitle = adminItem?.desc || facilityDefault?.heroSubtitle || 'Convenient Travel Support for Local and Outstation Journeys.';
  const customSections = (adminItem?.customSections || []).filter(hasCustomSectionContent);

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
                    <div className="td-pill-val">{contactData.location}</div>
                    <div className="td-pill-lbl">{contactData.locationSub}</div>
                  </div>
                </div>

                <div className="td-pill">
                  <div className="td-pill-icon"><Clock size={18} /></div>
                  <div>
                    <div className="td-pill-val">{contactData.timings}</div>
                    <div className="td-pill-lbl">{contactData.timingsSub}</div>
                  </div>
                </div>

                <div className="td-pill">
                  <div className="td-pill-icon"><Phone size={18} /></div>
                  <div>
                    <div className="td-pill-val">{contactData.phone}</div>
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
            <div className="td-badge">{aboutData.badge}</div>
            <h2 className="td-section-title">
              {aboutData.title}
            </h2>
            <p className="td-section-subtitle">
              {aboutData.subtitle}
            </p>
          </div>

          <div className="td-about-card">
            <div className="td-about-main">
              {aboutData.paragraphs.map((p, idx) => (
                <p key={idx} className="td-about-paragraph">
                  {p}
                </p>
              ))}
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
                    <span className="td-timing-time">{aboutData.timingMonSat}</span>
                  </div>
                  <div className="td-timing-row">
                    <span className="td-timing-day">Sundays:</span>
                    <span className="td-timing-time">{aboutData.timingSun}</span>
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
                    <a href={`tel:${contactData.phone.replace(/\s+/g, '')}`}>{contactData.phone}</a>
                  </div>
                  <div className="td-contact-item">
                    <Mail size={16} />
                    <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
                  </div>
                  <div className="td-partner-tag">
                    Partner: <strong>{contactData.partner}</strong>
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
            {servicesList.map((s, idx) => {
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

      {/* Optional Custom Sections from Admin */}
      {customSections.length > 0 && (
        <section className="td-section">
          <div className="td-container">
            <CustomSectionsRenderer sections={customSections} />
          </div>
        </section>
      )}

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

