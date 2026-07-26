export interface SkillCategory {
  title: string;
  items: string[];
}

export interface SkillTab {
  label: string;
  intro?: string;
  categories: SkillCategory[];
}

export const employabilitySkillTabs: SkillTab[] = [
  {
    label: 'Essential Employability Skills',
    categories: [
      {
        title: 'Foundational Skills',
        items: [
          'Be organized',
          'Arrive to work on time, or early',
          'Be dependable',
          'Have a positive attitude toward work',
          'Exert high levels of effort and perseverance',
          'Complete tasks on time and accurately',
          'Seek out information to improve skills',
          'Be flexible and adaptable',
          'Complete all tasks, even if unpleasant',
          'Understand dress code or uniform guidelines',
          'Maintain personal hygiene',
        ],
      },
      {
        title: 'Interpersonal Skills',
        items: [
          'Be friendly and polite',
          'Respect supervisors and coworkers',
          'Respond appropriately to customer requests',
          'Ask for feedback',
          'Take constructive criticism',
          'Resolve conflicts calmly and appropriately',
        ],
      },
      {
        title: 'Communication Skills',
        items: [
          'Read and understand written materials',
          'Listen, understand, and ask questions',
          'Follow directions',
          'Express ideas clearly when speaking or writing',
          'Learn required technology and use appropriately',
        ],
      },
      {
        title: 'Problem Solving and Critical Thinking',
        items: [
          'Accept change',
          'Be willing to start, stop, and switch duties',
          'Work calmly in busy environments',
          'Start tasks without prompting',
          'Ask questions to solve problems do better',
        ],
      },
      {
        title: 'Teamwork',
        items: [
          'Be comfortable working with people of diverse backgrounds',
          "Be sensitive to other peoples' needs",
          'Take responsibility for own share of work',
          'Contribute to team goals',
        ],
      },
      {
        title: 'Ethics and Legal Responsibilities',
        items: [
          'Take responsibility for own decisions and actions',
          'Understand and follow company rules and procedures',
          'Be honest and trustworthy',
          'Act professionally and with maturity',
        ],
      },
    ],
  },
  {
    label: 'Professional Skills',
    intro: 'The general employability skills above help you to get hired and to keep any job. In addition, anyone who wants to advance in their careers and people working in higher-level jobs should have the following professional skills.',
    categories: [
      {
        title: 'Career Development',
        items: [
          'Learn new skills and take on different projects',
          'Serve on work committees',
          'Take initiative and work with little supervision',
          'Understand your industry and common business practices',
          'Align your work goals with the mission and vision of your employer',
          'Understand the different roles of coworkers',
        ],
      },
      {
        title: 'Leadership',
        items: [
          'Coach and mentor others',
          'Be willing to take risks',
          'Be able to negotiate',
          'Motivate and direct people as they work',
          'Demonstrate efficiency',
          'Seek to simplify processes',
          'Save time or money for the company by analyzing business needs',
          'Build partnerships and teams with coworkers',
        ],
      },
    ],
  },
];
