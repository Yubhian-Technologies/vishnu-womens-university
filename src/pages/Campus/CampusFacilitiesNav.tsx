import { Link } from 'react-router-dom';
import { campusFacilities } from './campusFacilities.data';
import './CampusFacilitiesNav.css';

interface Props {
  activeSlug: string;
}

/**
 * Quick-jump list of every Campus Life facility, used as a sidebar on each
 * facility's own detail page so a visitor can move between them without
 * going back to the /campus hub each time.
 */
export default function CampusFacilitiesNav({ activeSlug }: Props) {
  return (
    <nav className="campus-facilities-nav" aria-label="Campus Life facilities">
      {campusFacilities.map((f) => (
        <Link
          key={f.slug}
          to={`/campus/${f.slug}`}
          className={`campus-facilities-nav__item${f.slug === activeSlug ? ' active' : ''}`}
        >
          {f.title}
        </Link>
      ))}
    </nav>
  );
}
