import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useDocument } from '../../../../hooks/useDocument';
import ImageUploader from '../../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../../lib/storage';
import {
  SPORTS_HERO_DEFAULTS, SPORTS_TEXT_SUGGESTIONS, SPORTS_CLOSING_SUGGESTION, SPORTS_PALETTES, SPORTS_PALETTE_PHOTO,
  isCustomSectionColor, toSportsSettingsForm,
  type SportsPageSettingsDoc, type SportsSectionText, type SportsPaletteSection,
} from '../../../../lib/sportsPage';

// Reused for the page-wide (hero/closing) palette and each of the 4
// sections' own independent palette — same swatch-button picker, just
// pointed at a different value/setter. `allowPhoto` adds a leading "Photo"
// swatch (only meaningful for the 4 content sections, which sit over the
// shared background photo) that opts back out of a solid colour, and a
// trailing "Custom" swatch backed by a native colour input so a section
// isn't limited to the curated presets — any colour can be picked.
function PalettePicker({ value, onChange, allowPhoto }: { value: string; onChange: (key: string) => void; allowPhoto?: boolean }) {
  const isCustom = isCustomSectionColor(value);
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      {allowPhoto && (
        <button
          type="button"
          onClick={() => onChange(SPORTS_PALETTE_PHOTO)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
            padding: '0.6rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            border: value === SPORTS_PALETTE_PHOTO ? '2px solid var(--color-primary)' : '2px solid var(--color-light-gray)',
            background: value === SPORTS_PALETTE_PHOTO ? 'var(--color-off-white)' : 'var(--color-white)',
          }}
        >
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 32,
            borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)',
            background: 'repeating-linear-gradient(45deg, #cbd5e1, #cbd5e1 4px, #e2e8f0 4px, #e2e8f0 8px)',
          }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Photo</span>
        </button>
      )}
      {Object.entries(SPORTS_PALETTES).map(([key, p]) => (
        <button
          type="button"
          key={key}
          onClick={() => onChange(key)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
            padding: '0.6rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            border: value === key ? '2px solid var(--color-primary)' : '2px solid var(--color-light-gray)',
            background: value === key ? 'var(--color-off-white)' : 'var(--color-white)',
          }}
        >
          <span style={{ display: 'flex', borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ width: 20, height: 32, background: p.primaryDark }} />
            <span style={{ width: 20, height: 32, background: p.primary }} />
            <span style={{ width: 20, height: 32, background: p.accent }} />
          </span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{p.label}</span>
        </button>
      ))}
      {allowPhoto && (
        <div
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
            padding: '0.6rem', borderRadius: 'var(--radius-md)',
            border: isCustom ? '2px solid var(--color-primary)' : '2px solid var(--color-light-gray)',
            background: isCustom ? 'var(--color-off-white)' : 'var(--color-white)',
          }}
        >
          <input
            type="color"
            value={isCustom ? value : '#0b1e42'}
            onChange={(e) => onChange(e.target.value)}
            title="Pick any colour"
            style={{ width: 60, height: 32, padding: 0, border: 'none', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', background: 'none' }}
          />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{isCustom ? value.toUpperCase() : 'Any colour…'}</span>
        </div>
      )}
    </div>
  );
}

