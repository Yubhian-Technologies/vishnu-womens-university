import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CampusFacilitiesNav from './CampusFacilitiesNav';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import type { ContentBlockDoc } from '../Admin/sections/ContentBlocksAdmin';
import '../detail-layout.css';
import './tabbed-section.css';

// The SVECW Library's real holdings, grouped exactly as the library itself
// categorises them (Books / Periodicals / e-Journals / Media Resources).
const libraryResourceCategories: { title: string; items: { label: string; value: string }[] }[] = [
  {
    title: 'Books',
    items: [
      { label: 'Total Number of Books', value: '59,721' },
      { label: 'Total Number of Titles', value: '8,401' },
      { label: 'Total Number of Journal Back Volumes', value: '1,380' },
    ],
  },
  {
    title: 'Periodicals',
    items: [
      { label: 'Total Number of Periodicals', value: '157' },
      { label: 'National', value: '157' },
    ],
  },
  {
    title: 'e-Journals',
    items: [
      { label: 'Science Direct, N-LIST, DELNET', value: '6,656' },
    ],
  },
  {
    title: 'Media Resources',
    items: [
      { label: 'Audio Cassettes', value: '250' },
      { label: 'Compact Discs', value: '4,000' },
    ],
  },
];

const libraryResponsibilities = [
  'Responding to the varying needs of the academic community by involving the faculty, the students and the administration in the development and periodic assessment of the library services and resources.',
  'Providing library users with point-of-use instruction, personal assistance in conducting literature research and other reference services.',
  'Providing an environment conducive to the optimum use of library materials and an appropriate schedule of hours of service and professional assistance.',
  'Participating in overall computing resources plan and providing for full library utilization of automation technology, physical facilities and equipment adequate to process, catalogue and store the materials.',
  "Enhancing the library's resources and services through cooperative relationship with other libraries and agencies.",
];

const defaultDigitalLibrary: ContentBlockDoc[] = [
  { id: 'd1', page: 'central-library', section: 'digitalLibrary', value: '', title: 'N-List', desc: "INFLIBNET's N-LIST programme, providing consortium access to e-journals and e-books for colleges and universities.", icon: '', slug: 'https://nlist.inflibnet.ac.in', order: 0 },
  { id: 'd2', page: 'central-library', section: 'digitalLibrary', value: '', title: 'NDL — National Digital Library', desc: 'A single-window platform for digital learning resources from schools to research, hosted by IIT Kharagpur.', icon: '', slug: 'https://ndl.iitkgp.ac.in', order: 1 },
  { id: 'd3', page: 'central-library', section: 'digitalLibrary', value: '', title: 'NPTEL', desc: 'Video and web courses in engineering, science, and humanities, mirrored on the campus network.', icon: '', slug: 'http://10.0.0.16:8080/nptel', order: 2 },
  { id: 'd4', page: 'central-library', section: 'digitalLibrary', value: '', title: 'DELNET', desc: 'A resource-sharing network connecting libraries across India for inter-library loan and reference.', icon: '', slug: 'https://delnet.in/index.html', order: 3 },
  { id: 'd5', page: 'central-library', section: 'digitalLibrary', value: '', title: 'Elsevier ScienceDirect', desc: 'Full-text scientific and technical research from Elsevier journals and books.', icon: '', slug: 'https://www.sciencedirect.com', order: 4 },
  { id: 'd6', page: 'central-library', section: 'digitalLibrary', value: '', title: "MGH Schaum's e-Books", desc: "McGraw Hill's Schaum's Outlines e-book library, covering core engineering and science subjects.", icon: '', slug: 'http://mhebooklibrary.com', order: 5 },
];

// "e-Databases" has its own sub-tabs (E-Books / Open Access Online
// Journals/Magazines / Electronic References / Video On Demand / Open
// Courseware). Only E-Books content was provided — no URLs, so these are
// listed as plain names rather than invented links; the other four
// sub-tabs stay empty until real content is added via Page Content Blocks.
type EDatabaseSubTabId = 'ebooks' | 'openAccessJournals' | 'electronicReferences' | 'videoOnDemand' | 'openCourseware';

const E_DATABASE_SUBTABS: { id: EDatabaseSubTabId; label: string; section: string }[] = [
  { id: 'ebooks', label: 'E-Books', section: 'eDatabasesEbooks' },
  { id: 'openAccessJournals', label: 'Open Access Online Journals/Magazines', section: 'eDatabasesOpenAccessJournals' },
  { id: 'electronicReferences', label: 'Electronic References', section: 'eDatabasesElectronicReferences' },
  { id: 'videoOnDemand', label: 'Video On Demand', section: 'eDatabasesVideoOnDemand' },
  { id: 'openCourseware', label: 'Open Courseware', section: 'eDatabasesOpenCourseware' },
];

