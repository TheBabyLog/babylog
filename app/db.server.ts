import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export function getPrismaClient(databaseUrl: string) {
  const client = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  
  // Only use Accelerate if the URL is for Accelerate/Data Proxy
  if (databaseUrl.startsWith('prisma+postgres')) {
    return client.$extends(withAccelerate());
  }
  return client;
}