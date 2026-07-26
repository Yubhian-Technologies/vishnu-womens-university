// Rich hardcoded content for the MEDA & PLM CoE differentiator page (slug:
// meda-plm-coe) — overrides that item's generic Firestore intro/about text
// in DifferentiatorDetail.tsx.
export const medaPlmCoe = {
  intro: 'Shri Vishnu Engineering College for Women (SVECW), a premier institution committed to empowering women in engineering and technology, has signed a Memorandum of Understanding (MoU) with Capgemini. This collaboration aims to train and equip students of the Mechanical Engineering department with industry-relevant skills and enhance their employment opportunities, specifically in the areas of Mechanical Engineering Design Automation (MEDA) and Product Life Cycle Management (PLM).',
  meda: {
    heading: 'Mechanical Engineering Design Automation (MEDA)',
    intro: 'The MEDA module focuses on preparing students for core design and analysis roles in the mechanical industry by providing both theoretical and practical knowledge using leading engineering software tools such as:',
    tools: [
      'CATIA – for 3D modeling, assembly design, and drafting.',
      'Siemens NX CAD – for advanced parametric modeling, sheet metal design, and surface modeling.',
      'ANSYS – for finite element analysis (FEA), structural, thermal, and dynamic simulation.',
    ],
    conceptsIntro: 'Key technical concepts covered under MEDA include:',
    concepts: [
      'Fundamentals of mechanical design and modeling techniques.',
      'Assembly constraints, GD&T (Geometric Dimensioning and Tolerancing).',
      'Reverse engineering and design optimization.',
      'Finite element analysis for structural validation.',
      'Basics of design for manufacturing and design for assembly (DFM & DFA).',
      'Introduction to automation in CAD using scripting and macros.',
    ],
    closing: 'These topics aim to bridge the gap between classroom learning and industry practices, empowering students with practical, tool-based skills that are directly applicable in modern product development environments.',
  },
  plm: {
    heading: 'Product Life Cycle Management (PLM)',
    intro: 'The PLM module focuses on managing product data and processes throughout the entire lifecycle – from concept and design to manufacturing and support. Training will include:',
    training: [
      'Introduction to PLM concepts – such as product structure, bill of materials (BOM), engineering change management, and configuration control.',
      'Workflow and collaboration – across different teams involved in product development.',
      'Software training using Siemens Teamcenter, a leading PLM platform used globally across various industries.',
    ],
    teamcenterIntro: 'Through Siemens Teamcenter, students will learn:',
    teamcenter: [
      'Product data management (PDM) fundamentals.',
      'Document management, version control, and traceability.',
      'Integration of PLM with CAD tools like CATIA and NX.',
      'Change management and release control processes.',
    ],
  },
  outcomeHeading: 'Outcome and Benefits',
  outcomes: [
    'Capgemini will mentor and train students through curated content, hands-on workshops, and project-based learning.',
    'The modules are designed to make students industry-ready and increase their chances of employability in design and manufacturing domains.',
    'Students excelling in these training programs will have the opportunity to participate in internship and placement initiatives supported by Capgemini.',
    'This MoU represents a significant step toward strengthening industry-academia collaboration and empowering women engineers with future-ready skills.',
  ],
};
