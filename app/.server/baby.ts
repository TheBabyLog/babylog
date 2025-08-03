import { Baby } from "prisma/generated/client";
import { requireUserId } from "./session";
import { ExtendedPrismaClient } from "../db.server";

export async function createBaby(
  prisma: ExtendedPrismaClient,
  ownerId: number,
  data: Pick<Baby, "firstName" | "lastName" | "dateOfBirth" | "gender">
) {
  const baby = prisma.baby.create({
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
  prisma.album.create({
    data: {
      title: data.firstName,
      babyId: (await baby).id,
    },
  });
  return baby;
}

export async function getBaby(
  prisma: ExtendedPrismaClient,
  id: number,
  options?: {
    include?: {
      caregivers?: {
        include?: {
          user?: {
            select: {
              firstName: true;
              lastName: true;
            };
          };
        };
      };
    };
  }
) {
  return prisma.baby.findUnique({
    where: { id },
    include: {
      caregivers: true,
      ...options?.include,
    },
    ...options,
  });
}

export async function getUserBabies(prisma: ExtendedPrismaClient, userId: number) {
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
  prisma: ExtendedPrismaClient,
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
// This function handles the creation of a new baby and optionally populates 'parentInvite'
export async function handleBabyCreation(
  request: Request,
  formData: FormData,
  prisma: ExtendedPrismaClient
) {
  const userId = await requireUserId(request);

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;

  // Get the optional parent invite email if it exists
  const inviteParent = formData.get("inviteParent") === "true";
  const parentEmail = (formData.get("parentEmail") as string) || null;

  // Validate required fields
  if (!firstName?.trim()) {
    return { error: "First name is required" };
  }
  if (!lastName?.trim()) {
    return { error: "Last name is required" };
  }
  if (!dateOfBirth?.trim()) {
    return { error: "Date of birth is required" };
  }

  // Validate date format and that it's not in the future
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) {
    return { error: "Invalid date format" };
  }
  if (birthDate > new Date()) {
    return { error: "Date of birth cannot be in the future" };
  }

  // Validate parent invite fields
  if (inviteParent && !parentEmail?.trim()) {
    return { error: "Parent email is required when inviting a parent" };
  }
  if (parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
    return { error: "Please enter a valid email address" };
  }

  const baby = await createBaby(prisma, userId, {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    dateOfBirth: birthDate,
    gender: gender || null,
  });

  // If parent invitation was requested, create the invitation
  if (inviteParent && parentEmail) {
    await inviteNewParent(prisma, baby.id, parentEmail, userId);
  }

  return { baby };
}
