import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import { useOrderedCollection } from '../../hooks/useCollection';
import { DEFAULT_COMPLIANCE_DOCS, type ComplianceDocDoc } from '../Admin/sections/ComplianceDocsAdmin';
import SEO from '../../components/SEO/SEO';
import { getBreadcrumbSchema } from '../../lib/seo/schemas';
import '../detail-layout.css';

interface DisclosureLink {
  label: string;
  path: string;
  external?: boolean;
  download?: boolean;
  // Matches a complianceDocs doc's `key` field — when present, this link's
  // path/external/download are resolved from that Firestore doc instead
  // (falling back to the hardcoded values above), so replacing the PDF via
  // /admin's Compliance Documents section keeps this page in sync with the
  // footer automatically.
  key?: string;
}

interface DisclosureItem {
  label: string;
  status: string;
  links?: DisclosureLink[];
}

interface DisclosureSection {
  title: string;
  items: DisclosureItem[];
}

// Mirrors the UGC-mandated "Public Self-Disclosure" checklist VWU is
// required to publish (see https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FUGCPublicSelfDisclosure.pdf?alt=media&token=b47b4c4f-0b5c-4c3d-bc2d-813ef380d246 for the
// signed original) — same categories and items, but pointing at VWU's own
// live pages instead of the old svecw.edu.in site wherever an equivalent
// already exists on this site.
const sections: DisclosureSection[] = [
  {
    title: 'a) About HEI',
    items: [
      { label: 'About us: Overview', status: 'Available', links: [{ label: 'About VWU', path: '/about' }] },
      { label: 'Act and Statutes or MoA', status: 'Not Applicable' },
      { label: 'Institutional Development Plan', status: 'Available', links: [{ label: 'Institutional Development Plan', path: '/governance/idp' }] },
      { label: 'Constituent Units / Affiliated Colleges, Affiliating University (in case of Colleges), Off-campus / Off-shore campus / Learning Support Centres under ODL mode (wherever applicable)', status: 'Affiliated to JNTUK, Kakinada', links: [{ label: 'JNTUK Kakinada', path: 'https://www.jntuk.edu.in/', external: true }] },
      { label: 'Accreditation / Ranking status (NAAC, NBA, NIRF)', status: 'Available', links: [
        { label: 'NAAC Approvals', path: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNAACApprovals.pdf?alt=media&token=74745fe4-2332-4338-9f13-b753372b42d7', download: true, key: 'naac-approvals' },
        { label: 'NBA Approvals', path: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FNBAApprovals.pdf?alt=media&token=f25ad763-643d-4321-a36c-874029264996', download: true, key: 'nba-approvals' },
        { label: 'MHRD NIRF Reports', path: '/governance/nirf-reports' },
      ] },
      { label: 'Recognition / Approval (2(f), 12B, etc. as applicable)', status: 'Available', links: [{ label: 'UGC 12B & 2f Letter', path: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FUGC12B2FLetter.pdf?alt=media&token=1a8cb736-ddb9-46b6-a538-0d61085264ca', download: true, key: 'ugc-12b-2f' }] },
      { label: 'Annual Reports', status: 'Available', links: [{ label: 'Annual Reports & Reforms', path: '/governance/annual-reports' }] },
      { label: 'Annual Accounts including Balance Sheet, Income and Expenditure Account, Receipts and Payments Account along with Audit Report', status: 'Available', links: [{ label: 'Audited Statements', path: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWAuditStatements.pdf?alt=media&token=949e45f9-c171-404a-8578-9c5b0114f92f', download: true, key: 'audited-statements' }] },
      { label: 'Sponsoring body details, if any', status: 'Sri Vishnu Educational Society', links: [{ label: 'About SVES', path: '/about-sves' }] },
    ],
  },
  {
    title: 'b) Administration (Profiles with photographs and contact details)',
    items: [
      { label: 'Chancellor', status: 'Sri K. V. Vishnu Raju', links: [{ label: 'Core Executive Body', path: '/about#core-executive' }] },
      { label: 'Pro Chancellor', status: 'Sri Ravichandran Rajagopal', links: [{ label: 'Core Executive Body', path: '/about#core-executive' }] },
      { label: 'Vice-Chancellor', status: 'Sri K. Aditya Vissam', links: [{ label: 'Core Executive Body', path: '/about#core-executive' }] },
      { label: 'Pro-Vice-Chancellor (wherever applicable)', status: 'Sri K. Sai Sumant', links: [{ label: 'Core Executive Body', path: '/about#core-executive' }] },
      { label: 'Registrar', status: 'Not Applicable' },
      { label: 'Principal', status: 'Dr. G. Srinivasa Rao', links: [{ label: 'Core Executive Body', path: '/about#core-executive' }] },
      { label: 'Finance Officer', status: 'Mr. SSS Varma', links: [{ label: 'Finance Committee', path: '/governance/finance-committee' }] },
      { label: 'Controller of Examination', status: 'Dr. K. S. N. Raju', links: [{ label: 'Examination System', path: 'https://www.svecwexams.in/examinationsystem.jsp', external: true }] },
      { label: 'Chief Vigilance Officer', status: 'Mr. P. Venkata Rama Raju, Vice Principal', links: [{ label: 'Core Executive Body', path: '/about#core-executive' }] },
      { label: 'Ombudsperson', status: 'Justice B. V. Ranga Raju, JNTUK Ombudsman' },
      { label: 'Executive Council / Board of Governors (by whatever name called), Board of Management, Academic Council, Board of Studies, Finance Committee — composition and members with particulars', status: 'Available', links: [{ label: 'Governing Body', path: '/governance/governing-body' }] },
      { label: 'Internal Complaint Committee', status: 'Available', links: [{ label: 'Internal Committee (POSH)', path: '/governance/internal-committee' }] },
      { label: 'Academic Leadership (Dean / HoD of Schools / Departments / Centres)', status: 'HoD information published on each department page', links: [{ label: 'Faculty', path: '/faculty' }] },
    ],
  },
  {
    title: 'c) Academics',
    items: [
      { label: 'Details of Academic Programs', status: 'Available', links: [{ label: 'Programmes & Fee Structure', path: '/programmes-fee-structure' }] },
      { label: 'Academic Calendar', status: 'Available', links: [{ label: 'Academic Calendar', path: '/information#academic-calendar' }] },
      { label: 'Statutes / Ordinances pertaining to Academics / Examinations', status: 'Available', links: [{ label: 'Examination System', path: 'https://www.svecwexams.in/examinationsystem.jsp', external: true }] },
      { label: 'Schools / Departments / Centres', status: 'Available', links: [{ label: 'Academics', path: '/academics' }] },
      { label: 'Department / School / Centre wise faculty / staff details with photographs', status: 'Available', links: [{ label: 'Faculty', path: '/faculty' }] },
      { label: 'List of UGC-recognized ODL / Online programs, if any', status: 'No' },
      { label: 'Internal Quality Assurance Cell (IQAC)', status: 'Available', links: [{ label: 'IQAC', path: '/governance/about-iqac' }] },
      { label: 'Library', status: 'Available', links: [{ label: 'Central Library', path: '/campus/central-library' }] },
      { label: 'Academic collaborations', status: 'Available', links: [{ label: 'MoUs', path: '/research/mous' }] },
    ],
  },
  {
    title: 'd) Admissions & Fee',
    items: [
      { label: 'Prospectus (including fee structure for various programs)', status: 'Available', links: [{ label: 'Programmes & Fee Structure', path: '/programmes-fee-structure' }] },
      { label: 'Admission process and guidelines', status: 'Available', links: [{ label: 'Admission Procedure', path: '/admission-procedure' }] },
      { label: 'Fee refund policy', status: 'As per Andhra Pradesh State Govt. Norms' },
    ],
  },
  {
    title: 'e) Research',
    items: [
      { label: 'Research and Development Cell (including Research and Consultancy Projects, Foreign Collaboration)', status: 'Available', links: [{ label: 'Research Advisory Committee', path: '/research/research-advisory-committee' }] },
      { label: 'Industry Collaborations / Incubation Centre / Start-ups / Entrepreneurship Cell', status: 'Available', links: [{ label: 'Vishnu Technology Business Incubator', path: '/differentiators/vishnu-tbi' }] },
      { label: 'Central facilities', status: 'Published under Differentiators', links: [{ label: 'Differentiators', path: '/differentiators' }] },
    ],
  },
  {
    title: 'f) Student Life',
    items: [
      { label: 'Sports facilities', status: 'Available', links: [{ label: 'Sports & Games', path: '/sports-games' }] },
      { label: 'NCC / NSS — Details', status: 'Available', links: [{ label: 'Social Services (NSS)', path: '/social-services' }] },
      { label: 'Hostel details (wherever applicable)', status: 'Available', links: [{ label: 'Campus Hostels', path: '/campus/campus-hostels' }] },
      { label: 'Placement Cell and its activities', status: 'Available', links: [{ label: 'Placement Details', path: '/placements/placement-details' }] },
      { label: 'Details of Student Grievance Redressal Committee (SGRC) and Ombudsperson', status: 'Available', links: [{ label: 'Student Grievance Redressal Committee', path: '/governance/student-grievance' }] },
      { label: 'Health facilities', status: 'Available', links: [{ label: 'Health Care', path: '/campus/health-care' }] },
      { label: 'Internal Complaint Committee', status: 'Available', links: [{ label: 'Internal Committee (POSH)', path: '/governance/internal-committee' }] },
      { label: 'Anti-Ragging Cell', status: 'Available', links: [{ label: 'Anti Ragging Committee', path: '/governance/anti-ragging' }] },
      { label: 'Equal Opportunity Cell', status: 'Available', links: [{ label: 'Governance', path: '/governance' }] },
      { label: 'Socio-Economically Disadvantaged Groups Cell (SEDG)', status: 'Available', links: [{ label: 'SC/ST Cell', path: '/governance/sc-st-cell' }] },
      { label: 'Facilities for differently-abled (e.g. barrier-free environment)', status: 'Available', links: [{ label: 'Facilities for Physically Challenged', path: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FSVECWPhysicallyChallengedFacilities.pdf?alt=media&token=168a11aa-9a64-4f19-94bc-8a022ce558bc', download: true, key: 'facilities-physically-challenged' }] },
    ],
  },
  {
    title: 'g) Alumni',
    items: [
      { label: 'Alumni Association with details', status: 'Available', links: [{ label: 'Alumni & Giving', path: '/alumni-giving' }] },
    ],
  },
  {
    title: 'h) Information Corner',
    items: [
      { label: 'RTI: Details of Central Public Information Officer (CPIO) and Appellate Authority (wherever applicable)', status: 'Available', links: [{ label: 'RTI Undertaking', path: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FRTIUndertaking.pdf?alt=media&token=7751fc00-5c24-4bfd-a28c-cde52bd5a27f', download: true, key: 'rti-undertaking' }] },
      { label: 'Circulars and Notices', status: 'Available in Flash News on the Home Page', links: [{ label: 'Home', path: '/' }] },
      { label: 'Announcements', status: 'Available under "Latest happenings" on the Home Page', links: [{ label: 'Home', path: '/' }] },
      { label: 'Newsletters', status: 'Available', links: [{ label: 'Campus Magazines', path: '/campus-magazines' }] },
      { label: 'News, Recent events & Achievements', status: 'Available', links: [{ label: 'Happenings at VWU', path: '/news-awards/happenings' }] },
      { label: 'Job openings', status: 'Available', links: [{ label: 'Careers', path: '/careers' }] },
      { label: 'Reservation Roster (wherever applicable)', status: 'Admission details sent to APSCHE' },
      { label: 'Study in India', status: 'Not Applicable' },
      { label: 'Admission procedure and facilities provided to International Students', status: 'Available', links: [{ label: 'Admission Procedure', path: '/admission-procedure' }] },
    ],
  },
  {
    title: 'i) Picture Gallery',
    items: [
      { label: 'Photographs of all events', status: 'Available', links: [{ label: 'Gallery', path: '/news-awards/gallery' }] },
    ],
  },
  {
    title: 'j) Contact Us',
    items: [
      { label: 'Details with Phone Number, Official Email ID and Address, Location map', status: 'Available', links: [{ label: 'Contact Us', path: '/contact' }] },
      { label: 'Telephone Directory', status: 'Available', links: [{ label: 'Contact Us', path: '/contact' }] },
    ],
  },
];

function resolveLink(link: DisclosureLink, docsByKey: Map<string, ComplianceDocDoc>): DisclosureLink {
  const doc = link.key ? docsByKey.get(link.key) : undefined;
  if (!doc) return link;
  return {
    label: link.label,
    path: doc.fileUrl,
    external: doc.external,
    download: doc.external ? false : doc.download !== false,
  };
}

function DisclosureLinkItem({ link }: { link: DisclosureLink }) {
  const style = { color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' };
  if (link.external || link.download) {
    return (
      <a href={link.path} style={style} target={link.download ? undefined : '_blank'} rel="noopener noreferrer" download={link.download}>
        {link.label}{link.download ? ' ↓' : link.external ? ' ↗' : ''}
      </a>
    );
  }
  return <Link to={link.path} style={style}>{link.label}</Link>;
}

export default function UGCDisclosure() {
  useEffect(() => {
    document.title = "UGC Public Self-Disclosure | Vishnu Women's University";
  }, []);

  const { docs: liveComplianceDocs } = useOrderedCollection<ComplianceDocDoc>('complianceDocs', 'order');
  const complianceDocs = liveComplianceDocs.length > 0 ? liveComplianceDocs : (DEFAULT_COMPLIANCE_DOCS as ComplianceDocDoc[]);
  const docsByKey = new Map(complianceDocs.filter((d) => d.key).map((d) => [d.key, d]));

  return (
    <main className="page-wrapper">
      <SEO
        title="UGC Public Self-Disclosure | Vishnu Women's University"
        description="Official UGC Mandatory Public Self-Disclosure of Shri Vishnu Engineering College for Women / Vishnu Women's University, Bhimavaram."
        canonicalPath="/disclosures/ugc"
        jsonLd={getBreadcrumbSchema([{ name: 'UGC Public Self-Disclosure', url: '/disclosures/ugc' }])}
      />
      <PageHero
        page="disclosures-ugc"
        defaultTitle="UGC Public Self-Disclosure"
        defaultSubtitle="Shri Vishnu Engineering College for Women (Autonomous) — published as required by the University Grants Commission."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'UGC Public Self-Disclosure' }]}
      />

      <section className="section bg-white">
        <div className="container">
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, maxWidth: 820, marginBottom: 'var(--space-4)' }}>
            We hereby give an undertaking that all the Regulations notified by the University Grants
            Commission, New Delhi, will be followed in letter and spirit by Shri Vishnu Engineering
            College for Women (Autonomous), Bhimavaram, West Godavari District, Andhra Pradesh, from
            time to time.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6, maxWidth: 820 }}>
            The signed original of this disclosure is also available as a downloadable PDF —{' '}
            <a href="https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FUGCPublicSelfDisclosure.pdf?alt=media&token=b47b4c4f-0b5c-4c3d-bc2d-813ef380d246" download style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              UGC Public Self Disclosure ↓
            </a>.
          </p>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="section bg-off-white" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
          <div className="container">
            <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: 'var(--space-5)' }}>{section.title}</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, width: '40%' }}>Item</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700 }}>Availability / Details</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', color: 'var(--color-white)', fontWeight: 700, width: '22%' }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, i) => (
                    <tr key={item.label} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-primary)', fontWeight: 600, lineHeight: 1.5 }}>{item.label}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text)', lineHeight: 1.5 }}>{item.status}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', lineHeight: 1.8 }}>
                        {item.links?.map((link) => (
                          <div key={link.label}><DisclosureLinkItem link={resolveLink(link, docsByKey)} /></div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>More Compliance &amp; Disclosures</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/governance" className="btn btn-accent">Governance</Link>
            <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
