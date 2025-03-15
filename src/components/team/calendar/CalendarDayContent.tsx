
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
  teamColor: string;
}

export const CalendarDayContent: React.FC<CalendarDayContentProps> = ({
  date,
  weatherData,
  jobsForDate,
  onJobClick,
  onDrop,
  teamColor
}) => {
  return (
    <div 
      className="relative w-full h-full flex items-center justify-center" 
      onDragOver={e => e.preventDefault()} 
      onDrop={e => onDrop(e, date)}
    >
      <span className="absolute top-1">{date.getDate()}</span>
      
      {weatherData && (
        <WeatherDisplay date={date} weatherData={weatherData} />
      )}
      
      {jobsForDate && jobsForDate.length > 0 && (
        <JobsDisplay 
          jobsForDate={jobsForDate} 
          teamColor={teamColor} 
          onJobClick={onJobClick}
        />
      )}
    </div>
  );
};
