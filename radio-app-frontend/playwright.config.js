import { defineConfig } from "@playwright/test";
import { FRONTEND_BASE_URL } from "./src/config/config.js";

export default defineConfig({
  testDir: "./tests/playwright",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: FRONTEND_BASE_URL,
    trace: "on-first-retry",
  },
});
