export const EXPERIENTIAL_LEARNING_INTRO = `The most significant component at Vishnu Women's University (VWU) is experiential learning by giving students hands-on learning opportunities. Thus we are able to expand the function of classroom learning and add to a dynamic educational experience. Experiential learning assists in career development by providing a rational, day-to-day view of various professions, industries, laboratories, and organizations. All experiential learning activities at VWU share one common goal: providing a "hands-on" experience outside of the classroom.`;

export interface OtherPracticeItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  bullets?: string[];
  order: number;
}

export const DEFAULT_OTHER_PRACTICES: OtherPracticeItem[] = [
  {
    id: 'practice-1',
    title: 'Lectures',
    icon: 'Presentation',
    desc: 'The lectures conducted for every course aim at infusing and developing analytical, conceptual, communication, and application-oriented skills in students. Classrooms and lecture halls are well equipped with modern teaching aids like multimedia projectors and computers with Wi-Fi connectivity to make teaching interactive. Simulated teaching software helps students understand processes in a highly visualized form.',
    order: 1,
  },
  {
    id: 'practice-2',
    title: 'Tutorials',
    icon: 'Users',
    desc: 'Tutorials are small group teaching methods that provide opportunities for students to discuss, debate, quiz, and revise their understanding of various subjects with classmates. A dedicated tutor assesses them as a group and clarifies doubts using simple, effective, and accessible methods.',
    order: 2,
  },
  {
    id: 'practice-3',
    title: 'Case-Based Teaching',
    icon: 'BookOpen',
    desc: 'This method connects theoretical concepts with the contemporary corporate world. Relevant cases are provided in advance for students to come prepared for classroom analysis and discussion, encouraging the application of concepts for problem solving and decision making.',
    order: 3,
  },
  {
    id: 'practice-4',
    title: 'Innovative & Relevant Practical Sessions',
    icon: 'FlaskConical',
    desc: 'Challenging experiments are furnished to stimulate creativity among students. Students deliver presentations on innovative practical work followed by open-house viva sessions to illustrate their findings and interpretations.',
    order: 4,
  },
  {
    id: 'practice-5',
    title: 'Web & Digital Networking',
    icon: 'Globe',
    desc: 'Students are motivated to utilize digital platforms and professional networks to expand their knowledge horizons and establish industry contacts essential for securing summer internships, live projects, guest lectures, and seminars.',
    order: 5,
  },
  {
    id: 'practice-6',
    title: 'Field Trips & Industry Exposure',
    icon: 'Bus',
    desc: 'Continuous site and organizational visits pertaining to students\' professional disciplines allow them to experience real-world workplace demands, conceiving the realistic nature and practical dynamics of their chosen careers.',
    order: 6,
  },
  {
    id: 'practice-7',
    title: 'Bulletin Boards',
    icon: 'ClipboardList',
    desc: 'Each department facilitates bulletin boards where students curate newspaper clippings, journal articles, periodicals, and creative works. This captures peer attention, communicates key technical topics, and is evaluated through class discussions and feedback.',
    order: 7,
  },
  {
    id: 'practice-8',
    title: 'Media Watch',
    icon: 'Tv',
    desc: 'Helps students acquire global awareness by following news outlets, TV, magazines, and digital media. Formed student groups collect relevant news clippings, display them on notice boards with critical comments, and lead discussions on current events.',
    order: 8,
  },
  {
    id: 'practice-9',
    title: 'Brainstorming Sessions',
    icon: 'Brain',
    desc: 'Systematic brainstorming sessions train students to solve complex problems with logical and creative thinking without fear of criticism.',
    bullets: [
      'Develop creative thinking and voice innovative ideas free from criticism or ridicule.',
      'Examine complex issues from multi-dimensional perspectives.',
      'Identify core problems and solicit diverse ideas irrespective of initial feasibility.',
      'Evaluate all possibilities and present logical, proposal-backed solutions.',
    ],
    order: 9,
  },
  {
    id: 'practice-10',
    title: 'Mock Interviews',
    icon: 'Target',
    desc: 'Regular mock interview sessions recreate a virtual corporate environment to prepare students for real industry panel interviews. Audio-visually recorded sessions allow expert panelists—comprising experienced faculty and industry experts—to provide personalized feedback on competitive strengths and areas of improvement.',
    order: 10,
  },
  {
    id: 'practice-11',
    title: 'Internships',
    icon: 'Briefcase',
    desc: 'Students are commissioned to work with reputed organizations and corporate partners within their professional fields, completing dedicated live projects and gaining essential workplace experience throughout the internship duration.',
    order: 11,
  },
  {
    id: 'practice-12',
    title: 'Practical Projects',
    icon: 'Rocket',
    desc: 'Group project work forms a central pillar of active learning. Students select domain-specific projects, conduct practical and real-world studies, and convert theoretical knowledge into functional written and physical solutions through effective teamwork.',
    order: 12,
  },
];
