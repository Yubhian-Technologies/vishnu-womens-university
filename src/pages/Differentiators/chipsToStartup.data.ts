// Rich hardcoded content for the Chips to Startup (C2S) differentiator page
// (slug: chips-to-startup) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx.

export interface ProjectOutlay {
  title: string;
  institute: string;
  projectTitle: string;
  totalOutlay: string;
  duration: string;
  investigators: string[];
}

export interface EdaToolsTable {
  title: string;
  intro: string;
  headers: string[];
  rows: string[][];
}

export interface StatCard {
  title: string;
  val: string;
  desc: string;
}

export interface ResourcesData {
  title: string;
  intro: string;
  keyIntro: string;
  items: string[];
}

export interface FacilitiesData {
  title: string;
  intro: string;
  developmentHardware: string[];
  designInfrastructure: string[];
}

export const chipsToStartup = {
  heroPills: ['Innovation', 'Learning', 'Impact'],
  heroTitle: 'Chips to Startup (C2S)',
  heroSubtitle:
    'Building a strong System-on-Chip (SoC) design ecosystem through advanced EDA tools, IP-focused research, FPGA-based development and industry-oriented semiconductor design learning.',
  heroCtaText: 'Explore the Programme →',

  aboutTitle: 'About the Programme',
  aboutParagraphs: [
    'The Chips to Startup (C2S) Programme supports the development of a strong System-on-Chip (SoC) and integrated-circuit design ecosystem through advanced design tools, research infrastructure and specialised technical learning.',
    'At VWU, the programme focuses on industry-oriented translational research, reusable IP-core development, ASIC/SoC design, intellectual-property generation and startup incubation. It also aims to strengthen students\' and researchers\' capabilities in semiconductor and system design.',
    'Through the programme, the institution has access to advanced Electronic Design Automation (EDA) tools and FPGA-based development resources, enabling participants to work on design, simulation, verification and prototype-oriented research.',
  ],

  statCards: [
    {
      title: 'Programme Funding',
      val: '₹64.5 lakh',
      desc: 'MeitY-supported funding over five years',
    },
    {
      title: 'Research Project',
      val: 'Enhanced Edge AI',
      desc: 'Memory-Optimised Co-Processor for Enhanced Edge AI',
    },
    {
      title: 'Intellectual Property',
      val: 'Patent Filed',
      desc: 'Patent filed based on preliminary research outcomes',
    },
    {
      title: 'EDA & Design Platforms',
      val: '7+ Platforms',
      desc: 'AMD Xilinx, Cadence, Synopsys, Siemens, Silvaco, Ansys and Keysight',
    },
  ] as StatCard[],

  objectives: [
    'Promote the creation, protection and responsible utilisation of intellectual property generated through research and innovation.',
    'Encourage entrepreneurship among students and researchers by supporting the development and incubation of technology-driven startup ideas.',
    'Strengthen industry-led translational research and industry-academia collaboration in semiconductor and system design.',
    'Develop reusable IP cores, ASICs and SoC-based solutions for societal and strategic applications.',
    'Build industry-ready capabilities in system and SoC design through advanced tools, practical learning and research exposure.',
    'Contribute to the development of a vibrant fabless semiconductor design and startup ecosystem.',
  ],

  galleryCaption: 'Hands-on EDA / FPGA Learning Session',

  projectOutlay: {
    title: 'Project Overview & Funding',
    institute: 'Vishnu Women’s University, Bhimavaram',
    projectTitle: 'Memory Optimized Co-Processing Unit for Enhanced Edge AI',
    totalOutlay: '₹64.5 lakh',
    duration: '5 years',
    investigators: [
      'Dr. K. Padma Vasavi – Chief Investigator',
      'Dr. M. V. Ganeswara Rao – Co-Investigator',
      'Dr. M. V. Subba Rao – Co-Investigator',
      'Mr. G. Challaram – Co-Investigator',
    ],
  } as ProjectOutlay,

  resources: {
    title: 'Programme Resources & Capacity Building',
    intro:
      'The C2S programme supports semiconductor design, research and innovation through a combination of technical infrastructure, training initiatives and intellectual-property development.',
    keyIntro: 'Key resources and initiatives include:',
    items: [
      'Centralised Electronic Design Automation (EDA) tools facility',
      'Modern FPGA development boards',
      'Instruction Enhancement Programmes (IEPs)',
      'Skilled Manpower Advanced Research and Training (SMART) facility',
      'Workshops, symposia, conferences and webinars',
      'Chip-design infrastructure',
      'Development of a repository of reusable IP cores',
      'Support for the protection of intellectual property generated through the programme',
      'Engagement with the India Chip Programme',
    ],
  } as ResourcesData,

  edaTools: {
    title: 'EDA Tools & Design Infrastructure',
    intro:
      'The programme provides access to a range of Electronic Design Automation tools, semiconductor design platforms and FPGA development resources supporting design, simulation, verification, synthesis and implementation.',
    headers: ['S. No', 'Name of the EDA Tool', 'Product Description'],
    rows: [
      ['1', 'AMD Xilinx VITIS', 'VITIS, Vivado Tools, Vitis High Level Synthesis, Vitis Model Compressor, Matlab Addon'],
      ['2', 'Cadence', 'Full custom IC design Bundle, Semi-custom IC Design Bundle, SCL PDK for tapeout'],
      ['3', 'Synopsys', 'Front end and Back-end Bundles, TCAD and 2D TCAD Bundles'],
      ['4', 'Siemens EDA', 'Tanner EDA, Calibre EDA, Questa EDA, Tessent EDA, Oasys, Nitro, Precision RTL synthesis, Catapult'],
      ['5', 'Silvaco', 'TCAD (Semiconductor Process and Device Simulator), Analog Custom IC Design – EDA Tools, Standard Cell Library Development Tools, IPs'],
      ['6', 'Ansys', 'HFSS, Totem, Redhawk, Power Artist EDA, RaptorX, Sea Scape'],
      ['7', 'Keysight', 'Advanced Design System, PathWave Software, Quantumpro, SystemVue Software'],
      ['8', 'FPGA Boards', 'PYNQ-Z2, UltraScale Boards, Zynq, Kria Development Boards'],
    ],
  } as EdaToolsTable,

  projectObjectives: {
    title: 'Project Objectives',
    items: [
      'Design and develop a specialised co-processing unit for Edge AI applications, with a focus on efficient memory management.',
      'Evaluate the performance of the proposed architecture by integrating the memory-optimised processing unit with real-world Edge AI applications.',
      'Adopt a hybrid development approach by first prototyping and validating the proposed architecture on an FPGA platform, followed by ASIC implementation after design verification and correction.',
      'Fabricate and evaluate the proposed design to implement and validate memory optimisation within the processor architecture.',
    ],
  },

  facilities: {
    title: 'Facilities & Equipment',
    intro:
      'The programme is supported by specialised computing and hardware resources for semiconductor design, FPGA implementation and prototype development.',
    developmentHardware: [
      'PYNQ-Z2 FPGA development boards',
      'Xilinx UltraScale boards',
      'Zynq-based development platforms',
      'Kria development boards',
      'Other approved FPGA and prototyping resources available under the programme',
    ],
    designInfrastructure: [
      'Centralised EDA computing facility',
      'Chip-design and simulation infrastructure',
      'FPGA-based development and validation environment',
    ],
  } as FacilitiesData,

  keyHighlights: [
    '₹64.5 lakh in MeitY-supported funding over five years',
    'Research project on Memory Optimized Co-Processing Unit for Enhanced Edge AI',
    'Patent application developed from preliminary research outcomes',
    'Access to EDA platforms from AMD Xilinx, Cadence, Synopsys, Siemens EDA, Silvaco, Ansys and Keysight',
    'FPGA development platforms including PYNQ-Z2, Xilinx UltraScale, Zynq and Kria',
    'Chief Investigator: Dr. K. Padma Vasavi',
  ],

  cta: {
    title: 'Explore What Powers the Next Big Idea',
    subtitle:
      'From advanced technology and research to innovation and entrepreneurship, discover the initiatives that turn learning into real-world possibilities.',
    btn1: 'Explore All Differentiators',
    btn2: 'Discover Academics',
    btn3: 'Apply to VWU',
  },
};
