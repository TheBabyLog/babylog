import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Load environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "babybabylog";
const BUCKET_REGION = process.env.AWS_REGION || "us-east-1";

/**
 * Initialize the S3 client
 */
const s3Client = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Extracts the key from a full S3 URL or returns the key if it's already just a key
 */
function extractKeyFromUrl(urlOrKey: string): string {
  try {
    // If it's a full URL, extract the key
    if (urlOrKey.startsWith('http')) {
      const url = new URL(urlOrKey);
      // Remove the leading slash if it exists
      return url.pathname.replace(/^\//, '');
    }
    // If it's just a key, return it as is
    return urlOrKey;
  } catch (e) {
    // If URL parsing fails, assume it's just a key
    return urlOrKey;
  }
}

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
 * @param urlOrKey - The full URL or key of the file in S3
 * @param expiresIn - URL expiration time in seconds (default: 3600 seconds / 1 hour)
 * @returns Promise with the pre-signed URL
 */
export async function createDownloadUrl(
  urlOrKey: string,
  expiresIn: number = 3600
): Promise<string> {
  const key = extractKeyFromUrl(urlOrKey);
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error creating download URL:", error);
    // Return a fallback URL that will show a placeholder or error image
    return `/images/placeholder.png`;
  }
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
  const cleanKey = extractKeyFromUrl(key);
  return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${cleanKey}`;
}

/**
 * Deletes a file from S3
 * 
 * @param urlOrKey - The full URL or key of the file in S3
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteFromS3(urlOrKey: string): Promise<void> {
  const key = extractKeyFromUrl(urlOrKey);
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error;
  }
}