import { ARCGIS_CONFIG } from '../config/arcgis';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function searchProperty(address: string) {
  try {
    const { data, error } = await supabase.functions.invoke('arcgis-boundaries', {
      body: {
        address,
        apiKey: ARCGIS_CONFIG.apiKey
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching property:', error);
    throw error;
  }
} 