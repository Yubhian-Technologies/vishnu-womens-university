import { useState } from 'react';
import type { ProgramSemester } from '../../pages/Admin/sections/ProgramsAdmin';
import { normalizeSubject } from '../../pages/Admin/sections/ProgramsAdmin';
import '../../pages/detail-layout.css';
import './ProgrammeStructure.css';

interface Props {
  /** Already-fetched semesters for the current programme (from the same
   *  `programs` doc the rest of the page uses) — this component doesn't
   *  fetch on its own, so a page showing other programme data alongside
   *  this doesn't end up querying Firestore twice for the same document. */
  semesters: ProgramSemester[] | undefined;
  /** True while the parent is still waiting on that programme doc. */
  loading?: boolean;
}

/**
 * Collapsed-by-default, click-to-expand semester accordion for a programme's
 * curriculum — reused by ProgramDetail.tsx (and available anywhere else a
 * programme's semesters need to be shown, e.g. a future comparison view).
 */
export default function ProgrammeStructure({ semesters, loading }: Props) {
  const [openSemesters, setOpenSemesters] = useState<Set<string>>(new Set());
  const toggleSemester = (label: string) => {
    setOpenSemesters((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  if (loading) {
    return (
      <div aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="programme-structure-skeleton" />
        ))}
      </div>
    );
  }

  if (!semesters || semesters.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-light)', textAlign: 'center', padding: 'var(--space-6) 0' }}>
        No curriculum has been added for this programme yet — check back soon.
      </p>
    );
  }

  return (
    <div className="thrust-accordion">
      {semesters.map((sem) => {
        const isOpen = openSemesters.has(sem.label);
        return (
          <div key={sem.label} className={`thrust-accordion-item${isOpen ? ' open' : ''}`}>
            <button
              type="button"
              className="thrust-accordion-header"
              onClick={() => toggleSemester(sem.label)}
              aria-expanded={isOpen}
            >
              <span>{sem.label}</span>
              <span className="thrust-accordion-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="thrust-accordion-collapse">
              <div className="thrust-accordion-collapse-inner">
                <ul style={{ listStyle: 'none', padding: 'var(--space-4) var(--space-5)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {sem.subjects.map(normalizeSubject).map((subj, i) => (
                    <li
                      key={i}
                      style={{ fontSize: '0.78rem', color: 'var(--color-text)', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', lineHeight: 1.4, display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}
                    >
                      <span>{subj.title}{subj.code ? ` (${subj.code})` : ''}</span>
                      {subj.credits != null && (
                        <span style={{ color: 'var(--color-text-light)', flexShrink: 0, fontWeight: 600 }}>{subj.credits} Cr</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
