import type { LucideIcon } from 'lucide-react';
import {
  Microscope, Users, ShieldCheck, Lightbulb, Target, FlaskConical,
  IndianRupee, Sprout, BookOpen, Handshake, Award, Briefcase, UsersRound,
} from 'lucide-react';

export interface ResearchTableRow { [key: string]: string | number }

export interface ResearchItem {
  slug: string;
  title: string;
  category: 'governance' | 'output' | 'engagement';
  icon: LucideIcon;
  desc: string;
  intro?: string;
  about?: string;
  highlights?: string[];
  tableData?: ResearchTableRow[];
  tableSections?: { title: string; rows: ResearchTableRow[] }[];
}

export const researchCategories: { key: ResearchItem['category']; label: string; desc: string; icon: LucideIcon }[] = [
  { key: 'governance', label: 'R&D Governance', desc: 'The committees and centers that set policy, oversee ethics, and protect intellectual property across every research activity at VWU.', icon: ShieldCheck },
  { key: 'output', label: 'Research Output', desc: 'Funded projects, seed money grants, publications, and patents produced by VWU faculty and students.', icon: FlaskConical },
  { key: 'engagement', label: 'Industry & Professional Engagement', desc: 'Partnerships, consultancy work, and professional body chapters that connect VWU research to the wider industry and academic community.', icon: Handshake },
];

