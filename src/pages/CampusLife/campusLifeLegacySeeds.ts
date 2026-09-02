// One-time starter-content converters for the Campus Life admin (see
// src/pages/Admin/sections/CampusLifeAdmin.tsx) — turn each page's
// previously-hardcoded (or Page-Content-Blocks-driven) content into the
// Custom Sections / Custom Tabs shape, so nothing is lost in the move.
// Purely additive scaffolding: an admin clicks "Add starter content" once
// per page, this only ever *proposes* a value into the form, and nothing
// reaches Firestore until they click Update.
//
// Source content was read directly from the (now-retired) bespoke page
// components this replaces: campusFacilities.data.ts, CentralLibrary.tsx,
// CampusHostels.tsx, OtherFacilities.tsx, CampusMagazines.tsx, and — for
// the pages that had no local fallback (VishnuTV/ArtsCulture/SportsGames/
// SocialServices, previously 100% Page-Content-Blocks-driven) — the actual
// live `contentBlocks` Firestore documents for those pages at the time of
// this migration.

import { generateSectionId, type CustomSection } from '../../lib/customSections';
import { generateTabId, type CustomTab } from '../../lib/customTabs';
import { serializeFlexibleTable } from '../../lib/structuredTable';

type SeedResult = { customSections?: CustomSection[]; tabs?: CustomTab[] };

function push(list: CustomSection[], section: Omit<CustomSection, 'id'>): CustomSection {
  const s: CustomSection = { id: generateSectionId(section.label, list), ...section };
  list.push(s);
  return s;
}
function pushTab(list: CustomTab[], label: string, sections: CustomSection[]): CustomTab {
  const t: CustomTab = { id: generateTabId(label, list), label, sections };
  list.push(t);
  return t;
}
function table(headers: string[], rows: string[][]): string {
  return serializeFlexibleTable([{ title: '', headers, rows }]);
}
// Strips the light markdown used in campusFacilities.data.ts bodies
// (#/##/###/#### headings, **bold**) down to plain text — CustomSectionBody
// Content's 'text' renderer is plain pre-line text, no markdown support.
function stripMarkdown(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/^#{1,4}\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1'))
    .join('\n');
}

// Common shape shared by every plain campusFacilities.data.ts entry — a
// body that's a sequence of paragraph and "- " bullet-list runs, in
// whatever order they actually appear (most facilities are a single
// paragraph run, some are paragraph-then-bullets, and a few — like
// State-of-the-art Labs — alternate paragraph/bullets more than once).
// Walks the runs in order rather than collecting all paragraphs into one
// block and all bullets into another, so a facility whose bullets are
// grouped under two different paragraphs keeps that grouping instead of
// merging into one big list at the end.
function facilitySections(bodyOrDesc: string): CustomSection[] {
  type Run = { type: 'text'; text: string } | { type: 'list'; items: string[] };
  const runs: Run[] = [];
  let textBuf: string[] = [];
  const flushText = () => {
    const text = textBuf.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    textBuf = [];
    if (text) runs.push({ type: 'text', text });
  };
  for (const raw of stripMarkdown(bodyOrDesc).split('\n')) {
    const line = raw.trim();
    if (line.startsWith('- ')) {
      flushText();
      const item = line.slice(2).trim();
      const last = runs[runs.length - 1];
      if (last?.type === 'list') last.items.push(item);
      else runs.push({ type: 'list', items: [item] });
    } else {
      textBuf.push(line);
    }
  }
  flushText();

  if (runs.length === 0) return [{ id: generateSectionId('About', []), label: 'About', contentType: 'text', textContent: '' }];

  const sections: CustomSection[] = [];
  const first = runs[0];
  const about = push(sections, first.type === 'text'
    ? { label: 'About', contentType: 'text', textContent: first.text }
    : { label: 'About', contentType: 'list', listText: first.items.join('\n') });

  const subs: CustomSection[] = [];
  let textCount = 0;
  let listCount = 0;
  for (let i = 1; i < runs.length; i++) {
    const run = runs[i];
    if (run.type === 'text') {
      textCount++;
      push(subs, { label: textCount === 1 ? 'More' : `More ${textCount}`, contentType: 'text', textContent: run.text });
    } else {
      listCount++;
      push(subs, { label: listCount === 1 ? 'Highlights' : `Highlights ${listCount}`, contentType: 'list', listText: run.items.join('\n') });
    }
  }
  if (subs.length > 0) about.subSections = subs;
  return sections;
}

// A "title + description" card grid (the icon-card sections every
// Page-Content-Blocks-driven Student Activities page used) — becomes a
// simple two-column table, the closest existing content type to a
// label+description pair.
function cardsTable(cards: { title: string; desc: string }[]): string {
  return table(['Title', 'Description'], cards.map((c) => [c.title, c.desc]));
}
// A title-only card grid (no description) — becomes a checklist.
function cardsList(cards: { title: string }[]): string {
  return cards.map((c) => c.title).join('\n');
}

// ---------------------------------------------------------------------
// Campus facilities — plain "About" (+ optional Highlights) sections.
// ---------------------------------------------------------------------

const FACILITY_BODIES: Record<string, string> = {
  'smart-classrooms': `The classrooms are architecturally designed to create a comfortable, inspiring, and student-friendly learning environment. Spacious interiors, large windows, and scientifically planned ventilation ensure an abundance of natural light and fresh air throughout the day. This thoughtfully designed atmosphere promotes concentration, creativity, and overall well-being, providing students with the ideal setting to learn, collaborate, relax, and grow both academically and personally.

Each classroom is equipped with state-of-the-art technological facilities that support modern teaching methodologies. Advanced digital teaching aids, including LCD projectors, interactive presentation systems, video players, high-speed internet connectivity, and audio-visual equipment, enable teachers to deliver engaging and effective lessons. These smart classroom facilities make learning more interactive, helping students understand concepts through visual demonstrations, multimedia presentations, educational videos, and real-time digital resources.

The integration of technology into everyday classroom instruction allows teachers to adopt innovative and student-centered teaching practices. Lessons become more dynamic through presentations, animations, virtual demonstrations, and collaborative learning activities, encouraging active participation and critical thinking among students. With access to digital resources at the click of a button, teachers can seamlessly incorporate the latest educational content into their lessons, making learning more relevant and meaningful.

The classrooms are also designed to facilitate group discussions, project-based learning, seminars, and interactive sessions that nurture communication skills, teamwork, and problem-solving abilities. Comfortable seating arrangements and a well-organized layout ensure that every student enjoys an inclusive and distraction-free learning experience.

Our technologically advanced classrooms create an environment where teaching and learning go beyond traditional methods. By blending modern infrastructure with innovative educational practices, the institution ensures that students remain actively involved in the learning process. This not only enhances the pace and quality of education but also fosters curiosity, confidence, creativity, and a lifelong passion for learning, preparing students to meet the challenges of a rapidly evolving world.`,
  'state-of-the-art-labs': `#### State-of-the-art laboratories are the back bone of any Engineering college. Practical exposure brings real value to an engineering degree.

- Vishnu Women's University believes in imparting strong practical exposure to its students.
- Modern laboratories are an integral part of the various departments of the college.
- Each department maintains its specialized labs, equipped with modern equipment of industry standards.
- Vishnu Women's University keeps upgrading the facilities and equipment in the laboratories to the latest industry standards, from time to time.

#### Apart from regular experiments, all departments conduct additional experiments in all laboratories to train the students in the cutting edge technologies.

- Electronics Engineering (VLSI Design & Technology) Labs
- Electronics & Communication Engineering Labs
- Electrical & Electronics Engineering Labs
- Computer Science & Engineering Labs
- Information Technology Labs
- Artificial Intelligence Labs
- Civil Engineering Labs
- Mechanical Engineering Labs
- Basic Science Labs
- Master of Business Administration Labs`,
  'auditoriums': `Considering that a variety of events like cultural programmes, seminars, debates, plays and other programmes are conducted throughout the year, Vishnu Women's University houses an Indoor Auditorium, Open-air-Auditorium, Mini-Auditorium and numerous Seminar Halls which facilitate the students to carry on their activities smoothly and with ease. They attract students to flock together to share, discuss and explore knowledge in their areas of learning.

Smt. B. Seetha Indoor Auditorium is centrally air-conditioned with a fully sound proof setup and equipped with latest technology for all types of audio/video presentations.

In addition to the Indoor Auditorium, Vishnu Women's University has an Open-air-Auditorium and Mini-Auditorium, where a vast variety of student activities are regularly arranged.

Vishnu Women's University has well equipped air conditioned Seminar Halls which can accommodate 250 members each. They are centers for knowledge acquisition since right ambiance is created with a podium, a computer system with internet facility, an LCD projector and a sound system.`,
  'campus-book-stores': `The greatest essayist of England Francis Bacon believed that books are the best companions in a student's life and quoted aptly about the significance of books:

"Some books should be tasted, some devoured, but only a few should be chewed and digested thoroughly."

With all the right ambiance, the addition of a well-known book shop 'Higginbotham" creates even better environment for all the students here. The shop is situated very close to the temple complex and is accessible to students.`,
  'wifi-campus': `Vishnu Women's University is one of the few Universities, which can boast of its state-of-the-art computing resources and network across the campus. It has IT Infrastructure that can support 3000+ computer terminals, probably one of the largest wi-fi infrastructure. Following are a few highlighting features:

- Completely Wi-Fi Campus with 250+ access point, supported on the technology from RUCKUS
- 1500 Mbps of bandwidth for internet with dedicated leased line
- 1700 + workstations supported by Xeon based Rack Servers
- Powerful servers from Lenovo for 100% redundancy and efficient data management
- 20 Km fibre backbone for providing 10GB seamless connectivity
- ARUNA 8320G core switch to provide the needed scalability and traffic control
- SOPHOS High end firewall security featured network
- 24hrs Power Back Up -320 KVA of online uninterrupted power supply(UPS)
- 700+ CCTV cameras for 24 hours surveillance to ensure on campus safety and security
- High end Biometric systems for attendance`,
  'food-courts': `Eating a variety of healthy foods is the key to a well-balanced diet and good nutrition. It keeps our bodies working well and helps prevent diseases such as diabetes, cancer and cardiovascular disease. On the other hand, youth would like to have a variety of modern food items to satisfy their love for food.

Food Courts offer both modern and traditional food items in the campus. The huge campus has got Food Courts at seventeen different locations, occasionally alluring students and faculty for taste of food items. Thus, these places provide them an opportunity to eat out just to deviate from their monotonous routine. These food courts are open from 6.30a.m. to 8.30p.m. They are:

- Canoe & Cusine
- Brewista
- Tea leaf
- Central Square
- Bakers Treat
- Tasty Corner
- Nescafe Coffee Shops
- Fresh Choice Bakery at Lake View
- Lake View Court
- Jercy Juicy Shop and Fast Food Items
- Annapurna Fast Food Items
- Fresh Choice at Temple Square
- Snacks Corner
- Juice Shop and Fast Foods
- Annapurna Canteen
- Sita Mess
- Vishnu Canteen`,
  'fitness-centre': `"Physical fitness is not only one of the most important keys to a healthy body; it is the basis of dynamic and creative intellectual activity." These words were uttered by the former American President, John F. Kennedy.

A strong mind resides in a healthy body. This saying had never been more significant. The fast pace of modern lifestyle has led to an unimaginable amount of physical and psychological stress on human body and mind. Consequently, demand for trained fitness instructors has increased manifold. Vishnu Fitness Center with its sophisticated modern equipment improves the physical fitness for sound health.

Students often compete in Inter Collegiate, Inter University and State Level tournaments and win prizes and medals. Vishnu Fitness Center is a source of health generation and physical stamina. All types of sports and games have a place in this campus. Even, Yoga training is provided emphasizing physical and mental fitness of students.`,
  'staff-quarters': `Of three basic human needs, accommodation has got the highest priority in this modern world of high standards of living. Green Meadows is the creation of our beloved chairman with the very idea of providing own houses to the faculty. Green Meadows is a cluster of about hundred houses. With the beautiful scenery around and a pond in front of the Green Meadows add more beauty and pleasantness to all the inmates.

The Green Meadows has security personnel who patrol 24 hours. Water and current are supplied without creating any inconvenience. In every aspect Green Meadows is a modern abode with all the conveniences.`,
  'travel-desk': `A dedicated Travel Desk is now available on campus, conveniently located opposite Central Square and adjacent to the ICICI ATM. It offers a wide range of services including ticket bookings (bus, train, air), passport and visa assistance, holiday packages, hotel bookings, attestation services, and overseas education guidance.

The desk operates daily from 4:00 PM to 7:00 PM, and on Sundays from 11:00 AM to 7:00 PM. For assistance outside working hours, you can contact 9624 123 123 or email support@ushodayaholidays.in.

This facility is designed to simplify travel and documentation needs for students, faculty, and staff.`,
  'temples': `Worship is putting the spotlight on God. This whole idea is to engage our Vishnu Women's University students in an atmosphere and attitude of reverence and joy. Vishnu Women's University engage students from varied faith and religious traditions as well as students without religious affiliation. So, Vishnu Women's University holds a place for temple of gods in the campus. The temple is built on a high foundation covering an area of 25,000 square feet.`,
  'health-care': `Health Care Centre is available with all types of medical advice, clinical tests and inpatient facility with two beds. The centre is monitored by a resident general physician Dr. Varaprasad, a psychiatrist Dr. Ramakrishnam Raju and a gynaecologist Dr. Jayakumari visit the centre during their appointed hours. Students and Staff also have free access to dental hospital located in the campus to get their dental problems treated.`,
  'swimming-pool': `Whether you want to relax after a long day at studies are maintain a healthy life style, the newly opened swimming pool, next the sports complex is the ideal place for swimming enthusiasts. A world class pool with 80 feet length 40 feet width six lanes containing 4,05,000 liters of water provides excellent opportunities.

The latest technological features, round the clock water circulation and purification plants, life saving apparatus and pool side equipment is an superb facility that only Vishnu Women's University has. Individualized assistance in developing skills in all the four strokes by the coach is available. In addition the well equipped Eat Out provides the right ambiance for a pool side party.`,
  'campus-security': `It gives utmost importance to safety and security of students. A special wing is established for patrolling the campus in all aspects. Round the clock, security personnel are vigilant throughout the day. These security guards create peace of mind by providing safety to the inmate of the campus.`,
};

