import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useNavLinkOverride } from '../../hooks/useNavLinkOverride';
import type { ProgramDoc } from '../../pages/Admin/sections/ProgramsAdmin';
import { DIFFERENTIATOR_CATEGORIES } from '../../pages/Admin/sections/DifferentiatorsAdmin';
import type { DifferentiatorItemDoc } from '../../pages/Admin/sections/DifferentiatorsAdmin';
import type { PlacementItemDoc, PlacementMenuColumnDoc } from '../../pages/Admin/sections/PlacementItemsAdmin';
import SmoothCollapse from '../SmoothCollapse/SmoothCollapse';
import './Header.css';

// Pure-code safety net for the Placements mega-menu: used only if the
// `placementMenuColumns` collection is genuinely empty (nobody has opened
// Admin → Placements yet to trigger its auto-seed), so a first-time deploy
// never shows an empty dropdown while waiting on that.
const FALLBACK_PLACEMENT_MENU_COLUMNS: PlacementMenuColumnDoc[] = [
  { id: 'explore', label: 'Explore Directory', order: 0 },
];

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
  highlight?: {
    title: string;
    description: string;
    badge?: string;
    linkText?: string;
    linkPath?: string;
  };
}

const navItemsData: NavItem[] = [
  {
    label: 'About Us',
    highlight: {
      title: 'Vishnu Women\'s University',
      badge: 'About SVES',
      description: 'Pioneering women\'s engineering education under Sri Vishnu Educational Society with world-class infrastructure and values.',
      linkText: 'Explore Campus',
      linkPath: '/about',
    },
    groups: [
      {
        groupLabel: 'About Us',
        groupPath: '/about',
        items: [
          { label: 'About VWU', path: '/about' },
          { label: 'Vision & Mission', path: '/vision-mission' },
          { label: 'Institutional Development Plan', path: '/governance/idp', disabled: true },
          { label: 'Organizational Chart', path: '/downloads/SVECWOrganizationChart.jpg', download: true, disabled: true },
          { label: 'Core Executive Body', path: '/about#core-executive' },
          { label: 'About Society (SVES)', path: '/about-sves' },
        ],
      },
      {
        groupLabel: 'Governance',
        items: [
          { label: 'Governing Body', path: '/governance/governing-body', disabled: true },
          { label: 'Academic Council', path: '/governance/academic-council', disabled: true },
          { label: 'Board of Studies', path: '/governance/board-of-studies', disabled: true },
          { label: 'Finance Committee', path: '/governance/finance-committee', disabled: true },
        ],
      },
      {
        groupLabel: 'Committees',
        items: [
          { label: 'College Academic Committee', path: '/governance/college-academic-committee', disabled: true },
          { label: 'Acad. & Admin. Audit Committee', path: '/governance/academic-administrative-audit', disabled: true },
          { label: 'Freshmen Committee', path: '/governance/freshmen-committee', disabled: true },
          { label: 'Infrastructure Management', path: '/governance/infrastructure-management', disabled: true },
          { label: 'Faculty Grievance Redressal', path: '/governance/faculty-grievance', disabled: true },
          { label: 'Student Grievance Redressal', path: '/governance/student-grievance', disabled: true },
          {label: 'Central Purchase Committee', path: '/governance/central-purchase', disabled: true },
          { label: 'Anti-Ragging Committee', path: '/governance/anti-ragging', disabled: true },
          { label: 'Internal Committee (POSH)', path: '/governance/internal-committee', disabled: true },
          { label: 'SC/ST Cell', path: '/governance/sc-st-cell', disabled: true },
          { label: 'R&D Committee', path: '/governance/rd-committee', disabled: true },
        ],
      },
      {
        groupLabel: 'IQAC',
        items: [
          { label: 'About IQAC', path: '/governance/about-iqac', disabled: true },
          { label: 'IQAC Worksystem', path: '/governance/iqac-worksystem', disabled: true },
          { label: 'Quality Parameters', path: '/governance/quality-parameters', disabled: true },
          { label: 'IQAC Committee', path: '/governance/iqac-committee', disabled: true },
          { label: 'Policies & Procedures', path: '/governance/policies-procedures', disabled: true },
        ],
      },
    ],
  },
  {
    label: 'Academics',
    highlight: {
      title: 'Academic Excellence',
      description: 'Industry-aligned curriculum, multidisciplinary research, distinguished faculty, and hands-on laboratory learning.',
      linkText: 'All Programs',
      linkPath: '/academics',
    },
    groups: [
      {
        groupLabel: 'Overview',
        groupPath: '/academics',
        items: [
          { label: 'Departments', path: '/academics/departments' },
          { label: 'Programs', path: '/academics/programs' },
          { label: 'Faculty Directory', path: '/faculty' },
          { label: 'Results Analysis', path: '/result-analysis' },
          { label: 'Examinations Portal', path: 'https://www.svecwexams.in/', external: true },
        ],
      },
      { groupLabel: 'UG Programmes', groupPath: '/academics?tab=btech', items: [] },
      { groupLabel: 'PG Programmes', groupPath: '/academics?tab=mtech', items: [] },
      { groupLabel: 'Ph.D Programmes', groupPath: '/academics?tab=phd', items: [] },
      {
        groupLabel: 'Information',
        groupPath: '/information',
        items: [
          { label: 'Academic Calendar', path: '/information#academic-calendar' },
          { label: 'List of Holidays', path: '/information#holidays' },
          { label: 'Counselling Scheme', path: '/information#counselling' },
          { label: 'ICT Platforms', path: '/information#ict-platforms' },
          { label: 'Other Practices', path: '/information#other-practices' },
        ],
      },
    ],
  },
  {
    label: 'Admissions',
    highlight: {
      title: 'Join VWU',
      badge: 'Admissions 2026-27',
      description: 'Empowering future women engineers, researchers, and innovators. Transparent admission process and merit scholarships.',
      linkText: 'Fee Structure',
      linkPath: '/programmes-fee-structure',
    },
    children: [
      { label: 'Admissions Overview', path: '/admissions' },
      { label: 'Programmes & Fee Structure', path: '/programmes-fee-structure' },
      { label: 'Admission Procedure', path: '/admission-procedure' },
      { label: 'Results Analysis', path: '/result-analysis' },
      { label: 'Fee Payment Portal', path: 'https://svecw.ac.in/Default.aspx?ReturnUrl=%2f', external: true },
      { label: 'How to Reach Campus', path: '/contact' },
    ],
  },
  {
    label: 'Differentiators',
    highlight: {
      title: 'Distinctive Edge',
      badge: 'Unique Initiatives',
      description: 'From assistive technology labs and micro-manufacturing to student radio and innovation ecosystems.',
      linkText: 'View All Initiatives',
      linkPath: '/differentiators',
    },
    groups: [
      ...DIFFERENTIATOR_CATEGORIES.map((cat) => ({
        groupLabel: cat.label,
        groupPath: `/differentiators#${cat.id}`,
        items: [],
      })),
    ],
  },
  {
    label: 'Placements',
    highlight: {
      title: 'Top Tier Placements',
      badge: '90%+ Track Record',
      description: 'Leading global recruiters, career development training, and exceptional internship opportunities.',
      linkText: 'Placement Insights',
      linkPath: '/placements',
    },
    // Populated below from the live `placementItems` collection, grouped by
    // each item's admin-set menuColumn (see renderedNavItems).
    groups: [],
  },
  {
    label: 'Research',
    highlight: {
      title: 'Innovation & Patents',
      badge: '50+ Patents Filed',
      description: 'DST & AICTE funded projects, collaborative research centers, and cutting-edge publications.',
      linkText: 'R&D Overview',
      linkPath: '/research/about-rd',
    },
    children: [
      { label: 'About R&D', path: '/research/about-rd' },
      { label: 'Research Advisory Committee', path: '/research/research-advisory-committee' },
      { label: 'Research Ethics Committee', path: '/research/research-ethics-committee' },
      { label: 'Intellectual Property Rights (IPR)', path: '/research/ipr-committee' },
      { label: 'Thrust Areas of Research', path: '/research/thrust-areas-of-research' },
      { label: 'Research Centers', path: '/research/research-centers' },
      { label: 'Funded Projects', path: '/research/funded-projects' },
      { label: 'Seed Money Projects', path: '/research/seed-money-projects' },
      { label: 'Research Publications', path: '/research/research-publications' },
      { label: 'MoUs & Collaborations', path: '/research/mous' },
      { label: 'Patents', path: '/research/patents' },
      { label: 'Consultancy', path: '/research/consultancy' },
      { label: 'Professional Bodies', path: '/research/professional-bodies' },
    ],
  },
  {
    label: 'Campus Life',
    highlight: {
      title: 'Vibrant Green Campus',
      badge: 'Life at VWU',
      description: 'Lush green residential campus with modern sports facilities, amphitheaters, radio station, and student clubs.',
      linkText: 'Explore Facilities',
      linkPath: '/campus/central-library',
    },
    children: [
      { label: 'Smart Class Rooms', path: '/campus/smart-classrooms' },
      { label: 'State-of-the-art Labs', path: '/campus/state-of-the-art-labs' },
      { label: 'Central Library', path: '/campus/central-library' },
      { label: 'Auditoriums & Amphitheaters', path: '/campus/auditoriums' },
      { label: 'Campus Book Stores', path: '/campus/campus-book-stores' },
      { label: 'Wi-Fi Campus', path: '/campus/wifi-campus' },
      { label: 'Campus Hostels', path: '/campus/campus-hostels' },
      { label: 'Food Courts & Cafeterias', path: '/campus/food-courts' },
      { label: 'VISHNU Fitness Centre', path: '/campus/fitness-centre' },
      { label: 'Health Care Centre', path: '/campus/health-care' },
      { label: 'Swimming Pool & Sports', path: '/campus/swimming-pool' },
      { label: 'Radio Vishnu 90.4', path: '/differentiators/radio-vishnu-diff' },
      { label: 'Vishnu TV Academy', path: '/vishnu-tv-academy' },
      { label: 'Student Clubs', path: '/student-clubs' },
      { label: 'Arts & Culture', path: '/arts-culture' },
      { label: 'Sports & Games', path: '/sports-games' },
    ],
  },
  {
    label: 'News & Events',
    highlight: {
      title: 'Happenings & Accolades',
      badge: 'NAAC A+ & NBA',
      description: 'Stay updated with upcoming conferences, hackathons, guest lectures, and institutional recognitions.',
      linkText: 'View Gallery',
      linkPath: '/news-awards/gallery',
    },
    groups: [
      {
        groupLabel: 'News & Events',
        groupPath: '/news-awards',
        items: [
          { label: 'Upcoming Events', path: '/news-awards/happenings#upcoming-events' },
          { label: 'Recent Events', path: '/news-awards/happenings#recent-events' },
          { label: 'News & Events', path: '/news' },
          { label: 'Photo & Video Gallery', path: '/news-awards/gallery' },
          { label: 'Vishnu Era Newsletter', path: 'https://www.srivishnu.edu.in/vishnu-era/', external: true },
          { label: 'Prathibha Magazine', path: 'https://heyzine.com/flip-book/088b7b5629.html#page/54', external: true },
        ],
      },
      {
        groupLabel: 'Accreditations & Rankings',
        groupPath: '/news-awards/accreditations-awards',
        items: [
          { label: 'Accreditations (NAAC, NBA)', path: '/news-awards/accreditations-awards#accreditation' },
          { label: 'Rankings & Awards', path: '/news-awards/accreditations-awards#ranking' },
        ],
      },
    ],
  },
  {
    label: 'Contact',
    highlight: {
      title: 'Get in Touch',
      badge: 'Bhimavaram Campus',
      description: 'Vishnupur, Bhimavaram, West Godavari District, Andhra Pradesh - 534202. We are here to help.',
      linkText: 'Contact Details',
      linkPath: '/contact',
    },
    children: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'How to Reach Campus', path: '/contact' },
    ],
  },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [hoverPillStyle, setHoverPillStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const navItemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic overrides and data hooks
  const headerApplyNow = useNavLinkOverride('header-apply-now', '/admissions');
  const orgChart = useNavLinkOverride('header-organizational-chart', '/downloads/SVECWOrganizationChart.jpg');

  const { docs: programs } = useOrderedCollection<ProgramDoc>('programs', 'order');
  const isVlsiProgram = (p: ProgramDoc) =>
    p.slug.toUpperCase() === 'EVT' || /VLSI|VSLI/.test(p.name.toUpperCase());
  const programItem = (p: ProgramDoc): NavChild => ({
    label: p.name,
    path: isVlsiProgram(p) ? '/academics/ece' : `/academics/${p.slug}`,
  });
  const ugProgrammes = programs.filter((p) => p.category === 'btech').map(programItem);
  const pgProgrammes = programs.filter((p) => p.category === 'mtech' || p.category === 'mba').map(programItem);
  const phdProgrammes = programs.filter((p) => p.category === 'phd').map(programItem);

  const { docs: differentiatorItems } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { docs: placementItems } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  // Admin-managed columns for the Placements mega-menu (add/rename/reorder
  // in Admin → Placements). If nobody has ever opened that admin section
  // yet (collection genuinely empty, not just still loading), fall back to
  // a single column so the menu never renders empty — PlacementItemsAdmin
  // auto-seeds the real 3 default columns the first time it's opened.
  const { docs: placementMenuColumnsRaw } = useOrderedCollection<PlacementMenuColumnDoc>('placementMenuColumns', 'order');
  const placementMenuColumns = placementMenuColumnsRaw.length > 0
    ? placementMenuColumnsRaw
    : FALLBACK_PLACEMENT_MENU_COLUMNS;

  // Entrance transition trigger (150ms after load)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      setOpenItem(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Route change reset
  useEffect(() => {
    setMobileOpen(false);
    setExpandedItem(null);
    setExpandedGroup(null);
    setOpenItem(null);
    setHoverPillStyle((prev) => ({ ...prev, opacity: 0 }));
  }, [location]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Click outside to dismiss mega menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setOpenItem(null);
        setHoverPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenItem(null);
        setHoverPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Build rendered items with dynamic Firestore data
  const renderedNavItems: NavItem[] = navItemsData.map((item) => {
    if (item.label === 'About Us' && item.groups) {
      const groups = item.groups.map((group) => {
        if (group.groupLabel !== 'About Us') return group;
        return {
          ...group,
          items: group.items.map((child) =>
            child.label === 'Organizational Chart'
              ? { ...child, path: orgChart.path }
              : child
          ),
        };
      });
      return { ...item, groups };
    }
    if (item.label === 'Academics' && item.groups) {
      const groups = item.groups.map((group) => {
        if (group.groupLabel === 'UG Programmes') return { ...group, items: ugProgrammes };
        if (group.groupLabel === 'PG Programmes') return { ...group, items: pgProgrammes };
        if (group.groupLabel === 'Ph.D Programmes') return { ...group, items: phdProgrammes };
        return group;
      });
      return { ...item, groups };
    }
    if (item.label === 'Differentiators' && item.groups) {
      const groups = item.groups.map((group) => {
        const cat = DIFFERENTIATOR_CATEGORIES.find((c) => c.label === group.groupLabel);
        if (!cat) return group;
        return {
          ...group,
          items: differentiatorItems
            .filter((i) => i.category === cat.id)
            .map((i): NavChild =>
              i.external && i.url
                ? { label: i.title, path: i.url, external: true }
                : { label: i.title, path: `/differentiators/${i.slug}` }
            ),
        };
      });
      return { ...item, groups };
    }
    if (item.label === 'Placements') {
      const toChild = (p: PlacementItemDoc): NavChild =>
        p.external && p.url
          ? { label: p.title, path: p.url, external: true }
          : { label: p.title, path: `/placements/${p.slug}` };

      // Group items by their admin-assigned column id. Anything unassigned,
      // or pointing at a column that's since been deleted, falls back to
      // whichever column currently sorts first — so an item never silently
      // disappears from the menu just because its column went away.
      const firstColumnId = placementMenuColumns[0]?.id;
      const buckets = new Map<string, PlacementItemDoc[]>(placementMenuColumns.map((c) => [c.id, []]));
      placementItems.forEach((p) => {
        const colId = p.menuColumn && buckets.has(p.menuColumn) ? p.menuColumn : firstColumnId;
        if (colId) buckets.get(colId)!.push(p);
      });

      return {
        ...item,
        groups: placementMenuColumns
          .map((c) => ({ groupLabel: c.label, items: (buckets.get(c.id) ?? []).map(toChild) }))
          .filter((g) => g.items.length > 0),
      };
    }
    return item;
  });

  // Track hover pill capsule position directly targeting the button
  const updateHoverPill = (label: string | null) => {
    if (!label || !navListRef.current) {
      setHoverPillStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const li = navItemRefs.current[label];
    if (!li) {
      setHoverPillStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const btn = (li.querySelector('.nav-tab-btn') as HTMLElement) || li;
    const listRect = navListRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setHoverPillStyle({
      left: btnRect.left - listRect.left,
      top: btnRect.top - listRect.top,
      width: btnRect.width,
      height: btnRect.height,
      opacity: 1,
    });
  };

  const handleNavHover = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenItem(label);
    updateHoverPill(label);
  };

  const handleNavLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenItem(null);
      setHoverPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }, 180);
  };

  const activeItemData = openItem ? renderedNavItems.find((item) => item.label === openItem) : null;
  const isDropdownActive = Boolean(activeItemData && (activeItemData.groups || activeItemData.children));

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`floating-navbar-root${mounted ? ' is-mounted' : ''}`}>
      <div
        ref={navContainerRef}
        className={`floating-navbar-container${scrolled ? ' is-scrolled' : ''}${isDropdownActive ? ' is-expanded' : ''}${mobileOpen ? ' is-mobile-open' : ''}`}
        onMouseEnter={() => {
          if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
          }
        }}
        onMouseLeave={handleNavLeave}
      >
        {/* Main Pill Island */}
        <div className="navbar-pill">
          {/* Left Brand Identity: Responsive Desktop Logo / Mobile Square Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="navbar-brand-link"
            aria-label="Vishnu Women's University - Home"
          >
            {/* Desktop Rectangular Full Logo */}
            <img
              src="/images/logo.png"
              alt="Vishnu Women's University"
              className="navbar-logo-img navbar-logo-desktop"
            />
            {/* Mobile Square Logo from Footer with typography */}
            <div className="navbar-brand-mobile">
              <img
                src="/images/square%20logo.png"
                alt="Vishnu Women's University Logo"
                className="navbar-logo-square"
              />
              <div className="navbar-brand-mobile-text">
                <span className="navbar-brand-m-name">Vishnu Women's</span>
                <span className="navbar-brand-m-sub">University</span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Tabs with Clean Labels & Sliding Hover Capsule */}
          <nav className="navbar-nav" aria-label="Main Navigation">
            <ul ref={navListRef} className="navbar-nav-list">
              {/* GPU-accelerated Sliding Hover Capsule */}
              <div
                className="nav-sliding-pill"
                style={{
                  transform: `translate3d(${hoverPillStyle.left}px, ${hoverPillStyle.top}px, 0)`,
                  width: `${hoverPillStyle.width}px`,
                  height: `${hoverPillStyle.height}px`,
                  opacity: hoverPillStyle.opacity,
                }}
              />

              {renderedNavItems.map((item) => {
                const isOpen = openItem === item.label;
                return (
                  <li
                    key={item.label}
                    ref={(el) => { navItemRefs.current[item.label] = el; }}
                    className={`nav-tab-item${isOpen ? ' is-active' : ''}`}
                    onMouseEnter={() => handleNavHover(item.label)}
                    onFocus={() => handleNavHover(item.label)}
                  >
                    <button
                      type="button"
                      className="nav-tab-btn"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => {
                        if (isOpen) {
                          setOpenItem(null);
                          setHoverPillStyle((prev) => ({ ...prev, opacity: 0 }));
                        } else {
                          handleNavHover(item.label);
                        }
                      }}
                    >
                      <span className="nav-tab-label">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action & Mobile Trigger */}
          <div className="navbar-actions">
            {/* Desktop CTA Pill */}
            {headerApplyNow.external ? (
              <a
                href={headerApplyNow.path}
                target="_blank"
                rel="noopener noreferrer"
                className="navbar-cta-btn"
              >
                <span>Apply Now</span>
                <span className="navbar-cta-icon-wrap">
                  <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
              </a>
            ) : (
              <Link to={headerApplyNow.path} className="navbar-cta-btn">
                <span>Apply Now</span>
                <span className="navbar-cta-icon-wrap">
                  <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
              </Link>
            )}

            {/* Mobile 2-Bar Animated Toggle */}
            <button
              type="button"
              className={`navbar-mobile-toggle${mobileOpen ? ' is-open' : ''}`}
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setOpenItem(null);
              }}
              aria-label={mobileOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileOpen}
            >
              <span className="mobile-toggle-bar bar-1" />
              <span className="mobile-toggle-bar bar-2" />
            </button>
          </div>
        </div>

        {/* Desktop Attached Mega-Dropdown Menu */}
        {activeItemData && isDropdownActive && (
          <div
            className="navbar-mega-dropdown"
            role="region"
            aria-label={`${activeItemData.label} Submenu`}
          >
            <div className="mega-dropdown-grid">
              {/* If categorized groups exist */}
              {activeItemData.groups && (
                <div className="mega-groups-container">
                  {activeItemData.groups.map((group, gIdx) => {
                    const isCol2 = group.items.length >= 8;
                    return (
                      <div
                        key={group.groupLabel}
                        className={`mega-group-col${isCol2 ? ' is-col-wide' : ''}`}
                        style={{ animationDelay: `${gIdx * 45}ms` }}
                      >
                        <div className="mega-group-header">
                          {group.groupPath ? (
                            <Link
                              to={group.groupPath}
                              className="mega-group-title-link"
                              onClick={() => setOpenItem(null)}
                            >
                              <span>{group.groupLabel}</span>
                              <ArrowUpRight size={12} className="mega-title-arrow" />
                            </Link>
                          ) : (
                            <span className="mega-group-title">{group.groupLabel}</span>
                          )}
                        </div>

                        {group.items.length > 0 && (
                          <ul className={`mega-sublinks-list${isCol2 ? ' is-two-column' : ''}`}>
                            {group.items.map((child) => (
                              <li key={child.label} className="mega-sublink-item">
                                {child.disabled ? (
                                  <span className="mega-link-disabled">{child.label}</span>
                                ) : (child.external || child.download) ? (
                                  <a
                                    href={child.path}
                                    className="mega-sublink"
                                    download={child.download}
                                    target={child.download ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    onClick={() => setOpenItem(null)}
                                  >
                                    <span className="mega-link-text">{child.label}</span>
                                    {!child.download && <ExternalLink size={11} className="mega-ext-icon" />}
                                  </a>
                                ) : (
                                  <Link
                                    to={child.path}
                                    className="mega-sublink"
                                    onClick={() => setOpenItem(null)}
                                  >
                                    <span className="mega-link-text">{child.label}</span>
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* If flat list children exist (e.g. Campus Life, Placements, Admissions, Research) */}
              {activeItemData.children && (
                <div className="mega-children-container">
                  {(() => {
                    const items = activeItemData.children;
                    const itemsPerCol = Math.ceil(items.length / (items.length > 10 ? 3 : 2));
                    const cols: NavChild[][] = [];
                    for (let i = 0; i < items.length; i += itemsPerCol) {
                      cols.push(items.slice(i, i + itemsPerCol));
                    }
                    return cols.map((colItems, cIdx) => (
                      <div
                        key={`col-${cIdx}`}
                        className="mega-group-col"
                        style={{ animationDelay: `${cIdx * 50}ms` }}
                      >
                        <div className="mega-group-header">
                          <span className="mega-group-title">
                            {cIdx === 0 ? 'Explore Directory' : cIdx === 1 ? 'Quick Access' : 'Key Facilities'}
                          </span>
                        </div>
                        <ul className="mega-sublinks-list">
                          {colItems.map((child) => (
                            <li key={child.label} className="mega-sublink-item">
                              {child.disabled ? (
                                <span className="mega-link-disabled">{child.label}</span>
                              ) : (child.external || child.download) ? (
                                <a
                                  href={child.path}
                                  className="mega-sublink"
                                  download={child.download}
                                  target={child.download ? undefined : '_blank'}
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenItem(null)}
                                >
                                  <span className="mega-link-text">{child.label}</span>
                                  {!child.download && <ExternalLink size={11} className="mega-ext-icon" />}
                                </a>
                              ) : (
                                <Link
                                  to={child.path}
                                  className="mega-sublink"
                                  onClick={() => setOpenItem(null)}
                                >
                                  <span className="mega-link-text">{child.label}</span>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* 4th Column: Context / Highlight Overview Card */}
              {activeItemData.highlight && (
                <div className="mega-highlight-col" style={{ animationDelay: '150ms' }}>
                  <div className="mega-highlight-card">
                    {activeItemData.highlight.badge && (
                      <span className="mega-highlight-badge">
                        {activeItemData.highlight.badge}
                      </span>
                    )}
                    <h4 className="mega-highlight-title">
                      {activeItemData.highlight.title}
                    </h4>
                    <p className="mega-highlight-desc">
                      {activeItemData.highlight.description}
                    </p>
                    {activeItemData.highlight.linkPath && (
                      <Link
                        to={activeItemData.highlight.linkPath}
                        className="mega-highlight-cta"
                        onClick={() => setOpenItem(null)}
                      >
                        <span>{activeItemData.highlight.linkText || 'Learn More'}</span>
                        <span className="navbar-cta-icon-wrap">
                          <ArrowRight size={13} strokeWidth={2.5} />
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Accordion Drawer (Attached Inline Below Pill) */}
        {mobileOpen && (
          <div className="navbar-mobile-drawer" data-lenis-prevent>
            <div className="mobile-drawer-inner">
              <ul className="mobile-nav-list">
                {renderedNavItems.map((item) => {
                  const isExpanded = expandedItem === item.label;
                  return (
                    <li key={item.label} className="mobile-nav-item">
                      <button
                        type="button"
                        className={`mobile-nav-link-btn${isExpanded ? ' is-active' : ''}`}
                        onClick={() => {
                          setExpandedItem(isExpanded ? null : item.label);
                          setExpandedGroup(null);
                        }}
                      >
                        <span className="mobile-nav-text">{item.label}</span>
                        <span className={`mobile-accordion-icon${isExpanded ? ' is-open' : ''}`}>
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>

                      {/* Flat list for children */}
                      {item.children && (
                        <SmoothCollapse open={isExpanded}>
                          <ul className="mobile-sublinks-list">
                            {item.children.map((child) => (
                              <li key={child.label} className="mobile-sublink-entry">
                                {child.disabled ? (
                                  <span className="mobile-sublink is-disabled">{child.label}</span>
                                ) : (child.external || child.download) ? (
                                  <a
                                    href={child.path}
                                    className="mobile-sublink"
                                    download={child.download}
                                    target={child.download ? undefined : '_blank'}
                                    rel="noopener noreferrer"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    <span>{child.label}</span>
                                    <ExternalLink size={12} />
                                  </a>
                                ) : (
                                  <Link
                                    to={child.path}
                                    className="mobile-sublink"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    <span>{child.label}</span>
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        </SmoothCollapse>
                      )}

                      {/* Nested groups for group items */}
                      {item.groups && (
                        <SmoothCollapse open={isExpanded}>
                          <ul className="mobile-groups-list">
                            {item.groups.map((group) => {
                              const groupKey = `${item.label}:${group.groupLabel}`;
                              const groupOpen = expandedGroup === groupKey;
                              if (group.items.length === 0 && group.groupPath) {
                                return (
                                  <li key={group.groupLabel} className="mobile-group-item">
                                    <Link
                                      to={group.groupPath}
                                      className="mobile-group-direct-link"
                                      onClick={() => setMobileOpen(false)}
                                    >
                                      <span>{group.groupLabel}</span>
                                      <ArrowUpRight size={13} />
                                    </Link>
                                  </li>
                                );
                              }
                              return (
                                <li key={group.groupLabel} className="mobile-group-item">
                                  <button
                                    type="button"
                                    className={`mobile-group-toggle-btn${groupOpen ? ' is-active' : ''}`}
                                    onClick={() => setExpandedGroup(groupOpen ? null : groupKey)}
                                  >
                                    <span>{group.groupLabel}</span>
                                    <ChevronDown
                                      size={13}
                                      className={`mobile-group-chevron${groupOpen ? ' is-rotated' : ''}`}
                                    />
                                  </button>
                                  <SmoothCollapse open={groupOpen}>
                                    <ul className="mobile-sublinks-list nested">
                                      {group.items.map((child) => (
                                        <li key={child.label} className="mobile-sublink-entry">
                                          {child.disabled ? (
                                            <span className="mobile-sublink is-disabled">{child.label}</span>
                                          ) : (child.external || child.download) ? (
                                            <a
                                              href={child.path}
                                              className="mobile-sublink"
                                              download={child.download}
                                              target={child.download ? undefined : '_blank'}
                                              rel="noopener noreferrer"
                                              onClick={() => setMobileOpen(false)}
                                            >
                                              <span>{child.label}</span>
                                              <ExternalLink size={12} />
                                            </a>
                                          ) : (
                                            <Link
                                              to={child.path}
                                              className="mobile-sublink"
                                              onClick={() => setMobileOpen(false)}
                                            >
                                              <span>{child.label}</span>
                                            </Link>
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

              {/* Mobile CTA */}
              <div className="mobile-drawer-cta-wrap">
                {headerApplyNow.external ? (
                  <a
                    href={headerApplyNow.path}
                    className="mobile-drawer-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>Apply Now for Admissions</span>
                    <span className="navbar-cta-icon-wrap">
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </span>
                  </a>
                ) : (
                  <Link
                    to={headerApplyNow.path}
                    className="mobile-drawer-cta"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>Apply Now for Admissions</span>
                    <span className="navbar-cta-icon-wrap">
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </span>
                  </Link>
                )}
              </div>

              {/* Mobile Social & Quick Contact */}
              <div className="mobile-drawer-footer">
                <div className="mobile-footer-text">
                  <span>Sri Vishnu Educational Society</span>
                  <span className="footer-bullet">•</span>
                  <span>Bhimavaram</span>
                </div>
                <div className="mobile-social-pills">
                  {[
                    { label: 'Instagram', href: 'http://instagram.com/vishnu_svecw/' },
                    { label: 'LinkedIn', href: 'https://www.linkedin.com/school/vishnusvecw/' },
                    { label: 'YouTube', href: 'https://www.youtube.com/@SVECW-B0' },
                    { label: 'Facebook', href: 'https://www.facebook.com/svecwcollege' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-social-pill"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
