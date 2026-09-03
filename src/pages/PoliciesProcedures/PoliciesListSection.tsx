import { FileText, ExternalLink } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {policies.map((p) => (
        <div
          key={p.title}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-4)',
            padding: 'var(--space-5) var(--space-6)',
            background: 'var(--color-white)',
            border: '1px solid rgba(27, 67, 50, 0.08)',
            borderRadius: '18px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <span style={{
            width: 42,
            height: 42,
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-off-white)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--color-primary)'
          }}>
            <FileText size={20} strokeWidth={1.75} style={{ color: 'var(--color-accent)' }} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: p.description ? 'var(--space-2)' : 0 }}>
              <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontWeight: 800, margin: 0 }}>
                {p.title}
              </h4>
              {p.fileUrl ? (
                <a
                  href={p.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline btn-pill"
                  style={{ textTransform: 'none', letterSpacing: 'normal' }}
                >
                  View Policy <ExternalLink size={12} />
                </a>
              ) : (
                <span className="m3-chip" style={{ opacity: 0.6 }}>
                  Reference Only
                </span>
              )}
            </div>
            {p.description && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.65, margin: 0 }}>
                {p.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

