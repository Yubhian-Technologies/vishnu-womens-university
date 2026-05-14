import { Link } from 'react-router-dom';
import './Footer.css';

const quickLinks = [
  { label: 'Examination Portal', path: '#' },
  { label: 'LMS Platform', path: '#' },
  { label: 'Campus Map', path: '#' },
  { label: 'Central Library', path: '#' },
  { label: 'Prathibha Magazine', path: '#' },
  { label: 'Academic Calendar', path: '#' },
  { label: 'Career Opportunities', path: '#' },
  { label: 'Wellness Center', path: '#' },
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
  { label: 'News', path: '/news' },
  { label: 'Events', path: '/events' },
  { label: 'Accreditation', path: '/about' },
];

const socialLinks = [
  { label: 'Instagram', href: '#', icon: 'IG' },
  { label: 'Facebook', href: '#', icon: 'FB' },
  { label: 'Twitter', href: '#', icon: 'TW' },
  { label: 'LinkedIn', href: '#', icon: 'LI' },
  { label: 'YouTube', href: '#', icon: 'YT' },
];

const accreditations = [
  'NBA-DCP Accredited',
  'NAAC Approved',
  'UGC Autonomous',
  'AICTE Approved',
  'JNTUK Affiliated',
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
                  <a key={s.label} href={s.href} className="social-link" aria-label={s.label} title={s.label}>
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
                    <Link to={l.path} className="footer-link">{l.label}</Link>
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
                    <Link to={l.path} className="footer-link">{l.label}</Link>
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

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              &copy; {year} Vishnu Womens University. All rights reserved.
            </p>
            <nav className="footer-legal" aria-label="Legal links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Non-Discrimination</a>
              <a href="#">FERPA</a>
              <a href="#">Sitemap</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
