import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import {
  Rocket, Handshake, Microscope, Globe2, Landmark, BookOpen, Target, Leaf, School, Info,
} from 'lucide-react';

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const campusPhotos = [
  { src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms at VWU', caption: 'Smart Classrooms' },
  { src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research laboratories', caption: 'Research Labs' },
  { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Central library', caption: 'Central Library' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Students studying', caption: 'Student Collaboration' },
  { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports facilities', caption: 'Sports Facilities' },
];

const differentiators = [
  { cat: 'Innovation & Entrepreneurship', icon: Rocket, items: ['Vishnu Technology Business Incubator (TBI)', 'Vishnu Space Application Center (VSAC)', 'Science Technology & Innovation Hub (STI Hub)', 'AICTE IDEA Lab', 'Chips to Startup (C2S)', 'Institution Innovation Cell'] },
  { cat: 'Industry Partnerships', icon: Handshake, items: ['NASSCOM Embedded Systems Training', 'HCL Tech VLSI Training', 'Microchip Embedded System', 'TI-DSP Centre of Excellence', 'TalentSprint @ NSE (WISE)', 'Smart Interviews – C&DS Programme'] },
  { cat: 'Specialised Labs', icon: Microscope, items: ['AR / VR Studio', 'High Performance Computing Lab', 'Vehicle Design Lab', 'Assistive Technology Lab (ATL)', 'Concrete Canoe Laboratory', 'Dream House Construction Lab'] },
  { cat: 'International & Global', icon: Globe2, items: ['Vishnu Japan Outreach Centre (VJOC)', 'Graduate Study Abroad Center (GSAC)', 'Foreign Languages Programme', 'TEDxSVECW', 'Rural Women Technology Park', 'Vishnu School of Music'] },
];

// Firestore-backed — see src/pages/Admin/sections/CoreExecutivesAdmin.tsx.
// defaultExecutives is shown until an admin adds real docs to the
// `coreExecutives` collection (same fallback pattern as GoverningBody.tsx).
export interface CoreExecutiveMember {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  order: number;
}

export const defaultExecutives: Omit<CoreExecutiveMember, 'id'>[] = [
  { name: 'Dr. G. Srinivasa Rao', role: 'Principal', order: 1 },
  { name: 'Prof. P. Venkata Rama Raju', role: 'Vice-Principal', order: 2 },
  { name: 'Dr. G.R.L.V.N. Srinivasa Raju', role: 'Dean – Research & Development', order: 3 },
  { name: 'Dr. V. Purushothama Raju', role: 'Dean – Academics', order: 4 },
  { name: 'Dr. V.V.R. Maheswara Rao', role: 'Dean – Statutory Bodies / IQAC Coordinator', order: 5 },
  { name: 'Dr. K.S.N. Raju', role: 'Controller of Examinations', order: 6 },
  { name: 'Mr. Md. Siddiq', role: 'Administrative Officer', order: 7 },
  { name: 'Mr. S.S.S. Varma', role: 'Finance Manager', order: 8 },
];

export default function About() {
  useHashScroll();

  const { docs: execDocs, loading: execLoading } = useOrderedCollection<CoreExecutiveMember>('coreExecutives', 'order');
  const executives = !execLoading && execDocs.length > 0 ? execDocs : defaultExecutives;
  const quickStats = useContentBlocks('about', 'quickStats');

  useEffect(() => {
    document.title = 'About VWU | Vishnu Womens University';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="about"
        defaultImage="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
        defaultTitle="About Vishnu Womens University"
  defaultSubtitle="Rooted in Bhimavaram since 2001, VWU has grown into Andhra Pradesh's foremost institution for women's technical education."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About VWU' }]}
      />

      {/* Quick Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="about-facts-bar">
            {quickStats.map(s => (
              <div key={s.id} className="about-fact">
                <div className="about-fact-value">{s.value}</div>
                <div className="about-fact-label">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="about-mission-grid">
            <div className="reveal-left">
              <span className="section-label">Who We Are</span>
              <h2 className="section-title">First Private State University for Women in Telugu States</h2>
              <div className="divider" />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Vishnu Womens University is set in Vishnupur, 3 km from Bhimavaram along Tadepalligudem Road
                in Coastal Andhra Pradesh. The campus stretches across approximately <strong> 100 acres</strong>,
                offering an environment well-suited to focused, high-quality learning.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Operating under the <strong>Sri Vishnu Educational Society</strong> and affiliated to JNTUK,
                VWU carries UGC Autonomous status, NBA Accreditation, AICTE approval, and NAAC recognition.
                Its infrastructure includes fully equipped laboratories, smart classrooms, drawing halls, and seminar rooms.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-6)', color: 'var(--color-text-light)' }}>
                Having graduated <strong>13,100+ engineers</strong> and achieved <strong>1,400+ annual placements</strong>,
                VWU stands as the leading destination for women's engineering education in the Telugu-speaking states.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link to="/vision-mission" className="btn btn-primary">Vision & Mission</Link>
                <Link to="/about-sves" className="btn btn-outline">About SVES</Link>
              </div>
            </div>
            <div className="reveal-right">
              <img
                src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=900&q=80"
                alt="VWU campus Bhimavaram"
                style={{ width: '100%', height: '460px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Academic Snapshot */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label">Academic Excellence</span>
              <h2 className="section-title">Programs Across Engineering, Management & Research</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                VWU delivers 9 B.Tech specialisations, 4 M.Tech programs, MBA, and Ph.D. across 9 departments —
                all affiliated to JNTUK and shaped by the curricular freedom that comes with full UGC Autonomous status.
              </p>
              <Link to="/academics" className="btn btn-primary">View All Programs & Departments →</Link>
            </div>
            <div className="reveal-right">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[
                  { label: 'B.Tech', value: '9 Specialisations' },
                  { label: 'M.Tech', value: '4 Programs' },
                  { label: 'MBA', value: '1 Program · 60 Seats' },
                  { label: 'Ph.D.', value: 'CSE · ECE · EEE' },
                ].map(p => (
                  <div key={p.label} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', borderLeft: '4px solid var(--color-accent)' }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', fontSize: 'var(--text-base)' }}>{p.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Executive Body */}
      <section id="core-executive" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Leadership</span>
            <h2 className="section-title">Core Executive Body</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              The senior leadership team responsible for guiding VWU's academic direction and institutional development.
            </p>
          </div>
          <div className="exec-grid">
            {executives.map((exec, i) => (
              <div key={exec.name} className="exec-card reveal" data-delay={`${i * 50}`}>
                {exec.photoUrl ? (
                  <SmoothImage src={exec.photoUrl} alt={exec.name} className="exec-card__photo" />
                ) : (
                  <div className="exec-card__avatar">{getInitials(exec.name)}</div>
                )}
                <h3 className="exec-card__name">{exec.name}</h3>
                <p className="exec-card__role">{exec.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators — unique content, not duplicated anywhere */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">What Sets Us Apart</span>
            <h2 className="section-title">30+ Differentiating Initiatives</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              VWU extends well beyond conventional engineering education through programs in innovation,
              industry engagement, international exposure, and community-driven initiatives.
            </p>
          </div>
          <div className="about-diff-grid">
            {differentiators.map((d, i) => (
              <div key={d.cat} className="about-diff-card reveal" data-delay={`${i * 80}`}>
                <div className="about-diff-header">
                  <span className="about-diff-icon"><d.icon size={29} strokeWidth={1.75} /></span>
                  <h3>{d.cat}</h3>
                </div>
                <ul className="about-diff-list">
                  {d.items.map(item => (
                    <li key={item}><span>›</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Photos */}
      <section className="section bg-white">
        <div className="container">
          <PhotoGrid
            images={campusPhotos}
            label="Campus Life"
            title="Life at Vishnu Womens University"
            subtitle="A glimpse of the people, spaces, and moments that make VWU a distinctive place to learn and grow."
            highlights={[
              '100-acre green campus in Bhimavaram',
              '200+ smart classrooms & 50+ research labs',
              'Olympic-standard sports & fitness facilities',
              'Secure on-campus hostels with 1 Gbps Wi-Fi',
              '1,400+ placements recorded in 2024–25',
            ]}
            columns={2}
            layout="side-text"
          />
        </div>
      </section>

      {/* Campus Snapshot */}
      <section className="section bg-off-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <img
                src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=900&q=80"
                alt="VWU campus facilities"
                style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                loading="lazy"
              />
            </div>
            <div className="reveal-right">
              <span className="section-label">Campus Life</span>
              <h2 className="section-title">Purpose-Built Infrastructure</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>
                A 100-acre campus housing 200+ smart classrooms, 50+ laboratories, an Olympic-standard swimming pool,
                a fitness centre, 1 Gbps campus Wi-Fi, hostels, food courts, a health centre, and on-campus temples.
              </p>
              <Link to="/campus" className="btn btn-primary">Explore Campus Facilities →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SVES Snapshot */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Our Parent Society</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Sri Vishnu Educational Society (SVES)</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                Established by Padma Bhushan Dr. B. V. Raju, SVES runs <strong style={{ color: 'var(--color-accent)' }}>11 institutions</strong> across
                4 campuses in Bhimavaram, Narsapur, Hyderabad, and Medak — reaching more than
                <strong style={{ color: 'var(--color-accent)' }}> 50,000 students</strong> each year.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                VWU is the principal women's institution within this distinguished society, reflecting its founding
                commitment to advancing women through rigorous technical education.
              </p>
              <Link to="/about-sves" className="btn btn-accent">Learn About SVES →</Link>
            </div>
            <div className="reveal-right" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=80"
                alt="Sri Vishnu Educational Society campus"
                style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Discover Sub-pages */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Discover More</span>
            <h2 className="section-title">Explore VWU in Detail</h2>
          </div>
          <div className="about-discover-grid">
            {[
              { title: 'Vision, Mission & Values', desc: 'Our guiding purpose, mission statements, and core institutional values.', path: '/vision-mission', icon: Target },
              { title: 'Governance & Leadership', desc: 'Governing body, core executive, committees, and development plan.', path: '/governance', icon: Landmark },
              { title: 'About Society (SVES)', desc: 'The Sri Vishnu Educational Society — our founding parent organization.', path: '/about-sves', icon: Leaf },
              { title: 'Campus Life', desc: 'Smart classrooms, labs, hostels, fitness, swimming pool, and more.', path: '/campus', icon: School },
              { title: 'Academics', desc: 'All B.Tech, M.Tech, MBA and Ph.D. programs with departments.', path: '/academics', icon: BookOpen },
              { title: 'Information', desc: 'Academic calendar, holidays, how to reach, ICT platforms, and more.', path: '/information', icon: Info },
            ].map((item, i) => (
              <Link to={item.path} key={item.title} className="about-discover-card reveal" data-delay={`${i * 60}`}>
                <span className="about-discover-icon"><item.icon size={32} strokeWidth={1.75} /></span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="about-discover-link">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Join the VWU Family</span>
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: 'var(--space-4)' }}>
              Be Part of the VWU Story
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', maxWidth: 560, margin: '0 auto var(--space-8)' }}>
              Whether you are a prospective student, an employer, or a community partner — VWU has a place for you.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-accent btn-lg">Apply Now</Link>
              <Link to="/campus" className="btn btn-secondary btn-lg">Visit Campus</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
