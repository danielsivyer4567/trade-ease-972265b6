import { supabase } from "@/integrations/supabase/client";

export class GeocodingService {
  // Cache to store previously geocoded addresses
  private cache: Record<string, [number, number]> = {};

  /**
   * Geocode an address string to coordinates [longitude, latitude]
   * @param address Full address string to geocode
   * @returns Promise resolving to [longitude, latitude] coordinates or null if geocoding fails
   */
  async geocodeAddress(address: string): Promise<[number, number] | null> {
    // Check cache first
    if (this.cache[address]) {
      return this.cache[address];
    }

    try {
      // For production, you would typically use a geocoding API like Google Maps, Mapbox, etc.
      // For now, we'll implement a simple fallback approach

      // First try to fetch from our geocoded_addresses table in Supabase if it exists
      const { data, error } = await supabase
        .from('geocoded_addresses')
        .select('longitude, latitude')
        .eq('address', address)
        .maybeSingle();

      if (!error && data) {
        const coordinates: [number, number] = [data.longitude, data.latitude];
        // Cache the result
        this.cache[address] = coordinates;
        return coordinates;
      }

      // If we have no database match or the table doesn't exist, use a free geocoding API
      // Note: In production, you would replace this with your preferred geocoding service
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`);
      }

      const geocodeData = await response.json();
      
      if (geocodeData && geocodeData.length > 0) {
        // OpenStreetMap returns [lat, lon] so we need to reverse to [lon, lat] for our map
        const coordinates: [number, number] = [
          parseFloat(geocodeData[0].lon),
          parseFloat(geocodeData[0].lat)
        ];
        
        // Cache the result
        this.cache[address] = coordinates;
        
        // Store in database for future use if the table exists
        try {
          await supabase
            .from('geocoded_addresses')
            .upsert({
              address,
              longitude: coordinates[0],
              latitude: coordinates[1],
              created_at: new Date().toISOString()
            });
        } catch (dbError) {
          // Silently fail if the table doesn't exist or we can't write
          console.warn("Could not save geocoded address to database:", dbError);
        }
        
        return coordinates;
      }
      
      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const geocodingService = new GeocodingService();

// Also export as default
export default GeocodingService; 