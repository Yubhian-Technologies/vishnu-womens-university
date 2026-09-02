import { useEffect, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { useOrderedCollection } from '../../hooks/useCollection';
import { linkify } from '../../lib/linkify';
import { getSectionBlocks } from '../../lib/facultySections';
import FacultySectionContent from '../../components/FacultySectionContent/FacultySectionContent';
import { hasCustomSectionContent } from '../../lib/customSections';
import { SectionSubtree } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import type { FacultyDoc } from './Faculty';
import '../detail-layout.css';

// Only "About Freshman Department" and the sections below (Vision &
// Mission, POs, course structure table, the four sub-department pages,
// and the Library) have real content — each sub-department's own inner
// tabs besides "About Department" still show a coming-soon placeholder
// until that content is provided, matching the pattern used elsewhere on
// the site (e.g. Institution Innovation Cell in DifferentiatorDetail.tsx).
const FE_TABS = [
  'About Freshman Department',
  'Vision & Mission',
  'POs',
  'I B.Tech Course structure & Curriculum',
  'Department of Mathematics',
  'Department of Physics',
  'Department of Chemistry',
  'Department of English',
  'Department Library',
];

type ContentBlock =
  | { type: 'paragraph'; text: ReactNode }
  | { type: 'lead'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'bullets'; items: ReactNode[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: '0 0 var(--space-5)', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, marginTop: 9 }} />
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.7 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
      <div style={{ width: 4, height: 24, background: 'var(--color-accent)', borderRadius: 'var(--radius-full)' }} />
      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{children}</h3>
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
          {block.text}
        </p>
      );
    case 'lead':
      return (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
          {block.text}
        </p>
      );
    case 'heading':
      return (
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
          {block.text}
        </h4>
      );
    case 'bullets':
      return <Bullets items={block.items} />;
    case 'table':
      return (
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {block.headers.map((h) => <th key={h} style={TABLE_TH_STYLE}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                  {row.map((cell, ci) => <td key={ci} style={TABLE_TD_STYLE}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function Blocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}
    </>
  );
}

// ---- Vision & Mission ----
const MISSION_POINTS = [
  'To empower women in professional courses.',
  'To provide knowledge of sciences with academic excellence.',
  'To inculcate passion and curiosity in students so that they acquire the Caliber to take the course.',
  'To groom the fresher so that she develops into a disciplined and integrated personality upon the completion of the course.',
];

function VisionMissionSection() {
  return (
    <>
      <SubHeading>Vision</SubHeading>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-8)' }}>
        To impart knowledge to students in an ambience of Humanity, Wisdom, Intellect, knowledge, Creativity &amp; innovation in order to nurture them to become Culturally and Ethically rich Professionals with bright future.
      </p>
      <SubHeading>Mission</SubHeading>
      <Bullets items={MISSION_POINTS} />
    </>
  );
}

// ---- POs ----
const POS = [
  { code: 'PO1', title: 'Engineering Knowledge', text: 'Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.' },
  { code: 'PO2', title: 'Problem Analysis', text: 'Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.' },
  { code: 'PO3', title: 'Design/Development of Solutions', text: 'Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.' },
  { code: 'PO4', title: 'Conduct Investigations of Complex Problems', text: 'Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.' },
  { code: 'PO5', title: 'Modern Tool Usage', text: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.' },
  { code: 'PO6', title: 'The Engineer and Society', text: 'Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.' },
  { code: 'PO7', title: 'Environment and Sustainability', text: 'Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.' },
  { code: 'PO8', title: 'Ethics', text: 'Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.' },
  { code: 'PO9', title: 'Individual and Team Work', text: 'Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.' },
  { code: 'PO10', title: 'Communication', text: "Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions." },
  { code: 'PO11', title: 'Project Management and Finance', text: "Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments." },
  { code: 'PO12', title: 'Life-long Learning', text: 'Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.' },
];

function PosSection() {
  return (
    <>
      <SubHeading>Program Outcomes (POs)</SubHeading>
      <Bullets
        items={POS.map((po) => (
          <>
            <strong>{po.code}. {po.title}:</strong> {po.text}
          </>
        ))}
      />
    </>
  );
}

// ---- Course structure table (no documents uploaded yet — "View" is a
// placeholder until real Course Structure / Syllabus files are provided) ----
const COURSE_STRUCTURE_PROGRAMMES = [
  'Civil Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Electronics and Communications Engineering',
  'Computer Science and Engineering',
  'Information Technology',
  'Computer Science and Engineering (Data Science)',
  'Computer Science and Engineering (AIML)',
  'Computer Science and Engineering (Cyber Security)',
];

const TABLE_TH_STYLE = {
  background: 'var(--color-accent)',
  color: 'var(--color-primary-dark)',
  padding: 'var(--space-3) var(--space-4)',
  textAlign: 'left' as const,
  fontSize: 'var(--text-sm)',
  fontWeight: 800,
};
const TABLE_TD_STYLE = {
  padding: 'var(--space-3) var(--space-4)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text)',
};

function CourseStructureSection() {
  return (
    <>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', marginBottom: 'var(--space-5)' }}>
        R23 Regulations, Course Structure and Syllabus
      </p>
      <div style={{ overflowX: 'auto', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={TABLE_TH_STYLE}>Programme Name</th>
              <th style={TABLE_TH_STYLE}>Course Structure</th>
              <th style={TABLE_TH_STYLE}>Syllabus</th>
            </tr>
          </thead>
          <tbody>
            {COURSE_STRUCTURE_PROGRAMMES.map((name, i) => (
              <tr key={name} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                <td style={TABLE_TD_STYLE}>{name}</td>
                <td style={TABLE_TD_STYLE}>
                  <span style={{ color: 'var(--color-accent-dark, var(--color-accent))', fontWeight: 700, opacity: 0.6 }} title="Document not uploaded yet">View</span>
                </td>
                <td style={TABLE_TD_STYLE}>
                  <span style={{ color: 'var(--color-accent-dark, var(--color-accent))', fontWeight: 700, opacity: 0.6 }} title="Document not uploaded yet">View</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ---- About HOD / Faculty — both live from the site's shared `faculty`
// Firestore collection (the same one CSE/ECE/etc. use, via /admin →
// Faculty), filtered to this department. No static fallback: an empty
// collection just shows nothing here, same as the plain Faculty page.
function useDeptFaculty(department: string) {
  const { docs: allFaculty, loading } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const members = allFaculty.filter((f) => f.department === department);
  return { members, loading };
}

function FeAboutHodSection({ department }: { department: string }) {
  const { members, loading } = useDeptFaculty(department);
  const hod = members.find((f) => /head|hod/i.test(f.designation));
  // Same Custom Sections / legacy-fallback split as FacultyProfile.tsx — see
  // that file's comment.
  const customSections = (hod?.customSections ?? []).filter(hasCustomSectionContent);
  const legacySections = (hod?.sections ?? []).filter((s) => s.title);
  const usingCustomSections = customSections.length > 0;
  const navItems = usingCustomSections
    ? customSections.map((s) => ({ key: s.id, label: s.label }))
    : legacySections.map((s) => ({ key: s.title, label: s.title }));
  const [category, setCategory] = useState<string | null>(null);
  const activeCustom = usingCustomSections ? (customSections.find((s) => s.id === category) ?? customSections[0]) : null;
  const activeLegacy = !usingCustomSections ? (legacySections.find((s) => s.title === category) ?? legacySections[0]) : null;

  useEffect(() => {
    setCategory(null);
  }, [hod?.id]);

  if (loading) return null;
  if (!hod) {
    return (
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>
        No Head of Department has been added yet — add one via /admin → Faculty (Department: {department}, Designation: "Professor &amp; Head").
      </p>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', marginBottom: 'var(--space-8)' }}>
        <img
          src={hod.imageUrl || PHOTO_NEEDED_PLACEHOLDER}
          alt={hod.name}
          style={{ width: 160, height: 180, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)', flexShrink: 0 }}
        />
        <div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: 'var(--space-1)' }}>{hod.name}</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-3)' }}>
            {hod.designation}
            {hod.email && <> · <a href={`mailto:${hod.email}`} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{hod.email}</a></>}
          </p>
          {(hod.facts ?? []).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
              {hod.facts!.map((f) => (
                <div key={f.label}><strong style={{ color: 'var(--color-primary)' }}>{f.label}:</strong> {linkify(f.value)}</div>
              ))}
            </div>
          )}
          <Link to={`/faculty/${hod.id}`} style={{ display: 'inline-block', marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent)' }}>
            View Full Profile →
          </Link>
        </div>
      </div>

      {navItems.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 220, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: 'var(--space-1) var(--space-4)', marginBottom: 'var(--space-1)' }}>
              Profile Sections
            </span>
            {navItems.map((item) => {
              const isActive = category === item.key || (category === null && item === navItems[0]);
              return (
                <button
                  key={item.key}
                  onClick={() => setCategory(item.key)}
                  style={{
                    textAlign: 'left',
                    padding: 'var(--space-2) var(--space-4)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                    color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                    fontWeight: 700,
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            {usingCustomSections
              ? activeCustom && <SectionSubtree section={activeCustom} />
              : activeLegacy && <FacultySectionContent blocks={getSectionBlocks(activeLegacy)} />}
          </div>
        </div>
      )}
    </div>
  );
}

function FeFacultyGridSection({ department }: { department: string }) {
  const { members, loading } = useDeptFaculty(department);

  if (!loading && members.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>
        No faculty added yet for this department — add them via /admin → Faculty (Department: {department}).
      </p>
    );
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={TABLE_TH_STYLE}>S.No</th>
            <th style={TABLE_TH_STYLE}>Name</th>
            <th style={TABLE_TH_STYLE}>Designation</th>
            <th style={TABLE_TH_STYLE}>Qualification</th>
          </tr>
        </thead>
        <tbody>
          {members.map((f, i) => (
            <tr key={f.id} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
              <td style={TABLE_TD_STYLE}>{i + 1}</td>
              <td style={TABLE_TD_STYLE}>
                <Link to={`/faculty/${f.id}`} style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
                  {f.name}
                </Link>
              </td>
              <td style={TABLE_TD_STYLE}>{f.designation}</td>
              <td style={TABLE_TD_STYLE}>{f.qualification}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- Awards & Recognitions ----
interface SetNetGateRow {
  subject: string;
  name: string;
  designation: string;
  qualifier: string;
  /** Some departments' registers include the year qualified; others don't
   *  — the column only renders when at least one row in the table has it. */
  qualifyingYear?: string;
}

/** A named bullet list within the Awards tab — e.g. "Patent" + "Awards"
 *  for one department, "Ph.D. Awardees" for another. Headings vary by
 *  department, so this is data-driven rather than fixed fields. */
interface AwardsSectionBlock {
  heading: string;
  items: ReactNode[];
}

interface AwardsInfo {
  sections?: AwardsSectionBlock[];
  setNetGate?: SetNetGateRow[];
}

function AwardsSection({ data }: { data: AwardsInfo }) {
  const showYear = data.setNetGate?.some((r) => r.qualifyingYear);
  return (
    <div>
      {data.sections?.map((s) => (
        <div key={s.heading}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>{s.heading}</h4>
          <Bullets items={s.items} />
        </div>
      ))}
      {data.setNetGate && (
        <>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
            Faculty Qualified in SET/NET/GATE
          </h4>
          <div style={{ overflowX: 'auto', border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={TABLE_TH_STYLE}>S.No</th>
                  <th style={TABLE_TH_STYLE}>Subject</th>
                  <th style={TABLE_TH_STYLE}>Name of the Faculty</th>
                  <th style={TABLE_TH_STYLE}>Designation</th>
                  <th style={TABLE_TH_STYLE}>NET/GATE/SET</th>
                  {showYear && <th style={TABLE_TH_STYLE}>Qualifying Year</th>}
                </tr>
              </thead>
              <tbody>
                {data.setNetGate.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={TABLE_TD_STYLE}>{i + 1}</td>
                    <td style={TABLE_TD_STYLE}>{r.subject}</td>
                    <td style={TABLE_TD_STYLE}>{r.name}</td>
                    <td style={TABLE_TD_STYLE}>{r.designation}</td>
                    <td style={TABLE_TD_STYLE}>{r.qualifier}</td>
                    {showYear && <td style={TABLE_TD_STYLE}>{r.qualifyingYear ?? ''}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ---- Laboratories ----
interface LabInfo {
  title: string;
  intro: string;
  facts: { label: string; value: string }[];
  photoCount: number;
}

function OneLabSection({ lab }: { lab: LabInfo }) {
  return (
    <div>
      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-3)' }}>
        {lab.title}
      </h4>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-4)' }}>
        {lab.intro}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--space-5)' }}>
        {lab.facts.map((f) => (
          <div key={f.label}><strong style={{ color: 'var(--color-primary)' }}>{f.label}:</strong> {f.value}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        {Array.from({ length: lab.photoCount }).map((_, i) => (
          <img
            key={i}
            src={PHOTO_NEEDED_PLACEHOLDER}
            alt={lab.title}
            style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)' }}
          />
        ))}
      </div>
    </div>
  );
}

// A department can have more than one lab (e.g. Chemistry's Chemistry
// Laboratory + Engineering Chemistry Lab) — each gets its own heading/
// intro/facts/photos block, stacked in one scroll.
function LabSection({ labs }: { labs: LabInfo[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {labs.map((lab) => <OneLabSection key={lab.title} lab={lab} />)}
    </div>
  );
}

// ---- Sub-departments (Mathematics / Physics / Chemistry / English) ----
// Each of these also has its own standalone page at
// /academics/freshman-engineering/<slug> (FreshmanSubDepartment.tsx), which
// renders this exact same data via the exported SubDeptSection below —
// `slug` is that page's URL segment.
interface SubDept {
  key: string;
  slug: string;
  title: string;
  tabs: string[];
  about: ContentBlock[];
  labs?: LabInfo[];
  researchDev?: ContentBlock[];
  awards?: AwardsInfo;
}

export const SUB_DEPTS: SubDept[] = [
  {
    key: 'Department of Mathematics',
    slug: 'mathematics',
    title: 'Department of Mathematics',
    tabs: ['About Department', 'About HOD', 'Faculty', 'Research & Development', 'Awards & Recognitions'],
    about: [
      { type: 'paragraph', text: "Engineering Mathematics is considered as basis for all branches of engineering as it encompasses theoretical principles underlying many real time applications. It is in fact the art of applying mathematics to complex real-world problems. It combines mathematical theory, practical engineering and scientific computing to address today's technological challenges. A strong foundation in Mathematics at entry level enables an Engineering student to have a fruitful academic career at lateral levels and subsequently make a correct choice for his / her professional arena. Keeping this as the main objective, the Mathematics team of Basic Science Department is striving to cater to the needs of students of all branches of engineering and also that of Management studies. Having its presence since the inception of the institution, the team has since grown in size as well as in reputation with faculty members who are well qualified and fully experienced in the areas of Mathematics as well as Statistics, the team is certainly one of the most sought after in the institute." },
      { type: 'lead', text: 'The subjects that are handled as a part of regular engineering and Management studies curricula are:' },
      { type: 'bullets', items: [
        'Engineering Mathematics (Algebra & Calculus),',
        'Discrete Mathematical structures,',
        'Probability and Statistics,',
        'Quantitative Techniques and Research Methodology.',
      ] },
      { type: 'paragraph', text: 'Also, the team members are actively involved in training the students for placements and other competitive exams.' },
    ],
    researchDev: [
      { type: 'paragraph', text: 'All the faculty members of the department are actively engaged in research work, attending conferences at national and International levels to present their research papers, publishing their work in Journals of repute indexed in Scopus, SCI, WoS and other databases.' },
      { type: 'lead', text: 'The faculty of the department are working in the following areas of research:' },
      { type: 'bullets', items: [
        'Mathematical Modelling',
        'Algebra (Lattices)',
        'Fluid Dynamics',
        'Calculus (Special Functions)',
        'Operations Research (Queuing models)',
        'Statistics (Circular)',
      ] },
      { type: 'paragraph', text: 'Some faculty members are also involved in editing and reviewing manuscripts of other researchers to be published in Journals of repute and in the process, won accolades from various research agencies.' },
    ],
    awards: {
      sections: [
        { heading: 'Patent', items: [
          'Dr. P. L. R. Kameswari, Asst Professor, Department of Mathematics has been Granted a Patent for an invention "Bayesian Inference for Stochastic Differential Equations with Uncertainty Quantification and Parameter Estimation" vide application no: 202441016939 A and Patent office journal no: 12/2024',
        ] },
        { heading: 'Awards', items: [
          "Dr. Y. Phani, Professor of Mathematics Awarded 'Best Academician' from Academia Industry and Research Networking Conclave (ConnectAIRE-2023), Organized by Sahasra Research Foundation, India",
          "Dr. Y. Phani, Professor of Mathematics Awarded 'Best Reviewer' from Asian Research Journal of Mathematics.",
          "Dr. R. Vasu Babu Awarded as 'Incredible Researcher of India' by Incredible Academicians & Researchers of India",
        ] },
      ],
      setNetGate: [
        { subject: 'Mathematics', name: 'Dr. T.S.R.Murthy', designation: 'Professor', qualifier: 'CSIR NET' },
        { subject: '', name: 'Dr. Y.Phani', designation: 'Professor', qualifier: 'APSET' },
        { subject: '', name: 'Dr. R.Vasu Babu', designation: 'Professor', qualifier: 'APSET' },
      ],
    },
  },
  {
    key: 'Department of Physics',
    slug: 'physics',
    title: 'Department of Physics',
    tabs: ['About Department', 'About HOD', 'Faculty', 'Laboratories', 'Research & Development', 'Awards'],
    about: [
      { type: 'paragraph', text: <>The Department of Physics at <strong>Shri Vishnu Engineering College for Women</strong> plays a pivotal role in bridging the gap between fundamental scientific principles and engineering innovation. As an integral part of the college&apos;s interdisciplinary approach to education and research, our department is committed to advancing knowledge at the intersection of physics and engineering while preparing students for successful careers in a rapidly evolving technological landscape.</> },
    ],
    labs: [
      {
        title: 'Engineering Physics Laboratory',
        intro: "Engineering Physics Laboratory is designed to develop student's experimental skills in engineering concepts related to Semiconductors, Wave Optics, Lasers and Electromagnetism. Through engaging lab experiments, students not only grasp theoretical concepts but also develop practical skills essential for addressing real-world challenges. By bridging theory and application, our program prepares graduates for a future where innovation and technology converge, offering boundless opportunities in research, industry, and beyond.",
        facts: [
          { label: 'Laboratory-In-charge', value: 'Mr J.V. Krishna Kumar' },
          { label: 'Laboratory-Technician', value: 'Mr G. Sravana Varma' },
        ],
        photoCount: 3,
      },
    ],
    researchDev: [
      { type: 'lead', text: 'The Physics Department at SVECW is committed to advancing knowledge through research and innovation. Our faculty members are actively engaged in research across various areas, including:' },
      { type: 'bullets', items: [
        'Atmosphere and Ionosphere physics',
        'Remote Sensing',
        'Nanofluids',
        'Nanoscience',
        'Ultrasonic studies of binary liquids',
        'Material Science',
        'Nanophosphor material',
        'Luminescent Materials',
      ] },
      { type: 'table', headers: ['Year of publication', 'Journals', 'Projects'], rows: [
        ['2024', '3', ''],
        ['2023', '5', ''],
        ['2022', '9', '1'],
        ['2021', '1', ''],
        ['2020', '12', ''],
      ] },
    ],
    awards: {
      sections: [
        { heading: 'Ph.D. Awardees', items: [
          'Dr. B. V. Naveen Kumar, Asst. Professor was awarded Doctor of Philosophy for thesis "Optical Insights of Lanthanum Zirconate Nano Powder Doped with Bi+ Ions and Co-Doped with Certain Rare Earth Ions for Light Emitting Applications" on 25th April 2023.',
          'Dr. J.V.Srinivasu Professor &HoD in the Department of Physics, was awarded Ph.D entitled "Study of Thermoacoustic, Optical and Transport properties of Binary Liquid Mixtures Containing 1, 4-Butanediol at Different Temperatures" on 28th Nov 2018.',
          'Dr P. S. Brahmanandam Professor in the department of physics was awarded Ph. D entitled "Studies on Ionospheric F-Region Irregularities and Additional Stratification of the F2 Layer (F3 Layer) In the Indian Low Latitude Sector" on 31st Aug 2006.',
          'Dr. G. UMA Assoc. Professor in the Department of Physics was awarded Ph. D in the year 2007 entitled "Studies Of Geomagnetic Storms over Low-Latitude Stations in India"',
        ] },
      ],
      setNetGate: [
        { subject: 'Physical science', name: 'Dr. B. V. Naveen Kumar', designation: 'Asst. Professor', qualifier: 'APSET', qualifyingYear: '2018' },
        { subject: '', name: 'Mr. T. Karthik SaiRam', designation: 'Asst. Professor', qualifier: 'APSET', qualifyingYear: '2021' },
      ],
    },
  },
  {
    key: 'Department of Chemistry',
    slug: 'chemistry',
    title: 'Department of Chemistry',
    tabs: ['About Department', 'About HOD', 'Faculty', 'Laboratories', 'Research & Development', 'Awards & Recognitions'],
    about: [
      { type: 'paragraph', text: 'The Department of Chemistry at SVECW plays a vital role in equipping our engineering students with a strong foundation in chemical principles. We believe a deep understanding of chemistry is essential for success in various engineering disciplines.' },
      { type: 'heading', text: 'Courses' },
      { type: 'lead', text: 'We offer a range of chemistry courses tailored to the specific needs of various engineering programs.' },
      { type: 'bullets', items: [
        'Chemistry for CSE, CSE-AIDS, CSE-AIML, CSE-Cyber Security, ECE, EEE & IT',
        'Engineering Chemistry for Civil & Mechanical Engineering Students.',
        'Environmental Science for II B.Tech Students',
      ] },
    ],
    labs: [
      {
        title: 'Chemistry Laboratory',
        intro: 'The Chemistry Laboratory is designed to facilitate practical approach in the fundamental concepts of chemistry. This invariably provides a solid foundation in chemistry for the budding engineering students. The Laboratory also provides voluminous facilities for electrochemistry, polymers, corrosion, spectrophotometry, water treatment and topics related to testing of environmental pollution.',
        facts: [
          { label: 'Laboratory-In-charge', value: 'Mrs. B. Kanaka Durga' },
          { label: 'Laboratory-Technician', value: 'Mrs. G. Nagalakshmi' },
        ],
        photoCount: 0,
      },
      {
        title: 'Engineering Chemistry Lab',
        intro: 'The Engineering Chemistry Laboratory is designed to apprise the students with practical knowledge in basic facts of chemistry in order to understand the very essential relation between engineering and industry. The students will be able to understand and analyze the various chemistry related problems in engineering course and enhance experimental skills in improving their technical competence. Also, students will be able to enhance their thinking abilities and apply basic techniques which are used in chemistry laboratory for preparation, identification, Separation and purification. They learn to apply the techniques: chromatography, volumetric analysis, pHmetry, Viscometry and conductometry. The laboratory is equipped with Colorimeters, Conductivity meters, pH meters, Redwood Viscometers etcetera. This will make them familiarize with diversity of methods in order to study matter right from the molecular level.',
        facts: [
          { label: 'Laboratory-In-charge', value: 'Mrs. K. Kiranmai Devi' },
          { label: 'Laboratory-Technician', value: 'Mrs. G. Nagalakshmi' },
        ],
        photoCount: 5,
      },
    ],
    researchDev: [
      { type: 'lead', text: 'The Chemistry Department at SVECW is committed to advancing knowledge through research and innovation. Our faculty members are actively engaged in research across various areas, including:' },
      { type: 'bullets', items: [
        'Nanotechnology and Materials Science',
        'Sustainable Energy',
        'Environmental Chemistry',
        'Instrumental methods of analysis',
        'Molecular Modeling',
        'Molecular Docking',
      ] },
      { type: 'table', headers: ['Year of publication', 'Journals', 'Scopus indexed Book chapters', 'Patents', 'Projects'], rows: [
        ['2025-26', '3', '3', '0', '1'],
        ['2024-25', '5', '4', '1', '1'],
        ['2023-24', '5', '3', '0', '1'],
        ['2022-23', '5', '0', '1', '0'],
        ['2021-22', '3', '0', '0', '0'],
        ['2020-21', '2', '0', '0', '0'],
        ['2019-20', '2', '0', '0', '0'],
      ] },
      { type: 'heading', text: 'Funding Projects:' },
      { type: 'bullets', items: [
        'Title of the Sanctioned Project: Establishment of Community Resilience Resource Centre (CRRC) in Bhimavaram, Undi, Palakoderu, Attili, and Kalla Blocks, West Godavari District, Andhra Pradesh State',
        'Science Technology and Innovation hub funded by DST completed in SEPTEMBER.',
      ] },
    ],
    awards: {
      sections: [
        { heading: 'PhD Awardees', items: [
          'Dr K Ganesh Kadiyala, Associate Professor was awarded Doctor of Philosophy for thesis "Development of Ligands for Transporter and Receptor Targeted Molecular Imaging" on 18th Feb 2016.',
          'JAGADEESH.K Professor & HoD in the Department of Chemistry, was Ph.D entitled "Stability indicating method development and validation of few pharmaceutical drugs by HPLC method – application in tablet dosage forms" on April 20th 2020.',
        ] },
      ],
      setNetGate: [
        { subject: 'Chemical Sciences', name: 'Dr. K. Jagadeesh', designation: 'Professor & HOD', qualifier: 'APSET', qualifyingYear: '2017' },
        { subject: '', name: 'Dr. K. Ganesh Kadiyala', designation: 'Assoc. Professor', qualifier: 'CSIR-NET', qualifyingYear: '2010' },
      ],
    },
  },
  {
    key: 'Department of English',
    slug: 'english',
    title: 'Department of English',
    tabs: ['About Department', 'About HOD', 'Faculty', 'Laboratories', 'Research & Development', 'Awards'],
    about: [
      { type: 'paragraph', text: "Department of English plays a pivotal role in nurturing students' language proficiency across the four essential skills. With a dedicated focus on fortifying fundamental principles and revitalizing knowledge, our department boasts a team of target-oriented, seasoned faculty members with extensive teaching experience. The team consistently strive to exceed student expectations, fostering an environment where students feel comfortable seeking guidance, counselling, or clarification. Accessible and approachable, our faculty members ensure that students receive the support they need to excel in courses ranging from Communicative English to Communicative English Lab and Advanced Communication Skills." },
      { type: 'paragraph', text: 'At the heart of our English department lies a commitment to empowering students with the linguistic tools necessary for success in an increasingly interconnected world. Through comprehensive instruction and personalized mentorship, we aim to equip students with the proficiency and confidence to navigate diverse linguistic contexts with ease. Our faculty members serve not only as educators but also as mentors, guiding students on their journey towards proficiency in English language and communication. With a steadfast dedication to quality, the English department empower students to thrive in academic, professional, and personal endeavours.' },
      { type: 'heading', text: 'Courses:' },
      { type: 'lead', text: 'We offer English courses tailored to the specific needs of various engineering programs.' },
      { type: 'bullets', items: ['Communicative English', 'Communicative English Lab', 'Advanced Communication Skills', 'Soft Skills'] },
    ],
    labs: [
      {
        title: 'Communicative English Labs',
        intro: "The two communicative English Labs impart LSRW skills to the students. Communication is playing a crucial role in the success of an Engineering student. The labs are equipped with computers and internet facility. The students are exposed to language skills which enable them to attain proficiency over the language. In the first year, students learn phonetics, Functional English, Intonation, stress and accent, Rhythm, JAM, E-mail Writing etc. Apart from regular syllabus, the labs also aim at imparting 'Listen and Repeat' practice with the help of short duration videos. The faculty conducts a range of language activities in the labs which are equipped with English software.",
        facts: [
          { label: 'Laboratory-in-charges', value: 'Mr. P.Arun Kumar & Mrs.S.Devaki Devi' },
          { label: 'Laboratory-Technician', value: 'Mrs. R. Lalitha Kumari' },
        ],
        photoCount: 0,
      },
      {
        title: 'Advanced Communication Skills Lab',
        intro: 'The Advanced Communication Skills Lab helps students develop their employability skills in the areas of vocabulary, resume writing, oral presentations, report writing, group discussion and interview skills. The lab helps do research for their project and assignment presentations. The students take advantage of very useful videos and websites of reputed universities for enhancing their skills in English language. In this way, the lab focuses on the finer aspects of written and spoken English to prepare students acquire ease in communication, making the budding engineers ready for career advancement.',
        facts: [
          { label: 'Laboratory-in-charges', value: 'Mrs. K. Vasumathy Srinivas' },
          { label: 'Laboratory-Technician', value: 'Mrs. R. Lalitha Kumari' },
        ],
        photoCount: 5,
      },
    ],
    researchDev: [
      { type: 'heading', text: 'Research Areas:' },
      { type: 'bullets', items: ['ELT', 'English Language and Literature'] },
    ],
    awards: {
      sections: [
        { heading: 'Ph.D Awardees', items: [
          'Dr. P. Sreehari Raju awarded Ph.D. on "Effective writing skills- A selective investigative study among the engineering students in Andhra Pradesh."',
          'Dr. G. J. V. Prasad awarded Ph.D. on "A study of English Language Teaching through e-learning."',
        ] },
      ],
    },
  },
];

export function SubDeptSection({ dept }: { dept: SubDept }) {
  const [innerTab, setInnerTab] = useState(dept.tabs[0]);
  // "Department of Mathematics" -> "Mathematics" — matches the plain
  // department values used in the shared `faculty` collection (see
  // FE_DEPARTMENTS in FacultyAdmin.tsx).
  const deptName = dept.title.replace(/^Department of /, '');

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {dept.tabs.map((tab) => {
          const isActive = innerTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setInnerTab(tab)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--color-primary)' : 'var(--color-off-white)',
                color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {innerTab === 'About Department' && <Blocks blocks={dept.about} />}
      {innerTab === 'About HOD' && <FeAboutHodSection department={deptName} />}
      {innerTab === 'Faculty' && <FeFacultyGridSection department={deptName} />}
      {innerTab === 'Research & Development' && (
        dept.researchDev ? <Blocks blocks={dept.researchDev} /> : (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>Content for this section is coming soon.</p>
        )
      )}
      {(innerTab === 'Awards & Recognitions' || innerTab === 'Awards') && (
        dept.awards ? <AwardsSection data={dept.awards} /> : (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>Content for this section is coming soon.</p>
        )
      )}
      {innerTab === 'Laboratories' && (
        dept.labs ? <LabSection labs={dept.labs} /> : (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>Content for this section is coming soon.</p>
        )
      )}
    </div>
  );
}

// ---- Department Library ----
function LibrarySection() {
  return (
    <>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
        Sri Vishnu Engineering College for women has one main library at the heart of the campus. In addition to this, there is a departmental library in the Department of Freshman Engineering.
      </p>
      <Bullets
        items={[
          'The library is open from 8.00 a.m. to 5.00 pm on all days.',
          'A variety of books related to Freshman Engineering subjects along with literary texts, fiction and nonfiction are available to satisfy the thirst of the students.',
          'Reference books of various subjects are procured.',
          'A series of lectures on specific subjects as well as text books are available in CD form.',
          'CDs of the classical movies in English are available.',
        ]}
      />
      <Bullets
        items={[
          <><strong>Faculty In-charge –</strong> Dr. T. S. R. Murthy</>,
          <><strong>Supporting Staff –</strong> Mr. G. Sravan Varma</>,
          <><strong>Total number of titles:</strong> 150</>,
          <><strong>Number of volumes:</strong> 300</>,
          <><strong>Total No. of CDs &amp; DVDs:</strong> 70</>,
        ]}
      />
    </>
  );
}

// Shared right-rail nav, shown here and on each of the 4 standalone
// sub-department pages (FreshmanSubDepartment.tsx) — all link back to this
// page with a specific tab pre-selected. `activeHref` highlights whichever
// one matches the page currently being viewed.
export const FE_SIDEBAR_ITEMS: { label: string; href: string }[] = [
  { label: FE_TABS[0], href: '/academics/freshman-engineering' },
  ...FE_TABS.slice(1, 4).map((tab) => ({ label: tab, href: `/academics/freshman-engineering?tab=${encodeURIComponent(tab)}` })),
  { label: 'Department Library', href: `/academics/freshman-engineering?tab=${encodeURIComponent('Department Library')}` },
];

export function FreshmanSidebarNav({ activeHref }: { activeHref: string }) {
  return (
    <div className="detail-sidebar">
      <div style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'sticky', top: '110px' }}>
        {FE_SIDEBAR_ITEMS.map((item) => {
          const isActive = item.href === activeHref;
          const itemStyle = {
            display: 'block', width: '100%', textAlign: 'left' as const,
            padding: 'var(--space-3) var(--space-5)', border: 'none',
            borderBottom: '1px solid var(--color-light-gray)',
            background: isActive ? 'var(--color-primary)' : 'transparent',
            color: isActive ? 'var(--color-white)' : 'var(--color-primary)',
            fontWeight: isActive ? 700 : 600, fontSize: 'var(--text-sm)',
            textDecoration: 'none',
          };
          return isActive ? (
            <div key={item.href} style={itemStyle}>{item.label}</div>
          ) : (
            <Link key={item.href} to={item.href} style={itemStyle}>{item.label}</Link>
          );
        })}
      </div>
    </div>
  );
}

export default function FreshmanEngineering() {
  // Lets links elsewhere (e.g. the FreshmanSidebarNav above, and the
  // Mathematics/Physics/Chemistry/English "foundation department" cards on
  // /academics) deep-link straight to a tab via ?tab=, instead of always
  // landing on "About Freshman Department".
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const initialTab = FE_TABS.includes(requestedTab || '') ? requestedTab! : FE_TABS[0];
  const [activeTab, setActiveTab] = useState(initialTab);
  // Re-syncs if a FreshmanSidebarNav link changes ?tab= while already on
  // this route (same pathname doesn't remount, so the useState initializer
  // above only fires once) — without this, clicking between the 4 in-page
  // tabs while already on /academics/freshman-engineering would silently
  // no-op.
  useEffect(() => {
    const tab = searchParams.get('tab');
    setActiveTab(tab && FE_TABS.includes(tab) ? tab : FE_TABS[0]);
  }, [searchParams]);
  const subDept = SUB_DEPTS.find((d) => d.key === activeTab);

  useEffect(() => {
    const title = activeTab === 'About Freshman Department'
      ? 'Department of Freshman Engineering'
      : subDept ? subDept.title : activeTab;
    document.title = `${title} | Vishnu Women's University`;
  }, [activeTab, subDept]);

  const pageTitle = activeTab === 'About Freshman Department'
    ? 'Department of Freshman Engineering'
    : subDept ? subDept.title : activeTab;

  return (
    <main className="page-wrapper">
      {/* Header — no photo hero for this department, matching the plain
          content-header treatment it was designed with. */}
      <section className="section bg-white" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            <Link to="/academics" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>Academics</Link>
            <span style={{ margin: '0 0.4rem', color: 'var(--color-text-light)' }}>›</span>
            <Link to="/academics" style={{ color: 'var(--color-text-light)', textDecoration: 'none' }}>Departments</Link>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>
            Freshman Engineering
          </div>
          <h1 style={{ marginBottom: 'var(--space-8)' }}>{pageTitle}</h1>
        </div>
      </section>

      <section className="section bg-white" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="detail-grid">
            <div>
              {activeTab === 'About Freshman Department' && (
                <>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-5)' }}>
                    The first year of engineering, often dubbed as freshman year, holds immense significance for engineering students as it lays the foundation for their academic and professional journey. It serves as a pivotal period of transition, where students are introduced to the core principles, concepts, and methodologies essential for their chosen field. Beyond academic knowledge, the first year fosters critical thinking, problem-solving skills, and adaptability, preparing students to tackle the challenges they&apos;ll encounter throughout their engineering education and career. Additionally, it offers opportunities for personal growth, social integration, and exploration of diverse interests, shaping well-rounded individuals poised for success in the dynamic world of engineering. Within this dynamic landscape, departments such as Mathematics, Physics, Chemistry, and English, along with Environment Science, assume paramount significance, each contributing crucial elements to the holistic development of aspiring engineers.
                  </p>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                    Driven by a commitment to academic excellence, the department employs a multifaceted approach to teaching, incorporating interactive methods such as classroom discussions, seminars by industry experts, and hands-on training. With a focus on the proper application of scientific knowledge in engineering, the department upholds the highest ethical and professional standards, continuously striving for improvement in all aspects of its academic offerings and support services. Through its comprehensive curriculum and dedicated faculty, the Department serves as a guiding force, empowering students to overcome challenges and excel in their academic and personal pursuits.
                  </p>
                </>
              )}

              {activeTab === 'Vision & Mission' && <VisionMissionSection />}
              {activeTab === 'POs' && <PosSection />}
              {activeTab === 'I B.Tech Course structure & Curriculum' && <CourseStructureSection />}
              {subDept && <SubDeptSection key={subDept.key} dept={subDept} />}
              {activeTab === 'Department Library' && <LibrarySection />}
            </div>

            {/* Section nav */}
            <FreshmanSidebarNav
              activeHref={activeTab === FE_TABS[0] ? '/academics/freshman-engineering' : `/academics/freshman-engineering?tab=${encodeURIComponent(activeTab)}`}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
