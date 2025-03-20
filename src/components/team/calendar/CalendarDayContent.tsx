
import React from 'react';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { WeatherDisplay, RainData } from './WeatherDisplay';
import { JobsDisplay } from './JobsDisplay';

interface CalendarDayContentProps {
  date: Date;
  weatherData: RainData | undefined;
  jobsForDate: Job[];
  onJobClick: (jobId: string, e: React.MouseEvent) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, date: Date) => void;
  onDayClick: (date: Date, jobs: Job[]) => void;
  teamColor: string;
  isSelected: boolean;
}

export const CalendarDayContent: React.FC<CalendarDayContentProps> = ({
  date,
  weatherData,
  jobsForDate,
  onJobClick,
  onDrop,
  onDayClick,
  teamColor,
  isSelected
}) => {
  // Generate dynamic background color based on team color and selection state
  const getDayBackground = () => {
    if (!isSelected) return 'bg-transparent';
    
    // Map team colors to Tailwind classes
    switch(teamColor) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div 
      onDragOver={e => e.preventDefault()} 
      onDrop={e => onDrop(e, date)} 
      onClick={() => onDayClick(date, jobsForDate)} 
      className={`relative w-full h-full flex items-center justify-center cursor-pointer ${getDayBackground()} rounded-md transition-colors`}
    >
      <span className={`absolute top-1 ${isSelected ? 'text-white' : ''}`}>{date.getDate()}</span>
      
      {weatherData && <WeatherDisplay date={date} weatherData={weatherData} />}
      
      {jobsForDate && jobsForDate.length > 0 && <JobsDisplay jobsForDate={jobsForDate} teamColor={teamColor} onJobClick={onJobClick} />}
    </div>
  );
};