function seedFacility(slug: string): () => SeedResult {
  return () => ({ customSections: facilitySections(FACILITY_BODIES[slug]) });
}

// ---------------------------------------------------------------------
// Central Library — 5 tabs.
// ---------------------------------------------------------------------

function seedCentralLibrary(): SeedResult {
  const tabs: CustomTab[] = [];

  // About Library
  const about: CustomSection[] = [];
  push(about, {
    label: 'About',
    contentType: 'text',
    textContent: "The Library of Vishnu Women's University was built to keep up international standards. The air-conditioned library has three floors with an area of 1,083 Sq.m. and is well-protected with a security system. Specialised collections of books, journals, and non-book materials are available in Engineering & Technology, Basic Sciences, and Management Sciences.\n\nThe Library contributes to the fulfilment of the University's mission by selecting, acquiring, organising, maintaining, and making accessible a collection of printed and non-printed, primary and secondary materials that support the educational, research, and public service programmes of both students and faculty:",
  });
  push(about, {
    label: 'Responsibilities',
    contentType: 'list',
    listText: [
      'Responding to the varying needs of the academic community by involving the faculty, the students and the administration in the development and periodic assessment of the library services and resources.',
      'Providing library users with point-of-use instruction, personal assistance in conducting literature research and other reference services.',
      'Providing an environment conducive to the optimum use of library materials and an appropriate schedule of hours of service and professional assistance.',
      'Participating in overall computing resources plan and providing for full library utilization of automation technology, physical facilities and equipment adequate to process, catalogue and store the materials.',
      "Enhancing the library's resources and services through cooperative relationship with other libraries and agencies.",
    ].join('\n'),
  });
  push(about, {
    label: 'Library Timings',
    contentType: 'table',
    tableText: table(['Days', 'Hours'], [
      ['Monday – Saturday: Working Hours', '8:00 A.M. to 12:00 Midnight'],
      ['Monday – Saturday: Transactions', '8:00 A.M. to 6:00 P.M.'],
      ['Monday – Saturday: Digital Library', '8:00 A.M. to 12:00 Midnight'],
      ['Sunday & Other Holidays: Working Hours', '10:00 A.M. to 10:00 P.M.'],
    ]),
  });
  pushTab(tabs, 'About Library', about);

  // Library Resource List
  const resources: CustomSection[] = [];
  push(resources, {
    label: 'Library Resource List',
    contentType: 'text',
    textContent: 'Specialized collections are available in Engineering & Technology, Basic Sciences, and Management courses. The VWU Library comprises the following:',
    subSections: [
      { id: generateSectionId('Books', []), label: 'Books', contentType: 'table', tableText: table(['Item', 'Count'], [
        ['Total Number of Books', '59,751'],
        ['Total Number of Titles', '10,098'],
        ['Total Number of Journal Back Volumes', '5,200'],
      ]) },
      { id: generateSectionId('Periodicals', []), label: 'Periodicals', contentType: 'table', tableText: table(['Item', 'Count'], [
        ['Total Number of Periodicals', '157'],
        ['National', '157'],
      ]) },
      { id: generateSectionId('e-Journals', []), label: 'e-Journals', contentType: 'table', tableText: table(['Item', 'Count'], [
        ['Science Direct, N-LIST, DELNET', '6,656'],
      ]) },
      { id: generateSectionId('Media Resources', []), label: 'Media Resources', contentType: 'table', tableText: table(['Item', 'Count'], [
        ['Audio Cassettes', '250'],
        ['Compact Discs', '4,000'],
      ]) },
    ],
  });
  pushTab(tabs, 'Library Resource List', resources);

  // Digital Library
  const digital: CustomSection[] = [];
  push(digital, {
    label: 'Digital Library',
    contentType: 'links',
    linksText: [
      ['N-List', 'https://nlist.inflibnet.ac.in'],
      ['NDL — National Digital Library', 'https://ndl.iitkgp.ac.in'],
      ['NPTEL', 'http://10.0.0.16:8080/nptel'],
      ['DELNET', 'https://delnet.in/index.html'],
      ['Elsevier ScienceDirect', 'https://www.sciencedirect.com'],
      ["MGH Schaum's e-Books", 'http://mhebooklibrary.com'],
    ].map(([label, url]) => `${label} | ${url}`).join('\n'),
  });
  pushTab(tabs, 'Digital Library', digital);

  // e-Databases (5 sub-tabs -> pill-switcher subsections)
  const eBookSites: [string, string][] = [
    ['UMDL Text e-books and e-texts', 'http://www.hti.umich.edu/cgi/t/text/text-idx'], ['Yudu', 'http://free.yudu.com/'],
    ['Meta Text', 'http://metatext.com/'], ['CampusBooks', 'http://www.campusbooks.com/'],
    ['University of Pennsylvania e-books', 'http://digital.library.upenn.edu/books'], ['University of Virginia e-book library', 'http://etext.lib.virginia.edu/ebooks/ebooklist.html'],
    ['Library of Free e-books', 'http://www.web-books.com/cool/ebooks/Library.htm'], ['NAP Open book', 'http://www.nap.edu/index.html'],
    ['Open e-book Forum', 'http://198.88.160.15/'], ['e-text Archives', 'http://www.etext.org/index.shtml'],
    ['Virtualbooks', 'http://www.virtual-ebooks.com/'], ['Internet Public Library', 'http://www.ipl.org/div/books'],
    ['Project Gutenberg', 'http://www.gutenberg.org/'], ['Direct TextBook', 'http://www.directtextbook.com/'],
    ['FCL e-bboks', 'http://polpac.farmlib.org/polaris/'], ['Net library', 'http://www.netlibrary.net/'],
    ['Free ebooks', 'http://www.free-ebooks.net/'], ['AmericanMemory', 'http://memory.loc.gov/'],
    ['e-books and Bytes', 'http://www.ebooksnbytes.com/ebooks.html'], ['Online Text Collection', 'http://www.ipl.org/reading/books/'],
    ['e-Books on South Asia', 'http://www.columbia.edu/cu/lweb/indiv/southasia/cuvl/ebooks.html'], ['E-Books of University of Adelaide Library', 'http://etext.library.adelaide.edu.au/aut/bacon_francis.html'],
    ['Freetech Books', 'http://www.freetechbooks.com/'], ['e-books', 'http://e-books.org/'],
    ['NSDL', 'http://nsdl.org/'], ['e-bookpalace', 'http://www.ebookpalace.com/'],
    ['Google Books', 'http://books.google.co.in/books'], ['Memo Ware', 'http://www.memoware.com/'],
    ['Many Books', 'http://manybooks.net/'], ['World Lecture Hall', 'http://freevideolectures.com/blog/2011/11/free-course-material-any-subject/'],
    ['Books on Smart Phone', 'http://www.booksinmyphone.com/'], ['Electronic Library of Mathematics', 'http://www.emis.de/journals/short_index.html'],
    ['Planet Books', 'http://www.planetbook.com/'], ['Book Finder', 'http://www.bookfinder.com/'],
    ['Turnit', 'http://www.turnit.com/'], ['130+ NPTEL(IIT) Courses with Video Lectures', 'http://freevideolectures.com/blog/2010/11/130-nptel-iit-online-courses/'],
  ];
  const openAccessJournalSites: [string, string][] = [
    ['MHE Book Library', 'https://mhebooklibrary.com/'], ['Lebanese American University', 'http://www.lau.edu.lb/libraries/free-journals-list.php'],
    ['Intute', 'http://www.intute.ac.uk/sciences/ejournallist.html'], ['Bentham Open', 'http://www.bentham.org/open/a-z.htm'],
    ['Hindawi', 'http://www.hindawi.com/journals/titles.html'], ['Open J-Gate', 'http://crl.du.ac.in/oa/OpenJ-Gate.com.htm'],
    ['ICRISAT e-Library', 'http://www.elibrary.icrisat.org/fulltext/openaccess.html'], ['Royal Society Publishing', 'http://royalsocietypublishing.org/journals'],
    ['The Electronic Library of Mathematics', 'http://www.emis.ams.org/journals/'], ['Free Medical Journals', 'http://www.freemedicaljournals.com/'],
    ['Engineering Library — University of Cincinnati', 'http://www.libraries.uc.edu/libraries/engr/selfhelp/alphlist.html'], ['PubMed Central', 'http://www.pubmedcentral.nih.gov/fprender.fcgi?cmd=full_view'],
    ['Indian Academy of Sciences (IAS)', 'http://www.ias.ac.in/'], ['UNR Knowledge Center', 'http://www.knowledgecenter.unr.edu/ejournals/free.aspx'],
    ['Directory of Open Access Journals (DOAJ)', 'http://www.doaj.org/'], ['HighWire — Institute of Physics (IOP)', 'http://highwire.stanford.edu/'],
  ];
  const videoOnDemandSites: [string, string][] = [
    ['YouTube EDU', 'http://youtube.com/edu'], ['IIT/IISc', 'http://youtube.com/nptelhrd'], ['MIT', 'http://youtube.com/mit'],
    ['Stanford', 'http://youtube.com/stanforduniversity'], ['UC Berkeley', 'http://youtube.com/ucberkeley'], ['UCLA', 'http://youtube.com/ucla'],
    ['Yale', 'http://youtube.com/yalecourses'], ['Digital Library of India', 'http://www.new.dli.ernet.in/'],
  ];
  const electronicReferenceCategories: { title: string; items: [string, string][] }[] = [
    { title: 'Associations', items: [
      ['ASM International Foundation', 'http://library.dce.edu/main.htm?Section=ASMFoundation&NavMenuID=498'],
      ['Webpages for Scholarly Societies', 'http://www.lib.uwaterloo.ca/society/webpages.html'],
      ['Gateway to Associations Online', 'http://www.asaenet.org/find/'], ['Idealist', 'http://www.idealist.org/'],
      ['World Directory of Think Tanks', 'http://www.nira.go.jp/ice/'], ['Associations on the Net', 'http://www.ipl.org/div/aon/'],
      ['International Organization and NGO Web Sites', 'http://www.uia.org/website.htm'],
      ['Meta-Index for Nonprofit Organizations', 'http://www.strano.net/network/internet/linkpage/links/metaindx.htm'],
      ['European Mathematical Society', 'http://www.emis.de/'],
    ] },
    { title: 'Atlases', items: [
      ['Rare Maps', 'http://www.raremaps.com/'], ['Maps and Atlases', 'http://memory.loc.gov/ammem/gmdhtml/gnrlhome.html'],
      ['MAPS', 'http://www.mapquest.com/'], ['Freeality Online Atlases, Maps, and Travel Directions', 'http://www.freeality.com/maps.htm'],
      ['Atlas', 'http://go.hrw.com/atlas/norm_htm/world.htm'], ['Geography : Atlases', 'http://www.library.adelaide.edu.au/gen/Atlases.html'],
      ['Health Atlases', 'http://dir.yahoo.com/Science/Geography/Human_Geography/Medical_Geography/Health_Atlases/'], ['Maps.com', 'http://www.maps.com/'],
    ] },
    { title: 'Citation Guides', items: [
      ['Harvard Referencing', 'http://lisweb.curtin.edu.au/referencing/harvard.html'], ["Karla's Guide to Citation Style Guides", 'http://bailiwick.lib.uiowa.edu/journalism/cite.html'],
      ['Style Sheet for Citing Internet Sources', 'http://www.lib.berkeley.edu/TeachingLib/Guides/Internet/Style.html'],
      ['Journals Abbreviation Resources', 'http://www.public.iastate.edu/~CYBERSTACKS/JAS.htm'], ['MLA Style', 'http://www.mla.org/'],
      ['CBE Documentation', 'http://library.austincc.edu/help/cbe/cbe-cs.htm'], ['Citation Formats for Natural Scientists', 'http://www.dartmouth.edu/~sources/how/formats.html'],
      ['Electronic References & Scholarly Citations of Internet Sources', 'http://www.spaceless.com/WWWVL/'],
      ['Citation Styles Handbook', 'http://www.english.uiuc.edu/cws/wworkshop/writer_resources/citation_styles/apa/apa.htm'],
    ] },
    { title: 'Dictionaries', items: [
      ['Dictionary of Difficult Words', 'http://www.tiscali.co.uk/reference/dictionaries/difficultwords/'], ["Roget's Internet Thesaurus", 'http://www.thesaurus.com/'],
      ['Cambridge Dictionaries Online', 'http://dictionary.cambridge.org/'], ['WWWebster Dictionary', 'http://www.m-w.com/netdict.htm'],
      ['WordNet', 'http://www.cogsci.princeton.edu/~wn/main/'], ['Acronym Finder', 'http://www.acronymfinder.com/'],
      ['One look Dictionary', 'http://www.onelook.com/'], ['Rogets Thesaurus', 'http://asadz.com/thesaurus/'],
      ['NASA Thesaurus', 'http://www.sti.nasa.gov/thesfrm1.htm'], ['Russian', 'http://www.freedict.com/onldict/rus.html'],
      ['Familiar Quotations', 'http://www.bartleby.com/99/'],
    ] },
    { title: 'Encyclopedias', items: [
      ['Encyclopedia Mythica', 'http://www.pantheon.org/'], ['Encyclopedia of the Orient', 'http://i-cias.com/e.o/index.htm'],
      ['Internet Encyclopedia of Philosophy', 'http://www.utm.edu/research/iep/'], ['Stanford Encyclopedia of Philosophy', 'http://plato.stanford.edu/contents.html'],
      ['PC Webopaedia', 'http://www.pcwebopaedia.com/'], ['Merriam-Webster', 'http://www.m-w.com/'],
      ['World Fact Book', 'http://www.odci.gov/cia/publications/factbook'], ['Medline Plus Medical Encyclopedia', 'http://medlineplus.adam.com/'],
      ['Artcyclopedia', 'http://www.artcyclopedia.com/'], ['Encarta Encyclopedia', 'http://encarta.msn.com/'],
      ['Encyclopedia Britannica', 'http://www.britannica.com/'], ['Encyclopedia', 'http://www.encyclopedia.com/'],
      ['Discovery online', 'http://www.discovery.com/'], ['Tech Encyclopedia', 'http://www.techweb.com/encyclopedia'],
      ['World of Mathematics', 'http://mathworld.wolfram.com/'], ['Instrument Encyclopedia', 'http://www.si.umich.edu/chico/instrument/'],
      ['Fossil Encyclopedia', 'http://www.britannica.com/ebi/article?tocId=9274394'],
    ] },
    { title: 'Grants', items: [
      ['EPA Grants Writing Tutorial', 'http://www.epa.gov/grtlakes/seahome/grants.html'], ['NSF Grants', 'http://www.nsf.gov/funding/'],
      ['NIST Grants', 'http://www.nist.gov/public_affairs/grants.htm'], ['COS Funding Opportunities', 'http://fundingopps.cos.com/'],
      ['Grantsnet', 'http://www.grantsnet.org/'], ['Grants$eeker', 'http://www.regis.edu/grants'],
    ] },
    { title: 'News Papers', items: [
      ['Chicago Tribune', 'http://www.chicago.tribune.com/'], ['The Washington Times', 'http://www.washtimes.com/'],
      ['Science Tech. DailyReview', 'http://scitechdaily.com/'], ['The New York Times', 'http://nytimes.com/'],
      ['USA Today', 'http://usatoday.com/'], ['Sydney Morning Herald', 'http://www.smh.com.au/'],
      ['Business Standard', 'http://www.business-standard.com/'], ['Times of India', 'http://www.timesofindia.com/'],
      ['Businessline', 'http://www.hindubusinessline.com/'], ['Deutsche Welle', 'http://www.dw-world.de/'],
      ['Telegraph', 'http://www.telegraph.co.uk/'], ['India-Today', 'http://www.india-today.com/'],
      ['Express Business', 'http://www.expressindia.com/ie/daily/20000907/business.htm'], ['Financial Times', 'http://www.ft.com/'],
      ['Indian Express', 'http://www.expressindia.com/'], ['The Detroit News', 'http://detnews.com/'],
      ['The Hindu', 'http://www.hinduonline.com/'], ['Die Welt', 'http://www.welt.de/'],
    ] },
    { title: 'Translation', items: [
      ['English German', 'http://www.dict.cc/'], ['French English', 'http://humanities.uchicago.edu/forms_unrest/FR-ENG.html'],
      ['Free Translation', 'http://www.freetranslation.com/'], ['English Spanish', 'http://www.freedict.com/onldict/spa.html'],
    ] },
  ];

  const linksFrom = (pairs: [string, string][]) => pairs.map(([label, url]) => `${label} | ${url}`).join('\n');
  const databases: CustomSection[] = [];
  const eDatabasesParent = push(databases, { label: 'e-Databases', contentType: 'text', textContent: '' });
  eDatabasesParent.subSectionsDisplay = 'pills';
  eDatabasesParent.subSections = [
    { id: generateSectionId('E-Books', []), label: 'E-Books', contentType: 'links', linksText: linksFrom(eBookSites) },
    { id: generateSectionId('Open Access Online Journals/Magazines', []), label: 'Open Access Online Journals/Magazines', contentType: 'links', linksText: linksFrom(openAccessJournalSites) },
    {
      id: generateSectionId('Electronic References', []), label: 'Electronic References', contentType: 'links',
      linksText: electronicReferenceCategories.map((cat) => `## ${cat.title}\n${linksFrom(cat.items)}`).join('\n\n'),
    },
    { id: generateSectionId('Video On Demand', []), label: 'Video On Demand', contentType: 'links', linksText: linksFrom(videoOnDemandSites) },
    {
      id: generateSectionId('Open Courseware', []), label: 'Open Courseware', contentType: 'text',
      textContent: "In the Open Courseware, course materials created by universities are shared freely with the world via internet. According to the website of the OCW Consortium, an OCW project\n\n- Is a free and open digital publication of high quality educational materials courses.\n- Is available for use and adaptation under an open license",
      subSections: [{ id: generateSectionId('Link', []), label: 'Link', contentType: 'links', linksText: 'OCW Consortium Course Search | http://www.ocwconsortium.org/en/courses/search' }],
    },
  ];
  pushTab(tabs, 'e-Databases', databases);

  // Journals (2 big tables)
  const journalsList: [number, string, string, string][] = [
    [1, 'Bi-annual', 'AI&DS, AIML', 'Journal of Advanced Research in Artificial Intelligence and Neural Network'],
    [2, 'Bi-annual', 'AI&DS, AIML', 'Journal of Advanced Research in Cloud computing, virtualization and web applications'],
    [3, 'Bi-annual', 'AI&DS, AIML', 'Journal of Advanced Research in Information technology and systems management'],
    [4, 'Tri-annual', 'AI&DS, AIML', 'Research & Review: Machine Learning and Cloud Computing'],
    [5, 'Tri-annual', 'AI&DS, AIML', "Recent Trends in Artificial Intelligence & it's applications"],
    [6, 'Tri-annual', 'AI&DS, AIML', 'Journal of Cyber Security, Privacy Issues and Challenges'],
    [7, 'Tri-annual', 'AI&DS, AIML', 'Journal of Innovations in Data Science and Big Data Management'],
    [8, 'Tri-annual', 'AI&DS, AIML', 'Journal of IoT Security and Smart technologies'],
    [9, 'Tri-annual', 'AI&DS, AIML', 'Journal of Artificial Neural networks and Learning system'],
    [10, 'Tri-annual', 'AI&DS, AIML', 'Journal of Fuzzy sets and Fuzzy Logic Design'],
    [11, 'Tri-annual', 'AI&DS, AIML', 'Journal of Big Data Technology and Business Analytics'],
    [12, 'Tri-annual', 'AI&DS, AIML', 'Journal of IoT – based Distributed sensor networks'],
    [13, 'Tri-annual', 'AI&DS, AIML', 'Journal of Cryptography and Network security, design and codes'],
    [14, 'Quarterly', 'Civil', 'IRC Periodicals'],
    [15, 'Tri-annual', 'Civil', 'Journal of Construction and Building Materials Engineering'],
    [16, 'Tri-annual', 'Civil', 'Journal of Environmental Engineering and Studies'],
    [17, 'Bi-annual', 'Civil', 'Journal of Advanced Research in Civil and Environmental Engineering'],
    [18, 'Bi-annual', 'Civil', 'Journal of Advanced Research in Water Resources and Hydraulic Engineering'],
    [19, 'Bi-annual', 'Civil', 'Journal of Advanced Research in Civil and structural engineering'],
    [20, 'Quarterly', 'Civil', 'Water resources and irrigation'],
    [21, 'Tri-annual', 'Civil', 'Journal of Advanced Cement and Concrete Technology'],
    [22, 'Tri-annual', 'Civil', 'Journal of Sustainable Construction Engineering and Project Management'],
    [23, 'Tri-annual', 'Civil', 'Journal of Earthquake Science and Soil Dynamic Engineering'],
    [24, 'Bi-annual', 'Civil', 'Journal of Advanced Research in Geo Sciences and Remote Sensing'],
    [25, 'Monthly', 'Civil', 'GIS India'],
    [26, 'Quarterly', 'CSE', 'Artificial Intelligence'],
    [27, 'Quarterly', 'CSE', 'Computer Networks and Communications'],
    [28, 'Quarterly', 'CSE', 'Information Security'],
    [29, 'Quarterly', 'CSE', 'Multimedia'],
    [30, 'Quarterly', 'CSE', 'Software Engineering'],
    [31, 'Quarterly', 'CSE', 'Distributed computing'],
    [32, 'Quarterly', 'CSE', 'Information Technology'],
    [33, 'Bi-annual', 'CSE', 'Indian Journal of software and information engineering'],
    [34, 'Bi-annual', 'CSE', 'International Journal of Computer applications in Technology'],
    [35, 'Bi-annual', 'CSE', 'International Journal of Computing'],
    [36, 'Bi-annual', 'CSE', 'International Journal of Information technology and Decision Making'],
    [37, 'Tri-annual', 'Cyber Security', 'Research and Applications of Web Development and Design'],
    [38, 'Tri-annual', 'Cyber Security', 'Recent Innovations in Wireless Network Security'],
    [39, 'Tri-annual', 'Cyber Security', 'Journal of Advances in Computational Intelligence Theory'],
    [40, 'Tri-annual', 'Cyber Security', 'Recent Trends in Androids and IOS Applications'],
    [41, 'Tri-annual', 'Cyber Security', 'Recent Trends in Cloud Computing and Web Engineering'],
    [42, 'Tri-annual', 'Cyber Security', 'Advancement of Computer Technology and its Applications'],
    [43, 'Tri-annual', 'Cyber Security', 'Advancement in Image Processing and Pattern Recognition'],
    [44, 'Tri-annual', 'Cyber Security', 'Recent Trends in Information Technology and its Application'],
    [45, 'Tri-annual', 'Cyber Security', 'Journal of Advancement in Parallel Computing'],
    [46, 'Tri-annual', 'Cyber Security', 'Research and Reviews: Advancement in Robotics'],
    [47, 'Tri-annual', 'Cyber Security', 'Recent Trends in Computer Graphics and Multimedia Technology'],
    [48, 'Tri-annual', 'Cyber Security', 'Journal of Network Security and Data Mining'],
    [49, 'Quarterly', 'ECE', 'Advance Research in Power Electronics and Devices'],
    [50, 'Quarterly', 'ECE', 'Research&Review:Electronics and Communication Engineering'],
    [51, 'Quarterly', 'ECE', 'Journal of Advancement in Electronics Signal Processing'],
    [52, 'Quarterly', 'ECE', 'Journal of Microprocessor and Microcontroller Research'],
    [53, 'Quarterly', 'ECE', 'Advance Research in Analog and Digital Communications'],
    [54, 'Biannual', 'ECE', 'Journal of Advanced Research in Embedded systems'],
    [55, 'Biannual', 'ECE', 'Journal of Advanced Research in Power Electronics and Power systems'],
    [56, 'Biannual', 'ECE', 'Journal of Advanced Research in Micro Electronics and VLSI'],
    [57, 'Biannual', 'ECE', 'Journal of Advanced Research in Networking and communication engineering'],
    [58, 'Biannual', 'ECE', 'Journal of Advanced Research in Wireless, Mobile and Telecommunication'],
    [59, 'Tri-annual', 'ECE', 'Advance Research in Communication Engineering and its Innovations'],
    [60, 'Tri-annual', 'ECE', 'Journal of Electronics and Telecommunication system Engineering'],
    [61, 'Bi-annual', 'ECE', 'Journal of Advanced Research in Signal Processing and Applications'],
    [62, 'Bi-annual', 'ECE', 'Journal of Advanced Research in Image Processing and applications'],
    [63, 'Tri-annual', 'EEE', 'Journal of Electrical and Power System Engineering'],
    [64, 'Tri-annual', 'EEE', 'Journal of Digital Integrated Circuits in Electrical Devices'],
    [65, 'Biannual', 'EEE', 'Journal of Advanced Research in Electronics engineering and technology'],
    [66, 'Biannual', 'EEE', 'Journal of Advanced Research in Electrical Engineering and Technology'],
    [67, 'Quarterly', 'EEE', 'Electrical Engineering'],
    [68, 'Quarterly', 'EEE', 'Energy and Power'],
    [69, 'Quarterly', 'EEE', 'Power Electronics'],
    [70, 'Quarterly', 'EEE', 'Electrical Machines'],
    [71, 'Quarterly', 'EEE', 'High Voltage Engineering'],
    [72, 'Tri-annual', 'EEE', 'Journal of Control System and its Recent Developments'],
    [73, 'Tri-annual', 'EEE', 'Journal of Research and Advancement in Electrical Engineering'],
    [74, 'Tri-annual', 'EEE', 'Journal of Emerging Trends in Electrical Engineering'],
    [75, 'Biannual', 'HBS', 'Journal of Advanced research in applied Physis & applications'],
    [76, 'Biannual', 'HBS', 'Journal of Advanced research in applied chemistry and chemical engineering'],
    [77, 'Biannual', 'HBS', 'Journal of Advanced research in Applied mathematics and statistics'],
    [78, 'Monthly', 'HBS', 'Resonance'],
    [79, 'Bimonthly', 'HBS', 'International Journal of Statistics and Applied Mathematics'],
    [80, 'Tri-annual', 'HBS', 'Journal of Applied Mathematics and Statistical Analysis'],
    [81, 'Tri-annual', 'HBS', 'Research and Reviews: Journal of Environmental Sciences'],
    [82, 'Tri-annual', 'HBS', 'Journal of Statistics and Mathematical Engineering'],
    [83, 'Tri-annual', 'IT', 'Journal of Network Security Computer Networks'],
    [84, 'Tri-annual', 'IT', 'Journal of Image Processing and Artificial Intelligence'],
    [85, 'Tri-annual', 'IT', 'Journal of Web Development and Web Designing'],
    [86, 'Tri-annual', 'IT', 'Journal of Android and IOS Applications and Testing'],
    [87, 'Half yearly', 'IT', 'International Journal of Communication and Information Technology'],
    [88, 'Half yearly', 'IT', 'International Journal of Cloud Computing and Database Management'],
    [89, 'Half yearly', 'IT', 'International Journal of Engineering in Computer Science'],
    [90, 'Half yearly', 'IT', 'International Journal of Circuit, Computing and Networking'],
    [91, 'Biannual', 'MBA', 'Journal of Advanced research in Operational and Marketing Management'],
    [92, 'Biannual', 'MBA', 'Journal of Advanced research in Quality control and Management'],
    [93, 'Monthly', 'MBA', 'Indian Journal of Marketing'],
    [94, 'Tri-annual', 'MBA', 'Journal of Advanced research in Accounting and Finance Management'],
    [95, 'Quarterly', 'MBA', 'Journal of Advanced research in Enterpreneurship, Innovation & SMES Management'],
    [96, 'Bi-annual', 'MBA', 'Journal of Advanced Research in HR and Organizational Management'],
    [97, 'Bi-annual', 'MBA', 'Journal of Advanced Research in Economics and Business Management'],
    [98, 'Half yearly', 'ME', 'International Journal of materials sciences'],
    [99, 'Half yearly', 'ME', 'International Journal of Mechanics and Solids'],
    [100, 'Half yearly', 'ME', 'International Journal of Theoretical and applied Mechanics'],
    [101, 'Half yearly', 'ME', 'International Journal of Mechanics and Thermodynamics'],
    [102, 'Half yearly', 'ME', 'International Journal of Mechanical Engineering and Research'],
    [103, 'Tri-annual', 'ME', 'Journal of Advancements in Material Engineering'],
    [104, 'Tri-annual', 'ME', 'Journal of Recent Activities in Production'],
    [105, 'Tri-annual', 'ME', 'Journal of Advancement in Machines'],
    [106, 'Tri-annual', 'ME', 'Journal of Recent Trends in Mechanics'],
    [107, 'Tri-annual', 'ME', 'Journal of Automation and Automobile Engineering'],
    [108, 'Tri-annual', 'ME', 'Journal of Thermal Energy Systems'],
    [109, 'Biannual', 'ME', 'Journal of Advanced Research in Applied Mechanics & Computational Fluid Dynamics'],
    [110, 'Biannual', 'ME', 'Journal of Advanced Research in Manufacturing, Material Science and Mutallurgical engineering'],
    [111, 'Biannual', 'ME', 'Journal of Advanced Research in Mechanical Engineering and Technology'],
    [112, 'Biannual', 'ME', 'Journal of Advanced Research in Intelligence systems and robotics'],
    [113, 'Bi-annual', 'ME', 'Journal of Advanced Research in Automotive Technology and Transportation System'],
  ];
  const magazinesList: [number, string, string, string][] = [
    [1, 'Bi-Monthly', 'Civil', 'Geospatial World'], [2, 'Monthly', 'CSE', 'Opensource for you'],
    [3, 'Monthly', 'ECE', 'Electronics for You'], [4, 'Monthly', 'ECE', 'Digit'],
    [5, 'Monthly', 'ECE', 'Voice and Data'], [6, 'Bi-Monthly', 'ECE', 'Embedded for You'],
    [7, 'Monthly', 'EEE', 'Electrical India'], [8, 'Quarterly', 'EEE', 'Industrial Safety Chronicle'],
    [9, 'Monthly', 'EEE', 'Power Line'], [10, 'Monthly', 'EEE', 'Renewable Watch'],
    [11, 'Weekly', 'HBS', 'The Week'], [12, 'Monthly', 'HBS', 'Careers 360'],
    [13, 'Monthly', 'HBS', 'Down To Earth'], [14, 'Monthly', 'HBS', 'Pratiyogita Darpan'],
    [15, 'Weekly', 'HBS', 'Time'], [16, 'Tri-Monthly', 'HBS', 'Outlook'],
    [17, 'Fortnightly', 'HBS', 'CSR (English)'], [18, 'Weekly', 'HBS', 'India Today (Eng.)'],
    [19, 'Monthly', 'HBS', 'Reader Digest'], [20, 'Monthly', 'HBS', 'Mathematics today'],
    [21, 'Fortnightly', 'HBS', 'Champak'], [22, 'Monthly', 'HBS', 'Physics for You'],
    [23, 'Monthly', 'HBS', "Woman's Era"], [24, 'Monthly', 'HBS', 'Kurukshetra'],
    [25, 'Monthly', 'HBS', 'Yojana'], [26, 'Weekly', 'HBS', 'University News'],
    [27, 'Monthly', 'HBS', 'Current Affairs Today'], [28, 'Monthly', 'HBS', 'Civil Services Times'],
    [29, 'Monthly', 'HBS', 'Civil Services Chronicle'], [30, 'Monthly', 'IT', 'PC Quest'],
    [31, 'Monthly', 'IT', 'Dataquest'], [32, 'Monthly', 'LIBRARY', 'Granthalaya Sarsvam'],
    [33, 'Fortnightly', 'MBA', 'Business today'], [34, 'Weekly', 'MBA', 'The Economist'],
    [35, 'Bi-Monthly', 'MBA', 'Harvard Business Review'], [36, 'Fortnightly', 'MBA', 'Forbes India'],
    [37, 'Monthly', 'MBA', 'Coordinates'], [38, 'Monthly', 'ME', 'Overdrive'],
    [39, 'Monthly', 'ME', 'Car India'], [40, 'Monthly', 'ME', 'Motoring World'],
    [41, 'Monthly', 'ME', 'Autocar India'], [42, 'Fortnightly', 'ME', 'Autocar Professional'],
    [43, 'Monthly', 'ME', 'Stuff India'], [44, 'Fortnightly', 'PEd', 'Sport Star'],
  ];
  const journals: CustomSection[] = [];
  push(journals, {
    label: 'Journals',
    contentType: 'text',
    textContent: 'Print and electronic journal and magazine subscriptions held by the Central Library, listed by department.',
    subSections: [
      { id: generateSectionId('List of Journals', []), label: 'List of Journals', contentType: 'table', tableText: table(['S.No.', 'Periodicity', 'Branch', 'Title'], journalsList.map((r) => r.map(String))) },
      { id: generateSectionId('List of Magazines', []), label: 'List of Magazines', contentType: 'table', tableText: table(['S.No.', 'Periodicity', 'Branch', 'Title'], magazinesList.map((r) => r.map(String))) },
    ],
  });
  pushTab(tabs, 'Journals', journals);

  return { tabs };
}

