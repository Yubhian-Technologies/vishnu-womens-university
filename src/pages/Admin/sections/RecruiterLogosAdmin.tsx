import { useState } from 'react';
import JSZip from 'jszip';
import { createExtractorFromData } from 'node-unrar-js';
import unrarWasmUrl from 'node-unrar-js/esm/js/unrar.wasm?url';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useCollection, type WithId } from '../../../hooks/useCollection';
import { deleteFile, uploadImage, type UploadResult } from '../../../lib/storage';

interface RecruiterLogoDoc extends WithId {
  imageUrl: string;
  storagePath: string;
}

interface ExtractedImage {
  name: string;
  blob: Blob;
}

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif']);

function isImageEntry(entryName: string): boolean {
  const ext = entryName.split('.').pop()?.toLowerCase();
  return ext ? IMAGE_EXTENSIONS.has(ext) : false;
}

// "Google.png" -> "Google", "D.E._Shaw.jpg" -> "D.E. Shaw". Strips any
// folder path the archive entry carries, drops the extension, and turns
// underscores/hyphens into spaces since a filename can't contain some
// characters a real company name might (e.g. "&").
function companyNameFromFilename(entryName: string): string {
  const base = entryName.split('/').pop()?.split('\\').pop() || entryName;
  const withoutExt = base.replace(/\.[^./]+$/, '');
  return withoutExt.replace(/[_-]+/g, ' ').trim();
}

async function extractZip(file: File): Promise<ExtractedImage[]> {
  const zip = await JSZip.loadAsync(file);
  const entries = Object.values(zip.files).filter((f) => !f.dir && isImageEntry(f.name));
  const images: ExtractedImage[] = [];
  for (const entry of entries) {
    images.push({ name: entry.name, blob: await entry.async('blob') });
  }
  return images;
}

// RAR extraction runs entirely client-side via a WASM build of the official
// unrar library — no server involved, same as the ZIP path. The wasm binary
// has to be fetched and handed in explicitly for browser use (Node can load
// it from disk directly, but this only ever runs in the browser here).
async function extractRar(file: File): Promise<ExtractedImage[]> {
  const [data, wasmBinary] = await Promise.all([
    file.arrayBuffer(),
    fetch(unrarWasmUrl).then((r) => r.arrayBuffer()),
  ]);
  const extractor = await createExtractorFromData({ data, wasmBinary });
  const { files } = extractor.extract({ files: (h) => !h.flags.directory && isImageEntry(h.name) });
  const images: ExtractedImage[] = [];
  for (const f of files) {
    if (f.extraction) images.push({ name: f.fileHeader.name, blob: new Blob([f.extraction as BlobPart]) });
  }
  return images;
}

