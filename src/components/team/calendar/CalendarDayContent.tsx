import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Job } from '@/types/job';
import { format } from 'date-fns';
import { JobsDisplay } from './JobsDisplay';
import { WeatherDisplay, RainData } from './WeatherDisplay';
import { getDayType, getPublicHolidayForDate } from './calendarUtils';

interface CalendarDayContentProps {
  date: Date;
  weatherData?: RainData;
  jobsForDate: Job[];
  onJobClick: (jobId: string, event: React.MouseEvent) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, date: Date) => void;
  onDayClick: (date: Date, jobs: Job[]) => void;
  teamColor: string;
  isSelected: boolean;
  miniView?: boolean;
}

export const CalendarDayContent: React.FC<CalendarDayContentProps> = ({
  date,
  weatherData,
  jobsForDate,
  onJobClick,
  onDrop,
  onDayClick,
  teamColor,
  isSelected,
  miniView = false
}) => {
  const [showWeatherTooltip, setShowWeatherTooltip] = useState(false);
  const [fadeWeatherTooltip, setFadeWeatherTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dayRef = useRef<HTMLDivElement>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout>();

  const showJobDot = jobsForDate && jobsForDate.length > 0;
  const dayType = getDayType(date);
  const holiday = getPublicHolidayForDate(date);
  
  const getDayBackground = () => {
    const today = new Date();
    const isToday = format(today, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    
    if (isSelected) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    
    if (isToday) {
      return 'bg-white border border-slate-600 font-semibold';
    }

    switch (dayType) {
      case 'holiday':
        return 'bg-red-50 border-red-200';
      case 'weekend':
        return 'bg-blue-50 border-blue-200';
      default:
        if (jobsForDate.length > 0) {
          return 'bg-blue-100 border-blue-300 shadow-md';
        }
        return 'bg-white border-slate-200';
    }
  };
  
  const getTeamColorDot = () => {
    switch (teamColor) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!miniView && weatherData && dayRef.current) {
      // Clear any existing fade timeout
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      
      // Get the cell's bounding rectangle (not the weather icon)
      const cellRect = dayRef.current.getBoundingClientRect();
      
      // Calculate the center of the cell for tooltip positioning
      const cellCenterX = cellRect.left + (cellRect.width / 2);
      
      setTooltipPosition({
        x: cellCenterX,
        y: cellRect.top - 10  // Position above the cell
      });
      
      setShowWeatherTooltip(true);
      setFadeWeatherTooltip(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Keep tooltip positioned over cell center, don't follow mouse
  };

  const handleMouseLeave = () => {
    // Start fade out
    setFadeWeatherTooltip(false);
    
    // Hide tooltip after fade transition completes
    fadeTimeoutRef.current = setTimeout(() => {
      setShowWeatherTooltip(false);
    }, 200); // Match the CSS transition duration
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        ref={dayRef}
        onDragOver={e => e.preventDefault()} 
        onDrop={e => onDrop(e, date)} 
        onClick={() => onDayClick(date, jobsForDate)} 
        className={`absolute inset-0 flex flex-col cursor-pointer ${getDayBackground()} transition-colors`}
      >
        <div className="w-full flex items-center justify-between px-1 py-0 min-h-[18px]">
          <div className="w-5 flex items-center justify-center">
            {!miniView && weatherData && (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <WeatherDisplay date={date} weatherData={weatherData} showTooltip={false} />
              </div>
            )}
          </div>
          <span className={`${isSelected ? 'text-white' : 
            format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') ? 'text-slate-800 font-bold' :
            dayType === 'holiday' ? 'text-red-700 font-bold' : 
            dayType === 'weekend' ? 'text-blue-700' : 'text-slate-800'} font-medium text-xs`}>
            {date.getDate()}
          </span>
          <div className="w-5"></div> {/* Spacer to center the date */}
        </div>
        
        <div className="flex-1 relative bg-white bg-opacity-80">
          {miniView ? (
            showJobDot && (
              <div className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${getTeamColorDot()}`} 
                   title={`${jobsForDate.length} jobs scheduled`} />
            )
          ) : (
            jobsForDate && jobsForDate.length > 0 && 
            <JobsDisplay jobsForDate={jobsForDate} teamColor={teamColor} onJobClick={onJobClick} />
          )}
          
          {/* Holiday indicator - smaller for compact display */}
          {holiday && !miniView && (
            <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-700 text-xs px-1 py-0.5 text-center truncate font-semibold border-b border-red-200">
              {holiday.name}
            </div>
          )}
        </div>
      </div>

      {/* Weather tooltip positioned over the entire date cell */}
      {showWeatherTooltip && weatherData && createPortal(
        <div 
          className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl min-w-[200px] max-w-[250px] pointer-events-none transition-opacity duration-200 ease-in-out"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 99999,
            opacity: fadeWeatherTooltip ? 1 : 0
          }}
        >
          <div className="font-semibold text-center mb-2 border-b border-slate-600 pb-1">
            {format(date, 'EEEE, MMM d')}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Condition:</span>
              <span className="font-medium">{weatherData.condition === 'sunny' ? 'Sunny' : 
                weatherData.condition === 'partly-cloudy' ? 'Partly Cloudy' : 
                weatherData.condition === 'cloudy' ? 'Cloudy' : 
                weatherData.condition === 'rainy' ? 'Rainy' : 
                weatherData.condition === 'storm' ? 'Stormy' : weatherData.condition}</span>
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
                <span className="font-medium">{Math.round(weatherData.rainfall * 100) / 100}mm</span>
              </div>
            )}
            {weatherData.hasLightning && (
              <div className="text-center text-purple-300 font-medium">
                ⚡ Lightning Expected
              </div>
            )}
          </div>
          
          {/* Arrow pointing down to the date cell */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-slate-800"></div>
        </div>,
        document.body
      )}
    </>
  );
};
