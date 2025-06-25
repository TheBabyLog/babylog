import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Define the type for the extended Prisma client
export type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>;

// Global variable to store the Prisma client instance
let prismaClient: ExtendedPrismaClient | undefined;

function createExtendedPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
    // Add connection pooling configuration to prevent connection exhaustion
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  }).$extends(withAccelerate());
}

export function getPrismaClient(databaseUrl: string): ExtendedPrismaClient {
  // If we already have a client instance, return it
  if (prismaClient) {
    return prismaClient;
  }

  // Create a new client instance only if one doesn't exist
  prismaClient = createExtendedPrismaClient(databaseUrl);

  return prismaClient;
}

// Optional: Add a function to disconnect the client (useful for testing or cleanup)
export async function disconnectPrismaClient() {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = undefined;
  }
}
