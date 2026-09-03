import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { resolveProgramIcon } from '../../lib/programIcons';
import type { ProgramDoc } from '../Admin/sections/ProgramsAdmin';
import { TABS, truncate } from './Academics';
import './Academics.css';
import '../detail-layout.css';

export default function Programs() {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const searchQuery = (searchParams.get('search') || searchParams.get('q') || '').trim().toLowerCase();
  const initialTab = TABS.some((t) => t.id === requestedTab) ? requestedTab! : 'btech';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { docs: programs, loading } = useOrderedCollection<ProgramDoc>('programs', 'order');
  
  const activePrograms = useMemo(() => {
    return programs.filter((p) => {
      if (searchQuery) {
        return (
          p.name.toLowerCase().includes(searchQuery) ||
          (p.about && p.about.toLowerCase().includes(searchQuery)) ||
          (p.category && p.category.toLowerCase().includes(searchQuery))
        );
      }
      return p.category === activeTab;
    });
  }, [programs, activeTab, searchQuery]);

  useEffect(() => {
    document.title = "Programs | Vishnu Women's University";
  }, []);

  return (
    <main className="page-wrapper">
      <PageHero
        page="academics-programs"
        defaultTitle={searchQuery ? `Search: "${searchQuery}"` : "Programs"}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Academics', to: '/academics' }, { label: 'Programs' }]}
      />

      <section className="academics-programs-section">
        <div className="container">
          <div>
            <span className="section-label">Academic Programs</span>
            <h2 className="section-title">
              {searchQuery ? `Showing results for "${searchQuery}"` : "Explore Your Options"}
            </h2>
            <p className="section-desc" style={{ marginBottom: 'var(--space-8)' }}>
              Whether you are beginning your B.Tech, advancing to M.Tech, or pursuing doctoral research — VWU offers a program matched to your goals.
            </p>
          </div>

          {!searchQuery && (
            <div className="programs-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`prog-tab${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="programs-grid">
            {activePrograms.map((program) => {
              const Icon = resolveProgramIcon(program.icon);
              return (
                <Link key={program.id} to={`/academics/${program.slug}`} className="program-card">
                  <div className="program-card-icon"><Icon size={29} strokeWidth={1.75} /></div>
                  <h3>{program.name}</h3>
                  <p>{truncate(program.about, 140)}</p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                      {program.intake} Seats
                    </span>
                    {program.accreditation && program.accreditation !== '—' && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                        {program.accreditation.split(' ').slice(0, 2).join(' ')}
                      </span>
                    )}
                  </div>
                  <div className="program-card-arrow" style={{ marginTop: 'auto' }}>
                    Learn More →
                  </div>
                </Link>
              );
            })}
            {!loading && activePrograms.length === 0 && (
              <div style={{ color: 'var(--color-text-light)', gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-8) 0' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>
                  {searchQuery ? `No programs found matching "${searchQuery}".` : 'No programs added for this category yet.'}
                </p>
                {searchQuery && (
                  <Link to="/academics/programs" className="btn btn-secondary btn-sm">
                    View All Programs
                  </Link>
                )}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/programmes-fee-structure" className="btn btn-primary">View Full Fee Structure →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
