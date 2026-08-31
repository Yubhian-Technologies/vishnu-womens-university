// A small line-oriented mini-language for one Professional Body's content
// (paragraphs, labeled bullets, named people with contact details, a
// chapter-info panel, and a dated activities log) — richer than the
// tableText/accordionText/projectsText parsers elsewhere in this codebase
// support in a single block, so it gets its own tiny format instead:
//
//   A plain line is a paragraph.
//
//   - A bullet with no label
//   - Label: a bullet with a bolded label
//
//   PERSON: Role | Name | detail one | detail two
//
//   CHAPTER: Label | Value
//
//   ACTIVITIES: List of Activities
//   - Event name | Date
//   - Another event | Date
//
// A blank line has no effect (paragraphs/bullets are just however many
// non-empty lines follow one another) — it's only there for readability.
// "ACTIVITIES:" switches every subsequent "- " line into an activity row
// (name | date) instead of a bullet, until the text ends — activities
// should be the last section in a body's content for that reason.

export interface ParsedProfessionalBody {
  paragraphs: string[];
  bullets: { label?: string; text: string }[];
  people: { role: string; name: string; details: string[] }[];
  chapterInfo: { label: string; value: string }[];
  activitiesTitle?: string;
  activities: { name: string; date: string }[];
}

export function parseProfessionalBodyContent(text: string): ParsedProfessionalBody {
  const result: ParsedProfessionalBody = { paragraphs: [], bullets: [], people: [], chapterInfo: [], activities: [] };
  let inActivities = false;

  for (const rawLine of (text || '').split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('PERSON:')) {
      const [role, name, ...details] = line.slice(7).split('|').map((s) => s.trim());
      if (role && name) result.people.push({ role, name, details: details.filter(Boolean) });
      inActivities = false;
      continue;
    }
    if (line.startsWith('CHAPTER:')) {
      const [label, value] = line.slice(8).split('|').map((s) => s.trim());
      if (label && value) result.chapterInfo.push({ label, value });
      inActivities = false;
      continue;
    }
    if (line.startsWith('ACTIVITIES:')) {
      result.activitiesTitle = line.slice(11).trim();
      inActivities = true;
      continue;
    }
    if (line.startsWith('- ')) {
      const rest = line.slice(2).trim();
      if (inActivities) {
        const [name, date] = rest.split('|').map((s) => s.trim());
        if (name) result.activities.push({ name, date: date || '' });
      } else {
        const colonIndex = rest.indexOf(':');
        if (colonIndex > -1 && colonIndex < 60) {
          result.bullets.push({ label: rest.slice(0, colonIndex).trim(), text: rest.slice(colonIndex + 1).trim() });
        } else {
          result.bullets.push({ text: rest });
        }
      }
      continue;
    }
    inActivities = false;
    result.paragraphs.push(line);
  }

  return result;
}

// Inverse of the above — only used to build the admin's starter/seed
// content from the original hardcoded data, not at render time.
export function serializeProfessionalBodyContent(body: ParsedProfessionalBody): string {
  const lines: string[] = [];
  body.paragraphs.forEach((p) => lines.push(p));
  if (body.bullets.length) {
    if (lines.length) lines.push('');
    body.bullets.forEach((b) => lines.push(b.label ? `- ${b.label}: ${b.text}` : `- ${b.text}`));
  }
  if (body.people.length) {
    if (lines.length) lines.push('');
    body.people.forEach((p) => lines.push(`PERSON: ${[p.role, p.name, ...p.details].join(' | ')}`));
  }
  if (body.chapterInfo.length) {
    if (lines.length) lines.push('');
    body.chapterInfo.forEach((c) => lines.push(`CHAPTER: ${c.label} | ${c.value}`));
  }
  if (body.activities.length) {
    if (lines.length) lines.push('');
    lines.push(`ACTIVITIES: ${body.activitiesTitle || ''}`);
    body.activities.forEach((a) => lines.push(`- ${a.name} | ${a.date}`));
  }
  return lines.join('\n');
}
