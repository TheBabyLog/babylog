import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize the Neon client correctly for Cloudflare
const sql = neon(process.env.DATABASE_URL!);
// Create the adapter with the correct configuration
const adapter = new PrismaNeon(sql);

// Initialize PrismaClient with the adapter
export const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
} 