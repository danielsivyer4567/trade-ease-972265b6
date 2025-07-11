import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Only load VITE_ prefixed variables
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    server: {
      port: 8080,
      host: '0.0.0.0',
      open: false, // Disable auto-open in WSL
      strictPort: false,
      hmr: {
        host: 'localhost',
        protocol: 'ws',
        overlay: false,
        timeout: 5000
      },
      watch: {
        usePolling: true, // Enable polling for WSL
        interval: 1000,
        binaryInterval: 1000,
        ignored: ['**/node_modules/**', '**/.git/**']
      },
      middlewareMode: false
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      // Fix module resolution issues
      dedupe: ['react', 'react-dom'],
      preserveSymlinks: false,
      conditions: ['import', 'module', 'browser', 'default'],
      mainFields: ['browser', 'module', 'main'],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'recharts',
        '@radix-ui/react-accordion',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-avatar',
        '@radix-ui/react-collapsible',
        '@radix-ui/react-slot',
        '@babel/runtime/helpers/esm/defineProperty',
        '@babel/runtime/helpers/esm/inheritsLoose'
      ],
      exclude: [],
      esbuildOptions: {
        target: 'es2020',
        format: 'esm',
        platform: 'browser',
        mainFields: ['browser', 'module', 'main'],
        resolveExtensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
      }
    },
    build: {
      target: 'es2020',
      sourcemap: true,
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
            charts: ['recharts']
          }
        }
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    },
    base: '/',
    publicDir: 'public',
    define: {
      // Define environment variables
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
    },
    // WSL-specific configuration
    clearScreen: false,
    logLevel: 'info',
    appType: 'spa'
  };
});
