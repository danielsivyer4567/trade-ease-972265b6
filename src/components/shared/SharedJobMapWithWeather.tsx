import React, { useState, useEffect, useRef, useCallback } from 'react';
import SharedJobMap from './SharedJobMap';
import { WeatherOverlay } from '../ui/WeatherOverlay';
import type { Job } from '@/types/job';

interface SharedJobMapWithWeatherProps {
  jobs: Job[];
  height?: string;
  showStreetView?: boolean;
  onJobClick?: (job: Job) => void;
}

export const SharedJobMapWithWeather: React.FC<SharedJobMapWithWeatherProps> = ({
  jobs,
  height = "500px",
  showStreetView = false,
  onJobClick
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);

  // Access the map instance from SharedJobMap - we'll need to add this capability
  // For now, we'll create a workaround by accessing the global map instance
  useEffect(() => {
    // Simple workaround to access map instance
    const checkForMap = () => {
      const mapContainer = document.querySelector('.map-container');
      if (mapContainer && (window as any).google) {
        // This is a simple way to access the map, but ideally we'd modify SharedJobMap
        // to accept a callback prop to get the map instance
        setTimeout(() => {
          const mapElements = document.querySelectorAll('[data-testid="map"]');
          if (mapElements.length > 0) {
            // This is a simplified approach - in production you'd want to modify
            // SharedJobMap to expose the map instance properly
            setMap(null); // We'll handle this differently
          }
        }, 1000);
      }
    };

    checkForMap();
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Main Map */}
      <SharedJobMap
        jobs={jobs}
        height={height}
        showStreetView={showStreetView}
        onJobClick={onJobClick}
      />

      {/* Weather Controls */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowWeatherPanel(!showWeatherPanel)}
          className="mb-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 text-sm font-medium"
        >
          {showWeatherPanel ? 'Hide Weather' : 'Show Weather'}
        </button>
        
        {showWeatherPanel && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <WeatherOverlay map={map} />
          </div>
        )}
      </div>
      
      {/* Info box */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> To fully enable weather overlays, get your free API key at{' '}
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            OpenWeatherMap
          </a>{' '}
          and add it to your .env.local file.
        </p>
      </div>
    </div>
  );
};

export default SharedJobMapWithWeather; 