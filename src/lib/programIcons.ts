import {
  Laptop, Bot, BarChart3, Lock, Globe, RadioTower, Zap, Construction,
  Settings, Microscope, Briefcase, GraduationCap, PenTool, type LucideIcon,
} from 'lucide-react';

// Firestore can't store a React component, so a program doc stores the icon
// as one of these string keys, resolved back to a component at render time.
export const PROGRAM_ICONS: Record<string, LucideIcon> = {
  Laptop, Bot, BarChart3, Lock, Globe, RadioTower, Zap, Construction,
  Settings, Microscope, Briefcase, GraduationCap, PenTool,
};

export const PROGRAM_ICON_NAMES = Object.keys(PROGRAM_ICONS);

export function resolveProgramIcon(name: string | undefined): LucideIcon {
  return (name && PROGRAM_ICONS[name]) || GraduationCap;
}
