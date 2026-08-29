import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useNavLinkOverride } from '../../hooks/useNavLinkOverride';
import { COMPLIANCE_GROUPS, DEFAULT_COMPLIANCE_DOCS, type ComplianceDocDoc } from '../../pages/Admin/sections/ComplianceDocsAdmin';
import { InstagramIcon, FacebookIcon, TwitterIcon, LinkedInIcon, YouTubeIcon } from './SocialIcons';
import './Footer.css';

const socialLinks = [
  { label: 'Instagram', href: 'http://instagram.com/vishnu_svecw/', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/svecwcollege', Icon: FacebookIcon },
  { label: 'Twitter', href: 'https://twitter.com/svecw2', Icon: TwitterIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/school/vishnusvecw/', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@SVECW-B0', Icon: YouTubeIcon },
];

const accreditations = [
  'NBA',
  'NAAC',
  'UGC',
  'AICTE Approved',
  'JNTUK Affiliated',
];

// Moved out of the header nav's "News & Events" mega-menu (see Header.tsx)
// into its own footer column. "Success Stories" is admin-editable via
// /admin → Navigation Link Redirects (NavLinkOverridesAdmin.tsx), so its
// path is resolved at render time via useNavLinkOverride below rather than
// hardcoded here.
const alumniGivingLinks = [
  { label: 'Alumni Network', path: '/alumni-giving#network' },
  { label: 'Giving Opportunities', path: '/alumni-giving#give' },
  { label: 'Alumni Events', path: '/alumni-giving#events' },
];

const feedbackLinks = [
  { label: "Students' Feedback", href: 'https://forms.gle/UuURnxKUZw7wW1NW9', external: true },
  { label: "Parents' Feedback", href: 'https://forms.gle/eT2QF3WNJZDwpEzj8', external: true },
  { label: "Faculty's Feedback", href: 'https://forms.gle/K89PMmjNbJNGSVEa9', external: true },
  { label: 'AICTE Feedback Facility', href: '/aicte-feedback-facility', external: false },
];

// Mirrors the header nav's "Quick Links" dropdown (see navItems in
// Header.tsx), minus Disclosures – UGC and Contact Us — those two already
// have their own links in the bottom bar just below (.footer-legal).
const quickLinks = [
  { label: 'Examinations', href: 'https://www.svecwexams.in/', external: true },
  { label: 'Vishnu LMS', href: 'https://www.vishnulearning.com/login/index.php', external: true },
  { label: 'VEDIC', href: 'https://vedic.edu.in/', external: true },
  { label: "Vishnu's Wellness Center", href: 'https://vishnuwellness.in/', external: true },
  { label: 'Global Alumni Network', href: 'https://alumni.srivishnu.edu.in/', external: true },
  { label: 'Vishnu Era', href: 'https://www.srivishnu.edu.in/vishnu-era/', external: true },
  { label: 'Prathibha Magazine', href: 'https://heyzine.com/flip-book/14449c1cd4.html', external: true },
  { label: 'Careers', href: '/careers', external: false },
];

// Statutory/compliance documents an accredited institution is required to publish.
// Admin-editable via /admin → Compliance Documents (ComplianceDocsAdmin.tsx);
// DEFAULT_COMPLIANCE_DOCS below is both the "nothing uploaded yet" fallback
// and the one-click starting point for moving these into Firestore, so the
// footer never looks broken either way.
//
// "Disclosures – UGC" is the one fixed exception: it's an internal page
// route (built from the same PDF, at /disclosures/ugc), not a document link,
// so it's pinned into the Mandatory Disclosures group directly rather than
// living in the editable document list.
const pinnedDisclosuresLink = { label: 'Disclosures – UGC', href: '/disclosures/ugc', download: false };

export default function Footer() {
  const year = new Date().getFullYear();
  // Default target is AlumniGiving.tsx's own "#successstories" section, not Placements' — see Header.tsx's former use of this same override id.
  const alumniSuccessStories = useNavLinkOverride('alumni-success-stories', '/alumni-giving#successstories');
  const { docs: liveComplianceDocs } = useOrderedCollection<ComplianceDocDoc>('complianceDocs', 'order');
  const complianceDocs = liveComplianceDocs.length > 0 ? liveComplianceDocs : (DEFAULT_COMPLIANCE_DOCS as ComplianceDocDoc[]);
  const complianceGroups = COMPLIANCE_GROUPS.map((title) => ({
    title,
    links: [
      ...(title === 'Mandatory Disclosures' ? [pinnedDisclosuresLink] : []),
      ...complianceDocs
        .filter((d) => d.group === title)
        .map((d) => ({ label: d.label, href: d.fileUrl, download: d.external ? false : d.download !== false })),
    ],
  })).filter((g) => g.links.length > 0);

  return (
    <footer className="footer">
      {/* Accreditation Strip */}
      <div className="footer-accreditation">
        <div className="container">
          <div className="accreditation-inner">
            <span className="accreditation-label">Accredited by</span>
            <div className="accreditation-badges">
              {accreditations.map(a => (
                <span key={a} className="acc-badge">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Disclosures */}
      <div className="footer-compliance">
        <div className="container">
          <div className="footer-compliance-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo" aria-label="Vishnu Women's University">
                <img src="/images/square%20logo.png" alt="VWU Logo" className="footer-logo-icon" />
                <div className="footer-logo-text">
                  <strong>Vishnu Women's</strong>
                  <span>University</span>
                </div>
              </Link>

              <p className="footer-tagline">
                Empowering women through knowledge and action. A university
                committed to excellence in engineering education, research, and innovation.
              </p>

              <address className="footer-address">
                Bhimavaram, West Godavari Dist.<br />
                Andhra Pradesh – 534 202<br />
                <a href="tel:08816250864">08816-250864</a><br />
                <a href="mailto:info@vwu.edu.in">info@vwu.edu.in</a>
              </address>

              <div className="footer-social" aria-label="Social Media">
                {socialLinks.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={s.label} title={s.label}>
                    <s.Icon />
                  </a>
                ))}
              </div>
            </div>

            {complianceGroups.map(group => (
              <div key={group.title}>
                <h4 className="footer-compliance-group-title">{group.title}</h4>
                <ul className="footer-compliance-links">
                  {group.links.map(l => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" download={l.download} className="footer-link">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-feedback">
            <span className="footer-feedback-label">Alumni & Giving:</span>
            {alumniGivingLinks.map((l) => (
              <span key={l.label}>
                <Link to={l.path} className="footer-link">{l.label}</Link>
                <span className="footer-feedback-sep">·</span>
              </span>
            ))}
            <span>
              {alumniSuccessStories.external ? (
                <a href={alumniSuccessStories.path} target="_blank" rel="noopener noreferrer" className="footer-link">Success Stories</a>
              ) : (
                <Link to={alumniSuccessStories.path} className="footer-link">Success Stories</Link>
              )}
            </span>
          </div>

          <div className="footer-feedback">
            <span className="footer-feedback-label">Feedback Facility:</span>
            {feedbackLinks.map((l, i) => (
              <span key={l.label}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="footer-link">{l.label}</a>
                ) : (
                  <Link to={l.href} className="footer-link">{l.label}</Link>
                )}
                {i < feedbackLinks.length - 1 && <span className="footer-feedback-sep">·</span>}
              </span>
            ))}
          </div>

          <div className="footer-feedback footer-quicklinks">
            <span className="footer-feedback-label">Quick Links:</span>
            {quickLinks.map((l, i) => (
              <span key={l.label}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="footer-link">{l.label}</a>
                ) : (
                  <Link to={l.href} className="footer-link">{l.label}</Link>
                )}
                {i < quickLinks.length - 1 && <span className="footer-feedback-sep">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              &copy; {year} Vishnu Women's University. All rights reserved.
            </p>
            <nav className="footer-legal" aria-label="Legal links">
              <Link to="/policies-procedures">Policies & Procedures</Link>
              <Link to="/anti-ragging">Anti Ragging Policy</Link>
              <Link to="/disclosures/ugc">Disclosures – UGC</Link>
              <Link to="/contact">Contact Us</Link>
            </nav>
            <span className="footer-credit">Developed by <strong>VISHNU TECH HUB</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
