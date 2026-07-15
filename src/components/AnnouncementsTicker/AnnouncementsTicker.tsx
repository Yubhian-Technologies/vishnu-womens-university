import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useOrderedCollection } from '../../hooks/useCollection';
import './AnnouncementsTicker.css';

interface Announcement {
  id: string;
  text: string;
  link: string;
  active: boolean;
  order: number;
}

interface Props {
  // Shown instead of the ticker when there are no active announcements —
  // keeps the topbar's fixed height/layout identical either way, since this
  // renders inside the existing .topbar-left slot rather than adding a new
  // stacked bar (which would shift the fixed header's height dynamically).
  fallback: ReactNode;
}

export default function AnnouncementsTicker({ fallback }: Props) {
  const { docs } = useOrderedCollection<Announcement>('announcements', 'order');
  const active = docs.filter((a) => a.active);

  if (active.length === 0) return <>{fallback}</>;

  const renderItem = (a: Announcement, key: string) => {
    const content = <span className="announcements-ticker__item">{a.text}</span>;
    if (!a.link) return <span key={key}>{content}</span>;
    if (a.link.startsWith('http')) {
      return <a key={key} href={a.link} target="_blank" rel="noopener noreferrer">{content}</a>;
    }
    return <Link key={key} to={a.link}>{content}</Link>;
  };

  return (
    <div className="announcements-ticker">
      <div className="announcements-ticker__track">
        {active.map((a, i) => renderItem(a, `a-${i}`))}
        {active.map((a, i) => renderItem(a, `b-${i}`))}
      </div>
    </div>
  );
}
