import { vi, describe, it, expect, beforeEach } from "vitest";
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/cloudflare";

// Create mock objects we'll use in tests
const mockPrismaClient = {
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  user: { findMany: vi.fn() },
};

const mockPrismaNeon = vi.fn();

// Mock modules before importing anything
vi.mock("@prisma/client/edge", () => ({
  PrismaClient: vi.fn(() => mockPrismaClient),
}));

vi.mock("@prisma/adapter-neon", () => ({
  PrismaNeon: mockPrismaNeon,
}));

describe("database utilities", () => {
  // Import the module under test after the mocks are in place
  let dbUtils: typeof import("~/.server/db");

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    // Import the module fresh for each test
    dbUtils = await import("~/.server/db");
  });

  it("withPrisma function injects prisma client into loader", async () => {
    // Prepare a mock loader function
    const mockLoader = vi.fn().mockResolvedValue({ success: true });

    // Wrap it with withPrisma
    const wrappedLoader = dbUtils.withPrisma(mockLoader);

    // Call the wrapped loader with test arguments
    const loaderArgs = {
      request: new Request("http://example.com"), // Mock request
      params: {}, // Mock params
      context: { env: { DATABASE_URL: "test-url" } },
    } as LoaderFunctionArgs;

    await wrappedLoader(loaderArgs);

    // Verify the loader was called with a prisma client
    expect(mockLoader).toHaveBeenCalledTimes(1);
    expect(mockLoader.mock.calls[0][0]).toHaveProperty("prisma");
  });

  it("withPrismaAction function injects prisma client into action", async () => {
    // Prepare a mock action function
    const mockAction = vi.fn().mockResolvedValue({ success: true });

    // Wrap it with withPrismaAction
    const wrappedAction = dbUtils.withPrismaAction(mockAction);

    // Call the wrapped action with test arguments
    const actionArgs = {
      request: new Request("http://example.com"), // Mock request
      params: {}, // Mock params
      context: { env: { DATABASE_URL: "test-url" } },
    } as ActionFunctionArgs; // Use the correct type

    await wrappedAction(actionArgs);

    // Verify the action was called with a prisma client
    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(mockAction.mock.calls[0][0]).toHaveProperty("prisma");
  });
});
