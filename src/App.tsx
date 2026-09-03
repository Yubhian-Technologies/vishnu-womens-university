import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SmoothScroll from './components/SmoothScroll/SmoothScroll';
import LandingPageLoader from './components/LandingPageLoader/LandingPageLoader';
import IntroVideo from './components/IntroVideo/IntroVideo';
import RouteFallback from './components/RouteFallback/RouteFallback';
import SEO from './components/SEO/SEO';
import ThemeOverrides from './components/ThemeOverrides/ThemeOverrides';
import { smoothScrollTo } from './lib/smoothScroll';

const Academics = lazy(() => import('./pages/Academics/Academics'));
const ProgramDetail = lazy(() => import('./pages/Academics/ProgramDetail'));
const FreshmanEngineering = lazy(() => import('./pages/Academics/FreshmanEngineering'));
const Faculty = lazy(() => import('./pages/Academics/Faculty'));
const FacultyProfile = lazy(() => import('./pages/Academics/FacultyProfile'));
const AcademicDownloads = lazy(() => import('./pages/Academics/Downloads'));
const CurriculumMatrix = lazy(() => import('./pages/Academics/CurriculumMatrix'));
const Schools = lazy(() => import('./pages/Academics/Schools'));
const Departments = lazy(() => import('./pages/Academics/Departments'));
const Programs = lazy(() => import('./pages/Academics/Programs'));
const Admissions = lazy(() => import('./pages/Admissions/Admissions'));
const CampusVisit = lazy(() => import('./pages/CampusVisit/CampusVisit'));
const StudentLife = lazy(() => import('./pages/StudentLife/StudentLife'));
const AlumniGiving = lazy(() => import('./pages/AlumniGiving/AlumniGiving'));
const About = lazy(() => import('./pages/About/About'));
const News = lazy(() => import('./pages/News/News'));
const Events = lazy(() => import('./pages/Events/Events'));
const VisionMission = lazy(() => import('./pages/VisionMission/VisionMission'));
const Governance = lazy(() => import('./pages/Governance/Governance'));
const GovernanceDetail = lazy(() => import('./pages/Governance/GovernanceDetail'));
const GoverningBody = lazy(() => import('./pages/Governance/GoverningBody'));
const Research = lazy(() => import('./pages/Research/Research'));
const ResearchDetail = lazy(() => import('./pages/Research/ResearchDetail'));
const AboutSVES = lazy(() => import('./pages/AboutSVES/AboutSVES'));
const Campus = lazy(() => import('./pages/Campus/Campus'));
const CampusLifeDetail = lazy(() => import('./pages/CampusLife/CampusLifeDetail'));
const Information = lazy(() => import('./pages/Information/Information'));
const ProgrammesFee = lazy(() => import('./pages/Admissions/ProgrammesFee'));
const AdmissionProcedure = lazy(() => import('./pages/Admissions/AdmissionProcedure'));
const ResultAnalysis = lazy(() => import('./pages/Admissions/ResultAnalysis'));
const StudentClubs = lazy(() => import('./pages/StudentActivities/StudentClubs'));
const StudentClubDetail = lazy(() => import('./pages/StudentActivities/StudentClubDetail'));
const Differentiators = lazy(() => import('./pages/Differentiators/Differentiators'));
const DifferentiatorDetail = lazy(() => import('./pages/Differentiators/DifferentiatorDetail'));
const Placements = lazy(() => import('./pages/Placements/Placements'));
const PlacementDetail = lazy(() => import('./pages/Placements/PlacementDetail'));
const NewsAwards = lazy(() => import('./pages/NewsAwards/NewsAwards'));
const Happenings = lazy(() => import('./pages/NewsAwards/Happenings'));
const Accreditations = lazy(() => import('./pages/NewsAwards/Accreditations'));
const GalleryPage = lazy(() => import('./pages/NewsAwards/Gallery'));
const SocialMedia = lazy(() => import('./pages/NewsAwards/SocialMedia'));
const Careers = lazy(() => import('./pages/Careers/Careers'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const UGCDisclosure = lazy(() => import('./pages/Disclosures/UGCDisclosure'));
const AicteFeedback = lazy(() => import('./pages/AicteFeedback/AicteFeedback'));
const AntiRagging = lazy(() => import('./pages/AntiRagging/AntiRagging'));
const PoliciesProcedures = lazy(() => import('./pages/PoliciesProcedures/PoliciesProcedures'));
// The admin shell alone pulls in 20+ section components — keeping it out of
// the public bundle entirely is the single biggest win here, since the vast
// majority of visitors never touch /admin.
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const Launch = lazy(() => import('./pages/Launch/Launch'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Skip resetting scroll when the URL carries a hash (e.g. "/campus#library") —
    // the destination page's own useHashScroll effect owns positioning in that
    // case, and racing it here caused inconsistent/flaky landing positions.
    if (hash) return;
    smoothScrollTo(0, { immediate: true });
  }, [pathname, hash]);
  return null;
}

function PublicApp() {
  return (
    <>
      <ScrollToTop />
      {/* Full-screen intro video (once per session). Rendered on top of — but
          not gating — the rest of PublicApp, so the Header, Footer, and the
          lazy-loaded page all download and render in parallel beneath it.
          No lag, no second loading screen behind the video. */}
      <IntroVideo />
      <Header />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPageLoader />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/academics/downloads" element={<AcademicDownloads />} />
          <Route path="/academics/curriculum" element={<CurriculumMatrix />} />
          <Route path="/academics/freshman-engineering" element={<FreshmanEngineering />} />
          <Route path="/academics/schools" element={<Schools />} />
          <Route path="/academics/departments" element={<Departments />} />
          <Route path="/academics/programs" element={<Programs />} />
          <Route path="/academics/:slug" element={<ProgramDetail />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/faculty/:id" element={<FacultyProfile />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/campus-visit" element={<CampusVisit />} />
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
          <Route path="/campus/:slug" element={<CampusLifeDetail />} />
          <Route path="/information" element={<Information />} />
          <Route path="/programmes-fee-structure" element={<ProgrammesFee />} />
          <Route path="/admission-procedure" element={<AdmissionProcedure />} />
          <Route path="/result-analysis" element={<ResultAnalysis />} />
          <Route path="/vishnu-tv-academy" element={<CampusLifeDetail slug="vishnu-tv-academy" />} />
          <Route path="/student-clubs" element={<StudentClubs />} />
          <Route path="/student-clubs/:slug" element={<StudentClubDetail />} />
          <Route path="/social-services" element={<CampusLifeDetail slug="social-services" />} />
          <Route path="/campus-magazines" element={<CampusLifeDetail slug="campus-magazines" />} />
          <Route path="/arts-culture" element={<CampusLifeDetail slug="arts-culture" />} />
          <Route path="/sports-games" element={<CampusLifeDetail slug="sports-games" />} />
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
          <Route path="/news-awards/social-media-handles" element={<SocialMedia />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclosures/ugc" element={<UGCDisclosure />} />
          <Route path="/aicte-feedback-facility" element={<AicteFeedback />} />
          <Route path="/anti-ragging" element={<AntiRagging />} />
          <Route path="/policies-procedures" element={<PoliciesProcedures />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

function MaintenancePage() {
  useEffect(() => {
    document.title = "Under Maintenance | Vishnu Women's University";
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
        alt="Vishnu Women's University"
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
    <>
      {/* Applies any admin-saved color overrides (/admin → Color Theme) to
          :root before the rest of the tree paints. Harmless on /admin itself
          — Admin.css never reads these variables, it's a separate hardcoded
          design system (see CLAUDE.md). */}
      <ThemeOverrides />
      <Routes>
        {/* Admin shell is matched by react-router's own segment-aware routing
            (not a manual pathname.startsWith check, which would also match
            unrelated public routes like "/administration"). Everything under
            /admin/* renders only AdminLayout — no public Header/Footer, no
            maintenance gate. */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <AdminLayout />
            </Suspense>
          }
        />
        {/* Standalone, like /admin — no public Header/Footer, and stays
            reachable even under VITE_MAINTENANCE_MODE. */}
        <Route
          path="/launch"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Launch />
            </Suspense>
          }
        />
        <Route path="/*" element={IS_MAINTENANCE ? <MaintenancePage /> : <PublicApp />} />
      </Routes>
    </>
  );
}

function NotFound() {
  return (
    <main className="page-wrapper">
      <SEO
        title="404 - Page Not Found | Vishnu Women's University"
        description="The page you are looking for does not exist or has been moved."
        noindex={true}
      />
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
      <SmoothScroll />
      <RootRouter />
    </BrowserRouter>
  );
}
