import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": { target: "http://localhost:5008", changeOrigin: true },
    },
    changeOrigin: true,
  },
  plugins: [react(), tailwindcss()],
});
