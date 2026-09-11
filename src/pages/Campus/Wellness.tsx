import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Leaf, UsersRound, Play, Heart, Quote } from 'lucide-react';
// Our Services / Support Areas icons are Phosphor Duotone specifically
// (not Lucide, which is outline-only) — kept to just these two sections per
// request; the rest of the page still uses the site's usual Lucide set.
import {
  ChatCircleDotsIcon, UsersIcon, LeafIcon, TrendUpIcon, CalendarIcon, PhoneIcon,
  BrainIcon, HandHeartIcon, GraduationCapIcon, StarIcon, PlantIcon, UsersThreeIcon,
  SparkleIcon, QuestionIcon,
} from '@phosphor-icons/react';
import SEO from '../../components/SEO/SEO';
// Reused for the shared .btn-hero-gold / .btn-hero-outline classes this
// page's bespoke hero styles itself with (see Wellness.css) — same
// side-effect import Clubs.tsx uses for the same reason.
import '../../components/PageHero/PageHero.css';
import { usePageBanners } from '../../hooks/usePageBanners';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { resolveContentIcon } from '../../lib/contentIcons';
import { smoothScrollTo } from '../../lib/smoothScroll';
import './Wellness.css';

// This is a separate page from WellnessCenter.tsx (/campus/wellness-center)
// — that page and its content/admin wiring are untouched. This one reuses
// the counsellor's name/photo/bio/quote as its own defaults (see
// DEFAULT_COUNSELLOR_* below) but is otherwise an independent page with its
// own route, hero banner slot ("campus-wellness"), and Content Blocks
// sections ("wellness" :: counsellor / impactStats).
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=1600&q=80';
const IMPACT_BG_IMAGE = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80';

const DEFAULT_COUNSELLOR_NAME = 'Devika Babu';
const DEFAULT_COUNSELLOR_ROLE = 'Student Counsellor | M.Sc. Psychology';
const DEFAULT_COUNSELLOR_PHOTO = '/images/1000074551.jpg';
// Carried over verbatim from the Wellness Center page's counsellor bio.
const DEFAULT_COUNSELLOR_BIO = 'Devika brings a warm, judgment-free approach to every conversation — whether you’re working through anxiety, relationship concerns, a difficult transition, or simply need someone to listen. Her counselling space is built on one rule: you don’t need the "right words" to talk to her, and her door is always open — for a stressful day, a big win, or anything in between.';
const DEFAULT_COUNSELLOR_QUOTE = 'Creating a space where you can be yourself and talk about the things that really matter to you.';

// Pastel icon-tile colours cycled across the Services/Support cards and the
// hero stats bar — same small hand-picked palette convention Clubs.tsx's
// WHY_JOIN_TILE_COLORS uses, kept local to this page since it's purely
// decorative and specific to this layout.
const PASTEL = [
  { bg: '#FDECEA', fg: '#D97757' }, // coral
  { bg: '#E7EFFD', fg: '#3B6FE0' }, // blue
  { bg: '#E7F7EC', fg: '#2E9E5B' }, // green
  { bg: '#FDF4DA', fg: '#C9973A' }, // gold
  { bg: '#F3E8FD', fg: '#8B5CF6' }, // purple
];

const HERO_STATS = [
  { icon: Shield, title: 'Safe Space', sub: 'Always supportive', color: PASTEL[1] },
  { icon: UsersRound, title: 'Qualified Professionals', sub: 'Experts who care', color: PASTEL[1] },
  { icon: Lock, title: 'Confidential & Secure', sub: 'Your privacy matters', color: PASTEL[3] },
  { icon: Leaf, title: 'For Every Student', sub: 'Because you matter', color: PASTEL[2] },
];

// Same pastel backgrounds as PASTEL, but with a richer/darker icon colour
// (rather than PASTEL's softer fg) to match the reference design's bolder
// icon treatment for this section specifically.
const SERVICE_PASTEL = [
  { bg: '#FDECEA', fg: '#7A2116' }, // coral bg, deep red icon
  { bg: '#E7EFFD', fg: '#15316E' }, // blue bg, deep blue icon
  { bg: '#E7F7EC', fg: '#0F4D28' }, // green bg, deep green icon
  { bg: '#FDF4DA', fg: '#6E4608' }, // gold bg, deep amber icon
  { bg: '#F3E8FD', fg: '#43168A' }, // purple bg, deep purple icon
];

const SERVICES = [
  { icon: ChatCircleDotsIcon, title: 'Individual Counselling', desc: 'One-on-one support for your unique concerns.', color: SERVICE_PASTEL[0] },
  { icon: UsersIcon, title: 'Group Sessions', desc: 'Connect, share and grow together.', color: SERVICE_PASTEL[1] },
  { icon: LeafIcon, title: 'Stress & Anxiety Support', desc: 'Tools and guidance to navigate challenges.', color: SERVICE_PASTEL[2] },
  { icon: TrendUpIcon, title: 'Personal Growth', desc: 'Build confidence and a happier you.', color: SERVICE_PASTEL[3] },
  { icon: CalendarIcon, title: 'Workshops & Events', desc: 'Learn, engage and take charge of your well-being.', color: SERVICE_PASTEL[4] },
  { icon: PhoneIcon, title: 'Crisis Support', desc: 'Immediate assistance when you need it.', color: SERVICE_PASTEL[0] },
];

