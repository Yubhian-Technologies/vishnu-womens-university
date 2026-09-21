// Structured copy for the MEDA & PLM Centre of Excellence differentiator page (slug: meda-plm-coe)

export interface MedaSoftwarePlatform {
  name: string;
  description: string;
}

export interface MedaGlanceItem {
  title: string;
  subtitle: string;
}

export const medaPlmCoe = {
  hero: {
    category: 'INDUSTRY CENTRES OF EXCELLENCE',
    title: 'MEDA & PLM Centre of Excellence',
    subtitle:
      'Advancing mechanical engineering education through industry-relevant training in Mechanical Engineering Design Automation (MEDA) and Product Lifecycle Management (PLM), supported by specialised software platforms and Capgemini collaboration.',
  },
  glance: [
    { title: 'MEDA', subtitle: 'Mechanical design, modelling and analysis' },
    { title: 'PLM', subtitle: 'Product lifecycle and engineering data management' },
    { title: 'Industry Collaboration', subtitle: 'Capgemini' },
    { title: 'Core Platforms', subtitle: 'CATIA · Siemens NX CAD · ANSYS · Siemens Teamcenter' },
  ] as MedaGlanceItem[],
  collaboration: {
    title: 'Industry Collaboration with Capgemini',
    paragraphs: [
      'Shri Vishnu Engineering College for Women (SVECW) has entered into a Memorandum of Understanding with Capgemini to strengthen industry-oriented learning for Mechanical Engineering students.',
      'Through the collaboration, students receive structured exposure to mechanical design automation, engineering analysis and product lifecycle management, supported by technical training, workshops and industry interaction.',
    ],
  },
  meda: {
    heading: 'Mechanical Engineering Design Automation (MEDA)',
    intro:
      'The MEDA module develops practical competencies in mechanical design, modelling, engineering analysis and manufacturing-oriented design.',
    softwarePlatformsHeading: 'Software Platforms',
    softwarePlatforms: [
      { name: 'CATIA', description: '3D modelling, assembly design and drafting.' },
      { name: 'Siemens NX CAD', description: 'Parametric modelling, sheet-metal design and surface modelling.' },
      { name: 'ANSYS', description: 'Finite element analysis for structural, thermal and related engineering applications.' },
    ] as MedaSoftwarePlatform[],
    learningAreasHeading: 'Key Areas of Learning',
    learningAreas: [
      'Mechanical design and modelling fundamentals',
      'Assembly modelling and constraints',
      'Geometric dimensioning and tolerancing (GD&T)',
      'Reverse engineering and design optimisation',
      'Finite element analysis',
      'Design for manufacturing and assembly (DFM/DFA)',
      'Introductory CAD automation using scripting and macros',
    ],
    closing:
      'The concepts connects classroom engineering concepts with tool-based design and analysis practices used in professional environments.',
  },
  plm: {
    heading: 'Product Lifecycle Management (PLM)',
    intro:
      'The PLM module introduces students to the management of product information, engineering processes and collaboration across the product lifecycle, from design and development to manufacturing and support.',
    trainingHeading: 'Training includes:',
    trainingItems: [
      'Fundamentals of Product Lifecycle Management',
      'Product structures and Bill of Materials (BOM)',
      'Engineering change management',
      'Configuration and release control',
      'Workflow and cross-functional collaboration',
      'Product data and document management',
      'Version control and traceability',
      'Integration of PLM systems with CAD platforms',
    ],
    teamcenter: {
      heading: 'Siemens Teamcenter',
      description:
        'Students gain exposure to Siemens Teamcenter as a PLM platform for managing product data, documentation, workflows and engineering change processes.',
    },
  },
  outcomes: {
    heading: 'Learning Outcomes & Opportunities',
    intro:
      'Through the MEDA and PLM programmes, students gain structured exposure to industry-oriented engineering tools, workflows and problem-solving approaches.',
    opportunitiesHeading: 'The collaboration provides opportunities for:',
    opportunities: [
      'Technical mentoring and interaction with industry professionals',
      'Hands-on workshops and project-based learning',
      'Development of design, analysis and product-data-management skills',
      'Application of engineering concepts using professional software platforms',
      'Exposure to internship and placement initiatives associated with the industry partnership',
    ],
    closing:
      'This approach strengthens the connection between academic learning and contemporary engineering practice.',
  },
  cta: {
    heading: 'Explore More Differentiators',
    subtitle:
      'Discover the centres, laboratories and initiatives that strengthen experiential learning, industry engagement and innovation at VWU.',
    primaryBtn: 'Explore All Differentiators →',
    secondaryBtn: 'Explore Academics →',
  },
};