const eBookSites: { title: string; slug: string }[] = [
  { title: 'UMDL Text e-books and e-texts', slug: 'http://www.hti.umich.edu/cgi/t/text/text-idx' },
  { title: 'Yudu', slug: 'http://free.yudu.com/' },
  { title: 'Meta Text', slug: 'http://metatext.com/' },
  { title: 'CampusBooks', slug: 'http://www.campusbooks.com/' },
  { title: 'University of Pennsylvania e-books', slug: 'http://digital.library.upenn.edu/books' },
  { title: 'University of Virginia e-book library', slug: 'http://etext.lib.virginia.edu/ebooks/ebooklist.html' },
  { title: 'Library of Free e-books', slug: 'http://www.web-books.com/cool/ebooks/Library.htm' },
  { title: 'NAP Open book', slug: 'http://www.nap.edu/index.html' },
  { title: 'Open e-book Forum', slug: 'http://198.88.160.15/' },
  { title: 'e-text Archives', slug: 'http://www.etext.org/index.shtml' },
  { title: 'Virtualbooks', slug: 'http://www.virtual-ebooks.com/' },
  { title: 'Internet Public Library', slug: 'http://www.ipl.org/div/books' },
  { title: 'Project Gutenberg', slug: 'http://www.gutenberg.org/' },
  { title: 'Direct TextBook', slug: 'http://www.directtextbook.com/' },
  { title: 'FCL e-bboks', slug: 'http://polpac.farmlib.org/polaris/' },
  { title: 'Net library', slug: 'http://www.netlibrary.net/' },
  { title: 'Free ebooks', slug: 'http://www.free-ebooks.net/' },
  { title: 'AmericanMemory', slug: 'http://memory.loc.gov/' },
  { title: 'e-books and Bytes', slug: 'http://www.ebooksnbytes.com/ebooks.html' },
  { title: 'Online Text Collection', slug: 'http://www.ipl.org/reading/books/' },
  { title: 'e-Books on South Asia', slug: 'http://www.columbia.edu/cu/lweb/indiv/southasia/cuvl/ebooks.html' },
  { title: 'E-Books of University of Adelaide Library', slug: 'http://etext.library.adelaide.edu.au/aut/bacon_francis.html' },
  { title: 'Freetech Books', slug: 'http://www.freetechbooks.com/' },
  { title: 'e-books', slug: 'http://e-books.org/' },
  { title: 'NSDL', slug: 'http://nsdl.org/' },
  { title: 'e-bookpalace', slug: 'http://www.ebookpalace.com/' },
  { title: 'Google Books', slug: 'http://books.google.co.in/books' },
  { title: 'Memo Ware', slug: 'http://www.memoware.com/' },
  { title: 'Many Books', slug: 'http://manybooks.net/' },
  { title: 'World Lecture Hall', slug: 'http://freevideolectures.com/blog/2011/11/free-course-material-any-subject/' },
  { title: 'Books on Smart Phone', slug: 'http://www.booksinmyphone.com/' },
  { title: 'Electronic Library of Mathematics', slug: 'http://www.emis.de/journals/short_index.html' },
  { title: 'Planet Books', slug: 'http://www.planetbook.com/' },
  { title: 'Book Finder', slug: 'http://www.bookfinder.com/' },
  { title: 'Turnit', slug: 'http://www.turnit.com/' },
  { title: '130+ NPTEL(IIT) Courses with Video Lectures', slug: 'http://freevideolectures.com/blog/2010/11/130-nptel-iit-online-courses/' },
];

const defaultEBooks: ContentBlockDoc[] = eBookSites.map((s, i) => ({
  id: `d${i}`, page: 'central-library', section: 'eDatabasesEbooks', value: '', title: s.title, desc: '', icon: '', slug: s.slug, order: i,
}));

const openAccessJournalSites: { title: string; desc: string; slug: string }[] = [
  { title: 'MHE Book Library', desc: '', slug: 'https://mhebooklibrary.com/' },
  { title: 'Lebanese American University', desc: '600 free e-journals.', slug: 'http://www.lau.edu.lb/libraries/free-journals-list.php' },
  { title: 'Intute', desc: 'Search engine list of 350 freely available full-text sciences, engineering, and technology e-journals.', slug: 'http://www.intute.ac.uk/sciences/ejournallist.html' },
  { title: 'Bentham Open', desc: '175 open access journals.', slug: 'http://www.bentham.org/open/a-z.htm' },
  { title: 'Hindawi', desc: '49 full open access STM journals.', slug: 'http://www.hindawi.com/journals/titles.html' },
  { title: 'Open J-Gate', desc: '4,805 Open Access Journals (2,626 Peer-Reviewed).', slug: 'http://crl.du.ac.in/oa/OpenJ-Gate.com.htm' },
  { title: 'ICRISAT e-Library', desc: 'Open access full-text collection.', slug: 'http://www.elibrary.icrisat.org/fulltext/openaccess.html' },
  { title: 'Royal Society Publishing', desc: 'Journals.', slug: 'http://royalsocietypublishing.org/journals' },
  { title: 'The Electronic Library of Mathematics', desc: '450 online journals.', slug: 'http://www.emis.ams.org/journals/' },
  { title: 'Free Medical Journals', desc: 'Medical & bio-technology journals — 430 online journals.', slug: 'http://www.freemedicaljournals.com/' },
  { title: 'Engineering Library — University of Cincinnati', desc: 'Science and Engineering Databases Online.', slug: 'http://www.libraries.uc.edu/libraries/engr/selfhelp/alphlist.html' },
  { title: 'PubMed Central', desc: '275 open access journals.', slug: 'http://www.pubmedcentral.nih.gov/fprender.fcgi?cmd=full_view' },
  { title: 'Indian Academy of Sciences (IAS)', desc: '11 free Indian online journals.', slug: 'http://www.ias.ac.in/' },
  { title: 'UNR Knowledge Center', desc: '4,500+ e-journals.', slug: 'http://www.knowledgecenter.unr.edu/ejournals/free.aspx' },
  { title: 'Directory of Open Access Journals (DOAJ)', desc: 'Currently 1,210 journals are searchable at article level.', slug: 'http://www.doaj.org/' },
  { title: 'HighWire — Institute of Physics (IOP)', desc: '60 e-journals.', slug: 'http://highwire.stanford.edu/' },
];

const defaultOpenAccessJournals: ContentBlockDoc[] = openAccessJournalSites.map((s, i) => ({
  id: `d${i}`, page: 'central-library', section: 'eDatabasesOpenAccessJournals', value: '', title: s.title, desc: s.desc, icon: '', slug: s.slug, order: i,
}));

const videoOnDemandSites: { title: string; desc: string; slug: string }[] = [
  { title: 'YouTube EDU', desc: 'Video on demand from some of the world’s most prestigious universities.', slug: 'http://youtube.com/edu' },
  { title: 'IIT/IISc', desc: '', slug: 'http://youtube.com/nptelhrd' },
  { title: 'MIT', desc: '', slug: 'http://youtube.com/mit' },
  { title: 'Stanford', desc: '', slug: 'http://youtube.com/stanforduniversity' },
  { title: 'UC Berkeley', desc: '', slug: 'http://youtube.com/ucberkeley' },
  { title: 'UCLA', desc: '', slug: 'http://youtube.com/ucla' },
  { title: 'Yale', desc: '', slug: 'http://youtube.com/yalecourses' },
  { title: 'Digital Library of India', desc: '', slug: 'http://www.new.dli.ernet.in/' },
];

const defaultVideoOnDemand: ContentBlockDoc[] = videoOnDemandSites.map((s, i) => ({
  id: `d${i}`, page: 'central-library', section: 'eDatabasesVideoOnDemand', value: '', title: s.title, desc: s.desc, icon: '', slug: s.slug, order: i,
}));

