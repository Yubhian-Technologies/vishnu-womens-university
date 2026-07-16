import { useState } from 'react';
import AcademicCalendarAdmin from './AcademicCalendarAdmin';
import HolidaysAdmin from './HolidaysAdmin';

const TABS = [
  { id: 'calendar', label: 'Academic Calendar' },
  { id: 'holidays', label: 'Holidays' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function InformationAdmin() {
  const [tab, setTab] = useState<TabId>('calendar');

  return (
    <div>
      <div className="admin-page-selector" style={{ marginBottom: '1.25rem' }}>
        <div className="admin-page-selector__grid">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-page-btn${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'calendar' && <AcademicCalendarAdmin />}
      {tab === 'holidays' && <HolidaysAdmin />}
    </div>
  );
}
