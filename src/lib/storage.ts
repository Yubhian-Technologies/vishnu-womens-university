import { getFirebaseStorage } from './firebaseAdmin';

export interface UploadResult {
  url: string;
  path: string;
}

/** Upload a File to Firebase Storage, returns the public download URL and storage path */
export async function uploadImage(file: File, folder = 'vwu'): Promise<UploadResult> {
  const [{ ref, uploadBytes, getDownloadURL }, storage] = await Promise.all([
    import('firebase/storage'),
    getFirebaseStorage(),
  ]);
  const path = `${folder}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

// Same generic upload, aliased for clarity at non-image (e.g. PDF) call sites.
export const uploadFile = uploadImage;

/** Delete a file from Firebase Storage. Silently ignores an already-missing object
 *  (e.g. deleted manually, or the record still points at a static /public asset). */
export async function deleteFile(path: string): Promise<void> {
  if (!path) return;
  const [{ ref, deleteObject }, storage] = await Promise.all([
    import('firebase/storage'),
    getFirebaseStorage(),
  ]);
  try {
    await deleteObject(ref(storage, path));
  } catch (e) {
    if ((e as { code?: string }).code !== 'storage/object-not-found') throw e;
  }
}
