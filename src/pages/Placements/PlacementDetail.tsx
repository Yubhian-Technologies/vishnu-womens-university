import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Trophy, BarChart3, PlayCircle, MapPin, CheckCircle2, ChevronLeft, ChevronRight, ChevronDown, Clock } from 'lucide-react';
import { useCollection, useOrderedCollection, type WithId } from '../../hooks/useCollection';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { resolveContentIcon } from '../../lib/contentIcons';
import { parseStructuredTable, parseFlexibleTable } from '../../lib/structuredTable';
import type { PlacementItemDoc } from '../Admin/sections/PlacementItemsAdmin';
import type { TpoTeamBioDoc } from '../Admin/sections/TpoTeamInfoAdmin';
import type { PlacementCrtDoc } from '../Admin/sections/PlacementCrtDocsAdmin';
import PlacementYearAccordion, { BranchOffersBarChart, formatSalary } from './PlacementYearAccordion';
import type { PlacementYear } from './placementStats.data';
import SmoothCollapse from '../../components/SmoothCollapse/SmoothCollapse';
import CareerGuidanceInterestForm from '../../components/CareerGuidanceInterestForm/CareerGuidanceInterestForm';
import { successStories } from './successStories.data';
import { industryLiaisonOffices } from './industryLiaisonOffices.data';
import { employabilitySkillTabs } from './employabilitySkills.data';
import { higherEducationSections } from './higherEducation.data';
import { usePlacementYears } from './usePlacementYears';
import PlacementAnnouncementsTicker from './PlacementAnnouncementsTicker';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import BodyBlocks, { parseBodyContent } from '../../components/BodyBlocks/BodyBlocks';
import PhotoCarouselStrip from '../../components/PhotoCarousel/PhotoCarouselStrip';
import '../detail-layout.css';
import '../gsac-shared.css';

// Overrides the body heading only — hero/breadcrumb still show
// the CMS title as-is, so a slug here can read differently in the body
// heading without renaming the page everywhere.
const ABOUT_TITLE_OVERRIDES: Record<string, string> = {
  'placement-details': 'Placement Cell',
};

// GSAC's "Global Opportunities" stat row — shown when an admin hasn't
// added any "Global Opportunities Stats" yet, so the globe card never
// sits as a blank box below "Global Opportunities · Brighter Futures".
const DEFAULT_GSAC_STATS = [
  { value: '7+', label: 'Global Destinations' },
  { value: '360', label: 'End-to-End Support' },
  { value: 'Global', label: 'Alumni Network' },
];

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

[More Details …](__CDP_TIMETABLE_URL__)

**C-Program**

For all the II B.Tech students of Circuit branches additional training in C-program was being offered by the college on continuous basis.

[More Details …](__C_PROGRAM_TIMETABLE_URL__)`,
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

// Higher-studies / competitive-exam training blurb for the Career Guidance
// Cell page. Rendered unconditionally on that page (below the Overview
// copy), because the BODY_OVERRIDES entry above only shows when the CMS
// `intro` is empty — and this page has a CMS intro. `**Heading:**` lines
// get the highlighted serif sub-heading treatment via BodyBlocks.
// Career Guidance Cell training tracks — rendered as an expand/collapse
// accordion (CareerGuidanceAccordion) on the career-guidance-cell sub-page.
// Each `body` uses the same **bold** / "- " bullet syntax BodyBlocks parses.
const CAREER_GUIDANCE_SECTIONS: { title: string; body: string }[] = [
  {
    title: 'GRE / TOEFL',
    body: `Special training is provided to students who are aspiring for higher education abroad. It focuses on Verbal, Quantitative and Reasoning skills along with Analytical Writing Assessment. A good number of students from different branches utilized the services and progressing in different universities abroad.`,
  },
  {
    title: 'GATE',
    body: `Higher Educational pursuits are one of the major goals of most of the students of SVECW. Helping them in realizing their goals the institution is offering regularly GATE training classes. Though the record of GATE ranks in SVECW is less initially there is gradual ascendancy.`,
  },
  {
    title: 'IES, IFS & IAS',
    body: `With the academic commitment of the student fraternity SVECW always brings forward any initiative that widens the scope of the career of the students. Eventually a special training for the students who are interested in taking up a career at IES, IAS, IAF, etc. has been started recently and completed the required formative training.`,
  },
  {
    title: 'SVES–NS-IAS Civil Services Coaching Programme',
    body: `The SVES–NS-IAS Civil Services Coaching Programme was initiated in 2024 as a student-centric initiative to provide aspiring Civil Services candidates with structured, accessible, and quality-oriented competitive examination preparation. The programme was established through a Memorandum of Understanding (MoU) signed on 1 April 2024 between SVES and NS-IAS Academy, Hyderabad, with a shared vision of creating better career opportunities for students through expert guidance and systematic preparation.

The programme has been carefully designed to complement students' regular academic curriculum without disturbing their institutional timetable. While the primary focus is on UPSC Civil Services Examination preparation, the knowledge and skills developed through the programme also provide students with a foundation for preparing for other competitive examinations, including State Government Group-I and Group-II examinations. Students also gain exposure to the fundamentals and general awareness areas relevant to Banking and other competitive examinations.

**Key Programme Highlights**

- **Subsidised Fee Structure:** Specially discounted coaching is offered to students under the SVES initiative.
- **Academic-Friendly Schedule:** Classes are scheduled to complement the regular academic timetable without affecting students' coursework.
- **Comprehensive Study Material:** Enrolled students are provided with relevant study materials to support systematic preparation.
- **Online Learning & Recorded Classes:** Online classes offer flexibility, with recorded sessions available for revision and self-paced learning.
- **Weekly Tests:** Regular tests help students assess their preparation, identify areas for improvement, and build examination confidence.
- **Expert Mentorship:** Dr. N. S. Sridhar, Founder & Chairman of NS-IAS Academy, provides periodic campus-based interaction, guidance, and mentorship to students.
- **Multi-Examination Exposure:** The programme develops conceptual knowledge, current affairs awareness, analytical ability, and aptitude that can support preparation for UPSC Civil Services, State Government Group-I & Group-II examinations, Banking examinations, and other competitive examinations.

**Programme Reach**

Since its inception, the programme has supported 60 students across SVES institutions, including 42 students exclusively from SVECW (Autonomous). The current cohort comprises 39 students across SVES institutions, including 18 students from SVECW (Autonomous).

Through the SVES–NS-IAS initiative, Vishnu Women's University is committed to empowering students with access to quality competitive-examination coaching, expert mentorship, structured assessment, and flexible learning opportunities, enabling them to pursue diverse career pathways in Civil Services, State Government services, Banking, and other competitive examinations.`,
  },
];

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
  // Google's favicon service has nothing for providence.org, so the lookup 404s
  'Providence': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Providence_Health_logo.svg/250px-Providence_Health_logo.svg.png',
};

