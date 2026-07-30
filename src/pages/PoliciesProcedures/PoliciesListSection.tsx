import { FileText } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import { DEFAULT_POLICIES, type PolicyDoc } from '../Admin/sections/PoliciesAdmin';

// The policy list rendering shared by the standalone /policies-procedures
// page and the Governance > IQAC > Policies & Procedures sub-page — both
// read the same admin-managed institutionalPolicies collection (falling
// back to DEFAULT_POLICIES until an admin adds real entries), so a policy
// added or a PDF uploaded once in /admin shows up correctly in both places.
export default function PoliciesListSection() {
  const { docs: livePolicies } = useOrderedCollection<PolicyDoc>('institutionalPolicies', 'order');
  const policies = livePolicies.length > 0 ? livePolicies : (DEFAULT_POLICIES as PolicyDoc[]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {policies.map((p) => (
        <div key={p.title} style={{ display: 'flex', gap: 'var(--space-3)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-light-gray)' }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-off-white)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <FileText size={15} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
          </span>
          <div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontWeight: 700, marginBottom: p.description ? 'var(--space-2)' : 0 }}>
              {p.title}
              {' — '}
              {p.fileUrl ? (
                <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                  View
                </a>
              ) : (
                <span style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>View</span>
              )}
            </p>
            {p.description && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65 }}>
                {p.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
