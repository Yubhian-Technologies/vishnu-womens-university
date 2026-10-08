// Governing Body composition — source: "GB=UPDATED.pdf".
// Used as the public-page fallback and as the admin "Populate" seed.

export interface GoverningBodyDefault {
  number: number; // as printed in the PDF (7 and 9 are intentionally absent)
  name: string;
  details: string;
}

export const GOVERNING_BODY_DEFAULTS: GoverningBodyDefault[] = [
  { number: 1, name: 'Sri K.V. Vishnu Raju', details: 'Chancellor of the University & Chairman of SVES' },
  { number: 2, name: 'Dr. K V N Sunitha', details: 'Vice-Chancellor of the University' },
  {
    number: 3,
    name: 'Dr. Seema Varma',
    details: 'Professor, Department of Electronics and Communication & Additional Project Director at Siemens, NITTTR, Bhopal',
  },
  { number: 4, name: 'Dr. Uma', details: 'Associate Project Director, Venus Orbitor Mission, URSC, Bangalore' },
  {
    number: 5,
    name: 'Dr. Mini Shaji Thomas',
    details: 'Former Director of NIT Trichy, Faculty of Engineering & Technology, Jamia Milia Islamia Central University, New Delhi',
  },
  {
    number: 6,
    name: 'Ms. Rani Muralidharan',
    details: 'Home Grown Industrialist , Chartered Accountant, IndePenn Connections Pvt Ltd, Chennai',
  },
  { number: 8, name: 'Prof.S. Vijaya Bhaskara Rao', details: 'Chairman, APSCHE' },
  { number: 10, name: 'Dr. P Srinivasa Raju', details: 'Registrar of the University' },
  { number: 11, name: 'Sri Ravi Chandran Rajagopal', details: 'Vice Chairman of SVES' },
  { number: 12, name: 'Mr K Aditya Vissam', details: 'Secretary of SVES' },
  { number: 13, name: 'Dr. G Srinivasa Rao', details: 'Pro Vice-Chancellor of the University' },
  { number: 14, name: '', details: 'Secretary, Govt. of AP, Higher Education Department' },
  { number: 15, name: '', details: 'Nominee of CII' },
];

export const GOVERNING_BODY_NOTES: string[] = [
  'The Chancellor is the chairperson of the Governing Body, and the Registrar is the Member-Secretary without voting rights',
  'The term of office of an ex-officio member shall be as long as he/she holds the post by virtue of which he/she becomes a member of the Governing Body',
  'The GB shall meet at least four (4) times in an academic year, with at least one meeting in a quarter',
];
