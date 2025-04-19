import type { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "~/.server/auth";

export type UserSignupData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export async function createUser(prisma: PrismaClient, data: UserSignupData) {
  const passwordHash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
  });
}

export async function verifyLogin(
  prisma: PrismaClient,
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  });

  if (!user) return null;
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _unused, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
