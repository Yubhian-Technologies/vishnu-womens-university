const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

export interface CloudinaryResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/** Upload a File object to Cloudinary, returns the result with secure_url */
export async function uploadToCloudinary(
  file: File,
  folder = 'vwu'
): Promise<CloudinaryResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? 'Cloudinary upload failed');
  }

  return res.json() as Promise<CloudinaryResult>;
}

/** Build an optimised Cloudinary URL with optional transforms */
export function cloudinaryUrl(
  publicId: string,
  opts: { width?: number; height?: number; quality?: number; format?: string } = {}
): string {
  const transforms: string[] = ['f_auto', 'q_auto'];
  if (opts.width) transforms.push(`w_${opts.width}`);
  if (opts.height) transforms.push(`h_${opts.height}`);
  if (opts.quality) transforms.push(`q_${opts.quality}`);
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(',')}/${publicId}`;
}
