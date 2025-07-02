
import React, { useState, useRef } from 'react';
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

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ date, weatherData }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; iconCenterX: number }>({ x: 0, y: 0, iconCenterX: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  if (!weatherData) return null;
  
  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'Sunny';
      case 'partly-cloudy': return 'Partly Cloudy';
      case 'cloudy': return 'Cloudy';
      case 'rainy': return 'Rainy';
      case 'storm': return 'Stormy';
      default: return condition;
    }
  };

  const formatDate = (dateObj: Date) => {
    return format(dateObj, 'EEEE, MMM d');
  };

  const handleMouseEnter = () => {
    if (iconRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      
      // Find the parent calendar cell (the one with absolute inset-0)
      const calendarCell = iconRef.current.closest('.absolute.inset-0');
      if (calendarCell) {
        const cellRect = calendarCell.getBoundingClientRect();
        const cellCenterX = cellRect.left + cellRect.width / 2;
        const cellTop = cellRect.top;
        
        setTooltipPosition({
          x: cellCenterX,
          y: cellTop - 12,
          iconCenterX: cellCenterX
        });
      } else {
        // Fallback to icon position if parent not found
        setTooltipPosition({
          x: iconRect.left + iconRect.width / 2,
          y: iconRect.top - 12,
          iconCenterX: iconRect.left + iconRect.width / 2
        });
      }
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  return (
    <>
      <div 
        ref={iconRef}
        className="flex items-center justify-center w-5 h-5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {getWeatherIcon(weatherData)}
      </div>
      
      {/* Fixed positioned tooltip - no interference between calendar cells */}
      {showTooltip && (
        <div 
          className="fixed bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl z-[9999] min-w-[200px] max-w-[250px] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-semibold text-center mb-2 border-b border-slate-600 pb-1">
            {formatDate(date)}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Condition:</span>
              <span className="font-medium">{getConditionText(weatherData.condition)}</span>
            </div>
            <div className="flex justify-between">
              <span>Temperature:</span>
              <span className="font-medium">{weatherData.temperature}°C</span>
            </div>
            <div className="flex justify-between">
              <span>Rain Chance:</span>
              <span className="font-medium">{weatherData.rainChance}%</span>
            </div>
            {weatherData.rainfall > 0 && (
              <div className="flex justify-between">
                <span>Rainfall:</span>
                <span className="font-medium">{weatherData.rainfall}mm</span>
              </div>
            )}
            {weatherData.hasLightning && (
              <div className="text-center text-purple-300 font-medium">
                ⚡ Lightning Expected
              </div>
            )}
          </div>
          
          {/* Arrow pointing down to the weather icon */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-slate-800"></div>
        </div>
      )}
    </>
  );
};
