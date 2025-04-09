
import React from 'react';
import { CalendarSyncPopover } from './CalendarSyncPopover';
import { Job } from '@/types/job';

interface TeamCalendarHeaderProps {
  assignedJobs: Job[];
  date: Date | undefined;
}

export const TeamCalendarHeader: React.FC<TeamCalendarHeaderProps> = ({
  assignedJobs,
  date
}) => {
  return (
    <div className="flex justify-between items-center mb-4 px-4">
      <h3 className="text-sm font-medium">Calendar View</h3>
      <CalendarSyncPopover assignedJobs={assignedJobs} date={date} />
    </div>
  );
};
