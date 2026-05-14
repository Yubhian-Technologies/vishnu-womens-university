export interface PlacementItem {
  slug: string;
  title: string;
  desc: string;
  icon: string;
  external?: boolean;
  url?: string;
  intro?: string;
  about?: string;
  highlights?: string[];
  facilities?: string[];
  outcomes?: string[];
  partners?: string[];
}

export const placementItems: PlacementItem[] = [
  {
    slug: 'placement-details',
    title: 'Placement Details',
    icon: '📊',
    desc: 'Comprehensive placement statistics, company-wise data, branch-wise breakdowns, and year-on-year placement trends at VWU.',
    highlights: [],
  },
  {
    slug: 'success-stories',
    title: 'Success Stories',
    icon: '🌟',
    desc: 'Inspiring journeys of VWU alumnae who have built successful careers at top companies across India and abroad.',
    highlights: [],
  },
  {
    slug: 'tpo-cell',
    title: 'TPO Cell',
    icon: '🏢',
    desc: 'The Training and Placement Office at VWU — bridging students and industry through structured campus recruitment, training, and career support.',
    highlights: [],
  },
  {
    slug: 'tpo-team',
    title: 'TPO Team',
    icon: '👥',
    desc: 'Meet the dedicated Training and Placement team at VWU — the driving force behind industry connections, recruitment drives, and student career development.',
    highlights: [],
  },
  {
    slug: 'industry-liaison-offices',
    title: 'Industry Liaison Offices',
    icon: '🤝',
    desc: 'VWU\'s industry liaison network facilitating partnerships, MoUs, internships, and collaborative projects with leading organisations across sectors.',
    highlights: [],
  },
  {
    slug: 'career-guidance-cell',
    title: 'Career Guidance Cell',
    icon: '🧭',
    desc: 'Personalised career counselling, aptitude assessments, resume building workshops, and one-on-one mentoring to help students chart their career path.',
    highlights: [],
  },
  {
    slug: 'campus-recruitment-training',
    title: 'Campus Recruitment Training',
    icon: '🎯',
    desc: 'Structured CRT programmes covering aptitude, reasoning, verbal ability, group discussions, and mock interviews — preparing students for every stage of campus recruitment.',
    highlights: [],
  },
  {
    slug: 'our-recruiters',
    title: 'Our Recruiters',
    icon: '🏭',
    desc: 'A growing network of 150+ recruiters — from Fortune 500 giants to fast-growing startups — who trust VWU talent for their teams.',
    highlights: [],
  },
  {
    slug: 'employability-skills',
    title: 'Employability Skills',
    icon: '💡',
    desc: 'Targeted skill development programmes in communication, leadership, problem-solving, and domain knowledge to make VWU graduates industry-ready from day one.',
    highlights: [],
  },
  {
    slug: 'mission-rd',
    title: 'Mission R&D',
    icon: '🔬',
    desc: "VWU's Mission R&D initiative nurturing research aptitude among students, connecting them with funded projects, publications, and pathways into advanced research careers.",
    highlights: [],
  },
  {
    slug: 'gsac',
    title: 'Graduate Study Abroad Center – GSAC',
    icon: '🌏',
    desc: 'Dedicated centre guiding students on higher education abroad across 7 destinations — USA, Canada, UK, Germany, Australia, China, and Spain — with counselling, loan support, and pre-departure orientation.',
    highlights: [
      '7 destinations: USA, Canada, UK, China, Germany, Australia, Spain',
      'GRE, TOEFL, and IELTS training support',
      'Education loan facilitation through partner banks',
      'Pre-departure orientation: cultural adaptation and safety',
    ],
    intro: 'The Graduate Study Abroad Center (GSAC) at VWU supports students pursuing higher education internationally by providing comprehensive guidance to identify suitable destinations, universities, and academic programmes. The center reduces the financial and emotional burden on families by offering hand-holding in GRE/TOEFL/IELTS training and application processing.',
    about: 'GSAC provides counselling on international course options and destinations, education loan assistance through partner banks, scholarship identification and application support, and pre-departure orientation programmes covering cultural adaptation and safety. Students are also connected with alumni already studying or working in destination countries to ease their transition.',
    outcomes: [
      'Students successfully guided through international university applications',
      'Admitted students connected with alumni in destination countries',
    ],
    partners: [],
  },
  {
    slug: 'higher-education',
    title: 'Higher Education',
    icon: '🎓',
    desc: 'Guidance and resources for students pursuing M.Tech, MBA, Ph.D., and other postgraduate programmes at top institutions in India and overseas.',
    highlights: [],
  },
];

export function findPlacementItemBySlug(slug: string): PlacementItem | null {
  return placementItems.find((i) => i.slug === slug) ?? null;
}
