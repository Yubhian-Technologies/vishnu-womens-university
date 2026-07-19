import { SECTIONS } from './AdminLayout';
import Overview from './sections/Overview';
import BannersAdmin from './sections/BannersAdmin';
import NewsAdmin from './sections/NewsAdmin';
import GalleryAdmin from './sections/GalleryAdmin';
import ProgramsAdmin from './sections/ProgramsAdmin';
import FacultyAdmin from './sections/FacultyAdmin';
import GoverningBodyAdmin from './sections/GoverningBodyAdmin';
import CoreExecutivesAdmin from './sections/CoreExecutivesAdmin';
import PlacementsAdmin from './sections/PlacementsAdmin';
import AlumniAdmin from './sections/AlumniAdmin';
import AnnouncementsAdmin from './sections/AnnouncementsAdmin';
import InformationAdmin from './sections/InformationAdmin';
import EventsAdmin from './sections/EventsAdmin';
import FaqAdmin from './sections/FaqAdmin';
import StudentClubsAdmin from './sections/StudentClubsAdmin';
import JobOpeningsAdmin from './sections/JobOpeningsAdmin';
import ContentBlocksAdmin from './sections/ContentBlocksAdmin';
import ContactsAdmin from './sections/ContactsAdmin';
import SvesCampusesAdmin from './sections/SvesCampusesAdmin';
import DownloadsAdmin from './sections/DownloadsAdmin';
import CurriculumAdmin from './sections/CurriculumAdmin';
import SitePhotosAdmin from './sections/SitePhotosAdmin';
import NavLinkOverridesAdmin from './sections/NavLinkOverridesAdmin';
import GovernanceItemsAdmin from './sections/GovernanceItemsAdmin';
import DifferentiatorsAdmin from './sections/DifferentiatorsAdmin';
import PlacementItemsAdmin from './sections/PlacementItemsAdmin';
import NewsAwardsDataAdmin from './sections/NewsAwardsDataAdmin';
import ResearchItemsAdmin from './sections/ResearchItemsAdmin';

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
  'governing-body': <GoverningBodyAdmin />,
  'core-executives': <CoreExecutivesAdmin />,
  placements: <PlacementsAdmin />,
  alumni: <AlumniAdmin />,
  announcements: <AnnouncementsAdmin />,
  information: <InformationAdmin />,
  events: <EventsAdmin />,
  faqs: <FaqAdmin />,
  'student-clubs': <StudentClubsAdmin />,
  'job-openings': <JobOpeningsAdmin />,
  'content-blocks': <ContentBlocksAdmin />,
  contacts: <ContactsAdmin />,
  'sves-campuses': <SvesCampusesAdmin />,
  downloads: <DownloadsAdmin />,
  curriculum: <CurriculumAdmin />,
  'site-photos': <SitePhotosAdmin />,
  'nav-links': <NavLinkOverridesAdmin />,
  'governance-items': <GovernanceItemsAdmin />,
  differentiators: <DifferentiatorsAdmin />,
  'placement-items': <PlacementItemsAdmin />,
  'news-awards-data': <NewsAwardsDataAdmin />,
  'research-items': <ResearchItemsAdmin />,
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