// ---------------------------------------------------------------------
// Campus Hostels — 5 tabs.
// ---------------------------------------------------------------------

function seedCampusHostels(): SeedResult {
  const tabs: CustomTab[] = [];

  const about: CustomSection[] = [];
  push(about, {
    label: 'About Hostel',
    contentType: 'text',
    textContent: [
      'The objective of the Hostel is to provide suitable and comfortable accommodation for deserving students from Andhra Pradesh and outside the State. The Hostel has a number of blocks to accommodate exclusively for girl students.',
      'Ideal hostel facility with a homely atmosphere is provided within the campus. Mess with a modern kitchen and spacious air-conditioned dining halls are attached to the hostel. Many recreation facilities are also provided.',
      'To improve their general knowledge, newspapers and educative periodicals are provided in the reading room. The selection of newspapers and periodicals is done by the Boarders but approved by the Warden.',
      'A reading room / T.V. room is provided separately in each block, operated during stipulated hours. Indoor / outdoor games are provided in the hostel, and pictures are screened regularly in the auditorium.',
    ].join('\n\n'),
  });
  pushTab(tabs, 'About Hostel', about);

  const admission: CustomSection[] = [];
  push(admission, {
    label: 'Admission Procedure',
    contentType: 'text',
    textContent: 'Application for admission to the Hostel shall be made in the prescribed form, which can be had from the SVES Hostel Office, along with prospectus.',
    subSections: [{
      id: generateSectionId('Rules', []), label: 'Rules', contentType: 'list', listText: [
        'The Hostel is under the Management of the Chairman, Sri Vishnu Educational Society, Bhimavaram. He nominates the Hostel Committee and the Warden functions as per the directions of the Chairman of the Committee.',
        'The Warden reserves the right to effect any changes that may be felt necessary in routine matters of the Hostel.',
        'Admission is open to the students studying in the colleges located in Vishnupur, Bhimavaram run by Sri Vishnu Educational Society and Padmabushan Dr. B.V.Raju Foundation.',
        'The students should acquaint themselves thoroughly with the Rules and Regulations of the Hostel before seeking admission.',
        'The Hostel Committee reserves the right to admit or reject a candidate without assigning any reasons and to expect any student, if found not amenable to discipline.',
        'The Parents or guardians of the selected students must be present with them at the time of admission.',
        'Rooms are allotted to the students by the warden following specific guidelines framed by the committee.',
        'Students, selected for admission, shall join the Hostel on or before the due date, after paying the prescribed fees, failing which their seats shall be forfeited.',
        'Once a student pays the prescribed fee to the Bank, she is deemed to have been admitted to the Hostel. I.D. Cards are issued to the hostel students. She is eligible for refund of caution deposit and mess advance, if any, when she leaves the Hostel after admission or on transfer etc.',
        'Students who have not secured eligibility to go to the next higher semester / class shall leave the Hostel immediately. The amount paid at the time of admission shall not be refunded except the amount paid against the Mess Advance and Caution Deposit.',
        'Admissions are made afresh to the hostel every year. Students who apply for readmission in the Hostel should attach marks cards of previous year / semesters (odd or even) along with the application form. They, however, need not pay the admission fee. They are admitted only after clearing the dues/ arrears, if any.',
        'Four stamp size recent color photographs should be submitted along with the application form. Any student, who vacates the hostel in the middle of the year on any personal ground, will not be readmitted during the rest of the course, unless approved by the committee.',
        'Students suffering from contagious diseases / drug addicts are not eligible for admission. If after admission students, found to be having contagious diseases and drug addicts, shall be sent out of the Hostel immediately. She is eligible for refund of money as per Rule No.9 of Admission.',
        'Before actual admission, every student shall give a written undertaking that she will abide by the Rules and Regulations of the Hostel.',
      ].join('\n'),
    }],
  });
  pushTab(tabs, 'Admission Procedure', admission);

  const accommodation: CustomSection[] = [];
  push(accommodation, {
    label: 'Accommodation', contentType: 'list', listText: [
      'Three students are normally accommodated in each room. Each room is provided with necessary beds, tables, chairs, racks, a ceiling fans and lights etc.',
      'The allotment of room shall be done by the warden in consultation with the Hostel Committee.',
      'If any room is left vacant after the admissions are over, such room shall be allotted to the Boarders who desire to have a single room on an additional payment.',
      'After allotment of the rooms, if any Boarder changes the room without the written orders of the warden, she shall be liable for dismissal from the Hostel or a fine of Rs.1000 or both.',
      'Hostel furniture shall not be shifted from one room to another room under any circumstances. Boarders are responsible for the care of the furniture and fittings provided in their rooms.',
      'Boarders leaving the hostel shall handover the articles, given to them at the time of admission, to the warden or her authorized person and obtain a certificate to that effect. Any boarder who fails to do so, shall not only pay for any damages or losses but also be liable to a fine of not less than Rs.800 at the discretion of the warden.',
      'No boarder shall be allowed to stay outside the hostel. They shall obtain written permission from the warden before they leave the Hostel.',
      'Every boarder shall equip herself with bedding, mosquito net or curtain, a table cloth, a mug, bucket etc. Boarders shall not use their own utensils like drinking water glasses or tumblers, coffee glass/ cups, spoons, plates etc., in the dining hall. These shall be supplied by the Management.',
      'Boarders are not permitted to use any electrical appliance like electric iron, water heater, and stove. They are not allowed to make private arrangements for any special comfort. If such things are observed, they are liable for dismissal from the hostel along with a fine of Rs.1500/-.',
      'Each room is provided with switches, tube light, ceiling fan with regulator etc. Any replacement due to breakages etc., shall be made good by the Management at the cost of the boarders.',
      'Each room is provided with a door along with shutters, shelves / racks and suitable glass panes to the windows and ventilator shutters along with fixture and fittings. They shall be maintained safely by the boarders of the respective rooms failing which they shall be charged with the cost of materials, fixtures, labor charges etc., and the same shall be deducted from the caution deposit/mess advance.',
      'The security person/staff authorized by the warden have every right to check the belongings of the boarders at the time of vacating the hostel for short and long term vacations / dismissal from the hostel in order to safe guard the property of the management.',
      'In case of doubt or suspicion, the security persons/ staff authorized by the warden shall have the powers to check the belongings of the boarders at any time and also while going out of the hostel on ordinary days.',
      'If any complaints are received by the warden regarding the violation of the above rules, disciplinary action will be initiated against such boarders and they shall be made responsible for the loss / theft of articles belonging to the managements along with a minimum fine of Rs.1500.',
    ].join('\n'),
  });
  pushTab(tabs, 'Accommodation', accommodation);

  const amenities: CustomSection[] = [];
  push(amenities, {
    label: 'Amenities', contentType: 'list', listText: [
      'To improve their General Knowledge, Newspapers and Educative Periodicals are provided in the reading room. The selection of Newspaper and Periodicals shall be done by the boarders but approved by the Warden and their cost shall be charged to all Boarders on dividing system. They may read only at this reading room, but shall not carry the same to their rooms.',
      'Free internet connectivity through Wi-Fi system for academic purposes only and subject to conditions.',
      'Arrangement for 24 hours power supply.',
      'A reading room / T.V. room is provided separately in each block. It will be operated during stipulated hours.',
      'In special situations Boarders shall be allowed to watch T.V. Programs after the specified hours, on obtaining the prior written permission from the warden well in advance.',
      'Indoor / outdoor games are provided in the hostel.',
      'In case of serious illness or for the treatment suggested by the specialist doctor, the Management provides transport facility for admitting her to a nursing home / hospital at her own cost. Students permitted for outings on medical grounds have to submit MEDICAL REPORTS & CERTIFICATES on return.',
      'Students will not permit to consult their family doctors on health ground.',
    ].join('\n'),
  });
  pushTab(tabs, 'Amenities', amenities);

  const discipline: CustomSection[] = [];
  push(discipline, {
    label: 'Discipline Policies', contentType: 'list', listText: [
      'Discipline, to be observed in the Hostel, shall be as per the direction of the Hostel Committee and the Warden. Students should observe strict discipline and timings in the Hostel.',
      'Students are not allowed to stay in the Hostel during college hours without the prior permission of the Hostel / College authorities.',
      'They are not allowed to use T.V., Radio, Transistor or Tape Recorder in their rooms. If such things are noticed, disciplinary action will be initiated along with a minimum fine of Rs.500/- each time.',
      'RAGGING in any form in the Hostel premises or in the Campus is an offence as per the Constitution and is prohibited. Any one found indulging in such detrimental activities shall be handed over to the police and is liable for expulsion / dismissal from the Hostel / College immediately along with a minimum fine of Rs.4000/- (Rupees Five Hundred Only).',
      'Defacing the walls or the doors should be avoided. Any willful damage done to the property of the Hostel by boarder will entail for her dismissal from the Hostel along with a minimum fine of Rs.500/- (Rupees Five Hundred Only).',
      'Defacing / rewriting the Memos / Notifications should be avoided. If any such things are noticed by the Warden / Staff, the same will be viewed seriously.',
      'The main gates of the Hostel Building shall be opened only after 6:00 A.M and all the entrance gates of the Hostel shall be closed at 9:00 P.M.',
      'If any Boarder comes late and demands the Security Staff to open the gate, disciplinary action shall be taken against him/her and also a minimum fine of Rs.250/- is levied for the first time without conducting any enquiry.',
      'If the same is repeated for the second time a fine of Rs.500/- will be levied on such Boarders with a show cause notice.',
      'If any Boarder Continues to create indiscipline and does not obey the rules and regulations of the Hostel, she will be sent out of the hostel along with a minimum fee of Rs.1000.',
      'Parents or their authorized guardians with I.D. cards are permitted to visit the hostel between 9.00 am and 6.00pm only on holidays.',
      'Boarders are permitted to leave the hostel and accompany their parents or authorized guardians with I.D. Cards, only once in a month on specified days.',
      'In extraordinary cases, they may be permitted, if a parent / local guardian of another student hailing from the same area accepts the responsibility to accompany.',
      'Students not returning on due date after outings / holidays more than twice will be denied the hostel facilities during subsequent years.',
      'Students are not permitted to go on pilgrimage during working days.',
      'Staying over night outside the Hostel is strictly forbidden. Absence from the Hostel at night without prior written permission from the Warden shall result in dismissal of the boarder concerned along with a fine of Rs.500/- (Rupees Five Hundred Only).',
      'Boarders are not permitted to leave the Hostel premises after 9-00pm without the orders of the Warden.',
      'Boarders shall not issue orders to the Hostel Staff or interfere in their work. Causes of misconduct by Hostel Employees shall immediately be reported to the Warden with full particulars in writing. The warden shall make enquiries and take suitable action there on.',
      'Boarders shall not give tips to Hostel staff.',
      'Boarders are not allowed to put up notices or convene meetings of any sort within the premises of Hostel / Campus. They shall not join any Club / Society /Association except the College Associations, without obtaining a written permission from the Warden.',
      'If the Boarders wish to celebrate Hostel day, they should obtain prior written permission from the warden. The Hostel Day shall be celebrated only on any Holiday. The Hostel mess shall not work on that day evening and the dinner is cancelled.',
      'Students are not permitted to celebrate birthday parties in the college premises. They may arrange the parties in the hostel before 8.30pm after informing the Warden.',
      'A boarder whose name is removed from the college rolls has got no right to occupy a room in the hostel. The warden has full powers to expel such boarders from the hostel.',
      'A boarder, who fails to secure eligibility to go to the next higher semester, is not permitted to stay in the hostel. Refund of amount paid at the time of admission shall be based on rule 9 of Admission.',
      'The boarder who have arrears of previous month shall not be eligible to stay in the Hostel and shall vacate the rooms on or before 1st of next month. They shall claim their refund of advance made towards boarding and Caution Deposit, only after vacating the rooms. This shall also be applicable for Boarder who are dismissed from the Hostel.',
      'If any boarder leaves the Hostel after 1st day of the Month, she shall wait upto 15th of next month for refund of deposits paid towards Mess Advance and Caution Deposit.',
      'Students are permitted to go to their native places only during vacations and are not permitted to leave the hostel during normal / preparation holidays.',
      'Use of ALCOHOL in the room, in the Hostel Premises / Campus is strictly prohibited. Further, students are not permitted to enter the Hostel after consuming Alcohol. If any such incidence is observed or reported by the Residential Warden or by the Authorised Staff, it will be viewed seriously and proper action shall be taken by the Warden in consultation with the Hostel Committee on such Boarders. In this connection a minimum fine of Rs.3000/- shall be levied on such Boarders. Smoking is strictly prohibited in hostel and campus.',
      'The warden has a right to correspond or intimate the parents of Boarders on any matter pertaining to the Hostel and academic affairs.',
      'Playing cards or any game in the room is strictly prohibited. If detected, the warden has a right to expel such Boarders from the Hostel without giving any warning. However a minimum fine of Rs.2,500/- shall be levied and collected from such Boarders.',
      'No Boarder shall be allowed to bring her friends, classmates, parents and relatives to the rooms without the written permission of the Warden. If such things are noticed or brought to the notice of the Warden, disciplinary action shall be taken against such Boarder along with a minimum fine of Rs.500/-.',
      'Guests shall not be allowed to stay in the Hostel, under any circumstances.',
      'No Boarder is permitted to engage or keep her own servant in the Hostel.',
      'Boarders, in their own interest, are advised not to keep money / valuables (Watches, Calculators, Jewels etc.,) in their rooms without locking whenever they go out. The Management shall not be responsible for any such losses and no such complaints will be entertained for enquiry either by the Warden or by the Management.',
      'The inmates of the room shall have their own lock and keys. Whenever they go out of the room, they shall lock the room and leave.',
      'Only authorized visitors are allowed to see the students on Holidays between 9-00 am and 6-00 pm.',
      'Periodical visits by Parents / Guardians to the Hostel for discussion with the Warden are highly appreciated.',
      'Cell Phones are not permitted in the hostel without written permission. Unauthorised phones will be confiscated.',
      'The college/hostel officials reserve the right to screen the suspicious letters addressed to the students.',
      "Every Boarder is expected to cooperate whole heartedly in maintaining the Hostel's peaceful atmosphere.",
      'In all matters concerning admission, interpretation of the rules, disciplinary action etc., the decision of the hostel committee shall be final. We trust that the parents and guardians whole-heartedly cooperate in maintaining and enforcing the discipline.',
    ].join('\n'),
  });
  pushTab(tabs, 'Discipline Policies', discipline);

  return { tabs };
}