// Every piece of text and the color palette for the whole Sports page, in one
// settings doc (id "main") — hero copy, each section's eyebrow/heading/
// subtitle, and the closing tagline band. Fields start blank (the actual
// saved value, or "" if never set) — the greyed-out placeholder text is only
// a suggestion, never saved unless you type it in and hit Save. On the
// public page, a section with an empty title doesn't show a heading, and a
// section with no cards added yet doesn't render at all — nothing here is a
// hardcoded fallback.
export default function SportsSettingsAdmin() {
  const { data: settings } = useDocument<SportsPageSettingsDoc>('sportsPageSettings', 'main');
  const [form, setForm] = useState<SportsPageSettingsDoc>(() => toSportsSettingsForm(null));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(toSportsSettingsForm(settings));
  }, [settings]);

  const setTop = <K extends 'heroTitle' | 'heroSubtitle' | 'palette'>(k: K, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setSection = (section: 'explore' | 'tournaments' | 'achievements' | 'infrastructure', k: keyof SportsSectionText, v: string) =>
    setForm((p) => ({ ...p, [section]: { ...p[section], [k]: v } }));

  const setSectionPalette = (section: SportsPaletteSection, key: string) =>
    setForm((p) => ({ ...p, sectionPalettes: { ...p.sectionPalettes, [section]: key } }));

  const setSectionOpacity = (section: SportsPaletteSection, value: number) =>
    setForm((p) => ({ ...p, sectionOpacities: { ...p.sectionOpacities, [section]: value } }));

  const setClosing = (k: keyof SportsPageSettingsDoc['closing'], v: string) =>
    setForm((p) => ({ ...p, closing: { ...p.closing, [k]: v } }));

  const setAchievementsIcon = (r: UploadResult) =>
    setForm((p) => ({ ...p, achievementsIcon: { imageUrl: r.url, storagePath: r.path } }));

  // Persists immediately (not just local form state) — otherwise the photo
  // looks removed until Save is clicked, and reappears on any refresh
  // before that, which reads as the button "not working".
  const removeAchievementsIcon = async () => {
    if (form.achievementsIcon.storagePath) {
      try { await deleteFile(form.achievementsIcon.storagePath); } catch { /* best-effort */ }
    }
    const cleared = { imageUrl: '', storagePath: '' };
    setForm((p) => ({ ...p, achievementsIcon: cleared }));
    try {
      await setDoc(doc(db, 'sportsPageSettings', 'main'), { achievementsIcon: cleared }, { merge: true });
    } catch (e) {
      alert(`Couldn't remove photo: ${(e as Error).message}`);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'sportsPageSettings', 'main'), form, { merge: true });
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const sectionForm = (
    section: 'explore' | 'tournaments' | 'achievements' | 'infrastructure',
    heading: string,
  ) => {
    const suggestion = SPORTS_TEXT_SUGGESTIONS[section];
    return (
      <div className="admin-card" key={section}>
        <h2 className="admin-card__title">{heading}</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Leave any field blank to show the suggested text below it (shown as placeholder text) — the whole section itself stays hidden until at least one card has been added in its own tab.
        </p>
        {section === 'achievements' && (
          <div className="admin-field" style={{ marginBottom: '1.25rem', maxWidth: 220 }}>
            <label>Heading Photo (optional)</label>
            <p className="admin-field__hint" style={{ marginBottom: '0.5rem' }}>
              Shown large to the left of the "Medals &amp; Achievements" heading, in place of the small trophy icon — e.g. a trophy photo, like the "Champions" look in the reference design. Leave empty to keep the small icon.
            </p>
            <ImageUploader folder="vwu/sports" currentUrl={form.achievementsIcon.imageUrl} onUploaded={setAchievementsIcon} label="Upload Photo" />
            {form.achievementsIcon.imageUrl && (
              <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" style={{ marginTop: '0.5rem' }} onClick={removeAchievementsIcon}>
                Remove Photo
              </button>
            )}
          </div>
        )}
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor={`field-sports-${section}-label`}>Eyebrow Label</label>
            <input id={`field-sports-${section}-label`} value={form[section].label} onChange={(e) => setSection(section, 'label', e.target.value)} placeholder={suggestion.label} />
          </div>
          <div className="admin-field">
            <label htmlFor={`field-sports-${section}-title`}>Section Heading</label>
            <input id={`field-sports-${section}-title`} value={form[section].title} onChange={(e) => setSection(section, 'title', e.target.value)} placeholder={suggestion.title} />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor={`field-sports-${section}-subtitle`}>Subtitle (optional)</label>
            <input id={`field-sports-${section}-subtitle`} value={form[section].subtitle} onChange={(e) => setSection(section, 'subtitle', e.target.value)} placeholder="Leave blank to match the reference design, which has no subtitle here" />
          </div>
        </div>
        <div className="admin-field" style={{ marginTop: '1.25rem' }}>
          <label>Colour Palette</label>
          <p className="admin-field__hint" style={{ marginBottom: '0.75rem' }}>
            "Photo" (default) shows the shared background photo through this section. Picking a colour instead gives this section a solid background in that colour, hiding the photo behind it — independent of every other section.
          </p>
          <PalettePicker value={form.sectionPalettes[section]} onChange={(key) => setSectionPalette(section, key)} allowPhoto />
        </div>
        {form.sectionPalettes[section] !== SPORTS_PALETTE_PHOTO && (
          <div className="admin-field" style={{ marginTop: '1.25rem', maxWidth: 320 }}>
            <label htmlFor={`field-sports-${section}-opacity`}>Colour Opacity ({form.sectionOpacities[section]}%)</label>
            <p className="admin-field__hint" style={{ marginBottom: '0.5rem' }}>
              100% is fully solid (photo not visible at all). Lower it to let the background photo blend through the colour.
            </p>
            <input
              id={`field-sports-${section}-opacity`}
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.sectionOpacities[section]}
              onChange={(e) => setSectionOpacity(section, Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Hero Banner Text</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Blank shows the site's default hero copy below — same as leaving any page's hero banner untouched. The hero photo is set from Admin → Hero Banners (page "campus-sports").
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-sports-hero-title">Hero Title</label>
            <input id="field-sports-hero-title" value={form.heroTitle} onChange={(e) => setTop('heroTitle', e.target.value)} placeholder={SPORTS_HERO_DEFAULTS.heroTitle} />
            <p className="admin-field__hint">The last word is shown in the accent colour.</p>
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="field-sports-hero-subtitle">Hero Subtitle</label>
            <textarea id="field-sports-hero-subtitle" value={form.heroSubtitle} onChange={(e) => setTop('heroSubtitle', e.target.value)} placeholder={SPORTS_HERO_DEFAULTS.heroSubtitle} rows={2} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Hero &amp; Closing Band Colour Palette</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Sets the hero accent and the closing band's background/accent colours. Each of the 4 sections below has its own separate palette choice instead — see "Colour Palette" within each section's own card.
        </p>
        <PalettePicker value={form.palette} onChange={(key) => setTop('palette', key)} />
      </div>

      {sectionForm('explore', 'Explore Our Sports — Section Text & Colours')}
      {sectionForm('tournaments', 'Collegewise Tournaments — Section Text & Colours')}
      {sectionForm('achievements', 'Medals & Achievements — Section Text & Colours')}

      {sectionForm('infrastructure', 'Infrastructure & Our Sports — Section Text & Colours')}

      <div className="admin-card">
        <h2 className="admin-card__title">Closing Band</h2>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Up to three short phrases shown side by side at the very bottom of the page (e.g. "More Sports | More Opportunities | A Healthier You"). The whole band is hidden until at least the first phrase is set.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-sports-closing-1">Phrase 1</label>
            <input id="field-sports-closing-1" value={form.closing.segment1} onChange={(e) => setClosing('segment1', e.target.value)} placeholder={SPORTS_CLOSING_SUGGESTION.segment1} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-sports-closing-2">Phrase 2</label>
            <input id="field-sports-closing-2" value={form.closing.segment2} onChange={(e) => setClosing('segment2', e.target.value)} placeholder={SPORTS_CLOSING_SUGGESTION.segment2} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-sports-closing-3">Phrase 3</label>
            <input id="field-sports-closing-3" value={form.closing.segment3} onChange={(e) => setClosing('segment3', e.target.value)} placeholder={SPORTS_CLOSING_SUGGESTION.segment3} />
          </div>
        </div>
      </div>

      <div className="admin-form-actions">
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Page Text & Colours'}
        </button>
      </div>
    </div>
  );
}
