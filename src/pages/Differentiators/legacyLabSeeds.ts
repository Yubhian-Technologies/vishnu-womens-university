// One-time converters from this repo's old hardcoded lab/centre data files
// (ultraTechCoe.data.ts / concreteCanoeLab.data.ts /
// dreamHouseConstructionLab.data.ts — none of which were ever wired to
// Firestore, so admins had no way to edit them) into the generic
// CustomSection tree the Differentiators admin now edits directly. Used only
// by the "Add starter content" button in DifferentiatorsAdmin.tsx — once an
// admin seeds an item, these functions are never touched again for it.
//
// The .data.ts files themselves aren't modified or removed — they're just
// read here instead of by DifferentiatorDetail.tsx, which now renders these
// three items through the generic CustomSectionsIntro/CustomSectionsAccordion
// like any other admin-defined content. The old "overview" paragraphs aren't
// seeded as a custom section — DifferentiatorItemDoc already has an `about`
// field for exactly this (rendered generically above these sections), so
// the seed writes there instead of creating a duplicate section.
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ultraTechCoe } from './ultraTechCoe.data';
import { concreteCanoeLab } from './concreteCanoeLab.data';
import { dreamHouseConstructionLab } from './dreamHouseConstructionLab.data';
import { talentSprintWise, type WiseModuleTab, type WiseModuleSection } from './talentSprintWise.data';
import { institutionInnovationCell } from './institutionInnovationCell.data';
import { vehicleDesignLab } from './vehicleDesignLab.data';
import { aicteIdeaLab } from './aicteIdeaLab.data';
import { generateSectionId, type CustomSection, type CustomSectionFile, type CustomSectionPhoto } from '../../lib/customSections';
import { generateTabId, type CustomTab } from '../../lib/customTabs';
import { serializeFlexibleTable, type FlexibleTableSection } from '../../lib/structuredTable';

export interface LegacyLabSeed {
  sections: CustomSection[];
  about: string;
}

interface Member {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
  website?: string;
}

