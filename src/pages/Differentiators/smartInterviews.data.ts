// Rich content definition & defaults for the Smart Interviews – C&DS Programme
// differentiator page (slug: smart-interviews).

export interface SmartInterviewsPhase {
  label: string;
  content: string;
}

export interface SmartInterviewsBatch {
  years: string;
  count: string;
}

export interface CustomSmartInterviewsSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface SmartInterviewsDoc {
  // 1. Top Hero Banner
  heroBadge?: string;
  pageTitle?: string;
  heroSubtitle?: string;

  // 2. Section 1: Hero Overview Block (Dark Navy)
  aboutTag?: string;
  aboutTitle?: string;
  aboutTitleBlue?: string;
  aboutDesc?: string;
  paragraphs?: string[];
  aboutKeywords?: string;
  pathTag?: string;
  codeComments?: string;
  aboutTagline?: string;

  // 4 Metric Cards
  metricPhasesValue?: string;
  metricPhasesLabel?: string;
  metricPhasesSubtext?: string;
  metricSemestersValue?: string;
  metricSemestersLabel?: string;
  metricSemestersSubtext?: string;
  metricStudentsValue?: string;
  metricStudentsLabel?: string;
  metricStudentsSubtext?: string;
  metricMentorshipLabel?: string;
  metricMentorshipSubtext?: string;

  // 3. Section 2: Training Phases Roadmap
  roadmapTag?: string;
  roadmapTitle?: string;
  roadmapRightTag?: string;
  phases: SmartInterviewsPhase[];

  // 4. Section 3: Navigation Grid (Accordion items)
  details02Title?: string;
  moreParagraphs: string[];

  batchesHeading?: string;
  batchesSubHeading?: string;
  batches: SmartInterviewsBatch[];

  highlightsTitle?: string;
  highlightsContent?: string;
  highlightsList?: string[];

  facilitiesTitle?: string;
  facilitiesContent?: string;

  outcomesTitle?: string;
  outcomesContent?: string;

  partnersTitle?: string;
  partnersContent?: string;

  // 5. Section 4: Highlight Stats Banner
  bannerCol1Line1?: string;
  bannerCol1Line2?: string;
  bannerStatNum?: string;
  bannerStatLabel?: string;
  bannerStatDesc?: string;
  bannerCol3Text?: string;

  // 6. Section 5: Dynamic Custom Sections
  additionalSections?: CustomSmartInterviewsSection[];

  // 7. Section 6: University CTA Banner
  ctaTag?: string;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaTechBox?: string;
  ctaKeywords?: string;
}

