import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Trophy, BarChart3, PlayCircle, MapPin } from 'lucide-react';
import { useCollection, useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { resolveContentIcon } from '../../lib/contentIcons';
import { parseStructuredTable } from '../../lib/structuredTable';
import type { PlacementItemDoc } from '../Admin/sections/PlacementItemsAdmin';
import type { TpoTeamBioDoc } from '../Admin/sections/TpoTeamInfoAdmin';
import PlacementYearAccordion, { BranchOffersBarChart } from './PlacementYearAccordion';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import { successStories } from './successStories.data';
import { industryLiaisonOffices } from './industryLiaisonOffices.data';
import { employabilitySkillTabs } from './employabilitySkills.data';
import { higherEducationSections } from './higherEducation.data';
import { usePlacementYears } from './usePlacementYears';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../detail-layout.css';

// Our Recruiters shows the same companies already captured in "Placements,
// Year by Year" (placementStats.data.ts / the placementYears collection),
// just re-labeled from a batch's 4-year cohort span to the single
// recruitment-drive year it corresponds to (a batch ending in year Y
// recruits during the "(Y-1)-Y" drive) — e.g. batch '2018–2022' drove
// recruitment in '2021 - 22'. No separate data source, just a relabeling.
const RECRUITER_DRIVE_YEARS: { label: string; batch: string }[] = [
  { label: '2021 - 22', batch: '2018–2022' },
  { label: '2020 - 21', batch: '2017–2021' },
  { label: '2019 - 20', batch: '2016–2020' },
  { label: '2018 - 19', batch: '2015–2019' },
  { label: '2017 - 18', batch: '2014–2018' },
  { label: '2016 - 17', batch: '2013–2017' },
  { label: '2015 - 16', batch: '2012–2016' },
  { label: '2014 - 15', batch: '2011–2015' },
  { label: '2013 - 14', batch: '2010–2014' },
  { label: '2012 - 13', batch: '2009–2013' },
  { label: '2011 - 12', batch: '2008–2012' },
  { label: '2010 - 11', batch: '2007–2011' },
  { label: '2009 - 10', batch: '2006–2010' },
  { label: '2008 - 09', batch: '2005–2009' },
  { label: '2007 - 08', batch: '2004–2008' },
];

type BodyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

// Overrides the "About {title}" heading only — hero/breadcrumb still show
// the CMS title as-is, so a slug here can read differently in the body
// heading without renaming the page everywhere.
const ABOUT_TITLE_OVERRIDES: Record<string, string> = {
  'placement-details': 'Placement Cell',
};

const BODY_OVERRIDES: Record<string, string> = {
  'career-guidance-cell': `Career guidance is not a new concept and its roots can be traced back to ancient times. However, career guidance in its present form, owes its origin to US and other developed countries. Career guidance encompasses information, guidance and counseling services to assist in making educational training and occupational choice.

Career guidance and counseling programmes in SVECW aim to provide assistance and advice to students to make them more powerful and better informed so that they can become architects in building their own future. It helps the students realize their strengths and weaknesses by instilling self awareness, decision making skills, planning skills, personality development etc.

A separate cell, with a well-equipped air-conditioned conference training room and separate well-furnished rooms for mock interviews and counseling, has been set up and permanent training staff are appointed to work with a full-time Dean. Encouraging students to sharpen their skills and make them ‘Industry Ready.’

**Objectives:**

- To help students share knowledge about themselves by identifying skills, and interests.
- To provide information about further course prerequisites, financial aid, academic planning, entrance examinations etc.
- To promote career guidance & counseling through lectures by senior corporate executives and visiting professors.
- To organize seminars on interview skills, personality development, communication skills, leadership skills, resume writing, analytical skills, quantitative ability, verbal and reasoning skills essential to all competitive exams.

**GRE / TOEFL:**

Special training is provided to students who are aspiring for higher education abroad. It focuses on Verbal, Quantitative and Reasoning skills along with Analytical Writing Assessment. A good number of students from different branches utilized the services and progressing in different universities abroad.

**GATE:**

Higher Educational pursuits are one of the major goals of most of the students of SVECW. Helping them in realizing their goals the institution is offering regularly GATE training classes. Though the record of GATE ranks in SVECW is less initially there is gradual ascendancy.

**IES, IFS & IAS:**

With the academic commitment of the student fraternity SVECW always brings forward any initiative that widens the scope of the career of the students. Eventually a special training for the students who are interested in taking up a career at IES, IAS, IAF, etc. has been started recently and completed the required formative training.`,
  'campus-recruitment-training': `**CRT: In-house Training**

We have a training centre with experienced and highly talented faculty drawn from various departments of Engineering, English, Mathematics and Management to extend In-house training to the students.

This training is strengthened further by the services of highly reputed professional training institutions such as Elephos, Productivity Reach, Gate Forum etc. With all their practical exposure in the area of aptitude, reasoning, verbal, group discussions, interviews, C, C++ and Java, they are of much help for students placements.

We are sure that our training will certainly boost up the confidence levels of the students, enhance their conceptual knowledge, harness their skills and make them more employable.

**CDP: Career Development Program**

The college offers Career Development Program for all III B.Tech students which comprises extensively the topics relating to Aptitude, Reasoning, English, C language, DBMS and all core subjects.

[More Details …](/downloads/cdp-timetable.pdf)

**C-Program**

For all the II B.Tech students of Circuit branches additional training in C-program was being offered by the college on continuous basis.

[More Details …](/downloads/c-programming-timetable.pdf)`,
  'placement-details': `The Training & Placement Cell of Vishnu Women's University (VWU) acts as a bridge between the University and industry. It supports students in achieving their career goals through placement, internship, training, and industry interaction programs.

The Cell focuses on improving employability, industry readiness, and overall professional development of students.

**Key Objectives:** The Cell provides placement opportunities for eligible students across all programs, builds and strengthens relationships with leading companies and industry partners, conducts regular training programs, workshops, aptitude tests, and placement preparation activities, facilitates internships and industry exposure for students, and maintains accurate and transparent placement and internship records.

**Scope of Activities:** The Cell organizes on-campus and off-campus recruitment drives, coordinates internships and industry interaction programs, conducts aptitude, technical, communication, soft-skills, and career guidance programs, organizes mock interviews, pre-placement talks, and placement preparation activities, and maintains and publishes placement statistics, reports, and recruitment trends.

**Stakeholders:** Students (UG and PG across all disciplines), Corporate Recruiters and Industry Partners, Parents and Guardians, Faculty and University Leadership, Alumni, and Regulatory and Accreditation Bodies.`,
  'gsac': `Students who aspire to travel abroad for higher studies usually approach consulting firms and spend a lot of their time and money in understanding the destinations, universities and courses abroad. In an attempt to support such students of SVES institutions, Graduate Study Abroad Center (GSAC) is formed. It guides and gives necessary support to the students and their parents to find the right destination, university and course to fulfil their dream of studying abroad.

GSAC has been initiated to make the students self-reliant, after observing a segment of students who need that hand holding in terms of GRE/TOEFL/IELTS training and application processing. It also supports the students who receive their admit cards and Visa by connecting them with the alumni there so that they would have the confidence and someone whom they know before reaching.

Centralized GSAC Cell operates from SVES Head Office having it's SPOCs at each of SVES Institutions.

**Services Offered:**

- **Counselling:** GSAC spoc at the respective colleges will guide the students with different courses that they could pursue in different locations depending on the students profile.
- **Student Loans:** GSAC helps students to get education loans through its associated bankers.
- **Scholarships:** GSAC would help the students with details on the scholarship availability and also support them in applying for the same.
- **Pre Departure Grooming Programs:** GSAC conducts orientation programs for the students travelling to different countries. The programs could be on culture and people there, money management abroad, safety and security measures, talking to women there etc.

**Destinations:**

USA, Canada, UK, China, Germany, Australia, Spain

**Contact Details:**

Mrs. P. Prasanthi, Asst. Professor — Email: [jprasanthi@svecw.edu.in](mailto:jprasanthi@svecw.edu.in) — Phone: [9440111470](tel:9440111470)`,
};

function parseBodyContent(text: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of (text || '').split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

const LINK_PATTERN = /^\[([^\]]+)\]\(([^)]+)\)$/;
// Links to a document file (as opposed to another page) download straight
// to the visitor's device instead of opening in a new tab.
const DOWNLOADABLE_FILE_PATTERN = /\.(pdf|docx?|xlsx?|pptx?|zip)$/i;