// Uses SERVICE_PASTEL (not PASTEL) for the same darker icon treatment as
// Our Services — PASTEL stays untouched since the hero stats bar still
// reads from it.
const SUPPORT_AREAS = [
  { icon: BrainIcon, title: 'Anxiety & Stress', desc: 'Find calm and coping tools', color: SERVICE_PASTEL[0] },
  { icon: HandHeartIcon, title: 'Relationships', desc: 'Navigate connections', color: SERVICE_PASTEL[1] },
  { icon: GraduationCapIcon, title: 'Academic Pressure', desc: 'Manage expectations', color: SERVICE_PASTEL[3] },
  { icon: StarIcon, title: 'Self-Esteem', desc: 'Build confidence', color: SERVICE_PASTEL[4] },
  { icon: PlantIcon, title: 'Life Transitions', desc: 'Adjust to change', color: SERVICE_PASTEL[2] },
  { icon: UsersThreeIcon, title: 'Social Challenges', desc: 'Feel more connected', color: SERVICE_PASTEL[0] },
  { icon: SparkleIcon, title: 'Mood & Wellbeing', desc: 'Find balance', color: SERVICE_PASTEL[1] },
  { icon: QuestionIcon, title: 'Other Concerns', desc: "We're here for you", color: SERVICE_PASTEL[3] },
];

const DEFAULT_IMPACT_STATS = [
  { id: 'd1', value: '500+', title: 'Students Supported', icon: '' },
  { id: 'd2', value: '50+', title: 'Workshops & Sessions', icon: '' },
  { id: 'd3', value: '90%', title: 'Positive Feedback', icon: '' },
  { id: 'd4', value: '100%', title: 'You Matter', icon: 'Heart' },
];

