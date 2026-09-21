export interface UploadResult {
  url: string;
  path: string;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/** Upload a File to Cloudinary via an unsigned upload preset (no backend
 *  involved — same direct-from-browser shape the app already uses for
 *  Firestore). `resource_type: auto` covers images, PDFs, and videos, since
 *  every uploader component (Image/File/Video) shares this one function.
 *  Returns the Cloudinary secure URL and public_id. */
export async function uploadImage(file: File, folder = 'vwu'): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || `Cloudinary upload failed (${res.status})`);
  }
  const data = await res.json();
  return { url: data.secure_url, path: data.public_id };
}

// Same generic upload, aliased for clarity at non-image (e.g. PDF) call sites.
export const uploadFile = uploadImage;

// ponytail: unsigned presets can't authenticate a delete (that needs the API
// secret, which can't live in the browser bundle), so replacing/removing an
// image no longer cleans up the old Cloudinary asset — it's just orphaned.
// Upgrade path: a small signed serverless endpoint if that accumulation
// becomes a real cost/clutter problem.
export async function deleteFile(_path: string): Promise<void> {
  return;
}
