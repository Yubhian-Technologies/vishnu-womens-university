import { SECTIONS } from './AdminLayout';
import Overview from './sections/Overview';
import BannersAdmin from './sections/BannersAdmin';
import LandingPagesAdmin from './sections/LandingPagesAdmin';
import NewsAdmin from './sections/NewsAdmin';
import GalleryAdmin from './sections/GalleryAdmin';
import ProgramsAdmin from './sections/ProgramsAdmin';
import DepartmentsAdmin from './sections/DepartmentsAdmin';
import FacultyAdmin from './sections/FacultyAdmin';
import GoverningBodyAdmin from './sections/GoverningBodyAdmin';
import CoreExecutivesAdmin from './sections/CoreExecutivesAdmin';
import PlacementYearsAdmin from './sections/PlacementYearsAdmin';
import AlumniAdmin from './sections/AlumniAdmin';
import AnnouncementsAdmin from './sections/AnnouncementsAdmin';
import InformationAdmin from './sections/InformationAdmin';
import EventsAdmin from './sections/EventsAdmin';
import FaqAdmin from './sections/FaqAdmin';
import StudentClubsAdmin from './sections/StudentClubsAdmin';
import JobOpeningsAdmin from './sections/JobOpeningsAdmin';
import ContentBlocksAdmin from './sections/ContentBlocksAdmin';
import ContactsAdmin from './sections/ContactsAdmin';
import ContactMessagesAdmin from './sections/ContactMessagesAdmin';
import CareerApplicationsAdmin from './sections/CareerApplicationsAdmin';
import AdmissionInquiriesAdmin from './sections/AdmissionInquiriesAdmin';
import CampusVisitRequestsAdmin from './sections/CampusVisitRequestsAdmin';
import SvesCampusesAdmin from './sections/SvesCampusesAdmin';
import DownloadsAdmin from './sections/DownloadsAdmin';
import CurriculumAdmin from './sections/CurriculumAdmin';
import SitePhotosAdmin from './sections/SitePhotosAdmin';
import NavLinkOverridesAdmin from './sections/NavLinkOverridesAdmin';
import GovernanceItemsAdmin from './sections/GovernanceItemsAdmin';
import AnnualReportsAdmin from './sections/AnnualReportsAdmin';
import NirfReportsAdmin from './sections/NirfReportsAdmin';
import NbaDataAdmin from './sections/NbaDataAdmin';
import DifferentiatorsAdmin from './sections/DifferentiatorsAdmin';
import PlacementItemsAdmin from './sections/PlacementItemsAdmin';
import PlacementCrtDocsAdmin from './sections/PlacementCrtDocsAdmin';
import NewsAwardsDataAdmin from './sections/NewsAwardsDataAdmin';
import ResearchItemsAdmin from './sections/ResearchItemsAdmin';
import ComplianceDocsAdmin from './sections/ComplianceDocsAdmin';
import PoliciesAdmin from './sections/PoliciesAdmin';
import TpoTeamInfoAdmin from './sections/TpoTeamInfoAdmin';
import TpoTeamPhotosAdmin from './sections/TpoTeamPhotosAdmin';
import IloOfficePhotosAdmin from './sections/IloOfficePhotosAdmin';
import RecruiterLogosAdmin from './sections/RecruiterLogosAdmin';
import GsacPhotosAdmin from './sections/GsacPhotosAdmin';
import { useAdminSession } from './AdminSessionContext';
import ReadOnlyGate from './ReadOnlyGate';
import { canEdit, RESOURCES, type ResourceKey } from '../../lib/rbac';

