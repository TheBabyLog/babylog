import { describe, expect, it, vi } from "vitest";
import { hashPassword, verifyPassword, verifyLogin } from "~/.server/auth";
import type { PrismaClient, User } from "@prisma/client";

// Create a properly typed mock PrismaClient
type MockPrismaClient = {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};

// Create the mock with the correct type
const mockPrisma: MockPrismaClient = {
  user: {
    findUnique: vi.fn(),
  },
};

describe("auth service", () => {
  it("hashes password correctly", async () => {
    const password = "testPassword123";
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
  });

  it("verifies password correctly", async () => {
    const password = "testPassword123";
    const hashedPassword = await hashPassword(password);

    const isValid = await verifyPassword(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it("returns null for non-existent user", async () => {
    // Setup mock to return null
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);

    // Pass the mock prisma client with type assertion that preserves the interface requirements
    const result = await verifyLogin(
      mockPrisma as unknown as PrismaClient,
      "test@example.com",
      "password123"
    );
    expect(result).toBeNull();
  });

  it("returns null for invalid password", async () => {
    // Create a properly typed user object
    const mockUser: Pick<User, "id" | "email" | "passwordHash"> = {
      id: 1,
      email: "test@example.com",
      passwordHash: await hashPassword("realPassword123"),
    };

    // Setup mock to return the user
    mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

    // Pass the mock prisma client with proper type assertion
    const result = await verifyLogin(
      mockPrisma as unknown as PrismaClient,
      "test@example.com",
      "wrongPassword"
    );
    expect(result).toBeNull();
  });

  it("returns user data for valid credentials", async () => {
    // Create a properly typed user object
    const mockUser: Pick<User, "id" | "email" | "passwordHash"> = {
      id: 1,
      email: "test@example.com",
      passwordHash: await hashPassword("correctPassword123"),
    };

    // Setup mock to return the user
    mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

    // Pass the mock prisma client with proper type assertion
    const result = await verifyLogin(
      mockPrisma as unknown as PrismaClient,
      "test@example.com",
      "correctPassword123"
    );
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
    });
  });
});
