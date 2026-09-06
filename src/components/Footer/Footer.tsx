import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink, ChevronDown, FileText, ChevronRight, Navigation } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSiteContact, telHref } from '../../hooks/useSiteContact';
import { COMPLIANCE_GROUPS, DEFAULT_COMPLIANCE_DOCS, type ComplianceDocDoc } from '../../pages/Admin/sections/ComplianceDocsAdmin';
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

// `disabled` items render as greyed, non-clickable text — mirroring the
// navbar, where the corresponding pages (Governance sub-pages, Campus
// Facilities) aren't live yet.
const UNIVERSITY_LINKS: { label: string; href: string; disabled?: boolean }[] = [
  { label: 'About VWU', href: '/about' },
  { label: 'Governance & Leadership', href: '/governance', disabled: true },
  { label: 'Campus Facilities', href: '/campus-facilities', disabled: true },
  { label: 'Careers at VWU', href: '/careers' },
  { label: 'Alumni Network', href: '/alumni-giving#network' },
  { label: 'Contact Us', href: '/contact' },
];

const ACADEMIC_LINKS = [
  { label: 'Academic Programmes', href: '/academics' },
  { label: 'Fee Structure', href: '/programmes-fee-structure' },
  { label: 'Examinations Portal', href: 'https://www.svecwexams.in/', external: true },
  { label: 'Vishnu LMS', href: 'https://www.vishnulearning.com/login/index.php', external: true },
  { label: 'Vishnu Tech Hub', href: 'https://www.vishnutechhub.in/', external: true },
  { label: 'VEDIC Learning Center', href: 'https://vedic.edu.in/', external: true },
  { label: 'Vishnu Era Magazine', href: 'https://www.srivishnu.edu.in/vishnu-era/', external: true },
  { label: 'Prathibha Magazine', href: 'https://heyzine.com/flip-book/14449c1cd4.html', external: true },
  { label: 'Global Alumni Portal', href: 'https://alumni.srivishnu.edu.in/', external: true },
];

const STUDENT_SERVICE_LINKS = [
  { label: 'Student Life & Clubs', href: '/student-life' },
  { label: "Vishnu's Wellness Center", href: 'https://vishnuwellness.in/', external: true },
  { label: "Students' Feedback", href: 'https://forms.gle/UuURnxKUZw7wW1NW9', external: true },
  { label: "Parents' Feedback", href: 'https://forms.gle/eT2QF3WNJZDwpEzj8', external: true },
  { label: "Faculty's Feedback", href: 'https://forms.gle/K89PMmjNbJNGSVEa9', external: true },
  { label: 'AICTE Feedback Facility', href: '/aicte-feedback-facility', external: false },
];

const LEGAL_LINKS = [
  { label: 'Policies & Procedures', href: '/policies-procedures' },
  { label: 'Anti-Ragging Policy', href: '/anti-ragging' },
  { label: 'Disclosures – UGC', href: '/disclosures/ugc' },
  { label: 'Contact Us', href: '/contact' },
];

