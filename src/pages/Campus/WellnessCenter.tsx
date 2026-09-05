import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Star, Heart, Users, Lightbulb, Sprout,
  Waves, Brain, HeartHandshake, MessageCircle, Leaf,
  Target, Search, Smile, Sparkles, Quote, Lock, Sun,
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import SmoothImage from '../../components/SmoothImage/SmoothImage';

// Extracted from the counsellor's own introduction cards (provided as
// reference images) — kept as data so the copy is easy to update without
// touching the layout below.
const TRAITS: { icon: typeof Heart; label: string }[] = [
  { icon: Heart, label: 'Ethical' },
  { icon: Users, label: 'Compassionate' },
  { icon: Lightbulb, label: 'Empowering' },
  { icon: Sprout, label: 'Goal-oriented' },
];

const HELP_TOPICS: { icon: typeof Heart; label: string }[] = [
  { icon: Sprout, label: 'Anxiety & overthinking' },
  { icon: Waves, label: 'Stress & burnout' },
  { icon: Brain, label: 'Self-esteem & confidence' },
  { icon: HeartHandshake, label: 'Relationship & family concerns' },
  { icon: MessageCircle, label: 'Emotional ups & downs' },
  { icon: Leaf, label: 'Life transitions & uncertainty' },
  { icon: Target, label: 'Goal setting & motivation' },
  { icon: Search, label: 'Self-discovery & personal growth' },
  { icon: Smile, label: 'Coping with difficult emotions' },
  { icon: Sparkles, label: 'Building healthier habits & boundaries' },
];

const ABOUT_FACTS: string[] = [
  "I'm a Counselling Psychologist with a background in Forensic Psychology (yes, crime documentaries are basically homework).",
  'My comfort combo? Books and biryani. Always.',
  'You’ll probably catch me saying, “Let’s figure it out together.”',
  "I can be a total nerd about psychology, but I promise I won't make it feel like a lecture.",
  'My counselling space is a judgment-free zone; you don’t have to have the “right words” to talk to me.',
  'Whether you’re stressed, confused, overthinking, celebrating a win, or just need someone to listen, my door is always open.',
];

