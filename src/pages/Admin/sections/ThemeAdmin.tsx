import { useEffect, useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { COLOR_VARS, FOOTER_COLOR_VARS, FACULTY_COLOR_VARS, TESTIMONIAL_COLOR_VARS, THEME_DOC, type ColorVarDef } from '../../../lib/theme';

type ThemeDoc = Record<string, string>;

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

export default function ThemeAdmin() {
  const { data, loading } = useDocument<ThemeDoc>(THEME_DOC.collection, THEME_DOC.id);
  const [form, setForm] = useState<ThemeDoc>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Firestore is the source of truth once it's loaded — this only seeds the
  // form the first time data arrives (or when the doc is deleted via Reset),
  // so it doesn't fight with what the admin is actively typing.
  useEffect(() => {
    if (!loading) setForm(data ? { ...DEFAULTS, ...data } : DEFAULTS);
  }, [data, loading]);

  const setColor = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const cleaned: ThemeDoc = {};
      for (const v of ALL_VARS) {
        const validHex = normalizeHex(form[v.key]);
        if (v.inheritsFrom) {
          // Blank/invalid means "keep inheriting" — omit entirely rather
          // than pinning today's inherited value, or every save would lock
          // the footer to whatever Primary Dark happened to be at the time.
          if (validHex) cleaned[v.key] = validHex;
        } else {
          cleaned[v.key] = validHex || v.default;
        }
      }
      // setDoc without merge replaces the whole doc, so an omitted
      // inheriting key above is genuinely absent afterward, not just unset
      // locally — that's what lets Footer.css's var() fallback take over.
      await setDoc(doc(db, THEME_DOC.collection, THEME_DOC.id), cleaned);
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
