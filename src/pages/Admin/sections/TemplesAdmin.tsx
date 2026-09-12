import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import type { ContentBlockDoc } from './ContentBlocksAdmin';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';

const PAGE = 'temples';

export const DEFAULT_TEMPLES_HERO_STATS = [
  { value: '25,000', label: 'Sq. Ft. Area', icon: 'Church' },
  { value: 'All Faiths', label: 'Inclusive Reverence', icon: 'Compass' },
];

export const DEFAULT_TEMPLES_ABOUT = {
  badge: 'SACRED SPACES • REFLECTION & PEACE',
  title: 'Reverence, Reflection & Inner Calm',
  subtitle: 'A dedicated spiritual sanctuary on campus providing an atmosphere and attitude of reverence, joy, and peace.',
  philosophyText: `Worship is putting the spotlight on God. This whole idea is to engage our Vishnu Women's University students in an atmosphere and attitude of reverence and joy. Vishnu Women's University engage students from varied faith and religious traditions as well as students without religious affiliation. So, Vishnu Women's University holds a place for temple of gods in the campus. The temple is built on a high foundation covering an area of 25,000 square feet.`,
};

export const DEFAULT_TEMPLES_PILLARS = [
  {
    icon: 'Heart',
    tag: 'Spiritual Inclusivity',
    title: 'Welcoming All Faiths & Traditions',
    desc: 'Engages students from varied religious backgrounds, faiths, and personal traditions with open-hearted reverence, respect, and unity.',
  },
  {
    icon: 'Landmark',
    tag: 'Sacred Architecture',
    title: '25,000 Sq. Ft. Elevated Foundation',
    desc: 'Built on an imposing elevated foundation, the temple commands a majestic, peaceful presence overlooking the lush green campus environment.',
  },
  {
    icon: 'Sun',
    tag: 'Peaceful Solace',
    title: 'Atmosphere of Reverence & Joy',
    desc: 'A tranquil retreat where students and faculty find stillness, mental balance, positivity, and inner harmony amidst rigorous academic life.',
  },
];

function useLoadedState<T>(loading: boolean, computeInitial: () => T) {
  const [state, setState] = useState<T>(computeInitial);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && !loading) {
      setState(computeInitial());
      setInitialized(true);
    }
  }, [loading, initialized, computeInitial]);
  return [state, setState] as const;
}

