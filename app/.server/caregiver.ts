import type { PrismaClient } from "@prisma/client";

export async function addCaregiver(
  prisma: PrismaClient,
  babyId: number,
  userId: number,
  relationship: string,
  permissions: string[] = ["view", "log"]
) {
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
  babyId: number,
  userId: number
) {
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
  babyId: number,
  userId: number
) {
  return prisma.baby.update({
    where: { id: babyId },
    data: { ownerId: userId },
  });
}

export async function inviteNewCaregiver(
  prisma: PrismaClient,
  babyId: number,
  email: string,
  senderId: number
) {
  return prisma.parentInvite.create({
    data: {
      email,
      babyId,
      senderId,
      status: "PENDING",
    },
  });
}
