import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Storage is pluggable: with no Cloudinary env vars set, uploads are written
 * to /public/uploads (fine for local dev). Fill in either CLOUDINARY_URL, or
 * the three separate CLOUDINARY_* vars (see .env.example), to switch to
 * Cloudinary for production — no code change needed, this module picks
 * either form up automatically.
 */
const useCloudinary = Boolean(
  process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
);

if (useCloudinary) {
  if (process.env.CLOUDINARY_URL) {
    // The cloudinary SDK auto-parses CLOUDINARY_URL when config() is called with no args.
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}

export type UploadResult = {
  url: string;
  publicId?: string;
};

export type UploadKind = "image" | "pdf";

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  kind: UploadKind
): Promise<UploadResult> {
  // Vercel's deployed filesystem is read-only outside /tmp, so the local-disk
  // fallback below would fail with a confusing EROFS error. Fail clearly
  // instead, so the admin knows exactly what to fix.
  if (!useCloudinary && process.env.VERCEL) {
    throw new Error(
      "Image/PDF uploads need Cloudinary configured in production — set CLOUDINARY_URL " +
        "(or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET) in your " +
        "Vercel project's environment variables (see SETUP.md), then redeploy."
    );
  }

  if (useCloudinary) {
    const resourceType = kind === "pdf" ? "raw" : "image";
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: "blog" },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
    return { url: result.secure_url, publicId: result.public_id };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const ext = path.extname(originalName) || (kind === "pdf" ? ".pdf" : "");
  const safeName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  await writeFile(path.join(uploadsDir, safeName), buffer);
  return { url: `/uploads/${safeName}` };
}

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_PDF_BYTES = 25 * 1024 * 1024;
