import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.STORAGE_REGION!,
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for non-AWS S3 endpoints like Supabase
});

const BUCKET = process.env.STORAGE_BUCKET!;

// Max file sizes in bytes
export const FILE_LIMITS = {
  cv: 5 * 1024 * 1024,        // 5 MB
  certificates: 5 * 1024 * 1024, // 5 MB
  image: 3 * 1024 * 1024,     // 3 MB
};

export const ALLOWED_MIME_TYPES = {
  cv: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  certificates: ["application/pdf"],
  image: ["image/jpeg", "image/png", "image/webp"],
};

interface UploadResult {
  url: string;
  key: string;
}

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder: string
): Promise<UploadResult> {
  const ext = originalName.split(".").pop() ?? "bin";
  const key = `${folder}/${uuidv4()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ContentDisposition: "inline",
    })
  );

  // Build the public URL. Adjust this if using Supabase storage URL format.
  const url = `${process.env.STORAGE_ENDPOINT}/${BUCKET}/${key}`;

  return { url, key };
}

export async function deleteFile(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}
