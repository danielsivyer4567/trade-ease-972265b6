
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Job } from '@/types/job';
import { format, isSameDay } from 'date-fns';
import { TeamCalendarHeader } from './calendar/TeamCalendarHeader';
import { CalendarDayContent } from './calendar/CalendarDayContent';
import { useWeatherData } from './calendar/useWeatherData';
import { useCalendarHandlers } from './calendar/useCalendarHandlers';
import { getCalendarClassNames, getCalendarModifiers, getCalendarModifiersStyles } from './calendar/calendarStyles';
import { getJobsForDate } from './calendar/calendarUtils';
import { DayDetailDrawer } from './calendar/DayDetailDrawer';

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
  const { weatherDates } = useWeatherData();
  const { 
    handleDrop, 
    handleJobClick, 
    handleDayClick, 
    selectedDayJobs, 
    closeDayDetail 
  } = useCalendarHandlers(onJobAssign);

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
          modifiers={getCalendarModifiers(weatherDates)}
          modifiersStyles={getCalendarModifiersStyles()}
          components={{
            DayContent: ({ date: dayDate }) => {
              const dateStr = format(dayDate, 'yyyy-MM-dd');
              const weatherData = weatherDates.find(rd => rd.date === dateStr);
              const jobsForDate = getJobsForDate(dayDate, assignedJobs);
              const isSelected = date ? isSameDay(dayDate, date) : false;

              return (
                <CalendarDayContent 
                  date={dayDate}
                  weatherData={weatherData}
                  jobsForDate={jobsForDate}
                  onJobClick={handleJobClick}
                  onDrop={handleDrop}
                  onDayClick={handleDayClick}
                  teamColor={teamColor}
                  isSelected={isSelected}
                />
              );
            }
          }}
          classNames={getCalendarClassNames(teamColor)}
          className="w-full bg-slate-200"
        />
      </div>

      <DayDetailDrawer 
        selectedDay={selectedDayJobs} 
        onClose={closeDayDetail} 
        onJobClick={handleJobClick}
      />
    </section>
  );
}
