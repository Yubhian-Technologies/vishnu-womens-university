import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  Wrench,
  ShieldCheck,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import type { UploadResult } from '../../../lib/storage';

export interface AdvancedElectricalPatent {
  title: string;
  status: string;
  inventor: string;
  domain: string;
}

export interface AdvancedElectricalModel {
  title: string;
  description: string;
  tag: string;
}

export interface AdvancedElectricalGalleryPhoto {
  imageUrl: string;
  caption?: string;
  storagePath?: string;
}

export interface CustomAdvancedElectricalSection {
  id: string;
  title: string;
  badge?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
}

export interface AdvancedElectricalDoc {
  // Hero section
  heroTitle: string;
  heroSubtitle: string;

  // 1. Overview & Domains
  overviewBadge?: string;
  overviewTitle?: string;
  overviewLead?: string;
  aboutText: string;
  focusAreas: string[];

  // 2. Patents Granted
  patentsBadge?: string;
  patentsTitle?: string;
  patentsLead?: string;
  patents: AdvancedElectricalPatent[];

  // 3. Operational Working Models
  modelsBadge?: string;
  modelsTitle?: string;
  modelsLead?: string;
  workingModels: AdvancedElectricalModel[];

  // 4. Key Highlights
  highlightsTitle?: string;
  highlightsList: string[];

  // 5. Facilities & Equipment
  facilitiesTitle?: string;
  facilitiesList: string[];

  // 6. Outcomes & Achievements
  outcomesBadge?: string;
  outcomesTitle?: string;
  outcomesList?: string[];

  // 7. Photo Gallery
  galleryBadge?: string;
  galleryTitle?: string;
  gallery?: AdvancedElectricalGalleryPhoto[];

  // 8. Dynamic Custom Sections
  additionalSections?: CustomAdvancedElectricalSection[];
}

