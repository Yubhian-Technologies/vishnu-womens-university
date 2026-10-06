import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Save, RotateCcw, Info } from 'lucide-react';

export interface AboutCardCopy {
  title: string;
  desc: string;
}

export interface AboutContentDoc {
  statsHeading: string;
  statsFootnote: string;
  overviewHeading: string;
  overviewParagraphs: string[];
  pillarsIntroParagraphs: string[];
  pillars: AboutCardCopy[]; // fixed 5 slots (icon is structural, not editable)
  ambitionHeading: string;
  ambitionParagraphs: string[]; // 2 paragraphs
  ambitionTagline: string; // "Her Education. Her Confidence...."
  ambitionTaglineAccent: string; // "Her University — ..."
  academicHeading: string;
  academicParagraph: string;
  execHeading: string;
  execSubtitle: string;
  diffHeading: string;
  diffParagraph: string;
  campusGalleryBold: string;
  campusGalleryBody: string;
  campusSnapshotEyebrow: string;
  campusSnapshotHeading: string;
  campusSnapshotParagraph: string;
  campusFacilityCards: AboutCardCopy[]; // fixed 3 slots
  svesHeading: string;
  svesParagraph1: string;
  svesParagraph3: string; // paragraph 2 (with "11 institutions"/"25,000+ students") is kept structural due to inline accent spans
  svesStatInstitutions: string;
  svesStatStudents: string;
  svesStatCampuses: string;
  discoverHeading: string;
  ctaHeading: string;
  ctaParagraphs: string[];
  ctaJoinLine: string;
  ctaButtonLabel: string;
}

// Mirrors the hardcoded copy About.tsx shipped with before this admin editor
// existed, so the public page renders identically until an admin saves a
// change. Card icons/colours for the fixed pillar and facility slots stay
// structural (code-level) -- only their title/desc text is editable here.
export const DEFAULT_ABOUT_CONTENT: AboutContentDoc = {
  statsHeading: "Two Decades of Women's Education in Andhra Pradesh",
  statsFootnote: "Building on decades of experience in women's education and professional learning.",
  overviewHeading: "First Private State Women's University in Telugu States",
  overviewParagraphs: [
    "Vishnu Women's University (VWU), located at Vishnupur, Bhimavaram, Andhra Pradesh, is dedicated to providing quality higher education for women. Established in 2001, the institution transitioned into a Brownfield University in 2026 under the Andhra Pradesh Private Universities Act, 2016, carrying forward the rich educational legacy of the Sri Vishnu Educational Society.",
    'With a focus on education, innovation, leadership, and entrepreneurship, VWU aims to empower women to achieve their academic and professional goals. Over 15,000 women have graduated from the institution, which currently offers B.Tech, M.Tech, MBA, and Ph.D. programmes exclusively for women.',
  ],
  pillarsIntroParagraphs: [
    "Vishnu Women's University is situated in the serene, green surroundings of Bhimavaram, West Godavari District, Andhra Pradesh. The University is located on the Bhimavaram–Tadepalligudem Road, with convenient access from Bhimavaram town via B. V. Raju Marg.",
    'The campus is well connected to Bhimavaram and neighbouring towns, making it easily accessible for students, parents, faculty, and visitors.',
  ],
  pillars: [
    { title: '250+ Expert Faculty', desc: 'B.Tech, M.Tech, MBA and Ph.D. programmes built on strong fundamentals and professional practice.' },
    { title: '30+ Innovation Initiatives', desc: 'AICTE IDEA Lab, STI Hub and the Vishnu Technology Business Incubator.' },
    { title: '1,100+ Placements', desc: 'Industry programmes with NASSCOM, HCL Tech, Microchip and TI.' },
    { title: '10 Departments', desc: 'Clubs, sports and events that build leadership and confidence alongside academics.' },
    { title: '80+ Acre Campus', desc: 'Advanced labs, smart classrooms, ICT tools and seminar halls.' },
  ],
  ambitionHeading: 'A University Built for Her Ambition',
  ambitionParagraphs: [
    "At Vishnu Women's University, every opportunity on campus belongs to a woman. She leads the project, runs the laboratory, heads the club and represents the University, not as an exception, but as a matter of course.",
    'This is what a women’s university makes possible. Over two decades, the Sri Vishnu Educational Society has seen the difference it makes to how a student works, speaks and plans her career. VWU is built to carry that forward.',
  ],
  ambitionTagline: 'Her Education. Her Confidence. Her Future.',
  ambitionTaglineAccent: "Her University — Vishnu Women's University.",
  academicHeading: 'Where Ambition Meets Opportunity.',
  academicParagraph: 'Explore a diverse academic ecosystem spanning Engineering, Management & Research—designed to develop knowledge, innovation, leadership, and future-ready capabilities.',
  execHeading: 'Core Executive Body',
  execSubtitle: "A distinguished leadership team shaping the University's academic vision, strategic direction, and institutional excellence.",
  diffHeading: '30+ Differentiating Initiatives',
  diffParagraph: 'VWU extends well beyond conventional engineering education through programs in innovation, industry engagement, international exposure, and community-driven initiatives.',
  campusGalleryBold: "The best learning here isn't on the syllabus.",
  campusGalleryBody: 'A vibrant environment where ideas flourish, friendships grow, talents find expression, and aspirations take shape. Every student is encouraged to explore new possibilities, discover their potential, and develop the confidence to lead, innovate, and make a difference.',
  campusSnapshotEyebrow: 'Purpose-Built Infrastructure',
  campusSnapshotHeading: 'Everything You Need to Learn, Live & Lead.',
  campusSnapshotParagraph: 'From advanced learning spaces and seamless connectivity to sports, wellness, residential, dining, and spiritual facilities, VWU offers a thoughtfully designed campus ecosystem that supports learning, well-being, belonging, and holistic student development.',
  campusFacilityCards: [
    { title: 'Modern Campus Facilities', desc: 'Smart classrooms, well-equipped labs, and world-class infrastructure.' },
    { title: 'High-Speed Connectivity', desc: 'Seamless digital access for a smarter tomorrow.' },
    { title: 'Vibrant Student Life', desc: 'Clubs, sports, events and endless opportunities to grow.' },
  ],
  svesHeading: 'Sri Vishnu Educational Society (SVES)',
  svesParagraph1: 'Founded by Padma Bhushan Dr. B. V. Raju, Sri Vishnu Educational Society (SVES) is a distinguished educational institution committed to excellence, innovation, and social impact.',
  svesParagraph3: "Vishnu Women's University is the flagship women's institution of SVES, carrying forward its enduring vision of empowering women through quality education, technical excellence, research, leadership, and innovation.",
  svesStatInstitutions: '11',
  svesStatStudents: '25,000+',
  svesStatCampuses: '4',
  discoverHeading: 'Explore VWU in Detail',
  ctaHeading: 'Where Ambition Finds Its Purpose',
  ctaParagraphs: [
    'Vishnu Women’s University is more than a place to study. It is a community of curious minds, bold ideas, and women shaping the future.',
    'Whether you are here to learn, lead, innovate, recruit exceptional talent, or build partnerships that create lasting impact, you become part of a community connected by a shared belief: when women are empowered, possibilities are limitless.',
    'Find your place. Discover your purpose. Shape what comes next.',
  ],
  ctaJoinLine: 'Join VWU.',
  ctaButtonLabel: 'Apply Now',
};

