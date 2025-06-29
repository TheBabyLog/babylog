import { ExtendedPrismaClient } from "../db.server";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function verifyLogin(
  prisma: ExtendedPrismaClient,
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      firstName: true,
      lastName: true,
      phone: true,
      // Add other fields you need, but exclude sensitive data
    },
  });

  if (!user) return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  // Return user without the password hash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
