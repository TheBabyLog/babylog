import { db } from "./db";
import { requireUserId } from "./session";
import { createDownloadUrl, deleteFromS3 } from "./s3_auth";

interface EliminationData {
  babyId: number;
  type: string;
  timestamp: Date;
  weight?: number | null;
  location?: string | null;
  notes?: string | null;
}

interface FeedingData {
  babyId: number;
  type: string;
  startTime: Date;
  endTime?: Date | null;
  side?: string | null;
  amount?: number | null;
  food?: string | null;
  notes?: string | null;
}

interface SleepData {
  babyId: number;
  type: string;
  startTime: Date;
  endTime?: Date | null;
  how?: string | null;
  whereFellAsleep?: string | null;
  whereSlept?: string | null;
  quality?: number | null;
  notes?: string | null;
}

interface PhotoData {
  id: number;
  url: string;
  caption?: string;
  timestamp: Date;
  babyId: number;
}

export interface EliminationUpdateData {
  type?: string;
  timestamp?: Date;
  weight?: number | null;
  location?: string | null;
  notes?: string | null;
}

export interface FeedingUpdateData {
  type?: string;
  startTime?: Date;
  endTime?: Date | null;
  side?: string | null;
  amount?: number | null;
  food?: string | null;
  notes?: string | null;
}

export interface SleepUpdateData {
  startTime?: Date;
  endTime?: Date | null;
  how?: string | null;
  whereFellAsleep?: string | null;
  whereSlept?: string | null;
  type?: string;
  quality?: number | null;
  notes?: string | null;
}

export interface PhotoUpdateData {
  id?: number;
  url?: string;
  caption?: string;
  takenOn?: Date; 
  takenAt?: Date; 
}

export async function trackElimination(request: Request, data: EliminationData) {
  await requireUserId(request);
  return db.elimination.create({
    data: {
      ...data,
      success: true, // Required by schema
    },
  });
}

export async function trackFeeding(request: Request, data: FeedingData) {
  await requireUserId(request);
  return db.feeding.create({
    data: data,
  });
}

export async function trackSleep(request: Request, data: SleepData) {
  await requireUserId(request);
  return db.sleep.create({
    data: data,
  });
}

export async function trackPhoto(request: Request, data: PhotoData) {
  await requireUserId(request);
  
  // First create the photo
  const photo = await db.photo.create({
    data: {
      url: data.url,
      caption: data.caption,
      timestamp: data.timestamp,
      babyPhotos: {
        create: {
          babyId: data.babyId,
        },
      },
    },
  });

  return photo;
}

export async function editElimination(request: Request, id: number, data: EliminationUpdateData) {
  await requireUserId(request);
  return db.elimination.update({
    where: { id },
    data
  });
}

export async function editFeeding(request: Request, id: number, data: FeedingUpdateData) {
  await requireUserId(request);
  return db.feeding.update({
    where: { id },
    data
  });
}

export async function editSleep(request: Request, id: number, data: SleepUpdateData) {
  await requireUserId(request);
  return db.sleep.update({
    where: { id },
    data
  });
}

export async function editPhoto(request: Request, id: number, data: PhotoUpdateData) {
  await requireUserId(request);
  return db.photo.update({
    where: { id },
    data
  });
}

export async function deletePhoto(request: Request, id: number) {
  await requireUserId(request);
  
  // First get the photo to get the S3 key
  const photo = await db.photo.findUnique({
    where: { id }
  });

  if (!photo) {
    throw new Error("Photo not found");
  }

  try {
    // Delete from S3 first
    await deleteFromS3(photo.url);

    // Then delete from database
    await db.photo.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
}

export async function getRecentTrackingEvents(request: Request, babyId: number, limit: number = 5) {
  const userId = await requireUserId(request);
  const [eliminations, feedings, sleepSessions, rawPhotos] = await Promise.all([
    db.elimination.findMany({
      where: { babyId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    }),
    db.feeding.findMany({
      where: { babyId },
      orderBy: { startTime: 'desc' },
      take: limit,
    }),
    db.sleep.findMany({
      where: { babyId },
      orderBy: { startTime: 'desc' },
      take: limit,
    }),
    db.photo.findMany({
      where: {
        babyPhotos: {
          some: {
            babyId
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        babyPhotos: true
      }
    })
  ]);

  // Generate signed URLs for photos
  const photos = await Promise.all(
    rawPhotos.map(async (photo) => {
      try {
        const signedUrl = await createDownloadUrl(photo.url);
        return {
          ...photo,
          url: signedUrl,
          timestamp: photo.timestamp || photo.createdAt,
        };
      } catch (error) {
        console.error("Error generating signed URL for photo:", error);
        return null;
      }
    })
  ).then(photos => photos.filter(Boolean)); // Remove any nulls from failed URL generation

  return {
    eliminations,
    feedings,
    sleepSessions,
    photos,
  };
}

export async function getElimination(request: Request, id: number) {
  await requireUserId(request);
  return db.elimination.findUnique({
    where: { id }
  });
}

export async function getFeeding(request: Request, id: number) {
  await requireUserId(request);
  return db.feeding.findUnique({
    where: { id }
  });
}

export async function getSleep(request: Request, id: number) {
  await requireUserId(request);
  return db.sleep.findUnique({
    where: { id }
  });
} 

export async function getPhoto(request: Request, id: number) {
  await requireUserId(request);
  return db.photo.findUnique({
    where: { id }
  });
} 
