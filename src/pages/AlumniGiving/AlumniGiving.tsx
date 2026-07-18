import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useHashScroll } from '../../hooks/useHashScroll';
import './AlumniGiving.css';
import PageHero from '../../components/PageHero/PageHero';
import { useSitePhotos } from '../../hooks/useSitePhotos';

const defaultMagazinePhoto = [
  { src: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', alt: 'VWU campus aerial view', caption: '' },
];

interface ImpactStat {
  id: string;
  icon: string;
  stat: string;
  label: string;
  desc: string;
}

interface GivingLevel {
  id: string;
  level: string;
  amount: string;
  perksText: string;
  featured: boolean;
}

interface AlumniEvent {
  id: string;
  title: string;
  date: string;
  desc: string;
}

interface AlumniStory {
  id: string;
  name: string;
  year: string;
  role: string;
  quote: string;
  imageUrl: string;
}

interface Company {
  id: string;
  name: string;
}

export default function AlumniGiving() {
  const { docs: givingImpact } = useOrderedCollection<ImpactStat>('alumniImpact', 'order');
  const { docs: givingLevels } = useOrderedCollection<GivingLevel>('givingLevels', 'order');
  const { docs: alumniStories } = useOrderedCollection<AlumniStory>('alumniStories', 'order');
  const { docs: alumniEvents } = useOrderedCollection<AlumniEvent>('alumniEvents', 'order');
  const { docs: companies } = useOrderedCollection<Company>('alumniCompanies', 'order');
  const magazinePhoto = useSitePhotos('alumni-giving', 'main', defaultMagazinePhoto)[0];

  useHashScroll();

  useEffect(() => {
    document.title = 'Alumni & Giving | Vishnu Womens University';
  }, []);

  useEffect(() => {
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
  }, [givingImpact, givingLevels, alumniStories, alumniEvents, companies]);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="alumni-giving"
        defaultImage="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80"
        defaultTitle="Always a Vishnu Engineer"
  defaultSubtitle="Graduation is not the end of your VWU story. Stay engaged, give back, and help shape the next generation of women engineers."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Alumni & Giving' }]}
      />

      {/* Impact Stats */}
      {givingImpact.length > 0 && (
        <section style={{ background: 'var(--color-primary)', padding: 'var(--space-16) 0' }}>
          <div className="container">
            <div className="ag-impact-grid">
              {givingImpact.map((item, i) => (
                <div key={item.id} className="ag-impact-card reveal" data-delay={`${i * 100}`}>
                  <div className="ag-impact-icon">{item.icon}</div>
                  <div className="ag-impact-stat">{item.stat}</div>
                  <div className="ag-impact-label">{item.label}</div>
                  <div className="ag-impact-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Giving Levels */}
      {givingLevels.length > 0 && (
        <section id="give" className="section bg-off-white">
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
              <span className="section-label">Ways to Give</span>
              <h2 className="section-title">Your Gift Makes a Difference</h2>
              <p className="section-desc" style={{ margin: '0 auto' }}>
                Every contribution, regardless of amount, goes directly toward supporting VWU students. Select the giving level that works for you.
              </p>
            </div>
            <div className="ag-giving-grid">
              {givingLevels.map((level, i) => (
                <div key={level.id} className={`ag-giving-card reveal${level.featured ? ' ag-giving-card--featured' : ''}`} data-delay={`${i * 80}`}>
                  {level.featured && <div className="ag-giving-badge">Most Prestigious</div>}
                  <h3>{level.level}</h3>
                  <div className="ag-giving-amount">{level.amount}</div>
                  <ul className="ag-giving-perks">
                    {level.perksText.split('\n').filter(Boolean).map(perk => (
                      <li key={perk}>
                        <Check size={15} strokeWidth={2.5} className="ag-perk-check" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn btn-primary" style={{ marginTop: 'auto' }}>Give Now</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Success Stories — the "Alumni & Giving → Success Stories" nav item's
          real destination (decoupled from Placements' own Success Stories
          page). Always renders, even with zero alumniStories docs yet, so
          the nav link never lands on a blank scroll target. */}
      <section id="successstories" className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-label">Alumni Success</span>
            <h2 className="section-title">Where VWU Engineers Go</h2>
          </div>
          {alumniStories.length > 0 ? (
            <div className="ag-stories-grid">
              {alumniStories.map((story, i) => (
                <div key={story.id} className="ag-story-card reveal" data-delay={`${i * 100}`}>
                  <img src={story.imageUrl} alt={story.name} className="ag-story-img" loading="lazy" />
                  <div className="ag-story-body">
                    <blockquote className="ag-story-quote">"{story.quote}"</blockquote>
                    <div className="ag-story-author">
                      <strong>{story.name}</strong>
                      <span className="ag-story-year">{story.year}</span>
                      <span className="ag-story-role">{story.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
              Alumni success stories are coming soon — check back shortly.
            </p>
          )}
        </div>
      </section>

      {/* Events */}
      {alumniEvents.length > 0 && (
        <section id="events" className="section" style={{ background: 'var(--color-primary)' }}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Events</span>
              <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Stay Connected with VWU</h2>
            </div>
            <div className="ag-events-grid">
              {alumniEvents.map((event, i) => (
                <div key={event.id} className="ag-event-card reveal" data-delay={`${i * 80}`}>
                  <div className="ag-event-date">{event.date}</div>
                  <h3>{event.title}</h3>
                  <p>{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Where Alumni Work */}
      {companies.length > 0 && (
        <section id="network" className="section bg-off-white">
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
              <span className="section-label">Our Alumni Network</span>
              <h2 className="section-title">VWU Engineers Power the World's Best Companies</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', justifyContent: 'center', marginBottom: 'var(--space-10)' }}>
              {companies.map((co, i) => (
                <span key={co.id} className="reveal" data-delay={`${i * 30}`} style={{ background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 1.2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)' }}>
                  {co.name}
                </span>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link to="/academics" className="btn btn-primary">View Placement Details</Link>
            </div>
          </div>
        </section>
      )}

      {/* Alumni Magazine */}
      <section id="magazine" className="section bg-off-white">
        <div className="container">
          <div className="ag-magazine-block reveal">
            <div>
              <span className="section-label">Publications</span>
              <h2 className="section-title">Prathibha – The VWU Campus Magazine</h2>
              <p className="section-desc" style={{ marginBottom: 'var(--space-6)' }}>
                Stay in touch with your alma mater through the latest issue of Prathibha — VWU's
                campus magazine carrying alumni profiles, research updates, and news from across campus.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary">Read Latest Issue</Link>
                <Link to="/contact" className="btn btn-outline">Update Your Info</Link>
              </div>
            </div>
            <img
              src={magazinePhoto.src}
              alt={magazinePhoto.alt}
              className="ag-magazine-img"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
