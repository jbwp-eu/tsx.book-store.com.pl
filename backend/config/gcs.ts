import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import crypto from "crypto";

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

export async function uploadFile(file: Express.Multer.File): Promise<string> {
  const imageName = "gcs" + randomImageName();
  const bucketName = getBucketName();
  const bucket = getStorage().bucket(bucketName);
  // Copy Multer's buffer — passing file.buffer directly can break GCS streams on Linux/prod
  const data = Buffer.from(file.buffer);
  console.log(
    `[GCS] Saving file to bucket "${bucketName}", object="${imageName}", contentType=${file.mimetype}, size=${data.length} bytes`
  );

  await bucket.file(imageName).save(data, {
    resumable: false,
    validation: false,
    contentType: file.mimetype,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

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
