import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';
import './AboutSVES.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import type { SvesCampusDoc } from '../Admin/sections/SvesCampusesAdmin';

const defaultSvesPhotos = [
  // Slots 0-4: "Our Campuses" PhotoGrid gallery
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Green Meadows campus Bhimavaram', caption: 'Green Meadows — Bhimavaram' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'University buildings', caption: 'Academic Blocks' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Students at campus event', caption: 'Student Events' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Graduation ceremony', caption: 'Convocation' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Academic conference', caption: 'Conferences & Seminars' },
  // Slot 5: standalone SVES intro section image below
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'SVES campus', caption: '' },
];

const defaultSvesHeritagePhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Society Central Office', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Sister Institutions', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Founder Chairman Vision', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Joint Campus Events', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Community Development Outreach', caption: '' },
];

export default function AboutSVES() {
  const svesStats = useContentBlocks('about-sves', 'stats');
  const milestones = useContentBlocks('about-sves', 'milestones');
  const { docs: campuses } = useOrderedCollection<SvesCampusDoc>('svesCampuses', 'order');
  const svesMainPhotos = useSitePhotos('about-sves', 'main', defaultSvesPhotos);
  const svesPhotos = svesMainPhotos.slice(0, 5);
  const svesIntroImg = svesMainPhotos[5];
  const svesHeritagePhotos = useSitePhotos('about-sves', 'sves-heritage', defaultSvesHeritagePhotos);
  const hasSvesHeritagePhotos = useSectionHasPhotos('about-sves', 'sves-heritage');

  useEffect(() => {
    document.title = 'About SVES | VWU';
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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="about-sves"
        defaultTitle="Sri Vishnu Educational Society"
        defaultSubtitle="A Legacy of Educational Excellence Since 1992 — Comprising over 25,000 students and 1,400+ faculty across Andhra Pradesh and Telangana."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'About SVES' }]}
      />

      {/* Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <div className="sves-stats-bar">
            {svesStats.map(s => (
              <div key={s.id} className="sves-stat">
                <div className="sves-stat-value">{s.value}</div>
                <div className="sves-stat-label">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About SVES */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="grid-img-text">
            <div className="reveal-left">
              <span className="section-label">ABOUT SVES</span>
              <h2 className="section-title">Sri Vishnu Educational Society</h2>
              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                A Legacy of Educational Excellence Since 1992
              </p>
              <div className="divider" />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Founded in 1992 by the late <strong>Dr. B. V. Raju</strong>, an eminent industrialist, philanthropist, and recipient of the <strong>Padma Shri and Padma Bhushan</strong>, the Sri Vishnu Educational Society (SVES) is a not-for-profit, self-funded educational organization committed to advancing quality higher education.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Over the decades, SVES has built a strong presence across Engineering, Dentistry, Pharmacy, Commerce &amp; Sciences, Management, and Polytechnic education, providing diverse opportunities for students to learn, innovate, and build meaningful careers.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                Today, the SVES group of institutions comprises more than <strong>25,000 students</strong> and over <strong>1,400 faculty members</strong>. Its institutions offer a wide range of undergraduate and postgraduate programmes across campuses in Andhra Pradesh and Telangana, with a strong reputation for academic excellence and student development.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-5)', color: 'var(--color-text-light)' }}>
                SVES has also been a pioneer in women’s engineering education, with two exclusive women’s engineering institutions recognized among the leading institutions in the region.
              </p>
              <a href="https://www.srivishnu.edu.in/" target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                Know More <ExternalLink size={15} strokeWidth={2.4} style={{ marginLeft: '0.4rem' }} />
              </a>
            </div>
            {svesIntroImg && (
              <div>
                <img
                  src={svesIntroImg.src}
                  alt={svesIntroImg.alt}
                  style={{ width: '100%', height: '480px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Legacy Rooted in Vision & Built on Purpose */}
      <section className="section bg-white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
            <div className="reveal-left" style={{ background: 'var(--color-off-white)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-light-gray)' }}>
              <span className="section-label">Legacy Rooted in Vision</span>
              <h3 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)' }}>Inspiring Generations Since 1992</h3>
              <div className="divider" style={{ margin: '0 0 var(--space-4) 0' }} />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                The story of SVES began with the vision of <strong>Late Dr. B. V. Raju</strong>, a pioneer of the Indian cement industry and a passionate advocate of education as a force for social transformation.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                Driven by his belief that quality education should reach aspiring learners beyond major cities, he established institutions that brought opportunities for excellence to students in smaller towns and emerging communities. His vision continues to guide SVES in creating educational environments that nurture knowledge, character, confidence, and leadership.
              </p>
            </div>

            <div className="reveal-right" style={{ background: 'var(--color-off-white)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-light-gray)' }}>
              <span className="section-label">Leadership &amp; Culture</span>
              <h3 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)' }}>Built on Purpose. Driven by Passion.</h3>
              <div className="divider" style={{ margin: '0 0 var(--space-4) 0' }} />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                The vision of the Founder Chairman, <strong>Late Dr. B. V. Raju</strong>, continues to inspire the leadership of <strong>Sri K. V. Vishnu Raju</strong>, Chairman and grandson of the Founder Chairman.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                Together, this enduring legacy has shaped a culture of purpose, innovation, excellence, and student-centered learning. SVES remains committed to creating transformative educational experiences that empower students to realize their potential and contribute meaningfully to society across Andhra Pradesh and Telangana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campuses */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">SVES Campuses</span>
            <h2 className="section-title">Four Distinct Campuses</h2>
          </div>
          <div className="sves-campuses-grid">
            {campuses.map((campus) => (
              <div key={campus.id} className="sves-campus-card">
                <div className="sves-campus-header">
                  <h3>{campus.name}</h3>
                  <span className="sves-campus-location" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> {campus.location}</span>
                </div>
                <ul className="sves-campus-list">
                  {(campus.institutions || []).map(inst => (
                    <li key={inst}>
                      <span>›</span>
                      <span>{inst}</span>
                    </li>
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
            images={svesPhotos}
            label="Our Campuses"
            title="SVES Institutions in Pictures"
            subtitle="Glimpses from the campuses, events, and milestones of the Sri Vishnu Educational Society."
            highlights={[
              '11 institutions across Andhra Pradesh & Telangana',
              '4 campuses — Bhimavaram, Narsapur, Hyderabad, Medak',
              '25,000+ students & 1,400+ faculty',
              '30+ years of educational leadership',
              'Engineering, Pharmacy, Dental, School & beyond',
            ]}
            columns={2}
            layout="side-text-reverse"
          />
        </div>
      </section>

      {/* SVES Campuses & Heritage — hidden until real photos are added */}
      {hasSvesHeritagePhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={svesHeritagePhotos}
              label="SVES Campuses & Heritage"
              title="The Legacy of Sri Vishnu Educational Society"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Milestones */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label" style={{ color: 'var(--color-accent)' }}>Journey</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>25+ Years of SVES Excellence</h2>
          </div>
          <div className="sves-milestones">
            {milestones.map((m) => (
              <div key={m.id} className="sves-milestone">
                <div className="sves-milestone-year">{m.title}</div>
                <div className="sves-milestone-dot" />
                <div className="sves-milestone-text">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-6)' }}>Explore More</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-accent">About VWU</Link>
              <Link to="/vision-mission" className="btn btn-secondary">Vision & Mission</Link>
              <Link to="/governance" className="btn btn-secondary">Governance</Link>
              <Link to="/apply-now" className="btn btn-secondary">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
