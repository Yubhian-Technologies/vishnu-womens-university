import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChartLine, faImage, faHouse, faNewspaper, faImages, faGraduationCap, faSchool, faBuildingColumns,
  faChalkboardUser, faLandmark, faUserTie, faBriefcase, faUserGraduate, faBullhorn, faCircleInfo, faCalendarDays,
  faCircleQuestion, faPeopleGroup, faTree, faFileContract, faPuzzlePiece, faAddressBook, faEnvelope, faFileLines,
  faClipboardList, faBus, faDownload, faTableList, faCamera, faLink, faScaleBalanced, faFolderOpen,
  faChartPie, faChartBar, faStar, faArrowTrendUp, faIdCard, faCalendarCheck, faPortrait, faBuilding, faTag,
  faPlane, faTrophy, faFlask, faFileCircleCheck, faBook, faUserShield, faRightFromBracket, faPhone,
  faPalette, faMedal, faAward, faLightbulb, faFutbol, faGear, faBars, faClockRotateLeft,
  faListCheck, faUsersGear, faShareNodes, faFileSignature, faChevronDown, faChevronRight, faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { getFirebaseAuth } from '../../lib/firebaseAdmin';
import { resolveAdminSession, canReadModule } from '../../lib/rbac';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminSessionProvider, { useAdminSession } from './AdminSessionContext';
import './Admin.css';

