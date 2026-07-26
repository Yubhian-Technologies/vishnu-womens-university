import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { BookOpen, Video } from 'lucide-react';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { resolveContentIcon } from '../../lib/contentIcons';

const defaultStudioPhoto = [
  { src: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=900&q=80', alt: 'Students in TV studio', caption: '' },
];

export default function VishnuTV() {
  const focusAreas = useContentBlocks('vishnu-tv', 'focusAreas');
  const docTopics = useContentBlocks('vishnu-tv', 'docTopics');
  const productions = useContentBlocks('vishnu-tv', 'productions');
  const studioPhoto = useSitePhotos('vishnu-tv', 'main', defaultStudioPhoto)[0];

  useEffect(() => {
    document.title = 'Vishnu TV Academy | VWU';
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
        page="vishnu-tv"
        defaultImage="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=60&auto=format"
        defaultTitle="Vishnu TV Academy"
  defaultSubtitle="Student-run and student-driven — the only dedicated campus TV Academy in Andhra Pradesh."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Vishnu TV Academy' }]}
        scrollCtaTargetId="vishnu-tv-content"
      />

      {/* About */}
      <section id="vishnu-tv-content" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="grid-img-text">
            <div className="reveal-left">
              <span className="section-label">About</span>
              <h2 className="section-title">A First in Andhra Pradesh</h2>
              <div className="divider" />
              <p style={{ lineHeight: 1.8, marginBottom: 'var(--space-4)', color: 'var(--color-text-light)' }}>
                The <strong>Vishnu TV Academy</strong> is the only campus in Andhra Pradesh with a TV Academy
                built entirely for and by students. Growing out of the model established by
                <strong> Radio Vishnu 90.4</strong>, it operates on a clear principle — every program is made
                <em> "by the students, for the students."</em>
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
                Students at the academy take full responsibility for content — from concept through to final production — building practical skills in filmmaking, journalism, anchoring, and digital media
                while making a genuine contribution to campus life.
              </p>
            </div>
            <div className="reveal-right">
              <img
                src={studioPhoto.src}
                alt={studioPhoto.alt}
                style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">What We Cover</span>
            <h2 className="section-title">Four Pillars of Vishnu TV</h2>
          </div>
          <div className="grid-4">
            {focusAreas.map((f) => {
              const Icon = resolveContentIcon(f.icon) || BookOpen;
              return (
                <div key={f.id}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderTop: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={35} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documentary Topics + Productions */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid-2">
            <div className="reveal-left">
              <span className="section-label">Documentary Films</span>
              <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>Social Impact Stories</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
                Students produce documentary films on pressing social issues, giving engineering students a perspective on the world they will ultimately be designing for.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {docTopics.map((t) => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 900 }}>›</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right">
              <span className="section-label">Content We Produce</span>
              <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>Production Types</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
                The academy's output extends well beyond documentaries, covering the full range of academic and creative life on campus.
              </p>
              <div className="grid-2">
                {productions.map((p) => {
                  const Icon = resolveContentIcon(p.icon) || Video;
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)' }}>
                      <Icon size={22} strokeWidth={1.75} />
                      <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--color-primary)' }}>{p.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More Student Activities</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/student-clubs" className="btn btn-accent">Student Clubs</Link>
              <Link to="/arts-culture" className="btn btn-secondary">Arts & Culture</Link>
              <Link to="/sports-games" className="btn btn-secondary">Sports & Games</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
