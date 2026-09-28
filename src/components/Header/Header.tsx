import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useNavLinkOverride } from '../../hooks/useNavLinkOverride';
import { DIFFERENTIATOR_CATEGORIES } from '../../pages/Admin/sections/DifferentiatorsAdmin';
import type { DifferentiatorItemDoc } from '../../pages/Admin/sections/DifferentiatorsAdmin';
import type { PlacementItemDoc } from '../../pages/Admin/sections/PlacementItemsAdmin';
import { DEFAULT_CAMPUS_LIFE_QUICK_LINKS } from '../../pages/Admin/sections/CampusLifeAdmin';
import type { CampusLifeItemDoc, CampusLifeQuickLinkDoc } from '../../pages/Admin/sections/CampusLifeAdmin';
import SmoothCollapse from '../SmoothCollapse/SmoothCollapse';
import { renderBold } from '../../lib/boldText';
import { DEFAULT_HEADER_MENU, type HeaderMenuItem, type HeaderMenuLink } from '../../lib/headerMenu';
import { useHeaderMenu } from '../../hooks/useHeaderMenu';
import './Header.css';

type NavChild = HeaderMenuLink;
type NavItem = HeaderMenuItem;

// The menu itself (labels, columns, links, highlight cards) lives in
// lib/headerMenu.ts and is admin-editable via Admin → Header Menu — see
// useHeaderMenu. isEnabledNavPath below still scans the built-in default.
const navItemsData: NavItem[] = DEFAULT_HEADER_MENU;

