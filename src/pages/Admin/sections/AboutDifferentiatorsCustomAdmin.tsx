import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useDocument } from '../../../hooks/useDocument';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import CustomSectionEditor from './CustomSectionEditor';
import { replaceAtPath, getAtPath, type CustomSection } from '../../../lib/customSections';

export interface AboutDifferentiatorsCustomDoc {
  sections?: CustomSection[];
}

export const ABOUT_DIFFERENTIATORS_CUSTOM_COLLECTION = 'pageCustomSections';
export const ABOUT_DIFFERENTIATORS_CUSTOM_DOC_ID = 'about-differentiators';

// Extra, freeform content for the About page's "30+ Differentiating
// Initiatives" section — same Custom Sections mechanism every other module
// (Differentiators items, Programs, Departments, ...) already has, just
// backed by one singleton doc instead of a per-item one, since this section
// isn't tied to any single Firestore item. Purely additive: an empty
// `sections` array (the default) renders nothing extra on the public page.
export default function AboutDifferentiatorsCustomAdmin() {
  const { data, loading } = useDocument<AboutDifferentiatorsCustomDoc>(ABOUT_DIFFERENTIATORS_CUSTOM_COLLECTION, ABOUT_DIFFERENTIATORS_CUSTOM_DOC_ID);
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      setSections(data?.sections || []);
      setHasInitialized(true);
    }
  }, [data, loading, hasInitialized]);

  const handleFileUploaded = (sectionPath: number[], fileIndex: number, r: UploadResult) => {
    setSections((p) => replaceAtPath(p, sectionPath, (s) => ({
      ...s,
      files: (s.files || []).map((f, i) => (i === fileIndex ? { ...f, fileUrl: r.url, storagePath: r.path } : f)),
    })));
  };
  const handleFileRemoved = async (sectionPath: number[], fileIndex: number) => {
    const file = getAtPath(sections, sectionPath)?.files?.[fileIndex];
    if (!file?.fileUrl) return;
    if (!confirm('Remove this file? This cannot be undone.')) return;
    try {
      if (file.storagePath) await deleteFile(file.storagePath);
    } catch (e) {
      alert(`Couldn't delete the file from storage: ${(e as Error).message}`);
      return;
    }
    setSections((p) => replaceAtPath(p, sectionPath, (s) => ({
      ...s,
      files: (s.files || []).filter((_, i) => i !== fileIndex),
    })));
  };

  const handlePhotoUploaded = (sectionPath: number[], r: UploadResult) => {
    setSections((p) => replaceAtPath(p, sectionPath, (s) => ({ ...s, photo: { imageUrl: r.url, storagePath: r.path } })));
  };
  const handlePhotoRemoved = async (sectionPath: number[]) => {
    const photo = getAtPath(sections, sectionPath)?.photo;
    if (!photo?.imageUrl) return;
    if (!confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setSections((p) => replaceAtPath(p, sectionPath, (s) => {
      const next = { ...s };
      delete next.photo;
      return next;
    }));
  };

  const handleGalleryPhotoUploaded = (sectionPath: number[], photoIndex: number, r: UploadResult) => {
    setSections((p) => replaceAtPath(p, sectionPath, (s) => ({
      ...s,
      galleryPhotos: (s.galleryPhotos || []).map((ph, i) => (i === photoIndex ? { imageUrl: r.url, storagePath: r.path } : ph)),
    })));
  };
  const handleGalleryPhotoRemoved = async (sectionPath: number[], photoIndex: number) => {
    const photo = getAtPath(sections, sectionPath)?.galleryPhotos?.[photoIndex];
    if (!photo) return;
    if (photo.imageUrl && !confirm('Remove this photo? This cannot be undone.')) return;
    try {
      if (photo.storagePath) await deleteFile(photo.storagePath);
    } catch (e) {
      alert(`Couldn't delete the photo from storage: ${(e as Error).message}`);
      return;
    }
    setSections((p) => replaceAtPath(p, sectionPath, (s) => ({
      ...s,
      galleryPhotos: (s.galleryPhotos || []).filter((_, i) => i !== photoIndex),
    })));
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, ABOUT_DIFFERENTIATORS_CUSTOM_COLLECTION, ABOUT_DIFFERENTIATORS_CUSTOM_DOC_ID), { sections });
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !hasInitialized) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Custom Sections — Differentiators (About Page)</h2>
      <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
        Add any extra content for the "30+ Differentiating Initiatives" section above, beyond the initiative list —
        any name, any number of sub-sections, and a choice of plain text, a checklist, a table, a list of links,
        uploaded files, a photo gallery, or contacts per section. Shown right below the initiative grid on the About
        page once it has content — nothing changes there until you add something here.
      </p>
      <CustomSectionEditor
        sections={sections}
        onChange={setSections}
        rootSections={sections}
        parentPath={[]}
        onFileUploaded={handleFileUploaded}
        onFileRemoved={handleFileRemoved}
        onPhotoUploaded={handlePhotoUploaded}
        onPhotoRemoved={handlePhotoRemoved}
        onGalleryPhotoUploaded={handleGalleryPhotoUploaded}
        onGalleryPhotoRemoved={handleGalleryPhotoRemoved}
      />
      <div className="admin-form-actions">
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save Custom Sections'}
        </button>
      </div>
    </div>
  );
}
