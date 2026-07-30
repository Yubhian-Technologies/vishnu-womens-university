import type { ReactNode } from 'react';

interface Props {
  readOnly: boolean;
  children: ReactNode;
}

// Wraps a CMS module's markup, without changing it, so a department account
// can still browse every section but can't act on ones outside its granted
// resources. A native <fieldset disabled> cascades `disabled` to every
// descendant input/select/textarea/button for free (keyboard/screen-reader
// correct), and pointer-events:none on top of it also blocks drag-and-drop
// upload zones and other custom onClick/onDrop handlers that aren't native
// form controls. `display: contents` keeps the fieldset from introducing any
// box of its own (no border/padding/margin), so layout is pixel-identical to
// the editable state.
export default function ReadOnlyGate({ readOnly, children }: Props) {
  if (!readOnly) return <>{children}</>;
  return (
    <fieldset disabled className="admin-readonly-fieldset">
      {children}
    </fieldset>
  );
}
