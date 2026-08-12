// Real, duplicated-not-invented content, following the same convention as
// LandingPremium's landingPremium.data.ts: figures here match what's already
// live elsewhere on the site (CounterSection defaults, RESEARCH_STATS,
// PLACEMENT_STATS/RECRUITERS, Home.tsx's defaultTestimonials). Sections
// noted "[Content to be provided]" have no backing source yet anywhere in
// the codebase — the layout/animation is fully built, copy is a placeholder
// an admin will replace.

export const IMPACT_STATS = [
  { value: 13100, suffix: '+', label: 'Engineers graduated' },
  { value: 1400, suffix: '+', label: 'Students placed annually' },
  { value: 230, suffix: '+', label: 'Experienced faculty' },
  { value: 500, suffix: '+', label: 'Recruiting industry partners' },
];

export const RESEARCH_STATS = [
  { big: '2500+', label: 'Research publications' },
  { big: '90+', label: 'Patents filed' },
  { big: '25+', label: 'Global MoUs' },
  { big: 'A++', label: 'NAAC accreditation grade' },
];

export const PLACEMENT_STATS = [
  { value: 1400, suffix: '+', label: 'annual placements' },
  { value: 96, suffix: '%', label: 'eligible students placed' },
  { value: 500, suffix: '+', label: 'recruiting partners' },
  { value: 13100, suffix: '+', label: 'alumni network' },
];

// Same real companies as landingPremium.data.ts's RECRUITERS — plain
// wordmark text, no licensed logo assets exist in this project.
export const RECRUITERS = [
  'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Amazon', 'Accenture',
  'Deloitte', 'Capgemini', 'HCL Technologies', 'Tech Mahindra',
];

// Same 3 real alumni voices as Home.tsx's defaultTestimonials, plus one
// faculty and one parent voice clearly marked as placeholders (no existing
// faculty/parent testimonial content anywhere in the codebase yet).
export const TESTIMONIALS = [
  {
    name: 'Lakshmi R.',
    role: 'Software Engineer at Google · Class of 2024',
    tag: 'Alumna',
    quote: 'VWU faculty genuinely invest in each student — they know your name, your ambitions, and they hold you to a high standard. The skills and confidence I gained here led directly to my placement at Google.',
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
  },
  {
    name: 'Anusha P.',
    role: 'Research Scholar at IIT Hyderabad · Class of 2022',
    tag: 'Alumna',
    quote: 'VWU is a true launchpad. The research infrastructure, the labs, and the guidance I received here built the academic foundation that made my Ph.D. at IIT Hyderabad possible.',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80',
  },
  {
    name: 'Divya K.',
    role: "Co-founder, TechFemme Startup · Class of 2023",
    tag: 'Alumna',
    quote: 'Studying in an all-women environment gave me real confidence in my abilities. I led several national-level projects at VWU — and that leadership mindset is what drives my startup today.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  },
  {
    name: '[Name to be provided]',
    role: 'Parent of a current student',
    tag: 'Parent',
    quote: '[Content to be provided by Admin — a parent testimonial will appear here.]',
    avatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&q=80',
  },
  {
    name: '[Name to be provided]',
    role: 'Faculty, Department of Engineering',
    tag: 'Faculty',
    quote: '[Content to be provided by Admin — a faculty testimonial will appear here.]',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&q=80',
  },
];

// "University Stories" — no existing Firestore collection or static source
// backs this content anywhere yet; layout/animation is fully built, copy is
// a clearly-marked placeholder per section.
export const UNIVERSITY_STORIES = [
  {
    eyebrow: 'Student Success',
    title: '[Story headline to be provided]',
    teaser: '[Content to be provided by Admin — a student success story will appear here.]',
    imageSlot: 'stories-student',
  },
  {
    eyebrow: 'Faculty Achievement',
    title: '[Story headline to be provided]',
    teaser: '[Content to be provided by Admin — a faculty achievement story will appear here.]',
    imageSlot: 'stories-faculty',
  },
  {
    eyebrow: 'Research Breakthrough',
    title: '[Story headline to be provided]',
    teaser: '[Content to be provided by Admin — a research breakthrough story will appear here.]',
    imageSlot: 'stories-research',
  },
  {
    eyebrow: 'Entrepreneurship',
    title: '[Story headline to be provided]',
    teaser: '[Content to be provided by Admin — a student entrepreneurship story will appear here.]',
    imageSlot: 'stories-entrepreneurship',
  },
  {
    eyebrow: 'Community Impact',
    title: '[Story headline to be provided]',
    teaser: '[Content to be provided by Admin — a community impact story will appear here.]',
    imageSlot: 'stories-community',
  },
];

// Campus Life editorial content — data-driven so an admin/dev can swap
// copy, categories, and links without touching the section's JSX. Grounded
// in real routes already live elsewhere on the site (student clubs,
// hostels, sports) rather than invented pages.
export const CAMPUS_LIFE_FEATURED = {
  title: 'Life at Vishnu Women’s University',
  desc: 'Beyond lectures and labs, VWU is where friendships form in hostel corridors, ideas get debated in club meetings, and confidence is built on stage, on the field, and in every corner of campus.',
  link: '/campus',
  linkLabel: 'Explore Campus Life',
};

export const CAMPUS_LIFE_STORIES = [
  {
    key: 'story1',
    category: 'Student Life',
    title: 'Student Clubs & Organizations',
    desc: 'From coding societies to classical dance troupes, VWU’s student-run clubs give every woman here a community built around what she loves.',
    link: '/student-clubs',
  },
  {
    key: 'story2',
    category: 'Hostel Life',
    title: 'A Home Away From Home',
    desc: 'Secure, comfortable on-campus residences designed around student wellbeing — hostel life is where lifelong friendships begin.',
    link: '/campus/campus-hostels',
  },
  {
    key: 'story3',
    category: 'Sports & Fitness',
    title: 'Sports & Fitness',
    desc: 'From inter-university tournaments to daily fitness sessions, sport keeps competition and wellbeing part of everyday campus life.',
    link: '/sports-games',
  },
];

export const QUICK_LINKS = [
  { label: 'Admissions', to: '/admissions' },
  { label: 'Programs', to: '/academics' },
  { label: 'Campus Life', to: '/campus' },
  { label: 'Placements', to: '/placements' },
  { label: 'Research', to: '/research' },
  { label: 'Alumni & Giving', to: '/alumni-giving' },
];

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'http://instagram.com/vishnu_svecw/' },
  { label: 'Facebook', href: 'https://www.facebook.com/svecwcollege' },
  { label: 'Twitter', href: 'https://twitter.com/svecw2' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/school/vishnusvecw/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@SVECW-B0' },
];
