import { NBA_DATA_UG_PROGRAMMES, NBA_DATA_INSTITUTIONAL, type NbaDataItem } from './nbaDataDefault';

// Renders the NBA Data Capturing Points document list as a plain bulleted
// list (title + "– View" link), matching the reference site's layout more
// closely than the chip/tab styles used elsewhere on Governance sub-pages —
// two groups (per-programme DCPs, then institution-wide detail sheets)
// separated by a divider, with no group heading text (mirrors the source).
function NbaDataList({ items }: { items: NbaDataItem[] }) {
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <NbaDataList items={NBA_DATA_UG_PROGRAMMES} />
      <div style={{ borderTop: '1px solid var(--color-light-gray)' }} />
      <NbaDataList items={NBA_DATA_INSTITUTIONAL} />
    </div>
  );
}
