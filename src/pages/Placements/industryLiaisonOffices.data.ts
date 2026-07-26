// Rich per-office detail for the Industry Liaison Offices page's Regional
// Offices accordion — keyed by the exact office name as it appears in that
// row (item.tableText), same pattern as tpoTeamBios.data.ts. Only offices
// with detail provided so far are listed here; others fall back to the
// plain Role/Notes view already used for the short one-line summaries.
export interface IndustryLiaisonOffice {
  address: string[];
  bullets: string[];
}

export const industryLiaisonOffices: Record<string, IndustryLiaisonOffice> = {
  Chennai: {
    address: [
      'Sri Vishnu Educational Society,',
      'Thapar House, Ground Floor,',
      '37, Monteith Road, Egmore,',
      'Chennai- 600008.',
    ],
    bullets: [
      'Our ILO Office in Chennai closely work with core manufacturing companies like Caterpillar, Mahindra & Mahindra, Renault Nissan, Ashok Leyland, Hyundai, Brakes India Ltd (R&D), Robert Bosch, Rane, Kone Elevator, Siemens, Nokia Solutions & Networks Pvt Ltd and Schwing Stetter for Placement, Internship & Industrial Visit.',
      "We have 400 Alumni working in Chennai. Our ILO take care of Facilitation, Finding accommodation for new joining students in Chennai, Every year we organize event to gather alumni's. Helping to find new job for experienced alumni. Our strong alumni base makes new students to feel comfort & our ILO help to solve all their problems.",
      'To further strengthen the knowledge of our mechanical students in Automobile Engineering, Chennai core companies BMW sponsored Engines and Ford sponsored vehicles (Ford Eco Sport & Ford Figo), students get hands-on training on advanced technologies of Engines and Transmissions.',
      'We motivate students to participate in National level competitions like Caterpillar Tech Challenge, Hero Motor campus challenge, IIT Madras E-summit, Gokarting race in Coimbatore (Karimotor speedway – Prestigious competition) and get opportunities for placement & internship.',
    ],
  },
  Pune: {
    address: [
      'Sri Vishnu Educational Society,',
      'Office No. 302, 3rd Floor,',
      'Landmark Avenue, Deepa Society,',
      'Opp. Sant Tukaram School,',
      'Baner Pashan Link Road,',
      'Pune – 411045.',
    ],
    bullets: [
      'Pune placement office was started in the year 2012, the strategy to start the Pune office was to have a strong local connect with Industries of Maharashtra, as Pune, Mumbai, Nashik & Aurangabad have a very large number of Automobile Manufacturing Companies like Tata, Bajaj, JCB, Mahindra & Mahindra, Johndeere, Hyundai Excavators, Skoda, Sany Excavators, Volkswagen, Fiat and their ancillaries as well as large number of IT Companies in Mumbai & Pune region.',
      'The advantage of having an office in Pune is to have connect with Industry, where in we can have a core engineering employment job opportunities for the students as well as we can have many core Internships throughout the year wherein students have rich industrial experience before their final placement.',
      'We do different activities from the Pune office like we organize guest lectures of the Industry experts to our students as well as we organize Industry visits for the students with different companies.',
      'The Pune office have done lot of activities and have placed good number of students in Manufacturing and IT Companies.',
      'Now Pune office plays a major role in getting placements and Internship of Sri Vishnu Educational Society’s Students.',
    ],
  },
};