export default function TemplesAdmin() {
  const { docs: allBlocks, loading } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const blocks = allBlocks.filter((b) => b.page === PAGE);
  const heroStatDocs = blocks.filter((b) => b.section === 'heroStats');
  const aboutDoc = blocks.find((b) => b.section === 'about');
  const pillarDocs = blocks.filter((b) => b.section === 'pillars');

  const [stats, setStats] = useLoadedState(loading, () =>
    heroStatDocs.length > 0
      ? heroStatDocs.map((d) => ({ value: d.value || '', label: d.title || '', icon: d.icon || 'Church' }))
      : DEFAULT_TEMPLES_HERO_STATS
  );
  const [statsSaving, setStatsSaving] = useState(false);

  const [aboutForm, setAboutForm] = useLoadedState(loading, () => ({
    badge: aboutDoc?.value || DEFAULT_TEMPLES_ABOUT.badge,
    title: aboutDoc?.title || DEFAULT_TEMPLES_ABOUT.title,
    subtitle: aboutDoc?.slug || DEFAULT_TEMPLES_ABOUT.subtitle,
    philosophyText: aboutDoc?.desc || DEFAULT_TEMPLES_ABOUT.philosophyText,
  }));
  const [aboutSaving, setAboutSaving] = useState(false);

  const [pillars, setPillars] = useLoadedState(loading, () =>
    pillarDocs.length > 0
      ? pillarDocs.map((d) => ({
          icon: d.icon || 'Heart',
          tag: d.slug || '',
          title: d.title || '',
          desc: d.desc || '',
        }))
      : DEFAULT_TEMPLES_PILLARS
  );
  const [pillarsSaving, setPillarsSaving] = useState(false);

  const saveStats = async () => {
    setStatsSaving(true);
    try {
      await Promise.all([
        ...stats.map((s, i) => {
          const existing = heroStatDocs[i];
          const payload = {
            value: s.value,
            title: s.label,
            icon: s.icon,
            page: PAGE,
            section: 'heroStats',
            order: i,
          };
          return existing
            ? updateDoc(doc(db, 'contentBlocks', existing.id), payload)
            : addDoc(collection(db, 'contentBlocks'), {
                ...payload,
                desc: '',
                slug: '',
                storagePath: '',
                createdAt: serverTimestamp(),
              });
        }),
        ...heroStatDocs.slice(stats.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
      alert('Temples hero stats saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setStatsSaving(false);
    }
  };

  const saveAbout = async () => {
    setAboutSaving(true);
    try {
      const fields = {
        value: aboutForm.badge,
        title: aboutForm.title,
        slug: aboutForm.subtitle,
        desc: aboutForm.philosophyText,
      };
      if (aboutDoc) {
        await updateDoc(doc(db, 'contentBlocks', aboutDoc.id), fields);
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page: PAGE,
          section: 'about',
          order: 0,
          ...fields,
          icon: '',
          storagePath: '',
          createdAt: serverTimestamp(),
        });
      }
      alert('Temples philosophy text saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setAboutSaving(false);
    }
  };

  const savePillars = async () => {
    setPillarsSaving(true);
    try {
      await Promise.all([
        ...pillars.map((p, i) => {
          const existing = pillarDocs[i];
          const payload = {
            icon: p.icon,
            slug: p.tag,
            title: p.title,
            desc: p.desc,
            page: PAGE,
            section: 'pillars',
            order: i,
          };
          return existing
            ? updateDoc(doc(db, 'contentBlocks', existing.id), payload)
            : addDoc(collection(db, 'contentBlocks'), {
                ...payload,
                value: '',
                storagePath: '',
                createdAt: serverTimestamp(),
              });
        }),
        ...pillarDocs.slice(pillars.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
      alert('Temples sacred pillars saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setPillarsSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Temples — Page Content</h2>
      <p className="admin-field__hint">
        Edit the canonical philosophy text, area stat badges, and sacred pillars displayed on{' '}
        <code>/campus/temples</code>.
      </p>

      {loading ? (
        <p className="admin-loading">Loading…</p>
      ) : (
        <>
          <hr />
          <h3>Hero Stat Badges</h3>
          <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {stats.map((s, idx) => (
              <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.75rem' }}>
                <div className="admin-field">
                  <label>Stat Value</label>
                  <input
                    value={s.value}
                    onChange={(e) =>
                      setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, value: e.target.value } : item)))
                    }
                    placeholder="25,000"
                  />
                </div>
                <div className="admin-field">
                  <label>Stat Label</label>
                  <input
                    value={s.label}
                    onChange={(e) =>
                      setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, label: e.target.value } : item)))
                    }
                    placeholder="Sq. Ft. Area"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveStats} disabled={statsSaving}>
              {statsSaving ? 'Saving…' : 'Save Hero Stats'}
            </button>
          </div>

          <hr />
          <h3>Philosophy &amp; Reverence Overview</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="tmpl-abt-badge">Badge</label>
              <input
                id="tmpl-abt-badge"
                value={aboutForm.badge}
                onChange={(e) => setAboutForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="SACRED SPACES • REFLECTION & PEACE"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="tmpl-abt-title">Section Heading</label>
              <input
                id="tmpl-abt-title"
                value={aboutForm.title}
                onChange={(e) => setAboutForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Reverence, Reflection & Inner Calm"
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="tmpl-abt-sub">Section Subtitle</label>
              <input
                id="tmpl-abt-sub"
                value={aboutForm.subtitle}
                onChange={(e) => setAboutForm((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="A dedicated spiritual sanctuary on campus..."
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="tmpl-philo">Canonical Philosophy Text</label>
              <textarea
                id="tmpl-philo"
                rows={5}
                value={aboutForm.philosophyText}
                onChange={(e) => setAboutForm((p) => ({ ...p, philosophyText: e.target.value }))}
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveAbout} disabled={aboutSaving}>
              {aboutSaving ? 'Saving…' : 'Save Philosophy Text'}
            </button>
          </div>

          <hr />
          <h3>Sacred Pillar Cards ({pillars.length})</h3>
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="admin-form-grid"
              style={{
                gridTemplateColumns: '150px 1fr 1fr 2fr auto',
                alignItems: 'end',
                marginBottom: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '0.75rem',
              }}
            >
              <div className="admin-field">
                <label>Icon</label>
                <select
                  value={p.icon}
                  onChange={(e) =>
                    setPillars((prev) => prev.map((item, i) => (i === idx ? { ...item, icon: e.target.value } : item)))
                  }
                >
                  <option value="Heart">Heart</option>
                  <option value="Landmark">Landmark</option>
                  <option value="Sun">Sun</option>
                  <option value="Church">Church</option>
                  <option value="Compass">Compass</option>
                  {CONTENT_ICON_NAMES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label>Tag / Category</label>
                <input
                  value={p.tag}
                  onChange={(e) =>
                    setPillars((prev) => prev.map((item, i) => (i === idx ? { ...item, tag: e.target.value } : item)))
                  }
                  placeholder="Spiritual Inclusivity"
                />
              </div>
              <div className="admin-field">
                <label>Title</label>
                <input
                  value={p.title}
                  onChange={(e) =>
                    setPillars((prev) => prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)))
                  }
                  placeholder="Welcoming All Faiths"
                />
              </div>
              <div className="admin-field">
                <label>Description</label>
                <input
                  value={p.desc}
                  onChange={(e) =>
                    setPillars((prev) => prev.map((item, i) => (i === idx ? { ...item, desc: e.target.value } : item)))
                  }
                  placeholder="Engages students from varied traditions..."
                />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--sm admin-btn--danger"
                onClick={() => setPillars((prev) => prev.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>
          ))}
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={() =>
                setPillars((prev) => [
                  ...prev,
                  { icon: 'Heart', tag: 'Sanctuary', title: 'New Pillar', desc: 'Description here...' },
                ])
              }
            >
              + Add Pillar Card
            </button>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={savePillars} disabled={pillarsSaving}>
              {pillarsSaving ? 'Saving…' : 'Save Pillars'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
