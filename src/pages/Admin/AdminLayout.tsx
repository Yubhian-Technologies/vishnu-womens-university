import { useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChartLine, faImage, faHouse, faNewspaper, faImages, faGraduationCap, faSchool, faBuildingColumns,
  faChalkboardUser, faLandmark, faUserTie, faBriefcase, faUserGraduate, faBullhorn, faCircleInfo, faCalendarDays,
  faCircleQuestion, faPeopleGroup, faTree, faFileContract, faPuzzlePiece, faAddressBook, faEnvelope, faFileLines,
  faClipboardList, faBus, faCity, faDownload, faTableList, faCamera, faLink, faScaleBalanced, faFolderOpen,
  faChartPie, faChartBar, faStar, faArrowTrendUp, faIdCard, faCalendarCheck, faPortrait, faBuilding, faTag,
  faPlane, faTrophy, faFlask, faFileCircleCheck, faBook, faUserShield, faRightFromBracket, faPhone,
  faPalette, faMedal, faAward,
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
  { id: 'banners',        icon: faImage, label: 'Hero Banners' },
  { id: 'landing-pages',  icon: faHouse, label: 'Landing Pages' },
  { id: 'news',           icon: faNewspaper, label: 'News & Events' },
  { id: 'gallery',        icon: faImages, label: 'Gallery' },
  { id: 'departments',    icon: faBuildingColumns, label: 'Academic Departments' },
  { id: 'programs',       icon: faGraduationCap, label: 'Programs' },
  { id: 'schools',        icon: faSchool, label: 'Schools' },
  { id: 'faculty',        icon: faChalkboardUser, label: 'Faculty' },
  { id: 'governing-body', icon: faLandmark, label: 'Governing Body' },
  { id: 'core-executives', icon: faUserTie, label: 'Core Executives' },
  { id: 'placements',     icon: faBriefcase, label: 'Placement Year Data' },
  { id: 'placement-highlights', icon: faMedal, label: 'Home — Placement Highlights' },
  { id: 'honoured-guests', icon: faAward, label: 'Home — Honoured Guests' },
  { id: 'alumni',         icon: faUserGraduate, label: 'Alumni & Giving' },
  { id: 'announcements',  icon: faBullhorn, label: 'Announcements' },
  { id: 'information',    icon: faCircleInfo, label: 'Information Page' },
  { id: 'events',         icon: faCalendarDays, label: 'Events' },
  { id: 'faqs',           icon: faCircleQuestion, label: 'FAQs' },
  { id: 'student-clubs',  icon: faPeopleGroup, label: 'Student Clubs' },
  { id: 'campus-life',    icon: faTree, label: 'Campus Life' },
  { id: 'job-openings',   icon: faFileContract, label: 'Job Openings' },
  { id: 'content-blocks', icon: faPuzzlePiece, label: 'Page Content Blocks' },
  { id: 'contacts',       icon: faAddressBook, label: 'Department Contacts' },
  { id: 'site-contact',   icon: faPhone, label: 'Site Contact Info' },
  { id: 'crm',            icon: faAddressBook, label: 'CRM (Admissions Leads)' },
  { id: 'contact-messages', icon: faEnvelope, label: 'Contact Us Messages' },
  { id: 'career-applications', icon: faFileLines, label: 'Career Applications' },
  { id: 'admission-inquiries', icon: faClipboardList, label: 'Admission Inquiries' },
  { id: 'campus-visit-requests', icon: faBus, label: 'Campus Visit Requests' },
  { id: 'sves-campuses',  icon: faCity, label: 'SVES Campuses' },
  { id: 'downloads',      icon: faDownload, label: 'Academic Documents' },
  { id: 'curriculum',     icon: faTableList, label: 'Course Curriculum Matrix' },
  { id: 'site-photos',    icon: faCamera, label: 'Website Photos' },
  { id: 'nav-links',      icon: faLink, label: 'Navigation Link Redirects' },
  { id: 'governance-items', icon: faScaleBalanced, label: 'Governance / Committees / IQAC' },
  { id: 'annual-reports', icon: faFolderOpen, label: 'Annual Reports & Reforms' },
  { id: 'nirf-reports',   icon: faChartPie, label: 'NIRF Reports' },
  { id: 'nba-data',       icon: faChartBar, label: 'NBA Data Capturing Points' },
  { id: 'differentiators', icon: faStar, label: 'Differentiators' },
  { id: 'placement-items', icon: faArrowTrendUp, label: 'Placement Sub-pages' },
  { id: 'tpo-team-info', icon: faIdCard, label: 'TPO Team Info' },
  { id: 'placement-crt-docs', icon: faCalendarCheck, label: 'CRT Timetables' },
  { id: 'tpo-team-photos', icon: faPortrait, label: 'TPO Team Photos' },
  { id: 'ilo-office-photos', icon: faBuilding, label: 'Industry Liaison Office Photos' },
  { id: 'recruiter-logos', icon: faTag, label: 'Recruiter Logos' },
  { id: 'gsac-photos', icon: faPlane, label: 'GSAC Photos' },
  { id: 'news-awards-data', icon: faTrophy, label: 'Happenings & Awards' },
  { id: 'research-items', icon: faFlask, label: 'Research' },
  { id: 'compliance-docs', icon: faFileCircleCheck, label: 'Compliance Documents' },
  { id: 'policies', icon: faBook, label: 'Institutional Policies' },
  // Super Admin only — see canSeeUsersRoles below and UsersRolesAdmin.tsx.
  { id: 'users-roles', icon: faUserShield, label: 'Users & Roles' },
];

