export interface FacultyMember {
  name: string;
  designation: string;
  qualification: string;
}

// ── CSE Department ────────────────────────────────────────────────────────────
export const cseFaculty: FacultyMember[] = [
  { name: 'Dr. P. Kiran Sree',          designation: 'Professor & HOD',    qualification: 'Ph.D.' },
  { name: 'Dr. V. Purushothama Raju',   designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. V. V. R. Maheswara Rao', designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. K. Ramachandra Rao',     designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. A. Seenu',               designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. P. R. Sudha Rani',       designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. T. Gayathri',            designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Mr. Y. Ramu',                designation: 'Associate Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. P. J. R. Shalem Raju',   designation: 'Associate Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. M. Prasad',              designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. P. Srikanth',            designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. P. B. V. Raja Rao',      designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. J. Veeraraghavan',       designation: 'Associate Professor', qualification: 'Ph.D.' },
];

// ── AI Department ─────────────────────────────────────────────────────────────
export const aiFaculty: FacultyMember[] = [
  { name: 'Dr. A. Sri Krishna',          designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. P. Sricharani',           designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. G. Durga Prasad',         designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. A. Senthil Kumar',        designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Mr. N. Praveen Kumar',        designation: 'Assistant Professor', qualification: 'M.E.(Ph.D.)' },
  { name: 'Mrs. T. Madhavi',             designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mrs. M. L.V.A. Priya',        designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. D. S. S. Konada Babu',   designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. K. Janaki Siva Rama Raju', designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Ms. Ch. Sravani',            designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. Shunmuga Anandaraj',     designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mrs. P. Archana',            designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. K. Raja Sekhar',         designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. P. Abhilasha',           designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. P. Vinod Babu',          designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. U. Sushmitha',           designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'Dr. H. C. P. Pavan Kumar',   designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mrs. R. Sarada',             designation: 'Assistant Professor', qualification: 'M.Tech.' },
];

// ── IT Department ─────────────────────────────────────────────────────────────
export const itFaculty: FacultyMember[] = [
  { name: 'Dr. D. Venkata Naga Raju',    designation: 'Professor & HOD',    qualification: 'Ph.D.' },
  { name: 'Mr. P. Venkata Rama Raju',    designation: 'Professor',           qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. G. Ratnakanth',           designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. V. Pavan Kumar',          designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Mr. S. Sreenivasu',           designation: 'Associate Professor', qualification: 'M.E.(Ph.D.)' },
  { name: 'Dr. A. Veera Raghava Rao',    designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. S. Ravi Kumar',           designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'Mr. S. Ravi Chandra',         designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. K. Ramu',                 designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. V. Leela Prasad',         designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. M. Suma Bharathi',       designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. B. Sasi Kumar',           designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. K. Spandana',            designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mrs. B. Padma',               designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mrs. B. Sri Lakshmi Devi',    designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. E. Prasanthi',           designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. D. Grace Priyanka',      designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. R. Srinath',              designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Ms. V. Lakshmi Tejaswi',      designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. K. Dileep Kumar',         designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. V. S. N. Murthy',         designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. D. Srinivasa Rao',        designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. P. L. V. D. Ravi Kumar',  designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. M. Srinivasa Rao',        designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Ms. Y. Sabitha',              designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. G.A.K.S. Rajeev Kumar',   designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. P. Vinay',                designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. Y. Yesu Jyothi',         designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. M. Bhanu Ranga Rao',      designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. M. Raghu Chandra',        designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mrs. Ch. Raja Rajeswari',     designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. K. Lakshmaji',            designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Dr. R. N. D. S. S. Kiran',    designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'B. Yugandhar',                designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. K. Rambabu',              designation: 'Assistant Professor', qualification: 'M.Tech.' },
];

// ── ECE Department ────────────────────────────────────────────────────────────
export const eceFaculty: FacultyMember[] = [
  { name: 'Dr. K. Padma Vasavi',        designation: 'Professor & HOD',    qualification: 'Ph.D.' },
  { name: 'Dr. G. R. L. V. N. S. Raju', designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. S. Hanumantha Rao',      designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. M. Prema Kumar',         designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Mr. V. Srinivasa Rao',       designation: 'Associate Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. K. Murthy Raju',         designation: 'Associate Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. M. Pradeep',             designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. M. V. Ganeswara Rao',    designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. T. Sudheer Kumar',       designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. M. V. Subbarao',         designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. P. Ravi Kumar',          designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. K. S. N. Raju',          designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. Ratikanta Sahoo',        designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Mr. D. Murali Krishna',      designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. M. Padmanabha Raju',     designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'Mr. E. R. Praveen Kumar',    designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. D. Ramesh Varma',        designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'Mr. P. Subrahmanyam',        designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. V. Radha Haneesha',     designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. D. Girish Kumar',        designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. G. Challa Ram',          designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'Mr. P. Narasimha Rao',       designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. T. Pavani',             designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Dr. M. Sumalatha',           designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'Ms. M. Hemalatha',           designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. K. Ajitha Lakshmi',     designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mr. K. Hari Krishna',        designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. B. Vaisalini',          designation: 'Assistant Professor', qualification: 'M.Tech.' },
];

// ── EEE Department ────────────────────────────────────────────────────────────
export const eeeFaculty: FacultyMember[] = [
  { name: 'Dr. S. M. Padmaja',            designation: 'Professor & HOD',    qualification: 'Ph.D.' },
  { name: 'Dr. S. Dileep Kumar Varma',    designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. SSSR Sarathbabu Duvvuri', designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. J. Rohith Balaji',         designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Dr. K. Kalyan Sagar',          designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Mrs. G. Bharathi',             designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. M. V. Srikanth',           designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'Mr. K. P. Swaroop',            designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. K. Omkar',                 designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mrs. Y. T. R. Palleswari',     designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. S. Veera Babu',            designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. D. Lakshman Kumar',        designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Dr. B. Ramu',                  designation: 'Assistant Professor', qualification: 'Ph.D.' },
  { name: 'Mr. B. Mahendra Chand',        designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. R. Pradeep Sudha',         designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. M. Siva Rama Ganesh',      designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. A. Siva',                  designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
];

// ── CE Department ─────────────────────────────────────────────────────────────
export const ceFaculty: FacultyMember[] = [
  { name: 'Dr. Pala Gireesh Kumar', designation: 'Professor & HOD',    qualification: 'Ph.D.' },
  { name: 'Dr. V. Kesava Raju',     designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Mr. B. Venkatesh',       designation: 'Assistant Professor', qualification: 'M.E.(Ph.D.)' },
  { name: 'Ms. M. Surya Kumari',    designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mrs. P. Lavanya',        designation: 'Assistant Professor', qualification: 'M.E.' },
  { name: 'Mrs. S. Manjula',        designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. Bh. Suresh Varma',   designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Ms. V. Manasa',          designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Mrs. A. Tripura',        designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Ms. Ch. Harika',         designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'L. RamGopal',            designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'N. Haripavan',           designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'B. Sudhir Kumar',        designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
];

// ── ME Department ─────────────────────────────────────────────────────────────
export const meFaculty: FacultyMember[] = [
  { name: 'Dr. Ch. Hari Krishna',      designation: 'Professor & HOD',    qualification: 'Ph.D.' },
  { name: 'Dr. P. Srinivasa Raju',     designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. G. Srinivasa Rao',      designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. Sivakumar Krishnan',    designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. B. N. Malleswara Rao',  designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Mr. P. Surya Prakash Varma', designation: 'Associate Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. N. Srinivasa Rao',      designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. J. V. Narasimha Raju',  designation: 'Assistant Professor', qualification: 'M.E.(Ph.D.)' },
  { name: 'Mr. B. Satya Krishna',      designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. Manoneet Kumar',        designation: 'Assistant Professor', qualification: 'M.E.(Ph.D.)' },
  { name: 'Mr. U.D.S. Prathap Varma',  designation: 'Assistant Professor', qualification: 'M.E.' },
  { name: 'Mr. J E Manikanta',         designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. A S V Prasad',          designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. Shaik Madhar Pasha',    designation: 'Assistant Professor', qualification: 'M.E.(Ph.D.)' },
  { name: 'Ms. G. Mounica',            designation: 'Assistant Professor', qualification: 'M.E.' },
  { name: 'Mr. N. Raja Sekhar',        designation: 'Assistant Professor', qualification: 'M.Tech.(Ph.D.)' },
  { name: 'Mr. Maddipati Rajesh',      designation: 'Assistant Professor', qualification: 'M.E.(Ph.D.)' },
  { name: 'Mr. P. Phani Kumar',        designation: 'Assistant Professor', qualification: 'M.Tech.' },
  { name: 'Dr. Asnit Gangwar',         designation: 'Assistant Professor', qualification: 'Ph.D.' },
];

// ── MBA Department ────────────────────────────────────────────────────────────
export const mbaFaculty: FacultyMember[] = [
  { name: 'Dr. G. Subba Raju',       designation: 'Professor',           qualification: 'Ph.D.' },
  { name: 'Dr. M. Karthik',          designation: 'Associate Professor', qualification: 'Ph.D.' },
  { name: 'Mrs. J. Swarna Jyothi',   designation: 'Assistant Professor', qualification: 'MBA' },
  { name: 'Mr. Ch. Anudeep',         designation: 'Assistant Professor', qualification: 'MBA (Ph.D.)' },
  { name: 'Mrs. M. Harshitha Keerthi', designation: 'Assistant Professor', qualification: 'M.B.A.' },
  { name: 'Dr. K. V. Rama Murthy',   designation: 'Assistant Professor', qualification: 'Ph.D.' },
];
