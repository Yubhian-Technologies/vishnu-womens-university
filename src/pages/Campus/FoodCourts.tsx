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
  { icon: Utensils, label: 'Convenient Dining', desc: 'Food outlets located across the campus make meals, snacks and refreshments easily accessible during the academic day.' },
  { icon: Users, label: 'Spaces to Connect', desc: 'Campus food courts provide informal spaces where students can meet, relax and spend time together between classes and activities.' },
  { icon: Leaf, label: 'Variety of Food Choices', desc: 'A range of everyday meals, snacks, refreshments and contemporary food options gives students greater choice without having to leave the campus.' },
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
  { icon: MapPin, label: 'Diverse Dining Options', desc: 'Food courts, canteens, cafés and refreshment outlets located across the campus.' },
  { icon: Sparkles, label: 'Convenient Campus Locations', desc: 'Dining spaces positioned across the University for easy access during the day.' },
  { icon: ShieldCheck, label: 'Clean Dining Spaces', desc: 'Campus dining facilities are maintained to provide students with comfortable and well-kept spaces for meals and refreshments.' },
  { icon: Users, label: 'Student-Friendly Spaces', desc: 'Accessible dining areas designed around the convenience and everyday needs of students.' },
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
        title="Food Courts & Campus Dining | Vishnu Women's University"
        description="Fresh, convenient and varied dining across VWU's campus — a look at the food courts, cafés, and canteens open to every student and staff member from 6:30 AM to 8:30 PM."
        canonicalPath="/campus/food-courts"
      />

      <PageHero
        page="campus-food-courts"
        defaultTitle="Food Courts & Campus Dining"
        defaultSubtitle="Fresh, Convenient and Varied Dining Across Campus"
        layout="split"
      />

      {/* Dining & Food Courts intro */}
      <section id="food-courts-content" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ maxWidth: 760, marginBottom: 'var(--space-8)' }}>
            <h2 className="section-title">Dining &amp; Food Courts</h2>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-accent)', marginTop: '0.3rem', marginBottom: 'var(--space-5)' }}>
              A Variety of Flavours, Right on Campus
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-3)' }}>
              Vishnu Women&rsquo;s University offers{' '}
              <strong style={{ color: 'var(--color-primary)' }}>{FOOD_COURTS.length}+ food courts and food outlets</strong> across
              the campus, giving students convenient access to a variety of meals, snacks and refreshments
              throughout the day.
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-3)' }}>
              From everyday meals and traditional favourites to contemporary food choices, caf&eacute;s and quick
              bites, the campus dining spaces cater to different tastes and preferences. Located across the
              University, these food outlets also provide welcoming spaces where students can take a break, meet
              friends and enjoy campus life between academic activities.
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
              Dining hours: <strong style={{ color: 'var(--color-primary)' }}>6:30 AM to 8:30 PM</strong>.
            </p>

            <div
              style={{
                background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)',
                borderLeft: '4px solid var(--color-accent)', borderRadius: 'var(--radius-md)',
                padding: 'var(--space-5) var(--space-6)', marginBottom: 'var(--space-5)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                MoonSpoon: The Night Canteen
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.75, margin: 0 }}>
                For students looking for refreshments beyond regular dining hours, MoonSpoon, the campus night
                canteen, provides convenient food options in the evening. It adds to the comfort of residential
                campus life by giving students access to refreshments after the main dining facilities close.
              </p>
            </div>

            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              More Than Just a Place to Eat
            </h3>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.8, margin: 0 }}>
              Campus dining is part of everyday student life. The University&rsquo;s food courts and dining spaces
              are designed around three essentials:
            </p>
          </div>

          <div
            className="mobile-stack-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}
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
              Explore Our <span style={{ color: 'var(--color-accent)' }}>Campus Food Courts</span>
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-accent)', marginTop: '0.3rem' }}>
              Discover Dining Spaces Across the University
            </p>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 640, marginTop: 'var(--space-2)' }}>
              Explore the food courts, caf&eacute;s, canteens and refreshment outlets located across the Vishnu
              Women&rsquo;s University campus. Each dining space offers students a convenient place to eat, recharge
              and connect during the day.
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
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-white)', marginBottom: 'var(--space-2)' }}>
                A Place to Eat, Relax and Connect
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, maxWidth: 480 }}>
                At Vishnu Women&rsquo;s University, campus dining spaces are more than places to stop for a meal.
                They form part of everyday student life, offering convenient spaces to eat, take a break and spend
                time with friends within the campus.
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
            <h2 className="section-title">Discover More of Campus Life</h2>
            <p style={{ color: 'var(--color-text-light)', maxWidth: 560, margin: '0 auto var(--space-6)' }}>
              Explore the facilities, spaces and experiences that make everyday life at Vishnu Women&rsquo;s
              University engaging and convenient.
            </p>
            <Link to="/campus" className="btn btn-primary">
              Explore Campus Life <ArrowUpRight size={16} style={{ marginLeft: 4 }} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