const openCoursewareIntro = 'In the Open Courseware, course materials created by universities are shared freely with the world via internet. According to the website of the OCW Consortium, an OCW project';

const openCoursewarePoints = [
  'Is a free and open digital publication of high quality educational materials courses.',
  'Is available for use and adaptation under an open license',
];

const defaultOpenCourseware: ContentBlockDoc[] = [
  { id: 'd0', page: 'central-library', section: 'eDatabasesOpenCourseware', value: '', title: 'http://www.ocwconsortium.org/en/courses/search', desc: '', icon: '', slug: 'http://www.ocwconsortium.org/en/courses/search', order: 0 },
];

// Electronic References is grouped into named categories (unlike the flat
// E-Books / Open Access Journals lists) — only "Associations" and the start
// of "Atlases" were visible in the reference screenshot before it was cut
// off, so this is necessarily incomplete; more categories almost certainly
// exist below what could be captured.
const electronicReferenceCategories: { title: string; items: { name: string; url: string }[] }[] = [
  {
    title: 'Associations',
    items: [
      { name: 'ASM International Foundation', url: 'http://library.dce.edu/main.htm?Section=ASMFoundation&NavMenuID=498' },
      { name: 'Webpages for Scholarly Societies', url: 'http://www.lib.uwaterloo.ca/society/webpages.html' },
      { name: 'Gateway to Associations Online', url: 'http://www.asaenet.org/find/' },
      { name: 'Idealist', url: 'http://www.idealist.org/' },
      { name: 'World Directory of Think Tanks', url: 'http://www.nira.go.jp/ice/' },
      { name: 'Associations on the Net', url: 'http://www.ipl.org/div/aon/' },
      { name: 'International Organization and NGO Web Sites', url: 'http://www.uia.org/website.htm' },
      { name: 'Meta-Index for Nonprofit Organizations', url: 'http://www.strano.net/network/internet/linkpage/links/metaindx.htm' },
      { name: 'European Mathematical Society', url: 'http://www.emis.de/' },
    ],
  },
  {
    title: 'Atlases',
    items: [
      { name: 'Rare Maps', url: 'http://www.raremaps.com/' },
      { name: 'Maps and Atlases', url: 'http://memory.loc.gov/ammem/gmdhtml/gnrlhome.html' },
      { name: 'MAPS', url: 'http://www.mapquest.com/' },
      { name: 'Freeality Online Atlases, Maps, and Travel Directions', url: 'http://www.freeality.com/maps.htm' },
      { name: 'Atlas', url: 'http://go.hrw.com/atlas/norm_htm/world.htm' },
      { name: 'Geography : Atlases', url: 'http://www.library.adelaide.edu.au/gen/Atlases.html' },
      { name: 'Health Atlases', url: 'http://dir.yahoo.com/Science/Geography/Human_Geography/Medical_Geography/Health_Atlases/' },
      { name: 'Maps.com', url: 'http://www.maps.com/' },
    ],
  },
  {
    title: 'Citation Guides',
    items: [
      { name: 'Harvard Referencing', url: 'http://lisweb.curtin.edu.au/referencing/harvard.html' },
      { name: "Karla's Guide to Citation Style Guides", url: 'http://bailiwick.lib.uiowa.edu/journalism/cite.html' },
      { name: 'Style Sheet for Citing Internet Sources', url: 'http://www.lib.berkeley.edu/TeachingLib/Guides/Internet/Style.html' },
      { name: 'Journals Abbreviation Resources', url: 'http://www.public.iastate.edu/~CYBERSTACKS/JAS.htm' },
      { name: 'MLA Style', url: 'http://www.mla.org/' },
      { name: 'CBE Documentation', url: 'http://library.austincc.edu/help/cbe/cbe-cs.htm' },
      { name: 'Citation Formats for Natural Scientists', url: 'http://www.dartmouth.edu/~sources/how/formats.html' },
      { name: 'Electronic References & Scholarly Citations of Internet Sources', url: 'http://www.spaceless.com/WWWVL/' },
      { name: 'Citation Styles Handbook', url: 'http://www.english.uiuc.edu/cws/wworkshop/writer_resources/citation_styles/apa/apa.htm' },
    ],
  },
  {
    title: 'Dictionaries',
    items: [
      { name: 'Dictionary of Difficult Words', url: 'http://www.tiscali.co.uk/reference/dictionaries/difficultwords/' },
      { name: "Roget's Internet Thesaurus", url: 'http://www.thesaurus.com/' },
      { name: 'Cambridge Dictionaries Online', url: 'http://dictionary.cambridge.org/' },
      { name: 'WWWebster Dictionary', url: 'http://www.m-w.com/netdict.htm' },
      { name: 'WordNet', url: 'http://www.cogsci.princeton.edu/~wn/main/' },
      { name: 'Acronym Finder', url: 'http://www.acronymfinder.com/' },
      { name: 'One look Dictionary', url: 'http://www.onelook.com/' },
      { name: 'Rogets Thesaurus', url: 'http://asadz.com/thesaurus/' },
      { name: 'NASA Thesaurus', url: 'http://www.sti.nasa.gov/thesfrm1.htm' },
      { name: 'Russian', url: 'http://www.freedict.com/onldict/rus.html' },
      { name: 'Familiar Quotations', url: 'http://www.bartleby.com/99/' },
    ],
  },
  {
    title: 'Encyclopedias',
    items: [
      { name: 'Encyclopedia Mythica', url: 'http://www.pantheon.org/' },
      { name: 'Encyclopedia of the Orient', url: 'http://i-cias.com/e.o/index.htm' },
      { name: 'Internet Encyclopedia of Philosophy', url: 'http://www.utm.edu/research/iep/' },
      { name: 'Stanford Encyclopedia of Philosophy', url: 'http://plato.stanford.edu/contents.html' },
      { name: 'PC Webopaedia', url: 'http://www.pcwebopaedia.com/' },
      { name: 'Merriam-Webster', url: 'http://www.m-w.com/' },
      { name: 'World Fact Book', url: 'http://www.odci.gov/cia/publications/factbook' },
      { name: 'Medline Plus Medical Encyclopedia', url: 'http://medlineplus.adam.com/' },
      { name: 'Artcyclopedia', url: 'http://www.artcyclopedia.com/' },
      { name: 'Encarta Encyclopedia', url: 'http://encarta.msn.com/' },
      { name: 'Encyclopedia Britannica', url: 'http://www.britannica.com/' },
      { name: 'Encyclopedia', url: 'http://www.encyclopedia.com/' },
      { name: 'Encyclopedia Mythica', url: 'http://www.pantheon.org/' },
      { name: 'Discovery online', url: 'http://www.discovery.com/' },
      { name: 'Tech Encyclopedia', url: 'http://www.techweb.com/encyclopedia' },
      { name: 'World of Mathematics', url: 'http://mathworld.wolfram.com/' },
      { name: 'Instrument Encyclopedia', url: 'http://www.si.umich.edu/chico/instrument/' },
      { name: 'Fossil Encyclopedia', url: 'http://www.britannica.com/ebi/article?tocId=9274394' },
    ],
  },
  {
    title: 'Grants',
    items: [
      { name: 'EPA Grants Writing Tutorial', url: 'http://www.epa.gov/grtlakes/seahome/grants.html' },
      { name: 'NSF Grants', url: 'http://www.nsf.gov/funding/' },
      { name: 'NIST Grants', url: 'http://www.nist.gov/public_affairs/grants.htm' },
      { name: 'COS Funding Opportunities', url: 'http://fundingopps.cos.com/' },
      { name: 'Grantsnet', url: 'http://www.grantsnet.org/' },
      { name: 'Grants$eeker', url: 'http://www.regis.edu/grants' },
    ],
  },
  {
    title: 'News Papers',
    items: [
      { name: 'Chicago Tribune', url: 'http://www.chicago.tribune.com/' },
      { name: 'The Washington Times', url: 'http://www.washtimes.com/' },
      { name: 'Science Tech. DailyReview', url: 'http://scitechdaily.com/' },
      { name: 'The New York Times', url: 'http://nytimes.com/' },
      { name: 'USA Today', url: 'http://usatoday.com/' },
      { name: 'Sydney Morning Herald', url: 'http://www.smh.com.au/' },
      { name: 'Business Standard', url: 'http://www.business-standard.com/' },
      { name: 'Times of India', url: 'http://www.timesofindia.com/' },
      { name: 'Businessline', url: 'http://www.hindubusinessline.com/' },
      { name: 'Deutsche Welle', url: 'http://www.dw-world.de/' },
      { name: 'Telegraph', url: 'http://www.telegraph.co.uk/' },
      { name: 'India-Today', url: 'http://www.india-today.com/' },
      { name: 'Express Business', url: 'http://www.expressindia.com/ie/daily/20000907/business.htm' },
      { name: 'Financial Times', url: 'http://www.ft.com/' },
      { name: 'Indian Express', url: 'http://www.expressindia.com/' },
      { name: 'The Detroit News', url: 'http://detnews.com/' },
      { name: 'The Hindu', url: 'http://www.hinduonline.com/' },
      { name: 'Die Welt', url: 'http://www.welt.de/' },
    ],
  },
  {
    title: 'Translation',
    items: [
      { name: 'English German', url: 'http://www.dict.cc/' },
      { name: 'French English', url: 'http://humanities.uchicago.edu/forms_unrest/FR-ENG.html' },
      { name: 'Free Translation', url: 'http://www.freetranslation.com/' },
      { name: 'English Spanish', url: 'http://www.freedict.com/onldict/spa.html' },
    ],
  },
];

