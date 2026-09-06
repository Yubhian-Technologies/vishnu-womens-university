export interface AdmissionCategory {
  key: string;
  title: string;
  examName: string;
  description: string;
  eligibility?: string;
  steps: string[];
  codes?: { code: string; label: string }[];
}

export interface AdmissionTab {
  key: string;
  label: string;
  heading: string;
  intro: string;
  note?: string;
  categories: AdmissionCategory[];
}

const CATEGORY_B_FOOTNOTE =
  'Admission through Category B is subject to the prescribed eligibility criteria, University admission norms and availability of seats.';

export const admissionTabs: AdmissionTab[] = [
  {
    key: 'btech-regular',
    label: 'B.Tech Regular',
    heading: 'B.Tech. — Regular',
    intro:
      "Vishnu Women's University offers admission to B.Tech. programmes through Category A and Category B, providing eligible students with multiple pathways to begin their engineering education. Students who have completed 10+2 with MPC (Mathematics, Physics and Chemistry) and fulfil the prescribed eligibility criteria may seek admission through either of the applicable pathways.",
    categories: [
      {
        key: 'A',
        title: 'Category A — AP EAPCET 2027',
        examName: 'AP EAPCET 2027',
        description:
          'Eligible students can seek admission through AP EAPCET 2027 and participate in the applicable counselling and seat-allotment process.',
        eligibility:
          'Students who have completed 10+2 with MPC, subject to the prescribed programme-specific eligibility requirements.',
        steps: ['AP EAPCET 2027', 'Counselling', 'Web Options', 'Seat Allotment', 'Admission'],
        codes: [
          { code: 'VISW', label: "Vishnu Women's University" },
          { code: 'VISWPU', label: "Vishnu Women's University – applicable programme/institution code" },
        ],
      },
      {
        key: 'B',
        title: 'Category B — VWUNET',
        examName: "VWUNET — Vishnu Women's University National Entrance Test",
        description:
          "Eligible students may also seek admission through Category B by appearing for the Vishnu Women's University National Entrance Test (VWUNET). VWUNET provides an alternative admission pathway for eligible students and enables them to demonstrate their academic potential, aptitude and readiness for university-level engineering education.",
        steps: ['VWUNET', 'Merit/Selection', 'Admission'],
      },
    ],
  },
  {
    key: 'btech-lateral',
    label: 'B.Tech Lateral Entry',
    heading: 'B.Tech. Lateral Entry',
    intro:
      'Students who have successfully completed a Diploma in Engineering/Technology and meet the prescribed eligibility requirements may seek lateral entry directly into the second year of the B.Tech. programme.',
    categories: [
      {
        key: 'A',
        title: 'Category A — AP ECET 2027',
        examName: 'AP ECET 2027',
        description: 'Lateral Entry admissions are made through Category A only.',
        eligibility: 'Diploma holders in Engineering/Technology, subject to the prescribed eligibility requirements.',
        steps: ['AP ECET 2027', 'Counselling', 'Web Options', 'Seat Allotment', 'Admission'],
      },
    ],
  },
  {
    key: 'mtech',
    label: 'M.Tech (PG)',
    heading: 'M.Tech. (PG)',
    intro:
      "Vishnu Women's University offers M.Tech. programmes for graduates seeking advanced knowledge, specialised expertise and opportunities for professional and research-oriented growth. Eligible candidates can seek admission through Category A or Category B.",
    categories: [
      {
        key: 'A',
        title: 'Category A — AP PGCET',
        examName: 'AP PGCET',
        description:
          'Eligible candidates may seek admission through the AP PGCET, followed by the applicable counselling and seat-allotment process.',
        steps: ['AP PGCET', 'Counselling', 'Web Options', 'Seat Allotment', 'Admission'],
      },
      {
        key: 'B',
        title: 'Category B — VWUNET',
        examName: "VWUNET — Vishnu Women's University National Entrance Test",
        description:
          "Eligible candidates may also seek admission through Category B by appearing for the Vishnu Women's University National Entrance Test (VWUNET). VWUNET provides an alternative pathway for eligible candidates seeking admission to M.Tech. programmes.",
        steps: ['VWUNET', 'Merit/Selection', 'Admission'],
      },
    ],
  },
  {
    key: 'mba',
    label: 'MBA (PG)',
    heading: 'MBA (PG)',
    intro:
      "The MBA programme at Vishnu Women's University offers Category A and Category B pathways for eligible graduates seeking to develop advanced capabilities in management, leadership, strategy and entrepreneurship.",
    categories: [
      {
        key: 'A',
        title: 'Category A — AP ICET',
        examName: 'AP ICET',
        description: 'Eligible candidates may seek admission through AP ICET, followed by the applicable counselling and seat-allotment process.',
        steps: ['AP ICET', 'Counselling', 'Web Options', 'Seat Allotment', 'Admission'],
      },
      {
        key: 'B',
        title: 'Category B — VWUNET',
        examName: "VWUNET — Vishnu Women's University National Entrance Test",
        description:
          "Eligible candidates may also seek admission through Category B by appearing for the Vishnu Women's University National Entrance Test (VWUNET). VWUNET provides an additional pathway for eligible graduates seeking admission to the MBA programme.",
        steps: ['VWUNET', 'Merit/Selection', 'Admission'],
      },
    ],
  },
];

export { CATEGORY_B_FOOTNOTE };
