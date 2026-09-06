import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Recycle, FlaskConical, Leaf, IndianRupee, CalendarDays } from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';

// Campus & sewage-load figures quoted in the DST project write-up. Kept as
// data rather than inline JSX so the stat band stays one place to edit.
const CAMPUS_STATS: { value: string; label: string }[] = [
  { value: '100', label: 'Acre Campus' },
  { value: '7', label: 'Constituent Institutes' },
  { value: '~15,000', label: 'Students' },
  { value: '~4,000', label: 'Hostel Residents' },
  { value: '~9 Lakh L', label: 'Daily Water Requirement' },
  { value: '~7 Lakh L', label: 'Daily Sewage Generated' },
];

const PROJECT_FACTS: { icon: typeof Droplets; label: string; value: string }[] = [
  { icon: Recycle, label: 'Plants Commissioned', value: '2 Sewage Treatment Plants' },
  { icon: Droplets, label: 'Capacity (each)', value: '200 KLD' },
  { icon: IndianRupee, label: 'DST Grant Sanctioned', value: 'Rs. 59.866 Lakhs' },
  { icon: IndianRupee, label: 'Total Project Cost', value: 'Rs. 170.536 Lakhs' },
  { icon: CalendarDays, label: 'Sanctioned With Effect From', value: '28 / 11 / 2014 — for 2 years' },
  { icon: FlaskConical, label: 'Treatment Technology', value: 'Improved Moving Bed Bio-film Reactor (MBBR)' },
];

export default function SewageTreatment() {
  useEffect(() => {
    document.title = 'Sewage Treatment Plants | VWU';
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
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="Sewage Treatment Plants — Zero Discharge Campus | Vishnu Women's University"
        description="Two DST-funded 200 KLD sewage treatment plants using MBBR technology make the VWU campus a zero-discharge campus, with treated effluent reused for campus and highway greenery."
        canonicalPath="/campus/sewage-treatment-plants"
      />

      <PageHero
        page="campus-sewage-treatment-plants"
        defaultTitle="Sewage Treatment Plants"
        defaultSubtitle="A zero-discharge campus — every drop of sewage generated is treated on site and returned to the land as irrigation for campus and highway greenery."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Campus Life', to: '/campus' }, { label: 'Sewage Treatment Plants' }]}
        scrollCtaTargetId="sewage-content"
      />

      {/* Campus scale & daily load */}
      <section
        id="sewage-content"
        style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0', scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-10)', flexWrap: 'wrap' }}>
            {CAMPUS_STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-accent)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why — water as a resource */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ maxWidth: 860 }}>
            <span className="section-label">Our Commitment</span>
            <h2 className="section-title">Water is a Precious Natural Resource</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: 'var(--space-4)' }}>
              Water is a precious natural resource gifted by God to mankind, and one of the five powerful elements of
              life creation. A resource this precious needs careful consumption. Knowing this, the University has
              incorporated <strong>sustainable environmental protection into its Vision Statement</strong>, and the
              management consistently encourages natural-resource-conservative practices across the campus.
            </p>
            <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
              The campus extends across a serene <strong>100 acres</strong>, three kilometres from the outskirts of
              Bhimavaram town. It houses <strong>7 constituent institutes</strong> with a total strength of about{' '}
              <strong>15,000 students</strong>, of whom around <strong>4,000 stay in the hostels</strong>. Meeting the
              daily needs of a campus this size requires roughly <strong>9 lakh litres of water per day</strong> — and
              the sewage generated is correspondingly high, estimated at about{' '}
              <strong>7 lakh litres per day</strong>, all of which would ultimately reach a natural drain.
            </p>
          </div>
        </div>
      </section>

      {/* The DST-funded project */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)', maxWidth: 860 }}>
            <span className="section-label">The Project</span>
            <h2 className="section-title">DST-Funded Treatment Plants</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
              To provide an eco-friendly environment and ensure <strong>zero discharge into the drain</strong>, the
              University — with extended help from the management — applied to the{' '}
              <strong>Department of Science &amp; Technology (DST), New Delhi</strong> to construct a sewage treatment
              plant for the sewage generated on campus. On a kind perusal of the proposal, DST sanctioned the project,
              and sewage collected from the various zones of activity across the campus is now channelled through a
              network of drainages into the treatment plants.
            </p>
          </div>

          <div
            className="mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}
          >
            {PROJECT_FACTS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  gap: 'var(--space-4)',
                  alignItems: 'flex-start',
                  background: 'var(--color-off-white)',
                  border: '1.5px solid var(--color-light-gray)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-5)',
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} strokeWidth={2.2} />
                </span>
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--color-text-light)',
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginTop: 4, lineHeight: 1.4 }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ maxWidth: 860 }}>
            <span className="section-label">Methodology</span>
            <h2 className="section-title">MBBR Technology with Probiotics</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)', marginBottom: 'var(--space-4)' }}>
              Treatment is carried out using an <strong>Improved Moving Bed Bio-film Reactor (MBBR)</strong>. The
              methodology includes the use of <strong>probiotics along with MBBR technology</strong> for the treatment
              of waste water.
            </p>
            <p style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
              Samples are collected periodically <strong>before and after treatment</strong> and analysed for various
              important physio-chemical parameters, with results compared against the standard data prescribed by the{' '}
              <strong>Bureau of Indian Standards</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)', maxWidth: 860 }}>
            <span className="section-label">Impact</span>
            <h2 className="section-title">Treated Water, Put Back to Work</h2>
          </div>

          <div
            className="mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}
          >
            <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderLeft: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
              <Leaf size={22} strokeWidth={2.2} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }} />
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                Campus Greenery
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.7 }}>
                The treated sewage (effluent) is used for gardening purposes across the campus, saving a substantial
                quantity of fresh water demand and supporting greenery development within the campus.
              </p>
            </div>

            <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderLeft: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
              <Recycle size={22} strokeWidth={2.2} style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }} />
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                2.5 KM of Adopted Highway
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.7 }}>
                Sri Vishnu Educational Society has long been invested in societal problems. In that spirit, the Society
                has adopted the maintenance of nearly <strong>2.5 km of the proposed National Highway road</strong>{' '}
                passing in front of the campus — with treated water consumed in the road-partition greenery and other
                adopted sites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Explore More of Campus Life</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/campus" className="btn btn-accent">Back to Campus Life</Link>
              <Link to="/campus/other-facilities" className="btn btn-secondary">Other Facilities</Link>
              <Link to="/differentiators" className="btn btn-secondary">Differentiators</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
