import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Create a variable to hold our database client
let db: PrismaClient;

// Add a type definition to the global scope to enable singleton pattern
// This prevents creating multiple database connections during development
declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient | undefined;
}

// Check the environment we're running in
if (typeof process === "undefined" || !process.env.NODE_ENV) {
  // This branch executes when running in Cloudflare environment
  // Cloudflare doesn't have a 'process' object like Node.js does

  // Access the environment variables from Cloudflare's globalThis.ENVIRONMENT
  // Type assertion needed to make TypeScript happy with this non-standard structure
  const globalEnv = (
    globalThis as unknown as Record<string, Record<string, string>>
  )?.ENVIRONMENT;

  // Get the DATABASE_URL from Cloudflare environment variables
  const connectionString = globalEnv?.DATABASE_URL;

  if (connectionString) {
    // Initialize Neon adapter with the connection string
    // This allows Prisma to connect to Neon database from Cloudflare
    const adapter = new PrismaNeon({ connectionString });

    // Create Prisma client with the Neon adapter
    db = new PrismaClient({ adapter });
  } else {
    // Error handling if DATABASE_URL is not found
    throw new Error("DATABASE_URL not found in Cloudflare environment");
  }
}
// Node.js environment handling
else if (process.env.NODE_ENV === "production") {
  // In production Node.js environment, create a new Prisma client
  // This will use the DATABASE_URL from .env file
  db = new PrismaClient();
} else {
  // Development environment (local Node.js)
  // Use singleton pattern to prevent multiple connections during development
  // This helps avoid "too many connections" errors during hot reloading
  if (!global.__db__) {
    // If no global client exists, create one
    global.__db__ = new PrismaClient();
  }
  // Use the existing client
  db = global.__db__;
  // Ensure connection is established
  db.$connect();
}

// Export the database client to be imported by other files
export { db };
