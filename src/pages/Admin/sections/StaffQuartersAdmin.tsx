import { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import type { ContentBlockDoc } from './ContentBlocksAdmin';

const PAGE = 'staff-quarters';

export const DEFAULT_SQ_STATS = [
  { value: '100+', label: 'Residences', sub: 'Faculty & Staff Housing', icon: 'Building2' },
  { value: '24/7', label: 'Security', sub: 'Regular Campus Patrols', icon: 'ShieldCheck' },
  { value: 'Reliable', label: 'Utilities', sub: 'Backup Power & RO-Treated Drinking Water', icon: 'Zap' },
  { value: 'Green', label: 'Surroundings', sub: 'Landscaped Spaces & Natural Pond', icon: 'Trees' },
];

export const DEFAULT_SQ_ABOUT = {
  badge: 'RESIDENTIAL COMMUNITY • CAMPUS LIVING',
  title: 'Green Meadows Residential Community',
  subtitle: 'A Comfortable Community to Call Home',
  story: `Green Meadows is a dedicated residential community developed for the University's faculty and staff. With approximately 100 residential houses, landscaped surroundings and convenient access to University facilities, the community provides a comfortable setting for everyday living close to the academic campus.\n\nDesigned with families in mind, Green Meadows combines residential convenience with green open spaces, walking areas and access to essential campus services.`,
};

export const DEFAULT_SQ_FEATURES = [
  {
    title: 'Green Meadows Landscape',
    tag: 'Nature & Scenery',
    desc: 'Tree-lined roads and landscaped surroundings give the residential community a calm, welcoming character.',
  },
  {
    title: '24/7 Security',
    tag: 'Total Safety',
    desc: 'Round-the-clock security and regular campus patrols support a safe residential environment for faculty, staff, and their families.',
  },
  {
    title: 'Comfortable Residences',
    tag: 'High Standards',
    desc: 'The residential spaces are designed around everyday comfort, with practical layouts and easy access to University facilities.',
  },
  {
    title: 'Pond-Side Surroundings',
    tag: 'Serene Atmosphere',
    desc: 'The natural pond and nearby walking areas create pleasant spaces for residents to relax and spend time outdoors.',
  },
  {
    title: 'A Close-Knit Community',
    tag: 'Camaraderie',
    desc: 'Green Meadows brings together faculty and staff from across the University, creating opportunities for neighbours and families to connect naturally.',
  },
];

export const DEFAULT_SQ_AMENITIES = [
  '24/7 Security & Campus Patrols for a monitored residential environment',
  'Backup Power Supply for continuity of essential services',
  'RO-Treated Drinking Water for residents',
  'Campus Wi-Fi Connectivity for convenient digital access',
  'Landscaped Green Spaces across the residential community',
  'Natural Pond & Walking Areas for evening walks and quiet recreation',
  "Children's Play Area for resident families",
  'Maintenance Support for residences and common areas',
  'Easy Access to Campus Facilities for faculty and staff',
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

export default function StaffQuartersAdmin() {
  const { docs: allBlocks, loading } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');
  const blocks = allBlocks.filter((b) => b.page === PAGE);
  const statDocs = blocks.filter((b) => b.section === 'stats');
  const aboutDoc = blocks.find((b) => b.section === 'about');
  const featureDocs = blocks.filter((b) => b.section === 'features');
  const amenitiesDoc = blocks.find((b) => b.section === 'amenities');

  const [stats, setStats] = useLoadedState(loading, () =>
    statDocs.length > 0
      ? statDocs.map((d) => ({
          value: d.value || '',
          label: d.title || '',
          sub: d.desc || '',
          icon: d.icon || 'Building2',
        }))
      : DEFAULT_SQ_STATS
  );
  const [statsSaving, setStatsSaving] = useState(false);

  const [aboutForm, setAboutForm] = useLoadedState(loading, () => ({
    badge: aboutDoc?.value || DEFAULT_SQ_ABOUT.badge,
    title: aboutDoc?.title || DEFAULT_SQ_ABOUT.title,
    subtitle: aboutDoc?.slug || DEFAULT_SQ_ABOUT.subtitle,
    story: aboutDoc?.desc || DEFAULT_SQ_ABOUT.story,
  }));
  const [aboutSaving, setAboutSaving] = useState(false);

  const [features, setFeatures] = useLoadedState(loading, () =>
    featureDocs.length > 0
      ? featureDocs.map((d) => ({
          title: d.title || '',
          tag: d.slug || '',
          desc: d.desc || '',
        }))
      : DEFAULT_SQ_FEATURES
  );
  const [featuresSaving, setFeaturesSaving] = useState(false);

  const [amenitiesText, setAmenitiesText] = useLoadedState(loading, () =>
    amenitiesDoc?.desc || DEFAULT_SQ_AMENITIES.join('\n')
  );
  const [amenitiesSaving, setAmenitiesSaving] = useState(false);

  const saveStats = async () => {
    setStatsSaving(true);
    try {
      await Promise.all([
        ...stats.map((s, i) => {
          const existing = statDocs[i];
          const payload = {
            value: s.value,
            title: s.label,
            desc: s.sub,
            icon: s.icon,
            page: PAGE,
            section: 'stats',
            order: i,
          };
          return existing
            ? updateDoc(doc(db, 'contentBlocks', existing.id), payload)
            : addDoc(collection(db, 'contentBlocks'), {
                ...payload,
                slug: '',
                storagePath: '',
                createdAt: serverTimestamp(),
              });
        }),
        ...statDocs.slice(stats.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
      alert('Staff Quarters stats saved successfully!');
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
        desc: aboutForm.story,
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
      alert('Staff Quarters story & overview saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setAboutSaving(false);
    }
  };

  const saveFeatures = async () => {
    setFeaturesSaving(true);
    try {
      await Promise.all([
        ...features.map((f, i) => {
          const existing = featureDocs[i];
          const payload = {
            title: f.title,
            slug: f.tag,
            desc: f.desc,
            page: PAGE,
            section: 'features',
            order: i,
          };
          return existing
            ? updateDoc(doc(db, 'contentBlocks', existing.id), payload)
            : addDoc(collection(db, 'contentBlocks'), {
                ...payload,
                value: '',
                icon: '',
                storagePath: '',
                createdAt: serverTimestamp(),
              });
        }),
        ...featureDocs.slice(features.length).map((d) => deleteDoc(doc(db, 'contentBlocks', d.id))),
      ]);
      alert('Staff Quarters feature cards saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setFeaturesSaving(false);
    }
  };

  const saveAmenities = async () => {
    setAmenitiesSaving(true);
    try {
      if (amenitiesDoc) {
        await updateDoc(doc(db, 'contentBlocks', amenitiesDoc.id), { desc: amenitiesText });
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page: PAGE,
          section: 'amenities',
          title: 'Residential Amenities',
          desc: amenitiesText,
          value: '',
          icon: '',
          slug: '',
          storagePath: '',
          order: 0,
          createdAt: serverTimestamp(),
        });
      }
      alert('Staff Quarters amenities checklist saved successfully!');
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setAmenitiesSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Staff Quarters — Page Content</h2>
      <p className="admin-field__hint">
        Edit residential statistics, Green Meadows story copy, amenities, and highlight features on{' '}
        <code>/campus/staff-quarters</code>.
      </p>

      {loading ? (
        <p className="admin-loading">Loading…</p>
      ) : (
        <>
          <hr />
          <h3>Residential Stat Counters ({stats.length})</h3>
          <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {stats.map((s, idx) => (
              <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.75rem' }}>
                <div className="admin-field">
                  <label>Value</label>
                  <input
                    value={s.value}
                    onChange={(e) =>
                      setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, value: e.target.value } : item)))
                    }
                    placeholder="100+"
                  />
                </div>
                <div className="admin-field">
                  <label>Title</label>
                  <input
                    value={s.label}
                    onChange={(e) =>
                      setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, label: e.target.value } : item)))
                    }
                    placeholder="Faculty Houses"
                  />
                </div>
                <div className="admin-field">
                  <label>Sub-text</label>
                  <input
                    value={s.sub}
                    onChange={(e) =>
                      setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, sub: e.target.value } : item)))
                    }
                    placeholder="Spacious Cluster"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveStats} disabled={statsSaving}>
              {statsSaving ? 'Saving…' : 'Save Stat Counters'}
            </button>
          </div>

          <hr />
          <h3>Living at Green Meadows — Story &amp; Overview</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="sq-abt-badge">Badge</label>
              <input
                id="sq-abt-badge"
                value={aboutForm.badge}
                onChange={(e) => setAboutForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder="RESIDENTIAL COMMUNITY • CAMPUS LIVING"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="sq-abt-title">Section Title</label>
              <input
                id="sq-abt-title"
                value={aboutForm.title}
                onChange={(e) => setAboutForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="A Peaceful Sanctuary for Faculty & Families"
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="sq-abt-sub">Section Subtitle</label>
              <input
                id="sq-abt-sub"
                value={aboutForm.subtitle}
                onChange={(e) => setAboutForm((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="Experience high-standard living amidst scenic greenery..."
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="sq-abt-story">Story Paragraphs (separate paragraphs with blank lines)</label>
              <textarea
                id="sq-abt-story"
                rows={6}
                value={aboutForm.story}
                onChange={(e) => setAboutForm((p) => ({ ...p, story: e.target.value }))}
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveAbout} disabled={aboutSaving}>
              {aboutSaving ? 'Saving…' : 'Save Story Section'}
            </button>
          </div>

          <hr />
          <h3>Residential Amenities Checklist</h3>
          <p className="admin-field__hint">Enter one amenity per line.</p>
          <div className="admin-field admin-field--full">
            <textarea
              rows={5}
              value={amenitiesText}
              onChange={(e) => setAmenitiesText(e.target.value)}
              placeholder="Uninterrupted Power Backup..."
            />
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveAmenities} disabled={amenitiesSaving}>
              {amenitiesSaving ? 'Saving…' : 'Save Amenities Checklist'}
            </button>
          </div>

          <hr />
          <h3>Feature Cards ({features.length})</h3>
          {features.map((f, idx) => (
            <div
              key={idx}
              className="admin-form-grid"
              style={{
                gridTemplateColumns: '180px 1fr 2fr auto',
                alignItems: 'end',
                marginBottom: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '0.75rem',
              }}
            >
              <div className="admin-field">
                <label>Tag / Category</label>
                <input
                  value={f.tag}
                  onChange={(e) =>
                    setFeatures((prev) => prev.map((item, i) => (i === idx ? { ...item, tag: e.target.value } : item)))
                  }
                  placeholder="Nature & Scenery"
                />
              </div>
              <div className="admin-field">
                <label>Card Title</label>
                <input
                  value={f.title}
                  onChange={(e) =>
                    setFeatures((prev) => prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)))
                  }
                  placeholder="Green Meadows Landscape"
                />
              </div>
              <div className="admin-field">
                <label>Description</label>
                <input
                  value={f.desc}
                  onChange={(e) =>
                    setFeatures((prev) => prev.map((item, i) => (i === idx ? { ...item, desc: e.target.value } : item)))
                  }
                  placeholder="Surrounded by lush greenery..."
                />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--sm admin-btn--danger"
                onClick={() => setFeatures((prev) => prev.filter((_, i) => i !== idx))}
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
                setFeatures((prev) => [
                  ...prev,
                  { tag: 'New Amenity', title: 'Feature Name', desc: 'Description here...' },
                ])
              }
            >
              + Add Feature Card
            </button>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" onClick={saveFeatures} disabled={featuresSaving}>
              {featuresSaving ? 'Saving…' : 'Save Feature Cards'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