function formatMember(m: Member): string {
  const lines = [
    m.designation ? `${m.name} — ${m.designation}` : m.name,
    m.email ? `Email: ${m.email}` : '',
    m.mobile ? `Mobile: ${m.mobile}` : '',
    m.interests ? `Interests: ${m.interests}` : '',
    m.website ? `Website: ${m.website}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function table(sections: FlexibleTableSection[]): string {
  return serializeFlexibleTable(sections);
}

// Appends a new section (or sub-section) to `list`, generating its id from
// the whole tree built so far so ids stay unique within this one seed.
function push(list: CustomSection[], section: Omit<CustomSection, 'id'>): CustomSection {
  const full: CustomSection = { ...section, id: generateSectionId(section.label, list) };
  list.push(full);
  return full;
}

// ---------------------------------------------------------------------
// Photo migration — the old dedicated photo admin panels (WiseTeamPhotosAdmin
// and its siblings, VdlFacilitiesPhotosAdmin) wrote directly to these
// Firestore collections; those panels are gone now that WISE/VDL are
// admin-editable Custom Tabs, but the photos themselves were never deleted.
// These helpers read them once, at seed time, so re-adding this tab's
// content brings already-uploaded photos back automatically instead of
// losing them. Read-only — nothing here ever writes to or deletes from the
// old collections.
interface LegacyPhotoDoc {
  imageUrl?: string;
  storagePath?: string;
  order?: number;
}

// wiseTeamPhotos / wiseEliteProjectPhotos / wiseTestimonialPhotos /
// wiseNseClippings / vdlIndustryCollabPhotos — one doc per entity, doc id
// fixed to that entity's own hardcoded `id` field.
async function fetchPhotoMap(collectionName: string): Promise<Map<string, CustomSectionPhoto>> {
  const map = new Map<string, CustomSectionPhoto>();
  if (!db) return map;
  const snap = await getDocs(collection(db, collectionName));
  snap.forEach((d) => {
    const data = d.data() as LegacyPhotoDoc;
    if (data.imageUrl) map.set(d.id, { imageUrl: data.imageUrl, storagePath: data.storagePath || '' });
  });
  return map;
}

// vdlDesignPhasePhotos / vdlFabricationPhasePhotos / vdlTestingPhotos /
// vdlMotorsportPhotos — a free ordered list per phase, but the old public
// page only ever showed the first (lowest `order`) photo, so migration only
// takes that one.
async function fetchFirstPhoto(collectionName: string): Promise<CustomSectionPhoto | undefined> {
  if (!db) return undefined;
  const snap = await getDocs(query(collection(db, collectionName), orderBy('order', 'asc'), limit(1)));
  const first = snap.docs[0]?.data() as LegacyPhotoDoc | undefined;
  return first?.imageUrl ? { imageUrl: first.imageUrl, storagePath: first.storagePath || '' } : undefined;
}

// vdlCampusVehiclePhotos — the one genuinely free multi-photo gallery here
// (every photo shown, not just the first), so it migrates into a 'files'
// section instead of a single entity photo.
async function fetchOrderedFiles(collectionName: string): Promise<CustomSectionFile[]> {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, collectionName), orderBy('order', 'asc')));
  return snap.docs
    .map((d) => d.data() as LegacyPhotoDoc)
    .filter((data) => !!data.imageUrl)
    .map((data, i) => ({ label: `Photo ${i + 1}`, fileUrl: data.imageUrl as string, storagePath: data.storagePath || '' }));
}

// Most entities won't have a migrated photo (only ones that were actually
// uploaded through the old panels do) — `photo: someMap.get(id)` would set
// the field to an explicit `undefined` for every entity that has none,
// which Firestore's updateDoc rejects outright. Spreading this in instead
// omits the key entirely when there's nothing to migrate.
function withPhoto(photo: CustomSectionPhoto | undefined): { photo?: CustomSectionPhoto } {
  return photo ? { photo } : {};
}

export function seedUltraTechCoeSections(): LegacyLabSeed {
  const d = ultraTechCoe;
  const sections: CustomSection[] = [];
  push(sections, { label: 'Vision', contentType: 'text', textContent: d.vision, placement: 'intro' });
  push(sections, { label: 'Mission', contentType: 'list', listText: d.mission.join('\n'), placement: 'intro' });
  push(sections, { label: 'Objectives', contentType: 'text', textContent: d.objectives, placement: 'intro' });
  push(sections, { label: 'In-charge', contentType: 'text', textContent: formatMember(d.inCharge) });
  push(sections, {
    label: 'Students Benefited',
    contentType: 'table',
    tableText: table([{
      title: '',
      headers: ['Year', 'Regd No', 'Name'],
      rows: d.studentsBenefited.flatMap((g) => g.students.map((s) => [g.yearLabel, s.regdNo, s.name])),
    }]),
  });
  push(sections, { label: 'Activities', contentType: 'list', listText: (d.accordionContent['Activities'] || []).join('\n') });
  return { sections, about: d.overview };
}

export function seedConcreteCanoeLabSections(): LegacyLabSeed {
  const d = concreteCanoeLab;
  const sections: CustomSection[] = [];
  push(sections, { label: 'Vision', contentType: 'text', textContent: d.vision, placement: 'intro' });
  push(sections, { label: 'Mission', contentType: 'list', listText: d.mission.join('\n'), placement: 'intro' });
  push(sections, { label: 'Objectives', contentType: 'list', listText: d.objectives.join('\n'), placement: 'intro' });
  push(sections, { label: 'In-charge', contentType: 'text', textContent: formatMember(d.inCharge) });

  const academicProjects = push(sections, {
    label: 'Academic Projects [Ongoing]',
    contentType: 'table',
    tableText: table([{ title: '', headers: d.academicProject.team.headers, rows: d.academicProject.team.rows }]),
  });
  academicProjects.subSections = [
    { id: generateSectionId('Project Details', sections), label: 'Project Details', contentType: 'text', textContent: [d.academicProject.heading, ...d.academicProject.paragraphs].join('\n\n') },
  ];

  // Cells here (e.g. "Length – 3.2m\nBeam width – 0.47m") legitimately
  // contain embedded newlines in the source data, rendered with <br/> by the
  // old bespoke table view — the generic table DSL is one-row-per-line and
  // can't represent that, so newlines are joined into one line instead.
  push(sections, {
    label: 'Previous Project Works',
    contentType: 'table',
    tableText: table([{
      title: '',
      headers: d.previousProjects.table.headers,
      rows: d.previousProjects.table.rows.map((row) => row.map((cell) => cell.replace(/\n/g, '; '))),
    }]),
  });

  push(sections, {
    label: 'Students Benefited',
    contentType: 'table',
    tableText: table([{
      title: '',
      headers: ['Team', 'Student'],
      rows: d.studentsBenefited.flatMap((t) => t.students.map((student) => [t.label, student])),
    }]),
  });

  push(sections, { label: 'Faculty Mentors', contentType: 'list', listText: d.facultyMentors.join('\n') });

  const outcomes = push(sections, {
    label: 'Outcomes',
    contentType: 'table',
    tableText: table([{ title: '', headers: d.outcomes.team.headers, rows: d.outcomes.team.rows }]),
  });
  outcomes.subSections = [
    {
      id: generateSectionId('Outcome Details', sections),
      label: 'Outcome Details',
      contentType: 'text',
      textContent: [d.outcomes.heading, d.outcomes.subheading, ...d.outcomes.paragraphs, `Brief: ${d.outcomes.brief}`].filter(Boolean).join('\n\n'),
    },
  ];

  push(sections, {
    label: 'Competitions',
    contentType: 'table',
    tableText: table([{
      title: '',
      headers: ['Name', 'Date', 'Students', 'Year', 'Remarks'],
      rows: d.competitions.map((c) => [c.name, c.date, c.students.join(', '), c.year, c.remarks]),
    }]),
  });

  push(sections, { label: 'Activities', contentType: 'list', listText: d.activities.join('\n') });
  return { sections, about: d.paragraphs.join('\n\n') };
}

export function seedDreamHouseLabSections(): LegacyLabSeed {
  const d = dreamHouseConstructionLab;
  const sections: CustomSection[] = [];
  push(sections, { label: 'Vision', contentType: 'text', textContent: d.vision, placement: 'intro' });
  push(sections, { label: 'Mission', contentType: 'list', listText: d.mission.join('\n'), placement: 'intro' });
  push(sections, { label: 'Objectives', contentType: 'list', listText: d.objectives.join('\n'), placement: 'intro' });
  push(sections, { label: 'In-charge', contentType: 'text', textContent: formatMember(d.inCharge) });

  const academicProjects = push(sections, {
    label: 'Academic Projects [Ongoing]',
    contentType: 'table',
    tableText: table([{ title: '', headers: d.academicProject.team.headers, rows: d.academicProject.team.rows }]),
  });
  academicProjects.subSections = [
    { id: generateSectionId('Project Details', sections), label: 'Project Details', contentType: 'text', textContent: [d.academicProject.heading, ...d.academicProject.paragraphs].join('\n\n') },
  ];

  push(sections, {
    label: 'Students Benefited',
    contentType: 'table',
    tableText: table([{
      title: '',
      headers: ['Year', 'Regd No', 'Name'],
      rows: d.studentsBenefited.flatMap((g) => g.students.map((s) => [g.yearLabel, s.regdNo, s.name])),
    }]),
  });

  const outcomes = push(sections, {
    label: 'Outcomes',
    contentType: 'table',
    tableText: table([{ title: '', headers: d.outcomes.team.headers, rows: d.outcomes.team.rows }]),
  });
  outcomes.subSections = [
    {
      id: generateSectionId('Outcome Details', sections),
      label: 'Outcome Details',
      contentType: 'text',
      textContent: [d.outcomes.heading, d.outcomes.subheading, ...d.outcomes.paragraphs, `Brief: ${d.outcomes.brief}`].filter(Boolean).join('\n\n'),
    },
  ];

  push(sections, { label: 'Activities', contentType: 'list', listText: d.activities.join('\n') });
  return { sections, about: d.paragraphs.join('\n\n') };
}

// ---------------------------------------------------------------------
// Sidebar-tab pages (WISE, IIC, Vehicle Design Lab, AICTE Idea Lab) — each
// tab below becomes its own independent CustomSection tree via
// CustomTabsEditor.tsx / CustomTabsPage.tsx, rather than one flat list.
// Tabs that are already fully Firestore-driven elsewhere (IIC's PDF-link
// tabs, VDL's achievement reports, Idea Lab's Team/Ambassadors/Facilities)
// aren't seeded here — DifferentiatorDetail.tsx keeps rendering those
// exactly as it does today, independent of this field.
function pushTab(tabs: CustomTab[], label: string, sections: CustomSection[]): CustomTab {
  const tab: CustomTab = { id: generateTabId(label, tabs), label, sections };
  tabs.push(tab);
  return tab;
}

function formatModuleSection(s: WiseModuleSection, indent = ''): string {
  const lines = [`${indent}${s.number}. ${s.title}`];
  (s.items || []).forEach((it) => lines.push(`${indent}   ${it.number} ${it.text}`));
  (s.subgroups || []).forEach((sg) => {
    lines.push(`${indent}   ${sg.number} ${sg.title}`);
    sg.items.forEach((it) => lines.push(`${indent}      ${it.number} ${it.text}`));
  });
  return lines.join('\n');
}

// Curriculum trees (WiseModuleTab.sections, up to 3 levels deep) flatten
// into indented plain text here — the content isn't lost, just no longer
// its own nested expandable tree (same "structure flattens, content
// doesn't" tradeoff already used for Concrete Canoe's Previous Project
// Works table).
function formatModuleTab(m: WiseModuleTab): string {
  if (m.simpleList) return m.simpleList.join('\n');
  return (m.sections || []).map((s) => formatModuleSection(s)).join('\n\n');
}

export async function seedWiseTabs(): Promise<CustomTab[]> {
  const d = talentSprintWise;
  const tabs: CustomTab[] = [];

  pushTab(tabs, 'About WISE', [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.paragraphs.join('\n\n') },
    { id: generateSectionId('Objectives', []), label: 'Objectives', contentType: 'list', listText: d.objectives.join('\n') },
  ]);

  const moduleSections: CustomSection[] = [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.modulesIntro },
  ];
  d.modules.forEach((m) => moduleSections.push({ id: generateSectionId(m.name, moduleSections), label: m.name, contentType: 'text', textContent: formatModuleTab(m) }));
  // The old page showed these as a horizontal pill switcher (one module's
  // content at a time), not stacked one after another.
  pushTab(tabs, 'Modules', moduleSections).sectionsDisplay = 'pills';

  const projectSections: CustomSection[] = [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.projectsIntro },
  ];
  d.projectBatches.forEach((b) => projectSections.push({
    id: generateSectionId(b.year, projectSections),
    label: b.year,
    contentType: 'text',
    textContent: b.modules.map((m) => `${m.heading}\n${m.projects.map((p) => `- ${p}`).join('\n')}`).join('\n\n'),
  }));
  pushTab(tabs, 'Projects', projectSections);

  const [teamPhotos, eliteProjectPhotos, testimonialPhotos, nseClippingPhotos] = await Promise.all([
    fetchPhotoMap('wiseTeamPhotos'),
    fetchPhotoMap('wiseEliteProjectPhotos'),
    fetchPhotoMap('wiseTestimonialPhotos'),
    fetchPhotoMap('wiseNseClippings'),
  ]);

  // Each member's photo (WiseTeamPhotosAdmin.tsx, now retired) was keyed to
  // their own hardcoded `id` — migrated in directly rather than left for the
  // admin to re-upload.
  const teamSections: CustomSection[] = d.team.map((m) => ({
    id: generateSectionId(m.name, []),
    label: m.name,
    contentType: 'text' as const,
    textContent: [m.designation, ...m.bio].filter(Boolean).join('\n\n'),
    ...withPhoto(teamPhotos.get(m.id)),
  }));
  pushTab(tabs, 'WISE Team', teamSections);

  const eliteSections: CustomSection[] = [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.elite.intro.join('\n\n') },
    { id: generateSectionId('Level 1', []), label: 'Level 1', contentType: 'list', listText: d.elite.level1.join('\n') },
    { id: generateSectionId('Level 2', []), label: 'Level 2', contentType: 'list', listText: d.elite.level2.join('\n') },
    { id: generateSectionId('Benefits', []), label: 'Benefits', contentType: 'list', listText: d.elite.benefits.join('\n') },
  ];
  // One section per project (rather than a single consolidated table) so
  // each can carry its own migrated photo (WiseEliteProjectPhotosAdmin.tsx,
  // now retired), keyed by the project's own hardcoded `id`.
  const projectsParent = push(eliteSections, { label: 'Projects', contentType: 'text', textContent: '' });
  const eliteProjectSections: CustomSection[] = [];
  d.elite.projects.forEach((p) => push(eliteProjectSections, {
    label: p.name,
    contentType: 'text',
    textContent: [p.description, p.students.length ? `Students: ${p.students.map((s) => `${s.name} (${s.college})`).join(', ')}` : ''].filter(Boolean).join('\n\n'),
    ...withPhoto(eliteProjectPhotos.get(p.id)),
  }));
  projectsParent.subSections = eliteProjectSections;
  pushTab(tabs, 'ELITE Program', eliteSections);

  const mentoringSections: CustomSection[] = [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.mentoring.paragraphs.join('\n\n') },
  ];
  d.mentoring.batches.forEach((b) => mentoringSections.push({
    id: generateSectionId(b.tabLabel, mentoringSections),
    label: b.tabLabel,
    contentType: 'table',
    tableText: table([{ title: b.heading, headers: ['Name', 'Regd No', 'Section'], rows: b.students.map((s) => [s.name, s.regdNo, s.section]) }]),
  }));
  pushTab(tabs, 'Microsoft Mentoring Program', mentoringSections);

  const beneficiarySections: CustomSection[] = [];
  d.beneficiaryStats.forEach((y) => beneficiarySections.push({
    id: generateSectionId(y.heading, beneficiarySections),
    label: y.heading,
    contentType: 'table',
    tableText: table([{
      title: '',
      headers: ['Range', 'Total Count', 'Company', 'Package', 'Selects'],
      rows: y.ranges.flatMap((r) => r.rows.map((row) => [r.range, r.totalCount, row.company, row.package, row.count])),
    }]),
  }));
  pushTab(tabs, 'Beneficiaries – Placements', beneficiarySections);

  // Each testimonial's photo (WiseTestimonialPhotosAdmin.tsx, now retired)
  // was keyed to their own hardcoded `id`.
  const testimonialSections: CustomSection[] = d.testimonials.map((t) => ({
    id: generateSectionId(t.name, []),
    label: t.name,
    contentType: 'text' as const,
    textContent: [`${t.batch} — ${t.company}`, ...t.quote].join('\n\n'),
    ...withPhoto(testimonialPhotos.get(t.id)),
  }));
  pushTab(tabs, 'Testimonials', testimonialSections);

  // One section per clipping (rather than a single consolidated caption
  // list) so each can carry its own migrated scan (WiseNseClippingsAdmin.tsx,
  // now retired), keyed by the clipping's own hardcoded `id`.
  const nseSections: CustomSection[] = [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.nse.paragraphs.join('\n\n') },
  ];
  const clippingsParent = push(nseSections, { label: 'Clippings', contentType: 'text', textContent: '' });
  const clippingSections: CustomSection[] = [];
  d.nse.clippings.forEach((c) => push(clippingSections, {
    label: c.caption,
    contentType: 'text',
    textContent: '',
    ...withPhoto(nseClippingPhotos.get(c.id)),
  }));
  clippingsParent.subSections = clippingSections;
  pushTab(tabs, 'TalentSprint @ NSE', nseSections);

  return tabs;
}

export async function seedIicTabs(): Promise<CustomTab[]> {
  const d = institutionInnovationCell;
  const tabs: CustomTab[] = [];

  pushTab(tabs, 'About IIC', [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.about },
    { id: generateSectionId('Vision', []), label: 'Vision', contentType: 'list', listText: d.vision.join('\n') },
    { id: generateSectionId('Mission', []), label: 'Mission', contentType: 'list', listText: d.mission.join('\n') },
    { id: generateSectionId(d.journeyTitle, []), label: d.journeyTitle, contentType: 'text', textContent: d.journey },
  ]);

  // The council's member photos (name-keyed, IicMemberPhotosAdmin.tsx) and
  // the single "council members" PDF link stay exactly as they are today,
  // rendered directly below this tab's dynamic content in
  // DifferentiatorDetail.tsx — not part of this seed.
  const functionaries = [
    { name: d.constitution.chairman.name, role: d.constitution.chairman.role },
    ...d.constitution.leadership,
    ...d.constitution.coordinators,
  ];
  pushTab(tabs, 'IIC – Constitution', [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.constitution.intro },
    {
      id: generateSectionId(d.constitution.heading, []),
      label: d.constitution.heading,
      contentType: 'table',
      tableText: table([{ title: '', headers: ['Name', 'Role'], rows: functionaries.map((f) => [f.name, f.role]) }]),
    },
  ]);

  pushTab(tabs, 'Innovation Ambassadors', [
    { id: generateSectionId('Role of an Innovation Ambassador', []), label: 'Role of an Innovation Ambassador', contentType: 'text', textContent: d.innovationAmbassadors.roleIntro },
    { id: generateSectionId('Responsibilities', []), label: 'Responsibilities', contentType: 'list', listText: d.innovationAmbassadors.responsibilities.join('\n') },
  ]);

  pushTab(tabs, 'IIC Activities', [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.activities.intro },
  ]);

  pushTab(tabs, 'Atal Tinkering Schools', [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.atalTinkeringSchools.intro },
    {
      id: generateSectionId(d.atalTinkeringSchools.listHeading, []),
      label: d.atalTinkeringSchools.listHeading,
      contentType: 'table',
      tableText: table([{
        title: '',
        headers: ['S.No', 'School Code', 'School Name', 'Address', 'Email', 'Mobile', 'Coordinator'],
        rows: d.atalTinkeringSchools.schools.map((s) => [String(s.sno), s.schoolCode, s.schoolName, s.address, s.email, s.mobile, s.coordinator]),
      }]),
    },
  ]);

  return tabs;
}

export async function seedVdlTabs(): Promise<CustomTab[]> {
  const d = vehicleDesignLab;
  const tabs: CustomTab[] = [];

  pushTab(tabs, 'About VDL', [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.paragraphs.join('\n\n') },
    { id: generateSectionId('Fundamentals', []), label: 'Fundamentals', contentType: 'list', listText: d.fundamentals.join('\n') },
    { id: generateSectionId('Vision', []), label: 'Vision', contentType: 'text', textContent: d.vision },
    { id: generateSectionId('Mission', []), label: 'Mission', contentType: 'text', textContent: d.mission },
    { id: generateSectionId('Objectives', []), label: 'Objectives', contentType: 'list', listText: d.objectives.map((o) => `${o.lead}${o.text}`).join('\n') },
    {
      id: generateSectionId('Team', []),
      label: 'Team',
      contentType: 'text',
      textContent: `Lab Head:\n${formatMember(d.team.labHead)}\n\nFaculty Members:\n${d.team.facultyMembers.map(formatMember).join('\n\n')}`,
    },
  ]);

  // Facility-phase photos (vdlDesignPhasePhotos/vdlFabricationPhasePhotos/
  // vdlTestingPhotos/vdlMotorsportPhotos, one per phase, first-photo-only —
  // matching how the old public page and VdlFacilitiesPhotosAdmin.tsx both
  // treated them) and the campus utility vehicle gallery
  // (vdlCampusVehiclePhotos, a genuine free multi-photo list) are migrated
  // in below rather than left for the admin to re-upload.
  const phaseCollections = ['vdlDesignPhasePhotos', 'vdlFabricationPhasePhotos', 'vdlTestingPhotos', 'vdlMotorsportPhotos'];
  const [phasePhotos, campusVehicleFiles, endowmentPhotos] = await Promise.all([
    Promise.all(phaseCollections.map(fetchFirstPhoto)),
    fetchOrderedFiles('vdlCampusVehiclePhotos'),
    fetchPhotoMap('vdlIndustryCollabPhotos'),
  ]);

  const facilitiesSections: CustomSection[] = [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.facilities.overview },
  ];
  // One section per phase (rather than one consolidated paragraph) so each
  // can carry its own migrated photo.
  const activitiesParent = push(facilitiesSections, { label: 'Activities and Programs', contentType: 'text', textContent: '' });
  const phaseSections: CustomSection[] = [];
  d.facilities.activitiesPrograms.forEach((p, i) => push(phaseSections, {
    label: p.title,
    contentType: 'text',
    textContent: p.paragraph,
    ...withPhoto(phasePhotos[i]),
  }));
  activitiesParent.subSections = phaseSections;
  push(facilitiesSections, { label: 'Campus Utility Vehicles — Overview', contentType: 'text', textContent: d.facilities.campusUtilityIntro });
  push(facilitiesSections, { label: 'Campus Utility Vehicle Projects', contentType: 'list', listText: d.facilities.campusUtilityProjects.map((p) => `${p.lead}${p.text}`).join('\n') });
  push(facilitiesSections, { label: 'Campus Utility Vehicle Photos', contentType: 'files', files: campusVehicleFiles });
  pushTab(tabs, 'Facilities & Projects', facilitiesSections);

  const industrySections: CustomSection[] = [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.industryCollaborations.intro },
  ];
  // One section per endowment (rather than a single consolidated table) so
  // each can carry its own migrated photo
  // (vdlIndustryCollabPhotos/IndustryCollabPhotoSlots, now retired), keyed
  // by the endowment's own hardcoded `id`.
  const endowmentsParent = push(industrySections, { label: 'Endowments', contentType: 'text', textContent: '' });
  const endowmentSections: CustomSection[] = [];
  d.industryCollaborations.endowments.forEach((e) => push(endowmentSections, {
    label: e.title,
    contentType: 'text',
    textContent: `Bestowed By: ${e.bestowedBy}\n\n${e.contribution}`,
    ...withPhoto(endowmentPhotos.get(e.id)),
  }));
  endowmentsParent.subSections = endowmentSections;
  push(industrySections, { label: 'Closing', contentType: 'text', textContent: d.industryCollaborations.closing });
  pushTab(tabs, 'Industry Collaborations', industrySections);

  // The achievement-reports list (VdlAchievementsAdmin.tsx, already
  // freely-addable Firestore CRUD) stays exactly as it is today, rendered
  // directly below this tab's dynamic content — not part of this seed.
  pushTab(tabs, 'Students Achievements & Placements', [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: d.studentsAchievements.intro },
    {
      id: generateSectionId('Competitions', []),
      label: 'Competitions',
      contentType: 'table',
      tableText: table([{ title: '', headers: ['Competition', 'Details'], rows: d.studentsAchievements.competitions.map((c) => [c.title, c.text]) }]),
    },
    { id: generateSectionId('Closing', []), label: 'Closing', contentType: 'text', textContent: d.studentsAchievements.closing },
    { id: generateSectionId('Placements', []), label: 'Placements', contentType: 'text', textContent: d.studentsAchievements.placementsParagraphs.join('\n\n') },
  ]);

  pushTab(tabs, 'VDL Outcomes', [
    {
      id: generateSectionId('Outcomes', []),
      label: 'Outcomes',
      contentType: 'table',
      tableText: table([{ title: '', headers: ['Outcome', 'Description'], rows: d.outcomes.map((o) => [o.title, o.text]) }]),
    },
  ]);

  return tabs;
}

export async function seedIdeaLabTabs(): Promise<CustomTab[]> {
  const d = aicteIdeaLab;
  const tabs: CustomTab[] = [];

  // Team, Student Ambassadors, and Facilities are already fully
  // Firestore-driven, freely-addable CRUD (AicteIdeaLabTeamAdmin.tsx /
  // AicteIdeaLabAmbassadorsAdmin.tsx / AicteIdeaLabFacilityPhotosAdmin.tsx)
  // — those stay exactly as they are, rendered as fixed tabs in
  // DifferentiatorDetail.tsx, not seeded here at all.
  pushTab(tabs, 'About AICTE IDEA Lab', [
    { id: generateSectionId('Overview', []), label: 'Overview', contentType: 'text', textContent: [d.tagline, ...d.paragraphs].join('\n\n') },
    { id: generateSectionId('Vision', []), label: 'Vision', contentType: 'list', listText: d.vision.join('\n') },
    {
      id: generateSectionId('Institute & Coordinator Details', []),
      label: 'Institute & Coordinator Details',
      contentType: 'table',
      tableText: table([{ title: '', headers: ['Label', 'Value'], rows: d.fields.map((f) => [f.label, f.value.join('; ')]) }]),
    },
  ]);

  return tabs;
}
