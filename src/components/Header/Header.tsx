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
    label: 'Discover',
    children: [
      { label: 'About VWU', path: '/about' },
      { label: 'Vision, Mission & Values', path: '/vision-mission' },
      { label: 'About Society (SVES)', path: '/about-sves' },
      { label: 'Campus Life', path: '/campus' },
      { label: 'Information', path: '/information' },
    ],
  },
  {
    label: 'Statutory',
    children: [
      { label: 'Governance Overview', path: '/governance' },
      { label: 'Governing Body', path: '/governance/governing-body' },
      { label: 'Academic Council', path: '/governance/academic-council' },
      { label: 'Board of Studies', path: '/governance/board-of-studies' },
      { label: 'Finance Committee', path: '/governance/finance-committee' },
      { label: 'Institutional Development Plan', path: '/governance/idp' },
      { label: 'Committees', path: '/governance#committees' },
      { label: 'IQAC', path: '/governance#iqac' },
    ],
  },
  {
    label: 'Academics',
    children: [
      { label: 'Programs & Departments', path: '/academics' },
      { label: 'Programmes & Fee Structure', path: '/programmes-fee-structure' },
      { label: 'Admission Procedure', path: '/admission-procedure' },
      { label: 'Result Analysis', path: '/result-analysis' },
      { label: 'Academic Calendar', path: '/information' },
    ],
  },
  {
    label: 'Admissions',
    children: [
      { label: 'Admissions Overview', path: '/admissions' },
      { label: 'Programmes & Fee Structure', path: '/programmes-fee-structure' },
      { label: 'Admission Procedure', path: '/admission-procedure' },
      { label: 'Result Analysis', path: '/result-analysis' },
      { label: 'How to Reach', path: '/information' },
    ],
  },
  {
    label: 'Student Life',
    children: [
      { label: 'Student Life Overview', path: '/student-life' },
      { label: 'Student Clubs', path: '/student-clubs' },
      { label: 'Sports & Games', path: '/sports-games' },
      { label: 'Arts & Culture', path: '/arts-culture' },
      { label: 'Social Services (NSS)', path: '/social-services' },
      { label: 'Campus Magazines', path: '/campus-magazines' },
      { label: 'Vishnu TV Academy', path: '/vishnu-tv-academy' },
    ],
  },
  {
    label: 'Placements',
    children: [
      { label: 'Placements Overview', path: '/placements' },
      { label: 'Placement Details', path: '/placements/placement-details' },
      { label: 'Success Stories', path: '/placements/success-stories' },
      { label: 'TPO Cell', path: '/placements/tpo-cell' },
      { label: 'Campus Recruitment Training', path: '/placements/campus-recruitment-training' },
      { label: 'Our Recruiters', path: '/placements/our-recruiters' },
      { label: 'Study Abroad – GSAC', path: '/placements/gsac' },
    ],
  },
  {
    label: 'Differentiators',
    children: [
      { label: 'All Differentiators', path: '/differentiators' },
      { label: 'Innovation & Entrepreneurship', path: '/differentiators#innovation' },
      { label: 'Industry Centres of Excellence', path: '/differentiators#industry' },
      { label: 'Research & Specialised Labs', path: '/differentiators#research' },
      { label: 'International & Global Outreach', path: '/differentiators#global' },
      { label: 'Student Development & Social Impact', path: '/differentiators#student' },
    ],
  },
  {
    label: 'News & Awards',
    children: [
      { label: 'News & Awards Overview', path: '/news-awards' },
      { label: 'Happenings at VWU', path: '/news-awards/happenings' },
      { label: 'Accreditations & Awards', path: '/news-awards/accreditations-awards' },
      { label: 'Gallery', path: '/news-awards/gallery' },
      { label: 'News', path: '/news' },
      { label: 'Events', path: '/events' },
    ],
  },
  {
    label: 'Alumni & Giving',
    children: [
      { label: 'Alumni Network', path: '/alumni-giving' },
      { label: 'Giving Opportunities', path: '/alumni-giving' },
      { label: 'Alumni Events', path: '/alumni-giving' },
      { label: 'Prathibha Magazine', path: '/alumni-giving' },
      { label: 'Success Stories', path: '/alumni-giving' },
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
              <span className="logo-text-tag">First private state university for women in telugu states</span>
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