// Icon() wraps every entry's raw IconDefinition (Font Awesome) so callers
// just do <FontAwesomeIcon icon={s.icon} /> — replaces the emoji this admin
// dashboard used before.
export const SECTIONS: { id: string; icon: IconDefinition; label: string }[] = [
  { id: 'overview',       icon: faChartLine, label: 'Overview' },
  { id: 'theme',          icon: faPalette, label: 'Color Theme' },
  { id: 'feature-popup',  icon: faImage, label: 'Feature Popup' },
  { id: 'home-hero-banners', icon: faImages, label: 'Home Hero Banners' },
  { id: 'home-content', icon: faHouse, label: 'Home Page' },
  { id: 'banners',        icon: faImage, label: 'Hero Banners' },
  { id: 'landing-pages',  icon: faHouse, label: 'Landing Pages' },
  { id: 'news',           icon: faNewspaper, label: 'News & Events' },
  { id: 'gallery',        icon: faImages, label: 'Gallery' },
  { id: 'academics-content', icon: faGraduationCap, label: 'Academics Hub — Copy' },
  { id: 'departments',    icon: faBuildingColumns, label: 'Academic Departments' },
  { id: 'programs',       icon: faGraduationCap, label: 'Programs' },
  { id: 'schools',        icon: faSchool, label: 'Schools' },
  { id: 'faculty',        icon: faChalkboardUser, label: 'Faculty' },
  { id: 'about-content', icon: faCircleInfo, label: 'About VWU' },
  { id: 'vision-mission-content', icon: faCircleInfo, label: 'Vision & Mission' },
  { id: 'about-sves-content', icon: faCircleInfo, label: 'About SVES' },
  { id: 'governing-body', icon: faLandmark, label: 'Governing Body' },
  { id: 'core-executives', icon: faUserTie, label: 'Core Executives' },
  { id: 'placements',     icon: faBriefcase, label: 'Placement Year Data' },
  { id: 'placement-highlights', icon: faMedal, label: 'Home — Placement Highlights' },
  { id: 'honoured-guests', icon: faAward, label: 'Home — Eminent Personalities' },
  { id: 'alumni',         icon: faUserGraduate, label: 'Alumni & Giving' },
  { id: 'announcements',  icon: faBullhorn, label: 'Announcements' },
  { id: 'information',    icon: faCircleInfo, label: 'Information Page' },
  { id: 'other-practices', icon: faFlask, label: 'Information — Other Practices' },
  { id: 'events',         icon: faCalendarDays, label: 'Events' },
  { id: 'faqs',           icon: faCircleQuestion, label: 'FAQs' },
  { id: 'student-clubs',  icon: faPeopleGroup, label: 'Student Clubs' },
  { id: 'campus-life',    icon: faTree, label: 'Campus Life' },
  { id: 'sports',         icon: faFutbol, label: 'Campus Life — Sports' },
  { id: 'fitness-centre-content', icon: faFutbol, label: 'Fitness Centre — Copy' },
  { id: 'sewage-treatment-content', icon: faTree, label: 'Sewage Treatment Plants — Copy' },
  { id: 'social-services-content', icon: faPeopleGroup, label: 'Social Services (NSS) — Copy' },
  { id: 'job-openings',   icon: faFileContract, label: 'Job Openings' },
  { id: 'content-blocks', icon: faPuzzlePiece, label: 'Page Content Blocks' },
  { id: 'contacts',       icon: faAddressBook, label: 'Department Contacts' },
  { id: 'site-contact',   icon: faPhone, label: 'Site Contact Info' },
  { id: 'crm',            icon: faAddressBook, label: 'CRM (Admissions Leads)' },
  { id: 'contact-messages', icon: faEnvelope, label: 'Contact Us Messages' },
  { id: 'career-applications', icon: faFileLines, label: 'Career Applications' },
  { id: 'admission-inquiries', icon: faClipboardList, label: 'Admission Inquiries' },
  { id: 'campus-visit-requests', icon: faBus, label: 'Campus Visit Requests' },
  { id: 'career-guidance-interest', icon: faClipboardList, label: 'Career Guidance Interest' },
  { id: 'programmes-fee', icon: faGraduationCap, label: 'Programmes & Fee Structure' },
  { id: 'admission-procedure', icon: faClipboardList, label: 'Admission Procedure' },
  { id: 'apply-now-content', icon: faFileSignature, label: 'Apply Now Page — Copy' },
  { id: 'campus-visit-content', icon: faBus, label: 'Campus Visit — Visit Types' },
  { id: 'admissions-ranks', icon: faChartBar, label: 'AP EAPCET Rank Analysis' },
  { id: 'result-analysis', icon: faChartLine, label: 'Results Analysis — Batch Pass Rates' },
  { id: 'contact-extras', icon: faPhone, label: 'Contact Page — Helplines & Travel Guide' },
  { id: 'anti-ragging-content', icon: faUserShield, label: 'Anti-Ragging — Welcome Letter' },
  { id: 'aicte-feedback-content', icon: faBullhorn, label: 'AICTE Feedback Facility' },
  { id: 'policies-intro', icon: faFileCircleCheck, label: 'Policies & Procedures — Intro' },
  { id: 'ugc-disclosure-content', icon: faFileCircleCheck, label: 'UGC Public Self-Disclosure' },
  { id: 'downloads',      icon: faDownload, label: 'Academic Documents' },
  { id: 'curriculum',     icon: faTableList, label: 'Course Curriculum Matrix' },
  { id: 'site-photos',    icon: faCamera, label: 'Website Photos' },
  { id: 'header-menu',    icon: faBars, label: 'Header Menu' },
  { id: 'nav-links',      icon: faLink, label: 'Navigation Link Redirects' },
  { id: 'footer-links',   icon: faLink, label: 'Footer Columns & Links' },
  { id: 'social-handles', icon: faShareNodes, label: 'Social Media Handles' },
  { id: 'governance-items', icon: faScaleBalanced, label: 'Governance / Committees / IQAC' },
  { id: 'quality-parameters', icon: faListCheck, label: 'Quality Parameters Checklist' },
  { id: 'internal-qa-cell', icon: faUsersGear, label: 'Internal Quality Assurance Cell' },
  { id: 'annual-reports', icon: faFolderOpen, label: 'Annual Reports & Reforms' },
  { id: 'nirf-reports',   icon: faChartPie, label: 'NIRF Reports' },
  { id: 'nba-data',       icon: faChartBar, label: 'NBA Data Capturing Points' },
  { id: 'differentiators', icon: faStar, label: 'Differentiators' },
  { id: 'gsac-hero-content', icon: faPlane, label: 'GSAC Hero — Copy' },
  { id: 'placement-items', icon: faArrowTrendUp, label: 'Placement Sub-pages' },
  { id: 'success-stories', icon: faTrophy, label: 'Placements — Success Stories' },
  { id: 'ilo-office-details', icon: faBuilding, label: 'Placements — ILO Office Details' },
  { id: 'employability-skills', icon: faListCheck, label: 'Placements — Employability Skills' },
  { id: 'higher-education', icon: faGraduationCap, label: 'Placements — Higher Education Universities' },
  { id: 'tpo-team-info', icon: faIdCard, label: 'TPO Team Info' },
  { id: 'placement-crt-docs', icon: faCalendarCheck, label: 'CRT Timetables' },
  { id: 'tpo-team-photos', icon: faPortrait, label: 'TPO Team Photos' },
  { id: 'ilo-office-photos', icon: faBuilding, label: 'Industry Liaison Office Photos' },
  { id: 'recruiter-logos', icon: faTag, label: 'Recruiter Logos' },
  { id: 'gsac-photos', icon: faPlane, label: 'GSAC Photos' },
  { id: 'news-awards-data', icon: faTrophy, label: 'Happenings & Awards' },
  { id: 'news-awards-content', icon: faNewspaper, label: 'News & Awards Hub — Copy' },
  { id: 'insights',       icon: faLightbulb, label: 'VWU Insights' },
  { id: 'research-items', icon: faFlask, label: 'Research' },
  { id: 'compliance-docs', icon: faFileCircleCheck, label: 'Compliance Documents' },
  { id: 'policies', icon: faBook, label: 'Institutional Policies' },
  { id: 'users-roles', icon: faUserShield, label: 'Users & Roles' },
  { id: 'audit-log', icon: faClockRotateLeft, label: 'Audit Log' },
  { id: 'settings', icon: faGear, label: 'Settings' },
];

