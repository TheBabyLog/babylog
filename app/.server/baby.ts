import type { PrismaClient, Baby } from "@prisma/client";
import { requireUserId } from "./session";

export async function createBaby(
  prisma: PrismaClient,
  ownerId: number,
  data: Pick<Baby, "firstName" | "lastName" | "dateOfBirth" | "gender">
) {
  return prisma.baby.create({
    data: {
      ...data,
      ownerId,
      caregivers: {
        create: {
          userId: ownerId,
          relationship: "PARENT",
        },
      },
    },
    include: {
      caregivers: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

export async function getBaby(
  prisma: PrismaClient,
  id: number,
  options: object = {}
) {
  return prisma.baby.findUnique({
    where: { id },
    ...options,
  });
}

export async function getUserBabies(prisma: PrismaClient, userId: number) {
  return prisma.baby.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          caregivers: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    orderBy: { dateOfBirth: "desc" },
  });
}

export async function inviteNewParent(
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
      // Other fields will be filled with defaults from the schema
    },
  });
}

// This function now needs to be wrapped with withPrismaAction in the route file
export async function handleBabyCreation(
  prisma: PrismaClient,
  request: Request
) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;

  // Get the optional parent invite email if it exists
  const inviteParent = formData.get("inviteParent") === "true";
  const parentEmail = (formData.get("parentEmail") as string) || null;

  if (!firstName || !lastName || !dateOfBirth) {
    return { error: "All fields are required" };
  }

  // If inviting parent is selected but no email is provided
  if (inviteParent && !parentEmail) {
    return { error: "Parent email is required" };
  }

  const baby = await createBaby(prisma, userId, {
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    gender: gender || null,
  });

  // If parent invitation was requested, create the invitation
  if (inviteParent && parentEmail) {
    await inviteNewParent(prisma, baby.id, parentEmail, userId);
  }

  return { baby };
}
