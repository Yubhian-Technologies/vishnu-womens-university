import { useState, type CSSProperties } from 'react';
import { Check } from 'lucide-react';
import { IQAC_CELL_MEMBERS, IQAC_CELL_FUNCTIONS } from './internalQACellDefault';

const TH_STYLE: CSSProperties = {
  padding: 'var(--space-3) var(--space-4)',
  textAlign: 'left',
  color: 'var(--color-white)',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};
const TD_STYLE: CSSProperties = {
  padding: 'var(--space-3) var(--space-4)',
  color: 'var(--color-text)',
  lineHeight: 1.5,
};

// A tabbed "Members" / "Functions" view for the Internal Quality Assurance
// Cell committee — the full 25-member roster (with Designation/Type of
// Membership/Position columns) has more structure than the shared Name/
// Role/Notes table GovernanceDetail.tsx otherwise renders for committee
// pages, so it's rendered directly instead.
export default function InternalQACellSection() {
  const [tab, setTab] = useState<'members' | 'functions'>('members');

  return (
    <div>
      <div className="iqac-cell-tabs">
        <button
          type="button"
          className={`iqac-cell-tab${tab === 'members' ? ' active' : ''}`}
          onClick={() => setTab('members')}
        >
          IQAC
        </button>
        <button
          type="button"
          className={`iqac-cell-tab${tab === 'functions' ? ' active' : ''}`}
          onClick={() => setTab('functions')}
        >
          Functions
        </button>
      </div>

      {tab === 'members' ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--color-primary)' }}>
                <th style={{ ...TH_STYLE, textAlign: 'center' }}>S.No</th>
                <th style={TH_STYLE}>Name</th>
                <th style={TH_STYLE}>Designation</th>
                <th style={TH_STYLE}>Type of Membership</th>
                <th style={TH_STYLE}>Position</th>
              </tr>
            </thead>
            <tbody>
              {IQAC_CELL_MEMBERS.map((m, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)', borderBottom: '1px solid var(--color-light-gray)' }}>
                  <td style={{ ...TD_STYLE, textAlign: 'center', color: 'var(--color-text-light)' }}>{i + 1}</td>
                  <td style={{ ...TD_STYLE, fontWeight: 600, color: 'var(--color-primary)' }}>{m.name}</td>
                  <td style={TD_STYLE}>{m.designation}</td>
                  <td style={TD_STYLE}>{m.membershipType}</td>
                  <td style={TD_STYLE}>{m.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="pb-bullets" style={{ margin: 0 }}>
          {IQAC_CELL_FUNCTIONS.map((f, i) => (
            <li key={i}>
              <Check size={13} strokeWidth={2.5} className="pb-bullet-icon" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
