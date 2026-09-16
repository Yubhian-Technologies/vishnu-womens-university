import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import type { ContentBlockDoc } from './ContentBlocksAdmin';

// Wellness (src/pages/Campus/Wellness.tsx, /campus/wellness) reads its
// "Meet Our Counsellor" and "Our Impact" sections from the same shared
// `contentBlocks` collection the generic "Page Content Blocks" admin screen
// used to expose for it (page: 'wellness') — moved here for a friendlier,
// page-specific form, same as Auditoriums (see AuditoriumsAdmin.tsx).
const PAGE = 'wellness';

const DEFAULT_COUNSELLOR_NAME = 'Devika Babu';
const DEFAULT_COUNSELLOR_ROLE = 'Student Counsellor | M.Sc. Psychology';
const DEFAULT_COUNSELLOR_PHOTO = '/images/1000074551.jpg';
const DEFAULT_COUNSELLOR_BIO = 'Devika brings a warm, judgment-free approach to every conversation — whether you’re working through anxiety, relationship concerns, a difficult transition, or simply need someone to listen. Her counselling space is built on one rule: you don’t need the "right words" to talk to her, and her door is always open — for a stressful day, a big win, or anything in between.';
const DEFAULT_COUNSELLOR_QUOTE = 'Creating a space where you can be yourself and talk about the things that really matter to you.';

interface Stat { value: string; title: string; icon: string; }
const DEFAULT_IMPACT_STATS: Stat[] = [
  { value: '500+', title: 'Students Supported', icon: '' },
  { value: '50+', title: 'Workshops & Sessions', icon: '' },
  { value: '90%', title: 'Positive Feedback', icon: '' },
  { value: '100%', title: 'You Matter', icon: 'Heart' },
];
const DEFAULT_IMPACT_BG = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80';

// Runs `computeInitial` exactly once, the first time `loading` turns false —
// see AuditoriumsAdmin.tsx's identical helper for why.
function useLoadedState<T>(loading: boolean, computeInitial: () => T) {
  const [state, setState] = useState<T>(computeInitial);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && !loading) {
      setState(computeInitial());
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, initialized]);
  return [state, setState] as const;
}