export interface SubSectionHeaderGroup {
  header: string;
  ids: string[];
}

export interface MainNavItem {
  key: string;
  label: string;
  icon: IconDefinition;
  sections: SubSectionHeaderGroup[];
}

export interface NavCategory {
  categoryLabel: string;
  items: MainNavItem[];
}

// ── Structured Navigation Hierarchy aligned with Website Header ──
export const MAIN_NAV_STRUCTURE: NavCategory[] = [
  {
    categoryLabel: 'Website Navigation',
    items: [
      {
        key: 'home',
        label: 'Home',
        icon: faHouse,
        sections: [
          {
            header: 'Home Page Sections',
            ids: ['home-hero-banners', 'home-content'],
          },
        ],
      },
      {
        key: 'about-us',
        label: 'About Us',
        icon: faBuildingColumns,
        sections: [
          {
            header: 'About Us',
            ids: ['about-content', 'vision-mission-content', 'about-sves-content'],
          },
          {
            header: 'Governance',
            ids: ['governing-body', 'core-executives', 'governance-items', 'ugc-disclosure-content'],
          },
          {
            header: 'Committees',
            ids: ['anti-ragging-content'],
          },
          {
            header: 'IQAC & Policies',
            ids: ['internal-qa-cell', 'quality-parameters', 'policies', 'policies-intro', 'annual-reports', 'compliance-docs'],
          },
        ],
      },
      {
        key: 'academics',
        label: 'Academics',
        icon: faGraduationCap,
        sections: [
          {
            header: 'Overview & Structure',
            ids: ['academics-content', 'schools', 'departments', 'programs', 'faculty', 'curriculum', 'downloads'],
          },
          {
            header: 'Information & Practices',
            ids: ['information', 'other-practices', 'result-analysis'],
          },
        ],
      },
      {
        key: 'admissions',
        label: 'Admissions',
        icon: faClipboardList,
        sections: [
          {
            header: 'Admissions Overview',
            ids: ['programmes-fee', 'admission-procedure', 'apply-now-content', 'campus-visit-content', 'admissions-ranks'],
          },
          {
            header: 'Inquiries & CRM',
            ids: ['crm', 'admission-inquiries', 'campus-visit-requests', 'career-guidance-interest'],
          },
        ],
      },
      {
        key: 'differentiators',
        label: 'Differentiators',
        icon: faStar,
        sections: [
          {
            header: 'Initiatives & Features',
            ids: ['differentiators', 'gsac-hero-content', 'gsac-photos'],
          },
        ],
      },
      {
        key: 'placements',
        label: 'Placements',
        icon: faBriefcase,
        sections: [
          {
            header: 'Placement Insights & Data',
            ids: ['placements', 'placement-highlights', 'placement-items', 'success-stories'],
          },
          {
            header: 'Team & Offices',
            ids: ['tpo-team-info', 'tpo-team-photos', 'ilo-office-details', 'ilo-office-photos'],
          },
          {
            header: 'Training & Recruiters',
            ids: ['employability-skills', 'higher-education', 'placement-crt-docs', 'recruiter-logos'],
          },
        ],
      },
      {
        key: 'research',
        label: 'Research',
        icon: faFlask,
        sections: [
          {
            header: 'Research & Innovation',
            ids: ['research-items'],
          },
        ],
      },
      {
        key: 'campus-life',
        label: 'Campus Life',
        icon: faTree,
        sections: [
          {
            header: 'Facilities & Activities',
            ids: ['campus-life', 'student-clubs', 'sports', 'fitness-centre-content', 'sewage-treatment-content', 'social-services-content'],
          },
        ],
      },
      {
        key: 'rankings',
        label: 'Rankings',
        icon: faTrophy,
        sections: [
          {
            header: 'Rankings & Accreditations',
            ids: ['nirf-reports', 'nba-data'],
          },
        ],
      },
      {
        key: 'happenings',
        label: 'Happenings',
        icon: faNewspaper,
        sections: [
          {
            header: 'News, Events & Gallery',
            ids: ['news', 'events', 'gallery', 'news-awards-data', 'news-awards-content', 'insights', 'announcements'],
          },
        ],
      },
      {
        key: 'contact',
        label: 'Contact',
        icon: faPhone,
        sections: [
          {
            header: 'Contact Details & Support',
            ids: ['contacts', 'site-contact', 'contact-extras', 'faqs', 'job-openings'],
          },
          {
            header: 'Messages & Applications',
            ids: ['contact-messages', 'career-applications'],
          },
        ],
      },
    ],
  },
  {
    categoryLabel: 'System & Administration',
    items: [
      {
        key: 'overview',
        label: 'Overview',
        icon: faChartLine,
        sections: [
          {
            header: 'Dashboard',
            ids: ['overview'],
          },
        ],
      },
      {
        key: 'site-appearance',
        label: 'Site Appearance',
        icon: faPalette,
        sections: [
          {
            header: 'Theme & Banners',
            ids: ['theme', 'feature-popup', 'banners', 'landing-pages', 'site-photos', 'content-blocks'],
          },
        ],
      },
      {
        key: 'navigation-links',
        label: 'Navigation & Links',
        icon: faLink,
        sections: [
          {
            header: 'Menus & Redirects',
            ids: ['header-menu', 'nav-links', 'footer-links', 'social-handles', 'aicte-feedback-content'],
          },
        ],
      },
      {
        key: 'administration',
        label: 'Administration',
        icon: faGear,
        sections: [
          {
            header: 'Access & Control',
            ids: ['users-roles', 'audit-log', 'settings'],
          },
        ],
      },
    ],
  },
];

