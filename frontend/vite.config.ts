import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: parseInt(env.VITE_PORT),
//   },
// });

export default defineConfig(({ mode }: ConfigEnv) => {
  // Load env vars from parent directory (.env is in root)
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173,
    },
  };
});
