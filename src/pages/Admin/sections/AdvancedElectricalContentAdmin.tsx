import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { Plus, Trash2, Save, RotateCcw, Sparkles, BookOpen, Award, Layers, Wrench, ShieldCheck } from 'lucide-react';

export interface AdvancedElectricalDoc {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  focusAreas: string[];
  patents: Array<{
    title: string;
    status: string;
    inventor: string;
    domain: string;
  }>;
  workingModels: Array<{
    title: string;
    description: string;
    tag: string;
  }>;
  highlightsList: string[];
  facilitiesList: string[];
}

export const defaultAdvancedElectrical: AdvancedElectricalDoc = {
  heroTitle: 'Advanced Electrical R&D Laboratory',
  heroSubtitle: 'Transforming theoretical electrical knowledge into ground-breaking patents, power-electronics working models, and electric vehicle innovation.',
  aboutText: 'The Advanced Electrical R&D Laboratory at SVECW fosters cutting-edge research, hands-on experimentation, and technological innovation in power systems, electric vehicles, embedded control, and renewable energy.',
  focusAreas: [
    'Power Electronics & Converters',
    'Electric Drives & Motor Control (BLDC, PMSM, SRM)',
    'FPGA & DSP Real-Time Control Systems',
    'Renewable Energy Integration & Solar MPPT Hardware',
    'Assistive Electromechanical Devices & Biomedical Tools',
    'Cyber-Physical Power Systems & Microgrids',
  ],
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
  highlightsList: [
    'Vision of excellence in Power Electronics, Electric Drives, Embedded Control, and Renewable Technologies.',
    '9 operational working models — spanning EV drive controllers, solar systems, and assistive medical devices.',
    '3 Patents granted, including a Braille-character printer, dental dispenser, and EV motor drive testing apparatus.',
    'Advanced focus areas: FPGA/DSP motor control, control & automation, inverters & converters, solar PV, and cyber-physical systems.',
    'Continuous research projects successfully delivered annually from 2015-16 through 2021-22 and beyond.',
    'Directly aligned with national Atmanirbhar Bharat and Make in India innovation missions.',
  ],
  facilitiesList: [
    '9 operational working models, including a Smart Solar Aerator System, PLC Automation Trainer Kit, and Hybrid EV Charging System.',
    'FPGA and DSP-based high-performance motor control test benches with real-time feedback loops.',
    'Solar PV MPPT testing array and wind turbine emulation hardware setup.',
    'Precision digital storage oscilloscopes, power quality analyzers, and embedded microcontroller testbeds.',
  ],
};

