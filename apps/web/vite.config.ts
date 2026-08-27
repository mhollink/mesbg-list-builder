import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import path from "node:path";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  define: {
    BUILD_VERSION: JSON.stringify(process.env.npm_package_version),
    BUILD_DATE: JSON.stringify(new Date().toISOString()),
    RESOURCES_URL: JSON.stringify(
      command === "build"
        ? "/static-resources"
        : "https://resources.mesbg-list-builder.com/v2024",
    ),
    API_URL: JSON.stringify("https://api.mesbg-list-builder.com/v2024"),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
}));
