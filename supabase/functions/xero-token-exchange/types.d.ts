/// <reference lib="deno.ns" />
/// <reference lib="deno.window" />

interface Deno {
  env: {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
  };
}

declare module "https://deno.land/x/types/index.d.ts" {
  export * from "https://deno.land/x/types/index.d.ts";
}

declare module "https://deno.land/std@0.177.0/http/server.ts" {
  export * from "https://deno.land/std@0.177.0/http/server.ts";
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export * from "@supabase/supabase-js";
} 