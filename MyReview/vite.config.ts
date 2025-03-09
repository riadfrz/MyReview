// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Critical fix for SPA routing with Vite
  server: {
    port: 5173,
    // Remove the proxy configuration entirely
  },

  // This is the crucial part for SPA routing
  preview: {
    port: 5173,
  },

  // Ensure sourcemaps for debugging
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },

  resolve: {
    alias: {
      '@': '/src',
    },
  },

  // Very important for client-side routing
  optimizeDeps: {
    include: ['react-router-dom'],
  },
});
