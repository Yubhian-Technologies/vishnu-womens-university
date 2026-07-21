import { Link } from 'react-router-dom';
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

const aboutLinks = [
  { label: 'Our History', path: '/about' },
  { label: 'Mission & Values', path: '/about' },
  { label: 'Leadership', path: '/about' },
  { label: 'Organizational Chart', path: 'https://svecw.edu.in/wp-content/uploads/2024/03/SVECWOrganizationChart.jpg', external: true },
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'Accreditation', path: '/about' },
];

const socialLinks = [
  { label: 'Instagram', href: 'http://instagram.com/vishnu_svecw/', icon: 'IG' },
  { label: 'Facebook', href: 'https://www.facebook.com/svecwcollege', icon: 'FB' },
  { label: 'Twitter', href: 'https://twitter.com/svecw2', icon: 'TW' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/school/vishnusvecw/', icon: 'LI' },
  { label: 'YouTube', href: 'https://www.youtube.com/@SVECW-B0', icon: 'YT' },
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
// Hosted on svecw.edu.in — the same accreditation-bearing institution VWU operates
// under (the site already links out to svecw.edu.in systems elsewhere, e.g. the
// exam portal and LMS), so these are the authoritative documents, not a separate
// entity's paperwork being misrepresented as VWU's own.
const complianceGroups: { title: string; links: { label: string; href: string; download?: boolean }[] }[] = [
  {
    title: 'Approvals & Accreditations',
    links: [
      { label: 'AICTE Approvals', href: '/downloads/AICTEApprovals.pdf', download: true },
      { label: 'UGC Autonomous Approvals', href: '/downloads/UGCAutonomousApprovals.pdf', download: true },
      { label: 'UGC - 12B 2f Letter', href: '/downloads/UGC12B2FLetter.pdf', download: true },
      { label: 'JNTUK Affiliation Approvals', href: '/downloads/JNTUKAffiliationApprovals.pdf', download: true },
      { label: 'JNTUK Autonomous Approvals', href: '/downloads/JNTUKAutonomousApprovals.pdf', download: true },
      { label: 'NAAC Approvals', href: '/downloads/NAACApprovals.pdf', download: true },
      { label: 'NBA Approvals', href: '/downloads/NBAApprovals.pdf', download: true },
    ],
  },
  {
    title: 'Mandatory Disclosures',
    links: [
      { label: 'AICTE Mandatory Disclosures', href: '/downloads/AICTEMandatoryDisclosures.pdf', download: true },
      { label: 'UGC Public Self Disclosure', href: '/downloads/UGCPublicSelfDisclosure.pdf', download: true },
      { label: 'JNTUK Mandatory Disclosure', href: '/downloads/JNTUKMandatoryDisclosure.pdf', download: true },
      { label: 'RTI-Undertaking', href: '/downloads/RTIUndertaking.pdf', download: true },
      { label: 'Disclosures – UGC', href: 'https://svecw.edu.in/infougc/' },
      { label: 'Anti Ragging Policies', href: 'https://svecw.edu.in/anti-ragging/' },
      { label: 'Policies & Procedures', href: 'https://svecw.edu.in/policies-procedures/' },
    ],
  },
  {
    title: 'Infrastructure & Facilities',
    links: [
      { label: 'Modes of Payment', href: 'https://svecw.edu.in/modes-of-payment/' },
      { label: 'Building Plans', href: 'https://svecw.edu.in/wp-content/uploads/2026/02/SVECWBuildingPlans.pdf' },
      { label: 'Structural Stability', href: 'https://svecw.edu.in/wp-content/uploads/2026/02/SVECWStructuralStability.pdf' },
      { label: 'Land Use Certificate', href: 'https://svecw.edu.in/wp-content/uploads/2024/07/SVECWLandUseCertificate.pdf' },
      { label: 'Land Conversion Certificate', href: 'https://svecw.edu.in/wp-content/uploads/2024/07/SVECWLandConversion.pdf' },
      { label: 'Fire NOC', href: 'https://svecw.edu.in/wp-content/uploads/2026/02/SVECWFireSafety2026.pdf' },
      { label: 'Online Verification System', href: 'https://svecw.edu.in/wp-content/uploads/2024/04/online.pdf' },
    ],
  },
  {
    title: 'Institutional Data',
    links: [
      { label: 'Audited Statements', href: 'https://svecw.edu.in/wp-content/uploads/2026/03/SVECWAuditStatements.pdf' },
      { label: 'Student Details', href: 'https://svecw.edu.in/wp-content/uploads/2026/03/StudentDetailsupto2025-26.pdf' },
      { label: 'Faculty Details', href: 'https://svecw.edu.in/wp-content/uploads/2026/02/SVECW-Faculty-Details.pdf' },
      { label: 'Faculty Qualification Details', href: 'https://svecw.edu.in/wp-content/uploads/2026/02/SVECWFacultyQualifications.pdf' },
      { label: 'Faculty Ratification Details', href: 'https://svecw.edu.in/wp-content/uploads/2026/02/SVECWRatifiedFaculty.pdf' },
      { label: 'Faculty Handbook', href: 'https://svecw.edu.in/wp-content/uploads/2026/04/FacultyHandbookSVECW.pdf' },
      { label: 'Students Handbook', href: 'https://svecw.edu.in/wp-content/uploads/2025/11/SVECWStudentHandbook.pdf' },
      { label: 'Facilities for Physically Challenged', href: 'https://svecw.edu.in/wp-content/uploads/2024/04/PhysicallyHansFac1.pdf' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
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
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="footer-col-title">Quick Links</h3>
              <ul className="footer-links">
                {quickLinks.map(l => (
                  <li key={l.label}>
                    {l.external ? (
                      <a href={l.path} className="footer-link" target="_blank" rel="noopener noreferrer">{l.label}</a>
                    ) : (
                      <Link to={l.path} className="footer-link">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Academics */}
            <div>
              <h3 className="footer-col-title">Academics</h3>
              <ul className="footer-links">
                {academicLinks.map(l => (
                  <li key={l.label}>
                    <Link to={l.path} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About & Newsletter */}
            <div>
              <h3 className="footer-col-title">About VWU</h3>
              <ul className="footer-links">
                {aboutLinks.map(l => (
                  <li key={l.label}>
                    {l.external ? (
                      <a href={l.path} className="footer-link" target="_blank" rel="noopener noreferrer">{l.label}</a>
                    ) : (
                      <Link to={l.path} className="footer-link">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>

              <div className="footer-newsletter">
                <p>Stay connected — get VWU news delivered.</p>
                <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                  <input
                    type="email"
                    className="newsletter-input"
                    placeholder="Your email address"
                    aria-label="Email for newsletter"
                  />
                  <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <a href="https://svecw.edu.in/policies-procedures/" target="_blank" rel="noopener noreferrer">Policies & Procedures</a>
              <a href="https://svecw.edu.in/anti-ragging/" target="_blank" rel="noopener noreferrer">Anti Ragging Policy</a>
              <a href="https://svecw.edu.in/infougc/" target="_blank" rel="noopener noreferrer">Disclosures – UGC</a>
              <Link to="/contact">Contact Us</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
