import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const clubCategories = [
  {
    label: 'Technical Clubs',
    icon: '💻',
    clubs: [
      { name: 'CodeChef SVECW Chapter', desc: 'Competitive programming, coding contests, webinars, and problem-solving. Inaugurated November 17, 2020.' },
      { name: 'TECHXTREME Coding Club', desc: 'Enhances programming skills, promotes technology understanding, and prepares students for industry-level contests.' },
      { name: 'TechPost Club', desc: 'Skills-based technology platform educating students on emerging technologies and publishing student tech perspectives. Est. March 2022.' },
      { name: 'Energy Swaraj Club', desc: 'Inspired by the IIT Mumbai Climate Clock Program. 500+ students participated; received Silver Certificate from Energy Swaraj Foundation.' },
      { name: 'Amateur Astronomy Association (AAA)', desc: 'Studies stars, galaxies, and planets using a KONUSMOTOR DIGIMAX 90 telescope. Organises field trips to Birla Planetarium, Hyderabad.' },
      { name: 'Mathletes Club', desc: 'Established 2018 by the Mathematics Department. Organises maths competitions, Treasure Hunt, Roll to Win, and Math Palooza events.' },
      { name: 'IDEA Club', desc: 'Platform for innovative and creative ideas. Promotes proactive thinking and creative talent development. Est. September 2011.' },
    ],
  },
  {
    label: 'Social & Service Clubs',
    icon: '🤝',
    clubs: [
      { name: 'EAGLE Club', desc: 'Elite Anti-Narcotics Group for Law Enforcement. Combats substance abuse through education and peer support. Helpline: 1972.' },
      { name: 'Sahaya Club', desc: 'Charitable social outreach — partners with Red Cross Society Eluru for blood donation camps and redistributes food and clothing to underprivileged communities.' },
      { name: 'ECHARTS', desc: '"Every Child Has A Right To Study" — provides educational support to financially disadvantaged but gifted students. Est. 2014.' },
      { name: 'Eco Club', desc: 'Environmental protection and sustainability focused activities. Founded June 5, 2011.' },
      { name: 'Empathy Club', desc: 'Develops the ability to understand others\' situations and feelings, fostering emotional connection and perspective-taking. Founded July 2017.' },
      { name: 'Vishnu Cultural Club', desc: 'Promotes Indian culture and heritage. Organises cultural activities and helps students build a strong cultural identity.' },
      { name: 'MECOW Club', desc: 'Mega Events Celebration of the World — celebrates UN-declared international days, enriching knowledge and LSRW skills.' },
      { name: 'THE HINDU – Future India Club', desc: 'Provides free daily newspapers to all students. Develops communication skills through debates, JAM sessions, and group discussions.' },
    ],
  },
  {
    label: 'Creative & Arts Clubs',
    icon: '🎨',
    clubs: [
      { name: 'Painting Club', desc: 'Identifies and nurtures artistic talent through competitions and exhibitions. Active since July 2012.' },
      { name: 'Music Club', desc: 'Promotes Indian Classical Music with vocal training in the basics of "surs and taals," supporting students aspiring for music careers.' },
      { name: 'Dance Club', desc: 'A platform for talented dancers providing performance arts training, entertainment, and motivational creative expression.' },
      { name: 'Flash It Out Club', desc: 'Photography and short film club — covers campus events, provides photographic techniques training, and screens expert-guided films.' },
      { name: 'Page Turners', desc: 'Reading club collecting fiction and non-fiction books and organising competitive literary events for book enthusiasts.' },
      { name: 'ToastMasters Club', desc: 'Develops leadership and communication skills through regular speeches, structured feedback, and team leadership practice.' },
      { name: 'Hobby Horses – Techni Safoos', desc: 'Organises performing arts, crafts, and design activities to promote creativity and diverse campus experiences.' },
      { name: 'Rock Me Fab', desc: 'Platform for discussing social issues and showcasing diverse student talents through voluntary participation events.' },
    ],
  },
];

export default function StudentClubs() {
  useEffect(() => {
    document.title = 'Student Clubs | VWU';
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
        page="student-clubs"
        defaultImage="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
        defaultTitle="Student Clubs"
  defaultSubtitle="23 active clubs spanning technology, social service, arts, and culture — there is a place for every passion at VWU."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Student Clubs' }]}
      />

      {/* Stats */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-6) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-14)', flexWrap: 'wrap' }}>
            {[
              { num: '23', label: 'Active Clubs' },
              { num: '3', label: 'Categories' },
              { num: '500+', label: 'Club Members' },
              { num: 'Year-round', label: 'Activities' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.num}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Categories */}
      {clubCategories.map((cat, ci) => (
        <section key={cat.label} className={`section ${ci % 2 === 0 ? 'bg-off-white' : 'bg-white'}`}>
          <div className="container">
            <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <span className="section-label" style={{ position: 'static', marginBottom: 0 }}>{cat.label}</span>
              </div>
              <h2 className="section-title">{cat.label}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
              {cat.clubs.map((club, i) => (
                <div key={club.name} className="reveal" data-delay={`${i * 50}`}
                  style={{ background: ci % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', transition: 'all var(--transition-base)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)', lineHeight: 1.3 }}>{club.name}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{club.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More Student Activities</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/vishnu-tv-academy" className="btn btn-accent">Vishnu TV Academy</Link>
              <Link to="/social-services" className="btn btn-secondary">Social Services</Link>
              <Link to="/arts-culture" className="btn btn-secondary">Arts & Culture</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