export const ABOUT_CONTENT_COLLECTION = 'settings';
export const ABOUT_CONTENT_DOC_ID = 'aboutContent';

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" />
    </div>
  );
}

function ParagraphsField({ label, value, onChange, rows = 4 }: { label: string; value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
      <label>{label} (one paragraph per line)</label>
      <textarea value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} className="admin-input" rows={rows} style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }} />
    </div>
  );
}

function CardsField({ label, hint, cards, onChange }: { label: string; hint: string; cards: AboutCardCopy[]; onChange: (v: AboutCardCopy[]) => void }) {
  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 2 }}>{label}</label>
      <p className="admin-field__hint" style={{ margin: '0 0 0.5rem' }}>{hint}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.6rem' }}>
        {cards.map((c, idx) => (
          <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem' }}>
            <input
              type="text"
              value={c.title}
              onChange={(e) => { const next = [...cards]; next[idx] = { ...next[idx], title: e.target.value }; onChange(next); }}
              className="admin-input"
              style={{ width: '100%', marginBottom: '0.35rem', fontWeight: 600 }}
              placeholder="Title"
            />
            <textarea
              value={c.desc}
              onChange={(e) => { const next = [...cards]; next[idx] = { ...next[idx], desc: e.target.value }; onChange(next); }}
              className="admin-input"
              rows={2}
              style={{ width: '100%', fontFamily: 'inherit', resize: 'vertical' }}
              placeholder="Description"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutContentAdmin() {
  const [data, setData] = useState<AboutContentDoc>(DEFAULT_ABOUT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, ABOUT_CONTENT_COLLECTION, ABOUT_CONTENT_DOC_ID));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AboutContentDoc>;
          setData({ ...DEFAULT_ABOUT_CONTENT, ...remote });
        }
      } catch (err) {
        console.error('Failed to load About page content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const set = <K extends keyof AboutContentDoc>(k: K, v: AboutContentDoc[K]) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, ABOUT_CONTENT_COLLECTION, ABOUT_CONTENT_DOC_ID), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save About page content:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all About page copy to original defaults?')) setData(DEFAULT_ABOUT_CONTENT);
  };

  if (loading) {
    return <p className="admin-loading">Loading About Page Content Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>About Page — Copy</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Every narrative section on the About page, top to bottom. Quick Stats, Academic Snapshot stats,
              Differentiators list, Discover cards, Core Executives, and photos are each edited separately
              elsewhere (Page Content Blocks / Core Executives / Website Photos).
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

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: 0 }}>Quick Stats Banner</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.statsHeading} onChange={(v) => set('statsHeading', v)} />
          <TextField label="Footnote" value={data.statsFootnote} onChange={(v) => set('statsFootnote', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Overview</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.overviewHeading} onChange={(v) => set('overviewHeading', v)} />
          <ParagraphsField label="Paragraphs" value={data.overviewParagraphs} onChange={(v) => set('overviewParagraphs', v)} rows={3} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"Where Women Learn, Lead & Transform" Pillars</h3>
        <div className="admin-form-grid">
          <ParagraphsField label="Intro paragraphs (above the 5 cards)" value={data.pillarsIntroParagraphs} onChange={(v) => set('pillarsIntroParagraphs', v)} rows={3} />
          <CardsField label="5 Pillar Cards" hint="Fixed set of 5 cards (icons are not editable) — only title and description." cards={data.pillars} onChange={(v) => set('pillars', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>"A University Built for Her Ambition"</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.ambitionHeading} onChange={(v) => set('ambitionHeading', v)} />
          <ParagraphsField label="Paragraphs" value={data.ambitionParagraphs} onChange={(v) => set('ambitionParagraphs', v)} rows={3} />
          <TextField label="Tagline (first line)" value={data.ambitionTagline} onChange={(v) => set('ambitionTagline', v)} />
          <TextField label="Tagline (accent line)" value={data.ambitionTaglineAccent} onChange={(v) => set('ambitionTaglineAccent', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Academic Snapshot</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.academicHeading} onChange={(v) => set('academicHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.academicParagraph} onChange={(e) => set('academicParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Core Executive Body Heading</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.execHeading} onChange={(v) => set('execHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Subtitle</label>
            <textarea value={data.execSubtitle} onChange={(e) => set('execSubtitle', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Differentiators Section Heading</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.diffHeading} onChange={(v) => set('diffHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.diffParagraph} onChange={(e) => set('diffParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Campus Photos Caption</h3>
        <div className="admin-form-grid">
          <TextField label="Bold opening line" value={data.campusGalleryBold} onChange={(v) => set('campusGalleryBold', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Body</label>
            <textarea value={data.campusGalleryBody} onChange={(e) => set('campusGalleryBody', e.target.value)} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Campus Snapshot</h3>
        <div className="admin-form-grid">
          <TextField label="Eyebrow" value={data.campusSnapshotEyebrow} onChange={(v) => set('campusSnapshotEyebrow', v)} />
          <TextField label="Heading" value={data.campusSnapshotHeading} onChange={(v) => set('campusSnapshotHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph</label>
            <textarea value={data.campusSnapshotParagraph} onChange={(e) => set('campusSnapshotParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
          <CardsField label="3 Facility Cards" hint="Fixed set of 3 cards (icons/colours are not editable) — only title and description." cards={data.campusFacilityCards} onChange={(v) => set('campusFacilityCards', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>SVES Snapshot</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.svesHeading} onChange={(v) => set('svesHeading', v)} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph 1</label>
            <textarea value={data.svesParagraph1} onChange={(e) => set('svesParagraph1', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label>Paragraph 3 (closing line)</label>
            <textarea value={data.svesParagraph3} onChange={(e) => set('svesParagraph3', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
          </div>
          <TextField label="Stat — Institutions" value={data.svesStatInstitutions} onChange={(v) => set('svesStatInstitutions', v)} />
          <TextField label="Stat — Students" value={data.svesStatStudents} onChange={(v) => set('svesStatStudents', v)} />
          <TextField label="Stat — Campuses" value={data.svesStatCampuses} onChange={(v) => set('svesStatCampuses', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Discover Section Heading</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.discoverHeading} onChange={(v) => set('discoverHeading', v)} />
        </div>

        <h3 className="admin-card__title" style={{ fontSize: '0.95rem', marginTop: '1.25rem' }}>Closing CTA</h3>
        <div className="admin-form-grid">
          <TextField label="Heading" value={data.ctaHeading} onChange={(v) => set('ctaHeading', v)} />
          <ParagraphsField label="Paragraphs" value={data.ctaParagraphs} onChange={(v) => set('ctaParagraphs', v)} rows={3} />
          <TextField label="Closing line ('Join VWU.')" value={data.ctaJoinLine} onChange={(v) => set('ctaJoinLine', v)} />
          <TextField label="Button label" value={data.ctaButtonLabel} onChange={(v) => set('ctaButtonLabel', v)} />
        </div>
      </div>
    </div>
  );
}