// ---------------------------------------------------------------------
// Other Facilities — 4 tabs.
// ---------------------------------------------------------------------

function seedOtherFacilities(): SeedResult {
  const tabs: CustomTab[] = [];
  const banks: CustomSection[] = [];
  push(banks, { label: 'Banks & ATMs', contentType: 'text', textContent: [
    'Bank services are very important for the modern society. Since the campus is huge and team with more than ten thousand students and employees, it need to meet lots of banking transactions.',
    'Indian Bank was exclusively runs for the students and employees of SVES.',
    'Apart from it, there are two ATMs. One of which is located at the entrance of the Main Gate of the campus and another near the Dental College in order to meet their banking needs hassle free.',
  ].join('\n\n') });
  pushTab(tabs, 'Banks & ATMs', banks);

  const post: CustomSection[] = [];
  push(post, { label: 'Post Office', contentType: 'text', textContent: [
    'From the time immemorial, communication has been the integral part of everyday life. The post office at Bhimavaram campus is always at the disposal of everyone and provides best services.',
    'In addition, Courier service is one more advantage in providing prompt service for one and all in the campus.',
  ].join('\n\n') });
  pushTab(tabs, 'Post Office', post);

  const power: CustomSection[] = [];
  push(power, { label: 'Power Backup', contentType: 'text', textContent: [
    "In Vishnu educational society there is a great power backup for helping to all seven institutions. Power backup's service needs for uninterruptable power supply. This is certified and offer fully warranted installations and give technical support to all institutions.",
    "With increasing power crisis in the state, and resources getting scarcer by the day, power cuts can only be expected to increase in frequency. However, SVECW cannot put student's lives on pause every time the power goes off. Therefore, SVECW procured generators to provide the necessary electricity backup and ensure that work goes on smoothly in the campus.",
    'SVECW facilities typically have backup generators onsite to supply electricity in the case of a power failure. Diesel standby generators uniquely start automatically within 60 seconds of a power outage, helping to protect critical data, security and communications systems.',
  ].join('\n\n') });
  pushTab(tabs, 'Power Backup', power);

  const water: CustomSection[] = [];
  push(water, { label: 'Mineral Water Plant', contentType: 'text', textContent: [
    'Water is the elixir of life which rejuvenates biological system in the body for better functioning. Now-a-days water is being polluted and the fact is that there are many water-borne diseases which are contagious in nature and spread quickly. Purified water is the solution for it.',
    'The mineral water plant provides plenty of purified water continuously to hostlers, colleges and everyone in the campus. The free of cost purified water is hygienic, packaged and is daily transported in a minivan to every place in the campus.',
    'Aqua Vishnu mineral water plant was set up in the campus and uses the Domestic RO System. Aqua Vishnu brings the water in its purest and safest form in through an effective and five-stage purification process. In addition, SVECW maintain an exclusive team of Administration staff to look after the water plant regularly, through which the College is assuring the safe water to all our students and staff.',
  ].join('\n\n') });
  pushTab(tabs, 'Mineral Water Plant', water);

  return { tabs };
}

