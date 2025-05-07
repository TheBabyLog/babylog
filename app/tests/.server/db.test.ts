// import { vi, describe, it, expect, beforeEach } from "vitest";
// import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
// import * as dbUtils from "~/db.server";

// // Create mock objects we'll use in tests
// const mockPrismaClient = {
//   $connect: vi.fn(),
//   $disconnect: vi.fn(),
//   user: { findMany: vi.fn() },
//   $extends: vi.fn().mockReturnThis(),
// };

// // Mock the Accelerate extension
// const mockWithAccelerate = vi.fn().mockReturnValue({});

// // Mock modules before importing anything
// vi.mock("@prisma/client/edge", () => ({
//   PrismaClient: vi.fn(() => mockPrismaClient),
// }));

// vi.mock("@prisma/extension-accelerate", () => ({
//   withAccelerate: mockWithAccelerate,
// }));

// describe("database utilities", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("getPrismaClient initializes client with correct URL", async () => {
//     const testUrl = "test-database-url";
//     const result = dbUtils.getPrismaClient(testUrl);

//     // Verify PrismaClient was constructed with the right options
//     expect(mockPrismaClient.$extends).toHaveBeenCalled();
//     expect(mockWithAccelerate).toHaveBeenCalled();
//     expect(result).toBe(mockPrismaClient);
//   });
// });

import { vi, describe, it, expect } from "vitest";

// First define the mocks
vi.mock("@prisma/client/edge", () => ({
  PrismaClient: vi.fn(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    user: { findMany: vi.fn() },
    $extends: vi.fn().mockReturnThis(),
  })),
}));

vi.mock("@prisma/extension-accelerate", () => ({
  withAccelerate: vi.fn(() => ({})),
}));

// Then import your modules after all mocks are defined
import { getPrismaClient } from "~/db.server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

describe("getPrismaClient", () => {
  it("initializes with the correct URL", () => {
    const testUrl = "test-database-url";
    getPrismaClient(testUrl);

    // Check that PrismaClient was constructed with the right options
    expect(PrismaClient).toHaveBeenCalledWith({
      datasourceUrl: testUrl,
    });

    // Check that withAccelerate was called
    expect(withAccelerate).toHaveBeenCalled();
  });
});
