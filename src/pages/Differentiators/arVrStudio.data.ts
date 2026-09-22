// Rich hardcoded content for the AR / VR Studio differentiator page
// (slug: ar-vr-studio) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx and ArVrStudio.tsx.

export interface ArVrFacultyInCharge {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
}

export interface TechInfrastructure {
  category: string;
  items: string[];
}

export interface ConceptExperience {
  title: string;
  desc: string;
}

export interface FormattedObjective {
  code: string;
  title: string;
  desc: string;
}

export const arVrStudio = {
  heroCategory: 'RESEARCH & SPECIALISED LABS',
  heroTitle: 'AR / VR Studio',
  heroSubtitle:
    'Transforming ideas into immersive experiences through hands-on learning, design, development, and experimentation in Augmented and Virtual Reality.',

  aboutTitle: 'ABOUT THE STUDIO',
  aboutParagraphs: [
    'The AR / VR Studio provides students with a dedicated environment to explore, design, and develop immersive applications using technologies such as Unity, Unreal Engine, and Blender. The Studio combines technical learning with hands-on experimentation, helping students understand how augmented and virtual reality experiences are conceptualised, created, tested, and refined.',
    'Students can apply these skills through projects, workshops, hackathons, and interdisciplinary learning experiences, with opportunities to explore AR/VR applications in areas such as education, healthcare, training, simulation, and community-focused solutions.',
    'By encouraging project development, industry interaction, research, and innovation, the Studio helps students move beyond consuming immersive technology to becoming creators of interactive digital experiences.',
  ],

  visionTitle: 'Our Vision',
  vision:
    'To build a vibrant hub for immersive technology where students and researchers explore, create, and innovate through Augmented and Virtual Reality.',

  missionTitle: 'Our Mission',
  mission: [
    'Provide students with practical training, tools, and resources in Augmented and Virtual Reality technologies.',
    'Connect academic learning with real-world applications through projects, workshops, hackathons, and interdisciplinary collaboration.',
    'Encourage creativity, experimentation, research, and problem-solving through immersive technology development.',
    'Build meaningful connections with industry and other knowledge partners to strengthen student exposure and application-oriented learning.',
  ],

  objectivesTitle: 'Objectives',
  objectivesFormatted: [
    {
      code: '01',
      title: 'Build Technical Capability',
      desc: 'Develop practical proficiency in AR/VR development tools and platforms, including Unity, Unreal Engine, and Blender.',
    },
    {
      code: '02',
      title: 'Enable Experiential Learning',
      desc: 'Engage students in application development, projects, workshops, hackathons, and prototype creation.',
    },
    {
      code: '03',
      title: 'Explore Real-World Applications',
      desc: 'Encourage the development of immersive solutions for domains such as education, healthcare, training, simulation, and community development.',
    },
    {
      code: '04',
      title: 'Strengthen Industry Exposure',
      desc: 'Facilitate interaction with industry and technology partners to support mentorship, applied learning, internships, and career awareness.',
    },
    {
      code: '05',
      title: 'Encourage Research & Innovation',
      desc: 'Support research-oriented projects, publications, intellectual property development, and experimentation in immersive technologies.',
    },
  ] as FormattedObjective[],

  galleryTitle: 'Immersive Learning in Action',
  galleryCaption: 'Students exploring, building, and experiencing AR/VR technologies inside the Studio.',

  techInfrastructure: {
    title: 'Technology & Infrastructure',
    groups: [
      {
        category: 'Immersive Devices',
        items: [
          '2 Meta Quest 3 128 GB VR headsets',
          '2 Samsung Galaxy Tab S7 FE devices',
        ],
      },
      {
        category: 'High-Performance Computing',
        items: [
          '30 high-performance desktop systems',
          'Intel Core i7 13th Gen processors, 16 GB RAM, 512 GB storage, and dedicated graphics',
          '2 high-configuration dedicated systems with 32 GB RAM and 16 GB graphics',
          '2 macOS systems',
        ],
      },
      {
        category: 'Display & Projection',
        items: [
          '65-inch Sony 4K display',
          '2K and 4K projection facilities',
          'Sony 5.1 surround-sound system',
        ],
      },
      {
        category: 'Development Environment',
        items: [
          'Unity',
          'Unreal Engine',
          'Blender',
          'Licensed Unity environment for 30 systems, where currently applicable',
        ],
      },
    ] as TechInfrastructure[],
  },

  contact: {
    title: 'Connect with the AR / VR Studio',
    name: 'AR/VR Studio',
    address: [
      'Shri Vishnu Engineering College for Women',
      'Vishnupur, Bhimavaram, Andhra Pradesh, India',
    ],
    email: 'avrcoe@svecw.edu.in',
    phone: '+91-9948055566',
    website: 'https://www.svecw.edu.in',
  },

  keyHighlights: [
    'Centre of Excellence established in August 2024',
    'Hands-on learning in Augmented, Virtual and Extended Reality technologies',
    'Application development using Unity, Unreal Engine and Blender',
    'Dedicated immersive-learning and high-performance computing environment',
    'Opportunities for interdisciplinary projects, workshops and hackathons',
    'Focus on applied innovation, research and industry-oriented skill development',
  ],

  conceptExperience: {
    title: 'From Concept to Immersive Experience',
    intro:
      'The Studio enables students to experiment with interactive environments and immersive applications across a range of contexts.',
    cards: [
      {
        title: 'Learning & Training',
        desc: 'Interactive simulations and immersive educational experiences.',
      },
      {
        title: 'Healthcare & Well-being',
        desc: 'Exploratory applications for visualisation, awareness, training, and user engagement.',
      },
      {
        title: 'Industry & Simulation',
        desc: 'Virtual environments for demonstrations, procedural learning, design visualisation, and simulation.',
      },
      {
        title: 'Social & Community Applications',
        desc: 'Immersive solutions that can help communicate ideas, improve awareness, and address context-specific challenges.',
      },
    ] as ConceptExperience[],
  },

  facultyInCharge: {
    name: 'Mr. Phaneendra Varma Chintalapati',
    designation: 'Assistant Professor',
    email: 'chpvarmacse@svecw.edu.in',
    mobile: '9948055566',
    interests: 'AR/VR, XR and Deep Learning',
  } as ArVrFacultyInCharge,

  cta: {
    title: 'Don’t Just Imagine What’s Next. Build It.',
    subtitle:
      'At VWU, emerging technologies become spaces to experiment, create, and learn. Discover more labs, centres, and initiatives designed for students who want to turn ideas into experiences.',
    btn1: 'Explore More Differentiators',
    btn2: 'Discover Academics',
    btn3: 'Apply to VWU',
  },
};