// ---------------------------------------------------------------------
// Student Activities — plain customSections, sourced from the live
// contentBlocks data at the time of this migration (these 4 pages had no
// local hardcoded fallback — Page Content Blocks was their only source).
// ---------------------------------------------------------------------

function seedVishnuTV(): SeedResult {
  const sections: CustomSection[] = [];
  push(sections, {
    label: 'About',
    subtitle: 'A First in Andhra Pradesh',
    contentType: 'text',
    textContent: 'The Vishnu TV Academy is the only campus in Andhra Pradesh with a TV Academy built entirely for and by students. Growing out of the model established by Radio Vishnu 90.4, it operates on a clear principle — every program is made "by the students, for the students."\n\nStudents at the academy take full responsibility for content — from concept through to final production — building practical skills in filmmaking, journalism, anchoring, and digital media while making a genuine contribution to campus life.',
  });
  push(sections, {
    label: 'Four Pillars of Vishnu TV', contentType: 'table',
    tableText: cardsTable([
      { title: 'Education', desc: 'Recordings of guest lectures, laboratory experiments, classroom presentations, and workshops, made available across the campus community.' },
      { title: 'Entertainment', desc: 'Student-produced shows, creative programs, and filmed campus experiences that reflect the energy of life at VWU.' },
      { title: 'Events', desc: 'Live and archived coverage of symposia, cultural festivals, sports days, and all notable campus events.' },
      { title: 'News', desc: 'Campus news updates, institutional announcements, and student journalism that keep the VWU community well informed.' },
    ]),
  });
  push(sections, {
    label: 'Documentary Topics', subtitle: 'Social Impact Stories', contentType: 'list',
    listText: cardsList([
      { title: 'Health Care & Hygiene' }, { title: 'Personality Development' }, { title: 'Child Labour Awareness' },
      { title: "Women's Education & Empowerment" }, { title: 'Environmental Concerns' }, { title: 'Social Issues' },
    ]),
  });
  push(sections, {
    label: 'Production Types', contentType: 'list',
    listText: cardsList([
      { title: 'Documentary Films' }, { title: 'Guest Lecture Recordings' }, { title: 'Lab Experiment Videos' },
      { title: 'Seminar & Workshop Coverage' }, { title: 'Student-Developed Programs' }, { title: 'Classroom Presentations' },
    ]),
  });
  return { customSections: sections };
}

