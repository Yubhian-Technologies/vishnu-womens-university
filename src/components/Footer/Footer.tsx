import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import { COMPLIANCE_GROUPS, DEFAULT_COMPLIANCE_DOCS, type ComplianceDocDoc } from '../../pages/Admin/sections/ComplianceDocsAdmin';
import { InstagramIcon, FacebookIcon, TwitterIcon, LinkedInIcon, YouTubeIcon } from './SocialIcons';
import './Footer.css';

const quickLinks = [
  { label: 'Examination Portal', path: 'https://www.svecwexams.in/', external: true },
  { label: 'LMS Platform', path: 'https://www.vishnulearning.com/login/index.php', external: true },
  { label: 'Campus Map', path: 'https://maps.google.com/maps?q=16.568119,81.522098&z=15', external: true },
  { label: 'Central Library', path: '/campus/central-library' },
  { label: 'Prathibha Magazine', path: 'https://heyzine.com/flip-book/14449c1cd4.html', external: true },
  { label: 'Academic Calendar', path: '/information#academic-calendar' },
  { label: 'Career Opportunities', path: '/careers' },
  { label: 'Wellness Center', path: 'https://vishnuwellness.in/', external: true },
];

const academicLinks = [
  { label: 'B.Tech Programs', path: '/academics' },
  { label: 'M.Tech Programs', path: '/academics' },
  { label: 'MBA Program', path: '/academics' },
  { label: 'Ph.D. Programs', path: '/academics' },
  { label: 'Departments', path: '/academics' },
  { label: 'Research & Publications', path: '/academics' },
];

const aboutLinks: { label: string; path: string; external?: boolean; download?: boolean }[] = [
  { label: 'Our History', path: '/about' },
  { label: 'Mission & Values', path: '/about' },
  { label: 'Leadership', path: '/about' },
  { label: 'Organizational Chart', path: '/downloads/SVECWOrganizationChart.jpg', download: true },
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'Accreditation', path: '/about' },
];

const socialLinks = [
  { label: 'Instagram', href: 'http://instagram.com/vishnu_svecw/', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/svecwcollege', Icon: FacebookIcon },
  { label: 'Twitter', href: 'https://twitter.com/svecw2', Icon: TwitterIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/school/vishnusvecw/', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@SVECW-B0', Icon: YouTubeIcon },
];

const accreditations = [
  'NBA Accredited',
  'NAAC Approved',
  'UGC Autonomous',
  'AICTE Approved',
  'JNTUK Affiliated',
];

const feedbackLinks = [
  { label: "Students' Feedback", href: 'https://forms.gle/UuURnxKUZw7wW1NW9' },
  { label: "Parents' Feedback", href: 'https://forms.gle/eT2QF3WNJZDwpEzj8' },
  { label: "Faculty's Feedback", href: 'https://forms.gle/K89PMmjNbJNGSVEa9' },
  { label: 'AICTE Feedback Facility', href: 'https://svecw.edu.in/aicte-feedback-facility/' },
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
          <h3 className="footer-col-title">Compliance &amp; Disclosures</h3>
          <div className="footer-compliance-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo" aria-label="Vishnu Womens University">
                <img src="https://res.cloudinary.com/dljzfysft/image/upload/v1777358383/download_u6eeyl.jpg" alt="VWU Logo" className="footer-logo-icon" />
                <div className="footer-logo-text">
                  <strong>Vishnu Womens</strong>
                  <span>University</span>
                </div>
              </Link>

              <p className="footer-tagline">
                Empowering women through knowledge and action. An autonomous institution
                committed to excellence in engineering education, research, and innovation.
              </p>

              <address className="footer-address">
                Bhimavaram, West Godavari Dist.<br />
                Andhra Pradesh – 534 202<br />
                <a href="tel:08816250864">08816-250864</a><br />
                <a href="mailto:info@svecw.edu.in">info@svecw.edu.in</a>
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
            <span className="footer-feedback-label">Feedback Facility:</span>
            {feedbackLinks.map((l, i) => (
              <span key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="footer-link">{l.label}</a>
                {i < feedbackLinks.length - 1 && <span className="footer-feedback-sep">·</span>}
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
              &copy; {year} Vishnu Womens University. All rights reserved.
            </p>
            <nav className="footer-legal" aria-label="Legal links">
              <Link to="/policies-procedures">Policies & Procedures</Link>
              <Link to="/anti-ragging">Anti Ragging Policy</Link>
              <Link to="/disclosures/ugc">Disclosures – UGC</Link>
              <Link to="/contact">Contact Us</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
