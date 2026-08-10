// All copy/content on this page is real VWU content, sourced from the
// existing homepage (Home.tsx) and other already-live pages/data files —
// nothing here is invented. See each constant's comment for its source.

// Same 5 recognitions as Home.tsx's defaultRecognitions, restructured into
// lpu.in's "Rising Beyond Standards" slide shape: a giant badge + a one-line
// caption underneath it, paired with the awarding body's name + a fuller
// description on the right.
export const RANKINGS = [
  { big: 'A++', caption: 'NAAC Accreditation Grade — the highest grade awarded.', title: 'NAAC Accreditation', desc: 'Vishnu Womens University is accredited with an A++ grade by the National Assessment and Accreditation Council.' },
  { big: '#1', caption: 'Among top engineering colleges in its category.', title: 'India Today Rankings', desc: 'Vishnu Womens University is recognized as a Top Engineering College by the India Today Rankings survey.' },
  { big: '#1', caption: 'Among the best engineering colleges nationally.', title: 'The Week Rankings', desc: 'Vishnu Womens University is recognized as a Best Engineering College by The Week Rankings survey.' },
  { big: 'NBA', caption: 'Programs accredited for quality and outcomes.', title: 'NBA Accreditation', desc: "VWU's engineering programs hold accreditation from the National Board of Accreditation." },
  { big: 'UGC', caption: 'Autonomous status granted for academic excellence.', title: 'UGC Autonomous Status', desc: 'Vishnu Womens University holds Autonomous Status granted by the University Grants Commission.' },
];

// Same 8 stats as CounterSection.tsx's defaultCounters — split by theme.
export const PLACEMENT_STATS = [
  { value: 1400, suffix: '+', label: 'annual placements' },
  { value: 500, suffix: '+', label: 'industry partners recruiting' },
  { value: 13100, suffix: '+', label: 'engineers graduated' },
  { value: 230, suffix: '+', label: 'experienced faculty' },
];

export const RESEARCH_STATS = [
  { big: '2500+', label: 'RESEARCH PUBLICATIONS' },
  { big: '90+', label: 'PATENTS FILED' },
  { big: '300+', label: 'QUALIFIED FACULTY' },
  { big: '25+', label: 'GLOBAL MoUs' },
];

// Real companies drawn from src/pages/Placements/placementStats.data.ts
// batch records — rendered as plain wordmark text, not fetched brand
// artwork, since this project doesn't hold licensed logo assets for them.
export const RECRUITERS = [
  'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Amazon', 'Accenture',
  'Deloitte', 'Capgemini', 'HCL Technologies', 'Tech Mahindra',
];

// Same 8 campus-life highlights as Home.tsx's defaultCampusFeatures,
// expanded into short narrative blurbs for this page's story-scroller.
export const ECOSYSTEM_STORIES = [
  {
    title: 'Student Clubs & Organizations',
    desc: 'A vibrant network of student-run clubs spanning technology, arts, culture, and community service — every student finds her community at VWU.',
    imageSlot: 'ecosystem-1',
  },
  {
    title: "Women's Hostels",
    desc: 'Secure, comfortable on-campus residences designed around student wellbeing, giving every resident a true home away from home.',
    imageSlot: 'ecosystem-2',
  },
  {
    title: 'AR/VR Studio',
    desc: 'Hands-on immersive technology facilities supporting student projects, research, and next-generation engineering coursework.',
    imageSlot: 'ecosystem-3',
  },
  {
    title: 'Technology Business Incubator',
    desc: 'A dedicated space for student entrepreneurs to build, test, and launch real ventures with institutional mentorship and support.',
    imageSlot: 'ecosystem-4',
  },
];

// Real Governing Body leadership, sourced verbatim from
// src/pages/Governance/GoverningBody.tsx's defaultMembers (already live,
// public data) — shown here in LPU's "esteemed visitors" photo-grid style,
// reframed honestly as VWU's own leadership rather than invented visitors.
export const LEADERSHIP = [
  { name: 'Sri K.V. Vishnu Raju', title: 'Chairman, SVES' },
  { name: 'Sri Ravichandran Rajagopal', title: 'Vice-Chancellor, SVES' },
  { name: 'Sri Aditya Vissam', title: 'Secretary, SVES' },
  { name: 'Prof. P. Venkata Rama Raju', title: 'Vice-Principal, VWU' },
  { name: 'Dr. S.M. Padmaja', title: 'Professor & Head, EEE' },
  { name: 'Dr. G. Srinivasa Rao', title: 'Principal, VWU' },
];

// Same real program names/slugs as Home.tsx's Popular Programs strip.
export const PROGRAM_GROUPS = [
  {
    heading: 'Undergraduate Programmes',
    items: [
      { title: 'CSE', slug: 'cse' },
      { title: 'AI & Machine Learning', slug: 'ai-ml' },
      { title: 'AI & Data Science', slug: 'ai-ds' },
      { title: 'Cyber Security', slug: 'cyber-security' },
      { title: 'Information Technology', slug: 'it' },
    ],
  },
  {
    heading: 'Postgraduate & Research',
    items: [
      { title: 'Electronics & Communication', slug: 'ece' },
      { title: 'Electrical & Electronics', slug: 'eee' },
      { title: 'Civil Engineering', slug: 'ce' },
      { title: 'Mechanical Engineering', slug: 'me' },
      { title: 'MBA', slug: 'mba' },
    ],
  },
];

// Same 3 alumni testimonials as Home.tsx's defaultTestimonials.
export const TESTIMONIALS = [
  { name: 'Lakshmi R.', role: 'Software Engineer at Google · Class of 2024', quote: 'VWU faculty genuinely invest in each student — they know your name, your ambitions, and they hold you to a high standard. The skills and confidence I gained here led directly to my placement at Google.', avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80' },
  { name: 'Anusha P.', role: 'Research Scholar at IIT Hyderabad · Class of 2022', quote: 'VWU is a true launchpad. The research infrastructure, the labs, and the guidance I received here built the academic foundation that made my Ph.D. at IIT Hyderabad possible.', avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80' },
  { name: 'Divya K.', role: 'Co-founder, TechFemme Startup · Class of 2023', quote: 'Studying in an all-women environment gave me real confidence in my abilities. I led several national-level projects at VWU — and that leadership mindset is what drives my startup today.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80' },
];

export const QUICK_LINKS = [
  { label: 'Admissions', to: '/admissions' },
  { label: 'Programs', to: '/academics' },
  { label: 'Campus Life', to: '/campus' },
  { label: 'Placements', to: '/placements' },
  { label: 'Research', to: '/research' },
  { label: 'Alumni & Giving', to: '/alumni-giving' },
  { label: 'Contact Us', to: '/contact' },
];
