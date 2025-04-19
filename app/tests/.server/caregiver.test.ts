import { describe, expect, it, vi } from "vitest";
import {
  addCaregiver,
  removeCaregiver,
  addBabyOwner,
  inviteNewCaregiver,
} from "~/.server/caregiver";
import type { PrismaClient } from "@prisma/client";

const mockPrisma = {
  babyCaregiver: {
    create: vi.fn(),
    delete: vi.fn(),
  },
  baby: {
    update: vi.fn(),
  },
  parentInvite: {
    create: vi.fn(),
  },
} as unknown as PrismaClient;

describe("caregiver service", () => {
  it("adds caregiver correctly", async () => {
    const mockCaregiver = {
      id: 1,
      babyId: 1,
      userId: 2,
      relationship: "grandmother",
      permissions: ["view", "log"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockPrisma.babyCaregiver.create as jest.Mock).mockResolvedValueOnce(
      mockCaregiver
    );

    const result = await addCaregiver(mockPrisma, 1, 2, "grandmother", [
      "view",
      "log",
    ]);
    expect(result).toEqual(mockCaregiver);
    expect(mockPrisma.babyCaregiver.create).toHaveBeenCalledWith({
      data: {
        babyId: 1,
        userId: 2,
        relationship: "grandmother",
        permissions: ["view", "log"],
      },
    });
  });

  it("removes caregiver correctly", async () => {
    const mockCaregiver = {
      id: 1,
      babyId: 1,
      userId: 2,
      relationship: "grandmother",
      permissions: ["view", "log"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockPrisma.babyCaregiver.delete as jest.Mock).mockResolvedValueOnce(
      mockCaregiver
    );

    const result = await removeCaregiver(mockPrisma, 1, 2);
    expect(result).toEqual(mockCaregiver);
    expect(mockPrisma.babyCaregiver.delete).toHaveBeenCalledWith({
      where: {
        babyId_userId: {
          babyId: 1,
          userId: 2,
        },
      },
    });
  });

  it("adds baby owner correctly", async () => {
    const mockBaby = {
      id: 1,
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockPrisma.baby.update as jest.Mock).mockResolvedValueOnce(mockBaby);

    const result = await addBabyOwner(mockPrisma, 1, 2);
    expect(result).toEqual(mockBaby);
    expect(mockPrisma.baby.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { ownerId: 2 },
    });
  });

  it("invites new caregiver correctly", async () => {
    const mockInvite = {
      id: 1,
      email: "test@example.com",
      babyId: 1,
      senderId: 2,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockPrisma.parentInvite.create as jest.Mock).mockResolvedValueOnce(
      mockInvite
    );

    const result = await inviteNewCaregiver(
      mockPrisma,
      1,
      "test@example.com",
      2
    );
    expect(result).toEqual(mockInvite);
    expect(mockPrisma.parentInvite.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        babyId: 1,
        senderId: 2,
        status: "PENDING",
      },
    });
  });
});
