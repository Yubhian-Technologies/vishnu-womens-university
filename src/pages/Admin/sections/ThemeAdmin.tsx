import { useEffect, useState } from 'react';
import { doc, setDoc, deleteDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import { COLOR_VARS, FOOTER_COLOR_VARS, FACULTY_COLOR_VARS, TESTIMONIAL_COLOR_VARS, THEME_DOC, THEME_PRESETS_COLLECTION, type ColorVarDef } from '../../../lib/theme';

type ThemeDoc = Record<string, string>;

// A saved palette an admin can come back to and re-apply later — separate
// from THEME_DOC (the one doc that's actually live on the public site).
// `colors` is stored in the same already-cleaned shape save() below produces
// (every non-inheriting var present, every blank inheriting var omitted), so
// applying a preset later is just "write this doc's colors as the live
// theme" with no re-validation needed.
interface ThemePresetDoc extends WithId {
  name: string;
  colors: ThemeDoc;
}

const ALL_VARS = [...COLOR_VARS, ...FOOTER_COLOR_VARS, ...FACULTY_COLOR_VARS, ...TESTIMONIAL_COLOR_VARS];
// A var with `inheritsFrom` starts blank ("inherit"), not its literal
// default — see the save()/ColorGroup handling below for why that matters.
const DEFAULTS: ThemeDoc = Object.fromEntries(ALL_VARS.map((c) => [c.key, c.inheritsFrom ? '' : c.default]));

// A hex box is forgiving about what an admin pastes in (with/without "#",
// 3 or 6 digits) — normalized here so both the <input type="color"> swatch
// (which requires a strict "#rrggbb") and Firestore always get a clean value.
function normalizeHex(raw: string): string | null {
  const trimmed = raw.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`;
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed.toLowerCase().split('').map((c) => c + c).join('')}`;
  }
  return null;
}

interface GroupProps {
  vars: ColorVarDef[];
  form: ThemeDoc;
  setColor: (key: string, value: string) => void;
}

// Resolves what a field should actually show/preview right now: its own
// valid value, else (if it inherits) the current value of the var it
// inherits from, else its hardcoded default. Mirrors the CSS fallback chain
// in Footer.css so the admin preview never lies about the live result.
function resolveEffective(c: ColorVarDef, form: ThemeDoc): string {
  const own = normalizeHex(form[c.key] ?? '');
  if (own) return own;
  if (c.inheritsFrom) {
    const inherited = normalizeHex(form[c.inheritsFrom] ?? '');
    if (inherited) return inherited;
  }
  return c.default;
}