export const defaultAdvancedElectrical: AdvancedElectricalDoc = {
  heroTitle: 'Advanced Electrical R&D Laboratory',
  heroSubtitle:
    'Transforming theoretical electrical knowledge into ground-breaking patents, power-electronics working models, and electric vehicle innovation.',

  overviewBadge: 'Center of Excellence',
  overviewTitle: 'Laboratory Mission & Core Focus',
  overviewLead:
    'A state-of-the-art facility fostering industry-ready skills in electric mobility, green energy systems, and intelligent embedded automation.',
  aboutText:
    'The Advanced Electrical R&D Laboratory at SVECW fosters cutting-edge research, hands-on experimentation, and technological innovation in power systems, electric vehicles, embedded control, and renewable energy.',
  focusAreas: [
    'Power Electronics & Converters',
    'Electric Drives & Motor Control (BLDC, PMSM, SRM)',
    'FPGA & DSP Real-Time Control Systems',
    'Renewable Energy Integration & Solar MPPT Hardware',
    'Assistive Electromechanical Devices & Biomedical Tools',
    'Cyber-Physical Power Systems & Microgrids',
  ],

  patentsBadge: 'Intellectual Property & Innovation',
  patentsTitle: 'Patents Granted',
  patentsLead:
    'Transforming innovative engineering concepts into patented, industry-ready technologies and socially impactful assistive systems.',
  patents: [
    {
      title: 'A Device for Testing and Evaluating Motor Drives for Electric Vehicles',
      status: 'Patent Granted',
      inventor: 'Dr. J. Rohith Balaji',
      domain: 'Electric Vehicles / Motor Drives',
    },
    {
      title: 'An Apparatus for Automated Dental Dispensing and Method Thereof',
      status: 'Patent Granted',
      inventor: 'Dr. J. Rohith Balaji',
      domain: 'Biomedical & Healthcare Automation',
    },
    {
      title: 'A Device for Embossing Braille Characters on a Sheet',
      status: 'Patent Granted',
      inventor: 'Dr. J. Rohith Balaji',
      domain: 'Assistive Devices for Visually Challenged',
    },
  ],

  modelsBadge: 'Hardware Prototypes',
  modelsTitle: 'Operational Working Models',
  modelsLead:
    'The laboratory houses 9 fully functional hardware prototypes and test rigs developed by student and faculty researchers.',
  workingModels: [
    {
      title: 'Smart Solar Aerator System',
      description: 'Solar-powered dissolved-oxygen enhancement apparatus for intensive aquaculture ponds.',
      tag: 'Aquaculture Automation',
    },
    {
      title: 'PLC-Based Industrial Automation Trainer Kit',
      description: 'Modular programmable logic controller test bench for process automation and sequential control.',
      tag: 'Industrial Automation',
    },
    {
      title: 'Hybrid EV Charging System',
      description: 'Multi-source renewable energy charging infrastructure for electric vehicles.',
      tag: 'EV Infrastructure',
    },
    {
      title: 'FPGA & DSP-Based Motor Control Setup',
      description: 'High-speed digital signal processing platforms for BLDC and PMSM electric motors.',
      tag: 'Digital Motor Drives',
    },
    {
      title: 'Multilevel Inverters & Battery Management (BMS)',
      description: 'Advanced power conversion architecture with cell balancing and thermal management.',
      tag: 'Power Electronics',
    },
    {
      title: 'Solar PV MPPT & Wind Emulator',
      description: 'Dynamic hardware emulator for maximum power point tracking and grid integration.',
      tag: 'Renewable Systems',
    },
    {
      title: 'Low-Cost Braille Character Printer',
      description: 'Patented assistive electromechanical device designed for visually challenged learners.',
      tag: 'Assistive Technology',
    },
    {
      title: 'Automated Dental Dispenser Apparatus',
      description: 'Patented electromechanical precision dispenser for clinical dental applications.',
      tag: 'Biomedical Devices',
    },
    {
      title: 'Cyber-Physical Energy Automation Testbed',
      description: 'Connected microgrid test bench with adaptive PID, fuzzy logic, and neural control.',
      tag: 'Smart Grids',
    },
  ],

  highlightsTitle: 'Key Highlights',
  highlightsList: [
    'Vision of excellence in Power Electronics, Electric Drives, Embedded Control, and Renewable Technologies.',
    '9 operational working models — spanning EV drive controllers, solar systems, and assistive medical devices.',
    '3 Patents granted, including a Braille-character printer, dental dispenser, and EV motor drive testing apparatus.',
    'Advanced focus areas: FPGA/DSP motor control, control & automation, inverters & converters, solar PV, and cyber-physical systems.',
    'Continuous research projects successfully delivered annually from 2015-16 through 2021-22 and beyond.',
    'Directly aligned with national Atmanirbhar Bharat and Make in India innovation missions.',
  ],

  facilitiesTitle: 'Facilities & Equipment',
  facilitiesList: [
    '9 operational working models, including a Smart Solar Aerator System, PLC Automation Trainer Kit, and Hybrid EV Charging System.',
    'FPGA and DSP-based high-performance motor control test benches with real-time feedback loops.',
    'Solar PV MPPT testing array and wind turbine emulation hardware setup.',
    'Precision digital storage oscilloscopes, power quality analyzers, and embedded microcontroller testbeds.',
  ],

  outcomesBadge: 'Key Achievements',
  outcomesTitle: 'Outcomes & Achievements',
  outcomesList: [
    '3 patents granted: Dental Dispenser, Braille-Character Printer, EV Motor Drive Testing Apparatus (all inventor: Dr. J. Rohith Balaji)',
    'Research projects delivered annually from 2015-16 through 2021-22',
    'Recognition in innovation challenges and hackathons',
  ],

  galleryBadge: 'Visual Showcase',
  galleryTitle: 'Laboratory & R&D Gallery',
  gallery: [
    { imageUrl: '/gallery/differentiators/elec-lab-1.jpg', caption: 'Students working on motor control test bench' },
    { imageUrl: '/gallery/differentiators/elec-lab-2.jpg', caption: 'DSP & FPGA based BLDC motor setup' },
    { imageUrl: '/gallery/differentiators/elec-lab-3.jpg', caption: 'R&D experimental hardware assembly' },
    { imageUrl: '/gallery/differentiators/elec-lab-4.jpg', caption: 'Testing team with faculty supervisors' },
  ],

  additionalSections: [],
};

type ActiveSubSection =
  | 'overview'
  | 'patents'
  | 'models'
  | 'highlights'
  | 'facilities'
  | 'outcomes'
  | 'gallery'
  | 'custom-sections';

