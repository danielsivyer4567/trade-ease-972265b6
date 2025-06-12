import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
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
      open: true,
      strictPort: true,
      hmr: {
        host: 'localhost',
        protocol: 'ws',
        overlay: false,
        timeout: 5000,
        clientPort: 8080
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
        "@supabase/postgrest-js": path.resolve(__dirname, "./node_modules/@supabase/postgrest-js/dist/cjs/index.js"),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      conditions: ['import', 'module', 'browser', 'default'],
      mainFields: ['browser', 'module', 'main'],
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
        ignoreAnnotations: true,
        treeShaking: true,
      },
      include: [
        'react', 
        'react-dom', 
        '@tanstack/react-query',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-tabs',
        '@radix-ui/react-dialog',
        '@radix-ui/react-popover',
        '@radix-ui/react-slot',
        '@supabase/supabase-js',
        '@supabase/postgrest-js',
      ],
      exclude: [
        'framer-motion',
        '@lottiefiles/react-lottie-player'
      ],
      force: true // Force optimization of dependencies
    },
    build: {
      target: 'es2020',
      sourcemap: 'hidden', // Hide source maps but still generate them
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'query-vendor': ['@tanstack/react-query'],
            'radix-vendor': [
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-tabs',
              '@radix-ui/react-dialog',
              '@radix-ui/react-popover',
              '@radix-ui/react-slot',
            ],
          },
          // Improve module loading stability
          compact: true,
          sanitizeFileName: true,
          // Add dynamic import handling
          dynamicImportInCjs: true,
          // Ensure proper chunk loading
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // Add code splitting optimization
          minifyInternalExports: true,
          // Improve chunk loading
          hoistTransitiveImports: true,
          // Add module preload
          experimentalMinChunkSize: 10000
        },
        onwarn(warning, warn) {
          // Suppress source map warnings
          if (warning.code === 'SOURCEMAP_ERROR' || warning.message.includes('source map')) {
            return;
          }
          warn(warning);
        }
      },
      // Add module preload
      modulePreload: {
        polyfill: true
      },
      // Add dynamic import optimization
      dynamicImportVarsOptions: {
        warnOnError: true,
        exclude: []
      }
    },
    // Add specific configuration to handle environment variables
    define: {
      // Only expose specific environment variables
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_APP_ENV': JSON.stringify(env.VITE_APP_ENV),
      '__REACT_REFRESH_RUNTIME__': JSON.stringify(true)
    },
    base: '/',
    publicDir: 'public'
  };
});
