import { ARCGIS_CONFIG } from '../config/arcgis';
import { supabase } from '@/integrations/supabase/client';

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