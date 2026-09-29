import { DIFFERENTIATOR_CATEGORIES } from '../pages/Admin/sections/DifferentiatorsAdmin';

// ── Header menu content ──
// The whole top navigation (menu names, dropdown columns, links, and the
// highlight card on the right of each dropdown) is admin-editable from
// Admin → Header Menu (HeaderMenuAdmin.tsx), stored as the single
// `settings/headerMenu` doc. DEFAULT_HEADER_MENU below is the built-in menu:
// it's shown until an admin saves a menu, while the doc is loading, and if
// the saved doc is ever missing/unusable — so the header can never go blank.

export interface HeaderMenuLink {
  label: string;
  path: string;
  /** Opens in a new tab (outside website). */
  external?: boolean;
  /** Downloads the file instead of opening a page. */
  download?: boolean;
  /** Shown greyed out and not clickable (page not ready yet). */
  disabled?: boolean;
  hideExternalIcon?: boolean;
  subItems?: HeaderMenuLink[];
}

export interface HeaderMenuGroup {
  groupLabel: string;
  groupPath?: string;
  items: HeaderMenuLink[];
}

export interface HeaderMenuHighlight {
  title: string;
  description: string;
  badge?: string;
  linkText?: string;
  linkPath?: string;
}

/** Menus whose links are filled in automatically from another admin section. */
export type HeaderMenuAutoSource = 'differentiators' | 'placements' | 'campusLife';

export const AUTO_SOURCE_INFO: Record<HeaderMenuAutoSource, string> = {
  differentiators: 'Admin → Differentiators (each item appears under its category)',
  placements: 'Admin → Placement Sub-pages',
  campusLife: 'Admin → Campus Life (facility pages + "Campus Life Menu — Other Links")',
};

export interface HeaderMenuItem {
  /** Stable id — never shown; keeps an item identifiable when its label is renamed. */
  key: string;
  label: string;
  path?: string;
  /** Hidden from the header without deleting it. */
  hidden?: boolean;
  /** Links in this menu come from another admin section instead of being listed here. */
  auto?: HeaderMenuAutoSource;
  highlight?: HeaderMenuHighlight;
  /** Single-column dropdown. */
  children?: HeaderMenuLink[];
  /** Multi-column dropdown (each group is a column with a heading). */
  groups?: HeaderMenuGroup[];
}