function seedArtsCulture(): SeedResult {
  const sections: CustomSection[] = [];
  push(sections, {
    label: 'Our Philosophy', subtitle: 'Culture is the Heart of Education', contentType: 'text',
    textContent: '"A healthy Nation would be built only when we have a strong force of cultured and responsible youngsters."\n\nAt VWU, learning extends well beyond the classroom. Cultural participation, artistic expression, and social awareness are treated as integral to a complete education — not supplementary, but essential.\n\nCampus life is shaped by the spirit of "Vasudhaika Kutumbakam" — the world is one family — and every Indian festival is observed with the energy and inclusivity that defines VWU as a community.',
  });
  push(sections, {
    label: 'Cultural Initiatives', contentType: 'table',
    tableText: cardsTable([
      { title: 'Festival Celebrations', desc: 'VWU celebrates every Indian festival with genuine enthusiasm and collective participation, embodying the spirit of "Vasudhaika Kutumbakam" — the world is one family.' },
      { title: 'Artistic Development', desc: 'Students with a passion for the arts receive encouragement, guidance, and access to facilities for painting, photography, music, and decorative arts, growing their talent alongside their technical studies.' },
      { title: 'Performing Arts', desc: 'Dance, drama, and music are central to campus culture. Dedicated clubs and regular events give students the stage to develop their talents and share them with the wider community.' },
      { title: 'Photography & Film', desc: 'The Flash It Out Club and Vishnu TV Academy offer students real creative outlets for photography and filmmaking, telling stories from campus life and beyond.' },
    ]),
  });
  push(sections, {
    label: 'Our Annual Celebrations', subtitle: 'Signature Events', contentType: 'table',
    tableText: cardsTable([
      { title: 'Annual Day', desc: "VWU's flagship annual celebration — a showcase of student talent through cultural performances, institutional awards, and recognition of academic and co-curricular achievement." },
      { title: 'Medha Milan', desc: 'A national-level technical symposium drawing students from across Andhra Pradesh and Telangana for competitions, paper presentations, and cultural programs.' },
      { title: 'Sports Day', desc: 'The annual Sports Day that honours athletic achievement and healthy competition — featuring track events, field sports, and special recognition for standout performers.' },
    ]),
  });
  return { customSections: sections };
}