// ── Single source of truth: "does the main nav actually link here?" ──
// The About page's "Explore VWU in Detail" cards use this so a card never
// navigates somewhere the navbar itself won't send a visitor — unbuilt
// pages are marked `disabled` in navItemsData, and external / download /
// pure-hash targets aren't real in-app routes. Built lazily and cached.
let _enabledNavPaths: Set<string> | null = null;
export function isEnabledNavPath(path: string | undefined | null): boolean {
  if (!path) return false;
  const clean = path.split('#')[0];
  if (!clean || clean.startsWith('http')) return false;
  // /campus/:slug pages are appended to the Campus Life menu dynamically
  // from the campusLifeItems collection (see the 'Campus Life' branch in
  // renderedNavItems below), not listed individually in navItemsData below
  // — so treat every /campus/* path as enabled rather than needing it
  // pre-declared here, matching the generic catch-all route in App.tsx.
  if (clean.startsWith('/campus/')) return true;
  if (!_enabledNavPaths) {
    const set = new Set<string>();
    const add = (c: { path?: string; external?: boolean; download?: boolean; disabled?: boolean }) => {
      if (!c.path || c.external || c.download || c.disabled) return;
      if (c.path.startsWith('http')) return;
      set.add(c.path.split('#')[0]);
    };
    for (const item of navItemsData) {
      add(item);
      if (item.highlight?.linkPath) add({ path: item.highlight.linkPath });
      item.children?.forEach((ch) => { add(ch); ch.subItems?.forEach(add); });
      item.groups?.forEach((g) => {
        if (g.groupPath) set.add(g.groupPath.split('#')[0]);
        g.items.forEach((it) => { add(it); it.subItems?.forEach(add); });
      });
    }
    _enabledNavPaths = set;
  }
  return _enabledNavPaths.has(clean);
}

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
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamic overrides and data hooks
  const headerApplyNow = useNavLinkOverride('header-apply-now', '/apply-now');
  // Empty fallback: when no redirect is set, the Organizational Chart link
  // keeps whatever path it has in the (admin-editable) header menu.
  const orgChart = useNavLinkOverride('header-organizational-chart', '');
  const { items: headerMenuItems } = useHeaderMenu();


  const { docs: differentiatorItems } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { docs: placementItems } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  const { docs: campusLifeItems } = useOrderedCollection<CampusLifeItemDoc>('campusLifeItems', 'order');
  const rawFacilityNavItems: NavChild[] = campusLifeItems
    .filter((it) => it.group === 'facility')
    .map((it) => ({ label: it.title, path: `/campus/${it.slug}` }));

  // Exchange places of 'Other Facilities' and 'Campus Security' in Quick Access column
  const otherIdx = rawFacilityNavItems.findIndex(
    (it) => it.path === '/campus/other-facilities' || it.label.toLowerCase().includes('other facilities')
  );
  const secIdx = rawFacilityNavItems.findIndex(
    (it) => it.path === '/campus/campus-security' || it.label.toLowerCase().includes('campus security')
  );

  const campusFacilityNavItems: NavChild[] = [...rawFacilityNavItems];
  if (otherIdx !== -1 && secIdx !== -1) {
    const temp = campusFacilityNavItems[otherIdx];
    campusFacilityNavItems[otherIdx] = campusFacilityNavItems[secIdx];
    campusFacilityNavItems[secIdx] = temp;
  }
  // The Campus Life dropdown's handful of fixed-route entries (Wellness
  // Centre, Student Clubs, ...) — admin-editable via Admin -> Campus Life ->
  // "Campus Life Menu — Other Links". Falls back to the original hardcoded
  // list (still declared in navItemsData below, for isEnabledNavPath's
  // static scan) while that collection is loading or empty, so removing
  // this admin section's data can never blank the menu.
  const { docs: campusLifeQuickLinkDocs, loading: quickLinksLoading } = useOrderedCollection<CampusLifeQuickLinkDoc>('campusLifeQuickLinks', 'order');
  const campusLifeQuickLinks: NavChild[] = (quickLinksLoading || campusLifeQuickLinkDocs.length === 0
    ? DEFAULT_CAMPUS_LIFE_QUICK_LINKS
    : campusLifeQuickLinkDocs
  ).map((l) => ({ label: l.label, path: l.path, external: l.external }));

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
  // Admin-edited menu (Admin → Header Menu); hidden menus are left out.
  // The Organizational Chart link's redirect (Admin → Navigation Link
  // Redirects) still wins over its own path when one is set.
  const withOrgChart = (links: NavChild[]): NavChild[] =>
    orgChart.path ? links.map((child) => (child.label === 'Organizational Chart' ? { ...child, path: orgChart.path } : child)) : links;
  const renderedNavItems: NavItem[] = headerMenuItems.filter((item) => !item.hidden).map((item) => {
    if (!item.auto) {
      return {
        ...item,
        ...(item.groups ? { groups: item.groups.map((group) => ({ ...group, items: withOrgChart(group.items) })) } : {}),
        ...(item.children ? { children: withOrgChart(item.children) } : {}),
      };
    }

    // Menus filled in automatically from other admin sections — their
    // columns/links are always rebuilt here, whatever the saved menu holds.
    if (item.auto === 'differentiators') {
      const groups = DIFFERENTIATOR_CATEGORIES.map((cat) => {
        return {
          groupLabel: cat.label,
          groupPath: `/differentiators#${cat.id}`,
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
    if (item.auto === 'placements') {
      return {
        ...item,
        children: placementItems.map((p): NavChild =>
          p.external && p.url
            ? { label: p.title, path: p.url, external: true, hideExternalIcon: true }
            : { label: p.title, path: `/placements/${p.slug}` }
        ),
      };
    }
    if (item.auto === 'campusLife') {
      // Every "facility" page added from Admin -> Campus Life shows up here
      // automatically, followed by the admin-editable "Other Links" list
      // (campusLifeQuickLinks) — item.children (navItemsData's hardcoded
      // list) is intentionally unused here now; it stays only so
      // isEnabledNavPath's static scan still recognizes these paths.
      const combinedChildren: NavChild[] = [...campusFacilityNavItems, ...campusLifeQuickLinks];
      const otherIdx = combinedChildren.findIndex(
        (it) => it.path === '/campus/other-facilities' || it.label.toLowerCase().includes('other facilities')
      );
      const socialIdx = combinedChildren.findIndex(
        (it) => it.path === '/social-services' || it.label.toLowerCase().includes('social services')
      );
      if (otherIdx !== -1 && socialIdx !== -1) {
        const temp = combinedChildren[otherIdx];
        combinedChildren[otherIdx] = combinedChildren[socialIdx];
        combinedChildren[socialIdx] = temp;
      }
      return { ...item, children: combinedChildren };
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
          {/* Left Brand Identity: the same rectangular full logo at every width */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="navbar-brand-link"
            aria-label="Vishnu Women's University - Home"
          >
            <img loading="eager" fetchPriority="high" decoding="sync" width={220} height={74}
              src="/images/logo.png"
              alt="Vishnu Women's University"
              className="navbar-logo-img navbar-logo-desktop"
            />
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
                  <ArrowRight size={14.6} strokeWidth={2.5} aria-hidden="true" />
                </span>
              </a>
            ) : (
              <Link to={headerApplyNow.path} className="navbar-cta-btn">
                <span>Apply Now</span>
                <span className="navbar-cta-icon-wrap">
                  <ArrowRight size={14.6} strokeWidth={2.5} aria-hidden="true" />
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
            <div key={activeItemData.label} className="mega-dropdown-grid">
              {/* If categorized groups exist */}
              {activeItemData.groups && (
                <div className="mega-groups-container">
                  {activeItemData.groups.map((group, gIdx) => {
                    const isCol2 = group.items.length >= 9;
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
                    // Splitting a short list (e.g. Contact's 2 links) into
                    // multiple columns leaves each one mostly empty inside
                    // its flexed width — only split once there's enough
                    // content to actually fill more than one column.
                    const numCols = items.length > 10 ? 3 : items.length > 4 ? 2 : 1;
                    const itemsPerCol = Math.ceil(items.length / numCols);
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
                      {renderBold(activeItemData.highlight.description)}
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
