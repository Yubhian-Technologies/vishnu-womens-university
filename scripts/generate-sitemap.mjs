import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.vwu.edu.in';

// List of all static public routes
const staticRoutes = [
  '/',
  '/academics',
  '/academics/downloads',
  '/academics/curriculum',
  '/academics/freshman-engineering',
  '/faculty',
  '/admissions',
  '/student-life',
  '/alumni-giving',
  '/about',
  '/vision-mission',
  '/governance',
  '/governance/governing-body',
  '/governance/governing-body',
  '/governance/idp',
  '/governance/college-academic-committee',
  '/governance/internal-quality-assurance-cell',
  '/governance/academic-administrative-audit',
  '/governance/freshmen-committee',
  '/governance/infrastructure-management',
  '/governance/faculty-grievance',
  '/governance/student-grievance',
  '/governance/central-purchase',
  '/governance/counselling-monitoring',
  '/governance/anti-ragging',
  '/governance/internal-committee',
  '/governance/sc-st-cell',
  '/governance/rd-committee',
  '/governance/about-iqac',
  '/governance/iqac-worksystem',
  '/governance/quality-parameters',
  '/governance/iqac-committee',
  '/governance/policies-procedures',
  '/governance/annual-reports',
  '/governance/nirf-reports',
  '/governance/nba-data',
  '/research',
  '/research/about-rd',
  '/research/research-advisory-committee',
  '/research/research-ethics-committee',
  '/research/ipr-committee',
  '/research/thrust-areas-of-research',
  '/research/research-centers',
  '/research/funded-projects',
  '/research/seed-money-projects',
  '/research/research-publications',
  '/research/mous',
  '/research/patents',
  '/research/consultancy',
  '/research/professional-bodies',
  '/about-sves',
  '/campus',
  '/campus/central-library',
  '/campus/campus-hostels',
  '/campus/other-facilities',
  '/campus/smart-classrooms',
  '/campus/state-of-the-art-labs',
  '/campus/auditoriums',
  '/campus/campus-book-stores',
  '/campus/wifi-campus',
  '/campus/food-courts',
  '/campus/fitness-centre',
  '/campus/staff-quarters',
  '/campus/travel-desk',
  '/campus/temples',
  '/campus/health-care',
  '/campus/swimming-pool',
  '/campus/campus-security',
  '/information',
  '/programmes-fee-structure',
  '/admission-procedure',
  '/result-analysis',
  '/vishnu-tv-academy',
  '/student-clubs',
  '/social-services',
  '/campus-magazines',
  '/arts-culture',
  '/sports-games',
  '/differentiators',
  '/differentiators/radio-vishnu-diff',
  '/differentiators/vishnu-tbi',
  '/differentiators/center-of-excellence',
  '/placements',
  '/placements/placement-details',
  '/placements/success-stories',
  '/placements/tpo-cell',
  '/placements/tpo-team',
  '/placements/industry-liaison-offices',
  '/placements/career-guidance-cell',
  '/placements/campus-recruitment-training',
  '/placements/our-recruiters',
  '/placements/employability-skills',
  '/placements/mission-rd',
  '/placements/gsac',
  '/placements/higher-education',
  '/news',
  '/events',
  '/news-awards',
  '/news-awards/happenings',
  '/news-awards/accreditations-awards',
  '/news-awards/gallery',
  '/news-awards/social-media-handles',
  '/careers',
  '/contact',
  '/disclosures/ugc',
  '/anti-ragging',
  '/policies-procedures'
];

// Known dynamic routes fallback list
const dynamicRoutes = [
  // B.Tech / M.Tech / MBA Program Slugs
  '/academics/cse',
  '/academics/ai-ml',
  '/academics/ai-ds',
  '/academics/cyber-security',
  '/academics/it',
  '/academics/ece',
  '/academics/eee',
  '/academics/ce',
  '/academics/me',
  '/academics/mba'
];

function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  const allRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));

  const urlEntries = allRoutes
    .map((route) => {
      const priority = route === '/' ? '1.0' : route.split('/').length === 2 ? '0.8' : '0.6';
      return `  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
  console.log(`[Sitemap] Generated sitemap.xml with ${allRoutes.length} URLs at ${outputPath}`);
}

generateSitemap();
