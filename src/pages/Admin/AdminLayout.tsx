import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import './Admin.css';

export const SECTIONS = [
  { id: 'overview',       icon: '📊', label: 'Overview' },
  { id: 'banners',        icon: '🖼️', label: 'Hero Banners' },
  { id: 'news',           icon: '📰', label: 'News & Events' },
  { id: 'gallery',        icon: '📷', label: 'Gallery' },
  { id: 'programs',       icon: '🎓', label: 'Programs' },
  { id: 'faculty',        icon: '👩‍🏫', label: 'Faculty' },
  { id: 'governing-body', icon: '🏛️', label: 'Governing Body' },
  { id: 'core-executives', icon: '🧑‍💼', label: 'Core Executives' },
  { id: 'placements',     icon: '💼', label: 'Placements' },
  { id: 'alumni',         icon: '🎓', label: 'Alumni & Giving' },
  { id: 'announcements',  icon: '📢', label: 'Announcements' },
  { id: 'information',    icon: '📅', label: 'Information Page' },
  { id: 'events',         icon: '🎉', label: 'Events' },
  { id: 'faqs',           icon: '❓', label: 'FAQs' },
  { id: 'student-clubs',  icon: '🎭', label: 'Student Clubs' },
  { id: 'job-openings',   icon: '💼', label: 'Job Openings' },
  { id: 'content-blocks', icon: '🧩', label: 'Page Content Blocks' },
  { id: 'contacts',       icon: '📇', label: 'Department Contacts' },
  { id: 'sves-campuses',  icon: '🏘️', label: 'SVES Campuses' },
  { id: 'downloads',      icon: '📄', label: 'Academic Documents' },
  { id: 'curriculum',     icon: '📚', label: 'Course Curriculum Matrix' },
  { id: 'site-photos',    icon: '🖼️', label: 'Website Photos' },
  { id: 'nav-links',      icon: '🔗', label: 'Navigation Link Redirects' },
  { id: 'governance-items', icon: '⚖️', label: 'Governance / Committees / IQAC' },
  { id: 'differentiators', icon: '✨', label: 'Differentiators' },
  { id: 'placement-items', icon: '📈', label: 'Placement Sub-pages' },
  { id: 'news-awards-data', icon: '🏆', label: 'Happenings & Awards' },
  { id: 'research-items', icon: '🔬', label: 'Research' },
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
  { label: 'Site Appearance', ids: ['banners', 'site-photos', 'nav-links', 'content-blocks'] },
  { label: 'About & Governance', ids: ['governing-body', 'governance-items', 'core-executives', 'sves-campuses', 'contacts'] },
  { label: 'Academics', ids: ['programs', 'faculty', 'curriculum', 'downloads'] },
  { label: 'Admissions & Campus Info', ids: ['information'] },
  { label: 'Student Life', ids: ['student-clubs', 'faqs', 'job-openings', 'events'] },
  { label: 'Placements & Careers', ids: ['placements', 'placement-items'] },
  { label: 'Differentiators', ids: ['differentiators'] },
  { label: 'Research', ids: ['research-items'] },
  { label: 'News & Awards', ids: ['news', 'gallery', 'news-awards-data', 'announcements'] },
  { label: 'Alumni & Giving', ids: ['alumni'] },
];

export default function AdminLayout() {
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [checking, setChecking] = useState(true);
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? { email: u.email } : null);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <div className="admin-checking">
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  return (
    <div className="admin-shell">
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
          <p className="admin-sidebar__email">{user.email}</p>
          <button onClick={() => signOut(auth)} className="admin-btn admin-btn--ghost">
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
