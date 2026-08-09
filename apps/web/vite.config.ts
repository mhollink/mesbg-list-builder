import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const currentDate = new Date().toLocaleDateString("en-UK", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default defineConfig(({ command }) => ({
  plugins: [react()],
  define: {
    BUILD_VERSION: JSON.stringify(process.env.npm_package_version),
    BUILD_DATE: JSON.stringify(currentDate),
    RESOURCES_URL: JSON.stringify(
        command === "build"
            ? "/static-resources"
            : "https://resources.mesbg-list-builder.com/v2024",
    ),
    API_URL: JSON.stringify("https://api.mesbg-list-builder.com/v2024"),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src")
    },
  },
}));
