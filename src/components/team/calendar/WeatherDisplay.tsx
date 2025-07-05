import React from 'react';
import { CloudRain, CloudLightning, Sun, CloudSun, Droplet, Droplets } from 'lucide-react';

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
  showTooltip?: boolean;
}

export const getWeatherIcon = (data: RainData) => {
  if (data.hasLightning) {
    return <CloudLightning className="h-4 w-4 text-purple-600 animate-pulse" />;
  }
  if (data.rainfall > 10) {
    return <CloudRain className="h-4 w-4 text-blue-600 animate-pulse" />;
  }
  if (data.rainfall > 5) {
    return <Droplets className="h-4 w-4 text-blue-500 animate-pulse" />;
  }
  if (data.rainfall > 0) {
    return <Droplet className="h-4 w-4 text-blue-400 animate-pulse" />;
  }
  if (data.condition === 'partly-cloudy') {
    return <CloudSun className="h-4 w-4 text-orange-400 animate-pulse" />;
  }
  return <Sun className="h-4 w-4 text-orange-500 animate-pulse" />;
};

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ date, weatherData, showTooltip = true }) => {
  if (!weatherData) return null;
  
  return (
    <div className="flex items-center justify-center w-5 h-5">
      {getWeatherIcon(weatherData)}
    </div>
  );
};