interface Props {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

// Sections wholly dedicated to Placements — a department account holding the
// mapped resource gets full, unwrapped access to the whole section. Every
// other section not listed here (except the self-gated ones below) is
// wrapped read-only for any non-Admin session by default, so a brand-new
// department starts with zero edit access anywhere until its own resources
// are granted — no per-section code change needed to add that department.
const SECTION_RESOURCE: Partial<Record<string, ResourceKey>> = {
  placements: RESOURCES.PLACEMENTS_PAGE_CONTENT,
  'placement-items': RESOURCES.PLACEMENTS_PAGE_CONTENT,
  'tpo-team-info': RESOURCES.PLACEMENTS_PAGE_CONTENT,
  'placement-crt-docs': RESOURCES.PLACEMENTS_PAGE_CONTENT,
  'tpo-team-photos': RESOURCES.PLACEMENTS_GALLERY,
  'ilo-office-photos': RESOURCES.PLACEMENTS_GALLERY,
  'recruiter-logos': RESOURCES.PLACEMENTS_GALLERY,
  'gsac-photos': RESOURCES.PLACEMENTS_GALLERY,
};

// These sections mix Placements content with unrelated content in the same
// screen (e.g. Hero Banners covers every page on the site, not just
// Placements'), so they apply canEdit()/isReadOnly() internally, scoped to
// the specific item being edited, rather than being wrapped wholesale here.
const SELF_GATED_SECTIONS = new Set(['banners', 'site-photos', 'content-blocks']);

// Overview is a read-only stats dashboard for every session (nothing to
// edit even for Admin), so it never shows a read-only badge or gets wrapped.
const UNGATED_SECTIONS = new Set(['overview']);

const SECTION_MAP: Record<string, React.ReactNode> = {
  overview: <Overview />,
  banners: <BannersAdmin />,
  'landing-pages': <LandingPagesAdmin />,
  news: <NewsAdmin />,
  gallery: <GalleryAdmin />,
  programs: <ProgramsAdmin />,
  departments: <DepartmentsAdmin />,
  faculty: <FacultyAdmin />,
  'governing-body': <GoverningBodyAdmin />,
  'core-executives': <CoreExecutivesAdmin />,
  placements: <PlacementYearsAdmin />,
  alumni: <AlumniAdmin />,
  announcements: <AnnouncementsAdmin />,
  information: <InformationAdmin />,
  events: <EventsAdmin />,
  faqs: <FaqAdmin />,
  'student-clubs': <StudentClubsAdmin />,
  'job-openings': <JobOpeningsAdmin />,
  'content-blocks': <ContentBlocksAdmin />,
  contacts: <ContactsAdmin />,
  'contact-messages': <ContactMessagesAdmin />,
  'career-applications': <CareerApplicationsAdmin />,
  'admission-inquiries': <AdmissionInquiriesAdmin />,
  'campus-visit-requests': <CampusVisitRequestsAdmin />,
  'sves-campuses': <SvesCampusesAdmin />,
  downloads: <DownloadsAdmin />,
  curriculum: <CurriculumAdmin />,
  'site-photos': <SitePhotosAdmin />,
  'nav-links': <NavLinkOverridesAdmin />,
  'governance-items': <GovernanceItemsAdmin />,
  'annual-reports': <AnnualReportsAdmin />,
  'nirf-reports': <NirfReportsAdmin />,
  'nba-data': <NbaDataAdmin />,
  differentiators: <DifferentiatorsAdmin />,
  'placement-items': <PlacementItemsAdmin />,
  'tpo-team-info': <TpoTeamInfoAdmin />,
  'placement-crt-docs': <PlacementCrtDocsAdmin />,
  'tpo-team-photos': <TpoTeamPhotosAdmin />,
  'ilo-office-photos': <IloOfficePhotosAdmin />,
  'recruiter-logos': <RecruiterLogosAdmin />,
  'gsac-photos': <GsacPhotosAdmin />,
  'news-awards-data': <NewsAwardsDataAdmin />,
  'research-items': <ResearchItemsAdmin />,
  'compliance-docs': <ComplianceDocsAdmin />,
  policies: <PoliciesAdmin />,
};

export default function AdminDashboard({ activeSection, setActiveSection }: Props) {
  const session = useAdminSession();
  const current = SECTIONS.find((s) => s.id === activeSection);

  const selfGated = SELF_GATED_SECTIONS.has(activeSection) || UNGATED_SECTIONS.has(activeSection);
  const mappedResource = SECTION_RESOURCE[activeSection];
  const sectionEditable = mappedResource ? canEdit(session, mappedResource) : !!session?.isAdmin;
  const readOnly = !selfGated && !sectionEditable;

  return (
    <div className="admin-content">
      <div className="admin-content__header">
        <h1><span aria-hidden="true">{current?.icon}</span> {current?.label}</h1>
        {readOnly && <span className="admin-badge admin-badge--gray"><span aria-hidden="true">🔒</span> Read Only</span>}
      </div>
      <div className="admin-content__body">
        <ReadOnlyGate readOnly={readOnly}>
          {SECTION_MAP[activeSection] ?? <Overview />}
        </ReadOnlyGate>
      </div>
      {/* Mobile bottom nav */}
      <nav className="admin-bottom-nav" aria-label="Admin sections">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              className={`admin-bottom-nav__btn${isActive ? ' active' : ''}`}
              onClick={() => setActiveSection(s.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span aria-hidden="true">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
