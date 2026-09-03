import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
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
  defaultSubtitle="More than 25 years of educational commitment, spanning 11 institutions across Andhra Pradesh and Telangana."
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

      {/* About */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="grid-img-text">
            <div className="reveal-left">
              <span className="section-label">Our Parent Society</span>
              <h2 className="section-title">About Sri Vishnu Educational Society</h2>
              <div className="divider" />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                The <strong>Sri Vishnu Educational Society (SVES)</strong> has earned a distinguished reputation through
                its sustained commitment to building institutions of genuine educational quality. It was established by the late
                <strong> Padma Bhushan Dr. B. V. Raju</strong>, a visionary leader who created a network of educational
                institutions with a clear focus on technical and professional learning.
              </p>
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                After Dr. Raju's passing, his grandson <strong>Sri K. V. Vishnu Raju</strong> took over as Chairman
                and has since carried the mission forward while also championing social welfare activities. Through the
                <strong> Dr. B. V. Raju Foundation</strong>, the society runs leprosy care centres, schools, women's
                associations, community halls, and veterinary services in surrounding villages — entirely independently of government funding.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                SVES currently operates <strong>11 institutions</strong> across <strong>4 campuses</strong> — Green Meadows
                (Bhimavaram), Orchard Park (Narsapur), Valley Vista (Hyderabad), and Lake View (Medak) — collectively
                educating over <strong> 50,000 students</strong> annually across engineering, pharmacy, dental, polytechnic, and school streams.
              </p>
            </div>
            {svesIntroImg && (
              <div>
                <img
                  src={svesIntroImg.src}
                  alt={svesIntroImg.alt}
                  style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Campuses */}
      <section className="section bg-white">
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
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={svesPhotos}
            label="Our Campuses"
            title="SVES Institutions in Pictures"
            subtitle="Glimpses from the campuses, events, and milestones of the Sri Vishnu Educational Society."
            highlights={[
              '11 institutions across Andhra Pradesh & Telangana',
              '4 campuses — Bhimavaram, Narsapur, Hyderabad, Medak',
              '50,000+ students educated annually',
              '25+ years of educational leadership',
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
              <Link to="/admissions" className="btn btn-secondary">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
