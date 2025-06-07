// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  // API key from environment variable with proper fallback handling
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCVHBYlen8sLxyI69WC67znnfi9SU4J0BY",
  
  // Map ID for Advanced Markers and other Google Maps features
  // Using environment variable with fallback
  mapId: process.env.VITE_GOOGLE_MAPS_MAP_ID || "8f066b173801f87f",
  
  // Libraries to load
  libraries: ["marker", "geometry", "drawing"] as const,
  
  // Map defaults
  defaultCenter: {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  },
  
  // Error messages
  errors: {
    loadFailed: "Failed to load Google Maps. Please check your internet connection and try again.",
    apiKeyInvalid: "Google Maps API key is invalid or has restrictions. Please check the console for details.",
    quotaExceeded: "Google Maps quota exceeded. Please try again later.",
    notConfigured: "Google Maps API key is not configured. Please add it to your .env file."
  }
};

// Non-readonly libraries array for use with LoadScript
export const GOOGLE_MAPS_LIBRARIES = ["marker", "geometry", "drawing"];

// Helper to check if the API key is properly configured
export const validateGoogleMapsApiKey = (): boolean => {
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    console.error("CRITICAL: Google Maps API key is not configured in environment variables");
    return false;
  }
  
  if (GOOGLE_MAPS_CONFIG.apiKey.startsWith("AIzaSy")) {
    // Basic format validation
    return true;
  }
  
  console.error("CRITICAL: Google Maps API key format appears invalid");
  return false;
};

// Get API key safely for use in components
export const getSafeApiKey = (): string => {
  return GOOGLE_MAPS_CONFIG.apiKey;
};

// Get Map ID safely for use in components
export const getMapId = (): string => {
  return GOOGLE_MAPS_CONFIG.mapId;
}; 