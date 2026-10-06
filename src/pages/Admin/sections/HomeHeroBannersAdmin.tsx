import { useState } from 'react';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDoc, deleteDoc, updateDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import {
  HOME_HERO_BANNERS_COLLECTION,
  MAX_HOME_HERO_BANNERS,
  HERO_TEXT_POSITIONS,
  type HomeHeroBannerDoc,
} from '../../../lib/heroBanners';

type FormState = Omit<HomeHeroBannerDoc, 'id'>;

const EMPTY: FormState = {
  imageUrl: '', storagePath: '', text: '', subtext: '', position: 'bottom-left',
  ctaLabel: '', ctaLink: '', active: true, order: 0,
};

export default function HomeHeroBannersAdmin() {
  const { docs: items, loading } = useOrderedCollection<HomeHeroBannerDoc>(HOME_HERO_BANNERS_COLLECTION, 'order');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((p) => ({ ...p, [k]: v }));
  const activeCount = items.filter((b) => b.active !== false).length;

  const reset = () => { setForm(EMPTY); setEditing(null); };

  const save = async () => {
    if (!form.imageUrl) return alert('Please upload a banner image.');
    // The home hero only ever plays MAX banners, so don't let more be switched on.
    const editingItem = items.find((b) => b.id === editing);
    const wasActive = editingItem ? editingItem.active !== false : false;
    if (form.active && !wasActive && activeCount >= MAX_HOME_HERO_BANNERS) {
      return alert(`Only ${MAX_HOME_HERO_BANNERS} banners can be active. Hide another banner first.`);
    }
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, HOME_HERO_BANNERS_COLLECTION, editing), { ...form });
      } else {
        await addDoc(collection(db, HOME_HERO_BANNERS_COLLECTION), { ...form, createdAt: serverTimestamp() });
      }
      reset();
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (b: HomeHeroBannerDoc) => {
    setEditing(b.id);
    setForm({
      imageUrl: b.imageUrl, storagePath: b.storagePath || '', text: b.text || '', subtext: b.subtext || '',
      position: b.position || 'bottom-left', ctaLabel: b.ctaLabel || '', ctaLink: b.ctaLink || '',
      active: b.active !== false, order: b.order ?? 0,
    });
  };

  const remove = async (b: HomeHeroBannerDoc) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await deleteDoc(doc(db, HOME_HERO_BANNERS_COLLECTION, b.id));
      if (b.storagePath) await deleteFile(b.storagePath).catch(() => {});
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const toggle = async (b: HomeHeroBannerDoc) => {
    const turningOn = b.active === false;
    if (turningOn && activeCount >= MAX_HOME_HERO_BANNERS) {
      return alert(`Only ${MAX_HOME_HERO_BANNERS} banners can be active. Hide another banner first.`);
    }
    try {
      await updateDoc(doc(db, HOME_HERO_BANNERS_COLLECTION, b.id), { active: turningOn });
    } catch (e) {
      alert(`Couldn't update: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Home Hero Banner' : 'Add Home Hero Banner'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Up to {MAX_HOME_HERO_BANNERS} full-screen banners play once on the home page, in display order, before the hero
          video takes over. With no active banners the hero video shows straight away.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Banner image * (16:9 recommended)</label>
            <ImageUploader
              folder="vwu/home-hero"
              aspect={16 / 9}
              label="Upload banner image"
              currentUrl={form.imageUrl}
              onUploaded={(r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }))}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="hb-text">Overlay text</label>
            <input id="hb-text" value={form.text} onChange={(e) => set('text', e.target.value)} placeholder="e.g. Admissions open for 2026–27" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="hb-subtext">Smaller line (optional)</label>
            <input id="hb-subtext" value={form.subtext} onChange={(e) => set('subtext', e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="hb-position">Text position</label>
            <select id="hb-position" value={form.position} onChange={(e) => set('position', e.target.value as FormState['position'])}>
              {HERO_TEXT_POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="hb-order">Display order</label>
            <input id="hb-order" type="number" min={0} value={form.order} onChange={(e) => set('order', +e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="hb-cta">Button label (optional)</label>
            <input id="hb-cta" value={form.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} placeholder="Apply Now" />
          </div>
          <div className="admin-field">
            <label htmlFor="hb-link">Button link</label>
            <input id="hb-link" value={form.ctaLink} onChange={(e) => set('ctaLink', e.target.value)} placeholder="/apply-now or https://…" />
          </div>
          <div className="admin-field">
            <label>Active</label>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
              <span>Show on home page</span>
            </label>
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={reset}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Banners ({activeCount}/{MAX_HOME_HERO_BANNERS} active)</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>#</th><th>Image</th><th>Text</th><th>Position</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id}>
                    <td>{b.order}</td>
                    <td><img src={b.imageUrl} alt="" style={{ width: 96, aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 6 }} /></td>
                    <td>{b.text || '—'}</td>
                    <td>{HERO_TEXT_POSITIONS.find((p) => p.value === b.position)?.label ?? '—'}</td>
                    <td>
                      <button
                        className={`admin-badge admin-badge--clickable ${b.active !== false ? 'admin-badge--green' : 'admin-badge--gray'}`}
                        onClick={() => toggle(b)}
                      >
                        {b.active !== false ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(b)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(b)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={6} className="admin-empty">No banners yet — the home page shows the hero video.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
