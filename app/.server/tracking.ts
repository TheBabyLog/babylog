import { db } from "./db";

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
  timestamp: Date; 
  createdAt: Date; 
  updatedAt: Date; 
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

// export interface PhotoUpdateData {}?
export interface PhotoUpdateData {
  caption?: string;
}

export async function trackElimination(data: EliminationData) {
  return db.elimination.create({
    data: {
      ...data,
      success: true, // Required by schema
    },
  });
}

export async function trackFeeding(data: FeedingData) {
  return db.feeding.create({
    data: data,
  });
}

export async function trackSleep(data: SleepData) {
  return db.sleep.create({
    data: data,
  });
}

export async function uploadPhoto(data: PhotoData) {
  return db.photo.create({
    data: data,
  });
}

export async function editElimination(id: number, data: EliminationUpdateData) {
  return db.elimination.update({
    where: { id },
    data
  });
}

export async function editFeeding(id: number, data: FeedingUpdateData) {
  return db.feeding.update({
    where: { id },
    data
  });
}

export async function editSleep(id: number, data: SleepUpdateData) {
  return db.sleep.update({
    where: { id },
    data
  });
}

// editPhoto?
export async function editPhoto(id: number, data: PhotoUpdateData) {
  return db.photo.update({
    where: { id },
    data
  });
}

export async function deletePhoto(id: number, data: PhotoData) {
  return db.photo.delete ({
    where: { id },
    data
  });
}

export async function getRecentTrackingEvents(babyId: number, limit: number = 5) {
  const [eliminations, feedings, sleepSessions, photoUploads] = await Promise.all([
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
    photoUploads,
  };
}

export async function getElimination(id: number) {
  return db.elimination.findUnique({
    where: { id }
  });
}

export async function getFeeding(id: number) {
  return db.feeding.findUnique({
    where: { id }
  });
}

export async function getSleep(id: number) {
  return db.sleep.findUnique({
    where: { id }
  });
} 

export async function getPhotos(id: number) {
  return db.photo.findUnique({
    where: { id }
  });
} 