// Groups the flat SECTIONS list under headers in the desktop sidebar only —
// SECTIONS itself stays flat since it's also used for id→label lookups and
// the mobile bottom nav. Every SECTIONS id must appear in exactly one group
// here; groups are ordered to roughly match the public site's own nav order
// (Discover/About → Academics → Admissions/Info → Student Life → Placements
// → Differentiators → News & Awards → Alumni), so an admin can find a
// section by thinking "where does this live on the website?" rather than
// hunting through one long undifferentiated list.
export const SECTION_GROUPS: { label: string; ids: string[] }[] = [
  { label: 'Overview', ids: ['overview'] },
  { label: 'Form Submissions & CRM', ids: ['crm', 'contact-messages', 'career-applications', 'admission-inquiries', 'campus-visit-requests'] },
  { label: 'Site Appearance', ids: ['theme', 'banners', 'landing-pages', 'honoured-guests', 'site-photos', 'nav-links', 'content-blocks', 'compliance-docs'] },
  { label: 'About & Governance', ids: ['governing-body', 'governance-items', 'annual-reports', 'nirf-reports', 'nba-data', 'core-executives', 'sves-campuses', 'contacts', 'site-contact', 'policies'] },
  { label: 'Academics', ids: ['departments', 'programs', 'schools', 'faculty', 'curriculum', 'downloads'] },
  { label: 'Admissions & Campus Info', ids: ['information'] },
  { label: 'Student Life', ids: ['student-clubs', 'campus-life', 'faqs', 'job-openings', 'events'] },
  { label: 'Placements & Careers', ids: ['placements', 'placement-highlights', 'placement-items', 'tpo-team-info', 'placement-crt-docs', 'tpo-team-photos', 'ilo-office-photos', 'recruiter-logos', 'gsac-photos'] },
  { label: 'Differentiators', ids: ['differentiators'] },
  { label: 'Research', ids: ['research-items'] },
  { label: 'News & Awards', ids: ['news', 'gallery', 'news-awards-data', 'announcements'] },
  { label: 'Alumni & Giving', ids: ['alumni'] },
  { label: 'Administration', ids: ['users-roles'] },
];

