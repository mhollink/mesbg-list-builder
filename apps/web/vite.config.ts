import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { fileURLToPath } from "node:url";

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
    alias: [
      {
        find: "~/generated",
        replacement: fileURLToPath(
          new URL("../../data/generated", import.meta.url),
        ),
      },
      {
        find: "~",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
}));
