import { useEffect, useState } from 'react';
import { X, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import type { EventDoc } from '../Admin/sections/EventsAdmin';

interface Props {
  event: EventDoc;
  categoryColor: string;
  onClose: () => void;
}

/**
 * Full event details, opened from a card on the Events page — every field
 * shown here (image, organizer, description, gallery) comes straight off
 * the same EventDoc the card itself renders from, so there's nothing to
 * separately manage: whatever an admin fills in on the Events admin form
 * is exactly what shows here.
 */
export default function EventDetailModal({ event, categoryColor, onClose }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = event.galleryPhotos || [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, onClose]);

  return (
    <div className="ev-modal-backdrop" onClick={onClose}>
      <div className="ev-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="ev-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {event.image && (
          <div className="ev-modal-hero" style={{ backgroundImage: `url(${event.image})` }}>
            <span className="ev-category-badge" style={{ background: categoryColor }}>{event.category}</span>
          </div>
        )}

        <div className="ev-modal-body">
          {!event.image && (
            <span className="ev-category-badge" style={{ background: categoryColor, marginBottom: 'var(--space-3)' }}>
              {event.category}
            </span>
          )}
          <h2 className="ev-modal-title">{event.title}</h2>
          <div className="ev-modal-meta">
            <span><Clock size={15} /> {event.month} {event.day}{event.year ? `, ${event.year}` : ''}{event.time ? ` · ${event.time}` : ''}</span>
            {event.location && <span><MapPin size={15} /> {event.location}</span>}
            {event.organizer && <span><User size={15} /> {event.organizer}</span>}
          </div>
          {event.desc && <p className="ev-modal-desc">{event.desc}</p>}

          {gallery.length > 0 && (
            <>
              <h3 className="ev-modal-gallery-title">Event Gallery</h3>
              <div className="ev-modal-gallery-grid">
                {gallery.map((g, i) => (
                  <button type="button" key={g.storagePath || i} className="ev-modal-gallery-item" onClick={() => setLightboxIndex(i)}>
                    <img src={g.url} alt={g.caption || event.title} loading="lazy" />
                    {g.caption && <span className="ev-modal-gallery-caption">{g.caption}</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {event.link && (
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>
              Register / Learn More
            </a>
          )}
        </div>
      </div>

      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div className="ev-lightbox" onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}>
          <button type="button" className="ev-modal-close ev-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close">
            <X size={22} />
          </button>
          {gallery.length > 1 && (
            <button
              type="button"
              className="ev-lightbox-arrow ev-lightbox-arrow--prev"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length); }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
          )}
          <img
            src={gallery[lightboxIndex].url}
            alt={gallery[lightboxIndex].caption || event.title}
            onClick={(e) => e.stopPropagation()}
          />
          {gallery.length > 1 && (
            <button
              type="button"
              className="ev-lightbox-arrow ev-lightbox-arrow--next"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % gallery.length); }}
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          )}
          {gallery[lightboxIndex].caption && (
            <p className="ev-lightbox-caption" onClick={(e) => e.stopPropagation()}>{gallery[lightboxIndex].caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
