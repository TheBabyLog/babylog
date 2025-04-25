import { requireUserId } from "./session";
import { PrismaClient } from "@prisma/client/edge";

export async function addCaregiver(
  prisma: PrismaClient,
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
  prisma: PrismaClient,
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
  prisma: PrismaClient,
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
  prisma: PrismaClient,
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
