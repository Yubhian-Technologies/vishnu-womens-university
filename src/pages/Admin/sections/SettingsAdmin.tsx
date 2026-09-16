import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { Plus, Trash2, GripVertical, Save, X } from 'lucide-react';

export interface AdmissionPreset {
  id: string;
  name: string;
  code: string;
  label: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  createdAt?: unknown;
}

const EMPTY_PRESET: Omit<AdmissionPreset, 'id' | 'createdAt'> = {
  name: '',
  code: '',
  label: 'Applying via AP EAPCET?',
  description: '',
  ctaText: 'See the full admissions process',
  ctaLink: '/admissions',
  order: 0,
};

export default function SettingsAdmin() {
  const { docs: presets, loading } = useOrderedCollection<AdmissionPreset>('admissionPresets', 'order');
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<AdmissionPreset, 'id' | 'createdAt'>>(EMPTY_PRESET);
  const [showForm, setShowForm] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const startAdd = () => {
    setForm({ ...EMPTY_PRESET, order: presets.length });
    setEditing(null);
    setShowForm(true);
  };

  const startEdit = (preset: AdmissionPreset) => {
    setForm({
      name: preset.name,
      code: preset.code,
      label: preset.label,
      description: preset.description,
      ctaText: preset.ctaText,
      ctaLink: preset.ctaLink,
      order: preset.order,
    });
    setEditing(preset.id);
    setShowForm(true);
  };

  const cancel = () => {
    setEditing(null);
    setShowForm(false);
    setForm(EMPTY_PRESET);
  };

  const save = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      alert('Name and Code are required.');
      return;
    }
    try {
      if (editing) {
        await updateDoc(doc(db, 'admissionPresets', editing), { ...form });
      } else {
        await addDoc(collection(db, 'admissionPresets'), { ...form, createdAt: serverTimestamp() });
      }
      cancel();
    } catch (e) {
      alert(`Save failed: ${(e as Error).message}`);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this preset? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'admissionPresets', id));
    } catch (e) {
      alert(`Delete failed: ${(e as Error).message}`);
    }
  };

  const movePreset = async (idx: number, dir: -1 | 1) => {
    const next = [...presets];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    // Update order field for both swapped items
    await Promise.all(
      next.map((p, i) => updateDoc(doc(db, 'admissionPresets', p.id), { order: i }))
    );
  };

  return (
    <div className="admin-section">
      <div>
        <h2 style={{ margin: '0 0 0.25rem' }}>Settings</h2>
        <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: 'var(--text-sm)' }}>
          Manage global presets and configuration for the site.
        </p>
      </div>

      {/* Admission Code Presets */}
      <details className="admin-accordion" open>
        <summary className="admin-accordion__summary">Admission Code Presets</summary>
        <div style={{ padding: '1rem' }}>
          <p className="admin-field__hint" style={{ marginTop: '0.25rem', marginBottom: '1rem' }}>
            Manage reusable admission code panels for department pages. Departments can select a preset
            to display in their "Department Profile" section, or choose "Hide Panel" to remove it entirely.
          </p>

          {!showForm && (
            <button type="button" className="admin-btn admin-btn--primary" onClick={startAdd}>
              <Plus size={16} /> Add New Preset
            </button>
          )}

          {showForm && (
            <div style={{ border: '1.5px solid var(--color-light-gray)', borderRadius: 8, padding: '1rem', marginBottom: '1rem', background: 'var(--color-off-white)' }}>
              <h4 style={{ margin: '0 0 0.75rem' }}>{editing ? 'Edit Preset' : 'New Preset'}</h4>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="preset-name">Preset Name *</label>
                  <input
                    id="preset-name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="B.Tech CSE EAPCET"
                  />
                  <p className="admin-field__hint">Display name in the department dropdown</p>
                </div>
                <div className="admin-field">
                  <label htmlFor="preset-code">Code *</label>
                  <input
                    id="preset-code"
                    value={form.code}
                    onChange={(e) => set('code', e.target.value)}
                    placeholder="CSE001"
                  />
                  <p className="admin-field__hint">The code shown on the department page</p>
                </div>
                <div className="admin-field admin-field--full">
                  <label htmlFor="preset-label">Panel Title</label>
                  <input
                    id="preset-label"
                    value={form.label}
                    onChange={(e) => set('label', e.target.value)}
                    placeholder="Applying via AP EAPCET?"
                  />
                </div>
                <div className="admin-field admin-field--full">
                  <label htmlFor="preset-desc">Description</label>
                  <input
                    id="preset-desc"
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Enter this code during counselling to choose CSE"
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="preset-cta-text">CTA Text</label>
                  <input
                    id="preset-cta-text"
                    value={form.ctaText}
                    onChange={(e) => set('ctaText', e.target.value)}
                    placeholder="See the full admissions process"
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="preset-cta-link">CTA Link</label>
                  <input
                    id="preset-cta-link"
                    value={form.ctaLink}
                    onChange={(e) => set('ctaLink', e.target.value)}
                    placeholder="/admissions"
                  />
                  <p className="admin-field__hint">Internal path or full URL</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button type="button" className="admin-btn admin-btn--primary" onClick={save}>
                  <Save size={16} /> {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={cancel}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}

          {loading && <p>Loading presets...</p>}

          {!loading && presets.length === 0 && (
            <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
              No presets yet. Click "Add New Preset" to create one.
            </p>
          )}

          {!loading && presets.length > 0 && (
            <div style={{ border: '1px solid var(--color-light-gray)', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-off-white)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700 }}></th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700 }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700 }}>Code</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700 }}>Label</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700 }}>CTA Link</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map((preset, idx) => (
                    <tr key={preset.id} style={{ borderTop: '1px solid var(--color-light-gray)' }}>
                      <td style={{ padding: '0.5rem', width: 40 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <button
                            type="button"
                            onClick={() => movePreset(idx, -1)}
                            disabled={idx === 0}
                            style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', padding: 2, color: idx === 0 ? 'var(--color-light-gray)' : 'var(--color-text)' }}
                            title="Move up"
                          >
                            <GripVertical size={14} />
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{preset.name}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <code style={{ background: 'var(--color-off-white)', padding: '0.15rem 0.4rem', borderRadius: 4, fontSize: '0.85em' }}>{preset.code}</code>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-light)' }}>{preset.label}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-light)' }}>{preset.ctaLink}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" className="admin-btn admin-btn--sm" onClick={() => startEdit(preset)}>
                            Edit
                          </button>
                          <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(preset.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
