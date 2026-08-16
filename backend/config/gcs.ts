import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs/promises";
import os from "os";
import path from "path";

dotenv.config();

const randomImageName = (bytes = 32): string =>
  crypto.randomBytes(bytes).toString("hex");

function getBucketName(): string {
  const name = process.env.GCS_BUCKET_NAME?.trim();
  if (!name) {
    throw new Error("GCS_BUCKET_NAME is not set");
  }
  return name;
}

function getStorage(): Storage {
  const projectId = process.env.GCS_PROJECT_ID?.trim() || undefined;
  return new Storage(projectId ? { projectId } : undefined);
}

/** Object keys uploaded to GCS use this prefix (legacy `aws*` keys are not rewritten). */
export function isGcsObjectKey(key: string): boolean {
  return key.startsWith("gcs");
}

/**
 * Upload via temp file + bucket.upload.
 * file.save(buffer) / createWriteStream break under Express+Multer on GCE Linux
 * ("Cannot call write after a stream was destroyed") even though the same SDK
 * works from a standalone script — path-based upload is reliable there.
 */
export async function uploadFile(file: Express.Multer.File): Promise<string> {
  const imageName = "gcs" + randomImageName();
  const bucketName = getBucketName();
  const bucket = getStorage().bucket(bucketName);
  const data = Buffer.from(file.buffer);
  const tmpPath = path.join(os.tmpdir(), imageName);

  console.log(
    `[GCS] Saving file to bucket "${bucketName}", object="${imageName}", contentType=${file.mimetype}, size=${data.length} bytes (via temp file)`
  );

  await fs.writeFile(tmpPath, data);
  try {
    await bucket.upload(tmpPath, {
      destination: imageName,
      resumable: false,
      metadata: {
        contentType: file.mimetype,
        cacheControl: "public, max-age=31536000",
      },
    });
  } finally {
    await fs.unlink(tmpPath).catch(() => undefined);
  }

  console.log(
    `[GCS] File saved successfully in bucket "${bucketName}": ${imageName}`
  );
  return imageName;
}

/** Public base URL (optional) or V4 signed read URL (7 days). */
export async function resolveObjectUrl(imageName: string): Promise<string> {
  const publicBase = process.env.GCS_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (publicBase) {
    return `${publicBase}/${imageName}`;
  }

  const bucket = getStorage().bucket(getBucketName());
  const [url] = await bucket.file(imageName).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });
  return url;
}

export async function deleteFile(imageName: string): Promise<void> {
  if (!isGcsObjectKey(imageName)) {
    return;
  }
  const bucketName = getBucketName();
  const bucket = getStorage().bucket(bucketName);
  console.log(
    `[GCS] Deleting object "${imageName}" from bucket "${bucketName}"`
  );
  await bucket.file(imageName).delete({ ignoreNotFound: true });
  console.log(`[GCS] Delete finished for object "${imageName}"`);
}
