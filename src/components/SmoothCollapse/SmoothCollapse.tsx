import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  children: ReactNode;
}

// Shared by every accordion/collapsible panel on the site (batch pickers,
// FAQ-style toggles, mobile nav submenus) that doesn't already reuse the
// `.thrust-accordion-item` / `.pb-item` CSS classes in detail-layout.css.
// A `{isOpen && <div>...}` mount/unmount pops the panel open at full height
// in one frame — there's nothing to animate a height *to* until the browser
// has laid it out. Animating `grid-template-rows` (0fr → 1fr) on an
// always-mounted wrapper sidesteps that: the browser interpolates the
// fractional row track smoothly regardless of the content's real height,
// so it works for arbitrarily large/variable content without JS measuring.
export default function SmoothCollapse({ open, children }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows var(--transition-slow)',
      }}
    >
      <div style={{ overflow: 'hidden', minHeight: 0 }}>
        <div style={{ opacity: open ? 1 : 0, transition: `opacity var(--transition-base) ${open ? '80ms' : '0ms'}` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
