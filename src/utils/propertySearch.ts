import { ARCGIS_CONFIG } from '../config/arcgis';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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