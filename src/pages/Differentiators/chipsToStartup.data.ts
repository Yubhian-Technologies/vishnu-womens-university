// Rich hardcoded content for the Chips to Startup (C2S) differentiator page
// (slug: chips-to-startup) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx.
export interface ProjectOutlay {
  institute: string;
  projectTitle: string;
  totalOutlay: string;
  duration: string;
  investigators: string[];
}

export interface EdaToolsTable {
  headers: string[];
  rows: string[][];
}

export const chipsToStartup = {
  paragraphs: [
    'Our Honorable minister of India Shri. Narendra Modi ji Vision is "Fostering Next Generation Capabilities Among Chip Designers For Making India Self-Reliant In Electronics System Design" In order to achieve, Chips to Startup (C2S) Programme aims to train 85,000 number of Specialized Manpower over a period of 5 years in the area of VLSI and Embedded System Design and leapfrog in ESDM space by way of inculcating the culture of System-on-Chip (SoC)/ System Level Design at Bachelors, Masters and Research level and act as a catalyst for to establish the base of ASIC/IC design in the country by accommodating more academic institutions, Startups for design of IPs/ASICs/SOCs/Systems.',
  ],
  objectives: [
    'To protect Intellectual Property generated and to inculcate the culture of entrepreneurship among students and researchers by incubating Startups.',
    'To promote industry–led R&D translational research and strengthening industry academia collaboration.',
    'To develop the culture of developing reusable IP Cores, ASIC/SOC systems for societal /Strategic sectors.',
    'To generate industry ready manpower in system/SOC Design and be creating vibrant fabless chip design ecosystem in the country. Growth of Start-ups involved in fabless design.',
  ],
  closingParagraph: 'The Department of Electronics and Communication Engineering, Shri Vishnu Engineering College for Women is honored to receive a project titled "Memory Optimized Co-Processor for Enhanced Edge AI" under the Chips to Start up Program funded by Ministry of Electronics and Information Technology (MeitY).',
  projectOutlay: {
    institute: 'Shri Vishnu Engineering College for Women (Autonomous), Bhimavaram.',
    projectTitle: 'Memory Optimized Co-Processing Unit for Enhanced Edge AI',
    totalOutlay: 'Rs. 64.5 Lakhs',
    duration: '5 Years',
    investigators: [
      'Dr. K. Padma Vasavi – Chief Investigator',
      'Dr. MV Ganeswara Rao – Co Investigator',
      'Dr. MV Subba Rao – Co Investigator',
      'Mr. G. Challaram – Co Investigator',
    ],
  } as ProjectOutlay,
  resources: [
    'Centralized Electronic Design Automation (EDA) tools facility',
    'Modern FPGA Boards',
    'Instruction Enhancement Programmes (IEPs)',
    'Skilled Manpower Advanced Research and Training (SMART) facility',
    'Organizing Workshops/Symposiums/Conferences/Webinars',
    'Chip Design Infrastructure',
    'Creation of reusable IPs repository',
    'Protection of Intellectual Property (IPs) Core Generated',
    'India Chip Programme',
  ],
  edaTools: {
    headers: ['S. No', 'Name of the EDA Tool', 'Product Description'],
    rows: [
      ['1', 'AMD Xilix VITIS', 'VITIS, Vivedo Tools, Vitis High Level Synthesis, Vitis Model Compressor, Metrim Addon'],
      ['2', 'Cadence', 'Full custom IC design Bundle, Semi-custom IC Design Bundle, SCL PDK for tapeout'],
      ['3', 'Synopsys', 'Front end and Back-end Bundles, TCAD and 2D TCAD Bundles'],
      ['4', 'Siemens', 'Tanner EDA, Calibre EDA, Queda EDA, Tessent EDA, Oasys, Nitro, Precision RTL synthesis, Catapult'],
      ['5', 'Silvaco', 'TCAD (Semiconductor Process and Device Simulator), Analog Custom IC Design – EDA Tools, Standard Cell Library Development Tools, IPs'],
      ['6', 'Ansys', 'HFSS, Totem, Redhawk, Power Artist EDA, RaptorX, Sea Scape'],
      ['7', 'Keysight', 'Advanced Design System, Kloswit Software, Quantumpro, System Vue Software'],
      ['8', 'FPGA Boards', 'Pynq72, Urbana Boards, Boolean Boards, Xilinx Ultrascale Boards, Zynq, Krie Boards'],
    ],
  } as EdaToolsTable,
  broadObjectives: [
    'Design and develop a specialized co-processing unit tailored for edge AI applications with a focus on efficient memory management.',
    'To evaluate its performance by integrating the memory-optimized CPU with real-world edge AI applications.',
    'To use a hybrid approach by prototyping the proposed design on FPGA first and implement the same using ASIC after fault detection and correction using FPGA.',
    'To fabricate the proposed design to implement Memory Optimization in the processor.',
  ],
  accordionSections: ['Activities Done Under the Project', 'Outcomes', 'Patent'] as string[],
  accordionContent: {
    'Patent': [
      'A patent is published based on the partial work done under the project with preliminary results.',
    ],
  } as Record<string, string[]>,
};
