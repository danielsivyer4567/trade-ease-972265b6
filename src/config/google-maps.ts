// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  // API key from environment variable with proper fallback handling
  apiKey: (() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
    console.log('Google Maps API Key loaded:', key ? `${key.substring(0, 10)}...` : 'Not configured');
    if (!key) {
      console.error('⚠️ GOOGLE MAPS: No API key found. Please check your .env file.');
    }
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
    notConfigured: "Google Maps API key is not configured. Please add it to your .env file.",
    requestDenied: "Google Maps API request denied. This usually means the API key has domain restrictions that don't include your current domain (localhost:5173). Go to Google Cloud Console → Credentials → Your API Key → Application restrictions and add localhost:5173/* to allowed referrers."
  }
};

// Non-readonly libraries array for use with LoadScript
export const GOOGLE_MAPS_LIBRARIES = ["marker", "geometry", "drawing"];

// Helper to check if the API key is properly configured
export const validateGoogleMapsApiKey = (): boolean => {
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    console.error('❌ Google Maps API key validation failed: No API key found');
    return false;
  }
  
  if (GOOGLE_MAPS_CONFIG.apiKey.startsWith("AIzaSy")) {
    console.log('✅ Google Maps API key format is valid');
    return true;
  }
  
  console.error('❌ Google Maps API key validation failed: Invalid format');
  return false;
};

// Get API key safely for use in components
export const getSafeApiKey = (): string => {
  const isValid = validateGoogleMapsApiKey();
  if (!isValid) {
    console.error('⚠️ Using invalid Google Maps API key');
  }
  return GOOGLE_MAPS_CONFIG.apiKey;
};

// Get Map ID safely for use in components
export const getMapId = (): string => {
  return GOOGLE_MAPS_CONFIG.mapId;
};

// Test the API key with a simple geocoding request
export const testGoogleMapsApiKey = async (): Promise<{ success: boolean; error?: string }> => {
  const apiKey = getSafeApiKey();
  if (!apiKey) {
    return { success: false, error: 'No API key configured' };
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Sydney,Australia&key=${apiKey}`
    );
    const data = await response.json();
    
    if (data.status === 'OK') {
      return { success: true };
    } else {
      return { success: false, error: `${data.status}: ${data.error_message || 'Unknown error'}` };
    }
  } catch (error) {
    return { success: false, error: `Network error: ${error}` };
  }
}; 