function renderInlineText(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(LINK_PATTERN);
    if (linkMatch) {
      const href = linkMatch[2];
      const isDownload = DOWNLOADABLE_FILE_PATTERN.test(href);
      return (
        <a
          key={index}
          href={href}
          {...(isDownload ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
          style={{ color: 'var(--color-primary)', fontWeight: 600 }}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

const PARTNER_DOMAINS: Record<string, string> = {
  'Amazon': 'amazon.com', 'Adobe': 'adobe.com', 'Microsoft': 'microsoft.com',
  'Google': 'google.com', 'Flipkart': 'flipkart.com', 'PayPal': 'paypal.com',
  'Palo Alto Networks': 'www.paloaltonetworks.com', 'VISA': 'visa.com', 'D.E. Shaw': 'deshaw.com',
  'Walmart': 'walmart.com', 'NXP': 'nxp.com', 'Expedia': 'expedia.com',
  'Myntra': 'myntra.com', 'Optum': 'www.optum.com', 'IBM': 'ibm.com',
  'Providence': 'providence.org', 'Publicis Sapient': 'publicissapient.com', 'State Street': 'statestreet.com',
  'Athena Health': 'athenahealth.com', 'TCS': 'www.tcs.com', 'Infosys': 'infosys.com',
  'Capgemini': 'capgemini.com', 'Accenture': 'accenture.com', 'HCL': 'www.hcltech.com',
  'Cognizant': 'cognizant.com', 'Mahindra & Mahindra': 'mahindra.com', 'Hyundai Motors': 'hyundai.com',
  'TVS Motors': 'tvsmotor.com', 'Hero MotoCorp': 'heromotocorp.com', 'Renault Nissan': 'renault.com',
  'Daimler Truck': 'daimlertruck.com', 'Caterpillar': 'caterpillar.com', 'Robert Bosch': 'bosch.com',
  'DBS Bank': 'dbs.com', 'EPAM': 'epam.com', 'Zenoti': 'zenoti.com',
  'Persistent Systems': 'persistent.com', 'Intuit': 'intuit.com', 'OpenText': 'opentext.com',
  'F5 Networks': 'f5.com', 'Cloudera': 'cloudera.com', 'Verizon': 'verizon.com',
};

// Direct logo images for companies whose own site favicon isn't their real
// logo (e.g. IBM currently serves a bee icon as ibm.com's favicon — visible
// at ibm.com/favicon.ico — so the domain-favicon lookup below can never show
// their actual logo) — checked before falling back to that lookup.
const PARTNER_LOGO_OVERRIDES: Record<string, string> = {
  'IBM': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/250px-IBM_logo.svg.png',
};

function PartnerLogo({ name }: { name: string }) {
  const domain = PARTNER_DOMAINS[name];
  const logoOverride = PARTNER_LOGO_OVERRIDES[name];
  const [failed, setFailed] = useState(!domain && !logoOverride);

  return (
    <div className="partner-logo-card">
      {failed ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 28, width: 28, flexShrink: 0, fontSize: 'var(--text-xs)', fontWeight: 700, background: 'var(--color-off-white)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
          {name.charAt(0)}
        </span>
      ) : (
        <img
          src={logoOverride || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
          alt={name}
          className="partner-logo-img"
          onError={() => setFailed(true)}
        />
      )}
      <span className="partner-logo-name">{name}</span>
    </div>
  );
}

// Flat, deduplicated recruiter grid for the Our Recruiters page — every
// company across every drive year (RECRUITER_DRIVE_YEARS), collapsed into
// one logo grid instead of a year-by-year accordion.
function AllRecruiters() {
  const placementYearData = usePlacementYears();
  const companies = [...new Set(
    RECRUITER_DRIVE_YEARS.flatMap(({ batch }) => {
      const year = placementYearData.find((y) => y.batch === batch);
      return year ? year.rows.map((r) => r.company) : [];
    })
  )];

  if (companies.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
        Recruiter data will appear here once it's added from the admin.
      </p>
    );
  }

  return (
    <div className="partner-logo-grid">
      {companies.map((company) => (
        <PartnerLogo key={company} name={company} />
      ))}
    </div>
  );
}

// Essential / Professional Skills tabs for the Employability Skills page,
// each tab a grid of skill categories with a checklist of behaviours —
// styled to match the site (dark green/gold) rather than the source
// screenshot's purple/tan tab bar. Only "Essential Employability Skills"
// has content so far; other tabs fall back to a coming-soon note.
function EmployabilitySkillsGrid() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = employabilitySkillTabs[activeTab];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {['Essential Employability Skills', 'Professional Skills'].map((label, i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={label}
              onClick={() => setActiveTab(i)}
              style={{
                flex: '1 1 220px',
                padding: 'var(--space-3) var(--space-5)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab ? (
        <>
          {tab.intro && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
              {tab.intro}
            </p>
          )}
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
            {tab.categories.map((category) => (
              <div key={category.title} style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--color-off-white)', padding: 'var(--space-3) var(--space-5)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>
                  {category.title}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 'var(--space-4) var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {category.items.map((point) => (
                    <li key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>Content for this tab is coming soon.</p>
      )}
    </div>
  );
}

// University list accordion for the Higher Education page — an outer
// accordion per destination group (USA; UK/Australia/Canada), the latter
// with country tab pills inside since it covers three countries at once.
// Styled to match the site rather than the source's purple/tan look.
function HigherEducationAccordion() {
  const [activeSection, setActiveSection] = useState(higherEducationSections[higherEducationSections.length - 1]?.title ?? '');
  const [activeTabBySection, setActiveTabBySection] = useState<Record<string, number>>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {higherEducationSections.map((section) => {
        const isOpen = activeSection === section.title;
        const activeTabIndex = activeTabBySection[section.title] ?? 0;
        const tab = section.tabs?.[activeTabIndex];
        const universities = section.tabs ? (tab?.universities ?? []) : (section.universities ?? []);
        const rows: string[][] = [];
        for (let i = 0; i < universities.length; i += 3) rows.push(universities.slice(i, i + 3));

        return (
          <div key={section.title}>
            <button
              onClick={() => setActiveSection(isOpen ? '' : section.title)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-3) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
                gap: 'var(--space-4)',
                transition: 'background var(--transition-base)',
              }}
            >
              <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)', transition: 'color var(--transition-base)' }}>
                {section.title}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1, flexShrink: 0, transition: 'color var(--transition-base)' }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>

            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
                {section.tabs && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                    {section.tabs.map((t, i) => {
                      const tabActive = activeTabIndex === i;
                      return (
                        <button
                          key={t.label}
                          onClick={() => setActiveTabBySection((p) => ({ ...p, [section.title]: i }))}
                          style={{
                            flex: '1 1 160px',
                            padding: 'var(--space-3) var(--space-5)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            background: tabActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                            color: tabActive ? 'var(--color-white)' : 'var(--color-primary)',
                            fontWeight: 700,
                            fontSize: 'var(--text-sm)',
                            cursor: 'pointer',
                          }}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {rows.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                      <tbody>
                        {rows.map((row, ri) => (
                          <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-off-white)' : 'transparent' }}>
                            {row.map((name, ci) => (
                              <td key={ci} style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{name}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                    {section.tabs ? `The ${tab?.label} list will appear here once it's added from the admin.` : "This list will appear here once it's added from the admin."}
                  </p>
                )}
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

// One roster row's accordion — expands to the TPO bio, the Industry Liaison
// office details, or a plain Role/Notes view, whichever matches the name.
// Shared by the flat roster list (Regional Offices, etc.) and the tile-
// grouped Team view below.
function TeamRosterRow({
  row,
  isOpen,
  onToggle,
  tpoPhotoMap,
  tpoBiosMap,
  iloPhotoMap,
}: {
  row: { name: string; role: string; notes?: string };
  isOpen: boolean;
  onToggle: () => void;
  tpoPhotoMap: Map<string, string>;
  tpoBiosMap: Map<string, TpoTeamBioDoc>;
  iloPhotoMap?: Map<string, { url: string; path: string }[]>;
}) {
  const bio = tpoBiosMap.get(row.name);
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
          border: 'none',
          padding: 'var(--space-3) var(--space-5)',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 'var(--space-4)',
          transition: 'background var(--transition-base)',
        }}
      >
        <span style={{ fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', fontSize: 'var(--text-base)', transition: 'color var(--transition-base)' }}>
          {row.name} - {row.role}
        </span>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1, flexShrink: 0, transition: 'color var(--transition-base)' }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <SmoothCollapse open={isOpen}>
        <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
          {bio ? (
            <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
              <img
                src={tpoPhotoMap.get(row.name) || PHOTO_NEEDED_PLACEHOLDER}
                alt={row.name}
                style={{ width: 160, height: 190, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {bio.paragraphs.map((para, pi) => (
                  <p key={pi} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.7 }}>{para}</p>
                ))}
              </div>
              {bio.accomplishments && bio.accomplishments.length > 0 && (
                <div style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                  {bio.accomplishmentsIntro && (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
                      {bio.accomplishmentsIntro}
                    </p>
                  )}
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {bio.accomplishments.map((point, ai) => (
                      <li key={ai} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                        <Trophy size={16} strokeWidth={1.75} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.7 }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(bio.email || bio.phone) && (
                <p style={{ width: '100%', fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginTop: 'var(--space-2)' }}>
                  {bio.email && (
                    <>Email: <a href={`mailto:${bio.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{bio.email}</a></>
                  )}
                  {bio.email && bio.phone && ' & '}
                  {bio.phone && (
                    <>Mobile no: <a href={`tel:${bio.phone}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{bio.phone}</a></>
                  )}
                </p>
              )}
            </div>
          ) : industryLiaisonOffices[row.name] ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div>
                <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                  <MapPin size={16} strokeWidth={2} /> Office Address:
                </p>
                {industryLiaisonOffices[row.name].address.map((line, li) => (
                  <p key={li} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{line}</p>
                ))}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {industryLiaisonOffices[row.name].bullets.map((point, bi) => (
                  <li key={bi} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, marginTop: 8 }} />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.7 }}>{point}</span>
                  </li>
                ))}
              </ul>
              {((iloPhotoMap?.get(row.name)) || []).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                  {((iloPhotoMap?.get(row.name)) || []).map((p, pi) => (
                    <img
                      key={p.path || pi}
                      src={p.url}
                      alt={`${row.name} office ${pi + 1}`}
                      style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', marginBottom: row.notes ? 'var(--space-2)' : 0 }}>
                <strong style={{ color: 'var(--color-primary)' }}>Role: </strong>{row.role}
              </p>
              {row.notes && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{row.notes}</p>
              )}
            </>
          )}
        </div>
      </SmoothCollapse>
    </div>
  );
}

// TPO Team roster split into three tiles: Central Placement Team (first 4
// rows), University Team / SVECW (next 3), Industry Liaison Officers (last
// 4) — a fixed split per the roster order in tpoTeamBios/the admin table,
// not derived from role text. Clicking a tile shows just that group's
// roster rows as the same accordion used elsewhere on this page.
const TPO_TEAM_GROUPS: { label: string; count: number }[] = [
  { label: 'Central Placement Team', count: 4 },
  { label: 'University Team (SVECW)', count: 3 },
  { label: 'Industry Liaison Officers', count: 4 },
];

function TpoTeamTiles({
  rows,
  tpoPhotoMap,
  tpoBiosMap,
}: {
  rows: { name: string; role: string; notes?: string }[];
  tpoPhotoMap: Map<string, string>;
  tpoBiosMap: Map<string, TpoTeamBioDoc>;
}) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const groups: { label: string; rows: typeof rows }[] = [];
  let offset = 0;
  for (const g of TPO_TEAM_GROUPS) {
    groups.push({ label: g.label, rows: rows.slice(offset, offset + g.count) });
    offset += g.count;
  }
  // Any rows beyond the fixed 4/3/4 split (e.g. the admin adds someone new)
  // land in the last tile rather than silently disappearing.
  if (offset < rows.length && groups.length > 0) {
    groups[groups.length - 1] = { ...groups[groups.length - 1], rows: groups[groups.length - 1].rows.concat(rows.slice(offset)) };
  }

  const activeRows = groups[activeGroup]?.rows ?? [];

  return (
    <div>
      <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
        {groups.map((group, i) => {
          const isActive = activeGroup === i;
          return (
            <button
              key={group.label}
              onClick={() => { setActiveGroup(i); setActiveRow(null); }}
              style={{
                padding: 'var(--space-6) var(--space-5)',
                border: `1.5px solid ${isActive ? 'var(--color-primary)' : 'var(--color-light-gray)'}`,
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all var(--transition-base)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>
                {group.label}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: isActive ? 'var(--color-white)' : 'var(--color-text-light)' }}>
                {group.rows.length} {group.rows.length === 1 ? 'Member' : 'Members'}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {activeRows.map((row, i) => (
          <TeamRosterRow
            key={row.name}
            row={row}
            isOpen={activeRow === i}
            onToggle={() => setActiveRow(activeRow === i ? null : i)}
            tpoPhotoMap={tpoPhotoMap}
            tpoBiosMap={tpoBiosMap}
          />
        ))}
      </div>
    </div>
  );
}

export default function PlacementDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  const item = allItems.find((i) => i.slug === slug) ?? null;
  const [activeTableRow, setActiveTableRow] = useState<number | null>(null);
  // Full bios (Admin → TPO Team Info) and photos (Admin → TPO Team Photos)
  // for the TPO Team roster — both keyed by the same exact name string as it
  // appears in the roster table, so a matching row's accordion expands to
  // show them instead of just Role/Notes.
  const { docs: tpoBios } = useCollection<TpoTeamBioDoc>('tpoTeamBios', [], { silent: true });
  const tpoBiosMap = new Map(tpoBios.map((b) => [b.name, b]));
  const { docs: tpoPhotos } = useCollection<WithId & { imageUrl: string }>('tpoTeamPhotos', [], { silent: true });
  const tpoPhotoMap = new Map(tpoPhotos.map((p) => [p.id, p.imageUrl]));
  // Admin-uploaded photo galleries for the Regional Offices (Industry
  // Liaison Offices page), keyed by office name — each office can have
  // several photos, unlike the single bio photo above.
  const { docs: iloPhotoDocs } = useCollection<WithId & { photos?: { url: string; path: string }[] }>('iloOfficePhotos', [], { silent: true });
  const iloPhotoMap = new Map(iloPhotoDocs.map((d) => [d.id, d.photos || []]));
  // Admin-uploaded gallery for the GSAC page.
  const { docs: gsacPhotos } = useCollection<WithId & { imageUrl: string }>('gsacPhotos', [orderBy('order', 'asc')], { silent: true });
  // Each item can have its own hero image (set in the Placement Sub-pages
  // admin); falls back to the shared "Placement Detail" banner. No
  // hardcoded stock-photo fallback — the hero just shows its solid
  // background color if neither is set yet.
  const { slides: heroSlides } = usePageBanners('placement-detail');
  const heroImage = item?.heroImage || heroSlides[0]?.imageUrl;
  // The shared banner can carry a looping video instead of a still photo —
  // only applies when the page is using that shared banner (an item's own
  // heroImage override always wins and stays a still photo).
  const heroVideo = !item?.heroImage ? heroSlides[0]?.videoUrl : undefined;
  // Placement Cell's sidebar chart tracks whichever AY. pill is active in
  // the "Placements, Year by Year" section further down the page (reported
  // upward via PlacementYearAccordion's onActiveYearChange), so both stay
  // in sync instead of showing two different batches at once.
  const placementYearData = usePlacementYears();
  const [sidebarChartBatch, setSidebarChartBatch] = useState('');
  const sidebarChartYear = placementYearData.find((y) => y.batch === sidebarChartBatch);

  // No scroll-reveal here — this page's content only renders once the
  // Firestore-backed `item` has loaded (see the gotcha documented in CLAUDE.md).
  useEffect(() => {
    if (item) document.title = `${item.title} | Vishnu Women's University`;
  }, [item]);

  if (!item) {
    if (loading) {
      return (
        <main className="route-fallback">
          <div className="route-fallback__spinner" />
        </main>
      );
    }
    return <Navigate to="/placements" replace />;
  }

  const Icon = resolveContentIcon(item.icon) || BarChart3;
  const tableSections = parseStructuredTable(item.tableText);
  const tableRows = tableSections.flatMap((s) => s.rows);
  const hasBodyOverride = !item.intro && Boolean(BODY_OVERRIDES[item.slug]);
  const bodyText = hasBodyOverride ? BODY_OVERRIDES[item.slug] : '';
  const bodyBlocks = parseBodyContent(bodyText);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="page-hero" style={{ minHeight: 360 }}>
        {heroVideo ? (
          <video
            src={heroVideo}
            poster={heroImage || undefined}
            className="page-hero-image"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : heroImage && (
          <img
            src={heroImage}
            alt={item.title}
            className="page-hero-image"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        )}
        <div className="page-hero-overlay" />
        <div className="container page-hero-content">
          <div className="breadcrumb animate-fade-in">
            <Link to="/" className="breadcrumb-item">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/placements" className="breadcrumb-item">Placements</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item active">{item.title}</span>
          </div>
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Icon size={16} /> Placements & Careers
          </div>
          <h1 className="animate-fade-in-up">{item.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white" style={{ paddingBottom: (item.outcomes && item.outcomes.length > 0) || item.slug === 'employability-skills' || item.slug === 'gsac' || item.slug === 'higher-education' ? 'var(--space-6)' : undefined }}>
        <div className="container">
          <div className={(item.highlights && item.highlights.length > 0) || item.slug === 'placement-details' ? 'detail-grid' : ''}>
            {/* Main */}
            <div>
              <span className="section-label">Overview</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {ABOUT_TITLE_OVERRIDES[item.slug] || item.title}</h2>
              {hasBodyOverride ? (
                <div style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  {bodyBlocks.map((block, index) => {
                    if (block.type === 'list') {
                      return (
                        <ul key={index} style={{ paddingLeft: '1.25rem', margin: '0 0 1rem' }}>
                          {block.items.map((entry, itemIndex) => (
                            <li key={itemIndex} style={{ marginBottom: '0.7rem' }}>
                              {renderInlineText(entry)}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={index} style={{ margin: '0 0 1rem' }}>
                        {renderInlineText(block.text)}
                      </p>
                    );
                  })}
                </div>
              ) : item.intro ? (
                <>
                  <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                    {item.intro}
                  </p>
                  {item.about && (
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}>
                      {item.about}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              )}
            </div>

            {/* Sidebar: on Placement Cell, a branch-wise bar chart synced to
                the AY. pill selected in the Placements, Year by Year section
                below (replaces Key Highlights on this page specifically);
                every other page keeps the plain Key Highlights list. */}
            {item.slug === 'placement-details' ? (
              sidebarChartYear?.branchOffers && sidebarChartYear.branchOffers.length > 0 && (
                <div className="detail-sidebar">
                  <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'sticky', top: '110px' }}>
                    <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-5)' }}>
                      Branch-wise Placement Distribution
                    </h3>
                    <BranchOffersBarChart data={sidebarChartYear.branchOffers} />
                  </div>
                </div>
              )
            ) : item.highlights && item.highlights.length > 0 && (
              <div className="detail-sidebar">
                <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'sticky', top: '110px' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                    Key Highlights
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {item.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* University list accordion — only on the Higher Education sub-page */}
      {item.slug === 'higher-education' && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <HigherEducationAccordion />
          </div>
        </section>
      )}

      {/* Photo gallery — only on the GSAC sub-page */}
      {item.slug === 'gsac' && gsacPhotos.length > 0 && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
              {gsacPhotos.map((p) => (
                <img
                  key={p.id}
                  src={p.imageUrl}
                  alt="Graduate Study Abroad Center"
                  style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Essential / Professional Skills tabs — only on the Employability Skills sub-page */}
      {item.slug === 'employability-skills' && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <EmployabilitySkillsGrid />
          </div>
        </section>
      )}

      {/* Success Story spotlights — only on the Success Stories sub-page */}
      {item.slug === 'success-stories' && successStories.length > 0 && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Spotlight</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Congratulations to Our Placed Students</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
              {successStories.map((s) => (
                <a
                  key={s.studentName}
                  href={s.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', textAlign: 'center', textDecoration: 'none', transition: 'all var(--transition-base)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-light-gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-white)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                    <Trophy size={28} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div style={{ display: 'inline-block', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-full)', padding: '0.2rem 0.7rem', marginBottom: 'var(--space-3)' }}>
                    Batch {s.batch}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>{s.studentName}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-4)' }}>{s.department}</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>Placed at</p>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>{s.company}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, color: 'var(--color-accent)', fontSize: '1.6rem', marginBottom: 'var(--space-4)' }}>{s.package}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-light-gray)' }}>
                    <PlayCircle size={18} strokeWidth={1.75} />
                    Watch on YouTube
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outcomes */}
      {item.outcomes && item.outcomes.length > 0 && (
        <section className="section bg-off-white" style={{ paddingTop: 'var(--space-6)', paddingBottom: item.partners && item.partners.length > 0 && item.slug !== 'placement-details' ? 'var(--space-6)' : undefined }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Impact</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {item.outcomes.map((o) => (
                <div key={o}
                  style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <Trophy size={20} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Placement Details gets the same batch-wise accordion as the main
          Placements page, instead of the generic Name/Role/Notes table. */}
      {item.slug === 'placement-details' && (
        <section className="section bg-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Data</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Placements, Year by Year</h2>
            </div>
            <PlacementYearAccordion
              years={['2022–2026', '2021–2025', '2020–2024', '2019–2023']}
              enrichedYears={['2022–2026', '2021–2025', '2020–2024', '2019–2023']}
              onActiveYearChange={setSidebarChartBatch}
            />
          </div>
        </section>
      )}

      {/* Table Data — not shown on Placement Details, which already has its
          own dedicated year-by-year statistics section above. */}
      {tableRows.length > 0 && item.slug !== 'placement-details' && (
        <section className="section bg-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Data</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                {item.slug === 'tpo-team' ? 'Team' : item.slug === 'industry-liaison-offices' ? 'Regional Offices' : item.slug === 'internships' ? 'Recruiting Companies' : 'Batch-wise Statistics'}
              </h2>
            </div>
            {item.slug === 'tpo-team' ? (
              <TpoTeamTiles rows={tableRows} tpoPhotoMap={tpoPhotoMap} tpoBiosMap={tpoBiosMap} />
            ) : item.slug === 'internships' ? (
              // Company/stipend/selects data reads best as a plain table (same
              // shape as the "Placements, Year by Year" company table) rather
              // than the roster-style rows below, which are built for named
              // people (TPO Cell, ILO offices). Admins enter it in the same
              // Data Table field, one "Company | Stipend/Month | No. of
              // Selects" per line.
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-accent)' }}>
                      <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900, whiteSpace: 'nowrap' }}>S.No</th>
                      <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900 }}>Company Name</th>
                      <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900, whiteSpace: 'nowrap' }}>Stipend/Month</th>
                      <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary-dark)', fontWeight: 900, whiteSpace: 'nowrap' }}>No. of Selects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'transparent' }}>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{i + 1}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', fontWeight: 600 }}>{row.name}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{row.role}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tableRows.map((row, i) => (
                  <TeamRosterRow
                    key={i}
                    row={row}
                    isOpen={activeTableRow === i}
                    onToggle={() => setActiveTableRow(activeTableRow === i ? null : i)}
                    tpoPhotoMap={tpoPhotoMap}
                    tpoBiosMap={tpoBiosMap}
                    iloPhotoMap={iloPhotoMap}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Our Recruiters gets one flat, deduplicated logo grid across every
          drive year, reusing the same batch data as Placements, Year by Year. */}
      {item.slug === 'our-recruiters' && (
        <section className="section bg-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Network</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Our Recruiters</h2>
            </div>
            <AllRecruiters />
          </div>
        </section>
      )}

      {/* Partners Grid — not shown on Placement Details, Campus
          Recruitment Training, Success Stories, TPO Team, or Our Recruiters
          (which gets the year-by-year breakdown above instead), per request. */}
      {item.partners && item.partners.length > 0 && item.slug !== 'placement-details' && item.slug !== 'campus-recruitment-training' && item.slug !== 'success-stories' && item.slug !== 'tpo-team' && item.slug !== 'our-recruiters' && (
        <section className="section bg-off-white" style={{ paddingTop: item.outcomes && item.outcomes.length > 0 ? 'var(--space-6)' : undefined }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Network</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Recruiting Partners</h2>
            </div>
            <div className="partner-logo-grid">
              {item.partners.map((p, i) => (
                <PartnerLogo key={i} name={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
              Explore More Placement Resources
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/placements" className="btn btn-accent">Back to Placements</Link>
              <Link to="/admissions" className="btn btn-secondary">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
