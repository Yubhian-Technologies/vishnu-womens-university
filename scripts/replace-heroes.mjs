/**
 * Replaces every page-hero <section> with <PageHero /> component.
 * Run: node scripts/replace-heroes.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(process.cwd(), 'src/pages');
const IMPORT_LINE = "import PageHero from '../../components/PageHero/PageHero';";

const PAGES = [
  {
    file: 'About/About.tsx',
    page: 'about',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80',
    title: 'About Vishnu Womens University',
    subtitle: 'Empowering women through knowledge and action — since 2001, from Bhimavaram, Andhra Pradesh.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'About VWU' }],
  },
  {
    file: 'AboutSVES/AboutSVES.tsx',
    page: 'about-sves',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80',
    title: 'Sri Vishnu Educational Society',
    subtitle: 'A legacy of educational excellence spanning 25+ years and 20+ institutions across Andhra Pradesh and Telangana.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'About SVES' }],
  },
  {
    file: 'Academics/Academics.tsx',
    page: 'academics',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80',
    title: 'You Will Excel.',
    subtitle: 'A comprehensive, industry-focused engineering education designed to develop your technical expertise, research skills, and professional leadership.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Academics' }],
  },
  {
    file: 'Admissions/Admissions.tsx',
    page: 'admissions',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80',
    title: 'Your Journey Starts Here',
    subtitle: 'Joining VWU is the first step toward a rewarding engineering career, a powerful network, and a future you\'ll be proud of.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Admissions' }],
  },
  {
    file: 'Admissions/AdmissionProcedure.tsx',
    page: 'admission-procedure',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b6f71?w=1920&q=80',
    title: 'Admission Procedure',
    subtitle: 'Step-by-step guide to joining VWU — eligibility, entrance tests, and enrollment for all programmes.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Admission Procedure' }],
  },
  {
    file: 'Admissions/ProgrammesFee.tsx',
    page: 'programmes-fee',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80',
    title: 'Programmes & Fee Structure',
    subtitle: 'Complete list of programs, intake capacities, and annual fee structure for AY 2025–26.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Programmes & Fee' }],
  },
  {
    file: 'Admissions/ResultAnalysis.tsx',
    page: 'result-analysis',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1920&q=80',
    title: 'Result Analysis',
    subtitle: 'VWU consistently ranks among the top 5 affiliated colleges of JNTU Kakinada with 90%+ annual pass rates.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Admissions', to: '/admissions' }, { label: 'Result Analysis' }],
  },
  {
    file: 'AlumniGiving/AlumniGiving.tsx',
    page: 'alumni-giving',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80',
    title: 'Always a Vishnu Engineer',
    subtitle: 'Your VWU journey doesn\'t end at graduation. Stay connected, give back, and help shape the next generation of women engineers.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Alumni & Giving' }],
  },
  {
    file: 'Campus/Campus.tsx',
    page: 'campus',
    image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=80',
    title: 'Campus Life at VWU',
    subtitle: 'A 100-acre campus in Bhimavaram designed to inspire learning, wellness, and community.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Campus Life' }],
  },
  {
    file: 'Careers/Careers.tsx',
    page: 'careers',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80',
    title: 'Careers at VWU',
    subtitle: 'Join a team of passionate educators and professionals dedicated to empowering the next generation of women engineers.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Careers' }],
  },
  {
    file: 'Differentiators/Differentiators.tsx',
    page: 'differentiators',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80',
    title: 'What Sets VWU Apart',
    subtitle: 'Unique initiatives spanning innovation, industry, research, global outreach, and student development — built to prepare women engineers for the world.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Differentiators' }],
  },
  {
    file: 'Events/Events.tsx',
    page: 'events',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    title: 'Campus Events',
    subtitle: 'From technical symposia to sports tournaments and graduation celebrations — there\'s always something happening at VWU.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Events' }],
  },
  {
    file: 'Governance/Governance.tsx',
    page: 'governance',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80',
    title: 'Governance & Statutory Bodies',
    subtitle: 'Transparent, accountable governance driving academic excellence — from apex statutory bodies to quality assurance committees.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Governance' }],
  },
  {
    file: 'Information/Information.tsx',
    page: 'information',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80',
    title: 'Information',
    subtitle: 'Academic calendar, holidays, how to reach us, counselling, ICT platforms, and more.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'Information' }],
  },
  {
    file: 'News/News.tsx',
    page: 'news',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80',
    title: 'VWU News & Stories',
    subtitle: 'Stay up-to-date with the latest happenings, achievements, and stories from the VWU community.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'News' }],
  },
  {
    file: 'NewsAwards/NewsAwards.tsx',
    page: 'news-awards',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80',
    title: 'News & Awards',
    subtitle: 'Celebrating VWU\'s achievements, events, and milestones — from national accreditations and rankings to campus happenings and visual memories.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'News & Awards' }],
  },
  {
    file: 'NewsAwards/Accreditations.tsx',
    page: 'news-awards-accreditations',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80',
    title: 'Accreditations & Awards',
    subtitle: 'Recognised by India\'s leading bodies for quality, innovation, and academic excellence — a record built over two decades.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Accreditations & Awards' }],
  },
  {
    file: 'NewsAwards/Gallery.tsx',
    page: 'news-awards-gallery',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80',
    title: 'Gallery',
    subtitle: 'A visual archive of campus life at VWU — from national competitions and graduation days to cultural festivals and industry events.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Gallery' }],
  },
  {
    file: 'NewsAwards/Happenings.tsx',
    page: 'news-awards-happenings',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    title: 'Happenings at VWU',
    subtitle: 'The latest workshops, MoUs, competitions, celebrations, and milestones from across the VWU campus.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'News & Awards', to: '/news-awards' }, { label: 'Happenings' }],
  },
  {
    file: 'Placements/Placements.tsx',
    page: 'placements',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80',
    title: 'Placements & Careers',
    subtitle: 'Connecting VWU talent with world-class opportunities — from campus recruitment and career training to global study pathways.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Placements' }],
  },
  {
    file: 'StudentActivities/ArtsCulture.tsx',
    page: 'arts-culture',
    image: 'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=1920&q=80',
    title: 'Arts & Culture',
    subtitle: 'Cultivating creativity, heritage, and a sense of belonging — shaping cultured and responsible leaders of tomorrow.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Arts & Culture' }],
  },
  {
    file: 'StudentActivities/CampusMagazines.tsx',
    page: 'campus-magazines',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80',
    title: 'Campus Magazines',
    subtitle: 'Three publications capturing the academic achievements, creative voices, and campus life at VWU and SVES.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Campus Magazines' }],
  },
  {
    file: 'StudentActivities/SocialServices.tsx',
    page: 'social-services',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&q=80',
    title: 'Social Services',
    subtitle: 'National Service Scheme at VWU — building engineers who serve their nation, communities, and society.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Social Services' }],
  },
  {
    file: 'StudentActivities/SportsGames.tsx',
    page: 'sports-games',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=80',
    title: 'Sports & Games',
    subtitle: 'A sound mind dwells in a sound body — physical fitness is given utmost importance at VWU.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Sports & Games' }],
  },
  {
    file: 'StudentActivities/StudentClubs.tsx',
    page: 'student-clubs',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80',
    title: 'Student Clubs',
    subtitle: '23 active clubs spanning technology, social service, arts, and culture — there is a place for every passion at VWU.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Student Clubs' }],
  },
  {
    file: 'StudentActivities/VishnuTV.tsx',
    page: 'vishnu-tv',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80',
    title: 'Vishnu TV Academy',
    subtitle: 'By the students. For the students. — The only campus TV Academy in Andhra Pradesh.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Student Life', to: '/student-life' }, { label: 'Vishnu TV Academy' }],
  },
  {
    file: 'StudentLife/StudentLife.tsx',
    page: 'student-life',
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1920&q=80',
    title: 'Discover Your Place at VWU',
    subtitle: 'At VWU, you\'ll find more than an engineering degree. You\'ll find your community, your purpose, and your future.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Student Life' }],
  },
  {
    file: 'VisionMission/VisionMission.tsx',
    page: 'vision-mission',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80',
    title: 'Vision, Mission & Values',
    subtitle: 'The guiding principles and purpose that drive every decision at Vishnu Womens University.',
    breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Discover', to: '/' }, { label: 'Vision, Mission & Values' }],
  },
];

function bcToJsx(items) {
  return `[${items.map(i => i.to ? `{ label: '${i.label}', to: '${i.to}' }` : `{ label: '${i.label}' }`).join(', ')}]`;
}

function buildPageHeroJsx(p) {
  const subtitle = p.subtitle ? `\n  defaultSubtitle="${p.subtitle}"` : '';
  return `<PageHero
        page="${p.page}"
        defaultImage="${p.image}"
        defaultTitle="${p.title}"${subtitle}
        breadcrumb={${bcToJsx(p.breadcrumb)}}
      />`;
}

// Regex to match the full page-hero section (supports optional {/* Hero */} comment)
const HERO_REGEX = /(?:\s*\{\/\* Hero \*\/\}\s*)?\s*<section className="page-hero"[\s\S]*?<\/section>/;

let ok = 0, skip = 0;

for (const p of PAGES) {
  const filePath = resolve(ROOT, p.file);
  let src;
  try { src = readFileSync(filePath, 'utf8'); } catch { console.error(`MISSING: ${p.file}`); skip++; continue; }

  // Check hero exists
  if (!HERO_REGEX.test(src)) { console.warn(`NO HERO MATCH: ${p.file}`); skip++; continue; }

  // Add import if not present
  let out = src;
  if (!out.includes("import PageHero from")) {
    // Insert after last existing import line
    out = out.replace(/(import[^\n]+\n)(?!import)/, `$1${IMPORT_LINE}\n`);
  }

  // Replace hero section
  out = out.replace(HERO_REGEX, `\n      {/* Hero */}\n      ${buildPageHeroJsx(p)}`);

  // Remove now-unused Link import if it was only used in breadcrumb
  // (keep it - other pages use Link elsewhere, don't remove)

  writeFileSync(filePath, out, 'utf8');
  console.log(`✓ ${p.file}`);
  ok++;
}

console.log(`\nDone: ${ok} updated, ${skip} skipped.`);
