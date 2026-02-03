import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/ + aliases + test-env
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.js",
    exclude: ["tests/playwright/**", "node_modules/**" ],
  },
  resolve: {
    alias: {
      "@api": "/src/api",
      "@components": "/src/components",
      "@views": "/src/views",
      "@assets": "/src/assets",
      "@context": "/src/context",
      "@config": "/src/config/config.js",
      "@": "/src",
    },
  },
});