export const smartInterviews: SmartInterviewsDoc = {
  // 1. Top Hero Banner
  heroBadge: 'STUDENT EMPLOYMENT & PLACEMENT',
  pageTitle: 'Smart Interviews – C&DS Programme',
  heroSubtitle:
    'Intensive Data Structures and Algorithms training empowering students with advanced problem-solving skills to secure high-value tech placements at top global product companies.',

  // 2. Section 1: Hero Overview Block
  aboutTag: 'CAREER PREPARATION',
  aboutTitle: 'Smart',
  aboutTitleBlue: 'Interviews',
  aboutDesc:
    'The curriculum spans three phases across three semesters: Phase 1 covers programming fundamentals and complexity analysis; Phase 2 addresses sorting, hashing, and string operations; Phase 3 focuses on advanced data structures including trees, dynamic programming, and graph theory. Up to 400 students are selected annually via HackerRank coding contests, and students are mentored by previously placed graduates.',
  paragraphs: [
    'Shri Vishnu Engineering College for Women in collaboration with Smart Interviews Conducting a High-End Programming Development Training called as Problem Solving with Data Structures and Algorithms (C&DS) since 2017 for the students. Today all Product Based MNC Companies looking for good programmers for development of software products so they were coming with coding contests and hackathons to recruit graduates.',
    'We are in SVECW motivating students to participate in all the coding contests by doing lot of practice along with the smart interviews training sessions. Many of Our SVECW Students Placed with high pay package ranging from 10 Lakh to 50 Lakh per Annum from Top Tech Companies like Amazon, Flipkart, Adobe, Paloalto etc... This training program divided into three different phases they are listed below',
  ],
  aboutKeywords: 'PRACTICE / PROBLEM SOLVE / GET PLACED',
  pathTag: 'A STRUCTURED PATH\nFROM LEARNING TO PLACEMENT',
  codeComments: '// CODE\n// LEARN\n// GROW\n// SUCCEED',
  aboutTagline: 'SAME LEARNERS. BIGGER TOMORROWS.',

  metricPhasesValue: '3',
  metricPhasesLabel: 'PHASES',
  metricPhasesSubtext: 'Structured curriculum for complete preparation',
  metricSemestersValue: '3',
  metricSemestersLabel: 'SEMESTERS',
  metricSemestersSubtext: 'Progressive learning across core and advanced topics',
  metricStudentsValue: '400',
  metricStudentsLabel: 'STUDENTS ANNUALLY',
  metricStudentsSubtext: 'Selected via HackerRank coding contests',
  metricMentorshipLabel: 'MENTORSHIP',
  metricMentorshipSubtext: 'Guided by previously placed graduates',

  // 3. Section 2: Training Phases Roadmap
  roadmapTag: 'LEARNING ROADMAP',
  roadmapTitle: 'Training Phases',
  roadmapRightTag: 'BUILDING PROBLEM SOLVERS FOR TOMORROW',
  phases: [
    {
      label: 'Phase-1:',
      content:
        'Basics of Programming, Data types & operators, Complexity Analysis, Bit-Manipulation & Applications, Recursion / Backtracking.',
    },
    {
      label: 'Phase-2:',
      content:
        'Sorting / Searching Techniques & Applications, Hashing Implementation & Libraries, Subarrays & Subsequence’s, Strings & Rolling Hash, Mixed-bag Concepts.',
    },
    {
      label: 'Phase-3:',
      content:
        'Stacks & Queues, Linked Lists, LRU Cache, Trees / Binary Trees / Binary Search Trees, Priority Queues, Trie DS & Applications, Dynamic Programming, Graph Theory.',
    },
  ],

  // 4. Section 3: Navigation Grid (Accordion items)
  details02Title: 'Program Details',
  moreParagraphs: [
    'Every year we are selecting a maximum of 400 students from all the branches by conducting a coding contest of 2 to 3 hours in Hackerrank online platform. Smart Interviews trainers will give training in 3 phases like II Year II Semester 6 classes, III Year I Semester 10 classes and III Year II Semester 10 classes. The complete program is of 26 classes in 3 semesters.',
    'We encourage and motivate students to participate in different coding contests conducted by different organizations like TCS (Code Vita), Infosys (Hack with Infy) etc. and also platforms like code chef (Seasonal Contests) and codeforces.',
    'As we are continuously monitoring the score sheets of each batch, we can identify the performance of each student in solving problems. In between the training program schedule, we used to conduct the practice sessions for the students to better understand and to solve set of problems to excel in different languages like C, C++, JAVA and Python.',
    'Based on the leader board scores target were fixed and students will reach the given target scores based on the performance. Our college management will give financial support to the students in participation of coding contests like ACM-ICPC etc.',
    'Students of VWU will come up with optimized better solutions for the problems through which they can understand different set of questions they may get in the interview process through online coding contests.',
    'All these students were placed at the end of the program with good pay package this process we are doing from the past 7 years. Every year the package and number of placements with good package is improving. We are encouraging students of final year who placed in good companies with good packages will be coming and explaining the interview experience and types of questions interviewer is asking all will be discussed, by which all the students of next years were benefitted.',
  ],

  batchesHeading: 'Training (3-Phases) Completed & Placed students Batch wise with high packages.',
  batchesSubHeading: 'Placements Batch Wise (10 LPA – 50 LPA):',
  batches: [
    { years: '2020-2024', count: '142' },
    { years: '2019-2023', count: '95' },
    { years: '2018-2022', count: '174' },
    { years: '2017-2021', count: '209' },
    { years: '2016-2020', count: '155' },
    { years: '2015-2019', count: '161' },
    { years: '2014-2018', count: '36' },
  ],

  highlightsTitle: 'Key Highlights',
  highlightsContent:
    'High success rates in top product companies (Amazon, Flipkart, Adobe, Palo Alto Networks).\nHigh pay packages ranging from 10 Lakh to 50 Lakh per Annum from Top Tech Companies.\nCollege financial sponsorship for students in participation of competitive coding contests like ACM-ICPC.\nActive peer mentorship by placed final-year seniors explaining interview experiences and question patterns.\nContinuous 7-year successful track record running since 2017.\n972 total placements across seven batches (2014–2024).\nComprehensive 3-phase training program comprising 26 classes across 3 semesters with continuous performance tracking.',
  highlightsList: [
    'High success rates in top product companies (Amazon, Flipkart, Adobe, Palo Alto Networks).',
    'High pay packages ranging from 10 Lakh to 50 Lakh per Annum from Top Tech Companies.',
    'College financial sponsorship for students in participation of competitive coding contests like ACM-ICPC.',
    'Active peer mentorship by placed final-year seniors explaining interview experiences and question patterns.',
    'Continuous 7-year successful track record running since 2017.',
    '972 total placements across seven batches (2014–2024).',
    'Comprehensive 3-phase training program comprising 26 classes across 3 semesters with continuous performance tracking.',
  ],

  facilitiesTitle: 'Facilities & Equipment',
  facilitiesContent:
    'High-speed computing labs, online contest platforms (HackerRank, CodeChef, Codeforces), automated leaderboard evaluation systems, and dedicated interactive training centers.',

  outcomesTitle: 'Outcomes & Achievements',
  outcomesContent:
    'Over 970+ students placed in top MNCs over the past 7 years with salary packages ranging from 10 LPA up to 50 LPA.',

  partnersTitle: 'Partners',
  partnersContent:
    'Smart Interviews, HackerRank, TCS (CodeVita), Infosys (HackWithInfy), CodeChef, and Codeforces.',

  // 5. Section 4: Highlight Stats Banner
  bannerCol1Line1: 'TALENT TODAY',
  bannerCol1Line2: 'OPPORTUNITIES TOMORROW',
  bannerStatNum: '400',
  bannerStatLabel: 'STUDENTS ANNUALLY',
  bannerStatDesc:
    'Selected via HackerRank coding contests, and students are mentored by previously placed graduates.',
  bannerCol3Text: 'SKILLS\nOPPORTUNITIES\nGLOBAL CAREERS',

  // 6. Section 5: Dynamic Custom Sections
  additionalSections: [],

  // 7. Section 6: University CTA Banner
  ctaTag: 'YOUR NEXT OPPORTUNITY AWAITS',
  ctaTitle: 'Explore More Differentiators',
  ctaDesc:
    'Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.',
  ctaButtonText: 'All Differentiators',
  ctaButtonLink: '/differentiators',
  ctaTechBox: 'BETTER\nLEARNERS\nBRIGHTER\nFUTURES',
  ctaKeywords: 'LEARN\nEXPLORE\nGROW\nBELONG',
};