// Flat SECTION_GROUPS array for UsersRolesAdmin compatibility
export const SECTION_GROUPS: { label: string; ids: string[] }[] = MAIN_NAV_STRUCTURE.flatMap((cat) =>
  cat.items.map((item) => ({
    label: item.label,
    ids: item.sections.flatMap((s) => s.ids),
  }))
);

export default function AdminLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    Promise.all([import('firebase/auth'), getFirebaseAuth()]).then(([{ onAuthStateChanged, signOut }, auth]) => {
      if (cancelled) return;
      unsub = onAuthStateChanged(auth, async (u) => {
        if (cancelled) return;
        if (u) {
          const session = await resolveAdminSession(u);
          if (cancelled) return;
          if (session.role === 'inactive') {
            setLoginError(`Your account has been deactivated.`);
            await signOut(auth);
            return;
          }
        }
        setUser(u);
        setChecking(false);
      });
    });
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  if (checking) {
    return (
      <div className="admin-checking">
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLogin
        error={loginError}
        onAttempt={() => setLoginError('')}
      />
    );
  }

  return (
    <AdminSessionProvider user={user}>
      <AdminShell email={user.email} />
    </AdminSessionProvider>
  );
}

function AdminShell({ email }: { email: string | null }) {
  const session = useAdminSession();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const activeSection = searchParams.get('section') ?? 'overview';
  const setActiveSection = (id: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('section', id);
      return next;
    }, { replace: true });
  };

  const visibleSectionIds = new Set(
    SECTIONS.filter((s) => (s.id === 'users-roles' ? session?.isSuperAdmin : s.id === 'audit-log' ? session?.isAdmin : canReadModule(session, s.id))).map((s) => s.id)
  );

  useEffect(() => {
    if (activeSection !== 'overview' && !visibleSectionIds.has(activeSection)) setActiveSection('overview');
  }, [activeSection, visibleSectionIds]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Auto-expand group containing activeSection
  useEffect(() => {
    MAIN_NAV_STRUCTURE.forEach((cat) => {
      cat.items.forEach((item) => {
        const containsActive = item.sections.some((sec) => sec.ids.includes(activeSection));
        if (containsActive) {
          setOpenGroups((prev) => ({ ...prev, [item.key]: true }));
        }
      });
    });
  }, [activeSection]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="admin-shell" data-lenis-prevent>
      <aside
        className={`admin-sidebar${isCollapsed ? '' : ' admin-sidebar--expanded'}`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => { setIsCollapsed(true); setAccountMenuOpen(false); }}
      >
        <div className="admin-sidebar__brand">
          <FontAwesomeIcon icon={faGraduationCap} fixedWidth aria-hidden="true" />
          <span className="admin-sidebar__label">VWU Admin</span>
        </div>

        {/* Quick Search Box when expanded */}
        {!isCollapsed && (
          <div className="admin-sidebar__search-wrap">
            <FontAwesomeIcon icon={faSearch} className="admin-sidebar__search-icon" aria-hidden="true" />
            <input
              type="text"
              className="admin-sidebar__search-input"
              placeholder="Search admin pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <nav className="admin-sidebar__nav" aria-label="Admin sections">
          {MAIN_NAV_STRUCTURE.map((cat) => {
            const itemsWithVisibleChildren = cat.items.map((item) => {
              const visibleSubSections = item.sections.map((sec) => {
                const visibleIds = sec.ids.filter((id) => {
                  if (!visibleSectionIds.has(id)) return false;
                  if (!searchQuery.trim()) return true;
                  const secObj = SECTIONS.find((s) => s.id === id);
                  const q = searchQuery.toLowerCase();
                  return (
                    secObj?.label.toLowerCase().includes(q) ||
                    sec.header.toLowerCase().includes(q) ||
                    item.label.toLowerCase().includes(q)
                  );
                });
                return { ...sec, ids: visibleIds };
              }).filter((sec) => sec.ids.length > 0);

              const totalVisibleCount = visibleSubSections.reduce((acc, s) => acc + s.ids.length, 0);
              return { ...item, sections: visibleSubSections, totalCount: totalVisibleCount };
            }).filter((item) => item.totalCount > 0);

            if (itemsWithVisibleChildren.length === 0) return null;

            return (
              <div key={cat.categoryLabel} className="admin-sidebar__category">
                <p className="admin-sidebar__category-label">{cat.categoryLabel}</p>

                {itemsWithVisibleChildren.map((item) => {
                  const hasActiveChild = item.sections.some((sec) => sec.ids.includes(activeSection));
                  const isGroupOpen = searchQuery.trim() ? true : !!openGroups[item.key];

                  return (
                    <div key={item.key} className="admin-sidebar__nav-item">
                      <button
                        type="button"
                        className={`admin-sidebar__accordion-header${hasActiveChild ? ' has-active' : ''}${isGroupOpen ? ' is-open' : ''}`}
                        onClick={() => {
                          if (isCollapsed) setIsCollapsed(false);
                          toggleGroup(item.key);
                        }}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <FontAwesomeIcon icon={item.icon} fixedWidth aria-hidden="true" className="admin-sidebar__item-icon" />
                        <span className="admin-sidebar__label admin-sidebar__item-title">{item.label}</span>
                        {!isCollapsed && (
                          <span className="admin-sidebar__item-right">
                            <span className="admin-sidebar__badge">{item.totalCount}</span>
                            <FontAwesomeIcon icon={isGroupOpen ? faChevronDown : faChevronRight} className="admin-sidebar__chevron" />
                          </span>
                        )}
                      </button>

                      {/* Submenu section headers & page links */}
                      {(!isCollapsed && isGroupOpen) && (
                        <div className="admin-sidebar__submenu">
                          {item.sections.map((sec) => (
                            <div key={sec.header} className="admin-sidebar__sub-group">
                              {item.sections.length > 1 && (
                                <p className="admin-sidebar__section-header">{sec.header}</p>
                              )}
                              {sec.ids.map((id) => {
                                const s = SECTIONS.find((secObj) => secObj.id === id);
                                if (!s) return null;
                                const isActive = activeSection === s.id;
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    className={`admin-sidebar__sublink${isActive ? ' active' : ''}`}
                                    onClick={() => setActiveSection(s.id)}
                                    aria-current={isActive ? 'page' : undefined}
                                  >
                                    <FontAwesomeIcon icon={s.icon} fixedWidth aria-hidden="true" className="admin-sidebar__sub-icon" />
                                    <span className="admin-sidebar__sub-label">{s.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <button
            className="admin-sidebar__account-trigger"
            onClick={() => setAccountMenuOpen((v) => !v)}
            aria-expanded={accountMenuOpen}
            aria-haspopup="menu"
          >
            <span className="admin-sidebar__avatar" aria-hidden="true">{(email || '?')[0].toUpperCase()}</span>
            <span className="admin-sidebar__label admin-sidebar__account-text">
              <span className="admin-sidebar__account-email">{email}</span>
              {session && <span className="admin-sidebar__account-dept">{session.department}</span>}
            </span>
          </button>
          {accountMenuOpen && (
            <div className="admin-sidebar__account-menu" role="menu">
              <button
                role="menuitem"
                onClick={() => {
                  Promise.all([import('firebase/auth'), getFirebaseAuth()]).then(([{ signOut }, auth]) => signOut(auth));
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} fixedWidth aria-hidden="true" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="admin-main">
        <AdminDashboard activeSection={activeSection} setActiveSection={setActiveSection} visibleSectionIds={visibleSectionIds} />
      </main>
    </div>
  );
}
