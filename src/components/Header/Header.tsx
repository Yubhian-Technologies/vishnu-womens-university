import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useNavLinkOverride } from '../../hooks/useNavLinkOverride';
import type { ProgramDoc } from '../../pages/Admin/sections/ProgramsAdmin';
import { DIFFERENTIATOR_CATEGORIES } from '../../pages/Admin/sections/DifferentiatorsAdmin';
import type { DifferentiatorItemDoc } from '../../pages/Admin/sections/DifferentiatorsAdmin';
import SmoothCollapse from '../SmoothCollapse/SmoothCollapse';
import './Header.css';

// Straight diagonal dividers for the header's two dark end-sections (logo
// section on the left, Visit/Give/Apply section on the right — see
// .header-end/.header-end-wave in Header.css). Each is a plain slanted cut
// tracing the boundary where the dark section meets the white nav area in
// the middle; drawn as a dark shape on top of the header's own white base,
// so the straight top/bottom/outer edges need no explicit drawing.
// The logo end uses its own (wider, opposite-direction) slant so the
// diagonal clears the logo instead of cutting across it; the CTA end keeps
// the original slant, mirrored via the --mirror CSS transform.
const END_WAVE_VIEWBOX = '0 0 220 64';
const LOGO_WAVE_PATH = 'M0,0 H195 L155,64 H0 Z';
const CTA_WAVE_PATH = 'M0,0 H140 L180,64 H0 Z';

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
    // "Discover"'s old groups (Governance/Committees/IQAC) now live here
    // too, alongside About Us's own items — no longer its own top-level
    // nav item. Committees (13 items) auto-splits into two sub-columns
    // (see .mega-group-list.cols-2 in Header.css). Information dropped
    // (2026-08-13) since it's now under Academics instead.
    label: 'About Us',
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
        groupPath: '/governance',
        items: [
          { label: 'Governing Body', path: '/governance/governing-body', disabled: true },
          { label: 'Academic Council', path: '/governance/academic-council', disabled: true },
          { label: 'Board of Studies', path: '/governance/board-of-studies', disabled: true },
          { label: 'Finance Committee', path: '/governance/finance-committee', disabled: true },
        ],
      },
      {
        groupLabel: 'Committees',
        groupPath: '/governance#committees',
        items: [
          { label: 'College Academic Committee', path: '/governance/college-academic-committee', disabled: true },
          { label: 'Acad. & Admin. Audit Committee', path: '/governance/academic-administrative-audit', disabled: true },
          { label: 'Freshmen Committee', path: '/governance/freshmen-committee', disabled: true },
          { label: 'Infrastructure Management', path: '/governance/infrastructure-management', disabled: true },
          { label: 'Faculty Grievance Redressal', path: '/governance/faculty-grievance', disabled: true },
          { label: 'Student Grievance Redressal', path: '/governance/student-grievance', disabled: true },
          { label: 'Central Purchase Committee', path: '/governance/central-purchase', disabled: true },
          { label: 'Counselling & Monitoring', path: '/governance/counselling-monitoring', disabled: true },
          { label: 'Anti Ragging Committee', path: '/governance/anti-ragging', disabled: true },
          { label: 'Internal Committee (POSH)', path: '/governance/internal-committee', disabled: true },
          { label: 'SC/ST Cell', path: '/governance/sc-st-cell', disabled: true },
          { label: 'R&D Committee', path: '/governance/rd-committee', disabled: true },
        ],
      },
      {
        groupLabel: 'IQAC',
        groupPath: '/governance#iqac',
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
    // UG/PG/Ph.D. Programmes groups are spliced in at render time from live
    // Firestore `programs` data — see renderedNavItems in Header() — so
    // this menu always matches whatever's actually configured in the
    // Programs admin section rather than a hardcoded, driftable list.
    label: 'Academics',
    groups: [
      {
        groupLabel: 'Overview',
        groupPath: '/academics',
        items: [
          { label: 'Programs & Departments', path: '/academics' },
          { label: 'Faculty', path: '/faculty' },
          { label: 'Result Analysis', path: '/result-analysis' },
          { label: 'Examinations', path: 'https://www.svecwexams.in/', external: true },
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
    // Was a group inside Research's mega-menu — now its own top-level item.
    // Category groups' items are spliced in at render time from live
    // Firestore `differentiatorItems` data — see renderedNavItems in
    // Header() — so the dropdown always lists the actual differentiators
    // configured in the Differentiators admin section rather than a
    // hardcoded, driftable list.
    label: 'Differentiators',
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
    children: [
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
      { label: 'Graduate Study Abroad Center – GSAC', path: '/placements/gsac' },
      { label: 'Higher Education', path: '/placements/higher-education' },
    ],
  },
  {
    // Flat list (no sub-groups) — was a 3-group mega-menu, collapsed to
    // match the flat dropdown style used by Placements/Admissions.
    label: 'Research',
    children: [
      { label: 'About R&D', path: '/research/about-rd' },
      { label: 'Research Advisory Committee', path: '/research/research-advisory-committee' },
      { label: 'Research Ethics Committee', path: '/research/research-ethics-committee' },
      { label: 'Intellectual Property Rights (IPR) Committee', path: '/research/ipr-committee' },
      { label: 'Thrust Areas of Research', path: '/research/thrust-areas-of-research' },
      { label: 'Research Centers', path: '/research/research-centers' },
      { label: 'Funded Projects', path: '/research/funded-projects' },
      { label: 'Seed Money Projects', path: '/research/seed-money-projects' },
      { label: 'Research Publications', path: '/research/research-publications' },
      { label: 'MoUs', path: '/research/mous' },
      { label: 'Patents', path: '/research/patents' },
      { label: 'Consultancy', path: '/research/consultancy' },
      { label: 'Professional Bodies', path: '/research/professional-bodies' },
    ],
  },
  {
    // Flat list (no sub-groups) — was a 2-group Campus Facilities/Student
    // Life mega-menu, collapsed to match the flat dropdown style used by
    // Placements/Admissions/Research. Radio Vishnu 90.4 has no page of its
    // own — it reuses its existing Differentiators detail page rather than
    // pointing at a route that doesn't exist.
    label: 'Campus Life',
    children: [
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
      { label: 'Radio Vishnu 90.4', path: '/differentiators/radio-vishnu-diff' },
      { label: 'Vishnu TV Academy', path: '/vishnu-tv-academy' },
      { label: 'Student Clubs', path: '/student-clubs' },
      { label: 'Social Services', path: '/social-services' },
      { label: 'Campus Magazines', path: '/campus-magazines' },
      { label: 'Arts & Culture', path: '/arts-culture' },
      { label: 'Sports & Games', path: '/sports-games' },
    ],
  },
  {
    // Alumni & Giving used to live here as a second group — it now has its
    // own place in the Footer (see Footer.tsx) instead of the header nav.
    label: 'News & Events',
    groups: [
      {
        groupLabel: 'News & Events',
        groupPath: '/news-awards',
        items: [
          { label: 'Upcoming Events', path: '/news-awards/happenings#upcoming-events' },
          { label: 'Recent Events', path: '/news-awards/happenings#recent-events' },
          { label: 'Gallery', path: '/news-awards/gallery' },
          { label: 'Vishnu Era', path: 'https://www.srivishnu.edu.in/vishnu-era/', external: true },
          { label: 'Prathibha Magazine', path: 'https://heyzine.com/flip-book/088b7b5629.html#page/54', external: true },
        ],
      },
      {
        groupLabel: 'Accreditations & Rankings',
        groupPath: '/news-awards/accreditations-awards',
        items: [
          { label: 'Accreditations', path: '/news-awards/accreditations-awards#accreditation' },
          { label: 'Rankings & Awards', path: '/news-awards/accreditations-awards#ranking' },
        ],
      },
    ],
  },
  {
    label: 'Contact',
    children: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'How to Reach', path: '/information#how-to-reach' },
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
  const megaRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Header's Apply Now button — admin can repoint it (e.g. to a specific
  // admissions cycle or an external application portal) without a deploy.
  const headerApplyNow = useNavLinkOverride('header-apply-now', '/admissions');

  const { docs: programs } = useOrderedCollection<ProgramDoc>('programs', 'order');
  // Both VLSI programs (B.Tech "Electronics Engineering [VSLI Design &
  // Technology]", slug EVT — note the name has a real typo, "VSLI" not
  // "VLSI" — and M.Tech "VLSI Design") route to the ECE B.Tech page instead
  // of their own program detail page — there's no separate VLSI page to
  // link to, so the nav entry still needs to go somewhere useful. Matched
  // on slug as well as name so the EVT typo can't cause this to silently
  // stop working.
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

  const renderedNavItems: NavItem[] = navItems.map((item) => {
    // Academics' UG/PG/Ph.D. Programmes groups are populated here from live
    // Firestore data since navItems itself is a module-level constant and
    // can't hold live data directly — see the "Overview" comment above.
    if (item.label === 'Academics' && item.groups) {
      const groups = item.groups.map((group) => {
        if (group.groupLabel === 'UG Programmes') return { ...group, items: ugProgrammes };
        if (group.groupLabel === 'PG Programmes') return { ...group, items: pgProgrammes };
        if (group.groupLabel === 'Ph.D Programmes') return { ...group, items: phdProgrammes };
        return group;
      });
      return { ...item, groups };
    }
    // Category groups here are populated from live Firestore data since
    // navItems itself is a module-level constant — see differentiatorItems
    // above. The "Overview" group keeps its hardcoded "All Differentiators" link.
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
    return item;
  });

  const renderNavItem = (item: NavItem) => (
    <li
      key={item.label}
      className={`nav-item${openItem === item.label ? ' nav-item--open' : ''}${(item.children?.length ?? 0) >= 9 ? ' nav-item--wide-dropdown' : ''}`}
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
        <span className="nav-link-label">{item.label}</span>
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
        <div
          className="dropdown dropdown-mega"
          role="menu"
          ref={(el) => { megaRefs.current[item.label] = el; }}
        >
          {item.groups.map((group) => (
            <div key={group.groupLabel} className="mega-group">
              {group.groupPath ? (
                <Link to={group.groupPath} className="mega-group-label">
                  {group.groupLabel}
                </Link>
              ) : (
                <span className="mega-group-label">{group.groupLabel}</span>
              )}
              <ul className={`mega-group-list${group.items.length >= 9 ? ' cols-2' : ''}`}>
                {group.items.map((child) => (
                  <li key={child.label}>
                    {child.disabled ? (
                      <span className="dropdown-item">
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

  // Mega-menus are centered on their trigger by default (see .dropdown-mega
  // in Header.css), same as a flat dropdown — the width/height of the menu
  // and the position of the trigger that opened it don't otherwise matter.
  // The only time that changes is when centering would run the menu into
  // one of the header's dark end-pods (e.g. Research, mid-bar, opening a
  // wide menu can reach the Visit/Give/Apply pod on the right): then it's
  // nudged left/right via --mega-shift just enough to clear that pod,
  // rather than always anchoring to one side — which was the previous
  // approach, and is exactly what made a menu look like it opened
  // "sometimes centered, sometimes off to a side" depending on viewport
  // width. Right-anchored menus (the last two nav items — see the
  // nth-last-child rule in Header.css) don't need centering since right:0
  // already positions them consistently; they still get the same nudge
  // against the logo pod. Width is only reduced (via an explicit width,
  // not max-width — min-width otherwise wins the conflict, and a
  // shrink-to-fit auto width doesn't reliably fill a max-width budget
  // once min-width is overridden to 0) if the menu genuinely can't fit
  // even using the full gap between both pods.
  useEffect(() => {
    const el = openItem ? megaRefs.current[openItem] : null;
    const triggerEl = el?.parentElement;
    if (!el || !triggerEl) return;
    el.style.minWidth = '';
    el.style.width = '';
    el.style.removeProperty('--mega-shift');
    const idx = renderedNavItems.findIndex((i) => i.label === openItem);
    const isRightAnchored = idx !== -1 && idx >= renderedNavItems.length - 2;
    const logoEl = document.querySelector<HTMLElement>('.header-end--logo');
    const ctaEl = document.querySelector<HTMLElement>('.header-end--cta');
    if (!logoEl || !ctaEl) return;
    const margin = 24;
    const logoRect = logoEl.getBoundingClientRect();
    const ctaRect = ctaEl.getBoundingClientRect();
    const safeLeft = logoRect.right + margin;
    const safeRight = ctaRect.left - margin;
    // Width is trustworthy to read off the dropdown itself (transform
    // doesn't affect it), but its *position* can still be mid-transition
    // right after the reset above (transform is a transitioned property),
    // so the natural, unshifted position is computed from the trigger's
    // own (never-transformed) geometry instead of trusting the dropdown's
    // own rect.left/right.
    const width = el.getBoundingClientRect().width;
    const triggerRect = triggerEl.getBoundingClientRect();

    // Left as shrink-to-fit, the menu only ever renders at its own
    // content's natural width — on anything wider than a fairly narrow
    // desktop window that leaves real, unused room between it and the pod
    // sitting completely unused instead of giving the columns more
    // breathing room. STRETCH_CAP just keeps it from growing absurdly
    // wide on an ultra-wide monitor.
    const STRETCH_CAP = 960;

    if (isRightAnchored) {
      const available = triggerRect.right - logoRect.right - margin;
      const finalWidth = available > 0 ? Math.min(available, STRETCH_CAP) : width;
      if (finalWidth !== width) {
        el.style.minWidth = '0';
        el.style.width = `${finalWidth}px`;
      }
      const naturalLeft = triggerRect.right - finalWidth;
      if (naturalLeft < safeLeft) {
        el.style.setProperty('--mega-shift', `${safeLeft - naturalLeft}px`);
      }
      return;
    }

    const available = safeRight - safeLeft;
    const finalWidth = available > 0 ? Math.min(available, STRETCH_CAP) : width;
    if (finalWidth !== width) {
      el.style.minWidth = '0';
      el.style.width = `${finalWidth}px`;
    }
    const naturalCenter = triggerRect.left + triggerRect.width / 2;
    const naturalLeft = naturalCenter - finalWidth / 2;
    const naturalRight = naturalCenter + finalWidth / 2;
    let shift = 0;
    if (naturalRight > safeRight) {
      shift = safeRight - naturalRight;
    } else if (naturalLeft < safeLeft) {
      shift = safeLeft - naturalLeft;
    }
    if (shift !== 0) {
      el.style.setProperty('--mega-shift', `${shift}px`);
    }
  }, [openItem, renderedNavItems]);

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
      {/* Main Header — full-width edge-to-edge, no floating/inset look. One
          continuous white strip with two dark end-sections (logo on the
          left, Visit/Give/Apply on the right), each with a wavy inner
          edge cut into the white — not a detached rounded pill. */}
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-bar">
          {/* Logo section — dark, wave-edged on the right, flush at the
              header's left edge. */}
          <div className="header-end header-end--logo">
            <svg className="header-end-wave" viewBox={END_WAVE_VIEWBOX} preserveAspectRatio="none" aria-hidden="true">
              <path d={LOGO_WAVE_PATH} fill="var(--color-primary-dark)" stroke="var(--color-accent)" strokeWidth="2" />
            </svg>
            <Link to="/" className="logo" aria-label="Vishnu Women's University Home">
              <img src="/images/logo.png" alt="VWU Logo" className="logo-icon" />
            </Link>
          </div>

          {/* Desktop Nav — centered in the white middle section. */}
          <nav className="nav" aria-label="Main navigation" ref={navRef}>
            <ul className="nav-list">
              {renderedNavItems.map(renderNavItem)}
            </ul>
          </nav>

          {/* Apply Now section — dark, wave-edged on the left (mirrored),
              flush at the header's right edge. Its destination is
              admin-editable (see headerApplyNow above). */}
          <div className="header-end header-end--cta">
            <svg className="header-end-wave header-end-wave--mirror" viewBox={END_WAVE_VIEWBOX} preserveAspectRatio="none" aria-hidden="true">
              <path d={CTA_WAVE_PATH} fill="var(--color-primary-dark)" stroke="var(--color-accent)" strokeWidth="2" />
            </svg>
            <div className="header-ctas">
              {headerApplyNow.external ? (
                <a href={headerApplyNow.path} className="topbar-cta apply" target="_blank" rel="noopener noreferrer">
                  Apply Now <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
                </a>
              ) : (
                <Link to={headerApplyNow.path} className="topbar-cta apply">
                  Apply Now <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              )}
            </div>
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
                        // A group with no items of its own has nothing to
                        // expand into — render it as a plain link instead of
                        // a dead-end accordion button. Mainly hit while a
                        // live-data group (e.g. UG/PG/Ph.D. Programmes)
                        // hasn't loaded any items yet.
                        if (group.items.length === 0 && group.groupPath) {
                          return (
                            <li key={group.groupLabel} className="mobile-group">
                              <Link to={group.groupPath} className="mobile-group-btn">
                                {group.groupLabel}
                              </Link>
                            </li>
                          );
                        }
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
                                      <span className="mobile-sub-item">{child.label}</span>
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
