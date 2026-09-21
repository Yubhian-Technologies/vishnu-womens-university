// Structured content for the Microchip Embedded Systems Centre differentiator
// page (slug: microchip-embedded).

export interface MicrochipEmbeddedData {
  hero: {
    category: string;
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  vision: {
    title: string;
    statement: string;
  };
  mission: {
    title: string;
    intro: string;
    points: string[];
  };
  learningAreas: {
    number: string;
    title: string;
    description: string;
  }[];
  trainingAndActivities: {
    title: string;
    programmeName: string;
    description: string;
  };
  programmeOutcome: {
    title: string;
    description: string;
  };
  technicalHighlights: {
    title: string;
    items: string[];
  };
  facilities: {
    title: string;
    intro: string;
    items: string[];
  };
  learningPartners: {
    title: string;
    partners: {
      name: string;
      description: string;
    }[];
  };
  gallery: {
    title: string;
    caption: string;
  };
  cta: {
    title: string;
    subtitle: string;
    links: {
      label: string;
      url: string;
      primary?: boolean;
    }[];
  };
}

export const microchipEmbedded: MicrochipEmbeddedData = {
  hero: {
    category: 'INDUSTRY CENTRES OF EXCELLENCE',
    title: 'Microchip Embedded Systems Centre',
    subtitle:
      'Developing practical competencies in PIC microcontrollers, embedded systems, IoT, automation and sensor-based applications through hands-on learning and structured technical training.',
  },
  about: {
    title: 'About the Centre',
    paragraphs: [
      'The Microchip Embedded Systems Centre provides students with practical exposure to 8-bit, 16-bit and 32-bit PIC microcontrollers and their application in embedded systems.',
      'Learning activities focus on areas such as microcontroller programming, IoT, automation and sensor-based systems, supported by faculty mentoring, development tools and structured technical programmes.',
      'The Centre enables students to connect concepts studied in electronics and computing with hands-on embedded-system development and application-oriented problem solving.',
    ],
  },
  vision: {
    title: 'Our Vision',
    statement:
      'To develop a strong academic environment for embedded systems learning, experimentation and innovation, enabling students and faculty to build competencies in microcontroller-based technologies and their real-world applications.',
  },
  mission: {
    title: 'Our Mission',
    intro: 'The Centre aims to:',
    points: [
      'provide hands-on learning in microcontrollers and embedded-system development;',
      'strengthen student competencies in IoT, automation and sensor-based applications;',
      'support faculty and student development through structured training and certification programmes;',
      'encourage practical projects and interdisciplinary applications of embedded technologies; and',
      'connect academic learning with contemporary tools and practices in embedded-system development.',
    ],
  },
  learningAreas: [
    {
      number: '01',
      title: 'Microcontroller Systems',
      description:
        'Develop practical familiarity with 8-bit, 16-bit and 32-bit PIC microcontrollers, including programming, interfacing and application development.',
    },
    {
      number: '02',
      title: 'Embedded Systems Development',
      description:
        'Apply hardware and software concepts to the design and implementation of embedded-system solutions.',
    },
    {
      number: '03',
      title: 'IoT, Automation & Sensors',
      description:
        'Explore applications involving connected devices, automation, data acquisition and sensor-based systems.',
    },
    {
      number: '04',
      title: 'Practical Technical Development',
      description:
        'Strengthen problem-solving and implementation skills through hands-on training, guided projects and structured technical programmes.',
    },
  ],
  trainingAndActivities: {
    title: 'Training & Activities',
    programmeName:
      'AICTE ATAL – EduSkills Microchip Embedded Systems Developer Programme',
    description:
      'The Centre has supported participation in the AICTE ATAL – EduSkills Microchip Embedded Systems Developer initiative, providing structured exposure to embedded-system technologies and related technical practices.',
  },
  programmeOutcome: {
    title: 'Programme Outcome',
    description:
      'The Centre conducted an AICTE ATAL – EduSkills Microchip Embedded Systems Developer Faculty Development Programme, supporting faculty exposure to contemporary embedded-system technologies and learning practices.',
  },
  technicalHighlights: {
    title: 'Technical Highlights',
    items: [
      'exposure to 8-bit, 16-bit and 32-bit PIC microcontrollers',
      'applications in IoT, automation and sensor-based systems',
      'hands-on embedded-system learning',
      'development and debugging tools',
      'faculty-guided technical learning',
      'access to structured EduSkills learning initiatives',
    ],
  },
  facilities: {
    title: 'Facilities & Development Resources',
    intro: 'The Centre supports practical learning through resources such as:',
    items: [
      'PIC microcontroller development platforms',
      'embedded-system development tools',
      'hardware programming and debugging resources',
      'project-development environments',
      'access to EduSkills online learning and certification resources',
    ],
  },
  learningPartners: {
    title: 'External Programmes & Learning Partners',
    partners: [
      {
        name: 'EduSkills',
        description:
          'Supports structured technical learning and certification opportunities related to embedded systems.',
      },
      {
        name: 'AICTE ATAL Academy',
        description:
          'Associated with the Faculty Development Programme conducted through the Centre.',
      },
    ],
  },
  gallery: {
    title: 'Gallery',
    caption: 'Faculty-led Embedded Systems Workshop',
  },
  cta: {
    title: 'Explore More Differentiators',
    subtitle:
      'Discover the laboratories, centres and initiatives that strengthen experiential learning, industry engagement and innovation at VWU.',
    links: [
      {
        label: 'Explore All Differentiators →',
        url: '/differentiators',
        primary: true,
      },
      {
        label: 'Explore Academics →',
        url: '/academics',
        primary: false,
      },
    ],
  },
};
