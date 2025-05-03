import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoadScript, LoadScriptProps } from '@react-google-maps/api';

// Define the libraries we need
const libraries: LoadScriptProps['libraries'] = ['marker', 'geometry'];
const MAPS_API_KEY = 'AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: null
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const handleLoad = () => {
    console.log("Google Maps script loaded successfully");
    setIsLoaded(true);
  };

  const handleError = (error: Error) => {
    console.error("Failed to load Google Maps:", error);
    setLoadError(error);
  };

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      <LoadScript 
        googleMapsApiKey={MAPS_API_KEY}
        libraries={libraries}
        version="beta"
        onLoad={handleLoad}
        onError={handleError}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
};

// Component to use for maps that need to use the Google Maps context
export const WithGoogleMaps: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoaded, loadError } = useGoogleMaps();
  
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
        <p className="text-red-500 font-medium">Failed to load Google Maps</p>
        <p className="text-sm text-gray-600">{loadError.message}</p>
      </div>
    );
  }
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}; 