export const DEFAULT_HEADER_MENU: HeaderMenuItem[] = [
  {
    key: 'about-us',
    label: 'About Us',
    highlight: {
      title: 'Vishnu Women\'s University',
      badge: 'About VWU',
      description: 'Sri Vishnu Educational Society, sponsoring Society for Vishnu Women\'s University is committed to empowering women through excellence in engineering education.',
      linkText: 'Explore VWU',
      linkPath: '/about',
    },
    groups: [
      {
        groupLabel: 'About Us',
        groupPath: '/about',
        items: [
          { label: 'About VWU', path: '/about' },
          { label: 'Vision & Mission', path: '/vision-mission' },
          { label: 'Institutional Development Plan', path: '/governance/idp', disabled: true },
          { label: 'Organizational Chart', path: '/downloads/SVECWOrganizationChart.jpg', download: true, disabled: true },
          { label: 'Core Executive Body', path: '/about#core-executive' },
          { label: 'About Society (SVES)', path: '/about-sves' },
          { label: 'Global Alumni Network', path: 'https://alumni.srivishnu.edu.in/', external: true },
        ],
      },
      {
        groupLabel: 'Governance',
        items: [
          { label: 'Governing Body', path: '/governance/governing-body', disabled: true },
          { label: 'Academic Council', path: '/governance/academic-council', disabled: true },
          { label: 'Board of Studies', path: '/governance/board-of-studies', disabled: true },
          { label: 'Finance Committee', path: '/governance/finance-committee', disabled: true },
        ],
      },
      {
        groupLabel: 'Committees',
        items: [
          { label: 'College Academic Committee', path: '/governance/college-academic-committee', disabled: true },
          { label: 'Acad. & Admin. Audit Committee', path: '/governance/academic-administrative-audit', disabled: true },
          { label: 'Freshmen Committee', path: '/governance/freshmen-committee', disabled: true },
          { label: 'Infrastructure Management', path: '/governance/infrastructure-management', disabled: true },
          { label: 'Faculty Grievance Redressal', path: '/governance/faculty-grievance', disabled: true },
          { label: 'Student Grievance Redressal', path: '/governance/student-grievance', disabled: true },
          { label: 'Central Purchase Committee', path: '/governance/central-purchase', disabled: true },
          { label: 'Anti-Ragging Committee', path: '/governance/anti-ragging', disabled: true },
          { label: 'Internal Committee (POSH)', path: '/governance/internal-committee', disabled: true },
          { label: 'SC/ST Cell', path: '/governance/sc-st-cell', disabled: true },
          { label: 'R&D Committee', path: '/governance/rd-committee', disabled: true },
        ],
      },
      {
        groupLabel: 'IQAC',
        items: [
          { label: 'About IQAC', path: '/governance/about-iqac', disabled: true },
          { label: 'IQAC Worksystem', path: '/governance/iqac-worksystem', disabled: true },
          { label: 'Quality Parameters', path: '/governance/quality-parameters', disabled: true },
          { label: 'IQAC Committee', path: '/governance/iqac-committee', disabled: true },
          { label: 'Policies & Procedures', path: '/governance/policies-procedures', disabled: true },
        ],
      },
    ],
  },
  {
    key: 'academics',
    label: 'Academics',
    highlight: {
      title: 'Academic Excellence',
      description: 'Industry-aligned curriculum, multidisciplinary research, distinguished faculty, and hands-on laboratory learning.',
      linkText: 'All Programmes',
      linkPath: '/academics',
    },
    groups: [
      {
        groupLabel: 'Overview',
        groupPath: '/academics',
        items: [
          { label: 'Schools', path: '/academics/schools' },
          { label: 'Departments', path: '/academics/departments' },
          { label: 'Programmes', path: '/academics/programs' },
          { label: 'Faculty Directory', path: '/faculty' },
          { label: 'Results Analysis', path: '/result-analysis' },
          { label: 'Examinations Portal', path: 'https://www.svecwexams.in/', external: true },
        ],
      },
      {
        groupLabel: 'UG Programs',
        groupPath: '/academics/programs?tab=btech',
        items: [
          { label: 'Computer Science & Engineering', path: '/academics/cse' },
          { label: 'Artificial Intelligence', path: '/academics/ai-ds' },
          { label: 'Information Technology', path: '/academics/it' },
          { label: 'Electronics & Communication Engineering', path: '/academics/ece' },
          { label: 'Electrical & Electronics Engineering', path: '/academics/eee' },
          { label: 'Civil Engineering', path: '/academics/ce' },
          { label: 'Mechanical Engineering', path: '/academics/me' },
          { label: 'Department of Mathematics', path: '/academics/mathematics' },
          { label: 'Department of Physics', path: '/academics/physics' },
          { label: 'Department of Chemistry', path: '/academics/chemistry' },
          { label: 'Department of English', path: '/academics/english' },
        ],
      },
      {
        groupLabel: 'PG Programs',
        groupPath: '/academics/programs?tab=mtech',
        items: [
          { label: 'Computer Science & Engineering', path: '/academics/mtech-cse' },
          { label: 'VLSI Design', path: '/academics/mtech-vlsi' },
          { label: 'Power Electronics', path: '/academics/mtech-power-electronics' },
          { label: 'Software Engineering', path: '/academics/mtech-software-engineering' },
          { label: 'Department of Management Studies', path: '/academics/mba' },
        ],
      },
      {
        groupLabel: 'PhD Programs',
        groupPath: '/academics/programs?tab=phd',
        items: [
          { label: 'Computer Science & Engineering', path: '/academics/cse' },
          { label: 'Electronics & Communication Engineering', path: '/academics/ece' },
          { label: 'Electrical & Electronics Engineering', path: '/academics/eee' },
        ],
      },
      {
        groupLabel: 'Information',
        groupPath: '/information',
        items: [
          { label: 'Academic Calendar', path: '/information#academic-calendar' },
          { label: 'List of Holidays', path: '/information#holidays' },
          { label: 'Counselling Scheme', path: '/information#counselling' },
          { label: 'ICT Platforms', path: '/information#ict-platforms' },
          { label: 'State-of-the-art Labs', path: '/campus/state-of-the-art-labs' },
          { label: 'Other Practices', path: '/information#other-practices' },
        ],
      },
    ],
  },
  {
    key: 'admissions',
    label: 'Admissions',
    highlight: {
      title: 'Join VWU',
      badge: 'Admissions 2026-27',
      description: 'Empowering future women engineers, researchers, and innovators. Transparent admission process and merit scholarships.',
      linkText: 'Fee Structure',
      linkPath: '/programmes-fee-structure',
    },
    children: [
      { label: 'Admissions Overview', path: '/admissions' },
      { label: 'Programmes & Fee Structure', path: '/programmes-fee-structure' },
      { label: 'Admission Procedure', path: '/admission-procedure' },
      { label: 'Results Analysis', path: '/result-analysis' },
      { label: 'Fee Payment Portal', path: 'https://svecw.ac.in/Default.aspx?ReturnUrl=%2f', external: true },
      { label: 'How to Reach Campus', path: '/contact' },
    ],
  },
  {
    key: 'differentiators',
    label: 'Differentiators',
    auto: 'differentiators',
    highlight: {
      title: 'Distinctive Edge',
      badge: 'Unique Initiatives',
      description: 'From assistive technology labs and micro-manufacturing to student radio and innovation ecosystems.',
      linkText: 'View All Initiatives',
      linkPath: '/differentiators',
    },
    groups: [
      ...DIFFERENTIATOR_CATEGORIES.map((cat) => ({
        groupLabel: cat.label,
        groupPath: `/differentiators#${cat.id}`,
        items: [],
      })),
    ],
  },
  {
    key: 'placements',
    label: 'Placements',
    auto: 'placements',
    highlight: {
      title: 'Top Tier Placements',
      badge: '90%+ Track Record',
      description: 'Leading global recruiters, career development training, and exceptional internship opportunities.',
      linkText: 'Placement Insights',
      linkPath: '/placements',
    },
    children: [],
  },
  {
    key: 'research',
    label: 'Research',
    highlight: {
      title: 'Innovation & Patents',
      badge: '50+ Patents Filed',
      description: 'DST & AICTE funded projects, collaborative research centers, and cutting-edge publications.',
      linkText: 'R&D Overview',
      linkPath: '/research/about-rd',
    },
    groups: [
      {
        groupLabel: 'Research Info',
        items: [
          { label: 'R&D', path: '/research/about-rd' },
          { label: 'Research Advisory Committee', path: '/research/research-advisory-committee' },
          { label: 'Research Ethics Committee', path: '/research/research-ethics-committee' },
          { label: 'Intellectual Property Rights (IPR)', path: '/research/ipr-committee' },
          { label: 'Thrust Areas of Research', path: '/research/thrust-areas-of-research' },
        ],
      },
      {
        groupLabel: 'Research Outcomes',
        items: [
          { label: 'Research Centers', path: '/research/research-centers' },
          { label: 'Funded Projects', path: '/research/funded-projects' },
          { label: 'Research Publications', path: '/research/research-publications' },
          { label: 'MoUs & Collaborations', path: '/research/mous' },
        ],
      },
      {
        groupLabel: 'Innovations',
        items: [
          { label: 'Patents', path: '/research/patents' },
          { label: 'Consultancy', path: '/research/consultancy' },
          { label: 'Professional Bodies', path: '/research/professional-bodies' },
        ],
      },
    ],
  },
  {
    key: 'campus-life',
    label: 'Campus Life',
    auto: 'campusLife',
    highlight: {
      title: 'Vibrant Green Campus',
      badge: 'Life at VWU',
      description: 'Lush green residential campus with modern sports facilities, amphitheaters, radio station, and student clubs.',
      linkText: 'Explore Facilities',
      linkPath: '/campus/central-library',
    },
    // Every "facility"-group page from Admin -> Campus Life (Central Library,
    // Auditoriums, Event, Club, ...) is appended here dynamically at render
    // time instead of being individually hardcoded — see the campusLife
    // branch in Header.tsx's renderedNavItems. These entries are unused at
    // render time; they stay only so isEnabledNavPath's static scan still
    // recognizes these paths.
    children: [
      { label: 'Sewage Treatment Plants', path: '/campus/sewage-treatment-plants' },
      { label: 'Wellness Centre', path: '/campus/wellness' },
      { label: 'Vishnu TV Academy', path: '/vishnu-tv-academy' },
      { label: 'Student Clubs', path: '/campus/clubs' },
      { label: 'Vishnu School of Music', path: 'https://svesschoolofmusic.in/', external: true },
      { label: 'Social Services', path: '/social-services' },
    ],
  },
  {
    key: 'rankings',
    label: 'Rankings',
    path: '/news-awards/accreditations-awards#ranking',
    highlight: {
      title: 'Recognised Quality',
      badge: 'NAAC A+ & NBA',
      description: 'A record of national rankings, ratings, awards, and accreditations endorsed by India\'s foremost regulatory and ranking bodies.',
      linkText: 'View All Recognitions',
      linkPath: '/news-awards/accreditations-awards#ranking',
    },
    groups: [
      {
        groupLabel: 'Rankings & Recognitions',
        groupPath: '/news-awards/accreditations-awards#ranking',
        items: [
          { label: 'Rankings & Ratings', path: '/news-awards/accreditations-awards#ranking' },
          { label: 'Awards & Recognitions', path: '/news-awards/accreditations-awards#award' },
          { label: 'Accreditations & Approvals', path: '/news-awards/accreditations-awards#accreditation' },
        ],
      },
    ],
  },
  {
    key: 'happenings',
    label: 'Happenings',
    highlight: {
      title: 'Happenings & Accolades',
      badge: 'NAAC A+ & NBA',
      description: 'Stay updated with upcoming conferences, hackathons, guest lectures, and institutional recognitions.',
      linkText: 'View Gallery',
      linkPath: '/news-awards/gallery',
    },
    groups: [
      {
        groupLabel: 'Happenings',
        groupPath: '/news-awards',
        items: [
          { label: 'Upcoming Events', path: '/news-awards/happenings#upcoming-events' },
          { label: 'Recent Events', path: '/news-awards/happenings#recent-events' },
          { label: 'Gallery', path: '/news-awards/gallery' },
          { label: 'Vishnu Era Newsletter', path: 'https://www.srivishnu.edu.in/vishnu-era/', external: true },
          { label: 'Prathibha Magazine', path: 'https://heyzine.com/flip-book/088b7b5629.html#page/54', external: true },
        ],
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    highlight: {
      title: 'Get in Touch',
      badge: 'Bhimavaram Campus',
      description: 'Vishnupur, Bhimavaram, West Godavari District, Andhra Pradesh - 534202. We are here to help.',
      linkText: 'Contact Details',
      linkPath: '/contact',
    },
    children: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'How to Reach Campus', path: '/contact' },
    ],
  },
];

