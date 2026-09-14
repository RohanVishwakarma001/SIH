import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export interface UploadResult {
  fileUrl: string;
  storageKey: string;
}

const uploadDir = path.resolve(process.cwd(), env.STORAGE_PATH);

let s3Client: S3Client | null = null;
function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: env.STORAGE_REGION,
      endpoint: env.STORAGE_ENDPOINT || undefined,
      forcePathStyle: !!env.STORAGE_ENDPOINT, // required for R2/MinIO-style S3-compatible endpoints
      credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY,
        secretAccessKey: env.STORAGE_SECRET_KEY,
      },
    });
  }
  return s3Client;
}

async function saveToLocalDisk(fileBuffer: Buffer, filename: string): Promise<UploadResult> {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const extension = path.extname(filename) || '.png';
  const storageKey = `doc_${uuidv4()}${extension}`;
  const destination = path.join(uploadDir, storageKey);

  await fs.promises.writeFile(destination, fileBuffer);
  logger.info({ storageKey, size: fileBuffer.length, driver: 'local' }, 'File saved to local storage');

  return { fileUrl: `/uploads/${storageKey}`, storageKey };
}

async function saveToS3(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
  const extension = path.extname(filename) || '.png';
  const storageKey = `doc_${uuidv4()}${extension}`;

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: env.STORAGE_BUCKET,
      Key: storageKey,
      Body: fileBuffer,
      ContentType: mimeType,
    })
  );
  logger.info({ storageKey, size: fileBuffer.length, driver: 's3', bucket: env.STORAGE_BUCKET }, 'File saved to S3-compatible storage');

  const publicBase = env.STORAGE_ENDPOINT
    ? `${env.STORAGE_ENDPOINT.replace(/\/+$/, '')}/${env.STORAGE_BUCKET}`
    : `https://${env.STORAGE_BUCKET}.s3.${env.STORAGE_REGION}.amazonaws.com`;

  return { fileUrl: `${publicBase}/${storageKey}`, storageKey };
}

let cloudinaryConfigured = false;
function getCloudinary() {
  if (!cloudinaryConfigured) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    cloudinaryConfigured = true;
  }
  return cloudinary;
}

async function saveToCloudinary(fileBuffer: Buffer, filename: string): Promise<UploadResult> {
  const extension = path.extname(filename) || '.png';
  const storageKey = `doc_${uuidv4()}${extension}`;

  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = getCloudinary().uploader.upload_stream(
      { folder: 'medikiosk/documents', public_id: storageKey, resource_type: 'auto' },
      (error, uploadResult) => {
        if (error || !uploadResult) return reject(error || new Error('Cloudinary upload returned no result'));
        resolve(uploadResult as { secure_url: string; public_id: string });
      }
    );
    uploadStream.end(fileBuffer);
  });

  logger.info({ storageKey, size: fileBuffer.length, driver: 'cloudinary', publicId: result.public_id }, 'File saved to Cloudinary storage');

  return { fileUrl: result.secure_url, storageKey: result.public_id };
}

export class StorageProvider {
  public static async saveFile(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    if (env.STORAGE_DRIVER === 'cloudinary') {
      return saveToCloudinary(fileBuffer, filename);
    }
    if (env.STORAGE_DRIVER === 's3') {
      return saveToS3(fileBuffer, filename, mimeType);
    }
    return saveToLocalDisk(fileBuffer, filename);
  }
}
