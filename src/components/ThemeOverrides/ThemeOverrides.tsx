import { useEffect } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { COLOR_VARS, THEME_DOC } from '../../lib/theme';

interface ThemeDoc {
  [cssVar: string]: string;
}

// Renders nothing — just keeps :root's CSS custom properties in sync with
// whatever an admin has saved in Firestore (see ThemeAdmin.tsx). Since every
// page's CSS reads colors through var(--color-*) rather than hardcoded hex
// (see CLAUDE.md), overriding these here recolors the entire public site
// without touching a single stylesheet. Mounted once, high up in the app, so
// it applies before the rest of the tree paints and stays live afterward.
export default function ThemeOverrides() {
  const { data } = useDocument<ThemeDoc>(THEME_DOC.collection, THEME_DOC.id);

  useEffect(() => {
    const root = document.documentElement.style;
    for (const { key } of COLOR_VARS) {
      const value = data?.[key];
      if (value) root.setProperty(key, value);
      else root.removeProperty(key);
    }
  }, [data]);

  return null;
}