export default function AdvancedElectricalContentAdmin() {
  const [data, setData] = useState<AdvancedElectricalDoc>(defaultAdvancedElectrical);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'patents' | 'models' | 'highlights' | 'facilities'>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'advancedElectricalLab'));
        if (snap.exists()) {
          const remote = snap.data() as Partial<AdvancedElectricalDoc>;
          setData({
            ...defaultAdvancedElectrical,
            ...remote,
            focusAreas: remote.focusAreas || defaultAdvancedElectrical.focusAreas,
            patents: remote.patents || defaultAdvancedElectrical.patents,
            workingModels: remote.workingModels || defaultAdvancedElectrical.workingModels,
            highlightsList: remote.highlightsList || defaultAdvancedElectrical.highlightsList,
            facilitiesList: remote.facilitiesList || defaultAdvancedElectrical.facilitiesList,
          });
        }
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
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save Advanced Electrical Lab data:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all content to original defaults?')) {
      setData(defaultAdvancedElectrical);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Advanced Electrical Lab Content Editor...</p>;
  }

  return (
    <div className="admin-section">
      <div className="admin-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#c8a03c" />
              <h2 className="admin-card__title" style={{ margin: 0, padding: 0, border: 'none' }}>
                Advanced Electrical R&D Lab Content Editor
              </h2>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Edit overview, focus areas, 3 granted patents, 9 working models, key highlights and facilities.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleReset} className="admin-btn admin-btn--sm admin-btn--ghost">
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="admin-btn admin-btn--sm admin-btn--primary">
              <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span>Advanced Electrical Lab content successfully saved and published live!</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'overview', label: 'Overview & Focus Areas', icon: BookOpen },
            { id: 'patents', label: `Patents Granted (${data.patents.length})`, icon: ShieldCheck },
            { id: 'models', label: `Working Models (${data.workingModels.length})`, icon: Wrench },
            { id: 'highlights', label: 'Key Highlights', icon: Award },
            { id: 'facilities', label: 'Facilities', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`admin-btn admin-btn--sm ${isActive ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  <input
                    type="text"
                    value={data.heroSubtitle}
                    onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Mission & Overview Text</label>
                <textarea
                  rows={3}
                  value={data.aboutText}
                  onChange={(e) => setData({ ...data, aboutText: e.target.value })}
                  className="admin-textarea"
                />
              </div>

              {/* Focus Areas */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Core Focus Areas</label>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, focusAreas: [...data.focusAreas, ''] })}
                    className="admin-btn admin-btn--sm admin-btn--secondary"
                  >
                    <Plus size={14} /> Add Focus Area
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem' }}>
                  {data.focusAreas.map((area, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => {
                          const updated = [...data.focusAreas];
                          updated[idx] = e.target.value;
                          setData({ ...data, focusAreas: updated });
                        }}
                        className="admin-input"
                      />
                      <button
                        type="button"
                        onClick={() => setData({ ...data, focusAreas: data.focusAreas.filter((_, i) => i !== idx) })}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Patents */}
          {activeTab === 'patents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Patents Granted</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      patents: [
                        ...data.patents,
                        { title: 'New Patent Title', status: 'Patent Granted', inventor: 'Dr. J. Rohith Balaji', domain: 'Engineering Domain' },
                      ],
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Patent
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.patents.map((pat, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
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
                        <label>Status</label>
                        <input
                          type="text"
                          value={pat.status}
                          onChange={(e) => {
                            const updated = [...data.patents];
                            updated[idx] = { ...updated[idx], status: e.target.value };
                            setData({ ...data, patents: updated });
                          }}
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-field">
                        <label>Inventor</label>
                        <input
                          type="text"
                          value={pat.inventor}
                          onChange={(e) => {
                            const updated = [...data.patents];
                            updated[idx] = { ...updated[idx], inventor: e.target.value };
                            setData({ ...data, patents: updated });
                          }}
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-field">
                        <label>Domain</label>
                        <input
                          type="text"
                          value={pat.domain}
                          onChange={(e) => {
                            const updated = [...data.patents];
                            updated[idx] = { ...updated[idx], domain: e.target.value };
                            setData({ ...data, patents: updated });
                          }}
                          className="admin-input"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, patents: data.patents.filter((_, i) => i !== idx) })}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} /> Remove Patent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Working Models */}
          {activeTab === 'models' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Working Models (Prototypes)</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      workingModels: [
                        ...data.workingModels,
                        { title: 'Model Title', description: 'Model Description', tag: 'Domain Tag' },
                      ],
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Model
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
                {data.workingModels.map((m, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={m.tag}
                        onChange={(e) => {
                          const updated = [...data.workingModels];
                          updated[idx] = { ...updated[idx], tag: e.target.value };
                          setData({ ...data, workingModels: updated });
                        }}
                        className="admin-input"
                        style={{ maxWidth: '180px', fontWeight: 600, color: '#b45309' }}
                        placeholder="Tag"
                      />
                      <button
                        type="button"
                        onClick={() => setData({ ...data, workingModels: data.workingModels.filter((_, i) => i !== idx) })}
                        className="admin-btn-danger"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
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
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Highlights */}
          {activeTab === 'highlights' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Key Highlights</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, highlightsList: [...data.highlightsList, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Highlight
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.highlightsList.map((hl, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const updated = [...data.highlightsList];
                        updated[idx] = e.target.value;
                        setData({ ...data, highlightsList: updated });
                      }}
                      className="admin-input"
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, highlightsList: data.highlightsList.filter((_, i) => i !== idx) })}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Facilities */}
          {activeTab === 'facilities' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Facilities & Equipment</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, facilitiesList: [...data.facilitiesList, ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Facility
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.facilitiesList.map((fac, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={fac}
                      onChange={(e) => {
                        const updated = [...data.facilitiesList];
                        updated[idx] = e.target.value;
                        setData({ ...data, facilitiesList: updated });
                      }}
                      className="admin-input"
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, facilitiesList: data.facilitiesList.filter((_, i) => i !== idx) })}
                      className="admin-btn-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