export default function Wellness() {
  const { slides: heroSlides } = usePageBanners('campus-wellness');
  const counsellor = useContentBlocks('wellness', 'counsellor')[0];
  const liveImpactStats = useContentBlocks('wellness', 'impactStats');
  const impactStats = liveImpactStats.length > 0 ? liveImpactStats : DEFAULT_IMPACT_STATS;

  const heroImage = heroSlides[0]?.imageUrl || DEFAULT_HERO_IMAGE;
  const counsellorName = counsellor?.title || DEFAULT_COUNSELLOR_NAME;
  const counsellorRole = counsellor?.value || DEFAULT_COUNSELLOR_ROLE;
  const counsellorBio = counsellor?.desc || DEFAULT_COUNSELLOR_BIO;
  const counsellorQuote = counsellor?.icon || DEFAULT_COUNSELLOR_QUOTE;
  const counsellorPhoto = counsellor?.slug || DEFAULT_COUNSELLOR_PHOTO;

  useEffect(() => {
    document.title = 'Wellness | VWU';
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="Wellness | Vishnu Women's University"
        description="A healthier, happier you — safe, confidential counselling and well-being support for every VWU student."
        canonicalPath="/campus/wellness"
      />

      {/* Hero — bespoke design (badge + 3-line accent headline + body + 2
          buttons), same pattern as Clubs.tsx's hero. Only the background
          image is admin-editable (Hero Banners -> Campus Life: Wellness) —
          copy stays fixed, per the requested design. */}
      <section className="wellness-hero-section">
        <div className="wellness-hero-card">
          <img src={heroImage} alt="" className="wellness-hero-bg-img" />
          <div className="wellness-hero-overlay" />
          <div className="wellness-hero-content">
            <div className="wellness-hero-badge-row">
              <span className="wellness-hero-badge-dash" />
              <span className="wellness-hero-badge-text">A Healthier, Happier You</span>
            </div>
            <h1 className="wellness-hero-title">
              <span>Your</span>
              <span className="wellness-hero-title--accent">Wellbeing</span>
              <span>Matters</span>
            </h1>
            <p className="wellness-hero-body">
              At WellCentre, we provide a safe, supportive and judgement-free space for you to pause, talk and grow.
              You&rsquo;re not alone &mdash; we&rsquo;re here for you.
            </p>
            <div className="wellness-hero-actions">
              <Link to="/contact" className="btn-hero-gold">Book a Session</Link>
              <button type="button" className="btn-hero-outline" onClick={() => smoothScrollTo('#wellness-counsellor')}>
                <Play size={14} fill="currentColor" /> Watch Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating stats bar */}
      <div className="wellness-stats-float-wrap">
        <div className="wellness-stats-float">
          {HERO_STATS.map((s) => (
            <div key={s.title} className="wellness-stat-item">
              <span className="wellness-stat-icon" style={{ background: s.color.bg, color: s.color.fg }}>
                <s.icon size={20} strokeWidth={2} />
              </span>
              <div>
                <div className="wellness-stat-title">{s.title}</div>
                <div className="wellness-stat-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Services */}
      <section className="section bg-white">
        <div className="container">
          <div className="wellness-section-header">
            <div>
              <span className="wellness-services-badge">Our Services</span>
              <h2 className="wellness-services-heading">
                We&rsquo;re Here For Every Part of Your <span className="wellness-heading-accent">Journey</span>
              </h2>
            </div>
            <p>
              From managing stress to finding clarity, our services are designed to support your emotional, mental
              and personal well-being.
            </p>
          </div>
          <div className="grid-3 mobile-stack-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="wellness-card" style={{ background: s.color.bg }}>
                <span className="wellness-card-icon wellness-card-icon--lg wellness-card-icon--duotone" style={{ background: 'rgba(255,255,255,0.6)', color: s.color.fg }}>
                  <s.icon size={34} weight="duotone" />
                </span>
                <h3 className="wellness-card-title">{s.title}</h3>
                <p className="wellness-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Counsellor */}
      <section
        id="wellness-counsellor"
        className="wellness-counsellor-section"
        style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}
      >
        <div className="wellness-counsellor-blobs" aria-hidden="true">
          <span className="wellness-blob wellness-blob--1" />
          <span className="wellness-blob wellness-blob--2" />
          <span className="wellness-blob wellness-blob--3" />
          <span className="wellness-blob wellness-blob--4" />
          <span className="wellness-blob wellness-blob--5" />
          <span className="wellness-blob wellness-blob--6" />
        </div>
        <div className="container">
          <div className="wellness-counsellor-grid">
            <div>
              <h2 className="wellness-counsellor-heading">Meet Our Counsellor</h2>
              <h3 className="wellness-counsellor-name">{counsellorName}</h3>
              <p className="wellness-counsellor-role">{counsellorRole}</p>
              <p className="wellness-counsellor-bio">{counsellorBio}</p>
              <blockquote className="wellness-counsellor-quote">
                &ldquo;{counsellorQuote}&rdquo;
                <cite>&mdash; {counsellorName}</cite>
              </blockquote>
            </div>
            <div className="wellness-counsellor-photo-wrap">
              <div className="wellness-counsellor-photo">
                <img src={counsellorPhoto} alt={counsellorName} loading="lazy" />
              </div>
              <div className="wellness-counsellor-side">
                <div className="wellness-counsellor-sticky">
                  <Quote size={22} className="wellness-counsellor-sticky-mark" fill="currentColor" strokeWidth={0} />
                  <p>Good Mental Health Brighter Futures</p>
                </div>
                <div className="wellness-counsellor-values">
                  <span>Listen</span>
                  <span>Support</span>
                  <span>Guide</span>
                  <span>Empower</span>
                  <span className="wellness-counsellor-values-last">Together</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* We Support You Through */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="wellness-section-header">
            <div>
              <span className="section-label">Support Areas</span>
              <h2 className="section-title" style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>We Support You Through</h2>
            </div>
            <p>No matter what you&rsquo;re going through, you&rsquo;re not alone. Explore the areas we can help you with.</p>
          </div>
          <div className="grid-4 mobile-stack-grid">
            {SUPPORT_AREAS.map((s) => (
              <div key={s.title} className="wellness-card wellness-card--sm" style={{ background: s.color.bg }}>
                <span className="wellness-card-icon wellness-card-icon--duotone" style={{ background: 'rgba(255,255,255,0.6)', color: s.color.fg }}>
                  <s.icon size={26} weight="duotone" />
                </span>
                <h3 className="wellness-card-title">{s.title}</h3>
                <p className="wellness-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="wellness-impact-section">
        <img src={IMPACT_BG_IMAGE} alt="" className="wellness-impact-bg-img" />
        <div className="wellness-impact-overlay" />
        <div className="container wellness-impact-content">
          <span className="section-label section-label--dark">Our Impact</span>
          <div className="wellness-impact-grid">
            {impactStats.map((s) => {
              const Icon = resolveContentIcon(s.icon);
              return (
                <div key={s.id}>
                  <div className="wellness-impact-value">
                    {s.value}
                    {Icon && <Icon size={26} fill="currentColor" strokeWidth={0} />}
                  </div>
                  <div className="wellness-impact-label">{s.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* It's Okay To Ask for Help */}
      <section className="wellness-cta-section bg-white">
        <div className="container">
          <div className="wellness-cta-grid">
            <div>
              <span className="wellness-cta-eyebrow">It&rsquo;s Okay</span>
              <h2 className="wellness-cta-heading">To Ask for <span className="wellness-heading-accent">Help</span></h2>
              <p className="wellness-cta-body">
                Your mental health matters. Reach out, book a session, or simply say hello &mdash; we&rsquo;re here for you.
              </p>
              <div className="wellness-cta-actions">
                <Link to="/contact" className="btn btn-primary">Book a Session</Link>
                <Link to="/contact" className="btn btn-outline">Contact Us</Link>
              </div>
            </div>
            <div className="wellness-cta-badge">
              <Heart size={26} fill="currentColor" strokeWidth={0} />
              <span>Same Student</span>
              <span>Brighter Tomorrows</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
