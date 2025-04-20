import type { PrismaClient } from "@prisma/client";

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

export async function trackElimination(
  prisma: PrismaClient,
  data: EliminationData
) {
  return prisma.elimination.create({
    data: {
      ...data,
      success: true, // Required by schema
    },
  });
}

export async function trackFeeding(prisma: PrismaClient, data: FeedingData) {
  return prisma.feeding.create({
    data: data,
  });
}

export async function trackSleep(prisma: PrismaClient, data: SleepData) {
  return prisma.sleep.create({
    data: data,
  });
}

export async function getRecentTrackingEvents(
  prisma: PrismaClient,
  babyId: number,
  limit: number = 5
) {
  const [eliminations, feedings, sleepSessions] = await Promise.all([
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
  ]);

  return {
    eliminations,
    feedings,
    sleepSessions,
  };
}
