import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarDayContent } from './CalendarDayContent';
import { Job } from '@/types/job';
import { RainData } from './WeatherDisplay';
import { getDayType, getPublicHolidayForDate, isWeekdayDate } from './calendarUtils';
import { publicHolidaysService } from '@/services/PublicHolidaysService';

interface CustomCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  teamColor: string;
  weatherDates: RainData[];
  assignedJobs: Job[];
  onJobClick: (jobId: string, event: React.MouseEvent) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, date: Date) => void;
  onDayClick: (date: Date, jobs: Job[]) => void;
  miniView?: boolean;
}

export function CustomCalendar({
  selected,
  onSelect,
  teamColor,
  weatherDates,
  assignedJobs,
  onJobClick,
  onDrop,
  onDayClick,
  miniView = false
}: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  useEffect(() => {
    // Initialize public holidays service
    publicHolidaysService.setUserCountry();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Separate weekdays and weekends
  const weekdays = monthDays.filter(day => isWeekdayDate(day));
  const weekends = monthDays.filter(day => !isWeekdayDate(day));

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getDayBackground = (date: Date) => {
    const dayType = getDayType(date);
    const isToday = isSameDay(date, new Date());
    const isSelected = selected ? isSameDay(date, selected) : false;

    if (isSelected) {
      return 'bg-blue-600 text-white border-blue-600';
    }

    if (isToday) {
      return 'bg-slate-700 text-white border-slate-700 font-semibold';
    }

    switch (dayType) {
      case 'holiday':
        return 'bg-red-100 border-red-300 text-red-800 font-semibold';
      case 'weekend':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-white border-slate-200 hover:bg-slate-50';
    }
  };

  const getHeaderBackground = (type: 'weekday' | 'weekend') => {
    switch (type) {
      case 'weekend':
        return 'bg-blue-200 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-200 text-slate-700 border-slate-300';
    }
  };

  const renderDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const weatherData = weatherDates.find(wd => wd.date === dateStr);
    const jobsForDate = assignedJobs.filter(job => {
      try {
        // Direct string comparison to avoid timezone issues
        return job.date === dateStr;
      } catch (e) {
        return false;
      }
    });
    const isSelected = selected ? isSameDay(date, selected) : false;
    const holiday = getPublicHolidayForDate(date);

    return (
      <div
        key={date.toISOString()}
        className={cn(
          "relative h-20 border cursor-pointer transition-all duration-200",
          getDayBackground(date),
          !isSameMonth(date, currentMonth) && "opacity-30"
        )}
        onClick={() => {
          onSelect?.(date);
          onDayClick(date, jobsForDate);
        }}
      >
        <CalendarDayContent
          date={date}
          weatherData={weatherData}
          jobsForDate={jobsForDate}
          onJobClick={onJobClick}
          onDrop={onDrop}
          onDayClick={onDayClick}
          teamColor={teamColor}
          isSelected={isSelected}
          miniView={miniView}
        />
        
        {/* Holiday indicator */}
        {holiday && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs px-1 py-0.5 text-center truncate">
            {holiday.name}
          </div>
        )}
      </div>
    );
  };

  const weekdayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weekendHeaders = ['Sat', 'Sun'];

  return (
    <div className="w-full">
      {/* Navigation Header */}
      <div className="flex items-center justify-between p-4 bg-slate-100 border-b">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex">
        {/* Weekdays Section */}
        <div className="flex-1">
          {/* Weekday Headers */}
          <div className="grid grid-cols-5 border-b-2">
            {weekdayHeaders.map(day => (
              <div
                key={day}
                className={cn(
                  "p-3 text-center text-sm font-semibold border-r last:border-r-0",
                  getHeaderBackground('weekday')
                )}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Weekday Grid */}
          <div className="grid grid-cols-5 gap-0">
            {weekdays.map(renderDay)}
          </div>
        </div>

        {/* Weekends Section */}
        <div className="w-40 border-l-2 border-slate-300">
          {/* Weekend Headers */}
          <div className="grid grid-cols-2 border-b-2">
            {weekendHeaders.map(day => (
              <div
                key={day}
                className={cn(
                  "p-3 text-center text-sm font-semibold border-r last:border-r-0",
                  getHeaderBackground('weekend')
                )}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Weekend Grid */}
          <div className="grid grid-cols-2 gap-0">
            {weekends.map(renderDay)}
          </div>
        </div>
      </div>
    </div>
  );
} 