// One-time starter-content converters for DepartmentsAdmin.tsx's "Quick Add"
// (Freshman Engineering section) — turn each of Mathematics/Physics/
// Chemistry/English's previously-hardcoded content (SUB_DEPTS in
// FreshmanEngineering.tsx) into a real Department doc, so nothing is lost
// moving them off a single static page and onto their own admin-editable
// records (see StandaloneDepartmentDetail.tsx). Purely additive scaffolding:
// clicking a Quick Add button only *proposes* a value into the Add form,
// nothing reaches Firestore until "Add Department" is clicked.

import { isValidElement, type ReactNode } from 'react';
import { generateSectionId, type CustomSection } from '../../lib/customSections';
import { serializeFlexibleTable } from '../../lib/structuredTable';
import type { DepartmentDoc } from '../Admin/sections/DepartmentsAdmin';
import { SUB_DEPTS } from './FreshmanEngineering';

function push(list: CustomSection[], section: Omit<CustomSection, 'id'>): CustomSection {
  const s: CustomSection = { id: generateSectionId(section.label, list), ...section };
  list.push(s);
  return s;
}
function table(headers: string[], rows: string[][]): string {
  return serializeFlexibleTable([{ title: '', headers, rows }]);
}

// A ContentBlock's `text`/`items` can be plain strings or, in one case
// (Physics' About paragraph), a short JSX fragment (for a bolded phrase) —
// this walks either down to plain text, since Department.about and every
// CustomSection text field here are plain strings, not JSX.
function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return nodeToText(props.children);
  }
  return '';
}

type SubDept = (typeof SUB_DEPTS)[number];
type ContentBlock = SubDept['about'][number];

// Flattens a ContentBlock[] (About/Research & Development's shape) into
// plain text — headings become their own line, bullets become "- item"
// lines, a table (only Physics' R&D has one) is pulled out separately
// since CustomSection text can't render one.
function blocksToText(blocks: ContentBlock[] | undefined): { text: string; tableBlock?: Extract<ContentBlock, { type: 'table' }> } {
  if (!blocks) return { text: '' };
  const lines: string[] = [];
  let tableBlock: Extract<ContentBlock, { type: 'table' }> | undefined;
  for (const b of blocks) {
    if (b.type === 'paragraph' || b.type === 'lead') lines.push(nodeToText(b.text));
    else if (b.type === 'heading') lines.push(b.text);
    else if (b.type === 'bullets') b.items.forEach((it) => lines.push(`- ${nodeToText(it)}`));
    else if (b.type === 'table') tableBlock = b;
  }
  return { text: lines.join('\n\n'), tableBlock };
}

function labsSections(labs: SubDept['labs']): CustomSection[] {
  if (!labs) return [];
  return labs.map((lab) => {
    const facts = lab.facts.map((f) => `${f.label}: ${f.value}`).join('\n');
    const section: CustomSection = {
      id: generateSectionId(lab.title, []),
      label: lab.title,
      contentType: 'text',
      textContent: [lab.intro, facts].filter(Boolean).join('\n\n'),
      subSections: [{ id: generateSectionId('Photos', []), label: 'Photos', contentType: 'gallery', galleryPhotos: [] }],
    };
    return section;
  });
}

function awardsSection(awards: SubDept['awards']): CustomSection | null {
  if (!awards) return null;
  const subs: CustomSection[] = [];
  (awards.sections || []).forEach((s) => {
    push(subs, { label: s.heading, contentType: 'list', listText: s.items.map(nodeToText).join('\n') });
  });
  if (awards.setNetGate?.length) {
    const showYear = awards.setNetGate.some((r) => r.qualifyingYear);
    const headers = showYear
      ? ['Subject', 'Name', 'Designation', 'NET/GATE/SET', 'Qualifying Year']
      : ['Subject', 'Name', 'Designation', 'NET/GATE/SET'];
    const rows = awards.setNetGate.map((r) => (showYear
      ? [r.subject, r.name, r.designation, r.qualifier, r.qualifyingYear || '']
      : [r.subject, r.name, r.designation, r.qualifier]));
    push(subs, { label: 'Faculty Qualified in SET/NET/GATE', contentType: 'table', tableText: table(headers, rows) });
  }
  if (subs.length === 0) return null;
  return { id: generateSectionId('Awards & Recognitions', []), label: 'Awards & Recognitions', contentType: 'text', textContent: '', subSections: subs };
}

function seedFromSubDept(dept: SubDept): () => Partial<Omit<DepartmentDoc, 'id'>> {
  return () => {
    const customSections: CustomSection[] = [];
    const labs = labsSections(dept.labs);
    if (labs.length > 0) {
      push(customSections, { label: 'Laboratories', contentType: 'text', textContent: '', subSections: labs });
    }
    const { text: rndText, tableBlock } = blocksToText(dept.researchDev);
    if (rndText || tableBlock) {
      const rndSubs: CustomSection[] = [];
      if (tableBlock) push(rndSubs, { label: 'Publication Record', contentType: 'table', tableText: table(tableBlock.headers, tableBlock.rows) });
      customSections.push({
        id: generateSectionId('Research & Development', customSections),
        label: 'Research & Development', contentType: 'text', textContent: rndText,
        ...(rndSubs.length > 0 ? { subSections: rndSubs } : {}),
      });
    }
    const awards = awardsSection(dept.awards);
    if (awards) customSections.push(awards);

    const { text: aboutText } = blocksToText(dept.about);
    return {
      title: dept.title,
      shortCode: dept.title.replace(/^Department of /, ''),
      description: `The ${dept.title} at Vishnu Women's University.`,
      about: aboutText,
      customSections,
    };
  };
}

export const FRESHMAN_DEPARTMENT_SEEDS: Record<string, () => Partial<Omit<DepartmentDoc, 'id'>>> =
  Object.fromEntries(SUB_DEPTS.map((d) => [d.title.replace(/^Department of /, ''), seedFromSubDept(d)]));
