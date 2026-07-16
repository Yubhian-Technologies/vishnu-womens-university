import {
  Monitor, Microscope, BookOpen, Drama, Wifi, Home, Utensils, Activity, Waves, Hospital, Lock, Bus, Landmark, Building, Accessibility,
  Trophy, TrendingUp, BadgeCheck, GraduationCap, Presentation, BarChart3, Award, Handshake, Lightbulb, Venus, Leaf, Check, ClipboardList,
  School, Star, Briefcase, Medal, Laptop, FlaskConical, Factory, FileText, Globe2, Clock, MapPin, IndianRupee, CheckCircle2, PartyPopper,
  Palette, Camera, Sparkles, Hotel, Sparkle, Goal, Feather, Dumbbell, Footprints, Clapperboard, Calendar, Newspaper, Video, Mic2,
  type LucideIcon,
} from 'lucide-react';

// Firestore can't store a React component, so a content block doc stores the
// icon as one of these string keys, resolved back to a component at render
// time — same pattern as src/lib/programIcons.ts.
export const CONTENT_ICONS: Record<string, LucideIcon> = {
  Monitor, Microscope, BookOpen, Drama, Wifi, Home, Utensils, Activity, Waves, Hospital, Lock, Bus, Landmark, Building, Accessibility,
  Trophy, TrendingUp, BadgeCheck, GraduationCap, Presentation, BarChart3, Award, Handshake, Lightbulb, Venus, Leaf, Check, ClipboardList,
  School, Star, Briefcase, Medal, Laptop, FlaskConical, Factory, FileText, Globe2, Clock, MapPin, IndianRupee, CheckCircle2, PartyPopper,
  Palette, Camera, Sparkles, Hotel, Sparkle, Goal, Feather, Dumbbell, Footprints, Clapperboard, Calendar, Newspaper, Video, Mic2,
};

export const CONTENT_ICON_NAMES = Object.keys(CONTENT_ICONS);

export function resolveContentIcon(name: string | undefined): LucideIcon | null {
  if (!name) return null;
  return CONTENT_ICONS[name] || null;
}
