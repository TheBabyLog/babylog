import { describe, expect, it, vi } from "vitest";
import { hashPassword, verifyPassword, verifyLogin } from "~/.server/auth";

// Create a mock PrismaClient
const mockPrisma = {
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

    // Pass the mock prisma client as the first argument
    const result = await verifyLogin(
      mockPrisma as any,
      "test@example.com",
      "password123"
    );
    expect(result).toBeNull();
  });

  it("returns null for invalid password", async () => {
    // Setup mock to return a user
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: 1,
      email: "test@example.com",
      passwordHash: await hashPassword("realPassword123"),
    });

    // Pass the mock prisma client as the first argument
    const result = await verifyLogin(
      mockPrisma as any,
      "test@example.com",
      "wrongPassword"
    );
    expect(result).toBeNull();
  });

  it("returns user data for valid credentials", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      passwordHash: await hashPassword("correctPassword123"),
    };

    // Setup mock to return a user
    mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

    // Pass the mock prisma client as the first argument
    const result = await verifyLogin(
      mockPrisma as any,
      "test@example.com",
      "correctPassword123"
    );
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
    });
  });
});
