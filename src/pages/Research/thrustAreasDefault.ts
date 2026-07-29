// Fallback content for the Thrust Areas of Research item, sourced from
// https://svecw.edu.in/thrust-areas-of-research/. Firestore's researchItems
// doc for this slug may not have its intro/accordionText fields filled in
// yet from the admin panel — these constants are used by ResearchDetail.tsx
// so the page renders the real overview paragraph and the full department ->
// research area -> faculty accordion out of the box instead of staying blank
// (or falling back to a plain table) until someone pastes the same text into
// the admin panel. Once an admin does fill in the Firestore field, that value
// takes over (see ResearchDetail.tsx).
//
// Each faculty member links to our own internal research-profile page
// (/research/faculty/:id) rather than their external IRINS profile — the
// numeric id is kept only as a stable, unique key for that internal route.
export const DEFAULT_THRUST_AREAS_INTRO = 'VWU faculty members specialize in a variety of research trust areas fostering interdisciplinary collaboration and impactful discoveries. Through their dedicated expertise, they contribute significantly to advancing knowledge and addressing complex challenges in these critical domains.';
interface ThrustFaculty {
  name: string;
  id: string;
}

interface ThrustArea {
  name: string;
  faculty: ThrustFaculty[];
}

interface ThrustCategory {
  title: string;
  areas: ThrustArea[];
}