function seedSportsGames(): SeedResult {
  const sections: CustomSection[] = [];
  push(sections, {
    label: 'Our Approach', subtitle: 'Sports as a Core Pillar', contentType: 'text',
    textContent: '"A sound mind dwells in a sound body. Physical exercises keep one healthy and fit."\n\nAt VWU, sport and physical activity are not afterthoughts — they are a deliberate part of student development, given serious attention alongside academics. Every student is encouraged to take part, compete, and push herself.\n\nA qualified female Physical Director manages all day-to-day athletic programs and prepares students to represent VWU at university and inter-collegiate competitions.',
  });
  push(sections, {
    label: 'Sports Facilities', contentType: 'table',
    tableText: cardsTable([
      { title: 'VISHNU Fitness Centre', desc: 'A well-equipped gymnasium with modern training apparatus, qualified instructors, and structured fitness programs available to all students.' },
      { title: 'Swimming Pool', desc: 'An Olympic-standard pool open to students and staff, supported by certified coaching and regularly scheduled training sessions.' },
      { title: 'Spacious Playground', desc: 'A large, well-kept outdoor ground for athletics, field sports, and team games — accommodating a broad range of sporting disciplines.' },
      { title: 'Indoor Sports Hall', desc: 'Year-round indoor facilities for badminton, table tennis, chess, carrom, and a variety of other indoor games.' },
    ]),
  });
  push(sections, {
    label: 'Sports Program Highlights', contentType: 'table',
    tableText: cardsTable([
      { title: 'Physical Director', desc: 'A qualified female Physical Director oversees all athletic programs and day-to-day activities' },
      { title: 'University Competitions', desc: 'Students regularly participate in JNTUK and inter-university sports meets' },
      { title: 'Special Events', desc: 'Annual Sports Day featuring track events, field disciplines, and team competitions' },
      { title: 'Student Guidance', desc: 'Personalised coaching and motivation to prepare students for university-level competition' },
      { title: 'Inter-Collegiate', desc: 'Scheduled inter-collegiate tournaments and sports meets throughout the year' },
      { title: 'Daily Sessions', desc: 'Structured morning and evening sessions supporting regular fitness for all students' },
    ]),
  });
  push(sections, {
    label: 'Sports Achievements', subtitle: 'Excellence', contentType: 'table',
    tableText: cardsTable([
      { title: 'University-Level Champions', desc: 'VWU students consistently perform at JNTUK university-level competitions across a number of sports disciplines.' },
      { title: 'Fitness Excellence', desc: 'Year-round fitness centre programs help students develop discipline, physical strength, and overall well-being.' },
      { title: 'Aquatics Coaching', desc: 'Certified coaches deliver structured swimming training, with students going on to compete at university and state levels.' },
      { title: 'Athletics', desc: 'Track and field athletes are developed through systematic training and regular exposure to inter-collegiate competition.' },
    ]),
  });
  return { customSections: sections };
}

