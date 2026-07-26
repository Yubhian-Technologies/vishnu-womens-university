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
  pageTitle: 'CoE - Sustainable Construction Practices and Materials',
  overview: 'The Centre of Excellence for Sustainable Construction Practices and Materials (CSCPM) in the Department of Civil Engineering, in collaboration with UltraTech Cement Ltd, embodies a commitment to advancing sustainable practices in the construction industry. By leveraging the expertise and resources of both academia and industry, CSCPM aims to address pressing challenges and foster innovation in sustainable construction.',
  vision: 'We strive to be a beacon of excellence, shaping a world where sustainable construction materials lead the way in creating resilient, environmentally conscious, cost effective and socially responsible built environments.',
  mission: [
    'Empower individuals, especially women, in civil engineering with comprehensive education on sustainable construction materials.',
    'Develop skills for successful careers with a focus on social responsibility.',
    'Nurture professionalism and mentorship while encouraging research and innovation to bridge the gap between academia and industry.',
    'Deliver cutting-edge education for a sustainable competitive edge.',
  ],
  objectives: 'The Centre of Excellence for Sustainable Construction Practices and Materials (CSCPM) in partnership with UltraTech Cement Ltd aims to promote sustainability and innovation in the construction industry. The key objectives include Research and Development (R&D), Education and Training, Industry Collaboration, Technology Transfer and Consultancy Services.',
  inCharge: {
    name: 'Mr. Ramgopal. L',
    designation: 'Assistant Professor',
    email: 'ramgopalce@svecw.edu.in',
    mobile: '8148638402',
    interests: 'Concrete Technology, Light weight Concrete, Sustainable Construction Materials.',
  } as UltraTechInCharge,
  accordionSections: ['In-charge', 'Students Benefited', 'Activities'] as string[],
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
  accordionContent: {
    'Activities': [
      'Department of Civil Engineering, SVECW(A) Signed a MoU with UltraTech Cement Ltd on March 20, 2024.',
      'Department of Civil Engineering conducted a Webinar Talk Session on "A overview of Cement and Concrete" delivered by Er. J. Y. Breetha, Technical Service coordinator, UltraTech Cement Ltd on March 30, 2024.',
      'Department of Civil Engineering conducted a expert talk session for local Engineers, Contractors and Students on "Concrete Mix Design Program" delivered by Er. K. Venkataraman, Regional Head – Technical, UltraTech Cement Ltd on March 14, 2024.',
    ],
  } as Record<string, string[]>,
};
