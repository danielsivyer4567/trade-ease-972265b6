// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  // API key from environment variable with proper fallback handling
  apiKey: (() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
    console.log('Google Maps API Key loaded:', key ? `${key.substring(0, 10)}...` : 'Not configured');
    return key;
  })(),
  
  // Map ID for Advanced Markers and other Google Maps features
  // Using environment variable with fallback
  mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "8f066b173801f87f",
  
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
  // Don't log errors here since we're using a hook-based approach
  // that can fetch API keys from the database
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    return false;
  }
  
  if (GOOGLE_MAPS_CONFIG.apiKey.startsWith("AIzaSy")) {
    return true;
  }
  
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