/* -------------------------------------------------------------------------- */
/* Main Redesigned Footer Component                                           */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const accordionBaseId = useId();
  const { phone, email } = useSiteContact();

  // Mobile accordion state (all closed by default for compact mobile viewport)
  const [openMobileSections, setOpenMobileSections] = useState<Set<string>>(new Set());
  // Compliance group toggle state on desktop/mobile
  const initialGroup = COMPLIANCE_GROUPS.find((g) => g !== 'Mandatory Disclosures') || COMPLIANCE_GROUPS[0];
  const [activeComplianceGroup, setActiveComplianceGroup] = useState<string>(initialGroup);

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

  // Real-time Firestore sync with fallback
  const { docs: liveDocs } = useOrderedCollection<ComplianceDocDoc>('complianceDocs', 'order');
  const complianceDocs = liveDocs.length > 0 ? liveDocs : (DEFAULT_COMPLIANCE_DOCS as ComplianceDocDoc[]);

  const complianceGroups = COMPLIANCE_GROUPS
    .filter((title) => title !== 'Mandatory Disclosures')
    .map((title) => {
      const groupItems = complianceDocs.filter((d) => d.group === title);
      const links = groupItems.map((d) => ({
        label: d.label,
        href: d.fileUrl,
        download: d.external ? false : d.download !== false,
        external: !!d.external,
      }));
      return { title, links };
    })
    .filter((g) => g.links.length > 0);

  const selectedComplianceLinks = complianceGroups.find((g) => g.title === activeComplianceGroup)?.links || complianceGroups[0]?.links || [];

  return (
    <footer className="vwu-footer" role="contentinfo">
      {/* ------------------------------------------------------------------ */}
      {/* TIER 1: Identity (left) & Structured Navigation / Compliance (right) */}
      {/* ------------------------------------------------------------------ */}
      <div className="vwu-footer-main-tier">
        <div className="container vwu-footer-main-inner">
          {/* Brand Anchor */}
          <div className="vwu-footer-brand-block">
            <Link to="/" className="vwu-footer-logo-wrap" aria-label="Vishnu Women's University Home">
              <img
                src="/images/footer-logo.png"
                alt="Vishnu Women's University"
                className="vwu-footer-logo-img"
                loading="lazy"
              />
              <span className="vwu-brand-main" lang="te">విష్ణు మహిళా విశ్వవిద్యాలయం</span>
            </Link>

            <p className="vwu-footer-mission-text">
              Empowering women scholars through excellence in engineering education,
              interdisciplinary research, and transformative leadership.
            </p>

            {/* Actionable Compact Contact Info */}
            <address className="vwu-footer-contact-items">
              <div className="vwu-footer-contact-row">
                <MapPin size={15} className="vwu-footer-contact-icon" aria-hidden="true" />
                <span>Bhimavaram, West Godavari Dist., Andhra Pradesh – 534 202</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=16.568119,81.522098"
                target="_blank"
                rel="noopener noreferrer"
                className="vwu-footer-get-directions"
              >
                <Navigation size={13} aria-hidden="true" />
                <span>Get Directions</span>
              </a>
              <div className="vwu-footer-contact-links">
                <a href={telHref(phone)} className="vwu-footer-contact-action" aria-label={`Phone: ${phone}`}>
                  <Phone size={14} aria-hidden="true" />
                  <span>{phone}</span>
                </a>
                <span className="vwu-footer-contact-sep" aria-hidden="true">·</span>
                <a href={`mailto:${email}`} className="vwu-footer-contact-action" aria-label={`Email: ${email}`}>
                  <Mail size={14} aria-hidden="true" />
                  <span>{email}</span>
                </a>
              </div>
            </address>
          </div>

          {/* Navigation Columns */}
          <div className="vwu-footer-nav-grid">
          {/* Column 1: University */}
          <div className="vwu-footer-nav-col">
            <h3 className="vwu-footer-nav-title">University</h3>
            <ul className="vwu-footer-nav-list" role="list">
              {UNIVERSITY_LINKS.map((item) => (
                <li key={item.label}>
                  {item.disabled ? (
                    <span className="vwu-footer-nav-link is-disabled" aria-disabled="true">
                      {item.label}
                    </span>
                  ) : (
                    <Link to={item.href} className="vwu-footer-nav-link">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Academics & Portals */}
          <div className="vwu-footer-nav-col">
            <h3 className="vwu-footer-nav-title">Academics &amp; Portals</h3>
            <ul className="vwu-footer-nav-list" role="list">
              {ACADEMIC_LINKS.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vwu-footer-nav-link external"
                    >
                      <span>{item.label}</span>
                      <ExternalLink size={12} className="vwu-external-glyph" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link to={item.href} className="vwu-footer-nav-link">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Student Life & Feedback */}
          <div className="vwu-footer-nav-col">
            <h3 className="vwu-footer-nav-title">Student Life &amp; Services</h3>
            <ul className="vwu-footer-nav-list" role="list">
              {STUDENT_SERVICE_LINKS.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vwu-footer-nav-link external"
                    >
                      <span>{item.label}</span>
                      <ExternalLink size={12} className="vwu-external-glyph" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link to={item.href} className="vwu-footer-nav-link">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Statutory & Compliance (Dynamic Firestore) */}
          <div className="vwu-footer-nav-col vwu-footer-compliance-col">
            <h3 className="vwu-footer-nav-title">Compliance &amp; Disclosures</h3>
            
            {/* Group Tab Pills (Desktop) */}
            <div className="vwu-footer-compliance-tabs" role="tablist" aria-label="Compliance Document Categories">
              {complianceGroups.map((g) => (
                <button
                  key={g.title}
                  type="button"
                  role="tab"
                  aria-selected={activeComplianceGroup === g.title}
                  className={`vwu-footer-comp-tab-btn${activeComplianceGroup === g.title ? ' active' : ''}`}
                  onClick={() => setActiveComplianceGroup(g.title)}
                >
                  {g.title}
                </button>
              ))}
            </div>

            {/* Active Compliance Group Links List */}
            <ul className="vwu-footer-nav-list vwu-compliance-active-list" role="list">
              {selectedComplianceLinks.slice(0, 6).map((item) => (
                <li key={item.label}>
                  {item.download ? (
                    <a
                      href={item.href}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vwu-footer-nav-link compliance-doc"
                    >
                      <FileText size={13} className="vwu-doc-icon" aria-hidden="true" />
                      <span>{item.label}</span>
                    </a>
                  ) : item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vwu-footer-nav-link external"
                    >
                      <span>{item.label}</span>
                      <ExternalLink size={12} className="vwu-external-glyph" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link to={item.href} className="vwu-footer-nav-link">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {selectedComplianceLinks.length > 6 && (
              <Link to="/disclosures/ugc" className="vwu-footer-comp-view-all">
                <span>View all institutional documents</span>
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            )}
          </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* MOBILE ACCORDIONS (Progressive Disclosure on Small Viewports)    */}
        {/* ---------------------------------------------------------------- */}
        <div className="container vwu-footer-mobile-accordions">
          {/* Section: University */}
          <div className="vwu-footer-m-acc-item">
            <button
              type="button"
              className="vwu-footer-m-acc-btn"
              onClick={() => toggleMobileSection('university')}
              aria-expanded={openMobileSections.has('university')}
              aria-controls={`${accordionBaseId}-m-uni`}
            >
              <span>University</span>
              <ChevronDown
                size={18}
                className={`vwu-m-acc-chevron${openMobileSections.has('university') ? ' open' : ''}`}
                aria-hidden="true"
              />
            </button>
            <SmoothCollapse open={openMobileSections.has('university')}>
              <div id={`${accordionBaseId}-m-uni`} className="vwu-footer-m-acc-content">
                <ul className="vwu-footer-nav-list" role="list">
                  {UNIVERSITY_LINKS.map((item) => (
                    <li key={item.label}>
                      <Link to={item.href} className="vwu-footer-nav-link">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </SmoothCollapse>
          </div>

          {/* Section: Academics & Portals */}
          <div className="vwu-footer-m-acc-item">
            <button
              type="button"
              className="vwu-footer-m-acc-btn"
              onClick={() => toggleMobileSection('academics')}
              aria-expanded={openMobileSections.has('academics')}
              aria-controls={`${accordionBaseId}-m-acad`}
            >
              <span>Academics &amp; Portals</span>
              <ChevronDown
                size={18}
                className={`vwu-m-acc-chevron${openMobileSections.has('academics') ? ' open' : ''}`}
                aria-hidden="true"
              />
            </button>
            <SmoothCollapse open={openMobileSections.has('academics')}>
              <div id={`${accordionBaseId}-m-acad`} className="vwu-footer-m-acc-content">
                <ul className="vwu-footer-nav-list" role="list">
                  {ACADEMIC_LINKS.map((item) => (
                    <li key={item.label}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vwu-footer-nav-link external"
                        >
                          <span>{item.label}</span>
                          <ExternalLink size={12} className="vwu-external-glyph" aria-hidden="true" />
                        </a>
                      ) : (
                        <Link to={item.href} className="vwu-footer-nav-link">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </SmoothCollapse>
          </div>

          {/* Section: Student Life & Services */}
          <div className="vwu-footer-m-acc-item">
            <button
              type="button"
              className="vwu-footer-m-acc-btn"
              onClick={() => toggleMobileSection('services')}
              aria-expanded={openMobileSections.has('services')}
              aria-controls={`${accordionBaseId}-m-serv`}
            >
              <span>Student Life &amp; Services</span>
              <ChevronDown
                size={18}
                className={`vwu-m-acc-chevron${openMobileSections.has('services') ? ' open' : ''}`}
                aria-hidden="true"
              />
            </button>
            <SmoothCollapse open={openMobileSections.has('services')}>
              <div id={`${accordionBaseId}-m-serv`} className="vwu-footer-m-acc-content">
                <ul className="vwu-footer-nav-list" role="list">
                  {STUDENT_SERVICE_LINKS.map((item) => (
                    <li key={item.label}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vwu-footer-nav-link external"
                        >
                          <span>{item.label}</span>
                          <ExternalLink size={12} className="vwu-external-glyph" aria-hidden="true" />
                        </a>
                      ) : (
                        <Link to={item.href} className="vwu-footer-nav-link">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </SmoothCollapse>
          </div>

          {/* Section: Compliance & Disclosures */}
          <div className="vwu-footer-m-acc-item">
            <button
              type="button"
              className="vwu-footer-m-acc-btn"
              onClick={() => toggleMobileSection('compliance')}
              aria-expanded={openMobileSections.has('compliance')}
              aria-controls={`${accordionBaseId}-m-comp`}
            >
              <span>Compliance &amp; Disclosures</span>
              <ChevronDown
                size={18}
                className={`vwu-m-acc-chevron${openMobileSections.has('compliance') ? ' open' : ''}`}
                aria-hidden="true"
              />
            </button>
            <SmoothCollapse open={openMobileSections.has('compliance')}>
              <div id={`${accordionBaseId}-m-comp`} className="vwu-footer-m-acc-content">
                {complianceGroups.map((grp) => (
                  <div key={grp.title} className="vwu-footer-m-comp-group">
                    <h4 className="vwu-footer-m-comp-title">{grp.title}</h4>
                    <ul className="vwu-footer-nav-list" role="list">
                      {grp.links.map((item) => (
                        <li key={item.label}>
                          {item.download ? (
                            <a
                              href={item.href}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="vwu-footer-nav-link compliance-doc"
                            >
                              <FileText size={13} className="vwu-doc-icon" aria-hidden="true" />
                              <span>{item.label}</span>
                            </a>
                          ) : item.external ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="vwu-footer-nav-link external"
                            >
                              <span>{item.label}</span>
                              <ExternalLink size={12} className="vwu-external-glyph" aria-hidden="true" />
                            </a>
                          ) : (
                            <Link to={item.href} className="vwu-footer-nav-link">
                              {item.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SmoothCollapse>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TIER 3: Social & Community Connect Strip                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="vwu-footer-social-tier">
        <div className="container vwu-footer-social-inner">
          <div className="vwu-footer-social-label">
            <span>Connect with Vishnu Women's University</span>
          </div>
          <div className="vwu-footer-social-links" aria-label="Social media channels">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="vwu-social-btn"
                aria-label={`Visit VWU on ${s.label}`}
                title={`Visit VWU on ${s.label}`}
              >
                <s.Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TIER 4: Legal, Copyright & Technology Attribution Bar               */}
      {/* ------------------------------------------------------------------ */}
      <div className="vwu-footer-bottom-tier">
        <div className="container vwu-footer-bottom-inner">
          <p className="vwu-footer-copyright">
            &copy; {currentYear} Vishnu Women's University. All rights reserved.
          </p>

          <nav className="vwu-footer-legal-nav" aria-label="Legal and policy links">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.href} className="vwu-footer-legal-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="vwu-footer-attribution">
            <span>Developed by</span>
            <a
              href="https://www.vishnutechhub.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="vwu-tech-hub-badge-link"
              aria-label="Vishnu Tech Hub"
            >
              <strong className="vwu-tech-hub-badge">VISHNU TECH HUB</strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
