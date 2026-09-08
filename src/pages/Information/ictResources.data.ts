// Static reference lists shown on Information → ICT Platforms, below the
// admin-managed platform cards (contentBlocks: information/ictPlatforms).
// This is a historical link archive carried over from the old SVECW site —
// it changes rarely and has a heading + nested-list shape the flat
// contentBlocks model can't represent, so it lives here as static data.
// A link with no `url` renders as plain text (the source page listed it
// without a working link).

export interface IctResourceLink {
  label: string;
  url?: string;
  note?: string;
}

export interface IctResourceGroup {
  heading: string;
  links: IctResourceLink[];
}

export const ICT_RESOURCE_GROUPS: IctResourceGroup[] = [
  {
    heading: 'More Online Digital Resources for Students & Faculty',
    links: [
      { label: 'VEDIC DEV', url: 'https://www.vedic.dev/login/' },
      { label: 'VISHNU LMS', url: 'https://vishnulearning.com/login/index.php' },
      { label: 'CodeTantra', url: 'https://svecw.codetantra.com/login.jsp' },
      { label: 'A Memo to Students on Punching Through the Pandemic', url: 'https://www.teachingprofessor.com/covid-19/a-memo-to-students-on-punching-through-the-pandemic/' },
      { label: 'Practice and improve your communication skills', url: 'https://mirrorai.perspect.ai/' },
      { label: 'Online assessments platform to prepare for campus recruitments', url: 'https://www.placementseason.com/products/2021-company-specific-free-mock-test-series' },
    ],
  },
  {
    heading: 'National Initiatives',
    links: [
      { label: 'SWAYAM Online Courses', url: 'http://storage.googleapis.com/uniquecourses/online.html' },
      { label: 'UG/PG UGC-MOOCs', url: 'http://ugcmoocs.inflibnet.ac.in/ugcmoocs/moocs_courses.php' },
      { label: 'e-PG Pathshala', url: 'https://epgp.inflibnet.ac.in/' },
      { label: 'e-Content Courseware in UG Subjects', url: 'http://cec.nic.in/cec/' },
      { label: 'SWAYAM PRABHA', url: 'https://swayamprabha.gov.in/' },
      { label: 'CEC UGC YouTube Channel', url: 'https://m.youtube.com/user/cecedusat' },
      { label: 'e-ShodhSindhu: Consortium for Higher Education Electronic Resources', url: 'https://ess.inflibnet.ac.in/' },
      { label: 'Vidwan', url: 'https://vidwan.inflibnet.ac.in/' },
      { label: 'Khan Academy', url: 'https://www.khanacademy.org/' },
      { label: 'NPTEL', url: 'https://nptel.ac.in/' },
      { label: 'AICTE – Free e-learning courses for students', url: 'https://www.indiatoday.in/education-today/notification/story/aicte-launches-49-free-e-learning-courses-for-students-preparing-for-govt-banking-and-corporate-jobs-1674130-2020-05-04' },
    ],
  },
];
