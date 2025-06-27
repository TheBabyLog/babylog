import { describe, expect, it, vi, beforeEach } from "vitest";
import { addCaregiver, removeCaregiver } from "~/.server/caregiver";
import { requireUserId } from "~/.server/session";
import type { PrismaClient } from "@prisma/client";

// Mock the session module
vi.mock("~/.server/session", () => ({
  requireUserId: vi.fn(),
}));

// Create properly typed mock functions
type MockFunction = ReturnType<typeof vi.fn>;

// Create a type for our mock Prisma client with proper function typing
type MockPrismaClient = {
  babyCaregiver: {
    create: MockFunction;
    delete: MockFunction;
  };
  $accelerate: {
    invalidate: MockFunction;
    invalidateAll: MockFunction;
  };
};

// Create the mock Prisma client
const mockPrisma: MockPrismaClient = {
  babyCaregiver: {
    create: vi.fn(),
    delete: vi.fn(),
  },
  $accelerate: {
    invalidate: vi.fn(),
    invalidateAll: vi.fn(),
  },
};

// Create a mock request
const mockRequest = {} as Request;

describe("caregiver service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    // Mock the requireUserId function to resolve
    vi.mocked(requireUserId).mockResolvedValueOnce(100);

    // Mock the create function
    mockPrisma.babyCaregiver.create.mockResolvedValueOnce(mockCaregiver);

    // Call the function with all required parameters
    const result = await addCaregiver(
      mockPrisma as any,
      mockRequest,
      1,
      2,
      "grandmother",
      ["view", "log"]
    );

    // Verify the result
    expect(result).toEqual(mockCaregiver);

    // Verify requireUserId was called with the request
    expect(requireUserId).toHaveBeenCalledWith(mockRequest);

    // Verify create was called with the right data
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

    // Mock requireUserId
    vi.mocked(requireUserId).mockResolvedValueOnce(100);

    // Mock delete
    mockPrisma.babyCaregiver.delete.mockResolvedValueOnce(mockCaregiver);

    // Call the function
    const result = await removeCaregiver(
      mockPrisma as any,
      mockRequest,
      1,
      2
    );

    // Verify the result
    expect(result).toEqual(mockCaregiver);

    // Verify requireUserId was called
    expect(requireUserId).toHaveBeenCalledWith(mockRequest);

    // Verify delete was called correctly
    expect(mockPrisma.babyCaregiver.delete).toHaveBeenCalledWith({
      where: {
        babyId_userId: {
          babyId: 1,
          userId: 2,
        },
      },
    });
  });
});
