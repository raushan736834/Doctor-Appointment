import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const isProd = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  base: isProd ? '/Doctor-Appointment/' : '/',
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
