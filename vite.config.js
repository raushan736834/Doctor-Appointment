import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
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
