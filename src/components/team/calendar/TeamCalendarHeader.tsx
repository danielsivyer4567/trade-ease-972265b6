
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { CalendarSyncPopover } from './CalendarSyncPopover';
import { Job } from '@/types/job';

interface TeamCalendarHeaderProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  teamColor: string;
  assignedJobs?: Job[];
  date?: Date;
}

export const TeamCalendarHeader: React.FC<TeamCalendarHeaderProps> = ({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onToday,
  teamColor,
  assignedJobs = [],
  date
}) => {
  // Get header color based on team color
  const getHeaderColorClass = () => {
    if (teamColor === 'red') {
      return 'bg-red-100 text-red-800';
    } else if (teamColor === 'blue') {
      return 'bg-blue-100 text-blue-800';
    } else if (teamColor === 'green') {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className={`flex justify-between items-center p-4 ${getHeaderColorClass()}`}>
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onPrevWeek} 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          onClick={onToday} 
          variant="outline"
          className="h-8 text-sm"
        >
          Today
        </Button>
        <Button 
          onClick={onNextWeek} 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center">
        <CalendarDays className="h-5 w-5 mr-2" />
        <span className="font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </span>
      </div>
      
      <div>
        <CalendarSyncPopover assignedJobs={assignedJobs} date={date} />
      </div>
    </div>
  );
};
