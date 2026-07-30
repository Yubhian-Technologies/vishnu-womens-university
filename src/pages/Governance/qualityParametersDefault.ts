// Fallback content for the Quality Parameters item, sourced from
// https://svecw.edu.in/quality-parameters/. Firestore's governanceItems doc
// for this slug currently holds a generic, unrelated placeholder (a
// synthesized "NAAC seven criteria framework" summary plus fabricated
// "Outcomes & Achievements" cards) instead of the actual A/B/C/D parameter
// checklist from the source site — so GovernanceDetail.tsx always overrides
// item.intro/item.about and suppresses item.outcomes for this slug until an
// admin replaces them with real content.
export const DEFAULT_QUALITY_PARAMETERS_INTRO = 'Various parameters are considered for Quality enhancement and monitoring of those parameters is done through monthly reports. Some of the important parameters considered by IQAC for implementation in SVECW are as follows:';

export interface QualityParameterCategory {
  key: string;
  title: string;
  items: string[];
}

export const QUALITY_PARAMETER_CATEGORIES: QualityParameterCategory[] = [
  {
    key: 'quality-education',
    title: 'A. Quality Education',
    items: [
      'Student centric teaching methodology in the class by faculty',
      'ICT facilities used in the class by the faculty',
      'Uploading the information in e-learning sites by the faculty',
      'Conduction of tutorials properly',
      'Conducting course coordinators meetings regularly for uniformity',
      'Conducting Workshops every Semester related to Core subjects',
      'Procurement of library books',
      'Quality of assignments and question papers',
      'Lesson plan verification by HOD',
      'Updating of attendance in automation System E-Cap',
      'Analysis and follow up action on internal exam of students',
      'Conducting a faculty meeting every month',
      'Conducting a staff meeting every month',
      'Conduction of Seminars & GDs',
      'Meetings conducted by various committees in which students are members',
      'Participation of students in sports & other hobby clubs',
      'Conducting counseling periodically',
      'Professional society activities',
    ],
  },
  {
    key: 'academic-infrastructure',
    title: 'B. Academic Infrastructure',
    items: [
      'Smart class rooms fosters better teaching and learning',
      'Latest technologies for active involvement of learners in state of the art labs',
      'Developing centers of excellence to share competencies and building capacities',
      'Acquiring, accessibility and preserving information in library',
      'Modern auditoriums to promote all-round development of learners',
      'Making available the materials needed for achieving ones goals in campus book stores',
      'Uninterrupted high-speed internet connectivity through Wi-Fi',
      'Developing communication skills and community interface through Radio Vishnu 90.4',
      'A channel for nurturing creative and academic abilities through Vishnu TV Academy',
      'Campus hostels for safe, secure and conducive learning environment',
      'Satiating different tastes through food courts',
      'Achieving overall health and happiness at Vishnu Fitness Centre',
      'Staff quarters for providing comfortable living environment',
    ],
  },
  {
    key: 'placements-industry',
    title: 'C. Placements / Industry-Related Activities',
    items: [
      'T A P cell to provide campus recruitment training',
      'T A P team interfaces with industry',
      'Career guidance cell exposes and explores varied career & higher education opportunities',
      'Campus recruitment training honing the employability skills',
      'Mission R&D develop and support promising students careers in product development',
      'Synergizing institution industry and government through IEG :: JKC Star',
      'Enhancing the pool of competent IT professionals in Campus Connect',
      'Guest lectures by industrial experts expose the students to knowledge beyond the curriculum',
      'Industrial visits and tours aim at practical exposure to organizations',
    ],
  },
  {
    key: 'research-development',
    title: 'D. Research & Development',
    items: [
      'Continuous research and development at Vishnu R&D Center',
      "Faculty publications aim disseminate one's research",
      'Student publications aid encourage students for further research',
      'Researching through sponsored and sanctioned projects',
      'Exposure to cutting edge technologies and latest developments through international conferences',
      'Problem solving and revenue generation by extending consultancy services',
      'Innovation, Incubation and Entrepreneurship cell to encourage enterprising activities',
      'Faculty deputed to Workshops / Seminars / Conferences for up gradation of knowledge',
    ],
  },
];
