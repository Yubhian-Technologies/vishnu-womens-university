import { useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { getFirebaseAuth } from '../../lib/firebaseAdmin';
import { resolveAdminSession } from '../../lib/rbac';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminSessionProvider, { useAdminSession } from './AdminSessionContext';
import './Admin.css';

export const SECTIONS = [
  { id: 'overview',       icon: '📊', label: 'Overview' },
  { id: 'banners',        icon: '🖼️', label: 'Hero Banners' },
  { id: 'landing-pages',  icon: '🏠', label: 'Landing Pages' },
  { id: 'news',           icon: '📰', label: 'News & Events' },
  { id: 'gallery',        icon: '📷', label: 'Gallery' },
  { id: 'programs',       icon: '🎓', label: 'Programs' },
  { id: 'faculty',        icon: '👩‍🏫', label: 'Faculty' },
  { id: 'governing-body', icon: '🏛️', label: 'Governing Body' },
  { id: 'core-executives', icon: '🧑‍💼', label: 'Core Executives' },
  { id: 'placements',     icon: '💼', label: 'Placement Year Data' },
  { id: 'alumni',         icon: '🎓', label: 'Alumni & Giving' },
  { id: 'announcements',  icon: '📢', label: 'Announcements' },
  { id: 'information',    icon: '📅', label: 'Information Page' },
  { id: 'events',         icon: '🎉', label: 'Events' },
  { id: 'faqs',           icon: '❓', label: 'FAQs' },
  { id: 'student-clubs',  icon: '🎭', label: 'Student Clubs' },
  { id: 'job-openings',   icon: '💼', label: 'Job Openings' },
  { id: 'content-blocks', icon: '🧩', label: 'Page Content Blocks' },
  { id: 'contacts',       icon: '📇', label: 'Department Contacts' },
  { id: 'contact-messages', icon: '✉️', label: 'Contact Us Messages' },
  { id: 'career-applications', icon: '🧑‍💼', label: 'Career Applications' },
  { id: 'admission-inquiries', icon: '📝', label: 'Admission Inquiries' },
  { id: 'campus-visit-requests', icon: '🚌', label: 'Campus Visit Requests' },
  { id: 'sves-campuses',  icon: '🏘️', label: 'SVES Campuses' },
  { id: 'downloads',      icon: '📄', label: 'Academic Documents' },
  { id: 'curriculum',     icon: '📚', label: 'Course Curriculum Matrix' },
  { id: 'site-photos',    icon: '🖼️', label: 'Website Photos' },
  { id: 'nav-links',      icon: '🔗', label: 'Navigation Link Redirects' },
  { id: 'governance-items', icon: '⚖️', label: 'Governance / Committees / IQAC' },
  { id: 'differentiators', icon: '✨', label: 'Differentiators' },
  { id: 'iic-member-photos', icon: '🧑‍🤝‍🧑', label: 'IIC Council Member Photos' },
  { id: 'tedx-photos', icon: '🔴', label: 'TEDxSVECW Photos' },
  { id: 'ti-dsp-gallery-photos', icon: '📡', label: 'TI-DSP CoE Gallery Photos' },
  { id: 'chips-to-startup-photos', icon: '🧩', label: 'Chips to Startup (C2S) Photos' },
  { id: 'vsac-gallery-photos', icon: '🛰️', label: 'VSAC Gallery Photos' },
  { id: 'vdl-facilities-photos', icon: '🚗', label: 'Vehicle Design Lab Photos' },
  { id: 'atl-photos', icon: '🦾', label: 'Assistive Technology Lab (ATL) Photos' },
  { id: 'concrete-canoe-photos', icon: '🛶', label: 'Concrete Canoe Laboratory Photos' },
  { id: 'wise-placements', icon: '💼', label: 'TalentSprint – WISE Placement Cards' },
  { id: 'wise-team-photos', icon: '🧑‍🏫', label: 'TalentSprint – WISE Team Photos' },
  { id: 'wise-elite-photos', icon: '🏆', label: 'TalentSprint – WISE-ELITE Project Photos' },
  { id: 'wise-testimonial-photos', icon: '💬', label: 'TalentSprint – WISE Testimonial Photos' },
  { id: 'wise-nse-clippings', icon: '📰', label: 'TalentSprint @ NSE Clippings' },
  { id: 'nirvahana-photos', icon: '📈', label: 'Nirvahana Event Photos' },
  { id: 'placement-items', icon: '📈', label: 'Placement Sub-pages' },
  { id: 'tpo-team-photos', icon: '🪪', label: 'TPO Team Photos' },
  { id: 'ilo-office-photos', icon: '🏢', label: 'Industry Liaison Office Photos' },
  { id: 'gsac-photos', icon: '✈️', label: 'GSAC Photos' },
  { id: 'news-awards-data', icon: '🏆', label: 'Happenings & Awards' },
  { id: 'research-items', icon: '🔬', label: 'Research' },
  { id: 'compliance-docs', icon: '📜', label: 'Compliance Documents' },
  { id: 'policies', icon: '📋', label: 'Institutional Policies' },
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
  { label: 'Form Submissions', ids: ['contact-messages', 'career-applications', 'admission-inquiries', 'campus-visit-requests'] },
  { label: 'Site Appearance', ids: ['banners', 'landing-pages', 'site-photos', 'nav-links', 'content-blocks', 'compliance-docs'] },
  { label: 'About & Governance', ids: ['governing-body', 'governance-items', 'core-executives', 'sves-campuses', 'contacts', 'policies'] },
  { label: 'Academics', ids: ['programs', 'faculty', 'curriculum', 'downloads'] },
  { label: 'Admissions & Campus Info', ids: ['information'] },
  { label: 'Student Life', ids: ['student-clubs', 'faqs', 'job-openings', 'events'] },
  { label: 'Placements & Careers', ids: ['placements', 'placement-items', 'tpo-team-photos', 'ilo-office-photos', 'gsac-photos'] },
  { label: 'Differentiators', ids: ['differentiators', 'iic-member-photos', 'tedx-photos', 'ti-dsp-gallery-photos', 'chips-to-startup-photos', 'vsac-gallery-photos', 'vdl-facilities-photos', 'atl-photos', 'concrete-canoe-photos', 'wise-placements', 'wise-team-photos', 'wise-elite-photos', 'wise-testimonial-photos', 'wise-nse-clippings', 'nirvahana-photos'] },
  { label: 'Research', ids: ['research-items'] },
  { label: 'News & Awards', ids: ['news', 'gallery', 'news-awards-data', 'announcements'] },
  { label: 'Alumni & Giving', ids: ['alumni'] },
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
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span>🎓</span>
          <span>VWU Admin</span>
        </div>
        <nav className="admin-sidebar__nav">
          {SECTION_GROUPS.map((group) => (
            <div className="admin-sidebar__group" key={group.label}>
              <p className="admin-sidebar__group-label">{group.label}</p>
              {group.ids.map((id) => {
                const s = SECTIONS.find((sec) => sec.id === id);
                if (!s) return null;
                return (
                  <button
                    key={s.id}
                    className={`admin-sidebar__link${activeSection === s.id ? ' active' : ''}`}
                    onClick={() => setActiveSection(s.id)}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          {session && <p className="admin-sidebar__email">Department: {session.department}</p>}
          <p className="admin-sidebar__email">{email}</p>
          <button
            onClick={() => {
              Promise.all([import('firebase/auth'), getFirebaseAuth()]).then(([{ signOut }, auth]) => signOut(auth));
            }}
            className="admin-btn admin-btn--ghost"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <AdminDashboard activeSection={activeSection} setActiveSection={setActiveSection} />
      </main>
    </div>
  );
}
