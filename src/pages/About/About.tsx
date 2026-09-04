import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { Rocket, Target } from 'lucide-react';
import { resolveContentIcon } from '../../lib/contentIcons';

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const defaultCampusPhotos = [
  // Slots 0-4: "Campus Life" PhotoGrid gallery
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Smart classrooms at VWU', caption: 'Smart Classrooms' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Research laboratories', caption: 'Research Labs' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Central library', caption: 'Central Library' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Students studying', caption: 'Student Collaboration' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Sports facilities', caption: 'Sports Facilities' },
  // Slots 5-7: standalone single-image sections below
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'VWU campus Bhimavaram', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'VWU campus facilities', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Sri Vishnu Educational Society campus', caption: '' },
];

const defaultHistoryHeritagePhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Founders & Visionaries', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Historical Milestones', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Archive Photos', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'First Batch Celebration', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Legacy Buildings', caption: '' },
];

const defaultAccreditationRankPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'NAAC Certificate', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'NIRF Ranking Banner', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Outstanding Achievement Awards', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'ISO Certification', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Global Affiliations', caption: '' },
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
  /** Org-chart tier: 1 (top) to 3. Docs saved before this field existed have
   *  no value — treated as level 1 wherever this is read. */
  level?: number;
}

export const defaultExecutives: Omit<CoreExecutiveMember, 'id'>[] = [
  { name: 'Dr. G. Srinivasa Rao', role: 'Principal', order: 1, level: 1 },
  { name: 'Prof. P. Venkata Rama Raju', role: 'Vice-Principal', order: 2, level: 2 },
  { name: 'Dr. G.R.L.V.N. Srinivasa Raju', role: 'Dean – Research & Development', order: 3, level: 2 },
  { name: 'Dr. V. Purushothama Raju', role: 'Dean – Academics', order: 4, level: 2 },
  { name: 'Dr. V.V.R. Maheswara Rao', role: 'Dean – Statutory Bodies / IQAC Coordinator', order: 5, level: 2 },
  { name: 'Dr. K.S.N. Raju', role: 'Controller of Examinations', order: 6, level: 3 },
  { name: 'Mr. Md. Siddiq', role: 'Administrative Officer', order: 7, level: 3 },
  { name: 'Mr. S.S.S. Varma', role: 'Finance Manager', order: 8, level: 3 },
];

