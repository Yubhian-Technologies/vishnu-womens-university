import { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  Leaf,
  BookOpen,
  Layers,
  Sparkles,
  Wrench,
  Award,
} from 'lucide-react';
import { doc } from 'firebase/firestore';
import { setDoc } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { ruralWomenTechPark, type RwtpIntervention, type RwtpActivity } from '../../Differentiators/ruralWomenTechPark.data';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export type RuralWomenTechParkDoc = typeof ruralWomenTechPark & {
  title?: string;
  subtitle?: string;
  aboutText?: string;
  highlights?: string[];
  facilities?: { title: string; description: string }[];
  outcomes?: string;
  customSections?: CustomSection[];
};

export const defaultRwtpHighlights = [
  'Supported by Department of Science & Technology (DST), Govt. of India',
  'Extensive training network covering over 1200+ rural women across Bhimavaram region',
  'Established self-sustaining micro-enterprises in bakeries, tailoring, and eco-friendly products',
  'Focus on waste paper recycling and indigenous virgin coconut oil processing',
];

export const defaultRwtpFacilities = [
  {
    title: 'Food Processing & Baking Lab',
    description: 'Commercial ovens, dough mixers, biomass dryers, and icing workstations.',
  },
  {
    title: 'CAD Tailoring & Embroidery Unit',
    description: 'Computerized stitching machines, handlooms, and pattern drafting software.',
  },
];

export const defaultRwtpOutcomes =
  'Over 1400+ rural women and self-help group members have gained sustainable livelihoods, technical independence, and financial inclusion through the technology park initiatives.';

