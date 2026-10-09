import { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  Sparkles,
  Users,
  School,
  Layers,
  BookOpen,
  Award,
  Calendar,
  Star,
  FileCheck,
  Rocket,
  FileText,
  GripVertical,
  ExternalLink,
} from 'lucide-react';
import { doc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { setDoc, addDoc, deleteDoc, updateDoc, writeBatch } from '../../../lib/auditLog';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import FileUploader from '../../../components/FileUploader/FileUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { institutionInnovationCell } from '../../Differentiators/institutionInnovationCell.data';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';

export type IicDoc = typeof institutionInnovationCell & {
  customSections?: CustomSection[];
};

interface IicDocEntryDoc extends WithId {
  label: string;
  fileUrl: string;
  storagePath: string;
  order: number;
}

export interface IicCouncilMemberDoc extends WithId {
  name: string;
  role: string;
  tier: 'chairman' | 'leadership' | 'coordinator';
  imageUrl: string;
  storagePath: string;
  order: number;
}

const COUNCIL_TIERS: { value: IicCouncilMemberDoc['tier']; label: string }[] = [
  { value: 'chairman', label: 'Chairman' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'coordinator', label: 'Coordinator' },
];

/**
 * Reusable embedded PDF document uploader & manager for IIC sections
 */
function EmbeddedDocumentListEditor({
  title,
  helpText,
  collectionName,
  storageFolder,
  placeholder = 'e.g. Report / Certificate Name',
}: {
  title: string;
  helpText: string;
  collectionName: string;
  storageFolder: string;
  placeholder?: string;
}) {
  const { docs: entries, loading } = useOrderedCollection<IicDocEntryDoc>(collectionName, 'order');
  const [newLabel, setNewLabel] = useState('');
  const [newFile, setNewFile] = useState<UploadResult | null>(null);
  const [adding, setAdding] = useState(false);

  const addEntry = async () => {
    if (!newLabel.trim() || !newFile) return alert('Please enter a label and upload a PDF first.');
    setAdding(true);
    try {
      await addDoc(collection(db, collectionName), {
        label: newLabel.trim(),
        fileUrl: newFile.url,
        storagePath: newFile.path,
        order: entries.length + 1,
        createdAt: serverTimestamp(),
      });
      setNewLabel('');
      setNewFile(null);
    } catch (e) {
      alert(`Couldn't add document: ${(e as Error).message}`);
    } finally {
      setAdding(false);
    }
  };

  const removeEntry = async (entry: IicDocEntryDoc) => {
    if (!confirm(`Delete "${entry.label}"?`)) return;
    try {
      if (entry.storagePath) await deleteFile(entry.storagePath);
      await deleteDoc(doc(db, collectionName, entry.id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginTop: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={16} color="#0284c7" />
          {title} ({entries.length})
        </h4>
      </div>
      <p className="admin-field__hint" style={{ margin: '0 0 0.85rem' }}>{helpText}</p>

      {loading ? (
        <p className="admin-loading" style={{ margin: '0.5rem 0' }}>Loading documents…</p>
      ) : (
        <>
          <div className="admin-table-wrap" style={{ marginBottom: '1rem' }}>
            <table className="admin-table" style={{ background: '#fff' }}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th>Document Label</th>
                  <th style={{ width: '130px' }}>PDF File</th>
                  <th style={{ width: '90px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.order}</td>
                    <td style={{ fontWeight: 600 }}>{e.label}</td>
                    <td>
                      {e.fileUrl ? (
                        <a
                          href={e.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#0284c7', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                        >
                          View PDF <ExternalLink size={12} />
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm admin-btn--danger"
                        onClick={() => removeEntry(e)}
                        style={{ padding: '0.25rem 0.6rem' }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-empty" style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                      No documents added to this section yet. Use the upload box below to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add New Document Form */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1.2fr) auto', gap: '0.75rem', alignItems: 'flex-end', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.75rem' }}>
            <div className="admin-field" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Document Label *</label>
              <input
                type="text"
                className="admin-input"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={placeholder}
              />
            </div>
            <div className="admin-field" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Upload PDF *</label>
              <FileUploader folder={storageFolder} currentUrl={newFile?.url} onUploaded={setNewFile} label="Select PDF File" />
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={addEntry}
              disabled={adding}
              style={{ height: '38px', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={15} /> {adding ? 'Adding…' : 'Add PDF'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Integrated Council Members Roster Manager for Tab 2
 */
function EmbeddedCouncilMembersManager() {
  const { docs: members, loading } = useOrderedCollection<IicCouncilMemberDoc>('iicCouncilMembers', 'order');
  const [form, setForm] = useState<Omit<IicCouncilMemberDoc, 'id' | 'order'>>({
    name: '',
    role: '',
    tier: 'coordinator',
    imageUrl: '',
    storagePath: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [groupedOrdered, setGroupedOrdered] = useState<Record<string, IicCouncilMemberDoc[]>>({});
  const [drag, setDrag] = useState<{ tier: string; index: number } | null>(null);

  useEffect(() => {
    const groups: Record<string, IicCouncilMemberDoc[]> = {};
    members.forEach((m) => {
      (groups[m.tier] ??= []).push(m);
    });
    setGroupedOrdered(groups);
  }, [members]);

  const handleDragOver = (tier: string, i: number) => {
    if (!drag || drag.tier !== tier || drag.index === i) return;
    setGroupedOrdered((prev) => {
      const list = [...(prev[tier] || [])];
      const [moved] = list.splice(drag.index, 1);
      list.splice(i, 0, moved);
      return { ...prev, [tier]: list };
    });
    setDrag({ tier, index: i });
  };

  const handleDrop = async (tier: string) => {
    setDrag(null);
    const list = groupedOrdered[tier] || [];
    const batch = writeBatch(db);
    let changed = false;
    list.forEach((m, i) => {
      if (m.order !== i) {
        batch.update(doc(db, 'iicCouncilMembers', m.id), { order: i });
        changed = true;
      }
    });
    if (changed) {
      try {
        await batch.commit();
      } catch (e) {
        alert(`Couldn't save order: ${(e as Error).message}`);
      }
    }
  };

  const saveMember = async () => {
    if (!form.name.trim()) return alert('Name is required.');
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'iicCouncilMembers', editingId), { ...form, name: form.name.trim(), role: form.role.trim() });
      } else {
        const order = (groupedOrdered[form.tier] || []).length;
        await addDoc(collection(db, 'iicCouncilMembers'), {
          ...form,
          name: form.name.trim(),
          role: form.role.trim(),
          order,
          createdAt: serverTimestamp(),
        });
      }
      setForm({ name: '', role: '', tier: 'coordinator', imageUrl: '', storagePath: '' });
      setEditingId(null);
    } catch (e) {
      alert(`Couldn't save member: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (m: IicCouncilMemberDoc) => {
    if (!confirm(`Remove "${m.name}" (${m.role}) from the council?`)) return;
    try {
      await deleteDoc(doc(db, 'iicCouncilMembers', m.id));
      if (m.storagePath) await deleteFile(m.storagePath);
    } catch (e) {
      alert(`Couldn't delete member: ${(e as Error).message}`);
    }
  };

  const seedFromLegacyRoster = async () => {
    setSeeding(true);
    try {
      const legacyPhotosSnap = await getDocs(collection(db, 'iicMemberPhotos'));
      const legacyPhotoMap = new Map(
        legacyPhotosSnap.docs.map((d) => [d.id, d.data() as { imageUrl?: string; storagePath?: string }])
      );
      const roster: { name: string; role: string; tier: IicCouncilMemberDoc['tier'] }[] = [
        { ...institutionInnovationCell.constitution.chairman, tier: 'chairman' },
        ...institutionInnovationCell.constitution.leadership.map((p) => ({ ...p, tier: 'leadership' as const })),
        ...institutionInnovationCell.constitution.coordinators.map((p) => ({ ...p, tier: 'coordinator' as const })),
      ];
      const tierOrder: Record<string, number> = {};
      for (const person of roster) {
        const order = tierOrder[person.tier] ?? 0;
        const photo = legacyPhotoMap.get(person.name);
        await addDoc(collection(db, 'iicCouncilMembers'), {
          name: person.name,
          role: person.role,
          tier: person.tier,
          imageUrl: photo?.imageUrl || '',
          storagePath: photo?.storagePath || '',
          order,
          createdAt: serverTimestamp(),
        });
        tierOrder[person.tier] = order + 1;
      }
    } catch (e) {
      alert(`Couldn't seed roster: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', marginTop: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Users size={18} color="#c8a03c" />
          Council Members Roster ({members.length} Members)
        </h4>
        {!loading && members.length === 0 && (
          <button type="button" className="admin-btn admin-btn--sm" onClick={seedFromLegacyRoster} disabled={seeding}>
            {seeding ? 'Seeding…' : 'Seed default 11 members from initial roster'}
          </button>
        )}
      </div>
      <p className="admin-field__hint" style={{ margin: '0 0 1rem' }}>
        Manage the Chairman, Leadership, and Coordinator members displayed in the IIC Council tier blocks on the website.
      </p>

      {/* Add / Edit Member Form */}
      <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
        <h5 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
          {editingId ? 'Edit Council Member' : 'Add New Council Member'}
        </h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          <div className="admin-field" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Name *</label>
            <input
              type="text"
              className="admin-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Dr. G. Srinivasa Rao"
            />
          </div>
          <div className="admin-field" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Role / Designation</label>
            <input
              type="text"
              className="admin-input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Head of the Institute (HOI)"
            />
          </div>
          <div className="admin-field" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Tier / Category</label>
            <select
              className="admin-input"
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value as any })}
            >
              {COUNCIL_TIERS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="admin-field" style={{ margin: 0 }}>
            <label style={{ fontSize: '0.8rem' }}>Member Photo</label>
            <ImageUploader
              folder="vwu/iic-members"
              currentUrl={form.imageUrl}
              onUploaded={(r) => setForm({ ...form, imageUrl: r.url, storagePath: r.path })}
              label="Upload Photo"
              aspect={1}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          {editingId && (
            <button
              type="button"
              className="admin-btn admin-btn--sm admin-btn--ghost"
              onClick={() => {
                setEditingId(null);
                setForm({ name: '', role: '', tier: 'coordinator', imageUrl: '', storagePath: '' });
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--primary"
            onClick={saveMember}
            disabled={saving}
          >
            {saving ? 'Saving…' : editingId ? 'Update Member' : '+ Add Member to Roster'}
          </button>
        </div>
      </div>

      {/* Grouped Tiers Table */}
      {loading ? (
        <p className="admin-loading">Loading council roster…</p>
      ) : (
        COUNCIL_TIERS.map((t) => {
          const list = groupedOrdered[t.value] || [];
          return (
            <div key={t.value} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>
                  {t.label} ({list.length})
                </span>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table" style={{ background: '#fff' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th style={{ width: '60px' }}>Order</th>
                      <th style={{ width: '60px' }}>Photo</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th style={{ width: '130px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((m, idx) => (
                      <tr
                        key={m.id}
                        draggable
                        onDragStart={() => setDrag({ tier: t.value, index: idx })}
                        onDragOver={(e) => {
                          e.preventDefault();
                          handleDragOver(t.value, idx);
                        }}
                        onDrop={() => handleDrop(t.value)}
                        onDragEnd={() => setDrag(null)}
                        style={{
                          opacity: drag?.tier === t.value && drag.index === idx ? 0.4 : 1,
                          cursor: 'grab',
                        }}
                      >
                        <td style={{ color: '#94a3b8', userSelect: 'none', textAlign: 'center' }}>
                          <GripVertical size={16} />
                        </td>
                        <td>{m.order + 1}</td>
                        <td>
                          {m.imageUrl ? (
                            <img
                              src={m.imageUrl}
                              alt={m.name}
                              style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                              👤
                            </div>
                          )}
                        </td>
                        <td style={{ fontWeight: 600 }}>{m.name}</td>
                        <td style={{ color: '#475569' }}>{m.role}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              className="admin-btn admin-btn--sm"
                              onClick={() => {
                                setEditingId(m.id);
                                setForm({
                                  name: m.name,
                                  role: m.role,
                                  tier: m.tier,
                                  imageUrl: m.imageUrl || '',
                                  storagePath: m.storagePath || '',
                                });
                              }}
                              style={{ padding: '0.2rem 0.5rem' }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn--sm admin-btn--danger"
                              onClick={() => removeMember(m)}
                              style={{ padding: '0.2rem 0.5rem' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {list.length === 0 && (
                      <tr>
                        <td colSpan={6} className="admin-empty" style={{ padding: '0.75rem', textAlign: 'center', color: '#64748b' }}>
                          No {t.label.toLowerCase()} members configured yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/**
 * Main unified Institution Innovation Cell (IIC) Page Admin Editor
 * Organised in the EXACT same top-to-bottom sequence as the public website page.
 */
export default function IicContentAdmin() {
  const { data: remoteData, loading } = useDocument<IicDoc>('settings', 'iicContent');
  const [data, setData] = useState<IicDoc>(institutionInnovationCell);
  const [activeTab, setActiveTab] = useState<
    | 'telemetry'
    | 'about'
    | 'constitution'
    | 'ambassadors'
    | 'activities'
    | 'rating'
    | 'annualReports'
    | 'sih'
    | 'nisp'
    | 'atlSchools'
    | 'customSections'
  >('telemetry');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (remoteData) {
      setData({
        ...institutionInnovationCell,
        ...remoteData,
        telemetry: {
          ...institutionInnovationCell.telemetry,
          ...(remoteData.telemetry || {}),
        },
        about: remoteData.about || institutionInnovationCell.about,
        vision: remoteData.vision || institutionInnovationCell.vision,
        mission: remoteData.mission || institutionInnovationCell.mission,
        journey: remoteData.journey || institutionInnovationCell.journey,
        constitution: {
          ...institutionInnovationCell.constitution,
          ...(remoteData.constitution || {}),
          chairman: remoteData.constitution?.chairman || institutionInnovationCell.constitution.chairman,
          leadership: remoteData.constitution?.leadership || institutionInnovationCell.constitution.leadership,
          coordinators: remoteData.constitution?.coordinators || institutionInnovationCell.constitution.coordinators,
        },
        ambassadors: {
          ...institutionInnovationCell.ambassadors,
          ...(remoteData.ambassadors || {}),
          roles: remoteData.ambassadors?.roles || institutionInnovationCell.ambassadors.roles,
        },
        activities: {
          ...institutionInnovationCell.activities,
          ...(remoteData.activities || {}),
          paragraphs: remoteData.activities?.paragraphs || institutionInnovationCell.activities.paragraphs,
        },
        supportsInnovation: {
          ...institutionInnovationCell.supportsInnovation,
          ...(remoteData.supportsInnovation || {}),
          items: remoteData.supportsInnovation?.items || institutionInnovationCell.supportsInnovation.items,
        },
        atalTinkeringSchools: {
          ...institutionInnovationCell.atalTinkeringSchools,
          ...(remoteData.atalTinkeringSchools || {}),
          paragraphs: remoteData.atalTinkeringSchools?.paragraphs || institutionInnovationCell.atalTinkeringSchools.paragraphs,
          schools: remoteData.atalTinkeringSchools?.schools || institutionInnovationCell.atalTinkeringSchools.schools,
        },
        nisp: { ...institutionInnovationCell.nisp, ...(remoteData.nisp || {}) },
        rating: { ...institutionInnovationCell.rating, ...(remoteData.rating || {}) },
        annualReports: { ...institutionInnovationCell.annualReports, ...(remoteData.annualReports || {}) },
        sih: { ...institutionInnovationCell.sih, ...(remoteData.sih || {}) },
        customSections: remoteData.customSections || [],
      });
    }
  }, [remoteData]);

  // Custom Sections upload / removal handlers
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
    if (!file?.fileUrl) return;
    if (!confirm('Remove this file? This cannot be undone.')) return;
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
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({ ...s, photo: undefined })),
    }));
  };

  const handleCustomSectionGalleryPhotoUploaded = (sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { ...ph, imageUrl: r.url, storagePath: r.path } : ph)),
      })),
    }));
  };

  const handleCustomSectionGalleryPhotoRemoved = async (sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath(data.customSections || [], sectionPath)?.galleryPhotos?.[photoIndex];
    if (!photo?.imageUrl) return;
    if (!confirm('Remove this gallery photo? This cannot be undone.')) return;
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

  const handleCustomSectionImageCardPhotoUploaded = (sectionPath: number[], cardIndex: number, r: UploadResult) => {
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        imageCards: (s.imageCards || []).map((c, i) => (i === cardIndex ? { ...c, imageUrl: r.url, storagePath: r.path } : c)),
      })),
    }));
  };

  const handleCustomSectionImageCardPhotoRemoved = async (sectionPath: number[], cardIndex: number) => {
    const card = getAtPath(data.customSections || [], sectionPath)?.imageCards?.[cardIndex];
    if (!card?.imageUrl) return;
    if (!confirm('Remove this image? This cannot be undone.')) return;
    try {
      if (card.storagePath) await deleteFile(card.storagePath);
    } catch (e) {
      alert(`Couldn't delete the image from storage: ${(e as Error).message}`);
      return;
    }
    setData((p) => ({
      ...p,
      customSections: replaceAtPath(p.customSections || [], sectionPath, (s) => ({
        ...s,
        imageCards: (s.imageCards || []).map((c, i) => (i === cardIndex ? { ...c, imageUrl: '', storagePath: '' } : c)),
      })),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'iicContent'), data, { merge: true });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save IIC content:', err);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default content? Any unsaved text changes in this panel will be lost.')) {
      setData(institutionInnovationCell);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading Institution Innovation Cell editor…</p>;
  }

  return (
    <div className="admin-section" style={{ padding: 0 }}>
      <div className="admin-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#c8a03c" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Institution's Innovation Council (IIC) — Unified Page Editor
              </h3>
            </div>
            <p className="admin-field__hint" style={{ margin: '0.35rem 0 0' }}>
              Manage all telemetry, content sections, council rosters, PDF documents, and custom sections in the exact order they appear on the public page.
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
            <CheckCircle size={16} color="#059669" />
            <span>IIC content saved successfully and published live!</span>
          </div>
        )}

        {/* Top-to-Bottom Section Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'telemetry', label: 'Top Telemetry Strip', icon: Star },
            { id: 'about', label: '1. About IIC & MoE Journey', icon: BookOpen },
            { id: 'constitution', label: '2. IIC Council', icon: Users },
            { id: 'ambassadors', label: '3. Innovation Ambassadors', icon: Award },
            { id: 'activities', label: '4. IIC Activities', icon: Calendar },
            { id: 'rating', label: '5. Recognition & Rating', icon: Star },
            { id: 'annualReports', label: '6. IIC Annual Reports', icon: FileCheck },
            { id: 'sih', label: '7. Smart India Hackathon', icon: Rocket },
            { id: 'nisp', label: '8. NISP Policy', icon: FileText },
            { id: 'atlSchools', label: `9. ATL School Mentorship (${data.atalTinkeringSchools?.schools?.length || 0})`, icon: School },
            { id: 'customSections', label: `10. Custom Sections (${data.customSections?.length || 0})`, icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`admin-btn admin-btn--sm ${isActive ? 'admin-btn--primary' : 'admin-btn--ghost'}`}
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem' }}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* SECTION 0: TELEMETRY STRIP (TOP OF PAGE) */}
        {activeTab === 'telemetry' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                MoE's Innovation Cell Telemetry Strip (4 Highlight Cards)
              </h4>
              <p className="admin-field__hint" style={{ margin: 0 }}>
                These 4 highlight metric cards appear right below the hero banner at the very top of the public IIC page.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* Card 1 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#c8a03c', letterSpacing: '0.05em' }}>Card 1 (Gold Star)</span>
                <div className="admin-field" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <label>Value</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.telemetry?.starsValue || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telemetry: { ...data.telemetry, starsValue: e.target.value } as any,
                      })
                    }
                  />
                </div>
                <div className="admin-field" style={{ margin: 0 }}>
                  <label>Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.telemetry?.starsLabel || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telemetry: { ...data.telemetry, starsLabel: e.target.value } as any,
                      })
                    }
                  />
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.05em' }}>Card 2 (Cyan Award)</span>
                <div className="admin-field" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <label>Value</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.telemetry?.rankValue || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telemetry: { ...data.telemetry, rankValue: e.target.value } as any,
                      })
                    }
                  />
                </div>
                <div className="admin-field" style={{ margin: 0 }}>
                  <label>Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.telemetry?.rankLabel || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telemetry: { ...data.telemetry, rankLabel: e.target.value } as any,
                      })
                    }
                  />
                </div>
              </div>

              {/* Card 3 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.05em' }}>Card 3 (Green Calendar)</span>
                <div className="admin-field" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <label>Value</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.telemetry?.yearValue || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telemetry: { ...data.telemetry, yearValue: e.target.value } as any,
                      })
                    }
                  />
                </div>
                <div className="admin-field" style={{ margin: 0 }}>
                  <label>Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.telemetry?.yearLabel || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telemetry: { ...data.telemetry, yearLabel: e.target.value } as any,
                      })
                    }
                  />
                </div>
              </div>

              {/* Card 4 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#9333ea', letterSpacing: '0.05em' }}>Card 4 (Purple Ecosystem)</span>
                <div className="admin-field" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <label>Value</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.telemetry?.tbiValue || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telemetry: { ...data.telemetry, tbiValue: e.target.value } as any,
                      })
                    }
                  />
                </div>
                <div className="admin-field" style={{ margin: 0 }}>
                  <label>Label</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.telemetry?.tbiLabel || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        telemetry: { ...data.telemetry, tbiLabel: e.target.value } as any,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: ABOUT IIC & MOE JOURNEY */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* About Card */}
            <div>
              <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
                <label>About Card Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.aboutTitle || ''}
                  onChange={(e) => setData({ ...data, aboutTitle: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>About Paragraphs</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, about: [...(data.about || []), ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(data.about || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const next = [...(data.about || [])];
                        next[idx] = e.target.value;
                        setData({ ...data, about: next });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (data.about || []).filter((_, i) => i !== idx);
                        setData({ ...data, about: next });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.5rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Card */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
                <label>Establishment Journey Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.journeyTitle || ''}
                  onChange={(e) => setData({ ...data, journeyTitle: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Journey Paragraphs</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, journey: [...(data.journey || []), ''] })}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.journey || []).map((j, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={j}
                      onChange={(e) => {
                        const next = [...(data.journey || [])];
                        next[idx] = e.target.value;
                        setData({ ...data, journey: next });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (data.journey || []).filter((_, i) => i !== idx);
                        setData({ ...data, journey: next });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.5rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision & Mission Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              {/* Vision */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Vision Checklist Points</label>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, vision: [...(data.vision || []), ''] })}
                    className="admin-btn admin-btn--sm admin-btn--secondary"
                  >
                    <Plus size={14} /> Add Point
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(data.vision || []).map((v, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={v}
                        onChange={(e) => {
                          const next = [...(data.vision || [])];
                          next[idx] = e.target.value;
                          setData({ ...data, vision: next });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (data.vision || []).filter((_, i) => i !== idx);
                          setData({ ...data, vision: next });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.5rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mission */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="admin-label" style={{ margin: 0 }}>Mission Checklist Points</label>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, mission: [...(data.mission || []), ''] })}
                    className="admin-btn admin-btn--sm admin-btn--secondary"
                  >
                    <Plus size={14} /> Add Point
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(data.mission || []).map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={m}
                        onChange={(e) => {
                          const next = [...(data.mission || [])];
                          next[idx] = e.target.value;
                          setData({ ...data, mission: next });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (data.mission || []).filter((_, i) => i !== idx);
                          setData({ ...data, mission: next });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.5rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* How the IIC Supports Innovation (Pillars) */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              <div className="admin-field" style={{ marginBottom: '0.75rem' }}>
                <label>Ecosystem Support Pillars Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.supportsInnovation?.title || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      supportsInnovation: { ...data.supportsInnovation, title: e.target.value },
                    })
                  }
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>
                  Support Pillars Cards ({data.supportsInnovation?.items?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      supportsInnovation: {
                        ...data.supportsInnovation,
                        items: [
                          ...(data.supportsInnovation?.items || []),
                          { title: '', description: '' },
                        ],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Pillar Card
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                {(data.supportsInnovation?.items || []).map((item, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="admin-field" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.8rem' }}>Pillar Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...(data.supportsInnovation?.items || [])];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setData({ ...data, supportsInnovation: { ...data.supportsInnovation, items: updated } });
                        }}
                      />
                    </div>
                    <div className="admin-field" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.8rem' }}>Description</label>
                      <textarea
                        rows={2}
                        className="admin-textarea"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...(data.supportsInnovation?.items || [])];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setData({ ...data, supportsInnovation: { ...data.supportsInnovation, items: updated } });
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.supportsInnovation?.items || []).filter((_, i) => i !== idx);
                          setData({ ...data, supportsInnovation: { ...data.supportsInnovation, items: updated } });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: IIC COUNCIL */}
        {activeTab === 'constitution' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Council Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.constitution?.title || ''}
                  onChange={(e) => setData({ ...data, constitution: { ...data.constitution, title: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Key Functionaries Sub-heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.constitution?.heading || ''}
                  onChange={(e) => setData({ ...data, constitution: { ...data.constitution, heading: e.target.value } })}
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Constitution Intro Text</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={data.constitution?.intro || ''}
                onChange={(e) => setData({ ...data, constitution: { ...data.constitution, intro: e.target.value } })}
              />
            </div>

            {/* Integrated Council Members Roster */}
            <EmbeddedCouncilMembersManager />

            {/* Official Council PDF Document */}
            <EmbeddedDocumentListEditor
              title="Official IIC Council PDF Document"
              helpText={'The "View IIC Council Members" PDF button displayed below the council roster on the public page.'}
              collectionName="iicCouncilMembersLinks"
              storageFolder="vwu/iic/council-members"
              placeholder="e.g. View IIC Council Members 2025–26"
            />
          </div>
        )}

        {/* SECTION 3: INNOVATION AMBASSADORS */}
        {activeTab === 'ambassadors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Ambassadors Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.ambassadors?.title || ''}
                  onChange={(e) => setData({ ...data, ambassadors: { ...data.ambassadors, title: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Roles Sub-heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.ambassadors?.rolesTitle || ''}
                  onChange={(e) => setData({ ...data, ambassadors: { ...data.ambassadors, rolesTitle: e.target.value } })}
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Introductory Paragraph</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={data.ambassadors?.intro || ''}
                onChange={(e) => setData({ ...data, ambassadors: { ...data.ambassadors, intro: e.target.value } })}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Ambassador Roles & Responsibilities</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      ambassadors: {
                        ...data.ambassadors,
                        roles: [...(data.ambassadors?.roles || []), ''],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.ambassadors?.roles || []).map((role, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={role}
                      onChange={(e) => {
                        const updated = [...(data.ambassadors?.roles || [])];
                        updated[idx] = e.target.value;
                        setData({ ...data, ambassadors: { ...data.ambassadors, roles: updated } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.ambassadors?.roles || []).filter((_, i) => i !== idx);
                        setData({ ...data, ambassadors: { ...data.ambassadors, roles: updated } });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.5rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Ambassador PDF Document Links */}
            <EmbeddedDocumentListEditor
              title="Innovation Ambassador Document Links"
              helpText="PDFs displayed under the Innovation Ambassadors tab on the public page."
              collectionName="iicInnovationAmbassadorLinks"
              storageFolder="vwu/iic/innovation-ambassadors"
              placeholder="e.g. Faculty Innovation Ambassadors List 2025–26"
            />
          </div>
        )}

        {/* SECTION 4: IIC ACTIVITIES */}
        {activeTab === 'activities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Activities Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.activities?.title || ''}
                  onChange={(e) => setData({ ...data, activities: { ...data.activities, title: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Activity Reports Sub-heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.activities?.subheading || ''}
                  onChange={(e) => setData({ ...data, activities: { ...data.activities, subheading: e.target.value } })}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Activities Paragraphs</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      activities: {
                        ...data.activities,
                        paragraphs: [...(data.activities?.paragraphs || []), ''],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.activities?.paragraphs || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const updated = [...(data.activities?.paragraphs || [])];
                        updated[idx] = e.target.value;
                        setData({ ...data, activities: { ...data.activities, paragraphs: updated } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.activities?.paragraphs || []).filter((_, i) => i !== idx);
                        setData({ ...data, activities: { ...data.activities, paragraphs: updated } });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.5rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Activity Reports PDFs */}
            <EmbeddedDocumentListEditor
              title="Activity Report PDFs"
              helpText="PDFs displayed under the IIC Activities tab, ordered by academic year."
              collectionName="iicActivities"
              storageFolder="vwu/iic/activities"
              placeholder="e.g. IIC Activity Report 2024–25"
            />
          </div>
        )}

        {/* SECTION 5: RECOGNITION & RATING */}
        {activeTab === 'rating' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.rating?.heading || ''}
                  onChange={(e) => setData({ ...data, rating: { ...data.rating, heading: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Section Subheading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.rating?.subheading || ''}
                  onChange={(e) => setData({ ...data, rating: { ...data.rating, subheading: e.target.value } })}
                />
              </div>
            </div>

            {/* Embedded Rating Certificates PDFs */}
            <EmbeddedDocumentListEditor
              title="Recognition & Rating Certificates PDFs"
              helpText="Certificates and appreciation letters displayed under the Recognition & Rating tab."
              collectionName="iicRatingCertificates"
              storageFolder="vwu/iic/rating-certificates"
              placeholder="e.g. IIC Star Rating Certificate 2023–24"
            />
          </div>
        )}

        {/* SECTION 6: IIC ANNUAL REPORTS */}
        {activeTab === 'annualReports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.annualReports?.heading || ''}
                  onChange={(e) => setData({ ...data, annualReports: { ...data.annualReports, heading: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Section Subheading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.annualReports?.subheading || ''}
                  onChange={(e) => setData({ ...data, annualReports: { ...data.annualReports, subheading: e.target.value } })}
                />
              </div>
            </div>

            {/* Embedded Annual Reports PDFs */}
            <EmbeddedDocumentListEditor
              title="IIC Annual Reports PDFs"
              helpText="Annual documentation PDFs displayed under the IIC Annual Reports tab."
              collectionName="iicAnnualReports"
              storageFolder="vwu/iic/annual-reports"
              placeholder="e.g. IIC Annual Report 2024–25"
            />
          </div>
        )}

        {/* SECTION 7: SMART INDIA HACKATHON (SIH) */}
        {activeTab === 'sih' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.sih?.heading || ''}
                  onChange={(e) => setData({ ...data, sih: { ...data.sih, heading: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Section Subheading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.sih?.subheading || ''}
                  onChange={(e) => setData({ ...data, sih: { ...data.sih, subheading: e.target.value } })}
                />
              </div>
            </div>

            {/* Embedded SIH Reports PDFs */}
            <EmbeddedDocumentListEditor
              title="SIH Internal Hackathon Report PDFs"
              helpText="Institutional reports displayed under the Smart India Hackathon tab."
              collectionName="iicSihHackathonReports"
              storageFolder="vwu/iic/sih-hackathon"
              placeholder="e.g. SIH 2024 Internal Hackathon Report"
            />
          </div>
        )}

        {/* SECTION 8: NISP POLICY */}
        {activeTab === 'nisp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.nisp?.heading || ''}
                  onChange={(e) => setData({ ...data, nisp: { ...data.nisp, heading: e.target.value } })}
                />
              </div>
              <div className="admin-field">
                <label>Section Subheading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.nisp?.subheading || ''}
                  onChange={(e) => setData({ ...data, nisp: { ...data.nisp, subheading: e.target.value } })}
                />
              </div>
            </div>

            {/* Embedded NISP Policy Table Documents */}
            <EmbeddedDocumentListEditor
              title="National Innovation & Start-up Policy (NISP) Documents"
              helpText="Policy document downloads displayed in the NISP Policy table on the public page."
              collectionName="iicNispPolicies"
              storageFolder="vwu/iic/nisp"
              placeholder="e.g. National Innovation & Start-Up Policy 2025"
            />
          </div>
        )}

        {/* SECTION 9: ATL SCHOOL MENTORSHIP */}
        {activeTab === 'atlSchools' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-field">
                <label>Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.atalTinkeringSchools?.title || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      atalTinkeringSchools: { ...data.atalTinkeringSchools, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="admin-field">
                <label>List Heading</label>
                <input
                  type="text"
                  className="admin-input"
                  value={data.atalTinkeringSchools?.listHeading || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      atalTinkeringSchools: { ...data.atalTinkeringSchools, listHeading: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="admin-label" style={{ margin: 0 }}>Mentorship Introductory Paragraphs</label>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      atalTinkeringSchools: {
                        ...data.atalTinkeringSchools,
                        paragraphs: [...(data.atalTinkeringSchools?.paragraphs || []), ''],
                      },
                    })
                  }
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(data.atalTinkeringSchools?.paragraphs || []).map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const updated = [...(data.atalTinkeringSchools?.paragraphs || [])];
                        updated[idx] = e.target.value;
                        setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, paragraphs: updated } });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (data.atalTinkeringSchools?.paragraphs || []).filter((_, i) => i !== idx);
                        setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, paragraphs: updated } });
                      }}
                      className="admin-btn-danger"
                      style={{ padding: '0.5rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentored Schools List */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    Mentored Schools Cards ({data.atalTinkeringSchools?.schools?.length || 0})
                  </h4>
                  <p className="admin-field__hint" style={{ margin: '0.2rem 0 0' }}>
                    Cards displayed in the ATL School Mentorship grid with Code, Address, Coordinator, Phone, and Email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const schools = data.atalTinkeringSchools?.schools || [];
                    const nextSno = schools.length > 0 ? Math.max(...schools.map((s) => s.sno || 0)) + 1 : 1;
                    setData({
                      ...data,
                      atalTinkeringSchools: {
                        ...data.atalTinkeringSchools,
                        schools: [
                          ...schools,
                          {
                            sno: nextSno,
                            schoolCode: '',
                            schoolName: '',
                            address: '',
                            email: '',
                            mobile: '',
                            coordinator: '',
                          },
                        ],
                      },
                    });
                  }}
                  className="admin-btn admin-btn--sm admin-btn--secondary"
                >
                  <Plus size={14} /> Add School
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(data.atalTinkeringSchools?.schools || []).map((sch, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>School Name *</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.schoolName}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], schoolName: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                          placeholder="e.g. D N R E M HIGH SCHOOL BHIMAVARAM"
                        />
                      </div>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>ATL School Code</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.schoolCode}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], schoolCode: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                          placeholder="e.g. 25141275"
                        />
                      </div>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Mentor Coordinator</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.coordinator}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], coordinator: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                          placeholder="e.g. Dr. S. Dileep Kumar Verma"
                        />
                      </div>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Mobile / Phone</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.mobile}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], mobile: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                          placeholder="e.g. 9912883311"
                        />
                      </div>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Email</label>
                        <input
                          type="email"
                          className="admin-input"
                          value={sch.email}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], email: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                          placeholder="e.g. school@example.com"
                        />
                      </div>
                      <div className="admin-field" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.8rem' }}>Address</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={sch.address}
                          onChange={(e) => {
                            const updated = [...(data.atalTinkeringSchools?.schools || [])];
                            updated[idx] = { ...updated[idx], address: e.target.value };
                            setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                          }}
                          placeholder="School campus address..."
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.atalTinkeringSchools?.schools || []).filter((_, i) => i !== idx);
                          setData({ ...data, atalTinkeringSchools: { ...data.atalTinkeringSchools, schools: updated } });
                        }}
                        className="admin-btn-danger"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={13} /> Remove School
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 10: CUSTOM SECTIONS */}
        {activeTab === 'customSections' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                Custom Sections
              </h4>
              <p className="admin-field__hint" style={{ margin: 0 }}>
                Add any section this item needs beyond the fixed sections above — Key Highlights, Facilities, Outcomes, Partners, Contacts, or anything else — any name, any number of sub-sections, and a choice of plain text, a checklist, a table, a list of links, uploaded files, or contacts (role/name/phone/email) per section. Each one shows up on the public page once it has content. Use the Placement dropdown per section to choose "In the intro area above" vs. "In the accordion below" (the default — everything else, shown as a click-to-expand panel).
              </p>
            </div>

            <CustomSectionEditor
              sections={data.customSections || []}
              onChange={(next) => setData({ ...data, customSections: next })}
              rootSections={data.customSections || []}
              parentPath={[]}
              onFileUploaded={handleCustomSectionFileUploaded}
              onFileRemoved={handleCustomSectionFileRemoved}
              onPhotoUploaded={handleCustomSectionPhotoUploaded}
              onPhotoRemoved={handleCustomSectionPhotoRemoved}
              onGalleryPhotoUploaded={handleCustomSectionGalleryPhotoUploaded}
              onGalleryPhotoRemoved={handleCustomSectionGalleryPhotoRemoved}
              onImageCardPhotoUploaded={handleCustomSectionImageCardPhotoUploaded}
              onImageCardPhotoRemoved={handleCustomSectionImageCardPhotoRemoved}
              showPlacementToggle
            />
          </div>
        )}
      </div>
    </div>
  );
}
