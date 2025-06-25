import { ARCGIS_CONFIG } from '../config/arcgis';
<<<<<<< HEAD
import { supabase } from '@/integrations/supabase/client';
=======
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7

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