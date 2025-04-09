import { db } from "./db";
import { requireUserId } from "./session";

export async function addCaregiver(
  request: Request,
  babyId: number,
  userId: number,
  relationship: string,
  permissions: string[] = ["view", "log"]
) {
  await requireUserId(request);
  return db.babyCaregiver.create({
    data: {
      babyId,
      userId,
      relationship,
      permissions,
    },
  });
}

export async function removeCaregiver(request: Request, babyId: number, userId: number) {
  await requireUserId(request);
  return db.babyCaregiver.delete({
    where: {
      babyId_userId: {
        babyId,
        userId,
      },
    },
  });
}

export async function addBabyOwner(request: Request, babyId: number, userId: number) {
  await requireUserId(request);
  return db.baby.update({
    where: { id: babyId },
    data: { ownerId: userId },
  });
}

export async function inviteNewCaregiver(request: Request, babyId: number, email: string, senderId: number) {
  await requireUserId(request);
  return db.parentInvite.create({
    data: {
      email,
      babyId,
      senderId,
      status: "PENDING",
    },
  });
}
