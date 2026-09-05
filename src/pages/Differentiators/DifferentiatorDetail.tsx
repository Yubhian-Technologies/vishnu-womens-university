import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Rocket, Factory, Microscope, Globe2, GraduationCap } from 'lucide-react';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import RouteFallback from '../../components/RouteFallback/RouteFallback';
import { useOrderedCollection, type WithId } from '../../hooks/useCollection';
import { usePageBanners } from '../../hooks/usePageBanners';
import { fetchPriorityAttr } from '../../lib/domAttrs';
import { CustomSectionsIntro, CustomSectionsAccordion, CustomSectionsPlain, CustomSectionsPills } from '../../components/CustomSectionsRenderer/CustomSectionsRenderer';
import CustomTabsPage, { type TabItem } from '../../components/CustomTabsPage/CustomTabsPage';
import FacultyCarousel from '../../components/FacultyCarousel/FacultyCarousel';
import { hasTabContent, type CustomTab } from '../../lib/customTabs';
import { DIFFERENTIATOR_CATEGORIES } from '../Admin/sections/DifferentiatorsAdmin';
import type { DifferentiatorItemDoc } from '../Admin/sections/DifferentiatorsAdmin';
import type { FacultyDoc } from '../Academics/Faculty';
import type { AicteIdeaLabTeamMemberDoc } from '../Admin/sections/AicteIdeaLabTeamAdmin';
import type { AicteIdeaLabAmbassadorDoc } from '../Admin/sections/AicteIdeaLabAmbassadorsAdmin';
import { aicteIdeaLab } from './aicteIdeaLab.data';
import { institutionInnovationCell } from './institutionInnovationCell.data';
import { vehicleDesignLab } from './vehicleDesignLab.data';
import { talentSprintWise } from './talentSprintWise.data';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../detail-layout.css';
import './DifferentiatorDetail.css';

function IicMemberCard({ name, role, size = 96, photoUrl }: { name: string; role: string; size?: number; photoUrl?: string }) {
  return (
    <div style={{ border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-2)' }}>
      <img
        src={photoUrl || PHOTO_NEEDED_PLACEHOLDER}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-light-gray)' }}
      />
      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>{name}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{role}</span>
    </div>
  );
}


interface IicDocEntryDoc extends WithId {
  label: string;
  fileUrl: string;
  order: number;
}

interface IicCouncilMemberDoc extends WithId {
  name: string;
  role: string;
  tier: 'chairman' | 'leadership' | 'coordinator';
  imageUrl: string;
  order: number;
}

