import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Academics from './pages/Academics/Academics';
import ProgramDetail from './pages/Academics/ProgramDetail';
import Faculty from './pages/Academics/Faculty';
import AcademicDownloads from './pages/Academics/Downloads';
import CurriculumMatrix from './pages/Academics/CurriculumMatrix';
import Admissions from './pages/Admissions/Admissions';
import StudentLife from './pages/StudentLife/StudentLife';
import AlumniGiving from './pages/AlumniGiving/AlumniGiving';
import About from './pages/About/About';
import News from './pages/News/News';
import Events from './pages/Events/Events';
import VisionMission from './pages/VisionMission/VisionMission';
import Governance from './pages/Governance/Governance';
import GovernanceDetail from './pages/Governance/GovernanceDetail';
import GoverningBody from './pages/Governance/GoverningBody';
import Research from './pages/Research/Research';
import ResearchDetail from './pages/Research/ResearchDetail';
import AboutSVES from './pages/AboutSVES/AboutSVES';
import Campus from './pages/Campus/Campus';
import Information from './pages/Information/Information';
import ProgrammesFee from './pages/Admissions/ProgrammesFee';
import AdmissionProcedure from './pages/Admissions/AdmissionProcedure';
import ResultAnalysis from './pages/Admissions/ResultAnalysis';
import VishnuTV from './pages/StudentActivities/VishnuTV';
import StudentClubs from './pages/StudentActivities/StudentClubs';
import SocialServices from './pages/StudentActivities/SocialServices';
import CampusMagazines from './pages/StudentActivities/CampusMagazines';
import ArtsCulture from './pages/StudentActivities/ArtsCulture';
import SportsGames from './pages/StudentActivities/SportsGames';
import Differentiators from './pages/Differentiators/Differentiators';
import DifferentiatorDetail from './pages/Differentiators/DifferentiatorDetail';
import Placements from './pages/Placements/Placements';
import PlacementDetail from './pages/Placements/PlacementDetail';
import NewsAwards from './pages/NewsAwards/NewsAwards';
import Happenings from './pages/NewsAwards/Happenings';
import Accreditations from './pages/NewsAwards/Accreditations';
import GalleryPage from './pages/NewsAwards/Gallery';
import Careers from './pages/Careers/Careers';
import Contact from './pages/Contact/Contact';
import AdminLayout from './pages/Admin/AdminLayout';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Skip resetting scroll when the URL carries a hash (e.g. "/campus#library") —
    // the destination page's own useHashScroll effect owns positioning in that
    // case, and racing it here caused inconsistent/flaky landing positions.
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function PublicApp() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/academics/downloads" element={<AcademicDownloads />} />
        <Route path="/academics/curriculum" element={<CurriculumMatrix />} />
        <Route path="/academics/:slug" element={<ProgramDetail />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/student-life" element={<StudentLife />} />
        <Route path="/alumni-giving" element={<AlumniGiving />} />
        <Route path="/about" element={<About />} />
        <Route path="/vision-mission" element={<VisionMission />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/governance/governing-body" element={<GoverningBody />} />
        <Route path="/governance/:slug" element={<GovernanceDetail />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research/:slug" element={<ResearchDetail />} />
        <Route path="/about-sves" element={<AboutSVES />} />
        <Route path="/campus" element={<Campus />} />
        <Route path="/information" element={<Information />} />
        <Route path="/programmes-fee-structure" element={<ProgrammesFee />} />
        <Route path="/admission-procedure" element={<AdmissionProcedure />} />
        <Route path="/result-analysis" element={<ResultAnalysis />} />
        <Route path="/vishnu-tv-academy" element={<VishnuTV />} />
        <Route path="/student-clubs" element={<StudentClubs />} />
        <Route path="/social-services" element={<SocialServices />} />
        <Route path="/campus-magazines" element={<CampusMagazines />} />
        <Route path="/arts-culture" element={<ArtsCulture />} />
        <Route path="/sports-games" element={<SportsGames />} />
        <Route path="/differentiators" element={<Differentiators />} />
        <Route path="/differentiators/:slug" element={<DifferentiatorDetail />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/placements/:slug" element={<PlacementDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news-awards" element={<NewsAwards />} />
        <Route path="/news-awards/happenings" element={<Happenings />} />
        <Route path="/news-awards/accreditations-awards" element={<Accreditations />} />
        <Route path="/news-awards/gallery" element={<GalleryPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function MaintenancePage() {
  useEffect(() => {
    document.title = 'Under Maintenance | Vishnu Womens University';
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'var(--color-bg, #fff)',
      }}
    >
      <img
        src="/vwu-logo.png"
        alt="Vishnu Womens University"
        style={{ height: 80, marginBottom: '2rem', objectFit: 'contain' }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      <h1
        style={{
          fontSize: '2.5rem',
          fontFamily: 'var(--font-serif)',
          fontWeight: 900,
          color: 'var(--color-primary)',
          marginBottom: '1rem',
        }}
      >
        Under Maintenance
      </h1>
      <p
        style={{
          color: 'var(--color-text-light, #666)',
          fontSize: '1.1rem',
          maxWidth: 480,
          lineHeight: 1.7,
        }}
      >
        We're making some updates to serve you better. Please check back shortly.
      </p>
    </main>
  );
}

const IS_MAINTENANCE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

function RootRouter() {
  return (
    <Routes>
      {/* Admin shell is matched by react-router's own segment-aware routing
          (not a manual pathname.startsWith check, which would also match
          unrelated public routes like "/administration"). Everything under
          /admin/* renders only AdminLayout — no public Header/Footer, no
          maintenance gate. */}
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/*" element={IS_MAINTENANCE ? <MaintenancePage /> : <PublicApp />} />
    </Routes>
  );
}

function NotFound() {
  useEffect(() => {
    document.title = '404 | Vishnu Womens University';
  }, []);

  return (
    <main className="page-wrapper">
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 2rem',
        }}
      >
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><GraduationCap size={96} strokeWidth={1.5} color="var(--color-primary)" /></div>
        <h1 style={{ fontSize: '5rem', fontFamily: 'var(--font-serif)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text)', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem', maxWidth: 480, marginBottom: '2rem' }}>
          Looks like this page is on summer break. Let's get you back to campus.
        </p>
        <a href="/" className="btn btn-primary btn-lg">Back to Home</a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RootRouter />
    </BrowserRouter>
  );
}