export default function WellnessAdmin() {
  // Collapsed by default — see AuditoriumsAdmin.tsx's identical toggle for
  // why (several of these page-body cards can live on this one screen).
  const [expanded, setExpanded] = useState(false);
  const { docs: allBlocks, loading } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const blocks = allBlocks.filter((b) => b.page === PAGE);
  const counsellor = blocks.find((b) => b.section === 'counsellor');
  const statDocs = blocks.filter((b) => b.section === 'impactStats');
  const impactBg = blocks.find((b) => b.section === 'impactBg');

  const [counsellorForm, setCounsellorForm] = useLoadedState(loading, () => ({
    name: counsellor?.title || DEFAULT_COUNSELLOR_NAME,
    role: counsellor?.value || DEFAULT_COUNSELLOR_ROLE,
    bio: counsellor?.desc || DEFAULT_COUNSELLOR_BIO,
    quote: counsellor?.icon || DEFAULT_COUNSELLOR_QUOTE,
    photoUrl: counsellor?.slug || DEFAULT_COUNSELLOR_PHOTO,
    storagePath: counsellor?.storagePath || '',
  }));
  const [counsellorSaving, setCounsellorSaving] = useState(false);

  const [stats, setStats] = useLoadedState(loading, () =>
    statDocs.length > 0 ? statDocs.map((d) => ({ value: d.value, title: d.title, icon: d.icon })) : DEFAULT_IMPACT_STATS
  );
  const [statsSaving, setStatsSaving] = useState(false);

  const [impactBgForm, setImpactBgForm] = useLoadedState(loading, () => ({
    imageUrl: impactBg?.slug || DEFAULT_IMPACT_BG,
    storagePath: impactBg?.storagePath || '',
  }));
  const [impactBgSaving, setImpactBgSaving] = useState(false);

  const handlePhotoUploaded = (r: UploadResult) => setCounsellorForm((p) => ({ ...p, photoUrl: r.url, storagePath: r.path }));
  const handleImpactBgUploaded = (r: UploadResult) => setImpactBgForm({ imageUrl: r.url, storagePath: r.path });

  const saveImpactBg = async () => {
    setImpactBgSaving(true);
    try {
      const fields = { title: '', value: '', desc: '', icon: '', slug: impactBgForm.imageUrl, storagePath: impactBgForm.storagePath };
      if (impactBg) {
        await updateDoc(doc(db, 'contentBlocks', impactBg.id), fields);
      } else {
        await addDoc(collection(db, 'contentBlocks'), { page: PAGE, section: 'impactBg', order: 0, ...fields, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setImpactBgSaving(false);
    }
  };

  const saveCounsellor = async () => {
    setCounsellorSaving(true);
    try {
      const fields = {
        title: counsellorForm.name, value: counsellorForm.role, desc: counsellorForm.bio,
        icon: counsellorForm.quote, slug: counsellorForm.photoUrl, storagePath: counsellorForm.storagePath,
      };
      if (counsellor) {
        await updateDoc(doc(db, 'contentBlocks', counsellor.id), fields);
      } else {
        await addDoc(collection(db, 'contentBlocks'), { page: PAGE, section: 'counsellor', order: 0, ...fields, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setCounsellorSaving(false);
    }
  };

  const updateStat = (i: number, field: keyof Stat, value: string) => {
    setStats(stats.map((s, j) => (j === i ? { ...s, [field]: value } : s)));
  };

  const saveStats = async () => {
    setStatsSaving(true);
    try {
      await Promise.all([
        ...stats.map((s, i) => {
          const existing = statDocs[i];
          return existing
            ? updateDoc(doc(db, 'contentBlocks', existing.id), { value: s.value, title: s.title, icon: s.icon })
            : addDoc(collection(db, 'contentBlocks'), {
                page: PAGE, section: 'impactStats', value: s.value, title: s.title, icon: s.icon, slug: '', storagePath: '',
                order: i, createdAt: serverTimestamp(),
              });
        }),
        ...statDocs.slice(stats.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setStatsSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card__toolbar">
        <h2 className="admin-card__title">Wellness — Page Body</h2>
        <button type="button" className="admin-btn admin-btn--sm" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Done' : 'Edit'}
        </button>
      </div>
      <p className="admin-field__hint">
        Wellness (<code>/campus/wellness</code>) is edited right here instead of the generic Page Content Blocks
        screen. Its hero banner image/title is still managed from Admin → Hero Banners ("Campus Life: Wellness").
      </p>

      {expanded && (loading ? <p className="admin-loading">Loading…</p> : (
        <>
          <hr />
          <h3>Meet Our Counsellor</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="field-wl-name">Name</label>
              <input id="field-wl-name" value={counsellorForm.name} onChange={(e) => setCounsellorForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label htmlFor="field-wl-role">Role / Credentials</label>
              <input id="field-wl-role" value={counsellorForm.role} onChange={(e) => setCounsellorForm((p) => ({ ...p, role: e.target.value }))} />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="field-wl-bio">Bio</label>
              <textarea id="field-wl-bio" rows={4} value={counsellorForm.bio} onChange={(e) => setCounsellorForm((p) => ({ ...p, bio: e.target.value }))} />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="field-wl-quote">Quote</label>
              <textarea id="field-wl-quote" rows={2} value={counsellorForm.quote} onChange={(e) => setCounsellorForm((p) => ({ ...p, quote: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Photo</label>
              <ImageUploader folder="vwu/campus-life/wellness" currentUrl={counsellorForm.photoUrl} onUploaded={handlePhotoUploaded} label="Upload Photo" aspect={1} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveCounsellor} disabled={counsellorSaving}>
              {counsellorSaving ? 'Saving…' : 'Save Counsellor'}
            </button>
          </div>

          <hr />
          <h3>Our Impact Stats</h3>
          <div className="admin-field" style={{ marginBottom: '1rem' }}>
            <label>Background Photo</label>
            <ImageUploader folder="vwu/campus-life/wellness" currentUrl={impactBgForm.imageUrl} onUploaded={handleImpactBgUploaded} label="Upload Background Photo" aspect={16 / 9} />
            <div className="admin-form-actions" style={{ marginTop: '0.5rem' }}>
              <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={saveImpactBg} disabled={impactBgSaving}>
                {impactBgSaving ? 'Saving…' : 'Save Background Photo'}
              </button>
            </div>
          </div>
          {stats.map((s, i) => (
            <div key={i} className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'end', marginBottom: '0.6rem' }}>
              <div className="admin-field">
                <label>Number (e.g. &quot;500+&quot;)</label>
                <input value={s.value} onChange={(e) => updateStat(i, 'value', e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Label</label>
                <input value={s.title} onChange={(e) => updateStat(i, 'title', e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Icon (optional)</label>
                <select value={s.icon} onChange={(e) => updateStat(i, 'icon', e.target.value)}>
                  <option value="">None</option>
                  {CONTENT_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => setStats(stats.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--sm" onClick={() => setStats([...stats, { value: '', title: '', icon: '' }])}>
            + Add Stat
          </button>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveStats} disabled={statsSaving}>
              {statsSaving ? 'Saving…' : 'Save Impact Stats'}
            </button>
          </div>
        </>
      ))}
    </div>
  );
}
