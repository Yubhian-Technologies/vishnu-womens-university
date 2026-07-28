// Rich hardcoded content for the Concrete Canoe Laboratory differentiator
// page (slug: concrete-canoe-lab) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx. Photos for this page are
// admin-uploadable (see ConcreteCanoePhotosAdmin.tsx) since none were
// available as static assets.
export interface CanoeMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
}

export interface CanoeSimpleTable {
  headers: string[];
  rows: string[][];
}

export interface CanoeStudentTeam {
  label: string;
  students: string[];
}

export interface CanoeCompetition {
  name: string;
  date: string;
  students: string[];
  year: string;
  remarks: string;
}

export const concreteCanoeLab = {
  paragraphs: [
    'The Concrete Canoe Laboratory’s primary aim is to provide students with a unique opportunity to implement their theoretical knowledge by constructing a canoe composed entirely of concrete. This laboratory offers a holistic learning experience that combines theoretical knowledge with practical application, thereby enhancing students’ comprehension of concrete technology, structural design, and project management while simultaneously fostering innovation and creativity in engineering solutions. Additionally, participation in Canoe competitions cultivates camaraderie among peers within the field of civil engineering while promoting healthy competition at the same time.',
  ],
  vision: 'Envision a future where women in civil engineering excel as pioneers and leaders in the innovative design and construction of concrete canoes. Our vision is to empower and inspire a diverse community of engineers through knowledge, training, and ethical values, contributing to the evolution of academia and industry with a commitment to excellence.',
  mission: [
    'Provide a value-based education that equips individuals with the skills and knowledge essential for achieving a sustainable competitive edge in the realm of concrete canoe design and construction.',
    'Impart the specialized skills required for a successful career in the concrete canoeing field, understanding the role and responsibility in addressing fundamental social needs through engineering innovation.',
    'Nurture professionalism by creating a continuously counselled and mentored environment within the Concrete Canoe Lab, fostering a culture of respect, collaboration, and ethical conduct.',
    'Inculcate a culture of research and consultancy among students, encouraging exploration and innovation in concrete canoe design, materials, and construction techniques, thereby contributing to the advancement of knowledge in the field.',
  ],
  objectives: [
    'The Concrete Canoe Lab aims to be a dynamic and progressive center that not only imparts technical expertise but also contributes to the overall growth and development of students in alignment with the department’s vision and mission.',
  ],
  inCharge: {
    name: 'Mr. Ramgopal. L',
    designation: 'Assistant Professor',
    email: 'ramgopal@svecw.edu.in',
    mobile: '8148638402',
    interests: 'Concrete Technology, Concrete Materials, Light weight Concrete, Sustainable Construction Materials',
  } as CanoeMember,
  academicProject: {
    heading: 'AY 2023–2024 — Ongoing Final year project titled “Eco-friendly concrete Boats for sustainable Aquaculture”',
    team: {
      headers: ['S.No', 'Regd No.', 'Name', 'Faculty'],
      rows: [
        ['1', '20D01A0146', 'RAYAPUREDDY TEJASWI', 'Mr.L.Ramgopal'],
        ['2', '20D01A0106', 'BAYI SOWMYA SRI', ''],
        ['3', '20D01A0119', 'ILLURI SATYA PRANEETHA', ''],
        ['4', '20D01A0129', 'KUSAM ROSHINI REDDY', ''],
        ['5', '20D01A0136', 'PADARAPAKA MAHESWARI SATYA', ''],
      ],
    } as CanoeSimpleTable,
    paragraphs: [
      'The project study on “Eco-friendly Lightweight Concrete Boats for Sustainable Aquaculture” attempts to transform aquaculture vessel building by using lightweight concrete materials into boat design. The study aims to investigate the mechanical characteristics, buoyancy, and durability of these lightweight concrete composites in order to ensure structural integrity and a less environmental imprint. The research also investigates improved construction techniques and sustainable additives to improve corrosion and saltwater exposure resistance. The environmental impact assessment of lightweight concrete boats will be carried out to confirm the ecological benefits of the solution.',
      'This study adds vital insights to sustainable aquaculture by merging multidisciplinary viewpoints from materials engineering, marine technology, and environmental science. The eco-friendly lightweight concrete boats not only provide an environmentally responsible alternative for aquaculture vessels but also pave the way for a greener future in marine industries. To provide a sustainable environment for future generations mainly in case of marine industries to mitigate pollution and increase healthy habitat. Concrete boats mainly concentrate on environment-friendly concrete Material to mitigate ecological balance in the aquaculture.',
    ],
  },
  previousProjects: {
    table: {
      headers: ['Description', 'WAKA', 'WAKA 1.2 & 2.0', 'KANU', 'AIKYAM', 'CANOE'],
      rows: [
        ['Dimensions', 'Length – 3.2m\nBeam width – 0.47m\nDraft – 0.5m', 'Length – 1.95m\nBeam width – 0.47m\nDraft – 0.5m', 'Length – 1.97m\nBeam width – 0.5m\nDraft – 0.04m', 'Length – 2.1m\nBeam width – 0.5m\nDraft – 0.03m\nThickness – 0.04m', 'Length – 2m\nBeam width – 0.61m\nDraft – 0.28m\nThickness – 0.02m'],
        ['Paddler', 'Double (Max 4)', 'Single', 'Single', 'Single', 'Single (Max 2)'],
        ['Materials', 'Cement, Flyash, Cenosphere, Metakolin, 4mm rebars as reinforcement', 'Cement, Flyash, Cenosphere, Metakolin, glass fibre mesh reinforcement', 'Cement, Flyash, Cenosphere, GGBS, glass fibre mesh reinforcement', 'Cement, Aluminium powder, lime, polypropylene fibres', 'Cement, fly ash, cenosphere, CFRP sheet as main reinforcement, polypropylene fibres'],
        ['Hull Shape', 'Flat bottom square arch hull', 'Round bottom hull', 'Flat bottom hull', 'Deep vee hull', 'Flat bottom hull'],
        ['Mix Design', 'M20', 'M20', 'M30 (packing density model)', 'M30 (packing density model)', 'M30 (packing density model)'],
        ['Modelling Tool', 'CAD & STAAD Pro', 'Maxsurf modeler & stabilizer', 'AutoCAD & STAAD Pro', 'Bearcat SP', 'Maxsurf modeler & stabilizer'],
        ['Mould', 'Male mould, wood material', 'Male mould, clay mud, thermocol material', 'Male mould, cement mortar material', 'Male mould, clay mud and thermocol material', 'Male mould, cement mortar material'],
      ],
    } as CanoeSimpleTable,
  },
  studentsBenefited: [
    { label: 'Team – WAKA (IV Year, 2020 Batch)', students: ['Tejaswi', 'Poojitha', 'Sowmya Sri', 'Bindhu', 'Swathi', 'Lahari', 'Sruthi', 'Sumithra Sri', 'Praneetha', 'Maheswari', 'Phatima Sri Bindu', 'Sowjanya', 'Chandrika', 'Pavani Sri Valli', 'Runsitha', 'Lasya Sree'] },
    { label: 'Team – AIKYAM (III Year, 2021 Batch)', students: ['K. Sowmya', 'J. Chaitanya', 'A. Kusuma', 'B. Anusha', 'D. Vasudha', 'K. Srivalli', 'K. Yamini', 'K. Prasanna', 'N. Meghana', 'P. Anvitha', 'M. Divya', 'P. Leela Priya', 'S. Bhuvana', 'T. Ramya', 'V. Srija'] },
    { label: 'Team – KANU', students: ['Ch. Mounika', 'D. Sowjanya', 'D. Prasanna', 'G. Harika', 'K. Anvitha', 'M. Sudha', 'N. Harshitha', 'V. Jahnavi'] },
  ] as CanoeStudentTeam[],
  facultyMentors: [
    'Mr. Ramgopal. L — Assistant Professor',
    'Dr. Pala Gireesh Kumar — Professor',
    'Mrs. P. Lavanya — Assistant Professor',
  ],
  outcomes: {
    heading: 'Startup Under Incubation',
    subheading: 'ITIC BUILD Winners',
    paragraphs: [
      'CONCRETE CANOE (TEAM WAKA) have been selected as one of the 75 winners of the BUILD program organized by IIT Hyderabad Technology Incubation Centre (ITIC) from the Civil Engineering department of SVECW(A). The Teams will get a seed money of one lakh rupees to produce an industry-ready prototype.',
    ],
    brief: 'Creating eco-friendly, cost-effective concrete canoe which can incorporate sustainable and recycled materials, reducing their environmental impact. They are non-combustible, providing an added safety benefit over wooden boats, which are susceptible to fire hazards.',
    team: {
      headers: ['S.No', 'Regd. No.', 'Name'],
      rows: [
        ['1', '20D01A0146', 'RAYAPUREDDY TEJASWI'],
        ['2', '20D01A0106', 'BAYI SOWMYA SRI'],
        ['3', '20D01A0119', 'ILLURI SATYA PRANEETHA'],
        ['4', '20D01A0129', 'KUSAM ROSHINI REDDY'],
        ['5', '20D01A0136', 'PADARAPAKA MAHESWARI SATYA'],
      ],
    } as CanoeSimpleTable,
  },
  // Student names in this table are transcribed from a low-resolution source
  // image — spellings of individual student names may need an admin's review.
  competitions: [
    {
      name: 'Concrete Canoe Carnival 2k24 @ VIT, Bhimavaram',
      date: '07-03-2024',
      students: ['K. Lekshmi Sowmya', 'P. Anvitha', 'N. Meghana', 'Y. Yamini', 'K. Srivalli', 'M. Divya', 'B. V. Anusha', 'P. Leela Priya', 'T. Ramya', 'S. Bhuvaneswari Deepika', 'D. Vasudha', 'V. Srija', 'K. Lekshmi Praasnna', 'A. Kaustumbi'],
      year: 'III Year',
      remarks: 'Best Paper Presentation',
    },
    {
      name: 'Concrete Canoe Carnival 2k24 @ VIT, Bhimavaram',
      date: '07-03-2024',
      students: ['S. Vijaya Vaishnavi', 'V. Jehnovi Kereke', 'Praveena Lekshmi', 'G. Sriveni', 'Jyothi Meliaswari', 'K. Hema Anithika', 'Ch. Mourice B', 'U. Harika Nega Durge', 'K. Kereke', 'K. Yuvda Nandini', 'Y. Pujitha', 'M. Sudha', 'Sweetha', 'P. Dhwani', 'Harshitha Sri Pushpa Devi'],
      year: 'III Year',
      remarks: 'Best Paddler Award',
    },
    {
      name: 'National Concrete Canoe Competition 2k23 @ SVECW, Bhimavaram',
      date: '02-08-2023',
      students: ['R. Tejaswi', 'M. Bhethi', 'Ch. Poojitha', 'V. Laheri', 'Pavithra Sri', 'N. Leaya Sree', 'V. Rohitha', 'B. Sowmya Sri', 'K. Praneetha', 'Chandrika', 'K. N. V. I. Sri Bindu', 'P. Maheswari Satya', 'A. L. M. V. Sowjanya'],
      year: 'III Year',
      remarks: 'First Prize',
    },
    {
      name: 'IIT Madras PALS Innovash',
      date: '24-03-2023',
      students: ['Boddeti Suverna Kusum Yadav', 'Mittepalli Binthi', 'Nadimpalli Purnima Lasya Sree', 'Reyavureddy Tejaswi'],
      year: 'II Year',
      remarks: 'First Phase Certification',
    },
    {
      name: 'National Level Technical Fest 2022 @ Bapatla Engineering College (Bapatla)',
      date: '10-09-2022',
      students: ['Alrarupu L M V Soajenya Sri', 'Boleddu Dedeeoya', 'Kelagle Sri Lakshmi Jyothi', 'Reyavureddy Tejaswi'],
      year: 'II Year',
      remarks: 'First Prize at Contemplate',
    },
    {
      name: 'Project Expo 2022 at SASI Institute of Technology, Tadepalligudem (SITE)',
      date: '04-11-2022',
      students: ['Boddeti Suverna Kusum Yadav', 'Mittepalli Binthi', 'Nadimpalli Purnima Lasya Sree', 'Chintekayla Poojitha'],
      year: 'II Year',
      remarks: 'First Prize at Project Expo',
    },
    {
      name: 'Srijit-2022 — 8th National Level Technical Project Exhibition & Competition, Scient College of Engineering (Autonomous), Kottayam, Kerala',
      date: '25 & 26 April 2022',
      students: ['Nagubondi Vidhya Sri Purna', 'Medhunike', 'Yekkele Rupe Srijena Sindhum', 'Telepamt Herika Sraveni', 'S. S. Krishna Lekshmi', 'Dowmisenal', 'L. K. P. Praesenthi', 'V. Dhwithe', 'J. Meyuri', 'Doseri Sai Keerthi Priya'],
      year: 'II & IV Year',
      remarks: 'Participation Certificate',
    },
  ] as CanoeCompetition[],
  activities: [
    'Organized National Concrete Canoe Competition (NCCC) – Aug 2, 2023. The National Concrete Canoe Competition is the first-ever concrete canoe competition in Andhra Pradesh and Telangana’s history. This competition is exclusively for female civil engineers.',
    'The event witnessed enthusiastic participation from 10 teams hailing from renowned institutions across the state. Each team brought their distinctive approach to the competition, showcasing a diverse range of canoe designs and construction techniques.',
  ],
};
