import { type PlatformProxy } from "wrangler";
import { getPrismaClient } from "./app/db.server";

export interface Env {
  DATABASE_URL: string;
}

type GetLoadContextArgs = {
  request: Request;
  context: {
    cloudflare: Omit<PlatformProxy<Env>, "dispose" | "caches" | "cf"> & {
      caches: PlatformProxy<Env>["caches"] | CacheStorage;
      cf: Request["cf"];
      env: Env;
    };
  };
};

declare module "@remix-run/cloudflare" {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    prisma: ReturnType<typeof getPrismaClient>;
  }
}

export function getLoadContext({ context }: GetLoadContextArgs) {
  const prisma = getPrismaClient(context.cloudflare.env.DATABASE_URL);

  return {
    ...context,
    prisma,
  };
}
