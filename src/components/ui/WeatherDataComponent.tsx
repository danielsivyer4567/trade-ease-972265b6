import React, { useState, useEffect } from 'react';

interface WeatherDataComponentProps {
  lat: number;
  lon: number;
  apiKey?: string;
  useOneCallAPI?: boolean;
}

interface WeatherData {
  current?: {
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: Array<{ description: string; icon: string }>;
  };
  hourly?: Array<{
    dt: number;
    temp: number;
    weather: Array<{ description: string; icon: string }>;
  }>;
  daily?: Array<{
    dt: number;
    temp: { min: number; max: number };
    weather: Array<{ description: string; icon: string }>;
  }>;
  alerts?: Array<{
    sender_name: string;
    event: string;
    description: string;
  }>;
}

interface BasicWeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{ description: string; icon: string }>;
  name: string;
}

export const WeatherDataComponent: React.FC<WeatherDataComponentProps> = ({
  lat,
  lon,
  apiKey,
  useOneCallAPI = false
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | BasicWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weatherApiKey = apiKey || import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon, useOneCallAPI]);

  const fetchWeatherData = async () => {
    if (!weatherApiKey) {
      setError('API key is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url: string;
      
      if (useOneCallAPI) {
        // One Call API 3.0 - requires subscription
        url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
      } else {
        // Basic Weather API - free with basic API key
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMessage = `HTTP ${response.status}`;
        
        if (errorData?.message) {
          errorMessage += `: ${errorData.message}`;
        }
        
        if (response.status === 401 && useOneCallAPI) {
          errorMessage += ' - One Call API 3.0 requires subscription. Try useOneCallAPI=false for basic weather.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicWeather = (data: BasicWeatherData) => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{data.name}</h3>
        <p className="text-3xl font-bold">{Math.round(data.main.temp)}°C</p>
        <p className="text-gray-600 capitalize">{data.weather[0].description}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Humidity</span>
          <p className="font-semibold">{data.main.humidity}%</p>
        </div>
        <div>
          <span className="text-gray-600">Wind Speed</span>
          <p className="font-semibold">{data.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );

  const renderOneCallWeather = (data: WeatherData) => (
    <div className="space-y-4">
      {data.current && (
        <div className="text-center">
          <h3 className="text-lg font-semibold">Current Weather</h3>
          <p className="text-3xl font-bold">{Math.round(data.current.temp)}°C</p>
          <p className="text-gray-600 capitalize">{data.current.weather[0].description}</p>
        </div>
      )}
      
      {data.current && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Humidity</span>
            <p className="font-semibold">{data.current.humidity}%</p>
          </div>
          <div>
            <span className="text-gray-600">Wind Speed</span>
            <p className="font-semibold">{data.current.wind_speed} m/s</p>
          </div>
        </div>
      )}

      {data.hourly && (
        <div>
          <h4 className="font-semibold mb-2">Hourly Forecast (Next 12 hours)</h4>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {data.hourly.slice(0, 12).map((hour, index) => (
              <div key={index} className="flex-shrink-0 text-center text-sm">
                <div className="text-gray-600">
                  {new Date(hour.dt * 1000).getHours()}:00
                </div>
                <div className="font-semibold">{Math.round(hour.temp)}°</div>
                <div className="text-xs text-gray-500 capitalize">
                  {hour.weather[0].description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.daily && (
        <div>
          <h4 className="font-semibold mb-2">Daily Forecast</h4>
          <div className="space-y-2">
            {data.daily.slice(0, 5).map((day, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="font-medium">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 capitalize">{day.weather[0].description}</span>
                  <span className="font-semibold">
                    {Math.round(day.temp.min)}° / {Math.round(day.temp.max)}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.alerts && data.alerts.length > 0 && (
        <div className="bg-red-50 p-3 rounded">
          <h4 className="font-semibold text-red-800 mb-2">Weather Alerts</h4>
          {data.alerts.map((alert, index) => (
            <div key={index} className="text-sm text-red-700">
              <div className="font-medium">{alert.event}</div>
              <div className="text-xs">{alert.sender_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!weatherApiKey) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <h3 className="font-semibold text-gray-800 mb-2">Weather Data</h3>
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">
          {useOneCallAPI ? 'One Call API 3.0' : 'Basic Weather API'}
        </h3>
        <button
          onClick={() => fetchWeatherData()}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading weather data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="text-red-800 font-semibold">Error</div>
          <div className="text-red-700 text-sm">{error}</div>
          {useOneCallAPI && (
            <div className="mt-2 text-xs text-red-600">
              💡 Try setting useOneCallAPI=false for basic weather data
            </div>
          )}
        </div>
      )}

      {weatherData && !loading && !error && (
        <div>
          {useOneCallAPI ? 
            renderOneCallWeather(weatherData as WeatherData) : 
            renderBasicWeather(weatherData as BasicWeatherData)
          }
        </div>
      )}

      <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-800">
        <strong>API:</strong> {useOneCallAPI ? 'One Call API 3.0 (subscription required)' : 'Basic Weather API (free)'}
      </div>
    </div>
  );
};

export default WeatherDataComponent; 