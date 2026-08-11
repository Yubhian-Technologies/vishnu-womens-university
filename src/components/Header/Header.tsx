import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnnouncementsTicker from '../AnnouncementsTicker/AnnouncementsTicker';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useNavLinkOverride } from '../../hooks/useNavLinkOverride';
import type { DownloadDoc } from '../../pages/Admin/sections/DownloadsAdmin';
import SmoothCollapse from '../SmoothCollapse/SmoothCollapse';
import './Header.css';

interface NavChild {
  label: string;
  path: string;
  external?: boolean;
  download?: boolean;
  disabled?: boolean;
  subItems?: NavChild[];
}

interface NavGroup {
  groupLabel: string;
  groupPath?: string;
  items: NavChild[];
}

interface NavItem {
  label: string;
  path?: string;
  children?: NavChild[];
  groups?: NavGroup[];
}

const navItems: NavItem[] = [
  {
    // "Discover"'s old groups (Governance/Committees/IQAC/Information) now
    // live here too, alongside About Us's own items — no longer its own
    // top-level nav item. Committees (13 items) auto-splits into two
    // sub-columns (see .mega-group-list.cols-2 in Header.css).
    label: 'About Us',
    groups: [
      {
        groupLabel: 'About Us',
        groupPath: '/about',
        items: [
          { label: 'About VWU', path: '/about' },
          { label: 'Vision, Mission & Values', path: '/vision-mission' },
          { label: 'Institutional Development Plan', path: '/governance/idp' },
          { label: 'Organizational Chart', path: '/downloads/SVECWOrganizationChart.jpg', download: true },
          { label: 'Core Executive Body', path: '/about#core-executive' },
          { label: 'About Society (SVES)', path: '/about-sves' },
        ],
      },
      {
        groupLabel: 'Governance',
        groupPath: '/governance',
        items: [
          { label: 'Governing Body', path: '/governance/governing-body' },
          { label: 'Academic Council', path: '/governance/academic-council' },
          { label: 'Board of Studies', path: '/governance/board-of-studies' },
          { label: 'Finance Committee', path: '/governance/finance-committee' },
          { label: 'Institutional Development Plan', path: '/governance/idp' },
        ],
      },
      {
        groupLabel: 'Committees',
        groupPath: '/governance#committees',
        items: [
          { label: 'College Academic Committee', path: '/governance/college-academic-committee' },
          { label: 'Internal Quality Assurance Cell', path: '/governance/internal-quality-assurance-cell' },
          { label: 'Acad. & Admin. Audit Committee', path: '/governance/academic-administrative-audit' },
          { label: 'Freshmen Committee', path: '/governance/freshmen-committee' },
          { label: 'Infrastructure Management', path: '/governance/infrastructure-management' },
          { label: 'Faculty Grievance Redressal', path: '/governance/faculty-grievance' },
          { label: 'Student Grievance Redressal', path: '/governance/student-grievance' },
          { label: 'Central Purchase Committee', path: '/governance/central-purchase' },
          { label: 'Counselling & Monitoring', path: '/governance/counselling-monitoring' },
          { label: 'Anti Ragging Committee', path: '/governance/anti-ragging' },
          { label: 'Internal Committee (POSH)', path: '/governance/internal-committee' },
          { label: 'SC/ST Cell', path: '/governance/sc-st-cell' },
          { label: 'R&D Committee', path: '/governance/rd-committee' },
        ],
      },
      {
        groupLabel: 'IQAC',
        groupPath: '/governance#iqac',
        items: [
          { label: 'About IQAC', path: '/governance/about-iqac' },
          { label: 'IQAC Worksystem', path: '/governance/iqac-worksystem' },
          { label: 'Quality Parameters', path: '/governance/quality-parameters' },
          { label: 'IQAC Committee', path: '/governance/iqac-committee' },
          { label: 'Policies & Procedures', path: '/governance/policies-procedures' },
          { label: 'Annual Reports & Reforms', path: '/governance/annual-reports' },
          { label: 'MHRD NIRF Reports', path: '/governance/nirf-reports' },
          { label: 'NBA – Data Capturing Points', path: '/governance/nba-data' },
        ],
      },
      {
        groupLabel: 'Information',
        groupPath: '/information',
        items: [
          { label: 'Academic Calendar', path: '/information#academic-calendar' },
          { label: 'List of Holidays', path: '/information#holidays' },
          { label: 'How to Reach', path: '/information#how-to-reach' },
          { label: 'Counselling Scheme', path: '/information#counselling' },
          { label: 'ICT Platforms', path: '/information#ict-platforms' },
          { label: 'Other Practices', path: '/information#other-practices' },
        ],
      },
    ],
  },
  {
    // Course Curriculum / Academic Documents items are spliced in at render
    // time from live Firestore data — see renderedNavItems in Header().
    label: 'Academics',
    children: [
      { label: 'Programs & Departments', path: '/academics' },
      { label: 'Faculty', path: '/faculty' },
      { label: 'Result Analysis', path: '/result-analysis' },
      { label: 'Academic Calendar', path: '/information#academic-calendar' },
    ],
  },
  {
    label: 'Admissions',
    children: [
      { label: 'Admissions Overview', path: '/admissions' },
      { label: 'Programmes & Fee Structure', path: '/programmes-fee-structure' },
      { label: 'Admission Procedure', path: '/admission-procedure' },
      { label: 'Result Analysis', path: '/result-analysis' },
      { label: 'Fee Payment Portal', path: 'https://svecw.ac.in/Default.aspx?ReturnUrl=%2f', external: true },
      { label: 'How to Reach', path: '/information#how-to-reach' },
    ],
  },
  {
    label: 'Placements',
    children: [
      { label: 'Placements Overview', path: '/placements' },
      { label: 'Placement Details', path: '/placements/placement-details' },
      { label: 'Success Stories', path: '/placements/success-stories' },
      { label: 'TPO Cell', path: '/placements/tpo-cell' },
      { label: 'TPO Team', path: '/placements/tpo-team' },
      { label: 'Industry Liaison Offices', path: '/placements/industry-liaison-offices' },
      { label: 'Career Guidance Cell', path: '/placements/career-guidance-cell' },
      { label: 'Campus Recruitment Training', path: '/placements/campus-recruitment-training' },
      { label: 'Our Recruiters', path: '/placements/our-recruiters' },
      { label: 'Employability Skills', path: '/placements/employability-skills' },
      { label: 'Mission R&D', path: '/placements/mission-rd' },
      { label: 'Study Abroad – GSAC', path: '/placements/gsac' },
      { label: 'Higher Education', path: '/placements/higher-education' },
    ],
  },
  {
    label: 'Research',
    groups: [
      {
        groupLabel: 'R&D Governance',
        groupPath: '/research#governance',
        items: [
          { label: 'About R&D', path: '/research/about-rd' },
          { label: 'Research Advisory Committee', path: '/research/research-advisory-committee' },
          { label: 'Research Ethics Committee', path: '/research/research-ethics-committee' },
          { label: 'IPR Committee', path: '/research/ipr-committee' },
          { label: 'Research Centers', path: '/research/research-centers' },
        ],
      },
      {
        groupLabel: 'Research Output',
        groupPath: '/research#output',
        items: [
          { label: 'Thrust Areas of Research', path: '/research/thrust-areas-of-research' },
          { label: 'Funded Projects', path: '/research/funded-projects' },
          { label: 'Seed Money Projects', path: '/research/seed-money-projects' },
          { label: 'Research Publications', path: '/research/research-publications' },
          { label: 'Patents', path: '/research/patents' },
        ],
      },
      {
        groupLabel: 'Industry & Professional Engagement',
        groupPath: '/research#engagement',
        items: [
          { label: 'MoUs', path: '/research/mous' },
          { label: 'Consultancy', path: '/research/consultancy' },
          { label: 'Professional Bodies', path: '/research/professional-bodies' },
        ],
      },
    ],
  },
  {
    // Was a group inside Research's mega-menu — now its own top-level item.
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
    // Two groups instead of a flat 17-item list, now that Student Life's
    // own items live here too — matches the Discover mega-menu pattern.
    // Each group with >9 items auto-splits into two sub-columns (see
    // .mega-group-list.cols-2 in Header.css), so Campus Facilities (17
    // items) renders as two columns and Student Life (7) as one.
    label: 'Campus Life',
    groups: [
      {
        groupLabel: 'Campus Facilities',
        groupPath: '/campus',
        items: [
          { label: 'Campus Life Overview', path: '/campus' },
          { label: 'Smart Class Rooms', path: '/campus/smart-classrooms' },
          { label: 'State-of-the-art Labs', path: '/campus/state-of-the-art-labs' },
          { label: 'Central Library', path: '/campus/central-library' },
          { label: 'Auditoriums', path: '/campus/auditoriums' },
          { label: 'Campus Book Stores', path: '/campus/campus-book-stores' },
          { label: 'Wi-Fi Campus', path: '/campus/wifi-campus' },
          { label: 'Campus Hostels', path: '/campus/campus-hostels' },
          { label: 'Food Courts', path: '/campus/food-courts' },
          { label: 'VISHNU Fitness Centre', path: '/campus/fitness-centre' },
          { label: 'Staff Quarters', path: '/campus/staff-quarters' },
          { label: 'Travel Desk', path: '/campus/travel-desk' },
          { label: 'Temples', path: '/campus/temples' },
          { label: 'Health Care', path: '/campus/health-care' },
          { label: 'Swimming Pool', path: '/campus/swimming-pool' },
          { label: 'Campus Security', path: '/campus/campus-security' },
          { label: 'Other Facilities', path: '/campus/other-facilities' },
        ],
      },
      {
        groupLabel: 'Student Life',
        groupPath: '/student-life',
        items: [
          { label: 'Student Life Overview', path: '/student-life' },
          { label: 'Student Clubs', path: '/student-clubs' },
          { label: 'Sports & Games', path: '/sports-games' },
          { label: 'Arts & Culture', path: '/arts-culture' },
          { label: 'Social Services (NSS)', path: '/social-services' },
          { label: 'Campus Magazines', path: '/campus-magazines' },
          { label: 'Vishnu TV Academy', path: '/vishnu-tv-academy' },
        ],
      },
    ],
  },
  {
    // Alumni & Giving's items live here as a second group (no longer its
    // own top-level nav item) — see the "Success Stories" admin-redirect
    // splice for this group in renderedNavItems below.
    label: 'News & Events',
    groups: [
      {
        groupLabel: 'News & Events',
        groupPath: '/news-awards',
        items: [
          { label: 'News & Awards Overview', path: '/news-awards' },
          { label: 'Happenings at VWU', path: '/news-awards/happenings' },
          { label: 'Accreditations & Awards', path: '/news-awards/accreditations-awards' },
          { label: 'Gallery', path: '/news-awards/gallery' },
          { label: 'News', path: '/news' },
          { label: 'Events', path: '/events' },
        ],
      },
      {
        groupLabel: 'Alumni & Giving',
        groupPath: '/alumni-giving',
        items: [
          { label: 'Alumni Network', path: '/alumni-giving#network' },
          { label: 'Giving Opportunities', path: '/alumni-giving#give' },
          { label: 'Alumni Events', path: '/alumni-giving#events' },
          { label: 'Prathibha Magazine', path: '/alumni-giving#magazine' },
          { label: 'Success Stories', path: '/placements/success-stories' },
        ],
      },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Single source of truth for which desktop dropdown is open — set by
  // hover, keyboard focus, and click alike. Previously hover (via CSS
  // :hover/:focus-within) and click (via a separate "force closed" flag)
  // were two independent mechanisms layered on top of each other, and the
  // force-closed flag got cleared on mouseleave — so so much as jiggling the
  // mouse off and back onto an item you'd just clicked closed would let
  // hover silently reopen it. Routing both through one state means the most
  // recent interaction (of either kind) is simply what's true; there's
  // nothing left for them to disagree about.
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedSubItem, setExpandedSubItem] = useState<string | null>(null);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  const { docs: downloadDocs, loading: downloadsLoading } = useOrderedCollection<DownloadDoc>('downloads', 'order');
  // Admin-editable via /admin → Navigation Link Redirects (NavLinkOverridesAdmin.tsx).
  // Decoupled from Placements' own "Success Stories" item, which stays hardcoded.
  // Default target is AlumniGiving.tsx's own "#successstories" section, not Placements.
  const alumniSuccessStories = useNavLinkOverride('alumni-success-stories', '/alumni-giving#successstories');

  const academicDocsChild: NavChild = {
    label: 'Academic Documents',
    path: '/academics/downloads',
    subItems: downloadsLoading
      ? [{ label: 'Loading…', path: '', disabled: true }]
      : downloadDocs.length > 0
        ? downloadDocs.map((d) => ({ label: d.title, path: d.fileUrl, external: true }))
        : [{ label: 'No documents yet', path: '', disabled: true }],
  };

  // Academics' children are the static list + this live-Firestore-derived
  // flyout item, spliced in after "Faculty" since navItems itself is a
  // module-level constant and can't hold live data directly.
  const renderedNavItems: NavItem[] = navItems.map((item) => {
    if (item.label === 'Academics' && item.children) {
      const children: NavChild[] = [];
      for (const child of item.children) {
        children.push(child);
        if (child.label === 'Faculty') children.push(academicDocsChild);
      }
      return { ...item, children };
    }
    // "Success Stories" here is admin-redirectable independently of
    // Placements' own "Success Stories" item — see alumniSuccessStories above.
    if (item.label === 'News & Events' && item.groups) {
      const groups = item.groups.map((group) =>
        group.groupLabel === 'Alumni & Giving'
          ? {
              ...group,
              items: group.items.map((child) =>
                child.label === 'Success Stories'
                  ? { ...child, path: alumniSuccessStories.path, external: alumniSuccessStories.external }
                  : child
              ),
            }
          : group
      );
      return { ...item, groups };
    }
    return item;
  });

  const renderNavItem = (item: NavItem) => (
    <li
      key={item.label}
      className={`nav-item${openItem === item.label ? ' nav-item--open' : ''}${item.label === 'Research' || item.label === 'Campus Life' || item.label === 'News & Events' ? ' nav-item--mega-right' : ''}${item.label === 'Placements' ? ' nav-item--placements' : ''}`}
      onMouseEnter={() => setOpenItem(item.label)}
      onFocus={() => setOpenItem(item.label)}
      onMouseLeave={() => setOpenItem((prev) => (prev === item.label ? null : prev))}
    >
      <button
        className="nav-link"
        aria-haspopup="true"
        aria-expanded={openItem === item.label}
        onClick={() => setOpenItem((prev) => (prev === item.label ? null : item.label))}
      >
        {item.label}
        <svg className="nav-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Flat dropdown */}
      {item.children && (
        <div className="dropdown" role="menu">
          <ul className="dropdown-list">
            {item.children.map((child) => (
              <li key={child.label} className={child.subItems ? 'dropdown-item--flyout-parent' : undefined}>
                {child.disabled ? (
                  <span className="dropdown-item" style={{ opacity: 0.5, cursor: 'default' }}>
                    {child.label}
                  </span>
                ) : (child.external || child.download) ? (
                  <a href={child.path} className="dropdown-item" role="menuitem" download={child.download} target={child.download ? undefined : '_blank'} rel="noopener noreferrer">
                    {child.label}
                    {!child.download && <span style={{ fontSize: '0.6rem', opacity: 0.5, marginLeft: 4 }}>↗</span>}
                  </a>
                ) : (
                  <Link to={child.path} className="dropdown-item" role="menuitem">
                    {child.label}
                    {child.subItems && <span className="dropdown-item__chevron">›</span>}
                  </Link>
                )}
                {child.subItems && (
                  <ul className="dropdown-flyout" role="menu">
                    {child.subItems.map((sub) => (
                      <li key={sub.label}>
                        {sub.disabled ? (
                          <span className="dropdown-item" style={{ opacity: 0.5, cursor: 'default' }}>
                            {sub.label}
                          </span>
                        ) : (sub.external || sub.download) ? (
                          <a href={sub.path} className="dropdown-item" role="menuitem" download={sub.download} target={sub.download ? undefined : '_blank'} rel="noopener noreferrer">
                            {sub.label}
                          </a>
                        ) : (
                          <Link to={sub.path} className="dropdown-item" role="menuitem">
                            {sub.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mega-menu dropdown */}
      {item.groups && (
        <div className="dropdown dropdown-mega" role="menu">
          {item.groups.map((group) => (
            <div key={group.groupLabel} className="mega-group">
              {group.groupPath ? (
                <Link to={group.groupPath} className="mega-group-label">
                  {group.groupLabel}
                </Link>
              ) : (
                <span className="mega-group-label">{group.groupLabel}</span>
              )}
              <ul className={`mega-group-list${group.items.length > 9 ? ' cols-2' : ''}`}>
                {group.items.map((child) => (
                  <li key={child.label}>
                    {child.disabled ? (
                      <span className="dropdown-item" style={{ opacity: 0.5, cursor: 'default' }}>
                        {child.label}
                      </span>
                    ) : (child.external || child.download) ? (
                      <a href={child.path} className="dropdown-item" role="menuitem" download={child.download} target={child.download ? undefined : '_blank'} rel="noopener noreferrer">
                        {child.label}
                      </a>
                    ) : (
                      <Link to={child.path} className="dropdown-item" role="menuitem">
                        {child.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // The header is sticky, so scrolling under a stationary cursor would
      // otherwise leave a dropdown open while the page moves underneath it.
      setOpenItem(null);
      (document.activeElement as HTMLElement | null)?.blur();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The two standard ways users expect to dismiss an open menu: clicking
  // anywhere outside it, or pressing Escape.
  useEffect(() => {
    if (!openItem) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenItem(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenItem(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openItem]);

  useEffect(() => {
    setMobileOpen(false);
    setExpandedItem(null);
    setExpandedGroup(null);
    setExpandedSubItem(null);
    setOpenItem(null);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Main Header */}
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="logo" aria-label="Vishnu Womens University Home">
            <img src="/images/logo.png" alt="VWU Logo" className="logo-icon" />
          </Link>

          <div className="header-right">
            {/* Topline: announcements ticker + Visit/Give/Apply */}
            <div className="header-topline">
              <AnnouncementsTicker fallback={null} />
              <div className="header-ctas">
                <Link to="/admissions" className="topbar-cta visit">Visit</Link>
                <Link to="/alumni-giving" className="topbar-cta give">Give</Link>
                <Link to="/admissions" className="topbar-cta apply">Apply Now</Link>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="nav" aria-label="Main navigation" ref={navRef}>
              <ul className="nav-list">
                {renderedNavItems.map(renderNavItem)}
              </ul>
            </nav>
          </div>

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
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen} data-lenis-prevent>
        <div className="mobile-menu-content">
          <ul className="mobile-nav-list">
            {renderedNavItems.map((item) => {
              const isExpanded = expandedItem === item.label;
              return (
                <li key={item.label} className="mobile-nav-item">
                  <button
                    className={`mobile-nav-link${isExpanded ? ' active' : ''}`}
                    onClick={() => {
                      setExpandedItem(isExpanded ? null : item.label);
                      setExpandedGroup(null);
                      setExpandedSubItem(null);
                    }}
                  >
                    {item.label}
                    <svg className={`mobile-nav-arrow${isExpanded ? ' rotated' : ''}`} viewBox="0 0 12 12" width="14" height="14" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Flat submenu */}
                  {item.children && (
                    <SmoothCollapse open={isExpanded}>
                    <ul className="mobile-submenu">
                      {item.children.map((child) => {
                        if (child.subItems) {
                          const subKey = `${item.label}:${child.label}`;
                          const subOpen = expandedSubItem === subKey;
                          return (
                            <li key={child.label} className="mobile-group">
                              <button
                                className={`mobile-group-btn${subOpen ? ' active' : ''}`}
                                onClick={() => setExpandedSubItem(subOpen ? null : subKey)}
                              >
                                {child.label}
                                <svg className={`mobile-nav-arrow${subOpen ? ' rotated' : ''}`} viewBox="0 0 12 12" width="12" height="12" fill="none">
                                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              <SmoothCollapse open={subOpen}>
                                <ul className="mobile-group-items">
                                  {child.subItems.map((sub) => (
                                    <li key={sub.label}>
                                      {sub.disabled ? (
                                        <span className="mobile-sub-item" style={{ opacity: 0.5 }}>{sub.label}</span>
                                      ) : (sub.external || sub.download) ? (
                                        <a href={sub.path} className="mobile-sub-item" download={sub.download} target={sub.download ? undefined : '_blank'} rel="noopener noreferrer">{sub.label}</a>
                                      ) : (
                                        <Link to={sub.path} className="mobile-sub-item">{sub.label}</Link>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </SmoothCollapse>
                            </li>
                          );
                        }
                        return (
                          <li key={child.label}>
                            {child.disabled ? (
                              <span className="mobile-sub-item" style={{ opacity: 0.5 }}>{child.label}</span>
                            ) : (child.external || child.download) ? (
                              <a href={child.path} className="mobile-sub-item" download={child.download} target={child.download ? undefined : '_blank'} rel="noopener noreferrer">
                                {child.label} {!child.download && <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>↗</span>}
                              </a>
                            ) : (
                              <Link to={child.path} className="mobile-sub-item">{child.label}</Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    </SmoothCollapse>
                  )}

                  {/* Grouped submenu — each group is its own accordion */}
                  {item.groups && (
                    <SmoothCollapse open={isExpanded}>
                    <ul className="mobile-submenu mobile-submenu-groups">
                      {item.groups.map((group) => {
                        const groupKey = `${item.label}:${group.groupLabel}`;
                        const groupOpen = expandedGroup === groupKey;
                        return (
                          <li key={group.groupLabel} className="mobile-group">
                            <button
                              className={`mobile-group-btn${groupOpen ? ' active' : ''}`}
                              onClick={() => setExpandedGroup(groupOpen ? null : groupKey)}
                            >
                              {group.groupLabel}
                              <svg className={`mobile-nav-arrow${groupOpen ? ' rotated' : ''}`} viewBox="0 0 12 12" width="12" height="12" fill="none">
                                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <SmoothCollapse open={groupOpen}>
                              <ul className="mobile-group-items">
                                {group.items.map((child) => (
                                  <li key={child.label}>
                                    {child.disabled ? (
                                      <span className="mobile-sub-item" style={{ opacity: 0.5 }}>{child.label}</span>
                                    ) : (child.external || child.download) ? (
                                      <a href={child.path} className="mobile-sub-item" download={child.download} target={child.download ? undefined : '_blank'} rel="noopener noreferrer">{child.label}</a>
                                    ) : (
                                      <Link to={child.path} className="mobile-sub-item">{child.label}</Link>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </SmoothCollapse>
                          </li>
                        );
                      })}
                    </ul>
                    </SmoothCollapse>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mobile-social">
            {[
              { label: 'Instagram', href: 'http://instagram.com/vishnu_svecw/' },
              { label: 'Facebook', href: 'https://www.facebook.com/svecwcollege' },
              { label: 'Twitter', href: 'https://twitter.com/svecw2' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/school/vishnusvecw/' },
              { label: 'YouTube', href: 'https://www.youtube.com/@SVECW-B0' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