// Placement Cell's Summary tiles used to be a manually-typed free-text line
// per batch (e.g. "2022-2026 batch: 1103 placements, highest 59.28
// LPA(Google)"), kept on the placement-details item's Outcomes field — a
// completely separate admin field from the "Placements, Year by Year" batch
// data below it on this same page, with nothing keeping the two in sync. An
// admin editing/re-importing a batch's Company Rows had no way to know the
// Summary tile above still quoted the old numbers (or was simply missing
// for a newly-added batch). This derives every tile straight from the same
// placementYears data the Year-by-Year section reads, so both always agree
// and a new batch gets a tile automatically.
function batchHighestPackage(y: PlacementYear): { lpa: number; company?: string } | undefined {
  const rows = y.rows || [];
  let best: { lpa: number; company: string } | undefined;
  for (const r of rows) {
    const lpa = parseFloat(formatSalary(r.salary));
    if (!Number.isFinite(lpa)) continue;
    if (!best || lpa > best.lpa) best = { lpa, company: r.company };
  }
  const lpa = y.highestPackageLPA ?? best?.lpa;
  if (lpa == null) return undefined;
  // If the batch's own Highest Package figure doesn't exactly match its top
  // Company Row (e.g. a manually-typed override), still show the row whose
  // salary matches it rather than mislabeling best's company under a
  // different number.
  const company = rows.find((r) => Math.abs((parseFloat(formatSalary(r.salary)) || -Infinity) - lpa) < 0.01)?.company ?? (y.highestPackageLPA == null ? best?.company : undefined);
  return { lpa, company };
}

