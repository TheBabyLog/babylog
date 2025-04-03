import { db } from "./db";
import { requireUserId } from "./session";

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
  caption: string;
  takenOn: Date; 
  takenAt: Date;
  timestamp: Date;
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

export async function uploadPhoto(data: PhotoData) {
  return db.photo.create({
    data: data,
  });
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

export async function editPhoto(id: number, data: PhotoUpdateData) {
  return db.photo.update({
    where: { id },
    data
  });
}

export async function deletePhoto(id: number) {
  return db.photo.delete({
    where: { id }
  });
}

export async function getRecentTrackingEvents(request: Request, babyId: number, limit: number = 5) {
  const userId = await requireUserId(request);
  const [eliminations, feedings, sleepSessions, photos] = await Promise.all([
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
        albumPhotos: {
          some: {
            album: {
              babyId
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
  })]);

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

export async function getPhoto(id: number) {
  return db.photo.findUnique({
    where: { id }
  });
} 
