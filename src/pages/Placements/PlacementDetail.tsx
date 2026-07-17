import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Trophy, BarChart3 } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { resolveContentIcon } from '../../lib/contentIcons';
import { parseStructuredTable } from '../../lib/structuredTable';
import type { PlacementItemDoc } from '../Admin/sections/PlacementItemsAdmin';
import '../detail-layout.css';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80';

const PARTNER_DOMAINS: Record<string, string> = {
  'Amazon': 'amazon.com', 'Adobe': 'adobe.com', 'Microsoft': 'microsoft.com',
  'Google': 'google.com', 'Flipkart': 'flipkart.com', 'PayPal': 'paypal.com',
  'Palo Alto Networks': 'paloaltonetworks.com', 'VISA': 'visa.com', 'D.E. Shaw': 'deshaw.com',
  'Walmart': 'walmart.com', 'NXP': 'nxp.com', 'Expedia': 'expedia.com',
  'Myntra': 'myntra.com', 'Optum': 'optum.com', 'IBM': 'ibm.com',
  'Providence': 'providence.org', 'Publicis Sapient': 'publicissapient.com', 'State Street': 'statestreet.com',
  'Athena Health': 'athenahealth.com', 'TCS': 'tcs.com', 'Infosys': 'infosys.com',
  'Capgemini': 'capgemini.com', 'Accenture': 'accenture.com', 'HCL': 'hcltech.com',
  'Cognizant': 'cognizant.com', 'Mahindra & Mahindra': 'mahindra.com', 'Hyundai Motors': 'hyundai.com',
  'TVS Motors': 'tvsmotor.com', 'Hero MotoCorp': 'heromotocorp.com', 'Renault Nissan': 'renault.com',
  'Daimler Truck': 'daimlertruck.com', 'Caterpillar': 'caterpillar.com', 'Robert Bosch': 'bosch.com',
  'DBS Bank': 'dbs.com', 'EPAM': 'epam.com', 'Zenoti': 'zenoti.com',
  'Persistent Systems': 'persistent.com', 'Intuit': 'intuit.com', 'OpenText': 'opentext.com',
  'F5 Networks': 'f5.com', 'Cloudera': 'cloudera.com', 'Verizon': 'verizon.com',
};

function PartnerLogo({ name }: { name: string }) {
  const domain = PARTNER_DOMAINS[name];
  const [failed, setFailed] = useState(!domain);

  return (
    <div className="partner-logo-card">
      {failed ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 28, width: 28, flexShrink: 0, fontSize: 'var(--text-xs)', fontWeight: 700, background: 'var(--color-off-white)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
          {name.charAt(0)}
        </span>
      ) : (
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
          alt={name}
          className="partner-logo-img"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <span className="partner-logo-name">{name}</span>
    </div>
  );
}

export default function PlacementDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  const item = allItems.find((i) => i.slug === slug) ?? null;
  const { slides: heroSlides } = usePageBanners('placement-detail');
  const heroImage = heroSlides[0]?.imageUrl || DEFAULT_HERO_IMAGE;

  // No scroll-reveal here — this page's content only renders once the
  // Firestore-backed `item` has loaded (see the gotcha documented in CLAUDE.md).
  useEffect(() => {
    if (item) document.title = `${item.title} | Vishnu Womens University`;
  }, [item]);

  if (!item) {
    if (loading) return null;
    return <Navigate to="/placements" replace />;
  }

  const Icon = resolveContentIcon(item.icon) || BarChart3;
  const tableSections = parseStructuredTable(item.tableText);
  const tableRows = tableSections.flatMap((s) => s.rows);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 360 }}>
        <img
          src={heroImage}
          alt={item.title}
          className="page-hero-image"
        />
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/placements" className="breadcrumb-item">Placements</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Icon size={16} /> Placements & Careers
          </div>
          <h1 className="animate-fade-in-up">{item.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white">
        <div className="container">
          <div className={item.highlights && item.highlights.length > 0 ? 'detail-grid' : ''}>
            {/* Main */}
            <div>
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {item.title}</h2>
              {item.intro ? (
                <>
                  <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                    {item.intro}
                  </p>
                  {item.about && (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}>
                      {item.about}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              )}
            </div>

            {/* Sidebar: highlights */}
            {item.highlights && item.highlights.length > 0 && (
              <div className="detail-sidebar">
                <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'sticky', top: '110px' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                    Key Highlights
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {item.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      {item.outcomes && item.outcomes.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Impact</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {item.outcomes.map((o) => (
                <div key={o}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <Trophy size={20} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Table Data */}
      {tableRows.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Data</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                {item.slug === 'tpo-team' ? 'Team Roster' : item.slug === 'industry-liaison-offices' ? 'Regional Offices' : 'Batch-wise Statistics'}
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Name</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Role</th>
                    {tableRows.some((r) => r.notes) && (
                      <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, whiteSpace: 'nowrap' }}>Notes</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'var(--color-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.name}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.role}</td>
                      {tableRows.some((r) => r.notes) && (
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{row.notes}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Partners Grid */}
      {item.partners && item.partners.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Network</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Recruiting Partners</h2>
            </div>
            <div className="partner-logo-grid">
              {item.partners.map((p, i) => (
                <PartnerLogo key={i} name={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Explore More Placement Resources
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/placements" className="btn btn-accent">Back to Placements</Link>
              <Link to="/admissions" className="btn btn-secondary">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
