
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ADMIN_SECRET_KEY?: string;
  readonly VITE_OPENWEATHERMAP_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
