import { useEffect, useState } from 'react';
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
  { id: 'placements',     icon: '💼', label: 'Placements' },
  { id: 'announcements',  icon: '📢', label: 'Announcements' },
];

export default function AdminLayout() {
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [checking, setChecking] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

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
