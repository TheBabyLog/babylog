import { describe, expect, it, vi } from "vitest";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";
import { createBaby, getBaby, getUserBabies } from "~/.server/baby";

// Create a mock PrismaClient
const mockPrisma = {
  baby: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  album: {
    create: vi.fn(),
  },
};

describe("baby service", () => {
  it("creates baby correctly", async () => {
    const mockBaby = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("2024-01-01"),
      gender: "male",
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Set up the mock return value
    mockPrisma.baby.create.mockResolvedValueOnce(mockBaby);

    // Pass the mock prisma client as the first argument
    const result = await createBaby(mockPrisma as any, 1, {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("2024-01-01"),
      gender: "male",
    });

    expect(result).toEqual(mockBaby);
  });

  it("gets baby by id with relations", async () => {
    const mockBaby = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: new Date("2024-01-01"),
      gender: "male",
      ownerId: 1,
      owner: { id: 1, email: "test@example.com" },
      caregivers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.baby.findUnique.mockResolvedValueOnce(mockBaby);

    // Pass the mock prisma client as the first argument
    const result = await getBaby(mockPrisma as any, 1);
    expect(result).toEqual(mockBaby);
  });

  it("gets user babies", async () => {
    const mockBabies = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("2024-01-01"),
        gender: "male",
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPrisma.baby.findMany.mockResolvedValueOnce(mockBabies);

    // Pass the mock prisma client as the first argument
    const result = await getUserBabies(mockPrisma as any, 1);
    expect(result).toEqual(mockBabies);
  });
});
