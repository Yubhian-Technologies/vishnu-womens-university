// Structured copy for the AICTE IDEA Lab differentiator page (slug: aicte-idea-lab)

export interface IdeaLabProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface IdeaLabPillar {
  number: string;
  title: string;
  description: string;
}

export interface IdeaLabEquipmentItem {
  id: string;
  title: string;
  category: string;
}

export const aicteIdeaLab = {
  hero: {
    category: 'INNOVATION & ENTREPRENEURSHIP',
    title: 'AICTE IDEA Lab',
    tagline: 'Turn ideas into working prototypes through hands-on experimentation, design, fabrication and collaborative problem-solving.',
    ctaPrimary: 'Explore the IDEA Lab →',
    ctaSecondary: 'View Facilities →',
  },
  telemetry: [
    { value: 'IDEA202000128', label: 'AQIS Application ID' },
    { value: 'AICTE IDEA Lab', label: 'Approved Innovation Facility' },
    { value: 'Prototype & Fabrication', label: 'Learn Through Making' },
    { value: 'Green Innovation', label: 'Sustainable Engineering Practices' },
  ],
  overview: {
    title: 'From Idea to Prototype',
    paragraphs: [
      "The AICTE Idea Development, Evaluation & Application (IDEA) Lab at Vishnu Women's University provides a common space where students and faculty can develop concepts into functional prototypes.",
      'The lab complements classroom learning with practical experimentation, design thinking, fabrication and collaborative problem-solving. Students can explore ideas, test solutions and gain experience in approaching engineering challenges through making and iteration.',
      'Faculty members can also use the lab to support project-based learning, research exploration and interdisciplinary academic activities.',
    ],
  },
  process: {
    title: 'Learn. Build. Test. Improve.',
    intro: 'The IDEA Lab encourages students to move beyond theoretical understanding and engage with the complete process of developing a solution.',
    steps: [
      {
        number: '01',
        title: 'Explore an Idea',
        description: 'Identify problems, question assumptions and develop possible approaches.',
      },
      {
        number: '02',
        title: 'Design a Solution',
        description: 'Translate ideas into workable designs through discussion, planning and experimentation.',
      },
      {
        number: '03',
        title: 'Build & Prototype',
        description: 'Use available lab resources to create models, proof-of-concept solutions and prototypes.',
      },
      {
        number: '04',
        title: 'Test & Refine',
        description: 'Evaluate results, identify improvements and strengthen the proposed solution through iteration.',
      },
    ] as IdeaLabProcessStep[],
  },
  pillars: [
    {
      number: '01',
      title: 'Student Innovation',
      description: 'Provide students with an agile environment to develop ideas, experiment and engage meaningfully with project-based learning.',
    },
    {
      number: '02',
      title: 'Collaborative Learning',
      description: 'Encourage cooperation across disciplines and institutions through shared projects and knowledge exchange.',
    },
    {
      number: '03',
      title: 'Learn While Making',
      description: 'Create opportunities for students and faculty to understand concepts through practical experimentation and hands-on development.',
    },
    {
      number: '04',
      title: 'Faculty Engagement',
      description: 'Support faculty interaction with IDEA Labs, interdisciplinary networks and emerging approaches to experiential teaching.',
    },
    {
      number: '05',
      title: 'Research & Proof of Concept',
      description: 'Enable faculty and students to explore research ideas and develop early-stage proofs of concept.',
    },
    {
      number: '06',
      title: 'Sustainable Innovation',
      description: 'Encourage responsible use of resources and integrate environmentally conscious practices into lab activities.',
    },
  ] as IdeaLabPillar[],
  team: {
    title: 'People Behind the IDEA Lab',
    intro: 'The IDEA Lab is supported by academic leadership, faculty coordinators and technical mentors who guide its academic and prototyping activities.',
    contactNotice: 'For inquiries or collaborative lab activities, reach out to the official IDEA Lab coordinator desk.',
  },
  ambassadors: {
    title: 'Student Ambassadors',
    intro: 'Student Ambassadors help strengthen student participation in IDEA Lab activities by supporting peer engagement, communication and awareness of opportunities available through the lab.',
    contactNotice: 'For student ambassador inquiries or to connect with lab representatives, please contact the official IDEA Lab desk at idealab@svecw.edu.in.',
  },
  facilities: {
    title: 'Facilities for Making & Prototyping',
    paragraphs: [
      'The IDEA Lab brings together equipment and tools for prototyping, fabrication, measurement, testing and hands-on engineering practice.',
      'Students can use the facility to experiment with concepts, develop project components, create proof-of-concept models and refine prototypes as part of academic and innovation activities.',
    ],
    defaultEquipment: [
      { id: 'eq-1', title: '3D Printers & Additive Manufacturing', category: 'Digital Fabrication' },
      { id: 'eq-2', title: 'Laser Cutting & Engraving Unit', category: 'Precision Cutting' },
      { id: 'eq-3', title: 'CNC Router & Machining Station', category: 'Subtractive Fabrication' },
      { id: 'eq-4', title: 'PCB Design & Prototyping Station', category: 'Electronics Prototyping' },
      { id: 'eq-5', title: 'Embedded Systems & IoT Testbed', category: 'Measurement & Testing' },
      { id: 'eq-6', title: 'Soldering, Assembly & Inspection Bench', category: 'Hardware Assembly' },
    ] as IdeaLabEquipmentItem[],
  },
  officialInfo: {
    title: 'Official IDEA Lab Information',
    aqisId: 'IDEA202000128',
    institution: 'Shri Vishnu Engineering College for Women, Bhimavaram, West Godavari District, Andhra Pradesh',
    headOfInstitution: 'Dr. G. Srinivasa Rao',
    facultyCoordinators: ['Dr. P. Srinivasa Raju', 'Dr. S. Hanumantha Rao'],
    email: 'idealab@svecw.edu.in',
  },
  cta: {
    title: 'Explore Innovation at VWU',
    description: 'Discover the labs, centres and initiatives that extend learning beyond the classroom and support innovation, research and experiential education.',
    primaryBtn: 'Explore All Differentiators →',
    secondaryBtn: 'Explore Academics →',
  },
};

