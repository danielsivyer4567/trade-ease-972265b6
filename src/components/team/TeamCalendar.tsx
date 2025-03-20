
import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDayContent } from './calendar/CalendarDayContent';
import { TeamCalendarHeader } from './calendar/TeamCalendarHeader';
import { useCalendarHandlers } from './calendar/useCalendarHandlers';
import { useWeatherData } from './calendar/useWeatherData';
import { DayDetailDrawer } from './calendar/DayDetailDrawer';
import { CalendarSyncPopover } from './calendar/CalendarSyncPopover';
import { calendarStyles } from './calendar/calendarStyles';
import { Job } from '@/types/job';
import { mockJobsData } from './calendar/calendarUtils';

interface TeamCalendarProps {
  date?: Date;
  setDate?: (date: Date) => void;
  teamColor: string;
}

export const TeamCalendar: React.FC<TeamCalendarProps> = ({ 
  date = new Date(), 
  setDate, 
  teamColor 
}) => {
  // Initialize dates and weather data
  const [currentDate, setCurrentDate] = useState(date);
  const [selectedDay, setSelectedDay] = useState<{date: Date, jobs: Job[]} | null>(null);
  const { weatherData, isWeatherLoading } = useWeatherData();
  
  // Calendar event handlers
  const { 
    handlePrevWeek, 
    handleNextWeek,
    handleToday,
    handleDragOver,
    handleDrop,
    handleJobClick,
    handleDayClick,
  } = useCalendarHandlers({
    currentDate,
    setCurrentDate,
    setSelectedDay, 
    weatherData,
    mockJobsData
  });
  
  // Calculate week range and days for rendering
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Get day header style based on team color
  const dayHeaderStyle = calendarStyles.getDayHeaderStyle(teamColor);
  
  return (
    <section className="bg-white shadow rounded-lg overflow-hidden mx-auto max-w-7xl">
      <TeamCalendarHeader 
        currentDate={currentDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        teamColor={teamColor}
      />
      
      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 border-t border-l">
        {/* Day headers (Mon, Tue, etc.) */}
        {days.map((day, i) => (
          <div 
            key={`header-${i}`} 
            className={`p-2 text-center border-r border-b ${dayHeaderStyle}`}
          >
            {format(day, 'EEE')}
          </div>
        ))}
        
        {/* Calendar day cells */}
        {days.map((day, i) => {
          const jobsForDate = mockJobsData.filter(
            job => job.date === format(day, 'yyyy-MM-dd')
          );
          
          const weatherForDate = weatherData?.find(
            data => format(new Date(data.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );
          
          return (
            <div key={`day-${i}`} className="border-r border-b h-32">
              <CalendarDayContent 
                date={day}
                weatherData={weatherForDate}
                jobsForDate={jobsForDate}
                onJobClick={handleJobClick}
                onDrop={handleDrop}
                onDayClick={handleDayClick}
                teamColor={teamColor}
              />
            </div>
          );
        })}
      </div>
      
      {/* Day detail drawer (shows when a day is clicked) */}
      <DayDetailDrawer 
        selectedDay={selectedDay} 
        onClose={() => setSelectedDay(null)}
        onJobClick={handleJobClick}
        teamColor={teamColor}
      />
      
      {/* Calendar sync popover */}
      <div className="absolute top-4 right-4">
        <CalendarSyncPopover />
      </div>
    </section>
  );
};
