import { requireUserId } from "./session";
import { ExtendedPrismaClient } from "../db.server";

export async function addCaregiver(
  prisma: ExtendedPrismaClient,
  request: Request,
  babyId: number,
  userId: number,
  relationship: string,
  permissions: string[] = ["view", "log"]
) {
  await requireUserId(request);
  return prisma.babyCaregiver.create({
    data: {
      babyId,
      userId,
      relationship,
      permissions,
    },
  });
}

export async function removeCaregiver(
  prisma: ExtendedPrismaClient,
  request: Request,
  babyId: number,
  userId: number
) {
  await requireUserId(request);
  return prisma.babyCaregiver.delete({
    where: {
      babyId_userId: {
        babyId,
        userId,
      },
    },
  });
}

export async function addBabyOwner(
  prisma: ExtendedPrismaClient,
  request: Request,
  babyId: number,
  userId: number
) {
  await requireUserId(request);
  return prisma.baby.update({
    where: { id: babyId },
    data: { ownerId: userId },
  });
}

export async function inviteNewCaregiver(
  prisma: ExtendedPrismaClient,
  request: Request,
  babyId: number,
  email: string,
  senderId: number
) {
  await requireUserId(request);
  return prisma.parentInvite.create({
    data: {
      email,
      babyId,
      senderId,
      status: "PENDING",
    },
  });
}
