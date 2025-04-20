import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/cloudflare";

// Type for environment with DATABASE_URL
interface EnvWithDB {
  DATABASE_URL: string;
}

// Global variable for development environment caching
let prismaForNode: PrismaClient | undefined;

/**
 * Creates or returns a Prisma client
 * Works in both Cloudflare and Node.js environments
 */
export function getPrismaClient(env: EnvWithDB) {
  // Check if we're in Node.js environment
  if (typeof process !== "undefined" && process.env.NODE_ENV) {
    // For Node.js, use a singleton pattern
    if (!prismaForNode) {
      // In development, use standard Prisma connection
      if (process.env.NODE_ENV !== "production") {
        prismaForNode = new PrismaClient();
      } else {
        // In production Node.js, use Neon adapter
        const sql = neon(env.DATABASE_URL);
        const adapter = new PrismaNeon(sql);
        prismaForNode = new PrismaClient({ adapter });
      }
    }
    return prismaForNode;
  } else {
    // For Cloudflare, create a new client each time
    // Using Neon adapter which is designed to work with Cloudflare Workers
    const sql = neon(env.DATABASE_URL);
    const adapter = new PrismaNeon(sql);
    // Pass adapter to PrismaClient
    return new PrismaClient({ adapter });
  }
}

// Type for loader functions with Prisma
export type LoaderWithPrisma<T = unknown> = (
  args: LoaderFunctionArgs & { prisma: PrismaClient }
) => Promise<T>;

// Type for action functions with Prisma
export type ActionWithPrisma<T = unknown> = (
  args: ActionFunctionArgs & { prisma: PrismaClient }
) => Promise<T>;

/**
 * Higher-order function that injects a Prisma client into loader functions
 */
export function withPrisma<T = unknown>(loaderFn: LoaderWithPrisma<T>) {
  return async (args: LoaderFunctionArgs): Promise<T> => {
    const env: EnvWithDB = {
      DATABASE_URL:
        (args.context?.env as EnvWithDB | undefined)?.DATABASE_URL ||
        process.env.DATABASE_URL ||
        "",
    };
    const prisma = getPrismaClient({
      DATABASE_URL: env.DATABASE_URL || "",
    });

    try {
      return await loaderFn({ prisma, ...args });
    } finally {
      // Only disconnect in Cloudflare environment
      if (typeof process === "undefined") {
        await prisma.$disconnect();
      }
    }
  };
}

/**
 * Higher-order function that injects a Prisma client into action functions
 */
export function withPrismaAction<T = unknown>(actionFn: ActionWithPrisma<T>) {
  return async (args: ActionFunctionArgs): Promise<T> => {
    const env: EnvWithDB = {
      DATABASE_URL:
        (args.context?.env as EnvWithDB | undefined)?.DATABASE_URL ||
        process.env.DATABASE_URL ||
        "",
    };
    const prisma = getPrismaClient(env);

    try {
      return await actionFn({ prisma, ...args });
    } finally {
      // Only disconnect in Cloudflare environment
      if (typeof process === "undefined") {
        await prisma.$disconnect();
      }
    }
  };
}

// For backward compatibility with imports expecting default export
export default {
  getPrismaClient,
  withPrisma,
  withPrismaAction,
};
