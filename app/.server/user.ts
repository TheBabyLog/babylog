import { ExtendedPrismaClient } from "../db.server";
import { hashPassword } from "~/.server/auth";

export type UserSignupData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export async function createUser(prisma: ExtendedPrismaClient, data: UserSignupData) {
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