export default function WellnessCenter() {
  useEffect(() => {
    document.title = 'Wellness Center | VWU';
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
        title="Wellness Center | Vishnu Women's University"
        description="A judgment-free, confidential counselling space at VWU — meet our Wellness Counsellor and the everyday concerns she helps students work through."
        canonicalPath="/campus/wellness-center"
      />

      <PageHero
        page="campus-wellness-center"
        defaultTitle="Wellness Center"
        defaultSubtitle="A space where you can be yourself and talk about the things that really matter to you."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Campus Life', to: '/campus' }, { label: 'Wellness Center' }]}
        scrollCtaTargetId="wellness-content"
      />

      {/* Meet the Counsellor */}
      <section
        id="wellness-content"
        className="section bg-off-white"
        style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}
      >
        <div className="container">
          <div
            className="reveal mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: 'var(--space-10)', alignItems: 'center' }}
          >
            <div
              style={{
                aspectRatio: '4 / 5',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <SmoothImage
                src="/images/1000074551.jpg"
                alt="Devika Babu, Wellness Counsellor at Vishnu Women's University"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>

            <div>
              <span className="section-label">Meet Your Wellness Counsellor</span>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-1)' }}>Devika Babu</h2>
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.3rem' }}>
                Wellness Counsellor
              </p>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: 'var(--space-4)' }}>
                Counselling Psychologist &middot; Background in Forensic Psychology
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                  <MapPin size={16} strokeWidth={2.2} style={{ color: 'var(--color-primary)' }} /> Vishnu Women&rsquo;s University
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                  <Star size={16} strokeWidth={2.2} style={{ color: 'var(--color-accent)' }} /> 3.5+ Years of Experience
                </span>
              </div>

              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                Devika brings a warm, judgment-free approach to every conversation — whether you&rsquo;re working through
                anxiety, relationship concerns, a difficult transition, or simply need someone to listen. Her
                counselling space is built on one rule: you don&rsquo;t need the &ldquo;right words&rdquo; to talk to
                her, and her door is always open — for a stressful day, a big win, or anything in between.
              </p>

              <blockquote
                style={{
                  margin: 0,
                  marginBottom: 'var(--space-6)',
                  paddingLeft: 'var(--space-5)',
                  borderLeft: '3px solid var(--color-accent)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-lg)',
                  fontStyle: 'italic',
                  color: 'var(--color-primary)',
                  lineHeight: 1.6,
                }}
              >
                &ldquo;Creating a space where you can be yourself and talk about the things that really matter to you.&rdquo;
              </blockquote>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {TRAITS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: '0.5rem 1.1rem',
                      background: 'var(--color-white)',
                      border: '1.5px solid var(--color-light-gray)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Icon size={15} strokeWidth={2.2} style={{ color: 'var(--color-accent)' }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance banner */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-8) 0' }}>
        <div className="container">
          <p
            className="reveal"
            style={{
              textAlign: 'center',
              maxWidth: 760,
              margin: '0 auto',
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--text-xl)',
              fontStyle: 'italic',
              color: 'var(--color-white)',
              lineHeight: 1.6,
            }}
          >
            &ldquo;It&rsquo;s okay if your journey looks different from someone else&rsquo;s. Progress is more important than perfection.&rdquo;
          </p>
        </div>
      </section>

      {/* I Can Help You With */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Support Areas</span>
            <h2 className="section-title">I Can Help You With</h2>
          </div>
          <div
            className="mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}
          >
            {HELP_TOPICS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  background: 'var(--color-off-white)',
                  border: '1.5px solid var(--color-light-gray)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span
                  style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--color-primary)', color: 'var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={17} strokeWidth={2.2} />
                </span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What I Wish Every Student Knew + If Counselling Feels Scary */}
      <section className="section bg-off-white">
        <div className="container">
          <div
            className="mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'var(--space-6)' }}
          >
            <div
              className="reveal-left"
              style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)' }}
            >
              <span
                style={{
                  width: 48, height: 48, borderRadius: '50%', marginBottom: 'var(--space-4)',
                  background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Quote size={22} strokeWidth={2.2} style={{ color: 'var(--color-primary)' }} />
              </span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
                What I Wish Every Student Knew
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75, fontStyle: 'italic' }}>
                &ldquo;You don&rsquo;t have to carry every burden alone. Speaking up isn&rsquo;t a sign of weakness; it&rsquo;s the first
                step toward healing. Small conversations today can prevent bigger struggles tomorrow.&rdquo;
              </p>
            </div>

            <div
              className="reveal-right"
              style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)' }}
            >
              <span
                style={{
                  width: 48, height: 48, borderRadius: '50%', marginBottom: 'var(--space-4)',
                  background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Lock size={20} strokeWidth={2.2} style={{ color: 'var(--color-accent)' }} />
              </span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-white)', marginBottom: 'var(--space-3)' }}>
                If Coming to Counselling Feels Scary
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, fontStyle: 'italic' }}>
                &ldquo;Your feelings are valid. Your story matters. And you deserve a space where both are welcomed with care.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A Few Things About Me */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Get to Know Her</span>
            <h2 className="section-title">A Few Things About Me</h2>
            <p style={{ color: 'var(--color-text-light)' }}>A few random facts before we start:</p>
          </div>
          <div
            className="mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}
          >
            {ABOUT_FACTS.map((fact, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
                  padding: 'var(--space-5)', background: 'var(--color-off-white)',
                  border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)',
                }}
              >
                <Heart size={16} strokeWidth={2.2} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.7, margin: 0 }}>{fact}</p>
              </div>
            ))}
          </div>

          <div
            className="reveal"
            style={{
              marginTop: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
              padding: 'var(--space-5) var(--space-6)', background: 'var(--color-primary)', borderRadius: 'var(--radius-md)',
              flexWrap: 'wrap',
            }}
          >
            <Sun size={22} strokeWidth={2.2} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-white)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--color-accent)' }}>Fun fact:</strong> I can probably recommend you a psychology book, a
              comfort movie, or a biryani place depending on what kind of day you&rsquo;re having.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Reach Out Whenever You&rsquo;re Ready</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 560, margin: '0 auto var(--space-6)' }}>
              Whether you&rsquo;re stressed, overthinking, celebrating a win, or just need someone to listen — the door is always open.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-accent">Get in Touch</Link>
              <Link to="/campus" className="btn btn-secondary">Back to Campus Life</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
