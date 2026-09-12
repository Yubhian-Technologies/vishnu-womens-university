import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink, ChevronDown, Navigation } from 'lucide-react';
import { useSiteContact, telHref } from '../../hooks/useSiteContact';
import { InstagramIcon, FacebookIcon, TwitterIcon, LinkedInIcon, YouTubeIcon } from './SocialIcons';
import SmoothCollapse from '../SmoothCollapse/SmoothCollapse';
import './Footer.css';

/* -------------------------------------------------------------------------- */
/* Static Data & Navigation Structures                                        */
/* -------------------------------------------------------------------------- */

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'http://instagram.com/vishnu_svecw/', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/svecwcollege', Icon: FacebookIcon },
  { label: 'Twitter / X', href: 'https://twitter.com/svecw2', Icon: TwitterIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/school/vishnusvecw/', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@SVECW-B0', Icon: YouTubeIcon },
];

const UNIVERSITY_LINKS: { label: string; href: string; disabled?: boolean; external?: boolean }[] = [
  { label: 'About VWU', href: '/about' },
  { label: 'Governance & Leadership', href: '/governance', disabled: true },
  { label: 'Campus Facilities', href: '/campus-facilities', disabled: true },
  { label: 'Careers at VWU', href: '/careers' },
  { label: 'Alumni', href: 'https://alumni.srivishnu.edu.in/', external: true },
  { label: 'Contact Us', href: '/contact' },
];

const ACADEMIC_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'Academic Programmes', href: '/academics' },
  { label: 'Fee Structure', href: '/programmes-fee-structure' },
  { label: 'Examinations Portal', href: 'https://www.svecwexams.in/', external: true },
  { label: 'Vishnu LMS', href: 'https://www.vishnulearning.com/login/index.php', external: true },
  { label: 'Vishnu Tech Hub', href: 'https://www.vishnutechhub.in/', external: true },
  { label: 'VEDIC Learning Center', href: 'https://vedic.edu.in/', external: true },
  { label: 'Vishnu Era Magazine', href: 'https://www.srivishnu.edu.in/vishnu-era/', external: true },
  { label: 'Pratibha Magazine', href: 'https://heyzine.com/flip-book/088b7b5629.html', external: true },
  { label: 'Global Alumni Portal', href: 'https://alumni.srivishnu.edu.in/', external: true },
];

const STUDENT_SERVICE_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'Student Life & Clubs', href: '/student-life' },
  { label: "Vishnu's Wellness Center", href: 'https://vishnuwellness.in/', external: true },
  { label: "Students' Feedback", href: 'https://forms.gle/UuURnxKUZw7wW1NW9', external: true },
  { label: "Parents' Feedback", href: 'https://forms.gle/eT2QF3WNJZDwpEzj8', external: true },
  { label: "Faculty's Feedback", href: 'https://forms.gle/K89PMmjNbJNGSVEa9', external: true },
  { label: 'AICTE Feedback Facility', href: '/aicte-feedback-facility' },
];

