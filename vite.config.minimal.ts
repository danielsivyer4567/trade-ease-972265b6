import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    port: 8080,
    host: '0.0.0.0',
    open: true,
    strictPort: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
  },
  base: '/',
  publicDir: 'public'
}); 