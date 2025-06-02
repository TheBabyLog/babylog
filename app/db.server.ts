import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export function getPrismaClient(databaseUrl?: string) {
  const url = databaseUrl ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Please set it in your environment.");
  }
  const client = new PrismaClient({
    datasourceUrl: url,
  });
  
  // Only use Accelerate if the URL is for Accelerate/Data Proxy
  if (url.startsWith('prisma+postgres://') || url.startsWith('prisma://')) {
    return client.$extends(withAccelerate());
  }
  return client;
}