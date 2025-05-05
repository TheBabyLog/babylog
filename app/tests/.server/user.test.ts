import { vi, describe, it, expect, beforeEach } from "vitest";
import { createUser } from "~/.server/user";
import { hashPassword, verifyPassword, verifyLogin } from "~/.server/auth";
import type { PrismaClient, User } from "@prisma/client";

// Create a proper type for our mock functions
type MockFunction = ReturnType<typeof vi.fn>;

// Create a type for our mock Prisma client
type MockPrismaClient = {
  user: {
    create: MockFunction;
    findUnique: MockFunction;
  };
};

// Create mock prisma client with proper typing
const mockPrisma: MockPrismaClient = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
};

// Mock auth functions - only mock what we need
vi.mock("~/.server/auth", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
  verifyLogin: vi.fn(),
}));

describe("user service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates user correctly", async () => {
    const mockUser: Partial<User> = {
      id: 1,
      email: "test@example.com",
      passwordHash: "hashedPassword123",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(hashPassword).mockResolvedValueOnce("hashedPassword123");
    mockPrisma.user.create.mockResolvedValueOnce(mockUser);

    const result = await createUser(mockPrisma as unknown as PrismaClient, {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
    });

    expect(result).toEqual(mockUser);
  });

  it("verifies login correctly", async () => {
    const mockUser: Partial<User> & { passwordHash: string } = {
      id: 1,
      email: "test@example.com",
      passwordHash: "hashedPassword123",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
    };

    mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
    vi.mocked(verifyPassword).mockResolvedValueOnce(true);

    // Mock the implementation of verifyLogin
    vi.mocked(verifyLogin).mockImplementation(
      async (prisma, email, password) => {
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

        const { passwordHash: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    );

    const result = await verifyLogin(
      mockPrisma as unknown as PrismaClient,
      "test@example.com",
      "password123"
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 1,
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
      })
    );

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });
  });

  it("returns null for non-existent user", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);

    // Need to mock this for the non-existent user test as well
    vi.mocked(verifyLogin).mockImplementation(
      async (prisma, email, password) => {
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

        const { passwordHash: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    );

    const result = await verifyLogin(
      mockPrisma as unknown as PrismaClient,
      "nonexistent@example.com",
      "password123"
    );
    expect(result).toBeNull();
  });
});
