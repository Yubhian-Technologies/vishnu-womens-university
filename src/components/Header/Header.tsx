import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

interface NavItem {
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Academics',
    children: [
      { label: 'B.Tech Programs', path: '/academics' },
      { label: 'M.Tech Programs', path: '/academics' },
      { label: 'MBA Program', path: '/academics' },
      { label: 'Ph.D. Programs', path: '/academics' },
      { label: 'Departments', path: '/academics' },
      { label: 'Academic Calendar', path: '/academics' },
      { label: 'Curriculum & Syllabus', path: '/academics' },
      { label: 'Research & Publications', path: '/academics' },
    ],
  },
  {
    label: 'Admissions',
    children: [
      { label: 'EAPCET Admissions', path: '/admissions' },
      { label: 'ECET Admissions', path: '/admissions' },
      { label: 'PGECET Admissions', path: '/admissions' },
      { label: 'ICET Admissions', path: '/admissions' },
      { label: 'Fee Structure', path: '/admissions' },
      { label: 'Scholarships', path: '/admissions' },
      { label: 'International Students', path: '/admissions' },
      { label: 'Admissions Staff', path: '/admissions' },
    ],
  },
  {
    label: 'Student Life',
    children: [
      { label: 'Career Services', path: '/student-life' },
      { label: 'Student Clubs & Activities', path: '/student-life' },
      { label: 'Sports & Games', path: '/student-life' },
      { label: 'Campus Facilities', path: '/student-life' },
      { label: 'Hostels', path: '/student-life' },
      { label: 'Wellness Center', path: '/student-life' },
      { label: 'Radio Vishnu 90.4', path: '/student-life' },
    ],
  },
  {
    label: 'Alumni & Giving',
    children: [
      { label: 'Alumni Network', path: '/alumni-giving' },
      { label: 'Giving Opportunities', path: '/alumni-giving' },
      { label: 'Alumni Events', path: '/alumni-giving' },
      { label: 'Prathibha Magazine', path: '/alumni-giving' },
      { label: 'Alumni Staff', path: '/alumni-giving' },
    ],
  },
  {
    label: 'About VWU',
    children: [
      { label: 'History', path: '/about' },
      { label: 'Mission & Values', path: '/about' },
      { label: 'Accreditation', path: '/about' },
      { label: 'Facts & Statistics', path: '/about' },
      { label: 'News', path: '/news' },
      { label: 'Events', path: '/events' },
      { label: 'Leadership', path: '/about' },
      { label: 'IQAC', path: '/about' },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setExpandedItem(null);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <a href="tel:08816250864" className="topbar-link">08816-250864</a>
            <span className="topbar-link" style={{ opacity: 0.3 }}>|</span>
            <a href="#" className="topbar-link">Examination Portal</a>
            <span className="topbar-link" style={{ opacity: 0.3 }}>|</span>
            <a href="#" className="topbar-link">LMS Platform</a>
            <span className="topbar-link" style={{ opacity: 0.3 }}>|</span>
            <a href="#" className="topbar-link">Central Library</a>
            <span className="topbar-link" style={{ opacity: 0.3 }}>|</span>
            <a href="#" className="topbar-link">Campus Map</a>
          </div>
          <div className="topbar-right">
            <Link to="/admissions" className="topbar-cta visit">Visit</Link>
            <Link to="/alumni-giving" className="topbar-cta give">Give</Link>
            <Link to="/admissions" className="topbar-cta apply">Apply Now</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="logo" aria-label="Vishnu Womens University Home">
            <img src="https://res.cloudinary.com/dljzfysft/image/upload/v1777358383/download_u6eeyl.jpg" alt="VWU Logo" className="logo-icon" />
            <div className="logo-text">
              <span className="logo-text-main">VISHNU WOMENS UNIVERSITY</span>
              <span className="logo-text-tag">First private university for women in telugu states</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav" aria-label="Main navigation">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.label} className="nav-item">
                  <button className="nav-link" aria-haspopup="true">
                    {item.label}
                    <svg className="nav-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {item.children && (
                    <div className="dropdown" role="menu">
                      <ul className="dropdown-list">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.path}
                              className="dropdown-item"
                              role="menuitem"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Toggle */}
          <button
            className={`mobile-toggle${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="mobile-menu-content">
          <div className="mobile-ctas">
            <Link to="/admissions" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
              Schedule Visit
            </Link>
            <Link to="/admissions" className="btn btn-accent" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
              Apply Now
            </Link>
            <Link to="/alumni-giving" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
              Give
            </Link>
          </div>

          <ul>
            {navItems.map((item) => (
              <li key={item.label} className={`mobile-nav-item${expandedItem === item.label ? ' expanded' : ''}`}>
                <button
                  className="mobile-nav-link"
                  onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                >
                  {item.label}
                  <svg viewBox="0 0 12 12" width="14" height="14" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {item.children && (
                  <ul className="mobile-submenu">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link to={child.path} className="mobile-sub-item">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mobile-social">
            {['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'YouTube'].map(s => (
              <a key={s} href="#" aria-label={s}>{s}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
