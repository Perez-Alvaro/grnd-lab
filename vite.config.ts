import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Respeta el puerto asignado por el entorno (PORT); si no, 5173.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('@react-pdf/renderer') || normalizedId.includes('@react-pdf')) {
            return 'pdf-engine';
          }
          if (normalizedId.includes('jspdf')) {
            return 'jspdf-engine';
          }
          if (
            normalizedId.includes('node_modules/react/') ||
            normalizedId.includes('node_modules/react-dom/') ||
            normalizedId.includes('node_modules/react-router/') ||
            normalizedId.includes('node_modules/react-router-dom/') ||
            normalizedId.includes('node_modules/scheduler/') ||
            normalizedId.includes('node_modules/tslib/') ||
            normalizedId.includes('vite/preload-helper')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
});
