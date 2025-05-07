import { PrismaClient } from "@prisma/client/edge";
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

export async function trackElimination(
  prisma: PrismaClient,
  request: Request,
  data: EliminationData
) {
  await requireUserId(request);
  return prisma.elimination.create({
    data: {
      ...data,
      success: true, // Required by schema
    },
  });
}

export async function trackFeeding(
  prisma: PrismaClient,
  request: Request,
  data: FeedingData
) {
  await requireUserId(request);
  return prisma.feeding.create({
    data: data,
  });
}

export async function trackSleep(
  prisma: PrismaClient,
  request: Request,
  data: SleepData
) {
  await requireUserId(request);
  return prisma.sleep.create({
    data: data,
  });
}

export async function trackPhoto(
  prisma: PrismaClient,
  request: Request,
  data: PhotoData
) {
  await requireUserId(request);

  // First create the photo
  const photo = await prisma.photo.create({
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

export async function editElimination(
  prisma: PrismaClient,
  request: Request,
  id: number,
  data: EliminationUpdateData
) {
  await requireUserId(request);
  return prisma.elimination.update({
    where: { id },
    data,
  });
}

export async function editFeeding(
  prisma: PrismaClient,
  request: Request,
  id: number,
  data: FeedingUpdateData
) {
  await requireUserId(request);
  return prisma.feeding.update({
    where: { id },
    data,
  });
}

export async function editSleep(
  prisma: PrismaClient,
  request: Request,
  id: number,
  data: SleepUpdateData
) {
  await requireUserId(request);
  return prisma.sleep.update({
    where: { id },
    data,
  });
}

export async function editPhoto(
  prisma: PrismaClient,
  request: Request,
  id: number,
  data: PhotoUpdateData
) {
  await requireUserId(request);
  return prisma.photo.update({
    where: { id },
    data,
  });
}

export async function deletePhoto(
  prisma: PrismaClient,
  request: Request,
  id: number
) {
  await requireUserId(request);
  return prisma.photo.delete({
    where: { id },
  });
}

export async function getRecentTrackingEvents(
  prisma: PrismaClient,
  request: Request,
  babyId: number,
  limit: number = 5
) {
  // const userId = await requireUserId(request);
  const [eliminations, feedings, sleepSessions, photos] = await Promise.all([
    prisma.elimination.findMany({
      where: { babyId },
      orderBy: { timestamp: "desc" },
      take: limit,
    }),
    prisma.feeding.findMany({
      where: { babyId },
      orderBy: { startTime: "desc" },
      take: limit,
    }),
    prisma.sleep.findMany({
      where: { babyId },
      orderBy: { startTime: "desc" },
      take: limit,
    }),
    prisma.photo.findMany({
      where: {
        albumPhotos: {
          some: {
            album: {
              babyId,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    }),
  ]);

  return {
    eliminations,
    feedings,
    sleepSessions,
    photos,
  };
}

export async function getElimination(
  prisma: PrismaClient,
  request: Request,
  id: number
) {
  await requireUserId(request);
  return prisma.elimination.findUnique({
    where: { id },
  });
}

export async function getFeeding(
  prisma: PrismaClient,
  request: Request,
  id: number
) {
  await requireUserId(request);
  return prisma.feeding.findUnique({
    where: { id },
  });
}

export async function getSleep(
  prisma: PrismaClient,
  request: Request,
  id: number
) {
  await requireUserId(request);
  return prisma.sleep.findUnique({
    where: { id },
  });
}

export async function getPhoto(
  prisma: PrismaClient,
  request: Request,
  id: number
) {
  await requireUserId(request);
  return prisma.photo.findUnique({
    where: { id },
  });
}
