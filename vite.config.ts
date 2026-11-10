import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      remoteBindings: false,
      inspectorPort: false,
      persistState: { path: ".wrangler/state" },
    }),
  ],
  server: {
    host: "127.0.0.1",
    port: 7054,
    strictPort: true,
  },
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
