export const DEPARTMENT_TAGLINES: Record<string, string> = {
  CSE: 'Innovating Through Computing. Empowering Women to Lead.',
  IT: 'Driving Digital Transformation through Information Technology.',
  AI: 'Advancing Artificial Intelligence through Innovation and Research.',
  EEE: 'Powering the Future through Electrical Engineering.',
  ECE: 'Where Electronics, Communication, and Innovation Converge.',
  ME: 'Where Women Engineer, Innovate, and Lead.',
  CE: 'Building Resilient Infrastructure for a Sustainable Future.',
  MBA: 'Empowering Women. Shaping Global Business Leaders.',
  MATHEMATICS: 'Exploring Patterns. Unlocking Possibilities.',
  ENGLISH: 'Empowering Voices. Shaping Perspectives.',
  CHEMISTRY: 'Discovering Chemistry. Engineering New Possibilities.',
  PHYSICS: 'From Fundamental Principles to Future Innovation.',
};

/**
 * Returns the official department tagline matching a short code, department key, or slug.
 */
export function getDepartmentTagline(keyOrCode?: string, override?: string): string {
  if (override && override.trim()) return override.trim();
  if (!keyOrCode) return '';
  const key = keyOrCode.trim().toUpperCase();
  if (DEPARTMENT_TAGLINES[key]) return DEPARTMENT_TAGLINES[key];

  // Alias mappings
  if (key === 'AI-DS' || key === 'AI-ML' || key === 'ARTIFICIAL INTELLIGENCE') {
    return DEPARTMENT_TAGLINES.AI;
  }
  if (key === 'CYBER-SECURITY' || key === 'MTECH-CSE' || key === 'MTECH-SOFTWARE-ENGINEERING' || key === 'COMPUTER SCIENCE & ENGINEERING') {
    return DEPARTMENT_TAGLINES.CSE;
  }
  if (key === 'EVT' || key === 'MTECH-VLSI' || key === 'ELECTRONICS & COMMUNICATION ENGINEERING') {
    return DEPARTMENT_TAGLINES.ECE;
  }
  if (key === 'MECHANICAL' || key === 'MECHANICAL ENGINEERING') {
    return DEPARTMENT_TAGLINES.ME;
  }
  if (key === 'CIVIL' || key === 'CIVIL ENGINEERING') {
    return DEPARTMENT_TAGLINES.CE;
  }
  if (key === 'FE-MATHEMATICS' || key === 'MATHS') {
    return DEPARTMENT_TAGLINES.MATHEMATICS;
  }
  if (key === 'FE-PHYSICS') {
    return DEPARTMENT_TAGLINES.PHYSICS;
  }
  if (key === 'FE-CHEMISTRY') {
    return DEPARTMENT_TAGLINES.CHEMISTRY;
  }
  if (key === 'FE-ENGLISH') {
    return DEPARTMENT_TAGLINES.ENGLISH;
  }

  return '';
}
