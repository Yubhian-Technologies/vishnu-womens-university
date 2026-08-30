import { Fragment } from 'react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { NBA_DATA_CATEGORIES, type NbaDataDoc } from '../Admin/sections/NbaDataAdmin';

// Renders the NBA Data Capturing Points document list as a plain bulleted
// list (title + "– View" link), matching the reference site's layout more
// closely than the chip/tab styles used elsewhere on Governance sub-pages —
// two groups (per-programme DCPs, then institution-wide detail sheets)
// separated by a divider, with no group heading text (mirrors the source).
// Admin-editable via /admin → NBA Data (NbaDataAdmin.tsx).
function NbaDataList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {items.map((item) => (
        <li key={item.href} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 9 }} />
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontWeight: 700, margin: 0 }}>
            {item.label}
            {' — '}
            <a href={item.href} download style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
              View
            </a>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function NbaDataSection() {
  const { docs } = useOrderedCollection<NbaDataDoc>('nbaDataDocs', 'order');
  const groups = NBA_DATA_CATEGORIES.map((c) => ({
    key: c.key,
    items: docs.filter((d) => d.category === c.key).map((d) => ({ label: d.label, href: d.fileUrl })),
  })).filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {groups.map((g, i) => (
        <Fragment key={g.key}>
          {i > 0 && <div style={{ borderTop: '1px solid var(--color-light-gray)' }} />}
          <NbaDataList items={g.items} />
        </Fragment>
      ))}
    </div>
  );
}