// ── Validation of the saved doc ──
// Firestore data is typed `unknown` here on purpose: anything malformed is
// dropped rather than crashing the header, and an unusable doc as a whole
// falls back to DEFAULT_HEADER_MENU.

const AUTO_SOURCES: HeaderMenuAutoSource[] = ['differentiators', 'placements', 'campusLife'];
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

function cleanLink(v: unknown): HeaderMenuLink | null {
  if (!isObj(v)) return null;
  const label = str(v.label).trim();
  const path = str(v.path).trim();
  if (!label || !path) return null;
  const link: HeaderMenuLink = { label, path };
  if (v.external === true) link.external = true;
  if (v.download === true) link.download = true;
  if (v.disabled === true) link.disabled = true;
  if (v.hideExternalIcon === true) link.hideExternalIcon = true;
  return link;
}

function cleanLinks(v: unknown): HeaderMenuLink[] {
  return Array.isArray(v) ? v.map(cleanLink).filter((l): l is HeaderMenuLink => !!l) : [];
}

function cleanItem(v: unknown, index: number): HeaderMenuItem | null {
  if (!isObj(v)) return null;
  const label = str(v.label).trim();
  if (!label) return null;
  const item: HeaderMenuItem = { key: str(v.key).trim() || `menu-${index}`, label };
  if (str(v.path).trim()) item.path = str(v.path).trim();
  if (v.hidden === true) item.hidden = true;
  if (AUTO_SOURCES.includes(v.auto as HeaderMenuAutoSource)) item.auto = v.auto as HeaderMenuAutoSource;
  if (isObj(v.highlight) && (str(v.highlight.title).trim() || str(v.highlight.description).trim())) {
    const h = v.highlight;
    item.highlight = { title: str(h.title).trim(), description: str(h.description).trim() };
    if (str(h.badge).trim()) item.highlight.badge = str(h.badge).trim();
    if (str(h.linkText).trim()) item.highlight.linkText = str(h.linkText).trim();
    if (str(h.linkPath).trim()) item.highlight.linkPath = str(h.linkPath).trim();
  }
  if (Array.isArray(v.groups)) {
    item.groups = v.groups
      .filter(isObj)
      .map((g) => ({
        groupLabel: str(g.groupLabel).trim(),
        ...(str(g.groupPath).trim() ? { groupPath: str(g.groupPath).trim() } : {}),
        items: cleanLinks(g.items),
      }))
      .filter((g) => g.groupLabel);
  } else if (Array.isArray(v.children)) {
    item.children = cleanLinks(v.children);
  }
  return item;
}

/** Turns the raw `settings/headerMenu` doc into a safe menu, or null if it has no usable items. */
export function parseHeaderMenu(raw: unknown): HeaderMenuItem[] | null {
  if (!isObj(raw) || !Array.isArray(raw.items)) return null;
  const items = raw.items.map(cleanItem).filter((i): i is HeaderMenuItem => !!i);
  return items.length > 0 ? items : null;
}
