import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { TeamCalendar } from '@/components/team/TeamCalendar';
import { CalendarSyncPopover } from '@/components/team/calendar/CalendarSyncPopover';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { useCalendarStore, CalendarSyncService } from '@/services/CalendarSyncService';

interface DashboardCalendarProps {
  miniView?: boolean;
  jobId?: string;
  initialDate?: Date;
  jobs?: Job[];
  onJobAssign?: (jobId: string, date: Date) => Promise<void>;
}

export function DashboardCalendar({ 
  miniView = false, 
  jobId, 
  initialDate = new Date(),
  jobs = [],
  onJobAssign
}: DashboardCalendarProps) {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(initialDate);
  const [activeTab, setActiveTab] = useState('calendar');
  const { events, isLoading, syncWithJobs } = useCalendarStore();
  
  // Sync jobs whenever they change
  useEffect(() => {
    if (jobs.length > 0) {
      syncWithJobs(jobs);
    }
  }, [jobs, syncWithJobs]);
  
  const handleNewEvent = () => {
    if (jobId) {
      navigate(`/jobs/${jobId}/edit`);
    } else {
      navigate('/jobs/new');
    }
  };
  
  const handleNavigateToFullCalendar = () => {
    navigate('/calendar');
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      ) : (
        <TeamCalendar 
          date={date} 
          setDate={setDate} 
          teamColor="blue"
          assignedJobs={jobs}
          miniView={miniView}
          onJobAssign={onJobAssign}
        />
      )}
    </div>
  );
} 