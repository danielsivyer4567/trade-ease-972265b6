import React from 'react';
import { Job } from '@/types/job';
import { format } from 'date-fns';
import { JobsDisplay } from './JobsDisplay';
import { WeatherDisplay, RainData } from './WeatherDisplay';

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
  const showJobDot = jobsForDate && jobsForDate.length > 0;
  
  const getDayBackground = () => {
    const today = new Date();
    const isToday = format(today, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    
    if (isSelected) {
      return 'bg-blue-600 dark:bg-blue-800 text-white';
    }
    
    if (isToday) {
      return 'bg-blue-100 dark:bg-blue-950 dark:text-blue-200';
    }
    
    if (jobsForDate.length > 0) {
      switch (teamColor) {
        case 'red':
          return 'bg-red-50 dark:bg-red-950/30';
        case 'blue':
          return 'bg-blue-50 dark:bg-blue-950/30';
        case 'green':
          return 'bg-green-50 dark:bg-green-950/30';
        default:
          return 'bg-gray-50 dark:bg-gray-900/50';
      }
    }
    
    return '';
  };
  
  const getTeamColorDot = () => {
    switch (teamColor) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      onDragOver={e => e.preventDefault()} 
      onDrop={e => onDrop(e, date)} 
      onClick={() => onDayClick(date, jobsForDate)} 
      className={`relative w-full h-full flex items-start justify-center cursor-pointer ${getDayBackground()} rounded-md transition-colors`}
    >
      <span className={`absolute top-1 ${isSelected ? 'text-white' : ''} font-medium`}>{date.getDate()}</span>
      
      {!miniView && weatherData && <WeatherDisplay date={date} weatherData={weatherData} />}
      
      {miniView ? (
        showJobDot && (
          <div className={`absolute bottom-1 right-1 w-3 h-3 rounded-full ${getTeamColorDot()}`} 
               title={`${jobsForDate.length} jobs scheduled`} />
        )
      ) : (
        jobsForDate && jobsForDate.length > 0 && 
        <JobsDisplay jobsForDate={jobsForDate} teamColor={teamColor} onJobClick={onJobClick} />
      )}
    </div>
  );
};
