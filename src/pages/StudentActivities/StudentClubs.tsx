import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';

const clubCategories = [
  {
    label: 'Technical Clubs',
    icon: '💻',
    clubs: [
      { name: 'CodeChef SVECW Chapter', desc: 'Runs competitive programming contests, coding challenges, webinars, and structured problem-solving sessions. Inaugurated November 17, 2020.' },
      { name: 'TECHXTREME Coding Club', desc: 'Develops programming skills, deepens technology understanding, and grooms students for industry-level competitions.' },
      { name: 'TechPost Club', desc: 'A skills-focused technology forum that introduces students to emerging technologies and publishes student-authored technical perspectives. Est. March 2022.' },
      { name: 'Energy Swaraj Club', desc: 'Inspired by the IIT Mumbai Climate Clock Program. Over 500 students have participated; the club received a Silver Certificate from the Energy Swaraj Foundation.' },
      { name: 'Amateur Astronomy Association (AAA)', desc: 'Explores stars, galaxies, and planets using a KONUSMOTOR DIGIMAX 90 telescope. Conducts field trips to Birla Planetarium, Hyderabad.' },
      { name: 'Mathletes Club', desc: 'Founded in 2018 by the Mathematics Department. Hosts maths competitions, Treasure Hunt, Roll to Win, and the Math Palooza event.' },
      { name: 'IDEA Club', desc: 'A platform for nurturing innovative and creative thinking. Promotes initiative and talent development in students. Est. September 2011.' },
    ],
  },
  {
    label: 'Social & Service Clubs',
    icon: '🤝',
    clubs: [
      { name: 'EAGLE Club', desc: 'Elite Anti-Narcotics Group for Law Enforcement. Counters substance abuse through student education and peer support. Helpline: 1972.' },
      { name: 'Sahaya Club', desc: 'Social outreach club — collaborates with Red Cross Society Eluru on blood donation camps and supports underprivileged communities with food and clothing.' },
      { name: 'ECHARTS', desc: '"Every Child Has A Right To Study" — delivers educational assistance to financially disadvantaged yet gifted students. Est. 2014.' },
      { name: 'Eco Club', desc: 'Promotes environmental responsibility and sustainability through campus activities. Founded June 5, 2011.' },
      { name: 'Empathy Club', desc: 'Cultivates the capacity to understand the experiences and feelings of others, building emotional intelligence and perspective. Founded July 2017.' },
      { name: 'Vishnu Cultural Club', desc: 'Celebrates Indian culture and heritage through organised activities, helping students build a strong cultural identity and sense of belonging.' },
      { name: 'MECOW Club', desc: 'Mega Events Celebration of the World — observes UN-recognised international days, expanding students\' knowledge and developing LSRW skills.' },
      { name: 'THE HINDU – Future India Club', desc: 'Distributes free daily newspapers to all students. Builds communication through debates, JAM sessions, and group discussions.' },
    ],
  },
  {
    label: 'Creative & Arts Clubs',
    icon: '🎨',
    clubs: [
      { name: 'Painting Club', desc: 'Discovers and nurtures artistic talent through competitions and exhibitions on campus. Active since July 2012.' },
      { name: 'Music Club', desc: 'Promotes Indian Classical Music with vocal training in the fundamentals of "surs and taals," supporting students who aspire to a career in music.' },
      { name: 'Dance Club', desc: 'A performance arts platform offering training, creative expression, and a stage for talented dancers on campus.' },
      { name: 'Flash It Out Club', desc: 'Photography and short film club that documents campus events, teaches photographic techniques, and screens expert-curated films.' },
      { name: 'Page Turners', desc: 'A reading club that builds a shared library of fiction and non-fiction titles and runs literary events for book enthusiasts.' },
      { name: 'ToastMasters Club', desc: 'Builds leadership and communication through structured speeches, constructive feedback sessions, and practical leadership exercises.' },
      { name: 'Hobby Horses – Techni Safoos', desc: 'Brings together performing arts, crafts, and design to foster creativity and offer varied cultural experiences on campus.' },
      { name: 'Rock Me Fab', desc: 'A voluntary platform for discussing social issues and showcasing the range of student talents through open events.' },
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
  defaultSubtitle="23 active clubs across technology, social service, arts, and culture — VWU has a community for every interest."
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
            <div className="grid-4">
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
