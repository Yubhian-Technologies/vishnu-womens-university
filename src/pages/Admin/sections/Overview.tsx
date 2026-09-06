import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { useCollection } from '../../../hooks/useCollection';
import { SECTIONS } from '../AdminLayout';

// Reuses the same Font Awesome icon already picked for each section in the
// sidebar (see SECTIONS in AdminLayout.tsx) rather than choosing separately.
const iconFor = (sectionId: string) => SECTIONS.find((s) => s.id === sectionId)!.icon;

const STAT_COLLECTIONS = [
  { id: 'banners',       label: 'Hero Banners' },
  { id: 'news',          label: 'News & Events' },
  { id: 'gallery',       label: 'Gallery Images' },
  { id: 'programs',      label: 'Programs' },
  { id: 'faculty',       label: 'Faculty Records' },
  { id: 'placements',    label: 'Placements' },
  { id: 'announcements', label: 'Announcements' },
];

function StatCard({ col }: { col: (typeof STAT_COLLECTIONS)[0] }) {
  const { docs, loading } = useCollection(col.id);
  return (
    <div className="admin-stat-card">
      <span className="admin-stat-card__icon"><FontAwesomeIcon icon={iconFor(col.id)} aria-hidden="true" /></span>
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
        <h3><FontAwesomeIcon icon={faThumbtack} aria-hidden="true" /> <span>How it works</span></h3>
        <ul>
          <li>Upload images → they are stored on <strong>Firebase Storage</strong> automatically.</li>
          <li>All content (text + image URLs) is saved in <strong>Firestore</strong> in real-time.</li>
          <li>The live website reads from Firestore — changes appear immediately without a rebuild.</li>
        </ul>
      </div>
    </div>
  );
}
