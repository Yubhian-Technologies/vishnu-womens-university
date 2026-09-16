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
    intro: 'These core skills support effective participation in the workplace and form the foundation for continued professional development.',
    categories: [
      {
        title: 'Foundational Skills',
        items: [
          'Organise work and manage time effectively',
          'Demonstrate reliability and accountability',
          'Adapt to changing tasks and workplace expectations',
          'Complete work accurately and within timelines',
          'Take initiative to learn and improve',
          'Maintain appropriate professional standards',
        ],
      },
      {
        title: 'Interpersonal Skills',
        items: [
          'Build respectful professional relationships',
          'Listen to and respond constructively to feedback',
          'Communicate appropriately with colleagues and stakeholders',
          'Manage disagreements professionally',
          'Respect different perspectives and ways of working',
        ],
      },
      {
        title: 'Communication Skills',
        items: [
          'Listen actively and ask relevant questions',
          'Communicate ideas clearly in speech and writing',
          'Read and interpret workplace information effectively',
          'Present information with clarity and confidence',
          'Use appropriate digital communication tools',
        ],
      },
      {
        title: 'Problem-Solving & Critical Thinking',
        items: [
          'Analyse situations before making decisions',
          'Identify practical solutions to problems',
          'Adapt to changing circumstances',
          'Take initiative when appropriate',
          'Work effectively under pressure',
          'Learn from feedback and outcomes',
        ],
      },
      {
        title: 'Teamwork',
        items: [
          'Collaborate effectively with people from different backgrounds',
          'Take responsibility for individual contributions',
          'Support shared goals and team outcomes',
          'Communicate openly within a team',
          'Respect different ideas and working styles',
        ],
      },
      {
        title: 'Professional Ethics & Responsibility',
        items: [
          'Act with honesty and integrity',
          'Take responsibility for decisions and actions',
          'Follow organisational policies and professional standards',
          'Handle information responsibly',
          'Demonstrate maturity and professional judgement',
        ],
      },
    ],
  },
  {
    label: 'Professional Skills',
    intro: 'Professional growth also depends on initiative, leadership, continuous learning and the ability to contribute effectively within an organisation.',
    categories: [
      {
        title: 'Career Development',
        items: [
          'Continue building new knowledge and professional skills',
          'Take initiative and contribute to different projects',
          'Understand industry expectations and workplace practices',
          'Seek opportunities for learning, feedback and professional growth',
          'Work independently when required while collaborating effectively with others',
          'Understand different roles and responsibilities across teams',
        ],
      },
      {
        title: 'Leadership Skills',
        items: [
          'Support and mentor others where appropriate',
          'Communicate clearly when coordinating people or tasks',
          'Make responsible decisions and take ownership of outcomes',
          'Negotiate and resolve differences constructively',
          'Encourage collaboration and shared accountability',
          'Identify opportunities to improve processes and ways of working',
          'Build productive professional relationships',
        ],
      },
    ],
  },
];
