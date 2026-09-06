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
      { label: 'Coursera Campus', url: 'https://www.coursera.org/', note: 'Faculty and students receive emails with login details to access courses.' },
      { label: 'TCS iON Digital Class Room', url: 'https://learning.tcsionhub.in/iDH/India/' },
      { label: 'TCS CodeVita Contest', url: 'https://campuscommune.tcs.com/en-in/intro/contests/codevita-season-9' },
    ],
  },
  {
    heading: 'National Initiatives',
    links: [
      { label: 'SWAYAM Online Courses' },
      { label: 'UG/PG UGC-MOOCs' },
      { label: 'e-PG Pathshala' },
      { label: 'e-Content Courseware in UG Subjects' },
      { label: 'SWAYAM PRABHA' },
      { label: 'CEC UGC YouTube Channel' },
      { label: 'e-ShodhSindhu: Consortium for Higher Education Electronic Resources' },
      { label: 'Vidwan' },
      { label: 'Khan Academy' },
      { label: 'NPTEL' },
      { label: 'AICTE – Free e-learning courses for students' },
    ],
  },
  {
    heading: 'International e-Learning Sites (Free Courses)',
    links: [
      { label: 'edX' },
      { label: 'Udacity' },
      { label: 'TED-Ed' },
      { label: 'Harvard' },
      { label: 'Stanford' },
      { label: 'University of Berkeley' },
      { label: 'MIT' },
      { label: 'Carnegie Mellon University' },
      { label: 'London School of Business and Finance' },
      { label: 'Edraak' },
      { label: 'Rawaq' },
      { label: 'Venture Lab' },
      { label: 'Lynda' },
      { label: 'openHPI' },
      { label: 'Philanthropy University' },
      { label: 'Udemy' },
      { label: 'CK-12' },
      { label: 'Skillshare' },
      { label: 'Codecademy' },
      { label: 'P2PU' },
      { label: 'Saylor Academy' },
      { label: 'Academic Earth' },
      { label: 'YouTube Education' },
      { label: 'Learn To Be' },
      { label: 'CourseTalk' },
      { label: 'Skill Academy' },
      { label: 'Alison' },
      { label: 'British Council Free Online Courses' },
    ],
  },
  {
    heading: 'Virtual Tours of Museums',
    links: [
      { label: 'Science Museum Group – 360° Tour', url: 'https://360tour.sciencemuseum.org.uk/' },
      { label: 'Museum of Science, Boston – MOS at Home', url: 'https://www.mos.org/mos-at-home' },
      { label: 'Royal Belgian Institute of Natural Sciences, Brussels', url: 'https://www.brusselsmuseums.be/en/museums/museum-of-natural-sciences-royal-belgian-institute-of-natural-sciences' },
      { label: 'Smithsonian National Museum of Natural History – Virtual Tour', url: 'https://naturalhistory.si.edu/visit/virtual-tour' },
      { label: 'National Museum of the U.S. Air Force – Virtual Tour', url: 'https://www.nationalmuseum.af.mil/Visit/Virtual-Tour/' },
      { label: 'Science Museum, London – Virtual Tour', url: 'https://www.sciencemuseum.org.uk/virtual-tour-science-museum' },
      { label: 'NASA Langley – Oral History Tour', url: 'https://oh.larc.nasa.gov/oh/' },
      { label: 'Royal Belgian Institute of Natural Sciences', url: 'https://www.naturalsciences.be/' },
    ],
  },
];
