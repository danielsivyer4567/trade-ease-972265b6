import React from 'react';
import { Job } from '@/types/job';
import { format, isSameDay } from 'date-fns';
import { useWeatherData } from './calendar/useWeatherData';
import { useCalendarHandlers } from './calendar/useCalendarHandlers';
import { getJobsForDate } from './calendar/calendarUtils';
import { DayDetailDrawer } from './calendar/DayDetailDrawer';
import { CustomCalendar } from './calendar/CustomCalendar';

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
      <div 
        className="p-6"
        style={{ 
          background: '#e2e8f0', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
          backdropFilter: 'blur(10px)', 
          border: '2px solid #94a3b8' 
        }}
      >
        <CustomCalendar
          selected={date}
          onSelect={setDate}
          teamColor={teamColor}
          weatherDates={weatherDates}
          assignedJobs={assignedJobs}
          onJobClick={handleJobClick}
          onDrop={handleDrop}
          onDayClick={handleDayClick}
          miniView={miniView}
        />
      </div>

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
