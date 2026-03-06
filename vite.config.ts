import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";

export default defineConfig({
  plugins: [
    cloudflareDevProxy({
      getLoadContext,
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      port: 5174,
    },
  },
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  build: {
    minify: true,
  },
});
