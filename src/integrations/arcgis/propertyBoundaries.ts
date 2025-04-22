import { geocode } from '@esri/arcgis-rest-geocoding';
import { queryFeatures } from '@esri/arcgis-rest-feature-layer';
import { ApiKey } from '@esri/arcgis-rest-auth';

const PROPERTY_LAYER_URL = 'https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/property_boundaries_holding/FeatureServer/0';

/**
 * Searches for an address and fetches property boundary data
 * @param address The full address to search for
 * @returns Object containing address and boundary geometry or null if not found
 */
export async function searchAddressAndFetchBoundary(address: string) {
  try {
    // Get API key from environment variables
    const apiKeyValue = import.meta.env.VITE_ARCGIS_API_KEY;
    
    if (!apiKeyValue) {
      throw new Error('ARCGIS_API_KEY is not defined in environment variables');
    }

    // Create authentication with API key
    const authentication = new ApiKey({
      key: apiKeyValue
    });

    // Geocode the address to get coordinates
    const geo = await geocode({
      singleLine: address,
      authentication
    });

    const location = geo.candidates[0]?.location;
    if (!location) throw new Error("No location found");

    // Query the property boundary using the coordinates
    const result = await queryFeatures({
      url: PROPERTY_LAYER_URL,
      geometry: location,
      geometryType: "esriGeometryPoint",
      spatialRel: "esriSpatialRelIntersects",
      distance: 50,
      units: "esriSRUnit_Meter",
      outFields: "*",
      returnGeometry: true,
      authentication
    });

    // Type assertion for result.features
    const features = 'features' in result ? result.features : [];
    const feature = features[0];
    
    if (!feature) {
      throw new Error("No property boundary found at this location");
    }

    // Return the property data
    return {
      address: geo.candidates[0]?.address,
      geometry: feature.geometry,
      properties: feature.attributes
    };
  } catch (error) {
    console.error("Error fetching property boundary:", error instanceof Error ? error.message : String(error));
    return null;
  }
} 