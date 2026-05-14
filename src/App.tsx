import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Academics from './pages/Academics/Academics';
import Admissions from './pages/Admissions/Admissions';
import StudentLife from './pages/StudentLife/StudentLife';
import AlumniGiving from './pages/AlumniGiving/AlumniGiving';
import About from './pages/About/About';
import News from './pages/News/News';
import Events from './pages/Events/Events';
import VisionMission from './pages/VisionMission/VisionMission';
import Governance from './pages/Governance/Governance';
import AboutSVES from './pages/AboutSVES/AboutSVES';
import Campus from './pages/Campus/Campus';
import Information from './pages/Information/Information';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/student-life" element={<StudentLife />} />
        <Route path="/alumni-giving" element={<AlumniGiving />} />
        <Route path="/about" element={<About />} />
        <Route path="/vision-mission" element={<VisionMission />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/about-sves" element={<AboutSVES />} />
        <Route path="/campus" element={<Campus />} />
        <Route path="/information" element={<Information />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
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
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🎓</div>
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
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