function ColorGroup({ vars, form, setColor }: GroupProps) {
  return (
    <>
      <div className="admin-theme-preview">
        {vars.map((c) => (
          <div
            key={c.key}
            className="admin-theme-swatch"
            style={{ background: resolveEffective(c, form) }}
            title={c.label}
          />
        ))}
      </div>
      <div className="admin-theme-rows">
        {vars.map((c) => {
          const raw = form[c.key] ?? '';
          const isBlank = raw.trim() === '';
          const valid = normalizeHex(raw);
          const effective = resolveEffective(c, form);
          // Blank is only an error for fields with nothing to fall back to —
          // for an inheriting field, blank is the intended "inherit" state.
          const showError = !isBlank && !valid;
          return (
            <div key={c.key} className="admin-theme-row">
              <input
                type="color"
                value={effective}
                onChange={(e) => setColor(c.key, e.target.value)}
                className="admin-theme-row__swatch-input"
                aria-label={`${c.label} color picker`}
              />
              <div className="admin-theme-row__text">
                <label>{c.label}</label>
                <p className="admin-field__hint" style={{ margin: 0 }}>
                  {c.hint}
                  {c.inheritsFrom && isBlank ? ` Currently inheriting ${effective}.` : ''}
                </p>
              </div>
              <input
                type="text"
                value={raw}
                onChange={(e) => setColor(c.key, e.target.value)}
                placeholder={c.inheritsFrom ? `Inherits (${effective})` : c.default}
                className="admin-theme-row__hex"
                style={showError ? { borderColor: '#dc2626' } : undefined}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

// Compact read-only preview for one saved preset in the list below — same
// swatch styling as ColorGroup's live preview, just smaller and fed from a
// preset's stored colors instead of the form being actively edited.
function PresetSwatches({ colors }: { colors: ThemeDoc }) {
  return (
    <div className="admin-theme-preview" style={{ marginBottom: 0, flex: '0 0 auto' }}>
      {COLOR_VARS.map((c) => (
        <div
          key={c.key}
          className="admin-theme-swatch"
          style={{ width: 22, height: 22, background: normalizeHex(colors[c.key] ?? '') || c.default }}
          title={c.label}
        />
      ))}
    </div>
  );
}

// Normalizes a form's raw values into what actually gets written to
// Firestore: every non-inheriting var present (falling back to its
// hardcoded default), every blank/invalid inheriting var omitted entirely
// so the CSS fallback chain (not a pinned value) resolves it. Shared by
// Save Theme and by saving/applying a named preset, so a preset's `colors`
// and the live THEME_DOC are always in the same shape.
function buildCleaned(source: ThemeDoc): ThemeDoc {
  const cleaned: ThemeDoc = {};
  for (const v of ALL_VARS) {
    const validHex = normalizeHex(source[v.key]);
    if (v.inheritsFrom) {
      if (validHex) cleaned[v.key] = validHex;
    } else {
      cleaned[v.key] = validHex || v.default;
    }
  }
  return cleaned;
}

export default function ThemeAdmin() {
  const { data, loading } = useDocument<ThemeDoc>(THEME_DOC.collection, THEME_DOC.id);
  const { docs: presets, loading: presetsLoading } = useOrderedCollection<ThemePresetDoc>(THEME_PRESETS_COLLECTION, 'createdAt', 'desc');
  const [form, setForm] = useState<ThemeDoc>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [presetBusyId, setPresetBusyId] = useState<string | null>(null);

  // Firestore is the source of truth once it's loaded — this only seeds the
  // form the first time data arrives (or when the doc is deleted via Reset),
  // so it doesn't fight with what the admin is actively typing.
  useEffect(() => {
    if (!loading) setForm(data ? { ...DEFAULTS, ...data } : DEFAULTS);
  }, [data, loading]);

  const setColor = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  // setDoc without merge replaces the whole doc, so an omitted inheriting
  // key is genuinely absent afterward, not just unset locally — that's what
  // lets Footer.css's var() fallback take over.
  const persistLiveTheme = (cleaned: ThemeDoc) => setDoc(doc(db, THEME_DOC.collection, THEME_DOC.id), cleaned);

  const save = async () => {
    setSaving(true);
    try {
      const cleaned = buildCleaned(form);
      await persistLiveTheme(cleaned);
      // Merge over DEFAULTS (not just `cleaned`) so an omitted inheriting
      // key reverts to '' in the form too, instead of lingering as whatever
      // it displayed right before Save.
      setForm({ ...DEFAULTS, ...cleaned });
    } catch (e) {
      alert(`Couldn't save theme: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const saveAsNewPreset = async () => {
    const name = newPresetName.trim();
    if (!name) return;
    setPresetBusyId('new');
    try {
      await addDoc(collection(db, THEME_PRESETS_COLLECTION), {
        name,
        colors: buildCleaned(form),
        createdAt: serverTimestamp(),
      });
      setNewPresetName('');
    } catch (e) {
      alert(`Couldn't save theme preset: ${(e as Error).message}`);
    } finally {
      setPresetBusyId(null);
    }
  };

  // Makes a saved preset the live site theme immediately, and loads it into
  // the editor below so it can be tweaked further from there.
  const applyPreset = async (preset: ThemePresetDoc) => {
    setPresetBusyId(preset.id);
    try {
      await persistLiveTheme(preset.colors);
      setForm({ ...DEFAULTS, ...preset.colors });
    } catch (e) {
      alert(`Couldn't apply "${preset.name}": ${(e as Error).message}`);
    } finally {
      setPresetBusyId(null);
    }
  };

  // Overwrites a saved preset with whatever's currently in the editor below
  // — lets an admin tweak a theme, then update the same saved slot instead
  // of piling up a new one.
  const updatePreset = async (preset: ThemePresetDoc) => {
    setPresetBusyId(preset.id);
    try {
      await updateDoc(doc(db, THEME_PRESETS_COLLECTION, preset.id), { colors: buildCleaned(form) });
    } catch (e) {
      alert(`Couldn't update "${preset.name}": ${(e as Error).message}`);
    } finally {
      setPresetBusyId(null);
    }
  };

  const deletePreset = async (preset: ThemePresetDoc) => {
    if (!confirm(`Delete the saved theme "${preset.name}"? This cannot be undone.`)) return;
    setPresetBusyId(preset.id);
    try {
      await deleteDoc(doc(db, THEME_PRESETS_COLLECTION, preset.id));
    } catch (e) {
      alert(`Couldn't delete "${preset.name}": ${(e as Error).message}`);
    } finally {
      setPresetBusyId(null);
    }
  };

  const resetToDefaults = async () => {
    if (!confirm("Reset every color (including the footer) back to VWU's default palette? This applies to the live site immediately.")) return;
    setResetting(true);
    try {
      await deleteDoc(doc(db, THEME_DOC.collection, THEME_DOC.id));
      setForm(DEFAULTS);
    } catch (e) {
      alert(`Couldn't reset: ${(e as Error).message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Saved Color Themes</h2>
        <p className="admin-lead" style={{ marginBottom: '1.25rem' }}>
          Save the palette below as a named theme (e.g. "Theme 1", "Diwali Gold"), then apply any
          saved theme later to make the whole site use it again instantly, without re-entering every
          color by hand.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Name this theme — e.g. Theme 1"
            className="admin-theme-row__hex"
            style={{ flex: '1 1 240px', fontFamily: 'inherit', fontSize: '0.9rem' }}
            onKeyDown={(e) => { if (e.key === 'Enter') saveAsNewPreset(); }}
          />
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={saveAsNewPreset}
            disabled={!newPresetName.trim() || presetBusyId === 'new'}
          >
            {presetBusyId === 'new' ? 'Saving…' : 'Save Current as New Theme'}
          </button>
        </div>

        {presetsLoading ? (
          <p className="admin-loading">Loading…</p>
        ) : presets.length === 0 ? (
          <p className="admin-field__hint">No saved themes yet — set some colors below, name a theme above, and save it.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {presets.map((preset) => (
              <div
                key={preset.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                  border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '0.75rem 1rem',
                }}
              >
                <PresetSwatches colors={preset.colors} />
                <strong style={{ flex: '1 1 160px', color: '#081c15' }}>{preset.name}</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary admin-btn--sm"
                    onClick={() => applyPreset(preset)}
                    disabled={presetBusyId === preset.id}
                  >
                    {presetBusyId === preset.id ? 'Applying…' : 'Apply'}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm"
                    onClick={() => updatePreset(preset)}
                    disabled={presetBusyId === preset.id}
                    title="Overwrite this saved theme with the colors currently in the editor below"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm admin-btn--danger"
                    onClick={() => deletePreset(preset)}
                    disabled={presetBusyId === preset.id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Website Color Theme</h2>
        <p className="admin-lead" style={{ marginBottom: '1.25rem' }}>
          These colors are used everywhere on the public website — buttons, headings, backgrounds,
          borders. Changing one here changes it site-wide, live, with no deploy needed. This does not
          affect this admin panel's own colors.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : <ColorGroup vars={COLOR_VARS} form={form} setColor={setColor} />}
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Footer Colors</h2>
        <p className="admin-lead" style={{ marginBottom: '1.25rem' }}>
          The footer stays visually distinct from the rest of the page (usually the darkest band on
          any site), so it has its own colors here instead of reusing the theme above directly. Until
          you save a value in this section, the footer background quietly follows Primary Dark and its
          accent follows Accent, from the theme above.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : <ColorGroup vars={FOOTER_COLOR_VARS} form={form} setColor={setColor} />}
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Faculty Section Colors</h2>
        <p className="admin-lead" style={{ marginBottom: '1.25rem' }}>
          The "Meet Our Faculty" block on each program page (/academics/&lt;program&gt;) is its own bold
          color block, separate from every button/badge elsewhere that uses Accent. Until you save a
          value here, it quietly follows Accent and Accent Light from the theme above.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : <ColorGroup vars={FACULTY_COLOR_VARS} form={form} setColor={setColor} />}
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Alumni Section Colors</h2>
        <p className="admin-lead" style={{ marginBottom: '1.25rem' }}>
          The "Alumni Voices &amp; Stories" testimonial section ships its own dark teal + lime look,
          separate from the rest of the site. Until you save a value here, it quietly follows Primary
          Dark, Primary, and Accent from the theme above.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : <ColorGroup vars={TESTIMONIAL_COLOR_VARS} form={form} setColor={setColor} />}
      </div>

      <div className="admin-card">
        <div className="admin-form-actions">
          <button className="admin-btn admin-btn--ghost" onClick={resetToDefaults} disabled={resetting || saving}>
            {resetting ? 'Resetting…' : 'Reset to Defaults'}
          </button>
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving || resetting}>
            {saving ? 'Saving…' : 'Save Theme'}
          </button>
        </div>
      </div>
    </div>
  );
}
