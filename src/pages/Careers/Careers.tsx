import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { GraduationCap } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSiteContact } from '../../hooks/useSiteContact';
import { resolveContentIcon } from '../../lib/contentIcons';
import type { JobOpeningDoc } from '../Admin/sections/JobOpeningsAdmin';
import { renderBold } from '../../lib/boldText';

export default function Careers() {
  const { phone, email } = useSiteContact();
  const { docs: openings } = useOrderedCollection<JobOpeningDoc>('jobOpenings', 'order');
  const perks = useContentBlocks('careers', 'perks');

  useEffect(() => {
    document.title = "Careers | Vishnu Women's University";
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
      <PageHero
        page="careers"
        defaultTitle="Careers at VWU"
        defaultSubtitle="Build your career alongside a community of educators and professionals who are genuinely invested in advancing women in engineering and technology."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
        scrollCtaTargetId="careers-content"
      />

      <section id="careers-content" className="section bg-off-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 className="section-title">Why Work With Us</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              VWU is a place where faculty and staff grow alongside students — in a focused, research-oriented academic environment.
            </p>
          </div>
          <div className="grid-3">
            {perks.map((p) => {
              const Icon = resolveContentIcon(p.icon) || GraduationCap;
              return (
                <div key={p.id}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', borderLeft: '4px solid var(--color-accent)' }}>
                  <div style={{ marginBottom: 'var(--space-3)' }}><Icon size={32} strokeWidth={1.75} /></div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{renderBold(p.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-10)' }}>
            <h2 className="section-title">Current Openings</h2>
            <p className="section-desc">
              {openings.length ? 'Select a position to view its details and apply.' : 'Applications are currently closed. Please check back soon.'}
            </p>
          </div>
          {/* Rendered from Firestore, so no scroll-reveal animation here
              (see the gotcha documented in CLAUDE.md). */}
          <div className="grid-3">
            {openings.map((o) => (
              <Link key={o.id} to={`/careers/${o.id}`}
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minHeight: 48, background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', borderTop: '4px solid var(--color-accent)', boxShadow: 'var(--shadow-sm)', textDecoration: 'none' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{o.type}</span>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-primary)' }}>{o.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>{o.department}</p>
                {o.qualification && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{o.qualification}</p>}
                <span style={{ marginTop: 'auto', paddingTop: 'var(--space-3)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View &amp; Apply →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Reach Out to HR</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 480, margin: '0 auto var(--space-6)', lineHeight: 1.7 }}>
              For questions about available roles, eligibility requirements, or the selection process, write to us at <strong style={{ color: 'var(--color-accent)' }}>{email}</strong> or call <strong style={{ color: 'var(--color-accent)' }}>{phone}</strong>.
            </p>
            <Link to="/contact" className="btn btn-accent btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