const THRUST_CATEGORIES: ThrustCategory[] = [
  {
    title: 'Computer Science & Engineering',
    areas: [
      {
        name: 'Machine Learning',
        faculty: [
          { name: 'K. Padma Vasavi', id: '149610' },
          { name: 'Pokkuluri Kiran Sree', id: '49369' },
          { name: 'A. Sri Krishna', id: '148168' },
          { name: 'V V R Maheswara Rao', id: '148183' },
          { name: 'Anuj Rapaka', id: '149688' },
          { name: 'M Narasimha Raju', id: '148163' },
          { name: 'S. Ravi Kumar', id: '148083' },
          { name: 'N D S S Kiran Relagi', id: '261729' },
          { name: 'G. Ratna Kanth', id: '148433' },
          { name: 'M. Venkata Subbarao', id: '149738' },
          { name: 'Dr. G Durga Prasad', id: '147798' },
        ],
      },
      {
        name: 'Deep Learning',
        faculty: [
          { name: 'K. Padma Vasavi', id: '149610' },
          { name: 'A. Sri Krishna', id: '148168' },
          { name: 'M. Venkata Subbarao', id: '149738' },
          { name: 'G. Ratna Kanth', id: '148433' },
        ],
      },
      {
        name: 'Data Mining',
        faculty: [
          { name: 'V. Purushothama Raju', id: '148150' },
          { name: 'T Gayathri', id: '148184' },
          { name: 'K. Ramachandra Rao', id: '148103' },
          { name: 'A Seenu', id: '148019' },
        ],
      },
      {
        name: 'Data Science',
        faculty: [
          { name: 'A. Sri Krishna', id: '148168' },
          { name: 'P. Sricharani', id: '149340' },
          { name: 'Chandra Sekhar Kolli', id: '455015' },
          { name: 'Dr V Pavan Kumar', id: '148525' },
        ],
      },
    ],
  },
  {
    title: 'Electronics & Communication Engineering',
    areas: [
      {
        name: 'Computer Networks',
        faculty: [
          { name: 'D V Naga Raju', id: '148438' },
          { name: 'RajaRao PBV', id: '328450' },
          { name: 'M. Prasad', id: '328447' },
        ],
      },
      {
        name: 'IoT',
        faculty: [{ name: 'Srikanth Pala', id: '149695' }],
      },
      {
        name: 'Antennas',
        faculty: [
          { name: 'G R L V N Srivasa Raju', id: '149740' },
          { name: 'S Hanumantha Rao', id: '149741' },
          { name: 'Ratikanta Sahoo', id: '149737' },
          { name: 'Dr. M. Padmanabha Raju', id: '149725' },
        ],
      },
      {
        name: 'VLSI',
        faculty: [
          { name: 'M V Ganeswara Rao', id: '196149' },
          { name: 'K. S. N. Raju', id: '149728' },
          { name: 'M. Sumalatha', id: '262462' },
        ],
      },
      {
        name: 'Communication Systems',
        faculty: [
          { name: 'Sudheer Kumar Terlapu', id: '149739' },
          { name: 'P Ravikumar', id: '149742' },
          { name: 'Dr. M. Venkata Subbarao', id: '149738' },
        ],
      },
      {
        name: 'Signal & Image Processing',
        faculty: [
          { name: 'K. Padma Vasavi', id: '149610' },
          { name: 'Dr M Pradeep', id: '149636' },
          { name: 'M. Prema Kumar', id: '149651' },
          { name: 'M. Venkata Subbarao', id: '149738' },
          { name: 'M. Sumalatha', id: '262462' },
        ],
      },
    ],
  },
  {
    title: 'Electrical & Electronics Engineering',
    areas: [
      {
        name: 'Control System',
        faculty: [{ name: 'M. V. Srikanth', id: '149715' }],
      },
      {
        name: 'Power Electronics & Drives',
        faculty: [
          { name: 'S. M. Padmaja', id: '148176' },
          { name: 'J. Rohith Balaji', id: '149719' },
          { name: 'B. Ramu', id: '147992' },
        ],
      },
      {
        name: 'Power Systems',
        faculty: [
          { name: 'S. D. K. Varma', id: '148085' },
          { name: 'K. Kalyan Sagar', id: '149714' },
        ],
      },
      {
        name: 'Electrical Machines & Drives',
        faculty: [{ name: 'SSSR Sarathbabu Duvvuri', id: '147978' }],
      },
    ],
  },
  {
    title: 'Mechanical Engineering',
    areas: [
      {
        name: 'Metal Forming',
        faculty: [
          { name: 'Dr Ch Hari Krishna', id: '149710' },
          { name: 'B. N. Malleswara Rao', id: '149855' },
        ],
      },
      {
        name: 'Manufacturing',
        faculty: [
          { name: 'Dr Ch Hari Krishna', id: '149710' },
          { name: 'Asnit Gangwar', id: '511932' },
        ],
      },
      {
        name: 'Nano Material',
        faculty: [{ name: 'Asnit Gangwar', id: '511932' }],
      },
      {
        name: 'Machine Design',
        faculty: [
          { name: 'G. Srinivasa Rao', id: '149712' },
          { name: 'P. Srinivasa Raju', id: '149711' },
        ],
      },
      {
        name: 'Thermal Engineering',
        faculty: [{ name: 'Siva Kumar Krishnan', id: '229500' }],
      },
    ],
  },
  {
    title: 'Civil Engineering',
    areas: [
      {
        name: 'Transportation Engineering & Management',
        faculty: [{ name: 'Pala Gireesh Kumar', id: '149684' }],
      },
    ],
  },
  {
    title: 'Science & Humanities',
    areas: [
      {
        name: 'Mathematics',
        faculty: [
          { name: 'Ravi Kiran', id: '149676' },
          { name: 'T. Sree Rama Murthy', id: '149675' },
          { name: 'Yedlapalli Phani', id: '149672' },
          { name: 'R Vasu Babu', id: '149170' },
          { name: 'P. L. R. Kameswari', id: '148857' },
        ],
      },
      {
        name: 'Physics',
        faculty: [
          { name: 'J. V. Srinivasu', id: '149665' },
          { name: 'PS Brahmanandam', id: '148429' },
          { name: 'B V Naveen Kumar', id: '328369' },
        ],
      },
      {
        name: 'Chemistry',
        faculty: [
          { name: 'K. Jagadeesh', id: '167758' },
          { name: 'K Ganesh Kadiyala', id: '148808' },
        ],
      },
      {
        name: 'English Language Teaching',
        faculty: [
          { name: 'P. Sreehari Raju', id: '340472' },
          { name: 'G. J. V. Prasad', id: '149667' },
        ],
      },
    ],
  },
  {
    title: 'Management',
    areas: [
      {
        name: 'Finance & HRM',
        faculty: [
          { name: 'Subba Raju', id: '328098' },
          { name: 'M. Karthik', id: '328083' },
          { name: 'K. V. Rama Murthy', id: '500813' },
        ],
      },
    ],
  },
];

function facultyProfilePath(name: string, id: string, area: string, category: string): string {
  const params = new URLSearchParams({ name, area, category });
  return `/research/faculty/${id}?${params.toString()}`;
}

export const DEFAULT_THRUST_AREAS_TEXT = THRUST_CATEGORIES.map((cat) => {
  const areasText = cat.areas
    .map((area) => {
      const itemsText = area.faculty
        .map((f) => `${f.name} | ${facultyProfilePath(f.name, f.id, area.name, cat.title)}`)
        .join('\n');
      return `### ${area.name}\n${itemsText}`;
    })
    .join('\n');
  return `## ${cat.title}\n${areasText}`;
}).join('\n\n');
