export interface Accreditation {
  code: string;
  title: string;
  logo: string;
  years: string;
}

export const DEFAULT_ACCREDITATIONS: Accreditation[] = [
  { code: 'NBA', title: 'National Board of Accreditation', logo: '/images/accreditations/nba.png', years: 'Accredited 2008–2028' },
  { code: 'NAAC', title: 'National Assessment & Accreditation Council', logo: '/images/accreditations/naac.png', years: 'Accredited 2015–2027' },
  { code: 'UGC', title: 'University Grants Commission', logo: '/images/accreditations/ugc.png', years: 'Approved 2014–2035' },
  { code: 'AICTE', title: 'All India Council for Technical Education', logo: '/images/accreditations/aicte.png', years: 'Approved 2001–Present' },
];

export interface MetricItem {
  id: string;
  value: string;
  boldText: string;
  line1: string;
  line2: string;
}

export const DEFAULT_PLACEMENT_METRICS: MetricItem[] = [
  {
    id: 'recruiters',
    value: '100+',
    boldText: 'recruiters',
    line1: 'partner with',
    line2: 'VWU',
  },
  {
    id: 'placements',
    value: '1100+',
    boldText: 'placements',
    line1: 'every year',
    line2: '',
  },
  {
    id: 'package',
    value: '₹59.29 LPA',
    boldText: 'highest package',
    line1: 'secured at',
    line2: 'Google',
  },
  {
    id: 'placement-rate',
    value: '92%+',
    boldText: 'placement rate',
    line1: 'across B.Tech',
    line2: 'disciplines',
  },
];

export interface HomeCtaButton {
  label: string;
  link: string;
}

export interface AlumniContentData {
  eyebrow: string;
  title: string;
  row1Title: string;
  row1Desc: string;
  row2Title: string;
  row2Desc: string;
  ctaLabel: string;
  ctaHref: string;
}

export const DEFAULT_ALUMNI_CONTENT: AlumniContentData = {
  eyebrow: 'Stay Connected',
  title: 'Alumni Connect',
  row1Title: 'SVES Global Alumni Network',
  row1Desc: "Launched in January 2025, The SVES GLOBAL ALUMNI NETWORK is an enterprising community where alumni and students connect to create win-win opportunities worldwide. From mentorship and research collaborations to job opportunities and entrepreneurship initiatives, alumni from 1997 to today, spanning India, the USA, Canada, Germany, the UK, the Netherlands, Australia, New Zealand, and beyond, are driving real change.",
  row2Title: 'A Community That Delivers Results',
  row2Desc: "With the 'Alumni Spotlight' showcasing success stories and entrepreneurial alumni opening doors for projects and internships, this network is already delivering results. Through regional chapters, global events, career support, and collaboration initiatives, the SVES Global Alumni Network serves as a catalyst for personal growth, professional success, and lifelong engagement. Whether you are an entrepreneur, a technologist, a healthcare professional, an educator, or a leader in your field, this community is your home — a place to reconnect, give back, and grow together.",
  ctaLabel: 'Explore Our Global Alumni',
  ctaHref: 'https://alumni.srivishnu.edu.in/',
};

export interface HomeContentDoc {
  browserTabTitle: string;
  metaTitle: string;
  metaDescription: string;
  
  // Academic Recognition
  accreditationsEyebrow: string;
  accreditationsTitle: string;
  accreditationsSubtitle: string;
  accreditationsList: Accreditation[];

  // Study at VWU
  studyIntroTitle: string;
  studyIntroSubtitle: string;
  studyIntroParagraphs: string[];

  // VWU in Action
  activityEyebrow: string;
  activityTitle: string;
  activityDesc: string;

  // Placements Section
  placementBadge: string;
  placementTitleMain: string;
  placementTitleSub: string;
  placementDesc: string;
  placementMetrics: MetricItem[];

  // Alumni & Giving
  alumniContent: AlumniContentData;

  // Testimonials
  testimonialSectionTitle: string;

  // CTA Banner
  ctaHeading: string;
  ctaBody: string;
  ctaButtons: HomeCtaButton[];
}

export const DEFAULT_HOME_CONTENT: HomeContentDoc = {
  browserTabTitle: 'VWU | Leading by Design — Women in Engineering',
  metaTitle: "Vishnu Women's University | Empowering Women Through Knowledge & Technology",
  metaDescription: 'First private university for women in Telugu states located in Bhimavaram, Andhra Pradesh. Offering B.Tech, M.Tech, MBA, and Ph.D. programs with world-class infrastructure and top placements.',
  
  accreditationsEyebrow: 'Academic Recognition',
  accreditationsTitle: 'Accreditations & Affiliations',
  accreditationsSubtitle: 'Recognized by leading academic and regulatory bodies in India.',
  accreditationsList: DEFAULT_ACCREDITATIONS,

  studyIntroTitle: 'Study at VWU',
  studyIntroSubtitle: 'Courses for Women',
  studyIntroParagraphs: [
    'At VWU, learning extends far beyond the traditional classroom. Students gain personalized, industry-oriented education designed to develop technical expertise, leadership skills, creativity, and the confidence to shape their future.',
    'Every programme is designed exclusively for women and emphasizes hands-on learning through modern laboratories and practical experiences. Our faculty bring valuable industry exposure into the classroom from the very first year, helping students connect academic knowledge with real-world applications.',
    'All programmes are approved by AICTE and recognized by the UGC.',
  ],

  activityEyebrow: 'Campus Life',
  activityTitle: 'Recent Events/ News',
  activityDesc: 'A rolling glimpse of the events, celebrations, and everyday moments that shape life at VWU.',

  placementBadge: 'PLACEMENTS',
  placementTitleMain: 'Explore',
  placementTitleSub: 'the Top Global recruiters who choose VWU talent',
  placementDesc: 'VWU offers top placements with packages of up to ₹59.29 LPA, featuring 100+ recruiters like Google, Amazon, Microsoft, Palo Alto Networks, and Adobe, along with 1,100+ career-focused placements every year.',
  placementMetrics: DEFAULT_PLACEMENT_METRICS,

  alumniContent: DEFAULT_ALUMNI_CONTENT,

  testimonialSectionTitle: 'What Our Students Say',
  ctaHeading: 'The best way to understand VWU is to see it for yourself.',
  ctaBody: 'Arrange a campus tour, speak with our admissions team, or submit your application today. Your path to a purposeful engineering career starts here.',
  ctaButtons: [
    { label: 'Schedule a Visit', link: '/admissions' },
    { label: 'Request Information', link: '/admissions' },
    { label: 'Apply via AP EAPCET', link: '/admissions' },
  ],
};

export const HOME_CONTENT_COLLECTION = 'settings';
export const HOME_CONTENT_DOC_ID = 'homeContent';
