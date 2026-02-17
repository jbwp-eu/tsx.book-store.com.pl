import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:5173", // Frontend URL
    // Increase timeouts to handle connection issues
    requestTimeout: 10000,
    pageLoadTimeout: 30000,
    defaultCommandTimeout: 10000,
    env: {
      VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || "http://localhost:3003", // Backend URL
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false,
    async setupNodeEvents(on, config) {
      // Use dynamic import to avoid CJS deprecation warnings
      const vitePreprocessor = (await import("cypress-vite")).default;
      on("file:preprocessor", vitePreprocessor());
      return config;
    },
  },
});
