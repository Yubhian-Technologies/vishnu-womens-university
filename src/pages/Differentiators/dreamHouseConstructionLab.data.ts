// Rich hardcoded content for the Dream House Construction Lab differentiator
// page (slug: dream-house-lab) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx.
export interface DhclMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
  website?: string;
}

export interface DhclSimpleTable {
  headers: string[];
  rows: string[][];
}

export interface DhclStudentGroup {
  yearLabel: string;
  students: { regdNo: string; name: string }[];
}

export const dreamHouseConstructionLab = {
  paragraphs: [
    'The Dream House Construction Lab (DHCL) is a dedicated facility designed to support research initiatives and promote innovation in various fields. It serves as a dynamic space where faculty, students, and industry partners collaborate on projects aimed at advancing knowledge, developing new technologies, and addressing real-world challenges. By fostering interdisciplinary collaboration, providing facilities and resources, and engaging with industry partners, the lab creates an environment conducive to impactful research outcomes. Through project-based research, skill development, knowledge dissemination, and funding support, the lab enables faculty and students to contribute to the advancement of knowledge, address real-world challenges, and make significant contributions to their respective fields.',
  ],
  vision: 'The Dream House Construction Laboratory (DHCL) envisions becoming a pioneering hub women civil engineers for innovation and research in construction technology and practices. It aspires to be a dynamic space where interdisciplinary collaboration thrives, fostering the development of cutting-edge solutions to address global challenges in the built environment.',
  mission: [
    'Fostering a culture of innovation and research excellence, driving forward-thinking initiatives that push the boundaries of construction technology and practices.',
    'To provide hands-on education and skill development opportunities for students and professionals, equipping them with the knowledge and expertise necessary to excel in the field of civil engineering.',
    'To recognizes the importance of fulfilling fundamental social needs and promoting sustainable practices in the construction industry.',
    'Nurturing professionalism by providing a continuously counselled and mentored environment, where individuals can develop their skills, collaborate effectively, and uphold the highest ethical standards.',
  ],
  objectives: [
    'DHCL aims to conduct innovative research projects focused on advancing construction technology, materials, and practices as well as to offer workshops, training programs, and experiential learning opportunities to enhance the practical skills of students and professionals in construction-related fields.',
    'DHCL aims to be at the forefront of knowledge and research in the construction industry, making significant contributions to the advancement of knowledge and the fulfillment of societal needs.',
  ],
  inCharge: {
    name: 'Mr. Ramgopal. L',
    designation: 'Assistant Professor',
    email: 'ramgopal@svecw.edu.in',
    mobile: '8148638402',
    interests: 'Concrete Technology, Cement Composites, Light weight Concrete, Sustainable Construction Materials.',
    website: 'www.svecw.edu.in',
  } as DhclMember,
  academicProject: {
    heading: 'A.Y 2023–2024 — Ongoing Final year project titled “Experimental Investigation on Mix Proportions of Stabilized Mud Blocks – A Sustainable & Cost-Effective Construction Practice”.',
    team: {
      headers: ['S.No', 'Regd No.', 'Name', 'Faculty'],
      rows: [
        ['1', '20D01A0116', 'G. Kavya Sri', 'Dr. P. Gireesh Kumar'],
        ['2', '20D01A0118', 'G. Supriya', ''],
        ['3', '20D01A0123', 'K. Naga Suneetha', ''],
        ['4', '20D01A0128', 'K. V. N. B. L. Hima Bindu', ''],
      ],
    } as DhclSimpleTable,
    paragraphs: [
      'Stabilized mud blocks (SMBs) have emerged as a promising sustainable alternative for the construction industry due to their eco-friendliness, low cost, and thermal insulation properties. This experimental investigation aims to optimize the mix proportions of SMBs to enhance their mechanical properties while maintaining their sustainability and cost-effectiveness. The research involves the preparation of SMB specimens using various combinations of stabilizers, including lime, cement, and other suitable additives. The mix proportions are systematically varied, and the mechanical properties of the resulting SMBs, such as compressive strength, flexural strength, and water absorption, are evaluated through rigorous testing procedures. Preliminary findings indicate that the incorporation of stabilizers in the SMB mix significantly improves the strength and durability of SMBs. Moreover, the use of locally available materials and optimized mix proportions enhances the cost-effectiveness of SMB production, making it an attractive solution for sustainable construction practices in resource-constrained environments.',
      'This study contributes to the advancement of knowledge in sustainable construction practices by providing empirical data on the optimization of mix proportions for SMBs. The findings offer valuable insights for architects, engineers, and policymakers seeking to promote environmentally friendly and cost-effective construction practices in various regions. Through the widespread adoption of SMBs, this research has the potential to mitigate environmental impact, reduce construction costs, and improve the quality of housing in communities worldwide.',
    ],
  },
  // Regd numbers and names in this table are transcribed from a low-resolution
  // source image — spellings may need an admin's review.
  studentsBenefited: [
    {
      yearLabel: 'IV Years',
      students: [
        { regdNo: '20B0A0146', name: 'R. Tejaswi' },
        { regdNo: '20B0A0134', name: 'M. Bhethi' },
        { regdNo: '20B0A0111', name: 'Ch. Poojithe' },
        { regdNo: '20B0A0153', name: 'V. Laheri' },
        { regdNo: '20B0A0150', name: 'S. Pavitre Sri Bindu' },
        { regdNo: '20B0A0135', name: 'N. P. Lasya Sree' },
        { regdNo: '20B0A0156', name: 'K. V. Rohithe' },
        { regdNo: '20B0A0106', name: 'B. Sowmya Sri' },
        { regdNo: '20B0A0119', name: 'I. Praneetha' },
        { regdNo: '20B0A0129', name: 'K. Roshini Reddy' },
        { regdNo: '20B0A0138', name: 'P. L. Chandrika' },
        { regdNo: '20B0A017', name: 'G. Sraveni' },
        { regdNo: '20B0A0128', name: 'K N V H Sri Bindu' },
        { regdNo: '20B0A0136', name: 'P. Maheswari Satya' },
        { regdNo: '20B0A0101', name: 'A. L. M. V. Sowjanya' },
      ],
    },
    {
      yearLabel: 'III Years',
      students: [
        { regdNo: '21B0A015', name: 'K. Lekshmi Sowmya' },
        { regdNo: '21B0A0138', name: 'P. Anvithe' },
        { regdNo: '21B0A0135', name: 'N. Meghana' },
        { regdNo: '21B0A0122', name: 'K. Yamini' },
        { regdNo: '21B0A0129', name: 'K. Srivalli' },
        { regdNo: '21B0A0131', name: 'M. Divya' },
        { regdNo: '21B0A0104', name: 'B. V. Anusha' },
        { regdNo: '21B0A0137', name: 'P. Leela Priya' },
        { regdNo: '21B0A0148', name: 'T. Ramya Sri Durga' },
        { regdNo: '21B0A0145', name: 'S. Bhuvana Deepika' },
        { regdNo: '21B0A0108', name: 'D. Vasudha' },
        { regdNo: '21B0A0149', name: 'V. Srija' },
        { regdNo: '21B0A0126', name: 'K. Lekshmi Praasnna' },
        { regdNo: '21B0A0102', name: 'A. Kaustumbi' },
      ],
    },
    {
      yearLabel: 'II Years',
      students: [
        { regdNo: '22B0A0118', name: 'K. Hema Anithe' },
        { regdNo: '22B0A0110', name: 'D. Praasnna Lekshmi' },
        { regdNo: '22B0A0105', name: 'Ch. Mounike' },
        { regdNo: '22B0A0146', name: 'V. Jehnavi Kanakavalike' },
        { regdNo: '22B0A0130', name: 'N. Harshithe' },
        { regdNo: '22B0A0112', name: 'G. Harike' },
        { regdNo: '22B0A0128', name: 'M. Sudhe' },
        { regdNo: '22B0A0108', name: 'D. Sowjenya' },
      ],
    },
  ] as DhclStudentGroup[],
  outcomes: {
    heading: 'Startup Under Incubation',
    subheading: 'ITIC BUILD Winners',
    paragraphs: [
      'SUSTAINABLE MUD BLOCKS (TEAM SMB) have been selected as one of the 75 winners of the BUILD program organized by IIT Hyderabad Technology Incubation Centre (ITIC) from the Civil Engineering department of SVECW(A). The Teams will get a seed money of one lakh rupees to produce an industry-ready prototype.',
    ],
    brief: 'Creating eco-friendly, cost-effective, and sustainable homes while minimizing conventional construction problems can be achieved through stabilized mud blocks. These blocks utilize locally sourced materials, reducing the need for importing. They are economical, leading to more cost-effective structures. By adopting traditional construction techniques, we can lower the environmental impact. The result is a happy, lively home that harmonizes with nature and promotes sustainability.',
    team: {
      headers: ['S.No', 'Regd. No.', 'Name'],
      rows: [
        ['1', '20D01A0116', 'G. Kavya Sri – IV B.Tech'],
        ['2', '20D01A0123', 'K. Naga Suneetha – IV B.Tech'],
        ['3', '20D01A0114', 'G. Sraveni – IV B.Tech'],
        ['4', '21B0A0107', 'G. Hari Priya – IV B.Tech'],
        ['5', '20D01A0128', 'K. Hima Bindu – IV B.Tech'],
        ['6', '20D01A0141', 'P. Guna Satya Vani – IV B.Tech'],
        ['7', '21B0A0126', 'K. Lekshmi Praasnna – III B.Tech'],
        ['8', '22B0A0110', 'D. Praasnna Lekshmi – III B.Tech'],
        ['9', '22B0A0124', 'M. Poojithe – III B.Tech'],
        ['10', '22B0A0139', 'S. Varshini – III B.Tech'],
        ['11', '22B0A0147', 'V. Jehnavi – III B.Tech'],
        ['12', '22B0A0105', 'Ch. Mourice – II B.Tech'],
      ],
    } as DhclSimpleTable,
  },
  activities: [
    'Department of Civil Engineering organized a Civil Expo on April 1, 2023.',
    'Department of Civil Engineering organized an exposure visit to Smt. B. Seetha Polytechnic College students from November 13 – 16, 2023.',
  ],
};
