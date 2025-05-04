/**
 * Utility to access the ArcGIS API token
 */

// Store token in memory if needed
let runtimeToken: string | null = null;

/**
 * Set the ArcGIS token at runtime
 * @param token The ArcGIS token to use
 */
export const setArcGISToken = (token: string): void => {
  runtimeToken = token;
  console.log('ArcGIS token set at runtime');
  
  // Store in sessionStorage to persist during the session
  try {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('arcgis_token', token);
    }
  } catch (e) {
    console.warn('Could not store token in sessionStorage', e);
  }
};

/**
 * Get the ArcGIS token from environment variables or runtime storage
 * @returns The ArcGIS token
 */
export const getArcGISToken = (): string => {
  // Check for runtime token first
  if (runtimeToken) {
    return runtimeToken;
  }
  
  // Then check sessionStorage
  try {
    if (typeof window !== 'undefined') {
      const storedToken = window.sessionStorage.getItem('arcgis_token');
      if (storedToken) {
        runtimeToken = storedToken;
        return storedToken;
      }
    }
  } catch (e) {
    console.warn('Could not retrieve token from sessionStorage', e);
  }
  
  // Fallback to environment variable
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