// "IIC – Constitution"'s council roster (add/edit/remove/reorder,
// IicCouncilMembersAdmin.tsx) and single council-members PDF link,
// "Innovation Ambassadors"'s and "IIC Activities"'s PDF-link lists, and the
// 4 fully Firestore-driven tabs (Rating Certificates / IIC Annual Reports /
// SIH Internal Hackathon Reports / National Innovation Start-Up Policy, all
// via IicDocumentsAdmin.tsx) all stay exactly as they did before — rendered
// alongside whatever dynamic tabs the admin has defined.
function IicPage({ iic, tabs }: { iic: typeof institutionInnovationCell; tabs: CustomTab[] }) {
  const { docs: councilMembers } = useOrderedCollection<IicCouncilMemberDoc>('iicCouncilMembers', 'order');
  const byTier = (tier: IicCouncilMemberDoc['tier']) => councilMembers.filter((m) => m.tier === tier);
  const { docs: councilMembersLinks } = useOrderedCollection<IicDocEntryDoc>('iicCouncilMembersLinks', 'order');
  const { docs: innovationAmbassadorLinks } = useOrderedCollection<IicDocEntryDoc>('iicInnovationAmbassadorLinks', 'order');
  const { docs: iicActivityYears } = useOrderedCollection<IicDocEntryDoc>('iicActivities', 'order');
  const { docs: ratingCertificates } = useOrderedCollection<IicDocEntryDoc>('iicRatingCertificates', 'order');
  const { docs: annualReports } = useOrderedCollection<IicDocEntryDoc>('iicAnnualReports', 'order');
  const { docs: sihHackathonReports } = useOrderedCollection<IicDocEntryDoc>('iicSihHackathonReports', 'order');
  const { docs: nispPolicies } = useOrderedCollection<IicDocEntryDoc>('iicNispPolicies', 'order');

  const fixedList = (docs: IicDocEntryDoc[]) => (
    docs.length === 0 ? (
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>Content for this section is coming soon.</p>
    ) : (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {docs.map((d) => (
          <li key={d.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <a href={d.fileUrl} download style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-base)' }}>{d.label}</a>
          </li>
        ))}
      </ul>
    )
  );

  const dynamicTabItems: TabItem[] = tabs.map((tab): TabItem => {
    let fixedExtra: ReactNode = null;
    if (tab.label === 'IIC – Constitution') {
      // One flat, uniform grid — Chairman/Leadership/Coordinator are still
      // shown as each person's own role text, but no longer get a visually
      // distinct tier (different card size / centered row / etc.); every
      // card is the same size, fixed at 3 per row (see .iic-council-grid).
      const allMembers = [...byTier('chairman'), ...byTier('leadership'), ...byTier('coordinator')];
      fixedExtra = (
        <div style={{ marginTop: 'var(--space-6)' }}>
          {allMembers.length > 0 && (
            <div className="iic-council-grid" style={{ marginBottom: 'var(--space-6)' }}>
              {allMembers.map((person) => (
                <IicMemberCard key={person.id} name={person.name} role={person.role} size={84} photoUrl={person.imageUrl} />
              ))}
            </div>
          )}
          {councilMembersLinks.length > 0 && (
            <p style={{ fontSize: 'var(--text-sm)' }}>
              <a href={councilMembersLinks[0].fileUrl} download style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                {councilMembersLinks[0].label}
              </a>
            </p>
          )}
        </div>
      );
    } else if (tab.label === 'Innovation Ambassadors') {
      // The role-description paragraph, responsibilities, and the caption
      // above the PDF links are this tab's own admin-editable Custom
      // Sections content ("About Innovation Ambassadors" / "Ambassador
      // List") — only the PDF links list itself stays fixed, same hybrid
      // pattern as "IIC – Constitution" above.
      fixedExtra = (
        <div style={{ marginTop: 'var(--space-6)' }}>
          {fixedList(innovationAmbassadorLinks)}
        </div>
      );
    } else if (tab.label === 'IIC Activities') {
      fixedExtra = <div style={{ marginTop: 'var(--space-6)' }}>{fixedList(iicActivityYears)}</div>;
    }
    return {
      id: tab.id,
      label: tab.label,
      content: (
        <>
          {tab.sectionsDisplay === 'pills' ? <CustomSectionsPills sections={tab.sections} /> : <CustomSectionsPlain sections={tab.sections} />}
          {fixedExtra}
        </>
      ),
    };
  });

  const mergedTabs: TabItem[] = [
    ...dynamicTabItems,
    { id: 'rating-certificates', label: 'Rating Certificates', content: fixedList(ratingCertificates) },
    { id: 'iic-annual-reports', label: 'IIC Annual Reports', content: fixedList(annualReports) },
    { id: 'sih-hackathon-reports', label: 'SIH Internal Hackathon Reports', content: fixedList(sihHackathonReports) },
    {
      id: 'nisp',
      label: 'National Innovation Start-Up Policy',
      heading: iic.nisp.heading,
      content: nispPolicies.length === 0 ? (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>Content for this section is coming soon.</p>
      ) : (
        <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {nispPolicies.map((row, i) => (
            <div
              key={row.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)', background: i % 2 === 0 ? 'var(--color-off-white)' : 'var(--color-white)' }}
            >
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>{row.label}</span>
              <a href={row.fileUrl} download style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>Click here..</a>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const defaultTabId = tabs.find(hasTabContent)?.id ?? mergedTabs[0]?.id;
  return <CustomTabsPage tabs={mergedTabs} defaultTabId={defaultTabId} />;
}

// Facility-phase/industry-collab photos used to be matched to this content
// by array position or endowment id (VdlFacilitiesPhotosAdmin.tsx) — that
// panel is retired along with these tabs' conversion; a "Photos" files
// section in each tab lets the admin re-add them freely instead. The
// achievement-reports list (VdlAchievementsAdmin.tsx, already
// freely-addable Firestore CRUD) stays exactly as it did before, rendered
// directly below the "Students Achievements & Placements" tab's dynamic
// content.
function VdlPage({ tabs }: { tabs: CustomTab[] }) {
  const { docs: vdlAchievementReportDocs } = useOrderedCollection<WithId & { label: string; fileUrl: string }>('vdlAchievementReports', 'order');

  const dynamicTabItems: TabItem[] = tabs.map((tab): TabItem => {
    let fixedExtra: ReactNode = null;
    if (tab.label === 'Students Achievements & Placements' && vdlAchievementReportDocs.length > 0) {
      fixedExtra = (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
            Achievement Reports
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {vdlAchievementReportDocs.map((d) => (
              <li key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <a href={d.fileUrl} download style={{ fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontWeight: 600 }}>{d.label}</a>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return {
      id: tab.id,
      label: tab.label,
      content: (
        <>
          {tab.sectionsDisplay === 'pills' ? <CustomSectionsPills sections={tab.sections} /> : <CustomSectionsPlain sections={tab.sections} />}
          {fixedExtra}
        </>
      ),
    };
  });

  const defaultTabId = tabs.find(hasTabContent)?.id ?? dynamicTabItems[0]?.id;
  return <CustomTabsPage tabs={dynamicTabItems} defaultTabId={defaultTabId} />;
}

// All 9 tabs are fully admin-defined now. Team/Testimonial/ELITE-project/
// NSE-clipping photos used to be admin-uploaded per fixed hardcoded id
// (WiseTeamPhotosAdmin.tsx etc.) — those panels are retired along with this
// page's conversion; a "Photos" files section within the matching tab lets
// the admin re-add them, just without the old per-item fixed slot.
function WisePage({ tabs }: { tabs: CustomTab[] }) {
  const tabItems: TabItem[] = tabs.map((tab) => ({ id: tab.id, label: tab.label, content: tab.sectionsDisplay === 'pills' ? <CustomSectionsPills sections={tab.sections} /> : <CustomSectionsPlain sections={tab.sections} /> }));
  const defaultTabId = tabs.find(hasTabContent)?.id ?? tabItems[0]?.id;
  return <CustomTabsPage tabs={tabItems} defaultTabId={defaultTabId} />;
}

const IDEA_LAB_TABLE_TH_STYLE: CSSProperties = {
  textAlign: 'left',
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--color-primary-dark, var(--color-primary))',
  fontWeight: 900,
  whiteSpace: 'nowrap',
};
const IDEA_LAB_TABLE_TD_STYLE: CSSProperties = {
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--color-text)',
  fontSize: 'var(--text-sm)',
};

function IdeaLabTeamTable({ team }: { team: AicteIdeaLabTeamMemberDoc[] }) {
  if (team.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>
        Content for this section is coming soon.
      </p>
    );
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ background: 'var(--color-accent)' }}>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>S.No</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>Name of the Faculty</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>Designation</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>Role</th>
          </tr>
        </thead>
        <tbody>
          {team.map((m, i) => (
            <tr key={m.id} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'transparent' }}>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{i + 1}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{m.name}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{m.designation}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{m.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IdeaLabAmbassadorsTable({ ambassadors }: { ambassadors: AicteIdeaLabAmbassadorDoc[] }) {
  if (ambassadors.length === 0) {
    return (
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-light)' }}>
        Content for this section is coming soon.
      </p>
    );
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ background: 'var(--color-accent)' }}>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>S.No</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>Reg. Number</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>Name of the Student</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>Year</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>Branch</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>WhatsApp Number</th>
            <th style={IDEA_LAB_TABLE_TH_STYLE}>E Mail Id</th>
          </tr>
        </thead>
        <tbody>
          {ambassadors.map((a, i) => (
            <tr key={a.id} style={{ background: i % 2 === 0 ? 'var(--color-off-white)' : 'transparent' }}>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{i + 1}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{a.regNumber}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{a.name}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{a.year}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{a.branch}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>{a.whatsapp}</td>
              <td style={IDEA_LAB_TABLE_TD_STYLE}>
                <a href={`mailto:${a.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{a.email}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Shown until real photos are uploaded from the admin's "AICTE IDEA Lab
// Facility Photos" section — a fixed bank of placeholder tiles rather than
// an empty gap, so the tab reads as "content coming" rather than broken.
const IDEA_LAB_FACILITY_PLACEHOLDER_COUNT = 6;

function IdeaLabFacilitiesGrid({ photos }: { photos: (WithId & { imageUrl: string })[] }) {
  const tiles = photos.length > 0
    ? photos
    : Array.from({ length: IDEA_LAB_FACILITY_PLACEHOLDER_COUNT }, (_, i) => ({ id: `placeholder-${i}`, imageUrl: PHOTO_NEEDED_PLACEHOLDER }));
  // A plain CSS grid forces every row to the height of its tallest photo,
  // leaving ragged gaps under the shorter ones next to it whenever photos
  // don't share an aspect ratio (masonry packs them tightly instead) — and
  // unlike a fixed-height + object-fit:cover grid, this never re-crops a
  // photo beyond however the admin already cropped it on upload.
  return (
    <div style={{ columns: '220px 3', columnGap: 'var(--space-4)' }}>
      {tiles.map((p) => (
        <img
          key={p.id}
          src={p.imageUrl}
          alt="AICTE IDEA Lab facility"
          style={{ width: '100%', height: 'auto', display: 'block', marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-light-gray)', breakInside: 'avoid' }}
        />
      ))}
    </div>
  );
}

// Team, Student Ambassadors, and Facilities are already fully
// Firestore-driven, freely-addable CRUD (AicteIdeaLabTeamAdmin.tsx /
// AicteIdeaLabAmbassadorsAdmin.tsx / AicteIdeaLabFacilityPhotosAdmin.tsx) —
// those stay exactly as they did before, as fixed tabs alongside whatever
// dynamic tabs the admin has defined.
function IdeaLabPage({ tabs }: { tabs: CustomTab[] }) {
  const { docs: team } = useOrderedCollection<AicteIdeaLabTeamMemberDoc>('aicteIdeaLabTeam', 'order');
  const { docs: ambassadors } = useOrderedCollection<AicteIdeaLabAmbassadorDoc>('aicteIdeaLabAmbassadors', 'order');
  const { docs: facilityPhotos } = useOrderedCollection<WithId & { imageUrl: string }>('aicteIdeaLabFacilityPhotos', 'order');

  const mergedTabs: TabItem[] = [
    ...tabs.map((tab): TabItem => ({ id: tab.id, label: tab.label, content: tab.sectionsDisplay === 'pills' ? <CustomSectionsPills sections={tab.sections} /> : <CustomSectionsPlain sections={tab.sections} /> })),
    { id: 'team', label: 'Team', eyebrow: 'Team', heading: 'VWU AICTE IDEA LAB Team', content: <IdeaLabTeamTable team={team} /> },
    { id: 'student-ambassadors', label: 'Student Ambassadors', content: <IdeaLabAmbassadorsTable ambassadors={ambassadors} /> },
    { id: 'facilities', label: 'Facilities', eyebrow: 'Infrastructure', heading: 'Facilities Available in AICTE – IDEA LAB', content: <IdeaLabFacilitiesGrid photos={facilityPhotos} /> },
  ];

  const defaultTabId = tabs.find(hasTabContent)?.id ?? mergedTabs[0]?.id;
  return <CustomTabsPage tabs={mergedTabs} defaultTabId={defaultTabId} />;
}

const CATEGORY_ICONS: Record<string, typeof Rocket> = {
  innovation: Rocket, industry: Factory, research: Microscope, global: Globe2, student: GraduationCap,
};

export default function DifferentiatorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { docs: allItems, loading } = useOrderedCollection<DifferentiatorItemDoc>('differentiatorItems', 'order');
  const { slides: heroSlides } = usePageBanners('differentiators-detail');
  const { docs: rwtpReportLinkDocs } = useOrderedCollection<WithId & { label: string; fileUrl: string }>('rwtpReportLinks', 'order');
  const { docs: allFaculty } = useOrderedCollection<FacultyDoc>('faculty', 'order');
  const item = allItems.find((i) => i.slug === slug) ?? null;
  const category = item ? DIFFERENTIATOR_CATEGORIES.find((c) => c.id === item.category) : null;

  useEffect(() => {
    if (item) {
      document.title = `${item.title} | Vishnu Women's University`;
    }
  }, [item]);

  if (!item || !category) {
    if (loading) {
      return (
        <RouteFallback />
      );
    }
    return <Navigate to="/differentiators" replace />;
  }

  // External items (TBI, VJOC, Vishnu Student Success Centre, Radio Vishnu, School of
  // Music, ...) have no internal detail page — both the card grid and the nav dropdown
  // send visitors straight to item.url, so this route should never render for them.
  if (item.external && item.url) {
    return <Navigate to="/differentiators" replace />;
  }

  const CategoryIcon = CATEGORY_ICONS[category.id] || Rocket;
  const faculty = item.department ? allFaculty.filter((f) => f.department === item.department) : [];
  const heroImage = item.heroImage || heroSlides[0]?.imageUrl;
  const ideaLab = item.slug === 'aicte-idea-lab' ? aicteIdeaLab : null;
  const iic = item.slug === 'institution-innovation-cell' ? institutionInnovationCell : null;
  const vdl = item.slug === 'vehicle-design-lab' ? vehicleDesignLab : null;
  const wise = item.slug === 'talentsprint-wise' ? talentSprintWise : null;

  return (
    <main className="page-wrapper">
      {/* Hero — Department Hero Card Design */}
      <section className="dept-hero-section">
        <div className="container">
          <div className="dept-hero-card">
            {heroImage && (
              <SmoothImage src={heroImage} alt={item.title} className="dept-hero-bg-img" loading="eager" decoding="sync" {...fetchPriorityAttr('high')} />
            )}
            <div className="dept-hero-overlay" />
            <div className="dept-hero-content">
              <div className="breadcrumb animate-fade-in" style={{ marginBottom: '0.8rem' }}>
                <Link to="/" className="breadcrumb-item">Home</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to="/differentiators" className="breadcrumb-item">Differentiators</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to={`/differentiators#${category.id}`} className="breadcrumb-item">{category.label}</Link>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-item active">{item.title}</span>
              </div>
              <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#C9973A', color: '#0B1E42', fontSize: 'var(--text-xs)', fontWeight: 800, padding: '0.35rem 0.9rem', borderRadius: '9999px', marginBottom: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <CategoryIcon size={14} /> {category.label}
              </div>
              <h1 className="dept-hero-title">{item.title}</h1>
              {item.summary && (
                <p className="dept-hero-subtitle">{item.summary}</p>
              )}
              <div className="dept-hero-cta">
                <Link to="/apply-now" className="btn-hero-gold">Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro — Institution Innovation Cell, Vehicle Design Lab, and
          TalentSprint – WISE each get their own dedicated tabbed page below
          instead, since they have a persistent section nav sidebar rather
          than the generic Key Highlights sidebar. */}
      {!iic && !vdl && !wise && !ideaLab && (
      <section className="section bg-white">
        <div className="container">
          <div className="detail-grid">
            {/* Main content — same "About the Department" card treatment as
                the academic department pages (see .dept-about-* in
                detail-layout.css): accent-bordered gradient card, section
                label + title header above it. */}
            <div className="dept-about-main">
              <div className="dept-about-header">
                <span className="section-label dept-section-label">Overview</span>
                <h2 className="section-title">
                  <span style={{ fontWeight: 400 }}>About </span>
                  <span style={{ fontWeight: 800 }}>{item.title}</span>
                </h2>
              </div>

              <div className="dept-about-card">
                {item.intro && <p className="dept-about-lead-text">{item.intro}</p>}
                {item.about && (
                  <p
                    className="dept-about-lead-text"
                    style={{ marginTop: item.intro ? 'var(--space-4)' : 0, color: 'var(--color-text-light)' }}
                  >
                    {item.about}
                  </p>
                )}
                {!item.intro && !item.about && <p className="dept-about-lead-text">{item.desc}</p>}
              </div>

              {/* Admin-defined custom sections (see lib/customSections.ts) —
                  used by items whose real content used to be hardcoded with
                  no admin field at all (Ultra Tech CoE, Concrete Canoe Lab,
                  Dream House Construction Lab), and available to any other
                  item that adds its own. 'intro'-placed sections (e.g.
                  Vision/Mission/Objectives) render compactly right here;
                  everything else renders as a collapsible accordion below. */}
              <CustomSectionsIntro sections={item.customSections || []} />
              <CustomSectionsAccordion sections={item.customSections || []} />
            </div>

            {/* Sidebar: key highlights — editorial "spec sheet" card */}
            <div className="detail-sidebar">
              <aside className="dh-card">
                <div className="dh-card__head">
                  <h3 className="dh-card__title">Key Highlights</h3>
                  {(item.highlights || []).length > 0 && (
                    <span className="dh-card__count">{(item.highlights || []).length}</span>
                  )}
                </div>
                <ol className="dh-list">
                  {(item.highlights || []).map((h, i) => (
                    <li key={h} className="dh-list__row">
                      <span className="dh-list__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <span className="dh-list__text">{h}</span>
                    </li>
                  ))}
                </ol>
                {item.partners && item.partners.length > 0 && (
                  <div className="dh-card__foot">
                    <p className="dh-card__foot-label">In partnership with</p>
                    <div className="dh-chips">
                      {item.partners.map((p) => (
                        <span key={p} className="dh-chip">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Rural Women Tech Park's Report Links are admin-managed separately
          (Admin > Differentiators > Rural Women Tech Park > Report Links)
          — shown as their own labeled block here since a generic section
          has no way to know these specific entries are download links. */}
      {item.slug === 'rural-women-tech-park' && rwtpReportLinkDocs.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Reports</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Report Links</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {rwtpReportLinkDocs.map((link) => (
                <a key={link.id} href={link.fileUrl} download style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Institution Innovation Cell's own tabbed page (About IIC / IIC –
          Constitution / and 7 more sections navigable from its sidebar). */}
      {iic && <IicPage iic={iic} tabs={item.tabs || []} />}

      {/* Vehicle Design Lab's own tabbed page (About VDL / Facilities &
          Projects / and 3 more sections navigable from its sidebar). */}
      {vdl && <VdlPage tabs={item.tabs || []} />}

      {/* TalentSprint – WISE's own tabbed page (About WISE / Beneficiaries –
          Placements / and 7 more sections navigable from its sidebar). */}
      {wise && <WisePage tabs={item.tabs || []} />}

      {/* AICTE IDEA Lab's own tabbed page (About AICTE IDEA Lab / Team /
          Student Ambassadors / Facilities navigable from its sidebar). */}
      {ideaLab && <IdeaLabPage tabs={item.tabs || []} />}

      {/* Faculty — shown only when this differentiator is linked to a
          teaching department (item.department). Reuses the Academics faculty
          grid + the shared `faculty` collection, so the roster is never
          re-entered here. No .reveal (Firestore-gated — see CLAUDE.md). */}
      {faculty.length > 0 && (
        <div id="faculty" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
          <FacultyCarousel faculty={faculty} title="Faculty" viewMoreLink="/faculty" />
        </div>
      )}

      {/* Facilities */}
      {item.facilities && item.facilities.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Infrastructure</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Facilities & Equipment</h2>
            </div>
            <div className="diff-detail-card-grid diff-detail-card-grid--facilities">
              {item.facilities.map((f) => (
                <div key={f} className="diff-detail-card">
                  <div className="diff-detail-card-dot" />
                  <span className="diff-detail-card-text" style={{ fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outcomes — background alternates with whether Facilities rendered
          just above it (hardcoding bg-white here assumed Facilities, which
          is bg-off-white, always precedes it; when an item has no facilities
          data — e.g. TalentSprint – WISE — Outcomes landed directly under
          Overview with the *same* bg-white and no visual break between them,
          which read as a single oversized blank gap rather than two sections). */}
      {item.outcomes && item.outcomes.length > 0 && (
        <section className={`section ${item.facilities && item.facilities.length > 0 ? 'bg-white' : 'bg-off-white'}`}>
          <div className="container">
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <span className="section-label">Impact</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>Outcomes & Achievements</h2>
            </div>
            <div className="dh-outcome-grid">
              {item.outcomes.map((o, i) => (
                <div key={o} className="dh-outcome">
                  <span className="dh-outcome__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <p className="dh-outcome__text">{o}</p>
                </div>
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
              Explore More Differentiators
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto var(--space-6)' }}>
              Discover all the unique initiatives, labs, and centres that make VWU an extraordinary place to learn and grow.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/differentiators" className="btn btn-accent">All Differentiators</Link>
              <Link to="/apply-now" className="btn btn-secondary">Apply Now</Link>
              <Link to="/academics" className="btn btn-secondary">Academics</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