// Logo only — no company name label beside it (per request). The name still
// lives in alt text/title for accessibility and hover, just not rendered as
// visible text.
function PartnerLogo({ name, uploadedUrl }: { name: string; uploadedUrl?: string }) {
  const domain = PARTNER_DOMAINS[name];
  const logoOverride = uploadedUrl || PARTNER_LOGO_OVERRIDES[name];
  const [failed, setFailed] = useState(!domain && !logoOverride);

  return (
    <div className="partner-logo-card" title={name}>
      {failed ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 44, width: 44, flexShrink: 0, fontSize: 'var(--text-lg)', fontWeight: 700, background: 'var(--color-off-white)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
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
    </div>
  );
}

// Logo grid for the Our Recruiters page.
function AllRecruiters({ logoMap }: { logoMap: Map<string, string> }) {
  // Driven entirely by Admin → Recruiter Logos now, not the batch/company-row
  // data — whatever's been uploaded there (via the ZIP/RAR bulk import or
  // one at a time) is exactly what shows here, nothing more.
  const companies = [...logoMap.keys()].sort((a, b) => a.localeCompare(b));

  if (companies.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
        Recruiter logos will appear here once they're uploaded from Admin → Recruiter Logos.
      </p>
    );
  }

  return (
    <div className="partner-logo-grid">
      {companies.map((company) => (
        <PartnerLogo key={company} name={company} uploadedUrl={logoMap.get(company)} />
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

// Career Guidance Cell training tracks as an expand/collapse accordion —
// each card toggles independently; the first is open on load.
function CareerGuidanceAccordion() {
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(CAREER_GUIDANCE_SECTIONS[0] ? [CAREER_GUIDANCE_SECTIONS[0].title] : [])
  );
  const toggle = (title: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
      {CAREER_GUIDANCE_SECTIONS.map((section) => {
        const isOpen = open.has(section.title);
        return (
          <div key={section.title} style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button
              onClick={() => toggle(section.title)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                background: isOpen ? 'var(--color-primary)' : 'var(--color-off-white)',
                border: 'none',
                padding: 'var(--space-4) var(--space-5)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background var(--transition-base)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'var(--text-base)', color: isOpen ? 'var(--color-white)' : 'var(--color-primary)', transition: 'color var(--transition-base)' }}>
                {section.title}
              </span>
              <span aria-hidden="true" style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1, flexShrink: 0, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', transition: 'color var(--transition-base)' }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <SmoothCollapse open={isOpen}>
              <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                <BodyBlocks blocks={parseBodyContent(section.body)} paragraphStyle={{}} />
              </div>
            </SmoothCollapse>
          </div>
        );
      })}
    </div>
  );
}

// Shared by the Placement Guidelines and Campus Recruitment & Training
// sub-pages — both read the same admin-entered Intro text every other
// Placement sub-page already uses (see BodyBlocks.tsx: "**Heading**" lines
// as sub-headings, "- " lines as bullets), just grouped into cards here
// instead of the plain BodyBlocks paragraph/bullet styling. Nothing new to
// type in the admin — a "**Category**" line starts a new card, the "- "
// lines under it become that card's checklist.
interface ChecklistCategory {
  title: string;
  items: string[];
}

function parseChecklistCategories(intro: string): ChecklistCategory[] {
  const categories: ChecklistCategory[] = [];
  let current: ChecklistCategory | null = null;
  for (const block of parseBodyContent(intro)) {
    if (block.type === 'paragraph') {
      const headingMatch = block.text.match(/^\*\*(.+)\*\*$/);
      if (headingMatch) {
        current = { title: headingMatch[1].replace(/:\s*$/, '').trim(), items: [] };
        categories.push(current);
        continue;
      }
      // A plain (non-"- ", non-heading) line under a category — e.g.
      // Placement Excellence's "1103 offers" / "59.28 LPA (Google)" lines,
      // which aren't bulleted. Collected as an item exactly like a "- " line
      // would be; the renderer decides whether to show a bullet at all.
      if (!current) {
        current = { title: '', items: [] };
        categories.push(current);
      }
      current.items.push(block.text);
      continue;
    }
    if (!current) {
      current = { title: '', items: [] };
      categories.push(current);
    }
    current.items.push(...block.items);
  }
  return categories;
}

const GUIDELINE_CATEGORY_COLORS = [
  { background: '#EAF3FC', heading: '#1D4ED8' },
  { background: '#E9F7F1', heading: '#0F766E' },
  { background: '#FBEEE6', heading: '#C2410C' },
  { background: '#EFEAFB', heading: '#6D28D9' },
];

function PlacementGuidelinesSections({ intro }: { intro: string }) {
  const categories = parseChecklistCategories(intro);
  if (categories.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {categories.map((category, i) => {
        const color = GUIDELINE_CATEGORY_COLORS[i % GUIDELINE_CATEGORY_COLORS.length];
        return (
          <div
            key={`${category.title}-${i}`}
            style={{ background: color.background, borderRadius: 'var(--radius-md)', padding: 'var(--space-5) var(--space-6)' }}
          >
            {category.title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color.heading, flexShrink: 0 }} />
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: color.heading, margin: 0 }}>
                  {category.title}
                </h3>
              </div>
            )}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {category.items.map((point, pi) => (
                <li key={pi} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', paddingLeft: 'calc(16px + var(--space-3))' }}>
                  <span style={{ width: 7, height: 7, marginTop: 8, borderRadius: '50%', background: color.heading, flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// Campus Recruitment & Training sub-page — same parsing as Placement
// Guidelines above, styled instead as one solid navy card per category (with
// a checkbox-in-a-badge heading icon and en-dash bullets), matching this
// page's own reference design rather than reusing the pastel multi-colour
// look.
function CampusRecruitmentTrainingSections({ intro }: { intro: string }) {
  const categories = parseChecklistCategories(intro);
  if (categories.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {categories.map((category, i) => (
        <div
          key={`${category.title}-${i}`}
          style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6) var(--space-8)' }}
        >
          {category.title && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <CheckCircle2 size={22} strokeWidth={2} color="var(--color-white)" style={{ flexShrink: 0 }} />
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-white)', margin: 0 }}>
                {category.title}
              </h3>
            </div>
          )}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {category.items.map((point, pi) => (
              <li key={pi} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', paddingLeft: 'calc(22px + var(--space-3))' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>–</span>
                <span style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Simple click-through image slideshow for a sidebar — arrows only show up
// once there's more than one image (a single image just renders flat, no
// dead-end arrows pointing at themselves). Used by Higher Education's
// sidebar in place of the plain Key Highlights list.
function SidebarImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;
  return (
    <div style={{ position: 'relative' }}>
      <img
        src={images[index]}
        alt={`${alt} (${index + 1} of ${images.length})`}
        loading="lazy"
        style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)', display: 'block' }}
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              width: 34, height: 34, borderRadius: '50%', border: 'none',
              background: 'rgba(255, 255, 255, 0.9)', boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              width: 34, height: 34, borderRadius: '50%', border: 'none',
              background: 'rgba(255, 255, 255, 0.9)', boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ChevronRight size={18} />
          </button>
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {images.map((img, i) => (
              <span
                key={img}
                style={{ width: 6, height: 6, borderRadius: '50%', background: i === index ? 'var(--color-white)' : 'rgba(255, 255, 255, 0.5)' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Round a value up to a "nice" axis maximum (1/2/5 × 10ⁿ).
function niceCeil(v: number): number {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}

// Catmull-Rom → cubic-bezier smoothing for the LPA line.
function smoothLinePath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0].x} ${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

// Impact > Summary — two side-by-side charts sharing the passing-out year
// axis: offers per year (navy bars, 0-based) and highest package in LPA per
// year (gold smooth line, non-zero baseline so the trend reads). Reads the
// same PlacementYear records as the cards above. Plain inline SVG, no library.
function BatchTrendChart({ data }: { data: PlacementYear[] }) {
  const rows = data
    .map((y) => ({
      label: (y.batch.split(/[–-]/).pop() || y.batch).trim(),
      year: Number(y.batch.split(/[–-]/).pop()),
      offers: y.total ?? 0,
      highest: batchHighestPackage(y)?.lpa ?? 0,
    }))
    .sort((a, b) => a.year - b.year);

  if (rows.length < 2) return null;

  const W = 480;
  const H = 320;
  const m = { top: 28, right: 18, bottom: 40, left: 52 };
  const valueText = { fontSize: 12, fill: 'var(--color-text)', fontWeight: 600 } as const;
  const iw = W - m.left - m.right;
  const ih = H - m.top - m.bottom;
  const xBar = (i: number) => m.left + (iw / rows.length) * (i + 0.5);
  const xLine = (i: number) => m.left + (iw / (rows.length - 1)) * i;
  const axisText = { fontSize: 11, fill: 'var(--color-text-light)' } as const;
  const cardStyle = { background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' } as const;
  const titleStyle = { fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)' } as const;

  // Offers axis: 0 → nice ceiling, 5 evenly-spaced ticks.
  const offersMax = niceCeil(Math.max(...rows.map((r) => r.offers)) || 1);
  const yOffers = (v: number) => m.top + ih - (v / offersMax) * ih;
  const OFFER_TICKS = 5;
  const barW = Math.min(42, (iw / rows.length) * 0.55);

  // LPA axis: nice floor → nice ceiling in steps of 5.
  const lpaVals = rows.map((r) => r.highest);
  const lpaLo = Math.max(0, Math.floor(Math.min(...lpaVals) / 5) * 5);
  let lpaHi = Math.ceil(Math.max(...lpaVals) / 5) * 5;
  if (lpaHi <= lpaLo) lpaHi = lpaLo + 5;
  const yLpa = (v: number) => m.top + ih - ((v - lpaLo) / (lpaHi - lpaLo)) * ih;
  const lpaPts = rows.map((r, i) => ({ x: xLine(i), y: yLpa(r.highest) }));

  return (
    <div style={{ marginTop: 'var(--space-8)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
      {/* Number of offers — bar chart */}
      <div style={cardStyle}>
        <div style={titleStyle}>Number of offers</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Number of placement offers by passing-out year">
          {Array.from({ length: OFFER_TICKS + 1 }, (_, t) => {
            const val = (offersMax / OFFER_TICKS) * t;
            const gy = yOffers(val);
            return (
              <g key={t}>
                <line x1={m.left} x2={W - m.right} y1={gy} y2={gy} stroke="var(--color-light-gray)" strokeWidth={1} />
                <text x={m.left - 8} y={gy + 4} textAnchor="end" {...axisText}>{Math.round(val).toLocaleString('en-IN')}</text>
              </g>
            );
          })}
          {rows.map((r, i) => (
            <rect key={i} x={xBar(i) - barW / 2} y={yOffers(r.offers)} width={barW} height={Math.max(0, m.top + ih - yOffers(r.offers))} rx={2} fill="var(--color-primary)" />
          ))}
          {rows.map((r, i) => (
            <text key={`v-${i}`} x={xBar(i)} y={yOffers(r.offers) - 7} textAnchor="middle" {...valueText}>{r.offers.toLocaleString('en-IN')}</text>
          ))}
          {rows.map((r, i) => (
            <text key={i} x={xBar(i)} y={H - m.bottom + 20} textAnchor="middle" {...axisText}>{r.label}</text>
          ))}
        </svg>
      </div>

      {/* Highest package (LPA) — line chart */}
      <div style={cardStyle}>
        <div style={titleStyle}>Highest package (LPA)</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Highest placement package in LPA by passing-out year">
          {Array.from({ length: Math.round((lpaHi - lpaLo) / 5) + 1 }, (_, t) => {
            const val = lpaLo + 5 * t;
            const gy = yLpa(val);
            return (
              <g key={t}>
                <line x1={m.left} x2={W - m.right} y1={gy} y2={gy} stroke="var(--color-light-gray)" strokeWidth={1} />
                <text x={m.left - 8} y={gy + 4} textAnchor="end" {...axisText}>{val}</text>
              </g>
            );
          })}
          <path d={smoothLinePath(lpaPts)} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {lpaPts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4.5} fill="var(--color-accent)" stroke="#ffffff" strokeWidth={1.5} />
          ))}
          {lpaPts.map((p, i) => (
            <text key={`v-${i}`} x={p.x} y={p.y - 12} textAnchor="middle" {...valueText}>{rows[i].highest}</text>
          ))}
          {rows.map((r, i) => (
            <text key={i} x={xLine(i)} y={H - m.bottom + 20} textAnchor="middle" {...axisText}>{r.label}</text>
          ))}
        </svg>
      </div>
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
  addressOnly,
}: {
  row: { name: string; role: string; notes?: string; email?: string; linkedin?: string };
  isOpen: boolean;
  onToggle: () => void;
  tpoPhotoMap: Map<string, string>;
  tpoBiosMap: Map<string, TpoTeamBioDoc>;
  iloPhotoMap?: Map<string, { url: string; path: string }[]>;
  // Industry Liaison Offices' Data Table is just "City | Office Address" now
  // (the old "Role" middle column dropped) — so the row shows the city alone
  // (no " - Role" suffix) and always expands straight to a plain Office
  // Address block, never the Role/Notes or static-data-file fallbacks below.
  addressOnly?: boolean;
}) {
  const bio = tpoBiosMap.get(row.name);
  // Roster-row email/linkedin (Placement Sub-pages' Data Table, this row's
  // own 4th/5th field) and TPO Team Info's bio emails/linkedins are two
  // separate places an admin can set this — combine both rather than
  // picking one, so either one alone is enough to show a name's contact line.
  // Deliberately NOT falling back to the page's general Emails/LinkedIn here
  // — that would repeat the same page-level contact under every row; it gets
  // shown once instead, below the whole roster (see the single-line contact
  // in TpoTeamTiles and the flat roster list further down).
  const contactEmails = [...(row.email ? [row.email] : []), ...(bio?.emails || [])];
  const contactLinkedins = [...(row.linkedin ? [row.linkedin] : []), ...(bio?.linkedins || [])];
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
          {addressOnly ? row.name : `${row.name} - ${row.role}`}
        </span>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1, flexShrink: 0, transition: 'color var(--transition-base)' }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {(contactEmails.length > 0 || contactLinkedins.length > 0) && (
        <div style={{ padding: '0 var(--space-5) var(--space-2)', background: 'var(--color-off-white)', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1) var(--space-4)' }}>
          {contactEmails.length > 0 && (
            <span>
              Contact:{' '}
              {contactEmails.map((email, ei) => (
                <span key={ei}>
                  {ei > 0 && ', '}
                  <a href={`mailto:${email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{email}</a>
                </span>
              ))}
            </span>
          )}
          {contactLinkedins.length > 0 && (
            <span>
              LinkedIn:{' '}
              {contactLinkedins.map((url, li) => (
                <span key={li}>
                  {li > 0 && ', '}
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                    {contactLinkedins.length > 1 ? `Profile ${li + 1}` : 'View Profile'}
                  </a>
                </span>
              ))}
            </span>
          )}
        </div>
      )}

      <SmoothCollapse open={isOpen}>
        <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
          {addressOnly ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div>
                <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                  <MapPin size={16} strokeWidth={2} /> Office Address:
                </p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{row.notes || row.role}</p>
              </div>
            </div>
          ) : bio ? (
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
              {(() => {
                const linkStyle = { color: 'var(--color-primary)', fontWeight: 600 };
                const parts: { key: string; node: ReactNode }[] = [];
                (bio.emails || []).forEach((email, ei) => parts.push({
                  key: `email-${ei}`,
                  node: <>Email: <a href={`mailto:${email}`} style={linkStyle}>{email}</a></>,
                }));
                if (bio.phone) parts.push({ key: 'phone', node: <>Mobile no: <a href={`tel:${bio.phone}`} style={linkStyle}>{bio.phone}</a></> });
                (bio.linkedins || []).forEach((url, li) => parts.push({
                  key: `linkedin-${li}`,
                  node: <>LinkedIn: <a href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{(bio.linkedins || []).length > 1 ? `Profile ${li + 1}` : 'View Profile'}</a></>,
                }));
                if (parts.length === 0) return null;
                return (
                  <p style={{ width: '100%', fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginTop: 'var(--space-2)' }}>
                    {parts.map((part, pi) => (
                      <span key={part.key}>
                        {pi > 0 && ' & '}
                        {part.node}
                      </span>
                    ))}
                  </p>
                );
              })()}
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

// Parses the admin's "Team Groups" field — one "Label | Count" per line —
// into the {label, count} shape TpoTeamTiles splits the roster by. Optional:
// when empty, the roster below renders as a plain flat list instead of tiles.
function parseTeamGroups(text: string): { label: string; count: number }[] {
  return (text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', countStr = ''] = line.split('|').map((p) => p.trim());
      return { label, count: Number(countStr) || 0 };
    })
    .filter((g) => g.label && g.count > 0);
}

// Slices rows across group labels by count, in order — the same mechanism
// rosterGroupsText uses for Data Table, reused here for Department
// Coordinator Groups against Department Coordinators' rows. Unlike the main
// roster split, leftover rows past the defined counts are simply dropped
// rather than dumped into the last group — Department Coordinators is an
// additive extra, not the primary roster, so silently mis-sized counts
// shouldn't inflate whichever group happens to be last.
function sliceRowsByGroupLabel<T>(rows: T[], groupDefs: { label: string; count: number }[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  let offset = 0;
  for (const g of groupDefs) {
    map.set(g.label, rows.slice(offset, offset + g.count));
    offset += g.count;
  }
  return map;
}

// One collapsible row, styled like TeamRosterRow, showing a plain
// "Name — Department" list on expand — for the Department Coordinators
// attached to one Team Group tile.
function DeptCoordinatorsRow({ coordinators, isOpen, onToggle }: {
  coordinators: { name: string; department: string }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
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
          Department Coordinators
        </span>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: isOpen ? 'var(--color-white)' : 'var(--color-text)', lineHeight: 1, flexShrink: 0, transition: 'color var(--transition-base)' }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <SmoothCollapse open={isOpen}>
        <div style={{ padding: 'var(--space-5)', background: 'var(--color-white)', border: '1px solid var(--color-light-gray)', borderTop: 'none' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {coordinators.map((c, i) => (
              <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                <strong style={{ color: 'var(--color-primary)' }}>{c.name}</strong> — {c.department}
              </li>
            ))}
          </ul>
        </div>
      </SmoothCollapse>
    </div>
  );
}

// Roster split into tiles per the admin's Team Groups field (e.g. "Central
// Placement Team | 4") — a fixed count split in roster order, not derived
// from role text. Clicking a tile shows just that group's roster rows as
// the same accordion used elsewhere on this page.
function TpoTeamTiles({
  rows,
  groups: groupDefs,
  tpoPhotoMap,
  tpoBiosMap,
  pageEmails,
  pageLinkedins,
  deptCoordinatorsByGroup,
}: {
  rows: { name: string; role: string; notes?: string }[];
  groups: { label: string; count: number }[];
  tpoPhotoMap: Map<string, string>;
  tpoBiosMap: Map<string, TpoTeamBioDoc>;
  pageEmails?: string[];
  pageLinkedins?: string[];
  deptCoordinatorsByGroup?: Map<string, { name: string; department: string }[]>;
}) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [deptRowOpen, setDeptRowOpen] = useState(false);

  const groups: { label: string; rows: typeof rows }[] = [];
  let offset = 0;
  for (const g of groupDefs) {
    groups.push({ label: g.label, rows: rows.slice(offset, offset + g.count) });
    offset += g.count;
  }
  // Any rows beyond the defined groups' total count (e.g. the admin adds
  // someone new without updating Team Groups) land in the last tile rather
  // than silently disappearing.
  if (offset < rows.length && groups.length > 0) {
    groups[groups.length - 1] = { ...groups[groups.length - 1], rows: groups[groups.length - 1].rows.concat(rows.slice(offset)) };
  }

  const activeRows = groups[activeGroup]?.rows ?? [];
  const activeDeptCoordinators = deptCoordinatorsByGroup?.get(groups[activeGroup]?.label ?? '') ?? [];

  return (
    <div>
      <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
        {groups.map((group, i) => {
          const isActive = activeGroup === i;
          return (
            <button
              key={group.label}
              onClick={() => { setActiveGroup(i); setActiveRow(null); setDeptRowOpen(false); }}
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
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'var(--text-base)' }}>
                {group.label}
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
        {activeDeptCoordinators.length > 0 && (
          <DeptCoordinatorsRow
            coordinators={activeDeptCoordinators}
            isOpen={deptRowOpen}
            onToggle={() => setDeptRowOpen((o) => !o)}
          />
        )}
      </div>

      <PageContactLine emails={pageEmails} linkedins={pageLinkedins} />
    </div>
  );
}

// The page's own Emails/LinkedIn URLs (Placement Sub-pages' page-level
// fields — a shared department contact, not tied to any one person) shown
// once, centered, below the whole roster — rather than repeating the same
// line under every row.
function PageContactLine({ emails, linkedins }: { emails?: string[]; linkedins?: string[] }) {
  if ((!emails || emails.length === 0) && (!linkedins || linkedins.length === 0)) return null;
  return (
    <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginTop: 'var(--space-6)' }}>
      {(emails || []).map((email, ei) => (
        <span key={`e${ei}`}>
          {ei > 0 && ' · '}
          Contact: <a href={`mailto:${email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{email}</a>
        </span>
      ))}
      {(emails && emails.length > 0) && (linkedins && linkedins.length > 0) && '  '}
      {(linkedins || []).map((url, li) => (
        <span key={`l${li}`}>
          {li > 0 && ' · '}
          LinkedIn: <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {(linkedins || []).length > 1 ? `Profile ${li + 1}` : 'View Profile'}
          </a>
        </span>
      ))}
    </p>
  );
}

export default function PlacementDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<PlacementItemDoc>('placementItems', 'order');
  const item = allItems.find((i) => i.slug === slug) ?? null;
  const [activeTableRow, setActiveTableRow] = useState<number | null>(null);
  // Internships table year filter — the 4th pipe field ("Company | Stipend/
  // Month | No. of Selects | Year") reuses StructuredTableRow's optional
  // `email` slot, since this table never uses real email/LinkedIn data.
  const [internYearFilter, setInternYearFilter] = useState<string>('All');
  // Show-entries pagination for the same table — same pattern as the
  // Placements, Year by Year company table in PlacementYearAccordion.tsx.
  const [internEntriesPerPage, setInternEntriesPerPage] = useState(10);
  const [internPage, setInternPage] = useState(0);
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
  // GSAC's "Moments from GSAC" gallery starts collapsed to 3 photos (matching
  // the reference layout) with a toggle to reveal the rest in place — no
  // separate gallery route needed. GSAC's Key Highlights/Outcomes render as
  // an accordion (only one open at a time) instead of the generic sidebar
  // list / 3-col grid every other Placements sub-page uses.
  const [gsacGalleryExpanded, setGsacGalleryExpanded] = useState(false);
  const [gsacOpenAccordion, setGsacOpenAccordion] = useState<'highlights' | 'outcomes' | null>(null);
  // Admin-uploaded recruiter logos (Admin → Recruiter Logos), keyed by the
  // exact company name string used in batch data / item.partners — shared
  // by Our Recruiters (AllRecruiters) and the Recruiting Partners grid
  // below, both of which render via PartnerLogo.
  const { docs: recruiterLogoDocs } = useCollection<WithId & { imageUrl: string }>('recruiterLogos', [], { silent: true });
  const recruiterLogoMap = new Map(recruiterLogoDocs.map((d) => [d.id, d.imageUrl]));
  // Admin-replaceable CDP/C-Program timetable PDFs for the Campus
  // Recruitment & Training page's BODY_OVERRIDES text — see below.
  const { docs: crtDocs } = useOrderedCollection<PlacementCrtDoc>('placementCrtDocsList', 'order');
  const crtCdpDoc = crtDocs.find((d) => d.category === 'cdp');
  const crtCProgramDoc = crtDocs.find((d) => d.category === 'c-program');
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

  useEffect(() => {
    setActiveTableRow(null);
    setInternYearFilter('All');
    setInternPage(0);
    setSidebarChartBatch('');
  }, [slug]);

  // No scroll-reveal here — this page's content only renders once the
  // Firestore-backed `item` has loaded (see the gotcha documented in CLAUDE.md).
  useEffect(() => {
    if (item) document.title = `${item.title} | Vishnu Women's University`;
  }, [item]);

  if (!item) {
    if (loading) {
      return (
        <RouteFallback />
      );
    }
    return <Navigate to="/placements" replace />;
  }

  const Icon = resolveContentIcon(item.icon) || BarChart3;
  const tableSections = parseStructuredTable(item.tableText);
  const tableRows = tableSections.flatMap((s) => s.rows);
  // Internships year filter — the 4th pipe field ("Company | Stipend/Month |
  // No. of Selects | Year") reuses StructuredTableRow's optional `email`
  // slot, since this table never uses real email/LinkedIn data. Computed up
  // here (not inside the table's own render branch) so the filter pills can
  // sit beside the "List of Internships" heading instead of above the table.
  const internYears = [...new Set(tableRows.map((r) => r.email).filter((y): y is string => !!y))];
  const filteredInternRows = internYearFilter === 'All'
    ? tableRows
    : tableRows.filter((r) => !r.email || r.email === internYearFilter);
  const internTotalPages = Math.max(1, Math.ceil(filteredInternRows.length / internEntriesPerPage));
  const internPageClamped = Math.min(internPage, internTotalPages - 1);
  const internPageRows = internEntriesPerPage >= filteredInternRows.length
    ? filteredInternRows
    : filteredInternRows.slice(internPageClamped * internEntriesPerPage, internPageClamped * internEntriesPerPage + internEntriesPerPage);
  // Placement Highlights uses a fully dynamic table (its own column headers
  // straight from row 1 of the Data Table field, not a fixed shape like the
  // roster/company tables above) — see the flexibleHeaders/flexibleRows
  // branch further down.
  // Headers come from their own admin field (dataTableHeadersText), kept
  // separate from Data Table's rows — parseFlexibleTable normally takes row
  // 1 as the header, so that header line is synthesized in front of
  // tableText here rather than trusting tableText's own first line, which
  // an Excel re-import could otherwise silently turn into a data row (or
  // vice versa). Requiring dataTableHeadersText to actually be set (rather
  // than falling back to treating tableText's own first row as the header
  // when it's blank) means a not-yet-configured page just shows nothing,
  // instead of quietly mistaking a real data row for the header again.
  const flexibleSections = item.slug === 'placement-highlights' && (item.dataTableHeadersText || '').trim()
    ? parseFlexibleTable(`${item.dataTableHeadersText || ''}\n${item.tableText || ''}`)
    : [];
  const flexibleHeaders = flexibleSections[0]?.headers ?? [];
  const flexibleRows = flexibleSections.flatMap((s) => s.rows);
  const rosterGroups = parseTeamGroups(item.rosterGroupsText);
  // "Name | Department" rows sliced across Team Groups by
  // deptCoordinatorGroupsText's counts — see DeptCoordinatorsRow.
  const deptCoordinatorRows = parseStructuredTable(item.deptCoordinatorsText).flatMap((s) => s.rows);
  const deptCoordinatorGroupDefs = parseTeamGroups(item.deptCoordinatorGroupsText);
  const deptCoordinatorsByGroup = new Map(
    Array.from(sliceRowsByGroupLabel(deptCoordinatorRows, deptCoordinatorGroupDefs), ([label, rs]) => [
      label,
      rs.map((r) => ({ name: r.name, department: r.role })),
    ])
  );
  // Placement Highlights has its own "Highest individual package"/"Notable
  // packages" style facts folded into the intro/highlights text instead —
  // this generic Outcomes & Achievements block would just repeat them. Our
  // Recruiters drops it per request — the recruiter logo grid below is the
  // page's actual point, and Outcomes was just repeating the Overview text.
  const activeOutcomes = (item.outcomes || []).filter((o) => !o.includes('2015-2019') && !o.includes('2015–2019'));
  const showOutcomes = activeOutcomes.length > 0 && item.slug !== 'placement-highlights' && item.slug !== 'our-recruiters' && item.slug !== 'tpo-team' && item.slug !== 'industry-liaison-offices' && item.slug !== 'gsac';
  // Shared markup for the below-Overview spot every non-Placement-Cell page
  // uses. Placement Cell renders its own combined Summary+chart block near
  // the hero instead (see placementCellSummarySection below) — it needs the
  // cards paired side-by-side with the branch chart, not this generic
  // full-width layout.
  const outcomesSection = (
    <section className="section bg-off-white" style={{ paddingTop: 'var(--space-6)', paddingBottom: item.partners && item.partners.length > 0 ? 'var(--space-6)' : undefined }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <span className="section-label">Impact</span>
          <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
        </div>
        {/* Fixed 3-column grid, not auto-fit/minmax — auto-fit stretches a
            partial last row's items wider than every other row's, instead
            of leaving them at the same width (see the same fix on
            placementCellSummarySection above). mobile-stack-grid still
            collapses this to one column on small screens. */}
        <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
          {activeOutcomes.map((o) => (
            <div key={o}
              style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', minHeight: 110, display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
              <Trophy size={20} strokeWidth={1.75} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{o}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  // Placement Cell's own combined Summary (batch cards) — full width, no
  // longer paired with the Branch-wise Placement Distribution chart (that
  // now only appears further down, in the Placements/Year-by-Year section).
  // Reads placementYearData directly (the same data the Year-by-Year section
  // below uses) instead of the item's separately-typed Outcomes field, so a
  // batch's offers/highest-package here can never drift from what the
  // Year-by-Year section shows for that same batch, and a newly-added batch
  // gets a card automatically instead of needing a matching Outcomes line
  // typed in by hand.
  const summaryYearData = placementYearData.filter((y) => !y.hideFromSummary);
  const placementCellSummarySection = item.slug === 'placement-details' && summaryYearData.length > 0 && (
    <section className="section bg-off-white">
      <div className="container">
        <div>
          <span className="section-label">Impact</span>
          <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Summary</h2>
        </div>
        <BatchTrendChart data={summaryYearData} />
      </div>
    </section>
  );
  // GSAC's "Global Opportunities" stat row — admin-entered "Value | Label"
  // lines (Admin → Placement Sub-pages → gsac → Global Opportunities Stats).
  const gsacStats = (item.globalStats || [])
    .map((line) => {
      const [value, label] = line.split('|').map((s) => s.trim());
      return value ? { value, label: label || '' } : null;
    })
    .filter((s): s is { value: string; label: string } => !!s);
  const displayGsacStats = gsacStats.length > 0 ? gsacStats : DEFAULT_GSAC_STATS;
  const hasBodyOverride = !item.intro && Boolean(BODY_OVERRIDES[item.slug]);
  let bodyText = hasBodyOverride ? BODY_OVERRIDES[item.slug] : '';
  // The CDP/C-Program "More Details …" links point at bundled PDFs by
  // default — swap in an admin-replaced PDF's live URL if one has been
  // uploaded via /admin → CRT Timetables.
  if (item.slug === 'campus-recruitment-training' && hasBodyOverride) {
    bodyText = bodyText
      .replace('__CDP_TIMETABLE_URL__', crtCdpDoc?.fileUrl || '#')
      .replace('__C_PROGRAM_TIMETABLE_URL__', crtCProgramDoc?.fileUrl || '#');
  }
  const bodyBlocks = parseBodyContent(bodyText);
  // Employability Skills has no Overview copy and isn't getting any — rather
  // than a two-column layout with an empty main column next to a much
  // taller Key Highlights sidebar (the mismatch that caused a large dead
  // gap), skip the Overview section for this page entirely and show
  // Highlights as its own full-width grid, right above the skills tabs.
  // Our Recruiters drops the whole Overview section per request instead —
  // its Key Highlights/About text duplicated the logo grid below, which is
  // the page's actual content — with no full-width-grid replacement.
  const skipOverviewSection = (item.slug === 'employability-skills' && !hasBodyOverride && !item.intro && !item.desc) || item.slug === 'our-recruiters' || item.slug === 'internships' || item.slug === 'placement-details' || item.slug === 'placement-guidelines' || (item.slug === 'campus-recruitment-training' && !!item.intro);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <section className="dept-hero-section">
        <div className="container">
          <div className="dept-hero-card">
            {heroVideo ? (
              <video
                src={heroVideo}
                poster={heroImage || undefined}
                className="dept-hero-bg-video"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : heroImage && (
              <img
                src={heroImage}
                alt={item.title}
                className="dept-hero-bg-img"
                loading="eager"
                decoding="sync"
                {...fetchPriorityAttr('high')}
              />
            )}
            <div className="dept-hero-overlay" />
            <div className="dept-hero-content">
              <div className="breadcrumb animate-fade-in" style={{ marginBottom: '0.8rem' }}>
                <Link to="/" className="breadcrumb-item">Home</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to="/placements" className="breadcrumb-item">Placements</Link>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-item active">{item.title}</span>
              </div>
              <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#C9973A', color: '#0B1E42', fontSize: 'var(--text-xs)', fontWeight: 800, padding: '0.35rem 0.9rem', borderRadius: '9999px', marginBottom: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <Icon size={14} /> Placements & Careers
              </div>
              <h1 className="dept-hero-title">{item.title}</h1>
              {item.desc && (
                <p className="dept-hero-subtitle">{item.desc}</p>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Placement Cell's combined Summary + branch chart, shown at the very
          top (right after the hero) — every other page keeps its Outcomes
          block in its usual spot below Overview (see further down). */}
      {placementCellSummarySection}

      {/* Content */}
      {!skipOverviewSection && (
      <section className="section bg-white" style={{ paddingBottom: (showOutcomes && item.slug !== 'placement-details') || item.slug === 'employability-skills' || item.slug === 'gsac' || item.slug === 'higher-education' || item.slug === 'placement-highlights' || item.slug === 'tpo-team' || item.slug === 'industry-liaison-offices' ? 'var(--space-6)' : undefined }}>
        <div className="container">
          <div className={
            (item.highlights && item.highlights.length > 0) || item.slug === 'placement-details' || item.slug === 'gsac'
              ? `detail-grid${item.slug === 'gsac' ? ' detail-grid--image-sidebar' : ''}${item.slug === 'higher-education' ? ' detail-grid--higher-ed-sidebar' : ''}`
              : ''
          }>
            {/* Main */}
            <div>
              {item.slug !== 'tpo-team' && <span className="section-label">Overview</span>}
              {item.slug !== 'tpo-team' && (
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>{ABOUT_TITLE_OVERRIDES[item.slug] || item.title}</h2>
              )}
              {hasBodyOverride ? (
                <div className={item.slug === 'gsac' ? 'gsac-body-card' : undefined} style={item.slug === 'gsac' ? undefined : { fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  <BodyBlocks blocks={bodyBlocks} paragraphStyle={{}} />
                </div>
              ) : item.intro ? (
                <div className={item.slug === 'gsac' ? 'gsac-body-card' : undefined}>
                  <BodyBlocks
                    blocks={parseBodyContent(item.intro)}
                    paragraphStyle={item.slug === 'gsac' ? {} : { fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: item.slug === 'higher-education' ? 1.5 : 1.75 }}
                  />
                  {item.about && (
                    <BodyBlocks
                      blocks={parseBodyContent(item.about)}
                      paragraphStyle={item.slug === 'gsac' ? {} : { fontSize: 'var(--text-base)', color: 'var(--color-text-light)', lineHeight: 1.75 }}
                    />
                  )}
                </div>
              ) : (
                <p className={item.slug === 'gsac' ? 'gsac-body-card' : undefined} style={item.slug === 'gsac' ? undefined : { fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              )}

              {/* Career Guidance Cell — higher-studies / competitive-exam
                  training sections. Always shown here (not via BODY_OVERRIDES,
                  which is suppressed when the CMS intro is set). */}
              {item.slug === 'career-guidance-cell' && !hasBodyOverride && (
                <CareerGuidanceAccordion />
              )}

              {item.slug === 'career-guidance-cell' && (
                <CareerGuidanceInterestForm tracks={CAREER_GUIDANCE_SECTIONS.map((s) => s.title)} />
              )}

              {/* Only shown here when there's no roster below to show it instead
                  (see PageContactLine after the Data Table/Team section) —
                  avoids the same Email/LinkedIn appearing twice on one page. */}
              {tableRows.length === 0 && ((item.emails && item.emails.length > 0) || (item.linkedins && item.linkedins.length > 0)) && (
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', marginTop: 'var(--space-5)' }}>
                  {(item.emails || []).map((email, ei) => (
                    <span key={`email-${ei}`}>
                      {ei > 0 && ' · '}
                      Email: <a href={`mailto:${email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{email}</a>
                    </span>
                  ))}
                  {(item.emails && item.emails.length > 0) && (item.linkedins && item.linkedins.length > 0) && ' · '}
                  {(item.linkedins || []).map((url, li) => (
                    <span key={`linkedin-${li}`}>
                      {li > 0 && ' · '}
                      LinkedIn: <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        {(item.linkedins || []).length > 1 ? `Profile ${li + 1}` : 'View Profile'}
                      </a>
                    </span>
                  ))}
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
            ) : item.slug === 'gsac' ? (
              <div className="detail-sidebar">
                <div className="gsac-globe-card">
                  <img src="/images/dot world map.webp" alt="" aria-hidden="true" className="gsac-globe-map" />
                  <h3 className="gsac-globe-title">Global<br />Opportunities<br />Brighter Futures</h3>
                  <div className="gsac-globe-divider" aria-hidden="true" />
                  <div className="gsac-globe-stats">
                    {displayGsacStats.map((s, i) => (
                      <div key={i} className="gsac-globe-stat">
                        <strong>{s.value}</strong>
                        {s.label && <span>{s.label}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : item.slug === 'higher-education' ? (
              <div className="detail-sidebar">
                <div style={{ position: 'sticky', top: '110px' }}>
                  <SidebarImageCarousel
                    images={[
                      '/images/placements/global-universities.jpg',
                      '/images/placements/collaboration-with-institutions.jpg',
                    ]}
                    alt="Higher Education partnerships and collaborations"
                  />
                </div>
              </div>
            ) : item.highlights && item.highlights.length > 0 && (
              <div className="detail-sidebar">
                <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', position: 'sticky', top: '110px' }}>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
                    {item.slug === 'tpo-team' ? 'Key Activities' : 'Key Highlights'}
                  </h3>
                  {/* Capped + scrollable rather than growing forever — a long
                      Highlights list would otherwise stretch this whole grid
                      row (shared .detail-grid sizes both columns to the
                      taller one) far past the About text next to it, leaving
                      a large empty gap before the next section. */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: 420, overflowY: 'auto', paddingRight: item.highlights.length > 6 ? 'var(--space-2)' : undefined }}>
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
      )}

      {/* Full-width Key Highlights grid — replaces the sidebar version above,
          but only for Employability Skills specifically; Our Recruiters
          skips the Overview section with no Highlights replacement at all. */}
      {skipOverviewSection && item.slug === 'employability-skills' && item.highlights && item.highlights.length > 0 && (
        <section className="section bg-white" style={{ paddingBottom: 'var(--space-6)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {item.highlights.map((h) => (
                <div key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', background: 'var(--color-off-white)', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* University list accordion — only on the Higher Education sub-page */}
      {item.slug === 'higher-education' && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <HigherEducationAccordion />
          </div>
        </section>
      )}

      {/* Colour-coded checklist — only on the Placement Guidelines sub-page,
          replacing the plain BodyBlocks rendering of the same Intro text
          Overview would otherwise show (see skipOverviewSection above). */}
      {item.slug === 'placement-guidelines' && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <PlacementGuidelinesSections intro={item.intro || ''} />
          </div>
        </section>
      )}

      {/* Navy checklist cards — only on Campus Recruitment & Training, and
          only once the admin has entered real Intro content in this format
          (the "**Heading**"/"- item" convention) — otherwise this slug falls
          back to its old hardcoded BODY_OVERRIDES paragraphs unchanged. */}
      {item.slug === 'campus-recruitment-training' && item.intro && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <CampusRecruitmentTrainingSections intro={item.intro} />
          </div>
        </section>
      )}

      {/* Photo gallery — only on the GSAC sub-page. Starts collapsed to 3
          photos with a toggle to reveal the rest in place. */}
      {item.slug === 'gsac' && gsacPhotos.length > 0 && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <div className="gsac-gallery-header">
              <div>
                <span className="section-label">Gallery</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Moments from GSAC</h2>
                <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Sessions, interactions and global opportunities in action.</p>
              </div>
              {gsacPhotos.length > 3 && (
                <button type="button" className="gsac-gallery-toggle" onClick={() => setGsacGalleryExpanded((v) => !v)}>
                  {gsacGalleryExpanded ? 'Show Less' : 'View Full Gallery'} <ChevronRight size={16} strokeWidth={2} />
                </button>
              )}
            </div>
            <div className="gsac-gallery-grid">
              {(gsacGalleryExpanded ? gsacPhotos : gsacPhotos.slice(0, 3)).map((p) => (
                <div className="gsac-gallery-item" key={p.id}>
                  <img src={p.imageUrl} alt="Graduate Study Abroad Center" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Highlights / Outcomes & Achievements — GSAC-only accordion
          (only one open at a time), reusing the same item.highlights /
          activeOutcomes data every other Placements sub-page shows as a
          plain sidebar list / 3-col grid (see outcomesSection below, which
          is skipped for this slug so it isn't shown twice). */}
      {item.slug === 'gsac' && ((item.highlights && item.highlights.length > 0) || activeOutcomes.length > 0) && (
        <section className="section bg-off-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {item.highlights && item.highlights.length > 0 && (
              <div className="gsac-accordion">
                <button type="button" className="gsac-accordion__toggle" onClick={() => setGsacOpenAccordion((v) => (v === 'highlights' ? null : 'highlights'))}>
                  <span className="gsac-accordion__icon"><Clock size={18} strokeWidth={1.75} /></span>
                  <span className="gsac-accordion__label">Key Highlights</span>
                  <ChevronDown size={18} className={`gsac-accordion__chevron${gsacOpenAccordion === 'highlights' ? ' is-open' : ''}`} />
                </button>
                <SmoothCollapse open={gsacOpenAccordion === 'highlights'}>
                  <ul className="gsac-accordion__list">
                    {item.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </SmoothCollapse>
              </div>
            )}
            {activeOutcomes.length > 0 && (
              <div className="gsac-accordion">
                <button type="button" className="gsac-accordion__toggle" onClick={() => setGsacOpenAccordion((v) => (v === 'outcomes' ? null : 'outcomes'))}>
                  <span className="gsac-accordion__icon"><BarChart3 size={18} strokeWidth={1.75} /></span>
                  <span className="gsac-accordion__label">Outcomes &amp; Achievements</span>
                  <ChevronDown size={18} className={`gsac-accordion__chevron${gsacOpenAccordion === 'outcomes' ? ' is-open' : ''}`} />
                </button>
                <SmoothCollapse open={gsacOpenAccordion === 'outcomes'}>
                  <ul className="gsac-accordion__list">
                    {activeOutcomes.map((o) => <li key={o}>{o}</li>)}
                  </ul>
                </SmoothCollapse>
              </div>
            )}
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

      {/* Outcomes — every page except Placement Cell shows it here, in its
          usual spot below Overview (Placement Cell renders outcomesSection
          up near the hero instead — see above). */}
      {showOutcomes && item.slug !== 'placement-details' && outcomesSection}

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
              onActiveYearChange={setSidebarChartBatch}
            />
          </div>
        </section>
      )}

      {/* Table Data — not shown on Placement Details, which already has its
          own dedicated year-by-year statistics section above. */}
      {(tableRows.length > 0 || flexibleRows.length > 0) && item.slug !== 'placement-details' && (
        <section className="section bg-white" style={{ paddingTop: item.slug === 'placement-highlights' || item.slug === 'tpo-team' || item.slug === 'industry-liaison-offices' ? 'var(--space-6)' : undefined }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)', display: item.slug === 'internships' && internYears.length > 0 ? 'flex' : undefined, alignItems: item.slug === 'internships' && internYears.length > 0 ? 'center' : undefined, justifyContent: item.slug === 'internships' && internYears.length > 0 ? 'space-between' : undefined, flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <div>
                {item.slug !== 'internships' && <span className="section-label">Data</span>}
                <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>
                  {rosterGroups.length > 0 ? 'Team' : item.slug === 'industry-liaison-offices' ? 'Regional Offices' : item.slug === 'internships' ? 'List of Internships' : item.slug === 'placement-highlights' ? 'Highlights' : 'Batch-wise Statistics'}
                </h2>
              </div>
              {item.slug === 'internships' && internYears.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  {['All', ...internYears].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => { setInternYearFilter(yr); setInternPage(0); }}
                      style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1.5px solid var(--color-primary)',
                        background: internYearFilter === yr ? 'var(--color-primary)' : 'var(--color-white)',
                        color: internYearFilter === yr ? 'var(--color-white)' : 'var(--color-primary)',
                        fontWeight: 700,
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-base), color var(--transition-base)',
                      }}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {rosterGroups.length > 0 ? (
              <TpoTeamTiles rows={tableRows} groups={rosterGroups} tpoPhotoMap={tpoPhotoMap} tpoBiosMap={tpoBiosMap} pageEmails={item.emails} pageLinkedins={item.linkedins} deptCoordinatorsByGroup={deptCoordinatorsByGroup} />
            ) : item.slug === 'placement-highlights' ? (
              // No plain table here — just the sliding ticker, sourced from
              // the same admin-imported Data Table (Name/Batch/Branch/
              // Company/LPA columns auto-detected from Table Column Headers).
              <PlacementAnnouncementsTicker headers={flexibleHeaders} rows={flexibleRows} />
            ) : item.slug === 'internships' ? (
              // Company/stipend/selects data reads best as a plain table (same
              // shape as the "Placements, Year by Year" company table) rather
              // than the roster-style rows below, which are built for named
              // people (TPO Cell, ILO offices). Admins enter it in the same
              // Data Table field, one "Company | Stipend/Month | No. of
              // Selects | Year" per line — Year is optional; rows without one
              // always show regardless of which filter pill is active (filter
              // pills themselves render beside the heading above, not here).
              <>
                {filteredInternRows.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--space-4)' }}>
                    <span>Show</span>
                    <select
                      value={internEntriesPerPage}
                      onChange={(e) => { setInternEntriesPerPage(Number(e.target.value)); setInternPage(0); }}
                      style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.5rem', fontSize: 'var(--text-sm)' }}
                    >
                      {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
                      <option value={filteredInternRows.length || 1}>All</option>
                    </select>
                    <span>entries</span>
                  </div>
                )}
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
                      {internPageRows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'transparent' }}>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{internPageClamped * internEntriesPerPage + i + 1}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', fontWeight: 600 }}>{row.name}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{row.role}</td>
                          <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)' }}>{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {internTotalPages > 1 && filteredInternRows.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                    <span>
                      Showing {internPageClamped * internEntriesPerPage + 1} to {Math.min(internPageClamped * internEntriesPerPage + internEntriesPerPage, filteredInternRows.length)} of {filteredInternRows.length} entries
                    </span>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={() => setInternPage((p) => Math.max(0, p - 1))}
                        disabled={internPageClamped === 0}
                        style={{ padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-light-gray)', background: 'var(--color-white)', cursor: internPageClamped === 0 ? 'default' : 'pointer', opacity: internPageClamped === 0 ? 0.5 : 1 }}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setInternPage((p) => Math.min(internTotalPages - 1, p + 1))}
                        disabled={internPageClamped >= internTotalPages - 1}
                        style={{ padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-light-gray)', background: 'var(--color-white)', cursor: internPageClamped >= internTotalPages - 1 ? 'default' : 'pointer', opacity: internPageClamped >= internTotalPages - 1 ? 0.5 : 1 }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                <PageContactLine emails={item.emails} linkedins={item.linkedins} />
              </>
            ) : item.slug === 'industry-liaison-offices' ? (
              // SVES network map (society-issued artwork, not admin-managed —
              // same /images/placements/* pattern as elsewhere) sits beside
              // the Regional Offices list instead of above it, smaller than
              // its old full-width-up-to-720px size since it no longer needs
              // to carry the whole row on its own. The artwork itself already
              // includes the per-city icon row (see the updated
              // industry-liaison-offices.png), so nothing extra is rendered
              // here for that anymore.
              <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 340px) 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
                <img
                  src="/images/placements/industry-liaison-offices.png"
                  alt="Sri Vishnu Educational Society — Industry Liaison Offices, campuses and contact details across India"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = '/images/image (3).png';
                    } else {
                      target.style.display = 'none';
                    }
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    position: 'sticky',
                    top: 'calc(var(--topbar-height) + var(--header-height) + 1rem)',
                  }}
                />
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
                      addressOnly
                    />
                  ))}
                  <PageContactLine emails={item.emails} linkedins={item.linkedins} />
                </div>
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
                <PageContactLine emails={item.emails} linkedins={item.linkedins} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Our Recruiters gets one flat, deduplicated logo grid across every
          drive year, reusing the same batch data as Placements, Year by Year. */}
      {item.slug === 'our-recruiters' && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Network</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Our Recruiters</h2>
            </div>
            <AllRecruiters logoMap={recruiterLogoMap} />
          </div>
        </section>
      )}

      {/* Photo Carousel — Placement Highlights only. See PhotoCarouselStrip
          for the free-form-crop/auto-advance behavior. */}
      {item.slug === 'placement-highlights' && item.notablePeople && item.notablePeople.length > 0 && (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-6)' }}>
          <div className="container">
            <PhotoCarouselStrip cards={item.notablePeople} />
          </div>
        </section>
      )}

      {/* Partners Grid — not shown on Placement Details, Campus
          Recruitment Training, Success Stories, TPO Team, Our Recruiters
          (which gets the year-by-year breakdown above instead), or Placement
          Highlights, per request. */}
      {item.partners && item.partners.length > 0 && item.slug !== 'placement-details' && item.slug !== 'campus-recruitment-training' && item.slug !== 'success-stories' && item.slug !== 'tpo-team' && item.slug !== 'our-recruiters' && item.slug !== 'placement-highlights' && item.slug !== 'industry-liaison-offices' && (
        <section className="section bg-off-white" style={{ paddingTop: showOutcomes ? 'var(--space-6)' : undefined }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Network</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Recruiting Partners</h2>
            </div>
            <div className="partner-logo-grid">
              {item.partners.map((p, i) => (
                <PartnerLogo key={i} name={p} uploadedUrl={recruiterLogoMap.get(p)} />
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
              <Link to="/apply-now" className="btn btn-secondary">Apply Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
