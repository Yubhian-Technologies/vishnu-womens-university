import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import type { ComponentType } from 'react';
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

// A failed dynamic import() is almost always a stale chunk after a new deploy:
// the previous build's hashed filenames 404, and React surfaces that inside
// <Suspense> as a blank white page that only a manual refresh clears. Here we
// do that refresh automatically — one hard reload pulls a fresh index.html
// with current hashes. The sessionStorage guard stops a reload loop if the
// import keeps failing for some other reason (then the error propagates).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  const KEY = 'chunk-reload';
  return lazy(async () => {
    try {
      const mod = await factory();
      try { sessionStorage.removeItem(KEY); } catch { /* private mode */ }
      return mod;
    } catch (err) {
      let retried = true;
      try {
        retried = sessionStorage.getItem(KEY) === '1';
        if (!retried) sessionStorage.setItem(KEY, '1');
      } catch { retried = true; }
      if (!retried) {
        window.location.reload();
        return new Promise<{ default: T }>(() => {}); // hold until the reload
      }
      throw err;
    }
  });
}

const Academics = lazyWithRetry(() => import('./pages/Academics/Academics'));
const ProgramDetail = lazyWithRetry(() => import('./pages/Academics/ProgramDetail'));
const FreshmanEngineering = lazyWithRetry(() => import('./pages/Academics/FreshmanEngineering'));
const Faculty = lazyWithRetry(() => import('./pages/Academics/Faculty'));
const FacultyProfile = lazyWithRetry(() => import('./pages/Academics/FacultyProfile'));
const AcademicDownloads = lazyWithRetry(() => import('./pages/Academics/Downloads'));
const CurriculumMatrix = lazyWithRetry(() => import('./pages/Academics/CurriculumMatrix'));
const Schools = lazyWithRetry(() => import('./pages/Academics/Schools'));
const Departments = lazyWithRetry(() => import('./pages/Academics/Departments'));
const Programs = lazyWithRetry(() => import('./pages/Academics/Programs'));
const Admissions = lazyWithRetry(() => import('./pages/Admissions/Admissions'));
const CampusVisit = lazyWithRetry(() => import('./pages/CampusVisit/CampusVisit'));
const StudentLife = lazyWithRetry(() => import('./pages/StudentLife/StudentLife'));
const AlumniGiving = lazyWithRetry(() => import('./pages/AlumniGiving/AlumniGiving'));
const About = lazyWithRetry(() => import('./pages/About/About'));
const News = lazyWithRetry(() => import('./pages/News/News'));
const Events = lazyWithRetry(() => import('./pages/Events/Events'));
const VisionMission = lazyWithRetry(() => import('./pages/VisionMission/VisionMission'));
const Governance = lazyWithRetry(() => import('./pages/Governance/Governance'));
const GovernanceDetail = lazyWithRetry(() => import('./pages/Governance/GovernanceDetail'));
const GoverningBody = lazyWithRetry(() => import('./pages/Governance/GoverningBody'));
const Research = lazyWithRetry(() => import('./pages/Research/Research'));
const ResearchDetail = lazyWithRetry(() => import('./pages/Research/ResearchDetail'));
const ProfessionalBodyDetail = lazyWithRetry(() => import('./pages/Research/ProfessionalBodyDetail'));
const MousGroupDetail = lazyWithRetry(() => import('./pages/Research/MousGroupDetail'));
const AboutSVES = lazyWithRetry(() => import('./pages/AboutSVES/AboutSVES'));
const Campus = lazyWithRetry(() => import('./pages/Campus/Campus'));
const CampusLifeDetail = lazyWithRetry(() => import('./pages/CampusLife/CampusLifeDetail'));
const Information = lazyWithRetry(() => import('./pages/Information/Information'));
const ProgrammesFee = lazyWithRetry(() => import('./pages/Admissions/ProgrammesFee'));
const AdmissionProcedure = lazyWithRetry(() => import('./pages/Admissions/AdmissionProcedure'));
const ResultAnalysis = lazyWithRetry(() => import('./pages/Admissions/ResultAnalysis'));
const StudentClubs = lazyWithRetry(() => import('./pages/StudentActivities/StudentClubs'));
const StudentClubDetail = lazyWithRetry(() => import('./pages/StudentActivities/StudentClubDetail'));
const Differentiators = lazyWithRetry(() => import('./pages/Differentiators/Differentiators'));
const DifferentiatorDetail = lazyWithRetry(() => import('./pages/Differentiators/DifferentiatorDetail'));
const Placements = lazyWithRetry(() => import('./pages/Placements/Placements'));
const PlacementDetail = lazyWithRetry(() => import('./pages/Placements/PlacementDetail'));
const NewsAwards = lazyWithRetry(() => import('./pages/NewsAwards/NewsAwards'));
const Happenings = lazyWithRetry(() => import('./pages/NewsAwards/Happenings'));
const Accreditations = lazyWithRetry(() => import('./pages/NewsAwards/Accreditations'));
const GalleryPage = lazyWithRetry(() => import('./pages/NewsAwards/Gallery'));
const SocialMedia = lazyWithRetry(() => import('./pages/NewsAwards/SocialMedia'));
const Careers = lazyWithRetry(() => import('./pages/Careers/Careers'));
const Contact = lazyWithRetry(() => import('./pages/Contact/Contact'));
const UGCDisclosure = lazyWithRetry(() => import('./pages/Disclosures/UGCDisclosure'));
const AicteFeedback = lazyWithRetry(() => import('./pages/AicteFeedback/AicteFeedback'));
const AntiRagging = lazyWithRetry(() => import('./pages/AntiRagging/AntiRagging'));
const PoliciesProcedures = lazyWithRetry(() => import('./pages/PoliciesProcedures/PoliciesProcedures'));
// The admin shell alone pulls in 20+ section components — keeping it out of
// the public bundle entirely is the single biggest win here, since the vast
// majority of visitors never touch /admin.
const AdminLayout = lazyWithRetry(() => import('./pages/Admin/AdminLayout'));
const Launch = lazyWithRetry(() => import('./pages/Launch/Launch'));

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
          <Route path="/research/professional-bodies/:key" element={<ProfessionalBodyDetail />} />
          <Route path="/research/mous/:group" element={<MousGroupDetail />} />
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
