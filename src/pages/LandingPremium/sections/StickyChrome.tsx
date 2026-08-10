import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QUICK_LINKS } from '../landingPremium.data';

// Mirrors two persistent chrome elements on lpu.in: a vertical "Related
// Links" tab pinned to the left edge, and a full-width ticker bar pinned to
// the bottom of the viewport — both visible throughout the entire scroll,
// not just within one section.
export default function StickyChrome() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`lph-side-tab${open ? ' open' : ''}`}>
        <button className="lph-side-tab__toggle" onClick={() => setOpen((o) => !o)}>
          Quick Links
        </button>
        <div className="lph-side-tab__panel">
          {QUICK_LINKS.map((q) => (
            <Link key={q.label} to={q.to} onClick={() => setOpen(false)}>{q.label}</Link>
          ))}
        </div>
      </div>

      <div className="lph-ticker">
        <div className="lph-ticker__track">
          <span>Admissions Open for 2026–27 — Apply Now for VWU's B.Tech, M.Tech, and MBA Programs</span>
          <span>Admissions Open for 2026–27 — Apply Now for VWU's B.Tech, M.Tech, and MBA Programs</span>
        </div>
        <Link to="/admissions" className="lph-ticker__cta">Apply Now</Link>
      </div>
    </>
  );
}
