/**
 * Utility to access the ArcGIS API token
 */

// Get the ArcGIS token from environment variables
export const getArcGISToken = (): string => {
  return import.meta.env.VITE_ARCGIS_API_KEY || '';
};

/**
 * Append the ArcGIS token to a URL as a token parameter
 * @param url Base URL
 * @returns URL with token appended
 */
export const appendArcGISToken = (url: string): string => {
  const token = getArcGISToken();
  
  if (!token) {
    return url;
  }
  
  // Add the token parameter
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}token=${encodeURIComponent(token)}`;
};

/**
 * Add token to any ArcGIS request options
 * @param options Request options
 * @returns Options with token added
 */
export const withArcGISToken = (options: RequestInit = {}): RequestInit => {
  const token = getArcGISToken();
  
  if (!token) {
    return options;
  }
  
  // Deep clone the headers
  const headers = { ...(options.headers || {}) };
  
  return {
    ...options,
    headers: {
      ...headers,
      'X-Esri-Authorization': `Bearer ${token}`
    }
  };
}; 