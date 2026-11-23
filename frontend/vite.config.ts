import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In production nginx forwards /api and /uploads to the backend (nginx.conf).
// The Vite dev server needs the same forwarding, otherwise every API request
// from `npm run dev` hits Vite itself and fails. Override the target with
// VITE_API_PROXY_TARGET when the backend is not on localhost:4000.
const apiTarget = process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target: apiTarget, changeOrigin: true },
      "/uploads": { target: apiTarget, changeOrigin: true },
    },
  },
});
