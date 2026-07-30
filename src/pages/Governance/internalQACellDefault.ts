// Fallback content for the Internal Quality Assurance Cell (committee)
// item, sourced from https://svecw.edu.in/internal-quality-assurance-cell/.
// Firestore's governanceItems doc for this slug currently holds a
// condensed 13-row tableText (grouping rows like "Faculty Members (9)" and
// "Student Representatives (3)" instead of naming each member, and missing
// the Designation/Type of Membership/Position columns) — this always wins
// over item.tableText (see GovernanceDetail.tsx) until an admin replaces it
// with the full 25-member roster below.
export interface IQACCellMember {
  name: string;
  designation: string;
  membershipType: string;
  position: string;
}

export const IQAC_CELL_MEMBERS: IQACCellMember[] = [
  { name: 'Dr. G. Srinivasa Rao', designation: 'Principal', membershipType: 'Head of the Institution', position: 'Chairman' },
  { name: 'Sri. J. V. S. S. Prasad Raju', designation: 'Director-Admin, SVES', membershipType: 'Management', position: 'Member' },
  { name: 'Prof. P. Venkata Rama Raju', designation: 'Vice Principal', membershipType: 'Administrative Officer', position: 'Member' },
  { name: 'Dr. G. R. L. V. N. S. Raju', designation: 'Dean R & D', membershipType: 'Administrative Officer', position: 'Member' },
  { name: 'Dr. V. Purushothama Raju', designation: 'Dean Academics', membershipType: 'Administrative Officer', position: 'Member' },
  { name: 'Mr. Md. Siddiq', designation: 'Administrative Officer', membershipType: 'Administrative Officer', position: 'Member' },
  { name: 'Mr. S. S. S. Varma', designation: 'Finance Manager, SVES', membershipType: 'Administrative Officer', position: 'Member' },
  { name: 'Mr. N. Praveen Kumar', designation: 'Asst. Prof., AI Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Dr. M. V. Srikanth', designation: 'Asst. Prof., EEE Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Dr. G. Durga Prasad', designation: 'Professor, AI Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Dr. S. Hanumantha Rao', designation: 'Professor, ECE Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Mr. K. P. Swaroop', designation: 'Asst. Prof., EEE Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Dr. M. V. Ganeswara Rao', designation: 'Assoc. Prof., ECE Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Dr. K. Rama Chandra Rao', designation: 'Professor, CSE Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Dr. N. Silpa', designation: 'Asst. Prof., CSE Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Mrs. P. Lavanya', designation: 'Asst. Prof., CE Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Mr. D. B. N. Suresh Varma', designation: 'Asst. Prof., Freshman Dept.', membershipType: 'Faculty', position: 'Member' },
  { name: 'Sri. G. V. M. Raju', designation: 'Village President, Kovvada', membershipType: 'Local Society', position: 'Member' },
  { name: 'Mr. A. S. Narayana Varma', designation: 'DGM Productions', membershipType: 'Employer', position: 'Member' },
  { name: 'Mr. M. S. Vara Prasad', designation: 'Parent', membershipType: 'Parent', position: 'Member' },
  { name: 'Ms. V. Vaishalini', designation: 'Software Engineer, VISA', membershipType: 'Alumni', position: 'Member' },
  { name: 'Ms. Ch. Gayathri Devi', designation: 'B.Tech. — Student Representative', membershipType: 'Student', position: 'Member' },
  { name: 'Ms. G. Hemalatha', designation: 'M.Tech. — Student Representative', membershipType: 'Student', position: 'Member' },
  { name: 'Ms. S. Sangeetha', designation: 'M.B.A. — Student Representative', membershipType: 'Student', position: 'Member' },
  { name: 'Dr. V. V. R. Maheswara Rao', designation: 'Dean Statutory Bodies', membershipType: 'Administrative Officer', position: 'Coordinator' },
];

export const IQAC_CELL_FUNCTIONS: string[] = [
  'Development and application of quality benchmarks/parameters for various academic and administrative activities of the institution',
  'Facilitating the creation of a learner-centric environment conducive to quality education and faculty maturation to adopt the required knowledge and technology for participatory teaching and learning process',
  'Arrangement for feedback from students, parents and other stakeholders on quality-related institutional processes',
  'Dissemination of information on various quality parameters of higher education',
  'Organization of inter & intra workshops, seminars on quality related themes & promotion of quality circles',
  'Documentation of the various programmes /activities leading to quality improvement',
  'Acting as a nodal agency of the Institution for coordinating quality-related activities, including adoption and dissemination of best practices',
  'Development and maintenance of institutional database through MIS for the purpose of maintaining/enhancing the institutional quality',
  'Preparation of the Annual Quality Assurance Report (AQAR) as per guidelines and parameters of NAAC',
];
