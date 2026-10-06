import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Newspaper } from 'lucide-react';

export interface NewsAwardsCard {
  title: string;
  desc: string;
}

export interface NewsAwardsContentDoc {
  cardsHeading: string;
  cardsParagraph: string;
  cards: NewsAwardsCard[]; // fixed 3 slots: Happenings, Accreditations & Awards, Gallery (icon/slug/anchor structural)
  ctaHeading: string;
  ctaParagraph: string;
}

// Mirrors the hardcoded copy NewsAwards.tsx shipped with before this admin
// editor existed, so the public page renders identically until an admin
// saves a change.
export const DEFAULT_NEWS_AWARDS_CONTENT: NewsAwardsContentDoc = {
  cardsHeading: 'Explore News & Awards',
  cardsParagraph: "Everything you need to know about VWU's recognition, campus life, and visual history — all in one place.",
  cards: [
    { title: 'Happenings at VWU', desc: 'Stay updated with the latest events, workshops, MoUs, competitions, and campus milestones — from recent achievements to upcoming programmes.' },
    { title: 'Accreditations & Awards', desc: 'VWU is recognised by NAAC, NBA, NIRF, ARIIA, IEI, ISTE, and more. Explore our full record of national rankings, quality awards, and institutional accreditations.' },
    { title: 'Gallery', desc: 'A visual archive of campus life — from national symposia, graduation days, and cultural festivals to sports championships and industry collaborations.' },
  ],
  ctaHeading: "Be Part of VWU's Story",
  ctaParagraph: 'Join a university that earns its recognition every year through student achievement, research, and institutional excellence.',
};

export const NEWS_AWARDS_CONTENT_COLLECTION = 'settings';
export const NEWS_AWARDS_CONTENT_DOC_ID = 'newsAwardsContent';

export default function NewsAwardsContentAdmin() {
  const [data, setData] = useState<NewsAwardsContentDoc>(DEFAULT_NEWS_AWARDS_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, NEWS_AWARDS_CONTENT_COLLECTION, NEWS_AWARDS_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<NewsAwardsContentDoc>;
          setData({ ...DEFAULT_NEWS_AWARDS_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load News & Awards content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof NewsAwardsContentDoc>(k: K, v: NewsAwardsContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const updateCard = (idx: number, patch: Partial<NewsAwardsCard>) => {
    const cards = [...data.cards];
    cards[idx] = { ...cards[idx], ...patch };
    set('cards', cards);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, NEWS_AWARDS_CONTENT_COLLECTION, NEWS_AWARDS_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save News & Awards content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all News & Awards copy to original defaults?')) setData(DEFAULT_NEWS_AWARDS_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading News & Awards Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Newspaper size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>News & Awards Hub — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              The stats bar above these cards is edited separately under Page Content Blocks ("news-awards" / highlights).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost"><RotateCcw size={14} /> Reset Defaults</button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary"><Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}</button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Saved and published live!
          </div>
        )}

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Section Heading</h3>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Heading</label>
            <input type="text" value={data.cardsHeading} onChange={(e) => set('cardsHeading', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.cardsParagraph} onChange={(e) => set('cardsParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>3 Cards (Happenings / Accreditations & Awards / Gallery)</h3>
        <p className="admin-field__hint" style={{ margin: '0 0 0.5rem' }}>Fixed set — icons and links aren't editable, only title and description.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem' }}>
          {data.cards.map((c, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem' }}>
              <input type="text" value={c.title} onChange={(e) => updateCard(idx, { title: e.target.value })} className="admin-input" style={{ width: '100%', marginBottom: '0.35rem', fontWeight: 600 }} placeholder="Title" />
              <textarea value={c.desc} onChange={(e) => updateCard(idx, { desc: e.target.value })} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} placeholder="Description" />
            </div>
          ))}
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Closing CTA</h3>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Heading</label>
            <input type="text" value={data.ctaHeading} onChange={(e) => set('ctaHeading', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.ctaParagraph} onChange={(e) => set('ctaParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
