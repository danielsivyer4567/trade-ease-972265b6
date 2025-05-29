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
  miniView?: boolean;
}

export function TeamCalendar({
  date,
  setDate,
  teamColor,
  onJobAssign,
  assignedJobs = [],
  miniView = false
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
    <section className={`${miniView ? 'mini-calendar' : ''} relative z-10`}>
      {!miniView && (
        <div className="p-6 rounded-lg shadow-md bg-white dark:bg-slate-800 my-[32px] px-0 py-[31px] mx-px">
          <TeamCalendarHeader 
            assignedJobs={assignedJobs} 
            date={date} 
          />
        </div>
      )}
      
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
                miniView={miniView}
              />
            );
          }
        }}
        classNames={getCalendarClassNames(teamColor)}
        className={`${miniView ? 'w-full bg-white' : 'w-full bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm'}`}
      />

      {!miniView && (
        <DayDetailDrawer 
          selectedDay={selectedDayJobs} 
          onClose={closeDayDetail} 
          onJobClick={handleJobClick}
        />
      )}
    </section>
  );
}
