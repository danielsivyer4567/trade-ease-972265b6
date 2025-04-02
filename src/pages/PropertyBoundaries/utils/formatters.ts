
/**
 * Format coordinate pair as readable string
 */
export const formatCoordinates = (coords: [number, number]): string => {
  if (!coords || coords.length !== 2) {
    return "Invalid coordinates";
  }
  
  const [lat, lng] = coords;
  
  // Format latitude with N/S indicator
  const latDirection = lat >= 0 ? "N" : "S";
  const formattedLat = `${Math.abs(lat).toFixed(6)}° ${latDirection}`;
  
  // Format longitude with E/W indicator
  const lngDirection = lng >= 0 ? "E" : "W";
  const formattedLng = `${Math.abs(lng).toFixed(6)}° ${lngDirection}`;
  
  return `${formattedLat}, ${formattedLng}`;
};

/**
 * Format area as readable string with appropriate units
 */
export const formatArea = (areaSqMeters: number): string => {
  if (areaSqMeters <= 0) return "0 m²";
  
  if (areaSqMeters < 10000) {
    // Show in square meters for smaller areas
    return `${Math.round(areaSqMeters)} m²`;
  } else {
    // Show in hectares for larger areas
    const hectares = areaSqMeters / 10000;
    return `${hectares.toFixed(2)} hectares`;
  }
};

/**
 * Format length as readable string with appropriate units
 */
export const formatLength = (lengthMeters: number): string => {
  if (lengthMeters <= 0) return "0 m";
  
  if (lengthMeters < 1000) {
    // Show in meters for shorter distances
    return `${Math.round(lengthMeters)} m`;
  } else {
    // Show in kilometers for longer distances
    const kilometers = lengthMeters / 1000;
    return `${kilometers.toFixed(2)} km`;
  }
};

/**
 * Format file size as readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
