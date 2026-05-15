import { SECTIONS } from './AdminLayout';
import Overview from './sections/Overview';
import BannersAdmin from './sections/BannersAdmin';
import NewsAdmin from './sections/NewsAdmin';
import GalleryAdmin from './sections/GalleryAdmin';
import ProgramsAdmin from './sections/ProgramsAdmin';
import FacultyAdmin from './sections/FacultyAdmin';
import PlacementsAdmin from './sections/PlacementsAdmin';
import AnnouncementsAdmin from './sections/AnnouncementsAdmin';

interface Props {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const SECTION_MAP: Record<string, React.ReactNode> = {
  overview: <Overview />,
  banners: <BannersAdmin />,
  news: <NewsAdmin />,
  gallery: <GalleryAdmin />,
  programs: <ProgramsAdmin />,
  faculty: <FacultyAdmin />,
  placements: <PlacementsAdmin />,
  announcements: <AnnouncementsAdmin />,
};

export default function AdminDashboard({ activeSection, setActiveSection }: Props) {
  const current = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="admin-content">
      <div className="admin-content__header">
        <h1>{current?.icon} {current?.label}</h1>
      </div>
      <div className="admin-content__body">
        {SECTION_MAP[activeSection] ?? <Overview />}
      </div>
      {/* Mobile bottom nav */}
      <nav className="admin-bottom-nav">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`admin-bottom-nav__btn${activeSection === s.id ? ' active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
