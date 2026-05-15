import { useCollection } from '../../../hooks/useCollection';

const STAT_COLLECTIONS = [
  { id: 'banners',       label: 'Hero Banners',    icon: '🖼️' },
  { id: 'news',          label: 'News & Events',   icon: '📰' },
  { id: 'gallery',       label: 'Gallery Images',  icon: '📷' },
  { id: 'programs',      label: 'Programs',        icon: '🎓' },
  { id: 'faculty',       label: 'Faculty Records', icon: '👩‍🏫' },
  { id: 'placements',    label: 'Placements',      icon: '💼' },
  { id: 'announcements', label: 'Announcements',   icon: '📢' },
];

function StatCard({ col }: { col: (typeof STAT_COLLECTIONS)[0] }) {
  const { docs, loading } = useCollection(col.id);
  return (
    <div className="admin-stat-card">
      <span className="admin-stat-card__icon">{col.icon}</span>
      <div className="admin-stat-card__info">
        <span className="admin-stat-card__count">{loading ? '…' : docs.length}</span>
        <span className="admin-stat-card__label">{col.label}</span>
      </div>
    </div>
  );
}

export default function Overview() {
  return (
    <div>
      <p className="admin-lead">
        Welcome to the VWU Content Management System. Use the sidebar to manage each section.
      </p>
      <div className="admin-stat-grid">
        {STAT_COLLECTIONS.map((c) => (
          <StatCard key={c.id} col={c} />
        ))}
      </div>
      <div className="admin-info-box">
        <h3>📌 How it works</h3>
        <ul>
          <li>Upload images → they are stored on <strong>Cloudinary CDN</strong> automatically.</li>
          <li>All content (text + image URLs) is saved in <strong>Firestore</strong> in real-time.</li>
          <li>The live website reads from Firestore — changes appear immediately without a rebuild.</li>
        </ul>
      </div>
    </div>
  );
}
