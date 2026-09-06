import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, School, CheckCircle2 } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useHashScroll } from '../../hooks/useHashScroll';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { GovernanceItemDoc } from '../Admin/sections/GovernanceItemsAdmin';

// Fixed top-level nav structure — not admin content, mirrors the site's
// header menu. The items within each category are Firestore-backed.
const govCategories = [
  { key: 'governance' as const, label: 'Governance', icon: Landmark, desc: 'Apex statutory bodies governing the academic, financial, and strategic direction of VWU.' },
  { key: 'committees' as const, label: 'Committees', icon: School, desc: 'Standing committees ensuring quality, welfare, compliance, and transparency across all institutional functions.' },
  { key: 'iqac' as const, label: 'IQAC', icon: CheckCircle2, desc: 'Internal Quality Assurance Cell — driving continuous quality improvement and NAAC accreditation at VWU.' },
];

const defaultGovPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Governance and administration', caption: 'Institutional Governance' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Academic council meeting', caption: 'Academic Council' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Convocation ceremony', caption: 'Annual Convocation' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Events and seminars', caption: 'Seminars & Events' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Faculty collaboration', caption: 'Faculty Development' },
];

const defaultBoardOfDirectorsPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: "Chairman's Address", caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Board Meeting Hall', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Vice Chancellor Meet', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Trust Board', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Annual General Meeting', caption: '' },
];

const defaultAcademicCouncilPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: "Dean's Conference", caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Board of Studies Meeting', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Curricular Workshop', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Faculty Council', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Quality Assurance Cell', caption: '' },
];

export default function Governance() {
  useHashScroll();
  const stats = useContentBlocks('governance', 'stats');
  const { docs: govItems } = useOrderedCollection<GovernanceItemDoc>('governanceItems', 'order');
  const govPhotos = useSitePhotos('governance', 'main', defaultGovPhotos);
  const boardOfDirectorsPhotos = useSitePhotos('governance', 'board-of-directors', defaultBoardOfDirectorsPhotos);
  const hasBoardOfDirectorsPhotos = useSectionHasPhotos('governance', 'board-of-directors');
  const academicCouncilPhotos = useSitePhotos('governance', 'academic-council', defaultAcademicCouncilPhotos);
  const hasAcademicCouncilPhotos = useSectionHasPhotos('governance', 'academic-council');

  useEffect(() => {
    document.title = "Governance | Vishnu Women's University";
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
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="governance"
        defaultTitle="Governance & Statutory Bodies"
  defaultSubtitle="Transparent, accountable governance driving academic excellence — from apex statutory bodies to quality assurance committees."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Governance' }]}
      />

      {/* Stats bar */}
      <section className="about-facts-bar">
        <div className="container">
          <div className="about-facts-grid">
            {stats.map(s => (
              <div key={s.id} className="about-fact">
                <div className="about-fact-num">{s.value}</div>
                <div className="about-fact-label">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick-jump nav */}
      <div style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(27, 67, 50, 0.1)', position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height))', zIndex: 10, padding: 'var(--space-3) 0' }}>
        <div className="container" style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: '2px' }}>
          {govCategories.map(cat => (
            <a
              key={cat.key}
              href={`#${cat.key}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1.25rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                background: 'var(--color-off-white)',
                border: '1px solid rgba(27, 67, 50, 0.1)',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--color-primary)';
                el.style.color = '#ffffff';
                el.style.borderColor = 'var(--color-primary)';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--color-off-white)';
                el.style.color = 'var(--color-primary)';
                el.style.borderColor = 'rgba(27, 67, 50, 0.1)';
                el.style.transform = 'none';
              }}
            >
              <cat.icon size={15} /> {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* Category sections */}
      {govCategories.map((cat, ci) => {
        const items = govItems.filter(i => i.category === cat.key);
        return (
          <section
            key={cat.key}
            id={cat.key}
            className={`section ${ci % 2 === 0 ? 'bg-off-white' : 'bg-white'}`}
            style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 4.5rem)' }}
          >
            <div className="container">
              <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
                <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <cat.icon size={14} /> {cat.label}
                </span>
                <h2 className="section-title" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>{cat.label}</h2>
                <p style={{ color: 'var(--color-text-light)', maxWidth: 620, lineHeight: 1.75 }}>{cat.desc}</p>
              </div>

              <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 'var(--space-6)' }}>
                {items.map((item) => {
                  const Icon = resolveContentIcon(item.icon) || Landmark;
                  return (
                    <div
                      key={item.slug}
                      style={{
                        background: 'var(--color-white)',
                        border: '1px solid rgba(27, 67, 50, 0.08)',
                        borderLeft: '3.5px solid var(--color-primary)',
                        borderRadius: '18px',
                        padding: 'var(--space-6)',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all var(--transition-base)'
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'rgba(27, 67, 50, 0.15)';
                        el.style.borderLeftColor = 'var(--color-accent)';
                        el.style.boxShadow = 'var(--shadow-xl)';
                        el.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = 'rgba(27, 67, 50, 0.08)';
                        el.style.borderLeftColor = 'var(--color-primary)';
                        el.style.boxShadow = 'var(--shadow-sm)';
                        el.style.transform = 'none';
                      }}
                    >
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'var(--color-off-white)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--space-4)',
                        border: '1px solid rgba(27, 67, 50, 0.08)'
                      }}>
                        <Icon size={24} strokeWidth={1.8} />
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.35 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-5)' }}>
                        {item.desc}
                      </p>
                      <Link
                        to={`/governance/${item.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 1.1rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-off-white)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 800,
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          marginTop: 'auto',
                          border: '1px solid rgba(27, 67, 50, 0.08)',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = 'var(--color-primary)';
                          el.style.color = '#ffffff';
                          el.style.borderColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = 'var(--color-off-white)';
                          el.style.color = 'var(--color-primary)';
                          el.style.borderColor = 'rgba(27, 67, 50, 0.08)';
                        }}
                      >
                        <span>View Framework</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Institutional Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={govPhotos}
            label=""
            title="Governance in Action"
            subtitle="From council meetings to convocation, VWU's governance is built on transparency, accountability, and a commitment to excellence."
            highlights={[
              'NAAC accredited institution',
              'NBA programme accreditation',
              'UGC Autonomous status since 2014',
              'AICTE approved with NBA outcomes framework',
              'ISO-certified quality management systems',
            ]}
            columns={2}
            layout="side-text-reverse"
          />
        </div>
      </section>

      {/* Board of Directors — hidden until real photos are added */}
      {hasBoardOfDirectorsPhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={boardOfDirectorsPhotos}
              label=""
              title="Guiding VWU's Strategic Direction"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Academic Council — hidden until real photos are added */}
      {hasAcademicCouncilPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={academicCouncilPhotos}
              label=""
              title="Shaping Curriculum & Academic Quality"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section className="about-cta-banner">
        <div className="container">
          <div className="about-cta-inner">
            <h2>Learn More About VWU</h2>
            <p>Explore our history, leadership, vision, and campus ecosystem.</p>
            <div className="about-cta-buttons">
              <Link to="/about" className="btn btn-accent">About VWU</Link>
              <Link to="/vision-mission" className="btn btn-secondary">Vision & Mission</Link>
              <Link to="/about-sves" className="btn btn-secondary">About SVES</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
