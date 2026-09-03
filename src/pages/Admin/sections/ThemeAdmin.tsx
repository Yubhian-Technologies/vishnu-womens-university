import { useEffect, useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { COLOR_VARS, THEME_DOC } from '../../../lib/theme';

type ThemeDoc = Record<string, string>;

const DEFAULTS: ThemeDoc = Object.fromEntries(COLOR_VARS.map((c) => [c.key, c.default]));

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

  const handleHexInput = (key: string, raw: string) => {
    setColor(key, raw);
  };

  const save = async () => {
    setSaving(true);
    try {
      const cleaned: ThemeDoc = {};
      for (const { key, default: fallback } of COLOR_VARS) {
        cleaned[key] = normalizeHex(form[key]) || fallback;
      }
      await setDoc(doc(db, THEME_DOC.collection, THEME_DOC.id), cleaned);
      setForm(cleaned);
    } catch (e) {
      alert(`Couldn't save theme: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (!confirm("Reset every color back to VWU's default palette? This applies to the live site immediately.")) return;
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

        <div className="admin-theme-preview">
          {COLOR_VARS.map((c) => (
            <div
              key={c.key}
              className="admin-theme-swatch"
              style={{ background: normalizeHex(form[c.key]) || c.default }}
              title={c.label}
            />
          ))}
        </div>

        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-theme-rows">
            {COLOR_VARS.map((c) => {
              const valid = normalizeHex(form[c.key]);
              return (
                <div key={c.key} className="admin-theme-row">
                  <input
                    type="color"
                    value={valid || c.default}
                    onChange={(e) => setColor(c.key, e.target.value)}
                    className="admin-theme-row__swatch-input"
                    aria-label={`${c.label} color picker`}
                  />
                  <div className="admin-theme-row__text">
                    <label>{c.label}</label>
                    <p className="admin-field__hint" style={{ margin: 0 }}>{c.hint}</p>
                  </div>
                  <input
                    type="text"
                    value={form[c.key] ?? ''}
                    onChange={(e) => handleHexInput(c.key, e.target.value)}
                    placeholder={c.default}
                    className="admin-theme-row__hex"
                    style={!valid ? { borderColor: '#dc2626' } : undefined}
                  />
                </div>
              );
            })}
          </div>
        )}

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
