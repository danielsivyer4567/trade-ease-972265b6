/**
 * ArcGIS API token management utilities
 */

// Default token expiration (24 hours in milliseconds)
const DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Saves the ArcGIS token to localStorage
 */
export const saveArcGISToken = (token, expiresIn = DEFAULT_EXPIRATION, server = 'https://www.arcgis.com') => {
  const tokenData = {
    token,
    expires: Date.now() + expiresIn,
    server
  };
  
  try {
    localStorage.setItem('arcgis_token', JSON.stringify(tokenData));
    console.log('ArcGIS token saved successfully');
  } catch (error) {
    console.error('Error saving ArcGIS token:', error);
  }
};

/**
 * Retrieves a valid ArcGIS token from localStorage
 * Returns null if no token exists or if token is expired
 */
export const getArcGISToken = () => {
  try {
    const tokenData = localStorage.getItem('arcgis_token');
    
    if (!tokenData) {
      console.log('No ArcGIS token found');
      return null;
    }
    
    const parsedData = JSON.parse(tokenData);
    
    // Check if token is expired
    if (parsedData.expires < Date.now()) {
      console.log('ArcGIS token expired');
      localStorage.removeItem('arcgis_token');
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
export const clearArcGISToken = () => {
  try {
    localStorage.removeItem('arcgis_token');
    console.log('ArcGIS token cleared');
  } catch (error) {
    console.error('Error clearing ArcGIS token:', error);
  }
};

/**
 * Checks if a valid token exists
 */
export const hasValidToken = () => {
  return getArcGISToken() !== null;
};

/**
 * Gets token expiration time
 * Returns null if no valid token exists
 */
export const getTokenExpiration = () => {
  try {
    const tokenData = localStorage.getItem('arcgis_token');
    
    if (!tokenData) {
      return null;
    }
    
    const parsedData = JSON.parse(tokenData);
    return new Date(parsedData.expires);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Format a token for API use
 */
export const formatTokenForApi = (token) => {
  return token.trim();
}; 