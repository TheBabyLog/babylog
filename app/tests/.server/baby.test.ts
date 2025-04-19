import { describe, expect, it, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { createBaby, getBaby, getUserBabies } from "~/.server/baby";

const mockPrisma = {
  baby: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  parentInvite: {
    create: vi.fn(),
  },
} as unknown as PrismaClient;

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

    vi.mocked(mockPrisma.baby.create).mockResolvedValueOnce(mockBaby);

    const result = await createBaby(mockPrisma, 1, {
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

    vi.mocked(mockPrisma.baby.findUnique).mockResolvedValueOnce(mockBaby);

    const result = await getBaby(mockPrisma, 1);
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

    vi.mocked(mockPrisma.baby.findMany).mockResolvedValueOnce(mockBabies);

    const result = await getUserBabies(mockPrisma, 1);
    expect(result).toEqual(mockBabies);
  });
});
