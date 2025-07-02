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
      // Selected date uses same style as regular dates, no blue overlay
      return 'bg-blue-50 border-blue-200 shadow-sm';
    }
    
    if (isToday) {
      // Current date uses slate grey
      return 'bg-slate-100 text-slate-900 border-slate-300 shadow-md font-semibold';
    }
    
    if (jobsForDate.length > 0) {
      // Jobs get a slightly different blue shade for emphasis
      return 'bg-blue-100 border-blue-300 shadow-md';
    }
    
    // All dates get blue team color
    return 'bg-blue-50 border-blue-200 shadow-sm';
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
      className={`absolute inset-0 flex flex-col cursor-pointer ${getDayBackground()} transition-colors`}
    >
      <div className="w-full flex items-center justify-between px-1 py-0 border-b border-slate-300 min-h-[18px]">
        <div className="w-5 flex items-center justify-center">
          {!miniView && weatherData && <WeatherDisplay date={date} weatherData={weatherData} />}
        </div>
        <span className={`${isSelected ? 'text-white' : ''} font-medium text-xs`}>{date.getDate()}</span>
        <div className="w-5"></div> {/* Spacer to center the date */}
      </div>
      
      <div className="flex-1 relative bg-white">
        
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
    </div>
  );
};