const COMPLIANCE_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'Infrastructure & Facilities', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWCollegeFeePayment.pdf?alt=media&token=196d3e64-8e1b-4d11-963e-7363c9be4000' },
  { label: 'Institutional Data', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWAuditStatements.pdf?alt=media&token=949e45f9-c171-404a-8578-9c5b0114f92f' },
  { label: 'College Fee Payment', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWCollegeFeePayment.pdf?alt=media&token=196d3e64-8e1b-4d11-963e-7363c9be4000' },
  { label: 'Hostel Fee Payment', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWHostelFeePayment.pdf?alt=media&token=166d9223-5e4e-4a56-918e-45e9f32243c1' },
  { label: 'Building Plans', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWBuildingPlans.pdf?alt=media&token=6652dd95-c77b-4fe0-9535-326db47e485e' },
  { label: 'Structural Stability', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWStructuralStability.pdf?alt=media&token=e88445e0-448e-4009-bb72-a3bde520bb2b' },
  { label: 'Land Use Certificate', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWLandUseCertificate.pdf?alt=media&token=351b20dd-fe3d-44ee-b382-f60ecb644dc0' },
  { label: 'Land Conversion Certificate', href: 'https://svecw.edu.in/wp-content/uploads/2024/07/SVECWLandConversion.pdf', external: true },
];

const LEGAL_LINKS = [
  { label: 'Policies & Procedures', href: '/policies-procedures' },
  { label: 'Anti-Ragging Policy', href: '/anti-ragging' },
  { label: 'Disclosures – UGC', href: '/disclosures/ugc' },
  { label: 'Contact Us', href: '/contact' },
];

/* -------------------------------------------------------------------------- */
/* Main Footer Component                                                      */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const accordionBaseId = useId();
  const { phone, email } = useSiteContact();

  const [openMobileSections, setOpenMobileSections] = useState<Set<string>>(new Set());

  const toggleMobileSection = (sectionKey: string) => {
    setOpenMobileSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  };

  const renderNavLink = (item: { label: string; href: string; disabled?: boolean; external?: boolean }) => {
    if (item.disabled) {
      return (
        <span className="vwu-footer-link is-muted" aria-disabled="true">
          {item.label}
        </span>
      );
    }
    if (item.external) {
      return (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="vwu-footer-link has-icon">
          <span>{item.label}</span>
          <ExternalLink size={11} className="vwu-footer-ext-icon" aria-hidden="true" />
        </a>
      );
    }
    return (
      <Link to={item.href} className="vwu-footer-link">
        {item.label}
      </Link>
    );
  };

  return (
    <footer className="vwu-footer" role="contentinfo">
      {/* ─── MAIN TIER ─── */}
      <div className="vwu-footer-main">
        <div className="vwu-footer-inner">
          {/* Brand Block */}
          <div className="vwu-footer-brand">
            <Link to="/" className="vwu-footer-logo-link" aria-label="Vishnu Women's University Home">
              <img
                src="/images/footer-logo.png"
                alt="Vishnu Women's University"
                className="vwu-footer-logo"
                loading="lazy"
              />
            </Link>

            <h2 className="vwu-footer-uni-name">విష్ణు మహిళా విశ్వవిద్యాలయం</h2>
            <p className="vwu-footer-mission">
              Empowering women scholars through excellence in engineering education,
              interdisciplinary research, and transformative leadership.
            </p>

            <address className="vwu-footer-address">
              <div className="vwu-footer-addr-row">
                <MapPin size={14} className="vwu-footer-addr-icon" aria-hidden="true" />
                <span>Bhimavaram, West Godavari Dist.,<br />Andhra Pradesh – 534 202</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=16.568119,81.522098"
                target="_blank"
                rel="noopener noreferrer"
                className="vwu-footer-directions"
              >
                <Navigation size={12} aria-hidden="true" />
                <span>Get Directions</span>
              </a>
              <div className="vwu-footer-addr-row">
                <Phone size={14} className="vwu-footer-addr-icon" aria-hidden="true" />
                <a href={telHref(phone)} className="vwu-footer-contact-link">{phone}</a>
              </div>
              <div className="vwu-footer-addr-row">
                <Mail size={14} className="vwu-footer-addr-icon" aria-hidden="true" />
                <a href={`mailto:${email}`} className="vwu-footer-contact-link">{email}</a>
              </div>
            </address>
          </div>

          {/* Navigation Columns */}
          <nav className="vwu-footer-nav" aria-label="Footer navigation">
            <div className="vwu-footer-col">
              <h3 className="vwu-footer-heading">University</h3>
              <ul className="vwu-footer-list" role="list">
                {UNIVERSITY_LINKS.map((item) => (
                  <li key={item.label}>{renderNavLink(item)}</li>
                ))}
              </ul>
            </div>

            <div className="vwu-footer-col">
              <h3 className="vwu-footer-heading">Academics &amp; Portals</h3>
              <ul className="vwu-footer-list" role="list">
                {ACADEMIC_LINKS.map((item) => (
                  <li key={item.label}>{renderNavLink(item)}</li>
                ))}
              </ul>
            </div>

            <div className="vwu-footer-col">
              <h3 className="vwu-footer-heading">Student Life &amp; Services</h3>
              <ul className="vwu-footer-list" role="list">
                {STUDENT_SERVICE_LINKS.map((item) => (
                  <li key={item.label}>{renderNavLink(item)}</li>
                ))}
              </ul>
            </div>

            <div className="vwu-footer-col">
              <h3 className="vwu-footer-heading">Compliance &amp; Disclosures</h3>
              <ul className="vwu-footer-list" role="list">
                {COMPLIANCE_LINKS.map((item) => (
                  <li key={item.label}>{renderNavLink(item)}</li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* ─── MOBILE ACCORDIONS ─── */}
      <div className="vwu-footer-mobile">
        <div className="vwu-footer-inner">
          {/* University */}
          <div className="vwu-footer-acc">
            <button
              type="button"
              className="vwu-footer-acc-btn"
              onClick={() => toggleMobileSection('university')}
              aria-expanded={openMobileSections.has('university')}
              aria-controls={`${accordionBaseId}-uni`}
            >
              <span>University</span>
              <ChevronDown size={16} className={`vwu-footer-acc-chevron${openMobileSections.has('university') ? ' open' : ''}`} aria-hidden="true" />
            </button>
            <SmoothCollapse open={openMobileSections.has('university')}>
              <div id={`${accordionBaseId}-uni`} className="vwu-footer-acc-body">
                <ul className="vwu-footer-list" role="list">
                  {UNIVERSITY_LINKS.map((item) => (
                    <li key={item.label}>{renderNavLink(item)}</li>
                  ))}
                </ul>
              </div>
            </SmoothCollapse>
          </div>

          {/* Academics */}
          <div className="vwu-footer-acc">
            <button
              type="button"
              className="vwu-footer-acc-btn"
              onClick={() => toggleMobileSection('academics')}
              aria-expanded={openMobileSections.has('academics')}
              aria-controls={`${accordionBaseId}-acad`}
            >
              <span>Academics &amp; Portals</span>
              <ChevronDown size={16} className={`vwu-footer-acc-chevron${openMobileSections.has('academics') ? ' open' : ''}`} aria-hidden="true" />
            </button>
            <SmoothCollapse open={openMobileSections.has('academics')}>
              <div id={`${accordionBaseId}-acad`} className="vwu-footer-acc-body">
                <ul className="vwu-footer-list" role="list">
                  {ACADEMIC_LINKS.map((item) => (
                    <li key={item.label}>{renderNavLink(item)}</li>
                  ))}
                </ul>
              </div>
            </SmoothCollapse>
          </div>

          {/* Student Life */}
          <div className="vwu-footer-acc">
            <button
              type="button"
              className="vwu-footer-acc-btn"
              onClick={() => toggleMobileSection('services')}
              aria-expanded={openMobileSections.has('services')}
              aria-controls={`${accordionBaseId}-serv`}
            >
              <span>Student Life &amp; Services</span>
              <ChevronDown size={16} className={`vwu-footer-acc-chevron${openMobileSections.has('services') ? ' open' : ''}`} aria-hidden="true" />
            </button>
            <SmoothCollapse open={openMobileSections.has('services')}>
              <div id={`${accordionBaseId}-serv`} className="vwu-footer-acc-body">
                <ul className="vwu-footer-list" role="list">
                  {STUDENT_SERVICE_LINKS.map((item) => (
                    <li key={item.label}>{renderNavLink(item)}</li>
                  ))}
                </ul>
              </div>
            </SmoothCollapse>
          </div>

          {/* Compliance */}
          <div className="vwu-footer-acc">
            <button
              type="button"
              className="vwu-footer-acc-btn"
              onClick={() => toggleMobileSection('compliance')}
              aria-expanded={openMobileSections.has('compliance')}
              aria-controls={`${accordionBaseId}-comp`}
            >
              <span>Compliance &amp; Disclosures</span>
              <ChevronDown size={16} className={`vwu-footer-acc-chevron${openMobileSections.has('compliance') ? ' open' : ''}`} aria-hidden="true" />
            </button>
            <SmoothCollapse open={openMobileSections.has('compliance')}>
              <div id={`${accordionBaseId}-comp`} className="vwu-footer-acc-body">
                <ul className="vwu-footer-list" role="list">
                  {COMPLIANCE_LINKS.map((item) => (
                    <li key={item.label}>{renderNavLink(item)}</li>
                  ))}
                </ul>
              </div>
            </SmoothCollapse>
          </div>
        </div>
      </div>

      {/* ─── SOCIAL STRIP ─── */}
      <div className="vwu-footer-social">
        <div className="vwu-footer-inner vwu-footer-social-row">
          <span className="vwu-footer-social-label">Connect with Vishnu Women's University</span>
          <div className="vwu-footer-social-icons" aria-label="Social media channels">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="vwu-footer-social-btn"
                aria-label={`Visit VWU on ${s.label}`}
                title={`Visit VWU on ${s.label}`}
              >
                <s.Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BOTTOM BAR ─── */}
      <div className="vwu-footer-bottom">
        <div className="vwu-footer-inner vwu-footer-bottom-row">
          <p className="vwu-footer-copyright">
            &copy; {currentYear} Vishnu Women's University. All rights reserved.
          </p>

          <nav className="vwu-footer-legal" aria-label="Legal and policy links">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.href} className="vwu-footer-legal-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="vwu-footer-dev">
            <span>Developed by</span>
            <a
              href="https://www.vishnutechhub.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="vwu-footer-dev-link"
              aria-label="Vishnu Tech Hub"
            >
              VISHNU TECH HUB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
