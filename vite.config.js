import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: false, // ✅ Ensure this is false
      },
    },
  },
});
