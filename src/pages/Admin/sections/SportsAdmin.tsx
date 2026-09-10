import { useState } from 'react';
import SportsSettingsAdmin from './sports/SportsSettingsAdmin';
import SportsCategoryAdmin from './sports/SportsCategoryAdmin';
import SportsTournamentAdmin from './sports/SportsTournamentAdmin';
import SportsAchievementsAdmin from './sports/SportsAchievementsAdmin';
import SportsFacilityAdmin from './sports/SportsFacilityAdmin';

// Everything on the public Campus Life > Sports page (src/pages/Campus/
// Sports.tsx) is managed from here — page text/colours plus four
// Firestore-backed sections — so nothing on that page is hardcoded: no
// fixed list of sports, tournaments, achievements, or facilities, and
// admins can rename/re-picture/reorder/remove any of them at any time.
const TABS = [
  { id: 'settings', label: 'Page Text & Colours' },
  { id: 'explore', label: 'Explore Our Sports' },
  { id: 'tournaments', label: 'Collegewise Tournaments' },
  { id: 'achievements', label: 'Medals & Achievements' },
  { id: 'infrastructure', label: 'Infrastructure' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function SportsAdmin() {
  const [tab, setTab] = useState<TabId>('settings');

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

      {tab === 'settings' && <SportsSettingsAdmin />}
      {tab === 'explore' && <SportsCategoryAdmin />}
      {tab === 'tournaments' && <SportsTournamentAdmin />}
      {tab === 'achievements' && <SportsAchievementsAdmin />}
      {tab === 'infrastructure' && <SportsFacilityAdmin />}
    </div>
  );
}
