import { v4 as uuidv4 } from "uuid";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

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

// Storage type configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || "local";

// S3 configuration (optional)
const S3_CONFIG = {
  bucket: process.env.AWS_S3_BUCKET,
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// Check if S3 is configured
const isS3Configured = !!(S3_CONFIG.bucket && S3_CONFIG.accessKeyId && S3_CONFIG.secretAccessKey);

// Use S3 if configured, otherwise fall back to local storage
let S3Client: any = null;
let UploadCommand: any = null;
let DeleteObjectCommand: any = null;

if (isS3Configured) {
  try {
    const { S3Client: S3 } = require("@aws-sdk/client-s3");
    const { PutObjectCommand } = require("@aws-sdk/client-s3");
    const { DeleteObjectCommand: DeleteCmd } = require("@aws-sdk/client-s3");
    S3Client = new S3({
      region: S3_CONFIG.region,
      credentials: {
        accessKeyId: S3_CONFIG.accessKeyId!,
        secretAccessKey: S3_CONFIG.secretAccessKey!,
      },
    });
    UploadCommand = PutObjectCommand;
    DeleteObjectCommand = DeleteCmd;
  } catch (error) {
    console.warn("AWS SDK not installed. Using local storage.");
  }
}

// Local storage path
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function uploadToS3(buffer: Buffer, key: string, mimeType: string): Promise<string> {
  if (!S3Client || !UploadCommand) {
    throw new Error("S3 client not initialized");
  }
  
  await S3Client.send(
    new UploadCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    })
  );
  
  // Return S3 URL
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
}

async function uploadLocally(buffer: Buffer, originalName: string, folder: string): Promise<UploadResult> {
  const folderPath = path.join(UPLOAD_DIR, folder);
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true });
  }

  const ext = originalName.split(".").pop() ?? "bin";
  const key = `${folder}/${uuidv4()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, key);

  await writeFile(filePath, buffer);

  return { url: `/uploads/${key}`, key };
}

async function deleteFromS3(key: string): Promise<void> {
  if (!S3Client || !DeleteObjectCommand) return;
  
  await S3Client.send(
    new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
    })
  );
}

async function deleteLocally(key: string): Promise<void> {
  const filePath = path.join(UPLOAD_DIR, key);
  try {
    await unlink(filePath);
  } catch (error) {
    console.log(`File not found for deletion: ${key}`);
  }
}

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder: string
): Promise<UploadResult> {
  // Use S3 if configured and available
  if (STORAGE_TYPE === "s3" && isS3Configured && S3Client) {
    const ext = originalName.split(".").pop() ?? "bin";
    const key = `youth-spark/${folder}/${uuidv4()}.${ext}`;
    const url = await uploadToS3(buffer, key, mimeType);
    return { url, key };
  }
  
  // Fall back to local storage
  return uploadLocally(buffer, originalName, folder);
}

export async function deleteFile(key: string): Promise<void> {
  // Use S3 if configured
  if (STORAGE_TYPE === "s3" && isS3Configured) {
    await deleteFromS3(key);
    return;
  }
  
  // Fall back to local storage
  await deleteLocally(key);
}
