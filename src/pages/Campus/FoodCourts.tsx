import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils, Users, Leaf, MapPin, Quote, ArrowUpRight, ShieldCheck, Sparkles,
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import FoodCourtsGrid from '../../components/FoodCourtsCarousel/FoodCourtsGrid';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';

// Real value proposition points — matching WHY the campus has food courts,
// not a claim about any specific location.
const VALUE_PROPS: { icon: typeof Utensils; label: string; desc: string }[] = [
  { icon: Utensils, label: 'Good Food, Better Minds', desc: 'A well-balanced diet keeps students and faculty energised through long academic days.' },
  { icon: Users, label: 'Great People, Brighter Days', desc: 'Every food court doubles as a meeting point for friends, batchmates, and colleagues.' },
  { icon: Leaf, label: 'A Healthier, Happier You', desc: 'A mix of modern and traditional food items, prepared fresh, every single day.' },
];

// The real, current list of food courts across campus — see
// src/pages/Campus/campusFacilities.data.ts (now superseded by this
// standalone page; kept there only as the canonical source of this list
// if it ever needs regenerating). Icons cycle through a small food-related
// set purely for visual rhythm — they don't imply anything about what's
// actually served at each location.
const FOOD_COURTS: string[] = [
  'Canoe & Cusine',
  'Brewista',
  'Tea Leaf',
  'Central Square',
  'Bakers Treat',
  'Tasty Corner',
  'Nescafe Coffee Shops',
  'Fresh Choice Bakery at Lake View',
  'Lake View Court',
  'Jercy Juicy Shop and Fast Food Items',
  'Annapurna Fast Food Items',
  'Fresh Choice at Temple Square',
  'Snacks Corner',
  'Juice Shop and Fast Foods',
  'Annapurna Canteen',
  'Sita Mess',
  'Vishnu Canteen',
];

const BOTTOM_FEATURES: { icon: typeof Utensils; label: string; desc: string }[] = [
  { icon: MapPin, label: 'Diverse Food Spaces', desc: `${FOOD_COURTS.length} dining spaces across campus.` },
  { icon: Sparkles, label: 'Vibrant Atmosphere', desc: 'A great place to meet and relax.' },
  { icon: ShieldCheck, label: 'Clean & Hygienic', desc: 'Safe and healthy dining environment.' },
  { icon: Users, label: 'Student Friendly', desc: 'Designed for your comfort and convenience.' },
];

const defaultFoodCourtPhotos = Array.from({ length: 5 }, (_, i) => ({
  src: PHOTO_NEEDED_PLACEHOLDER,
  alt: `Food Courts at VWU — Photo ${i + 1}`,
  caption: '',
}));

export default function FoodCourts() {
  const photos = useSitePhotos('campus', 'food-courts', defaultFoodCourtPhotos);
  const collage = photos.slice(1, 4);

  useEffect(() => {
    document.title = 'Food Courts | VWU';
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
        title="Food Courts | Vishnu Women's University"
        description="Hygienic, varied dining across VWU's campus — a look at the food courts, cafés, and canteens open to every student and staff member from 6:30 AM to 8:30 PM."
        canonicalPath="/campus/food-courts"
      />

      <PageHero
        page="campus-food-courts"
        defaultTitle="Food Courts"
        defaultSubtitle="Hygienic Dining with Variety and Convenience."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Campus Life', to: '/campus' }, { label: 'Food Courts' }]}
        layout="split"
      />

      {/* More Than Just a Meal */}
      <section id="food-courts-content" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ maxWidth: 760, marginBottom: 'var(--space-8)' }}>
            <h2 className="section-title">Dining &amp; Food Courts</h2>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-accent)', marginTop: '0.3rem', marginBottom: 'var(--space-5)' }}>
              A world of flavours, right on campus.
            </p>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
              More Than Just a Meal
            </h3>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-3)' }}>
              VWU offers a vibrant on-campus dining experience with{' '}
              <strong style={{ color: 'var(--color-primary)' }}>17+ food court and food outlet locations</strong>,
              providing students with convenient access to a diverse range of healthy, nutritious, traditional, and
              contemporary food choices.
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
              From wholesome everyday meals to popular modern favourites, students can enjoy a variety of flavours
              and cuisines without leaving campus. The food courts also serve as welcoming spaces to relax, connect,
              and spend time with friends — open daily from{' '}
              <strong style={{ color: 'var(--color-primary)' }}>6:30 AM to 8:30 PM</strong>.
            </p>

            <div
              style={{
                background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)',
                borderLeft: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)',
                padding: 'var(--space-5) var(--space-6)', marginBottom: 'var(--space-5)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                Moon Spoon&mdash; The Night Canteen
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.75, margin: 0 }}>
                For students who enjoy a late-evening bite, Moon Light, the campus night canteen, offers convenient
                food options after regular dining hours&mdash;adding to the comfort and vibrancy of residential
                campus life.
              </p>
            </div>

            <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.7, margin: 0 }}>
              Everything you need to eat, connect, and enjoy campus life&mdash;all within the VWU campus.
            </p>
          </div>

          <div
            className="mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}
          >
            {VALUE_PROPS.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
                  padding: 'var(--space-5)', background: 'var(--color-off-white)',
                  border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-lg)',
                }}
              >
                <span
                  style={{
                    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--color-primary)', color: 'var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={19} strokeWidth={2.2} />
                </span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.3rem' }}>
                    {label}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Our Food Courts */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Campus Dining Spaces</span>
            <h2 className="section-title">
              Explore <span style={{ color: 'var(--color-accent)' }}>Our Food Courts</span>
            </h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 640, marginTop: 'var(--space-2)' }}>
              {FOOD_COURTS.length} dining spaces spread across the campus — each with its own regulars and its own
              charm.
            </p>
          </div>

          <FoodCourtsGrid />
        </div>
      </section>

      {/* Quote band + feature strip, unified on one navy surface */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container">
          <div
            className="reveal mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 'var(--space-10)', alignItems: 'center', marginBottom: 'var(--space-12)' }}
          >
            <div>
              <Quote size={36} strokeWidth={2} style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }} />
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)', fontStyle: 'italic', color: 'var(--color-white)', lineHeight: 1.4, marginBottom: 'var(--space-4)' }}>
                &ldquo;Good food brings people together.&rdquo;
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, maxWidth: 480 }}>
                At Vishnu Women&rsquo;s University, our food courts are more than dining spaces — they are where
                friendships grow and memories are made.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {collage.map((photo, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1, aspectRatio: i === 1 ? '3 / 4.6' : '3 / 4',
                    marginTop: i === 1 ? '-1.5rem' : 0,
                    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)', border: '4px solid rgba(255,255,255,0.9)',
                  }}
                >
                  <SmoothImage src={photo.src} alt={photo.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          <div
            className="mobile-stack-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)',
              textAlign: 'center', paddingTop: 'var(--space-10)', borderTop: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            {BOTTOM_FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label}>
                <span
                  style={{
                    width: 56, height: 56, borderRadius: '50%', margin: '0 auto var(--space-3)',
                    background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={24} strokeWidth={2} style={{ color: 'var(--color-accent)' }} />
                </span>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-white)', marginBottom: '0.25rem' }}>
                  {label}
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section bg-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <Link to="/campus" className="btn btn-primary">
              Explore Campus Life <ArrowUpRight size={16} style={{ marginLeft: 4 }} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