export default function About() {
  useHashScroll();

  const { docs: execDocs, loading: execLoading } = useOrderedCollection<CoreExecutiveMember>('coreExecutives', 'order');
  const executives = !execLoading && execDocs.length > 0 ? execDocs : defaultExecutives;
  const executivesByLevel = useMemo(() => {
    const groups = new Map<number, typeof executives>();
    executives.forEach((exec) => {
      const level = exec.level || 1;
      if (!groups.has(level)) groups.set(level, []);
      groups.get(level)!.push(exec);
    });
    return [...groups.entries()].sort(([a], [b]) => a - b);
  }, [executives]);
  const quickStats = useContentBlocks('about', 'quickStats');
  const campusPhotos = useSitePhotos('about', 'main', defaultCampusPhotos);
  const galleryPhotos = campusPhotos.slice(0, 5);
  const historyHeritagePhotos = useSitePhotos('about', 'history-heritage', defaultHistoryHeritagePhotos);
  const hasHistoryHeritagePhotos = useSectionHasPhotos('about', 'history-heritage');
  const accreditationRankPhotos = useSitePhotos('about', 'accreditation-rank', defaultAccreditationRankPhotos);
  const hasAccreditationRankPhotos = useSectionHasPhotos('about', 'accreditation-rank');
  const whoWeAreImg = campusPhotos[5];
  const campusSnapshotImg = campusPhotos[6];
  const parentSocietyImg = campusPhotos[7];
  const academicSnapshotStats = useContentBlocks('about', 'academicSnapshotStats');
  const diffItems = useContentBlocks('about', 'differentiators');
  const discoverCards = useContentBlocks('about', 'discoverCards');

  const differentiators = useMemo(() => {
    const groups: { cat: string; icon: string; items: { id: string; title: string }[] }[] = [];
    const byCat = new Map<string, typeof groups[number]>();
    diffItems.forEach((item) => {
      const cat = item.value || 'Other';
      let group = byCat.get(cat);
      if (!group) {
        group = { cat, icon: item.icon, items: [] };
        byCat.set(cat, group);
        groups.push(group);
      }
      group.items.push({ id: item.id, title: item.title });
    });
    return groups;
  }, [diffItems]);

  useEffect(() => {
    document.title = "About VWU | Vishnu Women's University";
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
        defaultTitle="Vishnu Women's University"
        defaultSubtitle="The First Private State University for Women in the Telugu States — Empowering Women. Inspiring Excellence. Shaping the Future."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About VWU' }]}
      />

      {/* Quick Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'var(--space-2)' }}>
              A Legacy of Excellence. A Future of Possibilities.
            </h2>
          </div>
          <div className="about-facts-bar">
            {quickStats.map(s => (
              <div key={s.id} className="about-fact">
                <div className="about-fact-value">{s.value}</div>
                <div className="about-fact-label">{s.title}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.75)', marginTop: 'var(--space-6)' }}>
            Building on decades of experience in women's education and professional learning.
          </p>
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
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-6)', color: 'var(--color-text-light)' }}>
                Vishnu Women's University (VWU), located at Vishnupur, Bhimavaram, Andhra Pradesh, is a pioneering
                institution dedicated to women's higher education. Established under the{' '}
                <strong>Andhra Pradesh Private Universities Act, 2016</strong>, VWU carries forward the rich
                educational legacy of the <strong>Sri Vishnu Educational Society</strong>, with a vision to empower
                women through excellence in education, innovation, leadership, and entrepreneurship.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link to="/vision-mission" className="btn btn-primary">Vision & Mission</Link>
                <Link to="/about-sves" className="btn btn-outline">About SVES</Link>
              </div>
            </div>
            {whoWeAreImg && (
              <div>
                <img
                  src={whoWeAreImg.src}
                  alt={whoWeAreImg.alt}
                  style={{ width: '100%', height: '460px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Where Women Learn, Lead & Transform */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto var(--space-10)' }}>
            <span className="section-label">Our Campus & Approach</span>
            <h2 className="section-title">Where Women Learn, Lead & Transform</h2>
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
              Set across an approximately 80-acre campus at Vishnupur, just 3 km from Bhimavaram on the
              Tadepalligudem Road, Vishnu Women's University offers an inspiring environment for learning,
              discovery, and personal growth.
            </p>
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
              Under the guidance of the Sri Vishnu Educational Society, VWU brings together academic excellence,
              modern infrastructure, industry engagement, innovation, and student-centric learning.
            </p>
          </div>
          <div
            className="reveal-scale"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-5)' }}
          >
            {[
              { title: 'Academic Excellence', desc: 'Future-focused programmes designed to develop strong academic foundations, professional competence, and lifelong learning.' },
              { title: 'Innovation & Research', desc: 'An ecosystem that encourages curiosity, creativity, research, problem-solving, and entrepreneurship.' },
              { title: 'Industry & Careers', desc: 'Strong industry connect and career-oriented learning that prepare students for emerging opportunities and global careers.' },
              { title: 'Holistic Development', desc: 'Beyond academics, students are encouraged to develop leadership, communication, confidence, creativity, and social responsibility.' },
              { title: 'World-Class Learning Environment', desc: 'Advanced laboratories, smart classrooms, drawing halls, seminar halls, and modern academic facilities create an engaging learning experience.' },
            ].map((pillar) => (
              <div
                key={pillar.title}
                style={{
                  background: 'var(--color-off-white)',
                  border: '1.5px solid var(--color-light-gray)',
                  borderRadius: 'var(--radius-md)',
                  borderTop: '4px solid var(--color-accent)',
                  padding: 'var(--space-6)',
                }}
              >
                <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                  {pillar.title}
                </h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A University Built for Her Ambition */}
      <section className="section bg-white">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal" style={{ maxWidth: 780, margin: '0 auto' }}>
            <span className="section-label">Our Commitment</span>
            <h2 className="section-title">A University Built for Her Ambition</h2>
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
              At Vishnu Women's University, education goes beyond classrooms. We create opportunities for young
              women to discover their potential, pursue their passions, build meaningful careers, and lead with
              confidence.
            </p>
            <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
              With a strong foundation in education and a forward-looking approach to learning, VWU is committed
              to shaping women who are ready to make a difference — in industry, research, entrepreneurship,
              society, and the world.
            </p>
            <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>
              Her Education. Her Confidence. Her Future.<br />
              Her University — Vishnu Women's University.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Snapshot */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label">Academic Excellence</span>
              <h2 className="section-title">Where Ambition Meets Opportunity.</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                Explore a diverse academic ecosystem spanning Engineering, Management &amp; Research&mdash;designed to develop knowledge, innovation, leadership, and future-ready capabilities.
              </p>
              <Link to="/academics" className="btn btn-primary">View All Programs & Departments →</Link>
            </div>
            <div className="reveal-right">
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {academicSnapshotStats.map(p => (
                  <div key={p.id} style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', borderLeft: '4px solid var(--color-accent)' }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.08em', marginBottom: 4 }}>{p.title}</div>
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
          {executivesByLevel.map(([level, members]) => (
            <div key={level} className="exec-level">
              <div className="exec-grid">
                {members.map((exec) => (
                  <div key={exec.name} className="exec-card">
                    <div className="exec-card__media">
                      {exec.photoUrl ? (
                        <SmoothImage src={exec.photoUrl} alt={exec.name} className="exec-card__photo" />
                      ) : (
                        <div className="exec-card__avatar">{getInitials(exec.name)}</div>
                      )}
                    </div>
                    <div className="exec-card__info">
                      <h3 className="exec-card__name">{exec.name}</h3>
                      <p className="exec-card__role">{exec.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
            {differentiators.map((d) => {
              const Icon = resolveContentIcon(d.icon) || Rocket;
              return (
                <div key={d.cat} className="about-diff-card">
                  <div className="about-diff-header">
                    <span className="about-diff-icon"><Icon size={29} strokeWidth={1.75} /></span>
                    <h3>{d.cat}</h3>
                  </div>
                  <ul className="about-diff-list">
                    {d.items.map(item => (
                      <li key={item.id}><span>›</span>{item.title}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Photos */}
      <section className="section bg-white">
        <div className="container">
          <PhotoGrid
            images={galleryPhotos}
            label="Campus Life"
            title="Life at Vishnu Women's University"
            subtitle={(
              <>
                <strong>More Than a Campus.<br />A Place to Become.</strong>
                <br /><br />
                A place where ideas take flight, friendships become lifelong, talent finds its stage, and every student is encouraged to dream bigger, discover more and lead with confidence.
                <br /><br />
                Explore. Experience. Excel.
              </>
            )}
            columns={2}
            layout="side-text"
          />
        </div>
      </section>

      {/* History & Heritage — hidden until real photos are added */}
      {hasHistoryHeritagePhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={historyHeritagePhotos}
              label="History & Heritage"
              title="Our Founding Story"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Accreditation & Rank — hidden until real photos are added */}
      {hasAccreditationRankPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={accreditationRankPhotos}
              label="Accreditation & Rank"
              title="Recognised for Academic Excellence"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Campus Snapshot */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            {campusSnapshotImg && (
              <div>
                <img
                  src={campusSnapshotImg.src}
                  alt={campusSnapshotImg.alt}
                  style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                />
              </div>
            )}
            <div className="reveal-right">
              <span className="section-label">Campus Life</span>
              <h2 className="section-title">
                <span style={{ display: 'block', fontSize: '0.55em', fontWeight: 600, opacity: 0.75 }}>Purpose-Built Infrastructure</span>
                Everything You Need to Learn, Live &amp; Lead.
              </h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-5)' }}>
                From advanced learning spaces and high-speed connectivity to sports, wellness, residential, dining, and spiritual facilities&mdash;VWU offers an ecosystem designed around the complete student experience.
              </p>
              <Link to="/campus" className="btn btn-primary">Explore Campus Facilities →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SVES Snapshot */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Our Parent Society</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Sri Vishnu Educational Society (SVES)</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                Founded by Padma Bhushan Dr. B. V. Raju, Sri Vishnu Educational Society (SVES) is a distinguished
                educational institution committed to excellence, innovation, and social impact.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                With <strong style={{ color: 'var(--color-accent)' }}>11 institutions</strong> across four campuses in across two Telugu States with
                <strong style={{ color: 'var(--color-accent)' }}> 25,000+ students</strong> every year, creating opportunities across education,
                technology, healthcare, and professional learning.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                Vishnu Women's University is the flagship women's institution of SVES, carrying forward its enduring
                vision of empowering women through quality education, technical excellence, research, leadership,
                and innovation.
              </p>
              <Link to="/about-sves" className="btn btn-accent">Learn About SVES →</Link>
            </div>
            {parentSocietyImg && (
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <img
                  src={parentSocietyImg.src}
                  alt={parentSocietyImg.alt}
                  style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                />
              </div>
            )}
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
          <div className="about-discover-grid card-grid">
            {discoverCards.map((item) => {
              const Icon = resolveContentIcon(item.icon) || Target;
              return (
                <Link to={item.slug || '/about'} key={item.id} className="about-discover-card">
                  <span className="about-discover-icon"><Icon size={32} strokeWidth={1.75} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className="about-discover-link">Explore →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-20) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Join the VWU Family</span>
            <h2 style={{ color: 'var(--color-white)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', marginBottom: 'var(--space-4)' }}>
              Where Ambition Finds Its Purpose
            </h2>
            <div style={{ maxWidth: 720, margin: '0 auto var(--space-8)' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                Vishnu Women's University is more than a place to study. It is a community of curious minds, bold ideas, and women shaping the future.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                Whether you are here to learn, lead, innovate, recruit exceptional talent, or build partnerships that create lasting impact, you become part of a community connected by a shared belief: when women are empowered, possibilities are limitless.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                Find your place. Discover your purpose. Shape what comes next.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 0 }}>
                Join VWU.
              </p>
            </div>
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
