import React, { useState, useEffect } from 'react';

interface WeatherOverlayProps {
  map: google.maps.Map | null;
  apiKey?: string;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ map, apiKey }) => {
  const [activeWeatherLayers, setActiveWeatherLayers] = useState<string[]>(['clouds', 'precipitation']);
  const [overlayMapTypes, setOverlayMapTypes] = useState<Map<string, google.maps.ImageMapType>>(new Map());

  // Get API key from environment
  const weatherApiKey = apiKey || import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  const weatherLayers = [
    { id: 'clouds', name: 'Clouds', layer: 'clouds_new' },
    { id: 'precipitation', name: 'Rain', layer: 'precipitation_new' },
    { id: 'temperature', name: 'Temperature', layer: 'temp_new' },
    { id: 'wind', name: 'Wind', layer: 'wind_new' },
    { id: 'pressure', name: 'Pressure', layer: 'pressure_new' }
  ];

  // Auto-enable default layers when map and API key are available
  useEffect(() => {
    if (map && weatherApiKey && activeWeatherLayers.length > 0) {
      const defaultLayers = ['clouds', 'precipitation'];
      defaultLayers.forEach(layerId => {
        if (activeWeatherLayers.includes(layerId) && !overlayMapTypes.has(layerId)) {
          const layer = weatherLayers.find(l => l.id === layerId);
          if (layer) {
            const weatherMapType = new google.maps.ImageMapType({
              getTileUrl: (coord, zoom) => {
                return `https://tile.openweathermap.org/map/${layer.layer}/${zoom}/${coord.x}/${coord.y}.png?appid=${weatherApiKey}`;
              },
              tileSize: new google.maps.Size(256, 256),
              maxZoom: 18,
              minZoom: 0,
              name: layer.name,
              opacity: 0.6
            });

            map.overlayMapTypes.push(weatherMapType);
            setOverlayMapTypes(prev => new Map(prev).set(layerId, weatherMapType));
          }
        }
      });
    }
  }, [map, weatherApiKey, activeWeatherLayers, overlayMapTypes, weatherLayers]);

  const toggleWeatherLayer = (layerId: string) => {
    if (!map || !weatherApiKey) {
      console.error('Map or API key not available');
      return;
    }

    const layer = weatherLayers.find(l => l.id === layerId);
    if (!layer) return;

    const isActive = activeWeatherLayers.includes(layerId);

    if (isActive) {
      // Remove layer
      const existingOverlay = overlayMapTypes.get(layerId);
      if (existingOverlay) {
        const index = map.overlayMapTypes.getArray().indexOf(existingOverlay);
        if (index !== -1) {
          map.overlayMapTypes.removeAt(index);
        }
      }
      setActiveWeatherLayers(prev => prev.filter(id => id !== layerId));
      setOverlayMapTypes(prev => {
        const newMap = new Map(prev);
        newMap.delete(layerId);
        return newMap;
      });
    } else {
      // Add layer
      const weatherMapType = new google.maps.ImageMapType({
        getTileUrl: (coord, zoom) => {
          return `https://tile.openweathermap.org/map/${layer.layer}/${zoom}/${coord.x}/${coord.y}.png?appid=${weatherApiKey}`;
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 18,
        minZoom: 0,
        name: layer.name,
        opacity: 0.6
      });

      map.overlayMapTypes.push(weatherMapType);
      setOverlayMapTypes(prev => new Map(prev).set(layerId, weatherMapType));
      setActiveWeatherLayers(prev => [...prev, layerId]);
    }
  };

  const clearAllWeatherLayers = () => {
    if (!map) return;

    overlayMapTypes.forEach(overlay => {
      const index = map.overlayMapTypes.getArray().indexOf(overlay);
      if (index !== -1) {
        map.overlayMapTypes.removeAt(index);
      }
    });

    setOverlayMapTypes(new Map());
    setActiveWeatherLayers([]);
  };

  if (!weatherApiKey) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <h3 className="font-semibold text-gray-800 mb-2">Weather Overlay</h3>
        <p className="text-sm text-gray-600">
          OpenWeatherMap API key required. Get your free key at{' '}
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            openweathermap.org
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <h3 className="font-semibold text-gray-800 mb-3">Weather Overlay</h3>
      
      <div className="space-y-2">
        {weatherLayers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <button
              onClick={() => toggleWeatherLayer(layer.id)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeWeatherLayers.includes(layer.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {layer.name}
            </button>
            {activeWeatherLayers.includes(layer.id) && (
              <span className="text-xs text-green-600 font-medium">Active</span>
            )}
          </div>
        ))}
      </div>

      {activeWeatherLayers.length > 0 && (
        <button
          onClick={clearAllWeatherLayers}
          className="mt-3 w-full px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
        >
          Clear All Layers
        </button>
      )}

      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
        <strong>Free tier:</strong> 1,000 API calls/day
      </div>
    </div>
  );
};

export default WeatherOverlay; 