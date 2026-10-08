import { useState, useEffect } from 'react';
import { doc, getDoc, collection, serverTimestamp } from 'firebase/firestore';
import { setDoc, addDoc, updateDoc, deleteDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { CONTENT_ICON_NAMES } from '../../../lib/contentIcons';
import { Save, RotateCcw, Info, Plus, Edit2, Trash2, X } from 'lucide-react';

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
  svesParagraph3: string;
  svesStatInstitutions: string;
  svesStatStudents: string;
  svesStatCampuses: string;
  discoverHeading: string;
  ctaHeading: string;
  ctaParagraphs: string[];
  ctaJoinLine: string;
  ctaButtonLabel: string;
}

export interface ContentBlockDoc {
  id: string;
  page: string;
  section: string;
  value: string;
  title: string;
  desc: string;
  icon: string;
  slug: string;
  order: number;
}

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

const EMPTY_BLOCK_FORM = { value: '', title: '', desc: '', icon: '', slug: '', order: 0 };

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

  // Content Blocks for About page
  const { docs: allBlocks } = useOrderedCollection<ContentBlockDoc>('contentBlocks', 'order');

  // Inline edit state for content blocks
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [blockSection, setBlockSection] = useState<string>('');
  const [blockForm, setBlockForm] = useState(EMPTY_BLOCK_FORM);
  const [blockSaving, setBlockSaving] = useState(false);

  const quickStatsItems = allBlocks.filter((b) => b.page === 'about' && b.section === 'quickStats');
  const academicSnapshotItems = allBlocks.filter((b) => b.page === 'about' && b.section === 'academicSnapshotStats');
  const differentiatorsItems = allBlocks.filter((b) => b.page === 'about' && b.section === 'differentiators');
  const discoverCardsItems = allBlocks.filter((b) => b.page === 'about' && b.section === 'discoverCards');

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

  const startEditBlock = (b: ContentBlockDoc) => {
    setEditingBlockId(b.id);
    setBlockSection(b.section);
    setBlockForm({ value: b.value || '', title: b.title || '', desc: b.desc || '', icon: b.icon || '', slug: b.slug || '', order: b.order || 0 });
  };

  const startAddBlock = (section: string, defaultOrder: number) => {
    setEditingBlockId('new');
    setBlockSection(section);
    setBlockForm({ ...EMPTY_BLOCK_FORM, order: defaultOrder });
  };

  const cancelEditBlock = () => {
    setEditingBlockId(null);
    setBlockSection('');
    setBlockForm(EMPTY_BLOCK_FORM);
  };

  const handleSaveBlock = async (page: string, section: string, totalCount: number) => {
    if (!blockForm.title && !blockForm.value) return alert('Title or Value is required.');
    setBlockSaving(true);
    try {
      if (editingBlockId && editingBlockId !== 'new') {
        await updateDoc(doc(db, 'contentBlocks', editingBlockId), { ...blockForm });
      } else {
        await addDoc(collection(db, 'contentBlocks'), {
          page,
          section,
          ...blockForm,
          order: blockForm.order || totalCount + 1,
          createdAt: serverTimestamp(),
        });
      }
      cancelEditBlock();
    } catch (err) {
      alert(`Failed to save item: ${(err as Error).message}`);
    } finally {
      setBlockSaving(false);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, 'contentBlocks', id));
    } catch (err) {
      alert(`Failed to delete item: ${(err as Error).message}`);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading About VWU Content Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>About VWU</h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Manage all sections of the About VWU page in the exact order they appear on the public website (Top to Bottom).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost"><RotateCcw size={14} /> Reset Defaults</button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary"><Save size={14} /> {saving ? 'Saving...' : 'Save Narrative Changes'}</button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Saved and published live!
          </div>
        )}

        {/* Quick Jump Section Bar */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Page Flow Table of Contents (Public Order)
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => scrollToSection('sec-quick-stats')} className="admin-btn admin-btn--xs admin-btn--ghost">1. Quick Stats</button>
            <button type="button" onClick={() => scrollToSection('sec-overview')} className="admin-btn admin-btn--xs admin-btn--ghost">2. Overview</button>
            <button type="button" onClick={() => scrollToSection('sec-pillars')} className="admin-btn admin-btn--xs admin-btn--ghost">3. 5 Pillars</button>
            <button type="button" onClick={() => scrollToSection('sec-ambition')} className="admin-btn admin-btn--xs admin-btn--ghost">4. Her Ambition</button>
            <button type="button" onClick={() => scrollToSection('sec-academic-snapshot')} className="admin-btn admin-btn--xs admin-btn--ghost">5. Academic Snapshot</button>
            <button type="button" onClick={() => scrollToSection('sec-executives')} className="admin-btn admin-btn--xs admin-btn--ghost">6. Core Executives</button>
            <button type="button" onClick={() => scrollToSection('sec-differentiators')} className="admin-btn admin-btn--xs admin-btn--ghost">7. Differentiators</button>
            <button type="button" onClick={() => scrollToSection('sec-campus-photos')} className="admin-btn admin-btn--xs admin-btn--ghost">8. Campus Photos</button>
            <button type="button" onClick={() => scrollToSection('sec-campus-snapshot')} className="admin-btn admin-btn--xs admin-btn--ghost">9. Infrastructure</button>
            <button type="button" onClick={() => scrollToSection('sec-sves')} className="admin-btn admin-btn--xs admin-btn--ghost">10. SVES Snapshot</button>
            <button type="button" onClick={() => scrollToSection('sec-discover')} className="admin-btn admin-btn--xs admin-btn--ghost">11. Discover Cards</button>
            <button type="button" onClick={() => scrollToSection('sec-cta')} className="admin-btn admin-btn--xs admin-btn--ghost">12. Closing CTA</button>
          </div>
        </div>

        {/* 1. Quick Stats Bar (Below Hero) */}
        <section id="sec-quick-stats" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 className="admin-card__title" style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>
              1. Quick Stats Bar (Displayed Below Hero Banner)
            </h3>
            {editingBlockId !== 'new' && (
              <button type="button" onClick={() => startAddBlock('quickStats', quickStatsItems.length + 1)} className="admin-btn admin-btn--sm admin-btn--primary">
                <Plus size={14} /> Add Quick Stat Item
              </button>
            )}
          </div>
          <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
            <TextField label="Banner Heading" value={data.statsHeading} onChange={(v) => set('statsHeading', v)} />
            <TextField label="Banner Footnote" value={data.statsFootnote} onChange={(v) => set('statsFootnote', v)} />
          </div>

          {/* Edit Form for Quick Stats item */}
          {editingBlockId && blockSection === 'quickStats' && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#0f172a' }}>
                {editingBlockId === 'new' ? 'Add New Quick Stat Item' : 'Edit Quick Stat Item'}
              </h4>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Value (Big Stat Text / Number, e.g. 2001, 80+ Acres, 59.28 LPA)</label>
                  <input type="text" value={blockForm.value} onChange={(e) => setBlockForm((p) => ({ ...p, value: e.target.value }))} className="admin-input" placeholder="e.g. 2001" />
                </div>
                <div className="admin-field">
                  <label>Label / Title (e.g. ESTABLISHED, CAMPUS AREA)</label>
                  <input type="text" value={blockForm.title} onChange={(e) => setBlockForm((p) => ({ ...p, title: e.target.value }))} className="admin-input" placeholder="e.g. ESTABLISHED" />
                </div>
                <div className="admin-field">
                  <label>Display Order</label>
                  <input type="number" value={blockForm.order} onChange={(e) => setBlockForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="admin-input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={cancelEditBlock} className="admin-btn admin-btn--sm admin-btn--ghost"><X size={14} /> Cancel</button>
                <button type="button" onClick={() => handleSaveBlock('about', 'quickStats', quickStatsItems.length)} disabled={blockSaving} className="admin-btn admin-btn--sm admin-btn--primary">
                  <Save size={14} /> {blockSaving ? 'Saving...' : 'Save Stat'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {quickStatsItems.map((s) => (
              <div key={s.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1E42' }}>{s.value}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.title}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.85rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => startEditBlock(s)} className="admin-btn admin-btn--xs admin-btn--ghost"><Edit2 size={12} /> Edit</button>
                  <button type="button" onClick={() => handleDeleteBlock(s.id)} className="admin-btn admin-btn--xs admin-btn--danger"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Overview */}
        <section id="sec-overview" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 className="admin-card__title" style={{ marginTop: 0, fontSize: '1.05rem', color: '#0B1E42' }}>2. Overview Section</h3>
          <div className="admin-form-grid">
            <TextField label="Heading" value={data.overviewHeading} onChange={(v) => set('overviewHeading', v)} />
            <ParagraphsField label="Paragraphs" value={data.overviewParagraphs} onChange={(v) => set('overviewParagraphs', v)} rows={3} />
          </div>
        </section>

        {/* 3. Where Women Learn, Lead & Transform Pillars */}
        <section id="sec-pillars" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 className="admin-card__title" style={{ marginTop: 0, fontSize: '1.05rem', color: '#0B1E42' }}>3. "Where Women Learn, Lead &amp; Transform" Pillars</h3>
          <div className="admin-form-grid">
            <ParagraphsField label="Intro paragraphs (above the 5 cards)" value={data.pillarsIntroParagraphs} onChange={(v) => set('pillarsIntroParagraphs', v)} rows={3} />
            <CardsField label="5 Pillar Cards" hint="Fixed set of 5 cards (icons are structural) — title and description." cards={data.pillars} onChange={(v) => set('pillars', v)} />
          </div>
        </section>

        {/* 4. A University Built for Her Ambition */}
        <section id="sec-ambition" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 className="admin-card__title" style={{ marginTop: 0, fontSize: '1.05rem', color: '#0B1E42' }}>4. "A University Built for Her Ambition" Section</h3>
          <div className="admin-form-grid">
            <TextField label="Heading" value={data.ambitionHeading} onChange={(v) => set('ambitionHeading', v)} />
            <ParagraphsField label="Paragraphs" value={data.ambitionParagraphs} onChange={(v) => set('ambitionParagraphs', v)} rows={3} />
            <TextField label="Tagline (first line)" value={data.ambitionTagline} onChange={(v) => set('ambitionTagline', v)} />
            <TextField label="Tagline (accent line)" value={data.ambitionTaglineAccent} onChange={(v) => set('ambitionTaglineAccent', v)} />
          </div>
        </section>

        {/* 5. Academic Snapshot */}
        <section id="sec-academic-snapshot" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 className="admin-card__title" style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>
              5. Academic Snapshot Section
            </h3>
            {editingBlockId !== 'new' && (
              <button type="button" onClick={() => startAddBlock('academicSnapshotStats', academicSnapshotItems.length + 1)} className="admin-btn admin-btn--sm admin-btn--primary">
                <Plus size={14} /> Add Snapshot Card
              </button>
            )}
          </div>
          <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
            <TextField label="Section Heading" value={data.academicHeading} onChange={(v) => set('academicHeading', v)} />
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label>Section Paragraph</label>
              <textarea value={data.academicParagraph} onChange={(e) => set('academicParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
            </div>
          </div>

          {/* Edit Form for Snapshot Card */}
          {editingBlockId && blockSection === 'academicSnapshotStats' && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#0f172a' }}>
                {editingBlockId === 'new' ? 'Add New Snapshot Card' : 'Edit Snapshot Card'}
              </h4>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Degree / Category (Value, e.g. B.Tech, M.Tech, MBA, Ph.D.)</label>
                  <input type="text" value={blockForm.value} onChange={(e) => setBlockForm((p) => ({ ...p, value: e.target.value }))} className="admin-input" placeholder="e.g. B.Tech" />
                </div>
                <div className="admin-field">
                  <label>Subtitle / Count (Title, e.g. 10 Specialisations, 4 Programs)</label>
                  <input type="text" value={blockForm.title} onChange={(e) => setBlockForm((p) => ({ ...p, title: e.target.value }))} className="admin-input" placeholder="e.g. 10 Specialisations" />
                </div>
                <div className="admin-field">
                  <label>Display Order</label>
                  <input type="number" value={blockForm.order} onChange={(e) => setBlockForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="admin-input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={cancelEditBlock} className="admin-btn admin-btn--sm admin-btn--ghost"><X size={14} /> Cancel</button>
                <button type="button" onClick={() => handleSaveBlock('about', 'academicSnapshotStats', academicSnapshotItems.length)} disabled={blockSaving} className="admin-btn admin-btn--sm admin-btn--primary">
                  <Save size={14} /> {blockSaving ? 'Saving...' : 'Save Card'}
                </button>
              </div>
            </div>
          )}

          {/* Academic Snapshot Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {academicSnapshotItems.map((s) => (
              <div key={s.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #C9973A', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#C9973A' }}>{s.title}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0B1E42', marginTop: '0.2rem' }}>{s.value}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.85rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => startEditBlock(s)} className="admin-btn admin-btn--xs admin-btn--ghost"><Edit2 size={12} /> Edit</button>
                  <button type="button" onClick={() => handleDeleteBlock(s.id)} className="admin-btn admin-btn--xs admin-btn--danger"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Core Executive Body Heading */}
        <section id="sec-executives" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 className="admin-card__title" style={{ marginTop: 0, fontSize: '1.05rem', color: '#0B1E42' }}>6. Core Executive Body Section</h3>
          <div className="admin-form-grid">
            <TextField label="Heading" value={data.execHeading} onChange={(v) => set('execHeading', v)} />
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label>Subtitle</label>
              <textarea value={data.execSubtitle} onChange={(e) => set('execSubtitle', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
            </div>
          </div>
          <p className="admin-field__hint" style={{ marginTop: '0.5rem' }}>
            ℹ️ <em>Executive team members list &amp; profiles are edited in <strong>Admin → Core Executives</strong>.</em>
          </p>
        </section>

        {/* 7. Differentiators */}
        <section id="sec-differentiators" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 className="admin-card__title" style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>
              7. Differentiators Section
            </h3>
            {editingBlockId !== 'new' && (
              <button type="button" onClick={() => startAddBlock('differentiators', differentiatorsItems.length + 1)} className="admin-btn admin-btn--sm admin-btn--primary">
                <Plus size={14} /> Add Initiative Item
              </button>
            )}
          </div>
          <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
            <TextField label="Heading" value={data.diffHeading} onChange={(v) => set('diffHeading', v)} />
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label>Paragraph</label>
              <textarea value={data.diffParagraph} onChange={(e) => set('diffParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
            </div>
          </div>

          {/* Edit Form for Differentiator Item */}
          {editingBlockId && blockSection === 'differentiators' && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#0f172a' }}>
                {editingBlockId === 'new' ? 'Add New Initiative' : 'Edit Initiative'}
              </h4>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Category Name (Value, e.g. Specialised Labs, Industry Partnerships)</label>
                  <input type="text" value={blockForm.value} onChange={(e) => setBlockForm((p) => ({ ...p, value: e.target.value }))} className="admin-input" placeholder="e.g. Specialised Labs" />
                </div>
                <div className="admin-field">
                  <label>Initiative Title (Title, e.g. AR / VR Studio)</label>
                  <input type="text" value={blockForm.title} onChange={(e) => setBlockForm((p) => ({ ...p, title: e.target.value }))} className="admin-input" placeholder="e.g. AR / VR Studio" />
                </div>
                <div className="admin-field">
                  <label>Icon Name (Optional)</label>
                  <select value={blockForm.icon} onChange={(e) => setBlockForm((p) => ({ ...p, icon: e.target.value }))} className="admin-input">
                    <option value="">Default Icon</option>
                    {CONTENT_ICON_NAMES.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Display Order</label>
                  <input type="number" value={blockForm.order} onChange={(e) => setBlockForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="admin-input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={cancelEditBlock} className="admin-btn admin-btn--sm admin-btn--ghost"><X size={14} /> Cancel</button>
                <button type="button" onClick={() => handleSaveBlock('about', 'differentiators', differentiatorsItems.length)} disabled={blockSaving} className="admin-btn admin-btn--sm admin-btn--primary">
                  <Save size={14} /> {blockSaving ? 'Saving...' : 'Save Initiative'}
                </button>
              </div>
            </div>
          )}

          {/* Differentiators Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {differentiatorsItems.map((item) => (
              <div key={item.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#C9973A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {item.value || 'General Category'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B1E42', marginTop: '0.25rem' }}>
                    {item.title}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.85rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => startEditBlock(item)} className="admin-btn admin-btn--xs admin-btn--ghost"><Edit2 size={12} /> Edit</button>
                  <button type="button" onClick={() => handleDeleteBlock(item.id)} className="admin-btn admin-btn--xs admin-btn--danger"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Campus Photos Caption */}
        <section id="sec-campus-photos" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 className="admin-card__title" style={{ marginTop: 0, fontSize: '1.05rem', color: '#0B1E42' }}>8. Campus Life Photos Caption Section</h3>
          <div className="admin-form-grid">
            <TextField label="Bold opening line" value={data.campusGalleryBold} onChange={(v) => set('campusGalleryBold', v)} />
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label>Body Text</label>
              <textarea value={data.campusGalleryBody} onChange={(e) => set('campusGalleryBody', e.target.value)} className="admin-input" rows={3} style={{ width: '100%', fontFamily: 'inherit' }} />
            </div>
          </div>
          <p className="admin-field__hint" style={{ marginTop: '0.5rem' }}>
            ℹ️ <em>Actual photos are managed in <strong>Admin → Site Appearance → Website Photos (About VWU)</strong>.</em>
          </p>
        </section>

        {/* 9. Purpose-Built Infrastructure (Campus Snapshot) */}
        <section id="sec-campus-snapshot" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 className="admin-card__title" style={{ marginTop: 0, fontSize: '1.05rem', color: '#0B1E42' }}>9. Purpose-Built Infrastructure (Campus Snapshot) Section</h3>
          <div className="admin-form-grid">
            <TextField label="Eyebrow" value={data.campusSnapshotEyebrow} onChange={(v) => set('campusSnapshotEyebrow', v)} />
            <TextField label="Heading" value={data.campusSnapshotHeading} onChange={(v) => set('campusSnapshotHeading', v)} />
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label>Paragraph</label>
              <textarea value={data.campusSnapshotParagraph} onChange={(e) => set('campusSnapshotParagraph', e.target.value)} className="admin-input" rows={2} style={{ width: '100%', fontFamily: 'inherit' }} />
            </div>
            <CardsField label="3 Facility Cards" hint="Fixed set of 3 cards (icons/colours are structural) — title and description." cards={data.campusFacilityCards} onChange={(v) => set('campusFacilityCards', v)} />
          </div>
        </section>

        {/* 10. SVES Snapshot */}
        <section id="sec-sves" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 className="admin-card__title" style={{ marginTop: 0, fontSize: '1.05rem', color: '#0B1E42' }}>10. SVES Snapshot Section</h3>
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
        </section>

        {/* 11. Explore VWU in Detail (Discover Sub-pages) */}
        <section id="sec-discover" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 className="admin-card__title" style={{ margin: 0, fontSize: '1.05rem', color: '#0B1E42' }}>
              11. Explore VWU in Detail (Discover Sub-pages Cards)
            </h3>
            {editingBlockId !== 'new' && (
              <button type="button" onClick={() => startAddBlock('discoverCards', discoverCardsItems.length + 1)} className="admin-btn admin-btn--sm admin-btn--primary">
                <Plus size={14} /> Add Discover Card
              </button>
            )}
          </div>
          <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
            <TextField label="Section Heading" value={data.discoverHeading} onChange={(v) => set('discoverHeading', v)} />
          </div>

          {/* Edit Form for Discover Card Item */}
          {editingBlockId && blockSection === 'discoverCards' && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#0f172a' }}>
                {editingBlockId === 'new' ? 'Add New Discover Card' : 'Edit Discover Card'}
              </h4>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Card Title (Title, e.g. Vision &amp; Mission)</label>
                  <input type="text" value={blockForm.title} onChange={(e) => setBlockForm((p) => ({ ...p, title: e.target.value }))} className="admin-input" placeholder="e.g. Vision &amp; Mission" />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <input type="text" value={blockForm.desc} onChange={(e) => setBlockForm((p) => ({ ...p, desc: e.target.value }))} className="admin-input" placeholder="Card description text" />
                </div>
                <div className="admin-field">
                  <label>Target Page Link Path (Slug, e.g. /vision-mission, /governance/idp)</label>
                  <input type="text" value={blockForm.slug} onChange={(e) => setBlockForm((p) => ({ ...p, slug: e.target.value }))} className="admin-input" placeholder="e.g. /vision-mission" />
                </div>
                <div className="admin-field">
                  <label>Icon Name (Optional)</label>
                  <select value={blockForm.icon} onChange={(e) => setBlockForm((p) => ({ ...p, icon: e.target.value }))} className="admin-input">
                    <option value="">Default Icon</option>
                    {CONTENT_ICON_NAMES.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Display Order</label>
                  <input type="number" value={blockForm.order} onChange={(e) => setBlockForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} className="admin-input" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={cancelEditBlock} className="admin-btn admin-btn--sm admin-btn--ghost"><X size={14} /> Cancel</button>
                <button type="button" onClick={() => handleSaveBlock('about', 'discoverCards', discoverCardsItems.length)} disabled={blockSaving} className="admin-btn admin-btn--sm admin-btn--primary">
                  <Save size={14} /> {blockSaving ? 'Saving...' : 'Save Card'}
                </button>
              </div>
            </div>
          )}

          {/* Discover Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {discoverCardsItems.map((item) => (
              <div key={item.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0B1E42' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{item.desc}</div>
                  {item.slug && <div style={{ fontSize: '0.76rem', color: '#C9973A', fontWeight: 600, marginTop: '0.35rem' }}>🔗 {item.slug}</div>}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.85rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => startEditBlock(item)} className="admin-btn admin-btn--xs admin-btn--ghost"><Edit2 size={12} /> Edit</button>
                  <button type="button" onClick={() => handleDeleteBlock(item.id)} className="admin-btn admin-btn--xs admin-btn--danger"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 12. Closing CTA */}
        <section id="sec-cta" style={{ marginBottom: '1rem' }}>
          <h3 className="admin-card__title" style={{ marginTop: 0, fontSize: '1.05rem', color: '#0B1E42' }}>12. Closing Call-To-Action (CTA) Section</h3>
          <div className="admin-form-grid">
            <TextField label="Heading" value={data.ctaHeading} onChange={(v) => set('ctaHeading', v)} />
            <ParagraphsField label="Paragraphs" value={data.ctaParagraphs} onChange={(v) => set('ctaParagraphs', v)} rows={3} />
            <TextField label="Closing line ('Join VWU.')" value={data.ctaJoinLine} onChange={(v) => set('ctaJoinLine', v)} />
            <TextField label="Button label" value={data.ctaButtonLabel} onChange={(v) => set('ctaButtonLabel', v)} />
          </div>
        </section>

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button type="button" onClick={handleReset} className="admin-btn admin-btn--ghost"><RotateCcw size={14} /> Reset Defaults</button>
          <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--primary"><Save size={14} /> {saving ? 'Saving...' : 'Save Narrative Changes'}</button>
        </div>
      </div>
    </div>
  );
}
