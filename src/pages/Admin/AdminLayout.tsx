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
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`admin-sidebar__link${activeSection === s.id ? ' active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
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
