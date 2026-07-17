// Shared "no real photo yet" placeholder for newly-added photo slots that
// don't have a real asset. Self-contained inline SVG — never 404s, and is
// visually obvious so it's never mistaken for a real (if plain) photo.
export const PHOTO_NEEDED_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='533' viewBox='0 0 800 533'%3E%3Crect width='800' height='533' fill='%23e5e7eb'/%3E%3Crect x='320' y='210' width='160' height='110' rx='10' fill='none' stroke='%239ca3af' stroke-width='10'/%3E%3Crect x='365' y='190' width='70' height='30' rx='4' fill='none' stroke='%239ca3af' stroke-width='10'/%3E%3Ccircle cx='400' cy='265' r='30' fill='none' stroke='%239ca3af' stroke-width='10'/%3E%3Ctext x='400' y='370' font-family='sans-serif' font-size='26' fill='%236b7280' text-anchor='middle'%3EPhoto Needed%3C/text%3E%3C/svg%3E";