// Real logo images for the "Our Recruiters" grid and any page's "Recruiting
// Partners" section (PlacementDetail.tsx's PartnerLogo), keyed by the exact
// company name string used in Placement Year Data / a page's Partners field
// — takes priority there over the automatic favicon-domain lookup. Doc ID =
// company name (setDoc upsert), same pattern as tpoTeamPhotos.
export default function RecruiterLogosAdmin() {
  const { docs: logos, loading } = useCollection<RecruiterLogoDoc>('recruiterLogos');
  const sortedLogos = [...logos].sort((a, b) => a.id.localeCompare(b.id));
  const logoMap = new Map(logos.map((l) => [l.id, l]));

  const [manualCompany, setManualCompany] = useState('');
  const [uploadingName, setUploadingName] = useState<string | null>(null);
  const [archiveBusy, setArchiveBusy] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);

  const saveLogo = async (company: string, result: UploadResult) => {
    const prevPath = logoMap.get(company)?.storagePath;
    await setDoc(doc(db, 'recruiterLogos', company), {
      imageUrl: result.url,
      storagePath: result.path,
      updatedAt: serverTimestamp(),
    });
    if (prevPath && prevPath !== result.path) await deleteFile(prevPath).catch(() => {});
  };

  const changeImage = async (company: string, file: File) => {
    setUploadingName(company);
    try {
      const result = await uploadImage(file, 'vwu/recruiter-logos');
      await saveLogo(company, result);
    } catch (e) {
      alert(`Couldn't upload logo for ${company}: ${(e as Error).message}`);
    } finally {
      setUploadingName(null);
    }
  };

  const removeLogo = async (company: string) => {
    if (!confirm(`Remove the uploaded logo for ${company}? The site will fall back to its automatic lookup.`)) return;
    const existing = logoMap.get(company);
    try {
      await deleteDoc(doc(db, 'recruiterLogos', company));
      if (existing?.storagePath) await deleteFile(existing.storagePath).catch(() => {});
    } catch (e) {
      alert(`Couldn't remove: ${(e as Error).message}`);
    }
  };

  const removeAllLogos = async () => {
    if (logos.length === 0) return;
    if (!confirm(`Remove all ${logos.length} uploaded logos? Every company reverts to the automatic favicon lookup until you upload again. This can't be undone.`)) return;
    setClearingAll(true);
    try {
      for (const logo of logos) {
        await deleteDoc(doc(db, 'recruiterLogos', logo.id));
        if (logo.storagePath) await deleteFile(logo.storagePath).catch(() => {});
      }
    } catch (e) {
      alert(`Couldn't remove all logos: ${(e as Error).message}`);
    } finally {
      setClearingAll(false);
    }
  };

  const handleArchive = async (file: File) => {
    setArchiveError(null);
    setArchiveStatus(null);
    setArchiveBusy(true);
    try {
      const isRar = file.name.toLowerCase().endsWith('.rar');
      const images = isRar ? await extractRar(file) : await extractZip(file);
      if (images.length === 0) {
        setArchiveError(`No image files found inside that ${isRar ? 'RAR' : 'ZIP'}.`);
        return;
      }
      let count = 0;
      for (const { name, blob } of images) {
        const company = companyNameFromFilename(name);
        if (!company) continue;
        const ext = name.split('.').pop() || 'png';
        const imgFile = new File([blob], `${company}.${ext}`, { type: blob.type || `image/${ext}` });
        const result = await uploadImage(imgFile, 'vwu/recruiter-logos');
        await saveLogo(company, result);
        count++;
      }
      setArchiveStatus(`Uploaded ${count} logo${count === 1 ? '' : 's'} from the ${isRar ? 'RAR' : 'ZIP'}.`);
    } catch (e) {
      setArchiveError(`Couldn't process that file: ${(e as Error).message}`);
    } finally {
      setArchiveBusy(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Recruiter Logos</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Real logo images for the "Our Recruiters" grid and any page's "Recruiting Partners" section, keyed by
          company name — takes priority over the automatic favicon lookup those otherwise use. Upload logos in
          bulk from a ZIP or RAR file, or one at a time below.
        </p>
        <div style={{ background: '#eef6ff', border: '1px solid #bcdcfd', borderRadius: 6, padding: '0.9rem 1rem' }}>
          <label className="admin-btn admin-btn--primary" style={{ cursor: archiveBusy ? 'default' : 'pointer', opacity: archiveBusy ? 0.6 : 1, display: 'inline-block' }}>
            {archiveBusy ? 'Uploading…' : '📦 Upload Logos from ZIP or RAR'}
            <input
              type="file"
              accept=".zip,.rar"
              hidden
              disabled={archiveBusy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleArchive(f);
                e.target.value = '';
              }}
            />
          </label>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.6rem' }}>
            Put one image per company inside the archive, named after that company — e.g. <code>Google.png</code>,{' '}
            <code>D.E._Shaw.jpg</code> (underscores become spaces). The name must match that company's exact
            spelling in Placement Year Data, or the logo won't be picked up on the public site.
          </p>
          {archiveStatus && <p style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '0.5rem' }}>{archiveStatus}</p>}
          {archiveError && <p style={{ fontSize: '0.85rem', color: '#dc2626', marginTop: '0.5rem' }}>{archiveError}</p>}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Add or Fix One Logo</h2>
        <p className="admin-lead" style={{ marginBottom: '0.75rem' }}>
          For a single company outside the ZIP/RAR flow — type its exact name (matching Placement Year Data's
          spelling) and pick an image.
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={manualCompany}
            onChange={(e) => setManualCompany(e.target.value)}
            placeholder="Company name, e.g. Google"
            style={{ flex: '1 1 260px', border: '1px solid #d1d5db', borderRadius: 6, padding: '0.5rem 0.7rem' }}
          />
          <label
            className="admin-btn admin-btn--sm"
            style={{ opacity: !manualCompany.trim() || uploadingName !== null || clearingAll ? 0.5 : 1, pointerEvents: !manualCompany.trim() ? 'none' : undefined }}
          >
            {uploadingName === manualCompany.trim() ? 'Uploading…' : 'Choose Image'}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={!manualCompany.trim() || uploadingName !== null || clearingAll}
              onChange={(e) => {
                const f = e.target.files?.[0];
                const company = manualCompany.trim();
                if (f && company) {
                  changeImage(company, f);
                  setManualCompany('');
                }
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>

      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: logos.length > 0 ? '0.75rem' : 0 }}>
          <h2 className="admin-card__title" style={{ margin: 0 }}>Uploaded Logos ({logos.length})</h2>
          {logos.length > 0 && (
            <button
              className="admin-btn admin-btn--sm admin-btn--danger"
              onClick={removeAllLogos}
              disabled={clearingAll}
            >
              {clearingAll ? 'Removing…' : `Remove All Logos (${logos.length})`}
            </button>
          )}
        </div>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-image-grid">
            {sortedLogos.map((logo) => (
              <div key={logo.id} className="admin-image-card">
                <img src={logo.imageUrl} alt={logo.id} />
                <div className="admin-image-card__info">
                  <strong>{logo.id}</strong>
                </div>
                <div className="admin-image-card__actions">
                  <label className="admin-btn admin-btn--sm" style={{ opacity: uploadingName !== null || clearingAll ? 0.5 : 1 }}>
                    {uploadingName === logo.id ? 'Uploading…' : 'Change Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={uploadingName !== null || clearingAll}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) changeImage(logo.id, f);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeLogo(logo.id)}>Remove</button>
                </div>
              </div>
            ))}
            {sortedLogos.length === 0 && (
              <p className="admin-empty">No logos uploaded yet — use the ZIP/RAR upload above to add some.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
