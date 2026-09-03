import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { campusFacilities } from './campusFacilities.data';

interface Props {
  activeSlug: string;
}

/**
 * Quick-jump list of every Campus Life facility, used as a sidebar on each
 * facility's own detail page so a visitor can move between them without
 * going back to the /campus hub each time. Same "Quick Navigation" card
 * styling as DepartmentDetail.tsx/ProgramDetail.tsx's own sidebar (see the
 * dept-quick-nav-* rules in detail-layout.css, already imported by every
 * page this renders on) — reused as-is rather than a separate look, plus
 * one added `is-active` state for "you are here", which that nav doesn't
 * need (it links within one page, not between different pages).
 */
export default function CampusFacilitiesNav({ activeSlug }: Props) {
  return (
    <nav className="dept-quick-nav-card" aria-label="Campus Life facilities">
      <div className="dept-quick-nav-header">
        <div className="dept-quick-nav-icon">
          <MapPin size={15} strokeWidth={2.4} />
        </div>
        <div className="dept-quick-nav-title-wrap">
          <h4 className="dept-quick-nav-title">Quick Navigation</h4>
          <span className="dept-quick-nav-subtitle">{campusFacilities.length} Facilities</span>
        </div>
      </div>

      <ul className="dept-quick-nav-list" role="list">
        {campusFacilities.map((f) => (
          <li key={f.slug} className="dept-quick-nav-item">
            <Link
              to={`/campus/${f.slug}`}
              className={`dept-quick-nav-link${f.slug === activeSlug ? ' is-active' : ''}`}
              aria-current={f.slug === activeSlug ? 'page' : undefined}
            >
              <span className="dept-quick-nav-text">{f.title}</span>
              <span className="dept-btn-arrow-circle">
                <ChevronRight size={13} strokeWidth={2.4} className="dept-quick-nav-arrow" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
