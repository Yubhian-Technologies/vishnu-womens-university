import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StudentLife.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import { Radio, GraduationCap, Target, Check } from 'lucide-react';

const defaultStudentLifePhotos = [
  // Slots 0-4: "Campus Moments" PhotoGrid gallery
  { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Cultural events', caption: 'Cultural Events' },
  { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports activities', caption: 'Sports & Fitness' },
  { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Campus festivals', caption: 'Campus Festivals' },
  { src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', alt: 'Student clubs and workshops', caption: 'Club Activities' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Study groups and projects', caption: 'Teamwork' },
  // Slots 5-7: standalone single-image sections below
  { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80', alt: "Women's hostel at VWU", caption: '' },
  { src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'VWU sports and athletics', caption: '' },
  { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80', alt: 'Campus dining hall', caption: '' },
];

const defaultSportsRecreationPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Basketball Court', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Track & Field Events', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Gymnasium', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Indoor Games Area', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Annual Sports Meet', caption: '' },
];

const defaultClubsFestivalsPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Cultural Fest Stage', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Technical Club Activities', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Art & Drama Club', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Flash Mob / Dance', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Music & Band Performance', caption: '' },
];

export default function StudentLife() {
  const clubs = useContentBlocks('student-life', 'clubs');
  const housing = useContentBlocks('student-life', 'housing');
  const services = useContentBlocks('student-life', 'services');
  const athletics = useContentBlocks('student-life', 'athletics');
  const diningFeatures = useContentBlocks('student-life', 'diningFeatures');
  const studentLifeMainPhotos = useSitePhotos('student-life', 'main', defaultStudentLifePhotos);
  const studentLifePhotos = studentLifeMainPhotos.slice(0, 5);
  const hostelImg = studentLifeMainPhotos[5];
  const athleticsImg = studentLifeMainPhotos[6];
  const diningImg = studentLifeMainPhotos[7];
  const sportsRecreationPhotos = useSitePhotos('student-life', 'sports-recreation', defaultSportsRecreationPhotos);
  const hasSportsRecreationPhotos = useSectionHasPhotos('student-life', 'sports-recreation');
  const clubsFestivalsPhotos = useSitePhotos('student-life', 'clubs-festivals', defaultClubsFestivalsPhotos);
  const hasClubsFestivalsPhotos = useSectionHasPhotos('student-life', 'clubs-festivals');

  useEffect(() => {
    document.title = 'Student Life | Vishnu Womens University';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => el.classList.add('revealed'), parseInt(delay));
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
        page="student-life"
        defaultImage="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1920&q=60&auto=format"
        defaultTitle="Discover Your Place at VWU"
  defaultSubtitle="VWU offers more than an engineering qualification. It is where you find your community, sharpen your purpose, and start building your future."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Student Life' }]}
        scrollCtaTargetId="student-life-content"
      />

      {/* Quote Banner */}
      <section id="student-life-content" style={{ background: 'var(--color-accent)', padding: 'var(--space-6) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
            "VWU is a place where excellence and genuine support go hand in hand. If you are serious about becoming a skilled, confident engineer, this is where you belong." — Divya, ECE Graduate
          </p>
        </div>
      </section>

      {/* Clubs & Orgs */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Get Involved</span>
            <h2 className="section-title">Student Organizations & Clubs</h2>
            <p className="section-desc">
              With 30+ student clubs and organisations, VWU has a community for every interest.
              If nothing fits, start your own.
            </p>
          </div>
          <div className="sl-clubs-grid">
            {clubs.map((club) => {
              const Icon = resolveContentIcon(club.icon) || Radio;
              const cardInner = (
                <>
                  <div className="sl-club-icon"><Icon size={40} strokeWidth={1.75} /></div>
                  <h3>{club.title}</h3>
                  <span>{club.value}</span>
                </>
              );
              // "slug" is repurposed here as a click-through link — an
              // external https:// URL (e.g. Radio Vishnu's own site) or an
              // internal /path (e.g. the dedicated Campus Magazines page for
              // Prathibha). No link set just stays a plain, unlinked card.
              if (club.slug?.startsWith('http')) {
                return (
                  <a key={club.id} href={club.slug} target="_blank" rel="noopener noreferrer" className="sl-club-card sl-club-card--link">
                    {cardInner}
                  </a>
                );
              }
              if (club.slug) {
                return (
                  <Link key={club.id} to={club.slug} className="sl-club-card sl-club-card--link">
                    {cardInner}
                  </Link>
                );
              }
              return (
                <div key={club.id} className="sl-club-card">
                  {cardInner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Housing */}
      <section className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px' }}>
        <div className="reveal-left" style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={hostelImg.src}
            alt={hostelImg.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '380px' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,28,84,0.25)' }} />
        </div>
        <div className="reveal-right" style={{ background: 'var(--color-primary)', padding: 'var(--space-12) var(--space-10)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Campus Hostels</span>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-6)' }}>Your Home Away from Home</h2>
          <div className="sl-housing-list">
            {housing.map(h => (
              <div key={h.id} className="sl-housing-item">
                <div className="sl-housing-name">{h.title}</div>
                <div className="sl-housing-type">{h.value}</div>
                <div className="sl-housing-desc">{h.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/student-life" className="btn btn-accent" style={{ alignSelf: 'flex-start', marginTop: 'var(--space-6)' }}>
            Explore Housing Options
          </Link>
        </div>
      </section>

      {/* Athletics */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="sl-athletics-header reveal">
            <div>
              <span className="section-label">VWU Sports</span>
              <h2 className="section-title">Sports & Games at VWU</h2>
              <p className="section-desc">
                VWU actively promotes physical development through diverse sports facilities,
                inter-college competitions, and participation in state-level tournaments.
              </p>
            </div>
            <img
              src={athleticsImg.src}
              alt={athleticsImg.alt}
              className="sl-athletics-image reveal-scale"
            />
          </div>
          <div className="sl-sports-grid">
            {athletics.map((s) => {
              const Icon = resolveContentIcon(s.icon) || Target;
              return (
                <Link key={s.id} to="/news-awards/gallery?category=Sports#photo-gallery" className="sl-sport-card sl-sport-card--link">
                  <span className="sl-sport-icon"><Icon size={32} strokeWidth={1.75} /></span>
                  <div className="sl-sport-name">{s.title}</div>
                  <span className="sl-sport-season">{s.value}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Services */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">Support</span>
            <h2 className="section-title">We're Here for You</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              From orientation to graduation, VWU's student services team is with you at every stage.
            </p>
          </div>
          <div className="sl-services-grid">
            {services.map((s) => {
              const Icon = resolveContentIcon(s.icon) || GraduationCap;
              return (
                <div key={s.id} className="sl-service-card">
                  <div className="sl-service-icon"><Icon size={40} strokeWidth={1.75} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  {s.slug?.startsWith('http') ? (
                    <a href={s.slug} target="_blank" rel="noopener noreferrer" className="sl-service-link">
                      Learn More →
                    </a>
                  ) : s.slug ? (
                    <Link to={s.slug} className="sl-service-link">
                      Learn More →
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dining */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)', padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div className="sl-dining-grid">
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Campus Dining</span>
              <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Fresh, Nourishing, and Convenient</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-lg)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                VWU's campus food courts serve hygienic, freshly prepared vegetarian and
                non-vegetarian meals daily. Dedicated mess facilities are provided for hostel residents.
              </p>
              <div className="sl-dining-features">
                {diningFeatures.map(f => (
                  <div key={f.id} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <Check size={15} strokeWidth={2.5} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    {f.title}
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img
                src={diningImg.src}
                alt={diningImg.alt}
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Student Life Photos */}
      <section className="section bg-white">
        <div className="container">
          <PhotoGrid
            images={studentLifePhotos}
            label="Campus Moments"
            title="Life Beyond the Classroom"
            subtitle="From cultural fests and sports tournaments to club activities and quiet campus walks — VWU student life is vibrant and full."
            highlights={[
              'Annual Technova — national-level symposium',
              '20+ student clubs across arts, tech & service',
              'NSS, NCC & social service programs',
              'Inter-collegiate sports & cultural competitions',
              'Vishnu TV Academy & Radio Vishnu 90.4 FM',
            ]}
            columns={2}
            layout="side-text-reverse"
          />
        </div>
      </section>

      {/* Sports & Recreation — hidden until real photos are added */}
      {hasSportsRecreationPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={sportsRecreationPhotos}
              label="Sports & Recreation"
              title="Stay Active, Stay Balanced"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Clubs & Festivals — hidden until real photos are added */}
      {hasClubsFestivalsPhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={clubsFestivalsPhotos}
              label="Clubs & Festivals"
              title="Celebrate, Create, Connect"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section bg-off-white">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <span className="section-label">Take the Next Step</span>
            <h2 className="section-title">Ready to Join VWU?</h2>
            <p className="section-desc" style={{ margin: '0 auto var(--space-8)' }}>
              Visit the campus and see what student life at VWU actually looks like — firsthand.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/admissions" className="btn btn-primary btn-lg">Plan My Visit Now</Link>
              <Link to="/admissions" className="btn btn-outline btn-lg">Apply for Free</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
