import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: true,
    open: true,
    strictPort: false,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      overlay: false
    },
    watch: {
      usePolling: true,
    },
    middlewareMode: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
    include: ['react', 'react-dom', '@tanstack/react-query'],
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
  experimental: {
    renderBuiltUrl(filename: string) {
      return filename;
    },
  },
  base: '/',
  publicDir: 'public'
});
