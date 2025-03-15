
import React from 'react';
import { CloudRain, CloudLightning, Sun, CloudSun, Droplet, Droplets } from 'lucide-react';
import { format } from 'date-fns';

export interface RainData {
  date: string;
  rainfall: number;
  temperature: number;
  rainChance: number;
  hasLightning: boolean;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'storm';
  amount: number;
}

interface WeatherDisplayProps {
  date: Date;
  weatherData: RainData | undefined;
}

export const getWeatherIcon = (data: RainData) => {
  if (data.hasLightning) {
    return <CloudLightning className="h-4 w-4 text-purple-600" />;
  }
  if (data.rainfall > 10) {
    return <CloudRain className="h-4 w-4 text-blue-600" />;
  }
  if (data.rainfall > 5) {
    return <Droplets className="h-4 w-4 text-blue-500" />;
  }
  if (data.rainfall > 0) {
    return <Droplet className="h-4 w-4 text-blue-400" />;
  }
  if (data.condition === 'partly-cloudy') {
    return <CloudSun className="h-4 w-4 text-orange-400" />;
  }
  return <Sun className="h-4 w-4 text-orange-500" />;
};

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ date, weatherData }) => {
  if (!weatherData) return null;
  
  return (
    <>
      <div className="absolute top-4">
        {getWeatherIcon(weatherData)}
      </div>
      <div className="absolute top-[35px] text-[10px] font-medium">
        {weatherData.temperature}°C
      </div>
      {weatherData.rainfall > 0 && (
        <div className="absolute bottom-1 text-[10px] text-blue-500 font-medium">
          {weatherData.rainfall}mm
        </div>
      )}
    </>
  );
};
