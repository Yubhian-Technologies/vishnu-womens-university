import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, Home as HomeIcon } from 'lucide-react';
import ContentBlocksAdmin from './ContentBlocksAdmin';
import HonouredGuestsAdmin from './HonouredGuestsAdmin';
import AlumniEventsAdmin from './AlumniEventsAdmin';
import {
  type Accreditation,
  DEFAULT_ACCREDITATIONS,
  type MetricItem,
  DEFAULT_PLACEMENT_METRICS,
  type HomeCtaButton,
  type AlumniContentData,
  DEFAULT_ALUMNI_CONTENT,
  type HomeContentDoc,
  DEFAULT_HOME_CONTENT,
  HOME_CONTENT_COLLECTION,
  HOME_CONTENT_DOC_ID,
} from '../../../constants/homeContentDefaults';

export type { Accreditation, MetricItem, HomeCtaButton, AlumniContentData, HomeContentDoc };
export {
  DEFAULT_ACCREDITATIONS,
  DEFAULT_PLACEMENT_METRICS,
  DEFAULT_ALUMNI_CONTENT,
  DEFAULT_HOME_CONTENT,
  HOME_CONTENT_COLLECTION,
  HOME_CONTENT_DOC_ID,
};

export default function HomeContentAdmin() {
  const [data, setData] = useState<HomeContentDoc>(DEFAULT_HOME_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<HomeContentDoc>;
          setData({
            ...DEFAULT_HOME_CONTENT,
            ...remote,
            accreditationsList: remote.accreditationsList || DEFAULT_ACCREDITATIONS,
            placementMetrics: remote.placementMetrics || DEFAULT_PLACEMENT_METRICS,
            alumniContent: { ...DEFAULT_ALUMNI_CONTENT, ...(remote.alumniContent || {}) },
          });
        }
      } catch (err) {
        console.error('Failed to load Home page content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof HomeContentDoc>(k: K, v: HomeContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, HOME_CONTENT_COLLECTION, HOME_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Home page content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Home page content to original defaults?')) setData(DEFAULT_HOME_CONTENT);
  };

  const updateAccreditation = (idx: number, patch: Partial<Accreditation>) => {
    const list = [...(data.accreditationsList || DEFAULT_ACCREDITATIONS)];
    list[idx] = { ...list[idx], ...patch };
    set('accreditationsList', list);
  };

  const updateMetric = (idx: number, patch: Partial<MetricItem>) => {
    const list = [...(data.placementMetrics || DEFAULT_PLACEMENT_METRICS)];
    list[idx] = { ...list[idx], ...patch };
    set('placementMetrics', list);
  };

  const updateButton = (idx: number, patch: Partial<HomeCtaButton>) => {
    const ctaButtons = [...data.ctaButtons];
    ctaButtons[idx] = { ...ctaButtons[idx], ...patch };
    set('ctaButtons', ctaButtons);
  };

  const updateAlumni = <K extends keyof AlumniContentData>(k: K, v: AlumniContentData[K]) => {
    set('alumniContent', { ...data.alumniContent, [k]: v });
  };

  if (loading) {
    return <p className="admin-loading">Loading Home Page Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HomeIcon size={20} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>Home Page</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Manage all Home page sections from top to bottom in the exact order displayed on the public website.
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

        {/* 1. SEO & Tab Title */}
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>1. SEO &amp; Browser Metadata</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Browser Tab Title</label>
            <input type="text" value={data.browserTabTitle} onChange={(e) => set('browserTabTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Search Engine Title</label>
            <input type="text" value={data.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Meta Description</label>
            <textarea value={data.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>
      </div>

      {/* 2. Academic Recognition */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>2. Academic Recognition (Accreditations &amp; Affiliations)</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Eyebrow</label>
            <input type="text" value={data.accreditationsEyebrow} onChange={(e) => set('accreditationsEyebrow', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Title</label>
            <input type="text" value={data.accreditationsTitle} onChange={(e) => set('accreditationsTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Subtitle</label>
            <input type="text" value={data.accreditationsSubtitle} onChange={(e) => set('accreditationsSubtitle', e.target.value)} className="admin-input" />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Accreditation Cards (NBA, NAAC, UGC, AICTE)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {(data.accreditationsList || DEFAULT_ACCREDITATIONS).map((acc, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input type="text" placeholder="Code (e.g. NBA)" value={acc.code} onChange={(e) => updateAccreditation(idx, { code: e.target.value })} className="admin-input" style={{ width: '80px' }} />
                  <input type="text" placeholder="Title" value={acc.title} onChange={(e) => updateAccreditation(idx, { title: e.target.value })} className="admin-input" style={{ flex: 1 }} />
                </div>
                <input type="text" placeholder="Years / Approval text" value={acc.years} onChange={(e) => updateAccreditation(idx, { years: e.target.value })} className="admin-input" />
                <input type="text" placeholder="Logo Image URL" value={acc.logo} onChange={(e) => updateAccreditation(idx, { logo: e.target.value })} className="admin-input" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Key Statistics */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>3. Key Statistics (VWU at a Glance)</h3>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Edit the animated counter statistics displayed in the numbers matrix on the Home page.
        </p>
        <ContentBlocksAdmin filterPage="home" filterSection="counters" hideSectionSelector />
      </div>

      {/* 4. Study at VWU Cards & Intro */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>4. "Study at VWU" Cards &amp; Intro</h3>
        <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
          <div className="admin-field">
            <label>Heading</label>
            <input type="text" value={data.studyIntroTitle} onChange={(e) => set('studyIntroTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Subheading</label>
            <input type="text" value={data.studyIntroSubtitle} onChange={(e) => set('studyIntroSubtitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraphs (one per line)</label>
            <textarea
              value={data.studyIntroParagraphs.join('\n')}
              onChange={(e) => set('studyIntroParagraphs', e.target.value.split('\n'))}
              className="admin-input"
              rows={4}
              style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
        </div>
        <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Study at VWU Cards</label>
        <ContentBlocksAdmin filterPage="home" filterSection="studyCards" hideSectionSelector />
      </div>

      {/* 5. VWU in Action */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>5. VWU in Action (Recent Events / News Strip)</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Eyebrow</label>
            <input type="text" value={data.activityEyebrow} onChange={(e) => set('activityEyebrow', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Heading</label>
            <input type="text" value={data.activityTitle} onChange={(e) => set('activityTitle', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <input type="text" value={data.activityDesc} onChange={(e) => set('activityDesc', e.target.value)} className="admin-input" />
          </div>
        </div>
      </div>

      {/* 6. Placements Section */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>6. Placements Section</h3>
        <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
          <div className="admin-field">
            <label>Badge Label</label>
            <input type="text" value={data.placementBadge} onChange={(e) => set('placementBadge', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Title Main Word</label>
            <input type="text" value={data.placementTitleMain} onChange={(e) => set('placementTitleMain', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Title Sub</label>
            <input type="text" value={data.placementTitleSub} onChange={(e) => set('placementTitleSub', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea value={data.placementDesc} onChange={(e) => set('placementDesc', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>
        <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Placement Highlight Cards</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {(data.placementMetrics || DEFAULT_PLACEMENT_METRICS).map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <input type="text" placeholder="Value (e.g. 100+)" value={item.value} onChange={(e) => updateMetric(idx, { value: e.target.value })} className="admin-input" style={{ fontWeight: 600 }} />
              <input type="text" placeholder="Bold text (e.g. recruiters)" value={item.boldText} onChange={(e) => updateMetric(idx, { boldText: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Line 1 (e.g. partner with)" value={item.line1} onChange={(e) => updateMetric(idx, { line1: e.target.value })} className="admin-input" />
              <input type="text" placeholder="Line 2 (e.g. VWU)" value={item.line2} onChange={(e) => updateMetric(idx, { line2: e.target.value })} className="admin-input" />
            </div>
          ))}
        </div>
      </div>

      {/* 7. VWU in Action (YouTube Videos) */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>7. VWU in Action (YouTube Showcase Videos)</h3>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Manage the YouTube showcase video carousel featured on the Home page. Title = Name/Topic, Value/Slug = YouTube URL (e.g. https://youtu.be/P9TPB69kmWQ).
        </p>
        <ContentBlocksAdmin filterPage="home" filterSection="vwuInAction" hideSectionSelector />
      </div>

      {/* 8. Eminent Personalities */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>8. Eminent Personalities (Honoured Guests)</h3>
        <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
          Manage dignitaries, speakers, and eminent personalities featured on the Home page.
        </p>
        <HonouredGuestsAdmin />
      </div>

      {/* 9. Alumni & Giving */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>9. Alumni &amp; Giving</h3>
        <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
          <div className="admin-field">
            <label>Eyebrow</label>
            <input type="text" value={data.alumniContent.eyebrow} onChange={(e) => updateAlumni('eyebrow', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Main Title</label>
            <input type="text" value={data.alumniContent.title} onChange={(e) => updateAlumni('title', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>Row 1 Title</label>
            <input type="text" value={data.alumniContent.row1Title} onChange={(e) => updateAlumni('row1Title', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Row 1 Description</label>
            <textarea value={data.alumniContent.row1Desc} onChange={(e) => updateAlumni('row1Desc', e.target.value)} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
          <div className="admin-field">
            <label>Row 2 Title</label>
            <input type="text" value={data.alumniContent.row2Title} onChange={(e) => updateAlumni('row2Title', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Row 2 Description</label>
            <textarea value={data.alumniContent.row2Desc} onChange={(e) => updateAlumni('row2Desc', e.target.value)} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
          <div className="admin-field">
            <label>CTA Button Label</label>
            <input type="text" value={data.alumniContent.ctaLabel} onChange={(e) => updateAlumni('ctaLabel', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field">
            <label>CTA Button Link</label>
            <input type="text" value={data.alumniContent.ctaHref} onChange={(e) => updateAlumni('ctaHref', e.target.value)} className="admin-input" />
          </div>
        </div>
        <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Alumni Photos / Events</label>
        <AlumniEventsAdmin />
      </div>

      {/* 10. Testimonials */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>10. Student Voices &amp; Testimonials</h3>
        <div className="admin-field" style={{ marginBottom: '1rem' }}>
          <label>Section Heading</label>
          <input type="text" value={data.testimonialSectionTitle} onChange={(e) => set('testimonialSectionTitle', e.target.value)} className="admin-input" />
        </div>
        <ContentBlocksAdmin filterPage="home" filterSection="testimonials" hideSectionSelector />
      </div>

      {/* 11. Admissions CTA Banner */}
      <div className="admin-card">
        <h3 className="admin-card__title" style={{ fontSize: '1.05rem', marginTop: 0, color: '#1e293b' }}>11. Admissions CTA Banner</h3>
        <div className="admin-form-grid">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Heading</label>
            <input type="text" value={data.ctaHeading} onChange={(e) => set('ctaHeading', e.target.value)} className="admin-input" />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Body</label>
            <textarea value={data.ctaBody} onChange={(e) => set('ctaBody', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0.6rem 0' }}>
          <button type="button" onClick={() => set('ctaButtons', [...data.ctaButtons, { label: '', link: '/admissions' }])} className="admin-btn admin-btn--sm admin-btn--secondary">
            <Plus size={14} /> Add Button
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem' }}>
          {data.ctaButtons.map((b, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input type="text" placeholder="Button label" value={b.label} onChange={(e) => updateButton(idx, { label: e.target.value })} className="admin-input" style={{ flex: 1 }} />
              <input type="text" placeholder="Link" value={b.link} onChange={(e) => updateButton(idx, { link: e.target.value })} className="admin-input" style={{ flex: 1 }} />
              <button type="button" onClick={() => set('ctaButtons', data.ctaButtons.filter((_, i) => i !== idx))} className="admin-btn-danger"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
