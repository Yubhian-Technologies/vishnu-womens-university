import { useState } from 'react';
import AlumniEventsAdmin from './AlumniEventsAdmin';
import AlumniStoriesAdmin from './AlumniStoriesAdmin';
import GivingLevelsAdmin from './GivingLevelsAdmin';
import AlumniImpactAdmin from './AlumniImpactAdmin';

const TABS = [
  { id: 'events', label: 'Alumni Events' },
  { id: 'stories', label: 'Alumni Stories' },
  { id: 'giving', label: 'Giving Levels' },
  { id: 'impact', label: 'Impact & Companies' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AlumniAdmin() {
  const [tab, setTab] = useState<TabId>('events');

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

      {tab === 'events' && <AlumniEventsAdmin />}
      {tab === 'stories' && <AlumniStoriesAdmin />}
      {tab === 'giving' && <GivingLevelsAdmin />}
      {tab === 'impact' && <AlumniImpactAdmin />}
    </div>
  );
}
