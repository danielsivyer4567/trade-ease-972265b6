/**
 * ArcGIS API token management utilities
 */

// Default token expiration (24 hours in milliseconds)
const DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000;

interface ArcGISToken {
  token: string;
  expires: number;
  server: string;
}

// Local storage key for token
const TOKEN_KEY = 'arcgis_token';

/**
 * Saves the ArcGIS token to localStorage
 */
export const saveArcGISToken = (token: string, expiresIn: number = DEFAULT_EXPIRATION, server: string = 'https://www.arcgis.com'): void => {
  const tokenData: ArcGISToken = {
    token,
    expires: Date.now() + expiresIn,
    server
  };
  
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    console.log('ArcGIS token saved successfully');
  } catch (error) {
    console.error('Error saving ArcGIS token:', error);
  }
};

/**
 * Retrieves a valid ArcGIS token from localStorage
 * Returns null if no token exists or if token is expired
 */
export const getArcGISToken = (): string | null => {
  try {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    
    if (!tokenData) {
      console.log('No ArcGIS token found');
      return null;
    }
    
    const parsedData: ArcGISToken = JSON.parse(tokenData);
    
    // Check if token is expired
    if (parsedData.expires < Date.now()) {
      console.log('ArcGIS token expired');
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    
    return parsedData.token;
  } catch (error) {
    console.error('Error retrieving ArcGIS token:', error);
    return null;
  }
};

/**
 * Clears the saved ArcGIS token
 */
export const clearArcGISToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log('ArcGIS token cleared');
  } catch (error) {
    console.error('Error clearing ArcGIS token:', error);
  }
};

/**
 * Checks if a valid token exists
 */
export const hasValidToken = (): boolean => {
  return getArcGISToken() !== null;
};

/**
 * Gets token expiration time
 * Returns null if no valid token exists
 */
export const getTokenExpiration = (): Date | null => {
  try {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    
    if (!tokenData) {
      return null;
    }
    
    const parsedData: ArcGISToken = JSON.parse(tokenData);
    return new Date(parsedData.expires);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
}; 