export default function AdvancedElectricalContentAdmin() {
  const [data, setData] = useState<AdvancedElectricalDoc>(defaultAdvancedElectrical);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveSubSection>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        let loadedOutcomes: string[] = [];
        let loadedOutcomesTitle = defaultAdvancedElectrical.outcomesTitle;
        let loadedOutcomesBadge = defaultAdvancedElectrical.outcomesBadge;

        const snap = await getDoc(doc(db, 'settings', 'advancedElectricalLab'));
        let remote: Partial<AdvancedElectricalDoc> = {};
        if (snap.exists()) {
          remote = snap.data() as Partial<AdvancedElectricalDoc>;
          if (remote.outcomesList && remote.outcomesList.length > 0) {
            loadedOutcomes = remote.outcomesList;
          }
          if (remote.outcomesTitle) loadedOutcomesTitle = remote.outcomesTitle;
          if (remote.outcomesBadge) loadedOutcomesBadge = remote.outcomesBadge;
        }

        // If outcomesList is empty, look up differentiatorItems for 'advanced-electrical-rd-lab'
        if (loadedOutcomes.length === 0) {
          try {
            const itemsQuery = query(collection(db, 'differentiatorItems'), where('slug', '==', 'advanced-electrical-rd-lab'));
            const itemsSnap = await getDocs(itemsQuery);
            if (!itemsSnap.empty) {
              const itemData = itemsSnap.docs[0].data();
              const customSections = (itemData.customSections || []) as any[];
              const outcomesSec = customSections.find((s) => {
                const norm = (s.label || s.title || '').toLowerCase();
                return norm.includes('outcome') || norm.includes('achievement');
              });
              if (outcomesSec) {
                if (outcomesSec.label) loadedOutcomesTitle = outcomesSec.label;
                if (Array.isArray(outcomesSec.listItems) && outcomesSec.listItems.length > 0) {
                  loadedOutcomes = outcomesSec.listItems.filter((it: any) => typeof it === 'string' && it.trim());
                } else if (outcomesSec.textContent) {
                  loadedOutcomes = outcomesSec.textContent
                    .split('\n')
                    .map((l: string) => l.trim().replace(/^[-•*]\s*/, ''))
                    .filter(Boolean);
                } else if (Array.isArray(outcomesSec.sections)) {
                  loadedOutcomes = outcomesSec.sections.flatMap((sub: any) => {
                    if (Array.isArray(sub.listItems)) return sub.listItems;
                    if (sub.textContent) return sub.textContent.split('\n').map((l: string) => l.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
                    return [];
                  });
                }
              }
            }
          } catch (e) {
            console.warn('Could not fetch differentiatorItems outcomes:', e);
          }
        }

        // Fallback to default if still empty
        if (loadedOutcomes.length === 0) {
          loadedOutcomes = defaultAdvancedElectrical.outcomesList || [];
        }

        setData({
          ...defaultAdvancedElectrical,
          ...remote,
          focusAreas: remote.focusAreas && remote.focusAreas.length > 0 ? remote.focusAreas : defaultAdvancedElectrical.focusAreas,
          patents: remote.patents && remote.patents.length > 0 ? remote.patents : defaultAdvancedElectrical.patents,
          workingModels: remote.workingModels && remote.workingModels.length > 0 ? remote.workingModels : defaultAdvancedElectrical.workingModels,
          highlightsList: remote.highlightsList && remote.highlightsList.length > 0 ? remote.highlightsList : defaultAdvancedElectrical.highlightsList,
          facilitiesList: remote.facilitiesList && remote.facilitiesList.length > 0 ? remote.facilitiesList : defaultAdvancedElectrical.facilitiesList,
          outcomesTitle: loadedOutcomesTitle,
          outcomesBadge: loadedOutcomesBadge,
          outcomesList: loadedOutcomes,
          gallery: remote.gallery && remote.gallery.length > 0 ? remote.gallery : defaultAdvancedElectrical.gallery,
          additionalSections: remote.additionalSections ?? [],
        });
      } catch (err) {
        console.error('Failed to load Advanced Electrical Lab data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'advancedElectricalLab'), data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save Advanced Electrical Lab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all Advanced Electrical Lab content to original defaults?')) {
      setData(defaultAdvancedElectrical);
    }
  };

  const handleGalleryUpload = (result: UploadResult) => {
    const newPhoto: AdvancedElectricalGalleryPhoto = {
      imageUrl: result.url,
      storagePath: result.path,
      caption: '',
    };
    setData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), newPhoto],
    }));
  };

  const removeGalleryPhoto = (index: number) => {
    setData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  const updateGalleryCaption = (index: number, caption: string) => {
    setData((prev) => {
      const updated = [...(prev.gallery || [])];
      updated[index] = { ...updated[index], caption };
      return { ...prev, gallery: updated };
    });
  };

  // Helper move functions
  const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const updated = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return list;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    return updated;
  };

  if (loading) {
    return <p className="admin-loading">Loading Advanced Electrical Lab Content Editor...</p>;
  }

  const tabs: Array<{ id: ActiveSubSection; label: string; icon: any; count?: number }> = [
    { id: 'overview', label: '1. Overview & Domains', icon: BookOpen },
    { id: 'patents', label: '2. Patents Granted', icon: ShieldCheck, count: data.patents?.length },
    { id: 'models', label: '3. Operational Working Models', icon: Wrench, count: data.workingModels?.length },
    { id: 'highlights', label: '4. Key Highlights', icon: Award, count: data.highlightsList?.length },
    { id: 'facilities', label: '5. Facilities & Equipment', icon: Layers, count: data.facilitiesList?.length },
    { id: 'outcomes', label: '6. Outcomes & Achievements', icon: CheckCircle2, count: data.outcomesList?.length },
    { id: 'gallery', label: '7. Photo Gallery', icon: ImageIcon, count: data.gallery?.length },
    { id: 'custom-sections', label: '8. Custom Sections', icon: Sparkles, count: data.additionalSections?.length },
  ];

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Header toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                Advanced Electrical R&D Lab Content Editor
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Restructured to follow the exact top-to-bottom layout of the public Advanced Electrical R&D Lab page.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost">
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn--sm admin-btn--primary"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: '#065f46',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <span>✓ Advanced Electrical Lab content successfully saved and published live!</span>
          </div>
        )}

        {/* Sub-tabs Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`admin-btn admin-btn--sm ${isActive ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.07)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      fontWeight: 700,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Domains */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0b1e42' }}>
                Hero Banner Content
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div className="admin-field">
                  <label>Hero Title</label>
                  <input
                    type="text"
                    value={data.heroTitle}
                    onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-field">
                  <label>Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={data.heroSubtitle}
                    onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
                    className="admin-textarea"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Badge / Tag</label>
                <input
                  type="text"
                  value={data.overviewBadge || ''}
                  onChange={(e) => setData({ ...data, overviewBadge: e.target.value })}
                  placeholder="Center of Excellence"
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label>Section Heading</label>
                <input
                  type="text"
                  value={data.overviewTitle || ''}
                  onChange={(e) => setData({ ...data, overviewTitle: e.target.value })}
                  placeholder="Laboratory Mission & Core Focus"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Section Lead Description</label>
              <textarea
                rows={2}
                value={data.overviewLead || ''}
                onChange={(e) => setData({ ...data, overviewLead: e.target.value })}
                placeholder="A state-of-the-art facility fostering industry-ready skills..."
                className="admin-textarea"
              />
            </div>

            <div className="admin-field">
              <label>Mission & Overview Narrative Text (supports **bold**)</label>
              <textarea
                rows={4}
                value={data.aboutText}
                onChange={(e) => setData({ ...data, aboutText: e.target.value })}
                className="admin-textarea"
              />
            </div>

            {/* Core Focus Areas */}
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                    Core Focus Areas ({data.focusAreas.length})
                  </label>
                  <p className="admin-field__hint" style={{ margin: 0 }}>
                    Displayed as high-impact cards with power icons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setData({ ...data, focusAreas: [...data.focusAreas, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Focus Area
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.6rem' }}>
                {data.focusAreas.map((area, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => {
                        const updated = [...data.focusAreas];
                        updated[idx] = e.target.value;
                        setData({ ...data, focusAreas: updated });
                      }}
                      className="admin-input"
                      placeholder="e.g., Power Electronics & Converters"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => setData({ ...data, focusAreas: moveItem(data.focusAreas, idx, 'up') })}
                      className="admin-btn-icon"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.focusAreas.length - 1}
                      onClick={() => setData({ ...data, focusAreas: moveItem(data.focusAreas, idx, 'down') })}
                      className="admin-btn-icon"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setData({ ...data, focusAreas: data.focusAreas.filter((_, i) => i !== idx) })}
                      className="admin-btn-danger"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Patents Granted */}
        {activeTab === 'patents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Badge</label>
                <input
                  type="text"
                  value={data.patentsBadge || ''}
                  onChange={(e) => setData({ ...data, patentsBadge: e.target.value })}
                  placeholder="Intellectual Property & Innovation"
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label>Section Title</label>
                <input
                  type="text"
                  value={data.patentsTitle || ''}
                  onChange={(e) => setData({ ...data, patentsTitle: e.target.value })}
                  placeholder="Patents Granted"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Section Lead Description</label>
              <textarea
                rows={2}
                value={data.patentsLead || ''}
                onChange={(e) => setData({ ...data, patentsLead: e.target.value })}
                placeholder="Transforming innovative engineering concepts into patented..."
                className="admin-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                Patents List ({data.patents.length})
              </label>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    patents: [
                      ...data.patents,
                      {
                        title: 'New Patent Title',
                        status: 'Patent Granted',
                        inventor: 'Dr. J. Rohith Balaji',
                        domain: 'Engineering Domain',
                      },
                    ],
                  })
                }
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Patent
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.patents.map((pat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: '#0b1e42', fontSize: '0.9rem' }}>
                      Patent #{idx + 1}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => setData({ ...data, patents: moveItem(data.patents, idx, 'up') })}
                        className="admin-btn-icon"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === data.patents.length - 1}
                        onClick={() => setData({ ...data, patents: moveItem(data.patents, idx, 'down') })}
                        className="admin-btn-icon"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, patents: data.patents.filter((_, i) => i !== idx) })}
                        className="admin-btn-danger"
                        title="Delete"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                      <label>Patent Title</label>
                      <input
                        type="text"
                        value={pat.title}
                        onChange={(e) => {
                          const updated = [...data.patents];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({ ...data, patents: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Status (Badge)</label>
                      <input
                        type="text"
                        value={pat.status}
                        onChange={(e) => {
                          const updated = [...data.patents];
                          updated[idx] = { ...updated[idx], status: e.target.value };
                          setData({ ...data, patents: updated });
                        }}
                        className="admin-input"
                        placeholder="e.g., Patent Granted"
                      />
                    </div>
                    <div className="admin-field">
                      <label>Lead Inventor</label>
                      <input
                        type="text"
                        value={pat.inventor}
                        onChange={(e) => {
                          const updated = [...data.patents];
                          updated[idx] = { ...updated[idx], inventor: e.target.value };
                          setData({ ...data, patents: updated });
                        }}
                        className="admin-input"
                        placeholder="e.g., Dr. J. Rohith Balaji"
                      />
                    </div>
                    <div className="admin-field">
                      <label>Domain / Category</label>
                      <input
                        type="text"
                        value={pat.domain}
                        onChange={(e) => {
                          const updated = [...data.patents];
                          updated[idx] = { ...updated[idx], domain: e.target.value };
                          setData({ ...data, patents: updated });
                        }}
                        className="admin-input"
                        placeholder="e.g., Electric Vehicles / Motor Drives"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Operational Working Models */}
        {activeTab === 'models' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Badge</label>
                <input
                  type="text"
                  value={data.modelsBadge || ''}
                  onChange={(e) => setData({ ...data, modelsBadge: e.target.value })}
                  placeholder="Hardware Prototypes"
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label>Section Title</label>
                <input
                  type="text"
                  value={data.modelsTitle || ''}
                  onChange={(e) => setData({ ...data, modelsTitle: e.target.value })}
                  placeholder="Operational Working Models"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Section Lead Description</label>
              <textarea
                rows={2}
                value={data.modelsLead || ''}
                onChange={(e) => setData({ ...data, modelsLead: e.target.value })}
                placeholder="The laboratory houses 9 fully functional hardware prototypes..."
                className="admin-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                Working Models ({data.workingModels.length})
              </label>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    workingModels: [
                      ...data.workingModels,
                      { title: 'New Prototype Title', description: 'Prototype Description', tag: 'Domain Tag' },
                    ],
                  })
                }
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Model
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {data.workingModels.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <input
                        type="text"
                        value={m.tag}
                        onChange={(e) => {
                          const updated = [...data.workingModels];
                          updated[idx] = { ...updated[idx], tag: e.target.value };
                          setData({ ...data, workingModels: updated });
                        }}
                        className="admin-input"
                        style={{ maxWidth: '160px', fontWeight: 700, color: '#b45309', fontSize: '0.78rem' }}
                        placeholder="Tag (e.g. Smart Grids)"
                      />
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => setData({ ...data, workingModels: moveItem(data.workingModels, idx, 'up') })}
                          className="admin-btn-icon"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === data.workingModels.length - 1}
                          onClick={() => setData({ ...data, workingModels: moveItem(data.workingModels, idx, 'down') })}
                          className="admin-btn-icon"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setData({ ...data, workingModels: data.workingModels.filter((_, i) => i !== idx) })
                          }
                          className="admin-btn-danger"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="admin-field" style={{ marginBottom: '0.6rem' }}>
                      <label style={{ fontSize: '0.75rem' }}>Model Title</label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...data.workingModels];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({ ...data, workingModels: updated });
                        }}
                        className="admin-input"
                        style={{ fontWeight: 700 }}
                        placeholder="Model Title"
                      />
                    </div>

                    <div className="admin-field">
                      <label style={{ fontSize: '0.75rem' }}>Description (supports **bold**)</label>
                      <textarea
                        rows={2}
                        value={m.description}
                        onChange={(e) => {
                          const updated = [...data.workingModels];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setData({ ...data, workingModels: updated });
                        }}
                        className="admin-textarea"
                        placeholder="Model Description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Key Highlights */}
        {activeTab === 'highlights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-field">
              <label>Section Heading</label>
              <input
                type="text"
                value={data.highlightsTitle || ''}
                onChange={(e) => setData({ ...data, highlightsTitle: e.target.value })}
                placeholder="Key Highlights"
                className="admin-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div>
                <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                  Highlights Checklist ({data.highlightsList.length})
                </label>
                <p className="admin-field__hint" style={{ margin: 0 }}>
                  Rendered as verified checkmark items on the left column of the dual grid.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setData({ ...data, highlightsList: [...data.highlightsList, ''] })}
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Highlight
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {data.highlightsList.map((hl, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => {
                      const updated = [...data.highlightsList];
                      updated[idx] = e.target.value;
                      setData({ ...data, highlightsList: updated });
                    }}
                    className="admin-input"
                    placeholder="Enter highlight item..."
                  />
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => setData({ ...data, highlightsList: moveItem(data.highlightsList, idx, 'up') })}
                    className="admin-btn-icon"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === data.highlightsList.length - 1}
                    onClick={() => setData({ ...data, highlightsList: moveItem(data.highlightsList, idx, 'down') })}
                    className="admin-btn-icon"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, highlightsList: data.highlightsList.filter((_, i) => i !== idx) })
                    }
                    className="admin-btn-danger"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Facilities & Equipment */}
        {activeTab === 'facilities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-field">
              <label>Section Heading</label>
              <input
                type="text"
                value={data.facilitiesTitle || ''}
                onChange={(e) => setData({ ...data, facilitiesTitle: e.target.value })}
                placeholder="Facilities & Equipment"
                className="admin-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div>
                <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                  Facilities Checklist ({data.facilitiesList.length})
                </label>
                <p className="admin-field__hint" style={{ margin: 0 }}>
                  Rendered as verified checkmark items on the right column of the dual grid.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setData({ ...data, facilitiesList: [...data.facilitiesList, ''] })}
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Facility
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {data.facilitiesList.map((fac, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={fac}
                    onChange={(e) => {
                      const updated = [...data.facilitiesList];
                      updated[idx] = e.target.value;
                      setData({ ...data, facilitiesList: updated });
                    }}
                    className="admin-input"
                    placeholder="Enter facility or equipment item..."
                  />
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => setData({ ...data, facilitiesList: moveItem(data.facilitiesList, idx, 'up') })}
                    className="admin-btn-icon"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === data.facilitiesList.length - 1}
                    onClick={() => setData({ ...data, facilitiesList: moveItem(data.facilitiesList, idx, 'down') })}
                    className="admin-btn-icon"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, facilitiesList: data.facilitiesList.filter((_, i) => i !== idx) })
                    }
                    className="admin-btn-danger"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Outcomes & Achievements */}
        {activeTab === 'outcomes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Badge</label>
                <input
                  type="text"
                  value={data.outcomesBadge || ''}
                  onChange={(e) => setData({ ...data, outcomesBadge: e.target.value })}
                  placeholder="Key Achievements"
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label>Section Heading</label>
                <input
                  type="text"
                  value={data.outcomesTitle || ''}
                  onChange={(e) => setData({ ...data, outcomesTitle: e.target.value })}
                  placeholder="Outcomes & Achievements"
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <div>
                <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                  Outcomes Checklist ({(data.outcomesList || []).length})
                </label>
                <p className="admin-field__hint" style={{ margin: 0 }}>
                  Rendered as verified learning outcomes and key milestones achieved by the lab.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setData({ ...data, outcomesList: [...(data.outcomesList || []), ''] })}
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Outcome
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {(data.outcomesList || []).map((outItem, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={outItem}
                    onChange={(e) => {
                      const updated = [...(data.outcomesList || [])];
                      updated[idx] = e.target.value;
                      setData({ ...data, outcomesList: updated });
                    }}
                    className="admin-input"
                    placeholder="Enter outcome or achievement item..."
                  />
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => setData({ ...data, outcomesList: moveItem(data.outcomesList || [], idx, 'up') })}
                    className="admin-btn-icon"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === (data.outcomesList || []).length - 1}
                    onClick={() => setData({ ...data, outcomesList: moveItem(data.outcomesList || [], idx, 'down') })}
                    className="admin-btn-icon"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, outcomesList: (data.outcomesList || []).filter((_, i) => i !== idx) })
                    }
                    className="admin-btn-danger"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Photo Gallery */}
        {activeTab === 'gallery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Gallery Section Badge</label>
                <input
                  type="text"
                  value={data.galleryBadge || ''}
                  onChange={(e) => setData({ ...data, galleryBadge: e.target.value })}
                  placeholder="Visual Showcase"
                  className="admin-input"
                />
              </div>
              <div className="admin-field">
                <label>Gallery Section Title</label>
                <input
                  type="text"
                  value={data.galleryTitle || ''}
                  onChange={(e) => setData({ ...data, galleryTitle: e.target.value })}
                  placeholder="Laboratory & R&D Gallery"
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0b1e42' }}>
                Upload New Gallery Photo
              </h3>
              <ImageUploader
                folder="differentiators/advanced-electrical"
                onUploaded={handleGalleryUpload}
                aspect={16 / 9}
              />
            </div>

            <div>
              <label className="admin-label" style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>
                Current Gallery Photos ({data.gallery?.length || 0})
              </label>

              {(!data.gallery || data.gallery.length === 0) ? (
                <p className="admin-field__hint">
                  No custom photos uploaded yet. The 4 default gallery photos will be displayed on the website.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {data.gallery.map((photo, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#ffffff',
                      }}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || `Gallery ${idx + 1}`}
                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '0.75rem' }}>
                        <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                          <label style={{ fontSize: '0.75rem' }}>Caption (supports **bold**)</label>
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => updateGalleryCaption(idx, e.target.value)}
                            placeholder="e.g., Motor test bench with DSP controller"
                            className="admin-input"
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => setData({ ...data, gallery: moveItem(data.gallery || [], idx, 'up') })}
                              className="admin-btn-icon"
                              title="Move Up"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (data.gallery?.length || 1) - 1}
                              onClick={() =>
                                setData({ ...data, gallery: moveItem(data.gallery || [], idx, 'down') })
                              }
                              className="admin-btn-icon"
                              title="Move Down"
                            >
                              <ArrowDown size={13} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGalleryPhoto(idx)}
                            className="admin-btn-danger"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            <Trash2 size={13} /> Delete Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: Custom Sections */}
        {activeTab === 'custom-sections' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0b1e42' }}>
                  Dynamic Custom Sections ({(data.additionalSections || []).length})
                </h3>
                <p className="admin-field__hint" style={{ margin: 0 }}>
                  Add additional sections to the Advanced Electrical Lab page with custom titles, badges, narrative text, and checklists.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    additionalSections: [
                      ...(data.additionalSections || []),
                      {
                        id: `custom-sec-${Date.now()}`,
                        title: 'New Section Title',
                        badge: 'Special Initiative',
                        paragraphs: [''],
                        bulletPoints: [''],
                      },
                    ],
                  })
                }
                className="admin-btn admin-btn--sm admin-btn--secondary"
              >
                <Plus size={14} /> Add Custom Section
              </button>
            </div>

            {(!data.additionalSections || data.additionalSections.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                <p style={{ color: '#64748b', margin: 0 }}>No custom sections added yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {data.additionalSections.map((sec, secIdx) => (
                  <div
                    key={sec.id || secIdx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '1.25rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '0.75rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#0b1e42' }}>Custom Section #{secIdx + 1}</span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          disabled={secIdx === 0}
                          onClick={() =>
                            setData({
                              ...data,
                              additionalSections: moveItem(data.additionalSections || [], secIdx, 'up'),
                            })
                          }
                          className="admin-btn-icon"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={secIdx === (data.additionalSections?.length || 1) - 1}
                          onClick={() =>
                            setData({
                              ...data,
                              additionalSections: moveItem(data.additionalSections || [], secIdx, 'down'),
                            })
                          }
                          className="admin-btn-icon"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setData({
                              ...data,
                              additionalSections: (data.additionalSections || []).filter((_, i) => i !== secIdx),
                            })
                          }
                          className="admin-btn-danger"
                        >
                          <Trash2 size={14} /> Remove Section
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="admin-field">
                        <label>Section Title</label>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const updated = [...(data.additionalSections || [])];
                            updated[secIdx] = { ...updated[secIdx], title: e.target.value };
                            setData({ ...data, additionalSections: updated });
                          }}
                          className="admin-input"
                          placeholder="e.g. Industry Collaborations"
                        />
                      </div>
                      <div className="admin-field">
                        <label>Section Badge</label>
                        <input
                          type="text"
                          value={sec.badge || ''}
                          onChange={(e) => {
                            const updated = [...(data.additionalSections || [])];
                            updated[secIdx] = { ...updated[secIdx], badge: e.target.value };
                            setData({ ...data, additionalSections: updated });
                          }}
                          className="admin-input"
                          placeholder="e.g. Special Initiative"
                        />
                      </div>
                    </div>

                    {/* Paragraphs */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label className="admin-label" style={{ margin: 0, fontSize: '0.85rem' }}>Paragraphs</label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(data.additionalSections || [])];
                            updated[secIdx] = {
                              ...updated[secIdx],
                              paragraphs: [...(updated[secIdx].paragraphs || []), ''],
                            };
                            setData({ ...data, additionalSections: updated });
                          }}
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                        >
                          <Plus size={13} /> Add Paragraph
                        </button>
                      </div>
                      {(sec.paragraphs || []).map((p, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                          <textarea
                            rows={2}
                            value={p}
                            onChange={(e) => {
                              const updated = [...(data.additionalSections || [])];
                              const newParas = [...(updated[secIdx].paragraphs || [])];
                              newParas[pIdx] = e.target.value;
                              updated[secIdx] = { ...updated[secIdx], paragraphs: newParas };
                              setData({ ...data, additionalSections: updated });
                            }}
                            className="admin-textarea"
                            placeholder="Enter paragraph text..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(data.additionalSections || [])];
                              updated[secIdx] = {
                                ...updated[secIdx],
                                paragraphs: (updated[secIdx].paragraphs || []).filter((_, i) => i !== pIdx),
                              };
                              setData({ ...data, additionalSections: updated });
                            }}
                            className="admin-btn-danger"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Bullet Points */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label className="admin-label" style={{ margin: 0, fontSize: '0.85rem' }}>Checklist Bullet Points</label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(data.additionalSections || [])];
                            updated[secIdx] = {
                              ...updated[secIdx],
                              bulletPoints: [...(updated[secIdx].bulletPoints || []), ''],
                            };
                            setData({ ...data, additionalSections: updated });
                          }}
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                        >
                          <Plus size={13} /> Add Point
                        </button>
                      </div>
                      {(sec.bulletPoints || []).map((bp, bpIdx) => (
                        <div key={bpIdx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                          <input
                            type="text"
                            value={bp}
                            onChange={(e) => {
                              const updated = [...(data.additionalSections || [])];
                              const newPts = [...(updated[secIdx].bulletPoints || [])];
                              newPts[bpIdx] = e.target.value;
                              updated[secIdx] = { ...updated[secIdx], bulletPoints: newPts };
                              setData({ ...data, additionalSections: updated });
                            }}
                            className="admin-input"
                            placeholder="Enter bullet point..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(data.additionalSections || [])];
                              updated[secIdx] = {
                                ...updated[secIdx],
                                bulletPoints: (updated[secIdx].bulletPoints || []).filter((_, i) => i !== bpIdx),
                              };
                              setData({ ...data, additionalSections: updated });
                            }}
                            className="admin-btn-danger"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
