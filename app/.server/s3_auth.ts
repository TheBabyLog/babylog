import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Load environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const BUCKET_NAME = "babybabylog"; // You may want to move this to .env as well

/**
 * Initialize the S3 client
 */
const s3Client = new S3Client({
  region: "us-east-1", // Replace with your bucket's region if different
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Creates a pre-signed URL for uploading a file to S3
 * 
 * @param key - The object key (file path) in the S3 bucket
 * @param contentType - The MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600 seconds / 1 hour)
 * @returns Promise with the pre-signed URL
 */
export async function createUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Creates a pre-signed URL for downloading a file from S3
 * 
 * @param key - The object key (file path) in the S3 bucket
 * @param expiresIn - URL expiration time in seconds (default: 3600 seconds / 1 hour)
 * @returns Promise with the pre-signed URL
 */
export async function createDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generates a unique filename based on original name
 * Useful to avoid filename collisions in your bucket
 * 
 * @param filename - Original filename
 * @returns A unique filename
 */
export function generateUniqueFilename(filename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 12);
  
  // Extract file extension
  const extension = filename.split('.').pop() || '';
  const baseName = filename.split('.').slice(0, -1).join('.');
  
  return `${baseName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Creates a file object URL with proper metadata for direct upload
 * 
 * @param file - The file object from the user's upload
 * @returns Promise with the file metadata and upload URL
 */
export async function prepareFileUpload(file: File) {
  const uniqueFilename = generateUniqueFilename(file.name);
  const uploadUrl = await createUploadUrl(uniqueFilename, file.type);
  
  return {
    filename: uniqueFilename,
    contentType: file.type,
    uploadUrl,
    fileSize: file.size,
  };
}

/**
 * Gets the permanent S3 URL for a file (not pre-signed)
 * 
 * @param key - The object key in S3
 * @returns The permanent S3 URL
 */
export function getS3Url(key: string): string {
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}