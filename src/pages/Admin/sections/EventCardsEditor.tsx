import { useEffect } from 'react';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { flattenSectionsToEventCards, type CustomSection, type CustomSectionImageCard } from '../../../lib/customSections';

const EVENTS_SECTION_ID = 'events';

function isNormalized(sections: CustomSection[]): boolean {
  return sections.length === 1 && sections[0].id === EVENTS_SECTION_ID
    && sections[0].contentType === 'imageCards' && !sections[0].subSections?.length;
}

interface Props {
  // Whatever shape this department's News & Events data is currently in
  // (already one flat 'imageCards' section, several named sections, or the
  // older table/text shape auto-migrated from the fixed News & Events/
  // Student Awards/Others fields) — flattened below into the one simple list
  // this editor shows, so nothing already entered is lost just by opening it.
  sections: CustomSection[];
  onChange: (next: CustomSection[]) => void;
  // Same path-addressed upload/remove handlers DepartmentsAdmin.tsx already
  // wires for newsEventsSections — every card lives at sectionPath [0] since
  // this editor always collapses back to exactly one section on save.
  onImageCardPhotoUploaded: (sectionPath: number[], cardIndex: number, r: UploadResult) => void;
  onImageCardPhotoRemoved: (sectionPath: number[], cardIndex: number) => void;
}

export default function EventCardsEditor({ sections, onChange, onImageCardPhotoUploaded, onImageCardPhotoRemoved }: Props) {
  // Once already normalized, read `imageCards` directly (no filtering) —
  // a freshly-added card is blank (no image/title/description yet) and must
  // still show up so it can be filled in. flattenSectionsToEventCards drops
  // exactly those "no real content" cards, which is right for one-time
  // migration out of an older shape (nothing to gather from a truly empty
  // legacy section) but would otherwise hide a card the instant it's added,
  // since the very next render would filter it straight back out.
  const cards = isNormalized(sections) ? (sections[0].imageCards || []) : flattenSectionsToEventCards(sections);

  // The photo upload/remove handlers below address a card purely by index
  // into `newsEventsSections[0].imageCards` (see DepartmentsAdmin.tsx's
  // makeSectionHandlers) — that only lines up with what's shown here once
  // the data is actually in that single-section shape. Normalize as soon as
  // this editor sees anything else (several named sections, or the older
  // table/text shape), so the very first click on a not-yet-touched
  // department's Add/Remove/Upload works, instead of silently addressing the
  // wrong (or no) section. Converges in one extra render: once normalized,
  // the guard below skips re-committing.
  useEffect(() => {
    if (!isNormalized(sections)) {
      onChange([{ id: EVENTS_SECTION_ID, label: 'Events', contentType: 'imageCards', imageCards: flattenSectionsToEventCards(sections) }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  // Every edit rewrites the whole field as one normalized section, so the
  // public page's carousel (see NewsEventsTabs.tsx) always sees a single,
  // pure 'imageCards' section — no leftover named sections/tabs to repeat a
  // heading, whatever shape the data started in.
  const commit = (nextCards: CustomSectionImageCard[]) => {
    onChange([{ id: EVENTS_SECTION_ID, label: 'Events', contentType: 'imageCards', imageCards: nextCards }]);
  };

  const addCard = () => commit([...cards, { imageUrl: '', storagePath: '', title: '', description: '' }]);
  const updateField = (ci: number, field: 'title' | 'description', value: string) => {
    commit(cards.map((c, i) => (i === ci ? { ...c, [field]: value } : c)));
  };
  const moveCard = (ci: number, dir: -1 | 1) => {
    const next = [...cards];
    const target = ci + dir;
    if (target < 0 || target >= next.length) return;
    [next[ci], next[target]] = [next[target], next[ci]];
    commit(next);
  };

  return (
    <div>
      {cards.map((card, ci) => (
        <div key={ci} style={{ border: '1px solid var(--color-light-gray)', borderRadius: 6, padding: '0.6rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input
              value={card.title}
              onChange={(e) => updateField(ci, 'title', e.target.value)}
              placeholder="Title"
              style={{ flex: 1, fontWeight: 700 }}
            />
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveCard(ci, -1)} disabled={ci === 0} title="Move up">↑</button>
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => moveCard(ci, 1)} disabled={ci === cards.length - 1} title="Move down">↓</button>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => onImageCardPhotoRemoved([0], ci)}>✕</button>
          </div>
          <textarea
            value={card.description}
            onChange={(e) => updateField(ci, 'description', e.target.value)}
            placeholder="Description…"
            rows={2}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <div style={{ width: 140 }}>
            <ImageUploader
              folder="vwu/custom-sections/image-cards"
              currentUrl={card.imageUrl}
              aspect={4 / 3}
              label="Upload Image"
              onUploaded={(r) => onImageCardPhotoUploaded([0], ci, r)}
            />
          </div>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn--primary" onClick={addCard}>+ Add Event</button>
      {cards.length === 0 && (
        <p className="admin-field__hint">No events yet — click "Add Event" to create one.</p>
      )}
    </div>
  );
}
