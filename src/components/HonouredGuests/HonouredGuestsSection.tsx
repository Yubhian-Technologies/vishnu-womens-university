import { useOrderedCollection } from '../../hooks/useCollection';
import SmoothImage from '../SmoothImage/SmoothImage';
import type { WithId } from '../../hooks/useCollection';
import './HonouredGuestsSection.css';

export interface HonouredGuestDoc {
  name: string;
  role: string;
  imageUrl: string;
  storagePath?: string;
  order: number;
}

type HonouredGuestItem = WithId & HonouredGuestDoc;

/**
 * Home page-only section — photo, name, and role for notable visitors VWU
 * has hosted. Admin-managed via /admin → Honoured Guests; renders nothing
 * until at least one guest has been added, same fallback pattern as every
 * other Firestore-backed section on this page (see CLAUDE.md's content
 * model notes).
 */
export default function HonouredGuestsSection() {
  const { docs: guests } = useOrderedCollection<HonouredGuestItem>('honouredGuests', 'order');
  if (guests.length === 0) return null;

  return (
    <section className="honoured-guests-section" aria-label="Honoured Guests at VWU">
      <div className="container">
        <h2 className="honoured-guests-title">Honoured Guests at VWU</h2>
        <div className="honoured-guests-grid">
          {guests.map((g) => (
            <div key={g.id} className="honoured-guest-card">
              <div className="honoured-guest-photo-wrap">
                <SmoothImage
                  src={g.imageUrl}
                  alt={g.name}
                  className="honoured-guest-photo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="honoured-guest-name">{g.name}</h3>
              {g.role && <p className="honoured-guest-role">{g.role}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