function seedSocialServices(): SeedResult {
  const sections: CustomSection[] = [];
  push(sections, {
    label: 'NSS at VWU', subtitle: 'Serving the Nation Through Education', contentType: 'text',
    textContent: '"National integrity should flow from the heart of every citizen. Apart from academics, every student must involve in serving her country."\n\nAt VWU, the National Service Scheme (NSS) is a meaningful part of student formation. The programme rests on the conviction that "Education and Service to the community and by the community" is the true basis of a complete education.\n\nThrough NSS, students take part in nation-building work, strengthen their interpersonal abilities, and help foster a Technocratic Environment in rural communities — continuing the humanitarian values that our founder Dr. B. V. Raju embodied throughout his life.',
  });
  push(sections, {
    label: 'Communities We Serve', subtitle: 'Outreach', contentType: 'table',
    tableText: cardsTable([
      { title: 'Rural Students', desc: 'Extending educational support and skills programs to economically disadvantaged students from rural backgrounds.' },
      { title: 'Leprosy Care', desc: 'Offering care, compassion, and dignity to individuals affected by leprosy through regular visits and welfare activities.' },
      { title: 'Village Communities', desc: 'Working with nearby villages on technical literacy, nutritional awareness, and broader community welfare initiatives.' },
      { title: 'Persons with Disabilities', desc: 'Supporting individuals with physical disabilities through awareness programs, assistive technology exposure, and inclusive campus activities.' },
      { title: 'Hospital Patients', desc: 'Serving hospital patients through welfare visits, blood donation drives, and coordination with partner organisations.' },
      { title: 'Academic Excellence', desc: 'Acknowledging and supporting high-achieving students from nearby institutions through mentoring and motivational programs.' },
    ]),
  });
  push(sections, {
    label: 'NSS Core Values', subtitle: 'Our Values', contentType: 'list',
    listText: cardsList([
      { title: 'Not Me But You' }, { title: 'Service before Self' }, { title: 'Education through Community' },
      { title: 'Nation Building through Youth' }, { title: 'Inclusive Development' }, { title: 'Rural Empowerment' },
    ]),
  });
  push(sections, {
    label: 'Dr. B. V. Raju Foundation', subtitle: "Founder's Legacy", contentType: 'text',
    textContent: "VWU's ethos of service has deep roots in the life of our founder, the late Padma Bhushan Dr. B. V. Raju, who devoted his later years to humanitarian causes — building leprosy care centres, schools, women's associations, community halls, and veterinary facilities in surrounding villages, all without government support.\n\nThe Dr. B. V. Raju Foundation continues this tradition today. VWU students take an active part in this mission, channelling their technical knowledge, empathy, and sense of purpose into communities that genuinely need both.",
  });
  return { customSections: sections };
}

function seedCampusMagazines(): SeedResult {
  const sections: CustomSection[] = [];
  const magazines = [
    {
      name: 'Campus Browser', type: 'Newsletter', since: 'June 2003', patron: 'Sri K.V. Vishnu Raju, Chairman, SVES',
      desc: 'Since June 2003, Campus Browser has chronicled the growth and achievements of VWU and all SVES institutions. The newsletter covers academics, co-curricular activities, events, and community work, building an ongoing record of campus life.',
      highlights: ['Academic achievements & milestones', 'Co-curricular activity coverage', 'Community and outreach initiatives', 'Institutional news & updates'],
    },
    {
      name: 'Vishnu Era', type: 'Quarterly Magazine', since: 'Ongoing', patron: 'Sri Vishnu Educational Society',
      desc: "Vishnu Era is the flagship quarterly publication of SVES, offering a broad view of the society's journey. It brings together the work and contributions of students and staff across all SVES institutions in a varied and engaging format.",
      highlights: ['Technical & literary articles', '"Upper Cut" — profiles of influential figures', 'Alumni success stories from abroad', 'Thought-provoking essays & science articles'],
    },
    {
      name: 'Prathibha', type: 'Digital Magazine', since: 'Ongoing', patron: 'VWU Students & Faculty',
      desc: 'Prathibha is a student publication in digital flip-book format, presenting the creative writing, technical work, and literary contributions of VWU students in an accessible, shareable form.',
      highlights: ['Digital flip-book format', 'Student creative contributions', 'Technical articles & projects', 'Available online via VWU portal'],
    },
  ];
  magazines.forEach((mag) => {
    push(sections, {
      label: mag.name,
      subtitle: `${mag.type} · Since ${mag.since} · Under the patronage of ${mag.patron}`,
      contentType: 'text',
      textContent: mag.desc,
      subSections: [{ id: generateSectionId('Highlights', []), label: 'Highlights', contentType: 'list', listText: mag.highlights.join('\n') }],
    });
  });
  return { customSections: sections };
}

// ---------------------------------------------------------------------

export const CAMPUS_LIFE_LEGACY_SEEDS: Record<string, () => SeedResult> = {
  'smart-classrooms': seedFacility('smart-classrooms'),
  'state-of-the-art-labs': seedFacility('state-of-the-art-labs'),
  'auditoriums': seedFacility('auditoriums'),
  'campus-book-stores': seedFacility('campus-book-stores'),
  'wifi-campus': seedFacility('wifi-campus'),
  'food-courts': seedFacility('food-courts'),
  'fitness-centre': seedFacility('fitness-centre'),
  'staff-quarters': seedFacility('staff-quarters'),
  'travel-desk': seedFacility('travel-desk'),
  'temples': seedFacility('temples'),
  'health-care': seedFacility('health-care'),
  'swimming-pool': seedFacility('swimming-pool'),
  'campus-security': seedFacility('campus-security'),
  'central-library': seedCentralLibrary,
  'campus-hostels': seedCampusHostels,
  'other-facilities': seedOtherFacilities,
  'vishnu-tv-academy': seedVishnuTV,
  'arts-culture': seedArtsCulture,
  'sports-games': seedSportsGames,
  'social-services': seedSocialServices,
  'campus-magazines': seedCampusMagazines,
};