export default function AdminLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState('');
  // Which department the in-flight sign-in was submitted under — set by
  // AdminLogin synchronously, before it calls signInWithEmailAndPassword, so
  // it's available the instant this listener sees the resulting auth state
  // change. A ref (not state) because it must be current inside the very
  // next onAuthStateChanged callback, not just on AdminLogin's next render.
  const attemptedDepartmentRef = useRef('');

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    Promise.all([import('firebase/auth'), getFirebaseAuth()]).then(([{ onAuthStateChanged, signOut }, auth]) => {
      if (cancelled) return;
      unsub = onAuthStateChanged(auth, async (u) => {
        if (cancelled) return;
        const attempted = attemptedDepartmentRef.current;
        if (u && attempted) {
          const session = await resolveAdminSession(u);
          if (cancelled) return;
          if (session.department.toLowerCase() !== attempted.toLowerCase()) {
            // Wrong department for this account — sign back out without ever
            // exposing `user` as truthy, so AdminLogin never unmounts and
            // this error survives to be shown on the same screen. The
            // signOut below re-fires this same listener with u=null, which
            // is a no-op past this point since attemptedDepartmentRef is
            // already cleared.
            attemptedDepartmentRef.current = '';
            setLoginError(`This account isn't registered under the "${attempted}" department.`);
            await signOut(auth);
            return;
          }
        }
        attemptedDepartmentRef.current = '';
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
        onAttempt={(department) => {
          setLoginError('');
          attemptedDepartmentRef.current = department;
        }}
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
  // Collapsed to an icon-only rail by default, expands on hover — same
  // interaction as the reference sidebar this was rebuilt from, just driven
  // by a CSS width transition on .admin-sidebar (see Admin.css) instead of
  // framer-motion, since this codebase has no Tailwind/shadcn/motion
  // dependency and every other page here is hand-styled plain CSS.
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  // URL-backed so a section (and, deeper in, a specific Website Photos
  // page/sub-section) is linkable/bookmarkable/shareable, and survives a
  // refresh instead of resetting to Overview.
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('section') ?? 'overview';
  const setActiveSection = (id: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('section', id);
      return next;
    }, { replace: true });
  };

  // 'users-roles' is Super Admin only; every other section is visible if the
  // session can at least read it (isAdmin sessions read everything).
  const visibleSectionIds = new Set(
    SECTIONS.filter((s) => (s.id === 'users-roles' ? session?.isSuperAdmin : canReadModule(session, s.id))).map((s) => s.id)
  );
  // If the active section (e.g. from a bookmarked/shared URL) isn't
  // actually visible to this session, fall back to Overview rather than
  // rendering a section this account has no access to.
  useEffect(() => {
    if (activeSection !== 'overview' && !visibleSectionIds.has(activeSection)) setActiveSection('overview');
  }, [activeSection, visibleSectionIds]);

  return (
    // data-lenis-prevent: the admin shell has its own internal scroll
    // containers (.admin-sidebar, .admin-main), each independently
    // overflow-y: auto — Lenis's global wheel interception (added for the
    // public site's inertia scroll) was swallowing wheel events before they
    // reached these nested containers, so the mouse wheel stopped working
    // here even though dragging the scrollbar thumb still did (that's a
    // native drag, not a wheel event, so it bypassed Lenis entirely). This
    // attribute tells Lenis to skip its own handling for anything inside
    // and let native scroll behavior take over, which is what a CMS
    // dashboard wants anyway.
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
        <nav className="admin-sidebar__nav" aria-label="Admin sections">
          {SECTION_GROUPS.map((group) => {
            const visibleIds = group.ids.filter((id) => visibleSectionIds.has(id));
            if (visibleIds.length === 0) return null;
            return (
            <div className="admin-sidebar__group" key={group.label} role="group" aria-labelledby={`group-${group.label}`}>
              <p className="admin-sidebar__group-label" id={`group-${group.label}`}>{group.label}</p>
              {visibleIds.map((id) => {
                const s = SECTIONS.find((sec) => sec.id === id);
                if (!s) return null;
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    className={`admin-sidebar__link${isActive ? ' active' : ''}`}
                    onClick={() => setActiveSection(s.id)}
                    aria-current={isActive ? 'page' : undefined}
                    title={isCollapsed ? s.label : undefined}
                  >
                    <FontAwesomeIcon icon={s.icon} fixedWidth aria-hidden="true" />
                    <span className="admin-sidebar__label">{s.label}</span>
                  </button>
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
