# Google UI Design Principles & Material 3 Rules

When generating, modifying, or styling UI components and web pages in this codebase, ALWAYS adhere to Google UI Design Principles and Material Design 3 guidelines:

## 1. Typography & Hierarchy
- Use the predefined geometric type system with `--font-sans: 'Product Sans', sans-serif`.
- Follow the 5-tier type scale: Display, Headline, Title, Body, and Label.
- Keep body paragraph line lengths between 60 to 75 characters for optimal readability.

## 2. Color, Surface & Tonal Elevation
- Use the VWU brand palette tokens defined in `src/styles/variables.css`:
  - Primary: `--color-primary` (`#1b4332`), `--color-primary-light` (`#2d6a4f`)
  - Accent / Gold: `--color-accent` (`#C9A84C`), `--color-accent-light` (`#e8c96a`)
  - Neutral / Tonal Surfaces: `--color-white`, `--color-off-white`, `--color-light-gray`
- Avoid harsh single-point black shadows. Use multi-layer ambient elevation tokens (`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`) combined with surface tinting.

## 3. Interactive States & Touch Targets
- Provide clear visual feedback for all interactive states (hover 8% overlay, focus ring 12%, active press ripple/elevation shift).
- Ensure all interactive controls (buttons, navigation tabs, icon links) have a minimum tap target of 48×48px on mobile devices.

## 4. Purposeful Motion
- Use Google-standard cubic-bezier motion curves (`--transition-smooth: 600ms cubic-bezier(0.4, 0, 0.2, 1)` and `--transition-base: 250ms ease`).
- Ensure animations enhance orientation and hierarchy without introducing layout shifts. Never wrap dynamic Firestore data in unmanaged intersection observers.

## 5. Reference
- For full specifications and design system details, see `docs/google-ui-design-principles.md`.