export default function RuralWomenTechParkContentAdmin() {
  const { data: remoteData, loading } = useDocument<RuralWomenTechParkDoc>('settings', 'ruralWomenTechPark');
  const [data, setData] = useState<RuralWomenTechParkDoc>({
    ...ruralWomenTechPark,
    title: 'Rural Women Technology Park – WTP',
    subtitle: 'Empowering rural women through skill development, technology adoption and innovation to create sustainable livelihoods and stronger, self-reliant communities.',
    aboutText: `The programme empowers lifelong development access to labs, responsibilities, and the use of technology in rural communities, financial services at the households leverages indigenous resources for socio-economic impact across the domains of healthcare, education, livelihood, and technology. Corporate Social Responsibility initiatives, women's health and nutrition, rural financial and value-added products, and modern village-making ideas.`,
    highlights: defaultRwtpHighlights,
    facilities: defaultRwtpFacilities,
    outcomes: defaultRwtpOutcomes,
    customSections: [],
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (remoteData) {
      setData({
        ...ruralWomenTechPark,
        ...remoteData,
        title: remoteData.title || 'Rural Women Technology Park – WTP',
        subtitle: remoteData.subtitle || 'Empowering rural women through skill development, technology adoption and innovation to create sustainable livelihoods and stronger, self-reliant communities.',
        aboutText: remoteData.aboutText || `The programme empowers lifelong development access to labs, responsibilities, and the use of technology in rural communities, financial services at the households leverages indigenous resources for socio-economic impact across the domains of healthcare, education, livelihood, and technology. Corporate Social Responsibility initiatives, women's health and nutrition, rural financial and value-added products, and modern village-making ideas.`,
        paragraphs: remoteData.paragraphs || ruralWomenTechPark.paragraphs,
        interventionsHeading: remoteData.interventionsHeading || ruralWomenTechPark.interventionsHeading,
        interventions: remoteData.interventions || ruralWomenTechPark.interventions,
        activitiesHeading: remoteData.activitiesHeading || ruralWomenTechPark.activitiesHeading,
        activitiesTotalBeneficiaries: remoteData.activitiesTotalBeneficiaries || ruralWomenTechPark.activitiesTotalBeneficiaries,
        activities: remoteData.activities || ruralWomenTechPark.activities,
        highlights: remoteData.highlights || defaultRwtpHighlights,
        facilities: remoteData.facilities || defaultRwtpFacilities,
        outcomes: remoteData.outcomes || defaultRwtpOutcomes,
        customSections: remoteData.customSections || [],
      });
    }
  }, [remoteData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'ruralWomenTechPark'), data, { merge: true });
      try {
        await setDoc(doc(db, 'differentiators', 'rural-women-tech-park'), {
          title: data.title,
          summary: data.subtitle,
          desc: data.aboutText,
          customSections: data.customSections || [],
        }, { merge: true });
      } catch (e) {
        // Ignored if differentiator doc key doesn't exist
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save RWTP content:', err);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all Rural Women Technology Park content to default settings?')) {
      setData({
        ...ruralWomenTechPark,
        title: 'Rural Women Technology Park – WTP',
        subtitle: 'Empowering rural women through skill development, technology adoption and innovation to create sustainable livelihoods and stronger, self-reliant communities.',
        aboutText: `The programme empowers lifelong development access to labs, responsibilities, and the use of technology in rural communities, financial services at the households leverages indigenous resources for socio-economic impact across the domains of healthcare, education, livelihood, and technology. Corporate Social Responsibility initiatives, women's health and nutrition, rural financial and value-added products, and modern village-making ideas.`,
        highlights: defaultRwtpHighlights,
        facilities: defaultRwtpFacilities,
        outcomes: defaultRwtpOutcomes,
        customSections: [],
      });
    }
  };

  // Upload handlers for Custom Sections
  const handleCustomSectionFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
      })),
    }));
  };

  const handleCustomSectionFileRemoved = async (sectionPath: number[], fileIndex: number) => {
    const file = getAtPath(data.customSections || [], sectionPath)?.files?.[fileIndex];
    if (!file) return;
    if (file.fileUrl && !confirm('Remove this file? This cannot be undone.')) return;
    try {
      if (file.storagePath) await deleteFile(file.storagePath);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        files: (s.files || []).filter((_, i) => i !== fileIndex),
      })),
    }));
  };

  const handleCustomSectionPhotoUploaded = (sectionPath: number[], r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        photo: { imageUrl: r.url, storagePath: r.path },
      })),
    }));
  };

  const handleCustomSectionPhotoRemoved = async (sectionPath: number[]) => {
    const photo = getAtPath(data.customSections || [], sectionPath)?.photo;
    if (!photo?.imageUrl) return;
    if (!confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => {
        const next = { ...s };
        delete next.photo;
        return next;
      }),
    }));
  };

  const handleCustomSectionGalleryPhotoUploaded = (sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph)),
      })),
    }));
  };

  const handleCustomSectionGalleryPhotoRemoved = async (sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath(data.customSections || [], sectionPath)?.galleryPhotos?.[photoIndex];
    if (!photo) return;
    if (photo.imageUrl && !confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
      })),
    }));
  };

  if (loading) {
    return <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading Rural Women Technology Park content editor...</div>;
  }

  return (
    <div className="admin-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Sticky Header Bar */}
      <div className="admin-card" style={{ position: 'sticky', top: '0.5rem', zIndex: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Unified Differentiator Page Editor
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>Rural Women Technology Park (RWTP) Page Editor</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Single unified page editor in <strong>exact top-to-bottom layout order</strong> as displayed on the live public site.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleReset}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn--primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div style={{ marginTop: '0.75rem', padding: '0.65rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontSize: '0.85rem' }}>
            <CheckCircle size={16} color="#059669" />
            <span>Rural Women Technology Park content successfully saved and published live!</span>
          </div>
        )}
      </div>

      {/* SECTION 1: HERO BANNER & ABOUT WTP */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #15803d', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf size={18} color="#15803d" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            1. Hero Banner & About WTP
          </h3>
        </div>

        <div className="admin-field">
          <label className="admin-label">Hero Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="admin-input"
            style={{ fontWeight: 700 }}
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">Hero Subtitle / Tagline</label>
          <textarea
            rows={2}
            value={data.subtitle || ''}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            className="admin-textarea"
          />
        </div>

        <div className="admin-field">
          <label className="admin-label">About WTP Description Text</label>
          <textarea
            rows={4}
            value={data.aboutText || ''}
            onChange={(e) => setData({ ...data, aboutText: e.target.value })}
            className="admin-textarea"
          />
        </div>
      </div>

      {/* SECTION 2: STEP 01 — INTRODUCTION & KEY INTERVENTIONS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #15803d', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="#15803d" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            2. Step 01: Introduction & Key Interventions
          </h3>
        </div>

        {/* Overview Paragraphs */}
        <div className="admin-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="admin-label" style={{ margin: 0 }}>Context & Overview Paragraphs</label>
            <button
              type="button"
              onClick={() => setData({ ...data, paragraphs: [...(data.paragraphs || []), ''] })}
              className="admin-btn admin-btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(data.paragraphs || []).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginTop: '0.5rem', width: '25px' }}>P{idx + 1}</span>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const next = [...(data.paragraphs || [])];
                    next[idx] = e.target.value;
                    setData({ ...data, paragraphs: next });
                  }}
                  className="admin-textarea"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = (data.paragraphs || []).filter((_, i) => i !== idx);
                    setData({ ...data, paragraphs: next });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.6rem 0.75rem' }}
                  title="Delete paragraph"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interventions Section Heading */}
        <div className="admin-field" style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <label className="admin-label">Interventions Section Heading</label>
          <input
            type="text"
            value={data.interventionsHeading || ''}
            onChange={(e) => setData({ ...data, interventionsHeading: e.target.value })}
            className="admin-input"
            style={{ maxWidth: '500px' }}
          />
        </div>

        {/* Interventions Cards */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
            Key Interventions ({ (data.interventions || []).length })
          </h4>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                interventions: [
                  ...(data.interventions || []),
                  { title: 'New Intervention', paragraphs: [''] },
                ],
              })
            }
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Plus size={14} /> Add Intervention
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(data.interventions || []).map((item, idx) => (
            <div key={idx} style={{ padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Intervention #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = (data.interventions || []).filter((_, i) => i !== idx);
                    setData({ ...data, interventions: next });
                  }}
                  className="admin-btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>

              <div className="admin-field">
                <label className="admin-label">Intervention Title</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const next = [...(data.interventions || [])];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, interventions: next });
                  }}
                  className="admin-input"
                  style={{ fontWeight: 600 }}
                />
              </div>

              <div className="admin-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Paragraphs</label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...(data.interventions || [])];
                      next[idx] = { ...next[idx], paragraphs: [...next[idx].paragraphs, ''] };
                      setData({ ...data, interventions: next });
                    }}
                    className="admin-btn admin-btn--secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    <Plus size={12} /> Add Paragraph
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {item.paragraphs.map((p, pIdx) => (
                    <div key={pIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <textarea
                        rows={2}
                        value={p}
                        onChange={(e) => {
                          const next = [...(data.interventions || [])];
                          const nextParas = [...next[idx].paragraphs];
                          nextParas[pIdx] = e.target.value;
                          next[idx] = { ...next[idx], paragraphs: nextParas };
                          setData({ ...data, interventions: next });
                        }}
                        className="admin-textarea"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...(data.interventions || [])];
                          const nextParas = next[idx].paragraphs.filter((_, i) => i !== pIdx);
                          next[idx] = { ...next[idx], paragraphs: nextParas };
                          setData({ ...data, interventions: next });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.5rem 0.6rem' }}
                        title="Delete paragraph"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: STEP 02 — WORKING ACTIVITIES & IMPACT METRICS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #15803d', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="#15803d" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            3. Step 02: Working Activities & Impact Metrics
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className="admin-field">
            <label className="admin-label">Activities Section Heading</label>
            <input
              type="text"
              value={data.activitiesHeading || ''}
              onChange={(e) => setData({ ...data, activitiesHeading: e.target.value })}
              className="admin-input"
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Total Rural Beneficiaries Number Badge</label>
            <input
              type="text"
              value={data.activitiesTotalBeneficiaries || ''}
              onChange={(e) => setData({ ...data, activitiesTotalBeneficiaries: e.target.value })}
              placeholder="e.g. 1421"
              className="admin-input"
              style={{ fontWeight: 700 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
            Training Activity Breakdown Rows ({ (data.activities || []).length })
          </h4>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                activities: [
                  ...(data.activities || []),
                  { activity: 'New Training Activity', trainings: '10', beneficiaries: '50', shgs: '5' },
                ],
              })
            }
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Plus size={14} /> Add Activity Row
          </button>
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem' }}>Training Activity</th>
                <th style={{ padding: '0.75rem 1rem', width: '120px' }}>No. of Trainings</th>
                <th style={{ padding: '0.75rem 1rem', width: '120px' }}>Beneficiaries</th>
                <th style={{ padding: '0.75rem 1rem', width: '120px' }}>SHGs Covered</th>
                <th style={{ padding: '0.75rem 1rem', width: '60px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ background: '#ffffff' }}>
              {(data.activities || []).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <input
                      type="text"
                      value={row.activity}
                      onChange={(e) => {
                        const next = [...(data.activities || [])];
                        next[idx] = { ...next[idx], activity: e.target.value };
                        setData({ ...data, activities: next });
                      }}
                      className="admin-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <input
                      type="text"
                      value={row.trainings}
                      onChange={(e) => {
                        const next = [...(data.activities || [])];
                        next[idx] = { ...next[idx], trainings: e.target.value };
                        setData({ ...data, activities: next });
                      }}
                      className="admin-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <input
                      type="text"
                      value={row.beneficiaries}
                      onChange={(e) => {
                        const next = [...(data.activities || [])];
                        next[idx] = { ...next[idx], beneficiaries: e.target.value };
                        setData({ ...data, activities: next });
                      }}
                      className="admin-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <input
                      type="text"
                      value={row.shgs}
                      onChange={(e) => {
                        const next = [...(data.activities || [])];
                        next[idx] = { ...next[idx], shgs: e.target.value };
                        setData({ ...data, activities: next });
                      }}
                      className="admin-input"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const next = (data.activities || []).filter((_, i) => i !== idx);
                        setData({ ...data, activities: next });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.35rem 0.5rem' }}
                      title="Delete row"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: STEP 03 — KEY HIGHLIGHTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #15803d', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#15803d" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            4. Step 03: Key Highlights
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="admin-label" style={{ margin: 0 }}>Highlights Bullet Points ({ (data.highlights || []).length })</label>
          <button
            type="button"
            onClick={() => setData({ ...data, highlights: [...(data.highlights || []), ''] })}
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Plus size={14} /> Add Highlight
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(data.highlights || []).map((h, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d', width: '25px' }}>#{idx + 1}</span>
              <input
                type="text"
                value={h}
                onChange={(e) => {
                  const next = [...(data.highlights || [])];
                  next[idx] = e.target.value;
                  setData({ ...data, highlights: next });
                }}
                className="admin-input"
                style={{ flex: 1 }}
                placeholder="Enter highlight point..."
              />
              <button
                type="button"
                onClick={() => {
                  const next = (data.highlights || []).filter((_, i) => i !== idx);
                  setData({ ...data, highlights: next });
                }}
                className="admin-btn-danger"
                style={{ padding: '0.45rem 0.6rem' }}
                title="Delete highlight"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: STEP 04 — FACILITIES & EQUIPMENT */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #15803d', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wrench size={18} color="#15803d" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            5. Step 04: Facilities & Equipment
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="admin-label" style={{ margin: 0 }}>Facilities List ({ (data.facilities || []).length })</label>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                facilities: [
                  ...(data.facilities || []),
                  { title: 'New Facility Name', description: 'Facility equipment and details' },
                ],
              })
            }
            className="admin-btn admin-btn--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Plus size={14} /> Add Facility
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {(data.facilities || []).map((fac, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#15803d', background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Facility #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = (data.facilities || []).filter((_, i) => i !== idx);
                    setData({ ...data, facilities: next });
                  }}
                  className="admin-btn-danger"
                  style={{ padding: '0.35rem 0.55rem' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <input
                type="text"
                value={fac.title}
                onChange={(e) => {
                  const next = [...(data.facilities || [])];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setData({ ...data, facilities: next });
                }}
                className="admin-input"
                style={{ fontWeight: 700 }}
                placeholder="Facility Title"
              />
              <textarea
                rows={2}
                value={fac.description}
                onChange={(e) => {
                  const next = [...(data.facilities || [])];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, facilities: next });
                }}
                className="admin-textarea"
                placeholder="Facility Description"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: STEP 05 — OUTCOMES & ACHIEVEMENTS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '2px solid #15803d', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} color="#15803d" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            6. Step 05: Outcomes & Achievements
          </h3>
        </div>

        <div className="admin-field">
          <label className="admin-label">Outcomes & Achievements Summary</label>
          <textarea
            rows={4}
            value={data.outcomes || ''}
            onChange={(e) => setData({ ...data, outcomes: e.target.value })}
            className="admin-textarea"
            placeholder="Enter outcomes and achievements summary text..."
          />
        </div>
      </div>

      {/* SECTION 7: ADDITIONAL CUSTOM SECTIONS */}
      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#0284c7" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            7. Custom Sections / Additional Content ({data.customSections?.length || 0})
          </h3>
        </div>
        <p className="admin-field__hint" style={{ margin: 0 }}>
          Add any additional custom sections needed — extra paragraphs, tables, checklists, photo galleries, file downloads, or contacts. Any custom section added here will automatically render on the Rural Women Technology Park page.
        </p>

        <CustomSectionEditor
          sections={data.customSections || []}
          onChange={(next) => setData((p) => ({ ...p, customSections: next }))}
          rootSections={data.customSections || []}
          parentPath={[]}
          onFileUploaded={handleCustomSectionFileUploaded}
          onFileRemoved={handleCustomSectionFileRemoved}
          onPhotoUploaded={handleCustomSectionPhotoUploaded}
          onPhotoRemoved={handleCustomSectionPhotoRemoved}
          onGalleryPhotoUploaded={handleCustomSectionGalleryPhotoUploaded}
          onGalleryPhotoRemoved={handleCustomSectionGalleryPhotoRemoved}
          showPlacementToggle
        />
      </div>

      {/* Bottom Save Bar */}
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          onClick={handleReset}
          className="admin-btn admin-btn--secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RotateCcw size={14} /> Reset Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
