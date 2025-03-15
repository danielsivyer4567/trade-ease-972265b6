
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Job } from '@/types/job';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { CalendarDayContent } from './calendar/CalendarDayContent';
import { TeamCalendarHeader } from './calendar/TeamCalendarHeader';
import { useWeatherData } from './calendar/useWeatherData';

interface TeamCalendarProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  teamColor: string;
  onJobAssign?: (jobId: string, date: Date) => void;
  assignedJobs?: Job[];
}

export function TeamCalendar({
  date,
  setDate,
  teamColor,
  onJobAssign,
  assignedJobs = []
}: TeamCalendarProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { weatherDates } = useWeatherData();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetDate: Date) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId && onJobAssign) {
      onJobAssign(jobId, targetDate);
      toast({
        title: "Job Rescheduled",
        description: `Job has been rescheduled to ${format(targetDate, 'PPP')}`
      });
    }
  };

  const handleJobClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${jobId}`);
  };

  const modifiers = {
    rainy: (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return weatherDates.some(rd => rd.date === dateStr);
    }
  };

  const modifiersStyles = {
    rainy: {
      position: 'relative' as const
    }
  };

  return (
    <section>
      <div className="p-6 rounded-lg shadow-md bg-slate-300 my-[32px] px-0 py-[31px] mx-px">
        <TeamCalendarHeader 
          assignedJobs={assignedJobs} 
          date={date} 
        />
        
        <Calendar 
          mode="single" 
          selected={date} 
          onSelect={setDate} 
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            DayContent: ({ date }) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const weatherData = weatherDates.find(rd => rd.date === dateStr);
              const jobsForDate = assignedJobs?.filter(job => {
                try {
                  const jobDate = new Date(job.date);
                  return format(jobDate, 'yyyy-MM-dd') === dateStr;
                } catch (e) {
                  console.error('Invalid date in job:', job);
                  return false;
                }
              });

              return (
                <CalendarDayContent 
                  date={date}
                  weatherData={weatherData}
                  jobsForDate={jobsForDate || []}
                  onJobClick={handleJobClick}
                  onDrop={handleDrop}
                  teamColor={teamColor}
                />
              );
            }
          }}
          classNames={{
            months: "w-full",
            month: "w-full",
            table: "w-full border-collapse",
            head_row: "grid grid-cols-7",
            head_cell: "text-muted-foreground text-center text-sm font-medium p-2",
            row: "grid grid-cols-7",
            cell: "h-16 text-center text-sm p-0 relative hover:bg-gray-100 rounded-md cursor-pointer",
            day: `h-16 w-full p-2 font-normal aria-selected:bg-${teamColor}-600 aria-selected:text-white hover:bg-gray-100 rounded-md`,
            day_range_end: "day-range-end",
            day_selected: `bg-${teamColor}-600 text-white hover:bg-${teamColor}-600 hover:text-white focus:bg-${teamColor}-600 focus:text-white`,
            day_today: "bg-blue-100 text-blue-900 hover:bg-blue-200",
            day_outside: "text-gray-400",
            nav: "space-x-1 flex items-center justify-between p-2",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            caption: "flex justify-center py-4 relative items-center text-lg font-semibold"
          }}
          className="w-full bg-slate-200"
        />
      </div>
    </section>
  );
}
