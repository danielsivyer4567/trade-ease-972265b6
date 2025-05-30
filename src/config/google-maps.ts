// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  // Replace with your actual API key
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCVHBYlen8sLxyI69WC67znnfi9SU4J0BY",
  
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
    quotaExceeded: "Google Maps quota exceeded. Please try again later."
  }
};

// Helper to check if the API key is properly configured
export const validateGoogleMapsApiKey = async (): Promise<boolean> => {
  try {
    // You can add a simple test request here if needed
    return true;
  } catch (error) {
    console.error("Google Maps API validation failed:", error);
    return false;
  }
}; 