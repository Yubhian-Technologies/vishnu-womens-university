// Rich hardcoded content for the Ultra Tech CoE differentiator page
// (slug: ultratech-coe) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx.

export interface UltraTechInCharge {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
}

export interface StudentsBenefitedGroup {
  yearLabel: string;
  students: { regdNo: string; name: string }[];
}

export const ultraTechCoe = {
  pageTitle: 'Centre of Excellence for Sustainable Construction Practices and Materials',
  heroSubtitle: 'Strengthening civil engineering education through industry-supported learning, sustainable construction practices and hands-on exposure to construction materials and technologies in collaboration with UltraTech Cement Ltd.',
  taglineTitle: 'Sustainable Construction Through Innovation & Training',
  taglineDesc: 'The Centre of Excellence connects civil engineering education with industry practice through specialised learning in construction materials, sustainability, concrete technology, research and professional training.',
  aboutTitle: 'Centre of Excellence for Sustainable Construction Practices and Materials',
  overview: [
    'The Centre of Excellence for Sustainable Construction Practices and Materials (CSCPM) in the Department of Civil Engineering operates in collaboration with UltraTech Cement Ltd.',
    'The Centre supports learning, training and research related to sustainable construction materials and practices while providing students with opportunities to interact with industry professionals and understand current applications in civil engineering.',
    'Its activities focus on connecting academic learning with areas such as construction materials, concrete technology, environmental responsibility, health and safety, and professional capacity building.',
  ],
  focusDomains: [
    {
      title: 'Sustainable Materials',
      desc: 'Learning and research related to sustainable construction materials and responsible material use.',
    },
    {
      title: 'Water & Environment',
      desc: 'Awareness of resource conservation, environmental management and sustainable construction practices.',
    },
    {
      title: 'Health & Safety',
      desc: 'Promoting safe construction practices, occupational awareness and social responsibility.',
    },
    {
      title: 'Training & Capacity Building',
      desc: 'Industry-supported learning and professional development for students and other participants.',
    },
  ],
  vision: 'To advance education and practice in sustainable construction materials and technologies and contribute to the development of resilient, environmentally responsible and resource-conscious built environments.',
  mission: [
    'Provide students with specialised learning in sustainable construction materials and technologies.',
    'Develop practical and professional competencies through industry interaction and technical training.',
    'Encourage research and innovation in sustainable construction and material applications.',
    'Strengthen industry-academia engagement through knowledge sharing, mentorship and collaborative activities.',
    'Promote environmental responsibility, health and safety within civil engineering practice.',
  ],
  objectivesIntro: 'The Centre integrates education, research, awareness and capacity building to strengthen sustainable construction learning and industry engagement.',
  objectives: [
    {
      index: '01',
      badge: 'Education',
      title: '01. Education',
      desc: 'Provide specialised learning in sustainable construction materials, concrete technology and related civil engineering practices.',
    },
    {
      index: '02',
      badge: 'Research',
      title: '02. Research',
      desc: 'Encourage research and innovation in sustainable materials, construction technologies and environmental management.',
    },
    {
      index: '03',
      badge: 'Awareness',
      title: '03. Awareness',
      desc: 'Promote health, safety, environmental responsibility and socially responsible construction practices.',
    },
    {
      index: '04',
      badge: 'Capacity Building',
      title: '04. Capacity Building',
      desc: 'Provide training and industry exposure that strengthen the technical and professional capabilities of students.',
    },
  ],
  activitiesList: [
    {
      eventTag: 'MoU Signing',
      dateStr: '20 March 2024',
      desc: 'The Department of Civil Engineering signed a Memorandum of Understanding with UltraTech Cement Ltd to strengthen industry-academia engagement in sustainable construction education and training.',
    },
    {
      eventTag: 'Technical Webinar',
      dateStr: '30 March 2024',
      desc: 'A webinar on “An Overview of Cement and Concrete” was delivered by Er. J. Y. Breetha, Technical Service Coordinator, UltraTech Cement Ltd, providing students with industry perspectives on cement and concrete applications.',
    },
    {
      eventTag: 'Expert Technical Session',
      dateStr: '14 March 2024',
      desc: 'An expert session on “Concrete Mix Design” was conducted for students, engineers and contractors by Er. K. Venkataraman, Regional Head – Technical, UltraTech Cement Ltd.',
    },
  ],
  keyHighlights: [
    'MoU with UltraTech Cement Ltd signed on 20 March 2024',
    '50 Civil Engineering students participating across second- and third-year cohorts',
    'Industry-led technical sessions on cement, concrete and concrete mix design',
    'Focus on sustainable construction materials and practices',
    'Industry interaction supporting technical learning and professional exposure',
    'Academic focus on research, training and industry collaboration',
  ],
  outcomes: [
    'Students received direct exposure to industry perspectives on cement technology, concrete and mix design.',
    '50 students participated in the current industry-supported learning cohorts.',
    'The Centre has created a platform for industry interaction, technical training and academic engagement in sustainable construction.',
    'The collaboration supports opportunities for research and knowledge exchange in sustainable construction materials.',
  ],
  inCharge: {
    name: 'Mr. Ramgopal. L',
    designation: 'Assistant Professor',
    email: 'ramgopalce@svecw.edu.in',
    mobile: '8148638402',
    interests: 'Concrete Technology, Light weight Concrete, Sustainable Construction Materials.',
  } as UltraTechInCharge,
  accordionSections: ['In-charge', 'Students Benefited', 'Activities', 'Key Highlights', 'Outcomes'] as string[],
  studentsBenefited: [
    {
      yearLabel: 'III YEAR',
      students: [
        { regdNo: '21B01A0102', name: 'AKULA KUSUMANJALI' },
        { regdNo: '21B01A0105', name: 'BALABOMMALA POOJITHA' },
        { regdNo: '21B01A0108', name: 'DALAVI VASUDHA' },
        { regdNo: '21B01A0110', name: 'GUNTAPALLI PUJA VYSHNAVI' },
        { regdNo: '21B01A0113', name: 'JAVVADI CHAITANYA REVATHI' },
        { regdNo: '21B01A0114', name: 'KADALI JYOTHI' },
        { regdNo: '21B01A0115', name: 'KANCHERLA LAKSHMI SOWMYA' },
        { regdNo: '21B01A0119', name: 'KARRI SUKEERTHI REDDY' },
        { regdNo: '21B01A0120', name: 'KASU NAGA VENKATA PADMAJA SRIVALLI' },
        { regdNo: '21B01A0121', name: 'KATTA RUCHITHA SAM CHANDANA' },
        { regdNo: '21B01A0122', name: 'KAVURU YAMINI' },
        { regdNo: '21B01A0124', name: 'KOPPINEEDI MAHALAKHMI' },
        { regdNo: '21B01A0126', name: 'KOTIKALAPUDI KAVYA VENKATA LAKSHMI PRIYA' },
        { regdNo: '21B01A0129', name: 'MANDAPATI SRIVALLI DEEPTHI' },
        { regdNo: '21B01A0130', name: 'MARISETTI VIDHYA SRI' },
        { regdNo: '21B01A0131', name: 'MATTA DIVYA' },
        { regdNo: '21B01A0135', name: 'NARKEDAMILLI MEGHANA' },
        { regdNo: '21B01A0138', name: 'POLISETTI DURGA SATYA SAI ANVITHA' },
        { regdNo: '21B01A0139', name: 'POLISETTI SHANMUKHA PRIYA' },
        { regdNo: '21B01A0141', name: 'PULAKANDAM BALA TULASI VENI' },
        { regdNo: '21B01A0144', name: 'SATTI LAKSHMI MANISHA' },
        { regdNo: '21B01A0148', name: 'THOTA RAMYA SRI DURGA' },
        { regdNo: '21B01A0151', name: 'VITTAMSETTI MOHANA VARA LAKSHMI' },
        { regdNo: '22B05A0104', name: 'KOLLU PAVANI' },
        { regdNo: '22B05A0107', name: 'MAREEDU PRASANNA' },
      ],
    },
    {
      yearLabel: 'II YEARS',
      students: [
        { regdNo: '22B01A0104', name: 'CHEEDAY VAMSI LAKSHMI PRASANNA' },
        { regdNo: '22B01A0105', name: 'CHIGILIPALLI MOUNIKA' },
        { regdNo: '22B01A0106', name: 'CHINDANA RAJESWARI' },
        { regdNo: '22B01A0108', name: 'DANDU SOWJANYA LAKSHMI PRIYA' },
        { regdNo: '22B01A0110', name: 'DURGA PRASANNA LAKSHMI' },
        { regdNo: '22B01A0112', name: 'GANTA HARIKA NAGA DURGA' },
        { regdNo: '22B01A0114', name: 'GUDALA SRAVANI' },
        { regdNo: '22B01A0117', name: 'KADALI YUKTHA NANDINI' },
        { regdNo: '22B01A0118', name: 'KADARI HEMA ANVITHA' },
        { regdNo: '22B01A0121', name: 'KAVALI KANKA DURGA' },
        { regdNo: '22B01A0123', name: 'LAKKAKULA BINDU' },
        { regdNo: '22B01A0124', name: 'MAGANTI PUJITHA' },
        { regdNo: '22B01A0127', name: 'MEDISETTI SIREESHA' },
        { regdNo: '22B01A0128', name: 'MUDIGANTI SIRI CHANDANA' },
        { regdNo: '22B01A0129', name: 'MYLAVARAPU SUDHA' },
        { regdNo: '22B01A0130', name: 'NAMBURI HARSHITHA SAI PUSHPA DEVI' },
        { regdNo: '22B01A0131', name: 'NANDYALA SOWMYA SIVA LAKSHMI TULASI' },
        { regdNo: '22B01A0139', name: 'SATTI VIJAYA VARSHINI' },
        { regdNo: '22B01A0140', name: 'SEERAM BHUVANESWARI' },
        { regdNo: '22B01A0142', name: 'TAMMINENI PRAVALLIKA' },
        { regdNo: '22B01A0143', name: 'THIRUMANI SOWMYA' },
        { regdNo: '22B01A0146', name: 'VUNGARALA JAHNAVI KANAKA VALLIKA' },
        { regdNo: '22B01A0148', name: 'YARAKARAJU PUJITHA' },
        { regdNo: '22B01A0149', name: 'YARLLGADDA JMANA SATHWIKA' },
        { regdNo: '23B05A0109', name: 'PASUPULETI JYOTHI MALLESWARI' },
      ],
    },
  ] as StudentsBenefitedGroup[],
};