export const researchItems: ResearchItem[] = [

  // ─── GOVERNANCE ────────────────────────────────────────────────────────────
  {
    slug: 'about-rd',
    title: 'About R&D',
    category: 'governance',
    icon: Microscope,
    desc: 'VWU fosters a dynamic research culture where faculty and students collaborate across disciplines, translating discoveries into real-world impact.',
    intro: 'VWU is committed to fostering a dynamic research culture where faculty and students collaborate to explore new frontiers of knowledge across various disciplines. From developing sustainable technologies to tackling complex societal challenges, our researchers are pushing the boundaries of knowledge and driving positive change.',
    about: 'Through partnerships with industry and interdisciplinary collaborations, VWU is committed to translating research discoveries into tangible applications that create meaningful impacts in the real world. Faculty members are deeply engaged in pioneering research across a spectrum of fields, spanning from engineering and technology to the sciences and humanities. Students have unique opportunities to participate in research activities, gaining hands-on experience through seed grants and collaborative projects with industry partners. The execution of sponsored projects granted by DST, DRDO, UGC and AICTE, and research papers published in SCI/Scopus-indexed journals, indicate the institute’s strength in R&D.',
    tableData: [
      { 'S.No': 1, Name: 'Dr. G. Srinivasa Rao', Role: 'Principal & Professor' },
      { 'S.No': 2, Name: 'Prof. P. Venkata Rama Raju', Role: 'Vice-Principal & Professor' },
      { 'S.No': 3, Name: 'Dr. G R L V N Srinivasa Raju', Role: 'Professor & Dean R&D' },
      { 'S.No': 4, Name: 'Dr. G. Durga Prasad', Role: 'Professor & Institute R&D Coordinator' },
    ],
    highlights: [
      'Department-level R&D Coordinators across all nine departments',
      'Institutional R&D Policy governing sponsored and in-house research',
    ],
  },
  {
    slug: 'research-advisory-committee',
    title: 'Research Advisory Committee',
    category: 'governance',
    icon: Users,
    desc: 'A pivotal body dedicated to fostering and enhancing research endeavors across disciplines, from policy guidance to funding support.',
    intro: 'The Research Advisory Committee (RAC) is a pivotal body dedicated to fostering and enhancing research endeavors across various disciplines at VWU.',
    highlights: [
      'Policy Guidance — advising on research policies and strategies aligned with institutional vision',
      'Interdisciplinary Collaboration — facilitating partnerships across departments and research centers',
      'Quality and Ethics — ensuring research integrity and adherence to ethical guidelines through rigorous review',
      'Funding Support — assisting researchers in securing grants and identifying external funding opportunities, including seed grants',
      'Consultancy — promoting industry collaborations and knowledge exchange',
      'Infrastructure Enhancement — supporting access to cutting-edge equipment, laboratories, and technological platforms',
      'Recognition — offering incentives for publications, patents, and externally-funded projects',
    ],
    tableData: [
      { 'S.No': 1, Name: 'Dr. G. Srinivasa Rao', Designation: 'Principal', Role: 'Chairman' },
      { 'S.No': 2, Name: 'Prof. P. Venkata Rama Raju', Designation: 'Vice Principal', Role: 'Member' },
      { 'S.No': 3, Name: 'Dr. S. M. Padmaja', Designation: 'Professor, EEE Department', Role: 'Member' },
      { 'S.No': 4, Name: 'Dr. T. S. R. Murthy', Designation: 'Professor, Basic Sciences', Role: 'Member' },
      { 'S.No': 5, Name: 'Dr. V. V. R. Maheswara Rao', Designation: 'Professor, CSE; IQAC Coordinator', Role: 'Member' },
      { 'S.No': 6, Name: 'Dr. G. Durga Prasad', Designation: 'Professor, AI Department', Role: 'Member' },
      { 'S.No': 7, Name: 'Dr. G.R.L.V.N Srinivasa Raju', Designation: 'Professor, ECE; Dean (R&D)', Role: 'Convener' },
    ],
  },
  {
    slug: 'research-ethics-committee',
    title: 'Research Ethics Committee',
    category: 'governance',
    icon: ShieldCheck,
    desc: 'Maintains ethical standards in research across all disciplines, from proposal review to plagiarism management.',
    intro: 'The Research Ethics Committee (REC) at VWU is dedicated to maintaining ethical standards in research across all disciplines.',
    highlights: [
      'Ethical Review — review of ethical compliance of research proposals and monitoring of ongoing projects',
      'Educational Initiatives — workshops and training sessions on ethical principles and responsible research conduct',
      'Issue Resolution — a consultation resource for ethical concerns or disputes arising during research activities',
      'Integrity Promotion — fostering honesty, transparency, and accountability in all aspects of research',
      'Plagiarism Management — providing tools and assistance to ensure originality and academic honesty',
    ],
    tableData: [
      { 'S.No': 1, Name: 'Dr. G. Srinivasa Rao', Designation: 'Principal', Role: 'Chairman' },
      { 'S.No': 2, Name: 'Dr. J. Rohith Balaji', Designation: 'Associate Professor', Role: 'Member' },
      { 'S.No': 3, Name: 'Dr. M. V. Subba Rao', Designation: 'Associate Professor', Role: 'Member' },
      { 'S.No': 4, Name: 'Dr. G. Durga Prasad', Designation: 'Professor', Role: 'Member' },
      { 'S.No': 5, Name: 'Dr. G.R.L.V.N Srinivasa Raju', Designation: 'Professor, Dean (R&D)', Role: 'Convener' },
    ],
  },
  {
    slug: 'ipr-committee',
    title: 'IPR Committee',
    category: 'governance',
    icon: Lightbulb,
    desc: 'Encourages innovation and creativity while safeguarding intellectual property across research and academic endeavours.',
    intro: 'The Intellectual Property Rights (IPR) Committee aims to encourage innovation and creativity while safeguarding individual intellectual property across all research and academic endeavors at VWU.',
    highlights: [
      'Policy Development — formulating IPR policies governing identification, protection, ownership, and commercialisation',
      'Innovation Promotion — advancing technology transfer through academia-industry collaborations and licensing agreements',
      'Awareness Building — educational programmes on patents, copyrights, trademarks, and trade secrets',
      'Support Services — guidance on patent filing, copyright registration, licensing negotiations, and commercialisation strategies',
      'Legal Oversight — counsel on disputes related to IP ownership, infringement, and licensing agreements',
      'Strategic Partnerships — establishing MoUs with industry partners and research institutions',
    ],
    tableData: [
      { 'S.No': 1, Name: 'Dr. G. Srinivasa Rao', Designation: 'Principal', Role: 'Chairman' },
      { 'S.No': 2, Name: 'Dr. K. Padma Vasavi', Designation: 'Professor', Role: 'Member' },
      { 'S.No': 3, Name: 'Dr. Ch. Hari Krishna', Designation: 'Professor', Role: 'Member' },
      { 'S.No': 4, Name: 'Dr. J. Rohith Balaji', Designation: 'Associate Professor', Role: 'Member' },
      { 'S.No': 5, Name: 'Dr. G.R.L.V.N.S Raju', Designation: 'Professor, Dean (R&D)', Role: 'Convener' },
    ],
  },
  {
    slug: 'research-centers',
    title: 'Research Centers',
    category: 'governance',
    icon: FlaskConical,
    desc: 'JNTUK-recognised research centers spanning Electronics & Communication, Electrical & Electronics, and Computer Science Engineering.',
    intro: 'VWU maintains JNTUK-recognised research centers across three departments, supervising Ph.D. scholars through a dedicated pool of research guides.',
    highlights: [
      '17 research guides supervising 35 Ph.D. scholars across ECE, EEE, CSE, AI, ME, and Basic Sciences',
    ],
    tableData: [
      { Department: 'Electronics and Communication Engineering', Status: 'Recognised 2019-20 & 2020-21, renewed through 2024-25' },
      { Department: 'Electrical and Electronics Engineering', Status: 'Recognised 2019-20 & 2020-21, renewed through 2024-25' },
      { Department: 'Computer Science Engineering', Status: 'Recognised 2019-20 & 2020-21, renewed through 2024-25' },
    ],
  },

  // ─── RESEARCH OUTPUT ───────────────────────────────────────────────────────
  {
    slug: 'thrust-areas-of-research',
    title: 'Thrust Areas of Research',
    category: 'output',
    icon: Target,
    desc: 'Focused research domains spanning computing & AI, electronics, electrical engineering, mechanical, civil, sciences, and humanities.',
    intro: 'VWU faculty pursue focused research across the following thrust areas, each backed by faculty specialising in that field and linked to their profiles on the institutional research information system (IRINS).',
    tableSections: [
      { title: 'Computing & AI', rows: [
        { Area: 'Machine Learning' }, { Area: 'Deep Learning' }, { Area: 'Data Mining' },
        { Area: 'Computer Networks' }, { Area: 'IoT' }, { Area: 'Data Science' },
      ] },
      { title: 'Electronics & Communication', rows: [
        { Area: 'Antennas' }, { Area: 'VLSI' }, { Area: 'Communication Systems' }, { Area: 'Signal & Image Processing' },
      ] },
      { title: 'Electrical Engineering', rows: [
        { Area: 'Control Systems' }, { Area: 'Power Electronics & Drives' }, { Area: 'Power Systems' }, { Area: 'Electrical Machines & Drives' },
      ] },
      { title: 'Mechanical Engineering', rows: [
        { Area: 'Metal Forming' }, { Area: 'Manufacturing' }, { Area: 'Nano Materials' }, { Area: 'Machine Design' }, { Area: 'Thermal Engineering' },
      ] },
      { title: 'Civil Engineering', rows: [
        { Area: 'Transportation Engineering & Management' },
      ] },
      { title: 'Science & Mathematics', rows: [
        { Area: 'Mathematics' }, { Area: 'Physics' }, { Area: 'Chemistry' },
      ] },
      { title: 'Humanities & Management', rows: [
        { Area: 'English Language Teaching' }, { Area: 'Finance & HRM' },
      ] },
    ],
  },
  {
    slug: 'funded-projects',
    title: 'Funded Projects',
    category: 'output',
    icon: IndianRupee,
    desc: '40+ funded research projects backed by DST, AICTE, DRDO, and the Ministry of Electronics & IT.',
    intro: 'VWU faculty have secured 40+ funded research projects, ongoing and completed, from agencies including DST, AICTE, DRDO, and the Ministry of Electronics & Information Technology.',
    highlights: [
      'Notable completed project: Rural Women Technology Park — ₹83,58,506 (DST)',
      'Notable completed project: Science Technology and Innovation Hub — ₹3,15,38,570 (DST)',
    ],
    tableData: [
      { 'Project Title': 'Memory-Optimized Co-Processing Unit for Enhanced Edge AI', PI: 'Dr. K Padma Vasavi', 'Amount (₹)': '64,55,000', Agency: 'Ministry of Electronics & IT' },
      { 'Project Title': 'Community Resilience Resource Centre (CRRC)', PI: 'Dr. S Hanumantha Rao', 'Amount (₹)': '1,24,88,182', Agency: 'DST' },
      { 'Project Title': 'NIDHI Technology Business Incubator', PI: 'Dr. G Srinivasa Rao', 'Amount (₹)': '4,69,68,000', Agency: 'DST' },
      { 'Project Title': 'CURIE Core Grant for Women PG Colleges', PI: 'Dr. G Srinivasa Rao', 'Amount (₹)': '58,23,360', Agency: 'DST' },
      { 'Project Title': 'AICTE IDEA Lab', PI: 'Dr. G Srinivasa Rao', 'Amount (₹)': '92,97,000', Agency: 'AICTE' },
    ],
  },
  {
    slug: 'seed-money-projects',
    title: 'Seed Money Projects',
    category: 'output',
    icon: Sprout,
    desc: 'In-house R&D funding letting faculty and students explore ideas, develop prototypes, and pursue external funding.',
    intro: 'VWU provides seed funding to faculty and students through in-house R&D initiatives, offering the chance to explore ideas, develop prototypes, and apply theoretical knowledge in practical settings.',
    highlights: [
      '2024-25 example: Smart Solar Aerator System for aquaculture (EEE)',
      '2024-25 example: Solar-based water pumping system using 15-level inverter (AI)',
      '2024-25 example: SiC and high-entropy alloy reinforced aluminum composites (ME)',
      '2024-25 example: Drone frames with lattice structures via additive manufacturing (ME)',
      '2022-23 example: Concrete canoe fabrication for competition (CE)',
      '2022-23 example: Welded aluminum alloy joint behaviour analysis (ME)',
      '2022-23 example: Water sample analysis initiatives (Basic Sciences)',
    ],
    tableData: [
      { Year: '2024-25', Projects: 4, 'Amount Sanctioned (₹)': '7,23,706' },
      { Year: '2023-24', Projects: 4, 'Amount Sanctioned (₹)': '2,46,530' },
      { Year: '2022-23', Projects: 5, 'Amount Sanctioned (₹)': '3,65,690' },
      { Year: '2021-22', Projects: 6, 'Amount Sanctioned (₹)': '2,62,483' },
    ],
  },
  {
    slug: 'research-publications',
    title: 'Research Publications',
    category: 'output',
    icon: BookOpen,
    desc: 'VWU faculty and students publish in indexed journals and present at international and national conferences year-round.',
    intro: 'VWU faculty and students have achieved remarkable success in publishing their research findings in various indexed journals, as well as presenting their work at esteemed international and national conferences.',
    highlights: [
      'Publication records maintained for 2020, 2021, 2022, 2023, 2024, and 2025',
    ],
  },
  {
    slug: 'patents',
    title: 'Patents',
    category: 'output',
    icon: Award,
    desc: 'Faculty across CSE, ECE, EEE, ME, CE, and IT are pioneering innovations through granted and published patents.',
    intro: 'VWU faculty are pioneering innovations through their patented technologies across multiple departments, with patents organised by year as either Granted or Published.',
    tableSections: [
      { title: '2024', rows: [
        { Patent: 'An IoT Garbage Segregator & Bin Level Indicator Device (Design Patent)', Inventors: 'Dr. V V R Maheswara Rao, Dr. G Durga Prasad, N Silpa, and others' },
        { Patent: 'Novel Display Design for Immersive Virtual Reality Systems (UK Design Patent)', Inventors: 'Dr. Kiran Sree Pokkuluri' },
        { Patent: 'Temperature and Humidity Sensor (UK Design Patent)', Inventors: 'M V Subbarao, Ms. Priya Maddipati, G Challa Ram, and others' },
      ] },
      { title: '2023', rows: [
        { Patent: 'A Counting Bloom Filter (granted in South Africa)', Inventors: 'Ramesh Babu Mallela' },
        { Patent: 'Paper Scanning Machine Based on Internet of Things (Design Patent)', Inventors: 'Dr. P. Kiran Sree and colleagues' },
      ] },
    ],
  },

  // ─── INDUSTRY & PROFESSIONAL ENGAGEMENT ───────────────────────────────────
  {
    slug: 'mous',
    title: 'MoUs',
    category: 'engagement',
    icon: Handshake,
    desc: 'Memoranda of understanding with 8 foreign universities and 60+ industry partners spanning technology, manufacturing, and consulting.',
    intro: 'VWU holds Memoranda of Understanding with leading foreign universities and industry partners, enabling student exchange, joint research, internships, and technology collaboration.',
    tableSections: [
      { title: 'Foreign Universities', rows: [
        { Partner: 'Purdue University' }, { Partner: 'The Pennsylvania State University' },
        { Partner: 'The State University of New York at Binghamton' }, { Partner: 'The University of New Brunswick' },
        { Partner: 'The University of Portland' }, { Partner: 'National Dong Hwa University, Taiwan' },
        { Partner: 'GC German Centre for Engineering and Management Studies UG, Aachen' }, { Partner: 'University of Bolton' },
      ] },
      { title: 'Industry Partners', rows: [
        { Partner: 'Pi Square Technologies India Pvt. Ltd.' }, { Partner: 'Taipei Economic and Cultural Centre in India' },
        { Partner: 'Banashree Semiconductors' }, { Partner: 'Banashree Renewable Energy System Pvt. Ltd.' },
        { Partner: 'Juniper Networks' }, { Partner: 'Microchip Technologies India Pvt. Ltd.' },
        { Partner: 'Movate Technologies Private Limited' }, { Partner: 'Zepco Technologies Private Limited' },
        { Partner: 'Capgemini Technology Services India Limited' }, { Partner: 'Lakshmi Precision Technologies Limited' },
        { Partner: 'Ambient Scientific' }, { Partner: 'T-Hub Foundation' },
        { Partner: 'Bosch Limited' }, { Partner: 'Automotive Research Association of India (ARAI)' },
        { Partner: 'Morris Garages' }, { Partner: 'Tech Mahindra Ltd.' },
        { Partner: 'IL Talentfarm LLP' }, { Partner: 'Swarna Bharat Trust, Atkur' },
        { Partner: 'Renault Nissan Technology & Business Center Pvt. Ltd.' }, { Partner: 'Aditya Birla Education Trust' },
        { Partner: 'SIFY Technologies Limited' }, { Partner: 'Zscaler Academic Alliance Program' },
        { Partner: 'QMAX Systems India (P) Ltd.' }, { Partner: 'Sabudh Foundation, Chandigarh' },
        { Partner: 'QualiZeal India (P) Ltd.' }, { Partner: 'Transheight Consultants Pvt. Ltd.' },
        { Partner: 'Verispire Inc., California (USA)' }, { Partner: 'EPAM Systems India Pvt. Ltd.' },
        { Partner: 'Infra Support Engineering Consultants Pvt. Ltd.' }, { Partner: 'Haritha TechLogix' },
        { Partner: 'Thriveni Earthmovers Private Limited' }, { Partner: 'Ahlada Engineers Limited' },
        { Partner: 'Apply Volt' }, { Partner: 'Andhra Pradesh State Skill Development Corporation (APSSDC) – UiPath Academic Alliance' },
        { Partner: 'CodeTantra Tech Solutions Pvt. Ltd.' }, { Partner: 'IDEALABS Future Tech. Ventures' },
        { Partner: 'L4G Solutions Pvt. Ltd.' }, { Partner: 'Epiroc Mining India Ltd.' },
        { Partner: 'Coursera Campus Partnership' }, { Partner: 'National Highways Authorities of India' },
        { Partner: 'Gama Ship Info Tech Pvt. Ltd.' }, { Partner: 'EduSkill Foundation' },
        { Partner: 'Talent Sprint Private Limited' }, { Partner: 'Volvo Group India Private Limited' },
        { Partner: 'Andhra Pradesh Innovation Society' }, { Partner: 'Vernnar Ceramics Limited' },
        { Partner: 'HiTech Print System Limited' }, { Partner: 'Smart Bridge Educational Services Private Limited' },
        { Partner: 'International School of Engineering (INSOFE)' }, { Partner: 'Dassault Systems 3D Experience Centre' },
        { Partner: 'Automation Anywhere' }, { Partner: 'International Crops Research Institute for the Semi-Arid-Tropics (ICRISAT)' },
        { Partner: 'Eleven01 Technologies' }, { Partner: 'Harita Techserv Ltd.' },
        { Partner: 'Sahajanand Laser Technology Ltd. (SLTL)' }, { Partner: 'Robert Bosch Engineering and Business Solutions Pvt. Ltd.' },
        { Partner: 'Anjani Portland Cement Ltd.' }, { Partner: 'Frenus Technologies Private Limited' },
        { Partner: 'Sekhar Infra Projects' }, { Partner: 'Artemi Semi Private Limited' },
        { Partner: 'Siliconus Private Limited' }, { Partner: 'Infotech Enterprises Ltd.' },
      ] },
      { title: 'Vishva TBI Partners', rows: [
        { Partner: 'Pimpiri Chinchwad Mahanagar Palika Divyang Bhavan Foundation' }, { Partner: 'BeAble Health Pvt Ltd.' },
        { Partner: 'Yogesh P R (Registered Patent Agent)' }, { Partner: 'Ant Factory Startup Advisory Services Private Limited (ANTHILL)' },
        { Partner: 'Real Time Angel Fund' }, { Partner: 'Marwari Catalysts Private Limited' },
        { Partner: 'Department for Promotion of Industry and Internal Trade' },
      ] },
    ],
  },
  {
    slug: 'consultancy',
    title: 'Consultancy',
    category: 'engagement',
    icon: Briefcase,
    desc: 'Faculty offer industrial consultancy services, providing innovative solutions and strategic insights across sectors.',
    intro: 'VWU faculty members offer industrial consultancy services, leveraging their expertise to provide innovative solutions and strategic insights across various sectors. Through these collaborative industry partnerships, VWU contributes to fostering growth, competitiveness, and technological progress.',
    highlights: [
      'Consultancy activity records maintained for 2020-21, 2021-22, 2022-23, and 2023-24',
    ],
  },
  {
    slug: 'professional-bodies',
    title: 'Professional Bodies',
    category: 'engagement',
    icon: UsersRound,
    desc: 'Student chapters of IEEE, ISTE, IETE, IET, SAE, ACM, CSI, ICI, ASCE, and more, connecting students to national and global professional networks.',
    intro: 'VWU hosts active student chapters of major professional bodies, giving students direct access to national and international technical communities.',
    tableData: [
      { Body: 'ISTE', Details: 'Indian Society for Technical Education — premier membership association for educators and education leaders' },
      { Body: 'IEEE', Details: "World's largest professional association dedicated to advancing technological innovation" },
      { Body: 'IETE', Details: 'Institution of Electronics and Telecommunication Engineers — founded 1953, 45,000+ members across 41 centers' },
      { Body: 'IET', Details: 'Established at VWU Nov 2018; ~200 students in the IET Hyderabad Local Network; Faculty Advisor: Dr. K. Kalyan Sagar (EEE)' },
      { Body: 'SAE', Details: 'Society of Automotive Engineers — established Sept 2015; grown from 55 to ~350 members; 72 SAE-India registrations in 2023-24' },
      { Body: 'ACM', Details: 'SVECW-ACM-W chapter (women-focused), Group ID 194312, focused on AI and women in computing' },
      { Body: 'CSI', Details: 'Computer Society of India — founded 1965; 70 chapters, 418 student branches, 90,000+ members nationally' },
      { Body: 'ICI', Details: 'Indian Concrete Institute — established 2019; Outstanding Student Chapter Award (2020, 2022, 2023), Best Student Chapter Award (2023)' },
      { Body: 'ASCE', Details: 'American Society of Civil Engineers — established 2024 (probationary status)' },
      { Body: 'IEEE CIS', Details: 'IEEE Computational Intelligence Society — Student Branch ID SBC08731A, focused on AI, ML, and intelligent systems' },
      { Body: 'IEEE PES', Details: 'IEEE Power and Energy Society — established Feb 2021, Chapter ID SBC08731, Advisor: Dr. S. Dileep Kumar Varma' },
    ],
  },
];

export function findResearchItemBySlug(slug: string): ResearchItem | null {
  return researchItems.find((i) => i.slug === slug) || null;
}