interface PeriodicalRow {
  no: number;
  periodicity: string;
  branch: string;
  title: string;
}

const journalsList: PeriodicalRow[] = [
  { no: 1, periodicity: 'Bi-annual', branch: 'AI&DS, AIML', title: 'Journal of Advanced Research in Artificial Intelligence and Neural Network' },
  { no: 2, periodicity: 'Bi-annual', branch: 'AI&DS, AIML', title: 'Journal of Advanced Research in Cloud computing, virtualization and web applications' },
  { no: 3, periodicity: 'Bi-annual', branch: 'AI&DS, AIML', title: 'Journal of Advanced Research in Information technology and systems management' },
  { no: 4, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Research & Review: Machine Learning and Cloud Computing' },
  { no: 5, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: "Recent Trends in Artificial Intelligence & it's applications" },
  { no: 6, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Journal of Cyber Security, Privacy Issues and Challenges' },
  { no: 7, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Journal of Innovations in Data Science and Big Data Management' },
  { no: 8, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Journal of IoT Security and Smart technologies' },
  { no: 9, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Journal of Artificial Neural networks and Learning system' },
  { no: 10, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Journal of Fuzzy sets and Fuzzy Logic Design' },
  { no: 11, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Journal of Big Data Technology and Business Analytics' },
  { no: 12, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Journal of IoT – based Distributed sensor networks' },
  { no: 13, periodicity: 'Tri-annual', branch: 'AI&DS, AIML', title: 'Journal of Cryptography and Network security, design and codes' },
  { no: 14, periodicity: 'Quarterly', branch: 'Civil', title: 'IRC Periodicals' },
  { no: 15, periodicity: 'Tri-annual', branch: 'Civil', title: 'Journal of Construction and Building Materials Engineering' },
  { no: 16, periodicity: 'Tri-annual', branch: 'Civil', title: 'Journal of Environmental Engineering and Studies' },
  { no: 17, periodicity: 'Bi-annual', branch: 'Civil', title: 'Journal of Advanced Research in Civil and Environmental Engineering' },
  { no: 18, periodicity: 'Bi-annual', branch: 'Civil', title: 'Journal of Advanced Research in Water Resources and Hydraulic Engineering' },
  { no: 19, periodicity: 'Bi-annual', branch: 'Civil', title: 'Journal of Advanced Research in Civil and structural engineering' },
  { no: 20, periodicity: 'Quarterly', branch: 'Civil', title: 'Water resources and irrigation' },
  { no: 21, periodicity: 'Tri-annual', branch: 'Civil', title: 'Journal of Advanced Cement and Concrete Technology' },
  { no: 22, periodicity: 'Tri-annual', branch: 'Civil', title: 'Journal of Sustainable Construction Engineering and Project Management' },
  { no: 23, periodicity: 'Tri-annual', branch: 'Civil', title: 'Journal of Earthquake Science and Soil Dynamic Engineering' },
  { no: 24, periodicity: 'Bi-annual', branch: 'Civil', title: 'Journal of Advanced Research in Geo Sciences and Remote Sensing' },
  { no: 25, periodicity: 'Monthly', branch: 'Civil', title: 'GIS India' },
  { no: 26, periodicity: 'Quarterly', branch: 'CSE', title: 'Artificial Intelligence' },
  { no: 27, periodicity: 'Quarterly', branch: 'CSE', title: 'Computer Networks and Communications' },
  { no: 28, periodicity: 'Quarterly', branch: 'CSE', title: 'Information Security' },
  { no: 29, periodicity: 'Quarterly', branch: 'CSE', title: 'Multimedia' },
  { no: 30, periodicity: 'Quarterly', branch: 'CSE', title: 'Software Engineering' },
  { no: 31, periodicity: 'Quarterly', branch: 'CSE', title: 'Distributed computing' },
  { no: 32, periodicity: 'Quarterly', branch: 'CSE', title: 'Information Technology' },
  { no: 33, periodicity: 'Bi-annual', branch: 'CSE', title: 'Indian Journal of software and information engineering' },
  { no: 34, periodicity: 'Bi-annual', branch: 'CSE', title: 'International Journal of Computer applications in Technology' },
  { no: 35, periodicity: 'Bi-annual', branch: 'CSE', title: 'International Journal of Computing' },
  { no: 36, periodicity: 'Bi-annual', branch: 'CSE', title: 'International Journal of Information technology and Decision Making' },
  { no: 37, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Research and Applications of Web Development and Design' },
  { no: 38, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Recent Innovations in Wireless Network Security' },
  { no: 39, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Journal of Advances in Computational Intelligence Theory' },
  { no: 40, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Recent Trends in Androids and IOS Applications' },
  { no: 41, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Recent Trends in Cloud Computing and Web Engineering' },
  { no: 42, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Advancement of Computer Technology and its Applications' },
  { no: 43, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Advancement in Image Processing and Pattern Recognition' },
  { no: 44, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Recent Trends in Information Technology and its Application' },
  { no: 45, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Journal of Advancement in Parallel Computing' },
  { no: 46, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Research and Reviews: Advancement in Robotics' },
  { no: 47, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Recent Trends in Computer Graphics and Multimedia Technology' },
  { no: 48, periodicity: 'Tri-annual', branch: 'Cyber Security', title: 'Journal of Network Security and Data Mining' },
  { no: 49, periodicity: 'Quarterly', branch: 'ECE', title: 'Advance Research in Power Electronics and Devices' },
  { no: 50, periodicity: 'Quarterly', branch: 'ECE', title: 'Research&Review:Electronics and Communication Engineering' },
  { no: 51, periodicity: 'Quarterly', branch: 'ECE', title: 'Journal of Advancement in Electronics Signal Processing' },
  { no: 52, periodicity: 'Quarterly', branch: 'ECE', title: 'Journal of Microprocessor and Microcontroller Research' },
  { no: 53, periodicity: 'Quarterly', branch: 'ECE', title: 'Advance Research in Analog and Digital Communications' },
  { no: 54, periodicity: 'Biannual', branch: 'ECE', title: 'Journal of Advanced Research in Embedded systems' },
  { no: 55, periodicity: 'Biannual', branch: 'ECE', title: 'Journal of Advanced Research in Power Electronics and Power systems' },
  { no: 56, periodicity: 'Biannual', branch: 'ECE', title: 'Journal of Advanced Research in Micro Electronics and VLSI' },
  { no: 57, periodicity: 'Biannual', branch: 'ECE', title: 'Journal of Advanced Research in Networking and communication engineering' },
  { no: 58, periodicity: 'Biannual', branch: 'ECE', title: 'Journal of Advanced Research in Wireless, Mobile and Telecommunication' },
  { no: 59, periodicity: 'Tri-annual', branch: 'ECE', title: 'Advance Research in Communication Engineering and its Innovations' },
  { no: 60, periodicity: 'Tri-annual', branch: 'ECE', title: 'Journal of Electronics and Telecommunication system Engineering' },
  { no: 61, periodicity: 'Bi-annual', branch: 'ECE', title: 'Journal of Advanced Research in Signal Processing and Applications' },
  { no: 62, periodicity: 'Bi-annual', branch: 'ECE', title: 'Journal of Advanced Research in Image Processing and applications' },
  { no: 63, periodicity: 'Tri-annual', branch: 'EEE', title: 'Journal of Electrical and Power System Engineering' },
  { no: 64, periodicity: 'Tri-annual', branch: 'EEE', title: 'Journal of Digital Integrated Circuits in Electrical Devices' },
  { no: 65, periodicity: 'Biannual', branch: 'EEE', title: 'Journal of Advanced Research in Electronics engineering and technology' },
  { no: 66, periodicity: 'Biannual', branch: 'EEE', title: 'Journal of Advanced Research in Electrical Engineering and Technology' },
  { no: 67, periodicity: 'Quarterly', branch: 'EEE', title: 'Electrical Engineering' },
  { no: 68, periodicity: 'Quarterly', branch: 'EEE', title: 'Energy and Power' },
  { no: 69, periodicity: 'Quarterly', branch: 'EEE', title: 'Power Electronics' },
  { no: 70, periodicity: 'Quarterly', branch: 'EEE', title: 'Electrical Machines' },
  { no: 71, periodicity: 'Quarterly', branch: 'EEE', title: 'High Voltage Engineering' },
  { no: 72, periodicity: 'Tri-annual', branch: 'EEE', title: 'Journal of Control System and its Recent Developments' },
  { no: 73, periodicity: 'Tri-annual', branch: 'EEE', title: 'Journal of Research and Advancement in Electrical Engineering' },
  { no: 74, periodicity: 'Tri-annual', branch: 'EEE', title: 'Journal of Emerging Trends in Electrical Engineering' },
  { no: 75, periodicity: 'Biannual', branch: 'HBS', title: 'Journal of Advanced research in applied Physis & applications' },
  { no: 76, periodicity: 'Biannual', branch: 'HBS', title: 'Journal of Advanced research in applied chemistry and chemical engineering' },
  { no: 77, periodicity: 'Biannual', branch: 'HBS', title: 'Journal of Advanced research in Applied mathematics and statistics' },
  { no: 78, periodicity: 'Monthly', branch: 'HBS', title: 'Resonance' },
  { no: 79, periodicity: 'Bimonthly', branch: 'HBS', title: 'International Journal of Statistics and Applied Mathematics' },
  { no: 80, periodicity: 'Tri-annual', branch: 'HBS', title: 'Journal of Applied Mathematics and Statistical Analysis' },
  { no: 81, periodicity: 'Tri-annual', branch: 'HBS', title: 'Research and Reviews: Journal of Environmental Sciences' },
  { no: 82, periodicity: 'Tri-annual', branch: 'HBS', title: 'Journal of Statistics and Mathematical Engineering' },
  { no: 83, periodicity: 'Tri-annual', branch: 'IT', title: 'Journal of Network Security Computer Networks' },
  { no: 84, periodicity: 'Tri-annual', branch: 'IT', title: 'Journal of Image Processing and Artificial Intelligence' },
  { no: 85, periodicity: 'Tri-annual', branch: 'IT', title: 'Journal of Web Development and Web Designing' },
  { no: 86, periodicity: 'Tri-annual', branch: 'IT', title: 'Journal of Android and IOS Applications and Testing' },
  { no: 87, periodicity: 'Half yearly', branch: 'IT', title: 'International Journal of Communication and Information Technology' },
  { no: 88, periodicity: 'Half yearly', branch: 'IT', title: 'International Journal of Cloud Computing and Database Management' },
  { no: 89, periodicity: 'Half yearly', branch: 'IT', title: 'International Journal of Engineering in Computer Science' },
  { no: 90, periodicity: 'Half yearly', branch: 'IT', title: 'International Journal of Circuit, Computing and Networking' },
  { no: 91, periodicity: 'Biannual', branch: 'MBA', title: 'Journal of Advanced research in Operational and Marketing Management' },
  { no: 92, periodicity: 'Biannual', branch: 'MBA', title: 'Journal of Advanced research in Quality control and Management' },
  { no: 93, periodicity: 'Monthly', branch: 'MBA', title: 'Indian Journal of Marketing' },
  { no: 94, periodicity: 'Tri-annual', branch: 'MBA', title: 'Journal of Advanced research in Accounting and Finance Management' },
  { no: 95, periodicity: 'Quarterly', branch: 'MBA', title: 'Journal of Advanced research in Enterpreneurship, Innovation & SMES Management' },
  { no: 96, periodicity: 'Bi-annual', branch: 'MBA', title: 'Journal of Advanced Research in HR and Organizational Management' },
  { no: 97, periodicity: 'Bi-annual', branch: 'MBA', title: 'Journal of Advanced Research in Economics and Business Management' },
  { no: 98, periodicity: 'Half yearly', branch: 'ME', title: 'International Journal of materials sciences' },
  { no: 99, periodicity: 'Half yearly', branch: 'ME', title: 'International Journal of Mechanics and Solids' },
  { no: 100, periodicity: 'Half yearly', branch: 'ME', title: 'International Journal of Theoretical and applied Mechanics' },
  { no: 101, periodicity: 'Half yearly', branch: 'ME', title: 'International Journal of Mechanics and Thermodynamics' },
  { no: 102, periodicity: 'Half yearly', branch: 'ME', title: 'International Journal of Mechanical Engineering and Research' },
  { no: 103, periodicity: 'Tri-annual', branch: 'ME', title: 'Journal of Advancements in Material Engineering' },
  { no: 104, periodicity: 'Tri-annual', branch: 'ME', title: 'Journal of Recent Activities in Production' },
  { no: 105, periodicity: 'Tri-annual', branch: 'ME', title: 'Journal of Advancement in Machines' },
  { no: 106, periodicity: 'Tri-annual', branch: 'ME', title: 'Journal of Recent Trends in Mechanics' },
  { no: 107, periodicity: 'Tri-annual', branch: 'ME', title: 'Journal of Automation and Automobile Engineering' },
  { no: 108, periodicity: 'Tri-annual', branch: 'ME', title: 'Journal of Thermal Energy Systems' },
  { no: 109, periodicity: 'Biannual', branch: 'ME', title: 'Journal of Advanced Research in Applied Mechanics & Computational Fluid Dynamics' },
  { no: 110, periodicity: 'Biannual', branch: 'ME', title: 'Journal of Advanced Research in Manufacturing, Material Science and Mutallurgical engineering' },
  { no: 111, periodicity: 'Biannual', branch: 'ME', title: 'Journal of Advanced Research in Mechanical Engineering and Technology' },
  { no: 112, periodicity: 'Biannual', branch: 'ME', title: 'Journal of Advanced Research in Intelligence systems and robotics' },
  { no: 113, periodicity: 'Bi-annual', branch: 'ME', title: 'Journal of Advanced Research in Automotive Technology and Transportation System' },
];

const magazinesList: PeriodicalRow[] = [
  { no: 1, periodicity: 'Bi-Monthly', branch: 'Civil', title: 'Geospatial World' },
  { no: 2, periodicity: 'Monthly', branch: 'CSE', title: 'Opensource for you' },
  { no: 3, periodicity: 'Monthly', branch: 'ECE', title: 'Electronics for You' },
  { no: 4, periodicity: 'Monthly', branch: 'ECE', title: 'Digit' },
  { no: 5, periodicity: 'Monthly', branch: 'ECE', title: 'Voice and Data' },
  { no: 6, periodicity: 'Bi-Monthly', branch: 'ECE', title: 'Embedded for You' },
  { no: 7, periodicity: 'Monthly', branch: 'EEE', title: 'Electrical India' },
  { no: 8, periodicity: 'Quarterly', branch: 'EEE', title: 'Industrial Safety Chronicle' },
  { no: 9, periodicity: 'Monthly', branch: 'EEE', title: 'Power Line' },
  { no: 10, periodicity: 'Monthly', branch: 'EEE', title: 'Renewable Watch' },
  { no: 11, periodicity: 'Weekly', branch: 'HBS', title: 'The Week' },
  { no: 12, periodicity: 'Monthly', branch: 'HBS', title: 'Careers 360' },
  { no: 13, periodicity: 'Monthly', branch: 'HBS', title: 'Down To Earth' },
  { no: 14, periodicity: 'Monthly', branch: 'HBS', title: 'Pratiyogita Darpan' },
  { no: 15, periodicity: 'Weekly', branch: 'HBS', title: 'Time' },
  { no: 16, periodicity: 'Tri-Monthly', branch: 'HBS', title: 'Outlook' },
  { no: 17, periodicity: 'Fortnightly', branch: 'HBS', title: 'CSR (English)' },
  { no: 18, periodicity: 'Weekly', branch: 'HBS', title: 'India Today (Eng.)' },
  { no: 19, periodicity: 'Monthly', branch: 'HBS', title: 'Reader Digest' },
  { no: 20, periodicity: 'Monthly', branch: 'HBS', title: 'Mathematics today' },
  { no: 21, periodicity: 'Fortnightly', branch: 'HBS', title: 'Champak' },
  { no: 22, periodicity: 'Monthly', branch: 'HBS', title: 'Physics for You' },
  { no: 23, periodicity: 'Monthly', branch: 'HBS', title: "Woman's Era" },
  { no: 24, periodicity: 'Monthly', branch: 'HBS', title: 'Kurukshetra' },
  { no: 25, periodicity: 'Monthly', branch: 'HBS', title: 'Yojana' },
  { no: 26, periodicity: 'Weekly', branch: 'HBS', title: 'University News' },
  { no: 27, periodicity: 'Monthly', branch: 'HBS', title: 'Current Affairs Today' },
  { no: 28, periodicity: 'Monthly', branch: 'HBS', title: 'Civil Services Times' },
  { no: 29, periodicity: 'Monthly', branch: 'HBS', title: 'Civil Services Chronicle' },
  { no: 30, periodicity: 'Monthly', branch: 'IT', title: 'PC Quest' },
  { no: 31, periodicity: 'Monthly', branch: 'IT', title: 'Dataquest' },
  { no: 32, periodicity: 'Monthly', branch: 'LIBRARY', title: 'Granthalaya Sarsvam' },
  { no: 33, periodicity: 'Fortnightly', branch: 'MBA', title: 'Business today' },
  { no: 34, periodicity: 'Weekly', branch: 'MBA', title: 'The Economist' },
  { no: 35, periodicity: 'Bi-Monthly', branch: 'MBA', title: 'Harvard Business Review' },
  { no: 36, periodicity: 'Fortnightly', branch: 'MBA', title: 'Forbes India' },
  { no: 37, periodicity: 'Monthly', branch: 'MBA', title: 'Coordinates' },
  { no: 38, periodicity: 'Monthly', branch: 'ME', title: 'Overdrive' },
  { no: 39, periodicity: 'Monthly', branch: 'ME', title: 'Car India' },
  { no: 40, periodicity: 'Monthly', branch: 'ME', title: 'Motoring World' },
  { no: 41, periodicity: 'Monthly', branch: 'ME', title: 'Autocar India' },
  { no: 42, periodicity: 'Fortnightly', branch: 'ME', title: 'Autocar Professional' },
  { no: 43, periodicity: 'Monthly', branch: 'ME', title: 'Stuff India' },
  { no: 44, periodicity: 'Fortnightly', branch: 'PEd', title: 'Sport Star' },
];

function PeriodicalsTable({ rows }: { rows: PeriodicalRow[] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 'var(--space-10)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-primary)' }}>
            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary)', fontWeight: 900 }}>S.No.</th>
            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary)', fontWeight: 900 }}>Periodicity</th>
            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary)', fontWeight: 900 }}>Branch</th>
            <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary)', fontWeight: 900 }}>Title</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.no} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'transparent' }}>
              <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-light)', whiteSpace: 'nowrap' }}>{row.no}</td>
              <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{row.periodicity}</td>
              <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{row.branch}</td>
              <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', fontWeight: 600 }}>{row.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TabId = 'about' | 'resources' | 'digital' | 'databases' | 'journals';

const TABS: { id: TabId; label: string }[] = [
  { id: 'about', label: 'About Library' },
  { id: 'resources', label: 'Library Resource List' },
  { id: 'digital', label: 'Digital Library' },
  { id: 'databases', label: 'e-Databases' },
  { id: 'journals', label: 'Journals' },
];

const hashToTab: Record<string, TabId> = {
  '#about': 'about',
  '#resources': 'resources',
  '#digital': 'digital',
  '#databases': 'databases',
  '#journals': 'journals',
};

export default function CentralLibrary() {
  const facility = findCampusFacilityBySlug('central-library');
  const [activeTab, setActiveTab] = useState<TabId>('about');
  const [activeEDatabaseSubTab, setActiveEDatabaseSubTab] = useState<EDatabaseSubTabId>('ebooks');
  const location = useLocation();

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER,
    alt: `Central Library — Photo ${i + 1}`,
    caption: '',
  }));
  const photos = useSitePhotos('campus', 'central-library', defaultPhotos);

  const liveDigitalLibrary = useContentBlocks('central-library', 'digitalLibrary');
  const digitalLibrary = liveDigitalLibrary.length > 0 ? liveDigitalLibrary : defaultDigitalLibrary;

  const liveEBooks = useContentBlocks('central-library', 'eDatabasesEbooks');
  const eBooks = liveEBooks.length > 0 ? liveEBooks : defaultEBooks;
  const liveOpenAccessJournals = useContentBlocks('central-library', 'eDatabasesOpenAccessJournals');
  const openAccessJournals = liveOpenAccessJournals.length > 0 ? liveOpenAccessJournals : defaultOpenAccessJournals;
  const liveVideoOnDemand = useContentBlocks('central-library', 'eDatabasesVideoOnDemand');
  const videoOnDemand = liveVideoOnDemand.length > 0 ? liveVideoOnDemand : defaultVideoOnDemand;
  const liveOpenCourseware = useContentBlocks('central-library', 'eDatabasesOpenCourseware');
  const openCourseware = liveOpenCourseware.length > 0 ? liveOpenCourseware : defaultOpenCourseware;

  // Electronic References renders as grouped category boxes (below), not a
  // flat list, so it's not part of this shared record.
  const eDatabaseSubTabContent: Record<Exclude<EDatabaseSubTabId, 'electronicReferences'>, ContentBlockDoc[]> = {
    ebooks: eBooks,
    openAccessJournals,
    videoOnDemand,
    openCourseware,
  };

  useEffect(() => {
    document.title = 'Central Library | Campus Life | VWU';
  }, []);

  useEffect(() => {
    const tab = hashToTab[location.hash];
    if (tab) setActiveTab(tab);
  }, [location.hash]);

  if (!facility) return null;

  return (
    <main className="page-wrapper">
      <PageHero
        page="campus-central-library"
        defaultImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80"
        defaultTitle={facility.title}
        defaultSubtitle={facility.desc}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: facility.title },
        ]}
      />

      <section className="section bg-white">
        <div className="container">
          <div className="section-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`section-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="detail-grid">
          <div>

          {/* About Library */}
          {activeTab === 'about' && (
            <div>
              <span className="section-label">Campus Life</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {facility.title}</h2>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, maxWidth: 760, marginBottom: 'var(--space-5)' }}>
                The Library of Shri Vishnu Engineering College for Women (Autonomous) was built to keep up international standards. The air-conditioned library has three floors with an area of 1,083 Sq.m. and is well-protected with a security system. Specialised collections of books, journals, and non-book materials are available in Engineering & Technology, Basic Sciences, and Management Sciences.
              </p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, maxWidth: 760, marginBottom: 'var(--space-6)' }}>
                The Library contributes to the fulfilment of the Institution's mission by selecting, acquiring, organising, maintaining, and making accessible a collection of printed and non-printed, primary and secondary materials that support the educational, research, and public service programmes of both students and faculty:
              </p>
              <ul style={{ maxWidth: 760, marginBottom: 'var(--space-8)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {libraryResponsibilities.map((r) => (
                  <li key={r} style={{ color: 'var(--color-text-light)', lineHeight: 1.7 }}>{r}</li>
                ))}
              </ul>
              <div style={{ background: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', maxWidth: 500 }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 'var(--text-sm)' }}>Library Timings</h3>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Monday – Saturday</p>
                <ul style={{ paddingLeft: '1.1rem', marginBottom: 'var(--space-4)', color: 'var(--color-text-light)', fontSize: 'var(--text-sm)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <li>Working Hours — 8:00 A.M. to 12:00 Midnight</li>
                  <li>Transactions — 8:00 A.M. to 6:00 P.M.</li>
                  <li>Digital Library — 8:00 A.M. to 12:00 Midnight</li>
                </ul>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Sunday & Other Holidays</p>
                <ul style={{ paddingLeft: '1.1rem', color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                  <li>Working Hours — 10:00 A.M. to 10:00 P.M.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Library Resource List */}
          {activeTab === 'resources' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Library Resource List</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Specialized collections are available in Engineering & Technology, Basic Sciences, and Management courses. The SVECW Library comprises the following:
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {libraryResourceCategories.map((cat) => (
                  <div key={cat.title} style={{ background: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 'var(--text-sm)' }}>{cat.title}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {cat.items.map((item) => (
                        <li key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.5 }}>
                          <span>{item.label}</span>
                          <strong style={{ color: 'var(--color-accent)', flexShrink: 0 }}>{item.value}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Digital Library */}
          {activeTab === 'digital' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Digital Library</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Full Text Database Subscription
              </p>
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {digitalLibrary.map((p) => (
                  <div key={p.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <Globe size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{p.title}</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>{p.desc}</p>
                      <a href={p.slug || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 'var(--text-xs)', padding: '0.35rem 0.9rem' }}>Visit Platform</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* e-Databases */}
          {activeTab === 'databases' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>e-Databases</h2>

              <div className="section-subtabs">
                {E_DATABASE_SUBTABS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveEDatabaseSubTab(sub.id)}
                    className={`section-subtab-btn${activeEDatabaseSubTab === sub.id ? ' active' : ''}`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {activeEDatabaseSubTab === 'ebooks' ? (
                <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-6)' }}>
                  Various websites have been searched. Suitable websites for e-books identified are listed below.
                </p>
              ) : null}

              {activeEDatabaseSubTab === 'openCourseware' ? (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-3)' }}>{openCoursewareIntro}</p>
                  <ul style={{ margin: 0, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {openCoursewarePoints.map((point) => (
                      <li key={point} style={{ color: 'var(--color-text-light)' }}>{point}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {activeEDatabaseSubTab === 'electronicReferences' ? (
                <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                  {electronicReferenceCategories.map((cat) => (
                    <div key={cat.title} style={{ background: 'var(--color-off-white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 'var(--text-sm)' }}>{cat.title}</h3>
                      <ul style={{
                        listStyle: 'none', padding: 0, margin: 0,
                        columnCount: cat.items.length > 6 ? 2 : 1,
                        columnGap: 'var(--space-6)',
                      }}>
                        {cat.items.map((item, i) => (
                          <li key={`${item.name}-${i}`} style={{ breakInside: 'avoid', marginBottom: 'var(--space-2)' }}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : eDatabaseSubTabContent[activeEDatabaseSubTab].length > 0 ? (
                <ul style={{
                  listStyle: 'none', margin: 0, padding: 0,
                  columnCount: eDatabaseSubTabContent[activeEDatabaseSubTab].length > 8 ? 2 : 1,
                  columnGap: 'var(--space-8)',
                }}>
                  {eDatabaseSubTabContent[activeEDatabaseSubTab].map((item) => (
                    <li key={item.id} style={{ breakInside: 'avoid', marginBottom: 'var(--space-4)' }}>
                      {item.slug ? (
                        <a href={item.slug} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                          {item.title}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.title}</span>
                      )}
                      {item.desc && (
                        <p style={{ margin: '0.2rem 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.5 }}>{item.desc}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                  No resources have been added for this section yet — check back soon.
                </p>
              )}
            </div>
          )}

          {/* Journals */}
          {activeTab === 'journals' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Journals</h2>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
                Print and electronic journal and magazine subscriptions held by the Central Library, listed by department.
              </p>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>List of Journals</h3>
              <PeriodicalsTable rows={journalsList} />
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>List of Magazines</h3>
              <PeriodicalsTable rows={magazinesList} />
            </div>
          )}

          </div>

          <div className="detail-sidebar">
            <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)' }}>
              <CampusFacilitiesNav activeSlug={facility.slug} />
            </div>
          </div>

          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={photos}
              label={facility.title}
              title={`${facility.title} in Pictures`}
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
            Explore More of Campus Life
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/campus" className="btn btn-accent">Back to Campus Life</Link>
            <Link to="/student-life" className="btn btn-secondary">Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
