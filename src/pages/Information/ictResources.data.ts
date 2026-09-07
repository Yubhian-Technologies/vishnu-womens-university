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
  {
    heading: 'International e-Learning Sites (Free Courses)',
    links: [
      { label: 'edX', url: 'https://www.edx.org/' },
      { label: 'Udacity', url: 'https://www.udacity.com/' },
      { label: 'TED-Ed', url: 'https://ed.ted.com/' },
      { label: 'Harvard', url: 'https://online-learning.harvard.edu/catalog' },
      { label: 'Stanford', url: 'https://online.stanford.edu/' },
      { label: 'University of Berkeley', url: 'https://extension.berkeley.edu/onlinewebcast.berkeley.edu' },
      { label: 'MIT', url: 'https://www.ocw.mit.edu/' },
      { label: 'Carnegie Mellon University', url: 'https://oli.cmu.edu/' },
      { label: 'London School of Business and Finance', url: 'https://gus.cvtr.io/lp/lsbf-ee' },
      { label: 'Edraak', url: 'https://www.edraak.org/' },
      { label: 'Rawaq', url: 'https://www.rwaq.org/' },
      { label: 'Venture Lab', url: 'https://www.venture-lab.org/' },
      { label: 'Lynda', url: 'https://www.lynda.com/' },
      { label: 'openHPI', url: 'https://open.hpi.de/' },
      { label: 'Philanthropy University', url: 'https://www.philanthropyu.org/' },
      { label: 'Udemy', url: 'https://www.udemy.com/' },
      { label: 'CK-12', url: 'https://www.ck12.org/' },
      { label: 'Skillshare', url: 'https://www.skillshare.com/' },
      { label: 'Codecademy', url: 'https://www.codecademy.com/' },
      { label: 'P2PU', url: 'https://www.p2pu.org/' },
      { label: 'Saylor Academy', url: 'https://www.saylor.org/' },
      { label: 'Academic Earth', url: 'https://www.academicearth.org/' },
      { label: 'YouTube Education', url: 'https://www.youtube.com/education' },
      { label: 'Learn To Be', url: 'https://www.learntobe.org/' },
      { label: 'CourseTalk', url: 'http://www.coursetalk.org/' },
      { label: 'Skill Academy', url: 'https://www.skillacademy.com/' },
      { label: 'Alison', url: 'http://www.alison.com/' },
      { label: 'British Council Free Online Courses', url: 'https://opportunitiescorners.info/british-council-free-online-courses-2020/' },
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
